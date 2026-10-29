Review.add({
  id: "sample",
  group: "exam",
  n: 1,
  short: "Practice Midterm 样卷与官方解答",
  title: "Practice Midterm 官方样卷与标准解答全解（36 分 · 3 多选 + 4 简答 + 2 证明大题）",
  meta: "Official Practice Midterm & Solutions (PracticeMidtermSolns.pdf) + Midterm Tutorial 复习要点",
  sources: [
    { label: "Practice Midterm (Official PDF)", href: "materials/PracticeMidterm.pdf" },
    { label: "Official Solutions (PracticeMidtermSolns.pdf)", href: "materials/PracticeMidtermSolns.pdf" },
    { label: "Midterm Review Tutorial (Tutorial_Midterm.pdf)", href: "materials/Tutorial_Midterm.pdf" }
  ],
  html: String.raw`
<p class="lede">本卷为课程官方发布的 <strong>CSC4010 Practice Midterm</strong> 及最新公布的<strong>官方标准答案（<code>PracticeMidtermSolns.pdf</code>）</strong>与<strong>期中复习习题课提纲（<code>Tutorial_Midterm.pdf</code>）</strong>。正式期中（11 月 2 日 08:30 AM，满分 <strong>36 分</strong>，时长 60 分钟）题型结构与本样卷完全一致：<strong>3 道不定项选择题</strong>（每题 4 分，共 12 分；全对得 4 分，每多选或漏选一项扣 1 分，最低 0 分）、<strong>4 道简答题</strong>（每题 3 分，共 12 分）与 <strong>2 道综合证明大题</strong>（每题 6 分，共 12 分）。</p>

<div class="callout must">
  <strong>Midterm Tutorial 官方考前嘱咐与必考八大核心概念（<code>Tutorial_Midterm.pdf</code>）</strong>
  <ul>
    <li><strong>考场规则</strong>：允许携带 <strong>1 张单面 A4 手写小抄（one-sided, A4-size, handwritten study sheet）</strong>、校园卡（ID card）与笔；严禁使用任何电子设备。简答题与证明大题<strong>按步骤给过程分（Partial credit）</strong>，务必清晰写出构造步骤与理由。</li>
    <li><strong>官方点名必考的 8 大核心概念（Concepts to pay attention to）</strong>：
      <ol>
        <li>证明不可数性（<strong>Proving uncountability</strong>：康托尔对角化，注意构造出的对角对象本身必须满足集合约束，如 SA 1 中必须仍是双射）；</li>
        <li>证明不可判定性（<strong>Showing undecidability</strong>：映射归约或 <strong>Rice 定理</strong>——务必熟练掌握 Rice 定理的两个前提条件：语义性质 + 非平凡）；</li>
        <li>利用映射归约证明可识别性/不可识别性（<strong>Showing (un)recognizability via mapping reduction</strong>：\(\overline{A_{\mathrm{TM}}} \le_m L\)）；</li>
        <li>使用<strong>交错模拟（Dovetailing）</strong>为（可能不可判定的）语言设计识别机（Recognizer，如 SA 3 与 LA 2）；</li>
        <li>可判定/不可判定、可识别/不可识别语言的<strong>封闭性质（Closure properties）</strong>；</li>
        <li><strong>渐近记号（Asymptotic notation）</strong>与最坏情况运行时间分析（如 MC 3）；</li>
        <li><strong>时间层次定理（Time Hierarchy Theorem）</strong>与时间可构造函数；</li>
        <li><strong>复杂性类 \(\mathrm{NP}\) 的形式化定义</strong>：完备性（Completeness）、可靠性（Soundness）、证书长度（多项式有界）与验证机运行时间（多项式时间，如 SA 4）。</li>
      </ol>
    </li>
  </ul>
</div>

<h2>一、Multiple Choice 不定项选择题（每题 4 分，共 12 分）</h2>

<h3>MC 1（4 分）：可数集判定</h3>
<p><strong>原题</strong>：Select all of the countable sets.</p>
<ol>
  <li>\(\{\langle M \rangle : M \text{ is a Turing Machine}\}\)</li>
  <li>\(\{\langle M \rangle x : M \text{ is a Turing Machine and accepts } x\}\)</li>
  <li>\(\{L : L \subseteq \{0, 1\}^*\}\)</li>
  <li>\(\{L : L \subseteq \{0, 1\}^* \text{ is a finite language}\}\)</li>
</ol>
<div class="callout ex">
  <strong>官方标准答案（<code>PracticeMidtermSolns.pdf</code>）：选第 1、2、4 项</strong>
  <ul>
    <li><strong>选项 1（可数，应选）</strong>：\(\{\langle M \rangle : M \text{ is a Turing Machine}\} \subseteq \{0, 1\}^*\)。因为 \(\{0, 1\}^*\) 是可数集（Lecture 1），其子集必然可数。</li>
    <li><strong>选项 2（可数，应选）</strong>：\(\{\langle M \rangle x : M \text{ is a Turing Machine and accepts } x\} \subseteq \{0, 1\}^*\)，同理作为可数集 \(\{0, 1\}^*\) 的子集必然可数。（注：任何单个语言 \(A \subseteq \{0,1\}^*\) 都是可数集，不可判定性与元素个数是否可数无关）。</li>
    <li><strong>选项 3（不可数，不选）</strong>：\(\{L : L \subseteq \{0, 1\}^*\} = \mathcal{P}(\{0, 1\}^*)\)。由康托尔定理（Cantor's Theorem）知 \(|\{L : L \subseteq \{0, 1\}^*\}| &gt; |\{0, 1\}^*| = |\mathbb{N}|\)，故不可数。</li>
    <li><strong>选项 4（可数，应选）</strong>：<strong>官方解答构造（按总长度分层枚举）</strong>：我们可以按有限语言中所含全部字符串的<strong>总长度（total length of the strings they contain）</strong>将这些有限语言划分为不同的类别（categories）。由于固定总长度下的有限语言只有有限多个（每个类别都是一个有限集，其大小可确定），我们可以在每个类别内部按任意选定的顺序排列，最后再按字符串总长度递增的顺序将各个类别依次拼接枚举（或将每个有限语言 \(L = \{w_1, \dots, w_k\}\) 用分隔符编码为单个有限串单射到 \(\{0,1\}^*\)），故全体有限语言的集合是可数集。</li>
  </ul>
</div>

<h3>MC 2（4 分）：可判定性充分条件辨析</h3>
<p><strong>原题</strong>：Select each hypothesis that implies that \(L\) is decidable.</p>
<ol>
  <li>Language \(\overline{L}\) is decidable.</li>
  <li>Language \(A\) is decidable and \(L \subseteq A\).</li>
  <li>Language \(A \le_m L\) and \(A\) is decidable.</li>
  <li>Language \(L = A \cup B\), and at least one of \(A\) or \(B\) is decidable.</li>
</ol>
<div class="callout ex">
  <strong>官方标准答案（<code>PracticeMidtermSolns.pdf</code>）：仅选第 1 项（Language \(\overline{L}\) is decidable）</strong>
  <ul>
    <li><strong>选项 1（成立，应选）</strong>：若 \(\overline{L}\) 可判定，直接取 \(\overline{L}\) 的判定机并将其接受/拒绝输出翻转（交换 \(q_{\mathrm{acc}}\) 与 \(q_{\mathrm{rej}}\)），即得到 \(L\) 的判定机。</li>
    <li><strong>选项 2（不成立，不选）</strong>：<strong>官方反例</strong>：取 \(A = \{0, 1\}^*\)（接受一切输入的图灵机即可判定 \(A\)），而课堂上证明的所有不可判定语言（如 \(A_{\mathrm{TM}}\)）都是 \(A = \{0, 1\}^*\) 的子集。</li>
    <li><strong>选项 3（不成立，不选）</strong>：<strong>官方批注</strong>：“Reducibility <em>to</em> a decidable language gives decidability; reducibility <em>from</em> one does not.”（归约<strong>到</strong>可判定语言 \(L \le_m A\) 才能推出 \(L\) 可判定；从可判定语言归约过来 \(A \le_m L\) 不能推出 \(L\) 可判定）。</li>
    <li><strong>选项 4（不成立，不选）</strong>：<strong>官方反例</strong>：取平凡情形 \(A = A_{\mathrm{TM}}\)（不可判定）且 \(B = \emptyset\)（可判定），则 \(B\) 可判定，但 \(L = A \cup B = A_{\mathrm{TM}}\) 不可判定。</li>
  </ul>
</div>

<h3>MC 3（4 分）：最坏情况时间复杂度与渐近记号</h3>
<p><strong>原题</strong>：Consider three algorithms with the following worst-case running times:
\[
  T_A(n) = O(n^3), \qquad T_B(n) = \Theta(n^2), \qquad T_C(n) = \Theta(n \log n).
\]
Recall that the worst-case running time represents the maximum number of steps an algorithm takes over all inputs of size \(n\). Select all statements that are necessarily true based on the given information.</p>
<ol>
  <li>Algorithm \(A\) has worst-case running time \(\Omega(n^2)\).</li>
  <li>Algorithm \(B\) has worst-case running time \(O(n^3)\).</li>
  <li>Algorithm \(C\) runs faster than Algorithm \(B\) for all inputs.</li>
  <li>For all large enough \(n\), there exists an input of size \(n\) for which \(C\) runs faster than \(B\).</li>
</ol>
<div class="callout ex">
  <strong>官方标准答案（<code>PracticeMidtermSolns.pdf</code>）：选第 2、4 项</strong>
  <ul>
    <li><strong>选项 1（不一定真，不选）</strong>：\(T_A(n) = O(n^3)\) 只是上界，完全不排除 \(T_A(n) = \Theta(n \log n)\) 的可能性，故不一定满足 \(\Omega(n^2)\)。</li>
    <li><strong>选项 2（必真，应选）</strong>：\(T_B(n) = \Theta(n^2)\) 意味着存在常数 \(c, n_c &gt; 0\) 使对一切 \(n &gt; n_c\) 有 \(T_B(n) \le c n^2 \le c n^3\)，故 \(T_B(n) = O(n^3)\)。</li>
    <li><strong>选项 3（不一定真，不选）</strong>：<strong>官方批注</strong>：最坏情况运行时间上界不能决定在<strong>每一个具体输入（every individual input）</strong>上谁更快——例如算法 \(B\) 在某些特定输入上可能只需线性时间 \(O(n)\)，而算法 \(C\) 在这些输入上却耗时 \(\Theta(n \log n)\)。</li>
    <li><strong>选项 4（必真，应选）</strong>：<strong>官方批注</strong>：对充分大的 \(n\)，由 \(T_B(n) = \Theta(n^2)\) 是最坏情况时间知，必<strong>存在某个长度为 \(n\) 的输入</strong>使得 \(B\) 至少运行 \(c n^2\) 步；而 \(C\) 在所有长度为 \(n\) 的输入上至多运行 \(d n \log n\) 步。当 \(n\) 充分大时 \(d n \log n &lt; c n^2\)，故在该输入上 \(C\) 必然比 \(B\) 快。</li>
  </ul>
</div>

<h2>二、Short Answer 简答题（每题 3 分，共 12 分）</h2>

<h3>SA 1（3 分）：自然数双射全体是否可数</h3>
<p><strong>原题</strong>：Consider the set of all bijections \(f: \mathbb{N} \to \mathbb{N}\). Is this set countable or uncountable? Give a short explanation.</p>
<div class="callout ex">
  <strong>官方标准解答（Uncountable / 不可数，配对块对角化）</strong>
  <p><strong>结论</strong>：该集合是<strong>不可数的（Uncountable）</strong>。本题的关键在于：<strong>通过康托尔对角化构造出的新函数 \(g\) 本身也必须是一个双射（bijection）</strong>！</p>
  <p><strong>官方标准证明（取 \(\mathbb{N} = \{1, 2, \dots\}\)）</strong>：假设为了导出矛盾，全体双射 \(\mathbb{N} \to \mathbb{N}\) 可以被枚举为列表 \(f_1, f_2, f_3, \dots\)。将正整数划分为相邻二元配对 \(\{2i-1, 2i\}\)（\(i = 1, 2, \dots\)），定义函数 \(g: \mathbb{N} \to \mathbb{N}\) 如下：</p>
  <div class="formula">\[
    \bigl(g(2i - 1),\; g(2i)\bigr) = \begin{cases}
      (2i,\; 2i - 1), &amp; \text{若 } f_i(2i - 1) = 2i - 1, \\
      (2i - 1,\; 2i), &amp; \text{否则（即 } f_i(2i - 1) \ne 2i - 1\text{）}.
    \end{cases}
  \]</div>
  <ul>
    <li><strong>为什么 \(g\) 是双射？</strong>因为对每一个 \(i \ge 1\)，\(g\) 在二元集合 \(\{2i - 1, 2i\}\) 上要么交换两个元素，要么保持两个元素不变，因此在全集 \(\mathbb{N}\) 上 \(g\) 显然是一一对应（双射）。</li>
    <li><strong>为什么 \(g\) 不在列表中？</strong>由上述构造，对每一个 \(i \ge 1\)，当 \(f_i(2i-1) = 2i-1\) 时 \(g(2i-1) = 2i \ne 2i-1\)；当 \(f_i(2i-1) \ne 2i-1\) 时 \(g(2i-1) = 2i-1 \ne f_i(2i-1)\)。因此恒有
    \[
      g(2i - 1) \ne f_i(2i - 1), \qquad \forall i \ge 1.
    \]
    故 \(g\) 与列表中的每一个双射 \(f_i\) 都不同，矛盾！因此全体双射集合不可数。</li>
  </ul>
  <p><em>（注：若按 \(\mathbb{N} = \{0, 1, 2, \dots\}\) 编号，只需将配对块写为 \(\{2i, 2i+1\}\) 即可，完全等价。）</em></p>
</div>

<h3>SA 2（3 分）：每次固定跳两格的图灵机变体</h3>
<p><strong>原题</strong>：Consider a variant of a Turing machine with a two-way infinite tape. At each step, its head reads and writes only the current cell and then moves exactly two cells to the left or right, without reading or writing the skipped cell. The binary input is written in consecutive cells, and the head initially points to the first input cell. Can this variant decide every decidable language over \(\{0, 1\}\)? Give a short explanation.</p>
<div class="callout ex">
  <strong>官方标准解答（No / 不能，奇偶位置不变量）</strong>
  <p><strong>结论</strong>：<strong>No（不能）</strong>。</p>
  <p><strong>官方证明</strong>：每一步移动 \(\pm 2\) 格都<strong>保持读写头位置坐标的奇偶性不变（preserves the parity of the head's position）</strong>：</p>
  <ul>
    <li><strong>按题目描述（读写头初始指向第 1 个输入格）</strong>：读写头只能访问第 \(1, 3, 5, \dots\) 个输入字符，永远无法读取第 \(2, 4, 6, \dots\) 个输入字符（例如输入 \(10\) 与 \(11\) 在所有可访问格上的内容完全相同，机器无法判定 \(L = \{10\}\)）。</li>
    <li><strong>按本课程标准约定（读写头初始位于第 1 个输入格左端紧邻的空白格 \(\sqcup\)，即 <code>PracticeMidtermSolns.pdf</code> 写法）</strong>：读写头从第 0 格（\(\sqcup\)）出发，每次跳 2 格，因此<strong>只能访问第 \(2, 4, 6, \dots\) 个输入字符，永远无法读取第 \(1\) 个输入字符</strong>！例如，输入串 \(10\) 与 \(00\) 在所有可被访问的偶下标磁带格上内容完全一致（第 2 个字符都是 \(0\)），因此该图灵机在 \(10\) 与 \(00\) 上的运行轨迹与结果必然完全相同。但有限语言 \(L = \{10\}\) 是可判定的，且要求接受 \(10\)、拒绝 \(00\)，故该变体无法判定所有可判定语言。</li>
  </ul>
</div>

<h3>SA 3（3 分）：可识别语言对并运算的封闭性</h3>
<p><strong>原题</strong>：Let \(A, B \subseteq \{0, 1\}^*\) be recognizable languages. Show that \(A \cup B\) is recognizable.</p>
<div class="callout ex">
  <strong>官方标准解答（<code>PracticeMidtermSolns.pdf</code>）</strong>
  <p><strong>证明</strong>：设 \(M_A, M_B\) 分别为识别 \(A\) 和 \(B\) 的图灵机（Recognizers）。构造识别 \(A \cup B\) 的图灵机 \(M\) 如下：</p>
  <p>对输入 \(x\)，\(M\) <strong>交替（alternates）将 \(M_A(x)\) 和 \(M_B(x)\) 各模拟运行 1 步</strong>（即第 1 步跑 \(M_A\) 的第 1 步，第 2 步跑 \(M_B\) 的第 1 步，第 3 步跑 \(M_A\) 的第 2 步……）。如果在某一时刻 \(M_A\) 或 \(M_B\) 接受了 \(x\)，则 \(M\) 立即<strong>停机并接受</strong> \(x\)。</p>
  <p><strong>正确性</strong>：若 \(x \in A \cup B\)，则 \(M_A\) 或 \(M_B\) 至少有一台会接受 \(x\)。不妨设其中某一台在 \(t\) 步内接受 \(x\)，则至多在 \(2t\) 步内，\(M\) 也会检测到该接受并接受 \(x\)；若 \(x \notin A \cup B\)，则两台机器都不会接受，\(M\) 也永不接受。故 \(M\) 是 \(A \cup B\) 的识别机，\(A \cup B\) 可识别。</p>
</div>

<h3>SA 4（3 分）：证明合数语言 \(\mathrm{COMPOSITE} \in \mathrm{NP}\)</h3>
<p><strong>原题</strong>：Let \(\mathrm{COMPOSITE}\) be the language of nonempty binary strings representing composite integers. Briefly describe a polynomial-size certificate and a polynomial-time verifier showing that \(\mathrm{COMPOSITE} \in \mathrm{NP}\).</p>
<div class="callout ex">
  <strong>官方标准解答（<code>PracticeMidtermSolns.pdf</code>）</strong>
  <ul>
    <li><strong>多项式大小证书（Certificate）</strong>：设输入二进制串 \(x \in \{0, 1\}^*\) 表示的正整数为 \(N\)。证书 \(c\) 是一个正整数 \(d\) 的二进制表示，满足 \(1 &lt; d &lt; N\) 且 \(d\) 整除 \(N\)（\(d \mid N\)）。注意因为 \(d &lt; N\)，证书的二进制位长至多为 \(|x|\)（关于输入长度是线性的，故为多项式大小）。</li>
    <li><strong>多项式时间验证机（Verifier）</strong>：验证机接收 \((x, d)\)，依次检查：
      <ol>
        <li>是否满足 \(1 &lt; d &lt; N\)；</li>
        <li>\(d\) 除以 \(N\)（即 \(N \div d\)）是否余数为 \(0\)（整除）。</li>
      </ol>
      二进制整数的大小比较与带余除法（或等价地提供两个因子 \(a, b\) 验证 \(1 &lt; a, b &lt; N\) 且 \(a \cdot b = N\)）均可在关于位长 \(|x|\) 的多项式时间内完成。</li>
    <li><strong>完备性与可靠性</strong>：若 \(N\) 是合数，必存在非平凡因子 \(1 &lt; d &lt; N\) 使验证机接受；若 \(N\) 不是合数（素数或 \(\le 1\)），则不存在这样的证书 \(d\)。故 \(\mathrm{COMPOSITE} \in \mathrm{NP}\)。</li>
  </ul>
</div>

<h2>三、Long Answer 综合证明大题（每题 6 分，共 12 分）</h2>

<h3>LA 1（6 分）：证明 \(L_{\mathrm{even\text{-}acc}}\) 不可识别</h3>
<p><strong>原题</strong>：Let \(L_{\mathrm{even\text{-}acc}} = \{\langle M \rangle \mid \forall x \in \{0, 1\}^*,\; M(x) \text{ accepts} \iff |x| \text{ is even}\}\). That is, let \(L_{\mathrm{even\text{-}acc}}\) be the language of descriptions of all Turing machines that accept exactly the set of even-length strings. Show that this language is unrecognizable.</p>
<div class="callout ex">
  <strong>官方标准证明（<code>PracticeMidtermSolns.pdf</code> 极简构造 vs. PS4 模板构造）</strong>
  <p><strong>核心目标</strong>：构造从 \(\overline{A_{\mathrm{TM}}} = \{\langle M, w \rangle \mid M \text{ does not accept } w\}\) 到 \(L_{\mathrm{even\text{-}acc}}\) 的映射归约 \(f(\langle M, w \rangle) = \langle M_w \rangle\)，使得 \(\langle M, w \rangle \in \overline{A_{\mathrm{TM}}} \iff \langle M_w \rangle \in L_{\mathrm{even\text{-}acc}}\)。</p>

  <h4>写法一：官方解答（<code>PracticeMidtermSolns.pdf</code>）——只在一个奇数长串 \(x = 1\) 上模拟 \(M(w)\)</h4>
  <p>构造图灵机 \(M_w\)，其对输入 \(x \in \{0, 1\}^*\) 的行为如下：</p>
  <ol>
    <li>若 \(x \ne 1\) 且 \(|x|\) 是<strong>奇数</strong>，则直接<strong>拒绝（reject）</strong>；</li>
    <li>否则，若 \(|x|\) 是<strong>偶数</strong>，则直接<strong>接受（accept）</strong>；</li>
    <li>否则（即 \(x = 1\)，此时 \(|x| = 1\) 是奇数），在工作带上<strong>模拟 \(M\) 在输入 \(w\) 上的运行</strong>（若 \(M\) 接受 \(w\) 则接受 \(x=1\)；若 \(M\) 拒绝或死循环则不接受 \(x=1\)）。</li>
  </ol>
  <p><strong>正确性验证</strong>：</p>
  <ul>
    <li>若 \(\langle M, w \rangle \in \overline{A_{\mathrm{TM}}}\)（\(M\) 不接受 \(w\)）：\(M_w\) 接受所有偶数长串，拒绝所有 \(x \ne 1\) 的奇数长串，且在 \(x = 1\) 上因为 \(M\) 不接受 \(w\) 也永不接受。故 \(M_w\) 恰好只接受偶数长串，\(\langle M_w \rangle \in L_{\mathrm{even\text{-}acc}}\)。</li>
    <li>若 \(\langle M, w \rangle \notin \overline{A_{\mathrm{TM}}}\)（\(M\) 接受 \(w\)）：\(M_w\) 除了接受所有偶数长串外，还会<strong>额外接受奇数长度串 \(x = 1\)</strong>，故 \(\langle M_w \rangle \notin L_{\mathrm{even\text{-}acc}}\)。</li>
  </ul>

  <h4>写法二：PS4 通用模板构造——在所有奇数长串上模拟 \(M(w)\)（完全等价，同样满分）</h4>
  <ol>
    <li><strong>Part 1</strong>：若 \(|x|\) 是<strong>偶数</strong>，立即<strong>接受 \(x\)</strong>。</li>
    <li><strong>Simulation Gate</strong>（此时 \(|x|\) 是奇数）：模拟 \(M(w)\)；若 \(M(w)\) 接受则进入 Part 2，否则拒绝/死循环。</li>
    <li><strong>Part 2</strong>：<strong>接受 \(x\)</strong>。</li>
  </ol>
  <p>无论采用写法一还是写法二，\(f(\langle M, w \rangle) = \langle M_w \rangle\) 都是全可计算函数，且满足 \(\langle M, w \rangle \in \overline{A_{\mathrm{TM}}} \iff \langle M_w \rangle \in L_{\mathrm{even\text{-}acc}}\)，即 \(\overline{A_{\mathrm{TM}}} \le_m L_{\mathrm{even\text{-}acc}}\)。由于 \(\overline{A_{\mathrm{TM}}}\) 不可识别，故 \(L_{\mathrm{even\text{-}acc}}\) 不可识别。</p>
</div>

<h3>LA 2（6 分）：判定 \(L(M)\) 是否含 \(0^n 1^n\) 型字符串</h3>
<p><strong>原题</strong>：Consider the language
\[
  L = \{\langle M \rangle \mid L(M) \text{ contains a string of the form } 0^n 1^n \text{ for } n \ge 0\}.
\]
Is this language decidable or undecidable? Is it recognizable or unrecognizable? Justify your answer.</p>
<div class="callout ex">
  <strong>官方标准证明（<code>PracticeMidtermSolns.pdf</code>：Undecidable and Recognizable）</strong>
  <p><strong>结论</strong>：该语言是<strong>不可判定的（Undecidable）</strong>且<strong>可识别的（Recognizable）</strong>。</p>

  <h4>1. 证明 \(L\) 是可识别的（Dovetailing 交错模拟，官方分阶段写法）</h4>
  <p>构造识别机（Recognizer）按阶段 \(i = 0, 1, 2, \dots\) 执行交错模拟（Dovetailing）：</p>
  <ul>
    <li>在<strong>第 \(i\) 阶段（phase \(i\)）</strong>，将图灵机 \(M\) 在输入串 \(\varepsilon, 01, 0011, \dots, 0^i 1^i\) 上的运行<strong>各自向前推进模拟 1 步</strong>（或等价地在每个串上模拟 \(i\) 步）。</li>
    <li>如果在某一阶段中，上述任意一个字符串被 \(M\) 接受，则识别机立即<strong>停机并接受 \(\langle M \rangle\)</strong>；否则继续进入下一阶段。</li>
    <li><strong>正确性</strong>：若存在某个 \(0^n 1^n \in L(M)\) 被 \(M\) 在 \(t\) 步内接受，则 \(M\) 在 \(0^n 1^n\) 上的模拟将在第 \(n\) 阶段首次启动，并在<strong>第 \(n + t\) 阶段结束时</strong>完成第 \(t\) 步并被检测到接受！若不存在这样的串，则识别机永不接受。故 \(L\) 可识别。</li>
  </ul>

  <h4>2. 证明 \(L\) 是不可判定的（映射归约 \(A_{\mathrm{TM}} \le_m L\)，官方写法）</h4>
  <p>构造从 \(A_{\mathrm{TM}}\) 到 \(L\) 的映射归约 \(f(\langle M, w \rangle) = \langle M_w \rangle\)，其中图灵机 \(M_w\) 对输入 \(x\) 的行为如下：</p>
  <ol>
    <li>若 \(x \ne 01\)，则直接<strong>拒绝（reject）</strong>；</li>
    <li>否则（即 \(x = 01\)），在工作带上模拟 \(M\) 在 \(w\) 上的运行；若 \(M\) 接受 \(w\)，则<strong>接受 \(01\)</strong>（否则拒绝或死循环）。</li>
  </ol>
  <p><strong>正确性</strong>：</p>
  <ul>
    <li>若 \(\langle M, w \rangle \in A_{\mathrm{TM}}\)（\(M\) 接受 \(w\)），则 \(L(M_w) = \{01\}\)，包含 \(0^1 1^1 = 01\)，故 \(\langle M_w \rangle \in L\)；</li>
    <li>若 \(\langle M, w \rangle \notin A_{\mathrm{TM}}\)（\(M\) 不接受 \(w\)），则 \(L(M_w) = \emptyset\)，不含任何 \(0^n 1^n\) 型字符串，故 \(\langle M_w \rangle \notin L\)。</li>
  </ul>
  <p>因此 \(\langle M, w \rangle \in A_{\mathrm{TM}} \iff \langle M_w \rangle \in L\)，即 \(A_{\mathrm{TM}} \le_m L\)。因为 \(A_{\mathrm{TM}}\) 不可判定，故 \(L\) 不可判定。（注：也可由 Rice 定理直接得出不可判定性）。</p>
</div>
`,
  questions: [
    {
      id: "pm-mc1",
      kind: "multi",
      tag: "sample",
      q: String.raw`（Practice Midterm MC 1）Select all of the countable sets:`,
      choices: [
        ["a", String.raw`\(\{\langle M \rangle : M \text{ is a Turing Machine}\}\)`],
        ["b", String.raw`\(\{\langle M \rangle x : M \text{ is a Turing Machine and accepts } x\}\)`],
        ["c", String.raw`\(\{L : L \subseteq \{0, 1\}^*\}\)`],
        ["d", String.raw`\(\{L : L \subseteq \{0, 1\}^* \text{ is a finite language}\}\)`]
      ],
      answer: ["a", "b", "d"],
      why: String.raw`A 和 B 均为可数集 \(\{0,1\}^*\) 的子集，必可数；D 中按有限语言所含字符串的总长度分入有限大小的类别即可依次枚举，故可数；唯独 C 是 \(\mathcal{P}(\{0,1\}^*)\)，由康托尔定理知不可数。`
    },
    {
      id: "pm-mc2",
      kind: "multi",
      tag: "sample",
      q: String.raw`（Practice Midterm MC 2）Select each hypothesis that implies that \(L\) is decidable:`,
      choices: [
        ["a", String.raw`Language \(\overline{L}\) is decidable.`],
        ["b", String.raw`Language \(A\) is decidable and \(L \subseteq A\).`],
        ["c", String.raw`Language \(A \le_m L\) and \(A\) is decidable.`],
        ["d", String.raw`Language \(L = A \cup B\), and at least one of \(A\) or \(B\) is decidable.`]
      ],
      answer: ["a"],
      why: String.raw`仅 A 正确（可判定语言对补封闭）。B 反例：\(L = A_{\mathrm{TM}} \subseteq \{0,1\}^*\)；C 归约方向反了（需 \(L \le_m A\) 才能由 \(A\) 可判定推出 \(L\) 可判定）；D 反例：\(A_{\mathrm{TM}} \cup \emptyset = A_{\mathrm{TM}}\)。`
    },
    {
      id: "pm-mc3",
      kind: "multi",
      tag: "sample",
      q: String.raw`（Practice Midterm MC 3）Consider three algorithms with worst-case running times \(T_A(n) = O(n^3)\), \(T_B(n) = \Theta(n^2)\), \(T_C(n) = \Theta(n \log n)\). Select all statements that are necessarily true:`,
      choices: [
        ["a", String.raw`Algorithm \(A\) has worst-case running time \(\Omega(n^2)\).`],
        ["b", String.raw`Algorithm \(B\) has worst-case running time \(O(n^3)\).`],
        ["c", String.raw`Algorithm \(C\) runs faster than Algorithm \(B\) for all inputs.`],
        ["d", String.raw`For all large enough \(n\), there exists an input of size \(n\) for which \(C\) runs faster than \(B\).`]
      ],
      answer: ["b", "d"],
      why: String.raw`A 错在 \(O(n^3)\) 只是上界（不排除 \(T_A(n)=\Theta(n\log n)\)）；B 正确因为 \(\Theta(n^2) \subseteq O(n^3)\)；C 错在 \(T_B(n)\) 只是最坏情况，\(B\) 在某些特定输入上可能只需 \(O(n)\) 时间；D 正确因为对充分大的 \(n\)，取使 \(B\) 达到最坏步数 \(cn^2\) 的输入，\(C\) 在该输入上至多运行 \(dn\log n &lt; cn^2\) 步。`
    },
    {
      id: "pm-sa1",
      kind: "single",
      tag: "sample",
      q: String.raw`（Practice Midterm SA 1）在官方解答中，为证明全体双射 \(f: \mathbb{N} \to \mathbb{N}\) 不可数，对假设的枚举 \(f_1, f_2, \dots\) 构造对角函数 \(g\) 时，是如何保证 \(g\) 本身也是双射且不同于所有 \(f_i\) 的？`,
      choices: [
        ["a", String.raw`在每个二元对 \(\{2i-1, 2i\}\) 上独立定义：若 \(f_i(2i-1) = 2i-1\) 则令 \((g(2i-1), g(2i)) = (2i, 2i-1)\)（交换），否则令其为 \((2i-1, 2i)\)（不变）`],
        ["b", String.raw`直接令 \(g(i) = f_i(i) + 1\)`],
        ["c", String.raw`直接令 \(g(i) = 0\)`],
        ["d", String.raw`令 \(g(i) = f_i(i)\)`]
      ],
      answer: ["a"],
      why: String.raw`若简单令 \(g(i) = f_i(i) + 1\)，得到的 \(g\) 未必是双射（可能不同 \(i\) 映射到同一值或漏掉某些值）；而在每个互不相交的二元对 \(\{2i-1, 2i\}\) 内部选择对换或恒等，既保证了 \(g\) 必然是双射，又保证了 \(\forall i,\, g(2i-1) \ne f_i(2i-1)\)。`
    },
    {
      id: "pm-sa2",
      kind: "single",
      tag: "sample",
      q: String.raw`（Practice Midterm SA 2）若将双向无穷带图灵机修改为“每步读写当前格后，磁头必须向左或向右恰好跳过 2 格（移动 \(\pm 2\)）”，该变体能否判定 \(\{0,1\}^*\) 上的所有可判定语言？`,
      choices: [
        ["a", String.raw`不能，因为每次移动 \(\pm 2\) 保持磁头位置坐标的奇偶性不变，磁头有一半的输入字符永远无法读取（如无法区分 \(10\) 与 \(00\)，或 \(10\) 与 \(11\)）`],
        ["b", String.raw`能，根据丘奇-图灵论题一切图灵机变体都等价`],
        ["c", String.raw`能，只要先把状态数扩大一倍即可`],
        ["d", String.raw`只能判定 NP 完全语言`]
      ],
      answer: ["a"],
      why: String.raw`每次移动 \(\pm 2\) 格不改变位置奇偶性：若从左端空白格出发则只能读第 \(2, 4, 6\dots\) 个输入字符（无法区分 \(10\) 和 \(00\)），若从第 1 格出发则只能读第 \(1, 3, 5\dots\) 个输入字符（无法区分 \(10\) 和 \(11\)）。`
    },
    {
      id: "pm-la1",
      kind: "single",
      tag: "sample",
      q: String.raw`（Practice Midterm LA 1）在官方解答证明 \(L_{\mathrm{even\text{-}acc}} = \{\langle M \rangle \mid L(M) = \{x : |x| \text{ is even}\}\}\) 不可识别（归约 \(\overline{A_{\mathrm{TM}}} \le_m L_{\mathrm{even\text{-}acc}}\)）时，构造的机器 \(M_w(x)\) 是如何设计的？`,
      choices: [
        ["a", String.raw`若 \(|x|\) 为偶数则直接接受；若 \(x \ne 1\) 且 \(|x|\) 为奇数则拒绝；若 \(x = 1\)（或对所有奇数长串）则模拟 \(M(w)\) 并在 \(M(w)\) 接受时接受`],
        ["b", String.raw`若 \(|x|\) 为奇数则直接接受；否则模拟 \(M(w)\)`],
        ["c", String.raw`忽略 \(x\)，直接模拟 \(M(w)\)，若接受则接受`],
        ["d", String.raw`对所有 \(x\) 直接拒绝`]
      ],
      answer: ["a"],
      why: String.raw`当 \(M\) 不接受 \(w\) 时，\(M_w\) 在 \(x=1\)（或所有奇数长串）上不接受，故恰好只接受偶数长串，\(\langle M_w \rangle \in L_{\mathrm{even\text{-}acc}}\)；当 \(M\) 接受 \(w\) 时，\(M_w\) 还额外接受奇数长串 \(x=1\)，故 \(\langle M_w \rangle \notin L_{\mathrm{even\text{-}acc}}\)。`
    },
    {
      id: "pm-la2",
      kind: "single",
      tag: "sample",
      q: String.raw`（Practice Midterm LA 2）语言 \(L = \{\langle M \rangle \mid L(M) \text{ contains a string of the form } 0^n 1^n \text{ for } n \ge 0\}\) 的可判定性与可识别性分类是：`,
      choices: [
        ["a", String.raw`不可判定，但可识别（Undecidable and Recognizable）`],
        ["b", String.raw`可判定（Decidable）`],
        ["c", String.raw`不可识别（Unrecognizable）`],
        ["d", String.raw`属于复杂性类 P`]
      ],
      answer: ["a"],
      why: String.raw`在第 \(i\) 阶段将 \(M\) 在 \(\varepsilon, 01, \dots, 0^i 1^i\) 上的运行各推进 1 步（若 \(0^n 1^n\) 在 \(t\) 步内被接受，则在第 \(n+t\) 阶段被接受），故可识别；再由 \(A_{\mathrm{TM}} \le_m L\)（\(M_w(x)\) 仅在 \(x=01\) 时模拟 \(M(w)\)）知不可判定。`
    }
  ],
  cards: [
    [
      String.raw`（Practice Midterm MC 1）官方解答如何证明 \(\{L : L \subseteq \{0,1\}^* \text{ is a finite language}\}\) 可数？`,
      String.raw`按有限语言中所含全部字符串的总长度（total length）分入不同类别；每个类别都是有限集，在类别内排序后再按总长度递增依次枚举。`
    ],
    [
      String.raw`（Practice Midterm SA 1）证明全体双射 \(f: \mathbb{N} \to \mathbb{N}\) 不可数时，为什么不能直接令 \(g(i) = f_i(i) + 1\)？官方如何构造？`,
      String.raw`\(f_i(i)+1\) 未必是双射！官方在每个配对块 \(\{2i-1, 2i\}\) 上定义：若 \(f_i(2i-1)=2i-1\) 则交换 \((2i, 2i-1)\)，否则保持 \((2i-1, 2i)\)，从而保证 \(g\) 既是双射又满足 \(g(2i-1) \ne f_i(2i-1)\)。`
    ],
    [
      String.raw`（Practice Midterm SA 2）为什么每次固定移动 \(\pm 2\) 格的图灵机不能判定所有可判定语言？`,
      String.raw`每步移动保持磁头位置奇偶性不变：从左端空白格出发只能访问第 \(2, 4, 6\dots\) 个输入字符，永远读不到第 1 个字符（无法区分 \(10\) 和 \(00\)，故无法判定 \(L=\{10\}\)）。`
    ],
    [
      String.raw`（Practice Midterm LA 1）官方解答如何把 \(\overline{A_{\mathrm{TM}}}\) 归约到 \(L_{\mathrm{even\text{-}acc}}\)？`,
      String.raw`构造 \(M_w(x)\)：偶长串直接接受；\(x \ne 1\) 的奇长串直接拒绝；\(x = 1\) 时模拟 \(M(w)\)。于是 \(M\) 不接受 \(w \iff L(M_w) = \{\text{偶长串}\}\)。`
    ],
    [
      String.raw`（Practice Midterm LA 2）官方解答如何用 Dovetailing 识别 \(L = \{\langle M \rangle \mid \exists n \ge 0,\, 0^n 1^n \in L(M)\}\)？`,
      String.raw`第 \(i\) 阶段将 \(M\) 在 \(\varepsilon, 01, \dots, 0^i 1^i\) 上的运行各推进 1 步；若 \(0^n 1^n\) 在 \(t\) 步内被接受，则在第 \(n+t\) 阶段结束时被识别机接受。`
    ]
  ]
});
