Review.add({
  id: "l03",
  n: 3,
  group: "computability",
  short: "L3 · 图灵机与可判定性",
  title: "Lecture 3 · 图灵机作为算法模型、可判定与可识别语言",
  meta: "双向无穷带与读写头 · 初始空白格约定 C0 = q0 ⊔ w · 可判定 vs 可识别 · PARITY 图灵机",
  sources: [
    { href: "materials/CSC4010_Lecture3.pdf", label: "Lecture 3 Slides" },
    { href: "materials/CSC4010_Lecture3(Annotated).pdf", label: "Lecture 3 Annotated" }
  ],
  html: String.raw`
<h2>1. 图灵机（Turing Machine）的直观结构与课程约定</h2>
<p>1936 年 Alan Turing 提出了<strong>图灵机（Turing Machine, TM）</strong>，将“机械可执行的算法步骤”抽象为有限状态控制器与无限长一维存储带的交互过程。本课程使用的标准图灵机具有以下结构特征：</p>
<ul>
  <li><strong>双向无穷工作带（Two-way Infinite Tape）</strong>：工作带向左右两个方向无限延伸，划分为离散的单元格（cells），每个单元格存储工作带字母表 \(\Sigma\) 中的一个符号。</li>
  <li><strong>有限状态控制器与读写头（Read/Write Head）</strong>：控制器处于有限状态集 \(Q\) 中的某个状态 \(q\)，读写头在任意时刻指向工作带上的唯一一个单元格。</li>
  <li><strong>单步原子操作</strong>：在每一步计算中，图灵机根据<strong>当前状态 \(q\)</strong> 和<strong>读写头当前扫描的符号 \(b\)</strong>，由转移函数 \(\delta(q, b) = (q', c, D)\) 唯一决定：
    <ol>
      <li>将控制器状态切换为 \(q' \in Q\)；</li>
      <li>在当前单元格写入符号 \(c \in \Sigma\)（覆盖原符号 \(b\)）；</li>
      <li>将读写头向左移动一格（\(D = L\)）或向右移动一格（\(D = R\)）。标准图灵机<strong>每步必须左移或右移</strong>，不能原地停留。</li>
    </ol>
  </li>
</ul>

<div class="callout trap">
  <strong>核心课程约定（与 Sipser 教材的关键差异，必考！）</strong>
  <p>在 Aditi Dudeja 教授的 CSC4010 课程讲义中：</p>
  <ol>
    <li><strong>初始读写头位置</strong>：给定输入串 \(w = w_1 w_2 \cdots w_n \in \{0, 1\}^*\)，工作带上存放 \(w\)，其余所有格均为空白符 \(\sqcup\)。<strong>计算开始时，读写头位于输入串 \(w\) 左端紧邻的那个空白格 \(\sqcup\) 上</strong>（而非 \(w_1\) 上）！即初始配置写作 \(C_0 = q_0 \sqcup w\)。因此图灵机的第一步转移通常是 \(\delta(q_0, \sqcup) = (q_{\mathrm{next}}, \sqcup, R)\)，右移进入 \(w_1\)。</li>
    <li><strong>字母表记号</strong>：课程只考虑二进制输入字母表 \(\{0, 1\}\)，而将包含空白符 \(\sqcup\) 及辅助符号的<strong>工作带字母表</strong>直接记为 \(\Sigma\)（满足 \(\{0, 1, \sqcup\} \subseteq \Sigma\)）。</li>
  </ol>
</div>

<h2>2. 图灵机在输入上的三种运行结果</h2>
<p>图灵机包含两个特殊的停机状态：<strong>接受状态 \(q_{\mathrm{acc}}\)</strong> 与 <strong>拒绝状态 \(q_{\mathrm{rej}}\)</strong>（且 \(q_{\mathrm{acc}} \ne q_{\mathrm{rej}}\)）。一旦进入 \(q_{\mathrm{acc}}\) 或 \(q_{\mathrm{rej}}\)，计算立即停止。因此，图灵机 \(M\) 在输入 \(w \in \{0, 1\}^*\) 上的运行恰好有以下三种互斥结局之一：</p>
<ol>
  <li><strong>停机接受（Accepts \(w\)）</strong>：经过有限步后进入状态 \(q_{\mathrm{acc}}\)；</li>
  <li><strong>停机拒绝（Rejects \(w\)）</strong>：经过有限步后进入状态 \(q_{\mathrm{rej}}\)；</li>
  <li><strong>无限循环（Loops on \(w\)）</strong>：永远不进入 \(q_{\mathrm{acc}}\) 或 \(q_{\mathrm{rej}}\)，计算无限持续下去。</li>
</ol>
<p>记 \(M\) 所接受的所有输入串组成的集合为 \(M\) 的语言：</p>
<div class="formula">\[
  L(M) = \{w \in \{0, 1\}^* \mid M \text{ 接受 } w\}.
\]</div>

<h2>3. 可识别语言（Recognizable）与可判定语言（Decidable）</h2>
<p>由于图灵机在非接受输入上可能停机拒绝，也可能死循环，我们严格区分“识别（Recognize）”与“判定（Decide）”两个层次：</p>

<div class="callout must">
  <strong>定义 3.1（图灵可识别语言 / Turing-Recognizable Language）</strong>
  <p>称图灵机 \(M\) <strong>识别（recognizes）</strong>语言 \(L \subseteq \{0, 1\}^*\)，如果 \(L(M) = L\)，即对任意 \(w \in \{0, 1\}^*\)：</p>
  <ul>
    <li>若 \(w \in L\)，则 \(M\) 在 \(w\) 上停机并<strong>接受</strong>（进入 \(q_{\mathrm{acc}}\)）；</li>
    <li>若 \(w \notin L\)，则 \(M\) 在 \(w\) 上<strong>拒绝或无限循环</strong>（只要不进入 \(q_{\mathrm{acc}}\) 即可）。</li>
  </ul>
  <p>若存在图灵机识别 \(L\)，则称 \(L\) 是<strong>可识别的（Recognizable）</strong>；否则称为<strong>不可识别的（Unrecognizable）</strong>。</p>
</div>

<div class="callout must">
  <strong>定义 3.2（图灵可判定语言 / Decidable Language）</strong>
  <p>称图灵机 \(M\) <strong>判定（decides）</strong>语言 \(L \subseteq \{0, 1\}^*\)，如果 \(M\) 在<strong>所有输入 \(w \in \{0, 1\}^*\) 上都停机</strong>（绝不死循环），且对任意 \(w \in \{0, 1\}^*\)：</p>
  <ul>
    <li>若 \(w \in L\)，则 \(M\) 停机并<strong>接受</strong>（进入 \(q_{\mathrm{acc}}\)）；</li>
    <li>若 \(w \notin L\)，则 \(M\) 停机并<strong>拒绝</strong>（进入 \(q_{\mathrm{rej}}\)）。</li>
  </ul>
  <p>在所有输入上都停机的图灵机称为<strong>判定机（Decider）</strong>。若存在图灵机判定 \(L\)，则称 \(L\) 是<strong>可判定的（Decidable）</strong>；否则称为<strong>不可判定的（Undecidable）</strong>。</p>
</div>

<p><strong>包含关系</strong>：每个判定机天然也是识别机，因此：</p>
<div class="formula">\[
  \text{可判定语言（Decidable）} \;\subsetneq\; \text{可识别语言（Recognizable）} \;\subsetneq\; \text{全体语言 }\mathcal{P}(\{0, 1\}^*).
\]</div>

<h2>4. 经典构造实例：奇偶校验图灵机 <code>PARITY</code></h2>
<p><strong>问题定义</strong>：设计一台判定语言 \(\mathrm{PARITY} = \{w \in \{0, 1\}^* \mid w \text{ 中含有奇数个 } 1\}\) 的图灵机（可在侧边栏 <a href="#/tm/parity">图灵机模拟器</a> 中单步运行）。</p>
<p><strong>状态与转移设计</strong>：</p>
<ul>
  <li>状态集 \(Q = \{q_0, q_{\mathrm{even}}, q_{\mathrm{odd}}, q_{\mathrm{acc}}, q_{\mathrm{rej}}\}\)，工作带字母表 \(\Sigma = \{0, 1, \sqcup\}\)。</li>
  <li><strong>启动步</strong>：读写头初始在 \(w\) 左侧空白格 \(\sqcup\) 上，\(\delta(q_0, \sqcup) = (q_{\mathrm{even}}, \sqcup, R)\)，右移进入 \(w\) 的首字符，已读 \(1\) 的个数为 \(0\)（偶数）。</li>
  <li><strong>扫描步</strong>：
    <ul>
      <li>在 \(q_{\mathrm{even}}\) 下：读 \(0\) 保持 \(q_{\mathrm{even}}\) 右移；读 \(1\) 翻转至 \(q_{\mathrm{odd}}\) 右移；</li>
      <li>在 \(q_{\mathrm{odd}}\) 下：读 \(0\) 保持 \(q_{\mathrm{odd}}\) 右移；读 \(1\) 翻转至 \(q_{\mathrm{even}}\) 右移。</li>
    </ul>
  </li>
  <li><strong>终止步</strong>：当读写头越过 \(w\) 最右端读到右侧空白格 \(\sqcup\) 时：
    <ul>
      <li>\(\delta(q_{\mathrm{even}}, \sqcup) = (q_{\mathrm{rej}}, \sqcup, L)\)（偶数个 \(1\)，拒绝）；</li>
      <li>\(\delta(q_{\mathrm{odd}}, \sqcup) = (q_{\mathrm{acc}}, \sqcup, L)\)（奇数个 \(1\)，接受）。</li>
    </ul>
  </li>
</ul>
<p>对长度为 \(n\) 的输入串 \(w\)，该图灵机恰好在 \(n + 2\) 步内停机，因此它是 \(\mathrm{PARITY}\) 的判定机。</p>
`,
  questions: [
    {
      id: "l03-q1",
      kind: "single",
      tag: "slide",
      q: String.raw`在本课程（CSC4010）的形式化约定中，图灵机 \(M\) 在输入串 \(w = w_1 w_2 \cdots w_n\) 上启动时，读写头（head）的初始位置在哪里？`,
      choices: [
        ["a", String.raw`位于输入串 \(w\) 左端紧邻的空白格 \(\sqcup\) 上（即初始配置为 \(q_0 \sqcup w\)）`],
        ["b", String.raw`位于输入串的第一个字符 \(w_1\) 上`],
        ["c", String.raw`位于输入串的最后一个字符 \(w_n\) 上`],
        ["d", String.raw`位于输入串右端紧邻的空白格 \(\sqcup\) 上`]
      ],
      answer: ["a"],
      why: String.raw`课程讲义（Lecture 3 &amp; 4）明确规定初始配置为 \(C_0 = q_0 \sqcup w\)，即读写头初始扫描 \(w\) 左侧紧邻的空白格 \(\sqcup\)。写状态转移表时切勿遗漏第一步 \(\delta(q_0, \sqcup) = (\dots, R)\)。`
    },
    {
      id: "l03-q2",
      kind: "single",
      tag: "slide",
      q: String.raw`设图灵机 \(M\) 对所有属于语言 \(L\) 的输入串 \(w \in L\) 都停机并进入 \(q_{\mathrm{acc}}\)，对所有不属于 \(L\) 的输入串 \(w \notin L\) 都进入无限循环（从不进入 \(q_{\mathrm{acc}}\) 或 \(q_{\mathrm{rej}}\)）。下列哪项陈述是正确的？`,
      choices: [
        ["a", String.raw`\(M\) 识别（recognizes）语言 \(L\)，但 \(M\) 不判定（does not decide）语言 \(L\)`],
        ["b", String.raw`\(M\) 既判定 \(L\) 又识别 \(L\)`],
        ["c", String.raw`\(M\) 既不识别 \(L\) 也不判定 \(L\)`],
        ["d", String.raw`\(L\) 一定是不可判定语言`]
      ],
      answer: ["a"],
      why: String.raw`识别只要求 \(L(M) = \{w \mid M \text{ 接受 } w\} = L\)，允许对 \(w \notin L\) 死循环，故 \(M\) 识别 \(L\)；判定则要求 \(M\) 在所有输入上都停机，故 \(M\) 不是判定机。（注意：\(M\) 不判定 \(L\) 并不意味着 \(L\) 本身不可判定，也许存在另一台不死循环的图灵机 \(M'\) 能判定 \(L\)）。`
    },
    {
      id: "l03-q3",
      kind: "single",
      tag: "slide",
      q: String.raw`在标准图灵机的单步转移函数 \(\delta: (Q \setminus \{q_{\mathrm{acc}}, q_{\mathrm{rej}}\}) \times \Sigma \to Q \times \Sigma \times \{L, R\}\) 中，读写头在每一步可以如何移动？`,
      choices: [
        ["a", String.raw`必须向左移动一格（\(L\)）或向右移动一格（\(R\)），不允许原地停留`],
        ["b", String.raw`可以向左（\(L\)）、向右（\(R\)）或原地不动（\(S\)）`],
        ["c", String.raw`只能向右移动（\(R\)），到达右端后自动跳回左端`],
        ["d", String.raw`可以一次移动任意 \(k\) 格`]
      ],
      answer: ["a"],
      why: String.raw`标准图灵机转移函数的方向集合为 \(\{L, R\}\)，每步必须左移或右移一格；允许原地停留的 \(\{L, R, S\}\) 是 Lecture 5 讨论的等价变体。`
    },
    {
      id: "l03-q4",
      kind: "tf",
      tag: "slide",
      q: String.raw`判断正误：每一台图灵机 \(M\) 都识别（recognizes）某个语言，且每一台图灵机 \(M\) 也都判定（decides）某个语言。`,
      answer: ["f"],
      why: String.raw`错误！前半句正确：每台图灵机 \(M\) 都唯一识别语言 \(L(M) = \{x \in \{0,1\}^* \mid M \text{ 接受 } x\}\)；但后半句错误：若存在哪怕一个输入 \(x\) 使 \(M\) 无限循环，则 \(M\) 不是判定机，它不判定任何语言！`
    },
    {
      id: "l03-q5",
      kind: "tf",
      tag: "slide",
      q: String.raw`判断正误：每一个可判定语言（decidable language）都必然是可识别语言（recognizable language）。`,
      answer: ["t"],
      why: String.raw`正确。若判定机 \(M\) 判定 \(L\)，则 \(M\) 在 \(x \in L\) 上停机接受、在 \(x \notin L\) 上停机拒绝（不接受），因此 \(L(M) = L\)，\(M\) 自然也识别 \(L\)。即 \(\mathrm{Decidable} \subsetneq \mathrm{Recognizable}\)。`
    }
  ],
  cards: [
    [
      String.raw`CSC4010 课程中图灵机在输入 \(w\) 上的初始配置 \(C_0\) 是什么？`,
      String.raw`\(C_0 = q_0 \sqcup w\)，即控制器处于初始状态 \(q_0\)，读写头位于输入串 \(w\) <strong>左侧紧邻的空白格 \(\sqcup\)</strong> 上。`
    ],
    [
      String.raw`“图灵机 \(M\) 识别语言 \(L\)”与“\(M\) 判定语言 \(L\)”有什么区别？`,
      String.raw`<strong>识别（Recognize）</strong>：\(w \in L \iff M\) 接受 \(w\)（对 \(w \notin L\) 可拒绝或死循环）。<br><strong>判定（Decide）</strong>：\(M\) 识别 \(L\) 且在<strong>所有输入 \(w \in \{0,1\}^*\) 上都停机</strong>（\(w \notin L\) 时必须停机拒绝）。`
    ]
  ]
});
