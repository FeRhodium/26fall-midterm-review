Review.add({
  id: "l06",
  n: 6,
  group: "computability",
  short: "L6 · 通用图灵机 UTM",
  title: "Lecture 6 · 双带转单带完整证明與通用图灵机（Universal Turing Machine）",
  meta: "双带转单带扫描机制 · 图灵机二进制编码 <M> = 1^k 0 1^m 0 <δ> · 四带 UTM 实现 · A_TM 的可识别性",
  sources: [
    { href: "materials/CSC4010_Lecture6.pdf", label: "Lecture 6 Slides" },
    { href: "materials/CSC4010_Lecture6(Annotated).pdf", label: "Lecture 6 Annotated" }
  ],
  html: String.raw`
<h2>1. 双带图灵机转单带图灵机的完整模拟步骤</h2>
<p>承接 Lecture 5，设双带图灵机 \(M = (Q, q_{\mathrm{acc}}, q_{\mathrm{rej}}, q_0, \delta, \sqcup, \Sigma)\)，单带模拟机 \(M'\) 使用复合轨道字母表 \(\Sigma' = \{\sqcup'\} \cup (\Sigma \cup \overline{\Sigma})^2\)。在初始化将工作带设为 \((\overline{\sqcup}, \overline{\sqcup})(w_1, \sqcup)\cdots(w_n, \sqcup)\) 后，\(M'\) 按如下两趟扫描循环模拟 \(M\) 的每一步转移：</p>
<ol>
  <li><strong>第一趟扫描（收集两个虚拟读写头下的符号 \(a_1, a_2\)）</strong>：
    <ul>
      <li>\(M'\) 从工作带最左端出发向右扫描（使用前面已证等价的 \(\mathrm{Reset}\) 变体指令可随时回到左端）。</li>
      <li>当遇到第一分量带顶横线的单元格 \((\overline{a_1}, y)\) 和第二分量带顶横线的单元格 \((x, \overline{a_2})\) 时，\(M'\) 利用<strong>有限状态控制器</strong>记住已读到的符号对 \((a_1, a_2) \in \Sigma^2\)（需要状态子集 \(Q \times \Sigma^2\)）。</li>
    </ul>
  </li>
  <li><strong>第二趟扫描（根据 \(\delta(q, a_1, a_2) = (q', b_1, b_2, D_1, D_2)\) 更新两条轨道）</strong>：
    <ul>
      <li>一旦集齐 \((a_1, a_2)\)，\(M'\) 便唯一确定新状态 \(q'\)、写入符号 \((b_1, b_2)\) 与移动方向 \((D_1, D_2)\)。</li>
      <li>\(M'\) 再次扫描工作带定位到 \((\overline{a_1}, y)\)：将其第一分量改写为不带横线的 \(b_1\)，然后根据 \(D_1 \in \{L, R, S\}\) 移动一格，将相邻格（或当前格）的第一分量 \(c_1\) 改写为带横线的 \(\overline{c_1}\)（若移入外围 \(\sqcup'\)，则先将该格展开为 \((\sqcup, \sqcup)\) 再加横线）。</li>
      <li>同理，定位到 \((x, \overline{a_2})\)，将其第二分量改写为 \(b_2\)，并在 \(D_2\) 方向的目标格上标上第二分量的顶横线。</li>
      <li>最后控制器进入对应于 \(q'\) 的主状态；若 \(q' \in \{q_{\mathrm{acc}}, q_{\mathrm{rej}}\}\)，\(M'\) 立即进入自身的 \(q'_{\mathrm{acc}}\) 或 \(q'_{\mathrm{rej}}\) 停机。</li>
    </ul>
  </li>
</ol>
<p><strong>结论</strong>：该构造可通过归纳法推广到任意固定 \(k \ge 1\) 条工作带：<strong>任何 \(k\) 带图灵机都与单带标准图灵机具有完全相同的计算能力（可识别性与可判定性不变）</strong>。</p>

<h2>2. 程序即数据：图灵机的二进制编码 \(\langle M \rangle\)</h2>
<p>之前的图灵机都是“专用硬件”（如只算奇偶性的 <code>PARITY</code>）。Alan Turing 在 1936 年论文中最具革命性的贡献是提出<strong>通用图灵机（Universal Turing Machine, UTM）</strong>——即现代通用存储程序计算机与解释器的理论原型：将任意图灵机 \(M\) 编码为二进制串 \(\langle M \rangle \in \{0, 1\}^*\)，作为数据喂给一台固定的图灵机 \(U\) 进行模拟。</p>

<div class="callout must">
  <strong>定义 6.1（CSC4010 图灵机标准二进制编码规范，Lecture 6 &amp; PS2 Q4）</strong>
  <p>设单带图灵机 \(M = (Q, q_{\mathrm{acc}}, q_{\mathrm{rej}}, q_0, \delta, \sqcup, \Sigma)\)。不妨设（不足时可补入不可达哑状态或未用符号）状态数为 2 的幂 \(|Q| = 2^k\)，工作带字母表大小为 2 的幂 \(|\Sigma| = 2^m\)：</p>
  <ol>
    <li><strong>状态编码</strong>：将每个状态 \(q \in Q\) 唯一编码为长度为 \(k\) 的二进制串 \(q \in \{0, 1\}^k\)（固定约定 \(q_0, q_{\mathrm{acc}}, q_{\mathrm{rej}}\) 的编码，例如 \(q_0 = 0^k\)）。</li>
    <li><strong>工作带符号编码</strong>：将每个符号 \(b \in \Sigma\) 唯一编码为长度为 \(m\) 的二进制串 \(\langle b \rangle \in \{0, 1\}^m\)。特别地，固定约定：
    <div class="formula">\[
      \langle 0 \rangle = 0^m, \qquad \langle 1 \rangle = 10^{m-1}, \qquad \langle \sqcup \rangle = 1^m.
    \]</div></li>
    <li><strong>方向编码</strong>：用 \(1\) 比特编码移动方向：\(\langle L \rangle = 0\)，\(\langle R \rangle = 1\)。</li>
    <li><strong>单条转移记录编码</strong>：若 \(\delta(q, b) = (q', b', D)\)，记查询键为 \(\langle q, b \rangle = q\langle b \rangle\)（长 \(k + m\) 位），转移结果为 \(\langle \delta(q, b) \rangle = q'\langle b' \rangle\langle D \rangle\)（长 \(k + m + 1\) 位）。将该条转移编码为定长拼接记录：
    <div class="formula">\[
      \mathrm{Record}(q, b) = \langle q, b \rangle \langle \delta(q, b) \rangle = q\,\langle b \rangle\, q'\,\langle b' \rangle\,\langle D \rangle \;\in\; \{0, 1\}^{2k + 2m + 1}.
    \]</div></li>
    <li><strong>转移表 \(\langle \delta \rangle\) 与整机编码 \(\langle M \rangle\)</strong>：将所有 \((q, b) \in Q \times \Sigma\)（或全体 \(2^{k+m}\) 个状态-符号对）的定长记录按字典序拼接为 \(\langle \delta \rangle\)（总长为 \(2^{k+m}(2k + 2m + 1)\) 位），并在头部用一元编码标出参数 \(k\) 和 \(m\)：
    <div class="formula">\[
      \langle M \rangle = 1^k\, 0\, 1^m\, 0\, \langle \delta \rangle, \qquad \langle M, w \rangle = \langle M \rangle w = 1^k\, 0\, 1^m\, 0\, \langle \delta \rangle\, w.
    \]</div></li>
  </ol>
</div>

<div class="callout ex">
  <strong>为什么 \(\langle M \rangle\) 头部要先写前缀 \(1^k 0 1^m 0\)？</strong>
  <p>因为不同图灵机 \(M\) 的状态数 \(2^k\) 和字母表大小 \(2^m\) 是任意大的，而通用图灵机 \(U\) 自身的有限状态集大小是固定的！通过前缀 \(1^k 0 1^m 0\)，\(U\) 可以数出前两个 \(0\) 之前的 \(1\) 的个数，从而精确得知每条转移记录的长度 \(2k + 2m + 1\) 以及整个转移表 \(\langle \delta \rangle\) 的结束位置（即输入串 \(w\) 的起始位置），无需任何额外分隔符即可无歧义地解析 \(\langle M \rangle w\)。</p>
</div>

<h2>3. 通用图灵机 \(U\) 的四带构造与运行机制</h2>

<div class="callout must">
  <strong>定理 6.1（通用图灵机定理，Turing 1936）</strong>
  <p>存在一台固定的图灵机 \(U\)（称为<strong>通用图灵机</strong>），使得对任意图灵机 \(M\) 和任意输入串 \(w \in \{0, 1\}^*\)，在输入 \(\langle M, w \rangle = \langle M \rangle w\) 上：</p>
  <ul>
    <li>\(U\) 停机并<strong>接受</strong> \(\langle M, w \rangle \iff M\) 停机并<strong>接受</strong> \(w\)；</li>
    <li>\(U\) 停机并<strong>拒绝</strong> \(\langle M, w \rangle \iff M\) 停机并<strong>拒绝</strong> \(w\)；</li>
    <li>\(U\) 在 \(\langle M, w \rangle\) 上<strong>无限循环</strong> \(\iff M\) 在 \(w\) 上<strong>无限循环</strong>。</li>
  </ul>
</div>

<p><strong>四带通用图灵机 \(U\) 的体系结构（之后可由定理 5.1 自动转为单带）</strong>：</p>
<ol>
  <li><strong>Tape 1（输入带 Input Tape）</strong>：初始存放原始输入 \(\langle M \rangle w = 1^k 0 1^m 0 \langle \delta \rangle w\)。</li>
  <li><strong>Tape 2（状态带 State Tape）</strong>：存储被模拟机 \(M\) 当前状态的 \(k\) 位二进制编码 \(q \in \{0, 1\}^k\)（初始化为 \(q_0 = 0^k\)）。</li>
  <li><strong>Tape 3（机器码带 Machine Code Tape）</strong>：在初始化阶段从 Tape 1 拷贝存放转移表 \(\langle \delta \rangle\)。</li>
  <li><strong>Tape 4（模拟工作带 Simulation Tape）</strong>：存放 \(M\) 的工作带内容，其中 \(M\) 的<strong>每一个单元格符号 \(b \in \Sigma\) 在 Tape 4 上占用连续 \(m\) 个二进制格 \(\langle b \rangle \in \{0, 1\}^m\)</strong>。初始化时：将起始空白格写为 \(\langle \sqcup \rangle = 1^m\)，将 \(w\) 的每位 \(w_i = 0\) 展开为 \(0^m\)、\(w_i = 1\) 展开为 \(10^{m-1}\)，并将 Tape 4 读写头置于起始空白块 \(1^m\) 的第 1 位上。</li>
</ol>

<p><strong>单步模拟循环（Simulating one step of \(M\)）</strong>：</p>
<ul>
  <li>假设当前 \(M\) 处于配置 \(u_1\cdots u_r\, q\, v_1\cdots v_s\)，则 Tape 2 上存有 \(q \in \{0,1\}^k\)，Tape 4 上存有 \(\langle u_1\rangle\cdots\langle u_r\rangle\langle v_1\rangle\cdots\langle v_s\rangle\)，且 Tape 4 读写头正指在 \(m\) 位块 \(\langle v_1 \rangle\) 的首比特上。</li>
  <li><strong>查表匹配</strong>：\(U\) 在 Tape 3（存放 \(\langle \delta \rangle\)）上逐条扫描长度为 \(2k + 2m + 1\) 的记录，将其前 \(k\) 位与 Tape 2 上的当前状态 \(q\) 比对，将随后的 \(m\) 位与 Tape 4 当前块 \(\langle v_1 \rangle\) 比对。</li>
  <li><strong>执行更新</strong>：找到唯一匹配的记录 \(q\langle v_1 \rangle q'\langle v'_1 \rangle\langle D \rangle\) 后：
    <ol>
      <li>将新状态编码 \(q'\)（\(k\) 位）覆盖写入 Tape 2；</li>
      <li>将新符号编码 \(\langle v'_1 \rangle\)（\(m\) 位）覆盖写入 Tape 4 的当前块；</li>
      <li>根据方向位 \(\langle D \rangle\)：若 \(\langle D \rangle = 1\)（即 \(R\)），将 Tape 4 读写头<strong>向右移动 \(m\) 格</strong>到达下一符号块首比特（若踏入未初始化的空白区则先写入 \(1^m\)）；若 \(\langle D \rangle = 0\)（即 \(L\)），将 Tape 4 读写头<strong>向左移动 \(m\) 格</strong>到达上一符号块首比特。</li>
    </ol>
  </li>
  <li><strong>停机检测</strong>：检查 Tape 2 上的 \(q'\) 是否等于 \(q_{\mathrm{acc}}\) 或 \(q_{\mathrm{rej}}\) 的编码；若是，则 \(U\) 立即进入自身的接受状态或拒绝状态停机。</li>
</ul>

<div class="callout ex">
  <strong>重要推论：接受语言 \(A_{\mathrm{TM}}\) 是图灵可识别的</strong>
  <p>定义接受问题语言 \(A_{\mathrm{TM}} = \{\langle M, w \rangle \mid M \text{ 是一台图灵机且 } M \text{ 接受 } w\}\)。由定理 6.1，通用图灵机 \(U\) 当且仅当 \(M\) 接受 \(w\) 时停机接受 \(\langle M, w \rangle\)（当 \(M\) 拒绝或死循环时，\(U\) 也相应拒绝或死循环）。因此：<strong>\(U\) 识别 \(A_{\mathrm{TM}}\)，但 \(U\) 不是 \(A_{\mathrm{TM}}\) 的判定机</strong>。</p>
</div>
`,
  questions: [
    {
      id: "l06-q1",
      kind: "single",
      tag: "slide",
      q: String.raw`在 Lecture 6 的图灵机二进制编码方案中，设 \(|Q| = 2^k\) 且 \(|\Sigma| = 2^m\)。单条转移规则 \(\delta(q, b) = (q', b', D)\) 被编码为定长二进制记录 \(q\langle b \rangle q'\langle b' \rangle\langle D \rangle\)，该记录的比特长度是多少？`,
      choices: [
        ["a", String.raw`\(2k + 2m + 1\)`],
        ["b", String.raw`\(k + m + 1\)`],
        ["c", String.raw`\(2^k + 2^m + 1\)`],
        ["d", String.raw`\(k \cdot m + 1\)`]
      ],
      answer: ["a"],
      why: String.raw`当前状态 \(q\) 与下一状态 \(q'\) 各占 \(k\) 比特（共 \(2k\)），当前符号 \(\langle b \rangle\) 与写入符号 \(\langle b' \rangle\) 各占 \(m\) 比特（共 \(2m\)），移动方向 \(\langle D \rangle \in \{0, 1\}\) 占 \(1\) 比特，合计 \(2k + 2m + 1\) 比特。`
    },
    {
      id: "l06-q2",
      kind: "single",
      tag: "slide",
      q: String.raw`在四带通用图灵机 \(U\) 模拟目标机 \(M\)（其中 \(|\Sigma| = 2^m\)）的过程中，当 \(M\) 的读写头向右移动 1 个单元格时，\(U\) 在模拟工作带（Simulation Tape）上的读写头需要向右移动多少格？`,
      choices: [
        ["a", String.raw`\(m\) 格（因为 \(M\) 的每个工作带符号在模拟带上被编码为长度为 \(m\) 的二进制块）`],
        ["b", String.raw`\(1\) 格`],
        ["c", String.raw`\(2^m\) 格`],
        ["d", String.raw`\(2k + 2m + 1\) 格`]
      ],
      answer: ["a"],
      why: String.raw`由于 \(U\) 的字母表是固定的，而 \(M\) 的字母表大小 \(|\Sigma| = 2^m\) 可以任意大，\(M\) 的每个单元格在 \(U\) 的模拟带上占用连续 \(m\) 个比特位（一个 block）。因此 \(M\) 移动 1 格对应 \(U\) 的模拟带读写头移动 \(m\) 格。`
    },
    {
      id: "l06-q3",
      kind: "single",
      tag: "slide",
      q: String.raw`为什么通用图灵机 \(U\) 只证明了 \(A_{\mathrm{TM}} = \{\langle M, w \rangle \mid M \text{ 接受 } w\}\) 是<strong>可识别的（recognizable）</strong>，而不能直接证明 \(A_{\mathrm{TM}}\) 是可判定的（decidable）？`,
      choices: [
        ["a", String.raw`因为当 \(M\) 在输入 \(w\) 上无限循环时，逐步模拟它的 \(U\) 也会无限循环，无法停机给出拒绝结果`],
        ["b", String.raw`因为 \(U\) 有四条工作带，而判定机只能有一条工作带`],
        ["c", String.raw`因为当 \(M\) 停机拒绝 \(w\) 时，\(U\) 会错误地接受 \(\langle M, w \rangle\)`],
        ["d", String.raw`因为并非所有图灵机都能编码为二进制串`]
      ],
      answer: ["a"],
      why: String.raw`当 \(M\) 在 \(w\) 上停机接受或拒绝时，\(U\) 都能停机并给出相同结论；但若 \(w \notin A_{\mathrm{TM}}\) 是因为 \(M\) 在 \(w\) 上陷入死循环，则 \(U\) 的逐步模拟也会永远运行下去而不停机，故 \(U\) 是识别机而非判定机。`
    },
    {
      id: "l06-q4",
      kind: "single",
      tag: "slide",
      q: String.raw`在 Lecture 6 的二进制编码中，状态集 \(Q = \{0, 1\}^k\) 中的三个特殊状态 \(q_0\)（初始状态）、\(q_{\mathrm{acc}}\)（接受状态）、\(q_{\mathrm{rej}}\)（拒绝状态）分别被固定编码为什么？`,
      choices: [
        ["a", String.raw`\(q_0 = 0^k\)，\(q_{\mathrm{acc}} = 1^{k-1}0\)，\(q_{\mathrm{rej}} = 1^k\)`],
        ["b", String.raw`\(q_0 = 1^k\)，\(q_{\mathrm{acc}} = 0^k\)，\(q_{\mathrm{rej}} = 1^{k-1}0\)`],
        ["c", String.raw`三者都编码为 \(0^k\)`],
        ["d", String.raw`没有任何固定编码约定`]
      ],
      answer: ["a"],
      why: String.raw`Lecture 6 固定约定 \(q_0 = 0^k\)，\(q_{\mathrm{acc}} = 1^{k-1}0\)，\(q_{\mathrm{rej}} = 1^k\)（以及符号 \(\langle 0 \rangle = 0^m, \langle 1 \rangle = 10^{m-1}, \langle \sqcup \rangle = 1^m\)），从而通用图灵机 \(U\) 知道从哪个初始状态启动，以及何时检测到停机状态。`
    }
  ],
  cards: [
    [
      String.raw`写出 CSC4010 中图灵机 \(M\)（\(|Q|=2^k, |\Sigma|=2^m\)）的标准二进制编码格式 \(\langle M \rangle\)。`,
      String.raw`\(\langle M \rangle = 1^k\, 0\, 1^m\, 0\, \langle \delta \rangle\)，其中 \(\langle \delta \rangle\) 由 \(2^{k+m}\) 条定长记录 \(q\langle b\rangle q'\langle b'\rangle\langle D\rangle\)（每条长 \(2k+2m+1\) 位）拼接而成，且 \(\langle 0\rangle=0^m, \langle 1\rangle=10^{m-1}, \langle \sqcup\rangle=1^m\)。`
    ],
    [
      String.raw`四带通用图灵机 \(U\) 的四条工作带分别存储什么内容？`,
      String.raw`1. <strong>输入带</strong>：原始串 \(\langle M \rangle w\)；<br>2. <strong>状态带</strong>：\(M\) 当前状态的 \(k\) 位编码 \(q\)；<br>3. <strong>机器码带</strong>：转移表编码 \(\langle \delta \rangle\)；<br>4. <strong>模拟带</strong>：\(M\) 的工作带内容（每个符号占 \(m\) 位）。`
    ]
  ]
});
