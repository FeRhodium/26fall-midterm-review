Review.add({
  id: "w6b", group: "lecture", n: 2,
  short: "W6B 概率哈希与布隆过滤器",
  title: "Week 6B · 集中不等式、Balls & Bins、完美哈希与布隆过滤器",
  meta: "Week 6 Lectures 2–4 · Balls and Bins / Perfect Hashing / Bloom Filters",
  sources: [
    { label: "L06_2 Balls and Bins PDF", href: "materials/w6/L06_2_balls_and_bins_2026.pdf" },
    { label: "L06_3 Perfect Hashing PDF", href: "materials/w6/L06_3_perfect_hashing_2026.pdf" },
    { label: "L06_4 Bloom Filters PDF", href: "materials/w6/L06_4_Bloom_Filters_2026.pdf" },
    { label: "Pre-lecture: Perfect Hashing & Bloom 讲义", href: "materials/w6/csc4120-perfect-hashing-bloom-portable.md" }
  ],
  html: String.raw`
<p class="lede">本讲建立哈希函数的概率分析工具箱：首先给出三大集中不等式（Markov、Chebyshev、Hoeffding），然后分析 \(n\) 个球随机投入 \(m\) 个桶（Balls and Bins）的五大统计量与最大负载定理，最后用这些工具解决两个核心工程问题——如何在 \(O(N)\) 空间内实现<b>最坏情况 \(O(1)\) 查找的静态完美哈希（Perfect Hashing）</b>，以及如何用极少比特实现<b>无假阴性的布隆过滤器（Bloom Filter）</b>。</p>

<h2>1. 三大集中不等式（Concentration Inequalities）</h2>
<p>当我们只知道随机变量 \(X\) 的少量矩信息时，如何约束它偏离均值的概率？</p>
<table>
<thead><tr><th>不等式</th><th>前提条件</th><th>核心公式</th><th>衰减速度与特点</th></tr></thead>
<tbody>
<tr><td><b>Markov 不等式</b></td><td>\(X \ge 0\)（非负随机变量），已知均值 \(E[X]\)</td><td>\[\Pr[X \ge t] \le \frac{E[X]}{t}\]</td><td>按 \(1/t\) 线性衰减，最粗糙但只需一阶矩（完美哈希证明的核心工具）</td></tr>
<tr><td><b>Chebyshev 不等式</b></td><td>已知均值 \(\mu = E[X]\) 与方差 \(\operatorname{Var}(X) = E[(X-\mu)^2]\)</td><td>\[\Pr[|X - \mu| \ge t] \le \frac{\operatorname{Var}(X)}{t^2}\]</td><td>按 \(1/t^2\) 二次衰减，比 Markov 更紧</td></tr>
<tr><td><b>Hoeffding 不等式</b></td><td>\(S_n = \sum_{i=1}^n X_i\)，其中 \(X_i \in [0,1]\) 相互独立，\(\mu = E[X_i]\)</td><td>\[\Pr[|S_n - E[S_n]| &gt; t] &lt; 2e^{-t^2/n}\]<br>取 \(t = \alpha n\) 得样本均值：<br>\[\Pr\!\left[\left|\frac{S_n}{n} - \mu\right| &gt; \alpha\right] &lt; 2e^{-\alpha^2 n}\]</td><td>随 \(n\) <b>指数级</b>（\(e^{-\alpha^2 n}\)）衰减，大数定律的定量化</td></tr>
</tbody>
</table>

<h2>2. Balls and Bins 模型（\(n\) 球随机投 \(m\) 桶，SUHA）</h2>
<p>在简单一致哈希假设（SUHA）下，将 \(n\) 个键哈希到 \(m\) 个槽位等价于将 \(n\) 个球独立均匀地投入 \(m\) 个桶：</p>

<h3>2.1 四大基础期望值（利用指示器随机变量与期望线性性）</h3>
<ol>
<li><b>单个桶 \(i\) 中的期望球数</b>：令 \(X_{ik} = \mathbf{1}\{\text{球 } k \text{ 落入桶 } i\}\)，则 \(X_i = \sum_{k=1}^n X_{ik}\)，故：
\[E[X_i] = \sum_{k=1}^n E[X_{ik}] = \frac{n}{m} = \alpha\]
</li>
<li><b>期望空桶数（HW5 Q4 考点）</b>：令 \(Z_i = \mathbf{1}\{\text{桶 } i \text{ 为空}\}\)，则 \(\Pr[Z_i=1] = \left(1 - \frac{1}{m}\right)^n\)，总空桶数 \(Z = \sum_{i=1}^m Z_i\)：
\[E[Z] = m\left(1 - \frac{1}{m}\right)^n \approx m e^{-n/m}\]
  <ul>
  <li>当 \(m = n\) 且 \(n\) 很大时，\(E[Z] \approx \frac{n}{e} \approx 0.368n\)。</li>
  <li>（HW5 Q4）当 \(m = \sqrt{n}\) 时，\(E[Z] \approx \sqrt{n} e^{-\sqrt{n}} \to 0\)；当 \(m = cn\ (c&gt;0)\) 时，\(E[Z] \approx cn e^{-1/c} \to \infty\)；当 \(m = n^a\ (a&gt;1)\) 时，\(E[Z] \approx n^a \to \infty\)。</li>
  </ul>
</li>
<li><b>期望碰撞对数与生日悖论（Birthday Paradox）</b>：令 \(X_{ij} = \mathbf{1}\{\text{球 } i, j \text{ 落入同一桶}\}\ (i &lt; j)\)，则 \(E[X_{ij}] = 1/m\)。共有 \(\binom{n}{2}\) 对球，由期望线性性（<b>无需各对独立！</b>）：
\[E[\text{碰撞对数}] = \sum_{1\le i &lt; j \le n} E[X_{ij}] = \binom{n}{2}\frac{1}{m} = \frac{n(n-1)}{2m}\]
当 \(m = 365\) 时，令期望碰撞对数 \(\frac{n(n-1)}{2\times 365} = 1\)，解得 \(n = 28\) 人（若问碰撞概率 \(\ge 50\%\) 则为 \(23\) 人）。</li>
<li><b>全部桶非空所需的期望投球数（Coupon Collector 集卡问题）</b>：设 \(X_i\) 为从“已有 \(i-1\) 个非空桶”到“出现第 \(i\) 个非空桶”所投的球数。此时每次投中空桶的成功概率为 \(p_i = \frac{m - (i - 1)}{m}\)，服从几何分布，故 \(E[X_i] = \frac{1}{p_i} = \frac{m}{m - i + 1}\)。总投球数 \(X = \sum_{i=1}^m X_i\) 的期望为：
\[E[X] = \sum_{i=1}^m \frac{m}{m - i + 1} = m\sum_{j=1}^m \frac{1}{j} = m H_m \approx m \ln m\]
</li>
</ol>

<h3>2.2 最大负载（Max-Load）定理与“两次选择的威力”</h3>
<p>当 \(n = m\) 时，单个桶的平均值虽然是 \(1\)，但最满的那个桶 \(L = \max_i X_i\) 有多大？</p>
<ul>
<li><b>定理</b>：当 \(n = m\) 时，以极高概率（whp，即概率 \(&gt; 1 - \frac{1}{n^2}\)）有：
\[L = \Theta\!\left(\frac{\ln n}{\ln \ln n}\right)\]
</li>
<li><b>课件三引理证明法（必背）</b>：
  <ol>
  <li><b>Lemma 1</b>：桶 \(i\) 至少有 \(k\) 个球意味着存在某个大小为 \(k\) 的球子集全部落入桶 \(i\)。由 Union Bound：
  \[\Pr[\text{bin } i \text{ has } \ge k \text{ balls}] \le \binom{n}{k}\left(\frac{1}{n}\right)^k\]</li>
  <li><b>Lemma 2</b>：利用“临终不等式（death-bed inequality）” \(\left(\frac{x}{y}\right)^y \le \binom{x}{y} \le \left(\frac{ex}{y}\right)^y\)，上式放缩为 \(\le \left(\frac{en}{k}\right)^k \left(\frac{1}{n}\right)^k = \left(\frac{e}{k}\right)^k\)。代入 \(k = \frac{4\ln n}{\ln \ln n}\)，取对数化简可得：
  \[\Pr\!\left[\text{bin } i \text{ has } \ge \frac{4\ln n}{\ln \ln n} \text{ balls}\right] &lt; e^{-3\ln n} = \frac{1}{n^3}\]</li>
  <li><b>Lemma 3</b>：对全部 \(n\) 个桶再次使用 Union Bound：
  \[\Pr\!\left[\exists i,\ \text{bin } i \ge \frac{4\ln n}{\ln \ln n}\right] \le \sum_{i=1}^n \Pr\!\left[\text{bin } i \ge \frac{4\ln n}{\ln \ln n}\right] &lt; n \cdot \frac{1}{n^3} = \frac{1}{n^2}\]
  因此，以 \(&gt; 1 - 1/n^2\) 的概率，所有桶的球数都不超过 \(\frac{4\ln n}{\ln \ln n}\)。</li>
  </ol>
</li>
<li><b>The Power of Two Choices（两次选择的威力）</b>：如果在放入每个球前，随机挑 <b>2 个桶</b>（用 2 个独立哈希函数 \(h_1, h_2\)）并把球放进当前较空的那一个，最大负载会从 \(\Theta\left(\frac{\ln n}{\ln \ln n}\right)\) 戏剧性地暴跌至指数级更小的：
\[L = \Theta\!\left(\frac{\ln \ln n}{\ln \ln \ln n}\right) \quad \text{w.h.p.}\]
</li>
</ul>

<h2>3. 静态完美哈希（Perfect Hashing，FKS 双层结构）</h2>
<p>当含 \(N\) 个键的集合 \(S\) 固定不变时，能否把随机性从“查询时”挪到“建表时”，做到<b>最坏情况（而非仅仅期望）\(O(1)\) 次访存完成查询</b>且零碰撞？</p>

<h3>3.1 第一步：如果允许 \(M = N^2\) 的平方级空间</h3>
<ul>
<li>从通用哈希族（Universal Hash Family，满足 \(\forall x \ne y,\ \Pr_h[h(x)=h(y)] \le 1/M\)）中随机抽取一个 \(h\)。</li>
<li>定义碰撞指示器 \(C_{xy} = \mathbf{1}\{h(x) = h(y)\}\)。当 \(M = N^2\) 时，存在碰撞的概率由 Union Bound 约束：
\[\Pr_h[\text{存在碰撞}] = \Pr_h\!\left[\bigcup_{x &lt; y} (C_{xy}=1)\right] \le \binom{N}{2}\frac{1}{N^2} = \frac{N(N-1)}{2N^2} &lt; \frac{1}{2}\]
</li>
<li><b>结论</b>：随机挑一个 \(h\)，有<b>超过 \(1/2\) 的概率完全零碰撞</b>！这不仅用 Erdős 概率法证明了零碰撞哈希函数必然存在，还说明平均只需尝试 \(\le 2\) 次就能找到一个零碰撞的 \(h\)。</li>
</ul>

<h3>3.2 第二步：如何将总空间压缩到线性 \(O(N)\)？（双层哈希表）</h3>
<ul>
<li><b>FKS 双层架构</b>：
  <ol>
  <li><b>第一层</b>：使用大小为 \(M = N\) 的哈希表。设落入第 \(i\) 个桶的键个数为 \(n_i\)（\(\sum_{i=1}^N n_i = N\)）。</li>
  <li><b>第二层</b>：对每个桶 \(i\)，为其单独分配一个大小为 \(s_i = n_i^2\) 的二级哈希表，并为该桶独立抽取二级通用哈希函数 \(h_i\) 直到桶内零碰撞（由 3.1 节知平均试 2 次即可成功）。</li>
  </ol>
</li>
<li><b>核心问题：二级表的总空间 \(A = \sum_{i=1}^N n_i^2\) 是 \(O(N)\) 吗？</b>
  <ul>
  <li><b>关键平方和恒等式（Lemma）</b>：桶 \(i\) 中有 \(n_i\) 个元素，桶内有序对 \((x,y)\)（含 \(x=y\) 的对角线项）共有 \(n_i^2\) 个；不同桶之间的元素 \(C_{xy}=0\)。因此：
  \[\sum_{i=1}^N n_i^2 = \sum_{x \in S}\sum_{y \in S} C_{xy} = N + \sum_{x \in S}\sum_{y \ne x} C_{xy}\]
  </li>
  <li><b>求期望</b>：因为一级表大小 \(M = N\) 且 \(h\) 来自通用哈希族，对 \(x \ne y\) 有 \(E_h[C_{xy}] \le 1/N\)：
  \[E_h\!\left[\sum_{i=1}^N n_i^2\right] = N + \sum_{x}\sum_{y\ne x} E_h[C_{xy}] \le N + N(N-1)\frac{1}{N} = 2N - 1 &lt; 2N\]
  </li>
  <li><b>用 Markov 不等式转成概率保证</b>：
  \[\Pr_h\!\left[\sum_{i=1}^N n_i^2 \ge 4N\right] \le \frac{E_h[\sum n_i^2]}{4N} &lt; \frac{2N}{4N} = \frac{1}{2}\]
  因此 \(\Pr_h[\sum n_i^2 \le 4N] &gt; 1/2\)！只需不断重抽一级哈希函数 \(h\) 直到 \(\sum n_i^2 \le 4N\)（平均试 2 次），总空间（一级 \(N\) + 二级 \(\le 4N\)）就严格不超过 \(5N = O(N)\)，且最坏查找只需 2 次哈希查表 \(O(1)\)！</li>
  </ul>
</li>
</ul>

<h2>4. 布隆过滤器（Bloom Filters）</h2>
<p>当集合元素极多（如 \(10^9\) 个 20 字节邮箱需 20GB 内存）而我们只关心成员查询 \(y \in S\) 时，布隆过滤器不存储元素本身，只用一个 \(m\) 位的比特数组 \(T[1..m]\)（初始全 0）和 \(k\) 个独立的哈希函数 \(h_1, \dots, h_k\)。</p>

<h3>4.1 标准布隆过滤器原理与假阳性率推导</h3>
<ul>
<li><b>插入 <code>insert(x)</code></b>：将 \(T[h_1(x)], T[h_2(x)], \dots, T[h_k(x)]\) 全部置为 \(1\)（已被置 1 的位保持为 1）。</li>
<li><b>查询 <code>member(y)</code></b>：检查是否对所有 \(1 \le i \le k\) 都有 \(T[h_i(y)] = 1\)。
  <ul>
  <li>只要有一位为 \(0\)，则 \(y\) <b>绝对不在 \(S\) 中（无假阴性，No False Negatives）</b>。</li>
  <li>若全部 \(k\) 位都为 \(1\)，则判定 \(y \in S\)，但可能发生<b>假阳性（False Positive）</b>——这 \(k\) 个位置恰好被其他元素置成了 1。</li>
  <li><b>禁止删除</b>：标准布隆过滤器不能把位置 0 来删除元素，因为该位可能被其他仍在集合中的元素共享，置 0 会引入假阴性！</li>
  </ul>
</li>
<li><b>假阳性概率公式（必背推导）</b>：
  <ol>
  <li>插入 \(n\) 个元素共进行了 \(kn\) 次独立随机置位。某一个特定比特在全部 \(kn\) 次操作后<b>仍然为 0</b> 的概率为：
  \[p = \left(1 - \frac{1}{m}\right)^{kn} \approx e^{-kn/m}\]</li>
  <li>因此该比特为 1 的概率为 \(1 - p \approx 1 - e^{-kn/m}\)。</li>
  <li>对于一个不在集合中的新元素 \(y\)，它的 \(k\) 个哈希位置全部为 1（即产生假阳性）的概率为：
  \[f = (1 - p)^k \approx \left(1 - e^{-kn/m}\right)^k\]</li>
  </ol>
</li>
<li><b>最优哈希函数个数 \(k_{\text{opt}}\)</b>：
  <ul>
  <li>\(k\) 存在两种相反的力量：\(k\) 越大，非成员要连撞 \(k\) 个 1 越难；但 \(k\) 越大，数组里的 1 也越多（\(p\) 越小）。</li>
  <li>对 \(f(k) = (1 - e^{-kn/m})^k\) 关于 \(k\) 求最小值，可得当 \(p = e^{-kn/m} = \frac{1}{2}\)（即比特数组恰好<b>一半为 0、一半为 1</b>）时假阳性率最低：
  \[k_{\text{opt}} = \frac{m}{n} \ln 2 \approx 0.693 \frac{m}{n}\]
  代入得最小假阳性率：
  \[f_{\text{opt}} = \left(\frac{1}{2}\right)^{k_{\text{opt}}} = (0.5)^{\frac{m}{n}\ln 2} \approx (0.6185)^{m/n}\]
  （例如每元素分配 \(m/n = 8\) bits 时，选 \(k \approx 5\text{ 或 }6\)，假阳性率仅约 \(2\%\)！）</li>
  </ul>
</li>
</ul>

<h3>4.2 计数布隆过滤器（Counting Bloom Filter）与四大系统应用</h3>
<ul>
<li><b>Counting Bloom Filter</b>：将每个比特升级为一个小计数器（实践中 <b>4 bits/counter</b> 即足够）。插入时将 \(k\) 个计数器 \(+1\)，<b>删除时将 \(k\) 个计数器 \(-1\)</b>，查询时检查是否全部 \(&gt;0\)。若计数器发生溢出（overflow）并停留在最大值，后续删除递减可能提前将其减为 0，从而导致假阴性。</li>
<li><b>课件四大应用</b>：
  <ol>
  <li><b>分布式 Web 缓存（Squid / Cloud Proxy）</b>：各代理服务器本地维护 Counting BF（跟进缓存替换），定期向邻居广播压缩后的单比特 BF 代替庞大的 URL 列表。为什么此时会有假阳性和假阴性？因为广播有周期延迟（新缓存未广播致假阴性，已驱逐缓存未广播致假阳性）。</li>
  <li><b>P2P 文件分片定位与集合差（Set Reconciliation）</b>：节点 \(b\) 把自己的分片 BF 发给 \(a\)，\(a\) 发送 \(S_a - S_b\)；BF 的假阳性会导致 \(a\) 误以为 \(b\) 已有某分片而不发送（表现为集合差的假阴性）。</li>
  <li><b>网络源路由与环路检测（Packet Routing）</b>：在数据包头嵌入路径节点集合的 BF，沿途路由器检查哪个邻居在 BF 中并转发（假阳性只会造成极少量的额外分叉探测）。</li>
  <li><b>路由器重流检测（Heavy Flows）与公平队列管理</b>：用 Counting BF 记录流量字节数，流 \(f\) 的估计量为 \(\min_{i\in h(f)} y_i\)；采用<b>保守更新（Conservative Update）</b>——仅对未超过新最小值的计数器做增加，极大抑制碰撞高估。在拥塞丢包控制中，按 \(k\) 个桶拥塞概率给大流打标优先丢弃，无需维护百万级每流状态（per-flow state）。</li>
  </ol>
</li>
</ul>

<h2>考前清单</h2>
<ul>
<li>熟练默写 Markov、Chebyshev、Hoeffding 三个不等式及其条件。</li>
<li>熟记 Balls &amp; Bins 四大期望公式（\(n/m\)、\(m(1-1/m)^n\)、\(\binom{n}{2}/m\)、\(m\ln m\)）及最大负载 \(\Theta(\frac{\ln n}{\ln\ln n})\) vs Power of Two Choices \(\Theta(\frac{\ln\ln n}{\ln\ln\ln n})\)。</li>
<li>完整默写双层完美哈希的证明链条：\(\sum n_i^2 = \sum_{x,y} C_{xy} \implies E[\sum n_i^2] &lt; 2N \implies \Pr[\sum n_i^2 \ge 4N] &lt; 1/2\)。</li>
<li>默写布隆过滤器的 \(p = (1-1/m)^{kn} \approx e^{-kn/m}\)、\(f = (1-e^{-kn/m})^k\)、\(k_{\text{opt}} = \frac{m}{n}\ln 2\)、\(f_{\text{opt}} = 0.5^{\frac{m}{n}\ln 2}\)。</li>
</ul>
`,
  questions: [
    { id: "q1", tag: "slide", kind: "single", q: String.raw`将 \(n\) 个球独立均匀地投入 \(m\) 个桶中，期望产生的碰撞对数 \(E[\sum_{i&lt;j} X_{ij}]\) 以及使所有 \(m\) 个桶都至少有一个球所需的期望投球数分别为`, choices: [
      ["a", String.raw`\(\frac{n(n-1)}{2m}\) 与 \(m H_m \approx m\ln m\)`],
      ["b", String.raw`\(\frac{n^2}{m}\) 与 \(m^2\)`],
      ["c", String.raw`\(\frac{n}{m}\) 与 \(m\log_2 n\)`],
      ["d", String.raw`\(m(1-1/m)^n\) 与 \(\frac{\ln m}{\ln\ln m}\)`]
    ], answer: ["a"], why: String.raw`共有 \(\binom{n}{2} = \frac{n(n-1)}{2}\) 对球，每对落入同一桶概率为 \(1/m\)；集卡问题（Coupon Collector）期望投球数为 \(\sum_{i=1}^m \frac{m}{m-i+1} = m H_m \approx m\ln m\)。` },
    { id: "q2", tag: "slide", kind: "single", q: String.raw`当 \(n\) 个球随机投入 \(n\) 个桶时，若每次随机选 1 个桶，最满桶负载以高概率为 \(\Theta(\frac{\ln n}{\ln\ln n})\)；若每次随机看 2 个桶并放入较空的一个（Power of Two Choices），最满桶负载以高概率降为`, choices: [
      ["a", String.raw`\(\Theta(1)\)`],
      ["b", String.raw`\(\Theta\!\left(\frac{\ln n}{2\ln\ln n}\right)\)`],
      ["c", String.raw`\(\Theta\!\left(\frac{\ln\ln n}{\ln\ln\ln n}\right)\)`],
      ["d", String.raw`\(\Theta(\sqrt{\ln n})\)`]
    ], answer: ["c"], why: String.raw`Power of Two Choices 将最大桶负载从 \(\Theta(\frac{\ln n}{\ln\ln n})\) 指数级降低至 \(\Theta(\frac{\ln\ln n}{\ln\ln\ln n})\) w.h.p.。` },
    { id: "q3", tag: "slide", kind: "single", q: String.raw`在静态完美哈希（Perfect Hashing）的双层结构中，第一层表长为 \(M=N\)，第 \(i\) 个桶落入 \(n_i\) 个键并为之分配 \(n_i^2\) 大小的二级表。若第一层哈希函数 \(h\) 从通用哈希族中随机选取，则 \(E_h[\sum_{i=1}^N n_i^2]\) 的严格上界及由 Markov 不等式得到的 \(\Pr_h[\sum_{i=1}^N n_i^2 \le 4N]\) 分别为`, choices: [
      ["a", String.raw`\(E_h[\sum n_i^2] &lt; 2N\)，且 \(\Pr_h[\sum n_i^2 \le 4N] &gt; 1/2\)`],
      ["b", String.raw`\(E_h[\sum n_i^2] = N\)，且 \(\Pr_h[\sum n_i^2 \le 2N] = 1\)`],
      ["c", String.raw`\(E_h[\sum n_i^2] &lt; N^2\)，且 \(\Pr_h[\sum n_i^2 \le 4N] &gt; 1 - 1/N\)`],
      ["d", String.raw`\(E_h[\sum n_i^2] &lt; 4N\)，且 \(\Pr_h[\sum n_i^2 \le 4N] &gt; 1/4\)`]
    ], answer: ["a"], why: String.raw`\(E[\sum n_i^2] = N + \sum_{x\ne y} E[C_{xy}] \le N + N(N-1)\frac{1}{N} = 2N - 1 &lt; 2N\)。由 Markov 不等式，\(\Pr[\sum n_i^2 \ge 4N] \le \frac{E[\sum n_i^2]}{4N} &lt; \frac{2N}{4N} = \frac{1}{2}\)，故 \(\le 4N\) 的概率 \(&gt; 1/2\)。` },
    { id: "q4", tag: "slide", kind: "multi", q: String.raw`关于标准布隆过滤器（Standard Bloom Filter，\(m\) 位数组、\(n\) 个已插入元素、\(k\) 个哈希函数），下列说法正确的有`, choices: [
      ["a", "可能出现假阳性（False Positive），但绝不会出现假阴性（False Negative）"],
      ["b", String.raw`插入 \(n\) 个元素后某一位仍为 0 的概率约为 \(p \approx e^{-kn/m}\)，假阳性率约为 \(f \approx (1 - e^{-kn/m})^k\)`],
      ["c", String.raw`使假阳性率最小的哈希函数个数为 \(k_{\text{opt}} = \frac{m}{n}\ln 2\)，此时数组中约有一半的比特为 0`],
      ["d", "哈希函数个数 \(k\) 越多，假阳性率总是单调递减"],
      ["e", "支持通过将对应 \(k\) 个比特置 0 来安全删除元素"]
    ], answer: ["a", "b", "c"], why: String.raw`(d) 错：\(k\) 过大时数组几乎全被置为 1，假阳性率反而趋近 1；(e) 错：直接置 0 会破坏其他共享该位的元素，造成假阴性（需用 Counting Bloom Filter 才能删除）。` },
    { id: "q5", tag: "hw", kind: "single", q: String.raw`（HW5 Q4）在简单一致哈希假设下将 \(n\) 个键插入大小为 \(m\) 的哈希表中，当 \(n\to\infty\) 时，若 (1) \(m = \sqrt{n}\)，(2) \(m = cn\ (c&gt;0)\) 分别成立，期望空槽位数 \(E[Z] = m(1-1/m)^n\) 的极限分别为`, choices: [
      ["a", "(1) 趋于 0；(2) 趋于无穷大"],
      ["b", "(1) 趋于常数；(2) 趋于常数"],
      ["c", "(1) 趋于 0；(2) 趋于常数 \(ce^{-1/c}\)"],
      ["d", "(1) 趋于无穷大；(2) 趋于无穷大"]
    ], answer: ["a"], why: String.raw`当 \(m=\sqrt{n}\) 时 \(E[Z] \approx \sqrt{n}e^{-\sqrt{n}} \to 0\)；当 \(m=cn\) 时 \(E[Z] \approx cne^{-1/c} = \Theta(n) \to \infty\)。` },
    { id: "q6", tag: "hw", kind: "single", q: String.raw`（HW5 Q6a/b）设哈希表有 \(m\) 个槽位且初始为空，满足简单一致哈希假设。(1) 用链地址法插入 4 个键后，恰好存在一条长度为 3 的链的概率；(2) 用线性探测法依次插入 3 个键 \(k_1, k_2, k_3\)，总探测次数至少为 4 次的概率，分别为`, choices: [
      ["a", String.raw`\(\frac{4(m-1)}{m^3}\) 与 \(\frac{3m-2}{m^2}\)`],
      ["b", String.raw`\(\frac{1}{m^3}\) 与 \(\frac{3}{m}\)`],
      ["c", String.raw`\(\frac{4(m-1)}{m^4}\) 与 \(\frac{2m-1}{m^2}\)`],
      ["d", String.raw`\(\frac{6(m-1)}{m^3}\) 与 \(\frac{3m-1}{m^2}\)`]
    ], answer: ["a"], why: String.raw`(1) 4 个键选 3 个同槽（\(\binom{4}{3}\cdot m \cdot \frac{1}{m^3}\)）且第 4 个在其余 \(m-1\) 槽（\(\frac{m-1}{m}\)），得 \(\frac{4(m-1)}{m^3}\)；(2) 总探测 \(\ge 4\) 等价于至少发生 1 次碰撞，即 \(1 - \Pr[\text{三键互不碰撞}] = 1 - \frac{m-1}{m}\frac{m-2}{m} = \frac{3m-2}{m^2}\)。` }
  ],
  cards: [
    [String.raw`Markov、Chebyshev 与 Hoeffding 不等式公式`, String.raw`Markov：\(\Pr[X\ge t]\le E[X]/t\)；Chebyshev：\(\Pr[|X-\mu|\ge t]\le \operatorname{Var}(X)/t^2\)；Hoeffding：\(\Pr[|S_n - E[S_n]|&gt;t] &lt; 2e^{-t^2/n}\)。`],
    [String.raw`\(n\) 球投 \(m\) 桶的四大期望值（单桶、空桶、碰撞对、全满投球数）`, String.raw`单桶 \(n/m\)；空桶 \(m(1-1/m)^n \approx me^{-n/m}\)；碰撞对 \(\binom{n}{2}/m\)；全满投球数 \(mH_m \approx m\ln m\)。`],
    [String.raw`\(n\) 球投 \(n\) 桶的最大负载（1 次随机 vs Power of Two Choices）`, String.raw`1 次随机：\(L = \Theta(\frac{\ln n}{\ln\ln n})\) w.h.p.；随机看 2 桶选较空者：\(L = \Theta(\frac{\ln\ln n}{\ln\ln\ln n})\) w.h.p.。`],
    [String.raw`双层完美哈希（FKS）如何保证 \(O(N)\) 空间与最坏 \(O(1)\) 查找？`, String.raw`一级表长 \(N\)，二级表长 \(n_i^2\)（内部零碰撞）；由 \(\sum n_i^2 = \sum_{x,y} C_{xy}\) 得 \(E[\sum n_i^2] &lt; 2N\)，由 Markov 知 \(\Pr[\sum n_i^2 \le 4N] &gt; 1/2\)。`],
    [String.raw`标准布隆过滤器的假阳性率 \(f\) 与最优哈希个数 \(k_{\text{opt}}\)`, String.raw`某位仍为 0 的概率 \(p \approx e^{-kn/m}\)，\(f \approx (1 - e^{-kn/m})^k\)；最优 \(k_{\text{opt}} = \frac{m}{n}\ln 2\)（此时 \(p=1/2\)），\(f_{\text{opt}} = 0.5^{\frac{m}{n}\ln 2} \approx 0.6185^{m/n}\)。`],
    [String.raw`为什么标准布隆过滤器不支持删除？如何解决？`, String.raw`多个元素可能将同一位置 1，直接置 0 会导致其他元素出现假阴性；改用 Counting Bloom Filter（每位 4-bit 计数器，插入 +1、删除 −1）。`]
  ]
});
