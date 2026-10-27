Review.add({
  id: "l11",
  n: 11,
  group: "complexity",
  short: "L11 · 时间层次定理",
  title: "Lecture 11 · 带时钟对角化、时间可构造函数与时间层次定理（Time Hierarchy Theorem）",
  meta: "可判定但不在 P 中的语言 · 时间可构造函数 · TIME(T^4) \\ TIME(o(T)) != ∅ · 强时间层次定理与间隙定理 · 扩展丘奇-图灵论题",
  sources: [
    { href: "materials/CSC4010_Lecture11.pdf", label: "Lecture 11 Slides" },
    { href: "materials/CSC4010_Lecture11(Annotated).pdf", label: "Lecture 11 Annotated" }
  ],
  html: String.raw`
<h2>1. 核心问题：是否所有可判定语言都在 \(\mathrm{P}\) 中？</h2>
<p>在定义了多项式时间复杂性类 \(\mathrm{P}\) 后，首要的基础理论问题是：<strong>是否存在某个可判定语言 \(Y\)，使得 \(Y \notin \mathrm{P}\)？</strong>更一般地，给图灵机更多的运行时间，是否一定能严格判定更多的语言？</p>
<p>在 Lecture 7 中，我们用对角化证明了 \(L_{\mathrm{self}} = \{\langle M \rangle \mid M \text{ 拒绝 } \langle M \rangle\}\) 不可判定，因为模拟 \(M(\langle M \rangle)\) 可能陷入死循环。如果我们在对角化中<strong>给通用图灵机加装一个“步数倒计时器（Clock）”</strong>，强制只模拟有限步，就能使对角语言变得<strong>可判定</strong>，同时排斥所有运行时间过短的图灵机！</p>

<h2>2. 存在可判定但不在 \(\mathrm{P}\) 中的语言（带时钟对角化）</h2>

<div class="callout must">
  <strong>定理 11.1（存在可判定但满足 \(Y \notin \mathrm{P}\) 的语言，Lecture 11 Slide 11）</strong>
  <p>定义带指数步数上限的自拒绝语言：</p>
  <div class="formula">\[
    Y = \bigl\{\langle M \rangle \;\big|\; M \text{ 是一台单带图灵机，且 } M \text{ 在输入 } \langle M \rangle \text{ 上于 } 2^{|\langle M \rangle|} \text{ 步之内停机并拒绝}\bigr\}.
  \]</div>
  <p>则 \(Y\) 是<strong>可判定的（Decidable）</strong>，但 \(Y \notin \mathrm{P}\)。</p>
</div>

<p><strong>完整证明</strong>：</p>
<ol>
  <li><strong>第一部分：证明 \(Y\) 是可判定的</strong>：
    <p>构造带时钟的模拟机 \(U_{\mathrm{clock}}\)：给定输入 \(\langle M \rangle\)，设 \(n = |\langle M \rangle|\)。\(U_{\mathrm{clock}}\) 先计算出步数预算 \(2^n\)，然后利用通用图灵机 \(U\) 在输入 \(\langle M \rangle\) 上最多模拟 \(M\) 的前 \(2^n\) 步：</p>
    <ul>
      <li>若 \(M\) 在 \(\le 2^n\) 步内停机并进入 \(q_{\mathrm{rej}}\)，则 \(U_{\mathrm{clock}}\) <strong>接受</strong>；</li>
      <li>若 \(M\) 在 \(\le 2^n\) 步内进入 \(q_{\mathrm{acc}}\)，或者跑满 \(2^n\) 步仍未停机，则 \(U_{\mathrm{clock}}\) 立即停止模拟并<strong>拒绝</strong>。</li>
    </ul>
    <p>由于 \(2^n\) 是有限正整数，\(U_{\mathrm{clock}}\) 在任何输入上都必定在有限步内停机，故 \(Y\) 可判定。</p>
  </li>
  <li><strong>第二部分：反证法证明 \(Y \notin \mathrm{P}\)</strong>：
    <p>假设 \(Y \in \mathrm{P}\)，则存在一台单带图灵机 \(R\) 判定 \(Y\)，且其运行时间满足 \(T_R(n) \le c \cdot n^k\)（对某个常数 \(c, k\) 和所有充分大的 \(n\)）。</p>
    <p>由于多项式严格低阶于指数函数（\(c \cdot n^k = o(2^n)\)），对于充分大的输入长度 \(n\)，必有 \(T_R(n) \le c \cdot n^k \le 2^n\)。注意：我们可以通过在图灵机 \(R\) 中<strong>添加若干个永远不可达的哑状态（dummy states）</strong>，在不改变 \(R\) 的任何计算行为和运行步数的前提下，将 \(R\) 的编码长度 \(n_0 = |\langle R \rangle|\) 垫长（padding）到足够大，使得 \(T_R(n_0) \le 2^{n_0}\) 严格成立！</p>
    <p>现在考察 \(R\) 在自身编码 \(\langle R \rangle\)（长度为 \(n_0\)）上的运行结果：</p>
    <ul>
      <li><strong>情形 1：若 \(R\) 接受 \(\langle R \rangle\)</strong>。因为 \(R\) 判定 \(Y\)，这意味着 \(\langle R \rangle \in Y\)；但根据 \(Y\) 的定义，\(\langle R \rangle \in Y\) 要求 \(R\) 在 \(\langle R \rangle\) 上于 \(2^{n_0}\) 步内<strong>拒绝</strong>，矛盾！</li>
      <li><strong>情形 2：若 \(R\) 拒绝 \(\langle R \rangle\)</strong>。因为 \(R\) 的时间复杂度为 \(T_R(n_0) \le 2^{n_0}\)，这意味着 \(R\) 在 \(\langle R \rangle\) 上<strong>确实在 \(2^{n_0}\) 步之内停机并拒绝了</strong>！于是由 \(Y\) 的定义必有 \(\langle R \rangle \in Y\)；但 \(R\) 判定 \(Y\)，所以 \(R\) 应该接受 \(\langle R \rangle\)，同样矛盾！</li>
    </ul>
    <p>两种情形均导出矛盾，故不存在多项式时间判定机 \(R\)，即 \(Y \notin \mathrm{P}\)。</p>
  </li>
</ol>

<h2>3. 时间可构造函数与一般时间层次定理（Time Hierarchy Theorem）</h2>
<p>将上述证明中的 \(2^n\) 替换为任意满足 \(T(n) \ge n\) 的“时间可构造函数”，即可得到计算复杂性理论的奠基定理——<strong>Hartmanis–Stearns 时间层次定理（1965）</strong>。</p>

<div class="callout must">
  <strong>定义 11.1（时间可构造函数 / Time-Constructible Function，Lecture 11 Slide 18）</strong>
  <p>函数 \(T: \mathbb{N} \to \mathbb{N}\)（满足 \(T(n) \ge n\)）称为<strong>时间可构造的（time-constructible）</strong>，如果存在一台图灵机 \(M\)，使得在给定一元输入 \(1^n\) 时：</p>
  <ol>
    <li>\(M\) 停机时工作带上恰好写出 \(1^{T(n)}\)；</li>
    <li>\(M\) 的运行时间复杂度为 \(O(T(n))\)。</li>
  </ol>
  <p class="muted">直观意义：要在模拟中用 \(T(n)\) 作闹钟，图灵机首先必须能在 \(O(T(n))\) 时间内把闹钟的初始刻度 \(T(n)\) 算出来。所有常见初等复杂度函数（如 \(n, n^2, n^k, 2^n, n!\)）都是时间可构造的。</p>
</div>

<div class="callout must">
  <strong>定理 11.2（时间层次定理 / Time Hierarchy Theorem，Lecture 11 Slide 14）</strong>
  <p>对于任意时间可构造函数 \(T: \mathbb{N} \to \mathbb{N}\)（满足 \(T(n) \ge n\)），都存在一个语言 \(Y\)，使得：</p>
  <div class="formula">\[
    Y \in \mathrm{TIME}(T(n)^4) \qquad \text{且} \qquad Y \notin \mathrm{TIME}(o(T(n))).
  \]</div>
</div>

<p><strong>核心证明与 \(O(T(n)^4)\) 上界的精确推导（必考推导！）</strong>：</p>
<p>定义带 \(T(|\langle M \rangle|)\) 步时钟的对角语言：</p>
<div class="formula">\[
  Y = \bigl\{\langle M \rangle \;\big|\; M \text{ 在输入 } \langle M \rangle \text{ 上于 } T(|\langle M \rangle|) \text{ 步之内停机并拒绝}\bigr\}.
\]</div>
<ol>
  <li><strong>为什么 \(Y \in \mathrm{TIME}(T(n)^4)\)？（四带带钟 UTM 转单带的时间核算）</strong>：
    <ul>
      <li>设输入为 \(\langle M \rangle\)，记 \(n = |\langle M \rangle|\)。我们在四带通用图灵机 \(U\)（见 Lecture 6）的基础上增加第 5 条带作为一元倒计时带，先用 \(O(T(n))\) 步构造出 \(1^{T(n)}\)。</li>
      <li><strong>单步模拟开销为 \(O(n)\)</strong>：为了模拟 \(M\) 的 1 步转移，\(U\) 需要扫描机器码带上的转移表 \(\langle \delta \rangle\) 并移动模拟带读写头 \(m\) 格。由于整张转移表 \(\langle \delta \rangle\) 是输入 \(\langle M \rangle\) 的一部分，其长度严格小于 \(n = |\langle M \rangle|\)！因此，在多带通用图灵机上<strong>每模拟 \(M\) 的 1 步，耗时至多为 \(O(n)\) 个实际步数</strong>。</li>
      <li><strong>多带总时间为 \(O(T(n) \cdot n)\)</strong>：最多模拟 \(T(n)\) 步，故多带模拟机的总运行时间为 \(O(T(n)) + T(n) \cdot O(n) = O(n \cdot T(n))\)。</li>
      <li><strong>多带转单带的平方开销导出 \(O(T(n)^4)\)</strong>：由引理 10.1（\(k\) 带转单带耗时平方），将该多带模拟机转换为单带图灵机后，单带总运行时间为：
      <div class="formula">\[
        O\bigl((n \cdot T(n))^2\bigr) = O\bigl(n^2 \cdot T(n)^2\bigr) \;\subseteq\; O\bigl(T(n)^4\bigr) \qquad (\text{因为 } T(n) \ge n \implies n^2 \le T(n)^2).
      \]</div>
      故 \(Y \in \mathrm{TIME}(T(n)^4)\)。</li>
    </ul>
  </li>
  <li><strong>为什么 \(Y \notin \mathrm{TIME}(o(T(n)))\)？</strong>：
    <ul>
      <li>假设存在单带图灵机 \(R\) 在时间 \(T'(n) = o(T(n))\) 内判定 \(Y\)。</li>
      <li>由 \(o(T(n))\) 的定义，存在阈值 \(n_0\) 使得对所有 \(n \ge n_0\) 都有 \(T'(n) \le T(n)\)。通过向 \(R\) 添加不可达哑状态（padding），可令 \(|\langle R \rangle| \ge n_0\)，从而 \(R\) 在 \(\langle R \rangle\) 上必在 \(\le T(|\langle R \rangle|)\) 步内停机。</li>
      <li>此时 \(R\) 接受 \(\langle R \rangle \iff \langle R \rangle \in Y \iff R\) 在 \(T(|\langle R \rangle|)\) 步内拒绝 \(\langle R \rangle \iff R\) 拒绝 \(\langle R \rangle\)，矛盾！</li>
    </ul>
  </li>
</ol>

<h2>4. 强时间层次定理、间隙定理与扩展丘奇-图灵论题</h2>
<ol>
  <li><strong>强时间层次定理（Strong Time Hierarchy Theorem，Hennie–Stearns 1966）</strong>：通过采用更精巧的多带向双带高效归并技术（将多带转双带的开销从 \(O(T^2)\) 降至 \(O(T \log T)\)），可以将 \(T^4\) 收紧为：对任意满足 \(f(n)\log f(n) = o(g(n))\) 且 \(g\) 时间可构造的函数 \(f, g\)，都有
  <div class="formula">\[
    \mathrm{TIME}(f(n)) \subsetneq \mathrm{TIME}(g(n)).
  \]</div>
  由此直接得到无限严格递增的多项式时间层级：
  <div class="formula">\[
    \mathrm{TIME}(n) \subsetneq \mathrm{TIME}(n^2) \subsetneq \mathrm{TIME}(n^3) \subsetneq \cdots \subsetneq \mathrm{P} \subsetneq \mathrm{TIME}(2^n).
  \]</div></li>
  <li><strong>为什么定理必须要求 \(T\) 是“时间可构造的”？（Borodin–Trakhtenbrot 间隙定理 Gap Theorem）</strong>：如果不假设 \(f\) 时间可构造，存在病态的可计算函数 \(f: \mathbb{N} \to \mathbb{N}\)，使得 \(\mathrm{TIME}(f(n)) = \mathrm{TIME}(2^{f(n)})\)（在 \(f(n)\) 与 \(2^{f(n)}\) 之间没有任何图灵机的运行时间落入该区间，因为计算边界 \(f(n)\) 本身就需要远超 \(2^{f(n)}\) 的时间）。</li>
  <li><strong>扩展丘奇-图灵论题（Extended Church–Turing Thesis）</strong>：任何物理上合理的计算模型（如现代 von Neumann 架构的 RAM 计算机）中可在“直观高效（多项式时间）”内完成的算法，都可以在标准图灵机上于<strong>多项式时间</strong>内模拟。该论题面临的主要挑战包括：(a) 常数指数过大的多项式（如 \(n^{100}\)）在实践中并不高效；(b) 随机数生成（随机算法 \(\mathrm{BPP}\)）；(c) <strong>量子计算（Quantum Computing, \(\mathrm{BQP}\)）</strong>（例如 Shor 算法可在多项式量子时间内分解大整数，动摇了确定性版本扩展丘奇-图灵论题）。</li>
</ol>
`,
  questions: [
    {
      id: "l11-q1",
      kind: "single",
      tag: "slide",
      q: String.raw`在 Lecture 11 证明时间层次定理 \(Y = \{\langle M \rangle \mid M \text{ 在 } T(|\langle M \rangle|) \text{ 步内拒绝 } \langle M \rangle\} \in \mathrm{TIME}(T(n)^4)\)（其中 \(T(n) \ge n\)）时，上界 \(O(T(n)^4)\) 是如何一步步推导出来的？`,
      choices: [
        ["a", String.raw`多带 UTM 每模拟一步需扫描长度为 \(n = |\langle M \rangle|\) 的转移表耗时 \(O(n)\)，模拟 \(T(n)\) 步共耗时 \(O(n \cdot T(n))\)；再由多带转单带的平方开销引理得 \(O((n \cdot T(n))^2) = O(n^2 T(n)^2) \subseteq O(T(n)^4)\)`],
        ["b", String.raw`因为通用图灵机有 4 条工作带，所以时间复杂度直接变成 4 次方`],
        ["c", String.raw`因为多带模拟需要 \(O(T(n)^2)\) 步，单带模拟与多带完全相同`],
        ["d", String.raw`因为图灵机每个单元格有 4 种可能符号`]
      ],
      answer: ["a"],
      why: String.raw`这是 Lecture 11 Slide 17 的核心推导：设 \(n = |\langle M \rangle|\)，多带带钟 UTM 每模拟 \(M\) 的 1 步需在长度 \(\le n\) 的机器描述上查表耗时 \(O(n)\)，故 \(T(n)\) 步共需多带时间 \(O(n T(n))\)。转为单带图灵机后时间平方变为 \(O(n^2 T(n)^2)\)，结合 \(n \le T(n)\) 即得 \(O(T(n)^4)\)。`
    },
    {
      id: "l11-q2",
      kind: "single",
      tag: "slide",
      q: String.raw`在证明 \(Y = \{\langle M \rangle \mid M \text{ 在 } T(|\langle M \rangle|) \text{ 步内拒绝 } \langle M \rangle\} \notin \mathrm{TIME}(o(T(n)))\) 时，假设 \(R\) 在时间 \(T'(n) = o(T(n))\) 内判定 \(Y\)。因为 \(T'(n) \le T(n)\) 仅对充分大的 \(n \ge n_0\) 成立，我们如何确保对 \(R\) 自身编码的长度 \(|\langle R \rangle|\) 也有 \(T'(|\langle R \rangle|) \le T(|\langle R \rangle|)\)？`,
      choices: [
        ["a", String.raw`向图灵机 \(R\) 中添加足够多个永远不可达的哑状态（padding），使等价机器的编码长度超过 \(n_0\) 且不改变其运行步数`],
        ["b", String.raw`将输入字母表改为实数集`],
        ["c", String.raw`直接假设 \(n_0 = 0\) 对所有函数都成立`],
        ["d", String.raw`让 \(R\) 在空串 \(\varepsilon\) 上运行`]
      ],
      answer: ["a"],
      why: String.raw`渐近记号 \(T'(n) = o(T(n))\) 只保证当 \(n \ge n_0\) 时 \(T'(n) \le T(n)\)。由于每台图灵机都有无穷多个填充了不可达状态的等价版本，我们可以任取一个编码长度 \(|\langle R' \rangle| \ge n_0\) 的等价版本喂给自身，从而严格触发对角矛盾。`
    },
    {
      id: "l11-q3",
      kind: "single",
      tag: "slide",
      q: String.raw`为什么在时间层次定理（以及强时间层次定理 \(\mathrm{TIME}(f) \subsetneq \mathrm{TIME}(g)\)）中，必须要求上界函数 \(T\)（或 \(g\)）是<strong>时间可构造的（time-constructible）</strong>？`,
      choices: [
        ["a", String.raw`因为带时钟模拟机必须在 \(O(T(n))\) 时间内计算出步数上限 \(1^{T(n)}\) 以设置倒计时器；若去掉该条件，由间隙定理（Gap Theorem）知存在可计算函数 \(f\) 使得 \(\mathrm{TIME}(f(n)) = \mathrm{TIME}(2^{f(n)})\)`],
        ["b", String.raw`因为非时间可构造函数的值一定是负数`],
        ["c", String.raw`因为只有多项式函数才是时间可构造的，指数函数不是时间可构造的`],
        ["d", String.raw`因为时间可构造函数才能保证图灵机停机进入拒绝状态`]
      ],
      answer: ["a"],
      why: String.raw`在对角语言 \(Y\) 的判定机中，机器必须先在 \(O(T(n))\) 步内算出 \(1^{T(n)}\) 作为步数计数器。Trakhtenbrot–Borodin 间隙定理证明了：若不要求时间可构造性，存在增长极快但计算其自身值耗时更长的可计算函数 \(f\)，使得 \(\mathrm{TIME}(f(n)) = \mathrm{TIME}(2^{f(n)})\)。`
    }
  ],
  cards: [
    [
      String.raw`什么是时间可构造函数（Time-Constructible Function）？`,
      String.raw`函数 \(T: \mathbb{N} \to \mathbb{N}\)（\(T(n) \ge n\)）称为时间可构造的，如果存在图灵机在输入 \(1^n\) 上于 \(O(T(n))\) 步内停机并输出 \(1^{T(n)}\)。`
    ],
    [
      String.raw`写出时间层次定理与强时间层次定理的形式化陈述。`,
      String.raw`1. <strong>时间层次定理</strong>：对任意时间可构造函数 \(T(n) \ge n\)，存在语言 \(Y \in \mathrm{TIME}(T(n)^4) \setminus \mathrm{TIME}(o(T(n)))\)。<br>2. <strong>强时间层次定理</strong>：若 \(f(n)\log f(n) = o(g(n))\) 且 \(g\) 时间可构造，则 \(\mathrm{TIME}(f(n)) \subsetneq \mathrm{TIME}(g(n))\)。`
    ]
  ]
});
