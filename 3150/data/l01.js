Review.add({
  id: "l01", group: "lecture", n: 1,
  short: "L1 导论与角色",
  title: "Lecture 1 · 操作系统导论：功能分类与评价指标",
  meta: "9 月 8 日 · Introduction",
  sources: [{ label: "lec01 课件", href: "materials/lectures/lec01-introduction.pdf" }],
  html: String.raw`
<p class="lede">本讲定义操作系统的位置与职能，将操作系统的核心功能划分为三类（资源隔离与分配、硬件虚拟化、公共基础服务），通过 <code>cpu.c</code> 与 <code>memory.c</code> 两个实验展示处理器与内存虚拟化的外部表现，并给出操作系统的六项评价指标。</p>

<h2>1. 课程结构与考核规则</h2>
<ul>
<li>成绩构成：4 个基于 MIT xv6 的个人编程项目各占 12.5%（共 50%，含设计文档与源码）、期中笔试占 20%（11 月 5 日）、期末上机考试占 30%。</li>
<li>编程语言要求：熟练掌握 C 语言指针（含函数指针与 <code>void*</code> 泛型指针）、动态内存管理（<code>malloc</code>/<code>free</code>）以及栈与堆的内存分布。</li>
<li>学术诚信要求：允许讨论概念与通用算法，严禁共享、阅读或复制他人及网络上的项目代码与测试用例。</li>
</ul>

<h2>2. 操作系统的设计背景与定义</h2>
<ul>
<li><b>硬件形态的多样性</b>（Bell 定律）：计算平台每隔约十年演进出新的形态（大型机、小型机、工作站、个人电脑、移动设备、物联网设备），操作系统需在异构硬件之上向应用提供一致的编程接口。</li>
<li><b>存储与通信延迟跨越 8 个数量级</b>：CPU 寄存器与 L1 缓存访问为纳秒（\(10^{-9}\text{ s}\)）量级，主存访问约 \(100\text{ ns}\)，固态硬盘（SSD）I/O 为微秒（\(10^{-4}\text{ s}\)）量级，机械硬盘寻道为毫秒（\(10^{-2}\text{ s}\)）量级，跨洲网络往返约 \(150\text{ ms}\)。操作系统需要通过调度与缓冲管理这些速度差异。</li>
<li><b>操作系统的两条定义</b>：
  <ol>
  <li><b>软件层视角</b>：操作系统是连接上层多个应用程序与底层多样化硬件资源的系统软件层。</li>
  <li><b>抽象机视角</b>：操作系统为应用程序实现一台虚拟机器（Virtual Machine），提供比底层物理硬件更易移植、更可靠、更安全的接口。</li>
  </ol>
</li>
</ul>

<h2>3. 操作系统的三类核心功能</h2>
<p>课程讲义将操作系统的功能归纳为以下三个方面（课件中分别记为 Referee、Illusionist、Glue）：</p>
<table>
<thead><tr><th>功能类别（课件术语）</th><th>核心职责</th><th>对应的内核机制</th></tr></thead>
<tbody>
<tr><td><b>资源管理与隔离（Referee）</b></td><td>在多个互不信任的应用之间分配物理资源，实施故障隔离与访问控制</td><td>进程隔离、双模式（用户态/内核态）执行、CPU 调度策略、受控的进程间通信（管道、套接字）</td></tr>
<tr><td><b>硬件虚拟化（Illusionist）</b></td><td>隐藏物理硬件的数量与容量限制，为每个程序提供独立、连续的资源视图</td><td>虚拟处理器（时间分片复用）、虚拟地址空间（页表映射与按需分页）</td></tr>
<tr><td><b>公共服务层（Glue）</b></td><td>提供标准化的系统服务接口，促进代码复用与模块独立演进</td><td>文件系统、网络协议栈、设备驱动接口、图形与命令行界面</td></tr>
</tbody>
</table>

<h3>3.1 实验一：处理器分片复用（<code>cpu.c</code>）</h3>
<p>程序在无限循环中打印命令行传入的字符串。在单核环境下同时后台启动三个进程 <code>./cpu A &amp; ./cpu B &amp; ./cpu C</code>，终端交替输出 <code>A</code>、<code>B</code>、<code>C</code>，且每次运行的交错顺序不确定。这是因为操作系统利用硬件<b>定时器中断</b>周期性地夺回 CPU 控制权并切换运行进程。</p>
<p>对比：在早期的协同式多任务系统（如 MacOS 9、Windows 3.1）中，操作系统未启用定时器抢占，必须等待进程主动调用 <code>yield</code> 让出 CPU；此时一旦某个进程进入无系统调用的死循环，其余进程将永久无法获得 CPU。</p>

<h3>3.2 实验二：独立虚拟地址空间（<code>memory.c</code>）</h3>
<p>程序调用 <code>malloc</code> 分配一个整型变量，打印其进程 PID 与指针地址，并在循环中递增该整数。关闭地址空间布局随机化（ASLR）后同时运行两个进程，二者打印出<b>完全相同的内存地址</b>（如 <code>0x200000</code>），但各自的整数值独立从 1 开始递增，互不覆盖。这是因为操作系统为每个进程维护了独立的<b>虚拟地址空间</b>，将相同的虚拟地址映射到不同的物理内存区域。</p>

<h2>4. 操作系统的六项评价指标</h2>
<ul>
<li><b>开销（Overhead）</b>：实现虚拟化、保护和服务抽象所额外消耗的 CPU 时间与内存空间。</li>
<li><b>公平性（Fairness）</b>：CPU、内存和 I/O 带宽在多个竞争进程之间分配的均衡程度。</li>
<li><b>可移植性（Portability）</b>：底层硬件变更时上层应用无需修改即可运行的能力。操作系统对上提供稳定的抽象接口，对下通过硬件抽象层（HAL）封装硬件差异。</li>
<li><b>可靠性（Reliability）</b>：系统持续按规范工作的能力，通常由平均无故障时间（MTTF）和平均修复时间（MTTR）共同决定可用性（Availability）。</li>
<li><b>安全性（Security）</b>：系统在恶意攻击下保持正确功能的能力，包含<b>完整性</b>（系统运行与数据不被未授权篡改）与<b>隐私性/机密性</b>（数据仅能被授权主体读取）。</li>
<li><b>性能（Performance）</b>：包含三个子指标——<b>响应时间（Response Time / Latency）</b>（单个任务从提交到完成的时间）、<b>吞吐量（Throughput）</b>（单位时间内完成的任务数量）、<b>可预测性（Predictability）</b>（性能指标随时间波动的方差大小）。</li>
</ul>

<h2>5. AI 计算时代对操作系统的需求</h2>
<p>根据 Rich Sutton 的总结（The Bitter Lesson），人工智能性能的提升主要随可用计算量的增长而扩展。当前 AI 训练与推理的算力需求增速远超单芯片摩尔定律，推动计算基础设施向异构加速器（GPU/TPU/NPU）与大规模集群扩展，这要求操作系统与系统软件在调度、内存管理、并行通信与容错上做出相应演进。</p>

<h2>考前清单</h2>
<ul>
<li>操作系统的两条定义与三类核心功能（资源管理与隔离、硬件虚拟化、公共基础服务）及其对应机制。</li>
<li><code>cpu.c</code>（抢占式时间分片 vs 协同式多任务）与 <code>memory.c</code>（独立虚拟地址空间映射到不同物理内存）的原理。</li>
<li>六项评价指标；可靠性（MTTF/MTTR）、安全性（完整性/隐私性）、性能（响应时间/吞吐量/可预测性）的子指标区分。</li>
</ul>
`,
  questions: [
    { id: "q1", tag: "slide", kind: "single", q: String.raw`在多个互不信任的应用程序之间实施故障隔离、访问控制与资源分配，对应操作系统的哪一类功能？`, choices: [["a", "资源管理与隔离（Referee）"], ["b", "硬件虚拟化（Illusionist）"], ["c", "公共基础服务（Glue）"]], answer: ["a"], why: String.raw`Referee 负责隔离、保护与资源分配；Illusionist 负责虚拟化硬件；Glue 提供文件系统、网络等公共服务。` },
    { id: "q2", tag: "slide", kind: "single", q: String.raw`两个并发运行的 &lt;code&gt;memory.c&lt;/code&gt; 进程打印出相同的指针地址，但各自修改该地址处的值互不影响，原因是`, choices: [["a", "两个进程共享同一块物理内存"], ["b", "每个进程拥有独立的虚拟地址空间，相同虚拟地址被映射到不同物理内存"], ["c", "malloc 返回的是 CPU 寄存器编号"]], answer: ["b"], why: String.raw`操作系统通过虚拟内存机制将不同进程的同一虚拟地址翻译到不同的物理内存位置。` },
    { id: "q3", tag: "slide", kind: "tf", q: String.raw`在未采用定时器中断抢占的协同式系统（如 Windows 3.1）上，一个不调用系统调用的死循环程序会导致其他程序无法获得 CPU。`, answer: ["t"], why: String.raw`协同式多任务依赖程序主动让出 CPU，无硬件定时器中断时内核无法强制夺回控制权。` },
    { id: "q4", tag: "slide", kind: "multi", q: String.raw`下列哪些属于操作系统提供的公共基础服务（Glue）？`, choices: [["a", "文件系统"], ["b", "网络协议栈"], ["c", "进程间内存保护边界"], ["d", "图形用户界面"]], answer: ["a", "b", "d"], why: String.raw`进程间内存保护属于资源隔离（Referee）职责。` },
    { id: "q5", tag: "slide", kind: "single", q: String.raw`系统可用性（Availability）主要由哪两个指标度量？`, choices: [["a", "响应时间与吞吐量"], ["b", "平均无故障时间（MTTF）与平均修复时间（MTTR）"], ["c", "完整性与机密性"]], answer: ["b"], why: String.raw`MTTF 与 MTTR 度量可靠性与可用性；(a) 为性能指标，(c) 为安全性指标。` },
    { id: "q6", tag: "slide", kind: "single", q: String.raw`“单位时间内系统完成的任务总数”对应的性能指标是`, choices: [["a", "响应时间（Response Time）"], ["b", "吞吐量（Throughput）"], ["c", "可预测性（Predictability）"]], answer: ["b"], why: String.raw`响应时间度量单个任务的耗时，吞吐量度量单位时间完成的任务数。` },
    { id: "q7", tag: "slide", kind: "tf", q: String.raw`执行 &lt;code&gt;./cpu A &amp; ./cpu B &amp; ./cpu C&lt;/code&gt; 时，终端上 A、B、C 的输出先后顺序在每次运行中都是固定不变的。`, answer: ["f"], why: String.raw`输出顺序取决于定时器中断到达时刻与内核调度器的决策，具有非确定性。` },
    { id: "q8", tag: "slide", kind: "single", q: String.raw`操作系统通过硬件抽象层（HAL）屏蔽底层硬件差异，使应用程序无需随硬件更换而重写，这体现了`, choices: [["a", "可移植性（Portability）"], ["b", "安全性（Security）"], ["c", "公平性（Fairness）"]], answer: ["a"], why: String.raw`可移植性衡量硬件变化时上层软件所需修改的程度。` }
  ],
  cards: [
    [String.raw`操作系统的抽象机定义`, String.raw`在物理硬件之上实现一台虚拟机器，提供可移植、可靠、安全的编程接口。`],
    [String.raw`操作系统的三类核心功能`, String.raw`资源管理与隔离（Referee）、硬件虚拟化（Illusionist）、公共基础服务（Glue）。`],
    [String.raw`<code>cpu.c</code> 实验的结论`, String.raw`操作系统依靠硬件定时器中断强制抢占并分片复用 CPU；输出交错顺序不确定。`],
    [String.raw`<code>memory.c</code> 实验的结论`, String.raw`每个进程拥有独立的虚拟地址空间，相同虚拟地址映射到不同物理内存。`],
    [String.raw`操作系统的六项评价指标`, String.raw`开销、公平性、可移植性、可靠性（MTTF/MTTR）、安全性（完整性/隐私性）、性能。`],
    [String.raw`性能的三个子指标`, String.raw`响应时间（单任务耗时）、吞吐量（单位时间完成任务数）、可预测性（性能稳定性）。`]
  ]
});
