Review.add({
  id: "sample2", group: "hw", n: 10,
  short: "2021 样卷与全真模拟",
  title: "2021 官方样卷（Midterm 2 范围）与 Midterm 2 全真模拟卷",
  meta: "Sample Paper + Full Mock Exam · 严格对标 2021 样卷四大题型",
  sources: [
    { label: "Midterm 2021 官方样卷含解答 PDF", href: "materials/midterm2/Midterm_2021_solution.pdf" },
    { label: "Midterm 2 座位表 XLSX", href: "materials/midterm2/seat_plan_midterm_2.xlsx" }
  ],
  html: String.raw`
<p class="lede">根据 11 月 9 日公告与 Blackboard <code>/Assessment/Midterm 2/</code> 文件夹说明，Midterm 2 的试卷结构与 Midterm 1 及 2021 样卷完全一致（<b>Same Format as Midterm 1</b>）。本章首先解析 2021 样卷中属于 Week 6–9 的全部真题，然后按完全相同的四大题型（推导证明题 + 多选题 + 两行理由判断题 + 算法设计与手工追踪大题）提供一套覆盖 Week 6–9 全部核心考点的全真模拟卷。</p>

<h2>一、考试计分规则与答题策略（必读）</h2>
<ul>
<li><b>时间与考场</b>：11 月 20 日（周五）18:00–20:00（120 分钟），<b>TC 407 座位 60</b>。闭卷，带学生证、2B 铅笔、非编程计算器。</li>
<li><b>试卷四大题型与给分规则</b>：
  <ol>
  <li><b>Problem 1（证明与推导题，约 30 分）</b>：在 Midterm 2 中对应<b>摊还分析证明（Potential / Charging）、Balls &amp; Bins / 完美哈希 / 布隆过滤器概率推导、或切割引理 / 地标一致性证明</b>。</li>
  <li><b>Problem 2（多选题 Multiple Choice，约 28 分）</b>：<b>每选对一项得 \(+4\) 分，每误选一项扣 \(-4\) 分（漏选得 0 分），单题总分最低为 0 分</b>！<b>核心策略</b>：因为选错倒扣 4 分，拿不准的选项绝对不要乱勾，只涂 100% 确定的选项！</li>
  <li><b>Problem 3（判断题 True / False，12 小题 × 3 分 = 36 分）</b>：<b>答错不倒扣分</b>，但每题必须写<b>约 2 行的简短理由（2-line explanation）</b>（定理引用、复杂度计算或 3–4 个节点的小反例）。</li>
  <li><b>Problem 4–7（手工追踪与算法设计大题，约 50–80 分）</b>：包括<b>手工逐步追踪算法表格</b>（Dijkstra / Bellman-Ford / A* / Kosaraju / Huffman / Kruskal / 并查集）以及<b>基于已知算法设计线性或高效算法</b>（如拆边 BFS、反转图、修改 Dijkstra、两遍 DFS 等）。</li>
  </ol>
</li>
</ul>

<h2>二、2021 样卷中属于 Midterm 2（Week 6–9）的真题全解</h2>

<h3>1. Problem 2C（图表示多选题）</h3>
<p>存储图 \(G=(V,E)\)，其中 \(|V|=n, |E|=m\)。选出所有正确项：</p>
<ul>
<li>(a) 邻接矩阵使用 \(O(n\log n)\) bits —— <b>错</b>（需 \(\Theta(n^2)\) bits）。</li>
<li>(b) <b>邻接表使用 \(O((n+m)\log n)\) bits —— 对</b>（每个顶点号占 \(\log n\) bits）。</li>
<li>(c) 当 \(m = 10n\) 时图是稠密的 —— <b>错</b>（\(m = O(n)\) 为稀疏图）。</li>
<li>(d) <b>当 \(m = 0.9n^2\) 时图是稠密的 —— 对</b>。</li>
<li>(e) 若 \(m = 0.8n^2\) 则更倾向于邻接表 —— <b>错</b>（稠密图用邻接矩阵仅 \(n^2\) bits 且查边 \(O(1)\)）。</li>
<li>(f) <b>若使用 DFS 则更倾向于用邻接表表示图 —— 对</b>（邻接表 DFS 为 \(O(n+m)\)，矩阵为 \(\Theta(n^2)\)）。</li>
<li><b>标准答案：b), d), f)</b>。</li>
</ul>

<h3>2. Problem 3(k) &amp; 3(l)（BFS 环检测判断题）</h3>
<ul>
<li><b>3(k)</b>：<i>BFS 能在 \(O(|V|+|E|)\) 时间内检测有向图中的环。</i><br>
<b>答案：FALSE</b>。<b>2 行理由</b>：在有向图中，BFS 遇到已访问节点可能只是两条有向路径汇合（即前向边或横叉边，如 \(s\to a\to c\) 与 \(s\to b\to c\)），并不构成有向环；有向图判环需使用 DFS 检测后向边（Back Edge）。</li>
<li><b>3(l)</b>：<i>BFS 能在 \(O(\max\{|V|,|E|\})\) 时间内检测无向图中的环。</i><br>
<b>答案：TRUE</b>。<b>2 行理由</b>：对无向图每个连通分量运行 BFS，若扫描 \(u\) 的邻居时遇到已访问且非 \(u\) 父节点的顶点 \(v\)，则树路径与边 \((u,v)\) 必形成环；每个点和边访问常数次，耗时 \(O(|V|+|E|) = O(\max\{|V|,|E|\})\)。</li>
</ul>

<h3>3. Problem 7（有界整数边权 \(\in \{1, 2\}\) 及 \(\{1, \dots, k\}\) 的线性时间最短路树，20 + 10 pts）</h3>
<ul>
<li><b>题目</b>：设图 \(G=(V,E)\) 的边长只取 \(\{1, 2\}\)，提出一个在 \(O(|V|+|E|)\) 时间内构造最短路径树（SPT）的算法。Bonus：若边长 \(\in \{1, 2, \dots, k\}\)，该算法的复杂度作为 \(n, m, k\) 的函数是多少？</li>
<li><b>标准解答</b>：
  <ol>
  <li><b>图变换（拆边法）</b>：对每条长度为 \(2\)（一般情况为长度 \(w \in \{2, \dots, k\}\)）的边 \((u, v)\)，将其拆分为 \(w\) 条长度为 \(1\) 的串联边，并在中间引入 \(w - 1\) 个新的虚拟状态节点（intermediate states）。</li>
  <li><b>运行 BFS</b>：在变换后的单位权新图 \(G' = (V', E')\) 上从源点 \(s\) 运行标准 BFS 构造最短路径树。</li>
  <li><b>复杂度分析</b>：当边权 \(\in \{1, 2\}\) 时，每条边最多增加 1 个顶点和 1 条边，\(|V'| \le n + m,\ |E'| \le 2m\)，故 BFS 耗时 \(O(n + m) = O(|V| + |E|)\)；当边权 \(\in \{1, \dots, k\}\) 时，每条边拆成至多 \(k\) 条边并增加 \(k-1\) 个顶点，\(|V'| \le n + (k-1)m,\ |E'| \le km\)，故总时间复杂度为 <b>\(O(n + km)\)</b>。</li>
  </ol>
</li>
</ul>

<h2>三、Midterm 2 全真模拟大题与标准答案模板</h2>

<h3>模拟大题 1（摊还分析 + 完美哈希证明，30 pts）</h3>
<ol>
<li><b>(15 pts)</b> 数据结构支持两种操作：<code>insert(x)</code> 向集合加入元素（实际代价 1），<code>compress()</code> 将当前集合中的 \(k\) 个元素两两合并为 \(\lceil k/2 \rceil\) 个元素（实际代价为 \(k\)，仅当 \(k \ge 2\) 时调用）。请使用<b>势函数法（Potential Method）</b>证明 <code>insert</code> 和 <code>compress</code> 的摊还代价均为 \(O(1)\)。
  <ul>
  <li><b>标准解答</b>：定义势函数 \(\Phi(\text{DS}) = 2 \cdot n\)，其中 \(n\) 为当前集合中的元素个数。初始空集 \(n=0 \implies \Phi(\text{DS}_0) = 0\)，且恒有 \(\Phi \ge 0\)。
    <ul>
    <li>对于 <code>insert(x)</code>：实际代价 \(c = 1\)，元素数从 \(n\) 变为 \(n+1\)，\(\Delta\Phi = 2(n+1) - 2n = 2\)，故摊还代价 \(a_{\text{insert}} = 1 + 2 = 3 = O(1)\)。</li>
    <li>对于 <code>compress()</code>（当前有 \(k \ge 2\) 个元素）：实际代价 \(c = k\)，合并后元素数变为 \(\lceil k/2 \rceil \le \frac{k+1}{2}\)，元素至少减少 \(\lfloor k/2 \rfloor\) 个，故 \(\Delta\Phi = 2\lceil k/2 \rceil - 2k \le (k + 1) - 2k = 1 - k\)。因此摊还代价 \(a_{\text{compress}} = k + \Delta\Phi \le k + (1 - k) = 1 = O(1)\)。\(\square\)</li>
    </ul>
  </li>
  </ul>
</li>
<li><b>(15 pts)</b> 在双层完美哈希中，设第一层哈希表大小改为 \(M = 2N\)（而非 \(N\)），每个桶 \(i\) 仍分配 \(n_i^2\) 大小的二级表。证明随机抽取通用哈希函数 \(h\) 时，二级表总空间 \(\sum_{i=1}^{2N} n_i^2\) 的期望值 \(&lt; \frac{3}{2}N\)，并给出 \(\Pr[\sum n_i^2 \le 3N]\) 的下界。
  <ul>
  <li><b>标准解答</b>：由恒等式 \(\sum_{i=1}^{2N} n_i^2 = \sum_{x,y} C_{xy} = N + \sum_{x \ne y} C_{xy}\)。因为 \(M = 2N\) 且 \(h\) 来自通用哈希族，对 \(x \ne y\) 有 \(E[C_{xy}] \le \frac{1}{2N}\)。故：
  \[E\!\left[\sum n_i^2\right] \le N + N(N-1)\frac{1}{2N} = N + \frac{N-1}{2} = \frac{3N - 1}{2} &lt; \frac{3}{2}N\]
  由 Markov 不等式，\(\Pr[\sum n_i^2 \ge 3N] \le \frac{E[\sum n_i^2]}{3N} &lt; \frac{1.5N}{3N} = \frac{1}{2}\)，故 \(\Pr[\sum n_i^2 \le 3N] &gt; \frac{1}{2}\)。\(\square\)</li>
  </ul>
</li>
</ol>

<h3>模拟大题 2（图算法设计：单边权修改 / 必经边最短路，20 pts）</h3>
<ul>
<li><b>题目</b>：给定带正权有向图 \(G=(V,E)\)、起点 \(s\)、终点 \(t\)，以及一个候选脱敏边集合 \(E_{\text{new}}\)（每条候选边 \(e=(u,v) \in E_{\text{new}}\) 有正权 \(w(e)\)）。你最多只能从 \(E_{\text{new}}\) 中挑选<b>一条</b>候选边加入原图。请设计一个运行时间为 \(O((|V|+|E|)\log |V| + |E_{\text{new}}|)\) 的算法，求出加入至多一条候选边后从 \(s\) 到 \(t\) 的最短路径长度。</li>
<li><b>标准解答</b>：
  <ol>
  <li>在原图 \(G\) 上从起点 \(s\) 运行一次 Dijkstra 算法，算出 \(s\) 到所有顶点 \(u\) 的最短距离 \(\delta_G(s, u)\)；</li>
  <li>在反向图 \(G^T\) 上从终点 \(t\) 运行一次 Dijkstra 算法，算出所有顶点 \(v\) 到 \(t\) 的最短距离 \(\delta_G(v, t)\)；</li>
  <li>遍历每条候选边 \(e = (u, v) \in E_{\text{new}}\)，计算经过该边的最短路径长度 \(\delta_G(s, u) + w(u, v) + \delta_G(v, t)\)，并与不加边的 \(\delta_G(s, t)\) 取最小值：
  \[\text{Ans} = \min\Bigl\{\delta_G(s, t),\ \min_{(u,v) \in E_{\text{new}}} \bigl(\delta_G(s, u) + w(u, v) + \delta_G(v, t)\bigr)\Bigr\}\]</li>
  <li>复杂度：两次 Dijkstra 耗时 \(O((|V|+|E|)\log |V|)\)，扫描 \(E_{\text{new}}\) 耗时 \(O(|E_{\text{new}}|)\)。\(\square\)</li>
  </ol>
</li>
</ul>

<h2>考前清单</h2>
<ul>
<li>在下方交互题库中把所有模拟判断、单选、多选题全部刷完，错题会自动进入“错题本”。</li>
<li>记住多选题“宁缺毋滥”原则（选错一项倒扣 4 分）和判断题“必写两行理由”原则。</li>
</ul>
`,
  questions: [
    { id: "q1", tag: "practice", kind: "tf", q: String.raw`【模拟判断 1】在无向连通带权图中，如果所有边的权重互不相同（distinct edge weights），那么该图的最小生成树（MST）一定是唯一的。`, answer: ["t"], why: String.raw`True！当所有边权互异时，任何切割上的最轻边都是唯一的；若存在两棵不同的 MST \(T_1 \ne T_2\)，取 \(T_1 \triangle T_2\) 中最轻的边 \(e\)（不妨设 \(e\in T_1\setminus T_2\)），将 \(e\) 加入 \(T_2\) 形成的环上必有另一条边 \(e'\notin T_1\) 权重严格大于 \(e\)，替换后得到比 \(T_2\) 更轻的生成树，矛盾。` },
    { id: "q2", tag: "practice", kind: "tf", q: String.raw`【模拟判断 2】把带正权无向连通图 \(G\) 中每条边的权重都加上同一个正整数 \(c &gt; 0\)（即 \(w'(e) = w(e) + c\)），图的最小生成树（MST）不变，且任意两点间的最短路径（Shortest Path）也不变。`, answer: ["f"], why: String.raw`False！每棵生成树固定包含 \(|V|-1\) 条边，总权重统一加上常数 \((|V|-1)c\)，故 **MST 确实不变**；但不同路径包含的**边数不同**（含 \(k\) 条边的路径增加了 \(kc\)），原本由多条小边组成的短路径加上 \(kc\) 后可能比少边的路径更重，故**最短路径会改变**！` },
    { id: "q3", tag: "practice", kind: "tf", q: String.raw`【模拟判断 3】把带正权有向图 \(G\) 中每条边的权重都乘以同一个正常数 \(c &gt; 0\)（即 \(w'(e) = c \cdot w(e)\)），则最小生成树和最短路径都保持不变。`, answer: ["t"], why: String.raw`True！正数缩放 \(w'(p) = c \cdot w(p)\) 保持所有路径总重和所有生成树总重的相对大小顺序严格不变。` },
    { id: "q4", tag: "practice", kind: "tf", q: String.raw`【模拟判断 4】在有向图 \(G\) 上从源点 \(s\) 运行 Dijkstra 算法得到的最短路径树（SPT），一定也是将 \(G\) 视为无向图时的最小生成树（MST）。`, answer: ["f"], why: String.raw`False！反例：三角形 \(s-a(2), s-b(2), a-b(1)\)。从 \(s\) 出发的 SPT 选择边 \((s,a)\) 和 \((s,b)\)（总重 \(2+2=4\)），而 MST 选择 \((s,a)\) 和 \((a,b)\)（总重 \(2+1=3\)）。` },
    { id: "q5", tag: "practice", kind: "tf", q: String.raw`【模拟判断 5】在含负权边但无负权环的有向图上，Bellman-Ford 算法在完成第 \(k\) 轮（\(1 \le k \le |V|-1\)）对所有边的松弛后，从源点 \(s\) 出发经过至多 \(k\) 条边的最短路径长度都已被正确求出。`, answer: ["t"], why: String.raw`True！这是 Bellman-Ford 正确性归纳证明的核心引理：第 \(i\) 轮松弛将最短路径树第 \(i-1\) 层的精确距离至少向下推进一层到第 \(i\) 层。` },
    { id: "q6", tag: "practice", kind: "tf", q: String.raw`【模拟判断 6】在 Huffman 编码中，如果某个字符 \(A\) 的出现频率严格大于全部字符总频率的 \(1/2\)（即 \(p_A &gt; 0.5\)），那么在最优 Huffman 编码树中字符 \(A\) 的码字长度一定为 \(1\)。`, answer: ["t"], why: String.raw`True！因为其余所有字符的频率总和 \(&lt; 0.5 &lt; p_A\)，所以在最后一步合并之前，其余所有字符必然已经先合并成了一棵总频率 \(&lt; 0.5\) 的子树，最后一次合并才将 \(A\) 与该子树合并在根节点下，故 \(A\) 的深度必为 1。` },
    { id: "q7", tag: "practice", kind: "multi", q: String.raw`【模拟多选 1】关于强连通分量（SCC）与 Kosaraju 算法，下列哪些说法是正确的？（多选：对一个 +4，错一个 −4）`, choices: [
      ["a", String.raw`原图 \(G\) 与反向图 \(G^T\) 具有完全相同的强连通分量划分`],
      ["b", String.raw`若在缩点图 \(G^{\text{SCC}}\) 中有边 \(C \to C'\)，则在任意 DFS 中，\(C\) 中所有顶点的完成时间都大于 \(C'\) 中所有顶点的完成时间`],
      ["c", String.raw`若在缩点图 \(G^{\text{SCC}}\) 中有边 \(C \to C'\)，则在任意 DFS 中，\(\max_{u\in C} u.f &gt; \max_{v\in C'} v.f\)`],
      ["d", String.raw`Kosaraju 算法的时间复杂度在邻接表表示为 \(\Theta(|V|+|E|)\)`],
      ["e", String.raw`只需运行 1 次 DFS 并按完成时间从大到小排序就能直接切分出所有 SCC`]
    ], answer: ["a", "c", "d"], why: String.raw`(b) 错：只有每个分量的<b>最大</b>完成时间满足 \(\text{post}(C) &gt; \text{post}(C')\)，\(C\) 中某个先退栈的分支节点的完成时间完全可能小于 \(C'\) 中节点的完成时间；(e) 错：1 次 DFS 的完成时间顺序只能给出拓扑偏序，无法区分同一棵 DFS 树中包含的多个 SCC，必须配合反向图做第 2 次 DFS。` },
    { id: "q8", tag: "practice", kind: "multi", q: String.raw`【模拟多选 2】关于摊还分析（Amortized Analysis）与概率分析（Probabilistic / Average-case Analysis），下列哪些说法是正确的？（多选：对一个 +4，错一个 −4）`, choices: [
      ["a", "摊还分析不依赖任何输入分布的概率假设，它保证在最坏情况操作序列下平均每步代价不超过摊还界"],
      ["b", "静态完美哈希（Perfect Hashing）在建表阶段使用随机化，但建表完成后任何一次查找在最坏情况下都是确定性的 \(O(1)\) 时间"],
      ["c", "在势函数法中，若某次操作的 \(\Delta\Phi &lt; 0\)，说明该操作把钱存入了银行账户"],
      ["d", "当 \(n\) 个球随机投入 \(n\) 个桶时，空桶个数的期望值渐近趋于 \(n/e\)"]
    ], answer: ["a", "b", "d"], why: String.raw`(c) 错：由 \(a(t) = c(t) + \Delta\Phi\)，当 \(\Delta\Phi &lt; 0\) 时 \(a(t) &lt; c(t)\)，说明本次操作是昂贵操作，正在从银行账户<b>取出</b>存款来补贴实际开销（\(\Delta\Phi &gt; 0\) 才是向银行存钱）。` }
  ],
  cards: [
    [String.raw`Midterm 2 多选题与判断题的计分规则分别是什么？`, String.raw`多选题：选对一项 +4 分，选错一项 −4 分，单题最低 0 分（拿不准绝不多选）；判断题：答错不扣分，但必须写约 2 行理由（2-line explanation）。`],
    [String.raw`把图中所有边权加上正数 \(c\) vs 乘以正数 \(c\)，MST 和最短路变不变？`, String.raw`加正数 \(c\)：MST 不变（所有生成树都固定加 \((|V|-1)c\)），但最短路会变（边数多的路径加得更多）！乘正数 \(c\)：MST 和最短路都不变。`],
    [String.raw`当无向连通图所有边权互不相同时，最小生成树（MST）是否唯一？`, String.raw`一定唯一！（用切割引理/回路换边反证法可证。）`],
    [String.raw`如果字符 \(A\) 的频率超过总频率的 \(1/2\)，它在 Huffman 树中的深度是多少？`, String.raw`深度一定为 1（码字长度为 1 bit），因为其余所有字符合并后的总频率仍小于 \(f_A\)，只能在最后一步与 \(A\) 合并。`]
  ]
});
