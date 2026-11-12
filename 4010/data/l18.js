Review.add({
  id: "l18",
  n: 18,
  group: "quiz3",
  short: "L18–20 · 空间复杂性与 Savitch",
  title: "Lecture 18（含 L19–20 衔接）· 空间复杂性、时空层次定理、类 L / NL / PSPACE 与 STCONN",
  meta: "只读输入双带模型 SPACE(s) · L, PSPACE, EXPSPACE · BALANCED ∈ L · NP ⊆ PSPACE · SPACE(s) ⊆ TIME(2^O(s)) · 空间层次定理 · L ≠ PSPACE · 单向证书与 NL · STCONN 与 Savitch 定理",
  sources: [
    { href: "materials/CSC4010_Lecture18(Annotated).pdf", label: "Lecture 18 (Annotated)" }
  ],
  html: String.raw`
<p class="lede">时间一旦消耗就无法收回，而<b>内存空间（Space）是可以擦除并反复重用的</b>！Lecture 18 开启空间复杂性理论：为了研究对数空间（\(o(n)\) 次线性空间），我们必须采用<b>只读输入带 + 读写工作带</b>的双带图灵机模型，由此建立 \(\mathrm{L} \subseteq \mathrm{NL} \subseteq \mathrm{P} \subseteq \mathrm{NP} \subseteq \mathrm{PSPACE}\)，证明空间层次定理与 \(\mathrm{L} \ne \mathrm{PSPACE}\)，并引入图可达性问题 \(\mathrm{STCONN}\) 及后续 Lecture 19–20 的 Savitch 定理框架。</p>

<h2>1. 为什么要换用“只读输入带 + 工作带”的双带图灵机？（L18 Slides 3–5）</h2>
<ul>
  <li><b>单带图灵机的缺陷</b>：在单带图灵机上，输入串 \(w \in \{0,1\}^n\) 本身就已经占据了 \(n\) 个格子；只要把输入完整读一遍，访问过的格子数就至少是 \(n\)，根本无法定义和区分像 \(O(\log n)\) 这样的<b>次线性空间（sublinear space, \(o(n)\)）</b>算法！</li>
  <li><b>形式化定义 \(\mathrm{SPACE}(s(n))\)（L18 Slide 4，必考！）</b>：称语言 \(L \in \mathrm{SPACE}(s)\)，如果存在一台<b>双带图灵机（two-tape TM）\(M\)</b> 满足：
    <ol>
      <li>\(M\) 判定 \(L\)（在所有输入上停机）；</li>
      <li><b>第 1 条带（输入带）是严格只读的（read-only）</b>：\(M\) 绝不修改第 1 条带上的任何符号；</li>
      <li><b>只统计第 2 条带（工作带 work tape）访问的格子数</b>：记 \(s_M(n)\) 为对任意长 \(n\) 的输入 \(w \in \{0,1\}^n\)，第 2 条工作带读写头访问过的最远格子编号最大值，要求 \(s_M(n) = O(s(n))\)。</li>
    </ol>
  </li>
  <li><b>三大确定性空间复杂性类（Slide 5）</b>：
  <div class="formula">\[
    \mathrm{L} = \mathrm{SPACE}(\log n), \qquad \mathrm{PSPACE} = \bigcup_{k \ge 1} \mathrm{SPACE}(n^k), \qquad \mathrm{EXPSPACE} = \bigcup_{k \ge 1} \mathrm{SPACE}(2^{n^k}).
  \]</div>
  </li>
  <li><b>示例：\(\mathrm{BALANCED} = \{x \in \{0,1\}^* : x \text{ 中 } 0 \text{ 和 } 1 \text{ 的个数相等}\} \in \mathrm{L}\)（Slide 6）</b>：<br>
  给定长 \(n\) 的输入 \(x\)，在工作带上维护一个<b>二进制计数器</b>（最大值为 \(n\)，仅占 \(\lceil\log_2(n+1)\rceil = O(\log n)\) 格！）：第一遍从左到右扫描只读输入带统计 \(1\) 的个数（二进制写在工作带上），第二遍统计 \(0\) 的个数并逐位比对是否相等。全程工作带空间 \(O(\log n)\)，故 \(\mathrm{BALANCED} \in \mathrm{L}\)！（对比：在单带图灵机上用隔一抹一法判定它至少改写了输入带 \(\Theta(n)\) 格。）</li>
</ul>

<h2>2. 空间重用的威力：\(\mathrm{SAT} \in \mathrm{PSPACE}\) 与 \(\mathrm{NP} \subseteq \mathrm{PSPACE}\)（Slide 7）</h2>
<ul>
  <li><b>引理：\(\mathrm{SAT} \in \mathrm{PSPACE}\)（甚至线性空间 \(\mathrm{SPACE}(n)\)！）</b>：<br>
  给定含 \(m\) 个变量的布尔公式 \(\langle F \rangle\)（输入长度为 \(n \ge m\)），虽然枚举全部 \(2^m\) 个赋值需要指数时间，但在工作带上我们只需分配 \(m\) 个比特存储<b>当前正在尝试的那一个赋值 \(a \in \{0,1\}^m\)</b>，再用多项式工作空间算出 \(F(a)\)：若 \(F(a)=1\) 立即接受；否则将工作带上的二进制数 \(a\) 加 \(1\)（<b>复用同一块内存擦掉旧计算过程！</b>）继续试下一个赋值。全部 \(2^m\) 个赋值试完仍无满足者则拒绝。总工作空间仅为 \(O(n)\)，故 \(\mathrm{SAT} \in \mathrm{PSPACE}\)！</li>
  <li><b>推论：\(\mathrm{NP} \subseteq \mathrm{PSPACE}\)</b>：<br>
  <em>证明一（经 Cook–Levin 归约）</em>：对任意 \(A \in \mathrm{NP}\)，有 \(A \le_P \mathrm{SAT}\)（多项式时间归约输出的 \(|f(x)| \le O(|x|^k)\)），在工作带上算出 \(f(x)\)（占 \(O(|x|^k)\) 空间）再跑 \(\mathrm{SAT}\) 的多项式空间判定机，总空间仍为多项式！<br>
  <em>证明二（直接枚举证书）</em>：设 \(V(x, c)\) 是 \(A\) 的 \(O(n^k)\) 时间验证机。在工作带上依次枚举所有长度 \(\le O(n^k)\) 的证书串 \(c\)，每次复用同一片 \(O(n^k)\) 工作空间模拟 \(V(x, c)\)（因为 \(O(n^k)\) 步最多访问 \(O(n^k)\) 格内存！）。故 \(\mathrm{NP} \subseteq \mathrm{PSPACE}\)。</li>
</ul>

<h2>3. 时空关系定理、空间层次定理与 \(\mathrm{L} \ne \mathrm{PSPACE}\)（L18 Slides 8–12）</h2>

<div class="callout must">
  <strong>定理 18.1（时空转换定理：\(\mathrm{SPACE}(s) \subseteq \mathrm{TIME}(2^{O(s)})\), Slide 8）</strong>
  <p>对任意满足 \(s(n) \ge \log n\) 的函数 \(s: \mathbb{N} \to \mathbb{N}\)，都有 \(\mathrm{SPACE}(s(n)) \subseteq \mathrm{TIME}\bigl(2^{O(s(n))}\bigr)\)。特别地，<b>\(\mathrm{L} \subseteq \mathrm{P}\)</b>（因为 \(2^{O(\log n)} = n^{O(1)}\)）且 \(\mathrm{PSPACE} \subseteq \mathrm{EXPTIME}\)。</p>
  <p><b>配置计数证明（必背！）</b>：</p>
  <ol>
    <li>设双带判定机 \(M\) 使用至多 \(O(s(n))\) 格工作带空间判定 \(L\)。在固定输入 \(x \in \{0,1\}^n\) 上，一个完整配置由四部分唯一决定：(i) 当前状态 \(q \in Q\)（\(|Q|\) 种）；(ii) 只读输入带磁头位置（\(0 \dots n+1\)，共 \(n+2\) 种）；(iii) 工作带磁头位置（\(O(s(n))\) 种）；(iv) 工作带前 \(O(s(n))\) 个格子上的内容（\(|\Sigma|^{O(s(n))}\) 种）。</li>
    <li>因此，当 \(s(n) \ge \log n\) 时（注意 \(n+2 = 2^{O(\log n)} \le 2^{O(s(n))}\)！），不同配置的总数至多为：
    \[
      |Q| \cdot (n + 2) \cdot O(s(n)) \cdot |\Sigma|^{O(s(n))} = 2^{O(s(n))}.
    \]</li>
    <li>因为 \(M\) 是<b>判定机（必然停机）</b>，其计算历史 \(C_0, C_1, \dots, C_T\) 中<b>绝不可能重复出现两个完全相同的配置 \(C_i = C_j\ (i &lt; j)\)</b>——否则确定性图灵机将永远周期性死循环！由鸽巢原理，停机步数 \(T\) 必定不超过不同配置总数 \(2^{O(s(n))}\)。\(\square\)<br>
    <i>（注：反过来，\(T(n)\) 步最多写 \(T(n)\) 个工作格，故恒有 \(\mathrm{TIME}(T(n)) \subseteq \mathrm{SPACE}(T(n))\)，即 \(\Omega(\log T(n)) \le S(n) \le O(T(n))\)。）</i></li>
  </ol>
</div>

<div class="callout must">
  <strong>定理 18.2（空间层次定理 Space Hierarchy Theorem 与 \(\mathrm{L} \ne \mathrm{PSPACE}\)，Slides 9–11）</strong>
  <ul>
    <li><b>空间可构造函数（Space-constructible）</b>：若存在图灵机在输入 \(1^n\) 上仅使用 \(O(s(n))\) 工作空间算出 \(s(n)\)（如 \(\log n,\ n^c,\ 2^{n^c}\)），则称 \(s\) 是空间可构造的。</li>
    <li><b>空间层次定理</b>：对空间可构造函数 \(s(n) \ge \log n\)，有严格包含：
    <div class="formula">\[
      \mathrm{SPACE}(s(n)) \subsetneq \mathrm{SPACE}\bigl(s(n)\log s(n)\bigr) \quad \text{（教材 Sipser 强化版更给出 } o(g(n)) \implies \mathrm{SPACE}(f) \subsetneq \mathrm{SPACE}(g)\text{）}.
    \]</div>
    （证明思路与时间层次定理同构：带空间计数器和配置步数上限 \(2^{O(s)}\) 防死循环的对角化；因为空间可复用，模拟开销只有一个常数因子，比时间层次定理更紧！）</li>
    <li><b>核心链路与确定无疑的不等式 \(\mathrm{L} \ne \mathrm{PSPACE}\)</b>：综合以上定理，我们拥有完整包含链：
    <div class="formula">\[
      \mathrm{L} \;\subseteq\; \mathrm{NL} \;\subseteq\; \mathrm{P} \;\subseteq\; \mathrm{NP} \;\subseteq\; \mathrm{PSPACE} \;\subseteq\; \mathrm{EXPTIME}.
    \]</div>
    虽然我们目前不知道其中<b>具体哪一步</b>是严格包含（\(\mathrm{L} \stackrel{?}{=} \mathrm{P}\)、\(\mathrm{P} \stackrel{?}{=} \mathrm{NP}\)、\(\mathrm{NP} \stackrel{?}{=} \mathrm{PSPACE}\) 全是未解难题），但由空间层次定理 \(\mathrm{L} = \mathrm{SPACE}(\log n) \subsetneq \mathrm{SPACE}(n) \subseteq \mathrm{PSPACE}\)，我们<b>已经 100% 严格证明了首尾必不相等：\(\mathrm{L} \ne \mathrm{PSPACE}\)</b>（因此上述包含链中<b>至少有一个包含号是严格的</b>）！</li>
  </ul>
</div>

<h2>4. 非确定性空间类 \(\mathrm{NSPACE}(s)\)、\(\mathrm{NL}\) 与单向只读证书（Slides 13–15）</h2>
<div class="callout trap">
  <strong>超级考点：为什么定义 \(\mathrm{NL}\) 的验证机必须要求“证书带只能从左到右单向读一次（read-once, left-to-right）”？</strong>
  <ul>
    <li><b>定义（Slide 13）</b>：\(\mathrm{NSPACE}(s(n))\) 是成员资格可由一台使用 \(O(s(n))\) 工作空间的验证机验证的语言类，但额外强制规定：<b>验证机在证书带（certificate tape）上的读写头只能向右移动（不能左移回退重读），即对证书只能从左到右单趟扫描一次</b>！特别地，<b>\(\mathrm{NL} = \mathrm{NSPACE}(\log n)\)</b>。</li>
    <li><b>为什么要加“单向读一次”限制？</b>如果不限制，允许 \(O(\log n)\) 空间的验证机在多项式长的证书带上自由来回移动重读，那么验证机就可以把证书带当成只读辅助存储，直接逐门验证 \(\mathrm{SAT}\) 或运行验证机的计算历史（Tableau），那将导致“双边可读证书的 logspace 验证类”直接变成整个 <b>\(\mathrm{NP}\)</b>，而不是非确定性对数空间 \(\mathrm{NL}\)！只有规定证书“阅后即焚（单向流式读取，验证机在工作带上只留得住 \(O(\log n)\) 比特的当前状态）”，才精确等价于每步做一次非确定性选择且总内存 \(O(\log n)\) 的非确定性图灵机！</li>
  </ul>
</div>

<h3>有向图连通性问题 \(\mathrm{STCONN}\) 与 Savitch 定理（Slides 14–16 &amp; L19–20 衔接）</h3>
<p>定义有向图步数受限可达性语言（在含 \(n\) 个顶点的有向图中，若存在 \(s \leadsto t\) 路径则必存在长 \(\le n\) 的简单路径，故无界版取 \(k = n\) 即可）：</p>
<div class="formula">\[
  \mathrm{STCONN} = \bigl\{\langle G, s, t, k \rangle \;\big|\; G \text{ 是 } n \text{ 顶点有向图，存在长度 }\le k \text{ 的有向路径从 } s \text{ 到 } t\bigr\}.
\]</div>
<ol>
  <li><b>朴素确定性上界：\(\mathrm{STCONN} \in \mathrm{SPACE}(k \log n)\)（Slide 14）</b>：在工作带上枚举长为 \(k\) 的顶点序列 \(v_0, v_1, \dots, v_k\)（存 \(k\) 个顶点号，每个占 \(\log n\) 位，共 \(O(k\log n)\) 空间），逐条边检查是否在 \(G\) 中。（当 \(k=n\) 时这需要 \(O(n\log n)\) 空间，远大于 \(\log n\)；而常规 BFS/DFS 也需要 \(O(n)\) 位 <code>visited</code> 数组防止死循环！）</li>
  <li><b>定理：\(\mathrm{STCONN} \in \mathrm{NL}\)（Slide 15，必背单向证书构造！）</b>：<br>
  <em>证明</em>：设证书 \(c = \langle v_0, v_1, \dots, v_\ell \rangle\)（\(\ell \le k\)）是从 \(s\) 到 \(t\) 的路径顶点序列。构造 \(O(\log n)\) 工作空间的<b>单向证书验证机 \(V\)</b>：
    <ul>
      <li>在工作带上只维护两个变量：当前顶点 <code>curr</code>（占 \(O(\log n)\) 位）和步数计数器 <code>step</code>（占 \(O(\log k) \le O(\log n)\) 位）。</li>
      <li>从证书带读入第一个顶点 \(v_0\)，检查 \(v_0 == s\)，设 <code>curr = s, step = 0</code>。</li>
      <li>每次从证书带<b>向右顺序读入下一个顶点 \(v_{\text{next}}\)</b>（绝不回头读旧的 \(v_{i-1}\)！）：在只读输入带 \(\langle G \rangle\) 上扫描边表检查有向边 \((\text{curr}, v_{\text{next}})\) 是否存在；若不存在则拒绝，否则令 <code>curr = v_next</code>、<code>step++</code>（检查 <code>step &lt;= k</code>）。</li>
      <li>证书读完时检查 <code>curr == t</code>，是则接受，否则拒绝。全程工作带只存 2 个顶点号和 1 个计数器，总空间 \(O(\log n)\)，且证书严格从左到右单趟读取！\(\square\)</li>
    </ul>
  </li>
  <li><b>Lecture 19 预告（Savitch 定理：\(\mathrm{NSPACE}(s(n)) \subseteq \mathrm{SPACE}(s(n)^2)\) 与 \(\mathrm{PSPACE} = \mathrm{NPSPACE}\)）</b>：<br>
  如何在不用 <code>visited</code> 数组的确定性机器上把 \(\mathrm{STCONN}\) 的空间从 \(O(k\log n)\) 降到 <b>\(O(\log k \cdot \log n)\)</b>（当 \(k=n\) 时即为 \(O(\log^2 n)\)）？<b>分治折半搜索（Middle-First Search）</b>：要判断 \(\mathrm{PATH}(u, v, k)\)（\(u\) 能否在 \(\le k\) 步内到 \(v\)），枚举所有可能的<b>中间点 \(m \in V\)</b>，先递归检查 \(\mathrm{PATH}(u, m, \lfloor k/2 \rfloor)\)，若成功<b>擦除递归栈帧重用同一块空间</b>再去递归检查 \(\mathrm{PATH}(m, v, \lceil k/2 \rceil)\)！递归深度为 \(\lceil\log_2 k\rceil\) 层，每层栈帧只需存 \((u, v, m, k)\) 共 \(O(\log n)\) 位，故总空间仅为 \(O(\log k \cdot \log n)\)！对一般 \(s(n) \ge \log n\) 的非确定性图灵机配置图（含 \(2^{O(s(n))}\) 个顶点）应用同一折半算法，即得 <b>Savitch 定理：\(\mathrm{NSPACE}(s(n)) \subseteq \mathrm{SPACE}(s(n)^2)\)</b>，从而推得 \(\mathrm{NL} \subseteq \mathrm{SPACE}(\log^2 n)\) 以及惊人等式 <b>\(\mathrm{PSPACE} = \mathrm{NPSPACE}\)</b>（多项式的平方仍是多项式）！</li>
</ol>
`,
  questions: [
    {
      id: "l18-q1",
      kind: "single",
      tag: "slide",
      q: String.raw`在研究像 \(\mathrm{L} = \mathrm{SPACE}(\log n)\) 这样的次线性空间复杂性类时，为什么形式化定义必须使用“第 1 条输入带只读、只统计第 2 条工作带访问格数”的双带图灵机，而不能使用标准单带图灵机？`,
      choices: [
        ["a", String.raw`因为在单带图灵机上输入串本身就占了 \(n\) 个格子，读完输入至少访问 \(n\) 格，无法刻画 \(o(n)\)（如 \(O(\log n)\)）的工作内存开销`],
        ["b", String.raw`因为单带图灵机是图灵不完备的，不能判定 \(\mathrm{BALANCED}\)`],
        ["c", String.raw`因为双带图灵机允许在 \(O(1)\) 步内读完长为 \(n\) 的输入`],
        ["d", String.raw`因为单带图灵机无法实现二进制加法`]
      ],
      answer: ["a"],
      why: String.raw`区分只读输入存储与可读写工作内存（RAM），才能准确度量算法除输入本身之外真正消耗的工作空间，从而定义 \(\mathrm{L} = \mathrm{SPACE}(\log n)\)。`
    },
    {
      id: "l18-q2",
      kind: "single",
      tag: "slide",
      q: String.raw`对于 \(s(n) \ge \log n\)，定理 \(\mathrm{SPACE}(s(n)) \subseteq \mathrm{TIME}(2^{O(s(n))})\)（特别是 \(\mathrm{L} \subseteq \mathrm{P}\)）的核心证明依据是什么？`,
      choices: [
        ["a", String.raw`一台使用 \(O(s(n))\) 工作空间的图灵机在长 \(n\) 的输入上至多只有 \(|Q|\cdot(n+2)\cdot O(s(n))\cdot |\Sigma|^{O(s(n))} = 2^{O(s(n))}\) 个不同的配置；若停机判定机运行步数超过不同配置总数，必由鸽巢原理重复同一配置而陷入无限死循环`],
        ["b", String.raw`每访问 1 个工作带格子最多只能消耗 2 步运行时间`],
        ["c", String.raw`由 Savitch 定理直接把空间平方变成时间`],
        ["d", String.raw`因为布尔电路的规模至多为 \(2^n + 1\)`]
      ],
      answer: ["a"],
      why: String.raw`确定性停机图灵机的计算历史中绝不能出现重复配置 \(C_i = C_j\)（否则死循环），因此最坏停机步数受限于全体合法配置的总数 \(2^{O(s(n))}\)。当 \(s(n)=\log n\) 时，\(2^{O(\log n)} = n^{O(1)}\)，故 \(\mathrm{L} \subseteq \mathrm{P}\)。`
    },
    {
      id: "l18-q3",
      kind: "single",
      tag: "slide",
      q: String.raw`对于包含关系链 \(\mathrm{L} \subseteq \mathrm{NL} \subseteq \mathrm{P} \subseteq \mathrm{NP} \subseteq \mathrm{PSPACE}\)，根据目前已知并严格证明的复杂性理论结果，下列哪项陈述是完全准确的？`,
      choices: [
        ["a", String.raw`已经严格证明了 \(\mathrm{L} \ne \mathrm{PSPACE}\)（由空间层次定理），因此这串包含关系中至少有一个是严格包含（\(\subsetneq\)），但具体哪一个是严格的目前全都是未解公开问题`],
        ["b", String.raw`已经严格证明了 \(\mathrm{L} \subsetneq \mathrm{P}\) 以及 \(\mathrm{NP} \subsetneq \mathrm{PSPACE}\)`],
        ["c", String.raw`目前连 \(\mathrm{L} \ne \mathrm{PSPACE}\) 都还没有证明出来`],
        ["d", String.raw`已经证明了 \(\mathrm{NL} = \mathrm{NP}\)`]
      ],
      answer: ["a"],
      why: String.raw`空间层次定理给出 \(\mathrm{SPACE}(\log n) \subsetneq \mathrm{SPACE}(\log^2 n) \subseteq \mathrm{PSPACE}\)，故 \(\mathrm{L} \ne \mathrm{PSPACE}\) 是无条件成立的定理！但 \(\mathrm{L}\stackrel{?}{=}\mathrm{NL}\)、\(\mathrm{L}\stackrel{?}{=}\mathrm{P}\)、\(\mathrm{P}\stackrel{?}{=}\mathrm{NP}\)、\(\mathrm{NP}\stackrel{?}{=}\mathrm{PSPACE}\) 至今均未解决。`
    },
    {
      id: "l18-q4",
      kind: "single",
      tag: "slide",
      q: String.raw`在 Lecture 18 用验证机定义复杂性类 \(\mathrm{NL} = \mathrm{NSPACE}(\log n)\) 时，除了要求验证机的工作空间为 \(O(\log n)\) 外，还必须对证书带（certificate tape）施加什么关键限制？`,
      choices: [
        ["a", String.raw`验证机只能从左到右单向读取证书一次（read-once, left-to-right），不能将证书带磁头左移回退重读`],
        ["b", String.raw`证书的长度至多为 \(O(\log n)\) 比特`],
        ["c", String.raw`验证机可以在证书带上自由读写修改`],
        ["d", String.raw`证书必须是一元编码的全 \(1\) 串`]
      ],
      answer: ["a"],
      why: String.raw`注意：\(\mathrm{STCONN} \in \mathrm{NL}\) 的路径证书包含至多 \(n\) 个顶点，长度是 \(\Theta(n\log n)\)（多项式长，不是 \(O(\log n)\) 长）！如果允许 \(O(\log n)\) 工作空间的验证机在多项式长的证书上双向来回重读，就能直接验证 \(\mathrm{SAT}\)，所定义的类会变成 \(\mathrm{NP}\) 而非 \(\mathrm{NL}\)。`
    }
  ],
  cards: [
    [
      String.raw`复杂性类 \(\mathrm{SPACE}(s(n))\)、\(\mathrm{L}\) 与 \(\mathrm{PSPACE}\) 的形式化定义是什么？`,
      String.raw`使用<b>第 1 带只读（输入带）、第 2 带可读写（工作带）</b>的双带判定机，仅统计工作带访问格数 \(O(s(n))\)。\(\mathrm{L} = \mathrm{SPACE}(\log n)\)，\(\mathrm{PSPACE} = \bigcup_{k\ge 1}\mathrm{SPACE}(n^k)\)。`
    ],
    [
      String.raw`为什么 \(\mathrm{SAT} \in \mathrm{PSPACE}\)（从而 \(\mathrm{NP} \subseteq \mathrm{PSPACE}\)）？`,
      String.raw`空间可以擦除重用！只需在工作带上用 \(m\) 比特依次枚举每个赋值 \(a\in\{0,1\}^m\)，每次复用同一片多项式工作空间求值 \(F(a)\)（或对任意 \(A\in\mathrm{NP}\) 复用空间枚举所有多项式长证书运行验证机 \(V(x,c)\)）。`
    ],
    [
      String.raw`如何证明 \(\mathrm{SPACE}(s) \subseteq \mathrm{TIME}(2^{O(s)})\) 及 \(\mathrm{L} \ne \mathrm{PSPACE}\)？`,
      String.raw`当 \(s(n)\ge\log n\) 时，双带机器的不同配置总数至多为 \(|Q|(n+2)O(s)|\Sigma|^{O(s)} = 2^{O(s)}\)；停机机器不能重复配置，故步数 \(\le 2^{O(s)}\)。由空间层次定理 \(\mathrm{SPACE}(\log n) \subsetneq \mathrm{SPACE}(\log^2 n) \subseteq \mathrm{PSPACE}\) 得 \(\mathrm{L} \ne \mathrm{PSPACE}\)。`
    ],
    [
      String.raw`\(\mathrm{NL}\) 的单向证书定义是什么？如何证明 \(\mathrm{STCONN} \in \mathrm{NL}\)？`,
      String.raw`\(\mathrm{NL}\) 要求 \(O(\log n)\) 工作空间的验证机<b>从左到右单向只读证书一次</b>。对 \(\mathrm{STCONN}\)，证书为路径顶点序列 \(v_0,v_1,\dots,v_\ell\)；工作带只存当前点 <code>curr</code> 与步数 <code>step</code>（共 \(O(\log n)\) 位），每读入下一个 \(v_i\) 检查边 \((\text{curr}, v_i)\in E\) 并覆盖更新 <code>curr</code>。`
    ]
  ]
});
