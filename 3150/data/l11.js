Review.add({
  id: "l11", group: "lecture", n: 11,
  short: "L11 调度策略 I",
  title: "Lecture 11 · CPU 调度基础与经典策略：FCFS、RR、严格优先级与 SJF/SRTF",
  meta: "10 月 20 日 · Scheduling 1: Concepts and Classic Policies",
  sources: [{ label: "lec11 课件", href: "materials/lectures/lec11-scheduling1.pdf" }],
  html: String.raw`
<p class="lede">本讲系统建立操作系统调度的核心框架与四大经典策略：(1) CPU–I/O 突发交替执行模型与三项核心调度目标（最小化响应时间、最大化吞吐量、公平性）的内在权衡；(2) 先来先服务（FCFS/FIFO）与护航效应（Convoy Effect）；(3) 时间片轮转（Round Robin, RR）的内核实现、时间片选取权衡及与 FCFS 在不同负载下的对比；(4) 严格优先级调度（Strict Priority）的饥饿与优先级反转（Priority Inversion）问题；(5) 最短作业优先（SJF）与最短剩余时间优先（SRTF）的最优性、磁盘利用率经典算例及指数平均预测公式。</p>

<h2>1. CPU–I/O 突发模型与调度目标权衡（Slides 3–6）</h2>
<ul>
<li><b>CPU 突发（CPU Burst）与 I/O 突发交替模型</b>：程序执行并非持续占用 CPU，而是由“一段 CPU 计算（CPU Burst）”与“阻塞等待 I/O 完成（I/O Burst）”交替组成。经验分布表明，实际系统中<b>绝大多数 CPU 突发都非常短（Weighted toward small bursts）</b>，只有少数计算密集型任务具有很长的 CPU 突发。每次调度决策的本质，是从就绪队列中选出下一个获得 CPU 以执行其下一段 CPU 突发的线程（在分时抢占下，线程也可能在当前 CPU 突发尚未结束时被强制剥夺 CPU）。</li>
<li><b>三大调度目标及其相互冲突</b>：
  <ol>
    <li><b>最小化响应时间（Minimize Response Time）</b>：尽可能缩短从用户发起操作到看到结果的耗时（如编辑器按键回显、编译程序、实时任务满足外部世界截止期）。</li>
    <li><b>最大化吞吐量（Maximize Throughput）</b>：最大化单位时间内完成的作业数。这包含两个要素：(i) <b>最小化系统开销</b>（如上下文切换与缓存失效开销）；(ii) <b>高效利用所有硬件资源</b>（同时保持 CPU、磁盘、内存高利用率）。<br>
    <i>与响应时间的冲突</i>：为最小化响应时间而频繁抢占会导致大量上下文切换开销，反而降低吞吐量。</li>
    <li><b>公平性（Fairness）</b>：按某种均等或合乎比例的方式在用户/任务间分享 CPU。<br>
    <i>与平均响应时间的冲突</i>：<b>公平并不等于最小化平均响应时间！</b>通过“不公平”地优先服务短任务、推迟长任务（如 SRTF），反而能获得更低的平均响应时间。</li>
  </ol>
</li>
</ul>

<h2>2. 先来先服务（FCFS / FIFO）与护航效应（Slides 7–10）</h2>
<p>FCFS（First-Come, First-Served，早期指运行至整个程序结束，现代指一直占用 CPU 直至线程主动阻塞或退出）是最简单的非抢占式调度策略，但对到达顺序极其敏感。</p>

<details class="solve" open><summary>课件算例 1：到达顺序如何剧烈改变 FCFS 的等待与完成时间（Slides 8–10）</summary><div>
<p>设有三个进程，CPU 突发时间分别为 \(P_1 = 24,\; P_2 = 3,\; P_3 = 3\)：</p>
<ul>
  <li><b>情形 1（到达顺序 \(P_1, P_2, P_3\)）</b>：甘特图为 <code>P1(0–24) → P2(24–27) → P3(27–30)</code>。
    <ul>
      <li>各进程等待时间：\(P_1 = 0,\; P_2 = 24,\; P_3 = 27\)，<b>平均等待时间</b> \(= (0 + 24 + 27)/3 = \mathbf{17}\)。</li>
      <li>各进程完成时间：\(P_1 = 24,\; P_2 = 27,\; P_3 = 30\)，<b>平均完成时间</b> \(= (24 + 27 + 30)/3 = \mathbf{27}\)。</li>
    </ul>
  </li>
  <li><b>情形 2（到达顺序 \(P_2, P_3, P_1\)）</b>：甘特图为 <code>P2(0–3) → P3(3–6) → P1(6–30)</code>。
    <ul>
      <li>各进程等待时间：\(P_1 = 6,\; P_2 = 0,\; P_3 = 3\)，<b>平均等待时间</b> \(= (6 + 0 + 3)/3 = \mathbf{3}\)。</li>
      <li>各进程完成时间：\(P_2 = 3,\; P_3 = 6,\; P_1 = 30\)，<b>平均完成时间</b> \(= (3 + 6 + 30)/3 = \mathbf{13}\)。</li>
    </ul>
  </li>
</ul>
<p><b>护航效应（Convoy Effect）</b>：就像在便利店只买一瓶牛奶却排在推着满购物车顾客的后面，在 FCFS 下，一旦长计算任务抢先占领 CPU，后续到达的所有短任务都被迫排在其后漫长等待，导致平均等待时间与平均完成时间严重恶化。</p>
</div></details>

<h2>3. 时间片轮转（Round Robin, RR）与时间片选择（Slides 11–18）</h2>
<h3>3.1 基本机制与性质</h3>
<ul>
  <li><b>抢占式轮转</b>：为每个就绪进程分配一个固定的小时间片（Time Quantum）\(q\)（通常为 \(10\text{–}100\text{ ms}\)）。当时间片耗尽时，内核通过<b>硬件定时器中断（Timer Interrupt）</b>强制抢占当前进程，并将其追加到 FIFO 就绪队列的末尾（这也是 Project 2 要求实现的机制）。</li>
  <li><b>有界等待性质</b>：若就绪队列中有 \(n\) 个进程且时间片为 \(q\)，则每个进程获得 \(1/n\) 的 CPU 份额（每次最多连续运行 \(q\)），且<b>任何一个进程等待下一次上 CPU 的时间绝不超过 \((n-1)q\)</b>。</li>
</ul>

<details class="solve" open><summary>课件算例 2：\(q = 20\) 下的 RR 甘特图与等待/完成时间计算（Slide 13）</summary><div>
<p>设四个进程在时刻 0 同时到达，突发时间分别为 \(P_1 = 53,\; P_2 = 8,\; P_3 = 68,\; P_4 = 24\)，时间片 \(q = 20\)：</p>
<p><b>甘特图执行序列</b>：</p>
<pre>P1(0–20) → P2(20–28, 完成!) → P3(28–48) → P4(48–68)
→ P1(68–88) → P3(88–108) → P4(108–112, 完成!)
→ P1(112–125, 完成!) → P3(125–145) → P3(145–153, 完成!)</pre>
<ul>
  <li><b>完成时间（Completion Time）</b>：\(P_1 = 125,\; P_2 = 28,\; P_3 = 153,\; P_4 = 112\)，<b>平均完成时间</b> \(= (125 + 28 + 153 + 112)/4 = \mathbf{104.25}\)。</li>
  <li><b>等待时间（Waiting Time）</b>：
    <ul>
      <li>\(P_1 = (68 - 20) + (112 - 88) = 48 + 24 = \mathbf{72}\)（或直接用 \(125 - 53 = 72\)）；</li>
      <li>\(P_2 = 20 - 0 = \mathbf{20}\)；</li>
      <li>\(P_3 = (28 - 0) + (88 - 48) + (125 - 108) = 28 + 40 + 17 = \mathbf{85}\)（即 \(153 - 68 = 85\)）；</li>
      <li>\(P_4 = (48 - 0) + (108 - 68) = 48 + 40 = \mathbf{88}\)（即 \(112 - 24 = 88\)）。</li>
    </ul>
    <b>平均等待时间</b> \(= (72 + 20 + 85 + 88)/4 = \mathbf{66.25}\)。
  </li>
</ul>
</div></details>

<h3>3.2 时间片 \(q\) 的选取与 FCFS vs. RR 深度对比（Slides 15–18）</h3>
<ul>
  <li><b>时间片 \(q\) 过大 vs. 过小</b>：
    <ul>
      <li>若 \(q \to \infty\)（或大于所有突发长度）：RR <b>退化为 FCFS/FIFO</b>，短任务响应时间恶化（早期 UNIX 曾取 \(q = 1\text{ s}\)，当有 3 个编译任务运行时，敲击键盘需 3 秒才能回显）。</li>
      <li>若 \(q\) 过小：必须远大于上下文切换耗时，否则 CPU 时间几乎全部浪费在上下文切换开销上，<b>吞吐量急剧崩溃</b>。</li>
      <li><b>现代工程经验值</b>：上下文切换耗时通常为 \(0.1\text{ ms–}1\text{ ms}\)，现代操作系统取时间片 \(q \in [10\text{ ms}, 100\text{ ms}]\)，从而将上下文切换开销控制在约 <b>\(1\%\)</b>。</li>
    </ul>
  </li>
  <li><b>关键反直觉结论（Slide 17）：即便假设上下文切换零开销（Zero-cost context switch），RR 的平均完成时间也并非总是优于 FCFS！</b>
    <ul>
      <li><b>等长作业反例</b>：设有 \(10\) 个作业同时在时刻 \(0\) 到达，每个作业均需 \(100\text{ s}\) CPU 时间，RR 时间片为 \(1\text{ s}\)。</li>
      <li>在 <b>FCFS</b> 下，10 个作业依次在 \(100, 200, 300, \dots, 1000\text{ s}\) 完成，平均完成时间为 \(\frac{100 + 1000}{2} = \mathbf{550\text{ s}}\)。</li>
      <li>在 <b>RR（\(q=1\text{ s}\)）</b> 下，10 个作业齐头并进，直到第 99 轮结束（\(990\text{ s}\)）时尚无任何作业完成，最终在 \(991, 992, \dots, 1000\text{ s}\) 才陆续完成，平均完成时间高达 \(\mathbf{995.5\text{ s}}\)！</li>
      <li><b>结论</b>：当所有作业长度相同时，RR 的平均完成（周转）时间远差于 FCFS！</li>
    </ul>
  </li>
</ul>

<h2>4. 严格优先级调度与优先级反转（Slides 19–23）</h2>
<ul>
  <li><b>严格优先级调度（Strict Priority Scheduling）</b>：维护多个优先级队列（如 Priority 3 最高，Priority 0 最低），<b>始终优先执行最高优先级非空队列中的就绪作业</b>（同一优先级队列内部可用 RR）。</li>
  <li><b>两大核心缺陷（Slide 20）</b>：
    <ol>
      <li><b>饥饿（Starvation）</b>：只要高优先级队列不断有作业就绪，低优先级作业就永远得不到 CPU（传闻 1973 年关闭 MIT 的 Multics 主机时，发现一个 10 年前提交的低优先级作业从未被运行过）。</li>
      <li><b>优先级反转（Priority Inversion，导致死锁/无限阻塞）</b>：当<b>低优先级任务 \(T_L\) 持有高优先级任务 \(T_H\) 所需的互斥锁</b>时，\(T_H\) 因等待锁而阻塞；此时若存在一个<b>与该锁无关的中优先级计算任务 \(T_M\)</b> 就绪，\(T_M\) 会抢占 \(T_L\) 的 CPU，导致 \(T_L\) 无法运行去释放锁，从而使高优先级任务 \(T_H\) 被中优先级任务 \(T_M\) 间接阻塞！</li>
    </ol>
  </li>
  <li><b>改进方向与陷阱（Slides 21–23）</b>：可通过动态调整优先级（基于交互性、持锁状态或等待时间提升优先级）来缓解。但朴素的“长期得不到服务就提升优先级”在<b>系统过载（Overloaded）</b>时会失效——因为所有作业都得不到足够 CPU，导致所有作业的优先级一齐上升，最终交互式短作业依然受困。</li>
</ul>

<h2>5. 最短作业优先（SJF）与最短剩余时间优先（SRTF）（Slides 24–35）</h2>
<h3>5.1 定义与最优性</h3>
<ul>
  <li><b>SJF（Shortest Job First / STCF，非抢占）</b>：每次选择剩余计算量最少的作业运行。</li>
  <li><b>SRTF（Shortest Remaining Time First / SRTCF，抢占式 SJF）</b>：当新作业到达就绪队列时，若其所需完成时间<b>小于当前运行作业的剩余完成时间</b>，立即抢占当前 CPU。</li>
  <li><b>理论最优性（Slide 26）</b>：在最小化<b>平均响应（完成/周转）时间</b>指标上，SJF 在非抢占策略中最优，<b>SRTF 在所有可能策略中全局最优</b>（因此常作为评估其他调度算法的理论标尺 Yardstick）。当所有作业长度相同时，SRTF 退化为 FCFS。</li>
</ul>

<h3>5.2 经典算例：SRTF 如何同时最大化 CPU 与磁盘利用率（Slides 27–29）</h3>
<div class="callout ex">
  <strong>课件核心算例（必考：计算密集任务 A、B 与 I/O 密集任务 C 混合调度）</strong>
  <p>设系统中有三个任务：</p>
  <ul>
    <li><b>任务 A、B</b>：纯 CPU 密集型（CPU-bound），各自需要连续运行一整周；</li>
    <li><b>任务 C</b>：I/O 密集型（I/O-bound），不断循环执行“<b>\(1\text{ ms}\) CPU 计算 \(\to\) \(9\text{ ms}\) 磁盘 I/O</b>”（单独运行时磁盘利用率为 \(9/10 = 90\%\)）。</li>
  </ul>
  <p>比较四种策略下的系统资源利用率：</p>
  <table>
    <thead><tr><th>调度策略</th><th>运行过程分析</th><th>磁盘利用率（Disk Utilization）</th></tr></thead>
    <tbody>
      <tr><td><b>FCFS / FIFO</b></td><td>一旦 A 或 B 获得 CPU，将独占两周时间，C 完全无法运行</td><td>\(\approx 0\%\)（极差）</td></tr>
      <tr><td><b>RR（\(q = 100\text{ ms}\)）</b></td><td>C 运行 \(1\text{ ms}\) 发起 \(9\text{ ms}\) 磁盘 I/O 后，必须等待 A 跑完 \(100\text{ ms}\) 再加 B 跑完 \(100\text{ ms}\)（共 \(200\text{ ms}\)）才能再次运行 \(1\text{ ms}\)</td><td>\(\dfrac{9}{100 + 100 + 1} = \dfrac{9}{201} \approx \mathbf{4.5\%}\)（很差）</td></tr>
      <tr><td><b>RR（\(q = 1\text{ ms}\)）</b></td><td>每 \(1\text{ ms}\) 切换一次 A 与 B，使 C 在 \(9\text{ ms}\) I/O 结束时能很快获得 CPU，但在 A、B 之间产生了海量无意义的定时器中断与上下文切换开销</td><td>\(\approx \mathbf{90\%}\)，但<b>唤醒与切换开销极大（Lots of wakeups!）</b></td></tr>
      <tr><td><b>SRTF</b></td><td>C 的每次 CPU 突发仅需 \(1\text{ ms}\)，远小于 A、B 的剩余时间；故每当 C 完成 \(9\text{ ms}\) I/O 就绪时，<b>立即抢占 A 或 B 运行 \(1\text{ ms}\)</b>，其余时间 A/B 无额外切换地满载运行</td><td>\(\mathbf{90\%}\) 磁盘利用率 + \(\mathbf{100\%}\) CPU 利用率（完美！）</td></tr>
    </tbody>
  </table>
</div>

<h3>5.3 SRTF 的局限与指数平均预测（Slides 30–34）</h3>
<ul>
  <li><b>SRTF 的三大缺点</b>：(1) <b>饥饿</b>（源源不断的短任务会使长任务永远得不到运行）；(2) <b>不公平</b>；(3) <b>需要预知未来</b>（若让用户自报时长，用户会谎报短时长，即使超时杀死重跑也难以准确预估）。</li>
  <li><b>利用过去预测未来：指数平均法（Exponential Averaging，Slide 34）</b>：由于程序行为具有局部可预测性（过去是 I/O 密集型则未来大概率仍是），可用历史 CPU 突发实测长度 \(t_{n-1}\) 与上一轮预测值 \(\tau_{n-1}\)（课件记作 \(t_n = \alpha t_{n-1} + (1-\alpha)t_{n-2}\)）预测下一次突发长度：
  <div class="formula">\[\tau_n = \alpha\, t_{n-1} + (1 - \alpha)\,\tau_{n-1} \qquad (0 &lt; \alpha &lt; 1).\]</div>
  观测到短 CPU 突发 \(\implies\) 判定为交互式应用 \(\implies\) 赋予高优先级。</li>
</ul>
`,
  questions: [
    {
      id: "l11-q1",
      tag: "slide",
      kind: "single",
      q: String.raw`（Lec11 Slide 28–29）系统中同时有纯 CPU 密集型长任务 A、B，以及不断循环“\(1\text{ ms}\) CPU + \(9\text{ ms}\) 磁盘 I/O”的任务 C。若采用时间片 \(q = 100\text{ ms}\) 的 Round Robin 调度，磁盘利用率约为多少？`,
      choices: [
        ["a", String.raw`\(9 / 201 \approx 4.5\%\)`],
        ["b", String.raw`\(9 / 10 = 90\%\)`],
        ["c", String.raw`\(9 / 101 \approx 8.9\%\)`],
        ["d", String.raw`\(100\%\)`]
      ],
      answer: ["a"],
      why: String.raw`在 \(q=100\text{ ms}\) 的 RR 下，C 运行 \(1\text{ ms}\) 触发 \(9\text{ ms}\) I/O 让出 CPU 后，A 连续运行 \(100\text{ ms}\)、B 连续运行 \(100\text{ ms}\)，合计每 \(201\text{ ms}\) 周期内磁盘仅工作 \(9\text{ ms}\)，利用率为 \(9/201 \approx 4.5\%\)。`
    },
    {
      id: "l11-q2",
      tag: "slide",
      kind: "single",
      q: String.raw`（Lec11 Slide 17）假设上下文切换开销为 0。现有 10 个同时在时刻 0 到达的作业，每个作业都需要 \(100\text{ s}\) 的 CPU 时间。比较 FCFS 与时间片 \(q = 1\text{ s}\) 的 RR，下列哪项叙述正确？`,
      choices: [
        ["a", String.raw`两者都在 \(1000\text{ s}\) 完成全部作业，但 RR 的平均完成时间（\(995.5\text{ s}\)）远差于 FCFS（\(550\text{ s}\)）`],
        ["b", String.raw`RR 的平均完成时间严格优于 FCFS`],
        ["c", String.raw`两者的平均完成时间完全相等`],
        ["d", String.raw`FCFS 的最后完成时刻比 RR 更晚`]
      ],
      answer: ["a"],
      why: String.raw`当所有作业长度相同时，RR 会让 10 个作业同步交错推进，直到 \(991, 992, \dots, 1000\text{ s}\) 才陆续完成，平均完成时间高达 \(995.5\text{ s}\)，而 FCFS 在 \(100, 200, \dots, 1000\text{ s}\) 完成，平均仅 \(550\text{ s}\)。`
    },
    {
      id: "l11-q3",
      tag: "slide",
      kind: "single",
      q: String.raw`（Lec11 Slide 13）四个进程 \(P_1=53, P_2=8, P_3=68, P_4=24\) 在时刻 0 同时到达，在时间片 \(q=20\) 的 RR 调度下，四个进程的平均等待时间与平均完成时间分别为：`,
      choices: [
        ["a", String.raw`平均等待时间 \(66.25\)，平均完成时间 \(104.25\)`],
        ["b", String.raw`平均等待时间 \(31.25\)，平均完成时间 \(69.5\)`],
        ["c", String.raw`平均等待时间 \(72\)，平均完成时间 \(125\)`],
        ["d", String.raw`平均等待时间 \(57.25\)，平均完成时间 \(95.5\)`]
      ],
      answer: ["a"],
      why: String.raw`由甘特图得完成时间为 \(P_1=125, P_2=28, P_3=153, P_4=112\)（平均 \(417/4 = 104.25\)）；等待时间为 \(P_1=72, P_2=20, P_3=85, P_4=88\)（平均 \(265/4 = 66.25\)）。`
    },
    {
      id: "l11-q4",
      tag: "slide",
      kind: "tf",
      q: String.raw`（Lec11 Slide 6）在调度策略设计中，“追求公平性（Fairness）”与“最小化平均响应时间（Minimize average response time）”是一致的，越公平则平均响应时间越短。`,
      answer: ["f"],
      why: String.raw`错误！Slide 6 明确指出：Fairness is NOT minimizing average response time —— 通过不公平地优先运行短作业、推迟长作业（如 SRTF），反而可以获得更低的平均响应时间。`
    },
    {
      id: "l11-q5",
      tag: "slide",
      kind: "single",
      q: String.raw`（Lec11 Slide 16）现代操作系统中典型的上下文切换开销与 RR 时间片（Timeslice）范围分别是多少？`,
      choices: [
        ["a", String.raw`上下文切换 \(0.1\text{ ms} \text{–} 1\text{ ms}\)，时间片 \(10\text{ ms} \text{–} 100\text{ ms}\)（切换开销约占 \(1\%\)）`],
        ["b", String.raw`上下文切换 \(10\text{ ms}\)，时间片 \(1000\text{ ms}\)`],
        ["c", String.raw`上下文切换 \(1\text{ ns}\)，时间片 \(1\text{ }\mu\text{s}\)`],
        ["d", String.raw`上下文切换 \(100\text{ ms}\)，时间片 \(10\text{ s}\)`]
      ],
      answer: ["a"],
      why: String.raw`Slide 16 给出典型上下文切换开销为 \(0.1\text{ ms–}1\text{ ms}\)，典型时间片为 \(10\text{ ms–}100\text{ ms}\)，使上下文切换开销占比约为 \(1\%\)。`
    },
    {
      id: "l11-q6",
      tag: "slide",
      kind: "single",
      q: String.raw`（Lec11 Slide 20）在严格优先级调度中，当低优先级任务持有高优先级任务所需的锁，而一个不涉及该锁的中优先级任务抢占了低优先级任务的 CPU，导致高优先级任务无法推进。这一现象称为：`,
      choices: [
        ["a", String.raw`优先级反转（Priority Inversion）`],
        ["b", String.raw`护航效应（Convoy Effect）`],
        ["c", String.raw`时间片饥饿（Quantum Starvation）`],
        ["d", String.raw`颠簸（Thrashing）`]
      ],
      answer: ["a"],
      why: String.raw`高优先级任务因等待低优先级持锁者、而低优先级又被中优先级抢占，称为优先级反转（Priority Inversion）。`
    }
  ],
  cards: [
    [
      String.raw`（Lec11）FCFS 算例：\(P_1=24, P_2=3, P_3=3\) 按 \(P_1, P_2, P_3\) 与 \(P_2, P_3, P_1\) 到达时的平均等待/完成时间`,
      String.raw`\(P_1,P_2,P_3\)：平均等待 \(17\)、平均完成 \(27\)（护航效应）；\(P_2,P_3,P_1\)：平均等待 \(3\)、平均完成 \(13\)。`
    ],
    [
      String.raw`（Lec11）为什么等长作业下 RR 的平均完成时间反而比 FCFS 差得多？`,
      String.raw`10 个 \(100\text{ s}\) 作业在 \(q=1\text{ s}\) RR 下直到 \(991\text{–}1000\text{ s}\) 才集中完成（平均 \(995.5\text{ s}\)），而 FCFS 在 \(100,200,\dots,1000\text{ s}\) 依次完成（平均 \(550\text{ s}\)）。`
    ],
    [
      String.raw`（Lec11）A、B 纯 CPU 密集 + C（\(1\text{ ms}\) CPU + \(9\text{ ms}\) I/O）在 FCFS、RR(\(100\text{ ms}\))、RR(\(1\text{ ms}\))、SRTF 下的磁盘利用率`,
      String.raw`FCFS：\(\approx 0\%\)；RR(\(100\text{ ms}\))：\(9/201 \approx 4.5\%\)；RR(\(1\text{ ms}\))：\(\approx 90\%\) 但唤醒切换开销极大；SRTF：\(90\%\) 且切换最少。`
    ],
    [
      String.raw`（Lec11）如何用指数平均法预测下一次 CPU 突发长度？`,
      String.raw`\(\tau_n = \alpha t_{n-1} + (1 - \alpha)\tau_{n-1}\)（\(0 &lt; \alpha &lt; 1\)），结合上一次实测突发长度 \(t_{n-1}\) 与历史预测值。`
    ]
  ]
});
