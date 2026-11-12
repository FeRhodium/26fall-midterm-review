Review.add({
  id: "l16_17",
  n: 16,
  group: "quiz3",
  short: "L16–17 · 电路模拟TM与Cook-Levin",
  title: "Lecture 16–17 · 用布尔电路模拟图灵机（TIME(T) ⊆ SIZE(T²)）与 Cook–Levin 定理",
  meta: "计算的局部性 (4窗口 Δ_M) · C_NEXT · TIME(T) ⊆ SIZE(T²) 与 P ⊆ PSIZE · CIRCUIT-SAT 是 NP-complete · Tseitin 变换与 SAT 是 NP-complete",
  sources: [
    { href: "materials/CSC4010_Lecture16(Annotated).pdf", label: "Lecture 16 (Annotated)" },
    { href: "materials/CSC4010_Lecture17(Annotated).pdf", label: "Lecture 17 (Annotated)" }
  ],
  html: String.raw`
<p class="lede">Lecture 16–17 完成了计算复杂性理论最辉煌的一跃：首先利用图灵机<b>计算的局部性（Locality of Computation）</b>将 \(T(n)\) 步图灵机计算转化为 \(O(T(n)^2)\) 大小的布尔电路（证明 \(\mathrm{TIME}(T) \subseteq \mathrm{SIZE}(T^2)\) 及 \(\mathrm{P} \subseteq \mathrm{PSIZE}\)）；紧接着将这一电路构造用于多项式时间验证机 \(V\)，一举证明 <b>\(\mathrm{CIRCUIT\text{-}SAT}\) 是 \(\mathrm{NP}\)-complete</b>，再通过为每个门引入辅助变量的<b>Tseitin 局部等价变换</b>将电路压平为合取范式公式，证出著名的 <b>Cook–Levin 定理：\(\mathrm{SAT}\) 是 \(\mathrm{NP}\)-complete</b>！</p>

<h2>1. 用布尔电路模拟图灵机：\(\mathrm{TIME}(T) \subseteq \mathrm{SIZE}(T^2)\)（Lecture 16）</h2>

<div class="callout must">
  <strong>定理 16.1（图灵机转布尔电路，L16 Slide 3 &amp; Slide 18）</strong>
  <p>设 \(T: \mathbb{N} \to \mathbb{N}\) 是任意时间可构造函数（\(T(n) \ge n\)）。则：</p>
  <div class="formula">\[
    \mathrm{TIME}(T(n)) \subseteq \mathrm{SIZE}\bigl(T(n)^2\bigr). \qquad \text{特别地，}\mathrm{P} \subseteq \mathrm{PSIZE}.
  \]</div>
  <p>而且，对于固定图灵机 \(M\)，给定输入长度 \(1^n\)，可以在关于 \(T(n)\) 的多项式时间（事实上 \(O(T(n)^2)\) 时间）内由算法显式构造出第 \(n\) 个电路 \(\langle C_n \rangle\)！</p>
</div>

<h3>完整四步构造证明（L16 Slides 4–17，Cook–Levin 定理的直接基础！）</h3>
<ol>
  <li><b>固定长度配置与二进制编码</b>：
    <ul>
      <li>设单带图灵机 \(M = (Q, \Sigma, q_{\mathrm{acc}}, q_{\mathrm{rej}}, q_0, \sqcup, \delta)\) 在长度 \(n\) 的输入 \(w\) 上至多运行 \(T = T(n)\) 步停机（为方便，令 \(M\) 进入 \(q_{\mathrm{acc}}\) 或 \(q_{\mathrm{rej}}\) 后保持原配置不变直至第 \(T\) 步）。</li>
      <li>在 \(T\) 步内，读写头最多访问左端起始格及右侧至多 \(T+1\) 个带格，因此每一步的配置 \(C_t\) 都可以统一填充（pad）为固定长度 \(\ell = O(T(n))\) 的字符串 \(b_1 b_2 \cdots b_\ell \in (\Sigma \cup Q)^\ell\)（例如 \(C = u_1\cdots u_k q v_1\cdots v_m\)，恰有一个位置属于状态集 \(Q\)，放在当前读写头所指字符的左侧）。</li>
      <li>令 \(r = \lceil \log_2 |\Sigma \cup Q| \rceil = O(1)\)（因为 \(M\) 是固定机器，\(|\Sigma \cup Q|\) 是常数！）。将每个符号 \(b_i \in \Sigma \cup Q\) 编码为定长 \(r\) 比特块 \(B_i = \langle b_i \rangle \in \{0,1\}^r\)，于是整个配置编码为 \(\langle C \rangle = B_1 B_2 \cdots B_\ell \in \{0,1\}^{r\ell}\)。</li>
    </ul>
  </li>
  <li><b>核心洞察——计算的局部性（Locality of Computation，4 格窗口！）</b>：
    <ul>
      <li>设当前配置为 \(C = b_1 b_2 \cdots b_\ell\)，下一步配置为 \(\mathrm{NEXT}(C) = b'_1 b'_2 \cdots b'_\ell\)。我们要问：<b>为了确定下一时刻第 \(i\) 个位置的符号 \(b'_i\)，需要看上一时刻的哪几个位置？</b></li>
      <li>由于配置把状态符号 \(q\) 插在被读字符左侧（形如 \(\dots u_k q v_1 v_2 \dots\)）：
        <ul>
          <li>若 \(M\) 右移（\(\delta(q, v_1) = (q', b, R)\)），局部字串 \(u_k q v_1 v_2\) 变为 \(u_k b q' v_2\)；</li>
          <li>若 \(M\) 左移（\(\delta(q, v_1) = (q', b, L)\)），局部字串 \(u_k q v_1 v_2\) 变为 \(q' u_k b v_2\)！</li>
        </ul>
      </li>
      <li>仔细核对下标可见：第 \(i\) 个位置的新符号 \(b'_i\) <b>完全且仅仅取决于上一配置中的 4 个相邻符号 \((b_{i-1}, b_i, b_{i+1}, b_{i+2})\)</b>！（在左移时，原位于 \(i+1\) 的状态 \(q\) 和位于 \(i+2\) 的被读字符 \(v_1\) 会把新状态 \(q'\) 推到位置 \(i\)！）</li>
      <li>因此存在一个只依赖机器 \(M\) 的局部转移布尔函数 \(\Delta_M : \{0,1\}^{4r} \to \{0,1\}^r\)，使得对所有位置 \(i\) 都有：
      \[
        B'_i = \Delta_M(B_{i-1}, B_i, B_{i+1}, B_{i+2}).
      \]</li>
    </ul>
  </li>
  <li><b>单步转移电路 \(C_{\mathrm{NEXT}_\ell}\) 的大小 \(= O(\ell)\)</b>：
    <ul>
      <li>因为 \(r = O(1)\) 是与 \(n\) 无关的常数，\(\Delta_M\) 的输入只有常数 \(4r\) 个比特、输出 \(r\) 个比特！由 Shannon 上界定理，可以用一个<b>常数大小 \(O(1)\)</b> 的小子电路 \(C_M\) 计算 \(\Delta_M\)。</li>
      <li>将 \(\ell\) 份子电路 \(C_M\) <b>横向并排放置（in parallel）</b>，第 \(i\) 份读取 \((B_{i-1}, B_i, B_{i+1}, B_{i+2})\) 并输出 \(B'_i\)，就拼成了单步配置推进电路 \(C_{\mathrm{NEXT}_\ell}: \{0,1\}^{r\ell} \to \{0,1\}^{r\ell}\)，其总门数为 \(\ell \times O(1) = O(\ell) = O(T(n))\)。</li>
    </ul>
  </li>
  <li><b>\(T(n)\) 层串联堆叠（Tableau 电路）得到总大小 \(O(T(n)^2)\)</b>：
    <ul>
      <li>将底层输入硬编码为初始配置 \(C_0 = q_0 \sqcup w_1\cdots w_n \sqcup \cdots \sqcup\)（其中 \(\langle w_1 \rangle, \dots, \langle w_n \rangle\) 由电路的 \(n\) 条输入导线 \(x_1, \dots, x_n\) 直接驱动，其余 \(\langle q_0 \rangle, \langle \sqcup \rangle\) 硬连线为常数 \(0/1\)）。</li>
      <li>向上串联堆叠 <b>\(T(n)\) 层</b> \(C_{\mathrm{NEXT}_\ell}\)，依次算出 \(\langle C_1 \rangle, \langle C_2 \rangle, \dots, \langle C_{T(n)} \rangle\)。</li>
      <li>在顶层 \(\langle C_{T(n)} \rangle\) 上加一层 \(O(\ell)\) 大小的辅助门，检查其中是否出现了接受状态编码 \(\langle q_{\mathrm{acc}} \rangle\)。</li>
      <li><b>总电路大小</b>：\(= T(n) \text{ 层} \times O(T(n)) \text{ 门/层} = \mathbf{O(T(n)^2)}\)！当 \(T(n) = n^k\) 时，电路大小为 \(O(n^{2k})\)，故 \(\mathrm{P} \subseteq \mathrm{PSIZE}\)。\(\square\)</li>
    </ul>
  </li>
</ol>

<h2>2. 定理：\(\mathrm{CIRCUIT\text{-}SAT}\) 是 \(\mathrm{NP}\)-Complete（Lecture 17 Slides 6–11）</h2>
<p>我们在 Lecture 14 已证 \(\mathrm{CIRCUIT\text{-}SAT} \in \mathrm{NP}\)（证书为满足赋值 \(x\)，用 \(\mathrm{CVP}\in\mathrm{P}\) 验证）。现在证明它是 <b>\(\mathrm{NP}\)-hard</b>：</p>
<div class="callout ex">
  <strong>证明：对任意 \(Y \in \mathrm{NP}\)，构造多项式时间归约 \(Y \le_P \mathrm{CIRCUIT\text{-}SAT}\)</strong>
  <ol>
    <li>因为 \(Y \in \mathrm{NP}\)，存在一台多项式时间验证机 \(V\) 及常数 \(k_1, k_2\)，使得对任意长为 \(n = |w|\) 的输入串 \(w \in \{0,1\}^n\)：
    \[
      w \in Y \iff \exists c \in \{0,1\}^{n^{k_1}} \text{ 使得 } V(w, c) = 1,
    \]
    且 \(V\) 在 \((w, c)\) 上的运行时间至多为 \(T(n) = O(n^{k_2})\)（可将双带验证机先转成等价的单带图灵机，输入写为 \(w \# c\)，时间仍为多项式 \(T(n) = O(n^k)\)）。</li>
    <li>利用 Lecture 16 的图灵机转电路算法，对于输入总长度 \(m = n + 1 + n^{k_1} = \mathrm{poly}(n)\)，构造模拟验证机 \(V\) 运行 \(T(n)\) 步的布尔电路 \(C^V\)，其输入导线分为两部分：前 \(n\) 条对应原输入 \(x_1, \dots, x_n\)，后 \(n^{k_1}\) 条对应证书位 \(c_1, \dots, c_{n^{k_1}}\)。电路 \(C^V\) 的大小为 \(O(T(n)^2) = O(n^{2k})\)，且构造 \(C^V\) 本身只需 \(O(n^{2k})\) 多项式时间！</li>
    <li><b>硬编码输入 \(w\)（Hard-coding \(w\)）</b>：给定具体实例 \(w = w_1\cdots w_n\)，归约函数 \(f(w)\) 将电路 \(C^V\) 的前 \(n\) 条输入导线分别硬编码（替换）为具体比特常量 \(w_1, \dots, w_n\)，而<b>保留代表证书 \(c\) 的那 \(n^{k_1}\) 条导线作为新电路 \(C^V_w\) 的自由输入变量</b>！输出 \(f(w) = \langle C^V_w \rangle\)。</li>
    <li><b>正确性与多项式时间</b>：
      <ul>
        <li>对任意证书串 \(c \in \{0,1\}^{n^{k_1}}\)，电路输出 \(C^V_w(c) = V(w, c)\)。因此：
        \[
          w \in Y \iff \exists c,\; V(w, c) = 1 \iff \exists c,\; C^V_w(c) = 1 \iff \langle C^V_w \rangle \in \mathrm{CIRCUIT\text{-}SAT}.
        \]</li>
        <li>构造 \(\langle C^V_w \rangle\) 的总耗时为 \(O(|w|^{2k})\)，是 \(|w|\) 的多项式。故 \(Y \le_P \mathrm{CIRCUIT\text{-}SAT}\)！\(\square\)</li>
      </ul>
    </li>
  </ol>
</div>

<h2>3. Cook–Levin 定理：\(\mathrm{SAT}\) 是 \(\mathrm{NP}\)-Complete（Lecture 17 Slides 12–17）</h2>
<p>定义布尔公式可满足性问题 \(\mathrm{SAT} = \{\langle F \rangle \mid F \text{ 是可满足的布尔公式（甚至 CNF 公式）}\}\)。</p>
<ul>
  <li><b>为什么不能直接把电路 \(C\) 暴力展开（unfold）成树状布尔公式？</b><br>
  <b>致命陷阱！</b>如果电路 \(C\) 中每个门的输出都被后续两个门复用，直接把 DAG 展开成树会导致每一层规模翻倍，深度为 \(d\) 的电路展开后叶数高达 \(2^d\)（指数爆炸），归约将不再是多项式时间！</li>
  <li><b>归约传递性（Chaining Reductions，Slide 14）</b>：若 \(Y_1 \le_P Y_2\) 且 \(Y_2 \le_P Y_3\)，则 \(Y_1 \le_P Y_3\)（复合函数 \(f_2(f_1(x))\) 耗时 \(O(|f_1(x)|^{c_2}) + O(|x|^{c_1}) = O(|x|^{c_1 c_2})\) 仍为多项式）。因此要证 \(\mathrm{SAT}\) 是 \(\mathrm{NP}\)-hard，<b>只需证明 \(\mathrm{CIRCUIT\text{-}SAT} \le_P \mathrm{SAT}\)</b>！</li>
</ul>

<div class="callout must">
  <strong>Tseitin 变换：在多项式时间内将任意电路 \(C\) 转化为等可满足的 CNF 公式 \(F_C\)（L17 Slides 15–16，必背！）</strong>
  <p>给定电路 \(C\)（输入变量 \(x_1, \dots, x_n\)，逻辑门 \(g_1, \dots, g_m\)，输出门 \(g_{\mathrm{out}} = g_m\)）：</p>
  <ol>
    <li><b>为每个门引入一个新布尔变量</b>：除保留原输入变量 \(x_1, \dots, x_n\) 外，为每一个门 \(g\) 引入一个代表“门 \(g\) 输出值”的新变量 \(y_g\)。</li>
    <li><b>用局部等价子句集 \(C_g\) 强制约束每个门的输入输出关系</b>（利用逻辑恒等式 \((P \leftrightarrow Q) \equiv (\neg P \lor Q) \land (P \lor \neg Q)\)）：
      <ul>
        <li><b>若 \(g\) 是 <code>NOT</code> 门 \(y_g \leftrightarrow \neg z\)</b>：写出 \(2\) 个子句：
        \[
          C_g = (\neg y_g \lor \neg z) \land (y_g \lor z).
        \]</li>
        <li><b>若 \(g\) 是 \(k\) 扇入 <code>OR</code> 门 \(y_g \leftrightarrow (z_1 \lor z_2 \lor \cdots \lor z_k)\)</b>：拆为 \((y_g \to z_1\lor\cdots\lor z_k)\) 与 \(\bigwedge_{j=1}^k (z_j \to y_g)\)，共 <b>\(k + 1\) 个 CNF 子句</b>：
        \[
          C_g = (\neg y_g \lor z_1 \lor \cdots \lor z_k) \;\land\; \bigwedge_{j=1}^k (y_g \lor \neg z_j).
        \]</li>
        <li><b>若 \(g\) 是 \(k\) 扇入 <code>AND</code> 门 \(y_g \leftrightarrow (z_1 \land z_2 \land \cdots \land z_k)\)</b>：拆为 \((z_1\land\cdots\land z_k \to y_g)\) 与 \(\bigwedge_{j=1}^k (y_g \to z_j)\)，同样共 <b>\(k + 1\) 个 CNF 子句</b>：
        \[
          C_g = (y_g \lor \neg z_1 \lor \cdots \lor \neg z_k) \;\land\; \bigwedge_{j=1}^k (\neg y_g \lor z_j).
        \]</li>
      </ul>
    </li>
    <li><b>组合总公式 \(F_C\)</b>：要求所有门都忠实执行逻辑运算，<b>并且最终输出门的变量 \(y_{g_{\mathrm{out}}}\) 为真</b>：
    <div class="formula">\[
      F_C = y_{g_{\mathrm{out}}} \;\land\; \bigwedge_{g \text{ 是 } C \text{ 中的门}} C_g.
    \]</div></li>
    <li><b>双向正确性与线性规模</b>：
      <ul>
        <li>\((\Rightarrow)\) 若 \(\exists x\) 使 \(C(x) = 1\)，令每个 \(y_g\) 取门 \(g\) 在输入 \(x\) 下的真实计算值，则所有 \(C_g\) 都为真且 \(y_{g_{\mathrm{out}}} = C(x) = 1\)，故 \(F_C\) 可满足；</li>
        <li>\((\Leftarrow)\) 若存在对 \((x, \{y_g\})\) 的赋值满足 \(F_C\)，按拓扑序归纳可知每个 \(C_g\) 强制 \(y_g\) 必须等于门 \(g\) 在输入 \(x\) 下的真实输出，最后单文字子句 \(y_{g_{\mathrm{out}}}\) 强制 \(C(x) = y_{g_{\mathrm{out}}} = 1\)，故 \(C\) 可满足！</li>
        <li>每个扇入为 \(k\) 的门只产生 \(O(k)\) 个文字，完全没有重复展开子树，故 \(|\langle F_C \rangle| = \mathrm{poly}(|\langle C \rangle|)\)。结合 \(\mathrm{SAT} \in \mathrm{NP}\)（证书为变量赋值，线性时间求值公式树），证毕 \(\mathrm{SAT}\)（乃至 \(\mathrm{CNF\text{-}SAT}\)）是 \(\mathrm{NP}\)-complete！\(\square\)</li>
      </ul>
    </li>
  </ol>
</div>
`,
  questions: [
    {
      id: "l1617-q1",
      kind: "single",
      tag: "slide",
      q: String.raw`在 Lecture 16 将运行时间为 \(T(n)\) 的单带图灵机 \(M\) 转化为布尔电路时，若配置编码为 \(C = b_1 b_2 \cdots b_\ell\)（状态符号插在被读字符左侧），下一时刻第 \(i\) 个位置的符号 \(b'_i\) 取决于当前配置中的哪几个位置？由此得到的整张电路总 Size 是多少？`,
      choices: [
        ["a", String.raw`仅取决于 4 个相邻位置 \((b_{i-1}, b_i, b_{i+1}, b_{i+2})\)；单层电路大小为 \(O(T(n))\)，堆叠 \(T(n)\) 层后总电路 Size 为 \(O(T(n)^2)\)`],
        ["b", String.raw`取决于整个配置的所有 \(\ell\) 个位置；总电路 Size 为 \(O(2^{T(n)})\)`],
        ["c", String.raw`仅取决于 \(b_i\) 自己 1 个位置；总电路 Size 为 \(O(T(n))\)`],
        ["d", String.raw`取决于 2 个位置 \((b_{i-1}, b_i)\)；总电路 Size 为 \(O(T(n)^3)\)`]
      ],
      answer: ["a"],
      why: String.raw`在 \(u_k q v_1 v_2\) 配置表示下，左移时 \(i+1\) 处的状态 \(q\) 和 \(i+2\) 处的字符 \(v_1\) 会决定 \(i\) 处的新状态 \(q'\)，故 4 格窗口 \((b_{i-1}, b_i, b_{i+1}, b_{i+2})\) 完全足够。每步局部转移电路 \(O(1)\)，一层 \(\ell = O(T(n))\)，共 \(T(n)\) 层，总大小 \(O(T(n)^2)\)。`
    },
    {
      id: "l1617-q2",
      kind: "single",
      tag: "slide",
      q: String.raw`在证明 \(\mathrm{CIRCUIT\text{-}SAT}\) 是 \(\mathrm{NP}\)-hard 时，对任意 \(Y \in \mathrm{NP}\)（验证机为 \(V\)）及输入实例 \(w\)，归约函数 \(f(w)\) 构造出的布尔电路 \(C^V_w\) 的自由输入导线（input wires）代表什么？`,
      choices: [
        ["a", String.raw`原实例 \(w\) 的各个比特已经被硬编码（hard-coded）为常量，自由输入导线只代表验证机所需的证书串 \(c\) 的各个比特`],
        ["b", String.raw`自由输入导线代表原实例 \(w\) 的各个比特，而证书 \(c\) 被硬编码进了电路`],
        ["c", String.raw`自由输入导线代表验证机 \(V\) 的状态转移表编码 \(\langle V \rangle\)`],
        ["d", String.raw`\(C^V_w\) 没有任何自由输入导线`]
      ],
      answer: ["a"],
      why: String.raw`归约机器已知具体输入 \(w\)，但不知道满足证书 \(c\)（否则归约机器自己就解出了 NP 问题）。因此把 \(w\) 硬连线固定在电路底部的输入端，把证书 \(c\) 的导线留空作为 \(C^V_w\) 的输入变量，于是 \(\exists c,\, C^V_w(c)=1 \iff \exists c,\, V(w,c)=1 \iff w\in Y\)。`
    },
    {
      id: "l1617-q3",
      kind: "single",
      tag: "slide",
      q: String.raw`在 Cook–Levin 定理证明 \(\mathrm{CIRCUIT\text{-}SAT} \le_P \mathrm{SAT}\) 时，为什么不能直接把电路从输出门向输入端递归展开（unfold）成一棵布尔公式树，而必须为每个门 \(g\) 引入新变量 \(y_g\)？`,
      choices: [
        ["a", String.raw`因为电路中门的输出可以被多个后续门共享复用（fan-out \(>1\)），直接递归展开会使共享子电路被重复复制，在深度为 \(\Theta(n)\) 时导致公式长度呈 \(2^{\Theta(n)}\) 指数爆炸`],
        ["b", String.raw`因为布尔公式中不允许出现 <code>NOT</code> 门`],
        ["c", String.raw`因为布尔电路可能含有有向环，无法展开`],
        ["d", String.raw`因为引入新变量 \(y_g\) 可以使公式与原电路在原变量 \(x\) 上计算完全相同的布尔函数（无需存在量词）`]
      ],
      answer: ["a"],
      why: String.raw`直接展开树在最坏情况下叶数会指数级膨胀，破坏多项式时间归约；而为每个门引入新变量 \(y_g\) 并用 \(k+1\) 个子句刻画 \(y_g \leftrightarrow g(\text{inputs})\)（Tseitin 变换），生成的 CNF 公式长度与电路规模呈线性/多项式关系，且保持<b>等可满足性（equisatisfiability）</b>。`
    },
    {
      id: "l1617-q4",
      kind: "single",
      tag: "slide",
      q: String.raw`在 Lecture 17 的电路转 CNF 公式构造中，对于一个具有 \(k\) 个输入 \(z_1, \dots, z_k\) 的 <code>OR</code> 门 \(g\)（输出变量记为 \(y_g\)），等价约束 \(y_g \leftrightarrow (z_1 \lor \cdots \lor z_k)\) 被展开为哪 \(k + 1\) 个 CNF 子句？`,
      choices: [
        ["a", String.raw`\((\neg y_g \lor z_1 \lor \cdots \lor z_k) \;\land\; \bigwedge_{j=1}^k (y_g \lor \neg z_j)\)`],
        ["b", String.raw`\((y_g \lor z_1 \lor \cdots \lor z_k) \;\land\; \bigwedge_{j=1}^k (\neg y_g \lor z_j)\)`],
        ["c", String.raw`\((y_g \lor \neg z_1 \lor \cdots \lor \neg z_k) \;\land\; \bigwedge_{j=1}^k (\neg y_g \lor z_j)\)`],
        ["d", String.raw`\((\neg y_g \lor \neg z_1 \lor \cdots \lor \neg z_k)\)`]
      ],
      answer: ["a"],
      why: String.raw`\(y_g \to (z_1 \lor \cdots \lor z_k)\) 等价于 \((\neg y_g \lor z_1 \lor \cdots \lor z_k)\)（1 个子句）；\((z_1 \lor \cdots \lor z_k) \to y_g\) 等价于对每个 \(j\) 都有 \(z_j \to y_g\)，即 \(\bigwedge_{j=1}^k (\neg z_j \lor y_g)\)（\(k\) 个子句），合起来共 \(k+1\) 个子句。（选项 c 则是 \(k\) 扇入 <code>AND</code> 门对应的 \(k+1\) 个子句！）`
    }
  ],
  cards: [
    [
      String.raw`如何证明 \(\mathrm{TIME}(T(n)) \subseteq \mathrm{SIZE}(T(n)^2)\)（及 \(\mathrm{P} \subseteq \mathrm{PSIZE}\)）？`,
      String.raw`将每步配置填充为长 \(\ell = O(T(n))\) 的串；由<b>计算局部性</b>，下一配置第 \(i\) 格仅依赖上一配置的 4 格窗口 \((b_{i-1},b_i,b_{i+1},b_{i+2})\)，可用 \(O(1)\) 电路计算 \(\Delta_M\)。单步推进电路 \(C_{\mathrm{NEXT}}\) 大小为 \(O(T(n))\)，串联 \(T(n)\) 层得总大小 \(O(T(n)^2)\)。`
    ],
    [
      String.raw`如何证明 \(\mathrm{CIRCUIT\text{-}SAT}\) 是 \(\mathrm{NP}\)-complete？`,
      String.raw`① \(\in\mathrm{NP}\)：证书为输入赋值 \(x\)，用 \(\mathrm{CVP}\in\mathrm{P}\) 验证 \(C(x)=1\)。<br>② \(\mathrm{NP}\)-hard：对任意 \(Y\in\mathrm{NP}\) 的多项式验证机 \(V(w,c)\)，将其转成 \(O(|w|^{2k})\) 大小的电路 \(C^V\)，把 \(w\) 硬编码进输入线、留证书线 \(c\) 为自由输入得 \(C^V_w\)，则 \(w\in Y \iff \langle C^V_w\rangle \in \mathrm{CIRCUIT\text{-}SAT}\)。`
    ],
    [
      String.raw`Cook–Levin 定理中如何用 Tseitin 变换证明 \(\mathrm{CIRCUIT\text{-}SAT} \le_P \mathrm{SAT}\)？`,
      String.raw`为电路每个门 \(g\) 引入新变量 \(y_g\)，写出局部等价 CNF 子句 \(C_g\)（如 \(k\) 输入 OR 门写 \((\neg y_g\lor z_1\lor\cdots\lor z_k)\land\bigwedge_{j=1}^k(y_g\lor\neg z_j)\) 共 \(k+1\) 个子句），输出总公式 \(F_C = y_{g_{\mathrm{out}}} \land \bigwedge_g C_g\)。避免展开树导致的指数爆炸！`
    ]
  ]
});
