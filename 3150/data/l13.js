Review.add({
  id: "l13", group: "lecture", n: 13,
  short: "L13 实时调度与死锁",
  title: "Lecture 13 · 实时调度、多核自旋锁、优先级反转与死锁（RAG、预防、恢复与银行家算法）",
  meta: "10 月 27 日 · Scheduling 3: Real-Time Scheduling and Deadlocks",
  sources: [{ label: "lec13 课件", href: "materials/lectures/lec13-scheduling3.pdf" }],
  html: String.raw`
<p class="lede">本讲包含四大板块：(1) 实时调度（Real-Time Scheduling）的可预测性目标、硬实时与软实时、EDF 调度与可行性判据 \(\sum C_i/D_i \le 1\)；(2) 多核亲和性调度（Affinity Scheduling）、<code>test&amp;test&amp;set()</code> 消除缓存行乒乓效应、调度器选型速查表与负载曲线拐点（Knee）；(3) 优先级反转（Priority Inversion）、优先级捐赠/继承（Priority Donation/Inheritance）与 1997 火星探路者号（Mars Pathfinder）重启事故分析；(4) 死锁理论全解：死锁与饥饿的区分、死锁四要素、资源分配图（RAG）与向量死锁检测算法、死锁预防（虚拟内存、原子拿锁、一致加锁顺序与虫洞路由维度排序）、死锁恢复及银行家算法（Banker's Algorithm）。</p>

<h2>1. 实时调度（Real-Time Scheduling）（Slides 2–8）</h2>
<ul>
  <li><b>核心目标：性能的可预测性（Predictability of Performance，Slide 3）</b>：
    <ul>
      <li>实时系统（RTS）追求<b>以任务为中心的事前确定性保证（Task-centric &amp; ensured a priori）</b>，必须有把握地预测最坏情况响应时间（Worst-case response time）。</li>
      <li><b>注意</b>：<b>实时（Real-time）等于强制保障可预测性，绝不等于“算得快（Fast computing）”！</b>传统系统追求系统级吞吐量与事后统计（Wait and see），而轮转调度（RR）因时间片交错会导致所有实时任务双双错过截止期（Slide 6）。</li>
    </ul>
  </li>
  <li><b>硬实时 vs. 软实时（Slide 4）</b>：
    <ul>
      <li><b>硬实时（Hard Real-Time）</b>：面向安全关键系统（如刹车控制、飞行控制），<b>必须满足所有截止期</b>（理想情况下在运行前预先判定是否可行）。代表算法：<b>EDF</b>（Earliest Deadline First）、<b>LLF</b>（Least Laxity First）、<b>RMS</b>（Rate-Monotonic Scheduling）、<b>DM</b>（Deadline Monotonic）。</li>
      <li><b>软实时（Soft Real-Time）</b>：面向多媒体音视频流等应用，以高概率满足截止期即可。代表算法：<b>CBS</b>（Constant Bandwidth Server）。</li>
    </ul>
  </li>
  <li><b>最早截止期优先（EDF）与可行性检验（Slides 7–8）</b>：
    <ul>
      <li>对周期为 \(P_i\)（或相对截止期 \(D_i\)）、每周期计算时间为 \(C_i\) 的可抢占独立任务集，EDF 采用<b>动态优先级</b>：始终调度<b>绝对截止期 \(D_{\mathrm{abs}} = t_{\mathrm{arrival}} + D_i\) 最近</b>的活跃任务。</li>
      <li><b>EDF 可行性检验公式（Feasibility Testing）</b>：\(n\) 个任务存在可行调度的充要条件是总 CPU 利用率不超过 \(100\%\)：
      <div class="formula">\[\sum_{i=1}^{n} \frac{C_i}{D_i} \;\le\; 1.\]</div></li>
    </ul>
  </li>
</ul>

<h2>2. 多核调度、<code>test&amp;test&amp;set</code> 与调度器选型（Slides 9–14）</h2>
<h3>2.1 多核亲和性调度（Affinity Scheduling，Slide 9）</h3>
<ul>
  <li>在多核（Multi-core）系统中，为了避免所有核心争抢同一个全局运行队列锁并破坏缓存一致性（Cache Coherence），工程上为<b>每个 CPU 核心维护独立的调度队列</b>（如 Linux O(1) 调度器每核一套队列，后台定期做负载均衡 Rebalancing）。</li>
  <li><b>亲和性调度（Affinity Scheduling）</b>：一旦某个线程在某个 CPU 核心上运行过，操作系统下次尽量将其重新调度回<b>同一个 CPU 核心</b>，以充分利用该核心上的<b>各级缓存复用（Cache reuse）与分支预测器状态（Branch prediction）</b>。</li>
</ul>

<h3>2.2 多核自旋锁与 <code>test&amp;test&amp;set()</code>（Slides 10–11）</h3>
<ul>
  <li><b>何时自旋锁优于睡眠锁？</b>在多核程序的<b>屏障同步（Barrier）</b>中，等待有限个其他核上的线程到达时，如果让线程进入内核睡眠再唤醒，内核上下文切换耗时远超短暂忙等，此时自旋锁更优。</li>
  <li><b>朴素 <code>test&amp;set()</code> 的缓存乒乓（Cache Ping-Ponging）问题</b>：<code>while (test&amp;set(&amp;value));</code> 每次循环都执行原子<b>写操作</b>，在多核缓存一致性协议（如 MESI）下会不断使其他所有核心的本地缓存行失效，导致锁变量在各核缓存间疯狂乒乓传输，占满内存总线带宽！</li>
  <li><b><code>test&amp;test&amp;set()</code> 优化（Slide 11）</b>：先在本地缓存中执行纯读循环 <code>while (value);</code>（只要锁未被释放，所有等待核均在各自的本地缓存中读取 <code>value == 1</code>，<b>产生零总线流量</b>）；仅当观测到 <code>value == 0</code> 时，才发起一次原子的 <code>test&amp;set(&amp;value)</code> 争抢：
<pre>Acquire() {
    do {
        while (value);          // 先在本地 Cache 纯读等待，无总线竞争！
    } while (test&amp;set(&amp;value)); // 仅当可能空闲时才执行原子读改写
}</pre>
  </li>
</ul>

<h3>2.3 调度算法评估方法、选型总表与负载曲线拐点（Slides 12–14）</h3>
<ul>
  <li><b>三种评估方法（Slide 12）</b>：确定性建模（Deterministic modeling，给定固定负载算指标）、排队论模型（Queueing models，随机过程数学推导）、真实实现/模拟器（Implementation/Simulation，最灵活通用）。</li>
  <li><b>调度器选型速查表（Slide 13，必背！）</b>：
    <table>
      <thead><tr><th>核心优化目标（I Care About）</th><th>最佳调度器选择（Then Choose）</th></tr></thead>
      <tbody>
        <tr><td><b>CPU 吞吐量（CPU Throughput）</b></td><td><b>FCFS</b>（零抢占切换开销）</td></tr>
        <tr><td><b>平均响应时间（Avg. Response Time）</b></td><td><b>SRTF 近似算法</b>（如 MLFQ）</td></tr>
        <tr><td><b>I/O 吞吐量（I/O Throughput）</b></td><td><b>SRTF 近似算法</b>（让短突发 I/O 任务立即运行以保持设备忙碌）</td></tr>
        <tr><td><b>CPU 时间公平性（Fairness）</b></td><td><b>Round Robin、Fair Sharing、Lottery、EEVDF</b></td></tr>
        <tr><td><b>满足截止期（Meeting Deadlines）</b></td><td><b>EDF</b></td></tr>
        <tr><td><b>优待重要任务（Favoring Important Tasks）</b></td><td><b>Priority（优先级调度）</b></td></tr>
      </tbody>
    </table>
  </li>
  <li><b>负载曲线的“拐点（Knee of the Curve）”（Slide 14）</b>：响应时间随资源利用率 \(U\) 呈非线性增长，当 \(U \to 100\%\) 时响应时间趋于无穷大（\(\infty\)）。绝大多数调度算法在线性区表现良好，但在接近 \(100\%\) 满载时全面恶化；因此应当在到达<b>曲线拐点（Knee）</b>时升级更快的硬件，而非等到利用率达 \(100\%\)。</li>
</ul>

<h2>3. 优先级反转与火星探路者号事故（Slides 15–24）</h2>
<ul>
  <li><b>优先级反转（Priority Inversion）过程（Slides 16–19）</b>：设优先级 \(\text{Job 3 (P3)} &gt; \text{Job 2 (P2)} &gt; \text{Job 1 (P1)}\)。
    <ol>
      <li>低优先级 <code>Job 1</code> 先运行并成功获取互斥锁 <code>Acquire(lock)</code>；</li>
      <li>高优先级 <code>Job 3</code> 到达并抢占 <code>Job 1</code>，但随后调用 <code>Acquire(lock)</code> 因锁被 <code>Job 1</code> 持有而<b>阻塞（Blocked）</b>；</li>
      <li>此时中优先级计算任务 <code>Job 2</code> 就绪，由于 \(\text{P2} &gt; \text{P1}\)，调度器一直运行 <code>Job 2</code>，导致 <code>Job 1</code> 无法运行去释放锁，最终使<b>高优先级 <code>Job 3</code> 被无关的中优先级 <code>Job 2</code> 无限期饥饿阻塞</b>！</li>
    </ol>
  </li>
  <li><b>解法：优先级捐赠 / 优先级继承（Priority Donation / Inheritance，Slides 20–22）</b>：当高优先级 <code>Job 3</code> 阻塞在低优先级 <code>Job 1</code> 持有的锁上时，<code>Job 3</code> <b>临时将自己的高优先级（Priority 3）“捐赠”给持锁者 <code>Job 1</code></b>，使 <code>Job 1</code> 压过中优先级 <code>Job 2</code> 立即运行；一旦 <code>Job 1</code> 执行 <code>Release()</code> 释放锁，<code>Job 1</code> 恢复原优先级，<code>Job 3</code> 立即拿锁运行。</li>
  <li><b>真实案例：1997 年 NASA 火星探路者号（Martian Pathfinder Rover，Slides 23–24）</b>：着陆火星数天后，运行实时操作系统 VxWorks 的探测器频繁发生随机系统重启。原因是：低优先级（Priority 0）气象数据采集任务 <code>ASI/MET</code> 持有了通信互斥锁，高优先级（Priority 2）数据分发任务等待该锁，而大量中优先级（Priority 1）任务抢占了 CPU，导致高优先级任务长期未完成，触发看门狗定时器（Watchdog）判定系统卡死并强制重启！工程师最初出于性能开销顾虑关闭了互斥锁的优先级继承选项；通过地面上传补丁<b>重新开启 Priority Donation/Inheritance</b> 后故障彻底排除。</li>
</ul>

<h2>4. 死锁（Deadlock）定义、四要素与资源分配图（Slides 25–41）</h2>
<h3>4.1 死锁 vs. 饥饿与典型死锁场景（Slides 26–35）</h3>
<ul>
  <li><b>死锁 vs. 饥饿（Slide 26，必考辨析）</b>：
    <ul>
      <li><b>饥饿（Starvation）</b>：线程无限期等待（例如低优先级线程因高优先级线程源源不断而得不到 CPU，或单车道桥上东向车流不断导致西向车一直等待）。<b>饥饿可以自行结束（只要高优任务停止到达），但死锁在没有外部干预时绝不可能自行结束！</b></li>
      <li><b>包含关系</b>：<b>\(\text{Deadlock} \implies \text{Starvation}\)，但反之不成立（Not vice versa）！</b></li>
    </ul>
  </li>
  <li><b>多类资源的死锁（Slides 30–35）</b>：除了互斥锁交错获取（A 拿 x 等 y，B 拿 y 等 x，具有非确定性，只在特定“不走运”调度下触发，难以调试）外，<b>内存空间分配</b>（总共 2MB 内存，A、B 各执行两次 <code>AllocateOrWait(1MB)</code> 再释放）、<b>管道/套接字等待</b>、<b>哲学家/律师就餐问题</b>（5 人同时拿起手边第 1 根筷子等待第 2 根）都会发生死锁。</li>
</ul>

<h3>4.2 死锁发生的四个必要条件（Slides 36–37）</h3>
<ol>
  <li><b>互斥（Mutual exclusion）</b>：同一时刻只有一个线程能使用某资源。</li>
  <li><b>持有并等待（Hold and wait）</b>：已持有至少一个资源的线程正在等待获取由其他线程持有的额外资源。</li>
  <li><b>不可抢占（No preemption）</b>：资源只能由持有它的线程在完成任务后自愿释放。</li>
  <li><b>循环等待（Circular wait）</b>：存在等待线程环 \(\{T_1, \dots, T_n\}\)，使 \(T_1\) 等待 \(T_2\) 持有的资源，\(\dots\)，\(T_n\) 等待 \(T_1\) 持有的资源。</li>
</ol>

<h3>4.3 资源分配图（RAG）与死锁检测算法（Slides 38–41，样卷 Q5 直接考点！）</h3>
<ul>
  <li><b>资源分配图（RAG）</b>：顶点分为线程集 \(T\) 与资源类型集 \(R\)（资源 \(R_i\) 内画 \(W_i\) 个圆点表示有 \(W_i\) 个实例）。
    <ul>
      <li><b>请求边（Request edge）</b>：\(T_i \to R_j\)（\(T_i\) 正在等待申请 \(R_j\) 的一个实例）；</li>
      <li><b>分配边（Assignment edge）</b>：\(R_j \to T_i\)（\(R_j\) 的一个实例已分配给 \(T_i\)）。</li>
    </ul>
  </li>
  <li><b>环路与死锁的关系（Slide 39 三图对比）</b>：
    <ul>
      <li>无环 \(\implies\) 必无死锁；</li>
      <li><b>单实例资源图有环 \(\iff\) 必定死锁</b>；</li>
      <li><b>多实例资源图有环 \(\implies\) 未必死锁！</b>例如 Slide 39 右图：虽然存在环 \(T_1 \to R_1 \to T_3 \to R_2 \to T_1\)，但 \(R_1\) 的另一个实例分配给了环外的 \(T_2\)、\(R_2\) 的另一个实例分配给了环外的 \(T_4\)；只要 \(T_2\) 与 \(T_4\) 运行结束释放各自的资源实例，\(T_1\) 与 \(T_3\) 即可获得资源解开环路！</li>
    </ul>
  </li>
  <li><b>通用多实例死锁检测算法（Deadlock Detection Algorithm，Slides 40–41）</b>：
<pre>[Avail] = [FreeResources]          // 当前各类资源的空闲可用向量
将所有线程加入集合 UNFINISHED
do {
    done = true
    对 UNFINISHED 中的每个线程 node:
        if ([Request_node] &lt;= [Avail]) {   // 当前空闲资源足以满足其当前请求！
            从 UNFINISHED 中移除 node
            [Avail] = [Avail] + [Alloc_node]  // 假设该线程运行完毕并归还已占资源
            done = false
        }
} until (done == true)
// 结论：若循环结束时 UNFINISHED 非空，则留在 UNFINISHED 中的线程处于死锁状态！</pre>
  </li>
</ul>

<h2>5. 应对死锁的四大策略：预防、恢复、避免与忽略（Slides 42–65）</h2>
<p>现代通用操作系统通常确保内核自身不发生死锁，而对用户态应用的死锁采取<b>死锁忽略（Deadlock Denial / 鸵鸟算法 Ostrich Algorithm）</b>。</p>

<h3>5.1 死锁预防（Deadlock Prevention，Slides 43–52）</h3>
<ol>
  <li><b>提供无限（或看似无限）的资源（Slides 43, 45, 56）</b>：例如上面的 2MB 内存 <code>AllocateOrWait</code> 死锁，在引入<b>虚拟内存（Virtual Memory）</b>后，磁盘交换空间提供了远超 2MB 的虚拟地址空间（或者从另一视角看：将内存换出到磁盘相当于<b>使物理内存变得可抢占 Preemptible</b>！），从而消除死锁。</li>
  <li><b>不允许等待（Don't allow waiting，Slide 44）</b>：拿不到资源立即失败回退并稍后重试（如电话忙音、以太网冲突退避重试），缺点是低效且可能引发活锁。</li>
  <li><b>启动时一次性申请全部所需资源 / 原子申请（Slides 46, 48–49）</b>：
    <ul>
      <li>通过原子原语 <code>Acquire_both(x, y)</code> 一次性获取多把锁；</li>
      <li>或引入一把外层全局保护锁 <code>z</code>：先 <code>z.Acquire()</code>，再依次获取 <code>x</code> 和 <code>y</code>，拿齐后立即 <code>z.Release()</code>（从而防止任何其他线程在拿锁中途插足，破坏“持有并等待”）。</li>
    </ul>
  </li>
  <li><b>强制按一致的全局顺序获取资源（Consistent Ordering，Slides 47, 50–52）</b>：
    <ul>
      <li>所有线程一律先 <code>x.Acquire()</code> 再 <code>y.Acquire()</code>（破坏“循环等待”）。</li>
      <li><b>Slide 50 关键追问：释放锁的顺序（<code>Release</code> order）会影响死锁吗？答：完全不影响！</b>死锁只发生在获取锁（<code>Acquire</code>）的等待阶段，一旦线程已拿齐所需锁进入临界区，无论先释放 <code>x</code> 还是先释放 <code>y</code> 都不会引发死锁。</li>
      <li><b>虫洞路由网络中的维度排序（Dimension Ordering，Slides 51–52）</b>：四个方向的火车/多核网格消息各占一条边并试图右转时会形成环路死锁；规定所有消息必须<b>先走东西向（X 轴）、再走南北向（Y 轴）</b>，即可彻底消除路由死锁。</li>
    </ul>
  </li>
</ol>

<h3>5.2 死锁恢复（Deadlock Recovery，Slides 54–55）</h3>
<ul>
  <li><b>终止线程（Terminate thread）</b>：强行杀死死锁线程以回收资源（但强杀持有互斥锁的线程可能使共享数据处于不一致状态）。</li>
  <li><b>抢占资源（Preempt resources）</b>或<b>回滚已死锁线程的操作（Roll back actions）</b>：数据库事务系统中最常用的死锁恢复手段（回滚某事务并归还锁，但若以完全相同的方式立即重启可能再次死锁）。</li>
</ul>

<h3>5.3 死锁避免（Deadlock Avoidance）与银行家算法（Slides 57–63）</h3>
<ul>
  <li><b>系统的三种状态（Slide 58）</b>：
    <ul>
      <li><b>安全状态（Safe state）</b>：系统存在至少一个线程执行序列，使所有线程即使提出各自的最大剩余需求也能全部顺利完成。</li>
      <li><b>不安全状态（Unsafe state）</b>：<b>当前尚未发生死锁（No deadlock yet）</b>，但一旦后续线程按最坏情况申请其最大声明资源，死锁将不可避免。</li>
      <li><b>死锁状态（Deadlocked state）</b>：已经存在死锁（属于不安全状态的子集）。</li>
    </ul>
    <b>死锁避免的核心原则</b>：在每次批准资源请求前先做试探，<b>绝不允许系统进入不安全状态</b>！
  </li>
  <li><b>银行家算法（Banker's Algorithm，Slides 60–62）</b>：每个线程预先声明其最大资源需求向量 <code>[Max_node]</code>。当线程请求资源时，先<b>假装批准该请求（Pretend request is granted）</b>更新 <code>[Avail]</code> 与 <code>[Alloc_node]</code>，然后运行前面的死锁检测算法，但<b>将判定条件从 <code>[Request_node] &lt;= [Avail]</code> 替换为最大剩余需求判据</b>：
  <div class="formula">\[\bigl[\mathrm{Max}_{\mathrm{node}}\bigr] - \bigl[\mathrm{Alloc}_{\mathrm{node}}\bigr] \;\le\; [\mathrm{Avail}].\]</div>
  若所有节点最终都能从 <code>UNFINISHED</code> 中移除（即新状态为安全状态），则真正批准该请求；否则推迟该请求，让线程等待。</li>
  <li><b>哲学家就餐的银行家算法解释（Slide 63）</b>：拿筷子时是“安全的”，当且仅当：(i) 这不是桌上的最后一根筷子；或者 (ii) 这是最后一根筷子，但拿走它之后<b>恰好能让某位饥饿的哲学家凑齐两根筷子吃完并释放</b>！（推广到需要 \(k\) 根筷子的 \(k\) 手律师：若拿走后剩最后 1 根却无人凑齐 \(k\) 根、或剩倒数第 2 根却无人凑齐 \(k-1\) 根……则拒绝分配）。</li>
</ul>
`,
  questions: [
    {
      id: "l13-q1",
      tag: "slide",
      kind: "single",
      q: String.raw`（Lec13 Slides 10–11）在多核处理器上实现自旋锁时，为什么要用 <code>test&amp;test&amp;set()</code>（即内层先用 <code>while (value);</code> 纯读等待，外层再用 <code>while (test&amp;set(&amp;value));</code>）替代单纯的 <code>while (test&amp;set(&amp;value));</code>？`,
      choices: [
        ["a", String.raw`因为每次 <code>test&amp;set()</code> 都会写入内存，引发缓存行在多个核心的本地缓存间反复失效（Cache ping-ponging），而先用纯读循环可在本地缓存中等待，避免无谓的内存总线竞争`],
        ["b", String.raw`因为单纯的 <code>test&amp;set()</code> 不能保证互斥性`],
        ["c", String.raw`因为 <code>test&amp;test&amp;set()</code> 可以让线程自动进入内核睡眠队列`],
        ["d", String.raw`因为 <code>test&amp;test&amp;set()</code> 无需硬件提供原子指令`]
      ],
      answer: ["a"],
      why: String.raw`Slide 10–11 指出：每次 <code>test&amp;set()</code> 都是原子读改写，会导致锁变量在各核缓存间乒乓（ping-ponging）；先纯读 <code>value</code> 可在锁被占用期间命中各核本地缓存，不产生总线流量。`
    },
    {
      id: "l13-q2",
      tag: "slide",
      kind: "single",
      q: String.raw`（Lec13 Slides 23–24）1997 年火星探路者号（Martian Pathfinder）在火星表面频繁发生看门狗超时重启，其根本原因与最终修复方案是什么？`,
      choices: [
        ["a", String.raw`根本原因是低优先级气象任务持有共享互斥锁且被中优先级任务抢占，导致高优先级数据分发任务发生优先级反转（Priority Inversion）；通过开启优先级捐赠/继承（Priority Donation/Inheritance）修复`],
        ["b", String.raw`根本原因是两个高优先级任务按相反顺序获取两把锁导致死锁；通过杀死气象任务修复`],
        ["c", String.raw`根本原因是物理内存耗尽导致页表崩溃；通过扩大交换分区修复`],
        ["d", String.raw`根本原因是 Round Robin 时间片设置过大；通过改为 FCFS 修复`]
      ],
      answer: ["a"],
      why: String.raw`Priority 0 的 ASI/MET 任务持锁被 Priority 1 任务抢占，阻塞了 Priority 2 的数据分发任务，触发看门狗重启；开启 VxWorks 的优先级继承（Priority Donation）后解决。`
    },
    {
      id: "l13-q3",
      tag: "slide",
      kind: "tf",
      q: String.raw`（Lec13 Slide 26）死锁（Deadlock）必然意味着涉事线程发生饥饿（Starvation），反之饥饿也必然意味着发生了死锁。`,
      answer: ["f"],
      why: String.raw`错误！Slide 26 明确指出：Deadlock ⇒ starvation, but NOT vice versa。饥饿可能只是因为低优先级任务暂时排在大量高优先级任务后面（未来可以结束），而死锁在无外部干预时绝不可能自行解除。`
    },
    {
      id: "l13-q4",
      tag: "slide",
      kind: "tf",
      q: String.raw`（Lec13 Slide 50）使用“按一致顺序获取锁（如所有线程均先 <code>x.Acquire()</code> 再 <code>y.Acquire()</code>）”预防死锁时，线程释放锁（<code>Release</code>）的先后顺序也必须保持完全一致，否则仍会发生死锁。`,
      answer: ["f"],
      why: String.raw`错误！Slide 50 特别提问“Does it matter in which order the locks are released?”：释放锁不阻塞等待任何资源，只要获取锁（Acquire）的顺序一致就不会产生循环等待，释放顺序不影响死锁预防。`
    },
    {
      id: "l13-q5",
      tag: "slide",
      kind: "single",
      q: String.raw`（Lec13 Slides 41 &amp; 60–62）对比课件中的“死锁检测算法（Deadlock Detection）”与“银行家死锁避免算法（Banker's Algorithm）”，两者在循环查找可完成节点时的核心判定条件有何区别？`,
      choices: [
        ["a", String.raw`死锁检测检查当前请求是否满足 <code>[Request_node] &lt;= [Avail]</code>；银行家算法假装批准请求后，检查最大剩余需求是否满足 <code>[Max_node] - [Alloc_node] &lt;= [Avail]</code>`],
        ["b", String.raw`两者完全相同，都只检查 <code>[Alloc_node] &lt;= [Avail]</code>`],
        ["c", String.raw`死锁检测要求预先知道 <code>[Max_node]</code>，而银行家算法不需要`],
        ["d", String.raw`银行家算法只在发生死锁后才运行以杀死线程`]
      ],
      answer: ["a"],
      why: String.raw`Slide 60–62 展示：银行家算法直接复用了死锁检测算法的框架，仅把内层条件 <code>([Request_node] &lt;= [Avail])</code> 替换为 <code>([Max_node] - [Alloc_node] &lt;= [Avail])</code>。`
    },
    {
      id: "l13-q6",
      tag: "slide",
      kind: "single",
      q: String.raw`（Lec13 Slide 13）根据课件给出的“Choosing the right scheduler”选型指南，若系统设计者最关心的是最大化 I/O 吞吐量（I/O Throughput），应当选择哪类调度器？`,
      choices: [
        ["a", String.raw`SRTF 近似算法（SRTF Approximation），以便让每次仅需极短 CPU 突发的 I/O 任务立即抢占 CPU 发起下一次 I/O`],
        ["b", String.raw`FCFS，以彻底消除上下文切换`],
        ["c", String.raw`大时间片的 Round Robin`],
        ["d", String.raw`随机调度`]
      ],
      answer: ["a"],
      why: String.raw`Slide 13 表中明确列出：CPU Throughput → FCFS；Avg. Response Time → SRTF Approximation；I/O Throughput → SRTF Approximation；Meeting Deadlines → EDF。`
    }
  ],
  cards: [
    [
      String.raw`（Lec13）为什么多核自旋锁要用 <code>test&amp;test&amp;set()</code>？`,
      String.raw`单纯 <code>test&amp;set()</code> 每次都执行原子写，导致锁变量在多核缓存间剧烈乒乓（ping-ponging）；先内层纯读 <code>while(value);</code> 可在本地缓存等待，仅当锁变为空闲时才发起原子操作。`
    ],
    [
      String.raw`（Lec13）Slide 13 调度器选型表：CPU 吞吐量、平均响应时间、I/O 吞吐量、公平性、满足截止期分别选什么？`,
      String.raw`CPU 吞吐量 → FCFS；平均响应时间 → SRTF 近似；I/O 吞吐量 → SRTF 近似；公平性 → RR / Fair Sharing / Lottery / EEVDF；满足截止期 → EDF。`
    ],
    [
      String.raw`（Lec13）1997 火星探路者号重启事故的根因与解法`,
      String.raw`根因：低优气象任务持互斥锁被中优任务抢占，高优任务等待该锁发生优先级反转触发看门狗重启；解法：开启优先级捐赠/继承（Priority Donation/Inheritance）。`
    ],
    [
      String.raw`（Lec13）死锁检测算法与银行家算法在代码上的唯一区别是什么？`,
      String.raw`死锁检测判断当前请求 <code>[Request_node] &lt;= [Avail]</code>；银行家算法假装分配后判断最大剩余需求 <code>[Max_node] - [Alloc_node] &lt;= [Avail]</code>。`
    ]
  ]
});
