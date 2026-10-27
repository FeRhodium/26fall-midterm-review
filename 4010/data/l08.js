Review.add({
  id: "l08",
  n: 8,
  group: "computability",
  short: "L8 · 映射归约与 E_TM",
  title: "Lecture 8 · 可计算函数、映射归约（Mapping Reducibility）与空语言问题 EMPTY_TM",
  meta: "全可计算函数 f · A <=_m B 的定义与性质 · EMPTY_TM 的不可判定性与不可识别性",
  sources: [
    { href: "materials/CSC4010_Lecture8.pdf", label: "Lecture 8 Slides" },
    { href: "materials/CSC4010_Lecture8(Annotated).pdf", label: "Lecture 8 Annotated" }
  ],
  html: String.raw`
<h2>1. 为什么需要比图灵归约更精细的归约概念？</h2>
<p>在 Lecture 7 中，我们通过“假设存在判定 \(B\) 的图灵机 \(R\)，将其作为子程序构造判定 \(A\) 的图灵机 \(M'\)”证明了 \(\mathrm{HALT}_{\mathrm{TM}}\) 不可判定。同样地，考虑<strong>空语言问题（Emptiness Problem）</strong>：</p>
<div class="formula">\[
  \mathrm{EMPTY}_{\mathrm{TM}} = \{\langle M \rangle \mid M \text{ 是一台图灵机，且 } L(M) = \emptyset\}.
\]</div>
<p>若要证明 \(\mathrm{EMPTY}_{\mathrm{TM}}\) 不可判定，给定 \(A_{\mathrm{TM}}\) 的输入 \(\langle M, w \rangle\)，我们不能直接把 \(\langle M \rangle\) 传给 \(\mathrm{EMPTY}_{\mathrm{TM}}\) 的判定机 \(R\)（因为 \(L(M) \ne \emptyset\) 只说明 \(M\) 接受某个字符串，不代表 \(M\) 接受指定的 \(w\)）。正确的做法是构造一台<strong>辅助图灵机 \(M_w\)</strong>，将原输入 \(w\) 硬编码（hardcode）进 \(M_w\) 的状态转移中：</p>
<pre><code>Machine M_w: On input x in {0, 1}*:
  1. If x != w, immediately REJECT.
  2. If x == w, simulate M on input w (accept if M accepts w; reject if M rejects w).</code></pre>
<p>观察 \(M_w\) 识别的语言 \(L(M_w)\)：</p>
<div class="formula">\[
  L(M_w) = \begin{cases}
    \{w\}, &amp; \text{若 } M \text{ 接受 } w\text{（即 }\langle M, w \rangle \in A_{\mathrm{TM}}\text{）}, \\
    \emptyset, &amp; \text{若 } M \text{ 不接受 } w\text{（即 }\langle M, w \rangle \notin A_{\mathrm{TM}}\text{）}.
  \end{cases}
\]</div>
<p>因此，\(\langle M, w \rangle \in A_{\mathrm{TM}} \iff L(M_w) \ne \emptyset \iff \langle M_w \rangle \notin \mathrm{EMPTY}_{\mathrm{TM}}\)。若 \(R\) 能判定 \(\mathrm{EMPTY}_{\mathrm{TM}}\)，则对 \(\langle M, w \rangle\) 先生成 \(\langle M_w \rangle\) 再运行 \(R(\langle M_w \rangle)\) 并<strong>将答案取反</strong>即可判定 \(A_{\mathrm{TM}}\)，从而证明 \(\mathrm{EMPTY}_{\mathrm{TM}}\) 不可判定。</p>
<p><strong>深入追问</strong>：\(\mathrm{EMPTY}_{\mathrm{TM}}\) 是否可识别？為了系统地证明语言<strong>不可识别（Unrecognizable）</strong>，我们引入不允许对答案取反的<strong>映射归约（Mapping Reduction）</strong>。</p>

<h2>2. 可计算函数与映射归约 \(A \le_m B\)</h2>

<div class="callout must">
  <strong>定义 8.1（可计算函数 / Computable Function）</strong>
  <p>函数 \(f: \Sigma^* \to \Sigma^*\)（在本课程中取 \(\Sigma = \{0, 1\}\)）称为<strong>可计算的（computable）</strong>，如果存在一台图灵机 \(F\)，使得对<strong>任意</strong>输入 \(w \in \{0, 1\}^*\)，\(F\) 都在有限步内停机，且停机时工作带上恰好只留下字符串 \(f(w)\)。</p>
  <p class="muted">关键要求：计算 \(f\) 的图灵机 \(F\) 必须是<strong>全函数计算器（total）</strong>——它在一切输入 \(w\) 上都必须停机，绝不能死循环！</p>
</div>

<div class="callout must">
  <strong>定义 8.2（映射归约 / Mapping Reducibility，记作 \(A \le_m B\)）</strong>
  <p>设 \(A, B \subseteq \{0, 1\}^*\) 为两个语言。称语言 \(A\) <strong>映射归约到（mapping reducible to）</strong>语言 \(B\)，记作 \(A \le_m B\)，当且仅当存在一个<strong>可计算函数</strong> \(f: \{0, 1\}^* \to \{0, 1\}^*\)，使得对每一个 \(w \in \{0, 1\}^*\)：</p>
  <div class="formula">\[
    w \in A \iff f(w) \in B.
  \]</div>
  <p>满足上述充要条件的可计算函数 \(f\) 称为从 \(A\) 到 \(B\) 的一个<strong>映射归约（mapping reduction）</strong>。</p>
</div>

<div class="callout trap">
  <strong>映射归约的双向等价性验证（做题必写步骤）</strong>
  <p>定义中的 \(w \in A \iff f(w) \in B\) 包含<strong>两个方向</strong>，缺一不可：</p>
  <ol>
    <li><strong>正向（完备性）</strong>：\(w \in A \implies f(w) \in B\)（将 YES 实例映射为 YES 实例）；</li>
    <li><strong>反向（可靠性 / 逆否方向）</strong>：\(w \notin A \implies f(w) \notin B\)（将 NO 实例映射为 NO 实例）。</li>
  </ol>
  <p>此外，当 \(f\) 的输出是某台构造出的图灵机编码 \(\langle M_w \rangle\) 时，转换器 \(F\) 只是<strong>在语法上拼写出 \(M_w\) 的代码文本</strong>，而<strong>并不实际运行 \(M_w\)</strong>，因此即使 \(M_w\) 在某些输入上会死循环，生成代码 \(\langle M_w \rangle\) 的过程 \(f\) 依然在有限步内停机（\(f\) 是可计算函数）。</p>
</div>

<h2>3. 映射归约的核心定理与不可判定/不可识别证明配方</h2>

<div class="callout must">
  <strong>定理 8.1（映射归约传递可判定性与可识别性）</strong>
  <p>设语言 \(A, B \subseteq \{0, 1\}^*\) 满足 \(A \le_m B\)（映射归约函数为 \(f\)）：</p>
  <ol>
    <li><strong>可判定性向下传递</strong>：若 \(B\) 是<strong>可判定的</strong>，则 \(A\) 也是<strong>可判定的</strong>。<br>
    <em>证明</em>：设 \(M_B\) 判定 \(B\)。构造 \(M_A\)：在输入 \(w\) 上，先运行 \(F\) 计算出 \(f(w)\)（必停机），再在 \(f(w)\) 上运行 \(M_B\)（必停机）并原样输出 \(M_B\) 的结果。由于 \(M_A\) 接受 \(w \iff M_B\) 接受 \(f(w) \iff f(w) \in B \iff w \in A\)，且全程必停机，故 \(M_A\) 判定 \(A\)。</li>
    <li><strong>可识别性向下传递</strong>：若 \(B\) 是<strong>可识别的</strong>，则 \(A\) 也是<strong>可识别的</strong>。<br>
    <em>证明</em>：完全相同的构造！设 \(M_B\) 识别 \(B\)，令 \(M_A(w)\) 先计算 \(f(w)\)（有限步完成），再在 \(f(w)\) 上运行 \(M_B\)。则 \(w \in A \iff f(w) \in B \iff M_B\) 接受 \(f(w) \iff M_A\) 接受 \(w\)，故 \(M_A\) 识别 \(A\)。</li>
  </ol>
</div>

<div class="callout must">
  <strong>推论 8.1（证明不可判定与不可识别的标准配方，必背！）</strong>
  <p>由定理 8.1 取逆否命题，并结合补集保序性，得到三条核心法则：</p>
  <ol>
    <li><strong>不可判定性向上传递</strong>：若 \(A \le_m B\) 且 \(A\) <strong>不可判定</strong>，则 \(B\) <strong>不可判定</strong>。<br>
    （常用配方：证明 \(A_{\mathrm{TM}} \le_m B\) 或 \(\overline{A_{\mathrm{TM}}} \le_m B\) 或 \(L_{\mathrm{self}} \le_m B\)）。</li>
    <li><strong>不可识别性向上传递</strong>：若 \(A \le_m B\) 且 \(A\) <strong>不可识别</strong>，则 \(B\) <strong>不可识别</strong>。<br>
    （<strong>核心配方：要证目标语言 \(B\) 不可识别，构造从 \(\overline{A_{\mathrm{TM}}}\) 到 \(B\) 的映射归约 \(\overline{A_{\mathrm{TM}}} \le_m B\)</strong>！注意：<strong>绝不能</strong>用 \(A_{\mathrm{TM}} \le_m B\) 来证 \(B\) 不可识别，因为 \(A_{\mathrm{TM}}\) 本身是可识别的！）</li>
    <li><strong>补集同步归约定理</strong>：
    <div class="formula">\[
      A \le_m B \iff \overline{A} \le_m \overline{B}.
    \]</div>
    <em>证明</em>：同一个可计算函数 \(f\) 同时满足 \(w \in A \iff f(w) \in B\) 与 \(w \notin A \iff f(w) \notin B\)（即 \(w \in \overline{A} \iff f(w) \in \overline{B}\)）。</li>
  </ol>
</div>

<h2>4. 经典应用：证明 \(\mathrm{EMPTY}_{\mathrm{TM}}\) 不可识别</h2>
<div class="callout ex">
  <strong>定理 8.2</strong>：\(\mathrm{EMPTY}_{\mathrm{TM}} = \{\langle M \rangle \mid L(M) = \emptyset\}\) 是<strong>不可识别的（Unrecognizable）</strong>（从而也不可判定）。
</div>
<p><strong>形式化证明</strong>：</p>
<ol>
  <li><strong>归约方向选择</strong>：已知 \(\overline{A_{\mathrm{TM}}}\) 不可识别（推论 7.1）。我们将证明 \(\overline{A_{\mathrm{TM}}} \le_m \mathrm{EMPTY}_{\mathrm{TM}}\)。</li>
  <li><strong>构造映射归约函数 \(f\)</strong>：给定输入 \(\langle M, w \rangle\)，定义 \(f(\langle M, w \rangle) = \langle M_w \rangle\)，其中图灵机 \(M_w\) 的代码定义为：
<pre><code>Machine M_w: On input x in {0, 1}*:
  1. If x != w, REJECT.
  2. If x == w, simulate M on input w and output whatever M outputs.</code></pre>
  （由于转换器只需将 \(M\) 和 \(w\) 的编码填入上述固定模板输出 \(\langle M_w \rangle\)，无需实际运行 \(M\)，故 \(f\) 是全可计算函数。）</li>
  <li><strong>双向充要性验证</strong>：
    <div class="formula">\[
      \begin{aligned}
        \langle M, w \rangle \in \overline{A_{\mathrm{TM}}}
        &amp;\iff M \text{ 不接受 } w \\
        &amp;\iff M_w \text{ 对一切输入 } x \text{ 都不接受（即 } L(M_w) = \emptyset\text{）} \\
        &amp;\iff \langle M_w \rangle = f(\langle M, w \rangle) \in \mathrm{EMPTY}_{\mathrm{TM}}.
      \end{aligned}
    \]</div>
  </li>
  <li><strong>结论</strong>：这证明了 \(\overline{A_{\mathrm{TM}}} \le_m \mathrm{EMPTY}_{\mathrm{TM}}\)（等价地，\(A_{\mathrm{TM}} \le_m \overline{\mathrm{EMPTY}_{\mathrm{TM}}}\)）。由推论 8.1(2)，因为 \(\overline{A_{\mathrm{TM}}}\) 不可识别，所以 \(\mathrm{EMPTY}_{\mathrm{TM}}\) <strong>不可识别</strong>。</li>
</ol>
<p class="muted">顺带一提：\(\mathrm{EMPTY}_{\mathrm{TM}}\) 的补集 \(\overline{\mathrm{EMPTY}_{\mathrm{TM}}} = \{\langle M \rangle \mid L(M) \ne \emptyset\}\) 是<strong>可识别的</strong>（通过按步交错枚举所有字符串 \(x_1, x_2, \dots\) 的燕尾法 dovetailing 模拟 \(M(x_i)\)，一旦发现某个输入被接受即接受），但由于 \(\mathrm{EMPTY}_{\mathrm{TM}}\) 不可识别，故 \(\overline{\mathrm{EMPTY}_{\mathrm{TM}}}\) 不可判定。</p>
`,
  questions: [
    {
      id: "l08-q1",
      kind: "single",
      tag: "slide",
      q: String.raw`设语言 \(A, B\) 满足映射归约 \(A \le_m B\)。下列哪一项推断是<strong>错误</strong>的？`,
      choices: [
        ["a", String.raw`若 \(A\) 是可识别的（例如 \(A = A_{\mathrm{TM}}\)），且 \(A\) 不可判定，则可以推出 \(B\) 一定是不可识别的`],
        ["b", String.raw`若 \(B\) 是可判定的，则 \(A\) 一定是可判定的`],
        ["c", String.raw`若 \(A\) 是不可判定的，则 \(B\) 一定是不可判定的`],
        ["d", String.raw`若 \(A\) 是不可识别的（例如 \(A = \overline{A_{\mathrm{TM}}}\)），则 \(B\) 一定是不可识别的`]
      ],
      answer: ["a"],
      why: String.raw`当 \(A = A_{\mathrm{TM}}\) 时，\(A \le_m B\) 只能推出 \(B\) <strong>不可判定</strong>，完全不能推出 \(B\) 不可识别（例如取 \(B = A_{\mathrm{TM}}\) 或 \(B = \mathrm{HALT}_{\mathrm{TM}}\)，都有 \(A_{\mathrm{TM}} \le_m B\)，但 \(B\) 是可识别的！）。要证 \(B\) 不可识别，必须从<strong>不可识别语言</strong>（如 \(\overline{A_{\mathrm{TM}}}\)）归约到 \(B\)。`
    },
    {
      id: "l08-q2",
      kind: "single",
      tag: "slide",
      q: String.raw`在证明 \(\overline{A_{\mathrm{TM}}} \le_m \mathrm{EMPTY}_{\mathrm{TM}}\) 时，归约函数 \(f(\langle M, w \rangle) = \langle M_w \rangle\) 输出了一台辅助图灵机 \(M_w\) 的编码。如果原图灵机 \(M\) 在输入 \(w\) 上会无限循环，那么计算归约函数 \(f\) 的图灵机 \(F\) 在输入 \(\langle M, w \rangle\) 上会怎样？`,
      choices: [
        ["a", String.raw`\(F\) 仍然在有限步内停机并输出代码文本 \(\langle M_w \rangle\)，因为 \(F\) 只是静态地构造 \(M_w\) 的描述，并不实际运行 \(M(w)\)`],
        ["b", String.raw`\(F\) 也会在输入 \(\langle M, w \rangle\) 上无限循环`],
        ["c", String.raw`\(F\) 会停机并输出空串 \(\varepsilon\)`],
        ["d", String.raw`\(F\) 会自动修复 \(M\) 的死循环并输出一台判定机`]
      ],
      answer: ["a"],
      why: String.raw`这是理解映射归约最关键的一点：转换器 \(F\) 相当于一个“代码生成器/编译器”，它只是把 \(\langle M \rangle\) 和 \(w\) 拼接到固定的状态机模板里生成 \(\langle M_w \rangle\) 的二进制描述，绝不自己去执行 \(M(w)\)。因此不论 \(M(w)\) 是否停机，\(F\) 都在有限步内停机。`
    },
    {
      id: "l08-q3",
      kind: "single",
      tag: "slide",
      q: String.raw`在证明 \(\overline{A_{\mathrm{TM}}} \le_m \mathrm{EMPTY}_{\mathrm{TM}}\) 时，所构造的辅助机器 \(M_w(x)\) 为：“若 \(x \ne w\) 则拒绝；若 \(x = w\) 则模拟 \(M(w)\)”。此时 \(f(\langle M, w \rangle) = \langle M_w \rangle\) 还同时给出了哪两个语言之间的映射归约？`,
      choices: [
        ["a", String.raw`\(A_{\mathrm{TM}} \le_m \overline{\mathrm{EMPTY}_{\mathrm{TM}}}\)`],
        ["b", String.raw`\(A_{\mathrm{TM}} \le_m \mathrm{EMPTY}_{\mathrm{TM}}\)`],
        ["c", String.raw`\(\mathrm{EMPTY}_{\mathrm{TM}} \le_m A_{\mathrm{TM}}\)`],
        ["d", String.raw`\(\overline{A_{\mathrm{TM}}} \le_m A_{\mathrm{TM}}\)`]
      ],
      answer: ["a"],
      why: String.raw`由定理 \(A \le_m B \iff \overline{A} \le_m \overline{B}\)，同一个归约函数 \(f\) 满足 \(\langle M, w \rangle \in \overline{A_{\mathrm{TM}}} \iff \langle M_w \rangle \in \mathrm{EMPTY}_{\mathrm{TM}}\)，取否定即得 \(\langle M, w \rangle \in A_{\mathrm{TM}} \iff \langle M_w \rangle \in \overline{\mathrm{EMPTY}_{\mathrm{TM}}}\)。`
    }
  ],
  cards: [
    [
      String.raw`映射归约 \(A \le_m B\) 的形式化定义是什么？`,
      String.raw`存在<strong>全可计算函数</strong> \(f: \Sigma^* \to \Sigma^*\)（计算它的图灵机 \(F\) 对一切输入停机），使得对所有 \(w \in \Sigma^*\)，都有 \(w \in A \iff f(w) \in B\)。`
    ],
    [
      String.raw`用映射归约证明语言 \(B\) 不可识别（unrecognizable）的标准模板是什么？`,
      String.raw`构造从 \(\overline{A_{\mathrm{TM}}}\) 到 \(B\) 的映射归约 \(\overline{A_{\mathrm{TM}}} \le_m B\)（即对 \(\langle M, w \rangle\) 构造 \(\langle M_w \rangle\)，使得 \(M\) 不接受 \(w \iff \langle M_w \rangle \in B\)）。因为 \(\overline{A_{\mathrm{TM}}}\) 不可识别，故 \(B\) 不可识别。`
    ],
    [
      String.raw`如何构造映射归约证明 \(\mathrm{EMPTY}_{\mathrm{TM}} = \{\langle M \rangle \mid L(M) = \emptyset\}\) 不可识别？`,
      String.raw`令 \(f(\langle M, w \rangle) = \langle M_w \rangle\)，其中 \(M_w(x)\)：若 \(x \ne w\) 则拒绝；若 \(x = w\) 则模拟 \(M(w)\)。则 \(\langle M, w \rangle \in \overline{A_{\mathrm{TM}}} \iff M\) 不接受 \(w \iff L(M_w) = \emptyset \iff \langle M_w \rangle \in \mathrm{EMPTY}_{\mathrm{TM}}\)。`
    ]
  ]
});
