Review.add({
  id: "l01",
  n: 1,
  group: "computability",
  short: "L1 · 集合基数与可数集",
  title: "Lecture 1 · 集合基数、无穷集与可数性证明",
  meta: "双射与单射 · 可数无穷集 · N, Z, N^2, N^k, {0,1}*, Q 的可数性",
  sources: [
    { href: "materials/Lecture0.pdf", label: "Lecture 0–1 Slides" },
    { href: "materials/Tutorial%201.pdf", label: "Tutorial 1 Notes" }
  ],
  html: String.raw`
<h2>1. 集合基数的形式化定义</h2>
<p>计算理论的核心目标是严格界定计算模型的能力边界，即证明存在无法被任何算法求解的计算问题（下界与不可能性定理）。其第一项数学工具是无穷集合的<strong>基数理论（Cardinality Theory）</strong>：通过比较“全体算法（图灵机）集合”与“全体计算问题（语言）集合”的基数大小，直接导出不可计算问题的存在性。</p>

<div class="callout must">
  <strong>定义 1.1（单射、满射与双射）</strong>
  <p>设 \(f: A \to B\) 为从集合 \(A\) 到集合 \(B\) 的函数：</p>
  <ul>
    <li><strong>单射（Injective / One-to-one）</strong>：对任意 \(a, b \in A\)，若 \(a \ne b\)，则 \(f(a) \ne f(b)\)（等价于 \(f(a) = f(b) \implies a = b\)）。</li>
    <li><strong>满射（Surjective / Onto）</strong>：对任意 \(b \in B\)，存在 \(a \in A\) 使得 \(f(a) = b\)。</li>
    <li><strong>双射（Bijective / One-to-one correspondence）</strong>：\(f\) 既是单射又是满射。</li>
  </ul>
</div>

<div class="callout must">
  <strong>定义 1.2（基数相等、小于等于与严格小于）</strong>
  <p>对任意两个集合 \(A\) 与 \(B\)（有限或无限）：</p>
  <ul>
    <li><strong>等势（\(|A| = |B|\)）</strong>：当且仅当存在从 \(A\) 到 \(B\) 的<strong>双射</strong> \(f: A \to B\)。</li>
    <li><strong>基数不大于（\(|A| \le |B|\)）</strong>：当且仅当存在从 \(A\) 到 \(B\) 的<strong>单射</strong> \(f: A \to B\)。</li>
    <li><strong>基数严格小于（\(|A| &lt; |B|\)）</strong>：当且仅当 \(|A| \le |B|\) 且 \(|A| \ne |B|\)（即存在单射 \(A \to B\)，但<strong>不存在</strong>任何双射 \(A \to B\)）。</li>
  </ul>
</div>

<div class="callout ex">
  <strong>定理 1.1（Schröder–Bernstein 定理与基数基本性质）</strong>
  <ol>
    <li><strong>子集单调性</strong>：若 \(A \subseteq B\)，则包含映射 \(\iota(x) = x\) 是从 \(A\) 到 \(B\) 的单射，故 \(|A| \le |B|\)。注意：对无穷集，<strong>\(A \subsetneq B\) 不能推出 \(|A| &lt; |B|\)</strong>（无穷集可以与其真子集等势）。</li>
    <li><strong>传递性</strong>：单射的复合仍是单射，双射的复合仍是双射，因此 \(\le\) 与 \(=\) 均满足传递性。</li>
    <li><strong>Schröder–Bernstein 定理</strong>：若 \(|A| \le |B|\) 且 \(|B| \le |A|\)（即同时存在单射 \(f: A \to B\) 与单射 \(g: B \to A\)），则 \(|A| = |B|\)。该定理允许在无需显式构造双射的情况下，通过双向构造单射证明两集合等势。</li>
  </ol>
</div>

<h2>2. 可数集与可数无穷集</h2>
<p>在本课程约定中，自然数集包含 \(0\)，即 \(\mathbb{N} = \{0, 1, 2, 3, \dots\}\)，正整数集记作 \(\mathbb{Z}^+ = \{1, 2, 3, \dots\}\)。</p>

<div class="callout must">
  <strong>定义 1.3（可数集与可数无穷集）</strong>
  <ul>
    <li>集合 \(A\) 称为<strong>可数无穷的（Countably infinite）</strong>，当且仅当 \(|A| = |\mathbb{N}|\)（その基数记为 \(\aleph_0\)）。</li>
    <li>集合 \(A\) 称为<strong>可数的（Countable / At most countable）</strong>，当且仅当 \(A\) 是有限集，或者 \(A\) 是可数无穷集（等价于 \(|A| \le |\mathbb{N}|\)，即存在单射 \(f: A \to \mathbb{N}\)）。</li>
    <li>若 \(|A| &gt; |\mathbb{N}|\)，则称 \(A\) 为<strong>不可数的（Uncountable）</strong>。</li>
  </ul>
</div>

<div class="callout trap">
  <strong>易错辨析：证明“可数”与证明“可数无穷”的要求差异</strong>
  <ul>
    <li>若题目要求证明集合 \(A\) <strong>可数（countable）</strong>，只需证明 \(|A| \le |\mathbb{N}|\)，即构造一个<strong>单射</strong> \(f: A \to \mathbb{N}\)（或将 \(A\) 单射到已知可数的集合如 \(\mathbb{N}^2, \{0,1\}^*\) 中）。</li>
    <li>若题目要求证明 \(A\) <strong>可数无穷（countably infinite）</strong>，则需要证明 \(|A| = |\mathbb{N}|\)：要么直接构造双射 \(f: \mathbb{N} \to A\)，要么同时给出单射 \(A \to \mathbb{N}\) 与单射 \(\mathbb{N} \to A\) 并调用 Schröder–Bernstein 定理。</li>
  </ul>
</div>

<h2>3. 典型无穷集的可数性证明</h2>

<h3>3.1 正整数集 \(\mathbb{Z}^+\) 与整数集 \(\mathbb{Z}\)</h3>
<p><strong>命题 1.1</strong>：\(|\mathbb{Z}^+| = |\mathbb{N}|\)。</p>
<p><strong>证明</strong>：定义 \(f: \mathbb{N} \to \mathbb{Z}^+\) 为 \(f(x) = x + 1\)。</p>
<ul>
  <li><strong>单射性</strong>：对任意 \(a, b \in \mathbb{N}\)，若 \(f(a) = f(b)\)，则 \(a + 1 = b + 1 \implies a = b\)。</li>
  <li><strong>满射性</strong>：对任意 \(y \in \mathbb{Z}^+\)，取 \(x = y - 1 \in \mathbb{N}\)，满足 \(f(x) = y\)。</li>
</ul>
<p>故 \(f\) 为双射，\(|\mathbb{Z}^+| = |\mathbb{N}|\)（尽管 \(\mathbb{Z}^+ \subsetneq \mathbb{N}\)）。</p>

<p><strong>命题 1.2</strong>：\(|\mathbb{Z}| = |\mathbb{N}|\)。</p>
<p><strong>证明</strong>：按 \(0, -1, 1, -2, 2, -3, 3, \dots\) 的正负交错次序，定义映射 \(f: \mathbb{N} \to \mathbb{Z}\)：</p>
<div class="formula">\[
  f(x) = \begin{cases}
    \dfrac{x}{2}, &amp; \text{若 } x \text{ 为偶数}, \\
    -\dfrac{x + 1}{2}, &amp; \text{若 } x \text{ 为奇数}.
  \end{cases}
\]</div>
<p>其逆映射 \(f^{-1}: \mathbb{Z} \to \mathbb{N}\) 为：当 \(z \ge 0\) 时 \(f^{-1}(z) = 2z\)；当 \(z &lt; 0\) 时 \(f^{-1}(z) = -2z - 1\)。由于非负整数映射至全体偶数、负整数映射至全体奇数，\(f\) 是从 \(\mathbb{N}\) 到 \(\mathbb{Z}\) 的双射，故 \(|\mathbb{Z}| = |\mathbb{N}|\)。</p>

<h3>3.2 二维与 \(k\) 维自然数格点 \(\mathbb{N}^2\) 与 \(\mathbb{N}^k\)</h3>
<p><strong>定理 1.2</strong>：\(|\mathbb{N} \times \mathbb{N}| = |\mathbb{N}|\)。</p>
<p><strong>证明（方法一：算术基本定理 + Schröder–Bernstein 定理）</strong>：</p>
<ol>
  <li><strong>方向一（\(|\mathbb{N}| \le |\mathbb{N}^2|\)）</strong>：定义 \(g: \mathbb{N} \to \mathbb{N}^2\) 为 \(g(x) = (x, 0)\)。显然 \(g(a) = g(b) \implies (a,0) = (b,0) \implies a = b\)，故 \(g\) 是单射。</li>
  <li><strong>方向二（\(|\mathbb{N}^2| \le |\mathbb{N}|\)）</strong>：定义 \(f: \mathbb{N}^2 \to \mathbb{N}\) 为
  <div class="formula">\[
    f(x, y) = 2^x \cdot 3^y.
  \]</div>
  设 \(f(x, y) = f(a, b)\)，即 \(2^x 3^y = 2^a 3^b\)。由<strong>算术基本定理（质因数分解唯一性）</strong>，正整数分解为质数幂乘积的方式唯一，因此必有 \(x = a\) 且 \(y = b\)。故 \(f\) 是单射。</li>
</ol>
<p>结合两个方向，由 Schröder–Bernstein 定理得 \(|\mathbb{N}^2| = |\mathbb{N}|\)。</p>

<p><strong>证明（方法二：Cantor 对角线配对双射）</strong>：按反对角线 \(x + y = s\)（\(s = 0, 1, 2, \dots\)）依次枚举 \((0,0), (0,1), (1,0), (0,2), (1,1), (2,0), \dots\)，给出显式双射 \(\pi: \mathbb{N}^2 \to \mathbb{N}\)：</p>
<div class="formula">\[
  \pi(x, y) = \frac{(x + y)(x + y + 1)}{2} + x.
\]</div>

<p><strong>推论 1.1</strong>：对任意固定正整数 \(k \ge 1\)，\(|\mathbb{N}^k| = |\mathbb{N}|\)。</p>
<p><strong>证明</strong>：对 \(k\) 作数学归纳法。基础步 \(k = 1, 2\) 已证。归纳步：假设 \(|\mathbb{N}^{k-1}| = |\mathbb{N}|\)，即存在双射 \(h: \mathbb{N}^{k-1} \to \mathbb{N}\)。将 \(\mathbb{N}^k\) 视为 \(\mathbb{N}^{k-1} \times \mathbb{N}\)，利用 \(h\) 与 \(f: \mathbb{N}^2 \to \mathbb{N}\) 复合得双射 \((x_1,\dots,x_{k-1},x_k) \mapsto f(h(x_1,\dots,x_{k-1}), x_k)\)（或直接利用前 \(k\) 个素数构造单射 \(p_1^{x_1} p_2^{x_2} \cdots p_k^{x_k}\)）。</p>

<h3>3.3 全体有限二进制串 \(\{0, 1\}^*\) 与有理数集 \(\mathbb{Q}\)</h3>
<p><strong>定理 1.3</strong>：全体有限长度二进制串的集合 \(\{0, 1\}^* = \{\varepsilon, 0, 1, 00, 01, 10, 11, 000, \dots\}\) 是可数无穷集，即 \(|\{0, 1\}^*| = |\mathbb{N}|\)。</p>
<p><strong>证明</strong>：</p>
<ul>
  <li><strong>直接双射（规范序 / 冠首 \(1\) 二进制编码）</strong>：对任意 \(w \in \{0, 1\}^*\)，在其左端冠以字符 \(1\) 得到非空二进制串 \(1w\)，将其解释为标准二进制正整数 \((1w)_2 \in \mathbb{Z}^+\)，定义 \(f(w) = (1w)_2 - 1 \in \mathbb{N}\)。例如 \(\varepsilon \mapsto (1)_2 - 1 = 0\)，\(0 \mapsto (10)_2 - 1 = 1\)，\(1 \mapsto (11)_2 - 1 = 2\)，\(00 \mapsto (100)_2 - 1 = 3\)。这与按串长分层、同长度按字典序排列的枚举完全一致，是 \(\{0,1\}^* \to \mathbb{N}\) 的双射。</li>
  <li><strong>陷阱警示</strong>：<strong>绝不能直接将 \(w\) 本身按二进制值映射到 \(\mathbb{N}\)</strong>，因为前导零会导致 \(0, 00, 000\) 全部映射到 \(0\)，破坏单射性；也<strong>不能按無限深字典序（先排所有以 \(0\) 开头的串 \(0, 00, 000, \dots\)）枚举</strong>，因为这样永远无法数到串 \(1\)。</li>
</ul>

<p><strong>定理 1.4</strong>：有理数集 \(\mathbb{Q}\) 是可数无穷集，即 \(|\mathbb{Q}| = |\mathbb{N}|\)。</p>
<p><strong>证明</strong>：一方面 \(\mathbb{N} \subseteq \mathbb{Q} \implies |\mathbb{N}| \le |\mathbb{Q}|\)。另一方面，每个有理数 \(r \in \mathbb{Q}\) 均可唯一表示为最简分数 \(r = (-1)^s \frac{p}{q}\)，其中符号位 \(s \in \{0, 1\}\)（对 \(r = 0\) 规定 \(s = 0, p = 0, q = 1\)），分子 \(p \in \mathbb{N}\)，分母 \(q \in \mathbb{Z}^+\) 且 \(\gcd(p, q) = 1\)。定义映射 \(f: \mathbb{Q} \to \mathbb{N}^3\) 为 \(f(r) = (s, p, q)\)，或直接映射到 \(\mathbb{N}\) 为 \(g(r) = 2^s \cdot 3^p \cdot 5^q\)。由最简分数表示的唯一性，\(g\) 是单射，故 \(|\mathbb{Q}| \le |\mathbb{N}|\)。由 Schröder–Bernstein 定理得 \(|\mathbb{Q}| = |\mathbb{N}|\)。</p>
`,
  questions: [
    {
      id: "l01-q1",
      kind: "single",
      tag: "slide",
      q: String.raw`根据集合基数的形式化定义，下列关于两个集合 \(A, B\) 的表述中，哪一项是正确的？`,
      choices: [
        ["a", String.raw`\(|A| \le |B|\) 当且仅当存在从 \(A\) 到 \(B\) 的单射（injective function）`],
        ["b", String.raw`若 \(A \subsetneq B\)（\(A\) 是 \(B\) 的真子集），则必然有 \(|A| &lt; |B|\)`],
        ["c", String.raw`\(|A| &lt; |B|\) 当且仅当存在单射 \(f: A \to B\) 且存在某个函数 \(g: A \to B\) 不是双射`],
        ["d", String.raw`若存在满射 \(f: A \to B\)，则必然有 \(|A| = |B|\)`]
      ],
      answer: ["a"],
      why: String.raw`\(|A| \le |B|\) 的定义为存在单射 \(f: A \to B\)。无穷集可以与其真子集等势（如 \(\mathbb{Z}^+ \subsetneq \mathbb{N}\) 但 \(|\mathbb{Z}^+| = |\mathbb{N}|\)），故 B 错误；\(|A| &lt; |B|\) 要求不存在<strong>任何</strong>从 \(A\) 到 \(B\) 的双射，故 C 错误。`
    },
    {
      id: "l01-q2",
      kind: "single",
      tag: "slide",
      q: String.raw`在证明 \(|\mathbb{N} \times \mathbb{N}| \le |\mathbb{N}|\) 时，课堂讲义构造了映射 \(f(x, y) = 2^x \cdot 3^y\)。该映射之所以是单射（injective），依赖的核心数学定理是什么？`,
      choices: [
        ["a", String.raw`算术基本定理（正整数的素因数分解唯一性）`],
        ["b", String.raw`鸽巢原理（Pigeonhole Principle）`],
        ["c", String.raw`康托尔对角化定理`],
        ["d", String.raw`二项式定理`]
      ],
      answer: ["a"],
      why: String.raw`由于 \(2\) 和 \(3\) 是不同的素数，若 \(2^x 3^y = 2^a 3^b\)，根据算术基本定理（唯一分解定理），指数必须分别相等，即 \(x = a\) 且 \(y = b\)。若改用 \(4^x 2^y = 2^{2x+y}\)，则 \(f(1,0) = f(0,2) = 4\)，不再是单射。`
    },
    {
      id: "l01-q3",
      kind: "single",
      tag: "practice",
      q: String.raw`为什么在枚举全体有限二进制串 \(\{0, 1\}^*\) 以证明其可数时，不能直接将二进制串 \(w\) 映射为其自身的二进制数值 \(\mathrm{val}_2(w) \in \mathbb{N}\)，而需要先在左端拼接一个 \(1\) 构造 \(w \mapsto (1w)_2 - 1\)？`,
      choices: [
        ["a", String.raw`因为直接按二进制取值会让含前导零的不同字符串（如 \(0, 00, 000\)）以及空串冲突到相同数值，破坏单射性`],
        ["b", String.raw`因为二进制串的长度可能是无限的`],
        ["c", String.raw`因为 \(\mathrm{val}_2(w)\) 的值可能不是有理数`],
        ["d", String.raw`因为不加前导 \(1\) 就无法对包含字符 \(1\) 的字符串求值`]
      ],
      answer: ["a"],
      why: String.raw`在 \(\{0,1\}^*\) 中，\(0\)、\(00\)、\(000\) 是三个互不相同的字符串，但直接按二进制求值都等于 \(0\)；冠以首字符 \(1\) 后分别变为 \((10)_2=2, (100)_2=4, (1000)_2=8\)，消除了前导零引起的碰撞，构成到 \(\mathbb{Z}^+\) 的双射。`
    },
    {
      id: "l01-q4",
      kind: "tf",
      tag: "slide",
      q: String.raw`判断正误：要证明一个集合 \(A\) 是可数集（countable），只需构造一个从 \(A\) 到某个已知可数集（如 \(\mathbb{N}, \mathbb{N}^2\) 或 \(\{0,1\}^*\)）的单射即可，无需构造满射。`,
      answer: ["t"],
      why: String.raw`正确。可数集定义为 \(|A| \le |\mathbb{N}|\)。若存在单射 \(f: A \to B\) 且 \(|B| \le |\mathbb{N}|\)（存在单射 \(g: B \to \mathbb{N}\)），则复合函数 \(g \circ f: A \to \mathbb{N}\) 仍为单射，从而 \(|A| \le |\mathbb{N}|\)。`
    },
    {
      id: "l01-q5",
      kind: "tf",
      tag: "slide",
      q: String.raw`（Tutorial 1）判断正误：空集 \(\emptyset\) 是可数集（countable），但不是可数无穷集（countably infinite）。`,
      answer: ["t"],
      why: String.raw`正确。空函数是 \(\emptyset \to \mathbb{N}\) 的单射（单射条件 \(\forall a,b \in \emptyset,\, f(a)=f(b)\implies a=b\) 恒为空真），故 \(|\emptyset| \le |\mathbb{N}|\)，空集可数；但 \(|\emptyset| = 0 \ne |\mathbb{N}|\)，故不是可数无穷。`
    },
    {
      id: "l01-q6",
      kind: "tf",
      tag: "slide",
      q: String.raw`（Tutorial 1）判断正误：为了证明整数集 \(\mathbb{Z}\) 可数，可以先依次枚举完所有非负整数 \(0, 1, 2, 3, \dots\)，然后再枚举所有负整数 \(-1, -2, -3, \dots\)。`,
      answer: ["f"],
      why: String.raw`错误！Tutorial 1 特别强调：非负整数已经有无穷多个，若先列完非负整数，则 \(-1\) 排在无穷多个元素之后，在自然数下标 \(\mathbb{N}\) 中没有任何有限位置！必须正负交错枚举：\(0, -1, 1, -2, 2, \dots\)。`
    },
    {
      id: "l01-q7",
      kind: "tf",
      tag: "slide",
      q: String.raw`（Tutorial 1）判断正误：因为有理数集 \(\mathbb{Q}\) 在实数轴上是稠密的（任意两个不同实数之间都有无穷多个有理数），所以 \(\mathbb{Q}\) 是不可数的。`,
      answer: ["f"],
      why: String.raw`错误！拓扑上的“稠密性”与集合论中的“基数大小”无关。通过既约分数到 \(\mathbb{Z} \times \mathbb{N}^2\) 的单射（或网格对角线枚举）可严格证明 \(|\mathbb{Q}| = |\mathbb{N}|\)，即 \(\mathbb{Q}\) 是可数无穷集。`
    }
  ],
  cards: [
    [
      String.raw`集合基数关系 \(|A|=|B|\)、\(|A|\le|B|\)、\(|A|&lt;|B|\) 的形式化定义是什么？`,
      String.raw`\(|A|=|B|\iff\) 存在双射 \(f:A\to B\)；\(|A|\le|B|\iff\) 存在单射 \(f:A\to B\)；\(|A|&lt;|B|\iff\) 存在单射 \(A\to B\) 但<strong>不存在</strong>双射 \(A\to B\)。`
    ],
    [
      String.raw`如何用一句话证明 \(|\mathbb{N}\times\mathbb{N}|\le|\mathbb{N}|\)？`,
      String.raw`构造映射 \(f(x,y)=2^x 3^y\)。由算术基本定理（唯一素因数分解），\(2^x 3^y = 2^a 3^b \implies x=a \land y=b\)，故 \(f\) 是单射。`
    ],
    [
      String.raw`如何构造从 \(\mathbb{N}\) 到 \(\mathbb{Z}\) 的显式双射？`,
      String.raw`按 \(0, -1, 1, -2, 2, \dots\) 交错排列：偶数 \(x\mapsto x/2\)，奇数 \(x\mapsto -(x+1)/2\)。`
    ],
    [
      String.raw`为什么全体有限二进制串 \(\{0,1\}^*\) 是可数无穷集？`,
      String.raw`按长度分层（同长度按字典序）排列：\(\varepsilon, 0, 1, 00, 01, 10, 11, \dots\)，对应显式双射 \(w \mapsto (1w)_2 - 1\)。`
    ]
  ]
});
