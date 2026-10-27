Review.add({
  id: "l12",
  n: 12,
  group: "complexity",
  short: "L12 · 类 NP 与 NP 完全性",
  title: "Lecture 12 · 多项式时间验证机、复杂性类 NP、多项式时间归约与 NP 完全性",
  meta: "短证书自然问题 (CLIQUE, 3-COL, SUBSET-SUM) · 证明者-验证者博弈 (完备性与可靠性) · 验证机与类 NP · A <=_P B · NP-hard 与 NP-complete",
  sources: [
    { href: "materials/CSC4010_Lecture12.pdf", label: "Lecture 12 Slides" }
  ],
  html: String.raw`
<h2>1. 具有短证书（Short Certificates）的自然计算问题</h2>
<p>由 Lecture 11 的强时间层次定理，我们已知 \(\mathrm{TIME}(n) \subsetneq \mathrm{TIME}(n^2) \subsetneq \cdots\) 且 \(\mathrm{P} \subsetneq \mathrm{TIME}(2^n)\)。现在我们要探究复杂性类 \(\mathrm{P}\) 的边界：有哪些极其重要的自然问题，我们目前不知道它们是否属于 \(\mathrm{P}\)（找不到多项式时间求解算法），但一旦有人给出了一个候选解（“证据 / 证书”），我们却可以在<strong>多项式时间内快速检验该解的正确性</strong>？</p>

<p>Lecture 12 给出了三个核心代表问题：</p>
<ol>
  <li><strong>团问题 \(\mathrm{CLIQUE}\)</strong>：
  <div class="formula">\[
    \mathrm{CLIQUE} = \{\langle G, k \rangle \mid \text{无向图 } G \text{ 包含一个大小为 } k \text{ 的团}\}.
  \]</div>
  虽然在 \(G = (V, E)\) 中盲目搜索 \(k\)-团需要检查 \(\binom{|V|}{k}\) 个子集，但如果证明者直接告诉你一个顶点子集 \(c = S \subseteq V\)，你只需检查：(i) \(|S| = k\)；(ii) \(S\) 中每对顶点 \(\{u, v\}\) 都在边集 \(E\) 中。这两步检查仅需 \(O(k^2) \le O(|V|^2)\) 多项式时间！</li>
  <li><strong>图三着色问题 \(\text{3-COL}\)</strong>：
  <div class="formula">\[
    \text{3-COL} = \{\langle G \rangle \mid \text{无向图 } G = (V, E) \text{ 的顶点可以用 } \{1, 2, 3\} \text{ 合法染色，使任意相邻顶点颜色不同}\}.
  \]</div>
  给定一个候选染色方案 \(c: V \to \{1, 2, 3\}\)，验证者只需遍历所有边 \(\{u, v\} \in E\) 检查 \(c(u) \ne c(v)\)，耗时 \(O(|V| + |E|)\) 多项式时间。</li>
  <li><strong>子集和问题 \(\mathrm{SUBSET\text{-}SUM}\)</strong>：
  <div class="formula">\[
    \mathrm{SUBSET\text{-}SUM} = \Bigl\{\langle a_1, a_2, \dots, a_n, T \rangle \;\Big|\; a_1, \dots, a_n, T \in \mathbb{N},\; \exists I \subseteq \{1, \dots, n\} \text{ 使得 } \sum_{i \in I} a_i = T\Bigr\}.
  \]</div>
  给定一个候选下标子集 \(c = I \subseteq \{1, \dots, n\}\)，验证者只需将 \(\{a_i\}_{i \in I}\) 相加并比对是否等于 \(T\)，耗时关于输入总比特长度为多项式时间。</li>
</ol>

<h2>2. 证明者-验证者博弈与验证机（Verifier）的形式化定义</h2>
<p>可以将上述“快速验证候选解”的机制抽象为一个全知但不可信的<strong>证明者（Prover：omniscient, unreliable）</strong>与一个多项式时间、持怀疑态度的<strong>验证者（Verifier：poly-time, skeptical）</strong>之间的交互：</p>
<ul>
  <li>给定输入串 \(x \in \{0, 1\}^*\)，证明者试图说服验证者“\(x \in L\)”，为此证明者构造一个<strong>证书串（certificate / proof string / witness）</strong> \(c \in \{0, 1\}^*\) 发送给验证者。</li>
  <li>验证者在多项式时间内检验对偶 \((x, c)\)，并必须同时满足以下两条基本性质：
    <ol>
      <li><strong>完备性（Completeness）</strong>：如果 \(x \in L\)，则<strong>必然存在</strong>某个证书 \(c \in \{0, 1\}^*\) 能够说服验证者接受 \((x, c)\)；</li>
      <li><strong>可靠性（Soundness）</strong>：如果 \(x \notin L\)，则<strong>无论证明者提供什么</strong>所谓的“证书” \(c \in \{0, 1\}^*\)，验证者都必须识破谎言并拒绝 \((x, c)\)。</li>
    </ol>
  </li>
</ul>

<div class="callout must">
  <strong>定义 12.1（验证机 Verifier 与其识别/判定的语言，Lecture 12 Slides 6–9）</strong>
  <ol>
    <li><strong>验证机（Verifier）</strong>：是一台除了常规工作带之外，还拥有一条专门的<strong>证书带（special certificate tape）</strong>的图灵机 \(V\)。验证机 \(V\) 的输入是一个二元组 \((x, c)\)，其中<strong>输入串 \(x \in \{0, 1\}^*\)</strong> 写在常规工作带上，<strong>证书串 \(c \in \{0, 1\}^*\)</strong> 写在证书带上。</li>
    <li><strong>验证机识别与判定的语言 \(L(V)\)</strong>：验证机 \(V\) 所识别的语言定义为：
    <div class="formula">\[
      L(V) = \bigl\{x \in \{0, 1\}^* \;\big|\; \exists c \in \{0, 1\}^* \text{ 使得 } V \text{ 接受 } (x, c)\bigr\}.
    \]</div>
    如果验证机 \(V\) 在<strong>所有输入对 \((x, c)\) 上都停机</strong>，则称 \(V\) <strong>判定（decides）</strong>语言 \(L(V)\)。</li>
    <li><strong>多项式时间验证机（Polynomial-Time Verifier）</strong>：如果验证机 \(V\) 判定其语言 \(L(V)\)，且存在常数 \(k \ge 0\)，使得对任意输入 \(x\) 和任意证书 \(c\)，\(V\) 在 \((x, c)\) 上的运行时间关于<strong>原输入长度 \(n = |x|\)</strong> 是 \(O(n^k)\)，则称 \(V\) 为<strong>多项式时间验证机</strong>。</li>
  </ol>
</div>

<div class="callout ex">
  <strong>关键推论（证书的多项式长度界）</strong>
  <p>由于多项式时间验证机 \(V\) 在 \((x, c)\) 上的总运行步数至多为 \(O(|x|^k)\)（注意：是以 \(|x|\) 为自变量，而不是 \(|x| + |c|\)！），在 \(O(|x|^k)\) 步内 \(V\) 的证书带读写头最多只能读取证书 \(c\) 的前 \(O(|x|^k)\) 个比特。因此，对任意多项式时间验证机 \(V\) 和任意 \(x \in L(V)\)，<strong>必然存在一个长度关于 \(|x|\) 为多项式（\(|c| \le O(|x|^k)\)）的短证书 \(c\) 使 \(V\) 接受 \((x, c)\)</strong>。</p>
</div>

<h2>3. 复杂性类 \(\mathrm{NP}\) 的形式化定义与实例</h2>

<div class="callout must">
  <strong>定义 12.2（复杂性类 \(\mathrm{NP}\)，Lecture 12 Slide 9）</strong>
  <p>复杂性类 \(\mathrm{NP}\) 是所有可以被<strong>多项式时间验证机</strong>判定的语言的集合：</p>
  <div class="formula">\[
    \mathrm{NP} = \bigl\{L \subseteq \{0, 1\}^* \;\big|\; \text{存在一台多项式时间验证机 } V \text{ 使得 } L = L(V)\bigr\}.
  \]</div>
</div>

<div class="callout trap">
  <strong>概念澄清：\(\mathrm{NP}\) 的含义与 \(\mathrm{P} \subseteq \mathrm{NP}\)</strong>
  <ul>
    <li>\(\mathrm{NP}\) 代表 <strong>Nondeterministic Polynomial time（非确定性多项式时间）</strong>，<strong>绝不代表“Not Polynomial（非多项式时间）”</strong>！</li>
    <li><strong>定理：\(\mathrm{P} \subseteq \mathrm{NP}\)</strong>。证明：对任意 \(L \in \mathrm{P}\)，存在多项式时间图灵机 \(M\) 判定 \(L\)。构造验证机 \(V(x, c)\)：<strong>直接忽略证书带上的 \(c\)</strong>，在 \(x\) 上运行 \(M(x)\) 并输出相同结果。显然 \(V\) 在 \(O(|x|^k)\) 时间内停机，且 \(x \in L \iff \exists c\,(\text{例如 } c = \varepsilon)\text{ 使 } V \text{ 接受 } (x, c)\)，故 \(L \in \mathrm{NP}\)。</li>
  </ul>
</div>

<p><strong>证明语言属于 \(\mathrm{NP}\) 的标准模板（以 \(\mathrm{CLIQUE}\) 和 \(\mathrm{SUBSET\text{-}SUM}\) 为例，Slides 10–11）</strong>：</p>
<ul>
  <li><strong>\(\mathrm{CLIQUE} \in \mathrm{NP}\)</strong>：构造验证机 \(V\)，给定常规带输入 \(x = \langle G, k \rangle\) 和证书带输入 \(c\)：检查 \(c\) 是否编码了图 \(G\) 的一个大小为 \(k\) 的顶点子集，且其中任意两顶点间在 \(G\) 中均有边相连；若是则接受，否则拒绝。该检查在关于 \(|\langle G, k \rangle|\) 的多项式时间内完成，且满足完备性与可靠性。</li>
  <li><strong>\(\mathrm{SUBSET\text{-}SUM} \in \mathrm{NP}\)</strong>：构造验证机 \(V\)，给定常规带输入 \(x = \langle a_1, \dots, a_n, T \rangle\) 和证书带输入 \(c\)：检查 \(c\) 是否编码了下标子集 \(I \subseteq \{1, \dots, n\}\) 且满足 \(\sum_{i \in I} a_i = T\)；若是则接受，否则拒绝。</li>
</ul>

<h2>4. 多项式时间归约（Polynomial-Time Reducibility, \(A \le_P B\)）</h2>
<p>在可计算性理论（Lecture 8）中，我们使用“任意全可计算函数 \(f\)”定义了映射归约 \(A \le_m B\)。进入复杂性理论后，为了保持多项式时间复杂性，我们必须限制归约函数 \(f\) 本身能在<strong>多项式时间内计算完成</strong>。</p>

<div class="callout must">
  <strong>定义 12.3（多项式时间归约 \(A \le_P B\)，Lecture 12 Slide 13）</strong>
  <p>称语言 \(A \subseteq \{0, 1\}^*\) <strong>多项式时间归约到（polynomial-time reducible to）</strong>语言 \(B \subseteq \{0, 1\}^*\)，记作 \(A \le_P B\)，当且仅当存在函数 \(f: \{0, 1\}^* \to \{0, 1\}^*\) 满足：</p>
  <ol>
    <li><strong>保持成员资格</strong>：对每一个 \(x \in \{0, 1\}^*\)，都有
    <div class="formula">\[
      x \in A \iff f(x) \in B;
    \]</div></li>
    <li><strong>多项式时间可计算</strong>：存在一台<strong>多项式时间图灵机 \(F\)</strong>，在任意输入 \(x \in \{0, 1\}^*\) 上于 \(O(|x|^k)\) 步内停机，并将工作带上的输入替换为 \(f(x)\)。</li>
  </ol>
</div>

<div class="callout must">
  <strong>定理 12.1 与推论 12.1（多项式时间归约保持 \(\mathrm{P}\) 与 \(\mathrm{NP}\)，Slides 14–15）</strong>
  <p>对任意两个满足 \(A \le_P B\) 的语言 \(A, B \subseteq \{0, 1\}^*\)：</p>
  <ol>
    <li><strong>定理（向上吸收容易性）</strong>：
      <ul>
        <li>若 \(B \in \mathrm{P}\)，则 \(A \in \mathrm{P}\)；</li>
        <li>若 \(B \in \mathrm{NP}\)，则 \(A \in \mathrm{NP}\)。</li>
      </ul>
      <p><em>证明</em>：(i) 若 \(M_B\) 在 \(O(|y|^d)\) 时间内判定 \(B\)，且 \(F\) 在 \(O(|x|^k)\) 时间内算出 \(y = f(x)\)（从而输出长度必满足 \(|f(x)| \le O(|x|^k)\)），则先运行 \(F\) 再运行 \(M_B(f(x))\) 的总时间为 \(O(|x|^k) + O\bigl((|x|^k)^d\bigr) = O(|x|^{kd})\)，仍是关于 \(|x|\) 的多项式，故 \(A \in \mathrm{P}\)。<br>
      (ii) 若 \(V_B(y, c)\) 是 \(B\) 的多项式时间验证机，构造 \(A\) 的验证机 \(V_A(x, c)\)：先在多项式时间内计算 \(f(x)\)，再运行 \(V_B(f(x), c)\)。则 \(x \in A \iff f(x) \in B \iff \exists c,\, V_B \text{ 接受 } (f(x), c) \iff \exists c,\, V_A \text{ 接受 } (x, c)\)，且总运行时间为多项式，故 \(A \in \mathrm{NP}\)。</p>
    </li>
    <li><strong>推论（逆否命题，向下传递困难性）</strong>：
      <ul>
        <li>若 \(A \notin \mathrm{P}\)，则 \(B \notin \mathrm{P}\)；</li>
        <li>若 \(A \notin \mathrm{NP}\)，则 \(B \notin \mathrm{NP}\)。</li>
      </ul>
    </li>
  </ol>
</div>

<h2>5. \(\mathrm{NP}\)-Hardness 与 \(\mathrm{NP}\)-Completeness</h2>
<div class="callout must">
  <strong>定义 12.4（\(\mathrm{NP}\)-难与 \(\mathrm{NP}\)-完全，Lecture 12 Slide 16）</strong>
  <ul>
    <li><strong>\(\mathrm{NP}\)-难（\(\mathrm{NP}\)-hard）</strong>：称语言 \(L\) 是 \(\mathrm{NP}\)-hard 的，如果 \(\mathrm{NP}\) 中的<strong>每一个</strong>语言 \(A\) 都可以多项式时间归约到 \(L\)，即：
    <div class="formula">\[
      \forall A \in \mathrm{NP},\qquad A \le_P L.
    \]</div></li>
    <li><strong>\(\mathrm{NP}\)-完全（\(\mathrm{NP}\)-complete）</strong>：称语言 \(L\) 是 \(\mathrm{NP}\)-complete 的，如果同时满足以下两个条件：
      <ol>
        <li>\(L \in \mathrm{NP}\)；</li>
        <li>\(L\) 是 \(\mathrm{NP}\)-hard 的（即 \(\forall A \in \mathrm{NP},\, A \le_P L\)）。</li>
      </ol>
    </li>
  </ul>
</div>

<div class="callout must">
  <strong>命题 12.1 与定理 12.2（\(\mathrm{NP}\) 完全问题作为 \(\mathrm{P}\) vs. \(\mathrm{NP}\) 的枢纽，Slides 16–17）</strong>
  <ul>
    <li><strong>命题 12.1</strong>：如果<strong>存在任何一个</strong> \(\mathrm{NP}\)-hard 语言 \(L\) 属于 \(\mathrm{P}\)（即 \(L \in \mathrm{P}\)），那么 \(\mathrm{P} = \mathrm{NP}\)。等价地，如果 \(\mathrm{P} \ne \mathrm{NP}\) 且 \(L\) 是 \(\mathrm{NP}\)-hard 的，则必有 \(L \notin \mathrm{P}\)。<br>
    <em>证明</em>：若 \(L\) 是 \(\mathrm{NP}\)-hard 且 \(L \in \mathrm{P}\)，则对任意 \(A \in \mathrm{NP}\) 都有 \(A \le_P L\)；由定理 12.1(1) 立即推出 \(A \in \mathrm{P}\)，故 \(\mathrm{NP} \subseteq \mathrm{P}\)，结合 \(\mathrm{P} \subseteq \mathrm{NP}\) 即得 \(\mathrm{P} = \mathrm{NP}\)。</li>
    <li><strong>定理 12.2（存在 \(\mathrm{NP}\) 完全语言）</strong>：存在 \(\mathrm{NP}\)-complete 语言。例如有界停机验证语言 \(\mathrm{TMSAT}\)（或有界非确定性接受问题 \(\{\langle V, x, 1^t \rangle \mid \exists c \text{ 使验证机 } V \text{ 在 } t \text{ 步内接受 } (x, c)\}\)）以及 Cook–Levin 定理中的布尔可满足性问题 \(\mathrm{SAT}\)。</li>
  </ul>
</div>
`,
  questions: [
    {
      id: "l12-q1",
      kind: "single",
      tag: "slide",
      q: String.raw`根据 Lecture 12 的形式化定义，多项式时间验证机（polynomial-time verifier）\(V\) 判定语言 \(L\) 时，必须同时满足的“完备性（Completeness）”和“可靠性（Soundness）”分别指什么？`,
      choices: [
        ["a", String.raw`完备性：若 \(x \in L\)，则存在某个证书 \(c \in \{0,1\}^*\) 使 \(V\) 接受 \((x, c)\)；可靠性：若 \(x \notin L\)，则对任意证书 \(c \in \{0,1\}^*\)，\(V\) 都拒绝 \((x, c)\)`],
        ["b", String.raw`完备性：对所有证书 \(c\)，\(V\) 都接受 \((x, c)\)；可靠性：存在某个证书 \(c\) 使 \(V\) 拒绝 \((x, c)\)`],
        ["c", String.raw`完备性：\(V\) 在 \(x \in L\) 上停机；可靠性：\(V\) 在 \(x \notin L\) 上无限循环`],
        ["d", String.raw`完备性：证书 \(c\) 的长度必须是指数级的；可靠性：证书 \(c\) 必须为空串`]
      ],
      answer: ["a"],
      why: String.raw`验证机接收 \((x, c)\) 并在多项式时间内停机。完备性保证真命题一定有合法证明（\(x \in L \implies \exists c,\, V(x,c)\text{ accepts}\)）；可靠性保证假命题绝不可能被伪造的证明蒙混过关（\(x \notin L \implies \forall c,\, V(x,c)\text{ rejects}\)）。`
    },
    {
      id: "l12-q2",
      kind: "single",
      tag: "slide",
      q: String.raw`为什么在复杂性理论中研究 \(\mathrm{P}\) 与 \(\mathrm{NP}\) 时，不能直接使用可计算性理论中的一般映射归约 \(A \le_m B\)，而必须要求归约函数 \(f\) 本身可在<strong>多项式时间内计算</strong>（即 \(A \le_P B\)）？`,
      choices: [
        ["a", String.raw`因为如果允许 \(f\) 花费任意可计算时间（如指数时间），那么归约机器 \(F\) 自己就可以直接用暴力搜索解出 \(A\)（如 \(\mathrm{CLIQUE}\)），导致所有非平凡语言都能平凡归约，无法保留多项式时间复杂性特征`],
        ["b", String.raw`因为非多项式时间的函数都是不可计算的`],
        ["c", String.raw`因为只有多项式时间函数才是单射`],
        ["d", String.raw`因为 \(\mathrm{NP}\) 中的语言都是不可判定的`]
      ],
      answer: ["a"],
      why: String.raw`要使“\(A \le_P B\) 且 \(B \in \mathrm{P} \implies A \in \mathrm{P}\)”成立，计算 \(f(x)\) 的时间加上在 \(f(x)\) 上运行 \(B\) 的多项式判定机的时间必须仍然是 \(|x|\) 的多项式。如果 \(f\) 本身允许花费 \(O(2^n)\) 时间，那么即使 \(B \in \mathrm{P}\)，复合算法也需要指数时间，失去了区分 \(\mathrm{P}\) 与指数时间的能力。`
    },
    {
      id: "l12-q3",
      kind: "single",
      tag: "slide",
      q: String.raw`设语言 \(A, B\) 满足 \(A \le_P B\)（多项式时间归约）。下列哪一项结论必定成立？`,
      choices: [
        ["a", String.raw`若 \(B \in \mathrm{P}\) 则 \(A \in \mathrm{P}\)；若 \(B \in \mathrm{NP}\) 则 \(A \in \mathrm{NP}\)（等价地，若 \(A \notin \mathrm{P}\) 则 \(B \notin \mathrm{P}\)）`],
        ["b", String.raw`若 \(A \in \mathrm{P}\) 则 \(B \in \mathrm{P}\)`],
        ["c", String.raw`若 \(B\) 是 \(\mathrm{NP}\)-hard 的，则 \(A\) 也一定是 \(\mathrm{NP}\)-hard 的`],
        ["d", String.raw`\(A\) 和 \(B\) 必定都不属于 \(\mathrm{P}\)`]
      ],
      answer: ["a"],
      why: String.raw`\(A \le_P B\) 意味着 \(A\) 的多项式时间难度不超过 \(B\)。因此若 \(B\) 容易（在 \(\mathrm{P}\) 或 \(\mathrm{NP}\) 中），则 \(A\) 也容易；取逆否命题：若 \(A\) 难（如 \(A \notin \mathrm{P}\) 或 \(A\) 是 \(\mathrm{NP}\)-hard），则 \(B\) 至少一样难（\(B \notin \mathrm{P}\) 或 \(B\) 也是 \(\mathrm{NP}\)-hard）。注意方向切勿颠倒！`
    },
    {
      id: "l12-q4",
      kind: "single",
      tag: "slide",
      q: String.raw`关于 \(\mathrm{NP}\)-hard（\(\mathrm{NP}\) 难）与 \(\mathrm{NP}\)-complete（\(\mathrm{NP}\) 完全）的定义与性质，下列哪项表述是正确的？`,
      choices: [
        ["a", String.raw`语言 \(L\) 是 \(\mathrm{NP}\)-complete 当且仅当 \(L \in \mathrm{NP}\) 且对所有 \(A \in \mathrm{NP}\) 都有 \(A \le_P L\)；若有任何一个 \(\mathrm{NP}\)-hard 语言属于 \(\mathrm{P}\)，则 \(\mathrm{P} = \mathrm{NP}\)`],
        ["b", String.raw`任何 \(\mathrm{NP}\)-hard 语言都必然属于 \(\mathrm{NP}\)`],
        ["c", String.raw`目前已经严格证明了 \(\mathrm{P} \ne \mathrm{NP}\)，因此所有 \(\mathrm{NP}\)-complete 语言都已经被证明不属于 \(\mathrm{P}\)`],
        ["d", String.raw`\(\mathrm{P}\) 中的语言都不属于 \(\mathrm{NP}\)`]
      ],
      answer: ["a"],
      why: String.raw`\(\mathrm{NP}\)-hard 只要求 \(\forall A \in \mathrm{NP},\, A \le_P L\)，不要求 \(L \in \mathrm{NP}\)（例如不可判定的停机问题 \(\mathrm{HALT}_{\mathrm{TM}}\) 也是 \(\mathrm{NP}\)-hard，但不属于 \(\mathrm{NP}\)）；加上 \(L \in \mathrm{NP}\) 后才称为 \(\mathrm{NP}\)-complete。\(\mathrm{P}\) 是否等于 \(\mathrm{NP}\) 仍是未解决的千禧年大奖难题。`
    }
  ],
  cards: [
    [
      String.raw`复杂性类 \(\mathrm{NP}\) 的验证机（Verifier）定义是什么？`,
      String.raw`\(\mathrm{NP}\) 是所有可由<strong>多项式时间验证机 \(V\)</strong> 判定的语言集合。其中 \(V\) 在所有 \((x, c)\) 上停机、运行时间为 \(O(|x|^k)\)，且 \(x \in L(V) \iff \exists c \in \{0,1\}^*\) 使 \(V\) 接受 \((x, c)\)。`
    ],
    [
      String.raw`多项式时间归约 \(A \le_P B\) 的两个条件及两条传递定理是什么？`,
      String.raw`<strong>条件</strong>：(1) \(\forall x,\, x \in A \iff f(x) \in B\)；(2) \(f\) 可由多项式时间图灵机计算。<br><strong>定理</strong>：(1) \(B \in \mathrm{P} \implies A \in \mathrm{P}\)（逆否：\(A \notin \mathrm{P} \implies B \notin \mathrm{P}\)）；(2) \(B \in \mathrm{NP} \implies A \in \mathrm{NP}\)。`
    ],
    [
      String.raw`区分 \(\mathrm{NP}\)-hard 与 \(\mathrm{NP}\)-complete 的定义，以及它们与 \(\mathrm{P}=\mathrm{NP}\) 的关系。`,
      String.raw`1. <strong>\(\mathrm{NP}\)-hard</strong>：\(\forall A \in \mathrm{NP},\; A \le_P L\)。<br>2. <strong>\(\mathrm{NP}\)-complete</strong>：\(L \in \mathrm{NP}\) 且 \(L\) 是 \(\mathrm{NP}\)-hard。<br>3. 若存在任一 \(\mathrm{NP}\)-hard 语言 \(L \in \mathrm{P}\)，则 \(\mathrm{P} = \mathrm{NP}\)。`
    ]
  ]
});
