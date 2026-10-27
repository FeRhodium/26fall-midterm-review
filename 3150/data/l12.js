Review.add({
  id: "l12", group: "lecture", n: 12,
  short: "L12 调度策略 II",
  title: "Lecture 12 · 多级反馈队列、Linux O(1)、Max-Min 公平、Lottery、WFQ 与 EEVDF",
  meta: "10 月 22 日 · Scheduling 2: Fair Sharing, Lottery Scheduling, EEVDF",
  sources: [{ label: "lec12 课件", href: "materials/lectures/lec12-scheduling2.pdf" }],
  html: String.raw`
<p class="lede">本讲深入现代操作系统的实用调度器与公平共享理论：(1) 多级反馈队列（MLFQ）的升降级机制及黑白棋程序利用伪造 <code>printf</code> 欺骗调度器的经典攻击；(2) Linux O(1) 调度器的 140 级优先级映射、Active/Expired 双队列切换与 <code>sleep_avg</code> 交互信用（IC）；(3) 最大最小公平（Max-Min Fairness）与加权 Max-Min 公平算法及注水法算例；(4) 彩票调度（Lottery Scheduling）的概率飞镖机制；(5) 加权公平队列（WFQ）与流体模型（GPS）、系统虚拟时间 \(V(t)\) 与虚拟完成时间 \(F_i^{k+1}\) 公式；(6) Linux EEVDF 如何将服务滞后（Lag）从 WFQ 的 \(O(n)q\) 降至 \(O(1)q\) 及其与 WFQ/Lottery/RR 的四维复杂度对比表。</p>

<h2>1. 多级反馈队列（MLFQ）与欺骗攻击（Slides 5–12）</h2>
<ul>
  <li><b>设计动机</b>：在不预知作业未来运行时间的前提下，利用历史行为自动区分“频繁睡眠、短突发的交互式应用”与“长时间连续计算的后台应用”，从而近似 SRTF。</li>
  <li><b>队列结构与升降级规则（Slides 8–10）</b>：
    <ul>
      <li>设置多个不同优先级的队列，高优先级为前台队列（常采用短时间片 RR），低优先级为后台队列（常采用指数倍增的时间片，如 \(1\text{ ms}, 2\text{ ms}, 4\text{ ms}\dots\) 或 FCFS）。</li>
      <li><b>新作业进入最高优先级队列</b>；若在当前队列用完整个时间片仍未阻塞（Timeout expires），则<b>降一级（Drop one level）</b>；若在时间片用完前主动让出 CPU（如等待 I/O），则<b>升一级或保持在顶部</b>。</li>
      <li>效果：纯计算型作业迅速沉底（“Drop like a rock”），而短突发 I/O 密集型作业留在高层队列，近似实现 SRTF。</li>
      <li><b>队列间调度方式（Slide 11）</b>：既可采用固定优先级（高优先级队列全空才服务下一级），也可按时间片比例切分（如最高级占 \(70\%\)、次高级 \(20\%\)、最低级 \(10\%\) CPU 时间，防止饥饿）。</li>
    </ul>
  </li>
  <li><b>经典调度器欺骗攻击（Countermeasure / Gaming the Scheduler，Slide 12）</b>：在朴素 MLFQ 中，恶意计算密集型程序可以在时间片即将耗尽前<b>故意插入无意义的短 I/O（例如调用 <code>printf</code>）</b>，从而让调度器误以为它是交互式任务，一直停留在最高优先级队列！课件给出了著名的<b>黑白棋比赛（Othello）实例</b>：参赛者在计算棋步的循环中插入大量无用 <code>printf</code>，成功霸占高优先级队列，反而比对手跑得快得多！</li>
</ul>

<h2>2. 案例研究：Linux O(1) 调度器（Slides 13–15）</h2>
<ul>
  <li><b>140 个优先级与数值方向（Slide 13）</b>：共设 \(0 \sim 139\) 共 140 个优先级队列，用 140 位位图（Bitmask）在 \(O(1)\) 时间内定位最高优先级非空队列：
    <ul>
      <li><b>\(0 \sim 99\)</b>：共 100 个级别用于<b>实时与内核任务（Realtime/Kernel tasks）</b>；</li>
      <li><b>\(100 \sim 139\)</b>：共 40 个级别用于<b>普通用户任务（User tasks，由 <code>nice</code> 值设定）</b>；</li>
      <li><b>注意方向</b>：<b>优先级数值越小，代表实际优先级越高（Lower priority value \(\implies\) Higher priority）！</b>数值 139 的优先级最低。</li>
    </ul>
  </li>
  <li><b>Active 与 Expired 双队列组（Slide 14）</b>：维护两套独立的优先级队列数组——<b>活跃队列（Active queue）</b>与<b>过期队列（Expired queue）</b>。所有在 Active 队列中的任务用完各自的时间片（时间片长度随优先级线性映射）后被移入 Expired 队列；当 Active 队列彻底排空时，只需以 \(O(1)\) 时间<b>交换 Active 与 Expired 两个指针</b>即可开启下一轮！</li>
  <li><b>交互性启发式调整（Slide 15）</b>：用户任务优先级可根据 <code>sleep_avg = sleep_time - run_time</code> 动态上下浮动 \(\pm 5\)（睡眠越多的 I/O 任务奖励越高）。引入<b>交互信用（Interactive Credit, IC）</b>提供迟滞效应（Hysteresis），防止偶发行为改变交互性判定；被判定为“交互式任务”的进程在用完时间片后可获得特批<b>直接放回 Active 队列</b>（除非 Expired 队列中已有任务饥饿过久）。</li>
</ul>

<h2>3. 最大最小公平（Max-Min Fairness）与加权形式（Slides 16–36, 42–43）</h2>
<h3>3.1 核心定义与注水法（Water-Filling）迭代算法</h3>
<p>工作保守（Work-conserving）调度器在有就绪任务时绝不让 CPU 空闲。当总资源容量为 \(C\)，而部分任务的需求量 \(D[i]\) 小于平均份额时，<b>Max-Min Fairness</b> 最大化分配给最小所得者的资源量：</p>
<pre>S = {J1, ..., Jn},  剩余容量 C
while S 非空:
    计算当前均分份额 f = C / |S|
    若存在 Ji ∈ S 使得需求 D[i] &lt;= f:
        令 A[i] = D[i]，从剩余容量中扣除 C = C - D[i]，并将 Ji 移出 S
    否则（所有剩余作业需求均 &gt; f）:
        对所有 Ji ∈ S 令 A[i] = f，算法结束</pre>

<details class="solve" open><summary>课件三个标准算例（Slides 19–35）与加权算例（Slide 43）</summary><div>
<ol>
  <li><b>Example 1（Slide 19–20）</b>：容量 \(C = 10\)，需求 \(D = [8, 6]\)。第一轮均分 \(f = 10/2 = 5\)；因为 \(D[1]=8 &gt; 5\) 且 \(D[2]=6 &gt; 5\)，直接分配 \(A = \mathbf{[5, 5]}\)。</li>
  <li><b>Example 2（Slide 21–22）</b>：容量 \(C = 10\)，需求 \(D = [8, 4]\)。第一轮 \(f = 10/2 = 5\)；因为 \(D[2] = 4 \le 5\)，先满足 \(A[2] = 4\)，剩余容量 \(C = 10 - 4 = 6\)；第二轮剩 \(J_1\)，得 \(f = 6/1 = 6 \le 8\)，故 \(A = \mathbf{[6, 4]}\)。</li>
  <li><b>Example 3（Slide 23–35）</b>：容量 \(C = 10\)，需求 \(D = [8, 6, 2]\)。
    <ul>
      <li>第 1 轮：\(|S| = 3\)，均分份额 \(f = 10/3 \approx 3.33\)。由于 \(D[3] = 2 &lt; 10/3\)，令 \(A[3] = 2\)，更新剩余容量 \(C = 10 - 2 = 8\)，剩余集合 \(S = \{J_1, J_2\}\)；</li>
      <li>第 2 轮：\(|S| = 2\)，均分份额 \(f = 8/2 = 4\)。由于 \(D[1] = 8 &gt; 4\) 且 \(D[2] = 6 &gt; 4\)，令 \(A[1] = 4,\; A[2] = 4\)。最终分配为 \(A = \mathbf{[4, 4, 2]}\)。</li>
    </ul>
  </li>
  <li><b>加权 Max-Min Fairness（Weighted Fair Rate，Slide 43）</b>：若每个流/作业 \(i\) 带有权重 \(w_i\)，拥塞时求解归一化公平速率 \(f\) 满足方程
  <div class="formula">\[\sum_{i} \min(r_i,\; f \cdot w_i) = C,\]</div>
  每个作业获得 \(\min(r_i, f \cdot w_i)\)。<b>课件算例</b>：容量 \(C = 10\)，三个作业需求为 \(r = [8, 6, 2]\)，权重为 \(w = [3, 1, 1]\)。解得 \(f = 2\)，故各作业分配依次为 \(\min(8, 2 \times 3) = \mathbf{6}\)、\(\min(6, 2 \times 1) = \mathbf{2}\)、\(\min(2, 2 \times 1) = \mathbf{2}\)（总和 \(6 + 2 + 2 = 10\)）。</li>
</ol>
</div></details>

<h2>4. 彩票调度（Lottery Scheduling）（Slides 37–39）</h2>
<ul>
  <li><b>机制（Slide 38）</b>：将任务的权重映射为所持有的<b>彩票数 \(N_i\)</b>，系统总票数为 \(N_{\mathrm{ticket}} = \sum_i N_i\)。每次调度时，在 \(1 \dots N_{\mathrm{ticket}}\) 之间均匀随机投掷一枚“飞镖” \(d\)，按序累加各任务的票数 \(N_i\)，<b>选出第一个使前缀和 \(\sum_{k=1}^j N_k \ge d\) 的任务 \(j\) 运行</b>。</li>
  <li><b>课件算例（Slide 39）</b>：设短作业配 \(10\) 张票，长作业配 \(1\) 张票：
    <ul>
      <li>1 个短作业 + 1 个长作业：短作业得 \(10/11 \approx \mathbf{91\%}\) CPU，长作业得 \(1/11 \approx \mathbf{9\%}\) CPU（绝不会完全饿死！）；</li>
      <li>10 个短作业 + 1 个长作业：每个短作业得 \(10/101 \approx \mathbf{9.9\%}\)，长作业得 \(1/101 \approx \mathbf{0.99\%}\)；</li>
      <li>1 个短作业 + 10 个长作业：短作业得 \(10/20 = \mathbf{50\%}\)，每个长作业得 \(1/20 = \mathbf{5\%}\)。</li>
    </ul>
  </li>
</ul>

<h2>5. 加权公平队列（WFQ）、流体模型（GPS）与虚拟时间（Slides 40–52）</h2>
<ul>
  <li><b>流体模型（Fluid Flow System / Generalized Processor Sharing, GPS）</b>：理想情况下资源可以按无穷小的粒度（如逐比特 Bit-by-bit）按权重轮转分配。例如（Slide 45–46）红色流权重为 \(5\)，仅在 \([0, 10]\) 有积压包；其余 5 个流权重各为 \(1\) 且持续有包。在 \([0, 10]\) 期间总活跃权重为 \(5 + 5 \times 1 = 10\)，红色流获得 \(5/10 = 1/2\) 的带宽（在 10 个单位时间内发完 5 个大小为 1 的包），其余流各得 \(1/10\)。</li>
  <li><b>WFQ 对 GPS 的分组近似（Slide 47–48）</b>：实际 CPU 时间片或网络数据包不可无限细分。<b>WFQ 每次选择“在理想流体 GPS 系统中（假设未来无新包到达）最早完成”的那个包/时间片优先服务</b>。</li>
  <li><b>为什么要引入系统虚拟时间 \(V(t)\)？（Slides 49–52）</b>：当新作业/新包在中途到达并激活新流时，所有已存在包的<b>真实物理完成时间</b>都会被推迟（需要重算所有包的完成时间）；但<b>各包完成的先后相对顺序不会改变</b>！因此改用“在逐比特轮转中的轮数（Round number）”定义<b>系统虚拟时间 \(V(t)\)</b>：
  <div class="formula">\[\frac{\partial V(t)}{\partial t} = \frac{C}{N(t)},\]</div>
  其中 \(C\) 为链路/CPU 容量，\(N(t) = \sum_{i \in \text{backlogged}(t)} w_i\) 为时刻 \(t\) 所有非空（活跃积压）流的权重之和（活跃流越多，每轮推进越慢，\(V(t)\) 斜率越小）。</li>
  <li><b>虚拟完成时间递推公式（Virtual Finishing Time，Slide 52，必背！）</b>：流 \(i\)（权重 \(w_i\)）的第 \(k+1\) 个包（在物理时刻 \(a_i^{k+1}\) 到达，大小为 \(L_i^{k+1}\)）的虚拟开始时间为 \(S_i^{k+1} = \max\bigl(V(a_i^{k+1}),\; F_i^k\bigr)\)，其<b>虚拟完成时间</b>为：
  <div class="formula">\[F_i^{k+1} = \max\!\left(V\bigl(a_i^{k+1}\bigr),\; F_i^k\right) + \frac{L_i^{k+1}}{w_i}.\]</div>
  该值在包到达时即可一次性算出，后续即使有新流加入也<b>无需重新计算</b>！</li>
</ul>

<h2>6. EEVDF（Earliest Eligible Virtual Deadline First）（Slides 53–63）</h2>
<h3>6.1 WFQ 的缺陷：提前透支导致 \(O(n)\) 滞后（Slides 54–56）</h3>
<p>定义<b>服务滞后（Lag）</b>为“理想流体系统中应得的服务量 − 实际系统中已得的服务量”。在前面“1 个权重为 5 的红流 + 5 个权重为 1 的其他流”例子中：</p>
<ul>
  <li>红流在时刻 0 一次性到达 5 个大小为 1 的包，其虚拟完成时间分别为 \(1/5, 2/5, 3/5, 4/5, 5/5 = 1\)；而其余 5 个流（权重 1）的第 1 个包的虚拟完成时间均为 \(1/1 = 1\)。</li>
  <li>因此 <b>WFQ 会连续先发完红流的全部 5 个包（占用物理时间 \(0 \sim 5\)）</b>，然后才轮到其余 5 个流！</li>
  <li>在时刻 \(t = 5\)，理想流体系统中红流只应得到 \(2.5\) 单位服务，但 WFQ 已经给了它 \(5\) 单位服务（Lag \(= -2.5\)，最坏达 \(O(n)q\)），导致其余流在长达 \(n\) 个时间片内被完全剥夺服务！</li>
</ul>

<h3>6.2 EEVDF 的核心解法：只调度“已合格（Eligible）”的任务（Slides 57–62）</h3>
<div class="callout must">
  <strong>EEVDF 调度法则与 \(O(1)\) 滞后界</strong>
  <ul>
    <li><b>合格性条件（Eligibility）</b>：一个包/时间片请求只有在它的<b>虚拟开始时间 \(S_i^k \le\) 当前系统虚拟时间 \(V(t)\)</b> 时（等价于该流在理想流体系统中已经开始接受该包的服务，即 \(\mathrm{lag}_i \ge 0\)），才被称为<b>合格的（Eligible）</b>。</li>
    <li><b>选择规则</b>：EEVDF <b>只在当前合格（Eligible）的包/任务中，选择虚拟完成时间（即虚拟截止期 Virtual Deadline \(F_i^k\)）最早的那一个</b>执行！</li>
    <li><b>效果</b>：在红流例子中，时刻 0 红流只有第 1 个包合格（\(S=0 \le V(0)=0\)）且截止期最早（\(F=0.2\)），故先发 1 个红包；发完后红流第 2 个包的虚拟开始时间尚未到达（不合格！），于是调度器转去发送 1 个黑包；随后红流第 2 个包变为合格并被发送……最终红流精确实现<b>“每隔一个时间片发送一个包（Every other quanta）”</b>，任意时刻的 Lag 恒不超过 \(0.5\)（一般地，<b>最坏服务滞后严格有界为 \(O(1)\cdot q\)，与系统中的总流数 \(n\) 无关！</b>）。</li>
  </ul>
</div>

<h3>6.3 四种比例共享调度算法全维度对比表（Slide 63，必考！）</h3>
<p>设系统中有 \(n\) 个进程/流，最大时间片（或最大包长）为 \(q\)：</p>
<table>
  <thead>
    <tr>
      <th>调度算法</th>
      <th>相对流体系统错过截止期上界</th>
      <th>相对流体系统的服务滞后（Service Lag）</th>
      <th>单次调度时间复杂度</th>
      <th>核心数据结构与特点</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Fair Sharing / WFQ</b></td>
      <td>\(q\)</td>
      <td>\(O(n)\cdot q\)</td>
      <td>\(O(\log n)\)</td>
      <td>按虚拟完成时间 \(F_i\) 排序的优先队列；可能提前透支高权重流的后续包导致 \(O(n)q\) 滞后</td>
    </tr>
    <tr>
      <td><b>EEVDF</b></td>
      <td>\(q\)</td>
      <td><b>\(O(1)\cdot q\)</b></td>
      <td>\(O(\log n)\)</td>
      <td>维护增强平衡树（兼顾 Eligibility 过滤与最早虚拟截止期查找），滞后与流数 \(n\) 无关</td>
    </tr>
    <tr>
      <td><b>Lottery Scheduling</b></td>
      <td>\(O(\sqrt{n})\cdot q\)</td>
      <td>\(O(\sqrt{n})\cdot q\)</td>
      <td>\(O(1)\)（或按链表扫描）</td>
      <td>概率抽签，短期误差服从二项分布标准差 \(\Theta(\sqrt{n})\)</td>
    </tr>
    <tr>
      <td><b>Round Robin (RR)</b></td>
      <td>\(q\)</td>
      <td>\(O(n)\cdot q\)</td>
      <td>\(O(n)\)（若需跳过空队列）</td>
      <td>难以处理不同大小的时间片/包长</td>
    </tr>
  </tbody>
</table>
`,
  questions: [
    {
      id: "l12-q1",
      tag: "slide",
      kind: "single",
      q: String.raw`（Lec12 Slide 12）在多级反馈队列（MLFQ）中，某黑白棋（Othello）程序为了在比赛时从操作系统骗取比对手更高的调度优先级，采取了什么针对性欺骗手段（Countermeasure）？`,
      choices: [
        ["a", String.raw`在计算循环中故意插入大量无意义的 I/O 调用（如 <code>printf</code>），使其在时间片耗尽前主动让出 CPU，从而一直留在最高优先级队列`],
        ["b", String.raw`调用系统调用关闭硬件时钟中断`],
        ["c", String.raw`主动调用 <code>sleep(100)</code> 长时间休眠`],
        ["d", String.raw`创建数千个僵尸子进程耗尽 PID 表`]
      ],
      answer: ["a"],
      why: String.raw`Slide 12 指出：MLFQ 将“时间片未用完即主动阻塞 I/O”视为交互式任务的标志而保持高优先级，故插入无用 <code>printf</code> 可欺骗调度器。`
    },
    {
      id: "l12-q2",
      tag: "slide",
      kind: "multi",
      q: String.raw`（Lec12 Slides 13–15）关于 Linux O(1) 调度器，下列哪些叙述是正确的？`,
      choices: [
        ["a", String.raw`共有 140 个优先级队列（0–99 用于实时/内核任务，100–139 用于用户态 nice 任务），且优先级数值越小代表优先级越高`],
        ["b", String.raw`维护 Active 与 Expired 两个优先级队列组，Active 中所有任务用完时间片移入 Expired 后，通过交换两队列指针开启新一轮`],
        ["c", String.raw`通过统计 <code>sleep_avg = sleep_time - run_time</code> 与交互信用（Interactive Credit）在 \(\pm 5\) 范围内动态奖惩用户任务的优先级`],
        ["d", String.raw`每次选择下一个运行任务需要对所有就绪任务重新排序，耗时 \(O(n \log n)\)`]
      ],
      answer: ["a", "b", "c"],
      why: String.raw`Linux O(1) 调度器使用 140 位位图与双队列数组，所有调度操作均为 \(O(1)\) 时间，故 D 错误，A、B、C 均直接对应 Slides 13–15。`
    },
    {
      id: "l12-q3",
      tag: "slide",
      kind: "single",
      q: String.raw`（Lec12 Slide 24–35）设资源总容量为 \(C = 10\)，三个作业的需求向量为 \(D = [8, 6, 2]\)。按照无权重最大最小公平（Max-Min Fairness）算法，三个作业最终获得的分配向量 \(A = [A_1, A_2, A_3]\) 为：`,
      choices: [
        ["a", String.raw`\([4, 4, 2]\)`],
        ["b", String.raw`\([5, 3, 2]\)`],
        ["c", String.raw`\([10/3, 10/3, 10/3]\)`],
        ["d", String.raw`\([8, 2, 0]\)`]
      ],
      answer: ["a"],
      why: String.raw`第 1 轮均分份额 \(f = 10/3 \approx 3.33\)，作业 3 需求 \(2 &lt; 10/3\) 先得 \(A_3 = 2\)；剩余容量 \(C = 8\) 由作业 1、2 均分得 \(f = 8/2 = 4\)，故 \(A = [4, 4, 2]\)。`
    },
    {
      id: "l12-q4",
      tag: "slide",
      kind: "single",
      q: String.raw`（Lec12 Slide 43）设资源总容量为 \(C = 10\)，三个作业的需求为 \(r = [8, 6, 2]\)，权重分别为 \(w = [3, 1, 1]\)。按照加权最大最小公平（\(\sum_i \min(r_i, f w_i) = C\)），归一化公平速率 \(f\) 与最终分配向量分别为：`,
      choices: [
        ["a", String.raw`\(f = 2\)，分配向量为 \([6, 2, 2]\)`],
        ["b", String.raw`\(f = 2\)，分配向量为 \([4, 4, 2]\)`],
        ["c", String.raw`\(f = 3\)，分配向量为 \([8, 1, 1]\)`],
        ["d", String.raw`\(f = 1\)，分配向量为 \([3, 1, 1]\)`]
      ],
      answer: ["a"],
      why: String.raw`代入 \(f = 2\) 得 \(\min(8, 2\times 3) + \min(6, 2\times 1) + \min(2, 2\times 1) = 6 + 2 + 2 = 10 = C\)，故分配为 \([6, 2, 2]\)。`
    },
    {
      id: "l12-q5",
      tag: "slide",
      kind: "single",
      q: String.raw`（Lec12 Slide 39）在彩票调度（Lottery Scheduling）中，每个短作业分配 10 张票，每个长作业分配 1 张票。当系统中有 1 个短作业和 10 个长作业时，该短作业与每个长作业获得的期望 CPU 比例分别为：`,
      choices: [
        ["a", String.raw`短作业获得 \(50\%\)，每个长作业获得 \(5\%\)`],
        ["b", String.raw`短作业获得 \(91\%\)，每个长作业获得 \(0.9\%\)`],
        ["c", String.raw`短作业获得 \(10\%\)，每个长作业获得 \(9\%\)`],
        ["d", String.raw`短作业获得 \(100\%\)，每个长作业获得 \(0\%\)`]
      ],
      answer: ["a"],
      why: String.raw`总票数为 \(1\times 10 + 10\times 1 = 20\) 张。短作业占 \(10/20 = 50\%\)，每个长作业占 \(1/20 = 5\%\)。`
    },
    {
      id: "l12-q6",
      tag: "slide",
      kind: "single",
      q: String.raw`（Lec12 Slide 50–52）在加权公平队列（WFQ）中，设链路容量为 \(C\)，时刻 \(t\) 所有积压（backlogged）流的权重之和为 \(N(t)\)。系统虚拟时间 \(V(t)\) 的增长率 \(\frac{\partial V(t)}{\partial t}\) 以及流 \(i\)（权重 \(w_i\)）第 \(k+1\) 个包（到达时刻 \(a_i^{k+1}\)，长度 \(L_i^{k+1}\)）的虚拟完成时间 \(F_i^{k+1}\) 公式分别为：`,
      choices: [
        ["a", String.raw`\(\dfrac{\partial V(t)}{\partial t} = \dfrac{C}{N(t)}\)，且 \(F_i^{k+1} = \max\bigl(V(a_i^{k+1}),\, F_i^k\bigr) + \dfrac{L_i^{k+1}}{w_i}\)`],
        ["b", String.raw`\(\dfrac{\partial V(t)}{\partial t} = C \cdot N(t)\)，且 \(F_i^{k+1} = F_i^k + L_i^{k+1} \cdot w_i\)`],
        ["c", String.raw`\(\dfrac{\partial V(t)}{\partial t} = 1\)，且 \(F_i^{k+1} = a_i^{k+1} + L_i^{k+1}\)`],
        ["d", String.raw`\(\dfrac{\partial V(t)}{\partial t} = \dfrac{N(t)}{C}\)，且 \(F_i^{k+1} = \min\bigl(V(a_i^{k+1}),\, F_i^k\bigr) + \dfrac{L_i^{k+1}}{w_i}\)`]
      ],
      answer: ["a"],
      why: String.raw`虚拟时间以 \(\partial V/\partial t = C/N(t)\) 增长（反比于活跃流总权重），新包的虚拟开始时间取当前虚拟时间 \(V(a_i^{k+1})\) 与同流上一包虚拟完成时间 \(F_i^k\) 的较大者，再加上归一化服务轮数 \(L_i^{k+1}/w_i\)。`
    },
    {
      id: "l12-q7",
      tag: "slide",
      kind: "single",
      q: String.raw`（Lec12 Slides 54–63）相比于传统 WFQ，EEVDF（Earliest Eligible Virtual Deadline First）做了什么关键修改，从而将相对于理想流体系统的最坏服务滞后（Service Lag）从 \(O(n)\cdot q\) 降低到了多少？`,
      choices: [
        ["a", String.raw`增加“仅调度虚拟开始时间 \(\le V(t)\) 的合格（Eligible）任务”的限制，将最坏服务滞后降低至 \(O(1)\cdot q\)（与流数 \(n\) 无关），单次调度复杂度保持 \(O(\log n)\)`],
        ["b", String.raw`改用随机投掷飞镖，将服务滞后降低至 \(O(\sqrt{n})\cdot q\)`],
        ["c", String.raw`优先调度虚拟截止时间最晚的任务，将服务滞后降低至 \(0\)`],
        ["d", String.raw`将时间片缩小为 \(0\)，使单次调度复杂度变为 \(O(n^2)\)`]
      ],
      answer: ["a"],
      why: String.raw`WFQ 直接选全局最小 \(F_i\) 会让高权重流提前透支未来份额，导致其余 \(n\) 个流等待 \(O(n)q\)；EEVDF 只在虚拟开始时间已到达（Eligible）的任务中选最小 \(F_i\)，使 Lag 严格受限于 \(O(1)q\)。`
    }
  ],
  cards: [
    [
      String.raw`（Lec12）Linux O(1) 调度器的优先级范围与 Active/Expired 双队列机制`,
      String.raw`0–99 为实时/内核任务，100–139 为用户任务（数值越小优先级越高）；Active 队列任务用尽时间片后移入 Expired，Active 为空时 \(O(1)\) 交换两队列指针。`
    ],
    [
      String.raw`（Lec12）Max-Min Fairness 与加权 Max-Min Fairness 的速率方程`,
      String.raw`无权重：迭代满足 \(D[i] \le C/|S|\) 的小需求作业并扣除容量；加权：求解归一化公平速率 \(f\) 使 \(\sum_i \min(r_i, f w_i) = C\)。`
    ],
    [
      String.raw`（Lec12）WFQ 的系统虚拟时间增长率与虚拟完成时间递推式`,
      String.raw`\(\dfrac{\partial V(t)}{\partial t} = \dfrac{C}{N(t)}\)；\(F_i^{k+1} = \max\bigl(V(a_i^{k+1}),\, F_i^k\bigr) + \dfrac{L_i^{k+1}}{w_i}\)。`
    ],
    [
      String.raw`（Lec12）WFQ、EEVDF、Lottery、RR 的服务滞后（Service Lag）与调度复杂度对比`,
      String.raw`WFQ：滞后 \(O(n)q\)、复杂度 \(O(\log n)\)；EEVDF：滞后 \(O(1)q\)、复杂度 \(O(\log n)\)；Lottery：滞后 \(O(\sqrt{n})q\)、复杂度 \(O(1)\)；RR：滞后 \(O(n)q\)、复杂度 \(O(n)\)。`
    ]
  ]
});
