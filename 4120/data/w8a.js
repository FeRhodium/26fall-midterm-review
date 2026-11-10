Review.add({
  id: "w8a", group: "lecture", n: 5,
  short: "W8A Bellman-Ford 与 Dijkstra",
  title: "Week 8A · 最短路基础、DAG 最短路、Bellman-Ford 与 Dijkstra 算法",
  meta: "Week 8 Lectures 1–2 · Bellman Equations / Bellman-Ford / DAG SP / Dijkstra",
  sources: [
    { label: "Bellman-Ford 2026 课件 PDF", href: "materials/w8/Bellman_Ford_2026.pdf" },
    { label: "Dijkstra & DAGs 2026 课件 PDF", href: "materials/w8/Dijkstra_DAGs_2026.pdf" },
    { label: "MIT 6.006 Shortest Paths Notes PDF", href: "materials/w8/notes_on_shortest_paths.pdf" },
    { label: "交互单步器：Bellman-Ford & Dijkstra", href: "materials/w8/shortest-paths-stepper.html" }
  ],
  html: String.raw`
<p class="lede">本讲建立单源最短路径（SSSP）的理论基础：从最优子结构、三角不等式与 Bellman 方程唯一解出发，推导松弛（Relaxation）机制；然后按图的结构由一般到特殊依次给出三大算法——允许负权边并能检测负环的 <b>Bellman-Ford 算法 \(\Theta(VE)\)</b>、利用拓扑序单遍松弛的 <b>DAG 最短路算法 \(\Theta(V+E)\)</b>，以及针对非负权图的贪心 <b>Dijkstra 算法</b>（含数组、二叉堆、Fibonacci 堆与有界整数权桶队列四种实现）。</p>

<h2>1. 最短路基础、负权环与 Bellman 方程</h2>
<ul>
<li><b>路径权重与最短距离 \(\delta(u, v)\)</b>：路径 \(p = \langle v_0, v_1, \dots, v_k \rangle\) 的权重为 \(w(p) = \sum_{i=1}^k w(v_{i-1}, v_i)\)。最短距离 \(\delta(u, v) = \min\{w(p) : u \stackrel{p}{\leadsto} v\}\)（若不可达则为 \(\infty\)）。</li>
<li><b>最优子结构与三角不等式</b>：
  <ul>
  <li>最短路径的任意子路径也是最短路径：若 \(v_j\) 在 \(v_0 \to v_n\) 的最短路上，则 \(\delta(v_0, v_n) = \delta(v_0, v_j) + \delta(v_j, v_n)\)。</li>
  <li><b>三角不等式</b>：对任意 \(s, u, t\)，\(\delta(s, t) \le \delta(s, u) + \delta(u, t)\)；特别地，对任意边 \((u, t) \in E\)，有 \(\delta(s, t) \le \delta(s, u) + w(u, t)\)，且 \(u\) 在 \(s \to t\) 的某条最短路上 \(\iff \delta(s, t) = \delta(s, u) + w(u, t)\)。</li>
  </ul>
</li>
<li><b>负权边 vs 负权环（Negative Cycles）</b>：
  <ul>
  <li>单有负权边并不会破坏最短路的定义；只有当存在从源点 \(s\) 可达的<b>负权环（总权重 \(&lt;0\) 的环）</b>时，绕环无限转圈会使路径权重趋于 \(-\infty\)，最短路才无定义。</li>
  <li><b>关键结论</b>：只要图中<b>没有负权环</b>，最短距离就一定可以在<b>简单路径（Simple Path，不重复经过任何顶点，至多包含 \(|V|-1\) 条边）</b>上取到！</li>
  </ul>
</li>
<li><b>Bellman 方程及其唯一解证明（课件 Slide 11）</b>：当无负权环时，最短距离 \(\delta(s, \cdot)\) 满足：
\[\delta(s, s) = 0, \qquad \delta(s, t) = \min_{u \in \text{pre}(t)} \bigl\{\delta(s, u) + w(u, t)\bigr\}\]
<b>为什么解是唯一的？</b>设存在另一个解 \(\delta'\) 满足 \(\delta'(t) &gt; \delta(t)\)。沿着 \(\delta\) 的一条最短路径上的前驱 \(u \to t\)（满足 \(\delta(t) = \delta(u) + w(u,t)\)），由 \(\delta'(t) \le \delta'(u) + w(u,t)\) 相减得 \(0 &lt; \delta'(t) - \delta(t) \le \delta'(u) - \delta(u)\)，故 \(\delta'(u) &gt; \delta(u)\)。沿简单最短路径一路回溯到源点 \(s\)，将得出 \(\delta'(s) &gt; \delta(s) = 0\)，与 \(\delta'(s) = 0\) 矛盾！\(\square\)</li>
</ul>

<h2>2. 松弛操作（Relaxation）与最短路径树（SPT）</h2>
<ul>
<li><b>距离估计量 \(v.d\)（或 \(\hat{\delta}(v)\)）的含义——“安全承诺”</b>：算法初始化 \(s.d = 0\)，其余 \(v.d = \infty, v.\pi = \text{nil}\)。对边 \((u, v)\) 的松弛操作定义为：
\[\text{relax}(u, v): \quad \text{if } v.d &gt; u.d + w(u, v) \text{ then } v.d \leftarrow u.d + w(u, v),\ v.\pi \leftarrow u\]
</li>
<li><b>松弛的两条基本性质</b>：
  <ol>
  <li><b>安全性（Upper-bound property）</b>：若初始时对所有 \(v\) 有 \(v.d \ge \delta(s, v)\)，则经过任意次松弛后，始终保持 \(v.d \ge \delta(s, v)\)（绝不会低估真实最短距离，且任何有限的 \(v.d\) 都对应一条沿 \(\pi\) 回溯到 \(s\) 的真实路径上界）。</li>
  <li><b>收敛判定（与 HW7 Q8 / DPV 4.7 等价）</b>：当且仅当图中<b>不再有任何一条边可以成功松弛</b>（即对所有 \((u,v)\in E\) 都有 \(v.d \le u.d + w(u,v)\)）时，Bellman 方程全部满足，此时必有 \(v.d = \delta(s, v)\) 且前驱指针 \(\pi\) 构成一棵最短路径树（SPT）！</li>
  </ol>
</li>
</ul>

<h2>3. Bellman-Ford 算法：\(\Theta(|V||E|)\)</h2>
<ul>
<li><b>核心思想</b>：如果我们事先知道最短路径树（SPT），只需按树上深度从第 1 层到第 \(k\) 层依次松弛树边，\(|V|-1\) 次松弛就够了。但我们不知道哪条边是树边，所以 Bellman-Ford 采取最稳妥的办法——<b>每一轮把图中的全部 \(|E|\) 条边都松弛一遍，共重复 \(|V|-1\) 轮</b>！</li>
<li><b>收敛性归纳证明（课件 Slide 19–22）</b>：设从 \(s\) 到 \(v\) 的某条简单最短路径为 \(s = v_0 \to v_1 \to \dots \to v_k = v\)（由于无负环，\(k \le |V|-1\)）：
  <ul>
  <li>第 0 轮后，第 0 层节点 \(s\) 满足 \(s.d = \delta(s, s) = 0\)；</li>
  <li>第 1 轮对所有边松弛时，必定包含了对边 \((s, v_1)\) 的松弛，故第 1 轮结束后 \(v_1.d = \delta(s, v_1)\)（SPT 第 1 层节点全部收敛）；</li>
  <li>归纳可知，<b>第 \(i\) 轮松弛结束后，所有在 SPT 上深度 \(\le i\)（即存在至多 \(i\) 条边的最短路）的节点都已达到真实最短距离 \(\delta(s, v)\)</b>！（这也是 HW7 Q6“若所有最短路至多含 \(k\) 条边，只需跑 \(k\) 轮 Bellman-Ford，耗时 \(O(k|E|)\)”的直接依据。）</li>
  <li>因为简单路径最多含 \(|V|-1\) 条边，所以至多 \(|V|-1\) 轮后所有节点全部收敛（若某一轮没有任何 \(v.d\) 发生变化，可提前终止）。</li>
  </ul>
</li>
<li><b>第 \(|V|\) 轮：负权环检测</b>：跑完 \(|V|-1\) 轮后，再遍历所有边 \((u, v) \in E\) 检查一次：若仍存在某条边满足 \(v.d &gt; u.d + w(u, v)\)，则说明图中<b>存在从 \(s\) 可达的负权环</b>；否则报告无负权环。</li>
<li><b>时间复杂度</b>：初始化 \(\Theta(|V|)\) + 主循环 \((|V|-1)\) 轮 \(\times |E|\) 条边 + 负环检查 \(\Theta(|E|)\) = <b>\(\Theta(|V||E|)\)</b>（稀疏图 \(\Theta(V^2)\)，稠密图 \(\Theta(V^3)\)）。</li>
</ul>

<h2>4. DAG 上的单源最短路：\(\Theta(|V|+|E|)\)</h2>
<ul>
<li><b>为什么 DAG 不需要 \(|V|-1\) 轮？</b>因为有向无环图（DAG）中不存在任何环（自然也没有负权环），且任意最短路径上的边必然顺着拓扑序从左往右走！</li>
<li><b>算法流程</b>：
  <ol>
  <li>用 DFS 对 DAG 进行拓扑排序（按完成时间 \(v.f\) 降序排列），耗时 \(\Theta(V+E)\)；</li>
  <li>按拓扑序依次遍历每个顶点 \(u\)，将 \(u\) 的所有出边 \((u, v)\) 各松弛一次，耗时 \(\Theta(V+E)\)。</li>
  </ol>
</li>
<li><b>特点</b>：每条边<b>只松弛 1 次</b>，总时间 <b>\(\Theta(V+E)\)（线性时间）</b>，而且<b>完全支持负权边</b>（甚至可以把所有边权取相反数来求 DAG 上的最长路径，如 HW6 Q4 课程先修最少学期数）！</li>
</ul>

<h2>5. Dijkstra 算法：非负权图的贪心扩展</h2>

<h3>5.1 物理直觉与算法流程</h3>
<ul>
<li><b>信号传播 / 闹钟模型（课件 Slide 8–13）</b>：当所有边权 \(w(u,v) \ge 0\) 时，想象从源点 \(s\) 在时刻 0 以恒定速度沿所有出边发出信号；每个节点第一次收到信号的时间就是它的最短距离 \(\delta(s, v)\)，随后它立刻向所有邻居设置闹钟 \(t_u + w(u,v)\)（每个邻居只保留最早响的那个闹钟）。全图中<b>下一个最早响起闹钟的节点</b>，必然已经拿到了真实的最终最短距离！</li>
<li><b>算法流程</b>：维护已确定最短距离的<b>闭集（Closed Set）\(S\)</b> 与待探索的<b>开集（Open Set / 最小优先队列）\(Q = V \setminus S\)</b>：
  <ol>
  <li>初始化 \(s.d = 0\)，其余 \(v.d = \infty\)，将所有顶点放入最小优先队列 \(Q\)（以 \(v.d\) 为键值）。</li>
  <li>当 \(Q\) 非空时，执行 \(u \leftarrow \text{Extract-Min}(Q)\)（取出当前 \(Q\) 中 \(u.d\) 最小的顶点），将 \(u\) 加入 \(S\)，并对 \(u\) 的每条出边 \((u, v)\) 执行 \(\text{relax}(u, v)\)（若 \(v.d\) 减小则调用 \(\text{Decrease-Key}(Q, v, v.d)\)）。</li>
  </ol>
</li>
</ul>

<h3>5.2 正确性证明（课件 Slide 20 反证法，必考）</h3>
<ul>
<li><b>循环不变式</b>：对所有已进入 \(S\) 的节点 \(x \in S\)，均有 \(x.d = \delta(s, x)\)。</li>
<li><b>归纳证明</b>：假设将要从 \(Q\) 中提取拥有最小估计值的节点 \(t\)（满足 \(\forall x \in Q,\ t.d \le x.d\)）加入 \(S\) 时，\(t.d &gt; \delta(s, t)\)（例如 \(t.d = 10\)，但真实最短路长为 \(\delta(s,t) = 9\)）。考察从 \(s\) 到 \(t\) 的真实最短路径 \(p\)：由于 \(s \in S\) 而 \(t \in Q\)，路径 \(p\) 必然在某一步第一次离开 \(S\) 进入 \(Q\)——设离开 \(S\) 的最后一个点为 \(z' \in S\)，进入 \(Q\) 的第一个点为 \(v \in Q\)（即 \((z', v)\) 是跨界边）：
  <ol>
  <li><b>若 \(v\) 就是 \(t\) 本身</b>（真实最短路在 \(t\) 之前全在 \(S\) 内）：因为 \(z' \in S\) 早已满足 \(z'.d = \delta(s, z')\) 且出边 \((z', t)\) 已被松弛过，所以当时就已经有 \(t.d \le z'.d + w(z', t) = \delta(s, t) = 9\)，不可能出现 \(t.d = 10\)！</li>
  <li><b>若 \(v \ne t\)</b>（真实最短路先经过 \(Q\) 中的某个点 \(v\) 再走到 \(t\)）：同样因为 \(z' \in S\) 已松弛过 \((z', v)\)，故 \(v.d = \delta(s, v)\)。又因为后续所有边权<b>非负（\(\ge 0\)）</b>，必有 \(\delta(s, v) \le \delta(s, t) = 9 &lt; 10 = t.d\)，即 \(v.d &lt; t.d\)。但这与 \(t\) 是当前 \(Q\) 中 \(d\) 值最小的节点（\(t.d \le v.d\)）矛盾！\(\square\)</li>
  </ol>
</li>
</ul>

<h3>5.3 不同优先队列实现的时间复杂度与整数权桶优化</h3>
<p>Dijkstra 算法在整个运行过程中固定执行：\(|V|\) 次 <code>Insert</code>、\(|V|\) 次 <code>Extract-Min</code>，以及至多 \(|E|\) 次 <code>Decrease-Key</code>：</p>
<table>
<thead><tr><th>优先队列数据结构</th><th><code>Extract-Min</code>（\(\times |V|\)）</th><th><code>Decrease-Key</code>（\(\times |E|\)）</th><th>总时间复杂度</th></tr></thead>
<tbody>
<tr><td><b>普通数组（Array）</b></td><td>\(\Theta(|V|)\)</td><td>\(\Theta(1)\)</td><td>\(\Theta(|V|^2 + |E|) = \mathbf{\Theta(|V|^2)}\)（稠密图最优）</td></tr>
<tr><td><b>二叉最小堆（Binary Heap）</b></td><td>\(\Theta(\log |V|)\)</td><td>\(\Theta(\log |V|)\)</td><td>\(\mathbf{\Theta((|V| + |E|)\log |V|)}\)</td></tr>
<tr><td><b>斐波那契堆（Fibonacci Heap）</b></td><td>\(\Theta(\log |V|)\) 均摊</td><td>\(\Theta(1)\) 均摊</td><td>\(\mathbf{\Theta(|V|\log |V| + |E|)}\)</td></tr>
<tr><td><b>桶数组 / 循环桶（Dial 算法，边权 \(\in \{0,1,\dots,C\}\)）</b></td><td>均摊 \(O(C)\)（总扫描 \(O(|V|C)\)）</td><td>\(O(1)\)（链表间移动）</td><td>\(\mathbf{O(|V|C + |E|)}\)（当 \(C=O(1)\) 时为<b>线性 \(O(|V|+|E|)\)</b>！）</td></tr>
</tbody>
</table>
<p><i>注（MIT 讲义 &amp; 2021 样卷 Problem 7）</i>：当边权为不超过 \(C\) 的非负整数时，最短路径长度 \(\le (|V|-1)C\)，可用长度为 \(|V|C+1\) 的桶数组（或长度为 \(C+1\) 的循环桶数组，距离 \(d\) 放入桶 \(d \bmod (C+1)\)）代替堆；或者当边权 \(\in \{1, \dots, k\}\) 时将每条长 \(w\) 的边拆成 \(w\) 条长为 1 的边跑 BFS，耗时 \(O(|V| + k|E|)\)。</p>

<h3>5.4 负权边对 Dijkstra 的影响与三大高频变体（课件 Slide 22–24 &amp; HW7）</h3>
<ol>
<li><b>为什么标准 Dijkstra 在有负权边时会算出错误结果？</b>因为已进入 \(S\) 的节点不再稳定！某条权重较大的出边（如 \(A\to B(5)\)）后面可能跟着一条很大的负权边（如 \(B\to C(-10)\)），使得原本以 \(d=3\) 提前进入 \(S\) 的节点 \(C\) 实际上有更短的路径 \(5 - 10 = -5\)，但标准 Dijkstra 已经将 \(C\) 移出 \(Q\)，不再重新扩展 \(C\) 的邻居（HW7 Q1）。</li>
<li><b>特例（HW7 Q5）：如果图中唯一的负权边都直接从源点 \(s\) 出发，其余所有边权均 \(> 0\)，标准 Dijkstra 会出错吗？</b>
  <ul>
  <li><b>绝不会出错！</b>因为在证明中，任何最短路径 \(s = v_0 \to v_1 \to \dots \to v_k = y\) 只有第一条边 \((s, v_1)\) 可能是负权边，而 \(s\) 在第一步就被提取并一次性把所有 \((s, v_1)\) 松弛到位；路径后续的后缀 \(v_{i+1} \to \dots \to y\) 不包含任何从 \(s\) 出发的边，故后缀边权全部 \(> 0\)，后缀总重仍然 \(\ge 0\)，\(\delta(s, v_{i+1}) \le \delta(s, y)\) 依然成立！</li>
  </ul>
</li>
<li><b>允许重入队的 Modified Dijkstra（课件 Slide 22–24 &amp; HW7 Q2）</b>：如果修改规则——每当某个节点 \(v\)（哪怕它以前已经进过 \(S\)）被成功严格松弛（\(v.d\) 变小）时，都把它<b>重新放回 \(Q\)</b> 再次等待提取和扩展，那么只要没有负权环，算法最终一定能算出正确的最短路，但不再保证在 \(|V|\) 步内结束（最坏可能指数级重入队）。</li>
</ol>

<h2>考前清单</h2>
<ul>
<li>掌握 Bellman-Ford 的 \(|V|-1\) 轮松弛归纳证明、第 \(|V|\) 轮负环检测及 \(\Theta(VE)\) 复杂度。</li>
<li>掌握 DAG 最短路为什么只需按拓扑序松弛 1 遍（\(\Theta(V+E)\) 且允许负权）。</li>
<li>熟记 Dijkstra 在数组、二叉堆、Fibonacci 堆、有界整数桶下的四种复杂度，以及“仅源点出边为负时 Dijkstra 仍正确”的证明。</li>
</ul>
`,
  questions: [
    { id: "q1", tag: "slide", kind: "single", q: String.raw`对于含 \(|V|\) 个顶点、\(|E|\) 条边的带权有向无环图（DAG，可能含有负权边），求单源最短路径的最优通用算法及其时间复杂度为`, choices: [
      ["a", String.raw`先用 DFS 求拓扑排序，再按拓扑序依次松弛每个顶点的出边，总时间 \(\Theta(|V|+|E|)\)`],
      ["b", String.raw`运行 Dijkstra 算法（二叉堆实现），总时间 \(\Theta((|V|+|E|)\log |V|)\)`],
      ["c", String.raw`运行 Bellman-Ford 算法，总时间 \(\Theta(|V||E|)\)`],
      ["d", String.raw`运行普通 BFS，总时间 \(\Theta(|V|+|E|)\)`]
    ], answer: ["a"], why: String.raw`DAG 无环，故无负权环。按拓扑序依次松弛每个顶点的出边，每条边恰好只需松弛 1 次即可精确解出 Bellman 方程，即使有负权边也只需线性时间 \(\Theta(|V|+|E|)\)。` },
    { id: "q2", tag: "slide", kind: "single", q: String.raw`在非负权图 \(G=(V,E)\) 上运行 Dijkstra 算法，若优先队列分别采用 (1) 普通无序数组、(2) 二叉最小堆、(3) Fibonacci 堆实现，则总时间复杂度分别为`, choices: [
      ["a", String.raw`(1) \(\Theta(V^2)\)；(2) \(\Theta((V+E)\log V)\)；(3) \(\Theta(V\log V + E)\)`],
      ["b", String.raw`(1) \(\Theta(VE)\)；(2) \(\Theta(V\log V)\)；(3) \(\Theta(V + E)\)`],
      ["c", String.raw`(1) \(\Theta(V^2)\)；(2) \(\Theta(V\log V + E)\)；(3) \(\Theta((V+E)\log V)\)`],
      ["d", String.raw`(1) \(\Theta(V^2\log V)\)；(2) \(\Theta(E\log V)\)；(3) \(\Theta(V\log V)\)`]
    ], answer: ["a"], why: String.raw`Dijkstra 执行 \(V\) 次 Extract-Min 和至多 \(E\) 次 Decrease-Key：数组为 \(V\cdot\Theta(V) + E\cdot\Theta(1) = \Theta(V^2)\)；二叉堆为 \((V+E)\log V\)；Fibonacci 堆将 Decrease-Key 均摊降为 \(\Theta(1)\)，总时间为 \(\Theta(V\log V + E)\)。` },
    { id: "q3", tag: "hw", kind: "tf", q: String.raw`（HW7 Q5）在一个无负权环的有向图中，如果所有负权边都仅仅是从源点 \(s\) 直接出发的边（即 \(\forall u \ne s,\ w(u,v) &gt; 0\)），那么从 \(s\) 启动的标准 Dijkstra 算法（不重入队）一定能正确算出 \(s\) 到所有顶点的最短路径。`, answer: ["t"], why: String.raw`True！源点 \(s\) 在第一步就被提取并把所有从 \(s\) 出发的负权边松弛完毕；此后任何最短路径在离开 \(Q\) 中第一个节点 \(v_{i+1}\) 之后的后缀不再经过 \(s\)，故后缀边权全部为正，贪心选择性质 \(\delta(s, v_{i+1}) \le \delta(s, y)\) 依然严格成立。` },
    { id: "q4", tag: "hw", kind: "single", q: String.raw`（HW7 Q6）给定一个可能含负权边（但无负权环）的有向图 \(G=(V,E)\)，若已知从 \(u\) 到 \(v\) 的最短路径至多包含 \(k\) 条边（\(k \ll |V|\)），则求出该最短路径的最优算法及时间复杂度为`, choices: [
      ["a", String.raw`从 \(u\) 出发运行 Bellman-Ford 算法，但只执行 \(k\) 轮全边松弛，时间复杂度 \(O(k|E|)\)`],
      ["b", String.raw`必须运行完整的 \(|V|-1\) 轮 Bellman-Ford，时间复杂度 \(O(|V||E|)\)`],
      ["c", String.raw`运行 \(k\) 次 Dijkstra 算法，时间复杂度 \(O(k(|V|+|E|)\log |V|)\)`],
      ["d", String.raw`运行深度限制为 \(k\) 的 DFS，时间复杂度 \(O(|V|+|E|)\)`]
    ], answer: ["a"], why: String.raw`Bellman-Ford 的归纳性质保证：第 \(i\) 轮全边松弛结束后，所有边数 \(\le i\) 的最短路径均已收敛到真实最短距离 \(\delta\)。既然最短路径至多有 \(k\) 条边，只需跑 \(k\) 轮即可，耗时 \(O(k|E|)\)。` },
    { id: "q5", tag: "hw", kind: "single", q: String.raw`（HW7 Q8 / DPV 4.7）给定可能含负权边的有向图 \(G=(V,E)\)、源点 \(s\) 以及一棵以 \(s\) 为根的生成树 \(T=(V,E')\)，如何在 \(O(|V|+|E|)\) 线性时间内检验 \(T\) 是否为从 \(s\) 出发的真实最短路径树（SPT）？`, choices: [
      ["a", String.raw`先在 \(T\) 上用 DFS/BFS 算出树上距离 \(d_T(s, v)\)，然后对图中每条边 \((u, v) \in E\) 检验是否都满足 \(w(u, v) + d_T(s, u) \ge d_T(s, v)\)`],
      ["b", String.raw`只需检查树 \(T\) 中的边 \((u, v) \in E'\) 是否都没有负权边`],
      ["c", String.raw`运行一轮 Dijkstra 算法看前驱是否与 \(T\) 一致`],
      ["d", String.raw`检查 \(T\) 是否与图的 BFS 树同构`]
    ], answer: ["a"], why: String.raw`先沿树 \(T\) 在 \(O(V)\) 时间内算出每个点的树路径长 \(d_T(s,v)\)，再花 \(O(E)\) 检查所有边 \((u,v)\in E\) 是否均无法进一步松弛（即 \(w(u,v) + d_T(s,u) \ge d_T(s,v)\)）。当且仅当所有边都通过测试时，Bellman 方程满足且无负权环，\(T\) 是正确的 SPT。` },
    { id: "q6", tag: "sample", kind: "single", q: String.raw`（2021 样卷 Problem 7）若图 \(G=(V,E)\)（\(|V|=n, |E|=m\)）的每条边权 \(w(e) \in \{1, 2, \dots, k\}\)，将长度为 \(w\) 的边拆成 \(w\) 条长度为 1 的串联边（插入 \(w-1\) 个中间虚拟顶点）再运行 BFS 求最短路径树，其时间复杂度为`, choices: [
      ["a", String.raw`\(O(n + km)\)`],
      ["b", String.raw`\(O(knm)\)`],
      ["c", String.raw`\(O((n+m)\log k)\)`],
      ["d", String.raw`\(O(n^2 + m)\)`]
    ], answer: ["a"], why: String.raw`每条边至多拆成 \(k\) 条边并引入 \(k-1\) 个新顶点，故新图顶点数 \(|V'| \le n + (k-1)m\)，边数 \(|E'| \le km\)。在新图上运行 BFS 耗时 \(O(|V'| + |E'|) = O(n + km)\)。` }
  ],
  cards: [
    [String.raw`Bellman 方程及其唯一解的前提条件`, String.raw`当图中无负权环时，\(\delta(s,s)=0,\ \delta(s,t)=\min_{u\in\text{pre}(t)}\{\delta(s,u)+w(u,t)\}\) 有唯一解，且最短路必为简单路径（\(\le |V|-1\) 条边）。`],
    [String.raw`Bellman-Ford 算法为何做 \(|V|-1\) 轮？如何检测负权环？`, String.raw`第 \(i\) 轮结束后所有含 \(\le i\) 条边的最短路均已收敛，简单最短路至多 \(|V|-1\) 条边；第 \(|V|\) 轮若仍有边满足 \(v.d &gt; u.d + w(u,v)\) 则存在可达负权环。`],
    [String.raw`Dijkstra 算法的三种优先队列复杂度与桶队列优化`, String.raw`数组 \(\Theta(V^2)\)；二叉堆 \(\Theta((V+E)\log V)\)；Fibonacci 堆 \(\Theta(V\log V + E)\)；边权 \(\in\{0..C\}\) 时用桶队列/循环桶为 \(O(VC + E)\)。`],
    [String.raw`为什么只有源点 \(s\) 的出边为负、其余边为正时，标准 Dijkstra 依然正确？`, String.raw`因为 \(s\) 第一步就被提取并松弛完所有负边，此后任何跨界路径在 \(Q\) 中的后缀不再含 \(s\) 的出边，后缀边权全正，贪心不变式依然成立。`],
    [String.raw`如何在线性时间 \(O(V+E)\) 内验证一棵树 \(T\) 是否为最短路径树（DPV 4.7）？`, String.raw`先在 \(T\) 上算出树距离 \(d_T(s,v)\)，再验证对所有 \((u,v)\in E\) 都有 \(w(u,v) + d_T(s,u) \ge d_T(s,v)\)（即无任何边可松弛）。`]
  ]
});
