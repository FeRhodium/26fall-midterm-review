Review.add({
  id: "w8b", group: "lecture", n: 6,
  short: "W8B 双向搜索 / A* / 地标",
  title: "Week 8B · 目标导向最短路：双向 Dijkstra、势函数重赋权、A* 与地标（Landmarks）",
  meta: "Week 8 Lectures 3–4 · Bidirectional Search / Potentials / A* / Landmarks",
  sources: [
    { label: "Dijkstra Extensions & A* Short PDF", href: "materials/w8/Dijkstra_extensions_Astar_2026_short.pdf" },
    { label: "A* 2026 课件 PDF", href: "materials/w8/Astar_2026.pdf" },
    { label: "MIT 6.006 Shortest Paths Notes PDF", href: "materials/w8/notes_on_shortest_paths.pdf" },
    { label: "交互单步器：A* 与势函数重赋权", href: "materials/w8/astar-line-stepper.html" }
  ],
  html: String.raw`
<p class="lede">标准 Dijkstra 算法以源点 \(s\) 为圆心向四面八方均匀扩散，如果我只关心从 \(s\) 到<b>单一终点 \(t\)</b> 的最短路径，一半以上甚至绝大部分搜索工作都浪费在远离 \(t\) 的方向上。本讲介绍两大加速范式：第一，从 \(s\) 和 \(t\) 同时相向搜索的<b>双向 Dijkstra（Bi-directional Search）</b>；第二，引入估计未来代价的启发式势函数 \(h(v)\) 的 <b>A* 算法</b>，并严格证明<b>一致性 A* 完全等价于在重赋权 \(w'(u,v)=w(u,v)+h(v)-h(u)\) 上运行标准 Dijkstra</b>，最后给出一般图上构造一致势函数的<b>地标法（Landmarks，HW7 Q7 必考）</b>。</p>

<h2>1. 双向 Dijkstra 搜索（Bi-directional Search）</h2>
<ul>
<li><b>为什么能把搜索空间从 \(n\) 降到 \(2\sqrt{n}\)？</b>
  <ul>
  <li>在分支因子为 \(b\)、\(s\) 到 \(t\) 距离为 \(d\) 的均匀图上，单向 Dijkstra 直到提取 \(t\) 需要探索半径为 \(d\) 的大圆，包含约 \(n = b^d\) 个节点。</li>
  <li>若同时从 \(s\) 正向、从 \(t\) 反向各搜索半径 \(d/2\) 的小圆，两侧探索的节点总数仅为 \(n_{\text{BD}} = 2 b^{d/2} = 2\sqrt{b^d} = 2\sqrt{n} = O(\sqrt{n})\)！</li>
  </ul>
</li>
<li><b>算法流程（课件 Slide 5–7 &amp; MIT 讲义）</b>：
  <ol>
  <li><b>正向搜索</b>：在原图 \(G\) 上从 \(s\) 运行 Dijkstra，维护已决集 \(S_s\) 与正向距离估计 \(v.s\)（或 \(d_f[v]\)）。</li>
  <li><b>反向搜索</b>：在反向图 \(G^T\)（所有边反向）上从 \(t\) 运行 Dijkstra，维护已决集 \(S_t\) 与反向距离估计 \(v.t\)（或 \(d_b[v]\)）。</li>
  <li><b>终止条件（何时停止搜索循环？）</b>：当<b>存在某个节点 \(u\) 同时被加入正向已决集 \(S_s\) 和反向已决集 \(S_t\)</b>（即 \(u \in S_s \cap S_t\)，在两侧都被 Extract-Min 弹出）时，立即停止交替搜索循环！</li>
  <li><b>核心易错点（如何从停止状态读出真正的最短路径？）</b>：
    <ul>
    <li><b>那个使搜索停止的相交节点 \(u\) 本身不一定是 \(s \to t\) 最短路径上的节点！</b>（即 \(\delta(s, t)\) <b>不一定等于</b> \(u.s + u.t\)！）</li>
    <li><i>课件反例（Slide 6–8）</i>：设 \(s \to u(3), u \to t(3)\)（经过 \(u\) 总长 6），同时有 \(s \to u'(2), u' \to w(1), w \to t(2)\)（经过 \(u'\to w\) 总长 5）。正向先入 \(S_s=\{s, u'(2), u(3)\}\)，反向先入 \(S_t=\{t, w(2), u(3)\}\)——第一个同时进入 \(S_s \cap S_t\) 的点是 \(u\)（\(u.s+u.t = 6\)），但真正的最短路经过边 \((u', w)\)，其长度为 \(5\)（因为 \(u' \in S_s\) 时已松弛了边 \((u', w)\)，使得 \(w.s = 2+1 = 3\)，故 \(w.s + w.t = 3 + 2 = 5\)）！</li>
    <li><b>正确公式</b>：停止后，必须检查所有已获估计值的节点，取 \(x.s + x.t\) 的最小值：
    \[\delta(s, t) = \min_{x \in V} \bigl(x.s + x.t\bigr) \quad \text{（等价于在 } S_s \cup S_t \text{ 中取最小）}\]
    </li>
    </ul>
  </li>
  </ol>
</li>
<li><b>为什么停止时最优路径一定已经被拼接出来了？（MIT 讲义 Lemma B）</b>
  <ul>
  <li>设真实最短路为 \(p = \langle u_1=s, u_2, \dots, u_n=t \rangle\)，设 \(u_f\) 是 \(p\) 上已进入 \(S_s\) 的最远点，\(u_b\) 是 \(p\) 上已进入 \(S_t\) 的最远点。利用 \(\delta(s, u_f) + w(u_f, u_{f+1}) \ge \delta(s, u)\) 与 \(w(u_{b-1}, u_b) + \delta(u_b, t) \ge \delta(u, t)\) 相加，可证当 \(u \in S_s \cap S_t\) 时必有 <b>\(u_f = u_b\) 或 \(u_f = u_{b-1}\)</b>！若 \(u_f = u_b\)，则 \(u_f.s + u_f.t = \delta(s, t)\)；若 \(u_f = u_{b-1}\)，因为 \(u_f \in S_s\) 被弹出时已经松弛了出边 \((u_f, u_b)\)，使得 \(u_b.s = \delta(s, u_b)\)，故在节点 \(u_b\) 处必有 \(u_b.s + u_b.t = \delta(s, u_b) + \delta(u_b, t) = \delta(s, t)\)。</li>
  </ul>
</li>
</ul>

<h2>2. A* 算法：可采纳性（Admissible）与一致性（Consistent）</h2>
<ul>
<li><b>A* 的核心机制</b>：对每个节点 \(v\) 引入一个启发式势函数 \(h(v)\) 来估计从 \(v\) 到目标 \(t\) 的剩余距离 \(\delta(v, t)\)（规定 \(h(t) = 0\)）。
  <ul>
  <li>记 \(g(v)\)（即 \(v.d\)）为当前发现的从 \(s\) 到 \(v\) 的最短路径代价（past cost）。</li>
  <li>定义优先队列的键值（评估函数）为 <b>\(f(v) = g(v) + h(v)\)</b>（经过 \(v\) 从 \(s\) 到 \(t\) 的估计总代价）。</li>
  <li>每次从开集 \(Q\) 中取出 <b>\(f(u) = g(u) + h(u)\) 最小</b>的节点 \(u\) 加入闭集 \(S\)，并按 \(g\) 松弛 \(u\) 的所有出边 \((u, v)\)：若 \(g(u) + w(u,v) &lt; g(v)\)，则更新 \(g(v) = g(u) + w(u,v)\)，且<b>若 \(v\) 此前已在闭集 \(S\) 中，将其重新放回开集 \(Q\)</b>。当目标 \(t\) 被选入闭集 \(S\) 时算法立即终止！</li>
  </ul>
</li>
<li><b>如果随便选一个 \(h(v)\) 会出什么问题？（课件 Slide 11 反例）</b>
  <ul>
  <li>设边为 \(s\to u(1), u\to t(1)\)（最短路长 2）以及 \(s\to v(2), v\to t(1)\)（长 3）。若取 \(h(s)=4, h(u)=3, h(v)=1, h(t)=0\)：从 \(s\) 松弛后 \(g(u)=1 \implies f(u)=1+3=4\)，而 \(g(v)=2 \implies f(v)=2+1=3\)。A* 会先选 \(v\)（\(f=3\)），松弛得 \(g(t)=3, f(t)=3+0=3\)，下一步直接把 \(t\)（\(f=3 &lt; f(u)=4\)）选入 \(S\) 并终止，输出错误路径长 \(3 \ne 2\)！</li>
  <li><b>出错原因</b>：\(h(u) = 3 &gt; \delta(u, t) = 1\)，高估了 \(u\) 到 \(t\) 的真实距离，把正确的最短路节点 \(u\) “吓退”了！</li>
  </ul>
</li>
</ul>

<h3>2.1 两大核心性质：Admissible vs Consistent（必背定义与证明）</h3>
<table>
<thead><tr><th>性质名称</th><th>数学定义</th><th>保证的算法性质</th></tr></thead>
<tbody>
<tr><td><b>可采纳性（Admissible）</b></td><td>对所有顶点 \(v \in V\)：<br>\[h(v) \le \delta(v, t)\]<br>（绝不高估到目标 \(t\) 的真实剩余代价）</td><td><b>保证最优性（Correctness）</b>：当目标 \(t\) 第一次从 \(Q\) 被选入 \(S\) 时，必有 \(g(t) = \delta(s, t)\)（找到的一定是最短路）。<br><i>局限</i>：闭集 \(S\) 中的普通节点 \(v\) 初次入 \(S\) 时未必有 \(g(v)=\delta(s,v)\)，可能被后续更短路径唤醒并<b>反复从 \(S\) 退回 \(Q\)</b>，无步数上界保证。</td></tr>
<tr><td><b>一致性 / 可行性（Consistent / Feasible）</b></td><td>\(h(t) = 0\)，且对所有边 \((u, v) \in E\)：<br>\[w'(u, v) \triangleq w(u, v) + h(v) - h(u) \ge 0\]<br>等价于三角不等式：\(h(u) \le w(u, v) + h(v)\)</td><td><b>既保证最优性，又保证像标准 Dijkstra 一样高效</b>：<br>① <b>一致性 \(\implies\) 可采纳性</b>（沿 \(v\to t\) 最短路累加 \(h(u)-h(v) \le w(u,v)\) 得 \(h(v)-h(t) \le \delta(v,t)\)）；<br>② <b>已入 \(S\) 的节点永不退回 \(Q\)</b>（每个节点至多入 \(S\) 一次，完全等价于在非负新边权 \(w'\) 上跑标准 Dijkstra）。</td></tr>
</tbody>
</table>

<ul>
<li><b>为什么 Admissible 就能保证 \(t\) 入 \(S\) 时必为最短路？（课件 Slide 13 反证法）</b>
  <ul>
  <li>假设 \(t\) 沿着一条次优长路被选入 \(S\)，此时 \(g(t) = W &gt; \delta(s, t)\)，且 \(f(t) = g(t) + h(t) = W + 0 = W\)。</li>
  <li>因为真实最短路 \(p^*\) 尚未走完，考察 \(p^*\) 上第一个仍在开集 \(Q\) 中的节点 \(z\)（其前驱已在 \(S\) 中且已取得真实最短距离，故 \(z\) 已被松弛到 \(g(z) = \delta(s, z)\)）。</li>
  <li>由可采纳性 \(h(z) \le \delta(z, t)\)，节点 \(z\) 在 \(Q\) 中的优先级键值为：
  \[f(z) = g(z) + h(z) \le \delta(s, z) + \delta(z, t) = \delta(s, t) &lt; W = f(t)\]
  既然 \(f(z) &lt; f(t)\)，优先队列必定会<b>先提取 \(z\) 而不是提取 \(t\)</b>——矛盾！\(\square\)</li>
  </ul>
</li>
</ul>

<h2>3. 势函数重赋权定理：一致性 A* 等价于 \(w'\) 上的 Dijkstra</h2>
<ul>
<li><b>重赋权（Modified Edge Weights）</b>：给定势函数 \(h: V \to \mathbb{R}\)，定义新边权：
\[w'(u, v) = w(u, v) + h(v) - h(u)\]
</li>
<li><b>望远镜求和性质（Telescoping Sum，课件 Slide 15）</b>：对于从任意起点 \(a = u_1\) 到任意终点 \(b = u_n\) 的任意路径 \(p = \langle u_1, u_2, \dots, u_n \rangle\)，其在 \(w'\) 下的总权重为：
\[w'(p) = \sum_{i=1}^{n-1} \bigl[w(u_i, u_{i+1}) + h(u_{i+1}) - h(u_i)\bigr] = \sum_{i=1}^{n-1} w(u_i, u_{i+1}) + h(b) - h(a) = w(p) + h(b) - h(a)\]
<b>推论</b>：因为固定端点 \(a, b\) 后，所有 \(a \leadsto b\) 路径的权重都只是统一平移了一个常数 \(h(b) - h(a)\)，所以<b>在 \(w\) 与 \(w'\) 下，任意两点间的最短路径集合以及从 \(s\) 出发的最短路径树（SPT）完全相同</b>！</li>
<li><b>等价性定理（课件 Slide 17–18）</b>：当 \(h\) 一致（即 \(w'(u,v) \ge 0\)）时，在重赋权图 \(w'\) 上运行标准 Dijkstra 算法，与在原图 \(w\) 上以 \(h\) 运行 A* 算法，<b>每一步从 \(Q\) 中选入 \(S\) 的节点序列完全一模一样</b>！
  <ul>
  <li><i>证明</i>：假设在当前时刻两者的闭集 \(S\) 相同。对任意 \(b \in Q\)，设从 \(s\) 经 \(S\) 到 \(b\) 的当前最优路径权重为 \(g(b)\)，则在 \(w'\) 下 Dijkstra 的距离估计为：
  \[g'(b) = g(b) + h(b) - h(s) = f(b) - h(s)\]
  因为 \(-h(s)\) 对所有 \(b \in Q\) 是同一个常数，所以<b>最小化 \(g'(b)\) 与最小化 \(f(b) = g(b) + h(b)\) 选出的是完全相同的节点</b>！由于 \(h(v)\) 随着靠近 \(t\) 而减小，朝向 \(t\) 的边满足 \(h(v)-h(u) &lt; 0\)（\(w'\) 变短，在直线单步器例中甚至变为 0），背离 \(t\) 的边 \(w'\) 变长，从而把目标 \(t\) 在 \(w'\)-SPT 中“拉近”到了源点 \(s\) 身边！</li>
  </ul>
</li>
</ul>

<h2>4. 如何构造一致的势函数 \(h\)：欧氏距离与地标法（Landmarks，HW7 Q7）</h2>
<ol>
<li><b>几何地图（Euclidean Graphs）</b>：节点是地图上的坐标，边权 \(w(u,v)\) 是实际道路长度，取 \(h(u) = d(u, t)\)（\(u\) 到 \(t\) 的直线欧氏距离）。因为道路长度 \(\ge\) 直线距离且直线距离满足几何三角不等式，有 \(w(u,v) \ge d(u,v) \ge d(u,t) - d(v,t) = h(u) - h(v)\)，即 \(w(u,v) + h(v) - h(u) \ge 0\)，天然满足一致性与可采纳性！</li>
<li><b>一般有向图上的地标法（Landmarks，课件 Slide 21–23 &amp; HW7 Q7 必背证明）</b>：
  <ul>
  <li><b>预处理</b>：预先在图中挑选一小批节点 \(L \subset V\) 作为“地标（landmarks）”。对每个地标 \(\ell \in L\)，分别在原图 \(G\) 和反向图 \(G^T\) 上各跑一次 Dijkstra，预算出所有节点 \(u\) 到 \(\ell\) 的最短距离 \(\delta(u, \ell)\) 以及从 \(\ell\) 到 \(u\) 的最短距离 \(\delta(\ell, u)\)。</li>
  <li><b>单地标势函数定义</b>：对目标 \(t\) 与单个地标 \(\ell\)，由最短路三角不等式：
    <ul>
    <li>\(\delta(u, t) + \delta(t, \ell) \ge \delta(u, \ell) \implies \delta(u, t) \ge \delta(u, \ell) - \delta(t, \ell)\)</li>
    <li>\(\delta(\ell, u) + \delta(u, t) \ge \delta(\ell, t) \implies \delta(u, t) \ge \delta(\ell, t) - \delta(\ell, u)\)</li>
    </ul>
    因此定义单地标下界：
    \[h_\ell(u) \triangleq \max\bigl\{\delta(u, \ell) - \delta(t, \ell),\ \delta(\ell, t) - \delta(\ell, u)\bigr\}\]
    显然 \(h_\ell(t) = 0\) 且 \(h_\ell(u) \le \delta(u, t)\)（可采纳）。</li>
  <li><b>证明单地标 \(h_\ell\) 的一致性（HW7 Q7 第一部分）</b>：需证对任意边 \((u, v) \in E\) 有 \(h_\ell(u) \le w(u, v) + h_\ell(v)\)：
    <ul>
    <li>对第一项：由三角不等式 \(\delta(u, \ell) \le w(u, v) + \delta(v, \ell)\)，两边减去 \(\delta(t, \ell)\) 得：
    \[\delta(u, \ell) - \delta(t, \ell) \le w(u, v) + \bigl(\delta(v, \ell) - \delta(t, \ell)\bigr) \le w(u, v) + h_\ell(v)\]</li>
    <li>对第二项：由三角不等式 \(\delta(\ell, v) \le \delta(\ell, u) + w(u, v)\) 移项得 \(-\delta(\ell, u) \le w(u, v) - \delta(\ell, v)\)，两边加上 \(\delta(\ell, t)\) 得：
    \[\delta(\ell, t) - \delta(\ell, u) \le w(u, v) + \bigl(\delta(\ell, t) - \delta(\ell, v)\bigr) \le w(u, v) + h_\ell(v)\]</li>
    <li>两项都不超过 \(w(u, v) + h_\ell(v)\)，故它们的最大值 \(h_\ell(u) \le w(u, v) + h_\ell(v)\)，即 \(w(u,v) + h_\ell(v) - h_\ell(u) \ge 0\)！</li>
    </ul>
  </li>
  <li><b>证明多地标组合 \(h_t(u) = \max_{\ell \in L} h_\ell(u)\) 的一致性（HW7 Q7 第二部分）</b>：因为每个 \(h_\ell\) 都满足 \(h_\ell(u) \le w(u, v) + h_\ell(v)\)，两边对 \(\ell \in L\) 取最大值：
  \[h_t(u) = \max_{\ell \in L} h_\ell(u) \le \max_{\ell \in L} \bigl(w(u, v) + h_\ell(v)\bigr) = w(u, v) + \max_{\ell \in L} h_\ell(v) = w(u, v) + h_t(v)\]
  且 \(h_t(t) = \max_{\ell} 0 = 0\)。故多个一致势函数的逐点最大值仍然是一致（且更紧）的势函数！\(\square\)</li>
  <li><b>何时地标下界取到精确等号 \(h_\ell(u) = \delta(u, t)\)？</b>当 \(u\) 位于从地标 \(\ell\) 到 \(t\) 的最短路径 \(\text{SP}(\ell, t)\) 上（此时第二项取等号），或者 \(t\) 位于从 \(u\) 到地标 \(\ell\) 的最短路径 \(\text{SP}(u, \ell)\) 上（此时第一项取等号）时，下界紧致！</li>
  </ul>
</li>
</ol>

<h2>考前清单</h2>
<ul>
<li>牢记双向 Dijkstra 的终止条件（某点 \(u \in S_s \cap S_t\)）与最短路计算公式 \(\min_{x}(x.s + x.t)\)（切勿直接写 \(u.s + u.t\)！）。</li>
<li>准确区分 A* 的 Admissible（\(h(v)\le\delta(v,t)\)，保证终点正确但节点可能从 \(S\) 重入 \(Q\)）与 Consistent（\(w(u,v)+h(v)-h(u)\ge 0\)，节点永不重入 \(Q\)，等价于 \(w'\) 上的 Dijkstra）。</li>
<li>能够完整默写 HW7 Q7 地标势函数（单地标 + 多地标最大值）的一致性证明。</li>
</ul>
`,
  questions: [
    { id: "q1", tag: "slide", kind: "single", q: String.raw`在非负权图上运行双向 Dijkstra 搜索从 \(s\) 到 \(t\) 的最短路径，当某个顶点 \(u\) 第一次同时进入正向已决集 \(S_s\) 和反向已决集 \(S_t\) 时停止搜索。此时从 \(s\) 到 \(t\) 的真实最短距离 \(\delta(s, t)\) 等于`, choices: [
      ["a", String.raw`一定等于 \(u.s + u.t\)`],
      ["b", String.raw`\(\min_{x \in V} (x.s + x.t)\)（即在所有已探索节点上取正向估计与反向估计之和的最小值，不一定在 \(u\) 处取到）`],
      ["c", String.raw`\(\max_{x \in S_s \cap S_t} (x.s + x.t)\)`],
      ["d", String.raw`\(u.s + u.t\) 的一半`]
    ], answer: ["b"], why: String.raw`首个同时进入 \(S_s \cap S_t\) 的节点 \(u\) 只是给出了停止信号，真正的最短路可能通过一条连接 \(S_s\) 与 \(S_t\) 的跨界边 \((u', w)\) 获得更小的总长，因此必须取 \(\min_{x} (x.s + x.t)\)。` },
    { id: "q2", tag: "slide", kind: "multi", q: String.raw`关于 A* 搜索中的启发式函数 \(h(v)\)（假设 \(h(t)=0\)，边权非负），下列哪些说法是正确的？`, choices: [
      ["a", String.raw`若 \(h\) 是可采纳的（Admissible，即 \(\forall v,\ h(v) \le \delta(v, t)\)），则当目标 \(t\) 被选入闭集 \(S\) 时一定找到了最短路径`],
      ["b", String.raw`仅满足可采纳性（Admissible）就能保证闭集 \(S\) 中的节点永远不会被重新放回开集 \(Q\)`],
      ["c", String.raw`若 \(h\) 是一致的（Consistent，即 \(\forall (u,v)\in E,\ w(u,v) + h(v) - h(u) \ge 0\)），则 \(h\) 一定也是可采纳的`],
      ["d", String.raw`当 \(h\) 一致时，A* 算法挑选节点进入 \(S\) 的顺序与在重赋权 \(w'(u,v) = w(u,v) + h(v) - h(u)\) 上运行标准 Dijkstra 算法完全相同`],
      ["e", String.raw`重赋权 \(w'(u,v) = w(u,v) + h(v) - h(u)\) 会改变从 \(s\) 到 \(t\) 的最短路径形状`]
    ], answer: ["a", "c", "d"], why: String.raw`(b) 错：仅 Admissible 不保证单调，节点可能从 \(S\) 退回 \(Q\)，需 Consistent 才能保证不退回；(e) 错：由望远镜求和，任意 \(s\leadsto t\) 路径的新权重 \(w'(p) = w(p) + h(t) - h(s)\)，只相差固定常数，故最短路径与 SPT 形状完全不变！` },
    { id: "q3", tag: "slide", kind: "single", q: String.raw`（Pre-lecture 直线单步器例）在 9 个节点的无向直线图 \(-4, -3, -2, -1, s, 1, 2, 3, A\)（相邻边权均为 1，源点 \(s=0\)，目标 \(A=4\)）上，取一致势函数 \(h(v)\) 为节点 \(v\) 到目标 \(A\) 的真实距离（如 \(h(s)=4, h(1)=3, h(-1)=5\)）。在新边权 \(w'(u \to v) = w(u \to v) + h(v) - h(u)\) 下，所有朝向 \(A\)（向右）的边和所有背离 \(A\)（向左）的边的新权重分别为`, choices: [
      ["a", "向右的边权重全为 0，向左的边权重全为 2"],
      ["b", "向右的边权重全为 1，向左的边权重全为 1"],
      ["c", "向右的边权重全为 −1，向左的边权重全为 1"],
      ["d", "向右的边权重全为 2，向左的边权重全为 0"]
    ], answer: ["a"], why: String.raw`向右走一步离 \(A\) 近 1，\(h(v) - h(u) = -1\)，故 \(w'(u\to v) = 1 + (-1) = 0\)；向左走一步离 \(A\) 远 1，\(h(v) - h(u) = +1\)，故 \(w'(u\to v) = 1 + 1 = 2\)。因此在新权重下 \(s,1,2,3,A\) 距离全为 0，被最先依次提取！` },
    { id: "q4", tag: "hw", kind: "single", q: String.raw`（HW7 Q7 &amp; 课件 Slide 22）在一般有向图中，对地标（landmark）\(\ell \in L\) 与目标 \(t\) 定义的单地标势函数 \(h_\ell(u)\) 表达式为`, choices: [
      ["a", String.raw`\(h_\ell(u) = \max\bigl\{\delta(u, \ell) - \delta(t, \ell),\ \delta(\ell, t) - \delta(\ell, u)\bigr\}\)`],
      ["b", String.raw`\(h_\ell(u) = \delta(u, \ell) + \delta(\ell, t)\)`],
      ["c", String.raw`\(h_\ell(u) = \min\bigl\{\delta(u, \ell),\ \delta(\ell, t)\bigr\}\)`],
      ["d", String.raw`\(h_\ell(u) = |\delta(u, \ell) - \delta(\ell, t)|\)`]
    ], answer: ["a"], why: String.raw`注意有向图中距离不对称！由 \(\delta(u,t)+\delta(t,\ell)\ge\delta(u,\ell)\) 与 \(\delta(\ell,u)+\delta(u,t)\ge\delta(\ell,t)\) 分别得到两个下界，取较大者即为 \(h_\ell(u)\)。（若写成 \(\delta(u,\ell)+\delta(\ell,t)\) 则是上界而非下界，不可采纳！）` },
    { id: "q5", tag: "slide", kind: "single", q: String.raw`在地标势函数 \(h_\ell(u) = \max\{\delta(u,\ell)-\delta(t,\ell),\ \delta(\ell,t)-\delta(\ell,u)\}\) 中，地标 \(\ell\) 在什么条件下能使下界达到完全紧致（即 \(h_\ell(u) = \delta(u, t)\)）？`, choices: [
      ["a", String.raw`当 \(u\) 位于从 \(\ell\) 到 \(t\) 的某条最短路径 \(\text{SP}(\ell, t)\) 上，或者 \(t\) 位于从 \(u\) 到 \(\ell\) 的某条最短路径 \(\text{SP}(u, \ell)\) 上时`],
      ["b", String.raw`当 \(\ell\) 位于从 \(u\) 到 \(t\) 的最短路径 \(\text{SP}(u, t)\) 中间时`],
      ["c", String.raw`只有当 \(\ell = u\) 时`],
      ["d", String.raw`对任意地标 \(\ell\) 都恒有 \(h_\ell(u) = \delta(u, t)\)`]
    ], answer: ["a"], why: String.raw`若 \(u \in \text{SP}(\ell, t)\)，则 \(\delta(\ell, t) = \delta(\ell, u) + \delta(u, t) \implies \delta(\ell, t) - \delta(\ell, u) = \delta(u, t)\)；若 \(t \in \text{SP}(u, \ell)\)，则 \(\delta(u, \ell) = \delta(u, t) + \delta(t, \ell) \implies \delta(u, \ell) - \delta(t, \ell) = \delta(u, t)\)。因此好地标应位于源点“身后”或终点“更远处”，而不是源点与终点之间！` }
  ],
  cards: [
    [String.raw`双向 Dijkstra 的终止条件与最短路径长度计算公式`, String.raw`终止条件：存在节点 \(u\) 同时进入 \(S_s \cap S_t\)（两侧均被弹出）；最短距离：\(\delta(s,t) = \min_{x\in V}(x.s + x.t)\)（未必等于 \(u.s + u.t\)！）。`],
    [String.raw`A* 算法中 Admissible（可采纳）与 Consistent（一致）的定义与区别`, String.raw`Admissible：\(\forall v,\ h(v)\le\delta(v,t)\)（保证终点入 \(S\) 时最优，但节点可重入 \(Q\)）；Consistent：\(\forall (u,v),\ w(u,v)+h(v)-h(u)\ge 0\)（蕴含 Admissible，且节点永不重入 \(Q\)）。`],
    [String.raw`为什么重赋权 \(w'(u,v) = w(u,v) + h(v) - h(u)\) 不改变最短路径？`, String.raw`任意 \(a\leadsto b\) 路径 \(p\) 的新权重望远镜求和为 \(w'(p) = w(p) + h(b) - h(a)\)，只相差仅依赖端点的常数，故最短路径树不变。`],
    [String.raw`一般有向图上的地标势函数（Landmarks）公式及其紧致条件`, String.raw`\(h_t(u) = \max_{\ell\in L}\max\{\delta(u,\ell)-\delta(t,\ell),\ \delta(\ell,t)-\delta(\ell,u)\}\)；当 \(u\in\text{SP}(\ell,t)\) 或 \(t\in\text{SP}(u,\ell)\) 时取等号 \(h_\ell(u)=\delta(u,t)\)。`]
  ]
});
