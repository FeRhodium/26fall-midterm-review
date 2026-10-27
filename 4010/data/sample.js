Review.add({
  id: "sample",
  group: "exam",
  n: 1,
  short: "Practice Midterm 样卷",
  title: "Practice Midterm 官方样卷全解（36 分 · 3 多选 + 4 简答 + 2 证明大题）",
  meta: "Official Practice Midterm (Oct 22, 2026) · 逐题标准证明与评分标准解析",
  sources: [
    { label: "Practice Midterm (Official PDF)", href: "materials/PracticeMidterm.pdf" }
  ],
  html: String.raw`
<p class="lede">本卷为课程官方发布的 <strong>CSC4010 Practice Midterm</strong>（满分 <strong>36 分</strong>，考试时长 60 分钟，允许携带 1 张单面 A4 本人手写小抄）。全卷结构与正式期中完全一致：<strong>3 道不定项选择题</strong>（每题 4 分，共 12 分；全对得 4 分，每多选或漏选一项扣 1 分，最低 0 分）、<strong>4 道简答题</strong>（每题 3 分，共 12 分）与 <strong>2 道综合证明大题</strong>（每题 6 分，共 12 分）。</p>

<div class="callout must">
  <strong>试卷结构与答题计分核心提醒</strong>
  <ul>
    <li><strong>Section 1 · Multiple Choice（3 题 × 4 分 = 12 分）</strong>：“Select all valid options; this could be all of them, none of them, or something in between.” 按每个选项独立判断 T/F 计分，<strong>每错判 1 个选项（误选或漏选）扣 1 分</strong>，扣完为止。</li>
    <li><strong>Section 2 · Short Answer（4 题 × 3 分 = 12 分）</strong>：要求给出明确结论（如 Countable/Uncountable、Yes/No）并写出 3–5 行核心数学构造或反例。</li>
    <li><strong>Section 3 · Long Answer（2 题 × 6 分 = 12 分）</strong>：考查可识别性/不可识别性/可判定性的完整形式化证明（如套用 PS4 不可识别归约模板证明 \(\overline{A_{\mathrm{TM}}} \le_m L\)，以及用交错模拟 Dovetailing 证明可识别性）。</li>
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
  <strong>标准答案：选第 1、2、4 项（即除 \(\{L : L \subseteq \{0,1\}^*\}\) 外的其余三项）</strong>
  <ul>
    <li><strong>选项 1（可数，应选）</strong>：每台图灵机 \(M\) 的描述编码 \(\langle M \rangle\) 都是一个有限长度的二进制串，因此 \(\{\langle M \rangle \mid M \text{ is a TM}\} \subseteq \{0, 1\}^*\)。由于 \(\{0, 1\}^*\) 是可数无穷集（Lecture 1），其任意子集必然可数。</li>
    <li><strong>选项 2（可数，应选）</strong>：\(\{\langle M \rangle x \mid M \text{ accepts } x\}\)（即接受问题语言 \(A_{\mathrm{TM}}\)）中的每一个元素都是有限二进制串 \(\langle M \rangle x \in \{0, 1\}^*\)。注意：<strong>一个语言 \(A \subseteq \{0,1\}^*\) 作为字符串集合总是可数的</strong>（其不可判定性与集合基数是否可数无关！）。</li>
    <li><strong>选项 3（不可数，不选）</strong>：\(\{L : L \subseteq \{0, 1\}^*\} = \mathcal{P}(\{0, 1\}^*)\) 是可数无穷集 \(\{0, 1\}^*\) 的幂集。由 Lecture 2 康托尔定理（Cantor's Theorem），\(|\mathcal{P}(\{0, 1\}^*)| &gt; |\{0, 1\}^*| = |\mathbb{N}|\)，故全体语言的集合不可数。</li>
    <li><strong>选项 4（可数，应选）</strong>：设 \(\mathcal{F}\) 为 \(\{0, 1\}^*\) 的全体<strong>有限子集（有限语言）</strong>构成的集合。对于任意有限语言 \(L = \{w_1, w_2, \dots, w_k\}\)（按字典序排列），我们可以用分隔符将其编码为一个有限字符串（例如在字母表 \(\{0, 1, \#\}\) 上写为 \(w_1 \# w_2 \# \dots \# w_k\)，再逐字符用两位二进制编码 \(0 \mapsto 00, 1 \mapsto 01, \# \mapsto 10\)），从而构造单射 \(f: \mathcal{F} \to \{0, 1\}^*\)；或者写成可数并 \(\mathcal{F} = \bigcup_{n \in \mathbb{N}} \{L \subseteq \{0, 1\}^{\le n}\}\)，其中每一项都是有限集（大小 \(2^{2^{n+1}-1}\)），可数个有限集的并集是可数的。</li>
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
  <strong>标准答案：仅选第 1 项（Language \(\overline{L}\) is decidable）</strong>
  <ul>
    <li><strong>选项 1（成立，应选）</strong>：可判定语言对补运算封闭（Lecture 4）。若 \(\overline{L}\) 可被判定机 \(M\) 判定，交换 \(M\) 的 \(q_{\mathrm{acc}}\) 与 \(q_{\mathrm{rej}}\) 即得判定 \(\overline{\overline{L}} = L\) 的图灵机。</li>
    <li><strong>选项 2（不成立，不选）</strong>：反例：取 \(A = \{0, 1\}^*\)（显然可判定），取 \(L = A_{\mathrm{TM}} \subseteq \{0, 1\}^*\)。虽然 \(L \subseteq A\) 且 \(A\) 可判定，但 \(L = A_{\mathrm{TM}}\) 不可判定！（任何语言都是可判定语言 \(\{0,1\}^*\) 的子集）。</li>
    <li><strong>选项 3（不成立，不选）</strong>：<strong>归约方向陷阱！</strong>Lecture 8 定理指出：若 \(L \le_m A\) 且 \(A\) 可判定，才能推出 \(L\) 可判定。而 \(A \le_m L\) 表示“\(A\) 不比 \(L\) 难”，当简单的 \(A\)（如 \(A = \emptyset\) 或 \(A = L_{0^* 1^*}\)）归约到复杂的 \(L\)（如 \(L = A_{\mathrm{TM}}\)）时，完全不能推出 \(L\) 可判定（事实上对任意可判定语言 \(A\) 都有 \(A \le_m A_{\mathrm{TM}}\)，见 PS4 Q1）。</li>
    <li><strong>选项 4（不成立，不选）</strong>：反例：取 \(A = \emptyset\)（可判定），\(B = A_{\mathrm{TM}}\)（不可判定）。此时 \(A\) 可判定，但 \(L = A \cup B = A_{\mathrm{TM}}\) 不可判定。</li>
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
  <strong>标准答案：选第 2、4 项</strong>
  <ul>
    <li><strong>选项 1（不一定真，不选）</strong>：\(T_A(n) = O(n^3)\) 仅给出了最坏运行时间的<strong>上界</strong>。例如 \(T_A(n) = n\) 满足 \(n = O(n^3)\)，但 \(n \ne \Omega(n^2)\)。</li>
    <li><strong>选项 2（必真，应选）</strong>：由 \(T_B(n) = \Theta(n^2)\) 知存在常数 \(c &gt; 0, n_0\) 使对一切 \(n \ge n_0\) 有 \(T_B(n) \le c n^2 \le c n^3\)，故 \(T_B(n) = O(n^3)\)。</li>
    <li><strong>选项 3（不一定真，不选）</strong>：有两个原因使其不成立：(i) 渐近记号只约束<strong>充分大的 \(n\)</strong>，在小规模输入上 \(C\) 的常数因子可能远大于 \(B\)；(ii) 即便 \(n\) 很大，\(T_B(n) = \Theta(n^2)\) 也只是所有长度为 \(n\) 的输入中的<strong>最坏（最大）步数</strong>，算法 \(B\) 在某些特定输入 \(x\)（如全 \(0\) 串）上可能只需 \(O(1)\) 步停机，此时比耗时 \(n \log n\) 的 \(C\) 更快。</li>
    <li><strong>选项 4（必真，应选）</strong>：因为 \(T_B(n) = \Theta(n^2)\) 是长度为 \(n\) 的最坏运行时间，对每个 \(n\)，必<strong>存在</strong>一个最坏输入 \(x_n \in \{0, 1\}^n\) 使得 \(B\) 在 \(x_n\) 上的步数恰为 \(T_B(n) \ge c_1 n^2\)。而在同一输入 \(x_n\) 上，\(C\) 的运行步数不超过其最坏时间 \(T_C(n) \le c_2 n \log n\)。当 \(n\) 充分大时 \(c_2 n \log n &lt; c_1 n^2\)，故在输入 \(x_n\) 上 \(C\) 必然比 \(B\) 快！</li>
  </ul>
</div>

<h2>二、Short Answer 简答题（每题 3 分，共 12 分）</h2>

<h3>SA 1（3 分）：自然数双射全体是否可数</h3>
<p><strong>原题</strong>：Consider the set of all bijections \(f: \mathbb{N} \to \mathbb{N}\). Is this set countable or uncountable? Give a short explanation.</p>
<div class="callout ex">
  <strong>标准解答（Uncountable / 不可数）</strong>
  <p><strong>结论</strong>：全体双射 \(B = \{f: \mathbb{N} \to \mathbb{N} \mid f \text{ is a bijection}\}\) 是<strong>不可数集（Uncountable）</strong>。</p>
  <p><strong>证法一（康托尔对角化直接构造反例）</strong>：假设 \(B\) 可数，则可将其元素枚举为序列 \(f_0, f_1, f_2, \dots\)。我们将自然数集两两配对划分为互不相交的二元块 \(P_k = \{2k, 2k+1\}\)（\(k = 0, 1, 2, \dots\)）。构造映射 \(g: \mathbb{N} \to \mathbb{N}\)，在每个块 \(P_k\) 内部独立定义如下：</p>
  <ul>
    <li>若 \(f_k(2k) = 2k\)，则令 \(g(2k) = 2k+1\) 且 \(g(2k+1) = 2k\)（对换 \(2k\) 与 \(2k+1\)）；</li>
    <li>若 \(f_k(2k) \ne 2k\)，则令 \(g(2k) = 2k\) 且 \(g(2k+1) = 2k+1\)（在 \(P_k\) 上保持恒等）。</li>
  </ul>
  <p>由于 \(g\) 在每个二元块 \(\{2k, 2k+1\}\) 上都是到自身的双射，故 \(g: \mathbb{N} \to \mathbb{N}\) 是全集上的双射，即 \(g \in B\)。但对任意 \(k \in \mathbb{N}\)，均有 \(g(2k) \ne f_k(2k)\)，故 \(g \ne f_k\) 对所有 \(k\) 成立，矛盾！</p>
  <p><strong>证法二（从无限二进制序列 \(\{0,1\}^{\mathbb{N}}\) 构造单射）</strong>：对任意无限二进制序列 \(a = (a_0, a_1, a_2, \dots) \in \{0, 1\}^{\mathbb{N}}\)，定义一个双射 \(f_a: \mathbb{N} \to \mathbb{N}\)：对每个 \(k \in \mathbb{N}\)，若 \(a_k = 0\)，则令 \(f_a(2k) = 2k,\; f_a(2k+1) = 2k+1\)；若 \(a_k = 1\)，则令 \(f_a(2k) = 2k+1,\; f_a(2k+1) = 2k\)。显然每个 \(f_a\) 都是双射，且 \(a \ne b \implies f_a \ne f_b\)。因此 \(|\{0, 1\}^{\mathbb{N}}| \le |B|\)。由 Lecture 2 知 \(|\{0, 1\}^{\mathbb{N}}| = |\mathcal{P}(\mathbb{N})| &gt; |\mathbb{N}|\) 不可数，故 \(B\) 不可数。</p>
</div>

<h3>SA 2（3 分）：每次固定跳两格的图灵机变体</h3>
<p><strong>原题</strong>：Consider a variant of a Turing machine with a two-way infinite tape. At each step, its head reads and writes only the current cell and then moves exactly two cells to the left or right, without reading or writing the skipped cell. The binary input is written in consecutive cells, and the head initially points to the first input cell. Can this variant decide every decidable language over \(\{0, 1\}\)? Give a short explanation.</p>
<div class="callout ex">
  <strong>标准解答（No / 不能）</strong>
  <p><strong>结论</strong>：<strong>不能（No）</strong>，该变体甚至无法判定诸如 \(\mathrm{PARITY}\) 或 \(L = \{11\}\) 等极简单的可判定语言。</p>
  <p><strong>证明与解释</strong>：将纸带上的格按整数坐标 \(\mathbb{Z}\) 编号，设输入 \(w = w_1 w_2 \dots w_n\) 依次写在格 \(1, 2, \dots, n\) 上，读写头初始位于第 \(1\) 格。由于每一步读写头只能向左或向右移动<strong>恰好 \(2\) 格</strong>（即位置坐标每次变化 \(\pm 2\)），读写头在任何时刻所能到达的格坐标恒为<strong>奇数</strong>（\(1 + 2k\)），<strong>永远无法访问任何偶数坐标格（如第 \(2, 4, 6, \dots\) 格）</strong>！</p>
  <p>因此，该机器对输入串的第 \(2\) 个字符 \(w_2\) 完全“失明”：它在输入 \(w = 10\) 与输入 \(w' = 11\) 上的每一步读入符号、状态转移与停机结果必定完全相同，故无法区分 \(10\) 与 \(11\)，从而无法判定 \(L = \{11\}\)（或 \(\mathrm{PARITY}\)）。</p>
</div>

<h3>SA 3（3 分）：可识别语言对并运算的封闭性</h3>
<p><strong>原题</strong>：Let \(A, B \subseteq \{0, 1\}^*\) be recognizable languages. Show that \(A \cup B\) is recognizable.</p>
<div class="callout ex">
  <strong>标准解答（并行/交错模拟 Dovetailing）</strong>
  <p><strong>证明</strong>：因为 \(A, B\) 是可识别语言，设图灵机 \(M_A, M_B\) 分别识别 \(A\) 和 \(B\)。构造一台双带（或交错模拟）图灵机 \(M\) 识别 \(A \cup B\)，对输入 \(x \in \{0, 1\}^*\)：</p>
  <ol>
    <li>将输入 \(x\) 复制到两条工作带上。</li>
    <li>按步数 \(i = 1, 2, 3, \dots\) <strong>交错（或同步并行）模拟</strong> \(M_A(x)\) 的第 \(i\) 步与 \(M_B(x)\) 的第 \(i\) 步：
      <ul>
        <li>若在某一步 \(M_A(x)\) 进入接受状态，则 \(M\) <strong>立即停机并接受</strong> \(x\)；</li>
        <li>若在某一步 \(M_B(x)\) 进入接受状态，则 \(M\) <strong>立即停机并接受</strong> \(x\)；</li>
        <li>若 \(M_A(x)\) 与 \(M_B(x)\) <strong>双方均已停机并拒绝</strong>，则 \(M\) 停机并拒绝 \(x\)。</li>
      </ul>
    </li>
  </ol>
  <p><strong>正确性</strong>：若 \(x \in A \cup B\)，则 \(M_A(x)\) 或 \(M_B(x)\) 至少有一台会在有限步 \(t\) 内接受；由于采用按步交错模拟（而非先跑完 \(M_A\) 再跑 \(M_B\)），即便另一台机器死循环，\(M\) 也会在第 \(t\) 轮内检测到接受并停机接受。若 \(x \notin A \cup B\)，则 \(M_A(x)\) 与 \(M_B(x)\) 均不接受，\(M\) 永不接受。故 \(L(M) = A \cup B\)，\(A \cup B\) 可识别。</p>
  <p><em>（注：答题时务必强调“并行/按步交错模拟”，绝不能写“先运行 \(M_A(x)\)，若拒绝再运行 \(M_B(x)\)”，因为当 \(x \notin A\) 且 \(x \in B\) 时，\(M_A(x)\) 可能死循环导致永远无法运行 \(M_B(x)\)！）</em></p>
</div>

<h3>SA 4（3 分）：证明合数语言 \(\mathrm{COMPOSITE} \in \mathrm{NP}\)</h3>
<p><strong>原题</strong>：Let \(\mathrm{COMPOSITE}\) be the language of nonempty binary strings representing composite integers. Briefly describe a polynomial-size certificate and a polynomial-time verifier showing that \(\mathrm{COMPOSITE} \in \mathrm{NP}\).</p>
<div class="callout ex">
  <strong>标准解答</strong>
  <ul>
    <li><strong>多项式长度证书（Certificate）</strong>：对表示正整数 \(N\) 的二进制串 \(x\)（位长 \(n = |x| = \lfloor \log_2 N \rfloor + 1\)），证书 \(c = \langle a, b \rangle\) 为两个正整数 \(a, b\) 的二进制编码。由于 \(N\) 的非平凡因子满足 \(1 &lt; a, b &lt; N\)，\(a\) 和 \(b\) 的二进制位长均不超过 \(n\)，故证书长度 \(|c| = O(n)\) 是输入长度 \(|x|\) 的多项式。</li>
    <li><strong>多项式时间验证机（Verifier \(V(x, c)\)）</strong>：
      <ol>
        <li>检查证书格式 \(c = \langle a, b \rangle\)，若 \(|a| &gt; |x|\) 或 \(|b| &gt; |x|\) 则拒绝；</li>
        <li>比较二进制整数大小，验证 \(1 &lt; a &lt; N\) 且 \(1 &lt; b &lt; N\)；</li>
        <li>执行二进制整数乘法计算乘积 \(p = a \cdot b\)，若 \(p = N\) 则<strong>接受</strong>，否则<strong>拒绝</strong>。</li>
      </ol>
    </li>
    <li><strong>时间复杂度与完备性/可靠性</strong>：\(n\) 位二进制整数比较耗时 \(O(n)\)，笔算乘法耗时 \(O(n^2)\)，故 \(V\) 在 \(O(n^2)\) 多项式时间内停机。\(N\) 是合数 \(\iff\) 存在整数 \(1 &lt; a, b &lt; N\) 使 \(ab = N\)，满足完备性与可靠性，故 \(\mathrm{COMPOSITE} \in \mathrm{NP}\)。</li>
  </ul>
</div>

<h2>三、Long Answer 综合证明大题（每题 6 分，共 12 分）</h2>

<h3>LA 1（6 分）：证明 \(L_{\mathrm{even\text{-}acc}}\) 不可识别</h3>
<p><strong>原题</strong>：Let \(L_{\mathrm{even\text{-}acc}} = \{\langle M \rangle \mid \forall x \in \{0, 1\}^*,\; M(x) \text{ accepts} \iff |x| \text{ is even}\}\). That is, let \(L_{\mathrm{even\text{-}acc}}\) be the language of descriptions of all Turing machines that accept exactly the set of even-length strings. Show that this language is unrecognizable.</p>
<div class="callout ex">
  <strong>标准证明（使用 PS4 不可识别归约模板证明 \(\overline{A_{\mathrm{TM}}} \le_m L_{\mathrm{even\text{-}acc}}\)）</strong>
  <p><strong>证明思路</strong>：我们通过构造映射归约 \(\overline{A_{\mathrm{TM}}} \le_m L_{\mathrm{even\text{-}acc}}\) 来证明 \(L_{\mathrm{even\text{-}acc}}\) 不可识别。我们需要在给定 \(\langle M, w \rangle\) 时，构造一台新图灵机 \(N\)，使得：</p>
  <ul>
    <li>当 \(M\) <strong>不接受</strong> \(w\)（\(\langle M, w \rangle \in \overline{A_{\mathrm{TM}}}\)）时，\(L(N) = \{x \in \{0, 1\}^* \mid |x| \text{ is even}\}\)，从而 \(\langle N \rangle \in L_{\mathrm{even\text{-}acc}}\)；</li>
    <li>当 \(M\) <strong>接受</strong> \(w\)（\(\langle M, w \rangle \notin \overline{A_{\mathrm{TM}}}\)）时，\(N\) 额外接受至少一个奇数长度的字符串（甚至接受全部字符串），从而 \(L(N) \ne \{x \mid |x| \text{ is even}\}\)，即 \(\langle N \rangle \notin L_{\mathrm{even\text{-}acc}}\)。</li>
  </ul>
  <p><strong>形式化构造</strong>：定义归约函数 \(f(\langle M, w \rangle) = \langle N \rangle\)（若输入格式不是合法的 \(\langle M, w \rangle\)，则输出一台拒绝一切输入的固定图灵机 \(\langle M_{\emptyset} \rangle \notin L_{\mathrm{even\text{-}acc}}\)），其中图灵机 \(N\) 的行为定义如下：</p>
  <p>\(N =\) “对输入 \(x \in \{0, 1\}^*\)：</p>
  <ol>
    <li><strong>Part 1</strong>：扫描输入 \(x\) 计算其长度 \(|x|\) 的奇偶性。若 \(|x|\) 是<strong>偶数</strong>，则<strong>立即停机并接受 \(x\)</strong>。</li>
    <li><strong>Simulation Gate</strong>（此时已知 \(|x|\) 是奇数）：在工作带上模拟图灵机 \(M\) 在输入 \(w\) 上的运行：
      <ul>
        <li>若 \(M(w)\) 接受，则进入 Part 2；</li>
        <li>若 \(M(w)\) 拒绝或死循环，则<strong>拒绝或死循环</strong>（不接受 \(x\)）。</li>
      </ul>
    </li>
    <li><strong>Part 2</strong>：<strong>停机并接受 \(x\)</strong>。”</li>
  </ol>
  <p><strong>全可计算性（Computability）</strong>：转换机 \(F\) 只是将 \(\langle M, w \rangle\) 填入上述固定程序模板生成 \(\langle N \rangle\) 的代码描述，并不实际运行 \(M(w)\)，故 \(F\) 对一切输入均在有限步内停机，\(f\) 是全可计算函数。</p>
  <p><strong>双向正确性证明（Correctness）</strong>：</p>
  <ul>
    <li><strong>情形 1：\(\langle M, w \rangle \in \overline{A_{\mathrm{TM}}}\)（即 \(M\) 不接受 \(w\)）</strong>。此时对任意偶数长度串 \(x\)，\(N\) 在第 1 步直接接受；对任意奇数长度串 \(x\)，\(N\) 进入第 2 步模拟 \(M(w)\)，由于 \(M\) 不接受 \(w\)，\(N\) 永远不会到达第 3 步，故不接受任何奇数长度串。因此 \(L(N) = \{x \in \{0, 1\}^* \mid |x| \text{ is even}\}\)，即 \(f(\langle M, w \rangle) = \langle N \rangle \in L_{\mathrm{even\text{-}acc}}\)。</li>
    <li><strong>情形 2：\(\langle M, w \rangle \notin \overline{A_{\mathrm{TM}}}\)（即 \(M\) 接受 \(w\)）</strong>。此时对所有偶数长度串 \(N\) 在第 1 步接受，而对所有奇数长度串（例如 \(x = 0\)，\(|x| = 1\)），\(N\) 在第 2 步模拟 \(M(w)\) 有限步后发现 \(M\) 接受，于是进入第 3 步也接受 \(x\)。因此 \(L(N) = \{0, 1\}^* \ne \{x \mid |x| \text{ is even}\}\)，故 \(f(\langle M, w \rangle) = \langle N \rangle \notin L_{\mathrm{even\text{-}acc}}\)。</li>
  </ul>
  <p><strong>结论</strong>：综上，\(\langle M, w \rangle \in \overline{A_{\mathrm{TM}}} \iff f(\langle M, w \rangle) \in L_{\mathrm{even\text{-}acc}}\)，故 \(\overline{A_{\mathrm{TM}}} \le_m L_{\mathrm{even\text{-}acc}}\)。由 Lecture 7 知 \(\overline{A_{\mathrm{TM}}}\) 不可识别，再由 Lecture 8 映射归约性质（\(A \le_m B\) 且 \(A\) 不可识别 \(\implies B\) 不可识别），证得 \(L_{\mathrm{even\text{-}acc}}\) <strong>不可识别（unrecognizable）</strong>。</p>
</div>

<h3>LA 2（6 分）：判定 \(L(M)\) 是否含 \(0^n 1^n\) 型字符串</h3>
<p><strong>原题</strong>：Consider the language
\[
  L = \{\langle M \rangle \mid L(M) \text{ contains a string of the form } 0^n 1^n \text{ for } n \ge 0\}.
\]
Is this language decidable or undecidable? Is it recognizable or unrecognizable? Justify your answer.</p>
<div class="callout ex">
  <strong>标准证明（Undecidable 且 Recognizable / 不可判定但可识别）</strong>
  <p><strong>总结论</strong>：语言 \(L\) 是<strong>不可判定的（Undecidable）</strong>，但它是<strong>可识别的（Recognizable）</strong>。（注：该题与 PS3 Problem 3“\(L(M)\) 含回文串”结构完全同构，印证了 Syllabus 中“30%–40% 考题改编自作业”的规律！）</p>

  <h4>第一部分：证明 \(L\) 是可识别的（Recognizable，3 分）</h4>
  <p>构造一台使用<strong>交错模拟（Dovetailing）</strong>的图灵机 \(R\) 识别 \(L\)。对输入 \(\langle M \rangle\)：</p>
  <ol>
    <li>若输入不是合法的图灵机编码，直接拒绝。</li>
    <li>按阶段 \(s = 1, 2, 3, \dots\) 循环执行：
      <ul>
        <li>在第 \(s\) 阶段，对每一个整数 \(n \in \{0, 1, 2, \dots, s\}\)，生成字符串 \(w_n = 0^n 1^n\)，并使用通用图灵机模拟 \(M\) 在输入 \(w_n = 0^n 1^n\) 上运行<strong>至多 \(s\) 步</strong>；</li>
        <li>若存在某个 \(n \le s\) 使得 \(M(0^n 1^n)\) 在 \(s\) 步之内停机并<strong>接受</strong>，则 \(R\) <strong>立即停机并接受 \(\langle M \rangle\)</strong>；</li>
        <li>否则进入第 \(s + 1\) 阶段。</li>
      </ul>
    </li>
  </ol>
  <p><strong>正确性</strong>：</p>
  <ul>
    <li>若 \(\langle M \rangle \in L\)，则存在某个 \(n_0 \ge 0\) 使得 \(0^{n_0} 1^{n_0} \in L(M)\)，即 \(M\) 在输入 \(0^{n_0} 1^{n_0}\) 上会在某个有限步数 \(t_0\) 内停机接受。取 \(s = \max(n_0, t_0)\)，由于每一阶段检查的 \(n\) 范围有限且每台模拟限制在有限步，\(R\) 必定会在有限时间内到达第 \(s\) 阶段（或更早）并停机接受 \(\langle M \rangle\)。</li>
    <li>若 \(\langle M \rangle \notin L\)，则对一切 \(n \ge 0\)，\(M\) 均不接受 \(0^n 1^n\)，故 \(R\) 永远不会在第 2 步接受（将无限循环）。</li>
  </ul>
  <p>因此 \(L(R) = L\)，即 \(L\) 是<strong>可识别的</strong>。</p>

  <h4>第二部分：证明 \(L\) 是不可判定的（Undecidable，3 分）</h4>
  <p><strong>证法一（显式映射归约 \(A_{\mathrm{TM}} \le_m L\)，最稳妥满分写法）</strong>：</p>
  <p>定义归约函数 \(f(\langle M, w \rangle) = \langle M_w \rangle\)，其中图灵机 \(M_w\) 的定义为：</p>
  <p>\(M_w =\) “对输入 \(x \in \{0, 1\}^*\)：忽略 \(x\)，在工作带上模拟 \(M\) 在 \(w\) 上的运行；若 \(M\) 接受 \(w\)，则接受 \(x\)；若 \(M\) 拒绝 \(w\)，则拒绝 \(x\)。”</p>
  <ul>
    <li>\(f\) 仅做代码拼接，不实际运行 \(M(w)\)，故 \(f\) 是全可计算函数。</li>
    <li>若 \(\langle M, w \rangle \in A_{\mathrm{TM}}\)（\(M\) 接受 \(w\)），则 \(M_w\) 接受所有输入，即 \(L(M_w) = \{0, 1\}^*\)，其中包含 \(\varepsilon = 0^0 1^0\)（以及 \(01\) 等），故 \(\langle M_w \rangle \in L\)。</li>
    <li>若 \(\langle M, w \rangle \notin A_{\mathrm{TM}}\)（\(M\) 不接受 \(w\)），则 \(L(M_w) = \emptyset\)，不含任何 \(0^n 1^n\) 型字符串，故 \(\langle M_w \rangle \notin L\)。</li>
  </ul>
  <p>因此 \(\langle M, w \rangle \in A_{\mathrm{TM}} \iff f(\langle M, w \rangle) \in L\)，即 \(A_{\mathrm{TM}} \le_m L\)。因为 \(A_{\mathrm{TM}}\) 不可判定，故 \(L\) <strong>不可判定</strong>。</p>
  <p><strong>证法二（直接引用莱斯定理 Rice's Theorem）</strong>：性质 \(\mathcal{P}(M) \iff L(M) \cap \{0^n 1^n \mid n \ge 0\} \ne \emptyset\) 仅依赖于图灵机识别的语言 \(L(M)\)（是语义性质），且是非平凡的（接受全集 \(\{0,1\}^*\) 的图灵机满足 \(\mathcal{P}\)，而接受空集 \(\emptyset\) 的图灵机不满足 \(\mathcal{P}\)）。由莱斯定理，\(L\) 不可判定。</p>
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
      why: String.raw`A 和 B 均为可数集 \(\{0,1\}^*\) 的子集，必可数；D 中每个有限语言都可以编码为一个有限长度的字符串（或表示为可数个有限集的并），故可数；唯独 C 是 \(\mathcal{P}(\{0,1\}^*)\)，由康托尔定理知不可数。`
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
      why: String.raw`仅 A 正确（可判定语言对补封闭）。B 反例：\(L = A_{\mathrm{TM}} \subseteq \{0,1\}^*\)；C 归约方向反了（需 \(L \le_m A\) 才能由 \(A\) 可判定推出 \(L\) 可判定）；D 反例：\(\emptyset \cup A_{\mathrm{TM}} = A_{\mathrm{TM}}\)。`
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
      why: String.raw`A 错在 \(O(n^3)\) 只是上界（如 \(T_A(n)=n\)）；B 正确因为 \(\Theta(n^2) \subseteq O(n^3)\)；C 错在 \(T_B(n)\) 只是最坏情况且仅对大 \(n\) 成立，\(B\) 在特定输入上可能 \(O(1)\) 步停机；D 正确因为对每个充分大的 \(n\)，取使 \(B\) 达到最坏时间 \(\Theta(n^2)\) 的输入 \(x_n\)，\(C\) 在 \(x_n\) 上至多耗时 \(\Theta(n\log n) &lt; \Theta(n^2)\)。`
    },
    {
      id: "pm-sa1",
      kind: "single",
      tag: "sample",
      q: String.raw`（Practice Midterm SA 1）全体从 \(\mathbb{N}\) 到 \(\mathbb{N}\) 的双射（bijections）构成的集合是可数的还是不可数的？`,
      choices: [
        ["a", String.raw`不可数的（Uncountable），因为在二元块 \(\{2k, 2k+1\}\) 上独立选择恒等或对换即可嵌入不可数的 \(\{0,1\}^{\mathbb{N}}\)`],
        ["b", String.raw`可数的（Countable），因为每个双射都由自然数定义`],
        ["c", String.raw`有限的（Finite）`],
        ["d", String.raw`与 \(\mathbb{Q}\) 等势`]
      ],
      answer: ["a"],
      why: String.raw`将 \(\mathbb{N}\) 划分为配对块 \(\{2k, 2k+1\}\)，每个无限 0-1 序列 \(a \in \{0,1\}^{\mathbb{N}}\) 对应一个双射（\(a_k=1\) 则交换 \(2k, 2k+1\)，否则不变），故基数至少为 \(2^{\aleph_0}\)，不可数。`
    },
    {
      id: "pm-sa2",
      kind: "single",
      tag: "sample",
      q: String.raw`（Practice Midterm SA 2）若将双向无穷带图灵机修改为“每步读写当前格后，磁头必须向左或向右恰好跳过 2 格（移动 \(\pm 2\)）”，该变体能否判定 \(\{0,1\}^*\) 上的所有可判定语言？`,
      choices: [
        ["a", String.raw`不能，因为磁头永远只能访问与初始位置奇偶性相同的磁带格，完全无法读取偶数位置的输入字符`],
        ["b", String.raw`能，根据丘奇-图灵论题一切图灵机变体都等价`],
        ["c", String.raw`能，只要先把状态数扩大一倍即可`],
        ["d", String.raw`只能判定 NP 完全语言`]
      ],
      answer: ["a"],
      why: String.raw`初始在位置 1，每次移动 \(\pm 2\)，故磁头永远处于奇数坐标格 \(1 + 2k\)，对第 2、4、6… 个输入字符完全不可见（如无法区分输入 \(10\) 与 \(11\)）。`
    },
    {
      id: "pm-la1",
      kind: "single",
      tag: "sample",
      q: String.raw`（Practice Midterm LA 1）在用 PS4 模板证明 \(L_{\mathrm{even\text{-}acc}} = \{\langle M \rangle \mid L(M) = \{x : |x| \text{ is even}\}\}\) 不可识别（归约 \(\overline{A_{\mathrm{TM}}} \le_m L_{\mathrm{even\text{-}acc}}\)）时，构造的机器 \(N(x)\) 应如何设计？`,
      choices: [
        ["a", String.raw`Part 1：若 \(|x|\) 为偶数则直接接受；否则模拟 \(M(w)\)，若 \(M(w)\) 接受则在 Part 2 接受 \(x\)`],
        ["b", String.raw`Part 1：若 \(|x|\) 为奇数则直接接受；否则模拟 \(M(w)\)`],
        ["c", String.raw`忽略 \(x\)，直接模拟 \(M(w)\)，若接受则接受`],
        ["d", String.raw`对所有 \(x\) 直接拒绝`]
      ],
      answer: ["a"],
      why: String.raw`按 A 构造：若 \(M\) 不接受 \(w\)（\(\langle M,w\rangle \in \overline{A_{\mathrm{TM}}}\)），则 \(N\) 恰好只接受偶数长串，\(\langle N \rangle \in L_{\mathrm{even\text{-}acc}}\)；若 \(M\) 接受 \(w\)，则 \(N\) 还会接受所有奇数长串（\(L(N)=\{0,1\}^*\)），故 \(\langle N \rangle \notin L_{\mathrm{even\text{-}acc}}\)。`
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
      why: String.raw`按阶段 \(s=1,2,\dots\) 交错模拟 \(M(0^n 1^n)\)（对所有 \(0 \le n \le s\) 各跑 \(s\) 步），一旦发现接受即接受，故可识别；再由莱斯定理（或从 \(A_{\mathrm{TM}}\) 归约）知不可判定。`
    }
  ],
  cards: [
    [
      String.raw`（Practice Midterm MC 1）为什么 \(\{L : L \subseteq \{0,1\}^* \text{ is a finite language}\}\) 是可数集？`,
      String.raw`每个有限语言都由有限个字符串组成，可用分隔符拼接编码为单个有限串（单射到 \(\{0,1\}^*\)），或是可数个有限集的并集，故可数。`
    ],
    [
      String.raw`（Practice Midterm SA 1）如何证明全体双射 \(f: \mathbb{N} \to \mathbb{N}\) 不可数？`,
      String.raw`将 \(\mathbb{N}\) 分为二元块 \(\{2k, 2k+1\}\)。对任意枚举 \(f_0, f_1, \dots\)，构造双射 \(g\) 在第 \(k\) 块上取与 \(f_k(2k)\) 不同的对换/恒等映射（或将 \(\{0,1\}^{\mathbb{N}}\) 单射嵌入）。`
    ],
    [
      String.raw`（Practice Midterm SA 2）为什么每次固定移动 \(\pm 2\) 格的图灵机不能判定所有可判定语言？`,
      String.raw`磁头位置奇偶性不变，永远无法读取偶数坐标格上的输入字符（例如无法区分输入 \(10\) 和 \(11\)）。`
    ],
    [
      String.raw`（Practice Midterm LA 1）如何把 \(\overline{A_{\mathrm{TM}}}\) 归约到 \(L_{\mathrm{even\text{-}acc}}\)？`,
      String.raw`构造 \(N(x)\)：若 \(|x|\) 为偶数直接接受；若 \(|x|\) 为奇数则模拟 \(M(w)\)，\(M(w)\) 接受时才接受 \(x\)。于是 \(M\) 不接受 \(w \iff L(N)=\{\text{偶长串}\}\)。`
    ],
    [
      String.raw`（Practice Midterm LA 2）为什么 \(L = \{\langle M \rangle \mid \exists n \ge 0,\, 0^n 1^n \in L(M)\}\) 可识别但不可判定？`,
      String.raw`可识别：按阶段 \(s=1,2,\dots\) 交错模拟 \(M(0^n 1^n)\)（\(n \le s\)，运行 \(s\) 步）；不可判定：非平凡语义性质（莱斯定理）或 \(A_{\mathrm{TM}} \le_m L\)。`
    ]
  ]
});
