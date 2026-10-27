Review.add({
  id: "l04",
  n: 4,
  group: "computability",
  short: "L4 · 形式化配置与封闭性",
  title: "Lecture 4 · 图灵机 7 元组、计算配置 NEXT(Ci) 与可判定语言封闭性",
  meta: "7 元组定义 · 配置 uqv 与边界规则 · 计算历史 · 补、反转、并、交的封闭性",
  sources: [
    { href: "materials/CSC4010_Lecture4.pdf", label: "Lecture 4 Slides" },
    { href: "materials/CSC4010_Lecture4(Annotated).pdf", label: "Lecture 4 Annotated" }
  ],
  html: String.raw`
<h2>1. 图灵机的形式化 7 元组定义</h2>
<p>为了对图灵机本身进行数学归纳和编码，必须将其结构及单步演化完全公理化。</p>

<div class="callout must">
  <strong>定义 4.1（图灵机 7 元组，Lecture 4）</strong>
  <p>一台确定性单带图灵机是一个七元组</p>
  <div class="formula">\[
    M = (Q,\; q_{\mathrm{acc}},\; q_{\mathrm{rej}},\; q_0,\; \delta,\; \sqcup,\; \Sigma),
  \]</div>
  <p>其中各分量的含义与约束如下：</p>
  <ol>
    <li>\(Q\)：非空有限<strong>状态集（Set of states）</strong>；</li>
    <li>\(q_{\mathrm{acc}} \in Q\)：<strong>接受状态（Accept state）</strong>；</li>
    <li>\(q_{\mathrm{rej}} \in Q\)：<strong>拒绝状态（Reject state）</strong>，且满足 \(q_{\mathrm{rej}} \ne q_{\mathrm{acc}}\)；</li>
    <li>\(q_0 \in Q\)：<strong>初始状态（Start state）</strong>；</li>
    <li>\(\Sigma\)：有限<strong>工作带字母表（Tape alphabet）</strong>，满足 \(\{0, 1, \sqcup\} \subseteq \Sigma\)；</li>
    <li>\(\sqcup \in \Sigma\)：<strong>空白符（Blank symbol）</strong>；</li>
    <li>\(\delta\)：<strong>转移函数（Transition function）</strong>，其定义为：
    <div class="formula">\[
      \delta:\; (Q \setminus \{q_{\mathrm{acc}}, q_{\mathrm{rej}}\}) \times \Sigma \;\longrightarrow\; Q \times \Sigma \times \{L, R\}.
    \]</div>
    </li>
  </ol>
</div>

<h2>2. 计算配置（Configuration）与单步后继 \(\mathrm{NEXT}(C_i)\)</h2>
<p>在图灵机运行的任意时刻，后续计算完全由以下三项信息唯一决定：(1) 当前状态 \(q\)；(2) 工作带上的非空白内容；(3) 读写头的当前位置。这三项信息的组合称为一个<strong>计算配置（Configuration）</strong>。</p>

<div class="callout must">
  <strong>定义 4.2（计算配置 \(uqv\)）</strong>
  <p>图灵机的一个配置是一个三元组 \((u, q, v)\)，简记为字符串拼接形式 \(uqv\)，其中 \(q \in Q\)，\(u \in \Sigma^*\)，\(v \in \Sigma^+\)（注意 <strong>\(v \ne \varepsilon\)</strong>），含义为：</p>
  <ul>
    <li>\(u = u_1 u_2 \cdots u_n\)（\(n \ge 0\)）是读写头<strong>左侧</strong>的工作带内容（\(u\) 左侧全为 \(\sqcup\)）；</li>
    <li>\(q\) 是控制器的<strong>当前状态</strong>；</li>
    <li>\(v = v_1 v_2 \cdots v_m\)（\(m \ge 1\)）是读写头<strong>当前格及右侧</strong>的工作带内容，且<strong>读写头正扫描 \(v\) 的第一个符号 \(v_1\)</strong>（\(v\) 右侧全为 \(\sqcup\)）。</li>
  </ul>
</div>

<div class="callout must">
  <strong>定义 4.3（单步后继函数 \(\mathrm{NEXT}(C_i)\) 与边界扩展规则）</strong>
  <p>设当前非停机配置为 \(C_i = u_1 \cdots u_n\, q\, v_1 v_2 \cdots v_m\)（其中 \(n \ge 0, m \ge 1, q \notin \{q_{\mathrm{acc}}, q_{\mathrm{rej}}\}\)）。则下一步配置 \(\mathrm{NEXT}(C_i)\) 按 \(\delta(q, v_1)\) 分四种情形严格定义：</p>
  <ol>
    <li><strong>右移一般情形（\(m &gt; 1\)）</strong>：若 \(\delta(q, v_1) = (q', b, R)\)，则
    <div class="formula">\[
      \mathrm{NEXT}(C_i) = u_1 \cdots u_n\, b\, q'\, v_2 \cdots v_m.
    \]</div></li>
    <li><strong>右移边界情形（\(m = 1\)，到达已记录带段最右端）</strong>：若 \(\delta(q, v_1) = (q', b, R)\) 且 \(m = 1\)，为保持状态符号右侧非空，需显式补入右侧空白格 \(\sqcup\)：
    <div class="formula">\[
      \mathrm{NEXT}(C_i) = u_1 \cdots u_n\, b\, q'\, \sqcup.
    \]</div></li>
    <li><strong>左移一般情形（\(n \ge 1\)）</strong>：若 \(\delta(q, v_1) = (q', b, L)\)，读写头退回到 \(u_n\) 上：
    <div class="formula">\[
      \mathrm{NEXT}(C_i) = u_1 \cdots u_{n-1}\, q'\, u_n\, b\, v_2 \cdots v_m.
    \]</div></li>
    <li><strong>左移边界情形（\(n = 0\)，即 \(u = \varepsilon\)，超越已记录带段最左端）</strong>：若 \(\delta(q, v_1) = (q', b, L)\) 且 \(n = 0\)，读写头进入左侧新的空白格 \(\sqcup\)：
    <div class="formula">\[
      \mathrm{NEXT}(C_i) = q'\, \sqcup\, b\, v_2 \cdots v_m.
    \]</div></li>
  </ol>
</div>

<div class="callout ex">
  <strong>定义 4.4（停机计算历史与接受/拒绝的形式化）</strong>
  <p>图灵机 \(M\) 在输入 \(w \in \{0, 1\}^*\) 上的停机计算是一个有限配置序列 \(C_0, C_1, \dots, C_k\)，满足：</p>
  <ol>
    <li><strong>初始配置</strong>：\(C_0 = q_0 \sqcup w\)；</li>
    <li><strong>合法单步转移</strong>：对每个 \(0 \le i &lt; k\)，\(C_{i+1} = \mathrm{NEXT}(C_i)\)；</li>
    <li><strong>停机配置</strong>：\(C_k = u\, q_{\mathrm{end}}\, v\)，其中 \(q_{\mathrm{end}} \in \{q_{\mathrm{acc}}, q_{\mathrm{rej}}\}\)。当 \(q_{\mathrm{end}} = q_{\mathrm{acc}}\) 时称 \(M\) <strong>接受</strong> \(w\)；当 \(q_{\mathrm{end}} = q_{\mathrm{rej}}\) 时称 \(M\) <strong>拒绝</strong> \(w\)。</li>
  </ol>
  <p><strong>实例（<code>PARITY</code> 在输入 \(w = 011\) 上的完整配置序列）</strong>：</p>
  <div class="formula">\[
    q_0 \sqcup 011 \;\to\; \sqcup q_{\mathrm{even}} 011 \;\to\; \sqcup 0 q_{\mathrm{even}} 11 \;\to\; \sqcup 01 q_{\mathrm{odd}} 1 \;\to\; \sqcup 011 q_{\mathrm{even}} \sqcup \;\to\; \sqcup 01 q_{\mathrm{rej}} 1 \sqcup.
  \]</div>
</div>

<h2>3. 可判定语言的封闭性（Closure Properties）</h2>
<p>若对某集合运算 \(\odot\)，只要语言 \(L_1, L_2\) 可判定，运算结果 \(L_1 \odot L_2\) 也一定可判定，则称可判定语言类在该运算下<strong>封闭（Closed）</strong>。</p>

<h3>3.1 补运算（Complement）：\(\overline{L} = \{0, 1\}^* \setminus L\)</h3>
<p><strong>定理 4.1</strong>：若语言 \(L\) 可判定，则其补语言 \(\overline{L} = \{x \in \{0, 1\}^* \mid x \notin L\}\) 也可判定。</p>
<p><strong>形式化构造与证明</strong>：设 \(M = (Q, q_{\mathrm{acc}}, q_{\mathrm{rej}}, q_0, \delta, \sqcup, \Sigma)\) 是判定 \(L\) 的图灵机。构造新图灵机 \(M'\)，仅将接受状态与拒绝状态互换：</p>
<div class="formula">\[
  M' = (Q,\; q'_{\mathrm{acc}} = q_{\mathrm{rej}},\; q'_{\mathrm{rej}} = q_{\mathrm{acc}},\; q_0,\; \delta,\; \sqcup,\; \Sigma).
\]</div>
<p>因为 \(M\) 是判定机，对任意输入 \(w \in \{0, 1\}^*\)，\(M\) 必在有限步内停机：若 \(w \in L\)，\(M\) 进入 \(q_{\mathrm{acc}} = q'_{\mathrm{rej}}\)，故 \(M'\) 拒绝 \(w\)；若 \(w \notin L\)，\(M\) 进入 \(q_{\mathrm{rej}} = q'_{\mathrm{acc}}\)，故 \(M'\) 接受 \(w\)。因此 \(M'\) 判定 \(\overline{L}\)。</p>
<div class="callout trap">
  <strong>关键陷阱：为什么交换 \(q_{\mathrm{acc}}\) 与 \(q_{\mathrm{rej}}\) 不能证明“可识别语言在补运算下封闭”？</strong>
  <p>若 \(M\) 只是 \(L\) 的<strong>识别机（Recognizer）</strong>，对 \(w \notin L\)，\(M\) 可能<strong>无限循环</strong>而永不进入 \(q_{\mathrm{rej}}\)。此时交换 \(q_{\mathrm{acc}}\) 与 \(q_{\mathrm{rej}}\) 后得到的 \(M'\) 在 \(w\) 上依然无限循环，无法进入新的接受状态！事实上，Lecture 7 将严格证明：可识别语言在补运算下<strong>不封闭</strong>（\(A_{\mathrm{TM}}\) 可识别，但 \(\overline{A_{\mathrm{TM}}}\) 不可识别）。</p>
</div>

<h3>3.2 字符串反转（Reversal）：\(L^R = \{w^R \mid w \in L\}\)</h3>
<p><strong>定理 4.2</strong>：若 \(L\) 可判定，则 \(L^R = \{w_k w_{k-1} \cdots w_1 \mid w_1 \cdots w_k \in L\}\) 也可判定。</p>
<p><strong>证明思路</strong>：设 \(M\) 判定 \(L\)。构造图灵机 \(M^R\)：在输入 \(w\) 上，第一阶段通过左右往返扫描并标记已交换字符，将工作带上的 \(w\) 原地反转为 \(w^R\)，然后将读写头移回 \(w^R\) 左端紧邻的空白格 \(\sqcup\)；第二阶段转入 \(M\) 的初始状态 \(q_0\) 模拟 \(M\)。由于反转阶段在 \(O(|w|^2)\) 步内完成且 \(M\) 必停机，\(M^R\) 在一切输入上停机，且 \(M^R\) 接受 \(w \iff M\) 接受 \(w^R \iff w^R \in L \iff w \in L^R\)。</p>

<h3>3.3 并运算（Union）与交运算（Intersection）</h3>
<p><strong>定理 4.3</strong>：若 \(L_1, L_2\) 均可判定，则 \(L_1 \cup L_2\) 与 \(L_1 \cap L_2\) 均可判定。</p>
<p><strong>形式化构造要点</strong>（完整二元组状态转移详见 Problem Set 2 精讲）：设 \(M_1, M_2\) 分别判定 \(L_1, L_2\)。可采用顺序模拟（先在输入备份上运行 \(M_1\)，再在原输入上运行 \(M_2\)）或双带同步模拟（状态集取笛卡尔积 \(Q_{\mathrm{init}} \cup (Q_1 \times Q_2) \cup \{q_{\mathrm{acc}}, q_{\mathrm{rej}}\}\)）：</p>
<ul>
  <li>对于 <strong>并集 \(L_1 \cup L_2\)</strong>：只要 \(M_1\) 或 \(M_2\) 中<strong>任意一台</strong>进入接受状态，立即转入 \(q_{\mathrm{acc}}\)；仅当<strong>两台都</strong>进入拒绝状态时，才转入 \(q_{\mathrm{rej}}\)。</li>
  <li>对于 <strong>交集 \(L_1 \cap L_2\)</strong>：只要 \(M_1\) 或 \(M_2\) 中<strong>任意一台</strong>进入拒绝状态，立即转入 \(q_{\mathrm{rej}}\)；仅当<strong>两台都</strong>进入接受状态时（先接受的一方保持带头不动等待另一方），才转入 \(q_{\mathrm{acc}}\)。</li>
</ul>
`,
  questions: [
    {
      id: "l04-q1",
      kind: "single",
      tag: "slide",
      q: String.raw`设图灵机当前处于配置 \(C_i = q\, v_1 v_2\)（即 \(u = \varepsilon\)，读写头位于已记录带段的最左端符号 \(v_1\) 上）。若转移函数给出 \(\delta(q, v_1) = (q', b, L)\)，根据课程的形式化定义，下一配置 \(\mathrm{NEXT}(C_i)\) 是什么？`,
      choices: [
        ["a", String.raw`\(q' \sqcup b v_2\)`],
        ["b", String.raw`\(b q' v_2\)`],
        ["c", String.raw`\(q' b v_2\)`],
        ["d", String.raw`读写头越界，图灵机异常停机拒绝`]
      ],
      answer: ["a"],
      why: String.raw`因为工作带双向无限延伸，当 \(u = \varepsilon\)（\(n = 0\)）且读写头左移（\(L\)）时，\(v_1\) 被改写为 \(b\)，读写头左移进入左侧原本未显式写出的空白格 \(\sqcup\)，故新配置为 \(q' \sqcup b v_2\)。`
    },
    {
      id: "l04-q2",
      kind: "single",
      tag: "slide",
      q: String.raw`设图灵机当前处于配置 \(C_i = u_1 u_2\, q\, v_1\)（即状态符号右侧只有一个符号 \(v_1\)，\(m = 1\)）。若 \(\delta(q, v_1) = (q', b, R)\)，则下一配置 \(\mathrm{NEXT}(C_i)\) 是什么？`,
      choices: [
        ["a", String.raw`\(u_1 u_2 b\, q'\, \sqcup\)`],
        ["b", String.raw`\(u_1 u_2 b\, q'\)`],
        ["c", String.raw`\(u_1 q' u_2 b\)`],
        ["d", String.raw`\(u_1 u_2 q' b\)`]
      ],
      answer: ["a"],
      why: String.raw`根据计算配置的定义 \(uqv\)，右侧字符串 \(v \in \Sigma^+\) 不能为空（其首字符必须表示读写头当前扫描的符号）。当 \(m = 1\) 且向右移动时，读写头踏入右侧空白格，故必须显式补上 \(\sqcup\)，得到 \(u_1 u_2 b q' \sqcup\)。`
    },
    {
      id: "l04-q3",
      kind: "single",
      tag: "slide",
      q: String.raw`为什么“将图灵机的 \(q_{\mathrm{acc}}\) 与 \(q_{\mathrm{rej}}\) 互换”可以证明可判定语言在补运算下封闭，却<strong>不能</strong>证明可识别语言在补运算下封闭？`,
      choices: [
        ["a", String.raw`因为识别机在 \(w \notin L\) 上可能无限循环而不进入 \(q_{\mathrm{rej}}\)；互换状态后在 \(w \notin L\) 上仍然无限循环，无法停机接受`],
        ["b", String.raw`因为识别机没有拒绝状态 \(q_{\mathrm{rej}}\)`],
        ["c", String.raw`因为补语言 \(\overline{L}\) 的字母表与原语言不同`],
        ["d", String.raw`因为可识别语言的补集一定是有限集`]
      ],
      answer: ["a"],
      why: String.raw`识别机对 \(w \notin L\) 允许死循环。若 \(M\) 在 \(w \notin L\) 上死循环，即使交换 \(q_{\mathrm{acc}}\) 与 \(q_{\mathrm{rej}}\)，新机器在 \(w\) 上依然死循环，不会接受 \(w\)，因而不能识别 \(\overline{L}\)。`
    },
    {
      id: "l04-q4",
      kind: "single",
      tag: "slide",
      q: String.raw`按本课程（Lecture 4）的定义，标准单带图灵机的 7 元组记号顺序是什么？`,
      choices: [
        ["a", String.raw`\(M = (Q,\; q_{\mathrm{acc}},\; q_{\mathrm{rej}},\; q_0,\; \delta,\; \sqcup,\; \Sigma)\)`],
        ["b", String.raw`\(M = (Q,\; \Sigma,\; \Gamma,\; \delta,\; q_0,\; q_{\mathrm{accept}},\; q_{\mathrm{reject}})\)`],
        ["c", String.raw`\(M = (Q,\; \Sigma,\; \delta,\; q_0,\; F)\)`],
        ["d", String.raw`\(M = (\Sigma,\; Q,\; \delta,\; \sqcup)\)`]
      ],
      answer: ["a"],
      why: String.raw`Lecture 4 幻灯片定义的 7 元组为 \(M = (Q, q_{\mathrm{acc}}, q_{\mathrm{rej}}, q_0, \delta, \sqcup, \Sigma)\)，其中输入固定为二进制 \(\{0, 1\}\)，工作带字母表记为 \(\Sigma\)（满足 \(\{0, 1, \sqcup\} \subseteq \Sigma\)）。`
    },
    {
      id: "l04-q5",
      kind: "single",
      tag: "slide",
      q: String.raw`设当前配置为 \(1\, q\, 0\)（右侧已无更多非空白符），且转移为 \(\delta(q, 0) = (q', 1, R)\)。则下一步配置 \(\mathrm{NEXT}(1\, q\, 0)\) 是什么？`,
      choices: [
        ["a", String.raw`\(11\, q'\, \sqcup\)`],
        ["b", String.raw`\(11\, q'\)`],
        ["c", String.raw`\(1\, q'\, 1\)`],
        ["d", String.raw`\(q'\, 11\)`]
      ],
      answer: ["a"],
      why: String.raw`读写头将 \(0\) 改写为 \(1\) 并向右移动一格；由于右侧原本没有更多符号（\(m = 1\)），必须补入空白格 \(\sqcup\) 以保证状态 \(q'\) 右侧非空，故得到 \(11\, q'\, \sqcup\)。`
    }
  ],
  cards: [
    [
      String.raw`图灵机配置 \(uqv\) 中，读写头指向哪个字符？为什么要求 \(v \ne \varepsilon\)？`,
      String.raw`读写头指向 \(v\) 的第一个字符 \(v_1\)。要求 \(v \ne \varepsilon\) 是为了始终显式标出读写头当前扫描的符号；当读写头右移越过 \(v\) 末尾时需补写 \(\sqcup\)（即 \(ubq'\sqcup\)）。`
    ],
    [
      String.raw`写出 \(\mathrm{NEXT}(u_1\cdots u_n\, q\, v_1\cdots v_m)\) 的两个边界情形（\(m=1\) 右移、\(n=0\) 左移）。`,
      String.raw`1. 当 \(m=1\) 且 \(\delta(q,v_1)=(q',b,R)\) 时：\(\mathrm{NEXT} = u_1\cdots u_n\, b\, q'\, \sqcup\)。<br>2. 当 \(n=0\) 且 \(\delta(q,v_1)=(q',b,L)\) 时：\(\mathrm{NEXT} = q'\, \sqcup\, b\, v_2\cdots v_m\)。`
    ],
    [
      String.raw`可判定语言在哪些基本运算下封闭？`,
      String.raw`在<strong>补（Complement）</strong>、<strong>反转（Reversal）</strong>、<strong>并（Union）</strong>、<strong>交（Intersection）</strong>、<strong>连接（Concatenation）</strong>下均封闭。`
    ]
  ]
});
