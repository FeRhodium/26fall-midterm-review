Review.add({
  id: "hw567", group: "hw", n: 9,
  short: "HW5–7 作业全解",
  title: "Written Homework 5–7 逐题精讲与考法提炼",
  meta: "HW5 (Week 5–6) · HW6 (Week 7) · HW7 (Week 8) · 含官方解答与完整证明",
  sources: [
    { label: "HW5 题目 PDF", href: "materials/hw/HW5.pdf" },
    { label: "HW5 官方解答 PDF", href: "materials/hw/HW5_Solution.pdf" },
    { label: "HW6 题目 PDF", href: "materials/hw/HW6.pdf" },
    { label: "HW6 解答 PDF", href: "materials/hw/hw6_my_solutions.pdf" },
    { label: "HW7 题目 PDF", href: "materials/hw/HW7.pdf" },
    { label: "HW7 解答 PDF", href: "materials/hw/hw7_my_solutions.pdf" }
  ],
  html: String.raw`
<p class="lede">课程助教和教授出期中题时极喜欢从平时书面作业（Written Homework）中改编判断、单选或证明大题。本章将 HW5（哈希与摊还分析）、HW6（BFS/DFS、二分图、欧拉回路、2-SAT）与 HW7（负权 Dijkstra、重入队 Dijkstra、Bellman-Ford、概率最短路、地标势函数、SPT 线性验证）的全部题目与标准证明完整汇总。</p>

<h2>一、Homework 5 精讲（哈希碰撞概率与摊还分析）</h2>

<h3>1. 合法哈希函数辨析（HW5 P1）</h3>
<ul>
<li>对于槽位数为 \(N\) 的哈希表，成为<b>合法（valid）哈希函数</b>的唯一底线要求是：<b>确定性（deterministic，同一键在插入和查找时必须映到同一槽位）</b>且值域落在 \(\{0, \dots, N-1\}\)。
  <ul>
  <li>(a) \(h(k) = 0\)：<b>合法（Yes）</b>（虽然所有键全碰撞在槽 0，退化为链表，但语义上完全合法）。</li>
  <li>(b) \(h(k) = \text{random}(0, N)\)：<b>不合法（No）</b>！因为每次调用返回不同随机数，插入后查找同一键时找不到原槽位。</li>
  <li>(c) \(h(k) = k \bmod N\)：<b>合法（Yes）</b>（标准除留余数法）。</li>
  <li>(d) \(h(k) = k \bmod (N-2)\)：<b>合法（Yes）</b>（只是浪费了最后两个槽位 \(N-2, N-1\)）。</li>
  <li>(e) \(h(k) = f(k)\)（\(f\) 是耗时 \(\Theta(N^2)\) 的确定性函数，值域 \(0..N-1\)）：<b>合法（Yes）</b>（虽然效率极差，但满足哈希函数的定义）。</li>
  </ul>
</li>
</ul>

<h3>2. 基数 \(2^p\) 字符串模 \(m = 2^p - 1\) 的排列碰撞（HW5 P2）</h3>
<ul>
<li><b>题目</b>：将字符串 \(x = x_{r-1}\dots x_1 x_0\) 视为基数 \(2^p\) 的整数 \(k(x) = \sum_{i=0}^{r-1} x_i (2^p)^i\)，哈希函数 \(h(k) = k \bmod (2^p - 1)\)。证明若字符串 \(x\) 与 \(y\) 互为字符重排列（permutation），则 \(h(x) = h(y)\)。</li>
<li><b>证明</b>：因为 \(2^p \equiv 1 \pmod{2^p - 1}\)，故对任意次幂 \(i \ge 0\) 都有 \((2^p)^i \equiv 1^i = 1 \pmod{2^p - 1}\)。因此：
\[h(x) = \left(\sum_{i=0}^{r-1} x_i (2^p)^i\right) \bmod (2^p - 1) = \left(\sum_{i=0}^{r-1} x_i\right) \bmod (2^p - 1)\]
该值只依赖于所有字符的算术和，与字符所在位置 \(i\) 无关！故交换字符顺序不改变哈希值。\(\square\)</li>
</ul>

<h3>3. 开放寻址法 vs 链地址法（HW5 P3，同负载因子 \(\alpha &lt; 1\)）</h3>
<ul>
<li>(a) <i>开放寻址的不成功查找平均更快？</i> <b>False</b>。开放寻址不成功查找期望探测次数为 \(\frac{1}{1-\alpha}\)，而链地址法为 \(1+\alpha\)（或算链表长 \(\alpha\)）。对一切 \(0 &lt; \alpha &lt; 1\) 都有 \(\frac{1}{1-\alpha} = 1 + \alpha + \alpha^2 + \dots &gt; 1 + \alpha\)，链地址法更快。</li>
<li>(b) <i>开放寻址的插入和删除更快？</i> <b>False</b>。插入代价等于不成功查找（开放寻址更慢），且链地址法若用双向链表可 \(O(1)\) 删除，开放寻址删除需放墓碑（tombstone）且拖慢后续查找。</li>
<li>(c) <i>开放寻址省去了指针空间，相同内存下可建更大的表（降低 \(\alpha\)）？</i> <b>True</b>。</li>
<li>(d) <i>新插入一个键时遇到非空槽（发生碰撞）的概率相同？</i> <b>False</b>。开放寻址中每个元素独占一个槽，恰有 \(n\) 个槽非空，碰撞概率恰为 \(\frac{n}{m} = \alpha\)；链地址法中多个键可挂在同一槽位，占用槽位数 \(\le n\)，故碰撞概率 \(1 - (1 - 1/m)^n \approx 1 - e^{-\alpha} &lt; \alpha\)，开放寻址更容易撞上非空槽！</li>
</ul>

<h3>4. 线性探测与动态倍增重哈希手工追踪（HW5 P5）</h3>
<ul>
<li>初始 \(m = 4\)，负载因子不能超过 \(0.75\)（即超过 \(0.75\) 时倍增并按原表槽位/插入顺序重新哈希），\(h(k) = k \bmod m\)，依次插入 <code>12, 43, 13, 88, 23, 26, 11, 5</code>：
  <ol>
  <li>在 \(m=4\) 中插入 <code>12</code>（槽 0）、<code>43</code>（槽 3）、<code>13</code>（槽 1），此时 \(3/4 = 0.75\) 未超；插入 <code>88</code>（\(88\bmod 4=0\to 0,1\) 忙 \(\to\) 槽 2），此时 \(4/4 = 1 &gt; 0.75\)，触发<b>倍增到 \(m=8\)</b>！</li>
  <li>重哈希到 \(m=8\)：<code>12</code>\(\to 4\)，<code>43</code>\(\to 3\)，<code>13</code>\(\to 5\)，<code>88</code>\(\to 0\)。接着插入 <code>23</code>\(\to 7\)（\(5/8\)），<code>26</code>\(\to 2\)（\(6/8=0.75\)）；插入 <code>11</code>（\(11\bmod 8=3 \to 3,4,5\) 忙 \(\to\) 槽 6），此时 \(7/8 &gt; 0.75\)，触发<b>倍增到 \(m=16\)</b>！</li>
  <li>重哈希到 \(m=16\)：<code>88</code>\(\to 8\)，<code>43</code>\(\to 11\)，<code>12</code>\(\to 12\)，<code>13</code>\(\to 13\)，<code>23</code>\(\to 7\)，<code>26</code>\(\to 10\)，<code>11</code>（\(11,12,13\) 忙 \(\to 14\)）。最后插入 <code>5</code>\(\to\) 槽 5。</li>
  <li>最终 \(m=16\) 表：槽 5=<code>5</code>，槽 7=<code>23</code>，槽 8=<code>88</code>，槽 10=<code>26</code>，槽 11=<code>43</code>，槽 12=<code>12</code>，槽 13=<code>13</code>，槽 14=<code>11</code>（其余为空）。</li>
  </ol>
</li>
</ul>

<h3>5. 碰撞概率与 \(\alpha = 1 - 1/\sqrt{n}\) 下的探测复杂度（HW5 P6）</h3>
<ul>
<li>(a) 链地址法插入 4 个键后恰有一条长为 3 的链：从 4 个键选 3 个（\(\binom{4}{3}=4\)），这 3 个键同槽概率为 \(m \cdot (1/m)^3 = 1/m^2\)，第 4 个键落入其余 \(m-1\) 槽概率为 \((m-1)/m\)，相乘得 \(\mathbf{\frac{4(m-1)}{m^3}}\)。</li>
<li>(b) 线性探测法插入 3 个键总探测次数 \(\ge 4\)：每次插入至少探测 1 次，总探测 \(\ge 4 \iff\) 至少发生 1 次碰撞 \(\iff 1 - \Pr[\text{三键互不碰撞}] = 1 - \frac{m-1}{m}\cdot\frac{m-2}{m} = \mathbf{\frac{3m - 2}{m^2}}\)。</li>
<li>(c) 当负载因子 \(\alpha = 1 - \frac{1}{\sqrt{n}}\) 时，开放寻址不成功查找的期望探测次数上界为 \(\frac{1}{1-\alpha} = \frac{1}{1/\sqrt{n}} = \mathbf{\sqrt{n} = \Theta(\sqrt{n})}\)。</li>
</ul>

<h2>二、Homework 6 精讲（图搜索、二分图、欧拉回路与 2-SAT）</h2>

<h3>1. 用 BFS 检测特定顶点 \(v\) 是否在有向环上（HW6 P1）</h3>
<ul>
<li><b>算法</b>：从给定顶点 \(v\) 出发运行一次 BFS，设所有被访问到的可达顶点集合为 \(R\)（约定 \(v \in R\)）。然后扫描所有边，检查是否存在某条有向边 \((u, v) \in E\) 使得 \(u \in R\)（含自环 \(u=v\)）。若存在则 \(v\) 在环上（路径 \(v \leadsto u\) 加边 \(u \to v\)），否则不在。时间复杂度 \(O(V+E)\)。</li>
</ul>

<h3>2. 母顶点（Mother Vertex）的线性时间判定（HW6 P2）</h3>
<ul>
<li><b>算法与证明</b>：对全图运行一次完整的 DFS，记<b>最后一个完成（finishes last，即 \(v.f = 2|V|\) 最大）</b>的顶点为 \(v\)。然后从 \(v\) 出发再跑一次 BFS/DFS：若能访问到全部 \(|V|\) 个顶点，则 \(v\) 即为所求母顶点；否则图中不存在母顶点。总耗时 \(O(V+E)\)。
  <ul>
  <li><i>为什么正确？</i>由 Week 7B 定理，最后完成的顶点 \(v\) 所在的强连通分量 \(C(v)\) 必然是缩点 DAG 的一个 <b>Source SCC</b>。如果图中真的存在某个母顶点 \(u\) 能到达所有点，那么 \(C(u)\) 在缩点 DAG 中也能到达所有 SCC，这意味着 \(C(u)\) 必定是缩点 DAG 的<b>唯一</b> Source SCC！因此必有 \(C(v) = C(u)\)，即 \(v\) 与 \(u\) 互相可达，故 \(v\) 也能到达全图所有顶点。</li>
  </ul>
</li>
</ul>

<h3>3. 二分图（Bipartite Graph）判定与奇环充要条件（HW6 P3 / DPV 3.7）</h3>
<ul>
<li>(a) <b>\(O(V+E)\) 二染色算法</b>：对每个连通分量选源点 \(s\) 跑 BFS，将偶数层顶点染颜色 1、奇数层顶点染颜色 2。若存在某条边 \((u, w)\) 连接了两个同色顶点，则不是二分图；否则是二分图。</li>
<li>(b) <b>定理：无向图 \(G\) 是二分图 \(\iff\) \(G\) 不包含奇数长度的环（odd cycle）</b>。
  <ul>
  <li>\((\Rightarrow)\) 二分图中任何环必须在 \(V_1\) 与 \(V_2\) 之间交替穿梭，故长度必为偶数。</li>
  <li>\((\Leftarrow)\) 若运行上述 BFS 染色失败，说明存在边 \((u, w)\) 连接了同色顶点。由于无向图 BFS 中相邻顶点的层数之差至多为 1，同色意味着 \(u\) 和 \(w\) 位于<b>完全相同的 BFS 层级 \(i\)</b>！于是从树根（或最近公共祖先）到 \(u\) 的路径（长 \(i\)）、到 \(w\) 的路径（长 \(i\)）再加上边 \((u, w)\)（长 1），闭合出一条长度为 \(2i + 1\) 的奇数闭迹，其中必然包含一个奇环！</li>
  </ul>
</li>
<li>(c) <b>若无向图恰好只包含 1 个奇环，最少需要几种颜色才能合法顶点染色？</b> <b>3 种颜色</b>（奇环本身至少要 3 色；删去奇环上的一条边 \((a,b)\) 后全图无奇环，可 2-染色，再把 \(a\) 单独涂第 3 种颜色即可）。</li>
</ul>

<h3>4. 先修课程最少学期数 = DAG 最长路径（HW6 P4 / DPV 3.16）</h3>
<ul>
<li>给定每门课 \(v\) 的直接先修课列表（入边 \(w \to v\)），最少学期数等于先修 DAG 中<b>最长路径的顶点个数</b>。用记忆化 DFS（或按拓扑序 DP）计算：
\[\text{sem}(v) = \begin{cases} 1 &amp; \text{若 } v \text{ 无先修课} \\ 1 + \max_{w \to v} \text{sem}(w) &amp; \text{否则} \end{cases}, \qquad \text{Ans} = \max_{v \in V} \text{sem}(v)\]
时间复杂度 \(O(n + m)\) 线性时间。</li>
</ul>

<h3>5. 无向图与有向图的欧拉回路充要条件（HW6 P5 / DPV 3.26）</h3>
<ul>
<li><b>无向图存在欧拉回路（Eulerian Tour，每条边恰好走一次并回到起点）</b> \(\iff\) ① 所有度数非零的顶点属于同一个连通分量；且 ② <b>每个顶点的度数都是偶数（even degree）</b>。（哥尼斯堡七桥问题中 4 个顶点度数分别为 5, 3, 3, 3 全为奇数，故无欧拉回路。）</li>
<li><b>有向图存在欧拉回路</b> \(\iff\) ① 所有度数非零的顶点属于同一个<b>强连通分量（SCC）</b>；且 ② 对每个顶点 \(v\) 都有 <b>\(\text{in-degree}(v) = \text{out-degree}(v)\)（入度等于出度）</b>。</li>
</ul>

<h3>6. 2-SAT 问题的线性时间强连通分量算法（HW6 P6 / DPV 3.28）</h3>
<ul>
<li><b>问题与蕴含图（Implication Graph）\(G_I\)</b>：给定含 \(n\) 个布尔变量 \(x_1, \dots, x_n\) 和 \(m\) 个二元子句 \((\alpha \lor \beta)\) 的 2-SAT 公式 \(I\)（每个文字 \(\alpha, \beta \in \{x_i, \bar{x}_i\}\)）。
  <ul>
  <li>构造有 \(2n\) 个顶点（每个变量对应 \(x_i\) 和 \(\bar{x}_i\) 两个节点）、\(2m\) 条有向边的蕴含图 \(G_I\)：每个子句 \((\alpha \lor \beta)\) 等价于逻辑蕴含 \(\bar{\alpha} \Rightarrow \beta\) 与 \(\bar{\beta} \Rightarrow \alpha\)，因此在 \(G_I\) 中添加两条有向边：
  \[\bar{\alpha} \to \beta \quad \text{与} \quad \bar{\beta} \to \alpha\]
  （注意斜对称性：若图中有边 \(u \to v\)，则必有其逆否边 \(\bar{v} \to \bar{u}\)！）</li>
  </ul>
</li>
<li><b>充要条件定理</b>：2-SAT 实例 \(I\) 是可满足的（satisfiable）\(\iff\) 在蕴含图 \(G_I\) 中，<b>没有任何一个变量 \(x_i\) 与其否定 \(\bar{x}_i\) 处在同一个强连通分量（SCC）中</b>！
  <ul>
  <li><i>必要性</i>：若 \(x_i\) 与 \(\bar{x}_i\) 在同一 SCC 中，则存在路径 \(x_i \Rightarrow^* \bar{x}_i\) 且 \(\bar{x}_i \Rightarrow^* x_i\)，无论给 \(x_i\) 赋 True 还是 False 都会推出矛盾。</li>
  <li><i>充分性与构造赋值算法（\(O(n+m)\)）</i>：用 Kosaraju 算法求出所有 SCC。若无矛盾，按缩点 DAG 从 <b>Sink SCC 往回（逆拓扑序）</b>处理：每次挑一个尚未赋值的 Sink SCC \(S\)，将 \(S\) 中所有文字赋为 <b>True</b>，将其互补分量 \(\bar{S}\) 中所有文字赋为 <b>False</b>，然后删去 \(S \cup \bar{S}\)。总时间 \(O(n + m)\)！</li>
  </ul>
</li>
</ul>

<h2>三、Homework 7 精讲（最短路径深入与变体设计）</h2>

<h3>1. 允许重入队的 Modified Dijkstra 追踪（HW7 P2）與 Bellman-Ford 追踪（HW7 P3）</h3>
<ul>
<li><b>图参数（HW7 P2 &amp; P3 共用图）</b>：顶点 \(A\dots G\)，源点 \(A\)，有向边为 \(A\to B(4),\ B\to D(4),\ A\to C(17),\ C\to D(-13),\ D\to E(2),\ E\to G(2),\ D\to F(8),\ F\to G(-6)\)。</li>
<li><b>Modified Dijkstra（每次严格松弛成功就重新入队 \(Q\)）</b>：
  <ul>
  <li>前 7 次出队：<code>A(0), B(4), D(8), E(10), G(12), C(17), D(4)</code>（当 <code>C(17)</code> 出队松弛 \(C\to D(-13)\) 时，\(D.d\) 从 \(8\) 降为 \(17-13=4\)，故 \(D\) 被重新压入 \(Q\)！）。</li>
  <li>后 5 次出队：<code>E(6), G(8), F(12), G(6), F(12, 初始残留项)</code>。最终最短距离：\((A:0, B:4, C:17, D:4, E:6, F:12, G:6)\)。</li>
  </ul>
</li>
<li><b>Bellman-Ford 按固定边序松弛（HW7 P3）</b>：若每轮固定按 <code>AB, BD, AC, CD, DE, EG, DF, FG</code> 的顺序依次松弛，由於这个顺序恰好顺着最短路径树 \(A\to C\to D\to F\to G\) 的拓扑顺序，<b>仅仅第 1 轮结束后</b>所有顶点就已经一次性传播到了最终最短距离 \((0, 4, 17, 4, 6, 12, 6)\)，第 2 轮无任何变化即可提前终止！</li>
</ul>

<h3>2. 道路封闭概率最小化 = 对数权重最短路 / 最大乘积 Dijkstra（HW7 P4）</h3>
<ul>
<li><b>问题</b>：每条道路 \(e\) 独立封闭的概率为 \(p(e) \in [0, 1]\)，一条路线畅通当且仅当沿途所有道路都畅通，即畅通概率为 \(\prod_{e \in \text{route}} (1 - p(e))\)。求封闭概率最小（等价于<b>畅通概率最大</b>）的路线。</li>
<li><b>解法一（取负对数转化为标准非负权 Dijkstra）</b>：最大化 \(\prod_e (1 - p(e))\) 等价于最大化 \(\ln \prod_e (1 - p(e)) = \sum_e \ln(1 - p(e))\)，即<b>最小化</b>：
\[\sum_{e \in \text{route}} \bigl(-\ln(1 - p(e))\bigr)\]
因为 \(0 \le 1 - p(e) \le 1\)，定义新边权 \(w(e) = -\ln(1 - p(e)) \ge 0\)（全部非负！），直接运行标准 Dijkstra 算法即可！</li>
<li><b>解法二（直接修改 Dijkstra 求最大乘积路径）</b>：设边权 \(q(e) = 1 - p(e) \in [0, 1]\)。修改三处：① 初始化 \(s.d = 1\)，其余 \(v.d = 0\)；② 松弛操作改为：若 \(v.d &lt; u.d \cdot q(u, v)\) 则更新 \(v.d \leftarrow u.d \cdot q(u, v)\)；③ 优先队列每次执行 <code>Extract-Max</code> 取出 \(u.d\) <b>最大</b>的节点。<b>为什么正确？</b>因为所有 \(q(e) \in [0, 1]\)，乘上 \([0,1]\) 的数只会使路径乘积<b>单调不增</b>（恰如加非负权使路径和单调不减），因此当前拥有最大 \(u.d\) 的未决节点绝不可能被绕远路的后缀超越！<i>（注：若存在 \(q(e) &gt; 1\)，最大乘积 Dijkstra 就会像遇到负权边一样失效。）</i></li>
</ul>

<h2>考前清单</h2>
<ul>
<li>熟记 HW5 中合法哈希函数判定、基数 \(2^p \bmod (2^p-1)\) 排列不变性、开放寻址 vs 链地址 4 道判断题。</li>
<li>熟记 HW6 中母顶点两遍搜索法、二分图无奇环证明、欧拉回路充要条件、2-SAT 蕴含图构造与 SCC 充要条件。</li>
<li>熟记 HW7 中最大乘积/最小封闭概率路径的对数变换 \(w(e) = -\ln(1-p(e))\ge 0\)。</li>
</ul>
`,
  questions: [
    { id: "q1", tag: "hw", kind: "single", q: String.raw`（HW5 P2）将字符串 \(x = x_{r-1}\dots x_1 x_0\) 视为基数 \(2^p\) 的整数，使用除留余数哈希函数 \(h(k) = k \bmod m\)，其中 \(m = 2^p - 1\)。这一哈希函数有什么严重缺陷？`, choices: [
      ["a", String.raw`因为 \(2^p \equiv 1 \pmod{2^p-1}\)，\(h(x) = (\sum_{i=0}^{r-1} x_i) \bmod (2^p-1)\)，任何字符互为重排列（permutation）的两个字符串必然哈希到完全相同的槽位`],
      ["b", "该函数不是确定性函数，无法用于查找"],
      ["c", "该函数只能使用奇数编号的槽位"],
      ["d", "计算该函数需要 \(\Theta(N^2)\) 时间"]
    ], answer: ["a"], why: String.raw`由 \((2^p)^i \equiv 1^i = 1 \pmod{2^p-1}\)，每个字符的位权模 \(m\) 全都变成了 1，故哈希值只取决于字符之和，对字符位置完全不敏感。` },
    { id: "q2", tag: "hw", kind: "multi", q: String.raw`（HW5 P3）在相同的负载因子 \(\alpha\ (0 &lt; \alpha &lt; 1)\) 和一致哈希假设下，将开放寻址法（Open Addressing）与传统链地址法（Chaining）相比，下列哪些说法是<b>错误的（False）</b>？`, choices: [
      ["a", "开放寻址法进行一次不成功查找（unsuccessful search）的平均探测次数比链地址法更少"],
      ["b", "开放寻址法的插入和删除操作比链地址法更快"],
      ["c", "开放寻址法不需要存储链表指针，因此在相同内存开销下可以建立更大的哈希表"],
      ["d", "插入一个新键时，第一次探测就遇到非空槽位（发生碰撞）的概率在两种方法中完全相等"]
    ], answer: ["a", "b", "d"], why: String.raw`只有 (c) 是 True！(a)(b) 错在 \(\frac{1}{1-\alpha} &gt; 1+\alpha\) 且开放寻址删除困难；(d) 错在开放寻址每个元素占一槽，首探非空概率为 \(\alpha\)，而链地址法多键可共享一槽，首探非空概率为 \(1-(1-1/m)^n \approx 1-e^{-\alpha} &lt; \alpha\)。` },
    { id: "q3", tag: "hw", kind: "single", q: String.raw`（HW6 P5 / DPV 3.26）关于无向图与有向图中存在欧拉回路（Eulerian Tour，每条边恰好经过一次并回到起点）的充要条件（假设所有非零度顶点连通/强连通），下列说法正确的是`, choices: [
      ["a", "无向图要求每个顶点的度数为偶数；有向图要求每个顶点的入度等于出度（in-degree = out-degree）"],
      ["b", "无向图要求恰有两个奇度顶点；有向图要求所有顶点出度为偶数"],
      ["c", "无向图和有向图都只需要图是连通的即可"],
      ["d", "无向图要求没有奇环；有向图要求是 DAG"]
    ], answer: ["a"], why: String.raw`每次进入一个顶点都必须从另一条未用过的边离开，因此在无向图中将关联边两两配对（度数为偶），在有向图中将入边与出边一一配对（入度 = 出度）。` },
    { id: "q4", tag: "hw", kind: "single", q: String.raw`（HW6 P6 / DPV 3.28）在用强连通分量（SCC）求解含 \(n\) 个变量、\(m\) 个子句的 2-SAT 问题时，对于子句 \((x_1 \lor \bar{x}_2)\)，应当在蕴含图 \(G_I\) 中添加哪两条有向边？该 2-SAT 公式可满足的充要条件是什么？`, choices: [
      ["a", String.raw`添加 \(\bar{x}_1 \to \bar{x}_2\) 与 \(x_2 \to x_1\)；充要条件是没有任意变量 \(x_i\) 与其否定 \(\bar{x}_i\) 位于同一个 SCC 中（时间复杂度 \(O(n+m)\)）`],
      ["b", String.raw`添加 \(x_1 \to \bar{x}_2\) 与 \(\bar{x}_2 \to x_1\)；充要条件是蕴含图 \(G_I\) 是一个 DAG`],
      ["c", String.raw`添加 \(\bar{x}_1 \to x_2\) 与 \(\bar{x}_2 \to x_1\)；充要条件是 \(G_I\) 强连通`],
      ["d", String.raw`添加 \(x_1 \to x_2\) 与 \(\bar{x}_1 \to \bar{x}_2\)；充要条件是 \(G_I\) 是二分图`]
    ], answer: ["a"], why: String.raw`子句 \((\alpha \lor \beta)\) 等价于 \(\bar{\alpha} \Rightarrow \beta\) 和 \(\bar{\beta} \Rightarrow \alpha\)。对 \(\alpha = x_1, \beta = \bar{x}_2\)，即 \(\bar{x}_1 \to \bar{x}_2\) 与 \(x_2 \to x_1\)。当且仅当不存在 \(x_i\) 与 \(\bar{x}_i\) 在同一 SCC 时可满足。` },
    { id: "q5", tag: "hw", kind: "single", q: String.raw`（HW7 P4）图中每条道路 \(e\) 封闭的概率为 \(p(e) \in [0, 1)\) 且相互独立。若要直接调用标准 Dijkstra 算法（求最小路径和）来寻找一条从 \(u\) 到 \(v\) 封闭概率最小（即畅通概率 \(\prod_{e}(1-p(e))\) 最大）的路线，应当如何定义每条边的非负权重 \(w(e)\)？`, choices: [
      ["a", String.raw`\(w(e) = -\ln(1 - p(e)) \ge 0\)`],
      ["b", String.raw`\(w(e) = p(e)\)`],
      ["c", String.raw`\(w(e) = 1 - p(e)\)`],
      ["d", String.raw`\(w(e) = \ln p(e)\)`]
    ], answer: ["a"], why: String.raw`最大化 \(\prod (1-p(e))\) 等价于最大化 \(\sum \ln(1-p(e))\)，即最小化 \(\sum (-\ln(1-p(e)))\)。因为 \(1-p(e) \in (0, 1]\)，所以 \(w(e) = -\ln(1-p(e)) \ge 0\) 恒非负，可直接运行标准 Dijkstra。` }
  ],
  cards: [
    [String.raw`为什么 \(h(k) = \text{random}(0, N)\) 不能作为哈希函数，而 \(h(k) = 0\) 可以？`, String.raw`哈希函数必须是确定性的（deterministic），否则插入后查找同一键时无法定位到原槽位；\(h(k)=0\) 虽然全碰撞但语义合法。`],
    [String.raw`无向图是二分图（Bipartite）的充要条件与判定算法`, String.raw`充要条件：图中不包含奇数长度的环（odd cycle）。判定：运行 BFS 按层级奇偶二染色，检查是否有同层边，耗时 \(O(V+E)\)。`],
    [String.raw`无向图与有向图存在欧拉回路（Eulerian Tour）的充要条件`, String.raw`非零度顶点连通（有向图为强连通），且无向图每个顶点度数为偶数、有向图每个顶点 \(\text{in-degree} = \text{out-degree}\)。`],
    [String.raw`2-SAT 问题的蕴含图构造与线性时间可满足性充要条件`, String.raw`子句 \((\alpha\lor\beta)\) 加边 \(\bar{\alpha}\to\beta\) 与 \(\bar{\beta}\to\alpha\)；可满足 \(\iff\) 无任何变量 \(x_i\) 与 \(\bar{x}_i\) 在同一 SCC 中，耗时 \(O(n+m)\)。`],
    [String.raw`如何用 Dijkstra 求边权 \(q(e)\in(0,1]\) 的最大乘积路径（最小封闭概率路径）？`, String.raw`法一：取非负边权 \(w(e) = -\ln q(e) \ge 0\) 跑最小和 Dijkstra；法二：设 \(s.d=1\)、其余 \(0\)，用 \(v.d &lt; u.d \cdot q(u,v)\) 松弛并每次 Extract-Max（因 \(q(e)\le 1\) 乘积单调不增）。`]
  ]
});
