Review.add({
  id: "l08", group: "lecture", n: 8,
  short: "L8 锁实现与信号量",
  title: "Lecture 8 · 锁的四种实现机制、信号量与有界缓冲区",
  meta: "10 月 8 日 · Synchronization 2",
  sources: [{ label: "lec08 课件", href: "materials/lectures/lec08-concurrency2.pdf" }],
  html: String.raw`
<p class="lede">本讲研究两个核心问题：第一，如何利用硬件原语实现互斥锁——依次分析单核关中断锁、硬件原子读-改-写指令（<code>test&amp;set</code>、<code>swap</code>、<code>compare&amp;swap</code>）、自旋锁、<code>guard</code> 保护的睡眠队列锁以及 Linux <code>futex</code>；第二，引入 Dijkstra 信号量（<code>P</code>/<code>V</code> 原语），区分二元互斥与条件同步两种用法，并给出有界缓冲区（生产者-消费者）的信号量解法与死锁分析。</p>

<h2>1. 锁实现机制一：单处理器内核关中断（Disabling Interrupts）</h2>
<p>在单处理器系统上，只有两类事件会触发调度器切换线程：当前线程主动让出 CPU（内部事件，如 <code>yield</code>、<code>sleep</code>）和外部硬件中断（如定时器中断）。因此在不主动让出 CPU 的前提下，关闭中断即可阻止上下文切换。</p>
<ul>
<li><b>天真实现（在 <code>Acquire</code> 时关中断、整个临界区保持关中断、在 <code>Release</code> 时开中断）的缺陷</b>：(1) 不可授予用户态程序（否则用户死循环将永久独占 CPU）；(2) 若临界区较长，会长时间屏蔽定时器与 I/O 中断，破坏系统实时性与设备响应。</li>
<li><b>改进实现：仅在检查和修改锁状态变量 <code>value</code> 及操作等待队列的极短内核临界区内关中断</b>：</li>
</ul>
<pre>int value = FREE;
Acquire() {                                  Release() {
    disable interrupts;                          disable interrupts;
    if (value == BUSY) {                         if (anyone on wait queue) {
        put thread on wait queue;                    take a thread off wait queue;
        go to sleep();                               place it on ready queue;
        // 从 sleep 被唤醒返回时，中断仍处于关闭状态  } else {
    } else {                                         value = FREE;
        value = BUSY;                            }
    }                                            enable interrupts;
    enable interrupts;                       }
}</pre>
<div class="callout must"><strong>为什么睡眠线程不能在调用 <code>sleep()</code> 之前重新开中断</strong><ul>
<li>若在<b>加入等待队列之前</b>开中断：此时若持锁线程恰好执行 <code>Release()</code>，会看到等待队列为空而仅将 <code>value</code> 置为 <code>FREE</code>；随后当前线程才加入等待队列并睡眠，导致<b>永久丢失唤醒（Lost Wakeup）</b>。</li>
<li>若在<b>加入等待队列之后、<code>sleep()</code> 之前</b>开中断：此时若持锁线程执行 <code>Release()</code>，会将当前线程从等待队列移入就绪队列；随后当前线程继续执行 <code>sleep()</code> 把自己挂起，同样导致唤醒信号丢失且锁状态永远停留在 <code>BUSY</code>。</li>
<li><b>正确规则</b>：线程必须<b>在保持关中断的状态下调用 <code>sleep()</code> 进入调度器</b>，由上下文切换后的<b>下一个运行线程</b>在从调度器返回时负责重新开中断（若无其他就绪用户线程，则切换到内核永不阻塞的 <code>idle</code> 线程开中断）。</li>
</ul></div>
<p><b>关中断方法的根本局限</b>：(1) 只能用于内核态，不能直接供用户态调用；(2) <b>在多处理器（Multiprocessor）系统上完全失效</b>——关闭当前 CPU 核心的中断无法阻止其他 CPU 核心上的线程同时读写同一块共享内存。</p>

<h2>2. 锁实现机制二：硬件原子读-改-写（Read-Modify-Write）指令</h2>
<p>为支持多处理器与用户态同步，现代指令集提供在单次不可分割的总线/缓存事务中“读取内存旧值并写入新值”的原子指令：</p>
<pre>// 1. test&amp;set（测试并置 1）：原子地返回旧值并将内存位置设为 1
int test_and_set(int *address) {
    int result = M[address];
    M[address] = 1;
    return result;
}
// 2. swap（原子交换内存与寄存器）
void swap(int *address, int *reg) {
    int temp = M[address]; M[address] = *reg; *reg = temp;
}
// 3. compare&amp;swap（CAS，比较并交换）：仅当内存值等于预期旧值 reg1 时才写入新值 reg2
bool compare_and_swap(int *address, int reg1, int reg2) {
    if (M[address] == reg1) { M[address] = reg2; return true; }
    return false;
}</pre>
<p><b>基于 <code>compare&amp;swap</code> 的无锁（Lock-Free）链表头插入</b>：先读取当前表头 <code>r1 = M[root]</code> 并令新结点的后继指向 <code>r1</code>，再用 <code>compare_and_swap(&amp;root, r1, object)</code> 尝试更新表头；若期间表头被其他线程修改则 CAS 返回失败，循环重试直至成功。</p>

<h3>2.1 基于 <code>test&amp;set</code> 的自旋锁（Spinlock）</h3>
<pre>int mylock = 0;                                  // 0 表示 FREE，1 表示 BUSY
void acquire(int *thelock) { while (test_and_set(thelock) == 1) ; }
void release(int *thelock) { *thelock = 0; }</pre>
<ul>
<li><b>优点</b>：无需陷入内核、不屏蔽中断、直接适用于多处理器。</li>
<li><b>三项严重缺点</b>：(1) <b>忙等待（Busy-Waiting）浪费 CPU 周期</b>；(2) 在单核或被抢占环境下，等待锁的线程在时间片内空转，反而推迟了持锁线程的运行；(3) <b>多核缓存一致性流量风暴</b>：由于每次 <code>test_and_set</code> 都包含一次内存写操作（<code>M[address] = 1</code>），即使锁仍处于占用状态，多核上的多个等待线程也会反复使彼此的 L1/L2 缓存行失效，大量消耗片上互连与内存总线带宽。</li>
</ul>

<h3>2.2 <code>guard</code> 自旋变量 + 睡眠等待队列锁</h3>
<p>将 <code>test&amp;set</code> 的作用范围严格限制在保护锁的内部状态与等待队列操作上，而让等待锁的线程进入睡眠队列阻塞：</p>
<pre>int guard = 0;
int mylock = FREE;
void acquire(int *thelock) {                     void release(int *thelock) {
    while (test_and_set(&amp;guard)) ;                   while (test_and_set(&amp;guard)) ;
    if (*thelock == BUSY) {                          if (anyone on wait queue) {
        put thread on wait queue;                        take thread off wait queue;
        go to sleep() &amp; set guard = 0;                   place on ready queue;
    } else {                                         } else {
        *thelock = BUSY;                                 *thelock = FREE;
    }                                                }
    guard = 0;                                       guard = 0;
}                                                }</pre>
<p>此处 <code>guard</code> 仅包裹常数条指令，自旋时间极短；而当 <code>*thelock == BUSY</code> 时线程进入睡眠，不消耗 CPU。与关中断锁同理，入队睡眠与清零 <code>guard</code> 必须在调度切换中原子配合完成。</p>

<h3>2.3 Linux <code>futex</code>（Fast Userspace Mutex）</h3>
<pre>int futex(int *uaddr, int futex_op, int val, const struct timespec *timeout);

void acquire(int *thelock) {
    while (test_and_set(thelock) == 1)
        futex(thelock, FUTEX_WAIT, 1, NULL);     // 仅当内核原子验证 *thelock == 1 时才入睡
}
void release(int *thelock) {
    *thelock = 0;
    futex(thelock, FUTEX_WAKE, 1, NULL);         // 唤醒至多 1 个等待在 thelock 上的线程
}</pre>
<ul>
<li><b>设计原理</b>：无锁竞争时，<code>test_and_set</code> 直接返回 <code>0</code>，加锁完全在用户态通过一条原子指令完成，<b>零系统调用开销</b>；仅当发生锁竞争（返回 <code>1</code>）时才调用 <code>futex(..., FUTEX_WAIT, 1)</code> 陷入内核睡眠。内核在将线程挂入等待队列前会<b>原子地检查 <code>*uaddr == val</code>（即锁是否仍为 <code>1</code>）</b>：若在陷入内核期间持锁者已执行 <code>*thelock = 0</code>，检查不通过，<code>futex</code> 立即返回用户态重试，从而<b>彻底消除了“检查与睡眠之间释放锁”导致的丢失唤醒问题</b>。</li>
</ul>

<h2>3. 信号量（Semaphores）与有界缓冲区</h2>
<h3>3.1 信号量的形式定义与两类用途</h3>
<div class="callout must"><strong>定义：Dijkstra 信号量</strong><p>信号量 \(s\) 是一个<b>非负整数变量</b>，除初始化外仅允许通过两个原子操作访问：</p>
<ul>
<li><b><code>P(s)</code>（或 <code>semaP</code> / <code>down</code> / <code>wait</code>）</b>：等待直至 \(s &gt; 0\)，随后原子地将 \(s\) 减 1（若 \(s == 0\) 则阻塞调用线程）。</li>
<li><b><code>V(s)</code>（或 <code>semaV</code> / <code>up</code> / <code>post</code>）</b>：原子地将 \(s\) 加 1，若有线程阻塞在该信号量上则唤醒其中一个。</li>
</ul></div>
<ul>
<li><b>用途 1：二元互斥锁（Binary Semaphore / Mutex）</b>。初始化 **<code>s = 1</code>**，进入临界区前调用 <code>P(s)</code>，离开时调用 <code>V(s)</code>。</li>
<li><b>用途 2：线程间事件顺序约束（Scheduling Constraint）</b>。初始化 **<code>s = 0</code>**，等待事件发生的线程调用 <code>P(s)</code>，产生事件的线程在完成后调用 <code>V(s)</code>（例如实现 <code>ThreadJoin</code>：主线程执行 <code>P(s)</code>，子线程结束时执行 <code>V(s)</code>；即使子线程在主线程调用 <code>P</code> 之前就已经结束并执行了 <code>V</code>，信号量值变为 <code>1</code>，主线程随后的 <code>P</code> 也能立即通过而不会丢失信号）。</li>
</ul>

<h3>3.2 有界缓冲区（Bounded Buffer / 生产者-消费者问题）</h3>
<p>容量为 \(N=\text{buf\_size}\) 的环形队列由生产者放入数据、消费者取出数据，需同时满足三条约束：(1) 缓冲区满时生产者等待；(2) 缓冲区空时消费者等待；(3) 对队列指针的修改互斥。为此设置三个信号量：</p>
<pre>Semaphore full_slots  = 0;          // 当前已存放的元素个数（初值 0）
Semaphore empty_slots = buf_size;   // 当前剩余的空槽个数（初值 N）
Semaphore mutex       = 1;          // 保护环形队列读写指针的互斥信号量（初值 1）

void Producer(item) {               Item Consumer() {
    semaP(&amp;empty_slots);                semaP(&amp;full_slots);
    semaP(&amp;mutex);                      semaP(&amp;mutex);
    enqueue(item);                      item = dequeue();
    semaV(&amp;mutex);                      semaV(&amp;mutex);
    semaV(&amp;full_slots);                 semaV(&amp;empty_slots);
}                                       return item;
                                    }</pre>
<div class="callout trap"><strong>为什么必须先 <code>P</code> 资源计数信号量、后 <code>P(mutex)</code></strong><p>若将生产者中的两行 <code>P</code> 颠倒为<b>先 <code>semaP(&amp;mutex)</code>、再 <code>semaP(&amp;empty_slots)</code></b>：当缓冲区已满（<code>empty_slots == 0</code>）时，生产者先获得 <code>mutex</code> 锁，随后阻塞在 <code>semaP(&amp;empty_slots)</code> 上；此时消费者若要取走元素以腾出空槽，必须在 <code>Consumer()</code> 中先获取 <code>mutex</code>，但 <code>mutex</code> 被睡眠中的生产者持有，双方互相等待，发生<b>死锁（Deadlock）</b>。反之，两个 <code>semaV</code> 操作不会阻塞，其先后顺序不影响程序正确性。</p></div>

<h2>考前清单</h2>
<ul>
<li>线程五种生命周期状态（New、Running、Waiting/Blocked、Ready、Terminated）。</li>
<li>关中断锁为何只能在操作锁变量时短暂关中断、为何睡眠时必须带着关中断进入调度器并由下一线程开中断、为何不适用于用户态与多核。</li>
<li><code>test&amp;set</code>、<code>swap</code>、<code>compare&amp;swap</code> 的精确定义；<code>test&amp;set</code> 自旋锁的三项缺点；<code>guard</code> + 睡眠队列锁与 Linux <code>futex</code>（<code>FUTEX_WAIT</code> 原子检查 <code>*uaddr == val</code>）的原理。</li>
<li>信号量的定义（非负整数、<code>P</code>/<code>V</code> 原子语义）、互斥（初值 1）与同步约束（初值 0）两种初值、有界缓冲区三信号量代码及颠倒 <code>P</code> 顺序导致死锁的推导。</li>
</ul>
`,
  questions: [
    { id: "q1", tag: "slide", kind: "multi", q: String.raw`若采用“在 &lt;code&gt;Acquire()&lt;/code&gt; 时关闭中断、在整个临界区执行期间保持中断关闭、在 &lt;code&gt;Release()&lt;/code&gt; 时重新开启中断”的方式实现锁，会导致哪些问题？`, choices: [["a", "若用户线程在临界区内进入死循环，操作系统将永久失去对 CPU 的控制"], ["b", "临界区执行期间无法响应定时器与 I/O 硬件中断"], ["c", "在多核/多处理器系统上无法保证互斥"], ["d", "会导致单核寄存器数量减半"]], answer: ["a", "b", "c"], why: String.raw`关中断既不能授予用户态，也会阻塞外设中断，且在多核上无法阻止其他核心并发访问共享内存。` },
    { id: "q2", tag: "slide", kind: "single", q: String.raw`在带睡眠队列的关中断锁实现中，若线程在发现 &lt;code&gt;value == BUSY&lt;/code&gt; 后，在“将自己加入等待队列之前”就提前执行了 &lt;code&gt;enable interrupts&lt;/code&gt;，可能发生什么错误？`, choices: [["a", "两个线程同时进入临界区"], ["b", "持锁线程恰在此刻释放锁并看到等待队列为空，随后当前线程才入队睡眠，导致永久无人唤醒"], ["c", "不会发生任何错误"]], answer: ["b"], why: String.raw`在检查完 <code>value == BUSY</code> 与入队睡眠之间开启中断，会使期间到达的 <code>Release()</code> 错过该等待线程，造成唤醒丢失。` },
    { id: "q3", tag: "slide", kind: "single", q: String.raw`当线程在 &lt;code&gt;Acquire()&lt;/code&gt; 中保持中断关闭并调用 &lt;code&gt;sleep()&lt;/code&gt; 切换出 CPU 后，处理器中断应当由谁重新开启？`, choices: [["a", "已进入睡眠状态的原线程自身"], ["b", "调度器上下文切换后开始运行的下一个线程"], ["c", "磁盘控制器硬件自动开启"]], answer: ["b"], why: String.raw`睡眠线程已停止执行指令，必须由调度器切换到的下一个就绪线程（或 <code>idle</code> 线程）恢复中断；原线程被唤醒返回 <code>Acquire()</code> 末尾时再执行其对应的 <code>enable</code>。` },
    { id: "q4", tag: "slide", kind: "single", q: String.raw`硬件原子指令 &lt;code&gt;test&amp;set(&amp;addr)&lt;/code&gt; 的准确语义是`, choices: [["a", "原子地读取并返回 <code>M[addr]</code> 的旧值，同时将 <code>M[addr]</code> 写入为 <code>1</code>"], ["b", "仅当 <code>M[addr] == 0</code> 时写入 <code>1</code> 并返回新值"], ["c", "将 <code>M[addr]</code> 的值原子地加 1"]], answer: ["a"], why: String.raw`<code>test&amp;set</code> 无条件将目标内存置为 1 并返回写入前的旧值。` },
    { id: "q5", tag: "slide", kind: "multi", q: String.raw`关于 &lt;code&gt;while (test&amp;set(&amp;lock));&lt;/code&gt; 自旋锁，下列哪些叙述正确？`, choices: [["a", "等待期间处理器仍可正常响应外部硬件中断"], ["b", "可在用户态直接执行而无需每次陷入内核"], ["c", "在多处理器系统上能正确保证互斥"], ["d", "等待锁的线程在阻塞期间不消耗任何 CPU 周期与内存总线带宽"]], answer: ["a", "b", "c"], why: String.raw`自旋锁在等待期间持续空转消耗 CPU，且每次 <code>test&amp;set</code> 都会在多核间触发缓存行写失效流量。` },
    { id: "q6", tag: "slide", kind: "tf", q: String.raw`在多核处理器上，多个线程对同一把已被占用的锁执行 &lt;code&gt;while (test&amp;set(&amp;lock));&lt;/code&gt; 会导致该内存地址所在的缓存行在各核心缓存之间反复失效传递。`, answer: ["t"], why: String.raw`<code>test&amp;set</code> 每次执行都包含写操作 <code>M[addr] = 1</code>，缓存一致性协议要求写操作获取缓存行的独占权，从而引起跨核缓存行频繁失效。` },
    { id: "q7", tag: "slide", kind: "single", q: String.raw`系统调用 &lt;code&gt;futex(uaddr, FUTEX_WAIT, val, NULL)&lt;/code&gt; 的关键安全性保证是`, choices: [["a", "无条件挂起当前线程"], ["b", "在内核中原子地检查 <code>*uaddr == val</code>，仅当相等时才将当前线程挂入睡眠队列"], ["c", "将 <code>*uaddr</code> 的值修改为 <code>val</code>"]], answer: ["b"], why: String.raw`通过内核态原子验证 <code>*uaddr == val</code>，确保若持锁线程已在用户态与内核态交界处释放了锁，等待线程不会错误入睡。` },
    { id: "q8", tag: "slide", kind: "multi", q: String.raw`关于 Dijkstra 信号量（Semaphore），下列哪些叙述正确？`, choices: [["a", "信号量的值始终为非负整数"], ["b", "除初始化外，应用程序可以随时直接读取信号量的当前整数值做分支判断"], ["c", "<code>P()</code> 操作等待信号量值为正数并原子地将其减 1"], ["d", "<code>V()</code> 操作将信号量值原子地加 1，并在有等待线程时唤醒其中一个"]], answer: ["a", "c", "d"], why: String.raw`信号量封装了内部整数，除初始化外仅允许调用 <code>P()</code> 和 <code>V()</code>。` },
    { id: "q9", tag: "slide", kind: "single", q: String.raw`使用信号量实现 &lt;code&gt;ThreadJoin&lt;/code&gt;（线程 A 等待线程 B 执行结束）时，信号量的初始值应设为`, choices: [["a", "<code>0</code>"], ["b", "<code>1</code>"], ["c", "<code>2</code>"]], answer: ["a"], why: String.raw`用于事件顺序约束（Scheduling Constraint）的信号量初值设为 <code>0</code>：等待方调用 <code>P()</code>，完成方调用 <code>V()</code>。` },
    { id: "q10", tag: "slide", kind: "single", q: String.raw`在容量为 &lt;code&gt;N&lt;/code&gt; 的有界缓冲区信号量解法中，&lt;code&gt;full_slots&lt;/code&gt;、&lt;code&gt;empty_slots&lt;/code&gt;、&lt;code&gt;mutex&lt;/code&gt; 三个信号量的初始值依次为`, choices: [["a", "<code>0</code>、<code>N</code>、<code>1</code>"], ["b", "<code>N</code>、<code>0</code>、<code>1</code>"], ["c", "<code>0</code>、<code>0</code>、<code>1</code>"], ["d", "<code>1</code>、<code>1</code>、<code>0</code>"]], answer: ["a"], why: String.raw`初始时已占用槽数为 <code>0</code>、空闲槽数为 <code>N</code>、互斥信号量为 <code>1</code>。` },
    { id: "q11", tag: "slide", kind: "single", q: String.raw`在有界缓冲区的生产者代码中，若将 &lt;code&gt;P(empty_slots)&lt;/code&gt; 与 &lt;code&gt;P(mutex)&lt;/code&gt; 的顺序颠倒（即先 &lt;code&gt;P(mutex)&lt;/code&gt; 再 &lt;code&gt;P(empty_slots)&lt;/code&gt;），当缓冲区已满时会发生`, choices: [["a", "程序正常工作"], ["b", "死锁：生产者持有 <code>mutex</code> 阻塞在 <code>empty_slots</code> 上，消费者因无法获取 <code>mutex</code> 而无法取走元素"], ["c", "缓冲区自动扩容"]], answer: ["b"], why: String.raw`持互斥锁进入阻塞等待会阻止另一方进入临界区改变条件，直接引发死锁。` },
    { id: "q12", tag: "slide", kind: "single", q: String.raw`若仅用一把互斥锁实现有界缓冲区：&lt;code&gt;acquire(&amp;lock); while (buffer_is_full) {} enqueue(item); release(&amp;lock);&lt;/code&gt;，当缓冲区满时生产者进入该代码会发生`, choices: [["a", "生产者持锁死循环，消费者永远无法拿到锁取走元素"], ["b", "消费者自动抢占锁"], ["c", "正常工作"]], answer: ["a"], why: String.raw`生产者未释放 <code>lock</code> 就在临界区内空转，导致消费者无法获取 <code>lock</code> 消费数据，缓冲区永远保持满状态。` }
  ],
  cards: [
    [String.raw`线程的五种状态`, String.raw`New（新建）、Running（运行）、Waiting/Blocked（阻塞等待）、Ready（就绪）、Terminated（终止）。`],
    [String.raw`关中断锁的正确关中断范围`, String.raw`仅在检查/修改锁变量 <code>value</code> 与操作等待队列的内核短临界区内关中断；睡眠时交由下一线程重开中断。`],
    [String.raw`关中断锁的两项根本局限`, String.raw`(1) 不能交给用户态程序；(2) 在多处理器系统上无效。`],
    [String.raw`<code>compare&amp;swap(&amp;addr, r1, r2)</code> 的语义`, String.raw`若 <code>M[addr] == r1</code>，则原子地将 <code>M[addr]</code> 设为 <code>r2</code> 并返回成功；否则不修改并返回失败。`],
    [String.raw`<code>test&amp;set</code> 自旋锁的三项缺点`, String.raw`忙等待消耗 CPU、单核上抢占持锁线程时间片、多核上引发缓存行写失效风暴。`],
    [String.raw`Linux <code>futex</code> 的 <code>FUTEX_WAIT</code> 机制`, String.raw`在内核中原子检验 <code>*uaddr == val</code>，仅当相等时才将线程挂入等待队列，防止丢失唤醒。`],
    [String.raw`信号量 <code>P()</code> 与 <code>V()</code> 的定义`, String.raw`非负整数变量；<code>P()</code> 等待 <code>&gt;0</code> 并减 1，<code>V()</code> 加 1 并唤醒一个等待线程。`],
    [String.raw`信号量的两种初值约定`, String.raw`二元互斥锁初值设为 <code>1</code>；线程间事件顺序约束初值设为 <code>0</code>。`],
    [String.raw`有界缓冲区信号量解法的加锁顺序规则`, String.raw`必须先 <code>P</code> 资源计数信号量（<code>empty_slots</code> 或 <code>full_slots</code>），再 <code>P(mutex)</code>；颠倒将导致死锁。`]
  ]
});
