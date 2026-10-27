Review.add({
  id: "l05",
  n: 5,
  group: "computability",
  short: "L5 · 丘奇-图灵论题与变体",
  title: "Lecture 5 · 丘奇-图灵论题与图灵机变体的形式化等价性",
  meta: "Church-Turing 论题 · Stay 变体 · Reset 变体 · 双带图灵机转单带的轨道字母表构造",
  sources: [
    { href: "materials/CSC4010_Lecture5.pdf", label: "Lecture 5 Slides" },
    { href: "materials/CSC4010_Lecture5(Annotated).pdf", label: "Lecture 5 Annotated" }
  ],
  html: String.raw`
<h2>1. 丘奇-图灵论题（The Church–Turing Thesis）</h2>
<p>在 1930 年代，多位数学家独立提出了形式各异的“机械计算”数学模型：Gödel 与 Kleene 的 \(\mu\)-递归函数、Church 的 \(\lambda\)-演算（\(\lambda\)-calculus）、Post 的生成系统以及 Turing 的图灵机。随后严格证明了：这些定义截然不同的计算模型在计算能力上<strong>完全等价</strong>（它们识别和判定的语言类完全相同）。</p>

<div class="callout must">
  <strong>丘奇-图灵论题（Church–Turing Thesis）</strong>
  <p>直观意义上的任何“算法（effective / mechanical procedure）”都可以由一台标准图灵机精确实现；即标准图灵机模型完备地捕获了物理世界中一切可有效计算的過程。</p>
  <ul>
    <li><strong>认识论地位</strong>：丘奇-图灵论题是一个关于物理与直观概念的<strong>科学假说（可证伪的命题，falsifiable scientific hypothesis）</strong>，而<strong>不是数学定理</strong>——因为“直观算法”并不是一个经过公理化定义的数学对象，无法进行数学证明；但若未来在物理世界中发现某种可机械执行的计算过程无法被图灵机模拟，该论题就会被证伪。</li>
    <li><strong>方法论意义</strong>：只要我们证明某个问题不能被单带标准图灵机求解，根据丘奇-图灵论题，任何现代编程语言（C、Python、Rust）或超级计算机也同样无法求解该问题。</li>
  </ul>
</div>

<h2>2. 图灵机模型的稳健性（Robustness）：变体等价定理</h2>
<p>为验证图灵机模型的稳健性，我们考察向标准图灵机添加额外硬件指令或额外工作带后，其可判定/可识别语言类是否会扩大。<strong>结论：所有合理变体均与标准单带图灵机完全等价。</strong>证明两个计算模型等价的标准方法是<strong>相互模拟（Mutual Simulation）</strong>：由于标准图灵机天然是各扩展变体的特例，只需证明<strong>任何扩展变体图灵机 \(M\) 都可以由一台标准单带图灵机 \(M'\) 逐步模拟</strong>。</p>

<h3>2.1 变体一：允许原地停留的图灵机（Left-Right-Stationary TM）</h3>
<p><strong>定义</strong>：转移函数允许第三个分量取自 \(\{L, R, S\}\)，其中 \(S\)（Stay / Stationary）表示读写头保持在当前单元格不移动：</p>
<div class="formula">\[
  \delta:\; (Q \setminus \{q_{\mathrm{acc}}, q_{\mathrm{rej}}\}) \times \Sigma \;\longrightarrow\; Q \times \Sigma \times \{L, R, S\}.
\]</div>
<p>对配置 \(C_i = u q v_1 v_2 \cdots v_m\)，若 \(\delta(q, v_1) = (q_2, b, S)\)，则 \(\mathrm{NEXT}(C_i) = u q_2 b v_2 \cdots v_m\)。</p>

<p><strong>等价性证明（用标准图灵机 \(M'\) 模拟 \(M\)）</strong>：</p>
<ul>
  <li>对于 \(M\) 中方向为 \(L\) 或 \(R\) 的转移，\(M'\) 直接照搬。</li>
  <li>对于 \(M\) 中的原地停留转移 \(\delta(q_1, a) = (q_2, b, S)\)，标准图灵机 \(M'\) 引入专用的中转状态 \(q_{2,\mathrm{ret}}\)，拆分为<strong>先左移一格、再右移退回原格</strong>的两步转移：
  <div class="formula">\[
    \delta'(q_1, a) = (q_{2,\mathrm{ret}}, b, L), \qquad \forall c \in \Sigma:\; \delta'(q_{2,\mathrm{ret}}, c) = (q_2, c, R).
  \]</div>
  经过这两步后，工作带当前格已被改写为 \(b\)，左侧相邻格内容 \(c\) 保持原样，读写头精确回到刚写入的 \(b\) 上，且控制器进入状态 \(q_2\)。因此 \(L(M') = L(M)\) 且停机性完全一致。</li>
</ul>

<h3>2.2 变体二：带重置指令的图灵机（Reset TM）</h3>
<p><strong>定义</strong>：假设读写头不会越过初始空白格向左移动。转移函数允许方向取自 \(\{L, R, \mathrm{Reset}\}\)：</p>
<div class="formula">\[
  \delta:\; (Q \setminus \{q_{\mathrm{acc}}, q_{\mathrm{rej}}\}) \times \Sigma \;\longrightarrow\; Q \times \Sigma \times \{L, R, \mathrm{Reset}\}.
\]</div>
<p>其中 \(\mathrm{Reset}\) 操作将当前格改写为 \(b\)，转入状态 \(q_2\)，并将读写头<strong>一步跳回输入左端紧邻的初始空白格 \(\sqcup\)</strong>：若 \(C_i = \sqcup u\, q_1\, v_1 v_2 \cdots v_m\) 且 \(\delta(q_1, v_1) = (q_2, b, \mathrm{Reset})\)，则</p>
<div class="formula">\[
  \mathrm{NEXT}(C_i) = q_2\, \sqcup\, u\, b\, v_2 \cdots v_m.
\]</div>

<p><strong>等价性证明（用带 Stay 的图灵机 \(M'\) 模拟 Reset TM \(M\)）</strong>：</p>
<ol>
  <li><strong>左边界标记</strong>：在计算开始时（或通过左端唯一起始空白格 \(\sqcup\)），初始空白格是工作带上目前已访问区域最左端的唯一空白格 \(\sqcup\)（若中间过程可能写入空白，可在工作带字母表中引入专用左端点标记符 \(\#\) 标记初始格）。</li>
  <li><strong>用连续左移模拟 \(\mathrm{Reset}\)</strong>：当 \(M\) 执行 \(\delta(q_1, a) = (q_2, b, \mathrm{Reset})\) 时，\(M'\) 先写入 \(b\) 并进入专用回退状态 \(q_{2,\mathrm{back}}\) 向左移动：
  <div class="formula">\[
    \delta'(q_1, a) = (q_{2,\mathrm{back}}, b, L).
  \]</div>
  在状态 \(q_{2,\mathrm{back}}\) 下，只要读到非左端点符号 \(c \ne \sqcup\)（或 \(c \ne \#\)），就保持原符号继续向左移动：\(\delta'(q_{2,\mathrm{back}}, c) = (q_{2,\mathrm{back}}, c, L)\)；一旦读到左端空白格 \(\sqcup\)（或 \(\#\)），则原地停留在左端空白格并切换回目标状态 \(q_2\)：
  <div class="formula">\[
    \delta'(q_{2,\mathrm{back}}, \sqcup) = (q_2, \sqcup, S).
  \]</div>
  结合 2.1 节中 Stay 变体与标准图灵机的等价性，可知 Reset TM 与标准图灵机完全等价。</li>
</ol>

<h2>3. 变体三：双带图灵机（2-Tape TM）及其单带模拟构造</h2>
<p><strong>双带图灵机的定义</strong>：拥有两条独立双向无限工作带（Tape 1 初始存放输入 \(w\)，Tape 2 初始全为空白 \(\sqcup\)），每条工作带各有自己独立的读写头（初始均位于各自左端起始空白格上）。单步转移函数同时读取两个读写头下的符号 \((a_1, a_2)\)，切换到新状态，分别在两条带上写入新符号，并<strong>独立移动</strong>两个读写头：</p>
<div class="formula">\[
  \delta:\; (Q \setminus \{q_{\mathrm{acc}}, q_{\mathrm{rej}}\}) \times \Sigma^2 \;\longrightarrow\; Q \times \Sigma^2 \times \{L, R, S\}^2.
\]</div>

<div class="callout must">
  <strong>定理 5.1（双带/多带图灵机与单带图灵机的等价性，Lecture 5 &amp; 6）</strong>
  <p>每台双带（或任意 \(k\) 带）图灵机 \(M\) 都可以由一台单带标准图灵机 \(M'\) 等价模拟。</p>
</div>

<p><strong>单带模拟双带的核心编码构造（四轨道/带标记有序对字母表）</strong>：</p>
<ol>
  <li><strong>新工作带字母表 \(\Sigma'\)</strong>：单带图灵机 \(M'\) 将两条工作带的同一列单元格上下叠合为一个复合单元格（2 tracks）。为了在只有<strong>一个物理读写头</strong>的单带上同时记住双带图灵机<strong>两个虚拟读写头的当前位置</strong>，为每个符号 \(a \in \Sigma\) 引入带顶横线的标记版本 \(\overline{a} \in \overline{\Sigma}\)（表示“该轨道的虚拟读写头当前正位于此格”）。因此单带字母表定义为：
  <div class="formula">\[
    \Sigma' = \{\sqcup'\} \;\cup\; (\Sigma \cup \overline{\Sigma}) \times (\Sigma \cup \overline{\Sigma}),
  \]</div>
  其中 \(\sqcup'\) 是单带外围未触及区域的空白符，等价于无标记双空白对 \((\sqcup, \sqcup)\)。</li>
  <li><strong>单带上的不变量（Invariant）</strong>：在模拟 \(M\) 的每一步开始前，单带 \(M'\) 上恰好有一个第一分量带顶横线 \(\overline{a}\)（标记第 1 带虚拟头位置），且恰好有一个第二分量带顶横线 \(\overline{b}\)（标记第 2 带虚拟头位置）。</li>
  <li><strong>初始化阶段</strong>：给定输入 \(w = w_1 \cdots w_n\)，\(M'\) 先将起始空白格改写为 \((\overline{\sqcup}, \overline{\sqcup})\)（对应两条带的初始读写头都位于左端空白格），并将每个输入符号 \(w_i\) 改写为双轨符号 \((w_i, \sqcup)\)。</li>
</ol>
<p class="muted">（如何用有限状态在单带上往返扫描以完成一步双带转移的详细状态机设计，见 Lecture 6 第 1 节。）</p>
`,
  questions: [
    {
      id: "l05-q1",
      kind: "single",
      tag: "slide",
      q: String.raw`关于丘奇-图灵论题（Church–Turing Thesis），下列哪项表述是正确的？`,
      choices: [
        ["a", String.raw`它是一个关于直观“算法”概念的科学假说（可证伪的经验命题），而不是一个可以用数学公理证明的定理`],
        ["b", String.raw`它是由 Alan Turing 在 1936 年通过康托尔对角化方法严格证明的数学定理`],
        ["c", String.raw`它断言所有形式语言都是图灵可判定的`],
        ["d", String.raw`它断言多带图灵机的运行速度与单带图灵机完全相同（没有多项式开销）`]
      ],
      answer: ["a"],
      why: String.raw`由于“直观上的有效算法”不是形式化数学定义，丘奇-图灵论题无法被数学证明，而是一个可证伪的科学论题；迄今为止所有已知的机械计算模型（\(\lambda\)-演算、RAM、多带图灵机等）都被证明与单带图灵机等价，从而强力支持该论题。`
    },
    {
      id: "l05-q2",
      kind: "single",
      tag: "slide",
      q: String.raw`在用单带图灵机 \(M'\) 模拟双带图灵机 \(M\)（字母表为 \(\Sigma\)）时，Lecture 5/6 将 \(M'\) 的工作带字母表定义为 \(\Sigma' = \{\sqcup'\} \cup (\Sigma \cup \overline{\Sigma})^2\)。其中带顶横线的符号 \(\overline{\Sigma} = \{\overline{a} \mid a \in \Sigma\}\) 的作用是什么？`,
      choices: [
        ["a", String.raw`在单条工作带上分别标记原双带图灵机第 1 条带和第 2 条带虚拟读写头当前所在的单元格位置`],
        ["b", String.raw`标记已经被删除的输入字符`],
        ["c", String.raw`表示二进制数的负号`],
        ["d", String.raw`标记图灵机已经进入停机状态 \(q_{\mathrm{acc}}\)`]
      ],
      answer: ["a"],
      why: String.raw`单带图灵机只有 1 个物理读写头，而双带图灵机的 2 个读写头可以相距任意远（超出有限状态的计数范围）。因此必须在工作带符号本身上用带横线符号 \(\overline{a}\) 记录两个虚拟读写头各自所在的单元格。`
    },
    {
      id: "l05-q3",
      kind: "single",
      tag: "slide",
      q: String.raw`标准图灵机的读写头每步只能左移（\(L\)）或右移（\(R\)）。若要模拟一步原地停留转移 \(\delta(q_1, a) = (q_2, b, S)\)，标准图灵机应当如何实现？`,
      choices: [
        ["a", String.raw`引入辅助状态 \(q_{2,\mathrm{ret}}\)：先执行 \(\delta'(q_1, a) = (q_{2,\mathrm{ret}}, b, L)\)，再对任意符号 \(c \in \Sigma\) 执行 \(\delta'(q_{2,\mathrm{ret}}, c) = (q_2, c, R)\)`],
        ["b", String.raw`直接删除所有包含 \(S\) 的转移规则`],
        ["c", String.raw`将 \(S\) 直接替换为 \(R\)，后续不再移回`],
        ["d", String.raw`必须使用至少两条工作带才能模拟 \(S\)`]
      ],
      answer: ["a"],
      why: String.raw`先写入 \(b\) 并左移一格进入辅助状态 \(q_{2,\mathrm{ret}}\)，下一步不论左侧格是什么符号 \(c\) 都原样写回 \(c\) 并右移一格进入 \(q_2\)，从而精确回到刚写入 \(b\) 的单元格。`
    },
    {
      id: "l05-q4",
      kind: "single",
      tag: "slide",
      q: String.raw`在 Lecture 5 的 Reset 图灵机模型中，若当前配置为 \(C_i = \sqcup u\, q_1\, v_1 v_2 \cdots v_m\) 且转移为 \(\delta(q_1, v_1) = (q_2, b, \mathrm{Reset})\)，则下一配置 \(\mathrm{NEXT}(C_i)\) 是什么？`,
      choices: [
        ["a", String.raw`\(q_2\, \sqcup\, u\, b\, v_2 \cdots v_m\)`],
        ["b", String.raw`\(\sqcup u\, q_2\, b\, v_2 \cdots v_m\)`],
        ["c", String.raw`\(\sqcup u b\, q_2\, v_2 \cdots v_m\)`],
        ["d", String.raw`\(q_2\, \sqcup\)`]
      ],
      answer: ["a"],
      why: String.raw`\(\mathrm{Reset}\) 操作先将原位置符号 \(v_1\) 改写为 \(b\)，然后将读写头一步跳回输入左端的起始空白格 \(\sqcup\) 上，状态变为 \(q_2\)，故配置为 \(q_2 \sqcup u b v_2 \cdots v_m\)。`
    }
  ],
  cards: [
    [
      String.raw`为什么丘奇-图灵论题（Church–Turing Thesis）不是一个数学定理？`,
      String.raw`因为它连接的是<strong>非形式化的直观概念</strong>（“一切可机械执行的有效算法”）与<strong>形式化的数学概念</strong>（“标准图灵机”）。由于前者没有公理化定义，该论题是一个可证伪的科学假说而非数学定理。`
    ],
    [
      String.raw`单带图灵机模拟双带图灵机时，复合工作带字母表 \(\Sigma'\) 是如何构造的？`,
      String.raw`\(\Sigma' = \{\sqcup'\} \cup (\Sigma \cup \overline{\Sigma}) \times (\Sigma \cup \overline{\Sigma})\)，每个单元格存储上下两轨的符号对 \((x, y)\)，其中带顶横线符号 \(\overline{a} \in \overline{\Sigma}\) 用于标记对应轨道上虚拟读写头的当前位置。`
    ]
  ]
});
