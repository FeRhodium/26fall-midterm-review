Review.add({
  id: "l07", group: "lecture", n: 7,
  short: "L7 并发与原子操作",
  title: "Lecture 7 · 线程内核实现、竞争条件、原子操作与软件互斥",
  meta: "9 月 29 日 · Synchronization 1",
  sources: [{ label: "lec07 课件", href: "materials/lectures/lec07-concurrency1.pdf" }],
  html: String.raw`
<p class="lede">本讲开启同步模块：第一，给出线程在内核中的实现方式（Linux <code>task_struct</code> 与 <code>clone()</code> 标志、<code>pthread_create</code> 的系统调用流程）；第二，剖析 <code>counter++</code> 与银行转账中的非原子指令交错与更新丢失；第三，定义原子操作，并以经典的“Too Much Milk”问题（方案 1–4）及 Peterson 算法推导仅依赖原子 load/store 实现互斥所需的条件与局限性。</p>

<h2>1. 线程的内核表示与 Linux <code>clone()</code></h2>
<ul>
<li><b>PCB 与 TCB 的关系</b>：进程控制块（PCB）维护地址空间（代码、数据、堆）与打开的文件描述符表；同一进程内的每个线程拥有各自的线程控制块（TCB），保存该线程私有的寄存器上下文、栈指针与调度状态。</li>
<li><b>Linux 的统一调度实体 <code>task_struct</code></b>：Linux 内核不单独区分进程和线程的数据结构，调度器统一调度 <code>task_struct</code>。创建进程与创建线程底层均调用 <code>clone()</code> 系统调用，仅通过标志位控制是否在父子实体间共享资源：
<pre>// 共享虚拟内存、文件系统上下文、打开文件表、信号处理表 -> 创建同一进程内的新线程
clone(CLONE_VM | CLONE_FS | CLONE_FILES | CLONE_SIGHAND, 0);
// 不传上述共享标志 -> 复制上述结构，等价于 fork() 创建新进程</pre></li>
<li><b><code>pthread_create</code> 的陷入与返回流程</b>：用户调用 <code>pthread_create</code> \(\to\) <code>libc</code> 将系统调用号放入 <code>%eax</code>、参数放入通用寄存器并执行陷入指令 \(\to\) CPU 切换至内核态与内核栈，经中断向量表（如 <code>0x80</code>）跳入 <code>syscall_handler</code> \(\to\) 内核分派至 <code>do_fork()</code> 分配并初始化新 TCB、将其置为 <code>READY</code> 状态 \(\to\) 恢复用户态寄存器并返回调用者。</li>
<li><b>多线程传递栈上局部变量地址的典型错误</b>：若主线程在 <code>while</code> 循环中声明局部变量 <code>int conn_fd = accept(...);</code> 并将 <code>&amp;conn_fd</code> 传给 <code>pthread_create</code>，则当下一轮循环覆盖 <code>conn_fd</code> 时，尚未读取参数的新线程将读到被覆盖后的错误描述符。正确做法是为每个线程在堆上独立分配参数内存或直接按值传递描述符。</li>
</ul>

<h2>2. 竞争条件与更新丢失的机器级原因</h2>
<p>两个线程并发执行 <code>for (i = 0; i &lt; 1000; i++) counter += 1;</code>（初值 <code>counter = 0</code>）时，最终结果往往小于 <code>2000</code>。原因是高级语言的一条 <code>counter += 1</code> 语句在机器指令层面由三条独立指令构成：</p>
<pre>load  r1, M[counter]      // 1. 将内存值读入当前线程私有的寄存器 r1
add   r1, r1, 1           // 2. 寄存器加 1
store r1, M[counter]      // 3. 将寄存器值写回内存</pre>
<p>若线程 1 执行完 <code>load</code>（读到旧值 \(v\)）后发生上下文切换，线程 2 执行完 <code>load</code>（同样读到 \(v\)）、<code>add</code>、<code>store</code>（写入 \(v+1\)），随后线程 1 恢复执行并写入 <code>r1 + 1</code>（仍是 \(v+1\)），则两次自增只使内存值增加了 1（更新丢失）。</p>
<p>同理，在银行服务器 <code>deposit(acct_id, amount)</code> 中，若“读取账户余额 \(\to\) 加上存款额 \(\to\) 写回账户余额”未加互斥保护，两个并发存款线程的交错执行会导致其中一笔存款被覆盖丢失。必须将该指令序列识别为临界区，用同一把锁的 <code>acquire(&amp;mylock)</code> 与 <code>release(&amp;mylock)</code> 包裹。</p>

<h2>3. 原子操作（Atomic Operations）</h2>
<div class="callout must"><strong>定义：原子操作</strong><p>原子操作是<b>在执行过程中不可被中断、且中间状态对其他线程不可见也不可被修改</b>的操作——在外部观察下，它要么尚未开始，要么已经完整执行完毕。</p></div>
<ul>
<li>在绝大多数现代体系结构上，<b>对齐的机器字（word）的 <code>load</code> 和 <code>store</code> 指令是原子的</b>。</li>
<li>非单字操作（如双精度浮点数读写、跨缓存行非对齐访问、CISC 架构下的整块数组拷贝指令）通常不是原子的。</li>
</ul>

<h2>4. 纯软件互斥推导：Too Much Milk 问题</h2>
<p><b>问题形式化</b>：两个线程共享变量 <code>milk</code>（初值 0）以及若干布尔标志变量（仅支持原子的 <code>load</code> 与 <code>store</code>）。要求设计协议满足两条性质：</p>
<ul>
<li><b>安全性（Safety / Mutual Exclusion）</b>：任意时刻至多只有一个线程执行 <code>buy milk</code>（避免重复操作）。</li>
<li><b>活性（Liveness / Progress）</b>：当 <code>milk == 0</code> 时，最终必定有某个线程执行 <code>buy milk</code>（避免无人操作）。</li>
</ul>

<h3>4.1 三个错误方案的失效原因分析</h3>
<ul>
<li><b>方案 1（先检查 <code>milk == 0</code> 且 <code>note == 0</code>，再置 <code>note = 1</code> 并购买）</b>：<b>违反安全性</b>。“检查 <code>note == 0</code>”与“设置 <code>note = 1</code>”是分离的两步，若线程 A 在检查通过后、置位前被抢占，线程 B 也会通过检查，导致两个线程同时购买。</li>
<li><b>方案 1½（先置 <code>note = 1</code>，再检查 <code>milk == 0 &amp;&amp; note == 0</code>）</b>：<b>违反活性</b>。线程置位后立即检查同一个 <code>note</code> 变量，恒看到 <code>note == 1</code>，导致永远不购买。</li>
<li><b>方案 2（使用两个独立标志 <code>note_A</code> 与 <code>note_B</code>）</b>：
<pre>// 线程 A                            // 线程 B
note_A = 1;                          note_B = 1;
if (note_B == 0) {                   if (note_A == 0) {
    if (milk == 0) buy_milk();           if (milk == 0) buy_milk();
}                                    }
note_A = 0;                          note_B = 0;</pre>
<b>违反活性（发生死锁式饥饿）</b>：若线程 A 执行完 <code>note_A = 1</code> 后切换到线程 B 执行 <code>note_B = 1</code>，随后 A 观察到 <code>note_B == 1</code> 而跳过购买，B 也观察到 <code>note_A == 1</code> 而跳过购买，最终无人购买。</li>
</ul>

<h3>4.2 方案 3：不对称等待方案与顺序一致性证明</h3>
<pre>// 线程 A                            // 线程 B
note_A = 1;                          note_B = 1;
while (note_B == 1) { /* 忙等 */ }   if (note_A == 0) {          // 位置 Y
if (milk == 0) buy_milk();   // X        if (milk == 0) buy_milk();
note_A = 0;                          }
                                     note_B = 0;</pre>
<p><b>在顺序一致性（Sequential Consistency，所有读写存在全局全序且保持单线程程序顺序）下的正确性分情况证明</b>：</p>
<ol>
<li><b>情况 1：<code>note_A = 1</code> 先于 B 的 <code>if (note_A == 0)</code> 执行</b>。此时 B 观察到 <code>note_A == 1</code>，不进入购买分支，直接执行 <code>note_B = 0</code>；A 在 <code>note_B</code> 变为 0 后退出 <code>while</code> 循环，检查 <code>milk == 0</code> 并完成购买。</li>
<li><b>情况 2：B 的 <code>if (note_A == 0)</code> 先于 <code>note_A = 1</code> 执行</b>。由 B 的程序顺序知 <code>note_B = 1</code> 也已执行；B 进入分支完成购买，随后执行 <code>note_B = 0</code>；在 B 执行 <code>note_B = 0</code> 之前，A 始终被阻塞在 <code>while (note_B == 1)</code> 循环处，待 A 退出循环到达位置 X 时，<code>milk</code> 已被 B 置为 1，故 A 不会重复购买。</li>
</ol>
<p><b>方案 3 的三项缺陷</b>：(1) 逻辑复杂，证明繁琐；(2) <b>代码不对称</b>（线程 A 与线程 B 的代码不同，难以直接推广到 \(N\) 个线程）；(3) 线程 A 在 <code>while</code> 循环中<b>忙等待（Busy-Waiting）</b>，持续空转消耗 CPU 时间片。</p>

<h3>4.3 Peterson 双线程对称互斥算法</h3>
<pre>bool flag[2] = {false, false};
int  turn;

// 线程 i（i ∈ {0, 1}，对方线程为 j = 1 - i）
flag[i] = true;                      // 声明线程 i 希望进入临界区
turn = j;                            // 将优先权让给对方线程 j
while (flag[j] &amp;&amp; turn == j) ;       // 若对方也想进入且轮到对方，则忙等
/* --- 临界区（Critical Section）--- */
flag[i] = false;</pre>
<ul>
<li><b>互斥性证明</b>：假设线程 0 和线程 1 同时处于临界区内，则必有 <code>flag[0] == true</code> 且 <code>flag[1] == true</code>。由于 <code>turn</code> 是单一整型变量，在最后一个线程执行完 <code>turn = ...</code> 后，<code>turn</code> 的值必为 0 或 1 之一（不妨设最终 <code>turn == 1</code>，即线程 0 后写入 <code>turn = 1</code>）。此时线程 0 在执行 <code>while (flag[1] &amp;&amp; turn == 1)</code> 时两个条件均为真，不可能退出循环进入临界区，矛盾。</li>
<li><b>无死锁性</b>：若两线程同时停留在 <code>while</code> 循环中，则要求 <code>turn == 1</code> 与 <code>turn == 0</code> 同时成立，矛盾。</li>
</ul>

<h3>4.4 方案 4：基于互斥锁原语的抽象</h3>
<p>一旦底层提供原子的 <code>acquire(&amp;lock)</code> 与 <code>release(&amp;lock)</code>，问题即简化为三行对称代码：<code>acquire(&amp;lock); if (milk == 0) buy_milk(); release(&amp;lock);</code>。下一讲研究如何利用硬件特权指令或原子读-改-写指令高效实现 <code>acquire</code> 与 <code>release</code>。</p>

<h2>考前清单</h2>
<ul>
<li>Linux <code>clone()</code> 的四个共享标志（<code>CLONE_VM</code>、<code>CLONE_FS</code>、<code>CLONE_FILES</code>、<code>CLONE_SIGHAND</code>）；<code>pthread_create</code> 传栈地址的并发 bug。</li>
<li><code>counter += 1</code> 的三条机器指令分解与更新丢失过程。</li>
<li>原子操作的定义；对齐机器字 <code>load</code>/<code>store</code> 的原子性。</li>
<li>Too Much Milk 的两条正确性要求（安全性与活性）；方案 1、1½、2 的失效原因；方案 3 的顺序一致性分情况证明及三项缺陷；Peterson 算法的四行代码与证明。</li>
</ul>
`,
  questions: [
    { id: "q1", tag: "slide", kind: "single", q: String.raw`两个线程在无锁情况下各自对初值为 0 的全局变量 &lt;code&gt;counter&lt;/code&gt; 执行 1000 次 &lt;code&gt;counter += 1&lt;/code&gt;，程序结束时 &lt;code&gt;counter&lt;/code&gt; 的值`, choices: [["a", "恒等于 2000"], ["b", "可能小于 2000，且每次运行结果可能不同"], ["c", "恒等于 1000"]], answer: ["b"], why: String.raw`<code>counter += 1</code> 编译为 load、add、store 三条指令，两线程交错读到同一旧值会导致更新丢失。` },
    { id: "q2", tag: "slide", kind: "single", q: String.raw`在 Linux 内核中，调用 &lt;code&gt;clone(CLONE_VM | CLONE_FS | CLONE_FILES | CLONE_SIGHAND, 0)&lt;/code&gt; 创建的是`, choices: [["a", "具有独立地址空间的新进程"], ["b", "共享当前进程地址空间与文件表的新线程"], ["c", "新的内核管道"]], answer: ["b"], why: String.raw`上述四个标志指定共享虚拟内存、文件系统、打开文件表与信号处理表，即同一进程内的线程。` },
    { id: "q3", tag: "slide", kind: "tf", q: String.raw`在大多数现代处理器架构上，对齐的机器字（word）的 &lt;code&gt;load&lt;/code&gt; 和 &lt;code&gt;store&lt;/code&gt; 指令是原子的。`, answer: ["t"], why: String.raw`单字对齐读写由硬件保证原子性，不会出现半个字被修改的中间状态。` },
    { id: "q4", tag: "slide", kind: "multi", q: String.raw`Too Much Milk 同步问题要求同时满足的两条正确性性质是`, choices: [["a", "安全性（互斥）：至多只有一个线程执行购买"], ["b", "活性（前进性）：当没有牛奶时，最终必定有线程执行购买"], ["c", "两个线程必须严格交替购买"], ["d", "只允许线程 A 执行购买"]], answer: ["a", "b"], why: String.raw`同步协议需同时满足安全性（不重复购买）和活性（需要时有人购买）。` },
    { id: "q5", tag: "slide", kind: "single", q: String.raw`在 Too Much Milk 方案 1（先检查 &lt;code&gt;no_milk &amp;&amp; no_note&lt;/code&gt;，再执行 &lt;code&gt;leave note; buy milk;&lt;/code&gt;）中，存在的缺陷是`, choices: [["a", "两个线程都不会购买"], ["b", "在特定调度交错下两个线程可能同时购买（违反安全性）"], ["c", "线程陷入无限循环"]], answer: ["b"], why: String.raw`检查 <code>no_note</code> 与设置 <code>leave note</code> 之间可被抢占切换，导致两个线程均通过检查。` },
    { id: "q6", tag: "slide", kind: "single", q: String.raw`在 Too Much Milk 方案 2（A 先置 &lt;code&gt;note_A=1&lt;/code&gt; 再检查 &lt;code&gt;note_B==0&lt;/code&gt;；B 先置 &lt;code&gt;note_B=1&lt;/code&gt; 再检查 &lt;code&gt;note_A==0&lt;/code&gt;）中，存在的缺陷是`, choices: [["a", "两个线程可能同时购买"], ["b", "当两线程同时先置位自己的标志时，双方均放弃购买（违反活性）"], ["c", "该方案完全正确"]], answer: ["b"], why: String.raw`若双方在对方检查前均已置位，则双方都观察到对方标志为 1 而直接退出。` },
    { id: "q7", tag: "slide", kind: "multi", q: String.raw`Too Much Milk 方案 3 虽然满足安全性与活性，但仍具有哪些工程缺陷？`, choices: [["a", "可能发生两个线程同时购买"], ["b", "两个线程的代码不对称，难以扩展到 \(N\) 个线程"], ["c", "等待线程采用 <code>while</code> 空循环忙等待（Busy-Waiting），浪费 CPU 时间片"], ["d", "证明与推理复杂，且依赖顺序一致性内存模型"]], answer: ["b", "c", "d"], why: String.raw`方案 3 在顺序一致性下是正确的，但存在不对称、忙等待和难以推广三项缺陷。` },
    { id: "q8", tag: "slide", kind: "single", q: String.raw`对方案 3 和 Peterson 算法进行正确性证明时，所依赖的硬件内存模型假设是`, choices: [["a", "顺序一致性（Sequential Consistency）"], ["b", "所有算术运算均在单周期完成"], ["c", "系统中只存在一个线程"]], answer: ["a"], why: String.raw`证明要求所有线程的读写存在单一全局全序，且保持每个线程的程序顺序。` },
    { id: "q9", tag: "slide", kind: "single", q: String.raw`线程在循环中持续检查某个内存变量、在条件满足前一直占用 CPU 执行空循环，这种等待方式称为`, choices: [["a", "死锁（Deadlock）"], ["b", "忙等待（Busy-Waiting / Spinning）"], ["c", "阻塞睡眠（Blocking Sleep）"]], answer: ["b"], why: String.raw`忙等待不会让出 CPU，持续消耗处理器周期。` },
    { id: "q10", tag: "slide", kind: "single", q: String.raw`设共享变量初值为 &lt;code&gt;y = 12&lt;/code&gt;。线程 1 执行 &lt;code&gt;x = 1; x = y + 1;&lt;/code&gt;，线程 2 执行 &lt;code&gt;y = 2; y = y * 2;&lt;/code&gt;。程序结束时 &lt;code&gt;x&lt;/code&gt; 不可能等于`, choices: [["a", "13"], ["b", "3"], ["c", "5"], ["d", "25"]], answer: ["d"], why: String.raw`线程 1 执行 <code>x = y + 1</code> 时，<code>y</code> 的可能取值为 12、2 或 4，故 \(x\in\{13,3,5\}\)。` },
    { id: "q11", tag: "slide", kind: "tf", q: String.raw`在没有多线程支持的单核系统上，若要让银行服务器在等待磁盘 I/O 时继续处理其他请求，必须将请求处理逻辑拆分为异步事件驱动的非阻塞状态机。`, answer: ["t"], why: String.raw`多线程的优势之一正是允许程序员编写线性的阻塞式代码，由内核在阻塞时自动切换线程以重叠 I/O。` },
    { id: "q12", tag: "practice", kind: "single", q: String.raw`在 Peterson 算法中，线程 &lt;code&gt;i&lt;/code&gt; 设置 &lt;code&gt;flag[i] = true; turn = j;&lt;/code&gt; 之后的忙等条件是`, choices: [["a", "<code>while (flag[j]) ;</code>"], ["b", "<code>while (flag[j] &amp;&amp; turn == j) ;</code>"], ["c", "<code>while (turn == i) ;</code>"]], answer: ["b"], why: String.raw`仅当对方线程 <code>j</code> 也声明想进入（<code>flag[j]</code> 为真）且优先权在对方（<code>turn == j</code>）时，线程 <code>i</code> 才等待。` }
  ],
  cards: [
    [String.raw`Linux <code>clone()</code> 创建线程的四个共享标志`, String.raw`<code>CLONE_VM</code>（地址空间）、<code>CLONE_FS</code>（文件系统）、<code>CLONE_FILES</code>（文件描述符表）、<code>CLONE_SIGHAND</code>（信号处理）。`],
    [String.raw`<code>counter += 1</code> 的机器级三步分解`, String.raw`<code>load r1, M[counter]</code> \(\to\) <code>add r1, r1, 1</code> \(\to\) <code>store r1, M[counter]</code>。`],
    [String.raw`原子操作（Atomic Operation）的定义`, String.raw`执行过程不可分割、不可被打断，中间状态对外不可见的操作。`],
    [String.raw`Too Much Milk 的两条正确性要求`, String.raw`安全性（至多一个线程购买）与活性（缺奶时必有线程购买）。`],
    [String.raw`Too Much Milk 方案 1、1½、2 的错误类型`, String.raw`方案 1 违反安全性（可能双买）；方案 1½ 与方案 2 违反活性（可能无人购买）。`],
    [String.raw`Too Much Milk 方案 3 的三项缺陷`, String.raw`代码不对称、存在忙等待（Busy-Waiting）、推理复杂难以扩展。`],
    [String.raw`顺序一致性（Sequential Consistency）`, String.raw`所有内存读写存在统一的全局时间全序，且每个线程自身的操作保持程序顺序。`],
    [String.raw`Peterson 算法的核心代码`, String.raw`<code>flag[i] = true; turn = j; while (flag[j] &amp;&amp; turn == j); /* CS */ flag[i] = false;</code>。`]
  ]
});
