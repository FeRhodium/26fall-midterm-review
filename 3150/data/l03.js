Review.add({
  id: "l03", group: "lecture", n: 3,
  short: "L3 上下文切换与线程",
  title: "Lecture 3 · 上下文切换、PCB、并发与 pthread 编程",
  meta: "9 月 15 日 · System Programming 1",
  sources: [{ label: "lec03 课件", href: "materials/lectures/lec03-thread-process.pdf" }],
  html: String.raw`
<p class="lede">本讲包含两部分：第一，从内核实现角度给出中断触发的进程上下文切换完整流程，定义进程控制块（PCB）与调度器的结构；第二，从系统程序员角度区分并发与并行，介绍 POSIX 线程库（`pthread`）的创建、退出与等待接口，划分同一进程内线程的共享状态与私有状态，并追踪递归函数调用的执行栈帧。</p>

<h2>1. 内核中的进程切换、PCB 与调度器</h2>
<h3>1.1 中断触发的进程切换四步流程</h3>
<ol>
<li>进程 P1 在用户态（`sysmode = 0`）运行，硬件 `Base`/`Bound` 寄存器指向 P1 的物理内存区域。</li>
<li>硬件定时器中断到达：硬件自动将模式位切换为内核态（`sysmode = 1`），保存 P1 的用户态程序计数器（`uPC`），并将 PC 跳转到中断向量表入口 `IntrpVector[i]`。</li>
<li>内核中断处理程序将 P1 的通用寄存器与 `uPC` 保存到 P1 的内核数据结构中，切换至内核栈；调用调度器选出下一个就绪进程 P2；使用特权指令将 `Base`/`Bound` 更新为 P2 的内存区域，并从 P2 的保存区恢复其通用寄存器与 `uPC`。</li>
<li>内核执行特权指令 `RTU` 返回用户态，P2 从其上次被中断的指令处继续执行。</li>
</ol>

<h3>1.2 进程控制块（PCB）与调度器</h3>
<ul>
<li><b>进程控制块（Process Control Block，PCB）</b>：内核为每个进程维护一个 PCB 结构体，记录该进程的全部管理状态：进程状态（Running、Ready、Blocked 等）、未运行时的寄存器上下文快照、进程标识符（PID）、所属用户 ID、可执行文件信息、调度优先级、已累计占用的 CPU 时间，以及内存空间与地址转换表信息。</li>
<li><b>调度器（Scheduler）</b>：在所有就绪状态的 PCB 中依据<b>调度策略（Policy）</b>选择下一个运行的进程，若无就绪进程则运行空闲进程（`idle`）：
<pre>if (readyProcesses(PCBs)) {
    nextPCB = selectProcess(PCBs);
    run(nextPCB);
} else {
    run_idle_process();
}</pre></li>
</ul>

<h2>2. 线程抽象与并发/并行辨析</h2>
<p>除“单个执行上下文”外，线程的等价功能定义为：<b>代表一个可被内核独立调度的任务的单一指令执行序列</b>。</p>
<table>
<thead><tr><th>概念</th><th>严格定义</th></tr></thead>
<tbody>
<tr><td><b>Multiprocessing（多处理器）</b></td><td>系统拥有多个物理 CPU 核心</td></tr>
<tr><td><b>Multiprogramming（多道程序设计）</b></td><td>系统同时驻留并交替管理多个作业/进程</td></tr>
<tr><td><b>Multithreading（多线程）</b></td><td>单个进程内包含多个并发执行的线程</td></tr>
<tr><td><b>Concurrency（并发）</b></td><td>在同一时间段内<b>交替处理（deal with）</b>多个任务（单核通过时间分片即可实现）</td></tr>
<tr><td><b>Parallelism（并行）</b></td><td>在同一物理时刻<b>同时执行（do）</b>多个任务（必须依赖多核或多处理器硬件）</td></tr>
</tbody>
</table>
<p><b>使用多线程的三类典型场景</b>：(1) 防止长耗时计算阻塞其他独立任务（如一边计算 \(\pi\) 一边打印名单）；(2) 将慢速阻塞式 I/O 与 CPU 计算重叠，在等待磁盘或网络时让其他线程继续计算；(3) 保持图形界面响应（后台线程读取大文件，前台 UI 线程响应用户输入）。</p>
<div class="callout must"><strong>非确定性交错原则</strong><p>两个线程并发执行时，调度器可能以任意时间片粒度和任意先后顺序交错执行它们的指令。因此多线程程序的正确性<b>不能对调度顺序做任何假设</b>。</p></div>

<h2>3. POSIX 线程 API（`pthread`）</h2>
<p>C 程序启动时默认只含 `main` 一个线程，通过调用 `libc` 中的 `pthread` 库函数发起系统调用创建新线程：</p>
<pre>int  pthread_create(pthread_t *thread, const pthread_attr_t *attr,
                    void *(*start_routine)(void *), void *arg);
void pthread_exit(void *value_ptr);
int  pthread_join(pthread_t thread, void **value_ptr);</pre>
<ul>
<li>`pthread_create`：在当前进程内创建新线程，从 `start_routine(arg)` 开始执行；线程标识符写入输出参数 `*thread`。若 `start_routine` 执行 `return val;`，等价于隐式调用 `pthread_exit(val)`（注：若 `main` 函数执行 `return`，则会终止整个进程及所有线程）。</li>
<li>`pthread_exit`：终止调用线程自身，并将返回值指针 `value_ptr` 传递给对该线程调用 `pthread_join` 的线程。</li>
<li>`pthread_join`：阻塞调用线程，直至目标线程 `thread` 终止，并通过 `*value_ptr` 回收其返回值。</li>
<li><b>Fork-Join 并发模式</b>：主线程循环调用 `pthread_create` 创建一组工作线程并分配任务，随后按序调用 `pthread_join` 等待全部工作线程完成并汇总结果。主线程 `join` 的顺序是确定的，但各子线程实际完成与退出的顺序取决于调度器，是不确定的。</li>
</ul>

<h2>4. 线程的共享状态与私有状态</h2>
<table>
<thead><tr><th>同一进程内所有线程共享的状态</th><th>每个线程私有的状态（保存在 TCB）</th></tr></thead>
<tbody>
<tr><td>虚拟地址空间中的<b>代码段</b>、<b>静态数据段（全局变量）</b>、<b>堆（动态分配内存）</b></td><td><b>CPU 寄存器集合</b>（含程序计数器 PC 与栈指针 SP）</td></tr>
<tr><td>进程级 I/O 状态：<b>打开的文件描述符表</b>、网络连接、当前工作目录</td><td><b>独立的执行栈（Execution Stack）</b>：存放本线程的函数参数、局部变量与返回地址</td></tr>
</tbody>
</table>
<p>注：线程控制块（TCB）保存每个线程的私有上下文。由于同一进程的所有线程处于同一虚拟地址空间，各线程的栈在硬件层面并未相互隔离（一个线程若拿到指向另一线程栈的指针或发生栈溢出，仍可读写另一线程的栈；工程上常在相邻线程栈之间放置不可访问的<b>保护页 Guard Page</b>，使越界访问触发缺页异常）。</p>

<h3>4.1 执行栈帧（Stack Frame）追踪算例</h3>
<pre>void A(int tmp) {
A:      if (tmp &lt; 2)
A+1:        B();
A+2:    printf("%d ", tmp);
}
void B() {
B:      C();
B+1: }
void C() {
C:      A(2);
C+1: }
// 入口调用：
        A(1);
exit:</pre>
<p><b>栈帧压入与弹出过程</b>：调用 `A(1)` 压入帧 `{tmp=1, ret=exit}` \(\to\) 因 `1 < 2` 调用 `B()`，压入 `{ret=A+2}` \(\to\) `B` 调用 `C()`，压入 `{ret=B+1}` \(\to\) `C` 调用 `A(2)`，压入 `{tmp=2, ret=C+1}`（此时栈达最大深度 4 帧）。在 `A(2)` 中 `2 < 2` 为假，直接执行 `A+2` 打印 **`2`**，随后依次弹出栈帧返回 `C+1`、`B+1`、`A+2`，在 `A(1)` 的 `A+2` 处打印 **`1`**，最后返回 `exit`。故最终输出为 **`2 1`**。</p>

<h2>考前清单</h2>
<ul>
<li>中断驱动的进程切换四步流程；PCB 包含的字段；调度策略与机制的区分。</li>
<li>Multiprocessing / Multiprogramming / Multithreading 的区别；并发（Concurrency）与并行（Parallelism）的区别。</li>
<li>`pthread_create`、`pthread_exit`、`pthread_join` 的语义及 Fork-Join 模式。</li>
<li>同一进程内线程的共享状态（全局变量、堆、代码、文件描述符）与私有状态（寄存器、PC、栈，存于 TCB）；栈帧调用追踪。</li>
</ul>
`,
  questions: [
    { id: "q1", tag: "slide", kind: "multi", q: String.raw`同一进程内的多个线程共享下列哪些资源或状态？`, choices: [["a", "全局变量（静态数据段）"], ["b", "堆内存（Heap）"], ["c", "打开的文件描述符表"], ["d", "程序计数器（PC）"], ["e", "函数调用执行栈（Stack）"]], answer: ["a", "b", "c"], why: String.raw`寄存器（含 PC）与执行栈是每个线程私有的，保存在各自的 TCB 中。` },
    { id: "q2", tag: "slide", kind: "tf", q: String.raw`在单核处理器系统上，两个线程可以并发（concurrently）执行，但不能并行（in parallel）执行。`, answer: ["t"], why: String.raw`并发指时间片交叠地处理多个任务；并行指同一物理时刻在多个核心上同时执行指令。` },
    { id: "q3", tag: "slide", kind: "single", q: String.raw``pthread_join(t, &v)` 的准确语义是`, choices: [["a", "创建一个新线程 `t`"], ["b", "阻塞调用线程直至线程 `t` 终止，并通过 `v` 获取其返回值"], ["c", "强制立即终止线程 `t`"]], answer: ["b"], why: String.raw``pthread_join` 用于等待目标线程结束并回收其退出值。` },
    { id: "q4", tag: "slide", kind: "single", q: String.raw`工作线程的入口函数 `start_routine` 执行 `return ptr;` 时，其效果是`, choices: [["a", "整个进程立即终止"], ["b", "等价于调用 `pthread_exit(ptr)`，仅终止当前工作线程"], ["c", "忽略返回值并继续循环执行"]], answer: ["b"], why: String.raw`普通工作线程函数返回等价于隐式调用 `pthread_exit`（唯有 `main` 函数返回会调用 `exit` 终止整个进程）。` },
    { id: "q5", tag: "slide", kind: "multi", q: String.raw`主线程按 `i = 0..N-1` 循环创建 \(N\) 个线程，再按 `i = 0..N-1` 依次调用 `pthread_join`，各线程无锁修改同一全局变量。下列哪些正确？`, choices: [["a", "主线程调用 `pthread_join` 的顺序是确定的"], ["b", "各子线程实际执行完毕并退出的顺序是确定的"], ["c", "多次运行该程序可能产生不同的输出"], ["d", "程序存在数据竞争（Data Race）"]], answer: ["a", "c", "d"], why: String.raw`子线程的完成顺序取决于内核调度，且无锁读写共享变量会产生竞争条件。` },
    { id: "q6", tag: "slide", kind: "single", q: String.raw`在 4.1 节的栈追踪代码中（`A(tmp)` 当 `tmp < 2` 时调 `B()`，`B()` 调 `C()`，`C()` 调 `A(2)`，`A` 末尾打印 `tmp`），执行 `A(1)` 的输出为`, choices: [["a", "`1 2`"], ["b", "`2 1`"], ["c", "`2`"], ["d", "`1`"]], answer: ["b"], why: String.raw`内层调用 `A(2)` 先执行 `printf` 输出 `2`，退栈返回到外层 `A(1)` 后再输出 `1`。` },
    { id: "q7", tag: "slide", kind: "single", q: String.raw`进程控制块（PCB）中不包含下列哪一项？`, choices: [["a", "进程调度状态（Running/Ready/Blocked）"], ["b", "进程挂起时的 CPU 寄存器快照"], ["c", "进程 PID 与地址空间翻译信息"], ["d", "其他无关进程的私有栈局部变量值"]], answer: ["d"], why: String.raw`PCB 仅保存本进程的管理元数据与上下文。` },
    { id: "q8", tag: "slide", kind: "tf", q: String.raw`保护与并发是正交的两个维度：一个进程（保护域）内可以包含一个线程，也可以包含多个线程。`, answer: ["t"], why: String.raw`地址空间提供保护边界，线程提供并发执行流，二者可独立组合。` },
    { id: "q9", tag: "slide", kind: "single", q: String.raw`在一个应用程序中使用一个线程读取磁盘大文件、另一个线程渲染 GUI 界面，其主要作用是`, choices: [["a", "提高磁盘硬件的物理读取速度"], ["b", "将阻塞式文件 I/O 与界面渲染重叠，保持界面响应性"], ["c", "减小可执行文件的体积"]], answer: ["b"], why: String.raw`当文件读取线程阻塞等待 I/O 时，调度器可运行 GUI 线程处理用户输入。` }
  ],
  cards: [
    [String.raw`PCB（进程控制块）的核心字段`, String.raw`进程状态、寄存器上下文快照、PID、优先级、累计 CPU 时间、地址空间翻译信息。`],
    [String.raw`中断切换进程的四步`, String.raw`中断入内核并保存 uPC \(\to\) 保存旧进程寄存器到 PCB \(\to\) 切换 Base/Bound 并装载新进程上下文 \(\to\) RTU 返回用户态。`],
    [String.raw`并发（Concurrency）与并行（Parallelism）`, String.raw`并发：时间分片交叠处理多任务；并行：多核同一时刻同时执行多任务。`],
    [String.raw``pthread_create` 的四个参数`, String.raw`输出线程 ID 指针 `thread`、属性 `attr`、入口函数 `start_routine`、传入参数 `arg`。`],
    [String.raw`TCB（线程控制块）保存的内容`, String.raw`线程私有的 CPU 寄存器集合（含 PC、SP）与线程栈信息。`],
    [String.raw`同一进程内线程共享的资源`, String.raw`代码段、静态数据段（全局变量）、堆、打开的文件描述符表。`],
    [String.raw`检测多线程栈溢出的常用机制`, String.raw`在相邻线程栈之间设置不可访问的保护页（Guard Page）。`]
  ]
});
