Review.add({
  id: "l02",
  n: 2,
  group: "computability",
  short: "L2 · 语言与康托尔对角化",
  title: "Lecture 2 · 计算问题即语言、康托尔定理与第一个不可能性结果",
  meta: "形式语言 · 实数不可数 · 康托尔定理 |P(X)| > |X| · 存在不可判定语言",
  sources: [
    { href: "materials/CSC4010_Lecture2.pdf", label: "Lecture 2 Slides" },
    { href: "materials/CSC4010_Lecture2(Annotated).pdf", label: "Lecture 2 Annotated" },
    { href: "materials/Tutorial%202.pdf", label: "Tutorial 2 Notes" }
  ],
  html: String.raw`
<h2>1. 将计算问题形式化为语言（Languages）</h2>
<p>在理论计算机科学中，任何具有“是/否”答案的<strong>判定问题（Decision Problem）</strong>都可以通过二进制编码统一抽象为一个<strong>语言（Language）</strong>的成员资格问题。</p>

<div class="callout must">
  <strong>定义 2.1（字母表、字符串与形式语言）</strong>
  <ul>
    <li><strong>二进制字母表</strong>：\(\{0, 1\}\)。</li>
    <li><strong>有限二进制串全体</strong>：\(\{0, 1\}^* = \{x_1 x_2 \cdots x_k \mid k \ge 0,\; \forall i,\, x_i \in \{0, 1\}\}\)，其中 \(k = 0\) 对应空串 \(\varepsilon\)。</li>
    <li><strong>语言（Language）</strong>：\(\{0, 1\}^*\) 的任意子集 \(L \subseteq \{0, 1\}^*\) 称为一个语言。</li>
    <li><strong>全体语言的集合</strong>：即 \(\{0, 1\}^*\) 的幂集（Power Set），记为 \(\mathcal{P}(\{0, 1\}^*) = \{L \mid L \subseteq \{0, 1\}^*\}\)。</li>
  </ul>
</div>

<p><strong>计算问题与语言的对应关系</strong>：给定一个判定问题（例如“判断整数 \(x\) 是否为偶数”、“判断字符串 \(w\) 是否为回文串”、“判断图 \(G\) 是否连通”），将所有使答案为“是（YES）”的实例编码串收集起来，就构成对应的语言：</p>
<ul>
  <li>\(\mathrm{EVEN} = \{w \in \{0, 1\}^* \mid w \text{ 以 } 0 \text{ 结尾}\}\)；</li>
  <li>\(\mathrm{PALINDROME} = \{w \in \{0, 1\}^* \mid w = w^R\}\)，其中 \(w^R = w_k w_{k-1} \cdots w_1\) 为字符串反转。</li>
</ul>
<p>因此，<strong>“求解一个判定问题”完全等价于“判定输入串 \(x \in \{0, 1\}^*\) 是否属于语言 \(L\)”</strong>，而全体判定问题的总数等于幂集 \(\mathcal{P}(\{0, 1\}^*)\) 的基数。</p>

<h2>2. 康托尔对角化方法：\(|\mathbb{R}| &gt; |\mathbb{N}|\)</h2>
<p>为求幂集 \(\mathcal{P}(\{0, 1\}^*)\) 的基数，首先证明实数集 \(\mathbb{R}\) 是不可数的（Uncountable）。</p>

<div class="callout ex">
  <strong>定理 2.1（Cantor, 1874/1891）</strong>：实数集不可数，即 \(|\mathbb{N}| &lt; |\mathbb{R}|\)。
</div>

<p><strong>证明</strong>：</p>
<ol>
  <li><strong>包含单射</strong>：由于 \(\mathbb{N} \subseteq \mathbb{R}\)，恒等映射给出 \(|\mathbb{N}| \le |\mathbb{R}|\)。</li>
  <li><strong>对开区间 \((0, 1)\) 反证不存在双射</strong>：由于 \((0, 1) \subseteq \mathbb{R}\)（且通过 \(x \mapsto \tan\bigl(\pi(x - \frac{1}{2})\bigr)\) 可与 \(\mathbb{R}\) 双射），只需证明不存在从 \(\mathbb{N}\) 到 \((0, 1)\) 的满射。假设存在满射 \(f: \mathbb{N} \to (0, 1)\)，将每个 \(f(n)\) 展开为无限十进制小数（为保证表示唯一，约定不采用以无限循环 \(999\dots\) 结尾的展开）：
  <div class="formula">\[
    \begin{aligned}
      f(0) &amp;= 0.\mathbf{d_{0,0}}\, d_{0,1}\, d_{0,2}\, d_{0,3} \cdots \\
      f(1) &amp;= 0.d_{1,0}\, \mathbf{d_{1,1}}\, d_{1,2}\, d_{1,3} \cdots \\
      f(2) &amp;= 0.d_{2,0}\, d_{2,1}\, \mathbf{d_{2,2}}\, d_{2,3} \cdots \\
      &amp;\;\;\vdots
    \end{aligned}
  \]</div>
  </li>
  <li><strong>构造对角实数 \(r \in (0, 1)\)</strong>：定义 \(r = 0.b_0 b_1 b_2 b_3 \cdots\)，其中第 \(k\) 位小数 \(b_k\) 按对角线位置 \(d_{k,k}\) 取反构造：
  <div class="formula">\[
    b_k = \begin{cases}
      4, &amp; \text{若 } d_{k,k} \ne 4, \\
      5, &amp; \text{若 } d_{k,k} = 4.
    \end{cases}
  \]</div>
  （只选用数码 \(4\) 和 \(5\) 可彻底避开 \(0.1999\dots = 0.2000\dots\) 的十进制双表示问题。）</li>
  <li><strong>导出矛盾</strong>：因为 \(r \in (0, 1)\) 且 \(f\) 被假设为满射，必存在某个 \(n \in \mathbb{N}\) 使得 \(f(n) = r\)。然而比较两者的第 \(n\) 位小数：\(f(n)\) 的第 \(n\) 位是 \(d_{n,n}\)，而 \(r\) 的第 \(n\) 位是 \(b_n \ne d_{n,n}\)，故 \(r \ne f(n)\)，矛盾！</li>
</ol>
<p>因此不存在从 \(\mathbb{N}\) 到 \(\mathbb{R}\) 的双射，\(|\mathbb{N}| &lt; |\mathbb{R}|\)。</p>

<h2>3. 全体语言集合 \(\mathcal{P}(\{0, 1\}^*)\) 的不可数性</h2>
<p><strong>定理 2.2</strong>：全体语言的集合 \(\mathcal{P}(\{0, 1\}^*)\) 是不可数的，即 \(|\mathbb{N}| &lt; |\mathcal{P}(\{0, 1\}^*)|\)。</p>
<p><strong>证明（特征序列对角化）</strong>：</p>
<ol>
  <li>将 \(\{0, 1\}^*\) 按规范序枚举为 \(s_0, s_1, s_2, \dots\)。任何语言 \(L \subseteq \{0, 1\}^*\) 都唯一对应一个无穷二进制特征序列 \(\chi_L = (b_0, b_1, b_2, \dots) \in \{0, 1\}^{\mathbb{N}}\)，其中 \(b_j = 1 \iff s_j \in L\)。</li>
  <li>假设 \(\mathcal{P}(\{0, 1\}^*)\) 可数，则可将全体语言枚举为 \(L_0, L_1, L_2, \dots\)。构造<strong>对角语言</strong>：
  <div class="formula">\[
    L_{\mathrm{diag}} = \{s_k \in \{0, 1\}^* \mid s_k \notin L_k\}.
  \]</div>
  </li>
  <li>由于 \(L_{\mathrm{diag}} \subseteq \{0, 1\}^*\) 也是一个语言，列表中必存在某个下标 \(m \in \mathbb{N}\) 使得 \(L_{\mathrm{diag}} = L_m\)。</li>
  <li>考察字符串 \(s_m\) 是否属于 \(L_{\mathrm{diag}}\)：根据 \(L_{\mathrm{diag}}\) 的定义，
  <div class="formula">\[
    s_m \in L_{\mathrm{diag}} \iff s_m \notin L_m \iff s_m \notin L_{\mathrm{diag}},
  \]</div>
  直接产生逻辑矛盾。故 \(\mathcal{P}(\{0, 1\}^*)\) 不可数。</li>
</ol>

<h2>4. 一般康托尔定理（Cantor's Theorem）</h2>
<p>上述对角化论证可以推广到<strong>任意集合 \(X\)</strong> 与其幂集 \(\mathcal{P}(X) = \{S \mid S \subseteq X\}\)，表明无穷集合也有严格递增的无穷基数层级。</p>

<div class="callout must">
  <strong>定理 2.3（康托尔定理，Lecture 2 / Tutorial 2）</strong>
  <p>对任意集合 \(X\)，其幂集的基数严格大于自身的基数，即 \(|X| &lt; |\mathcal{P}(X)|\)。</p>
</div>

<p><strong>形式化证明（课程讲义两种等价写法）</strong>：</p>
<ol>
  <li><strong>证明 \(|X| \le |\mathcal{P}(X)|\)</strong>：定义映射 \(g: X \to \mathcal{P}(X)\) 为单元素集映射 \(g(x) = \{x\}\)。若 \(g(x) = g(y)\)，则 \(\{x\} = \{y\} \implies x = y\)，故 \(g\) 是单射，\(|X| \le |\mathcal{P}(X)|\)。</li>
  <li><strong>证明 \(|X| \ne |\mathcal{P}(X)|\)（写法 A：排除双射 \(f: \mathcal{P}(X) \to X\)，Lecture 2 写法）</strong>：假设存在双射 \(f: \mathcal{P}(X) \to X\)，构造对角子集
  <div class="formula">\[
    D_f = \{x \in X \mid x \notin f^{-1}(x)\}.
  \]</div>
  由于 \(D_f \in \mathcal{P}(X)\)，记 \(y = f(D_f) \in X\)，则 \(f^{-1}(y) = D_f\)。考察 \(y\) 是否属于 \(D_f\)：
  <ul>
    <li>若 \(y \in D_f\)，由 \(D_f\) 的定义知 \(y \notin f^{-1}(y) = D_f\)，矛盾；</li>
    <li>若 \(y \notin D_f\)，即 \(y \notin f^{-1}(y)\)，由 \(D_f\) 的定义知 \(y \in D_f\)，同样矛盾。</li>
  </ul>
  </li>
  <li><strong>证明 \(|X| \ne |\mathcal{P}(X)|\)（写法 B：排除满射 \(h: X \to \mathcal{P}(X)\)，Tutorial 2 写法）</strong>：任取函数 \(h: X \to \mathcal{P}(X)\)，构造 \(D = \{x \in X \mid x \notin h(x)\} \in \mathcal{P}(X)\)。若存在 \(y \in X\) 使 \(h(y) = D\)，则 \(y \in D \iff y \notin h(y) \iff y \notin D\)，矛盾。故不存在从 \(X\) 到 \(\mathcal{P}(X)\) 的满射。</li>
</ol>

<h2>5. 第一个不可能性定理：存在不可判定的语言</h2>
<div class="callout must">
  <strong>定理 2.4（由基数计数导出的不可判定性）</strong>
  <p>存在某个语言 \(L \subseteq \{0, 1\}^*\)，没有任何算法（图灵机 / 计算机程序）能够判定它。</p>
</div>
<p><strong>证明</strong>：</p>
<ol>
  <li>每个算法（或图灵机、C/Python 程序）都可以用有限长度的文本或二进制串 \(\langle M \rangle \in \{0, 1\}^*\) 唯一编码。因此，全体算法的集合 \(\mathcal{M}\) 可以单射到 \(\{0, 1\}^*\) 中，结合定理 1.3 可知 \(|\mathcal{M}| \le |\{0, 1\}^*| = |\mathbb{N}|\)（即<strong>全体图灵机是可数的</strong>）。</li>
  <li>每个图灵机至多判定一个语言，因此全体可判定语言的集合 \(\mathcal{D}\) 满足 \(|\mathcal{D}| \le |\mathcal{M}| \le |\mathbb{N}|\)。</li>
  <li>然而由定理 2.2（或康托尔定理），全体语言的集合 \(\mathcal{P}(\{0, 1\}^*)\) 满足 \(|\mathcal{P}(\{0, 1\}^*)| &gt; |\mathbb{N}|\)（<strong>全体语言是不可数的</strong>）。</li>
  <li>由于 \(|\mathcal{D}| \le |\mathbb{N}| &lt; |\mathcal{P}(\{0, 1\}^*)|\)，必有 \(\mathcal{D} \subsetneq \mathcal{P}(\{0, 1\}^*)\)——不仅存在不可判定语言，而且<strong>绝大多数语言都是不可判定的</strong>。</li>
</ol>
<p class="muted">注：这一非构造性存在性证明引出了 Lecture 3–7 的研究主线：首先严格形式化“图灵机”模型，然后构造出一个显式的、自然的计算问题（如停机问题 \(\mathrm{HALT}_{\mathrm{TM}}\) 和接受问题 \(A_{\mathrm{TM}}\)）并证明其不可判定。</p>
`,
  questions: [
    {
      id: "l02-q1",
      kind: "single",
      tag: "slide",
      q: String.raw`在证明康托尔定理 \(|X| &lt; |\mathcal{P}(X)|\) 时，若假设存在双射 \(f: \mathcal{P}(X) \to X\)，课程讲义构造的对角集合 \(D_f \subseteq X\) 是什么？`,
      choices: [
        ["a", String.raw`\(D_f = \{x \in X \mid x \notin f^{-1}(x)\}\)`],
        ["b", String.raw`\(D_f = \{x \in X \mid x \in f^{-1}(x)\}\)`],
        ["c", String.raw`\(D_f = \{S \subseteq X \mid S \notin f(S)\}\)`],
        ["d", String.raw`\(D_f = \emptyset\)`]
      ],
      answer: ["a"],
      why: String.raw`对每个 \(x \in X\)，\(f^{-1}(x)\) 是 \(X\) 的一个子集。定义 \(D_f = \{x \in X \mid x \notin f^{-1}(x)\}\) 后，令 \(y = f(D_f)\)，即 \(f^{-1}(y) = D_f\)，则 \(y \in D_f \iff y \notin f^{-1}(y) \iff y \notin D_f\)，立刻导出矛盾。`
    },
    {
      id: "l02-q2",
      kind: "single",
      tag: "slide",
      q: String.raw`我们无需给出图灵机的具体状态转移定义，仅凭基数理论就能直接断定“存在无法被任何算法求解的判定问题”，其核心依据是什么？`,
      choices: [
        ["a", String.raw`全体算法的集合可编码为 \(\{0,1\}^*\) 的子集因而是可数的（\(\aleph_0\)），而全体语言的集合 \(\mathcal{P}(\{0,1\}^*)\) 是不可数的（\(2^{\aleph_0}\)）`],
        ["b", String.raw`每个语言都包含无穷多个字符串，因此任何算法都需要无穷长的时间才能读完输入`],
        ["c", String.raw`有理数集 \(\mathbb{Q}\) 是不可数的，而图灵机只能处理整数`],
        ["d", String.raw`\(\{0,1\}^*\) 本身是不可数集合`]
      ],
      answer: ["a"],
      why: String.raw`每个输入串是有限长的，且 \(\{0,1\}^*\) 可数；但一个语言是 \(\{0,1\}^*\) 的一个子集，全体语言构成幂集 \(\mathcal{P}(\{0,1\}^*)\)。由康托尔定理 \(|\mathcal{P}(\{0,1\}^*)| &gt; |\{0,1\}^*| = |\mathbb{N}|\)，不可数的语言集合无法被可数的算法集合完全覆盖。`
    },
    {
      id: "l02-q3",
      kind: "single",
      tag: "slide",
      q: String.raw`在利用康托尔对角化证明区间 \((0, 1)\) 不可数时，为什么构造新实数 \(r = 0.b_0 b_1 b_2 \cdots\) 时通常将 \(b_k\) 选为 \(4\) 或 \(5\)（而非 \(0\) 或 \(9\)）？`,
      choices: [
        ["a", String.raw`为了避免十进制小数表示的不唯一性（例如 \(0.4999\dots = 0.5000\dots\)），确保第 \(n\) 位数字不同就意味着两个实数严格不相等`],
        ["b", String.raw`因为 \(4\) 和 \(5\) 是素数`],
        ["c", String.raw`因为二进制不能表示 \((0,1)\) 中的实数`],
        ["d", String.raw`为了保证构造出的实数 \(r\) 一定是有理数`]
      ],
      answer: ["a"],
      why: String.raw`十进制中尾随无限个 \(9\) 与尾随无限个 \(0\) 表示同一个实数（如 \(0.1999\dots = 0.2000\dots\)）。限制对角构造的数字为 \(4\) 和 \(5\) 后，\(r\) 绝不会以无限个 \(0\) 或 \(9\) 结尾，其十进制展开唯一，从而 \(b_n \ne d_{n,n}\) 严格蕴涵 \(r \ne f(n)\)。`
    },
    {
      id: "l02-q4",
      kind: "tf",
      tag: "practice",
      q: String.raw`判断正误：虽然每个语言 \(L \subseteq \{0, 1\}^*\) 本身最多包含可数无穷个字符串（因为 \(L \subseteq \{0,1\}^*\)），但由全体语言组成的集合 \(\mathcal{P}(\{0, 1\}^*)\) 是不可数的。`,
      answer: ["t"],
      why: String.raw`正确！这是最常见的概念混淆点：<strong>单个语言 \(L\)</strong> 是 \(\{0,1\}^*\) 的子集，因此 \(|L| \le |\{0,1\}^*| = |\mathbb{N}|\)，必定是可数的；但<strong>全体语言的集合 \(\mathcal{P}(\{0,1\}^*)\)</strong> 是幂集，由康托尔定理知其不可数。`
    }
  ],
  cards: [
    [
      String.raw`康托尔定理（Cantor's Theorem）的内容与对角集合构造是什么？`,
      String.raw`对任意集合 \(X\)，\(|X| &lt; |\mathcal{P}(X)|\)。对任意 \(h: X \to \mathcal{P}(X)\)，构造 \(D = \{x \in X \mid x \notin h(x)\}\)（或对双射 \(f: \mathcal{P}(X) \to X\) 构造 \(D_f = \{x \in X \mid x \notin f^{-1}(x)\}\)），代入自身即得矛盾。`
    ],
    [
      String.raw`区分：单个语言 \(L \subseteq \{0,1\}^*\) 是否可数？全体语言的集合 \(\mathcal{P}(\{0,1\}^*)\) 是否可数？`,
      String.raw`<strong>单个语言 \(L\)</strong> 是可数集 \(\{0,1\}^*\) 的子集，故<strong>一定可数</strong>；<strong>全体语言的集合 \(\mathcal{P}(\{0,1\}^*)\)</strong> 是幂集，由康托尔定理知<strong>不可数</strong>。`
    ],
    [
      String.raw`如何用计数法证明“存在不可判定的语言”？`,
      String.raw`(1) 每个图灵机可编码为 \(\{0,1\}^*\) 中的有限串，故全体图灵机可数（\(\le \aleph_0\)）；(2) 全体语言为 \(\mathcal{P}(\{0,1\}^*)\)，不可数（\(2^{\aleph_0} &gt; \aleph_0\)）；(3) 因此必有语言无对应图灵机。`
    ]
  ]
});
