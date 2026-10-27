Review.add({
  id: "l10",
  n: 10,
  group: "complexity",
  short: "L10 · 时间复杂度与类 P",
  title: "Lecture 10 · 时间复杂性、渐近记号、多带平方开销引理与复杂性类 P",
  meta: "CLIQUE 问题引入 · 最坏情况运行时间 T_M(n) · O, Ω, Θ, o, ω · PALINDROME 上下界 · k 带转单带 O(T^2) · 复杂性类 P",
  sources: [
    { href: "materials/Lecture10_CSC4010.pdf", label: "Lecture 10 Slides" },
    { href: "materials/Lecture10_CSC4010(Annotated).pdf", label: "Lecture 10 Annotated" }
  ],
  html: String.raw`
<h2>1. 从可计算性理论走向计算复杂性理论：以 \(\mathrm{CLIQUE}\) 为例</h2>
<p>在前九讲的可计算性理论中，我们只关心一个问题在<strong>无限时间和无限空间</strong>下能否被判定。然而在现实计算中，可判定的问题未必能被实际求解。</p>

<div class="callout must">
  <strong>定义 10.1（团 / \(k\)-Clique 与 \(\mathrm{CLIQUE}\) 语言）</strong>
  <p>给定无向图 \(G = (V, E)\) 和正整数 \(k\)，图 \(G\) 的一个 <strong>\(k\)-团（\(k\)-clique）</strong>是一个顶点子集 \(S \subseteq V\)，满足 \(|S| = k\) 且 \(S\) 中任意两个不同顶点之间都有边相连（即 \(\forall u, v \in S,\, u \ne v \implies \{u, v\} \in E\)）。定义对应的判定语言：</p>
  <div class="formula">\[
    \mathrm{CLIQUE} = \{\langle G, k \rangle \mid G \text{ 是一个包含 } k\text{-团的无向图}\}.
  \]</div>
</div>

<p><strong>\(\mathrm{CLIQUE}\) 的可判定性与指数瓶颈</strong>：\(\mathrm{CLIQUE}\) 显然是<strong>可判定的</strong>——因为 \(V\) 只有有限个顶点，图灵机可以逐一枚举 \(V\) 的所有大小为 \(k\) 的子集 \(S \subseteq V\)（共有 \(\binom{|V|}{k}\) 个），检查每个子集是否两两连边。然而当 \(|V| = 300, k = 20\) 时，\(\binom{300}{20}\) 超过宇宙年龄内的总步数。这促使我们引入资源受限的计算模型——<strong>计算复杂性理论（Complexity Theory）</strong>。</p>

<h2>2. 最坏情况时间复杂度与五大渐近记号</h2>

<div class="callout must">
  <strong>定义 10.2（图灵机的最坏情况时间复杂度 \(T_M(n)\)）</strong>
  <p>设 \(M\) 是一台在所有输入上都停机的确定性图灵机（判定机）。\(M\) 的<strong>时间复杂度（Time Complexity）</strong>是一个函数 \(T_M: \mathbb{N} \to \mathbb{N}\)，其中 \(T_M(n)\) 定义为 \(M\) 在所有长度为 \(n\) 的二进制输入串上运行步数的最大值（Worst-case running time）：</p>
  <div class="formula">\[
    T_M(n) := \max_{w \in \{0, 1\}^n} \bigl(\text{图灵机 } M \text{ 在输入 } w \text{ 上停机前执行的步数}\bigr).
  \]</div>
</div>

<p>为了刻画当输入规模 \(n \to \infty\) 时运行时间的增长阶（忽略低阶项与常数系数），定义五个标准渐近记号（设 \(T, f: \mathbb{N} \to [0, \infty)\)）：</p>
<table>
  <thead>
    <tr>
      <th>记号</th>
      <th>名称与直观含义</th>
      <th>严格量词定义</th>
      <th>极限特征（当 \(f(n)&gt;0\)）</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>\(T(n) = O(f(n))\)</td>
      <td>大 \(O\)（渐近上界，\(\le\)）</td>
      <td>\(\exists c &gt; 0,\, \exists n_0 \in \mathbb{N},\, \forall n \ge n_0:\; T(n) \le c \cdot f(n)\)</td>
      <td>\(\limsup_{n\to\infty} \dfrac{T(n)}{f(n)} &lt; \infty\)</td>
    </tr>
    <tr>
      <td>\(T(n) = \Omega(f(n))\)</td>
      <td>大 \(\Omega\)（渐近下界，\(\ge\)）</td>
      <td>\(\exists c &gt; 0,\, \exists n_0 \in \mathbb{N},\, \forall n \ge n_0:\; T(n) \ge c \cdot f(n)\)</td>
      <td>\(\liminf_{n\to\infty} \dfrac{T(n)}{f(n)} &gt; 0\)</td>
    </tr>
    <tr>
      <td>\(T(n) = \Theta(f(n))\)</td>
      <td>大 \(\Theta\)（渐近紧界，\(=\)）</td>
      <td>\(T(n) = O(f(n))\) 且 \(T(n) = \Omega(f(n))\)</td>
      <td>\(0 &lt; \lim_{n\to\infty} \dfrac{T(n)}{f(n)} &lt; \infty\)</td>
    </tr>
    <tr>
      <td>\(T(n) = o(f(n))\)</td>
      <td>小 \(o\)（严格低阶，\(&lt;\)）</td>
      <td>\(\forall c \in (0, 1),\, \exists n_0 \in \mathbb{N},\, \forall n &gt; n_0:\; T(n) &lt; c \cdot f(n)\)</td>
      <td>\(\lim_{n\to\infty} \dfrac{T(n)}{f(n)} = 0\)</td>
    </tr>
    <tr>
      <td>\(T(n) = \omega(f(n))\)</td>
      <td>小 \(\omega\)（严格高阶，\(&gt;\)）</td>
      <td>\(\forall c \in \mathbb{N},\, \exists n_0 \in \mathbb{N},\, \forall n &gt; n_0:\; T(n) &gt; c \cdot f(n)\)</td>
      <td>\(\lim_{n\to\infty} \dfrac{T(n)}{f(n)} = \infty\)</td>
    </tr>
  </tbody>
</table>

<p><strong>多项式与指数的渐近分离</strong>：对任意常数 \(k \in \mathbb{N}\)，由洛必达法则或比值判别法易证 \(\lim_{n\to\infty} \frac{n^k}{2^n} = 0\)，即：</p>
<div class="formula">\[
  \forall k \in \mathbb{N},\qquad n^k \in o(2^n).
\]</div>

<h2>3. 模型依赖性分析：单带 vs. 双带上的 \(\mathrm{PALINDROME}\)</h2>
<p>考察回文串语言 \(\mathrm{PALINDROME} = \{w \in \{0, 1\}^* \mid w = w^R\}\) 在不同工作带数目下的时间复杂度：</p>
<ol>
  <li><strong>单带图灵机上界 \(O(n^2)\)</strong>：读写头记住最左端未划掉字符，向右移动 \(O(n)\) 步到达最右端未划掉字符进行比对，划掉后再折返左端；共需约 \(n/2\) 趟往返，每趟 \(O(n)\) 步，总时间复杂度为 \((n/2) \cdot O(n) = O(n^2)\)。</li>
  <li><strong>单带图灵机下界 \(\Omega(n^2)\)（Crossing Sequence 定理）</strong>：可以严格证明，任何判定 \(\mathrm{PALINDROME}\) 的<strong>单带</strong>图灵机都必须花费 \(\Omega(n^2)\) 时间，即单带最优时间复杂度为 \(\Theta(n^2)\)。</li>
  <li><strong>双带图灵机上界 \(O(n)\)</strong>：第一趟用 \(O(n)\) 步将输入 \(w\) 完整拷贝到第 2 条工作带；随后第 1 带读写头停在最左端 \(w_1\)、第 2 带读写头停在最右端 \(w_n\)，两个读写头反向同步移动（Head 1 右移、Head 2 左移）逐位比对 \(w_i\) 与 \(w_{n+1-i}\)，仅需 \(3n + O(1) = O(n)\) 步即可判定！</li>
</ol>
<p>这表明：<strong>精确的细粒度时间复杂度（如 \(O(n)\) 与 \(O(n^2)\)）依赖于具体选用单带还是多带模型</strong>。但下面的核心引理证明了：两者的差距至多是一个<strong>平方（多项式）开销</strong>。</p>

<h2>4. 多带转单带的平方时间开销引理</h2>
<div class="callout must">
  <strong>引理 10.1（\(k\) 带转单带的时间开销引理，Lecture 10 Slide 30）</strong>
  <p>设 \(k \ge 1\) 为正整数，\(T: \mathbb{N} \to \mathbb{N}\) 满足 \(T(n) \ge n\)。如果存在一台 \(k\) 带图灵机在时间复杂度 \(T(n)\) 内判定语言 \(Y\)，则存在一台<strong>单带图灵机</strong>在时间复杂度 \(O(T(n)^2)\) 内判定 \(Y\)。</p>
</div>
<p><strong>证明</strong>：</p>
<ul>
  <li>回顾 Lecture 5–6 的轨道模拟构造：单带图灵机 \(M'\) 将 \(k\) 条工作带叠合为单带上的 \(k\) 条轨道，并用带顶横线符号标记 \(k\) 个虚拟读写头的位置。</li>
  <li>在第 \(i\) 步模拟结束时（\(1 \le i \le T(n)\)），原 \(k\) 带图灵机的每个读写头距初始位置的距离至多为 \(i\) 格，因此单带上所有非空白（被访问过）的有效区域宽度至多为 \(n + 2i \le n + 2T(n) = O(T(n))\) 格（因为 \(T(n) \ge n\)）。</li>
  <li>为了模拟原机器的第 \(i\) 步，单带机 \(M'\) 需要从左到右扫描一遍有效区域收集 \(k\) 个读写头下的符号，再扫描一遍更新符号并移动带横线标记，耗时 \(O(n + 2i) = O(T(n))\) 步。</li>
  <li>模拟全部 \(T(n)\) 步的总运行时间为：
  <div class="formula">\[
    \sum_{i=1}^{T(n)} O(T(n)) = T(n) \cdot O(T(n)) = O(T(n)^2).
  \]</div></li>
</ul>

<h2>5. 时间复杂性类 \(\mathrm{TIME}(T)\) 与多项式时间类 \(\mathrm{P}\)</h2>
<div class="callout must">
  <strong>定义 10.3（时间复杂性类 \(\mathrm{TIME}(T)\) 与复杂性类 \(\mathrm{P}\)）</strong>
  <ul>
    <li>称语言 \(Y \subseteq \{0, 1\}^*\) 可在时间 \(T(n)\) 内被判定，如果存在一台<strong>单带</strong>图灵机 \(M\) 判定 \(Y\)，且对所有 \(n \in \mathbb{N}\) 和 \(w \in \{0, 1\}^n\)，\(M\) 在 \(w\) 上的运行步数至多为 \(T(n)\)。记：
    <div class="formula">\[
      \mathrm{TIME}(T) = \{Y \subseteq \{0, 1\}^* \mid Y \text{ 可在时间 } O(T(n)) \text{ 内被单带图灵机判定}\}.
    \]</div></li>
    <li><strong>多项式时间复杂性类 \(\mathrm{P}\)（Polynomial Time）</strong>定义为所有可在多项式时间内判定的语言集合：
    <div class="formula">\[
      \mathrm{P} = \bigcup_{k=1}^{\infty} \mathrm{TIME}(n^k) = \{Y \subseteq \{0, 1\}^* \mid \exists k \ge 1,\; Y \text{ 可在 } O(n^k) \text{ 时间内判定}\}.
    \]</div></li>
  </ul>
</div>

<p><strong>为什么 \(\mathrm{P}\) 是刻画“可有效求解（Tractability）”的理想数学模型？</strong></p>
<ol>
  <li><strong>模型无关性（Robustness）</strong>：由引理 10.1，若多带图灵机在多项式时间 \(p(n) = O(n^k)\) 内判定 \(L\)，则单带图灵机可在 \(O(p(n)^2) = O(n^{2k})\) 时间内判定 \(L\)——多项式的平方仍是多项式！因此<strong>复杂性类 \(\mathrm{P}\) 完全不依赖于使用单带图灵机、多带图灵机还是现代随机访问机器（RAM）</strong>。</li>
  <li><strong>算法组合封闭性</strong>：多项式与多项式的和、积、复合仍然是多项式，这意味着将多项式时间子程序调用多项式次，整体算法依然属于 \(\mathrm{P}\)。</li>
</ol>
`,
  questions: [
    {
      id: "l10-q1",
      kind: "single",
      tag: "slide",
      q: String.raw`对于回文串判定问题 \(\mathrm{PALINDROME} = \{w \in \{0,1\}^* \mid w = w^R\}\)，它在<strong>单带图灵机</strong>和<strong>双带图灵机</strong>上的最优最坏情况时间复杂度分别是多少？`,
      choices: [
        ["a", String.raw`单带图灵机为 \(\Theta(n^2)\)，双带图灵机为 \(\Theta(n)\)`],
        ["b", String.raw`单带图灵机和双带图灵机均为 \(\Theta(n)\)`],
        ["c", String.raw`单带图灵机为 \(\Theta(2^n)\)，双带图灵机为 \(\Theta(n^2)\)`],
        ["d", String.raw`单带图灵机和双带图灵机均为 \(\Theta(n \log n)\)`]
      ],
      answer: ["a"],
      why: String.raw`单带图灵机只有一个读写头，必须在首尾之间往返移动约 \(n/2\) 趟，每趟 \(O(n)\) 步，且由 Crossing Sequence 下界知任何单带机至少需 \(\Omega(n^2)\) 步；而双带图灵机可将输入复制到第二条带后两头反向同步扫描，仅需 \(O(n)\) 步。`
    },
    {
      id: "l10-q2",
      kind: "single",
      tag: "slide",
      q: String.raw`设一台 \(k\) 带图灵机在时间复杂度 \(T(n)\)（其中 \(T(n) \ge n\)）内判定语言 \(Y\)。使用标准轨道编码将其转换为等价的单带图灵机后，单带图灵机的时间复杂度上界是多少？为什么这保证了复杂性类 \(\mathrm{P}\) 的模型无关性？`,
      choices: [
        ["a", String.raw`上界为 \(O(T(n)^2)\)；因为当 \(T(n) = O(n^c)\) 为多项式时，\(O(T(n)^2) = O(n^{2c})\) 仍然是多项式，所以多带多项式时间与单带多项式时间定义的类 \(\mathrm{P}\) 完全相同`],
        ["b", String.raw`上界为 \(O(T(n))\)；因为单带图灵机模拟多带没有任何时间损失`],
        ["c", String.raw`上界为 \(O(2^{T(n)})\)；因为状态数呈指数爆炸`],
        ["d", String.raw`上界为 \(O(T(n)^k)\)；带数 \(k\) 直接成为多项式次数的乘数`]
      ],
      answer: ["a"],
      why: String.raw`模拟第 \(i\) 步时单带上活跃区域长度至多为 \(n + 2i \le O(T(n))\)，故每步模拟耗费 \(O(T(n))\) 步，共 \(T(n)\) 步合计 \(O(T(n)^2)\)（与带数 \(k\) 无关，\(k\) 只影响常数因子）。由于 \((n^c)^2 = n^{2c}\) 仍为多项式，类 \(\mathrm{P}\) 对带数变化完全稳健。`
    },
    {
      id: "l10-q3",
      kind: "single",
      tag: "slide",
      q: String.raw`根据 Lecture 10 中小 \(o\) 记号（little-\(o\)）的形式化定义，\(T(n) = o(f(n))\) 的精确含义是什么？`,
      choices: [
        ["a", String.raw`对任意常数 \(c \in (0, 1)\)，都存在 \(n_0 \in \mathbb{N}\)，使得对所有 \(n &gt; n_0\) 都有 \(T(n) &lt; c \cdot f(n)\)（等价于 \(\lim_{n\to\infty} T(n)/f(n) = 0\)）`],
        ["b", String.raw`存在某个常数 \(c &gt; 0\) 和 \(n_0 \in \mathbb{N}\)，使得对所有 \(n \ge n_0\) 都有 \(T(n) \le c \cdot f(n)\)`],
        ["c", String.raw`\(\lim_{n\to\infty} T(n)/f(n) = 1\)`],
        ["d", String.raw`\(\lim_{n\to\infty} T(n)/f(n) = \infty\)`]
      ],
      answer: ["a"],
      why: String.raw`大 \(O\) 只需要“存在某个常数 \(c &gt; 0\)”（量词 \(\exists c\)），允许两函数同阶；而小 \(o\) 要求“对任意小的正数 \(c\)”（量词 \(\forall c \in (0, 1)\)）最终都有 \(T(n) &lt; c \cdot f(n)\)，即 \(T(n)\) 的增长阶严格低于 \(f(n)\)。`
    }
  ],
  cards: [
    [
      String.raw`大 \(O\)（\(T(n)=O(f(n))\)）与小 \(o\)（\(T(n)=o(f(n))\)）在量词定义上的核心区别是什么？`,
      String.raw`<strong>大 \(O\)</strong>：<strong>存在</strong>常数 \(c &gt; 0\) 和 \(n_0\)，使 \(\forall n \ge n_0,\, T(n) \le c f(n)\)（渐近小于等于）。<br><strong>小 \(o\)</strong>：<strong>对任意</strong>常数 \(c \in (0, 1)\)，存在 \(n_0\)，使 \(\forall n &gt; n_0,\, T(n) &lt; c f(n)\)（等价于 \(\lim_{n\to\infty} T(n)/f(n) = 0\)，严格低阶）。`
    ],
    [
      String.raw`为什么 \(k\) 带时间 \(T(n)\) 的图灵机转单带的时间复杂度是 \(O(T(n)^2)\)？`,
      String.raw`在 \(T(n)\) 步内，\(k\) 个读写头最多走出 \(T(n)\) 格，单带上的活跃区域宽度为 \(O(n + T(n)) = O(T(n))\)。模拟每一步需要往返扫描整个活跃区域耗时 \(O(T(n))\)，模拟 \(T(n)\) 步共耗时 \(T(n) \cdot O(T(n)) = O(T(n)^2)\)。`
    ]
  ]
});
