Review.setup({
  key: "csc4120-m2-v1",
  code: "CSC4120",
  name: "算法设计与分析（Midterm 2）",
  other: [
    { href: "../4010/", label: "CSC4010" },
    { href: "../3150/", label: "CSC3150" }
  ],
  exam: {
    start: "2026-11-20T18:00:00+08:00",
    when: "11 月 20 日（周五）18:00–20:00 闭卷笔试",
    where: "TC 407 · 座位 60",
    badge: "Midterm 2 <b>25%</b> · 11/20 18:00 @ <b>TC 407 座位 60</b> · 闭卷（可带非编程计算器）"
  },
  sheetKicker: "闭卷考试（仅允许非编程计算器，需带学生证与 2B 铅笔）· 考前把这页所有公式、不变式与证明框架默写一遍",
  groups: [
    { id: "lecture", label: "课程讲义 · Week 6 – Week 9", note: "严格对应 11 月 9 日公告划定的 Midterm 2 范围（Week 6 至 Week 9 全部课件与 Pre-lecture 互动讲义）：摊还分析、概率哈希与布隆过滤器、BFS/DFS/拓扑排序/强连通分量/UCS、Bellman-Ford/Dijkstra/双向搜索/A*/Landmarks、Huffman/集合覆盖/MST/并查集。" },
    { id: "hw", label: "作业与样卷 · HW5–HW7 & 2021 样卷", note: "HW5（摊还分析与哈希概率）、HW6（BFS/DFS、欧拉回路、2-SAT）、HW7（负权 Dijkstra、重入队 Dijkstra、Bellman-Ford、最大乘积最短路、地标势函数一致性、SPT 线性检验）精讲，以及 2021 样卷中属于 Midterm 2 范围的真题与全真模拟卷。" }
  ],
  tags: { slide: "课件", hw: "作业", sample: "样卷", practice: "模拟" },
  home: String.raw`
<p class="kicker">CSC4120 Design and Analysis of Algorithms · Fall 2026 · Prof. Costas Courcoubetis</p>
<h1>Midterm 2 复习站</h1>
<div class="facts">
  <div class="card"><dl>
    <dt>考试时间与考场</dt><dd>2026 年 11 月 20 日（周五）<b>18:00–20:00</b>，考场：<b>TC 407，座位号 60</b>（学号 <code>124090066</code>，陈治衡；核对自 <a href="materials/midterm2/seat_plan_midterm_2.xlsx" target="_blank" rel="noopener"><code>seat_plan_midterm_2.xlsx</code></a> Sheet 1）。</dd>
    <dt>考试形式与计分</dt><dd><b>闭卷笔试</b>（占总评 25%，但单场卷面得分低于 20% 则该场记 0 分）。可携带<b>非编程计算器</b>，禁止携带任何纸质小抄或电子设备；请带齐<b>学生证</b>与 <b>2B 铅笔</b>（涂选择题答题卡）。题型与 Midterm 1 及 <a href="materials/midterm2/Midterm_2021_solution.pdf" target="_blank" rel="noopener">2021 样卷</a>相同（推导证明题 + 多选题对一选 +4/错一选 −4 最低 0 分 + 12 道两行理由判断题 + 算法设计与追踪大题）。</dd>
    <dt>考查范围（11 月 9 日公告）</dt><dd><b>Week 6 至 Week 9（含）</b>：Week 6（摊还分析、浓度不等式、Balls &amp; Bins、静态完美哈希、布隆过滤器）、Week 7（图表示、BFS、DFS、白色路径定理、环检测、拓扑排序、强连通分量 Kosaraju、一致代价搜索 UCS）、Week 8（最短路基础、DAG 最短路、Bellman-Ford、Dijkstra、桶队列 Dial 算法、双向 Dijkstra、势函数重赋权、A* 与地标 Landmarks）、Week 9（Huffman 编码与信息熵、最小集合覆盖 \(\ln n\) 近似、最小生成树切割引理、Kruskal、Prim、并查集 Union-Find）。</dd>
    <dt>官方交互可视化</dt><dd>课程发布了 5 个单步可视化页面，已全部镜像至本地：<a href="materials/w8/shortest-paths-stepper.html" target="_blank" rel="noopener">Bellman-Ford &amp; Dijkstra 单步器</a> · <a href="materials/w8/astar-line-stepper.html" target="_blank" rel="noopener">A* 与重赋权单步器</a> · <a href="materials/w9/cable-network-standalone.html" target="_blank" rel="noopener">MST 电缆网络单步器</a> · <a href="materials/w9/union-find-standalone.html" target="_blank" rel="noopener">并查集按秩合并与路径压缩单步器</a> · <a href="materials/w9/huffman-cost-standalone.html" target="_blank" rel="noopener">Huffman 编码树代价互动页</a>。</dd>
  </dl></div>
  <div class="card seat-card"><div><div>TC 407</div><div class="big">60</div></div><p>11 月 20 日 18:00–20:00 · Week 6–9</p></div>
</div>
<h2>十天冲刺复习路径</h2>
<div class="plan">
  <article><b>第一阶段：Week 6 摊还分析与概率哈希</b>掌握四种摊还方法（Aggregate / Accounting / Charging / Potential \(\Phi\)），熟记动态表倍增与 \(1/4\) 缩半、二进制计数器、2-3 树分裂 \(O(1)\) 与 0 成本删除；掌握 Markov / Chebyshev / Hoeffding 不等式、Balls &amp; Bins 四大期望公式与最大负载 \(\Theta(\frac{\ln n}{\ln\ln n})\) 三引理证明、双层完美哈希 \(\sum n_i^2 \le 4N\) 证明及布隆过滤器假阳性率推导。</article>
  <article><b>第二阶段：Week 7 图搜索、拓扑排序与强连通分量</b>辨析邻接表 \(\Theta((n+m)\log n)\) bits 与邻接矩阵 \(\Theta(n^2)\) bits；掌握 BFS 最短跳数树與无向图判环/二分图染色；吃透 DFS 四类边时间戳区间、<b>白色路径定理</b>反证法、有向图判环（存在 Back Edge）与 DAG 拓扑排序；掌握缩点 DAG 性质 \(\text{post}(C)&gt;\text{post}(C')\) 与 Kosaraju 两遍 DFS 求 SCC。</article>
  <article><b>第三阶段：Week 8 最短路全家桶与 A* 势函数</b>熟练手工追踪 Bellman-Ford、Dijkstra 及允许重入队的 Modified Dijkstra；掌握不同优先队列下 Dijkstra 的复杂度（数组 / 二叉堆 / Fib 堆 / 整数权桶队列 \(O(V+E)\)）；理解双向 Dijkstra 终止条件（\(\min_x(d_f[x]+d_b[x])\)）；掌握 A* 的 Admissible（\(h(v)\le\delta(v,t)\)）与 Consistent（\(w(u,v)+h(v)-h(u)\ge 0\)）性质及地标（Landmarks）势函数证明。</article>
  <article class="today"><b>第四阶段：Week 9 贪心算法、MST 与并查集 + HW5–7 实战</b>掌握 Huffman 编码树代价内部节点求和恒等式、最优子结构与熵下界；掌握 Set Cover 的 \(\ln n\) 近似比证明；熟记树四性质、<b>切割引理（Cut Lemma）</b>交换论证、Kruskal 与 Prim 对比，以及并查集按秩合并三大性质（秩 \(k\) 根至少 \(2^k\) 节点、最大秩 \(\le\log_2 n\)）与路径压缩 \(O(m\log^* n)\)。最后刷完 HW5–7 与模拟题库。</article>
</div>
`,
  sheet: String.raw`
<div class="sheet-grid">
<h3>1. 摊还分析（Amortized Analysis, Week 6）</h3>
<p><b>核心条件</b>：对从初始状态出发的任意操作序列及任意前缀 \(t\)，总实际代价 \(\sum_{k=1}^t c(k) \le \sum_{k=1}^t a(k)\)（银行余额永不小于 0）。</p>
<p><b>四种方法</b>：① <b>Aggregate（聚合）</b>：算 \(n\) 次操作最坏总代价 \(T(n)\)，均摊 \(a = T(n)/n\)；② <b>Accounting（记账/存钱）</b>：便宜操作多交钱存入银行，昂贵操作用存款补贴；③ <b>Charging（向过去收费）</b>：昂贵操作把代价回溯分摊给造成它的过去操作（须证每个过去操作最多被收常数次且每次 \(O(1)\)）；④ <b>Potential（势函数）</b>：定义 \(\Phi(\text{DS})\ge 0\) 且 \(\Phi(\text{DS}_0)=0\)，令 \(a(t) = c(t) + \Phi(\text{DS}_t) - \Phi(\text{DS}_{t-1})\)，则 \(\sum_{t=1}^T a(t) = \sum_{t=1}^T c(t) + \Phi(\text{DS}_T) - \Phi(\text{DS}_0) \ge \sum c(t)\)。</p>
<p><b>经典模型</b>：① <b>动态表倍增与缩半</b>：满 \(n=m\) 时倍增至 \(2m\)（刚倍增完有 \(m/2\) 元素，下次倍增前必有 \(\ge m/2\) 次插入）；降到 \(n=m/4\) 时缩半至 \(m/2\)（上次倍增或缩半完恰有 \(m/2\) 元素，到 \(m/4\) 必有 \(\ge m/4\) 次删除），每次插入/删除均摊 \(O(1)\)。② <b>栈 Push(1) + Empty(\(k\))</b>：\(\Phi = \text{栈中元素数}\)，Push 均摊 \(1+1=2\)，Empty 均摊 \(k + (0-k) = 0\)。③ <b>二进制计数器</b>：\(\Phi = c\cdot(\text{1 的个数})\)，若有 \(k\) 个末尾 1，实际代价 \(\Theta(1+k)\)，\(\Delta\Phi = c(1-k)\)，取合适 \(c\) 得均摊 \(O(1)\)。④ <b>2-3 树分裂</b>：\(\Phi = \text{3-节点（满节点）个数}\)，每次分裂消除一个 3-节点且至多新建一个 3-节点，\(\Delta\Phi \le 1 - \#\text{splits}\)，均摊分裂数 \(\le \#\text{splits} + (1 - \#\text{splits}) = 1\)。⑤ <b>2-3 树 0 成本删除</b>：令 \(\Phi = 2c_1 n\log n\)（或把使树从 \(n-1\to n\) 的最后一次插入多收一份 \(O(\log n)\)），插入均摊 \(O(\log n)\)、删除均摊 \(0\)。</p>

<h3>2. 概率不等式、Balls &amp; Bins、完美哈希与布隆过滤器（Week 6）</h3>
<p><b>三大集中不等式</b>：① <b>Markov</b>（\(X\ge 0\)）：\(\Pr[X\ge t] \le \frac{E[X]}{t}\)；② <b>Chebyshev</b>：\(\Pr[|X-\mu|\ge t] \le \frac{\operatorname{Var}(X)}{t^2}\)；③ <b>Hoeffding</b>（\(S_n=\sum_{i=1}^n X_i\)，\(X_i\in[0,1]\) 独立）：\(\Pr[|S_n - E[S_n]| &gt; t] &lt; 2e^{-t^2/n}\)，样本均值 \(\Pr[|S_n/n - \mu| &gt; \alpha] &lt; 2e^{-\alpha^2 n}\)。</p>
<p><b>\(n\) 球投 \(m\) 桶（SUHA）</b>：① 单桶期望球数 \(E[X_i] = n/m\)；② 期望空桶数 \(E[Z] = m(1-1/m)^n \approx m e^{-n/m}\)（\(m=n\) 时 \(\approx n/e\)；\(m=\sqrt{n}\) 时 \(\to 0\)；\(m=cn\) 或 \(n^a(a&gt;1)\) 时 \(\to\infty\)）；③ 期望碰撞对数 \(E[\sum_{i&lt;j} X_{ij}] = \binom{n}{2}\frac{1}{m} = \frac{n(n-1)}{2m}\)（生日悖论 \(m=365\)，令期望为 1 得 \(n\approx 28\)；碰撞概率 \(\ge 1/2\) 为 \(23\)）；④ <b>Coupon Collector（全满所需球数）</b>：第 \(i\) 阶段成功率 \(p_i = \frac{m-(i-1)}{m}\)，期望总球数 \(E[X] = \sum_{i=1}^m \frac{m}{m-i+1} = m H_m \approx m\ln m\)；⑤ <b>最大桶负载（\(m=n\)）</b>：Lemma 1 \(\Pr[\text{bin } i \ge k] \le \binom{n}{k}(\frac{1}{n})^k \le (\frac{en}{k})^k(\frac{1}{n})^k = (\frac{e}{k})^k\)；Lemma 2 取 \(k = \frac{4\ln n}{\ln\ln n}\) 得单桶概率 \(&lt; 1/n^3\)；Lemma 3 由 Union Bound 得 \(\Pr[\exists i, \text{bin } i \ge \frac{4\ln n}{\ln\ln n}] &lt; n\cdot\frac{1}{n^3} = \frac{1}{n^2}\)，故 \(L = \Theta(\frac{\ln n}{\ln\ln n})\) w.h.p.；<b>Power of Two Choices</b>（随机看 2 桶放较空者）将最大负载降至 \(\Theta(\frac{\ln\ln n}{\ln\ln\ln n})\) w.h.p.。</p>
<p><b>完美哈希（固定 \(N\) 个键，最坏 \(O(1)\) 查找）</b>：① 单层表长 \(M=N^2\)：通用哈希族下 \(E[\text{碰撞对}] \le \binom{N}{2}\frac{1}{N^2} &lt; \frac{1}{2}\)，故 \(\Pr[\text{无碰撞}] &gt; 1/2\)（平均试 2 次）；② <b>双层 FKS 完美哈希（\(O(N)\) 空间）</b>：第一层 \(M=N\)，桶 \(i\) 有 \(n_i\) 个键则配大小为 \(n_i^2\) 的二级表。由恒等式 \(\sum_{i=1}^N n_i^2 = \sum_{x\in S}\sum_{y\in S} C_{xy} = N + \sum_{x\ne y} C_{xy}\)，取期望得 \(E[\sum n_i^2] \le N + N(N-1)\frac{1}{N} = 2N - 1 &lt; 2N\)。由 Markov 不等式 \(\Pr[\sum n_i^2 \ge 4N] &lt; \frac{2N}{4N} = \frac{1}{2}\)，故随机选 \(h\) 有 \(&gt;1/2\) 概率使二级总空间 \(\sum n_i^2 \le 4N\)（总空间 \(\le 5N\)）。</p>
<p><b>布隆过滤器（Bloom Filter，\(m\) 位，\(n\) 个元素，\(k\) 个哈希函数）</b>：只置 1 不存原键，<b>绝无假阴性（No False Negatives）</b>，有假阳性。插入 \(n\) 个元素后某特定位仍为 0 的概率 \(p = (1 - 1/m)^{kn} \approx e^{-kn/m}\)；假阳性率 \(f = (1 - p)^k \approx (1 - e^{-kn/m})^k\)。对 \(k\) 求导最小化得<b>最优哈希个数 \(k_{\text{opt}} = \frac{m}{n}\ln 2 \approx 0.693\frac{m}{n}\)</b>（此时 \(p = 1/2\)，位数组恰半数置 1），最优假阳性率 \(f_{\text{opt}} = (1/2)^{\frac{m}{n}\ln 2} \approx (0.6185)^{m/n}\)。标准 BF 不支持删除（置 0 会造成假阴性）；<b>Counting BF</b> 用 4-bit 计数器支持删除（计数器溢出锁死上限，若仍被减或处理不当会导致假阴性）。Heavy Flows 保守更新（Conservative Update）：流估计量为 \(\min_{i\in h(f)} y_i\)，仅更新不超过新最小值的桶。</p>

<h3>3. 图表示、BFS、DFS、拓扑排序与强连通分量（Week 7）</h3>
<p><b>图表示空间（以 bit 计，\(\log n\) bits 存一个顶点编号）</b>：邻接表为 \(\Theta((n+m)\log n)\) bits（遍历邻居 \(O(\deg(u))\)，查边 \(O(\deg(u))\)）；邻接矩阵为 \(\Theta(n^2)\) bits（查边 \(O(1)\)，遍历邻居 \(\Theta(n)\)，仅当 \(m = \Theta(n^2)\) 稠密图时占优）。</p>
<p><b>BFS（广度优先搜索，FIFO 队列 / Frontier 层级扩展，\(O(V+E)\)）</b>：构建无权图最短路径树（最少跳数）。<b>无向图判环</b>：BFS 遇到已访问且非父节点的邻居 \(\iff\) 有环，\(O(V+E)\)；<b>二分图判定</b>：无奇环 \(\iff\) 二分图（BFS 按层奇偶二染色，若同层两点有边则构成长 \(2i+1\) 的奇闭迹）。<b>有向图不能直接用 BFS 判全部环</b>（横叉边/前向边会误报；但判断指定点 \(v\) 是否在环上可用 BFS 求 \(v\) 可达集 \(R\) 再查是否有 \(u\in R\) 满足 \((u,v)\in E\)）。</p>
<p><b>DFS（深度优先搜索，三色 White/Gray/Black，时间戳 \([u.d, u.f]\)，\(O(V+E)\)）</b>：括号化性质（区间要么不相交，要么包含）。四类边（探索 \((u,v)\) 时）：① <b>Tree edge（树边）</b>：\(v\) 为 White（\(u.d &lt; v.d &lt; v.f &lt; u.f\)）；② <b>Back edge（后向边，指向祖先）</b>：\(v\) 为 Gray（\(v.d &lt; u.d &lt; u.f &lt; v.f\)）；③ <b>Forward edge（前向边，指向非直接子孙）</b>：\(v\) 为 Black 且 \(u.d &lt; v.d &lt; v.f &lt; u.f\)；④ <b>Cross edge（横叉边）</b>：\(v\) 为 Black 且 \(v.d &lt; v.f &lt; u.d &lt; u.f\)。<b>无向图 DFS 只有 Tree 边和 Back 边</b>（无 Forward/Cross 边）。</p>
<p><b>白色路径定理（White-Path Theorem）</b>：\(v\) 在 DFS 树中成为 \(u\) 的后代 \(\iff\) 在发现 \(u\) 的时刻 \(u.d\)，存在从 \(u\) 到 \(v\) 的全白顶点路径。（反证法：取路径上第一个非 \(u\) 后代的点 \(t\)，其前驱 \(s\) 是 \(u\) 的后代故 \(s.f &lt; u.f\)，而 \(t\) 在 \(s\) 结束前必已被访问，故 \(u.d &lt; t.d &lt; s.f &lt; u.f\)，由括号化知 \(t\) 必是 \(u\) 的后代，矛盾！）</p>
<p><b>环检测与拓扑排序</b>：图 \(G\) 有环 \(\iff\) DFS 存在 Back Edge（取环上最先被发现的点 \(v_0\)，其余点此时全白，由白色路径定理环上指向 \(v_0\) 的点 \(v_k\) 必成为 \(v_0\) 后代，故 \((v_k, v_0)\) 必为后向边）。<b>DAG 拓扑排序</b>：运行任意 DFS，按完成时间 \(u.f\) <b>从大到小（降序）</b>排列顶点（因为 DAG 无后向边，对任意边 \(u\to v\) 必有 \(u.f &gt; v.f\)）。</p>
<p><b>强连通分量（SCC，Kosaraju 算法，\(O(V+E)\)）</b>：缩点图 \(G^{\text{SCC}}\) 必为 DAG。定义 \(\text{post}(C) = \max_{v\in C} v.f\)，若 \(G^{\text{SCC}}\) 中有边 \(C\to C'\)，则必有 \(\text{post}(C) &gt; \text{post}(C')\)，故<b>全图完成时间最大的顶点必位于 \(G\) 的某个 Source SCC 中</b>。Kosaraju 算法（两遍 DFS）：① 在反向图 \(G^T\) 上跑 DFS 算完成时间（\(G^T\) 的 Source SCC 即原图 \(G\) 的 Sink SCC）；② 在原图 \(G\) 上按第①步的完成时间从大到小依次选未访问点跑 DFS，每次恰好剥离出一个 Sink SCC（或者对偶地：先在 \(G\) 上跑 DFS，再在 \(G^T\) 上按 \(G\) 的 post 降序跑 DFS）。</p>

<h3>4. 最短路径：Bellman-Ford、Dijkstra、双向搜索与 A*（Week 8）</h3>
<p><b>基础与 Bellman 方程</b>：无负权环时最短路必为简单路径（\(\le |V|-1\) 条边），满足唯一解方程 \(\delta(s,s)=0,\ \delta(s,t)=\min_{u\in\text{pre}(t)}\{\delta(s,u)+w(u,t)\}\)。松弛操作 \(\text{relax}(u,v)\)：若 \(v.d &gt; u.d + w(u,v)\) 则更新 \(v.d = u.d + w(u,v),\ v.\pi = u\)（安全估计恒满足 \(v.d \ge \delta(s,v)\)）。<b>检验一棵树 \(T\) 是否为 SPT（DPV 4.7）</b>：\(O(V+E)\) 算出树上距离 \(d_T(s,v)\)，当且仅当对所有边 \((u,v)\in E\) 均有 \(w(u,v)+d_T(s,u)\ge d_T(s,v)\) 时 \(T\) 是正确最短路树。</p>
<p><b>DAG 最短路</b>：按拓扑序依次松弛每个顶点的出边，每条边松弛 1 次，\(\Theta(V+E)\)（允许负权边）。<b>Bellman-Ford</b>：对全部边做 \(|V|-1\) 轮松弛（第 \(i\) 轮后所有 \(\le i\) 条边的最短路已收敛），第 \(|V|\) 轮若仍有边可松弛则报告存在可达负权环，时间 \(\Theta(VE)\)。</p>
<p><b>Dijkstra 算法（要求 \(w(u,v)\ge 0\)；特例：仅从源点 \(s\) 出发的边为负、其余边非负时仍正确）</b>：每次从 \(Q\) 弹出 \(u.d\) 最小者加入 \(S\) 并松弛出边。执行 \(|V|\) 次 Insert、\(|V|\) 次 Extract-Min、\(\le |E|\) 次 Decrease-Key。复杂度：<b>数组</b> \(\Theta(V^2)\)；<b>二叉堆</b> \(\Theta((V+E)\log V)\)；<b>Fibonacci 堆</b> \(\Theta(V\log V + E)\)；<b>有界非负整数权 \(\in\{0,\dots,C\}\)（桶队列 / 循环桶）</b> \(O(V+E+VC)\) / 线性。</p>
<p><b>双向 Dijkstra（Bi-directional Search）</b>：从 \(s\) 正向（在 \(G\) 上）与从 \(t\) 反向（在 \(G^T\) 上）交替执行 Dijkstra。<b>终止时刻</b>：当某个顶点 \(u\) 同时进入正向已决集 \(S_s\) 与反向已决集 \(S_t\) 时停止搜索；<b>注意最短距离不是 \(d_f[u]+d_b[u]\)</b>，而是遍历所有节点取 \(\delta(s,t) = \min_{x\in V}(d_f[x] + d_b[x])\)！在分支因子 \(b\)、深度 \(d\) 的均匀树上搜索节点数从 \(b^d = n\) 降至 \(2b^{d/2} = 2\sqrt{n}\)。</p>
<p><b>A* 算法与势函数重赋权</b>：按优先级 \(f(v) = g(v) + h(v)\) 从 \(Q\) 中抽取节点。① <b>Admissible（可采纳）</b>：\(\forall v,\ h(v) \le \delta(v,t)\)（绝不高估到终点的真实距离），保证终点 \(t\) 首次进入 \(S\) 时必找到最优最短路（但 \(S\) 中节点可能因发现更短路径而重回 \(Q\)）；② <b>Consistent / Feasible（一致/可行）</b>：\(\forall (u,v)\in E,\ w'(u,v) = w(u,v) + h(v) - h(u) \ge 0\)（且 \(h(t)=0\)）。一致性 \(\implies\) 可采纳性，且<b>以一致启发式运行 A* 与在重赋权 \(w'\) 上运行标准 Dijkstra 步步完全等价</b>（任意 \(a\to b\) 路径满足 \(w'(p) = w(p) + h(b) - h(a)\)，最短路树不变，节点永不从 \(S\) 退回 \(Q\)）。③ <b>地标势函数（Landmarks）</b>：预计算地标 \(\ell\in L\) 到所有点的双向最短路，定义 \(h_t(u) = \max_{\ell\in L}\max\{\delta(u,\ell)-\delta(t,\ell),\ \delta(\ell,t)-\delta(\ell,u)\}\)，由三角不等式恒为一致且可采纳的势函数。</p>

<h3>5. 贪心算法：Huffman 编码、集合覆盖、MST 与并查集（Week 9）</h3>
<p><b>Huffman 编码</b>：前缀码 \(\iff\) 字符仅在叶子节点的二叉树。编码总比特数（树代价）满足恒等式：\(\text{Cost}(T) = \sum_{i=1}^n f_i\cdot\text{depth}(i) = \sum_{v\in\text{内部节点}} f(v)\)（每次合并两棵子树产生的父节点频率等于两子树频率之和，并累加进总代价）。贪心策略：每次用最小堆取出频率最小的两个节点 \(f_1, f_2\) 合并为 \(f_1+f_2\)，复杂度 \(O(n\log n)\)。<b>Shannon 信息熵下界</b>：平均码长 \(\ge H = \sum_{i=1}^n p_i \log_2(1/p_i)\)（当所有 \(p_i = 2^{-k_i}\) 时 Huffman 编码恰好达到熵下界，码长 \(k_i = \log_2(1/p_i)\)）。</p>
<p><b>最小集合覆盖（Set Cover）</b>：每次贪心选覆盖最多未覆盖元素的集合。若最优覆盖用 \(k\) 个集合覆盖 \(n\) 个元素，则剩余 \(n_t\) 个未覆盖元素时必有一集合覆盖 \(\ge n_t/k\) 个新元素，故 \(n_{t+1} \le n_t(1 - 1/k) \le n(1 - 1/k)^{t+1} &lt; n e^{-(t+1)/k}\)。当 \(t = k\ln n\) 时 \(n_t &lt; 1\)，故贪心集合数 \(C_g \le k\ln n\)，近似比 \(\frac{C_g}{C^*} \le \ln n\)。</p>
<p><b>最小生成树（MST）与切割引理</b>：\(n\) 个顶点的树 \(\iff\) 连通无环 \(\iff\) 连通且恰有 \(n-1\) 条边 \(\iff\) 任意两点间有唯一简单路径。<b>切割引理（Cut Lemma）</b>：若边集 \(X\) 安全（\(X\subseteq T_0\)，\(T_0\) 为某棵 MST），切割 \((S, V\setminus S)\) 尊重 \(X\)（\(C\cap X = \emptyset\)），且 \(e\) 是横跨该切割的最轻边，则 \(X\cup\{e\}\) 安全（证明：将 \(e\) 加入 \(T_0\) 形成唯一环，该环必有另一条边 \(e_0\notin X\) 横跨切割，因 \(w(e)\le w(e_0)\)，故 \(T' = T_0 - \{e_0\} \cup \{e\}\) 也是包含 \(X\cup\{e\}\) 的 MST）。</p>
<p><b>Kruskal vs Prim</b>：① <b>Kruskal</b>：将边按权重升序排序（\(O(E\log E) = O(E\log V)\)），依次加入不产生环的边（用并查集判环），总时间 \(O(E\log V)\)；② <b>Prim</b>：维护单棵生长树 \(S\)，优先队列存 \(v\in V\setminus S\) 到 \(S\) 的最轻连边 \(v.d = \min_{u\in S} w(u,v)\)，二叉堆实现 \(O((V+E)\log V)\)，Fib 堆 \(O(V\log V + E)\)。</p>
<p><b>并查集（Union-Find）</b>：Quick-Find（Find \(O(1)\)，Union \(O(N)\)，\(M\) 次操作 \(O(MN)\)）；Quick-Union（树高可退化为 \(N\)，\(O(MN)\)）。<b>按秩合并（Union by Rank）三条铁律</b>：① 任意非根节点 \(x\) 满足 \(\text{rank}(x) &lt; \text{rank}(\pi(x))\)（仅当两棵同秩 \(k-1\) 的根合并时新根秩变为 \(k\)）；② 秩为 \(k\) 的根节点子树至少包含 \(2^k\) 个节点；③ \(n\) 个元素中秩为 \(k\) 的节点至多有 \(n/2^k\) 个，故最大秩 \(=\) 最大树高 \(\le \lfloor\log_2 n\rfloor\)，单次 Find/Union 为 \(O(\log n)\)。加上<b>路径压缩（Path Compression）</b>后，\(N\) 个对象上 \(M\) 次操作总时间为 \(O(N + M\log^* N)\)（宇宙尺度内 \(\log^* N \le 5\)）。</p>
</div>
`
});
