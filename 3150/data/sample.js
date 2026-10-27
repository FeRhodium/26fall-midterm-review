Review.add({
  id: "sample",
  group: "exam",
  n: 1,
  short: "Sample Final 样卷全解",
  title: "Spring 2026 Final 样卷全解（官方 Midterm Sample Paper · 8 大题）",
  meta: "Blackboard 2026-10-27 公告发布 · 期中重点看 Q1–Q5/Q7.1，Q6/Q7.2-3/Q8 为期末预习",
  sources: [
    { label: "Midterm Sample Paper (Official DOCX)", href: "materials/Midterm_Sample_Paper.docx" }
  ],
  html: String.raw`
<p class="lede">助教 2026 年 10 月 27 日公告说明：Blackboard 新上传的 <strong>Midterm Sample Paper</strong> 实际是 <strong>Spring 2026 Final Examination 样卷</strong>（考试时长 120 分钟，共 8 道大题，满分按 Q1 10%、Q2 8%、Q3 16%、Q4 16%、Q5 12%、Q6 22%、Q7 10%、Q8 6% 分配），供本次期中备考参考其命题风格、题型与难度。<strong>本次期中（11 月 5 日）重点精做 Q1–Q5 与 Q7.1</strong>（概念、系统编程、信号量有界缓冲区、MLFQ 甘特图、死锁检测）；<strong>Q6（页面置换与 TLB）、Q7.2–7.3（inode/FAT/日志文件系统）、Q8（NFS 与两阶段提交 2PC）属于 Lecture 15 之后的期末范围</strong>，本题解一并给出，供期末提前预习。</p>

<div class="callout must">
  <strong>最新考试规则（2026-10-27 Blackboard 公告，务必确认！）</strong>
  <ul>
    <li><strong>小抄（Cheat paper）</strong>：期中可携带 <strong>1 张纸、双面均可写笔记（one sheet of paper with notes on both sides）</strong>。</li>
    <li><strong>电子设备（Electronic devices）</strong>：考场内<strong>禁止携带任何电子设备</strong>。</li>
    <li><strong>计算器</strong>：样卷规则允许使用无编程与文件存储功能的计算器。</li>
  </ul>
</div>

<h2>Question 1：概念与定义（10 分）</h2>

<h3>1(a)（2 分）进程与线程的区别、线程的优缺点</h3>
<div class="callout ex">
  <strong>标准解答</strong>
  <ul>
    <li><strong>区别</strong>：<strong>进程（Process）是资源分配与隔离的单位</strong>，拥有独立的虚拟地址空间（代码、数据、堆、栈、打开文件表）和受限权限保护域；<strong>线程（Thread）是 CPU 调度的执行单位</strong>，同一进程内的多个线程<b>共享</b>该进程的地址空间（全局变量、堆、代码段、文件描述符），但每个线程<b>独有</b>自己的程序计数器（PC）、通用寄存器集合与执行栈（存于线程控制块 TCB 中）。</li>
    <li><strong>线程的优点（任写一条）</strong>：创建与上下文切换开销远小于进程（无需新建/切换页表与 TLB，只需切换寄存器与栈）；同一进程内多线程可直接通过共享全局变量与堆内存通信，无需系统调用与内核拷贝。</li>
    <li><strong>线程的缺点（任写一条）</strong>：缺乏内存隔离，一个线程的越界写（Race condition / 野指针）会破坏整个进程的共享数据；单个线程的崩溃（如段错误）通常导致整个进程终止。</li>
  </ul>
</div>

<h3>1(b)（2 分）双重模式（Dual Mode）及其目的</h3>
<div class="callout ex">
  <strong>标准解答</strong>：CPU 硬件提供两种特权级执行模式：<strong>用户态（User Mode）</strong>与<strong>内核态（Kernel / Supervisor Mode）</strong>，由一个硬件模式位（Mode bit）区分。<b>目的</b>是实现<b>隔离与保护</b>：普通应用程序运行在用户态，禁止直接执行特权指令（I/O 操作、修改内存管理寄存器、关中断等）；所有特权操作只能经<b>系统调用（System Call）</b>陷入内核，由操作系统在严格校验参数后代为执行，从而防止有缺陷或恶意的用户程序破坏内存、窃取其他进程数据或使整台机器崩溃。</div>

<h3>1(c)（2 分）竞争条件（Race Condition）及代码示例</h3>
<div class="callout ex">
  <strong>标准解答</strong>：当<b>多个线程并发访问同一个共享数据、且至少有一个访问是写操作、且最终结果取决于具体调度交错次序</b>时，就发生了竞争条件。
<pre>static int counter = 0;
// 两个线程各自并发执行一百万次：
for (int i = 0; i &lt; 1000000; i++) counter++;  // 编译为 load / add / store 三条指令！
// 期望结果为 2000000，实际可能仅为 1000037 等任意小于 200 万的值（更新丢失）。</pre>
  <p>因为 <code>counter++</code> 不是原子操作，若 T1 执行 <code>load</code> 读到 100 后被抢占，T2 也读到 100，各自加 1 后都写回 101，两次递增只生效一次。</p>
</div>

<h3>1(d)（4 分）Pthreads 接口的指针设计（高频陷阱题）</h3>
<table>
<thead><tr><th>参数</th><th>为什么这样设计（标准答案）</th></tr></thead>
<tbody>
<tr><td><code>pthread_create(pthread_t *thread, …)</code> 中为什么 <code>thread</code> 是指针？</td><td>因为 <code>pthread_create</code> 需要<b>由被调用方（callee）填写新线程的 ID 并回传给调用方</b>。C 语言参数是值传递，若直接传 <code>pthread_t</code> 值，函数内部只能修改一份拷贝，调用方永远拿不到新 ID；改传 <b>指向调用方变量的指针 <code>pthread_t *</code></b>，函数即可通过解引用 <code>*thread = new_tid</code> 把新 ID 写回调用方变量。</td></tr>
<tr><td><code>pthread_create(…, void *arg)</code> 中为什么 <code>arg</code> 是指针（<code>void *</code>）？</td><td>因为要把<b>任意类型、任意大小的用户参数</b>传给新线程的入口函数。用户在堆或静态区分配好参数结构体（可以是一个 <code>int</code>、一个结构体、甚至一个数组），只传一个<b>通用无类型指针 <code>void *</code></b> 即可把它交给 <code>start_routine(void *arg)</code>；C 语言在仅传一个机器字的前提下无法按值传递任意大小的任意类型数据（整数若要传值，也须先强制转换为 <code>(void *)(long)value</code> 再转回）。</td></tr>
<tr><td><code>pthread_exit(void *value_ptr)</code> 中为什么 <code>value_ptr</code> 是 <code>void *</code>？</td><td>因为线程的<b>返回值类型可以是任意类型</b>。采用 <code>void *</code> 通用指针，线程既可返回指向堆上结果结构体的指针，也可将小整数强制转换后返回，使接口能不加修改地适配一切返回类型。</td></tr>
<tr><td><code>pthread_join(pthread_t thread, void **value_ptr)</code> 中为什么 <code>value_ptr</code> 是 <code>void **</code>（二级指针）？</td><td><b>同理于 <code>thread</code> 指针</b>：<code>pthread_join</code> 需要<b>把被等待线程调用 <code>pthread_exit(value_ptr)</code> 时交出的那个 <code>void *</code> 指针再回写给等待方</b>。被回传的物件本身是一个 <code>void *</code>，故必须传递<b>指向它的指针 <code>void **</code></b>（即 <code>void *</code> 的地址），函数才能通过 <code>*value_ptr = exited_value</code> 把退出指针写回调用方。</td></tr>
</tbody>
</table>

<h2>Question 2：系统编程与 OS 基础（8 分）</h2>

<h3>2.1（3 分）<code>fork()</code> 的返回值、逻辑复制的内存、共享与独占资源</h3>
<div class="callout ex">
  <strong>标准解答</strong>
  <ul>
    <li><strong><code>fork()</code> 返回值</strong>：在<b>父进程</b>中，<code>fork()</code> 返回新创建的<b>子进程 PID（&gt; 0）</b>；在<b>子进程</b>中，返回 <b>0</b>；若创建失败，则在父进程中返回 <b>-1</b>（无子进程产生）。程序据此区分父子分支。</li>
    <li><strong>逻辑上被复制的内存</strong>：子进程获得<b>父进程整个虚拟地址空间的逻辑副本</b>——包括代码段、全局/静态数据、堆、<code>fork</code> 时刻的栈（以及打开文件描述符表）。现代 OS 用<b>写时复制（Copy-on-Write, COW）</b>优化：复制瞬间仅复制页表并把共享物理页标为只读，任一方首次写入某页时才触发缺页并真正私自拷贝该页。</li>
    <li><strong>共享（举一例）</strong>：复制瞬间共享物理帧（COW）；<b>打开文件描述（Open File Description，含当前文件偏移量）是共享的</b>——父子通过复制来的 <code>fd</code> 读写同一文件会互相推进共享偏移量。</li>
    <li><strong>不共享（举一例）</strong>：<b>PID、父进程号 PPID、待处理信号（Pending signals）不共享/被清空</b>；子进程仅保留调用 <code>fork</code> 的那一个线程（其他线程不复制）；子进程拥有独立的页表（逻辑地址空间）。</li>
  </ul>
</div>

<h3>2.2（3 分）两个无亲缘关系的同机进程间 IPC 机制选型</h3>
<table>
<thead><tr><th>IPC 机制</th><th>对无亲缘进程是否合适？</th><th>理由</th></tr></thead>
<tbody>
<tr><td><b>匿名管道（Pipe）</b></td><td><b>不合适（通常情况下）</b></td><td>匿名 <code>pipe()</code> 返回的两个 <code>fd</code> 只存在于创建进程的文件描述符表中，<b>只能通过 <code>fork()</code> 被子进程继承</b>；两个已独立启动的无亲缘进程互相看不到对方的 <code>fd</code>，无从引用（除非改用命名管道 FIFO）。</td></tr>
<tr><td><b>套接字（Socket）</b></td><td><b>合适</b></td><td>进程可通过 <b>Unix Domain Socket</b>（同机路径名/抽象地址）或回环 TCP（<code>127.0.0.1 + 端口</code>）互相 <code>connect/accept</code> 建立全双工字节流通道，无需亲缘关系，且代码可平滑扩展到跨机器通信。</td></tr>
<tr><td><b>共享内存（Shared Memory）</b></td><td><b>合适</b></td><td>进程可通过 <code>shm_open/mmap</code>（或 System V <code>shmget</code>）用一个<b>众所周知的名字/Key</b> 共同映射同一块物理内存，实现零拷贝高速通信（但必须额外配用互斥锁/信号量等同步原语）。</td></tr>
</tbody>
</table>

<h3>2.3（2 分）为什么 OS 要提供文件（File）抽象？</h3>
<div class="callout ex">
  <strong>标准解答（应用层与 OS 设计层各举两条收益）</strong>
  <ul>
    <li><b>对应用程序员</b>：(1) 提供统一的 <code>open/read/write/close</code> 接口，屏蔽磁盘、SSD、终端、管道等一切底层设备差异（屏蔽硬件多样性）；(2) 提供命名与持久化（文件按名字保存、断电不丢失），程序无需关心扇区与柱面布局。</li>
    <li><b>对 OS 设计者</b>：(1) 可在文件抽象背后统一实现权限检查（隔离与安全）、缓存（Page Cache）与崩溃一致性等复杂机制；(2) 使“一切皆文件”成为可能——设备、管道、套接字都可以复用同一套系统调用与权限模型，降低内核复杂度。</li>
  </ul>
</div>

<h2>Question 3：同步（16 分）— 信号量有界缓冲区（最核心送分题！）</h2>

<h3>3.1（6 分）补全 <code>put(Item)</code> 与 <code>Item get()</code></h3>
<div class="callout must">
  <strong>满分标准代码（顺序千万不能颠倒！）</strong>
<pre>void put(Item x) {
    wait(empty);          // 1. 先申请空槽位（没空槽就在此阻塞）
    lock(m);              // 2. 再进入临界区更新共享缓冲区状态
    buf[tail] = x;
    tail = (tail + 1) % N;
    unlock(m);
    signal(full);         // 3. 通知消费者：多了一个满槽
}

Item get() {
    wait(full);           // 1. 先申请满槽（缓冲区空则在此阻塞）
    lock(m);
    Item x = buf[head];
    head = (head + 1) % N;
    unlock(m);
    signal(empty);        // 3. 通知生产者：多了一个空槽
    return x;
}</pre>
  <p><strong>评分要点</strong>：(i) 生产者必须 <code>wait(empty)</code> 阻塞在“满”时、消费者必须 <code>wait(full)</code> 阻塞在“空”时；(ii) 对 <code>buf/tail/head</code> 的读写每步必须在 <code>lock(m)</code>/<code>unlock(m)</code> 临界区内完成；(iii) <strong>必须先等待资源计数信号量（<code>empty</code>/<code>full</code>），再等待互斥锁 <code>m</code></strong>；(iv) 退出临界区后 <code>signal(full/empty)</code> 唤醒对端。</p>
</div>

<h3>3.2（4 分）只留 <code>empty</code> 和 <code>full</code>、删掉互斥锁 <code>m</code> 是否正确？</h3>
<div class="callout trap">
  <strong>结论：不正确！多生产者/多消费者会发生竞争条件</strong>
  <p><strong>具体反例</strong>：设 \(N = 4\)，当前 <code>tail = 2</code>，生产者 \(P_1\) 与 \(P_2\) 几乎同时执行 <code>wait(empty)</code> 成功后并发进入写入段：\(P_1\) 刚把物品写入 <code>buf[2]</code>、尚未更新 <code>tail</code> 就被抢占；\(P_2\) 也把自己的物品<b>写到同一个 <code>buf[2]</code></b>，覆盖了 \(P_1\) 的物品；随后两者都执行 <code>tail = (tail + 1) % N</code>，可能导致一次写入彻底丢失、同一槽被计两次 <code>full</code>，或两个生产者推进错位使消费者读到空槽。消费者侧同理会竞争 <code>head</code>：两个消费者可能读到同一件 <code>buf[head]</code> 并重复递增 <code>head</code>。计数信号量只能保证“总数不超过/不少于界限”，<strong>不能保证对 <code>buf/head/tail</code> 复合状态的原子更新</strong>，所以互斥锁不可省。</p>
</div>

<h3>3.3（3 分）在 <code>put()</code> 中调换 <code>wait(empty)</code> 与 <code>lock(m)</code> 的顺序</h3>
<div class="callout trap">
  <strong>结论：会死锁（Deadlock）！</strong>
  <p>调换后的错误代码为 <code>lock(m); wait(empty); … unlock(m); signal(full);</code>。试想<b>缓冲区已完全塞满（<code>empty = 0</code>）</b>：生产者先抢到互斥锁 <code>m</code>，再调用 <code>wait(empty)</code> 并<b>在持有 <code>m</code> 的同时阻塞</b>；消费者要取出物品，必须先成功执行 <code>get()</code> 里的 <code>lock(m)</code>，但 <code>m</code> 已经被睡着的生产者牢牢占用，于是消费者也阻塞，<strong>永远没有人去取出物品并执行 <code>signal(empty)</code></strong>，生产者与消费者以“持有并等待（Hold and Wait）→ 循环等待”的方式彻底死锁。所以<b>资源信号量必须在互斥锁之前等待</b>。</p>
</div>

<h3>3.4（3 分）分析给定的错误生产者代码（缺了什么同步？）</h3>
<div class="callout trap">
  <strong>结论：缺少互斥锁保护（<code>lock(m)</code>/<code>unlock(m)</code>）！</strong>
<pre>void put(Item x) {
    wait(empty);
    buf[tail] = x;              // 未加锁就并发写 buf[tail] 与 tail！
    tail = (tail + 1) % N;
    signal(full);
}</pre>
  <p><strong>缺失的同步</strong>：没有用互斥锁 <code>m</code> 保护对共享变量 <code>buf</code> 数组与写指针 <code>tail</code> 的读-改-写过程（消费者侧的 <code>head</code> 同理）。</p>
  <p><strong>具体后果</strong>：同 §3.2——两个生产者并发通过 <code>wait(empty)</code> 后，可能同时写同一个 <code>buf[tail]</code> 导致其中一件物品被覆盖丢失，并使 <code>signal(full)</code> 多执行了两次，消费者随后会误读到一个未写入的空槽或重复读同一件物品，破坏 FIFO 队列不变式。</p>
</div>

<h2>Question 4：CPU 调度与多级反馈队列 MLFQ（16 分）— 甘特图全推演</h2>
<p><strong>规则重述</strong>：三级队列 \(Q_0\)（时间片 2）、\(Q_1\)（时间片 3）、\(Q_2\)（FCFS）；新作业进 \(Q_0\)；在 \(Q_0/Q_1\) <b>用完整个时间片则降一级</b>；<b>在时间片未用完时主动阻塞/让出 CPU 则留在原队列</b>；高优先级队列始终抢占低优先级队列；<b>无周期性提升（No priority boost）</b>。\(C\) 执行模式为：运行 1 → I/O 阻塞 2 → 运行 1 → I/O 阻塞 2 → 运行 1 终止，且 \(C\) 从 I/O 返回时<b>回到当初离开时的同一队列</b>。</p>

<h3>4.1（9 分）12 个单位时间的完整执行追踪表</h3>
<table>
<thead><tr><th>时间区间</th><th>运行作业</th><th>所在队列</th><th>区间末尾的调度事件</th></tr></thead>
<tbody>
<tr><td><code>0–1</code></td><td><b>A</b>（第 1 单位）</td><td><code>Q0</code></td><td>时刻 1：B 到达 \(Q_0\)，与 A 同级故不抢占</td></tr>
<tr><td><code>1–2</code></td><td><b>A</b>（第 2 单位）</td><td><code>Q0</code></td><td>时刻 2：A 用完 \(Q_0\) 时间片 2，<b>降入 \(Q_1\)</b>；C 到达 \(Q_0\)（排 B 之后）</td></tr>
<tr><td><code>2–3</code></td><td><b>B</b>（第 1 单位）</td><td><code>Q0</code></td><td>—</td></tr>
<tr><td><code>3–4</code></td><td><b>B</b>（第 2 单位）</td><td><code>Q0</code></td><td>时刻 4：B 用完 \(Q_0\) 时间片 2，<b>降入 \(Q_1\)</b>（剩 1 单位）</td></tr>
<tr><td><code>4–5</code></td><td><b>C</b>（第 1 单位）</td><td><code>Q0</code></td><td>时刻 5：C 主动阻塞 I/O（仅用了 1 &lt; 2，<b>留在 \(Q_0\)</b>），I/O 至时刻 7</td></tr>
<tr><td><code>5–6</code></td><td><b>A</b>（第 3 单位）</td><td><code>Q1</code></td><td>\(Q_1\) 队列中 A 排 B 之前</td></tr>
<tr><td><code>6–7</code></td><td><b>A</b>（第 4 单位）</td><td><code>Q1</code></td><td>时刻 7：C 完成 I/O 返回 \(Q_0\)，<b>抢占 \(Q_1\) 中的 A</b></td></tr>
<tr><td><code>7–8</code></td><td><b>C</b>（第 2 单位）</td><td><code>Q0</code></td><td>时刻 8：C 再次阻塞 I/O（仍留在 \(Q_0\)），I/O 至时刻 10</td></tr>
<tr><td><code>8–9</code></td><td><b>A</b>（第 5 单位）</td><td><code>Q1</code></td><td>时刻 9：A 在 \(Q_1\) 累计用完时间片 3（6–7、5–6、8–9），<b>降入 \(Q_2\)</b>（剩 1 单位）</td></tr>
<tr><td><code>9–10</code></td><td><b>B</b>（第 3 单位，终止）</td><td><code>Q1</code></td><td>时刻 10：<b>B 完成并结束（Finish = 10）</b>；C 恰在此刻返回 \(Q_0\)</td></tr>
<tr><td><code>10–11</code></td><td><b>C</b>（第 3 单位，终止）</td><td><code>Q0</code></td><td>时刻 11：<b>C 完成并结束（Finish = 11）</b></td></tr>
<tr><td><code>11–12</code></td><td><b>A</b>（第 6 单位，终止）</td><td><code>Q2</code></td><td>时刻 12：<b>A 完成并结束（Finish = 12）</b></td></tr>
</tbody>
</table>
<div class="callout ex">
  <strong>4.1 三个子问题汇总</strong>
  <ul>
    <li><strong>降级时刻</strong>：<b>时刻 2</b>（A：\(Q_0 \to Q_1\)）、<b>时刻 4</b>（B：\(Q_0 \to Q_1\)）、<b>时刻 9</b>（A：\(Q_1 \to Q_2\)）。</li>
    <li><strong>C 从 I/O 返回时刻</strong>：第一次返回在<b>时刻 7</b>，第二次返回在<b>时刻 10</b>（均回到 \(Q_0\)）。</li>
    <li><strong>完成时刻</strong>：<b>B 于时刻 10、 C 于时刻 11、 A 于时刻 12</b>。</li>
  </ul>
</div>

<h3>4.2（3 分）每个作业的等待时间（Waiting Time）</h3>
<div class="callout ex">
  <strong>标准计算（等待时间 = 周转时间 − CPU 运行时间 − I/O 阻塞时间）</strong>
  <ul>
    <li><b>作业 A</b>（到达 0，完成 12，CPU 6）：等待 \(= (12 - 0) - 6 = \mathbf{6}\)（在就绪队列中分别等了 2–5、7–8、9–11 三段）。</li>
    <li><b>作业 B</b>（到达 1，完成 10，CPU 3）：等待 \(= (10 - 1) - 3 = \mathbf{6}\)（等了 1–2、4–9 两段）。</li>
    <li><b>作业 C</b>（到达 2，完成 11，CPU 3，I/O 阻塞共 4）：等待 \(= (11 - 2) - 3 - 4 = \mathbf{2}\)（仅在到达后 2–4 等待 B 跑完 \(Q_0\)，两次 I/O 返回都恰好立即被调度）。</li>
  </ul>
</div>

<h3>4.3（2 分）MLFQ 偏爱交互式作业的设计特征</h3>
<div class="callout ex">
  <strong>核心机制</strong>：<b>“用完时间片才降级、在时间片结束前主动让出（阻塞 I/O）则不降级；新作业从最高优先级起步”</b>。交互式作业的典型特征是 <b>CPU 突发短、频繁阻塞等待键盘/网络 I/O</b>（如本题的 C 每次只算 1 单位就去睡 2 单位），因此它永远用不满高优先级队列的时间片，始终留在 \(Q_0/Q_1\) 高层队列；一旦 I/O 完成返回就绪，便立即抢占低层长计算作业（如 A），获得接近零的响应延迟。</div>

<h3>4.4（2 分）MLFQ 表现糟糕或不公平的场景</h3>
<div class="callout trap">
  <strong>任写一例（高频标准答法）</strong>：
  <ul>
    <li><b>无优先级提升导致的长作业饥饿</b>：一旦某个长计算作业降入 \(Q_2\)，若系统此后源源不断地到达短交互作业停留在 \(Q_0/Q_1\)，该长作业将永远得不到 CPU（本题故意“无 Priority Boost”恰恰放大了这一缺陷！）。</li>
    <li><b>调度欺骗（Gaming the Scheduler）</b>：恶意计算密集型程序可以在每段运行到接近时间片上限时故意发起一次毫无意义的极短 I/O（例如假装读 1 字节文件），从而一直冒充“交互式作业”霸占最高优先级队列，让其他正常作业挨饿（即 Lecture 12 的 Othello <code>printf</code> 攻击）。</li>
    <li><b>运行时间刚好略超时间片的作业被误判</b>：一个完全 CPU 密集型但只差一丁点没跑完时间片的作业，会白白跑满整段低优先级大时间片，拉低整体响应时间（可改用 MLFQ 规则 4 的“累计配额”补救）。</li>
  </ul>
</div>

<h2>Question 5：死锁（12 分）</h2>

<h3>5.1–5.2（6 分）单实例系统的资源分配图（RAG）与死锁判定</h3>
<div class="callout ex">
  <strong>资源分配图（文字刻画，\(R_j \to P_i\) 为分配边，\(P_i \to R_j\) 为请求边）</strong>
  <ul>
    <li>分配边：\(R_1 \to P_1,\quad R_2 \to P_2,\quad R_3 \to P_3\)（每个资源唯一的实例分别被三人独占）；</li>
    <li>请求边：\(P_1 \to R_2,\quad P_2 \to R_3,\quad P_3 \to R_1\)（每人还想要邻居手里的那一个资源）。</li>
    <li>合起来构成加粗环路：\(P_1 \to R_2 \to P_2 \to R_3 \to P_3 \to R_1 \to P_1\)。</li>
  </ul>
  <p><strong>判定结论：系统已死锁（Deadlocked）</strong>。理由：图中存在闭合有向环路，且<b>每种资源类型仅有 1 个实例</b>——在单实例资源分配图中，“有向环”是死锁的<b>充要条件</b>：\(P_1\) 等 \(P_2\) 释放 \(R_2\)，\(P_2\) 等 \(P_3\) 释放 \(R_3\)，\(P_3\) 反过来等 \(P_1\) 释放 \(R_1\)，无人能先释放，无外部干预环节永远打不开。</p>
  <p><strong>5.3 破除办法（任写一法）</strong>：<b>强制终止并回滚环中任意一个进程（例如杀死 \(P_1\)，回收 \(R_1\)）</b>，使 \(P_3\) 获得 \(R_1\) 后顺利结束、依次释放 \(R_3\) 给 \(P_2\) 等；或<b>抢占 \(P_1\) 持有的 \(R_1\) 暂时借给 \(P_3\)</b>（资源抢占 + 进程挂起回滚）。</p>
</div>

<h3>5.4–5.5（4 分）多实例系统的死锁检测算法（Detection Algorithm）</h3>
<p>系统状态：资源 A 共 2 个实例、B 共 1 个实例；初始时 A 的 2 个实例分别在 \(P_1, P_2\)，B 的唯一实例在 \(P_3\)，故 <b>当前空闲向量 <code>Avail = [A: 0, B: 0]</code></b>。</p>
<table>
<thead><tr><th>进程</th><th>Allocation</th><th>Request（当前请求）</th><th>请求能否被 <code>Avail = (0, 0)</code> 满足？</th></tr></thead>
<tbody>
<tr><td><code>P1</code></td><td><code>A=1, B=0</code></td><td><code>A=0, B=1</code></td><td><b>不能</b>（需要 1 个 B，但 B 已被 \(P_3\) 占用且无空闲）</td></tr>
<tr><td><code>P2</code></td><td><code>A=1, B=0</code></td><td><code>A=0, B=1</code></td><td><b>不能</b>（同 \(P_1\)）</td></tr>
<tr><td><code>P3</code></td><td><code>A=0, B=1</code></td><td><code>A=1, B=0</code></td><td><b>不能</b>（需要 1 个 A，但 A 的 2 个实例均被 \(P_1, P_2\) 占用）</td></tr>
</tbody>
</table>
<div class="callout trap">
  <strong>运行死锁检测算法的迭代过程与结论</strong>
  <ol>
    <li>初始化 <code>Avail = (0, 0)</code>，<code>UNFINISHED = {P1, P2, P3}</code>。</li>
    <li>第 1 轮扫描：\(P_1, P_2\) 的 <code>Request = (0, 1)</code> 与 \(P_3\) 的 <code>Request = (1, 0)</code> <b>均不小于等（\(\not\le\)）于 <code>Avail = (0, 0)</code></b>，故本轮无任何进程可标记为完成，<code>done</code> 保持 <code>true</code>，<code>Avail</code> 不变，算法终止。</li>
    <li><code>UNFINISHED</code> 仍然非空（三个进程全在里面）⇒ <strong>系统处于死锁状态，\(P_1, P_2, P_3\) 全部卷入死锁</strong>（\(P_1/P_2\) 一起等 \(P_3\) 手里的 B，\(P_3\) 在等 \(P_1/P_2\) 手里的 A）。</li>
  </ol>
  <p><strong>5.5 破除办法</strong>：终止环上任意一个进程并回收其已占资源。例如<b>中止 \(P_3\)，立刻回收它持有的唯一 B 实例</b>（\(Avail\) 变为 \(A:0, B:1\)），则 \(P_1\) 可拿到 B 并顺利跑完、释放 \(A:1, B:1\)，接着 \(P_2\) 等也能相继获得资源全部完成。</p>
</div>

<h2>Question 6：内存管理（22 分）—【期末预习，期中不考】页面置换 FIFO / LRU / MIN / Clock 全算例</h2>
<p>需求分页系统共 3 个物理帧，页面引用串为下行。对每一页若命中则不计缺页。下表给出各算法完成后的帧内容（顺序与算法各自的编号方式对应）。</p>

<h3>6.1（11 分）FIFO / LRU / MIN（最优置换 OPT）缺页次数</h3>
<table>
<thead>
  <tr><th>引用页</th><th>A</th><th>B</th><th>C</th><th>A</th><th>D</th><th>B</th><th>A</th><th>E</th><th>B</th><th>A</th><th>C</th></tr>
</thead>
<tbody>
  <tr><td><b>FIFO 是否缺页</b></td><td>Fault</td><td>Fault</td><td>Fault</td><td>Hit</td><td>Fault（淘汰 A）</td><td>Hit</td><td>Fault（淘汰 B）</td><td>Fault（淘汰 C）</td><td>Fault（淘汰 D）</td><td>Hit</td><td>Fault（淘汰 A）</td></tr>
  <tr><td><b>FIFO 结束时帧内容</b></td><td>[A]</td><td>[A,B]</td><td>[A,B,C]</td><td>[A,B,C]</td><td>[D,B,C]</td><td>[D,B,C]</td><td>[D,A,C]</td><td>[D,A,E]</td><td>[B,A,E]</td><td>[B,A,E]</td><td>[B,C,E]</td></tr>
  <tr><td><b>LRU 是否缺页</b></td><td>Fault</td><td>Fault</td><td>Fault</td><td>Hit</td><td>Fault（淘汰 B）</td><td>Fault（淘汰 C）</td><td>Hit</td><td>Fault（淘汰 D）</td><td>Hit</td><td>Hit</td><td>Fault（淘汰 E）</td></tr>
  <tr><td><b>LRU 结束时帧内容</b></td><td>[A]</td><td>[A,B]</td><td>[A,B,C]</td><td>[A,B,C]</td><td>[A,D,C]</td><td>[A,D,B]</td><td>[A,D,B]</td><td>[A,E,B]</td><td>[A,E,B]</td><td>[A,E,B]</td><td>[A,C,B]</td></tr>
  <tr><td><b>MIN 是否缺页</b></td><td>Fault</td><td>Fault</td><td>Fault</td><td>Hit</td><td>Fault（淘汰 C）</td><td>Hit</td><td>Hit</td><td>Fault（淘汰 D）</td><td>Hit</td><td>Hit</td><td>Fault（淘汰任一不再引用页，如 E）</td></tr>
  <tr><td><b>MIN 结束时帧内容</b></td><td>[A]</td><td>[A,B]</td><td>[A,B,C]</td><td>[A,B,C]</td><td>[A,B,D]</td><td>[A,B,D]</td><td>[A,B,D]</td><td>[A,B,E]</td><td>[A,B,E]</td><td>[A,B,E]</td><td>[A,B,C]</td></tr>
</tbody>
</table>
<div class="callout ex">
  <strong>总缺页次数汇总（基准校验）</strong>：<b>FIFO = 8 次</b>，<b>LRU = 7 次</b>，<b>MIN / OPT = 6 次</b>。注意 MIN 原理：每次淘汰“未来最晚再次被引用（可能永远不再出现，如淘汰时选未来距离最远者）”的页面，故永远是离线最优下界（第 5 步引用 D 时，应淘汰下一次出现在 11 号位最远的 C，而非最近要用到的 A 或 B）。</div>

<h3>6.2（7 分）Clock（时钟 / 二次机会）置换算法全追踪</h3>
<table>
<thead><tr><th>引用</th><th>是否缺页？</th><th>引用后 Frames 内容</th><th>引用后 R Bits</th><th>引用后 Hand 指向</th><th>时钟手移动说明</th></tr></thead>
<tbody>
<tr><td><code>A</code></td><td><b>Yes</b></td><td><code>[A, -, -]</code></td><td><code>[1, -, -]</code></td><td><code>1</code></td><td>（初始给定）装入帧 0 后移动到 1</td></tr>
<tr><td><code>B</code></td><td><b>Yes</b></td><td><code>[A, B, -]</code></td><td><code>[1, 1, -]</code></td><td><code>2</code></td><td>（给定）装入帧 1 后指针到 2</td></tr>
<tr><td><code>C</code></td><td><b>Yes</b></td><td><code>[A, B, C]</code></td><td><code>[1, 1, 1]</code></td><td><code>0</code></td><td>（给定）装入帧 2 后回绕到 0</td></tr>
<tr><td><code>A</code></td><td>No（命中）</td><td><code>[A, B, C]</code></td><td><code>[1, 1, 1]</code></td><td><code>0</code></td><td>命中将 A 的 R 位置为 1（本来即 1），手不动</td></tr>
<tr><td><code>D</code></td><td><b>Yes</b></td><td><code>[D, B, C]</code></td><td><code>[1, 0, 0]</code></td><td><code>1</code></td><td>手扫过 A（R 1→0 移动）、B（R 1→0 移动）、C（R 1→0 移动）构成 <b>完整一圈</b>，回帧 0 把 R 已是 0 的 A 淘汰装 D，D 的 R 置 1，手进至 1</td></tr>
<tr><td><code>B</code></td><td>No（命中）</td><td><code>[D, B, C]</code></td><td><code>[1, 1, 0]</code></td><td><code>1</code></td><td>命中将之前被扫成 0 的 B 的 R 重新置 1，手不动</td></tr>
<tr><td><code>A</code></td><td><b>Yes</b></td><td><code>[D, B, A]</code></td><td><code>[1, 0, 1]</code></td><td><code>0</code></td><td>手在帧 1 发现 B 是 1，清为 0 并进到帧 2；帧 2 的 C 是 0，直接淘汰 C 装入 A、置 1，手进至 0</td></tr>
<tr><td><code>E</code></td><td><b>Yes</b></td><td><code>[D, E, A]</code></td><td><code>[0, 1, 1]</code></td><td><code>2</code></td><td>手在帧 0 发现 D 是 1，清为 0 进到 1；帧 1 的 B 是 0，淘汰 B 装入 E、置 1，手进至 2</td></tr>
<tr><td><code>B</code></td><td><b>Yes</b></td><td><code>[B, E, A]</code></td><td><code>[1, 1, 0]</code></td><td><code>1</code></td><td>手在帧 2 发现 A 是 1，清为 0 进到 0；帧 0 的 D 是 0，淘汰 D 装入 B、置 1，手进至 1</td></tr>
<tr><td><code>A</code></td><td>No（命中）</td><td><code>[B, E, A]</code></td><td><code>[1, 1, 1]</code></td><td><code>1</code></td><td>命中把刚被扫成 0 的 A 的 R 重新置 1，手不动</td></tr>
<tr><td><code>C</code></td><td><b>Yes</b></td><td><code>[B, C, A]</code></td><td><code>[0, 1, 0]</code></td><td><code>2</code></td><td>手依次扫 E（帧 1，R 1→0）、A（帧 2，R 1→0）、B（帧 0，R 1→0）构成<b>又一次完整一圈</b>，回到帧 1 将已是 0 的 E 淘汰装入 C、置 1，手进至 2</td></tr>
</tbody>
</table>
<div class="callout ex">
  <strong>6.2 汇总答案</strong>：<b>总缺页数 = 8 次</b>（A、B、C、D、A、E、B、C 处缺页）；时钟手在其间做过 <b>2 次完整一整圈（2 full cycles）</b>——分别发生在处理 D（第 5 步、把三位 R 全部清零）和处理最后一个 C（第 11 步、再次把三位 R 全部清零）时。</div>

<h3>6.3（2 分）多级页表（Multi-level paging）思想</h3>
<div class="callout ex"><strong>标准答案</strong>：把线性页号再分段索引：虚拟地址被切成<b>外层页目录索引 + 内层页表索引 + 页内偏移</b>（可再扩展三、四级）；页目录里仅为<b>真正被用到的地址空间区间</b>分配下一级页表，未被映射的稀疏区间只在目录中留一个无效条目（无需为它建整张次级表）。对 64 位下动辄 TB 级的巨大虚拟地址空间，若用一张平整单级页表，其条目数将与虚拟页数成正比（每进程动辄几十 GB 不可能常驻内存）；多级结构使页表内存开销与<b>实际被映射到的虚拟区间数量</b>成正比，稀疏地址空间因此极省内存。</div>

<h3>6.4（2 分）有效访问时间（EAT）四种情形计算（TLB 10ns / Cache 5ns / 主存 100ns）</h3>
<table>
<thead><tr><th>情形</th><th>串行动作总成</th><th>耗时（ns）</th></tr></thead>
<tbody>
<tr><td>(a) TLB Hit ＋ Cache Hit</td><td>查 TLB (10) 拿到帧号 → 查 Cache (5) 直接命中数据</td><td><code>10 + 5 = 15</code></td></tr>
<tr><td>(b) TLB Hit ＋ Cache Miss</td><td>查 TLB (10) → 查 Cache 未命中 (5) → 访问主存取数据 (100)</td><td><code>10 + 5 + 100 = 115</code></td></tr>
<tr><td>(c) TLB Miss ＋ Cache Hit</td><td>查 TLB 未命中 (10) → 访问主存读页表项 (100) → 查 Cache 直接命中数据 (5)</td><td><code>10 + 100 + 5 = 115</code></td></tr>
<tr><td>(d) TLB Miss ＋ Cache Miss</td><td>查 TLB 未命中 (10) → 读页表项主存 (100) → 查 Cache 未命中 (5) → 再取数据主存 (100)</td><td><code>10 + 100 + 5 + 100 = 215</code></td></tr>
</tbody>
</table>
<p>若按给定全体命中率（TLB 命中 90%、Cache 命中 80%，近似独立）计算整体平均访问时间：\(EAT = 0.9\cdot[\,0.8\cdot 15 + 0.2\cdot 115\,] + 0.1\cdot[\,0.8\cdot 115 + 0.2\cdot 215\,] = 0.9\cdot 35 + 0.1\cdot 135 = 31.5 + 13.5 = \mathbf{45\text{ ns}}\)（题目只问四种条件情形，上表 15/115/115/215 即可）。</p>

<h2>Question 7：文件与文件系统（10 分）— 部分期中（Q7.1）、部分期末预习（Q7.2–7.3）</h2>

<h3>7.1（4 分）高级文件 I/O 与低级文件 I/O 之别【期中重点】</h3>
<table>
<thead><tr><th>维度</th><th>高级文件 I/O（如 C Stdio <code>FILE*</code> / <code>fopen/fread/fprintf</code>）</th><th>低级文件 I/O（如 POSIX <code>fd</code> / <code>open/read/write</code>）</th></tr></thead>
<tbody>
<tr><td>抽象层 / 机制</td><td>在用户态维护<b>缓冲区（Buffering）</b>，并把字节流包装成行、字符串、格式化输出（<code>%d</code>）或结构体记录</td><td>直接是<b>内核系统调用</b>：每次调用对一块原始 <code>bytes</code> 读/写，没有用户态缓存</td></tr>
<tr><td>一次优点</td><td><b>减少系统调用开销且接口方便</b>：小块写先在用户态拼满缓冲区再一次性 <code>write</code>，且自带格式化/按行处理（如样卷中“<code>printf</code> 没换行时输出被推迟”正是用户态缓冲在起作用）</td><td><b>精确可控、实为真实 I/O</b>：每次调用的字节数、偏移与返回值 (<code>0</code> 表示 EOF、<code>-1</code> 表示错误）直接对应内核文件描述，能够实现诸如 <code>lseek</code> 随机访问、二进制协议等精细控制</td></tr>
</tbody>
</table>

<h3>7.2（4 分）索引分配 inode 与 FAT 链接分配对比【期末预习】</h3>
<table>
<thead><tr><th>维度</th><th>Unix inode 索引分配</th><th>FAT 链接分配（Linked Allocation）</th></tr></thead>
<tbody>
<tr><td>(a) 定位文件块的方法</td><td>目录保存文件的 <b>inode 编号</b>；inode 内含一组<b>直接块指针（Direct pointers）</b>，以及一级/二级/三级<b>间接块指针（Single/Double/Triple Indirect）</b>。访问第 \(k\) 个逻辑块时，沿 inode 指针链按 \(k\) 的范围至多多查一两级即可直接算出磁盘块号</td><td>目录项里只保存文件的<b>起始簇号（First cluster number）</b>；文件分配表（FAT）里每个簇对应的表项里存着<b>下一个簇的编号</b>（如链表 <code>next</code> 指针，遇到 EOF 标记结束），访问第 \(k\) 个逻辑块必须从文件头沿 FAT 逐个簇向前追 \(k-1\) 步</td></tr>
<tr><td>(b) 一条优点</td><td><b>随机访问近似 \(O(1)\)</b>：靠索引直接定位任意块，无需扫描前面数据，且小文件只用直接指针零额外开销</td><td><b>实现极简零外部碎片</b>：任何空闲簇都能立刻链到尾巴上分配，追加文件只需改 FAT 最后一项</td></tr>
<tr><td>(c) 一条缺点</td><td>inode 结构复杂，极大文件需多级索引增加元数据开销；且每文件固定的 inode 表占空间，文件数上限受 inode 总表大小限制</td><td><b>随机访问极慢（\(O(k)\) 沿链步进）</b>；FAT 表常驻内存开销随磁盘放大；且任何一簇损坏都会丢失后续链条</td></tr>
</tbody>
</table>

<h3>7.3（2 分）写前日志（Journaling）文件系统【期末预习】</h3>
<div class="callout ex">
  <strong>标准答案</strong>
  <ul>
    <li><strong>要解决的问题</strong>：传统文件系统修改一个文件常需连改<b>多处元数据</b>（inode 位图、数据块位图、目录等）；若写一半时<b>断电/崩溃</b>，文件系统可能处于<b>不一致的半更新状态</b>（如块已被分配但未链接，或目录指向已释放块），重启后需要全盘 <code>fsck</code> 长时间扫描修复。</li>
    <li><strong>崩溃后恢复做什么</strong>：恢复过程先去读<b>日志区（Journal）</b>：已经完整提交（即日志里留下 Commit 记录）的事务被<b>重演（Replay / Redo）</b>进主文件系统，把它们推成完整状态；未完整记录的交易被直接<b>丢弃</b>，相当于该操作从未发生，从而用一次顺序扫日志替代全盘一致性检查。</li>
  </ul>
</div>

<h2>Question 8：分布式系统（6 分）—【期末预习，期中不考】</h2>

<h3>8.1（3 分）NFS 的弱一致性（Weak Consistency）</h3>
<div class="callout ex">
  <strong>标准答案</strong>
  <ul>
    <li><strong>客户端如何知道文件变了</strong>：NFS 客户端<b>会把文件内容与属性缓存在本地</b>，不会每次读都去问服务器；只在<b>打开文件（open 时）</b>、或<b>缓存条目老化到超时</b>后，才向服务器 <b>校验缓存的属性时间戳（Validation：在客户端核对 <code>mtime</code> 等属性）</b>，发现服务器版本更新了，才作废缓存并重新拉取。</li>
    <li><strong>为何会读到陈旧数据</strong>：校验之间隔着时间窗（通常实现还依赖客户端时间戳属性缓存超时），在该窗口内别的客户端已经在服务器上改完并关闭了文件，本客户端缓存里却仍是旧副本并被继续使用，因此本机在此期间只能读到 <b>stale（陈旧）数据</b>，不能保证强一致性（Read-your-writes / Monotonic Reads）。</li>
    <li><strong>多客户端并发写同一文件会怎样</strong>：NFS 协议层<b>不提供全系统原子的并发写锁语义</b>；两个客户端各自对同一文件区域进行带本地缓存的改写并先后回刷服务器，最终可能发生<b>覆盖（Last-writer-wins，丢失更新）</b>或<b>交错混合（数据块交织、结果不可预测）</b>，不会像单机单文件系统那样按锁定顺序严格串行化。</li>
  </ul>
</div>

<h3>8.2（3 分）两阶段提交（2PC）在三类协调者宕机下的阻塞分析</h3>
<table>
<thead><tr><th>故障场景</th><th>会发生什么？是否有进程被阻塞（Blocked）？</th></tr></thead>
<tbody>
<tr><td><b>场景 1</b>：协调者在发完全部 <code>VOTE-REQ</code> 之前宕机</td><td>所有参与者<b>都还没投票、不知道全局决定</b>，属于事务尚未定的早期阶段。<b>还没有被锁在确定性决定上，原则上不会长期阻塞</b>：没被问到的参与者既可等待协调者重启并重新发起，也可超时后默认 <b>Aborted</b>（因为根本还没进入投票阶段，别人的决定不可能已经是提交）。真正已经收到并已投票（例如已投 YES）的少数参与者，若有的话，会进入等待决定；但严格按本题设“尚未把 VOTE-REQ 发给所有人”，普遍可通过超时单方中止收尾，不必永久阻塞。</td></tr>
<tr><td><b>场景 2</b>：所有参与者都投 YES，协调者在发出最终决定之前宕机</td><td><b>这是 2PC 最著名的阻塞窗口</b>：所有参与者都已经投票 YES，就意味着它们<b>已经承诺“随时可提交”但绝不能单方面改成中止</b>（万一协调者醒来后决定提交而自己已回滚就出错）。在协调者恢复并发来 <code>GLOBAL-COMMIT / GLOBAL-ABORT</code> 之前，参与者们<b>会被阻塞，只能持锁等待</b>，既不能释放资源也不能前进，这正是“非阻塞原子提交协议难以实现”的核心困境。</td></tr>
<tr><td><b>场景 3</b>：一个参与者已收到 <code>GLOBAL-COMMIT</code>，另一个仍在等待时协调者宕机</td><td>全局决定<b>必然已经是 Commit</b>（不可能再被改成 Abort）。尚未收到决定的参与者暂时不知道决定，严格按协议它<b>当前不能擅自提交或中止（表面上仍处于等待/不确定中）</b>；但它并不是真正的无解阻塞——协调者恢复后继续补发 <code>GLOBAL-COMMIT</code>，或在实现允许时询问已提交的参与者即可得知决定并最终提交。<b>结论：决策本身已经唯一确定，只剩传播延迟</b>，不会出现一个提交、一个中止的分裂结果。</td></tr>
</tbody>
</table>
`,
  questions: [
    {
      id: "sf-q1", tag: "sample", kind: "single",
      q: String.raw`（样卷 Q1d）为什么 <code>pthread_join(pthread_t thread, void **value_ptr)</code> 的第二个参数必须是二级指针 <code>void **</code> 而不是 <code>void *</code>？`,
      choices: [
        ["a", String.raw`因为 <code>pthread_join</code> 需要把被等待线程通过 <code>pthread_exit</code> 交出的那个 <code>void *</code> 指针再回写给等待方，回写的对象本身是一个 <code>void *</code>，故必须传递它的地址 <code>void **</code>`],
        ["b", String.raw`为了让 <code>pthread_join</code> 能同时回收两个返回值`],
        ["c", String.raw`为了兼容 C++ 的引用传递语法`],
        ["d", String.raw`为了表示该指针永远不会为 NULL`]
      ],
      answer: ["a"],
      why: String.raw`C 是值传递：要让被调用函数改写调用方的一个 <code>void *</code> 变量，必须传 <code>void *</code> 的地址，即 <code>void **</code>，再由 <code>*value_ptr = ...</code> 回填。`
    },
    {
      id: "sf-q2", tag: "sample", kind: "single",
      q: String.raw`（样卷 Q2.2）同一台机器上两个无亲缘关系、独立启动的进程需要通信，下列哪种 IPC 最合适？`,
      choices: [
        ["a", String.raw`匿名管道 <code>pipe()</code>，因为任何进程都可以直接按 fd 号打开对方的管道`],
        ["b", String.raw`Unix Domain Socket 或回环 TCP Socket，或命名式共享内存（<code>shm_open/mmap</code>），因为它们都靠众所周知的名字/路径互相发现`],
        ["c", String.raw`只能使用信号，因为无亲缘进程无法共享任何内核对象`],
        ["d", String.raw`必须让两个进程先重新 <code>fork()</code> 成为父子关系`]
      ],
      answer: ["b"],
      why: String.raw`匿名管道只能经 <code>fork</code> 继承 fd，无亲缘进程无法引用；Socket 与命名共享内存靠路径/名字发现对端，是无亲缘 IPC 的标准方案。`
    },
    {
      id: "sf-q3", tag: "sample", kind: "multi",
      q: String.raw`（样卷 Q3）关于有界缓冲区的 <code>put()</code> 实现（信号量版），下列哪些说法正确？`,
      choices: [
        ["a", String.raw`必须先 <code>wait(empty)</code> 再 <code>lock(m)</code>；若调换顺序，缓冲区满时生产者持锁等空槽、消费者抢不到锁去取物品，会死锁`],
        ["b", String.raw`只靠 <code>empty</code> 与 <code>full</code> 计数信号量就够了，互斥锁 <code>m</code> 可以删掉`],
        ["c", String.raw`普通生产者代码里若漏写 <code>lock/unlock(m)</code>，两个生产者可能同时写同一个 <code>buf[tail]</code>，使一件物品被覆盖丢失`],
        ["d", String.raw`<code>signal(full)</code> 必须在仍然持有互斥锁 <code>m</code> 时执行，否则会死锁`]
      ],
      answer: ["a", "c"],
      why: String.raw`A 对（先计数信号量后互斥锁是防死锁的固定顺序）；C 对（缺锁则 buf/tail 出现竞争）；B 错（计数不能保证复合状态原子性）；D 错（signal 放锁外是标准写法，不因此死锁）。`
    },
    {
      id: "sf-q4", tag: "sample", kind: "single",
      q: String.raw`（样卷 Q4）按样卷给定的 MLFQ 规则（Q0 片 2、Q1 片 3、Q2 FCFS，无优先级提升）模拟 A(6)/B(3)/C(1-IO2-1-IO2-1)，三个作业的完成顺序与完成时刻是：`,
      choices: [
        ["a", String.raw`B 在 10 完成，C 在 11 完成，A 在 12 完成`],
        ["b", String.raw`A 在 9 完成，B 在 10 完成，C 在 12 完成`],
        ["c", String.raw`C 在 7 完成，A 在 10 完成，B 在 12 完成`],
        ["d", String.raw`B 在 8 完成，A 在 11 完成，C 在 12 完成`]
      ],
      answer: ["a"],
      why: String.raw`降级发生在 2（A→Q1）、4（B→Q1）、9（A→Q2）；C 两次在 Q0 用 1 单位后阻塞 I/O 并留在 Q0，分别在 7、10 返回抢占。故 B=10、C=11、A=12。`
    },
    {
      id: "sf-q5", tag: "sample", kind: "single",
      q: String.raw`（样卷 Q5.4）多实例死锁检测：资源 A 2 个、B 1 个；P1 持有 A 请求 B，P2 持有 A 请求 B，P3 持有 B 请求 A。此时 <code>Avail=(0,0)</code>，运行 Detection Algorithm 的结果是：`,
      choices: [
        ["a", String.raw`P1、P2、P3 的 Request 均不 \(\le \mathrm{Avail}=(0,0)\)，没有任何进程可先完成，UNFINISHED 始终非空，系统已死锁`],
        ["b", String.raw`P3 先靠手中的 B 完成并释放，从而依次解开 P1、P2，系统没有死锁`],
        ["c", String.raw`多实例资源分配图有环也必然无死锁，所以系统不死锁`],
        ["d", String.raw`只有 P3 死锁，P1 与 P2 可以正常完成`]
      ],
      answer: ["a"],
      why: String.raw`三人请求分别为 (0,1)、(0,1)、(1,0)，没有一个能被 Avail(0,0) 满足；一轮无进展后 UNFINISHED 仍是 {P1,P2,P3}，证明三入全部死锁。`
    },
    {
      id: "sf-q6", tag: "sample", kind: "single",
      q: String.raw`【期末预习】（样卷 Q6.1）需求分页 3 帧、引用串 A B C A D B A E B A C 下，FIFO、LRU、MIN 的缺页次数分别为：`,
      choices: [
        ["a", String.raw`FIFO 8 次，LRU 7 次，MIN 6 次`],
        ["b", String.raw`FIFO 6 次，LRU 7 次，MIN 8 次`],
        ["c", String.raw`FIFO 7 次，LRU 8 次，MIN 6 次`],
        ["d", String.raw`三者均为 8 次`]
      ],
      answer: ["a"],
      why: String.raw`逐步模拟帧表：FIFO 命中 A、B、A 共 3 次得 8 缺页；LRU 是 7 次；MIN 作为离线最优为 6 次。`
    },
    {
      id: "sf-q7", tag: "sample", kind: "single",
      q: String.raw`【期末预习】（样卷 Q6.4）TLB 10ns、Cache 5ns、主存 100ns 时，TLB 命中+Cache 未命中与 TLB 未命中+Cache 命中的单次访问耗时分别为：`,
      choices: [
        ["a", String.raw`前者 \(10+5+100=115\) ns，后者 \(10+100+5=115\) ns`],
        ["b", String.raw`前者 15 ns，后者 215 ns`],
        ["c", String.raw`前者 100 ns，后者 100 ns`],
        ["d", String.raw`两者都是 215 ns`]
      ],
      answer: ["a"],
      why: String.raw`TLB 命中省去读页表但 Cache 未命中仍须付主存数据；TLB 未命中则多付一次主存读页表项、Cache 命中时无需为数据再去主存。`
    },
    {
      id: "sf-q8", tag: "sample", kind: "single",
      q: String.raw`（样卷 Q7.1）关于 C Stdio 的 <code>FILE*</code> 高级 I/O 与 POSIX <code>fd</code> 低级 I/O，正确说法是：`,
      choices: [
        ["a", String.raw`<code>FILE*</code> 有用户态缓冲区，小写可先拼在内存里减少 syscall 开销并支持格式化；<code>fd</code> 的 <code>read/write</code> 直接系统调用、精确控制每次字节数与偏移`],
        ["b", String.raw`<code>FILE*</code> 每次调用都必然立即产生一次内核系统调用`],
        ["c", String.raw`<code>fd</code> 型 <code>printf</code> 没有换行时会立刻打印`],
        ["d", String.raw`高级 I/O 无法读取二进制文件`]
      ],
      answer: ["a"],
      why: String.raw`高级 I/O 的优势是缓冲+格式化/按行接口，低级 I/O 的优势是直接 syscall、无缓冲精确控制。`
    },
    {
      id: "sf-q9", tag: "sample", kind: "single",
      q: String.raw`【期末预习】（样卷 Q8.2）在两阶段提交（2PC）中，所有参与者都已投 YES，但协调者在发出最终决定前宕机时：`,
      choices: [
        ["a", String.raw`所有参与者处在已承诺但不知结果的状态，不能单方面提交或回滚，必须持锁阻塞等待协调者恢复，这是 2PC 的经典阻塞窗口`],
        ["b", String.raw`所有参与者可立刻各自回滚，绝不阻塞`],
        ["c", String.raw`所有参与者都可自动提交，因为投了 YES 就等于已提交`],
        ["d", String.raw`协调者宕机后事务会自动变成 Read-only`]
      ],
      answer: ["a"],
      why: String.raw`投 YES 意味着承诺可提交，但全局决定未定前既不能擅自提交也不能擅自中止，因此只能阻塞等待协调者恢复。`
    }
  ],
  cards: [
    [String.raw`（样卷 Q1d）为什么 pthread_create 里的 thread 是指针，而 pthread_join 里的 value_ptr 要用 void**？`, String.raw`两者都是要被调函数回写调用方变量：create 回写新线程 ID（pthread_t *），join 回写退出线程的 void* 返回值（故须传 void* 的地址即 void**）。`],
    [String.raw`（样卷 Q2）fork() 后哪些东西是逻辑复制、哪些是共享？`, String.raw`逻辑复制整个虚拟地址空间（COW 物理延迟拷贝）与 fd 表；共享打开文件描述（含偏移量）；不共享 PID、pending signals、其它线程。`],
    [String.raw`（样卷 Q3.1）有界缓冲区 put/get 的固定顺序是什么？为什么？`, String.raw`先 wait(empty/full) 再 lock(m)，unlock 后 signal 对端。若先 lock 再 wait 资源信号量，满时持锁睡去会把消费者锁在外面，必然死锁。`],
    [String.raw`（样卷 Q4）MLFQ 样卷题的降级时刻与完成顺序`, String.raw`降级 2（A Q0→Q1）、4（B Q0→Q1）、9（A Q1→Q2）；B 在 10 先完成、C 在 11、A 在 12；等待时间 A6、B6、C2。`],
    [String.raw`（样卷 Q5）单实例死锁环与多实例检测的区别答法`, String.raw`单实例：图中有环即死锁；多实例：运行 Detection Algorithm，初始 Avail(0,0) 下 P1/P2/P3 无一能满足请求，UNFINISHED 非空证明全部死锁。`],
    [String.raw`（样卷 Q6）3 帧引用串 A B C A D B A E B A C 的缺页数`, String.raw`FIFO 8、LRU 7、MIN 6；Clock 也是 8 次缺页且手扫满整圈 2 次（处理 D 与最后 C 各一次）。`],
    [String.raw`（样卷 Q6.4）EAT 四种组合公式`, String.raw`TLB hit+cache hit 15ns；TLB hit+cache miss 115ns；TLB miss+cache hit 115ns；TLB miss+cache miss 215ns（TLB 10、Cache 5、内存 100）。`]
  ]
});
