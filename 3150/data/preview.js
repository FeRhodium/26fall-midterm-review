Review.add({
  id: "p-cluster", group: "preview", n: 14,
  short: "L14 集群调度论文",
  title: "预习 · Lecture 14：现代计算机系统中的集群调度（Firmament、Gandiva 与 Synergy）",
  meta: "对应 10 月 29 日 Lecture 14 · Modern Computer Systems: Scheduling",
  sources: [{ label: "课程表（schedule）", href: "materials/schedule.html" }],
  html: String.raw`
<p class="lede">本章整理期中考试范围的最后一讲（Lecture 14: Modern Computer Systems: Scheduling）指定的三篇 OSDI 顶会集群调度论文：<b>Firmament（OSDI'16）</b>、<b>Gandiva（OSDI'18）</b>与 <b>Synergy（OSDI'22）</b>，与 Lecture 10 的单作业并行/推理调度形成完整呼应。</p>

<h2>1. 三篇集群调度论文核心问题与机制对比</h2>
<table>
  <thead>
    <tr>
      <th>论文系统</th>
      <th>针对的核心瓶颈</th>
      <th>关键机制与算法创新</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Firmament</b><br>（OSDI'16）</td>
      <td>传统集中式调度器在面临<b>高质量放置（复杂亲和性/反亲和性约束）</b>与<b>万级节点下的亚秒级低延迟</b>时难以兼得（简单启发式放置质量差，而全局组合优化耗时过长）</td>
      <td>将集群调度建模为流网络上的<b>最小费用最大流（Min-Cost Max-Flow, MCMF）</b>问题；利用集群状态随时间缓慢变化的特征，设计<b>增量式流求解算法</b>，在万台服务器规模上实现亚秒级（Sub-second）的高质量全局调度</td>
    </tr>
    <tr>
      <td><b>Gandiva</b><br>（OSDI'18）</td>
      <td>深度学习（DL）训练集群若像传统大数据集群那样让作业<b>独占固定 GPU 直至跑完</b>，会导致超参数搜索等探索性短任务经历极长的排队延迟，且单任务往往无法吃满整张 GPU 的显存与算力</td>
      <td>利用 DL 训练<b>微批次（Mini-batch）迭代高度规律、显存占用在迭代边界骤降</b>的领域特征，引入：(1) <b>低开销挂起-恢复与时间片抢占共享（Time-slicing）</b>；(2) <b>剖析驱动的多任务单卡打包（Packing）</b>；(3) <b>跨节点透明动态迁移（Migration）</b>以实现碎片整理与亲和性重排</td>
    </tr>
    <tr>
      <td><b>Synergy</b><br>（OSDI'22）</td>
      <td>现有 DL 集群调度器通常按<b>每张 GPU 固定绑定成比例的 CPU 核心与主机内存</b>（GPU-proportional allocation）；但不同 DNN 模型的数据加载与预处理流水线对 CPU/内存的敏感度差异极大，导致部分任务因 CPU 饥饿而使昂贵的 GPU 空转（Data stall），另一部分任务则浪费多余 CPU</td>
      <td>打破“按 GPU 比例僵化绑定 CPU/内存”的假设：在线剖析各作业在不同 CPU/内存配比下的吞吐收益（<b>敏感度曲线 Sensitivity profiling</b>），通过<b>跨作业异构资源配比与打包算法</b>（乐观分配 Optimistic / 公平共享变体），在不增加硬件的前提下成倍提升集群整体吞吐量并保持租户公平性</td>
    </tr>
  </tbody>
</table>

<h2>2. 深度解析：Firmament（OSDI'16）</h2>
<ul>
  <li><b>流网络建模</b>：将每个待调度任务、任务分组（Aggregator）、机器节点、机架分别表示为有向图中的顶点，最后一个汇点（Sink）汇总所有已调度流量：
    <ul>
      <li>边的<b>容量（Capacity）</b>表示资源并发上限（如单核同时运行 1 个任务）；</li>
      <li>边的<b>费用（Cost）</b>编码调度策略偏好（如数据局部性 Data locality、机架亲和性、负载均衡、任务优先级与等待时间）。</li>
    </ul>
  </li>
  <li><b>为什么能做到亚秒级延迟？</b>每次集群状态变化（新任务到达、旧任务结束）只改动流网络中的极小一部分边。Firmament 不从头重算，而是复用上一轮的最优流结果，仅对增量变化部分运行松弛/增广算法（Incremental Min-Cost Max-Flow），将调度延迟控制在百毫秒量级。</li>
</ul>

<h2>3. 深度解析：Gandiva（OSDI'18）</h2>
<ul>
  <li><b>内省（Introspection）的含义</b>：调度器不再把 GPU 作业当作黑盒，而是实时监测作业的每个 mini-batch 迭代耗时（吞吐率）与显存波动曲线。</li>
  <li><b>为什么必须在 Mini-batch 迭代边界执行挂起（Suspend）？</b>在一次前向传播中间，GPU 显存中驻留着海量的中间层激活张量（Activations，可达数十 GB）；而在反向传播刚结束、优化器更新完权重的<b>迭代边界（Iteration boundary）</b>，中间激活已全部释放，显存中只剩模型权重与优化器状态（仅占峰值显存的一小部分），此时将显存拷贝回主机内存以切换任务的开销最小！</li>
  <li><b>剖析驱动的打包（Profiling-based Packing）</b>：只有当两个作业总显存不超过 GPU 容量，且打包合跑后的联合吞吐速率大于各自独占分时运行速率之和（即无严重算力争用）时，才将它们打包在同一张 GPU 上同时运行。</li>
</ul>

<h2>4. 深度解析：Synergy（OSDI'22）</h2>
<ul>
  <li><b>数据供给瓶颈（CPU/Memory Stall）</b>：图像分类（如 ResNet 解码 JPEG 与数据增强）、推荐系统等模型高度依赖 CPU 线程与内存带宽向 GPU 喂数据；而大语言模型（Transformer）则主要受限于 GPU 算力，几乎不需要多少 CPU 核心。</li>
  <li><b>固定比例分配（GPU-Proportional）的弊端</b>：假设服务器有 8 张 GPU 和 64 个 CPU 核（默认每张 GPU 绑 8 核）。若 1 张 GPU 跑图像模型（需要 24 核才能喂饱 GPU），另外 3 张 GPU 跑语言模型（每张只需 2 核），按固定比例分配会导致图像模型因只有 8 核而使 GPU 利用率跌至 33%，而语言模型却白白闲置了 18 个 CPU 核！</li>
  <li><b>Synergy 的异构配比调度</b>：通过短时间在线测量每个作业在不同 CPU/内存数量下的迭代速度，将富余的 CPU 与内存动态划拨给对 CPU/内存敏感的作业，同时通过轮转与份额补偿确保多租户长期公平性。</li>
</ul>
`,
  questions: [
    {
      id: "l14-q1",
      tag: "practice",
      kind: "single",
      q: String.raw`Firmament（OSDI'16）集中式集群调度器将大规模数据中心的任务放置与调度问题形式化为什么数学优化问题？`,
      choices: [
        ["a", String.raw`流网络上的最小费用最大流（Min-Cost Max-Flow）问题，并通过增量式求解实现亚秒级调度延迟`],
        ["b", String.raw`布尔可满足性（3-SAT）问题`],
        ["c", String.raw`快速傅里叶变换（FFT）`],
        ["d", String.raw`银行家死锁检测问题`]
      ],
      answer: ["a"],
      why: String.raw`Firmament 用流网络边的容量表示资源限制、边的费用表示亲和性与局部性偏好，通过增量最小费用最大流算法求解。`
    },
    {
      id: "l14-q2",
      tag: "practice",
      kind: "single",
      q: String.raw`Gandiva（OSDI'18）在实现深度学习训练作业的 GPU 时间片切换（Time-slicing）与迁移时，为什么选择在微批次迭代边界（Mini-batch boundary）挂起任务？`,
      choices: [
        ["a", String.raw`因为迭代边界处前向传播产生的海量中间激活张量（Activations）已释放，GPU 显存占用处于最低谷，此时保存/拷贝显存状态的开销最小`],
        ["b", String.raw`因为 GPU 硬件不允许在矩阵乘法执行完毕后发生中断`],
        ["c", String.raw`因为迭代边界处模型权重全部变为 0，无需保存任何数据`],
        ["d", String.raw`因为只有迭代边界处网络套接字才处于关闭状态`]
      ],
      answer: ["a"],
      why: String.raw`DL 训练的显存占用呈周期性锯齿状，在迭代边界仅需保存模型参数与优化器状态，无需搬运庞大的中间层激活值。`
    },
    {
      id: "l14-q3",
      tag: "practice",
      kind: "single",
      q: String.raw`Synergy（OSDI'22）指出传统深度学习集群采用“按每张 GPU 固定比例分配 CPU 与内存（GPU-proportional allocation）”的主要缺陷是什么？`,
      choices: [
        ["a", String.raw`不同 DNN 作业的数据预处理对 CPU 核心数与内存带宽的敏感度差异极大，固定配比会使数据密集型作业因 CPU 饥饿导致 GPU 空转，同时在计算密集型作业上闲置大量 CPU`],
        ["b", String.raw`固定比例分配必然引发死锁`],
        ["c", String.raw`GPU 无法直接访问自身显存`],
        ["d", String.raw`固定比例分配会使上下文切换耗时增加 100 倍`]
      ],
      answer: ["a"],
      why: String.raw`Synergy 通过剖析各作业的 CPU/内存敏感度曲线，打破固定 GPU:CPU:内存配比，实现跨作业异构资源分配。`
    }
  ],
  cards: [
    [
      String.raw`（Lec14）Firmament（OSDI'16）的核心思想`,
      String.raw`将集群任务放置建模为图上的最小费用最大流（Min-Cost Max-Flow），利用增量式流求解在万级节点上实现亚秒级高质量调度。`
    ],
    [
      String.raw`（Lec14）Gandiva（OSDI'18）如何提升 DL 训练集群的响应速度与利用率？`,
      String.raw`利用 DL 迭代周期规律性，在显存最低的 mini-batch 边界执行时间片抢占切换（Time-slicing）、跨节点动态迁移与多任务单卡打包（Packing）。`
    ],
    [
      String.raw`（Lec14）Synergy（OSDI'22）解决什么问题？`,
      String.raw`打破“按 GPU 数量固定比例绑定 CPU/内存”的限制，在线剖析各作业对 CPU/内存的敏感度并进行异构配比调度，消除数据预处理导致的 GPU 空转。`
    ]
  ]
});
