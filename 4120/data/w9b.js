Review.add({
  id: "w9b", group: "lecture", n: 8,
  short: "W9B 最小生成树与并查集",
  title: "Week 9B · 最小生成树（Kruskal / Prim）与并查集（Union-Find）",
  meta: "Week 9 Lectures 2–3 · Minimum Spanning Trees / Cut Lemma / Union-Find",
  sources: [
    { label: "MSTs 2026 课件 PDF", href: "materials/w9/MSTs_2026.pdf" },
    { label: "Union-Find 课件 PDF", href: "materials/w9/UnionFind.pdf" },
    { label: "交互单步器：MST 电缆网络", href: "materials/w9/cable-network-standalone.html" },
    { label: "交互单步器：并查集 Rank & 路径压缩", href: "materials/w9/union-find-standalone.html" }
  ],
  html: String.raw`
<p class="lede">本讲解决无向连通带权图的最小生成树（Minimum Spanning Tree, MST）问题：首先总结无向树的四条基本性质，然后证明支撑一切贪心 MST 算法的基石——<b>切割引理（Cut Lemma）</b>，由此导出 <b>Kruskal 算法</b>与 <b>Prim 算法</b>；最后深入剖析支撑 Kruskal 高效判环的<b>并查集（Union-Find）</b>数据结构，严格证明按秩合并（Union by Rank）的 \(\log_2 n\) 树高界以及路径压缩（Path Compression）的 \(O(m\log^* n)\) 近线性复杂度。</p>

<h2>1. 无向树的四条基本性质（课件 Slide 4–7）</h2>
<p>在无向图 \(G=(V,E)\)（\(|V|=n\)）中，<b>生成树（Spanning Tree）</b>是覆盖全部 \(n\) 个顶点且<b>连通、无环（connected and acyclic）</b>的子图。课件给出了树的四条核心性质：</p>
<ol>
<li><b>Property 1</b>：从连通图中删去某个环上的一条边，不会破坏图的连通性。</li>
<li><b>Property 2</b>：\(n\) 个顶点的树恰好有 <b>\(n - 1\) 条边</b>。（证明：初始把 \(n\) 个孤立顶点看作 \(n\) 个连通分量；每加入一条不产生环的边，必定连接两个不同的连通分量，使连通分量总数减 1；当连通分量数从 \(n\) 降到 \(1\) 时，恰好加入了 \(n - 1\) 条边。）</li>
<li><b>Property 3</b>：任何具有 \(|E| = |V| - 1\) 条边的连通无向图必定是一棵树（无环）。</li>
<li><b>Property 4</b>：无向图是一棵树 \(\iff\) 任意一对顶点之间存在<b>唯一</b>的一条简单路径。</li>
</ol>
<p><b>基本换边操作（Cycle Property 基础）</b>：向一棵生成树 \(T\) 中加入任意一条非树边 \(e\)，必然形成唯一的一个环 \(C\)；再从环 \(C\) 中删去任意一条其它边 \(e_0\)，所得结果 \(T' = T \cup \{e\} \setminus \{e_0\}\) <b>依然是一棵生成树</b>！如果 \(w(e) \le w(e_0)\)，则新生成树的总权重不会变大。<i>（注意：如果图中存在负权边，“最小生成树”与“覆盖所有顶点的最小权重连通子图”不等价，因为后者会把所有负权边哪怕成环也全选上；但在树被定义为连通无环子图时，MST 在任意实数权下均有明确定义。）</i></p>

<h2>2. 切割引理（Cutting Lemma / Safe Edge Theorem，必考证明）</h2>
<ul>
<li><b>术语定义（课件 Slide 10–13）</b>：
  <ul>
  <li><b>安全边集（Safe Set）</b>：边子集 \(X \subseteq E\) 称为“安全的”，如果存在某棵最小生成树 \(T_0 = (V, E_0)\) 使得 \(X \subseteq E_0\)（即 \(X\) 是某棵 MST 的一部分，未来可以继续扩充成完整的 MST）。</li>
  <li><b>切割（Cut）与尊重（Respect）</b>：将顶点集划分为两个非空集合 \((S, V \setminus S)\) 称为一个切割 \(C\)；若 \(X\) 中没有任何一条边横跨 \(S\) 与 \(V \setminus S\)（即 \(C \cap X = \emptyset\)），则称切割 \(C\) <b>尊重（respects）</b> \(X\)。</li>
  </ul>
</li>
<li><b>切割引理陈述</b>：设 \(X \subseteq E\) 是安全的，\(C = (S, V \setminus S)\) 是任意一个尊重 \(X\) 的切割，且 \(e \in C\) 是横跨切割 \(C\) 的所有边中<b>权重最小（lightest）</b>的一条边。则 \(X \cup \{e\}\) 仍然是安全的！</li>
<li><b>严格交换论证（Exchange Argument，课件 Slide 13 必背）</b>：
  <ol>
  <li>因为 \(X\) 是安全的，存在一棵包含 \(X\) 的最小生成树 \(T_0 = (V, E_0)\)（即 \(X \subseteq E_0\)）。如果 \(e \in E_0\)，则 \(X \cup \{e\} \subseteq E_0\) 显然安全。</li>
  <li>如果 \(e \notin E_0\)，我们将边 \(e\) 加入 \(T_0\)。由于 \(T_0\) 是生成树，\(T_0 \cup \{e\}\) 中必然形成唯一的一个环。</li>
  <li>因为 \(e\) 的两个端点分别在切割的两侧 \(S\) 和 \(V \setminus S\)，这个环从一侧经 \(e\) 跨到另一侧后，<b>必然还要沿着 \(T_0\) 中的至少另一条边 \(e_0 \in E_0\) 跨回切割 \(C\)</b>！</li>
  <li>因为切割 \(C\) 尊重 \(X\)（\(X\) 中没有边横跨 \(C\)），而 \(e_0\) 横跨 \(C\)，所以必有 <b>\(e_0 \notin X\)</b>！</li>
  <li>从 \(T_0 \cup \{e\}\) 的环中删去 \(e_0\)，得到一棵新的生成树 \(E' = E_0 \setminus \{e_0\} \cup \{e\}\)。显然 \(X \cup \{e\} \subseteq E'\)。</li>
  <li>因为 \(e\) 是横跨切割 \(C\) 的最轻边，而 \(e_0\) 也横跨 \(C\)，故 \(w(e) \le w(e_0)\)。于是新生成树的总权重满足：
  \[w(E') = w(E_0) - w(e_0) + w(e) \le w(E_0)\]
  由于 \(T_0\) 已经是最小生成树，必有 \(w(E') = w(E_0)\)，即 \(E'\) 也是一棵包含 \(X \cup \{e\}\) 的最小生成树！故 \(X \cup \{e\}\) 是安全的。\(\square\)</li>
  </ol>
</li>
</ul>

<h2>3. 两大 MST 贪心算法：Kruskal vs Prim</h2>
<table>
<thead><tr><th>维度</th><th>Kruskal 算法（按边从小到大加）</th><th>Prim 算法（从单点生长一棵树）</th></tr></thead>
<tbody>
<tr><td><b>中间状态 \(X\)</b></td><td>\(X\) 是一个<b>森林（多棵不相交的连通分量树）</b>，初始为 \(n\) 个孤立顶点</td><td>\(X\) 始终是<b>单棵树（Single Subtree）</b>，顶点集为 \(S\)</td></tr>
<tr><td><b>每步贪心动作</b></td><td>按边权升序扫描，加入下一条<b>连接两个不同连通分量（不产生环）</b>的最轻边 \(e=(u,v)\)</td><td>在所有连接 \(S\) 与 \(V \setminus S\) 的边中，选最轻的一条边并把对应顶点拉入 \(S\)</td></tr>
<tr><td><b>如何用切割引理证明正确性？</b></td><td>当选中连接分量 \(C_1\) 与 \(C_2\) 的最轻边 \(e\) 时，取切割为<b>将 \(C_1\) 与其余所有分量隔开的切割 \((C_1, V \setminus C_1)\)</b>。该切割内无 \(X\) 的边（尊重 \(X\)），且横跨它的任何其他边此前都未加入（权重 \(\ge w(e)\)），故 \(e\) 是跨该切割的最轻边！</td><td>直接取切割为<b>当前树顶点集 \((S, V \setminus S)\)</b>。\(X\) 的边全在 \(S\) 内部（尊重 \(X\)），算法选出的正是横跨 \((S, V\setminus S)\) 的最轻边！</td></tr>
<tr><td><b>核心数据结构与复杂度</b></td><td>排序所有边 \(\Theta(E \log E) = \Theta(E \log V)\) + 并查集做 \(2E\) 次 <code>find</code> 与 \(V-1\) 次 <code>union</code> \(\Theta(E \log V)\)（或 \(\Theta(E\log^* V)\)）。<br><b>总复杂度：\(O(E \log V)\)</b>（瓶颈在排序）</td><td>与 Dijkstra 完全同构的最小优先队列 \(Q\)！<br>• <b>与 Dijkstra 的唯一区别</b>：Dijkstra 的键是整条路径长 \(v.d = \min(u.d + w(u,v))\)；<b>Prim 的键只是单条跨割边长 \(v.d = \min_{u\in S} w(u, v)\)</b>！<br>• 复杂度：二叉堆 \(\Theta((V+E)\log V)\)，Fib 堆 \(\Theta(V\log V + E)\)</td></tr>
</tbody>
</table>

<h2>4. 并查集（Union-Find / Disjoint-Set）数据结构</h2>
<p>维护 \(N\) 个对象的不相交集合，支持三个操作：<code>makeset(x)</code>（建立单元素集）、<code>find(x)</code>（返回 \(x\) 所在集合的代表元/树根）、<code>union(u, v)</code>（合并 \(u\) 和 \(v\) 所在的集合）。</p>

<h3>4.1 从朴素实现到按秩合并（Sedgewick 课件 &amp; MST 课件）</h3>
<table>
<thead><tr><th>实现方案</th><th>核心机制</th><th>单次 <code>find</code></th><th>单次 <code>union</code></th><th>\(N\) 对象上 \(M\) 次操作最坏总时间</th></tr></thead>
<tbody>
<tr><td><b>Quick-Find（急切法）</b></td><td>数组 <code>id[i]</code> 直接存集合编号；<code>union(p,q)</code> 扫描全数组把所有等于 <code>id[p]</code> 的项改为 <code>id[q]</code></td><td>\(O(1)\)</td><td>\(\Theta(N)\)</td><td>\(\Theta(MN)\)（太慢，\(10^9\) 规模需 300 年）</td></tr>
<tr><td><b>Quick-Union（惰性树）</b></td><td><code>id[i]</code> 存父节点，根满足 <code>id[r]=r</code>；<code>union</code> 直接把一棵树的根指向另一棵树的根</td><td>最坏 \(\Theta(N)\)（退化为长链）</td><td>最坏 \(\Theta(N)\)（含两次 <code>find</code>）</td><td>\(\Theta(MN)\)</td></tr>
<tr><td><b>按秩/按大小合并（Union by Rank / Weighted QU）</b></td><td>每个节点维护秩 \(\text{rank}\)（初始为 0）。合并两树根 \(r_x, r_y\) 时，<b>总是把 \(\text{rank}\) 小的根挂到 \(\text{rank}\) 大的根下面</b>；只有当 \(\text{rank}(r_x) = \text{rank}(r_y)\) 时，新根的 \(\text{rank}\) 才 \(+1\)！</td><td>\(O(\log N)\)</td><td>\(O(\log N)\)（给定根后仅 \(O(1)\)）</td><td>\(\mathbf{O(N + M \log N)}\)</td></tr>
<tr><td><b>按秩合并 + 路径压缩（WQUPC）</b></td><td>在每次执行 <code>find(x)</code> 找到根 \(r\) 后，把从 \(x\) 到 \(r\) 路径上经过的所有节点的父指针<b>全部直接改指向根 \(r\)</b>（或单趟写法 <code>id[i] = id[id[i]]</code> 指向祖父）</td><td>均摊 \(O(\log^* N)\)</td><td>均摊 \(O(\log^* N)\)</td><td>\(\mathbf{O((N + M) \log^* N)} \approx O(N+M)\)</td></tr>
</tbody>
</table>

<h3>4.2 按秩合并（Union by Rank）的三条必背性质与证明（MST 课件 Slide 20–22）</h3>
<p>在不含路径压缩的按秩合并中，任何节点的 \(\text{rank}\) 初始为 \(0\)，且只有当两棵同秩 \(k-1\) 的根节点合并时，胜出根的 \(\text{rank}\) 才会变为 \(k\)：</p>
<ol>
<li><b>Property 1（秩沿父指针严格递增）</b>：对任意非根节点 \(x\)，恒有：
\[\text{rank}(x) &lt; \text{rank}(\pi(x))\]</li>
<li><b>Property 2（秩为 \(k\) 的子树大小下界，归纳法证明）</b>：任何秩为 \(k\) 的根节点，其子树中至少包含 <b>\(2^k\)</b> 个节点！
  <ul>
  <li><i>归纳证明</i>：\(k=0\) 时单节点树有 \(1 = 2^0\) 个节点。设对 \(k-1\) 成立；要产生一个秩为 \(k\) 的根，唯一途径是将两棵秩均为 \(k-1\) 的不同根合并，由归纳假设这两棵树各有至少 \(2^{k-1}\) 个节点，合并后至少有 \(2^{k-1} + 2^{k-1} = 2^k\) 个节点（此后只增不减）。\(\square\)</li>
  </ul>
</li>
<li><b>Property 3（秩为 \(k\) 的节点个数上界与 \(\log_2 n\) 树高证明）</b>：如果总共有 \(n\) 个元素，那么全图中秩为 \(k\) 的节点至多有 <b>\(\frac{n}{2^k}\)</b> 个！
  <ul>
  <li><i>推论</i>：当 \(2^k &gt; n\)（即 \(k &gt; \log_2 n\)）时，\(\frac{n}{2^k} &lt; 1\)，不可能存在秩为 \(k\) 的节点。因此<b>最大可能的秩 \(\le \lfloor\log_2 n\rfloor\)</b>。又因为沿任何从叶到根的路径 \(\text{rank}\) 严格递增（Property 1），所以<b>任何树的最大深度（高度）也绝不超过 \(\lfloor\log_2 n\rfloor\)</b>！</li>
  </ul>
</li>
</ol>

<h3>4.3 路径压缩与迭代对数 \(\log^* n\)</h3>
<ul>
<li><b>什么是迭代对数 \(\log^* n\)？</b>把一个数反复取以 2 为底的对数直到结果 \(\le 1\) 所需的次数：
  <ul>
  <li>\(\log^* 1 = 0,\quad \log^* 2 = 1,\quad \log^* 4 = 2,\quad \log^* 16 = 3,\quad \log^* 65536 = 4,\quad \log^*(2^{65536}) = 5\)。</li>
  <li>在已知宇宙的所有实际问题中，\(\log^* n \le 5\)，因此在工程上 WQUPC 就是<b>常数时间 / 线性算法</b>（但理论上 Fredman-Saks 证明不存在真正 \(O(1)\) 的纯线性指针链接策略）。</li>
  </ul>
</li>
<li><b>并查集经典应用（UnionFind 课件 Slide 34–39）</b>：Kruskal 最小生成树、网络连通性、<b>网格渗流阈值仿真（Percolation，顶部虚拟节点与底部虚拟节点连通性检测，临界概率 \(p^* \approx 0.592746\)）</b>、Hex 六边形棋胜负判定、图像连通域标记。</li>
</ul>

<h2>考前清单</h2>
<ul>
<li>熟记树的四条性质，能够完整默写切割引理（Cut Lemma）的交换论证（加 \(e\) 成环 \(\to\) 环必跨切割于另一边 \(e_0 \notin X\) \(\to\) 替换得 \(w(E')\le w(E_0)\)）。</li>
<li>区分 Kruskal（边排序 + 并查集，\(O(E\log V)\)）与 Prim（单树 + 优先队列，键为 \(w(u,v)\) 而非 \(u.d+w(u,v)\)）。</li>
<li>能够默写 Union by Rank 的三条性质及“秩为 \(k\) 的根至少有 \(2^k\) 个节点 \(\implies\) 树高 \(\le \log_2 n\)”的归纳证明。</li>
</ul>
`,
  questions: [
    { id: "q1", tag: "slide", kind: "single", q: String.raw`在证明切割引理（Cut Lemma：若边集 \(X\) 安全，切割 \(C=(S, V\setminus S)\) 尊重 \(X\)，\(e\) 是横跨 \(C\) 的最轻边，则 \(X\cup\{e\}\) 安全）时，设 \(T_0=(V,E_0)\) 是包含 \(X\) 的一棵 MST 且 \(e \notin E_0\)。将 \(e\) 加入 \(T_0\) 形成唯一环后，我们需要从环上删去另一条边 \(e_0\) 得到新生成树 \(T'\)。关于边 \(e_0\) 的选择，下列哪项是证明成立的关键？`, choices: [
      ["a", String.raw`\(e_0\) 必须是环上另外一条同样横跨切割 \(C\) 的边；因为 \(C\) 尊重 \(X\)（\(C\cap X=\emptyset\)），所以必有 \(e_0 \notin X\) 且 \(w(e) \le w(e_0)\)`],
      ["b", String.raw`\(e_0\) 可以是环上的任意一条边，无需横跨切割 \(C\)`],
      ["c", String.raw`\(e_0\) 必须属于安全集 \(X\)`],
      ["d", String.raw`\(e_0\) 必须是全图 \(G\) 中权重最大的一条边`]
    ], answer: ["a"], why: String.raw`只有当 \(e_0\) 也横跨切割 \(C\) 时，才能同时保证两点：① 因为 \(C\cap X = \emptyset\)，删去 \(e_0\) 绝不会破坏已有的安全边集 \(X\)（\(e_0 \notin X\)）；② 因为 \(e\) 是横跨 \(C\) 的最轻边，才有 \(w(e) \le w(e_0)\)，从而 \(w(T') \le w(T_0)\)。` },
    { id: "q2", tag: "slide", kind: "single", q: String.raw`Prim 算法与 Dijkstra 算法都使用最小优先队列 \(Q\) 维护未加入集合 \(S\) 的顶点。两者的优先队列键值 \(v.d\) 更新规则有何本质区别？`, choices: [
      ["a", String.raw`Prim 中 \(v.d = \min_{u\in S} w(u, v)\)（到集合 \(S\) 的单条最轻连边权重）；Dijkstra 中 \(v.d = \min_{u\in S} \{u.d + w(u, v)\}\)（从源点 \(s\) 到 \(v\) 的整条路径总权重）`],
      ["b", String.raw`Prim 中 \(v.d = \min_{u\in S}\{u.d + w(u,v)\}\)；Dijkstra 中 \(v.d = \min_{u\in S} w(u,v)\)`],
      ["c", "两者完全没有任何区别，Prim 树就是 Dijkstra 最短路径树"],
      ["d", "Prim 只能用于有向图，Dijkstra 只能用于无向图"]
    ], answer: ["a"], why: String.raw`Prim 的目标是最小化生成树所有边的总和，因此只关心把 \(v\) 接入当前子树 \(S\) 的那条最轻跨割边的权重 \(w(u,v)\)；而 Dijkstra 关心的是从源点 \(s\) 到 \(v\) 的累计路径距离 \(u.d + w(u,v)\)。` },
    { id: "q3", tag: "slide", kind: "single", q: String.raw`在按秩合并（Union by Rank）的并查集中，设总共有 \(n = 64\) 个元素（初始每个元素 rank 为 0）。任何一棵树根的最大可能 rank 是多少？如果某个根节点的 rank 为 4，它的子树中至少包含多少个节点？`, choices: [
      ["a", "最大可能 rank 为 6；rank 为 4 的根子树至少包含 16 个节点"],
      ["b", "最大可能 rank 为 63；rank 为 4 的根子树至少包含 4 个节点"],
      ["c", "最大可能 rank 为 4；rank 为 4 的根子树至少包含 8 个节点"],
      ["d", "最大可能 rank 为 32；rank 为 4 的根子树至少包含 16 个节点"]
    ], answer: ["a"], why: String.raw`由 Property 2，rank 为 \(k\) 的根节点子树至少包含 \(2^k\) 个节点，故 \(k=4\) 时至少有 \(2^4 = 16\) 个节点；由 \(2^k \le n = 64\) 得最大可能 rank 为 \(\log_2 64 = 6\)。` },
    { id: "q4", tag: "slide", kind: "single", q: String.raw`（Pre-lecture 电缆网络例）6 个城市 A–F，9 条电缆权重分别为：DE(1), AB(2), BE(3), AE(4), BC(5), CE(6), AD(7), CF(8), EF(9)。运行 Kruskal 算法求最小生成树，哪几条边会被选入 MST？MST 的总权重是多少？`, choices: [
      ["a", "选入 DE(1), AB(2), BE(3), BC(5), CF(8)，总权重为 19"],
      ["b", "选入 DE(1), AB(2), BE(3), AE(4), BC(5)，总权重为 15"],
      ["c", "选入 AD(7), AB(2), BC(5), CF(8), DE(1)，总权重为 23"],
      ["d", "选入 DE(1), AB(2), AE(4), CE(6), CF(8)，总权重为 21"]
    ], answer: ["a"], why: String.raw`按权重从小到大依次考察：① DE(1) 加入；② AB(2) 加入；③ BE(3) 加入（连接 {A,B} 与 {D,E}）；④ AE(4) 跳过（A 与 E 已通过 A-B-E 连通，会成环）；⑤ BC(5) 加入；⑥ CE(6) 跳过（C 与 E 已连通）；⑦ AD(7) 跳过（A 与 D 已连通）；⑧ CF(8) 加入（已有 5 条边，连接全部 6 个城市，算法结束）。总权重 \(= 1 + 2 + 3 + 5 + 8 = 19\)。` },
    { id: "q5", tag: "slide", kind: "single", q: String.raw`在 \(N\) 个对象上执行 \(M\) 次并查集操作（union / find），若分别使用 (1) Quick-Find、(2) 加权 Quick-Union（按大小/按秩合并，无路径压缩）、(3) 加权 Quick-Union + 路径压缩（WQUPC），最坏情况总时间复杂度分别为`, choices: [
      ["a", String.raw`(1) \(O(MN)\)；(2) \(O(N + M\log N)\)；(3) \(O((N + M)\log^* N)\)`],
      ["b", String.raw`(1) \(O(N + M)\)；(2) \(O(M\log N)\)；(3) \(O(M)\)`],
      ["c", String.raw`(1) \(O(M^2)\)；(2) \(O(MN)\)；(3) \(O(M\log N)\)`],
      ["d", String.raw`(1) \(O(MN)\)；(2) \(O((N+M)\log^* N)\)；(3) \(O(N + M\log N)\)`]
    ], answer: ["a"], why: String.raw`Quick-Find 每次 union 需扫描 \(N\) 个元素，总计 \(O(MN)\)；加权/按秩合并将树高限制在 \(\le \log_2 N\)，总计 \(O(N + M\log N)\)；加上路径压缩后降低到近线性的 \(O((N+M)\log^* N)\)。` }
  ],
  cards: [
    [String.raw`无向树的四条等价性质`, String.raw`① 连通且无环；② 连通且恰有 \(|V|-1\) 条边；③ 无环且恰有 \(|V|-1\) 条边；④ 任意两点间有唯一简单路径。`],
    [String.raw`切割引理（Cut Lemma）的完整叙述与证明核心`, String.raw`若 \(X\) 安全且切割 \(C\) 尊重 \(X\)（\(C\cap X=\emptyset\)），则横跨 \(C\) 的最轻边 \(e\) 满足 \(X\cup\{e\}\) 安全。证明：将 \(e\) 加入含 \(X\) 的 MST \(T_0\) 成环，环上必有另一跨 \(C\) 边 \(e_0\notin X\)，用 \(e\) 换掉 \(e_0\) 权重不增。`],
    [String.raw`Kruskal 与 Prim 算法的复杂度及适用场景`, String.raw`Kruskal：按边排序 + 并查集，\(O(E\log V)\)（适合稀疏图）；Prim：单树 + 最小堆，二叉堆 \(O((V+E)\log V)\)、Fib 堆 \(O(V\log V + E)\)。`],
    [String.raw`并查集按秩合并（Union by Rank）的三条核心性质`, String.raw`① \(\text{rank}(x) &lt; \text{rank}(\pi(x))\)；② 秩为 \(k\) 的根节点子树至少有 \(2^k\) 个节点；③ \(n\) 个元素中秩 \(k\) 节点至多 \(n/2^k\) 个，故最大树高 \(\le \lfloor\log_2 n\rfloor\)。`],
    [String.raw`什么是路径压缩（Path Compression）？\(\log^* 65536\) 等于多少？`, String.raw`在 <code>find(x)</code> 找到根 \(r\) 后，把路径上所有节点的父指针直接指向 \(r\)。\(\log^* 65536 = 4\)（因为 \(65536 = 2^{16} = 2^{2^{2^2}}\)），宇宙尺度内 \(\log^* n \le 5\)。`]
  ]
});
