Review.add({
  id: "ps5",
  group: "ps",
  n: 5,
  short: "PS5 时间层次·NP与归约",
  title: "Problem Set 5 精讲 · 时间复杂性辨析、2^k 长度语言判定机与独立集 INDEPENDENT-SET",
  meta: "Problem Set 5 · 5 道时间层次判断 + 2 的幂长度 TM 分析 + 独立集验证机与 CLIQUE 归约",
  sources: [
    { label: "Problem Set 5 (Official PDF)", href: "materials/PS5.pdf" }
  ],
  html: String.raw`
<p class="lede">本习题集（Problem Set 5）是期中考试前最后一份作业（属于期中考查范围），全面覆盖 Lecture 10–12 的三大核心考点：<strong>\(\mathrm{TIME}(T(n))\)、\(\mathrm{P}\) 与时间层次定理的边界条件辨析</strong>、<strong>非平凡单带/多带图灵机的时间复杂度 \(\Theta\) 分析</strong>，以及<strong>用“显式证书验证机”与“向 \(\mathrm{CLIQUE}\) 多项式时间归约”两种方法证明 \(\mathrm{INDEPENDENT\text{-}SET} \in \mathrm{NP}\)</strong>。</p>

<h2>1. Problem 1：时间复杂性类与时间层次定理辨析（5 小题全解）</h2>

<h3>(a) 若某台图灵机判定语言 \(L\) 的最坏运行时间为 \(n^2 + 10n + 100\)，则 \(L \in \mathrm{TIME}(n^3)\)</h3>
<div class="callout ex">
  <strong>结论：True（正确）</strong>
  <p><strong>证明</strong>：根据定义，\(\mathrm{TIME}(T(n))\) 是所有可由单带图灵机在 \(O(T(n))\) 步内判定的语言集合。由于 \(n^2 + 10n + 100 \le 111 n^3\) 对一切 \(n \ge 1\) 成立，即 \(n^2 + 10n + 100 = O(n^3)\)，故同一台图灵机已见证 \(L \in \mathrm{TIME}(n^3)\)（即当 \(f(n) = O(g(n))\) 时，\(\mathrm{TIME}(f(n)) \subseteq \mathrm{TIME}(g(n))\)）。</p>
</div>

<h3>(b) 若某台图灵机判定语言 \(L\) 的最坏运行时间为 \(2^n + 10n + 100\)，则 \(L \notin \mathrm{P}\)</h3>
<div class="callout trap">
  <strong>结论：False（错误！经典“某台慢算法 vs 问题本身固有难度”陷阱）</strong>
  <p><strong>反例与解释</strong>：“存在<strong>某一台</strong>图灵机 \(M\) 以指数时间 \(2^n + 10n + 100\) 判定 \(L\)”只给出了判定 \(L\) 的一个<strong>上界</strong>，并不排除存在<strong>另一台更快的图灵机 \(M'\)</strong> 在多项式时间内判定同一个语言 \(L\)！</p>
  <p>例如，取 \(L = \emptyset\)（空语言）。显然 \(L \in \mathrm{P}\)（一台 1 步直接拒绝的图灵机即可判定 \(L\)）。但我们完全可以构造一台故意空转 \(2^n + 10n + 100\) 步后再拒绝的图灵机 \(M\) 来判定 \(L = \emptyset\)。因此不能由某台机器运行慢推出 \(L \notin \mathrm{P}\)。</p>
</div>

<h3>(c) 存在一个可判定语言不属于 \(\mathrm{TIME}(2^n)\)</h3>
<div class="callout ex">
  <strong>结论：True（正确）</strong>
  <p><strong>证明</strong>：取时间可构造函数 \(T(n) = 2^{2n}\)（或利用强时间层次定理取 \(g(n) = 2^{2n}\)）。由于 \(2^n \log(2^n) = n 2^n = o(2^{2n})\)（或在 Lecture 11 版本中取 \(T(n) = 2^{2n}\) 则 \(2^n = o(T(n))\)），由<strong>时间层次定理（Time Hierarchy Theorem）</strong>，存在语言
  \[
    L \in \mathrm{TIME}\!\left((2^{2n})^4\right) \setminus \mathrm{TIME}\!\left(o(2^{2n})\right) \subseteq \mathrm{TIME}(2^{8n}) \setminus \mathrm{TIME}(2^n).
  \]
  凡属于 \(\mathrm{TIME}(2^{8n})\) 的语言均可由图灵机在有限步内停机判定（因此是<strong>可判定语言</strong>），但它不属于 \(\mathrm{TIME}(2^n)\)。</p>
</div>

<h3>(d) 对任意满足 \(f(n)\log f(n) = o(g(n))\) 且 \(g\) 可计算的函数对 \(f, g: \mathbb{N} \to \mathbb{N}\)，均有 \(\mathrm{TIME}(f(n)) \subsetneq \mathrm{TIME}(g(n))\)</h3>
<div class="callout trap">
  <strong>结论：False（错误！缺少“\(g\) 时间可构造”与“\(f(n) \ge n\)”条件，违反 Gap 定理）</strong>
  <p><strong>原因分析</strong>：强时间层次定理成立必须满足两个关键前提：</p>
  <ol>
    <li><strong>\(g(n)\) 必须是时间可构造的（Time-constructible）</strong>，即在输入 \(1^n\) 上可在 \(O(g(n))\) 步内算出 \(1^{g(n)}\)，而<strong>仅仅“\(g\) 可计算（computable）”远远不够</strong>！根据 Lecture 11 的<strong>间隙定理（Gap Theorem）</strong>，存在全可计算函数 \(g(n)\)，使得在 \(g(n)\) 与 \(2^{g(n)}\) 之间没有任何新的可判定语言，即 \(\mathrm{TIME}(g(n)) = \mathrm{TIME}(2^{g(n)})\)，尽管 \(g(n)\log g(n) = o(2^{g(n)})\)。</li>
    <li>此外，还需满足 \(f(n) \ge n\)（若 \(f(n) &lt; n\)，例如 \(f(n)=1, g(n)=\log n\)，图灵机连读完输入都不够，无法执行对角化模拟）。</li>
  </ol>
</div>

<h3>(e) 若 \(A \le_P B\) 且 \(A \in \mathrm{P}\)，则 \(B \in \mathrm{P}\)</h3>
<div class="callout trap">
  <strong>结论：False（错误！归约方向颠倒陷阱）</strong>
  <p><strong>反例与解释</strong>：\(A \le_P B\) 表示“\(A\) 不比 \(B\) 难”（若 \(B \in \mathrm{P}\) 则可推出 \(A \in \mathrm{P}\)）。当 \(A \in \mathrm{P}\) 是简单问题时，\(B\) 完全可以是任意困难（甚至不可判定）的问题！</p>
  <p>例如：取 \(A = \{0, 1\}^* \in \mathrm{P}\)，取 \(B = A_{\mathrm{TM}} \notin \mathrm{P}\)（或取某个固定停机接受的实例 \(w_0 \in B\)，定义常值多项式时间函数 \(f(x) = w_0\)，则对一切 \(x \in \{0,1\}^*\) 均有 \(x \in A \iff f(x) \in B\)，故 \(A \le_P B\)），但 \(B \notin \mathrm{P}\)。</p>
</div>

<h2>2. Problem 2：判定串长是否为 2 的幂 \(L = \{w \in \{0,1\}^* : |w| = 2^k, k \ge 0\}\)</h2>
<p><strong>原题</strong>：Consider \(L = \{w \in \{0, 1\}^* : |w| = 2^k \text{ for some integer } k \ge 0\}\). (a) Give a high-level description of a TM that decides \(L\). (b) Determine a tight asymptotic bound \(\Theta(\cdot)\) on its worst-case running time.</p>

<div class="callout ex">
  <strong>解法一（单带图灵机，隔一划一法，最坏时间 \(\Theta(n \log n)\)）</strong>
  <p><strong>(a) 高层算法描述（Single-tape TM \(M_1\)）</strong>：在工作字母表中引入标记符号 \(\mathtt{X}\)。对输入 \(w \in \{0, 1\}^*\)（设 \(n = |w|\)）：</p>
  <ol>
    <li><strong>阶段 1（空串检查）</strong>：从左端起始格右移一格；若直接读到空白符 \(\sqcup\)（即 \(n = 0\)），因为 \(0 \ne 2^k\)，立即<strong>拒绝</strong>。</li>
    <li><strong>阶段 2（重复折半抹除循环）</strong>：在每一轮循环中，读写头从最左端向右扫描整个输入区（直至遇到右端 \(\sqcup\)），统计未被标记为 \(\mathtt{X}\) 的剩余字符（\(0\) 或 \(1\)），并<strong>每隔一个未标记字符将其改写为 \(\mathtt{X}\)</strong>（即保留第 1 个未标记字符，将第 2 个改写为 \(\mathtt{X}\)，保留第 3 个，将第 4 个改写为 \(\mathtt{X}\)，依此类推）：
      <ul>
        <li>若本轮扫描中<strong>恰好只遇到 1 个未标记字符</strong>（即当前剩余未标记字符数为 \(1\)），则<strong>停机并接受</strong>；</li>
        <li>若本轮扫描中遇到的未标记字符数为<strong>大于 \(1\) 的奇数</strong>，说明当前剩余长度不能被 \(2\) 整除，故初始长度不是 \(2\) 的幂，立即<strong>停机并拒绝</strong>；</li>
        <li>若本轮遇到的未标记字符数为<strong>正偶数</strong>，则此时剩余未标记字符数已精确减半；读写头左移回到输入最左端，进入下一轮循环。</li>
      </ul>
    </li>
  </ol>
  <p><strong>(b) 紧渐近时间复杂度分析（\(\Theta(n \log n)\)）</strong>：</p>
  <ul>
    <li>每一轮从左到右扫描长度为 \(n\) 的输入区并从右向左返回最左端，恰好耗时 \(\Theta(n)\) 步。</li>
    <li>每次循环将未标记字符个数除以 \(2\)。在最坏情况下（当 \(n = 2^k\) 时，需一直除到剩 \(1\) 个字符才停机），共执行 \(k + 1 = \log_2 n + 1 = \Theta(\log n)\) 轮扫描。</li>
    <li>因此，该单带图灵机的最坏情况运行时间为
    \[
      T(n) = \Theta(n) \times \Theta(\log n) = \Theta(n \log n).
    \]</li>
  </ul>
</div>

<div class="callout ex">
  <strong>解法二（双带图灵机，二进制计数器法，最坏时间 \(\Theta(n)\)）</strong>
  <p><strong>(a) 高层算法描述（2-tape TM \(M_2\)）</strong>：</p>
  <ol>
    <li>在带 1 上从左向右单次扫描输入串 \(w\)；每读入带 1 上的一个字符，就在带 2 上维护的<strong>二进制计数器</strong>（低位在左端）上执行一次二进制加 \(1\)（模拟 PS2 Problem 4b 的二进制自增器）。</li>
    <li>当带 1 读完整个输入串 \(w\) 后，带 2 上恰好存储了串长 \(n = |w|\) 的二进制表示。</li>
    <li>扫描带 2 上的二进制数：由于 \(n = 2^k \iff n\) 的二进制表示中<strong>恰好含有 1 个比特 \(1\)</strong>（其余全为 \(0\)），若带 2 上恰有一个 \(1\) 则<strong>接受</strong>，否则<strong>拒绝</strong>。</li>
  </ol>
  <p><strong>(b) 紧渐近时间复杂度分析（\(\Theta(n)\)）</strong>：带 1 扫描 \(n\) 步；带 2 上从 \(0\) 自增 \(n\) 次，第 \(j\) 位发生进位翻转的次数为 \(\lfloor n / 2^j \rfloor\)，总步数为 \(\sum_{j=0}^{\lfloor \log_2 n \rfloor} O(n / 2^j) = O(n)\)；最后扫描带 2 耗时 \(O(\log n)\)。故双带图灵机最坏运行时间为 \(\Theta(n)\)。</p>
</div>

<h2>3. Problem 3：独立集问题 \(\mathrm{INDEPENDENT\text{-}SET} \in \mathrm{NP}\) 的两种证明</h2>
<p><strong>定义</strong>：无向简单图 \(G = (V, E)\) 的<strong>独立集（Independent Set）</strong>是顶点子集 \(I \subseteq V\)，使得 \(I\) 中任意两个不同顶点之间都没有边相连（\(\forall u \ne v \in I,\; \{u, v\} \notin E\)）。定义语言：
\[
  \mathrm{INDEPENDENT\text{-}SET} = \{\langle G, k \rangle : G \text{ has an independent set of size } k\}.
\]</p>

<h3>(a) 直接构造多项式长度证书与多项式时间验证机证明 \(\mathrm{INDEPENDENT\text{-}SET} \in \mathrm{NP}\)</h3>
<div class="callout ex">
  <strong>标准证明</strong>
  <ul>
    <li><strong>证书（Certificate \(c\)）</strong>：给定实例 \(x = \langle G, k \rangle\)，证书 \(c = \langle I \rangle\) 是 \(G\) 的一个顶点子集 \(I \subseteq V\) 的编码（例如列出 \(I\) 中的顶点编号列表，或给出长 \(|V|\) 的 0-1 指示向量）。</li>
    <li><strong>多项式长度性</strong>：由于 \(I \subseteq V\)，\(I\) 至多包含 \(|V|\) 个顶点，每个顶点编号用 \(O(\log |V|)\) 位表示，故证书长度 \(|c| = O(|V| \log |V|) \le O(|x|)\)，关于输入长度 \(|x| = |\langle G, k \rangle|\) 是多项式有界的。</li>
    <li><strong>验证机 \(V(\langle G, k \rangle, c)\) 的算法步骤</strong>：
      <ol>
        <li>检查 \(c\) 是否编码了 \(V\) 的一个合法顶点子集 \(I \subseteq V\)（无重复顶点），且顶点数满足 \(|I| = k\)；若不满足则拒绝。</li>
        <li>遍历 \(I\) 中所有顶点对 \(\{u, v\}\)（\(u \ne v \in I\)），在图 \(G\) 的边集 \(E\)（或邻接矩阵）中检查是否存在边 \(\{u, v\} \in E\)；若发现任一对 \(\{u, v\} \in E\)，则<strong>拒绝</strong>。</li>
        <li>若所有顶点对之间均无边相连，则<strong>接受</strong>。</li>
      </ol>
    </li>
    <li><strong>正确性（完备性与可靠性）与多项式运行时间</strong>：
      <ul>
        <li><strong>完备性</strong>：若 \(\langle G, k \rangle \in \mathrm{INDEPENDENT\text{-}SET}\)，则存在大小为 \(k\) 的独立集 \(I^*\)，取证书 \(c = \langle I^* \rangle\) 必使 \(V\) 接受。</li>
        <li><strong>可靠性</strong>：若 \(\langle G, k \rangle \notin \mathrm{INDEPENDENT\text{-}SET}\)，则任何大小为 \(k\) 的顶点子集都至少包含一条边，任何证书 \(c\) 都会被 \(V\) 拒绝。</li>
        <li><strong>运行时间</strong>：检查 \(|I| = k\) 需 \(O(|x|)\) 时间；检查 \(\binom{k}{2} = O(|V|^2)\) 对顶点是否在 \(E\) 中，每次在图编码中查找耗时 \(O(|x|)\)，总运行时间为 \(O(|V|^2 |x|) = O(|x|^3)\)，是输入长度的多项式。故 \(\mathrm{INDEPENDENT\text{-}SET} \in \mathrm{NP}\)。</li>
      </ul>
    </li>
  </ul>
</div>

<h3>(b) 通过向 \(\mathrm{CLIQUE}\) 作多项式时间归约证明 \(\mathrm{INDEPENDENT\text{-}SET} \in \mathrm{NP}\)</h3>
<div class="callout ex">
  <strong>标准证明（补图归约 \(\mathrm{INDEPENDENT\text{-}SET} \le_P \mathrm{CLIQUE}\)）</strong>
  <ul>
    <li><strong>构造补图归约函数 \(f\)</strong>：对输入 \(x = \langle G, k \rangle\)（其中 \(G = (V, E)\) 为无向简单图），构造 \(G\) 的<strong>补图（Complement Graph）</strong> \(\overline{G} = (V, \overline{E})\)，其顶点集仍为 \(V\)，边集定义为：
    \[
      \overline{E} = \bigl\{\{u, v\} \subseteq V \bigm| u \ne v \text{ 且 } \{u, v\} \notin E\bigr\}.
    \]
    定义归约输出为 \(f(\langle G, k \rangle) = \langle \overline{G}, k \rangle\)（若输入格式非法，则输出固定否定实例）。</li>
    <li><strong>双向正确性证明（\(\langle G, k \rangle \in \mathrm{INDEPENDENT\text{-}SET} \iff \langle \overline{G}, k \rangle \in \mathrm{CLIQUE}\)）</strong>：
    对任意顶点子集 \(S \subseteq V\)（\(|S| = k\)），有等价链：
    \[
      \begin{aligned}
        S \text{ 是 } G \text{ 的独立集} &\iff \forall u \ne v \in S,\; \{u, v\} \notin E \\
        &\iff \forall u \ne v \in S,\; \{u, v\} \in \overline{E} \quad (\text{由 }\overline{E}\text{ 的定义}) \\
        &\iff S \text{ 是 }\overline{G}\text{ 的团（Clique）}.
      \end{aligned}
    \]
    因此 \(G\) 含大小为 \(k\) 的独立集 \(\iff \overline{G}\) 含大小为 \(k\) 的团。</li>
    <li><strong>多项式时间可计算性与结论</strong>：若用邻接矩阵表示图，构造 \(\overline{G}\) 只需将非对角线元素 \(0 \leftrightarrow 1\) 逐位翻转；若用边表表示，只需枚举全部 \(\binom{|V|}{2} = O(|V|^2)\) 个无序顶点对并翻转边的存在性，均可在 \(O(|x|^2)\) 多项式时间内完成。因此 \(\mathrm{INDEPENDENT\text{-}SET} \le_P \mathrm{CLIQUE}\)。已知 \(\mathrm{CLIQUE} \in \mathrm{NP}\)，由 Lecture 12 定理（若 \(A \le_P B\) 且 \(B \in \mathrm{NP}\)，则 \(A \in \mathrm{NP}\)），即证 \(\mathrm{INDEPENDENT\text{-}SET} \in \mathrm{NP}\)。</li>
  </ul>
</div>
`,
  questions: [
    {
      id: "ps5-q1",
      kind: "tf",
      tag: "hw",
      q: String.raw`（PS5 Q1b）判断正误：If a Turing machine decides a language \(L\) with worst-case running time \(2^n + 10n + 100\), then \(L \notin \mathrm{P}\).`,
      answer: ["f"],
      why: String.raw`错误！某一台特定图灵机运行慢（耗时 \(2^n\)）只说明这台机器效率低，并不妨碍存在另一台多项式时间的图灵机判定同一个语言 \(L\)（例如对 \(L = \emptyset \in \mathrm{P}\) 故意空转 \(2^n\) 步后再拒绝）。`
    },
    {
      id: "ps5-q2",
      kind: "tf",
      tag: "hw",
      q: String.raw`（PS5 Q1d）判断正误：对任意满足 \(f(n)\log f(n) = o(g(n))\) 且 \(g\) 可计算（computable）的函数对 \(f, g: \mathbb{N} \to \mathbb{N}\)，必有 \(\mathrm{TIME}(f(n)) \subsetneq \mathrm{TIME}(g(n))\)。`,
      answer: ["f"],
      why: String.raw`错误！时间层次定理要求 \(g(n)\) 是**时间可构造的（time-constructible）**且 \(f(n) \ge n\)。若仅要求 \(g\) 可计算，由间隙定理（Gap Theorem）存在可计算函数 \(g\) 使 \(\mathrm{TIME}(g(n)) = \mathrm{TIME}(2^{g(n)})\)。`
    },
    {
      id: "ps5-q3",
      kind: "single",
      tag: "hw",
      q: String.raw`（PS5 Q2）单带图灵机通过“每轮扫描每隔一个未标记字符打上标记 \(\mathtt{X}\)，使剩余未标记字符数减半”的方法判定 \(L = \{w \in \{0,1\}^* : |w| = 2^k\}\)，其最坏情况运行时间的紧渐近界为：`,
      choices: [
        ["a", String.raw`\(\Theta(n \log n)\)`],
        ["b", String.raw`\(\Theta(n)\)`],
        ["c", String.raw`\(\Theta(n^2)\)`],
        ["d", String.raw`\(\Theta(\log n)\)`]
      ],
      answer: ["a"],
      why: String.raw`每轮往返扫描整个长度为 \(n\) 的输入区耗时 \(\Theta(n)\)，当 \(n = 2^k\) 时共需将剩余字符数折半 \(\log_2 n + 1\) 轮，故总步数为 \(\Theta(n \log n)\)。`
    },
    {
      id: "ps5-q4",
      kind: "single",
      tag: "hw",
      q: String.raw`（PS5 Q3b）在构造多项式时间归约 \(\mathrm{INDEPENDENT\text{-}SET} \le_P \mathrm{CLIQUE}\) 时，归约函数 \(f(\langle G, k \rangle)\) 输出的实例是什么？`,
      choices: [
        ["a", String.raw`\(\langle \overline{G}, k \rangle\)，其中 \(\overline{G} = (V, \overline{E})\) 是将 \(G\) 中非自环边的存在性取反得到的补图，团大小参数仍为 \(k\)`],
        ["b", String.raw`\(\langle G, |V| - k \rangle\)，保持原图不变，仅将参数改为 \(|V| - k\)`],
        ["c", String.raw`\(\langle \overline{G}, |V| - k \rangle\)`],
        ["d", String.raw`\(\langle G, k \rangle\)`]
      ],
      answer: ["a"],
      why: String.raw`顶点子集 \(S \subseteq V\)（\(|S|=k\)）在 \(G\) 中两两无边（独立集），当且仅当 \(S\) 在补图 \(\overline{G}\) 中两两有边（大小为 \(k\) 的团），故参数 \(k\) 保持不变，图取补图 \(\overline{G}\)。`
    }
  ],
  cards: [
    [
      String.raw`（PS5 Q1b）为什么“某台图灵机以 \(2^n\) 步判定 \(L\)”不能推出 \(L \notin \mathrm{P}\)？`,
      String.raw`复杂性类 \(\mathrm{P}\) 问的是“是否存在至少一台多项式时间图灵机判定 \(L\)”；某一台故意空转的慢机器不能排除更快算法的存在。`
    ],
    [
      String.raw`（PS5 Q2）如何用单带图灵机在 \(\Theta(n\log n)\) 时间内判定 \(|w| = 2^k\)？`,
      String.raw`每轮扫描将未标记字符隔一抹一（标记为 \(\mathtt{X}\)）：若遇到奇数个（且 \(&gt;1\)）未标记字符则拒绝；若恰剩 \(1\) 个则接受。共 \(\Theta(\log n)\) 轮，每轮 \(\Theta(n)\) 步。`
    ],
    [
      String.raw`（PS5 Q3）如何把 \(\mathrm{INDEPENDENT\text{-}SET}\) 多项式时间归约到 \(\mathrm{CLIQUE}\)？`,
      String.raw`定义 \(f(\langle G, k \rangle) = \langle \overline{G}, k \rangle\)，其中补图 \(\overline{G} = (V, \overline{E})\) 满足 \(\{u,v\} \in \overline{E} \iff \{u,v\} \notin E\)（\(u \ne v\)）。\(S\) 是 \(G\) 的 \(k\)-独立集 \(\iff S\) 是 \(\overline{G}\) 的 \(k\)-团。`
    ]
  ]
});
