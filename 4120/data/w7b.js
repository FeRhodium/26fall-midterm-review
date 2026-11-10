Review.add({
  id: "w7b", group: "lecture", n: 4,
  short: "W7B 强连通分量与 UCS",
  title: "Week 7B · 强连通分量（Kosaraju 算法）与一致代价搜索（UCS）",
  meta: "Week 7 Lectures 3–4 · Strongly Connected Components / Uniform Cost Search",
  sources: [
    { label: "SCC 2026 课件 PDF", href: "materials/w7/SCC_2026.pdf" },
    { label: "UCS 26 课件 PDF", href: "materials/w7/UCS_26.pdf" },
    { label: "Pre-lecture: SCC 讲义", href: "materials/w7/csc4120-scc-portable.md" },
    { label: "HW6 官方题目 PDF", href: "materials/hw/HW6.pdf" }
  ],
  html: String.raw`
<p class="lede">本讲解决有向图结构的两个核心问题：第一，如何用仅<b>两遍线性时间的 DFS（Kosaraju 算法）</b>将任意有向图分解为极大相互可达的强连通分量（SCC），并把原图坍缩为一张分量 DAG；第二，当边权不再是单位 1 时，如何将 BFS 推广为面向目标的<b>一致代价搜索（Uniform Cost Search, UCS）</b>。</p>

<h2>1. 强连通分量（SCC）与缩点图 \(G^{\text{SCC}}\)</h2>
<ul>
<li><b>强连通（Strongly Connected）与 SCC 定义</b>：在有向图 \(G=(V,E)\) 中，若两个顶点 \(u, v\) 满足既有路径 \(u \leadsto v\) 又有路径 \(v \leadsto u\)，则称它们相互可达（communicate）。<b>强连通分量（SCC）</b>是满足两两相互可达的<b>极大（maximal）</b>顶点子集 \(C \subseteq V\)。</li>
<li><b>等价划分</b>：相互可达关系是等价关系（自反、对称、传递），因此每个顶点恰属于唯一的一个 SCC，各 SCC 互不相交。</li>
<li><b>缩点图（Condensation Graph）\(G^{\text{SCC}}\) 必为 DAG</b>：将每个 SCC 收缩为一个超级节点，若原图中有边从 \(C\) 内某点指向 \(C'\) 内某点则连边 \(C \to C'\)。
  <ul>
  <li><b>为什么 \(G^{\text{SCC}}\) 绝不可能有环？</b>若 \(G^{\text{SCC}}\) 中有环 \(C_1 \to C_2 \to \dots \to C_1\)，则这些分量中的所有顶点都能互相到达，它们本应合并为同一个更大的 SCC，与每个 SCC 的<b>极大性（maximality）</b>矛盾！</li>
  <li>作为 DAG，\(G^{\text{SCC}}\) 必存在至少一个<b>源点分量（Source SCC，无入边）</b>和至少一个<b>汇点分量（Sink SCC，无出边）</b>。</li>
  </ul>
</li>
</ul>

<h2>2. DFS 完成时间在 SCC DAG 上的核心定理</h2>
<p>对任意有向图 \(G\) 运行任意一次完整的 DFS，定义每个强连通分量 \(C\) 的完成时间为该分量内部所有顶点完成时间的最大值：</p>
\[\text{post}(C) \triangleq \max_{v \in C} \text{post}(v) = \max_{v \in C} v.f\]
<ul>
<li><b>定理（课件 Slide 5–6，必考证明）</b>：若在缩点图 \(G^{\text{SCC}}\) 中存在有向边 \(C \to C'\)（其中 \(C \ne C'\)），则在<b>任何</b>一次 DFS 中，必定有：
\[\text{post}(C) &gt; \text{post}(C')\]
</li>
<li><b>分情况证明（利用白色路径定理）</b>：考察 \(C \cup C'\) 中第一个被 DFS 发现的顶点：
  <ol>
  <li><b>情形一：\(C\) 比 \(C'\) 先被访问</b>（即 \(C\) 中某点 \(x\) 是 \(C\cup C'\) 中最早变灰的点）。在 \(x\) 被发现的时刻 \(x.d\)，\(C\) 和 \(C'\) 中的所有其他顶点全都是白色的！因为 \(C\) 内部强连通且有边 \(C \to C'\)，所以从 \(x\) 到 \(C'\) 中的任意顶点都存在一条<b>全白路径</b>。由<b>白色路径定理</b>，\(C'\) 中的所有顶点都会成为 \(x\) 在 DFS 树中的后代，从而全都比 \(x\) 先完成（\(\forall y \in C',\ y.f &lt; x.f\)）。因此 \(\text{post}(C) \ge x.f &gt; \text{post}(C')\)。</li>
  <li><b>情形二：\(C'\) 比 \(C\) 先被访问</b>（即 \(C'\) 中某点 \(y\) 是 \(C\cup C'\) 中最早变灰的点）。因为 \(G^{\text{SCC}}\) 是 DAG，既然有 \(C \to C'\)，就<b>绝不可能有从 \(C'\) 回到 \(C\) 的路径</b>！因此从 \(y\) 出发的 DFS 根本无法到达 \(C\) 中的任何顶点。这意味着 \(C'\) 中的所有顶点在 \(C\) 中任何一个顶点被发现之前就已经全部搜索完毕变黑了！故 \(C\) 中所有顶点的完成时间都大于 \(C'\) 中所有顶点的完成时间，依然有 \(\text{post}(C) &gt; \text{post}(C')\)。\(\square\)</li>
  </ol>
</li>
<li><b>重要推论（Source SCC 定位定理）</b>：在任意 DFS 中，<b>全图完成时间最大（highest post time）的那个顶点 \(u_1\)，必定属于 \(G\) 的某一个 Source SCC</b>！如果把该 Source SCC 从图中删去得到 \(G'\)，在剩余顶点中完成时间最大的顶点 \(u_1'\) 又必定属于 \(G'\) 的某个 Source SCC。
  <ul>
  <li><i>易错警示</i>：这一定理只对每个 SCC 的<b>最大</b>完成时间 \(\max_{v\in C} v.f\) 成立，对最小完成时间不成立；同理，完成时间<b>最小</b>的单个顶点<b>不一定</b>位于 Sink SCC 中！</li>
  </ul>
</li>
</ul>

<h2>3. Kosaraju 算法：两遍 DFS 线性时间求全部 SCC</h2>
<ul>
<li><b>为什么我们需要从 Sink SCC 开始做 DFS 剥离？</b>
  <ul>
  <li>如果我们能找到<b>汇点分量（Sink SCC）</b>中的一个顶点 \(u\)，从 \(u\) 出发在原图 \(G\) 上跑一次 \(\text{DFS}(G, u)\)：因为 Sink SCC 没有任何向外指出的边，这次 DFS 会恰好访问完该 Sink SCC 的全部顶点，而且<b>绝不会泄漏到其他 SCC 去</b>！</li>
  <li>剥离掉这个 Sink SCC 后，剩下的图又有新的 Sink SCC，依次剥离即可求出所有 SCC。</li>
  </ul>
</li>
<li><b>如何不用 Oracle 找到 Sink SCC 里的点？——把所有边反向！</b>
  <ul>
  <li>构造反向图（转置图）\(G^T = (V, E^T)\)，其中 \(E^T = \{(v, u) : (u, v) \in E\}\)（翻转所有边耗时 \(O(V+E)\)）。</li>
  <li>原图 \(G\) 与反向图 \(G^T\) 拥有<b>完全相同的强连通分量</b>，但缩点 DAG 的边方向全部反转：<b>\(G^T\) 的 Source SCC 恰好就是原图 \(G\) 的 Sink SCC！</b></li>
  </ul>
</li>
<li><b>Kosaraju 算法（课件 Slide 9–11 两种等价流程，总复杂度 \(\Theta(V+E)\)）</b>：
  <ol>
  <li><b>写法一（先 \(G^T\) 再 \(G\)，按逆拓扑序从 Sink SCC 逐个剥离）</b>：
    <ul>
    <li><b>Step 1</b>：在反向图 \(G^T\) 上运行完整的 DFS，记录每个顶点的完成时间 \(\text{post}(v)\)。</li>
    <li><b>Step 2</b>：在原图 \(G\) 上运行 DFS，主循环按 Step 1 得到的 \(\text{post}(v)\) <b>从大到小（降序）</b>依次选择尚未访问的顶点作为每棵 DFS 树的根。每次从根搜出的一棵 DFS 树就恰好是一个完整的 SCC（按缩点图的 Sink \(\to\) Source 顺序产出）。</li>
    </ul>
  </li>
  <li><b>写法二（先 \(G\) 再 \(G^T\)，课件 Slide 11 “A reverse solution”，按拓扑序从 Source SCC 逐个剥离）</b>：
    <ul>
    <li><b>Step 1</b>：在原图 \(G\) 上运行完整的 DFS，记录每个顶点的完成时间 \(\text{post}(v)\)（此时 \(\text{post}\) 最大者在 \(G\) 的 Source SCC，即 \(G^T\) 的 Sink SCC）。</li>
    <li><b>Step 2</b>：在反向图 \(G^T\) 上按 Step 1 的 \(\text{post}(v)\) <b>从大到小</b>依次选未访问点跑 DFS。每次搜出的一棵树同样是一个完整的 SCC，且产出顺序恰好是 \(G^{\text{SCC}}\) 的正向拓扑序 \(\text{SCC}_1, \text{SCC}_2, \dots, \text{SCC}_k\)！</li>
    </ul>
  </li>
  </ol>
</li>
</ul>

<h2>4. 一致代价搜索（Uniform Cost Search, UCS）：面向目标的带权 BFS</h2>
<ul>
<li><b>动机与设定</b>：经典 BFS 求的是最少边数（单位边权）。当有向图边权 \(w(u,v) &gt; 0\) 为任意正实数，且我们只想求从起点 \(s\) 到<b>指定目标点 \(d\)（或 \(G\)）</b>的最短路时，UCS 将 BFS 的“节点队列”推广为“按路径总代价排序的候选路径集合 \(H\)”。</li>
<li><b>算法流程</b>：
  <ol>
  <li>维护候选路径优先队列 \(H\)（初始只含单点路径 \(\langle s \rangle\)，代价 0）与已扩展节点集合 \(E\)（expanded nodes，初始为空）。</li>
  <li>每一步从 \(H\) 中取出<b>当前总代价最小的路径 \(\pi^*\)</b>（设其末端叶子节点为 \(u\)）：
    <ul>
    <li>若 \(u\) 就是目标节点 \(d\)（等价于当前已完成的最优目标路径长 \(w^*\) 不大于 \(H\) 中所有候选路径的代价），则<b>算法立即终止并返回 \(\pi^*\)</b>！</li>
    <li>若 \(u \notin E\)，将 \(u\) 加入已扩展集 \(E\)，并把 \(\pi^*\) 向 \(u\) 的所有邻居 \(v\) 延伸得到的新路径 \(\pi^* \cdot v\)（代价为 \(w(\pi^*) + w(u,v)\)）加入 \(H\)。</li>
    </ul>
  </li>
  </ol>
</li>
<li><b>核心考点：为什么第一次看到（生成）目标节点 \(d\) 时不能立刻停止，而必须等目标路径作为 \(H\) 中最短路径被弹出时才能停止？</b>
  <ul>
  <li>在经典无权 BFS 中，第一次遇到 \(d\) 时跳数一定最小，可以立即停；但在带权图（UCS）中，先发现的一条到达 \(d\) 的路径可能边数少但权重大（如课件中先发现代价为 \(w^* = 12\) 的路径，后续通过更多小权边扩展出代价为 \(10\) 的路径）。只有当 \(H\) 中所有候选路径的代价都 \(\ge w^*\)（即通往 \(d\) 的最短路径成为 \(H\) 的队首被弹出）时，由于正边权不会让后缀变短，才能 100% 确定找到了最优解！</li>
  </ul>
</li>
<li><b>UCS 时间/空间复杂度（课件 Slide 12）</b>：设每个节点最多有 \(m\) 个邻居（分支因子），到目标的最短路长度为 \(l\)，图中最小边权为 \(e &gt; 0\)，则最优解之前最多走 \(\lfloor l/e \rfloor\) 步，复杂度上界为：
\[O\!\left(m^{1 + \lfloor l/e \rfloor}\right)\]
</li>
</ul>

<h2>考前清单</h2>
<ul>
<li>能够证明缩点图 \(G^{\text{SCC}}\) 必为 DAG（反证法：若有环则违反 SCC 极大性）。</li>
<li>能够用白色路径定理分两种情况证明 \(C \to C' \implies \text{post}(C) &gt; \text{post}(C')\)，并牢记“最大 post 必在 Source SCC，但最小 post 未必在 Sink SCC”。</li>
<li>熟练掌握 Kosaraju 两遍 DFS 的两个方向写法，以及 UCS 为什么必须等目标从优先队列弹出（而非刚入队）才能停止。</li>
</ul>
`,
  questions: [
    { id: "q1", tag: "slide", kind: "single", q: String.raw`对任意有向图 \(G\) 运行一次完整的 DFS，设 \(u_{\max}\) 是全图中完成时间（finishing / post time）最大的顶点，\(u_{\min}\) 是全图中完成时间最小的顶点。关于它们所属的强连通分量（SCC），下列说法正确的是`, choices: [
      ["a", String.raw`\(u_{\max}\) 必定属于某个 Source SCC，且 \(u_{\min}\) 必定属于某个 Sink SCC`],
      ["b", String.raw`\(u_{\max}\) 必定属于某个 Source SCC，但 \(u_{\min}\) 不一定属于 Sink SCC`],
      ["c", String.raw`\(u_{\max}\) 必定属于某个 Sink SCC，且 \(u_{\min}\) 必定属于某个 Source SCC`],
      ["d", String.raw`\(u_{\max}\) 和 \(u_{\min}\) 都不一定属于 Source 或 Sink SCC`]
    ], answer: ["b"], why: String.raw`由定理 \(C \to C' \implies \text{post}(C) &gt; \text{post}(C')\)，拥有全图最大完成时间的顶点必定位于没有任何入边的 Source SCC 中。但完成时间最小的顶点完全可能位于 Source SCC 内部（例如从 Source SCC 开始搜，遇到一条死胡同分支或自环先退栈），因此 \(u_{\min}\) 未必在 Sink SCC 中——这正是 Kosaraju 算法为什么要将图反向的原因！` },
    { id: "q2", tag: "slide", kind: "single", q: String.raw`在 Kosaraju 算法中，如果我们第一步先在<b>反向图 \(G^T\)</b> 上运行 DFS 计算各顶点的完成时间 \(\text{post}(v)\)，那么第二步在<b>原图 \(G\)</b> 上按 \(\text{post}(v)\) 从大到小依次选根运行 DFS 时，每次剥离出来的强连通分量依次是原图缩点 DAG \(G^{\text{SCC}}\) 的`, choices: [
      ["a", "Sink SCC（汇点分量，按逆拓扑序从底向上剥离）"],
      ["b", "Source SCC（源点分量，按拓扑序从顶向下剥离）"],
      ["c", "随机顺序的 SCC"],
      ["d", "顶点数最多的 SCC"]
    ], answer: ["a"], why: String.raw`第一步在 \(G^T\) 上 \(\text{post}\) 最大的顶点属于 \(G^T\) 的 Source SCC，而 \(G^T\) 的 Source SCC 恰为原图 \(G\) 的 Sink SCC！在原图 \(G\) 上从 Sink SCC 出发做 DFS 不会走出该分量，故每次恰好剥离出当前剩余图的 Sink SCC。` },
    { id: "q3", tag: "hw", kind: "single", q: String.raw`（HW6 Q2）给定有向图 \(G=(V,E)\)，我们要在 \(O(|V|+|E|)\) 时间内判断是否存在一个“母顶点（mother vertex）” \(v \in V\) 能够到达图中所有其他顶点。下列哪个线性时间算法是完全正确的？`, choices: [
      ["a", "对图做一次完整 DFS，设最后完成（finishes last）的顶点为 \(v\)；再从 \(v\) 出发跑一次 BFS/DFS，若能到达所有顶点则存在（即为 \(v\)），否则不存在"],
      ["b", "找图中出度最大的顶点 \(v\)，从 \(v\) 跑一次 BFS 检查是否可达所有点"],
      ["c", "对图做一次完整 DFS，若最终只有一棵 DFS 树则存在，若有多棵则不存在"],
      ["d", "对图做一次完整 DFS，取最先完成（finishes first）的顶点 \(v\) 检查是否可达所有点"]
    ], answer: ["a"], why: String.raw`若存在母顶点 \(u\)，则其所在的强连通分量 \(C(u)\) 必是缩点 DAG 的唯一 Source SCC。而一次完整 DFS 中最后完成的顶点 \(v\) 必定位于某个 Source SCC 中；既然 Source SCC 唯一，必有 \(v \in C(u)\)，故 \(v\) 也能到达全图所有点！只需从 \(v\) 再跑一次 BFS/DFS 验证即可，总时间 \(O(V+E)\)。` },
    { id: "q4", tag: "slide", kind: "single", q: String.raw`在一致代价搜索（Uniform Cost Search, UCS）寻找从 \(s\) 到目标 \(G\) 的最短路径时，假设每条边权 \(w(e) &gt; 0\)。算法应当在什么时刻安全终止并输出最优路径？`, choices: [
      ["a", "当目标节点 \(G\) 第一次作为某条被扩展路径的邻居被生成并放入候选集 \(H\) 时"],
      ["b", "当候选集 \(H\) 中当前总代价最小的路径被弹出，且该路径的末端叶子节点恰好是 \(G\)（等价于 \(H\) 中所有候选路径代价均 \(\ge w^*\)）时"],
      ["c", "当图中所有节点都已被扩展完毕（\(H\) 变为空集）时才可终止"],
      ["d", "当遇到第一条边数最少的到达 \(G\) 的路径时"]
    ], answer: ["b"], why: String.raw`第一次生成到达 \(G\) 的路径（如代价 12）时，\(H\) 中可能还有代价更小的前缀路径（如代价 6），继续扩展可能得到代价为 10 的更短路径。只有当以 \(G\) 结尾的路径作为 \(H\) 中代价最小者被弹出时，其余候选路径均 \(\ge w^*\)，正边权保证它们不可能再超越 \(w^*\)。` },
    { id: "q5", tag: "slide", kind: "single", q: String.raw`设每个节点最多有 \(m\) 个邻居，从起点到目标的最短路径代价为 \(l\)，图中最小边权为 \(e &gt; 0\)，则课件给出的一致代价搜索（UCS）最坏时间复杂度上界为`, choices: [
      ["a", String.raw`\(O(m^{1 + \lfloor l/e \rfloor})\)`],
      ["b", String.raw`\(O(m \cdot (l/e))\)`],
      ["c", String.raw`\(O(l \log m)\)`],
      ["d", String.raw`\(O(e^l)\)`]
    ], answer: ["a"], why: String.raw`每走一步路径代价至少增加 \(e\)，故代价不超过 \(l\) 的路径最多包含 \(\lfloor l/e \rfloor\) 条边，在分支因子为 \(m\) 的搜索树上最多扩展 \(O(m^{1 + \lfloor l/e \rfloor})\) 个状态。` }
  ],
  cards: [
    [String.raw`为什么有向图的强连通分量缩点图 \(G^{\text{SCC}}\) 一定是 DAG？`, String.raw`若 \(G^{\text{SCC}}\) 存在环，则环上所有 SCC 的顶点都能互相到达，应合并为同一个 SCC，违反 SCC 的极大性（maximality）。`],
    [String.raw`SCC 完成时间定理：若 \(C \to C'\)，\(\text{post}(C)\) 与 \(\text{post}(C')\) 有何关系？`, String.raw`定义 \(\text{post}(C) = \max_{v\in C} v.f\)，则恒有 \(\text{post}(C) &gt; \text{post}(C')\)；全图完成时间最大的顶点必属于某个 Source SCC。`],
    [String.raw`Kosaraju 算法（两遍 DFS 求 SCC）的步骤与时间复杂度`, String.raw`① 在反向图 \(G^T\) 上跑 DFS 算完成时间；② 在原图 \(G\) 上按完成时间降序依次选未访问点跑 DFS，每次剥离一个 Sink SCC。复杂度 \(\Theta(V+E)\)。`],
    [String.raw`如何在 \(O(V+E)\) 时间内判断有向图是否存在可达全图的母顶点（HW6 Q2）？`, String.raw`跑一次完整 DFS 找最后完成的顶点 \(v\)（必在 Source SCC 中），再从 \(v\) 跑一次 BFS/DFS 验证是否可达全部顶点。`],
    [String.raw`一致代价搜索（UCS）何时才能安全终止？复杂度是多少？`, String.raw`必须等通往目标 \(G\) 的路径作为候选集 \(H\) 中总代价最小者被弹出（即 \(H\) 中所有候选路径均 \(\ge w^*\)）时才能终止；复杂度 \(O(m^{1+\lfloor l/e\rfloor})\)。`]
  ]
});
