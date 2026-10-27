Review.add({
  id: "l02", group: "lecture", n: 2,
  short: "L2 四个基本概念",
  title: "Lecture 2 · 四个基本概念：线程、地址空间、进程与双模式执行",
  meta: "9 月 10 日 · OS Concepts",
  sources: [{ label: "lec02 课件", href: "materials/lectures/lec02-concepts.pdf" }],
  html: String.raw`
<p class="lede">本讲定义操作系统的四个基础概念：线程（独立的指令执行上下文）、地址空间（程序可访问的内存地址集合及其布局）、进程（绑定了受限访问权限的地址空间与一个或多个线程）、双模式运行（用户态与内核态的硬件权限分离）。在此基础上给出 Base and Bound 地址保护机制及从用户态进入内核态的三种控制转移方式。</p>

<h2>1. 系统虚拟化与程序装入执行流程</h2>
<ul>
<li><b>两类虚拟化</b>：操作系统将物理 CPU、内存与 I/O 设备虚拟化为进程、线程与文件等抽象供单个应用程序使用；虚拟机监控器（Hypervisor）则将整台物理机器虚拟化为多台虚拟机，使多个客户操作系统各自独立运行，实现操作系统级别的故障隔离。</li>
<li><b>程序从源码到执行的步骤</b>：编译器将源代码编译为可执行文件（如 <code>a.out</code>，内含机器指令段与初始数据段）\(\to\) 操作系统将指令段与静态数据段装入内存，分配初始化的栈与堆 \(\to\) 设置程序计数器（PC）并将控制权转交程序 \(\to\) 处理器按冯·诺依曼周期循环执行“取指（Fetch）\(\to\) 译码（Decode）\(\to\) 执行（Execute）\(\to\) 写回并更新 PC”。</li>
</ul>

<h2>2. 概念一：线程（Thread of Control）</h2>
<div class="callout must"><strong>定义：线程</strong><p>线程是处理器上的<b>单个唯一执行上下文（Execution Context）</b>，由程序计数器（PC）、通用寄存器集合、执行标志位（Flags）和执行栈（Stack）完整表征。</p></div>
<ul>
<li><b>正在执行（Running）</b>：该线程的上下文当前驻留在物理处理器的寄存器中，PC 指向该线程的下一条待执行指令，栈指针（SP）指向该线程的栈顶。</li>
<li><b>挂起（Suspended）</b>：该线程的上下文未驻留在处理器中，其寄存器快照被保存在内存数据结构中，处理器寄存器当前装载的是其他线程的状态。</li>
</ul>

<h2>3. 概念二：地址空间（Address Space）</h2>
<p>地址空间是程序可读取和写入的地址集合及其关联状态（32 位架构为 \(2^{32}\approx 4\times 10^9\) 字节，64 位架构为 \(2^{64}\) 字节）。典型进程地址空间从低地址到高地址分为四个区域：</p>
<ul>
<li><b>代码段（Code / Text）</b>：存放编译后的只读机器指令。</li>
<li><b>静态数据段（Static Data）</b>：存放全局变量与静态变量，在程序启动时分配。</li>
<li><b>堆（Heap）</b>：由 <code>malloc</code>/<code>new</code> 动态分配、由程序员调用 <code>free</code>/<code>delete</code> 显式释放，向高地址方向增长。</li>
<li><b>栈（Stack）</b>：存放函数调用栈帧（局部变量、函数参数、返回地址），随函数调用向低地址方向增长、随函数返回弹出。</li>
</ul>
<pre>int global_var = 10;                        // 位于静态数据段
void f() { int x = 30; }                    // x 位于栈（f 的调用栈帧）
int main() {
    int stack_var = 20;                     // 位于栈
    int *heap_var = malloc(sizeof(int));    // 指针变量 heap_var 本身在栈上，其指向的整型块在堆上
    *heap_var = 40;
    free(heap_var);
}</pre>

<h2>4. 概念三：进程（Process）</h2>
<div class="callout must"><strong>定义：进程</strong><p>进程是<b>带有受限权限的程序执行环境</b>，由<b>一个受保护的地址空间 + 一个或多个线程</b>（以及打开的文件描述符、文件系统上下文等资源）组成。</p></div>
<ul>
<li><b>并发与保护的正交分解</b>：线程封装<b>并发性</b>（主动的执行流，利用多核并行或重叠 I/O 等待）；地址空间封装<b>保护与隔离</b>（被动的资源边界，防止程序错误破坏操作系统或其他进程）。</li>
<li><b>保护与效率的权衡</b>：同一进程内的多个线程直接共享地址空间，通信与切换开销低，但单线程越界写内存会破坏整个进程；不同进程之间具有硬件强制的内存隔离，故障互不传染，但进程间通信（IPC）必须经过操作系统内核，开销较高。</li>
<li><b>内存保护的核心原则</b>：通过硬件限制从程序虚拟地址空间到物理内存的地址转换（Address Translation），使进程在结构上无法生成指向未授权物理内存的有效引用。</li>
</ul>

<h2>5. 概念四：双模式运行（Dual Mode Operation）</h2>
<p>处理器硬件至少提供一个模式位，区分<b>用户态（User Mode，<code>sysmode = 0</code>）</b>与<b>内核态（Kernel / Supervisor Mode，<code>sysmode = 1</code>）</b>。</p>
<ul>
<li><b>用户态下硬件禁止的特权操作</b>：(1) 修改地址转换寄存器（如 Base/Bound 或页表基址寄存器）；(2) 禁用或启用硬件中断；(3) 直接访问物理 I/O 设备寄存器；(4) 读写内核专用的内存区域。用户态程序若尝试执行特权指令，硬件将直接触发异常并陷入内核。</li>
</ul>

<h3>5.1 Base and Bound（基址与界限）地址保护</h3>
<p>处理器设置两个特权寄存器 <code>Base</code> 和 <code>Bound</code>：</p>
<ul>
<li><b>版本 1（加载时重定位）</b>：加载器在装入程序时将代码中的地址直接改写为物理地址；运行时硬件仅检查 \(\text{Base}\le\text{addr}&lt;\text{Bound}\)，不在访存路径上执行加法。</li>
<li><b>版本 2（运行时硬件地址转换）</b>：程序始终使用从 0 开始的虚拟地址；每次访存时硬件自动计算 \(\text{物理地址}=\text{Base}+\text{虚拟地址}\)，并检查结果是否严格小于 <code>Bound</code>（若越界则触发异常）。</li>
</ul>
<p>内核启动一个用户进程的步骤：在内核态将进程装入物理内存 <code>Base..Bound</code> \(\to\) 用特权指令设置 <code>Base</code>、<code>Bound</code> 及用户态 PC \(\to\) 执行特权指令 <b>RTU（Return To Usermode）</b> 切换至用户态运行。</p>

<h3>5.2 从用户态进入内核态的三种控制转移方式</h3>
<table>
<thead><tr><th>转移方式</th><th>触发源与同步性</th><th>典型实例</th></tr></thead>
<tbody>
<tr><td><b>系统调用（Syscall）</b></td><td>同步；由当前进程主动执行 <code>syscall</code> 指令发起服务请求</td><td>调用 <code>exit</code>、<code>read</code>、<code>write</code>、<code>fork</code></td></tr>
<tr><td><b>中断（Interrupt）</b></td><td>异步；由处理器外部硬件事件触发，与当前正在执行的指令无关</td><td>硬件定时器到期、磁盘/网卡 I/O 完成通知</td></tr>
<tr><td><b>陷阱 / 异常（Trap / Exception）</b></td><td>同步；由当前指令执行期间产生的内部错误或特定条件触发</td><td>除以零、非法指令、内存访问越界（保护违例 / 缺页）</td></tr>
</tbody>
</table>
<p><b>中断向量表（Interrupt Vector Table）</b>：上述三种转移均为<b>非编程控制转移</b>——用户程序不能自行指定跳转到内核中的任意地址（否则可绕过权限检查）。硬件根据事件编号 \(i\)（中断号/异常号/系统调用入口）查阅由内核在内存中预先设置好的中断向量表，原子地切换到内核态并将 PC 设置为对应的内核处理函数 <code>intrpHandler_i()</code>。</p>

<h2>考前清单</h2>
<ul>
<li>四个基本概念的精确定义：线程、地址空间（四段布局与增长方向）、进程（并发与保护分解）、双模式。</li>
<li>用户态禁止的四类特权操作；Base and Bound 的两种实现版本及 RTU 指令的作用。</li>
<li>三种进入内核的方式（系统调用、中断、异常）的同步/异步属性与触发原因；中断向量表的安全作用。</li>
</ul>
`,
  questions: [
    { id: "q1", tag: "slide", kind: "single", q: String.raw`操作系统中“线程（Thread）”的准确定义是`, choices: [["a", "一个受保护的虚拟地址空间"], ["b", "单个独立的执行上下文（包含 PC、寄存器、执行标志与栈）"], ["c", "一组打开的文件描述符"], ["d", "磁盘上的一个可执行文件"]], answer: ["b"], why: String.raw`地址空间与文件描述符属于进程；线程是处理器的执行上下文。` },
    { id: "q2", tag: "slide", kind: "single", q: String.raw`操作系统中“进程（Process）”的定义是`, choices: [["a", "单个执行线程"], ["b", "一个地址空间 + 一个或多个线程，并具有受限的执行权限"], ["c", "一段只读的机器指令"]], answer: ["b"], why: String.raw`进程将保护域（地址空间等资源）与一个或多个执行流（线程）结合在一起。` },
    { id: "q3", tag: "slide", kind: "multi", q: String.raw`下列哪些操作在处理器处于用户态（User Mode）时被硬件禁止？`, choices: [["a", "修改页表基址寄存器或 Base/Bound 寄存器"], ["b", "关闭处理器硬件中断"], ["c", "直接读写物理 I/O 设备端口"], ["d", "修改当前线程栈帧中的局部变量"]], answer: ["a", "b", "c"], why: String.raw`(a)(b)(c) 均为特权操作，仅允许在内核态执行；(d) 为普通内存访问。` },
    { id: "q4", tag: "slide", kind: "single", q: String.raw`用户程序执行指令时发生“除以零”从而陷入内核，这属于`, choices: [["a", "系统调用（Syscall）"], ["b", "中断（Interrupt）"], ["c", "陷阱/异常（Trap/Exception）"]], answer: ["c"], why: String.raw`由当前指令自身错误同步引发的控制转移称为异常（Exception/Trap）。` },
    { id: "q5", tag: "slide", kind: "single", q: String.raw`硬件定时器计数到期导致处理器进入内核，这属于`, choices: [["a", "系统调用（Syscall）"], ["b", "中断（Interrupt）"], ["c", "陷阱/异常（Trap/Exception）"]], answer: ["b"], why: String.raw`定时器是外部硬件产生的异步事件，属于中断。` },
    { id: "q6", tag: "slide", kind: "tf", q: String.raw`用户态程序发起系统调用时，可以直接通过跳转指令跳转到内核任意函数的内存地址。`, answer: ["f"], why: String.raw`用户程序不知道也无权指定内核跳转目标；必须把系统调用号放入寄存器并执行 <code>syscall</code> 指令，由硬件经中断向量表跳转到受控的固定内核入口。` },
    { id: "q7", tag: "slide", kind: "single", q: String.raw`在 Base and Bound 的“硬件地址转换”版本中，程序访问虚拟地址 &lt;code&gt;addr&lt;/code&gt; 时对应的物理地址为`, choices: [["a", "<code>addr</code>"], ["b", "<code>Base + addr</code>（且需满足小于 <code>Bound</code>）"], ["c", "<code>Bound - addr</code>"]], answer: ["b"], why: String.raw`硬件在运行时自动将虚拟地址加上 <code>Base</code>，并检查结果是否越过 <code>Bound</code>。` },
    { id: "q8", tag: "slide", kind: "tf", q: String.raw`Base and Bound 的“加载时重定位”版本在每次内存访问时都需要硬件执行一次加法运算。`, answer: ["f"], why: String.raw`加载时重定位已由加载器将地址改写为物理地址，运行时硬件只做上下界比较，不做加法。` },
    { id: "q9", tag: "slide", kind: "single", q: String.raw`操作系统隔离不同进程内存访问的最主要机制是`, choices: [["a", "限制从程序虚拟地址空间到物理内存的地址转换"], ["b", "要求每个程序定期调用 yield"], ["c", "为每个进程配备独立的物理 CPU"]], answer: ["a"], why: String.raw`受控的地址转换使进程无法构造指向其他进程或内核物理内存的引用。` },
    { id: "q10", tag: "slide", kind: "multi", q: String.raw`在同一个进程地址空间中创建多个线程的主要目的包括`, choices: [["a", "在多核处理器上实现并行计算"], ["b", "将阻塞式 I/O 与计算重叠以隐藏延迟"], ["c", "使各线程的内存相互隔离以防止故障扩散"]], answer: ["a", "b"], why: String.raw`同一进程内的线程共享同一地址空间，彼此之间没有内存隔离。` },
    { id: "q11", tag: "slide", kind: "single", q: String.raw`在 &lt;code&gt;main&lt;/code&gt; 函数中执行 &lt;code&gt;int *p = malloc(sizeof(int));&lt;/code&gt;，指针变量 &lt;code&gt;p&lt;/code&gt; 本身与 &lt;code&gt;*p&lt;/code&gt; 所在内存块分别位于`, choices: [["a", "栈、堆"], ["b", "堆、栈"], ["c", "静态数据段、堆"]], answer: ["a"], why: String.raw`局部变量 <code>p</code> 分配在 <code>main</code> 的栈帧中；<code>malloc</code> 动态分配的内存块位于堆中。` }
  ],
  cards: [
    [String.raw`线程（Thread）的定义`, String.raw`单个独立的执行上下文：PC、通用寄存器、执行标志位、栈。`],
    [String.raw`地址空间的四段典型布局`, String.raw`代码段、静态数据段、堆（向上增长）、栈（向下增长）。`],
    [String.raw`进程（Process）的定义`, String.raw`受限权限的程序执行环境 = 一个受保护的地址空间 + 一个或多个线程。`],
    [String.raw`线程与地址空间的功能分工`, String.raw`线程封装并发（主动执行流）；地址空间封装保护与隔离（被动资源边界）。`],
    [String.raw`双模式运行（Dual Mode）`, String.raw`硬件区分用户态与内核态；用户态下禁止修改地址转换、开关中断和直接访问硬件。`],
    [String.raw`进入内核的三种方式`, String.raw`系统调用（同步、主动请求）、中断（异步、外部硬件事件）、异常/陷阱（同步、指令内部错误）。`],
    [String.raw`中断向量表的作用`, String.raw`按事件号索引固定的内核处理函数地址，强制用户态只能从预定入口进入内核。`],
    [String.raw`Base and Bound 硬件翻译规则`, String.raw`\(\text{物理地址}=\text{Base}+\text{虚拟地址}\)，且必须满足 \(\text{Base}\le\text{物理地址}&lt;\text{Bound}\)。`],
    [String.raw`RTU（Return To Usermode）`, String.raw`内核设置好 Base/Bound 与用户 PC 后切换回用户态的特权指令。`]
  ]
});
