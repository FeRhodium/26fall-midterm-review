Review.add({
  id: "l10", group: "lecture", n: 10,
  short: "L10 现代系统并发",
  title: "Lecture 10 · 现代计算机系统中的并发：PipeDream、Orca 与 DistServe",
  meta: "10 月 15 日 · Modern Computer Systems: Synchronization",
  sources: [{ label: "lec10 课件", href: "materials/lectures/lec10-modern-currency.pdf" }],
  html: String.raw`
<p class="lede">本讲介绍现代计算机系统研究中的并发与机器学习系统架构：(1) 计算机系统顶级会议体系与现代并发错误基准（RaceBench 与 Go 并发 bug 分类）；(2) 深度神经网络训练的三种并行范式（数据并行、模型并行、PipeDream 流水线并行及其 1F1B 调度与权重版本暂存）；(3) 大语言模型（LLM）推理服务系统的两项核心演进——Orca 的迭代级调度与选择性批处理，以及 DistServe 的预填充（Prefill）与解码（Decode）分离架构。</p>

<h2>1. 系统研究会议体系与现代并发缺陷分析</h2>
<ul>
<li><b>核心操作系统学术会议</b>：<b>SOSP</b>（ACM Symposium on Operating Systems Principles）、<b>OSDI</b>（USENIX Symposium on Operating Systems Design and Implementation）、<b>EuroSys</b>、<b>USENIX ATC</b>。相关领域顶会包括分布式与网络（NSDI、SIGCOMM）、体系结构（ASPLOS、ISCA、MICRO）、编程语言（PLDI、POPL）与系统安全（IEEE S&amp;P、CCS、USENIX Security、NDSS）。</li>
<li><b>RaceBench（CCS'23）</b>：针对并发缺陷因依赖特定调度交错而难以稳定触发和观测的问题，在真实程序中构造可复现触发且触发后具有明确可观测状态的并发 bug 基准集，用于定量评估并发模糊测试（Fuzzing）与数据竞争检测工具。</li>
<li><b>Go 语言真实并发缺陷研究（ASPLOS'19）</b>：对 Docker、Kubernetes 等大型 Go 系统的实证研究表明，并发缺陷可分为<b>阻塞型缺陷（Blocking Bugs，如互斥锁或通道等待形成死锁）</b>与<b>非阻塞型缺陷（Non-Blocking Bugs，如数据竞争）</b>；采用消息传递原语（<code>channel</code>）引发的并发 bug 数量并不低于传统共享内存锁，说明新原语同样需要严格的同步不变式设计。</li>
</ul>

<h2>2. 深度学习训练的三种并行范式</h2>
<p>神经网络训练通过随机梯度下降迭代更新权重：\(W_{t+1}=W_t-\alpha\,\nabla f(W_t)\)，每次迭代包含前向传播（计算激活与损失）与反向传播（计算梯度并更新权重）。</p>
<table>
<thead><tr><th>并行方式</th><th>模型与数据切分方式</th><th>主要性能瓶颈</th></tr></thead>
<tbody>
<tr><td><b>数据并行（Data Parallelism）</b></td><td>每个工作节点（Worker）持有完整的模型权重副本，处理不同的训练数据子集，每步通过 <code>AllReduce</code> 汇总全局梯度 \(\nabla W=\sum_i\nabla W_i\)</td><td>每一步迭代都必须跨节点同步全部模型参数的梯度，在大模型下通信开销极高</td></tr>
<tr><td><b>朴素模型并行（Model Parallelism）</b></td><td>将模型的不同层切分到不同 Worker 上，仅存一份权重；前向激活值与反向梯度在相邻 Worker 间点对点传递</td><td>由于单个微批次（minibatch）的前后向存在严格的数据依赖，<b>同一时刻只有一个 Worker 处于计算状态</b>，其余设备空闲，硬件利用率极低</td></tr>
<tr><td><b>流水线并行（Pipeline Parallelism，PipeDream）</b></td><td>结合模型并行与数据并行，将连续多个 minibatch 依次注入多阶段模型流水线，使不同阶段同时处理不同的 minibatch</td><td>需解决阶段负载均衡划分、前向/后向交替调度、以及多版本权重一致性三个问题</td></tr>
</tbody>
</table>
<p>注：算子内模型切分还包含<b>张量并行（Tensor Parallelism，切分单层内的矩阵乘法）</b>与<b>专家并行（Expert Parallelism，将 MoE 模型的不同专家分布在不同设备上）</b>。</p>

<h2>3. PipeDream（SOSP'19）：通用流水线并行训练系统</h2>
<p>PipeDream 通过三项机制消除朴素模型并行的设备空闲并降低数据并行的通信开销：</p>
<ol>
<li><b>阶段划分与按需复制（Stage Partitioning with Replication）</b>：使用性能分析器测量每一层的计算耗时、激活张量大小与参数量，通过优化算法将层划分为多个流水线阶段，满足两条目标：(i) <b>各阶段的计算时间 \(t_1,t_2,\dots\) 尽可能相等</b>（消除慢阶段造成的流水线等待）；(ii) <b>阶段边界处的激活传输量 \(t^{\text{comm}}_{k\to k+1}\) 尽可能小</b>。同时允许对计算耗时长的阶段进行数据并行复制（如配置 <code>2-3-2-1</code> 表示四个阶段分别部署 2、3、2、1 个副本）。</li>
<li><b>1F1B（One-Forward-One-Backward）双向调度</b>：在启动填充期之后进入稳定状态，每个 Worker <b>严格交替执行一次前向传播和一次反向传播</b>，使所有 GPU 持续保持满载计算，且反向传播算出的梯度可立即用于更新参数。</li>
<li><b>权重版本暂存（Weight Stashing）</b>：在流水线中，当第 \(n\) 个 minibatch 在某阶段执行前向传播时使用的是权重版本 \(W^{(n)}\)；但当该 minibatch 的反向传播回到同一阶段时，后续 minibatch 的反向传播已经将该阶段的权重更新为 \(W^{(n+p)}\)。若用新权重 \(W^{(n+p)}\) 计算第 \(n\) 个批次的梯度，会导致数学上的梯度计算错误。<b>Weight Stashing 要求每个阶段为尚在流水线中未完成反向传播的 minibatch 暂存其前向传播时所使用的权重版本 \(W^{(n)}\) 与中间激活值</b>，从而严格保证同一 minibatch 的前向与反向传播使用完全相同的权重版本。</li>
</ol>

<h2>4. Orca（OSDI'22）：大语言模型推理的迭代级调度</h2>
<p>自回归大语言模型（LLM）逐个生成输出 token，不同请求的输出长度差异很大。传统的<b>请求级批处理（Request-level Batching）</b>必须等待整批请求中生成最长的那个请求完全结束后，才能释放已完成请求的资源并接纳新请求，造成大量 GPU 空闲。</p>
<ul>
<li><b>迭代级调度（Iteration-level Scheduling / Continuous Batching）</b>：将调度粒度从“整个请求”细化为“单次前向迭代”——每完成一次 token 生成迭代，立即将已生成结束符的请求移出批次返回给用户，并将新到达的请求动态加入下一轮迭代批次。</li>
<li><b>选择性批处理（Selective Batching）</b>：针对不同请求的序列长度不同，仅对依赖序列长度的 Attention 算子按请求分别计算，而对占计算量主体的线性层（矩阵乘法）将所有请求的 token 拼接为一个二维张量统一批处理，兼顾批处理效率与灵活调度。</li>
</ul>

<h2>5. DistServe（OSDI'24）：分离 Prefill 与 Decode 阶段</h2>
<h3>5.1 LLM 推理的两个阶段与延迟指标</h3>
<table>
<thead><tr><th>阶段</th><th>计算特征与硬件瓶颈</th><th>决定的延迟指标</th></tr></thead>
<tbody>
<tr><td><b>预填充（Prefill）</b></td><td>一次性并行处理用户输入的全部提示词（Prompt）token，生成第 1 个输出 token 并构建初始 KV Cache；属于<b>计算密集型（Compute-bound）</b></td><td>决定<b>首 token 延迟 TTFT（Time To First Token）</b></td></tr>
<tr><td><b>解码（Decode）</b></td><td>后续每步迭代仅输入 1 个 token，读取全部历史 KV Cache 并生成下一个 token；属于<b>访存带宽密集型（Memory-bandwidth-bound）</b></td><td>决定<b>每输出 token 延迟 TPOT（Time Per Output Token）</b></td></tr>
</tbody>
</table>
<p>单次请求的总生成延迟为 \(\text{Latency}=\text{TTFT}+\text{TPOT}\times(\text{输出 token 数})\)。系统优化目标是最大化<b>单 GPU 有效吞吐量（Goodput）</b>——即在满足给定比例（如 90%）请求同时达到 TTFT 与 TPOT 服务等级目标（SLO）的前提下，平均每张 GPU 每秒完成的最大请求数。</p>

<h3>5.2 共置批处理的两大缺陷与分离架构</h3>
<p>现有系统（如 Orca、vLLM）将 Prefill 与 Decode 请求混合在同一 GPU 实例的同一批次中执行，存在两项结构性缺陷：</p>
<ul>
<li><b>缺陷 1：Prefill–Decode 相互干扰</b>。在同批次中，长 Prompt 的 Prefill 会大幅拉长该批次的执行时间，导致同批次中的 Decode 请求等待时间激增（破坏 TPOT）；反之 Decode 请求也会占用显存与带宽，延缓 Prefill。</li>
<li><b>缺陷 2：资源配比与并行策略强耦合</b>。计算密集的 Prefill 与访存密集的 Decode 对张量并行（TP）和流水线并行（PP）的最优配置截然不同，共置部署迫使两者使用同一种并行策略与相同的实例数量。</li>
</ul>
<p><b>DistServe 的分离设计</b>：将集群划分为独立的 <b>Prefill 实例</b>与 <b>Decode 实例</b>（如 <code>2P1D</code>）：请求先在 Prefill 实例上完成首 token 生成，随后将生成的 KV Cache 传输至 Decode 实例完成后续自回归生成。为降低跨实例传输 KV Cache 的网络开销，在节点间带宽受限（低节点亲和性）的集群中，DistServe 的放置算法将<b>Prefill 实例与 Decode 实例的同一流水线阶段部署在同一物理节点内部</b>，使 KV Cache 仅通过节点内高速互连（NVLink）传输。</p>

<h2>考前清单</h2>
<ul>
<li>四大 OS 顶会（SOSP、OSDI、EuroSys、ATC）；数据并行（AllReduce 梯度同步）、模型并行（串行依赖导致低利用率）、流水线并行（PipeDream）的对比。</li>
<li>PipeDream 的三项关键技术：负载均衡与阶段复制、1F1B 交替调度、Weight Stashing（保证同一批次前后向使用相同权重版本）。</li>
<li>Orca 的迭代级调度（Continuous Batching）与选择性批处理。</li>
<li>DistServe：Prefill（计算密集、决定 TTFT）与 Decode（访存密集、决定 TPOT）的区分、Goodput 的定义、共置批处理的两大缺陷（相互干扰与策略耦合）、以及分离后的同节点阶段放置策略。</li>
</ul>
`,
  questions: [
    { id: "q1", tag: "slide", kind: "single", q: String.raw`在分布式深度学习训练中，“每个 Worker 持有完整模型副本、处理不同数据分片、每步通过 AllReduce 汇总全局梯度”属于`, choices: [["a", "数据并行（Data Parallelism）"], ["b", "模型并行（Model Parallelism）"], ["c", "流水线并行（Pipeline Parallelism）"]], answer: ["a"], why: String.raw`数据并行复制完整模型并切分数据，瓶颈在于每步同步全量模型梯度的 AllReduce 通信。` },
    { id: "q2", tag: "slide", kind: "single", q: String.raw`朴素模型并行（将不同层放在不同设备上，一次只跑一个 minibatch）最主要的性能缺陷是`, choices: [["a", "需要存储多份完整的模型权重"], ["b", "由于层间严格的前后向顺序依赖，同一时刻只有一个设备处于计算状态，硬件利用率极低"], ["c", "需要使用 AllReduce 同步全部参数"]], answer: ["b"], why: String.raw`单个 minibatch 在某一时刻只能位于某一个阶段，其余阶段全部空闲等待。` },
    { id: "q3", tag: "slide", kind: "single", q: String.raw`PipeDream 中的权重暂存（Weight Stashing）机制是为了解决什么问题？`, choices: [["a", "减少 GPU 显存占用"], ["b", "防止同一 minibatch 的前向传播与反向传播使用不同版本的权重参数而导致梯度计算错误"], ["c", "消除阶段之间的激活值传输"]], answer: ["b"], why: String.raw`在流水线中，某批次的前向与反向传播之间权重会被其他批次更新；Weight Stashing 为每个在途批次保留其前向时的权重版本。` },
    { id: "q4", tag: "slide", kind: "single", q: String.raw`PipeDream 的 1F1B 调度策略是指在流水线进入稳定状态后`, choices: [["a", "每个 Worker 仅执行一次前向和一次反向后即退出"], ["b", "每个 Worker 严格交替执行一个微批次的前向传播与一个微批次的反向传播"], ["c", "所有 Worker 先执行完全部批次的前向传播，再统一执行反向传播"]], answer: ["b"], why: String.raw`1F1B 使各阶段设备持续满载并及时完成反向梯度更新。` },
    { id: "q5", tag: "slide", kind: "multi", q: String.raw`PipeDream 在将神经网络层划分为流水线阶段时，遵循哪些优化原则？`, choices: [["a", "使各个阶段的计算耗时尽可能均衡"], ["b", "使阶段边界处需要跨设备传输的激活与梯度数据量尽可能小"], ["c", "允许对计算耗时长但参数量小的阶段进行数据并行复制（如 2-3-2-1 配置）"], ["d", "强制要求每个阶段只能包含单个算子"]], answer: ["a", "b", "c"], why: String.raw`均衡各阶段耗时并最小化边界通信量可最大化流水线吞吐，且支持按阶段混合数据并行复制。` },
    { id: "q6", tag: "slide", kind: "multi", q: String.raw`关于大语言模型（LLM）推理的两个阶段，下列哪些叙述正确？`, choices: [["a", "Prefill 阶段并行处理整个输入提示词，属于计算密集型（Compute-bound）"], ["b", "Decode 阶段每次迭代仅生成 1 个 token 并读取历史 KV Cache，属于访存带宽密集型（Memory-bound）"], ["c", "首 token 延迟（TTFT）主要由 Decode 阶段决定"], ["d", "请求总延迟等于 \(\text{TTFT}+\text{TPOT}\times\text{输出 token 数}\)"]], answer: ["a", "b", "d"], why: String.raw`TTFT 由 Prefill 阶段决定，TPOT 由 Decode 阶段决定。` },
    { id: "q7", tag: "slide", kind: "single", q: String.raw`DistServe 系统所优化的核心性能指标是`, choices: [["a", "不考虑延迟约束的原始总 token 吞吐量"], ["b", "在满足延迟服务等级目标（SLO 达成率）前提下的每 GPU 有效吞吐量（Goodput）"], ["c", "模型训练的收敛步数"]], answer: ["b"], why: String.raw`Goodput 仅统计同时满足 TTFT 与 TPOT 延迟 SLO 约束的有效完成请求速率。` },
    { id: "q8", tag: "slide", kind: "multi", q: String.raw`将 Prefill 与 Decode 混合在同一 GPU 实例的同一批次中执行会导致哪些问题？`, choices: [["a", "长 Prompt 的 Prefill 会阻塞同批次的 Decode 迭代，导致 TPOT 显著恶化"], ["b", "计算密集的 Prefill 与访存密集的 Decode 被迫共享同一种并行策略与相同的资源配比"], ["c", "完全消除了 KV Cache 的显存占用"]], answer: ["a", "b"], why: String.raw`共置执行会产生严重的阶段间干扰（Interference）并耦合两阶段的并行策略。` },
    { id: "q9", tag: "slide", kind: "single", q: String.raw`在节点间网络带宽较低而节点内拥有高速 NVLink 的集群中，DistServe 为降低 KV Cache 跨实例传输开销采取的放置约束是`, choices: [["a", "将 Prefill 实例与 Decode 实例对应的同一流水线阶段部署在同一个物理节点内"], ["b", "在 Decode 实例上重新执行一遍完整的 Prefill 计算"], ["c", "丢弃一半的 KV Cache"]], answer: ["a"], why: String.raw`KV Cache 仅在相同模型层（同一流水线阶段）之间传输，同阶段共置同一节点即可直接走高速 NVLink。` },
    { id: "q10", tag: "slide", kind: "single", q: String.raw`Orca 提出的迭代级调度（Iteration-level Scheduling）相比传统请求级批处理的核心改进是`, choices: [["a", "在每次单步前向迭代结束后，已生成完毕的请求可立即离开批次，新到达的请求可立即加入批次"], ["b", "将模型参数精度压缩为 1 比特"], ["c", "无需计算 Attention 层"]], answer: ["a"], why: String.raw`迭代级调度消除了短请求等待同批次长请求完成所造成的 GPU 空闲。` },
    { id: "q11", tag: "slide", kind: "multi", q: String.raw`下列哪些属于计算机操作系统领域的核心顶级会议？`, choices: [["a", "SOSP"], ["b", "OSDI"], ["c", "SIGGRAPH"], ["d", "ICCV"]], answer: ["a", "b"], why: String.raw`SOSP 与 OSDI（以及 EuroSys、USENIX ATC）是操作系统领域的核心顶会。` }
  ],
  cards: [
    [String.raw`操作系统领域的四个核心顶会`, String.raw`SOSP、OSDI、EuroSys、USENIX ATC。`],
    [String.raw`数据并行与朴素模型并行的各自瓶颈`, String.raw`数据并行瓶颈在于每步 AllReduce 同步全量梯度；朴素模型并行瓶颈在于层间依赖导致同一时刻仅一个设备计算。`],
    [String.raw`PipeDream 解决的三个核心问题`, String.raw`负载均衡与最小通信阶段划分、1F1B 前后向交替调度、Weight Stashing 权重版本一致性。`],
    [String.raw`Weight Stashing（权重暂存）的作用`, String.raw`为每个在途 minibatch 保存其前向传播时的权重版本，确保同一批次的前向与反向传播使用相同权重。`],
    [String.raw`Orca 的两项核心技术`, String.raw`迭代级调度（Continuous Batching）与选择性批处理（Selective Batching）。`],
    [String.raw`LLM 推理中 Prefill 与 Decode 的特征对比`, String.raw`Prefill 为计算密集型，决定 TTFT；Decode 为访存带宽密集型，决定 TPOT。`],
    [String.raw`DistServe 中 Goodput 的定义`, String.raw`在达到目标 SLO 达成率（同时满足 TTFT 与 TPOT 约束）下，每张 GPU 每秒服务的最大请求数。`],
    [String.raw`DistServe 分离 Prefill 与 Decode 解决的两个问题`, String.raw`消除 Prefill 与 Decode 同批次相互干扰；解耦两阶段的并行策略与资源配比。`]
  ]
});
