Review.add({
  id: "w7a", group: "lecture", n: 3,
  short: "W7A BFS / DFS / 拓扑排序",
  title: "Week 7A · 图表示、BFS、DFS、白色路径定理、环检测与拓扑排序",
  meta: "Week 7 Lectures 1–2 · Graph Representations / BFS / DFS / Topological Sort",
  sources: [
    { label: "Graphs 课件 PDF", href: "materials/w7/Graphs.pdf" },
    { label: "BFS 2026 课件 PDF", href: "materials/w7/BFS_2026.pdf" },
    { label: "DFS 2026 课件 PDF", href: "materials/w7/DFS_2026.pdf" },
    { label: "Pre-lecture: BFS & DFS 讲义", href: "materials/w7/csc4120-bfs-dfs-portable.md" }
  ],
  html: String.raw`
<p class="lede">本讲涵盖图的四种计算机表示及其空间/时间权衡（2021 样卷 2C 考点），对比广度优先搜索（BFS）与深度优先搜索（DFS）的机制，重点剖析 DFS 的时间戳括号化性质、四类边分类、<b>白色路径定理（White-Path Theorem）</b>及其在有向图环检测与 DAG 拓扑排序中的严格证明。</p>

<h2>1. 图的表示与时空权衡（2021 样卷 Problem 2C）</h2>
<p>设图 \(G = (V, E)\)，顶点数 \(|V| = n\)，边数 \(|E| = m\)（有向图 \(m \le n^2\)，简单无向图 \(m \le n(n-1)/2\)）。注意：**表示一个顶点编号 \(1\dots n\) 需要 \(\lceil\log_2 n\rceil = \Theta(\log n)\) 个比特（bits）**！</p>
<table>
<thead><tr><th>表示方法</th><th>数据结构与比特空间复杂度</th><th>操作时间复杂度</th><th>适用场景</th></tr></thead>
<tbody>
<tr><td><b>邻接表（Adjacency List）</b></td><td>长度为 \(n\) 的数组 \(A[1..n]\)，\(A[u]\) 为存储 \(u\) 的所有出邻居的链表。每条边占一个链表节点（存一个 \(\log n\) 比特的顶点号）。<br><b>总空间：\(\Theta((n + m)\log n)\text{ bits}\)</b></td><td>• 添加边：\(O(1)\)<br>• 查边 \((u,v)\) 是否存在：\(O(\deg(u))\)<br>• <b>遍历 \(u\) 的所有邻居：\(O(\deg(u))\)</b></td><td><b>稀疏图</b>（如 \(m = O(n)\)）以及<b>运行 DFS / BFS 等图遍历算法时首选</b></td></tr>
<tr><td><b>邻接矩阵（Adjacency Matrix）</b></td><td>\(n \times n\) 的 0-1 矩阵，每个表项仅需 \(1\text{ bit}\)。<br><b>总空间：\(\Theta(n^2)\text{ bits}\)</b></td><td>• 添加/删除边：\(O(1)\)<br>• <b>查边 \((u,v)\) 是否存在：\(O(1)\)</b><br>• 遍历 \(u\) 的所有邻居：\(\Theta(n)\)</td><td><b>极稠密图</b>（当 \(m\) 接近 \(n^2\)，如 \(m = 0.9n^2\) 时，不仅查边 \(O(1)\)，而且 \(n^2\) bits 比 \((n+m)\log n\) bits 更省空间！）</td></tr>
<tr><td><b>关联表（Incidence List）</b></td><td>每个顶点存储从它出发的边对象列表，\(\Theta((n+m)\log n)\text{ bits}\)</td><td>与邻接表类似，适合边附带复杂属性的场景</td><td>带权图、网络流图</td></tr>
<tr><td><b>隐式表示（Implicit Graph）</b></td><td>不显式存图，仅实现函数 \(\text{Adj}(u)\) 动态生成邻居，<b>静态空间 \(O(1)\)</b></td><td>按需即时计算邻居</td><td>状态空间搜索（如二阶魔方 \(8!3^8 / 24 / 3 = 3,674,160\) 个可达状态，直径 14）</td></tr>
</tbody>
</table>

<h2>2. 广度优先搜索（BFS）：队列、Frontier 与无向图判环</h2>
<ul>
<li><b>两种等价实现</b>：
  <ol>
  <li><b>FIFO 队列实现</b>：源点 \(s\) 入队；每次从队首弹出 \(u\)，将所有未访问邻居 \(v\) 标记已访问、设 \(\text{parent}[v]=u\)、\(\text{dist}[v]=\text{dist}[u]+1\) 并入队尾。</li>
  <li><b>Frontier（前沿层级）实现</b>：维护当前层集合 \(\text{frontier}_{i-1}\)，扫描其中所有点的邻居构造下一层未访问点集合 \(\text{frontier}_i\)，天然按距离 \(i = 0, 1, 2, \dots\) 逐层向外推进。</li>
  </ol>
</li>
<li><b>最短跳数树（Shortest-Path Tree for Unit Weights）</b>：将图从源点 \(s\) “拎起来”，BFS 树中每个节点的层级即为从 \(s\) 到该点的<b>最少边数（minimum hop count）</b>。在邻接表上耗时 \(O(|V| + |E|)\)。</li>
<li><b>BFS 能检测环吗？（2021 样卷 3k, 3l &amp; Pre-lecture 核心辨析）</b>
  <ul>
  <li><b>无向图（Undirected Graph）——能，\(O(|V|+|E|)\)（即 \(O(\max\{|V|,|E|\})\)）</b>：在无向图上跑 BFS，若从 \(u\) 考察邻居 \(v\) 时发现 \(v\) 已被访问过，且 <b>\(v \ne \text{parent}[u]\)</b>，则 \(s \leadsto u\) 与 \(s \leadsto v\) 的树路径加上边 \((u,v)\) 必然闭合出一个环；若全程未遇到此类非父已访问邻居，则该连通分量是一棵树（无环）。</li>
  <li><b>有向图（Directed Graph）——标准 BFS 不能判全图是否有环（False）</b>：
    <ul>
    <li><i>误报反例</i>：钻石 DAG \(s\to a,\ s\to b,\ a\to c,\ b\to c\)。BFS 先通过 \(a\) 标记 \(c\)，随后从 \(b\) 看到已访问的 \(c\)，但图中并无有向环！</li>
    <li><i>只检查是否为 BFS 树祖先也不行（漏报反例）</i>：设边为 \(s\to a,\ s\to b,\ a\to c,\ c\to b,\ b\to a\)。BFS 从 \(s\) 出发得到 \(\text{parent}[a]=s,\ \text{parent}[b]=s,\ \text{parent}[c]=a\)。非树边 \(b\to a\) 中 \(a\) 不是 \(b\) 的 BFS 树祖先，\(c\to b\) 中 \(b\) 也不是 \(c\) 的 BFS 树祖先，但 \(a\to c\to b\to a\) 明明是一个有向环！</li>
    <li><i>特例（HW6 Q1）</i>：如果题目<b>给定一个特定顶点 \(v\)</b>，问“<b>\(v\) 本身是否在某个有向环上</b>”，则只需从 \(v\) 跑一次 BFS 求出 \(v\) 可达的所有顶点集合 \(R\)，再检查是否存在 \(u \in R\) 使得有向边 \((u, v) \in E\)，耗时 \(O(V+E)\)。</li>
    </ul>
  </li>
  </ul>
</li>
</ul>

<h2>3. 深度优先搜索（DFS）：颜色、时间戳与四类边</h2>
<ul>
<li><b>CLRS 三色与时间戳机制</b>：
  <ul>
  <li>每个顶点维护三种颜色：<b>White（白色）</b> = 尚未发现；<b>Gray（灰色）</b> = 已被发现、当前正在递归调用栈（active stack）上；<b>Black（黑色）</b> = 其所有出边及子树均已探索完毕。</li>
  <li>全局时钟从 1 到 \(2|V|\) 递增：节点 \(u\) 首次变灰时记录发现时间 \(u.d\)（DPV 书中记为 \(\text{pre}(u)\)），变黑退栈时记录完成时间 \(u.f\)（DPV 记为 \(\text{post}(u)\)）。</li>
  <li><b>括号化定理（Parenthesis Theorem）</b>：对任意两个顶点 \(u, v\)，时间区间 \([u.d, u.f]\) 与 \([v.d, v.f]\) 要么<b>完全不相交</b>（互不为后代），要么<b>一个完全包含在另一个内部</b>（\(u\) 是 \(v\) 的祖先 \(\iff u.d &lt; v.d &lt; v.f &lt; u.f\)）。</li>
  </ul>
</li>
<li><b>DFS 的四类边（在从灰点 \(u\) 沿着边 \((u, v)\) 探索的瞬间判定）</b>：
<table>
<thead><tr><th>边类型</th><th>探索 \((u,v)\) 时 \(v\) 的颜色与关系</th><th>时间戳充要条件</th><th>无向图中是否存在？</th></tr></thead>
<tbody>
<tr><td><b>Tree edge（树边）</b></td><td>\(v\) 为 <b>White</b>（首次被发现，设 \(v.\pi = u\)）</td><td>\(u.d &lt; v.d &lt; v.f &lt; u.f\)</td><td><b>存在</b></td></tr>
<tr><td><b>Back edge（后向边）</b></td><td>\(v\) 为 <b>Gray</b>（\(v\) 仍在递归栈上，是 \(u\) 的祖先；含自环）</td><td>\(v.d \le u.d &lt; u.f \le v.f\)</td><td><b>存在</b></td></tr>
<tr><td><b>Forward edge（前向边）</b></td><td>\(v\) 为 <b>Black</b> 且 \(v\) 是 \(u\) 在 DFS 树中的非直接后代</td><td>\(u.d &lt; v.d &lt; v.f &lt; u.f\)</td><td><b>不存在</b>（从后代 \(v\) 探索时早已作为后向边处理）</td></tr>
<tr><td><b>Cross edge（横叉边）</b></td><td>\(v\) 为 <b>Black</b> 且 \(u,v\) 无祖先后代关系（不同分支或不同树）</td><td>\(v.d &lt; v.f &lt; u.d &lt; u.f\)（总是从右往左指）</td><td><b>不存在</b>（若 \(v\) 先访问，从 \(v\) 探索时该边必已成为树边）</td></tr>
</tbody>
</table>
</li>
<li><b>经典错觉反例（<code>Questions_on_BFS_and_DFS.pdf</code>）</b>：如果图中存在路径 \(u \leadsto v\)，且在某次 DFS 中 \(u.d &lt; v.d\)，\(v\) 一定是 \(u\) 在 DFS 树中的后代吗？<b>不一定！</b>
  <ul>
  <li><i>反例</i>：设边为 \(w \to u,\ w \to v,\ v \to w\)，从 \(w\) 开始先访问 \(u\)：\(w.d=1 \to u.d=2,\ u.f=3 \to v.d=4,\ v.f=5 \to w.f=6\)。虽然存在路径 \(v \to w \to u\)（或把方向改为 \(u\leftarrow w\to v\)，或者 \(u\to w\to v\) 但 \(w\) 在 \(u\) 之前已变灰！即 \(w.d=1 \to u.d=2\)，\(u\to w\) 是后向边，\(u\) 无其他出边于 \(u.f=3\) 结束，之后 \(w\) 才走 \(w\to v\) 在 \(v.d=4\) 发现 \(v\)）。此时 \(u \to w \to v\) 是一条从 \(u\) 到 \(v\) 的有向路径，且 \(u.d=2 &lt; v.d=4\)，但因为在 \(u.d=2\) 时刻路径上的中间点 \(w\) 已经是<b>灰色（非白色）</b>，所以 \(v\) 并不是 \(u\) 的后代！这正说明了为什么需要<b>白色路径定理</b>中的“全白”条件。</li>
  </ul>
</li>
</ul>

<h2>4. 白色路径定理（White-Path Theorem，CLRS 定理 22.9）</h2>
<ul>
<li><b>定理陈述</b>：在图 \(G\) 的一次 DFS 中，顶点 \(v\) 是顶点 \(u\) 在 DFS 森林中的后代，<b>当且仅当</b>在 \(u\) 刚被发现的时刻 \(u.d\)，图中存在一条从 \(u\) 到 \(v\) 的、完全由当时的<b>白色（White）顶点</b>组成的路径 \(W_u\)。</li>
<li><b>严格证明（课件 Slide 10 反证法，必背）</b>：
  <ul>
  <li>\((\Rightarrow)\) 若 \(v\) 是 \(u\) 的树后代，则树路径 \(u \leadsto v\) 上除 \(u\) 外的所有节点都是在 \(u.d\) 之后才被发现的，因此在 \(u.d\) 时刻全部为白色。</li>
  <li>\((\Leftarrow)\) 假设在 \(u.d\) 时刻存在一条从 \(u\) 到 \(v\) 的全白路径，但 DFS 结束后 \(v\) 却不是 \(u\) 的后代。沿着这条路径从 \(u\) 往 \(v\) 走，设 <b>\(t\) 是路径上第一个不是 \(u\) 的后代的顶点</b>，并设 \(s\) 是路径上紧挨在 \(t\) 前面的前驱节点（可能 \(s=u\)）。
    <ol>
    <li>因为 \(t\) 是第一个非后代，所以它的前驱 \(s\) <b>一定是 \(u\) 的后代</b>（从而 \(u.d \le s.d &lt; s.f \le u.f\)）。</li>
    <li>在 \(u.d\) 时刻 \(t\) 是白色的；又因为 \(t\) 不是 \(u\) 的后代，括号化定理告诉我们 \(t\) 不可能在 \([u.d, u.f]\) 期间被发现，所以 \(t\) 直到 \(u\)（以及 \(s\)）完成之后才被发现，即 \(t.d &gt; u.f \ge s.f\)。</li>
    <li>但是在 \(s\) 完成变黑（时刻 \(s.f\)）之前，DFS 必须检查 \(s\) 的所有出边，特别是边 \((s, t)\)！在检查 \((s, t)\) 的那一刻，既然 \(t.d &gt; s.f\)，说明 \(t\) 此时仍然是白色的，DFS 就会立即递归调用 \(\text{DFS-Visit}(t)\) 把 \(t\) 变成 \(s\)（从而也是 \(u\)）的后代——矛盾！\(\square\)</li>
    </ol>
  </li>
  </ul>
</li>
</ul>

<h2>5. 有向图环检测与 DAG 拓扑排序</h2>

<h3>5.1 环检测定理（Cycle Detection）</h3>
<ul>
<li><b>定理</b>：有向（或无向）图 \(G\) 含有环 \(\iff\) 对 \(G\) 运行 DFS 会产生至少一条<b>后向边（Back Edge）</b>。</li>
<li><b>双向证明（课件 Slide 11）</b>：
  <ul>
  <li>\((\Leftarrow)\) 若存在后向边 \((u, v)\)，则 \(v\) 是 \(u\) 在 DFS 树中的祖先，树路径 \(v \leadsto u\) 加上后向边 \((u, v)\) 即构成一个环。</li>
  <li>\((\Rightarrow)\) 设图中存在环 \(C\)，考察环 \(C\) 上<b>第一个被 DFS 发现的顶点</b>，记为 \(v_0\)，并设环上指向 \(v_0\) 的那条边的起点为 \(v_k\)（即 \((v_k, v_0) \in C\)）。在 \(v_0\) 刚被发现的时刻 \(v_0.d\)，由于 \(v_0\) 是环上最早被发现的点，环上其余所有顶点 \(v_1, \dots, v_k\) 此时<b>全部是白色的</b>！因此从 \(v_0\) 到 \(v_k\) 存在一条全白路径。由<b>白色路径定理</b>，\(v_k\) 必然成为 \(v_0\) 在 DFS 树中的后代（故 \(v_0.d &lt; v_k.d &lt; v_k.f &lt; v_0.f\)）。当 \(v_k\) 处于灰色并探索边 \((v_k, v_0)\) 时，\(v_0\) 仍为灰色在栈上，因此 \((v_k, v_0)\) 必被判定为一条<b>后向边</b>！\(\square\)</li>
  </ul>
</li>
</ul>

<h3>5.2 DAG 拓扑排序（Topological Sort）</h3>
<ul>
<li><b>定义</b>：有向无环图（DAG）\(G=(V,E)\) 的拓扑排序是将所有顶点排成线性序列，使得对每条有向边 \((u, v) \in E\)，\(u\) 在序列中都排在 \(v\) 的前面（所有边都从左指向右）。</li>
<li><b>算法（\(O(V+E)\)）</b>：① 对 \(G\) 运行任意一次完整的 DFS，计算每个顶点的完成时间 \(v.f\)（即 \(\text{post}(v)\)）；② 将所有顶点按<b>完成时间 \(v.f\) 从大到小（降序）</b>排列（或者每当一个顶点完成变黑时将它插入链表头部）。</li>
<li><b>正确性核心引理</b>：\(G\) 是 DAG \(\iff\) 在任意 DFS 中，对每条边 \((u, v) \in E\) 都有 <b>\(u.f &gt; v.f\)（即 \(\text{post}(u) &gt; \text{post}(v)\)）</b>。
  <ul>
  <li><i>证明</i>：在探索边 \((u, v)\) 时，\(u\) 为灰色：① 若 \(v\) 为白色，\(v\) 成为 \(u\) 的后代，先于 \(u\) 完成，故 \(v.f &lt; u.f\)；② 若 \(v\) 为黑色，\(v\) 已经完成了而 \(u\) 尚未完成，故 \(v.f &lt; u.f\)；③ 若 \(v\) 为灰色，则 \((u, v)\) 是后向边，但这与 \(G\) 是 DAG（无环、无后向边）矛盾！因此在 DAG 中绝不可能出现 \(u.f &lt; v.f\)，按 \(f\) 降序排列必定使所有边从左指向右。</li>
  </ul>
</li>
<li><b>Source 与 Sink 性质</b>：拓扑序的最后一个顶点（\(f\) 最小）必定是<b>汇点（Sink，出度为 0）</b>；第一个顶点必定是<b>源点（Source，入度为 0）</b>。</li>
</ul>

<h2>考前清单</h2>
<ul>
<li>区分邻接表 \(\Theta((n+m)\log n)\text{ bits}\) 与邻接矩阵 \(\Theta(n^2)\text{ bits}\)，记住 DFS/BFS 优先用邻接表。</li>
<li>熟记 BFS 只能在线性时间内检测<b>无向图</b>的环，不能检测有向图的全图环；记住四类 DFS 边的时间戳关系。</li>
<li>能够默写白色路径定理叙述、有向图有环 \(\Rightarrow\) 必有后向边的证明，以及 DAG 中 \((u,v)\in E \implies u.f &gt; v.f\) 的三色分类证明。</li>
</ul>
`,
  questions: [
    { id: "q1", tag: "sample", kind: "multi", q: String.raw`（2021 样卷 Problem 2C）存储图 \(G=(V,E)\)，其中 \(|V|=n, |E|=m\)。下列哪些说法是正确的？（多选：对一个 +4，错一个 −4）`, choices: [
      ["a", String.raw`在 \(G\) 的邻接矩阵表示中，我们使用 \(O(n\log n)\) bits。`],
      ["b", String.raw`在邻接表表示中，我们使用 \(O((n+m)\log n)\) bits。`],
      ["c", String.raw`当 \(m = 10n\) 时，图是稠密的（dense）。`],
      ["d", String.raw`当 \(m = 0.9n^2\) 时，图是稠密的（dense）。`],
      ["e", String.raw`如果 \(m = 0.8n^2\)，我们更倾向于使用邻接表表示。`],
      ["f", String.raw`如果我们使用 DFS，我们更倾向于用邻接表来表示图。`]
    ], answer: ["b", "d", "f"], why: String.raw`(a) 错：邻接矩阵需 \(\Theta(n^2)\) bits；(b) 对：每个链表节点存顶点号需 \(\log n\) bits，共 \(O((n+m)\log n)\) bits；(c) 错：\(m=10n\) 是稀疏图；(d) 对：\(m=\Theta(n^2)\) 为稠密图；(e) 错：\(m=0.8n^2\) 极稠密，邻接矩阵仅 \(n^2\) bits 且查边 \(O(1)\)，比邻接表更省更优；(f) 对：DFS 遍历邻居在邻接表上为 \(O(n+m)\)，在矩阵上退化为 \(\Theta(n^2)\)。` },
    { id: "q2", tag: "sample", kind: "tf", q: String.raw`（2021 样卷 Problem 3k）广度优先搜索（BFS）可以在 \(O(|V|+|E|)\) 时间内检测有向图（directed graphs）中的环。`, answer: ["f"], why: String.raw`False！在有向图中，BFS 遇到已访问节点可能只是两条不同有向路径汇合（如 \(s\to a\to c\) 与 \(s\to b\to c\)），并非成环；有向图判环应当使用 DFS 检测后向边（或拓扑排序）。` },
    { id: "q3", tag: "sample", kind: "tf", q: String.raw`（2021 样卷 Problem 3l）广度优先搜索（BFS）可以在 \(O(\max\{|V|,|E|\})\) 时间内检测无向图（undirected graphs）中的环。`, answer: ["t"], why: String.raw`True！在无向图中，每条边双向可达，只要 BFS 在扫描 \(u\) 的邻居时发现某个已访问节点 \(v \ne \text{parent}[u]\)，就必然存在环，耗时 \(O(|V|+|E|) = O(\max\{|V|,|E|\})\)。` },
    { id: "q4", tag: "slide", kind: "single", q: String.raw`在有向图的 DFS 中，若边 \((u, v)\) 满足时间戳关系 \(v.d &lt; v.f &lt; u.d &lt; u.f\)，则边 \((u, v)\) 属于哪一类边？`, choices: [
      ["a", "Tree edge（树边）"],
      ["b", "Back edge（后向边）"],
      ["c", "Forward edge（前向边）"],
      ["d", "Cross edge（横叉边）"]
    ], answer: ["d"], why: String.raw`区间 \([v.d, v.f]\) 与 \([u.d, u.f]\) 完全不相交且 \(v\) 在 \(u\) 被发现之前就已经变黑结束，因此 \((u, v)\) 是横叉边（Cross edge）。后向边满足 \(v.d \le u.d &lt; u.f \le v.f\)，树边和前向边满足 \(u.d &lt; v.d &lt; v.f &lt; u.f\)。` },
    { id: "q5", tag: "slide", kind: "tf", q: String.raw`在有向图 \(G\) 中，若存在一条从 \(u\) 到 \(v\) 的有向路径，且在某次 DFS 中有 \(u.d &lt; v.d\)，则 \(v\) 在该次 DFS 树中必定是 \(u\) 的后代。`, answer: ["f"], why: String.raw`False！白色路径定理要求在 \(u.d\) 时刻存在从 \(u\) 到 \(v\) 的<b>全白路径</b>。如果 \(u \leadsto v\) 上的必经中间节点 \(w\) 在 \(u\) 之前就已被发现（\(w.d &lt; u.d\)，处于灰色），那么 \(u\) 可能先结束（\(u.f &lt; v.d\)），之后 \(w\) 才去发现 \(v\)，此时 \(u.d &lt; v.d\) 但 \(v\) 不是 \(u\) 的后代。` },
    { id: "q6", tag: "slide", kind: "single", q: String.raw`设 \(G=(V,E)\) 是一个有向无环图（DAG）。对 \(G\) 运行任意一次 DFS 得到各顶点的发现时间 \(v.d\) 与完成时间 \(v.f\)，则下列哪项对所有有向边 \((u, v) \in E\) 恒成立？`, choices: [
      ["a", String.raw`\(u.d &lt; v.d\)`],
      ["b", String.raw`\(u.d &gt; v.d\)`],
      ["c", String.raw`\(u.f &gt; v.f\)`],
      ["d", String.raw`\(u.f &lt; v.f\)`]
    ], answer: ["c"], why: String.raw`DAG 中没有后向边，故 \((u, v)\) 只能是树边、前向边或横叉边。树边与前向边满足 \(u.d &lt; v.d &lt; v.f &lt; u.f\)，横叉边满足 \(v.d &lt; v.f &lt; u.d &lt; u.f\)——三种情况下都有 \(u.f &gt; v.f\)！因此按 \(v.f\) 降序排列即为合法的拓扑排序。（注：横叉边时 \(u.d &gt; v.d\)，故 \(u.d &lt; v.d\) 不恒成立。）` }
  ],
  cards: [
    [String.raw`邻接表与邻接矩阵的比特（bits）空间复杂度`, String.raw`邻接表：\(\Theta((n+m)\log n)\) bits；邻接矩阵：\(\Theta(n^2)\) bits（仅在 \(m=\Theta(n^2)\) 极稠密图时矩阵更优）。`],
    [String.raw`DFS 四类边的时间戳与颜色判定`, String.raw`探索 \((u,v)\) 时：White \(\to\) Tree (\(u.d&lt;v.d&lt;v.f&lt;u.f\))；Gray \(\to\) Back (\(v.d\le u.d&lt;u.f\le v.f\))；Black 且 \(u.d&lt;v.d\) \(\to\) Forward；Black 且 \(v.f&lt;u.d\) \(\to\) Cross。无向图只有 Tree 和 Back。`],
    [String.raw`白色路径定理（White-Path Theorem）内容`, String.raw`在 DFS 森林中 \(v\) 是 \(u\) 的后代 \(\iff\) 在时刻 \(u.d\) 存在一条从 \(u\) 到 \(v\) 的纯白色顶点路径。`],
    [String.raw`如何用白色路径定理证明“有环 \(\implies\) DFS 必有后向边”？`, String.raw`取环上最早被发现的顶点 \(v_0\)，在 \(v_0.d\) 时刻环上其余点全白，故环上指向 \(v_0\) 的前驱 \(v_k\) 必成为 \(v_0\) 的后代，边 \((v_k, v_0)\) 即为后向边。`],
    [String.raw`DAG 拓扑排序的 DFS 算法及其核心引理`, String.raw`运行任意 DFS 后按完成时间 \(v.f\) 从大到小排列。核心引理：DAG 无后向边，故对任意 \((u,v)\in E\) 恒有 \(u.f &gt; v.f\)。`],
    [String.raw`BFS 能否检测有向图和无向图中的环？`, String.raw`无向图可以（遇到非父已访问邻居即为环，\(O(V+E)\)）；有向图不能用 BFS 检测全图是否有环（但可检测指定单个顶点 \(v\) 是否在环上）。`]
  ]
});
