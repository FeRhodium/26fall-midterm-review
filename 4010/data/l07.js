Review.add({
  id: "l07",
  n: 7,
  group: "computability",
  short: "L7 · 对角化与停机问题",
  title: "Lecture 7 · 自拒绝语言 L_self、接受问题 A_TM、补可识别定理与停机问题 HALT_TM",
  meta: "L_self 不可判定 · A_TM 不可判定 · L 可判定 ⟺ L 与 L̄ 均可识别 · A_TM 补集不可识别 · 图灵归约与 HALT_TM",
  sources: [
    { href: "materials/CSC4010_Lecture7.pdf", label: "Lecture 7 Slides" },
    { href: "materials/CSC4010_Lecture7(Annotated).pdf", label: "Lecture 7 Annotated" }
  ],
  html: String.raw`
<h2>1. 第一个显式不可判定语言：自拒绝语言 \(L_{\mathrm{self}}\)</h2>
<p>Lecture 2 通过基数计数证明了不可判定语言的存在性，但没有给出具体问题。现在利用图灵机的二进制编码 \(\langle M \rangle \in \{0, 1\}^*\)，我们可以将图灵机自身的编码 \(\langle M \rangle\) 作为输入喂给 \(M\) 自己，直接构造出显式的对角化语言。</p>

<div class="callout must">
  <strong>定义 7.1（自拒绝图灵机与自拒绝语言 \(L_{\mathrm{self}}\)）</strong>
  <p>若图灵机 \(M\) 在以自身编码 \(\langle M \rangle\) 为输入时停机并拒绝，则称 \(M\) 是<strong>自拒绝的（self-rejecting）</strong>。定义自拒绝语言：</p>
  <div class="formula">\[
    L_{\mathrm{self}} = \{\langle M \rangle \mid M \text{ 是一台图灵机，且 } M \text{ 拒绝 } \langle M \rangle\}.
  \]</div>
</div>

<div class="callout must">
  <strong>定理 7.1</strong>：\(L_{\mathrm{self}}\) 是不可判定的（Undecidable）。
</div>
<p><strong>证明（对角化反证法）</strong>：</p>
<ol>
  <li>假设 \(L_{\mathrm{self}}\) 可判定，则存在一台判定 \(L_{\mathrm{self}}\) 的图灵机 \(M_{\mathrm{self}}\)。这意味着 \(M_{\mathrm{self}}\) 在所有输入上都停机，且对任意图灵机 \(M\)：
  <div class="formula">\[
    M_{\mathrm{self}} \text{ 接受 } \langle M \rangle \iff \langle M \rangle \in L_{\mathrm{self}} \iff M \text{ 拒绝 } \langle M \rangle.
  \]</div></li>
  <li>将 \(M_{\mathrm{self}}\) 自身的编码 \(\langle M_{\mathrm{self}} \rangle\) 作为输入喂给 \(M_{\mathrm{self}}\)（即令上式中的 \(M = M_{\mathrm{self}}\)）：
    <ul>
      <li>若 \(M_{\mathrm{self}}\) <strong>拒绝</strong> \(\langle M_{\mathrm{self}} \rangle\)，则按 \(L_{\mathrm{self}}\) 的定义有 \(\langle M_{\mathrm{self}} \rangle \in L_{\mathrm{self}}\)；但 \(M_{\mathrm{self}}\) 判定 \(L_{\mathrm{self}}\)，故 \(M_{\mathrm{self}}\) 必须<strong>接受</strong> \(\langle M_{\mathrm{self}} \rangle\)，矛盾！</li>
      <li>若 \(M_{\mathrm{self}}\) <strong>接受</strong> \(\langle M_{\mathrm{self}} \rangle\)（即不拒绝 \(\langle M_{\mathrm{self}} \rangle\)），则按定义有 \(\langle M_{\mathrm{self}} \rangle \notin L_{\mathrm{self}}\)；但 \(M_{\mathrm{self}}\) 判定 \(L_{\mathrm{self}}\)，故 \(M_{\mathrm{self}}\) 必须<strong>拒绝</strong> \(\langle M_{\mathrm{self}} \rangle\)，同样矛盾！</li>
    </ul>
  </li>
  <li>因此判定机 \(M_{\mathrm{self}}\) 不存在，\(L_{\mathrm{self}}\) 不可判定。</li>
</ol>

<h2>2. 接受问题 \(A_{\mathrm{TM}}\) 的不可判定性</h2>
<div class="callout must">
  <strong>定义 7.2（图灵机接受问题 \(A_{\mathrm{TM}}\)）</strong>
  <div class="formula">\[
    A_{\mathrm{TM}} = \{\langle M, w \rangle \mid M \text{ 是一台图灵机，且 } M \text{ 接受输入串 } w\}.
  \]</div>
</div>

<div class="callout must">
  <strong>定理 7.2</strong>：\(A_{\mathrm{TM}}\) 是<strong>可识别的（Recognizable）</strong>，但<strong>不可判定（Undecidable）</strong>。
</div>
<p><strong>证明</strong>：</p>
<ol>
  <li><strong>可识别性</strong>：由 Lecture 6 定理 6.1，通用图灵机 \(U\) 在输入 \(\langle M, w \rangle\) 上当且仅当 \(M\) 接受 \(w\) 时停机接受，因此 \(U\) 识别 \(A_{\mathrm{TM}}\)。</li>
  <li><strong>不可判定性（由假想判定机 \(H\) 构造对角机 \(D\)）</strong>：
    <p>假设存在判定 \(A_{\mathrm{TM}}\) 的图灵机 \(H\)，即对任意 \(\langle M, w \rangle\)，\(H\) 必定停机，且：</p>
    <div class="formula">\[
      H(\langle M, w \rangle) = \begin{cases}
        \text{Accept}, &amp; \text{若 } M \text{ 接受 } w, \\
        \text{Reject}, &amp; \text{若 } M \text{ 不接受 } w\text{（拒绝或死循环）}.
      \end{cases}
    \]</div>
    <p>利用 \(H\) 作为子程序，构造如下新图灵机 \(D\)：</p>
<pre><code>Machine D: On input &lt;M&gt; (where M is a Turing machine):
  1. Construct the pair encoding &lt;M, &lt;M&gt;&gt;.
  2. Simulate the decider H on input &lt;M, &lt;M&gt;&gt;.
  3. If H accepts, then REJECT;
     If H rejects, then ACCEPT.</code></pre>
    <p>由于 \(H\) 是判定机，\(D\) 在所有输入上也必定停机，且对任意图灵机 \(M\)：</p>
    <div class="formula">\[
      D \text{ 接受 } \langle M \rangle \iff H \text{ 拒绝 } \langle M, \langle M \rangle \rangle \iff M \text{ 不接受 } \langle M \rangle.
    \]</div>
    <p>现在将 \(\langle D \rangle\) 喂给 \(D\) 自身，立即得到：</p>
    <div class="formula">\[
      D \text{ 接受 } \langle D \rangle \iff D \text{ 不接受 } \langle D \rangle,
    \]</div>
    <p>矛盾！故 \(H\) 不存在，\(A_{\mathrm{TM}}\) 不可判定。</p>
  </li>
</ol>

<h2>3. 判定性与识别性的核心桥梁定理及 \(\overline{A_{\mathrm{TM}}}\) 的不可识别性</h2>
<p>既然 \(A_{\mathrm{TM}}\) 可识别，那么是否所有语言都可识别？下面的基本定理给出了否定回答，并给出了第一个显式的<strong>不可识别语言 \(\overline{A_{\mathrm{TM}}}\)</strong>。</p>

<div class="callout must">
  <strong>定理 7.3（可判定 \(\iff\) 原语言与补语言均可识别，必考定理！）</strong>
  <p>语言 \(L \subseteq \{0, 1\}^*\) 是<strong>可判定的（Decidable）</strong>，当且仅当 \(L\) 与其补集 \(\overline{L} = \{0, 1\}^* \setminus L\) <strong>都是可识别的（Recognizable）</strong>。</p>
</div>

<p><strong>完整双向证明</strong>：</p>
<ul>
  <li><strong>正方向（\(\implies\)）</strong>：若 \(L\) 可判定，由定理 4.1（可判定语言对补运算封闭），\(\overline{L}\) 也可判定。由于任何可判定语言必然是可识别语言，故 \(L\) 与 \(\overline{L}\) 均可识别。</li>
  <li><strong>反方向（\(\Longleftarrow\)，并行/交错模拟构造）</strong>：假设 \(L\) 和 \(\overline{L}\) 均可识别，设图灵机 \(M_1\) 识别 \(L\)，图灵机 \(M_2\) 识别 \(\overline{L}\)。构造双带图灵机 \(M\) 判定 \(L\)：
<pre><code>Machine M: On input w:
  1. Copy w onto Tape 2.
  2. Simulate M1 on w (on Tape 1) and M2 on w (on Tape 2) in parallel, step by step
     (i.e. in round t = 1, 2, 3, ..., execute the t-th step of M1 and the t-th step of M2).
  3. If M1 enters its accept state, immediately ACCEPT and halt.
  4. If M2 enters its accept state, immediately REJECT and halt.</code></pre>
    <p><strong>停机性与正确性验证</strong>：对任意输入 \(w \in \{0, 1\}^*\)，必有 \(w \in L\) 或 \(w \in \overline{L}\)（两者必居其一且互斥）：</p>
    <ul>
      <li>若 \(w \in L\)，因为 \(M_1\) 识别 \(L\)，\(M_1\) 必在有限步 \(t_1\) 内停机接受（而 \(w \notin \overline{L}\)，故 \(M_2\) 绝不会接受 \(w\)），从而 \(M\) 在第 \(t_1\) 轮停机并<strong>接受</strong> \(w\)；</li>
      <li>若 \(w \notin L\)，则 \(w \in \overline{L}\)，因为 \(M_2\) 识别 \(\overline{L}\)，\(M_2\) 必在有限步 \(t_2\) 内停机接受（而 \(M_1\) 绝不会接受 \(w\)），从而 \(M\) 在第 \(t_2\) 轮停机并<strong>拒绝</strong> \(w\)。</li>
    </ul>
    <p>注意：<strong>不能先完整运行完 \(M_1\) 再运行 \(M_2\)（串行模拟）</strong>，因为当 \(w \notin L\) 时 \(M_1\) 可能无限循环，导致永远轮不到运行 \(M_2\)！必须按步交错（或双带同步）运行 \(M_1\) 与 \(M_2\)。</p>
  </li>
</ul>

<div class="callout must">
  <strong>推论 7.1（\(\overline{A_{\mathrm{TM}}}\) 不可识别）</strong>
  <p>补集语言 \(\overline{A_{\mathrm{TM}}} = \{x \in \{0, 1\}^* \mid x \notin A_{\mathrm{TM}}\}\)（在合法编码上即 \(\{\langle M, w \rangle \mid M \text{ 不接受 } w\}\)）是<strong>不可识别的（Unrecognizable）</strong>。</p>
  <p><strong>证明</strong>：假设 \(\overline{A_{\mathrm{TM}}}\) 可识别。因为已知 \(A_{\mathrm{TM}}\) 可识别（定理 7.2），由定理 7.3 立即推出 \(A_{\mathrm{TM}}\) 可判定，这与定理 7.2（\(A_{\mathrm{TM}}\) 不可判定）矛盾！</p>
</div>

<h2>4. 停机问题 \(\mathrm{HALT}_{\mathrm{TM}}\) 与图灵归约初探</h2>
<div class="callout must">
  <strong>定义 7.3（停机问题 \(\mathrm{HALT}_{\mathrm{TM}}\)）</strong>
  <div class="formula">\[
    \mathrm{HALT}_{\mathrm{TM}} = \{\langle M, w \rangle \mid M \text{ 是一台图灵机，且 } M \text{ 在输入 } w \text{ 上停机（接受或拒绝）}\}.
  \]</div>
</div>

<p><strong>定理 7.4</strong>：\(\mathrm{HALT}_{\mathrm{TM}}\) 可识别但<strong>不可判定</strong>（其补集 \(\overline{\mathrm{HALT}_{\mathrm{TM}}}\) 不可识别）。</p>
<p><strong>不可判定性证明（从 \(A_{\mathrm{TM}}\) 到 \(\mathrm{HALT}_{\mathrm{TM}}\) 的图灵归约）</strong>：</p>
<ol>
  <li>假设存在判定 \(\mathrm{HALT}_{\mathrm{TM}}\) 的图灵机 \(H\)。我们利用 \(H\) 构造判定 \(A_{\mathrm{TM}}\) 的图灵机 \(M'\)：
<pre><code>Machine M': On input &lt;M, w&gt;:
  1. Run H on input &lt;M, w&gt;.
  2. If H rejects (meaning M loops forever on w), immediately REJECT.
  3. If H accepts (meaning M is guaranteed to halt on w),
     simulate M on w until it halts:
     (a) If M accepts w, then ACCEPT;
     (b) If M rejects w, then REJECT.</code></pre>
  </li>
  <li><strong>为什么 \(M'\) 一定停机？</strong>第 3 步虽然直接模拟了 \(M(w)\)，但这一步<strong>仅在 \(H\) 已经确认 \(M\) 在 \(w\) 上会停机时</strong>才执行，因此第 3 步的模拟绝不会死循环！</li>
  <li><strong>矛盾导出</strong>：\(M'\) 在所有输入上停机且精确判定 \(A_{\mathrm{TM}}\)，但这与定理 7.2（\(A_{\mathrm{TM}}\) 不可判定）矛盾。故 \(H\) 不存在，\(\mathrm{HALT}_{\mathrm{TM}}\) 不可判定。</li>
</ol>
`,
  questions: [
    {
      id: "l07-q1",
      kind: "single",
      tag: "slide",
      q: String.raw`在证明“若 \(L\) 和 \(\overline{L}\) 均可识别（分别由识别机 \(M_1, M_2\) 识别），则 \(L\) 可判定”时，判定机 \(M\) 应当如何调度 \(M_1\) 和 \(M_2\)？`,
      choices: [
        ["a", String.raw`在输入 \(w\) 上按步交错（或双带并行）同步模拟 \(M_1(w)\) 和 \(M_2(w)\)：若 \(M_1\) 接受则接受，若 \(M_2\) 接受则拒绝`],
        ["b", String.raw`先在 \(w\) 上完整运行 \(M_1\) 直到它停机；若 \(M_1\) 未接受，再启动运行 \(M_2(w)\)`],
        ["c", String.raw`只运行 \(M_1(w)\)，并将 \(M_1\) 的 \(q_{\mathrm{acc}}\) 和 \(q_{\mathrm{rej}}\) 互换`],
        ["d", String.raw`运行 \(M_1(w)\) 固定 \(100\) 步，若未停机则直接拒绝`]
      ],
      answer: ["a"],
      why: String.raw`因为 \(M_1\) 和 \(M_2\) 只是识别机，在不属于各自语言的输入上可能无限循环。若先完整运行 \(M_1\)，当 \(w \notin L\) 时 \(M_1(w)\) 可能死循环，导致永远无法运行 \(M_2(w)\)。只有按步交错（或双带同步）运行，才能保证在 \(\min(t_1, t_2)\) 步内必被其中必停机接受的那一台终结。`
    },
    {
      id: "l07-q2",
      kind: "single",
      tag: "slide",
      q: String.raw`关于 \(A_{\mathrm{TM}}\)、\(\overline{A_{\mathrm{TM}}}\) 与 \(\mathrm{HALT}_{\mathrm{TM}}\) 的可判定性与可识别性分类，下列哪一项完全正确？`,
      choices: [
        ["a", String.raw`\(A_{\mathrm{TM}}\) 与 \(\mathrm{HALT}_{\mathrm{TM}}\) 都是“可识别但不可判定”；\(\overline{A_{\mathrm{TM}}}\) 与 \(\overline{\mathrm{HALT}_{\mathrm{TM}}}\) 都是“不可识别”`],
        ["b", String.raw`\(A_{\mathrm{TM}}\) 可判定，\(\mathrm{HALT}_{\mathrm{TM}}\) 不可识别`],
        ["c", String.raw`\(A_{\mathrm{TM}}\) 与 \(\overline{A_{\mathrm{TM}}}\) 都可识别，但都不可判定`],
        ["d", String.raw`\(A_{\mathrm{TM}}\) 不可识别，\(\mathrm{HALT}_{\mathrm{TM}}\) 可识别`]
      ],
      answer: ["a"],
      why: String.raw`通用图灵机 \(U\) 可以在 \(M\) 接受（或停机）时停机接受，故 \(A_{\mathrm{TM}}\) 和 \(\mathrm{HALT}_{\mathrm{TM}}\) 均可识别；由对角化与归约知两者均不可判定；再由定理“\(L\) 可判定 \(\iff L\) 与 \(\overline{L}\) 均可识别”立即推出它们的补集 \(\overline{A_{\mathrm{TM}}}\) 和 \(\overline{\mathrm{HALT}_{\mathrm{TM}}}\) 必定不可识别。`
    },
    {
      id: "l07-q3",
      kind: "single",
      tag: "slide",
      q: String.raw`在通过归约证明 \(\mathrm{HALT}_{\mathrm{TM}}\) 不可判定时，假想判定机 \(M'\) 在调用 \(\mathrm{HALT}_{\mathrm{TM}}\) 的判定机 \(H(\langle M, w \rangle)\) 得到“接受”后，直接去模拟运行 \(M(w)\)。为什么这一步模拟不会导致 \(M'\) 陷入死循环？`,
      choices: [
        ["a", String.raw`因为仅当 \(H(\langle M, w \rangle)\) 接受时才执行该步，此时已经保证 \(M\) 在 \(w\) 上必定会在有限步内停机`],
        ["b", String.raw`因为任何图灵机 \(M\) 在任何输入 \(w\) 上都不会死循环`],
        ["c", String.raw`因为 \(M'\) 只模拟 \(M(w)\) 的前 \(|w|\) 步`],
        ["d", String.raw`因为 \(H\) 已经把 \(M\) 修改成了有限自动机`]
      ],
      answer: ["a"],
      why: String.raw`若 \(M\) 在 \(w\) 上死循环，\(H(\langle M, w \rangle)\) 在第 1 步就会拒绝，\(M'\) 在第 2 步直接停机拒绝，根本不会进入第 3 步；只有当 \(H\) 接受（即 \(M\) 在 \(w\) 上必停机）时才进入第 3 步，因此模拟 \(M(w)\) 必在有限步内结束。`
    }
  ],
  cards: [
    [
      String.raw`写出自拒绝语言 \(L_{\mathrm{self}}\) 的定义及其不可判定性的两行证明。`,
      String.raw`\(L_{\mathrm{self}} = \{\langle M \rangle \mid M \text{ 拒绝 } \langle M \rangle\}\)。<br>证明：若 \(M_{\mathrm{self}}\) 判定 \(L_{\mathrm{self}}\)，运行 \(M_{\mathrm{self}}(\langle M_{\mathrm{self}} \rangle)\)：\(M_{\mathrm{self}}\) 接受 \(\langle M_{\mathrm{self}} \rangle \iff \langle M_{\mathrm{self}} \rangle \in L_{\mathrm{self}} \iff M_{\mathrm{self}}\) 拒绝 \(\langle M_{\mathrm{self}} \rangle\)，矛盾。`
    ],
    [
      String.raw`连接“可判定”与“可识别”的核心充要条件定理是什么？由此如何推出 \(\overline{A_{\mathrm{TM}}}\) 不可识别？`,
      String.raw`<strong>定理</strong>：\(L\) 可判定 \(\iff L\) 与 \(\overline{L}\) 均可识别。<br><strong>推论</strong>：因为 \(A_{\mathrm{TM}}\) 可识别但不可判定，若 \(\overline{A_{\mathrm{TM}}}\) 也由某图灵机识别，则 \(A_{\mathrm{TM}}\) 将可判定，矛盾！故 \(\overline{A_{\mathrm{TM}}}\) 不可识别。`
    ],
    [
      String.raw`如何用 \(A_{\mathrm{TM}}\) 的假想判定机 \(H\) 构造对角图灵机 \(D\) 以导出矛盾？`,
      String.raw`\(D(\langle M \rangle)\)：模拟 \(H(\langle M, \langle M \rangle \rangle)\)，将 \(H\) 的输出<strong>取反</strong>（\(H\) 接受则拒绝，\(H\) 拒绝则接受）。考察 \(D(\langle D \rangle)\) 得 \(D\) 接受 \(\langle D \rangle \iff D\) 不接受 \(\langle D \rangle\)。`
    ]
  ]
});
