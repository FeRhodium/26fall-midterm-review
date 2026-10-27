Review.add({
  id: "l09",
  n: 9,
  group: "computability",
  short: "L9 · EQ_TM 与归约对比",
  title: "Lecture 9 · EQ_TM、NEQ_TM、L_01 的不可识别性与图灵归约 vs 映射归约",
  meta: "EQ_TM 与补集均不可识别 · L_01 不可识别 · 为什么图灵归约不能传递不可识别性",
  sources: [
    { href: "materials/Lecture9_CSC4010.pdf", label: "Lecture 9 Slides" },
    { href: "materials/Lecture9_CSC4010(Annotated).pdf", label: "Lecture 9 Annotated" }
  ],
  html: String.raw`
<h2>1. 等价性问题 \(\mathrm{EQ}_{\mathrm{TM}}\) 与不等价问题 \(\overline{\mathrm{EQ}_{\mathrm{TM}}}\) 均不可识别</h2>
<p>给定两台图灵机的代码，判断它们识别的语言是否完全相同（即两个程序在功能上是否等价），是编译器优化与程序验证的核心问题。形式化定义为：</p>
<div class="formula">\[
  \mathrm{EQ}_{\mathrm{TM}} = \{\langle M_1, M_2 \rangle \mid M_1, M_2 \text{ 是图灵机，且 } L(M_1) = L(M_2)\},
\]</div>
<div class="formula">\[
  \overline{\mathrm{EQ}_{\mathrm{TM}}} = \{\langle M_1, M_2 \rangle \mid M_1, M_2 \text{ 是图灵机，且 } L(M_1) \ne L(M_2)\}.
\]</div>
<p>在 Lecture 7 中我们看到 \(A_{\mathrm{TM}}\) 可识别而 \(\overline{A_{\mathrm{TM}}}\) 不可识别。令人震惊的是：对于 \(\mathrm{EQ}_{\mathrm{TM}}\)，<strong>它本身与它的补集 \(\overline{\mathrm{EQ}_{\mathrm{TM}}}\) 都是不可识别的</strong>！</p>

<h3>1.1 证明 \(\mathrm{EQ}_{\mathrm{TM}}\) 不可识别：\(\overline{A_{\mathrm{TM}}} \le_m \mathrm{EQ}_{\mathrm{TM}}\)</h3>
<p><strong>定理 9.1</strong>：\(\mathrm{EQ}_{\mathrm{TM}}\) 是不可识别的。</p>
<p><strong>形式化证明</strong>：</p>
<ol>
  <li><strong>基准机器准备</strong>：固定一台对所有输入都立即停机拒绝的图灵机 \(M_\emptyset\)，显然 \(L(M_\emptyset) = \emptyset\)。</li>
  <li><strong>构造映射归约 \(f(\langle M, w \rangle) = \langle T_w, M_\emptyset \rangle\)</strong>：给定输入 \(\langle M, w \rangle\)，构造图灵机 \(T_w\)：
<pre><code>Machine T_w: On input x in {0, 1}*:
  1. Ignore input x.
  2. Simulate M on input w; if M accepts w, ACCEPT.</code></pre>
  分析 \(T_w\) 的语言 \(L(T_w)\)：
  <div class="formula">\[
    L(T_w) = \begin{cases}
      \{0, 1\}^*, &amp; \text{若 } M \text{ 接受 } w, \\
      \emptyset, &amp; \text{若 } M \text{ 不接受 } w.
    \end{cases}
  \]</div></li>
  <li><strong>双向充要性验证</strong>：
  <div class="formula">\[
    \begin{aligned}
      \langle M, w \rangle \in \overline{A_{\mathrm{TM}}}
      &amp;\iff M \text{ 不接受 } w \\
      &amp;\iff L(T_w) = \emptyset = L(M_\emptyset) \\
      &amp;\iff \langle T_w, M_\emptyset \rangle = f(\langle M, w \rangle) \in \mathrm{EQ}_{\mathrm{TM}}.
    \end{aligned}
  \]</div></li>
  <li><strong>结论</strong>：因为 \(f\) 可计算，故 \(\overline{A_{\mathrm{TM}}} \le_m \mathrm{EQ}_{\mathrm{TM}}\)。由于 \(\overline{A_{\mathrm{TM}}}\) 不可识别，故 \(\mathrm{EQ}_{\mathrm{TM}}\) <strong>不可识别</strong>。</li>
</ol>

<h3>1.2 证明 \(\overline{\mathrm{EQ}_{\mathrm{TM}}}\) 也不可识别：\(\overline{A_{\mathrm{TM}}} \le_m \overline{\mathrm{EQ}_{\mathrm{TM}}}\)</h3>
<p><strong>定理 9.2</strong>：\(\overline{\mathrm{EQ}_{\mathrm{TM}}} = \{\langle M_1, M_2 \rangle \mid L(M_1) \ne L(M_2)\}\) 也是不可识别的。</p>
<p><strong>形式化证明</strong>：</p>
<ol>
  <li><strong>基准机器切换为全接受机 \(M_{\mathrm{acc}}\)</strong>：固定一台对所有输入 \(x \in \{0, 1\}^*\) 都立即停机接受的图灵机 \(M_{\mathrm{acc}}\)，显然 \(L(M_{\mathrm{acc}}) = \{0, 1\}^*\)。</li>
  <li><strong>构造映射归约 \(g(\langle M, w \rangle) = \langle T_w, M_{\mathrm{acc}} \rangle\)</strong>，其中 \(T_w\) 与定理 9.1 中完全相同（忽略输入 \(x\)，直接模拟 \(M\) 在 \(w\) 上的运行）。</li>
  <li><strong>双向充要性验证</strong>：
  <div class="formula">\[
    \begin{aligned}
      \langle M, w \rangle \in \overline{A_{\mathrm{TM}}}
      &amp;\iff M \text{ 不接受 } w \\
      &amp;\iff L(T_w) = \emptyset \ne \{0, 1\}^* = L(M_{\mathrm{acc}}) \\
      &amp;\iff \langle T_w, M_{\mathrm{acc}} \rangle = g(\langle M, w \rangle) \in \overline{\mathrm{EQ}_{\mathrm{TM}}}.
    \end{aligned}
  \]</div>
  （反之，若 \(\langle M, w \rangle \in A_{\mathrm{TM}}\)，则 \(L(T_w) = \{0, 1\}^* = L(M_{\mathrm{acc}})\)，故 \(\langle T_w, M_{\mathrm{acc}} \rangle \notin \overline{\mathrm{EQ}_{\mathrm{TM}}}\)）。</li>
  <li><strong>结论</strong>：\(\overline{A_{\mathrm{TM}}} \le_m \overline{\mathrm{EQ}_{\mathrm{TM}}}\)，故 \(\overline{\mathrm{EQ}_{\mathrm{TM}}}\) 也<strong>不可识别</strong>！</li>
</ol>

<h2>2. 定点语言判别问题 \(L_{01}\) 的不可识别性</h2>
<div class="callout ex">
  <strong>定理 9.3</strong>：语言 \(L_{01} = \{\langle M \rangle \mid L(M) = \{01\}\}\) 是不可识别的。
</div>
<p><strong>证明（\(\overline{A_{\mathrm{TM}}} \le_m L_{01}\)）</strong>：</p>
<ol>
  <li><strong>设计思路</strong>：我们希望当 \(M\) <strong>不接受</strong> \(w\)（即 \(\langle M, w \rangle \in \overline{A_{\mathrm{TM}}}\)）时，辅助机 \(M_w\) 的语言恰好等于 \(\{01\}\)；而当 \(M\) <strong>接受</strong> \(w\) 时，\(L(M_w)\) 混入其他字符串从而不等于 \(\{01\}\)。</li>
  <li><strong>构造 \(f(\langle M, w \rangle) = \langle M_w \rangle\)</strong>：
<pre><code>Machine M_w: On input x in {0, 1}*:
  1. If x == 01, immediately ACCEPT.
  2. If x != 01, simulate M on input w; if M accepts w, ACCEPT.</code></pre>
  </li>
  <li><strong>语言分析与双向验证</strong>：
    <ul>
      <li>若 \(\langle M, w \rangle \in \overline{A_{\mathrm{TM}}}\)（\(M\) 不接受 \(w\)），则第 2 步永远不接受任何 \(x \ne 01\)，只有第 1 步接受 \(01\)，故 \(L(M_w) = \{01\}\)，即 \(\langle M_w \rangle \in L_{01}\)。</li>
      <li>若 \(\langle M, w \rangle \notin \overline{A_{\mathrm{TM}}}\)（\(M\) 接受 \(w\)），则对所有 \(x \ne 01\) 第 2 步也会接受，故 \(L(M_w) = \{0, 1\}^* \ne \{01\}\)，即 \(\langle M_w \rangle \notin L_{01}\)。</li>
    </ul>
  </li>
  <li>因此 \(\overline{A_{\mathrm{TM}}} \le_m L_{01}\)，从而 \(L_{01}\) 不可识别。</li>
</ol>

<h2>3. 深度对比：图灵归约（Turing Reduction）vs. 映射归约（Mapping Reduction）</h2>
<p>Lecture 9 专门总结了这两类归约的本质差异与适用边界：</p>
<table>
  <thead>
    <tr>
      <th>对比维度</th>
      <th>图灵归约（Turing Reduction）</th>
      <th>映射归约（Mapping Reduction, \(A \le_m B\)）</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>操作机制</strong></td>
      <td>假定拥有 \(B\) 的求解器（神谕/子程序 \(R_B\)），可以多次调用 \(R_B\)，并<strong>允许将 \(R_B\) 的返回结果取反（翻转 Accept / Reject）</strong>。</td>
      <td>仅用一个全可计算函数 \(f\) 将输入 \(w\) 单次转换为 \(f(w)\)，然后<strong>原封不动地直接输出</strong> \(B\) 对 \(f(w)\) 的判断结果（\(w \in A \iff f(w) \in B\)）。</td>
    </tr>
    <tr>
      <td><strong>对补集的敏感性</strong></td>
      <td>不敏感：任何语言 \(L\) 与其补集 \(\overline{L}\) 总是相互图灵归约（只需调用一次并翻转答案）。例如 \(\overline{A_{\mathrm{TM}}}\) 可以图灵归约到 \(A_{\mathrm{TM}}\)。</td>
      <td>高度敏感：<strong>不能翻转答案</strong>。\(\overline{A_{\mathrm{TM}}} \not\le_m A_{\mathrm{TM}}\)（因为 \(A_{\mathrm{TM}}\) 可识别而 \(\overline{A_{\mathrm{TM}}}\) 不可识别）。</td>
    </tr>
    <tr>
      <td><strong>能否证明不可判定性？</strong></td>
      <td><strong>能</strong>（若 \(A\) 不可判定且 \(A\) 图灵归约到 \(B\)，则 \(B\) 不可判定）。</td>
      <td><strong>能</strong>（映射归约是图灵归约的严格特例，\(A \le_m B\) 且 \(A\) 不可判定 \(\implies B\) 不可判定）。</td>
    </tr>
    <tr>
      <td><strong>能否证明不可识别性？</strong></td>
      <td><strong>不能！</strong>反例：\(\overline{A_{\mathrm{TM}}}\) 不可识别，且 \(\overline{A_{\mathrm{TM}}}\) 可图灵归约到 \(A_{\mathrm{TM}}\)，但 \(A_{\mathrm{TM}}\) 却是可识别的！（因为识别机在 NO 实例上可能死循环，翻转输出的操作对识别机失效）。</td>
      <td><strong>能！</strong>因为映射归约不翻转输出，识别机 \(M_B(f(w))\) 的接受行为直接等价于 \(w \in A\)，故 \(\overline{A_{\mathrm{TM}}} \le_m B \implies B\) 不可识别。</td>
    </tr>
  </tbody>
</table>

<div class="callout must">
  <strong>归约术语“把 \(A\) 归约到 \(B\)（Reduce \(A\) to \(B\)）”的直觉备忘</strong>
  <ul>
    <li><strong>算法视角（\(B\) 容易 \(\implies A\) 容易）</strong>：把关于 \(A\) 的问题转化为关于 \(B\) 的问题，用 \(B\) 的求解器去解决 \(A\)。因此 \(A\) 的难度不超过 \(B\)（记号 \(A \le_m B\) 中小于等于号的方向来源）。</li>
    <li><strong>下界/硬度视角（\(A\) 难 \(\implies B\) 难）</strong>：若已知 \(A\) 是难的（不可判定 / 不可识别），通过把已知难问题 \(A\) 归约到目标问题 \(B\)（\(A \le_m B\)），证明目标问题 \(B\) 至少和 \(A\) 一样难。<strong>注意方向：永远是从已知难问题 \(A\) 归约到待证目标问题 \(B\)，绝不能反过来写 \(B \le_m A\)！</strong></li>
  </ul>
</div>
`,
  questions: [
    {
      id: "l09-q1",
      kind: "single",
      tag: "slide",
      q: String.raw`为什么我们<strong>不能</strong>用图灵归约（Turing reduction）来证明一个语言是不可识别的（unrecognizable），而必须使用映射归约（mapping reduction）？`,
      choices: [
        ["a", String.raw`因为图灵归约允许将子程序的输出取反（从而不可识别的 \(\overline{A_{\mathrm{TM}}}\) 可以图灵归约到可识别的 \(A_{\mathrm{TM}}\)），而识别机在拒绝输入上可能死循环，无法通过取反来构造新识别机`],
        ["b", String.raw`因为图灵归约中的转换过程需要指数时间`],
        ["c", String.raw`因为图灵归约只能用于有限语言`],
        ["d", String.raw`因为映射归约不需要可计算函数`]
      ],
      answer: ["a"],
      why: String.raw`在图灵归约中，只需调用一次 \(A_{\mathrm{TM}}\) 的神谕并把答案取反就能解决 \(\overline{A_{\mathrm{TM}}}\)。但对于识别机，当输入不属于 \(A_{\mathrm{TM}}\) 时识别机可能死循环，外层程序永远等不到它返回“拒绝”再去取反。映射归约要求直接返回 \(M_B(f(w))\) 的答案而不做翻转，从而严格保持可识别性。`
    },
    {
      id: "l09-q2",
      kind: "single",
      tag: "slide",
      q: String.raw`在 Lecture 9 中，为证明 \(\overline{\mathrm{EQ}_{\mathrm{TM}}} = \{\langle M_1, M_2 \rangle \mid L(M_1) \ne L(M_2)\}\) 不可识别，我们构造了从 \(\overline{A_{\mathrm{TM}}}\) 到 \(\overline{\mathrm{EQ}_{\mathrm{TM}}}\) 的映射归约 \(g(\langle M, w \rangle) = \langle T_w, M_2 \rangle\)，其中 \(T_w(x)\) 忽略 \(x\) 直接模拟 \(M(w)\)。此时第二台机器 \(M_2\) 应当选为什么？`,
      choices: [
        ["a", String.raw`选为接受所有字符串的机器 \(M_{\mathrm{acc}}\)（满足 \(L(M_{\mathrm{acc}}) = \{0,1\}^*\)）`],
        ["b", String.raw`选为拒绝所有字符串的机器 \(M_\emptyset\)（满足 \(L(M_\emptyset) = \emptyset\)）`],
        ["c", String.raw`选为只接受 \(01\) 的机器`],
        ["d", String.raw`选为 \(T_w\) 自身`]
      ],
      answer: ["a"],
      why: String.raw`当 \(\langle M, w \rangle \in \overline{A_{\mathrm{TM}}}\)（\(M\) 不接受 \(w\)）时，\(L(T_w) = \emptyset\)；当 \(\langle M, w \rangle \notin \overline{A_{\mathrm{TM}}}\)（\(M\) 接受 \(w\)）时，\(L(T_w) = \{0,1\}^*\)。为了使前一种情况满足 \(L(T_w) \ne L(M_2)\) 而后一种情况满足 \(L(T_w) = L(M_2)\)，必须令 \(L(M_2) = \{0,1\}^*\)，即取 \(M_2 = M_{\mathrm{acc}}\)。`
    },
    {
      id: "l09-q3",
      kind: "single",
      tag: "slide",
      q: String.raw`在证明 \(L_{01} = \{\langle M \rangle \mid L(M) = \{01\}\}\) 不可识别时，给定 \(\langle M, w \rangle\)，辅助图灵机 \(M_w(x)\) 应当如何设计才能实现 \(\overline{A_{\mathrm{TM}}} \le_m L_{01}\)？`,
      choices: [
        ["a", String.raw`若 \(x = 01\) 则立即接受；若 \(x \ne 01\) 则模拟 \(M(w)\)（\(M\) 接受 \(w\) 时才接受 \(x\)）`],
        ["b", String.raw`若 \(x = 01\) 则模拟 \(M(w)\)；若 \(x \ne 01\) 则立即拒绝`],
        ["c", String.raw`对所有输入 \(x\) 都直接接受`],
        ["d", String.raw`若 \(x = 01\) 则立即拒绝；若 \(x \ne 01\) 则立即接受`]
      ],
      answer: ["a"],
      why: String.raw`按选项 A 的设计：若 \(M\) 不接受 \(w\)（\(\langle M, w \rangle \in \overline{A_{\mathrm{TM}}}\)），则只有 \(x = 01\) 被接受，\(L(M_w) = \{01\} \implies \langle M_w \rangle \in L_{01}\)；若 \(M\) 接受 \(w\)，则 \(L(M_w) = \{0,1\}^* \ne \{01\} \implies \langle M_w \rangle \notin L_{01}\)。而选项 B 给出的则是 \(A_{\mathrm{TM}} \le_m L_{01}\)，只能证不可判定，不能证不可识别！`
    }
  ],
  cards: [
    [
      String.raw`\(\mathrm{EQ}_{\mathrm{TM}}\) 和 \(\overline{\mathrm{EQ}_{\mathrm{TM}}}\) 分别如何从 \(\overline{A_{\mathrm{TM}}}\) 做映射归约证明不可识别？`,
      String.raw`令 \(T_w(x)\) 忽略 \(x\) 直接模拟 \(M(w)\)（\(M\) 接受 \(w\) 时 \(L(T_w)=\{0,1\}^*\)，否则 \(L(T_w)=\emptyset\)）：<br>1. 证 \(\mathrm{EQ}_{\mathrm{TM}}\) 不可识别：输出 \(\langle T_w, M_\emptyset \rangle\)（与 \(\emptyset\) 比相等）；<br>2. 证 \(\overline{\mathrm{EQ}_{\mathrm{TM}}}\) 不可识别：输出 \(\langle T_w, M_{\mathrm{acc}} \rangle\)（与 \(\{0,1\}^*\) 比不等）。`
    ],
    [
      String.raw`如何通过 \(\overline{A_{\mathrm{TM}}} \le_m L_{01}\) 证明 \(L_{01} = \{\langle M \rangle \mid L(M) = \{01\}\}\) 不可识别？`,
      String.raw`构造 \(M_w(x)\)：若 \(x = 01\) 直接接受；若 \(x \ne 01\) 模拟 \(M(w)\)。则 \(M\) 不接受 \(w \implies L(M_w) = \{01\}\)；\(M\) 接受 \(w \implies L(M_w) = \{0,1\}^* \ne \{01\}\)。`
    ]
  ]
});
