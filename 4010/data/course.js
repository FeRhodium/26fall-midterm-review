Review.setup({
  key: "csc4010-v1",
  code: "CSC4010",
  name: "理论计算机科学导论",
  other: { href: "../3150/", label: "CSC3150" },
  exam: {
    start: "2026-11-02T08:30:00+08:00",
    when: "11 月 2 日（周一）08:30–09:30",
    where: "AB E206（另：10/27 19:00 Quiz 2 @ TD 307）",
    badge: "期中 <b>30% · 36 分</b> · 可带 1 张 A4 单面手写小抄"
  },
  sheetKicker: "期中允许携带 1 张 A4 单面本人手写小抄 · 建议按本页提纲手写整理",
  groups: [
    { id: "computability", label: "可计算性理论 · Lecture 1–9", note: "集合基数、康托尔对角化、图灵机形式化与变体等价性、通用图灵机 UTM、停机问题与映射归约。" },
    { id: "complexity", label: "计算复杂性理论 · Lecture 10–12", note: "最坏情况时间复杂度、渐近记号、复杂性类 P、带时钟对角化与时间层次定理、验证机与复杂性类 NP、多项式时间归约与 NP 完全性。" },
    { id: "ps", label: "习题集精讲 · Problem Set 1–5", note: "课程大纲明确说明约 30%–40% 的考题直接改编自作业题，按完整形式化构造与双向证明整理。" },
    { id: "exam", label: "官方期中样卷 · Practice Midterm", note: "官方发布的 36 分 Practice Midterm 逐题解析（3 道多选 + 4 道简答 + 2 道综合证明大题）。" }
  ],
  tags: { slide: "课件", hw: "作业", sample: "样卷", practice: "练习" },
  home: String.raw`
<p class="kicker">CSC4010 Introduction to Theoretical Computer Science · Fall 2026 · Prof. Aditi Dudeja</p>
<h1>期中与 Quiz 2 复习</h1>
<div class="facts">
  <div class="card"><dl>
    <dt>期中考试（Midterm）</dt><dd>2026 年 11 月 2 日（周一）08:30–09:30（时长 60 分钟），地点：行政楼 AB E206；满分 36 分，占总评 <b>30%</b>。</dd>
    <dt>试卷题型（来自官方样卷）</dt><dd><b>3 道不定项选择</b>（4 分/题，错选或漏选 1 项扣 1 分）+ <b>4 道简答</b>（3 分/题）+ <b>2 道综合证明大题</b>（6 分/题），共 <b>36 分</b>。</dd>
    <dt>小测 2（Quiz 2）</dt><dd>2026 年 10 月 27 日（周二）19:00–19:20（Tutorial 前 20 分钟），地点：TD 307；满分 16 分，范围：Lecture 6–10 及 PS2–PS4。</dd>
    <dt>考查范围与小抄规则</dt><dd>期中覆盖 <b>Lecture 1–12</b>、<b>Problem Set 1–5</b> 及 <b><a href="#/c/sample">Practice Midterm</a></b>。允许携带 <b>1 张 A4 单面、本人亲笔手写</b>的小抄。</dd>
    <dt>命题规律（来自 Syllabus）</dt><dd>约 <b>30%–40%</b> 的期中/期末考题与作业题完全相同或仅作微小变形（例如样卷大题 2 即为 PS3 Q3 的 \(0^n 1^n\) 变体）。</dd>
  </dl></div>
  <div class="card seat-card"><div><div>期中笔试</div><div class="big">11/2</div></div><p>08:30 AB E206 · 36 分 (30%)<br>Quiz 2：10/27 19:00 TD 307</p></div>
</div>
<h2>分模块复习路径</h2>
<div class="plan">
  <article><b>模块一：基数与对角化（L1–L2, PS1 §1）</b>双射与单射、可数集与可数无穷集；\(\mathbb{Z},\mathbb{N}^2,\mathbb{N}^k,\{0,1\}^*,\mathbb{Q}\) 的可数性；康托尔对角化证明 \(|\mathbb{R}|&gt;|\mathbb{N}|\) 与康托尔定理 \(|\mathcal{P}(X)|&gt;|X|\)；由计数论证推出不可判定语言的存在性。</article>
  <article><b>模块二：图灵机模型与等价性（L3–L6, PS1 §2, PS2）</b>图灵机 7 元组、配置 \(uqv\) 与 \(\mathrm{NEXT}(C_i)\) 边界条件；可判定语言的封闭性（补、反转、并、交、连接）；Stay / Reset / 单向无穷带 / 多带图灵机的等价模拟；通用图灵机 \(U\) 的二进制编码 \(\langle M\rangle=1^k01^m0\langle\delta\rangle\)。</article>
  <article class="today"><b>模块三：不可判定性、映射归约与莱斯定理（L7–L9, PS3, PS4）</b>自拒绝语言 \(L_{\mathrm{self}}\) 与接受问题 \(A_{\mathrm{TM}}\)；\(L\) 可判定 \(\iff L,\overline{L}\) 均可识别；\(\mathrm{HALT}_{\mathrm{TM}}\) 的图灵归约；映射归约 \(A\le_m B\) 及 \(E_{\mathrm{TM}},\mathrm{EQ}_{\mathrm{TM}},\overline{\mathrm{EQ}_{\mathrm{TM}}},L_{01}\) 的不可识别性；莱斯定理与 PS4 不可识别归约模板。</article>
  <article class="today"><b>模块四：时间复杂性、时间层次定理与 P vs NP（L10–L12）</b>最坏情况时间复杂度、\(O/\Omega/\Theta/o/\omega\) 渐近记号；\(k\) 带转单带的 \(O(T(n)^2)\) 开销与复杂性类 \(\mathrm{P}\)；带时钟对角化与时间层次定理 \(\mathrm{TIME}(T^4)\setminus\mathrm{TIME}(o(T))\ne\emptyset\)；多项式时间验证机、完备性与可靠性、复杂性类 \(\mathrm{NP}\)、多项式时间归约 \(A\le_P B\) 与 \(\mathrm{NP}\) 完全性。</article>
</div>
`,
  sheet: String.raw`
<div class="sheet-grid">
<h3>1. 集合基数与康托尔对角化（L1–L2）</h3>
<p><b>基数关系</b>：\(|A|=|B|\iff\) 存在双射 \(f:A\to B\)；\(|A|\le |B|\iff\) 存在单射 \(f:A\to B\)；\(|A|&lt;|B|\iff |A|\le |B|\) 且不存在双射。<b>Schröder–Bernstein 定理</b>：\(|A|\le |B|\) 且 \(|B|\le |A|\implies |A|=|B|\)。</p>
<p><b>可数无穷集标准构造</b>：\(|\mathbb{N}|=|\mathbb{Z}^+|\)（\(x\mapsto x+1\)）；\(|\mathbb{N}|=|\mathbb{Z}|\)（奇偶交错映射 \(0,-1,1,-2,2,\dots\)）；\(|\mathbb{N}^2|=|\mathbb{N}|\)（单射 \((x,y)\mapsto 2^x3^y\) 由算术基本定理保证，或对角线枚举）；\(|\mathbb{N}^k|=|\mathbb{N}|\)（对 \(k\) 归纳）；\(|\{0,1\}^*|=|\mathbb{N}|\)（按长度分层的字典序枚举，或映射 \(w\mapsto (1w)_2-1\)）；\(|\mathbb{Q}|=|\mathbb{N}|\)（既约分数 \(p/q\mapsto (\mathrm{sign},|p|,q)\) 嵌入 \(\mathbb{Z}\times\mathbb{N}^2\)）；可数个可数集的并集仍可数（\(\bigcup_{k\in\mathbb{N}}\mathbb{N}^k\) 经 \((k,\text{code}(t))\in\mathbb{N}^2\) 单射到 \(\mathbb{N}\)）。</p>
<p><b>康托尔定理</b>：对任意集合 \(X\)，\(|\mathcal{P}(X)|&gt;|X|\)。证明：单射 \(x\mapsto\{x\}\) 给出 \(|X|\le|\mathcal{P}(X)|\)；任取满射 \(f:\mathcal{P}(X)\to X\)，定义对角集 \(D_f=\{x\in X\mid x\notin f^{-1}(x)\}\)（或对 \(g:X\to\mathcal{P}(X)\) 取 \(D=\{x\in X\mid x\notin g(x)\}\)），令 \(y=f(D_f)\) 则 \(y\in D_f\iff y\notin D_f\)，矛盾。</p>
<p><b>第一个不可能性定理</b>：所有图灵机编码是 \(\{0,1\}^*\) 的子集，故图灵机集合可数（\(\aleph_0\)）；而语言全体 \(\mathcal{P}(\{0,1\}^*)\) 与 \(\mathbb{R}\) 等势，不可数（\(2^{\aleph_0}\)）。因此必然存在不可判定（甚至不可识别）的语言。</p>

<h3>2. 图灵机形式化、变体与封闭性（L3–L5, PS1–PS2）</h3>
<p><b>7 元组</b>：\(M=(Q,q_{\mathrm{acc}},q_{\mathrm{rej}},q_0,\delta,\sqcup,\Sigma)\)，其中 \(\{0,1,\sqcup\}\subseteq\Sigma\)，\(\delta:(Q\setminus\{q_{\mathrm{acc}},q_{\mathrm{rej}}\})\times\Sigma\to Q\times\Sigma\times\{L,R\}\)。<b>初始配置</b>：\(C_0=q_0\sqcup w\)（读写头位于输入左端紧邻的空白格 \(\sqcup\) 上）。</p>
<p><b>配置与单步后继</b>：配置 \(uqv\)（\(u=u_1\cdots u_n,v=v_1\cdots v_m,m\ge 1\)）表示读写头在 \(v_1\)。若 \(\delta(q,v_1)=(q',b,R)\)：当 \(m&gt;1\) 时后继为 \(ubq'v_2\cdots v_m\)，当 \(m=1\) 时后继为 \(ubq'\sqcup\)。若 \(\delta(q,v_1)=(q',b,L)\)：当 \(n\ge 1\) 时后继为 \(u_1\cdots u_{n-1}q'u_nbv_2\cdots v_m\)，当 \(n=0\) 时后继为 \(q'\sqcup bv_2\cdots v_m\)。</p>
<p><b>可判定 vs 可识别</b>：\(M\) 识别 \(L\iff L=\{w\mid M\text{ 接受 }w\}\)（对 \(w\notin L\) 可拒绝或死循环）；\(M\) 判定 \(L\iff M\) 识别 \(L\) 且在所有输入上停机。</p>
<p><b>可判定语言封闭性</b>：(1) 补 \(\overline{L}\)：交换 \(q_{\mathrm{acc}}\) 与 \(q_{\mathrm{rej}}\)（仅对判定机成立，识别机可能死循环）；(2) 反转 \(L^R\)：先反转输入再运行 \(M\)；(3) 并 \(L_1\cup L_2\) 与交 \(L_1\cap L_2\)：双带并行模拟 \(M_1,M_2\)，状态集 \(Q_{\mathrm{init}}\cup(Q_1\times Q_2)\cup\{q_{\mathrm{acc}},q_{\mathrm{rej}}\}\)；(4) 连接 \(L_1\circ L_2\)：三带分 \(n+1\) 个阶段枚举分割点 \(w=u_kv_k\)。</p>
<p><b>变体等价性</b>：(1) Stay 变体 \(\{L,R,S\}\)：用先 \(L\)（写入原符号并转入辅助状态 \(q_{\mathrm{ret}}\)）再 \(R\) 模拟 \(S\)；(2) Reset 变体 \(\{L,R,\mathrm{ Reset }\}\)：在最左空白格做标记，用连续左移回到标记格模拟 \(\mathrm{Reset}\)；(3) 单向无穷带 \(\iff\) 双向无穷带：以初始格标记 \(\#\) 为折点，双轨折叠 \((a_i,a_{-i})\)，下轨方向取反（\(\overline{L}=R,\overline{R}=L\)）；(4) 双带转单带：轨道字母表 \(\Sigma'=\{\sqcup'\}\cup(\Sigma\cup\overline{\Sigma})^2\)，带顶横线符号标记两读写头位置；\(k\) 带 \(T(n)\) 时间图灵机转单带的时间复杂度为 \(O(T(n)^2)\)。</p>

<h3>3. 通用图灵机、对角化与停机问题（L6–L7）</h3>
<p><b>UTM 二进制编码</b>：设 \(|Q|=2^k,|\Sigma|=2^m\)，\(\langle M\rangle=1^k01^m0\langle\delta\rangle\)。每条转移 \(\delta(q,b)=(q',b',D)\) 编码为定长记录 \(q\langle b\rangle q'\langle b'\rangle\langle D\rangle\)，长度为 \(2k+2m+1\) 位，共 \(2^{k+m}\) 条记录。四带 \(U\)（输入带、状态带、机器码带、模拟带）每模拟一步在模拟带上移动 \(m\) 格，耗时 \(O(|\langle M\rangle|)\)。</p>
<p><b>自拒绝与接受问题</b>：\(L_{\mathrm{self}}=\{\langle M\rangle\mid M\text{ 拒绝 }\langle M\rangle\}\) 不可判定（若 \(M_{\mathrm{self}}\) 判定之，考察 \(M_{\mathrm{self}}(\langle M_{\mathrm{self}}\rangle)\) 得矛盾）。\(A_{\mathrm{TM}}=\{\langle M,w\rangle\mid M\text{ 接受 }w\}\) 可识别（由 \(U\) 识别）但不可判定（若 \(H\) 判定 \(A_{\mathrm{TM}}\)，构造 \(D(\langle M\rangle)=\neg H(\langle M,\langle M\rangle\rangle)\)，考察 \(D(\langle D\rangle)\) 得矛盾）。</p>
<p><b>核心判定-识别定理</b>：<b>\(L\) 可判定 \(\iff L\) 与 \(\overline{L}\) 均可识别</b>。（正方向：补封闭；反方向：交错/并行运行 \(R_L\) 与 \(R_{\overline{L}}\)，必有一方停机接受）。<b>推论</b>：\(\overline{A_{\mathrm{TM}}}\) 不可识别。</p>
<p><b>停机问题</b>：\(\mathrm{HALT}_{\mathrm{TM}}=\{\langle M,w\rangle\mid M\text{ 在 }w\text{ 上停机}\}\) 可识别但不可判定（通过 \(A_{\mathrm{TM}}\) 到 \(\mathrm{HALT}_{\mathrm{TM}}\) 的图灵归约证明；同理 \(\overline{\mathrm{HALT}_{\mathrm{TM}}}\) 不可识别）。</p>

<h3>4. 映射归约、不可识别模板与莱斯定理（L8–L9, PS3–PS4）</h3>
<p><b>映射归约 \(A\le_m B\)</b>：存在全可计算函数 \(f:\Sigma^*\to\Sigma^*\)（计算它的图灵机 \(F\) 对一切输入停机）使 \(w\in A\iff f(w)\in B\)。性质：(1) \(B\) 可判定 \(\implies A\) 可判定（逆否：\(A\) 不可判定 \(\implies B\) 不可判定）；(2) \(B\) 可识别 \(\implies A\) 可识别（逆否：<b>\(A\) 不可识别 \(\implies B\) 不可识别</b>，通常取 \(A=\overline{A_{\mathrm{TM}}}\)）；(3) \(A\le_m B\iff \overline{A}\le_m\overline{B}\)。</p>
<p><b>注意图灵归约与映射归约的区别</b>：图灵归约允许对神谕答案取反，因此 \(\overline{A_{\mathrm{TM}}}\) 可以图灵归约到 \(A_{\mathrm{TM}}\)，<b>图灵归约不能传递不可识别性</b>；映射归约不能翻转答案，故能传递不可识别性。</p>
<p><b>经典不可识别归约（均从 \(\overline{A_{\mathrm{TM}}}\) 归约）</b>：</p>
<ul>
  <li>\(E_{\mathrm{TM}}=\{\langle M\rangle\mid L(M)=\emptyset\}\)：构造 \(M_w(x)\)：若 \(x\ne w\) 拒绝；否则模拟 \(M(w)\)。\(M\) 不接受 \(w\iff L(M_w)=\emptyset\)。</li>
  <li>\(\mathrm{EQ}_{\mathrm{TM}}=\{\langle M_1,M_2\rangle\mid L(M_1)=L(M_2)\}\)：输出 \(\langle T_w,M_\emptyset\rangle\)，其中 \(T_w(x)\) 忽略 \(x\) 直接模拟 \(M(w)\)。</li>
  <li>\(\overline{\mathrm{EQ}_{\mathrm{TM}}}=\{\langle M_1,M_2\rangle\mid L(M_1)\ne L(M_2)\}\)：输出 \(\langle T_w,M_{\mathrm{acc}}\rangle\)，其中 \(L(M_{\mathrm{acc}})=\{0,1\}^*\)。\(M\) 不接受 \(w\iff L(T_w)=\emptyset\ne\{0,1\}^*\)。</li>
  <li>\(L_{01}=\{\langle M\rangle\mid L(M)=\{01\}\}\)：构造 \(M_w(x)\)：若 \(x=01\) 直接接受；否则模拟 \(M(w)\)。\(M\) 不接受 \(w\iff L(M_w)=\{01\}\)。</li>
  <li>\(L_{\mathrm{finite}}=\{\langle M\rangle\mid |L(M)|&lt;\infty\}\)：\(N(x)\) 直接模拟 \(M(w)\)。\(M\) 不接受 \(w\implies L(N)=\emptyset\)（有限）；\(M\) 接受 \(w\implies L(N)=\{0,1\}^*\)（无限）。</li>
</ul>
<p><b>莱斯定理（Rice's Theorem）</b>：任何关于可识别语言的<b>非平凡语义性质</b> \(\mathcal{P}\)（即只依赖 \(L(M)\)，且存在 \(M_1,M_2\) 使 \(L(M_1)\in\mathcal{P},L(M_2)\notin\mathcal{P}\)）对应的语言 \(L_{\mathcal{P}}=\{\langle M\rangle\mid L(M)\in\mathcal{P}\}\) 均不可判定。<b>陷阱</b>：(1) 语法/步数性质（如“至多 30 个状态”、“在 \(\varepsilon\) 上停机”、“平方步接受 \(01\)”）不适用莱斯定理；(2) 平凡语义性质（如“\(L(M)\) 可识别”、“\(L(M)\) 可被偶数状态 TM 识别”、“\(L(M)=\overline{A_{\mathrm{TM}}}\)”因无机器满足而为空集）是可判定的！</p>

<h3>5. 时间复杂性、时间层次定理与 P vs NP（L10–L12）</h3>
<p><b>时间复杂性</b>：\(T_M(n)=\max_{w\in\{0,1\}^n}(\text{步数})\)。\(\mathrm{TIME}(T)=\{Y\mid Y\text{ 可由单带 TM 在 }T(n)\text{ 步内判定}\}\)，\(\mathrm{P}=\bigcup_{k\ge 1}\mathrm{TIME}(n^k)\)。单带判定 \(\mathrm{PALINDROME}\) 需 \(\Theta(n^2)\)，双带需 \(O(n)\)。</p>
<p><b>时间层次定理</b>：若 \(T(n)\ge n\) 时间可构造（输入 \(1^n\) 在 \(O(T(n))\) 步输出 \(1^{T(n)}\)），令 \(Y=\{\langle M\rangle\mid M\text{ 在 }\le T(|\langle M\rangle|)\text{ 步内拒绝 }\langle M\rangle\}\)，则 \(Y\in\mathrm{TIME}(T^4)\setminus\mathrm{TIME}(o(T))\)（四带带钟 UTM 耗时 \(O(nT(n))\)，转单带平方得 \(O(n^2T(n)^2)\subseteq O(T(n)^4)\)）。<b>强时间层次定理</b>：\(f\log f=o(g)\implies\mathrm{TIME}(f)\subsetneq\mathrm{TIME}(g)\)，故 \(\mathrm{TIME}(n)\subsetneq\mathrm{TIME}(n^2)\subsetneq\cdots\) 且 \(\mathrm{P}\subsetneq\mathrm{TIME}(2^n)\)。</p>
<p><b>验证机与复杂性类 NP</b>：验证机 \(V\) 接收输入 \(x\) 与证书带上的 \(c\)，在所有 \((x,c)\) 上停机且运行时间为 \(O(|x|^c)\)。\(L(V)=\{x\mid \exists c\in\{0,1\}^*\text{ 使 }V\text{ 接受 }(x,c)\}\)（完备性：\(x\in L\implies\exists c\) 被接受；可靠性：\(x\notin L\implies\forall c\) 被拒绝）。\(\mathrm{NP}\) 是所有可被多项式时间验证机判定的语言类。\(\mathrm{CLIQUE},\text{3-COL},\mathrm{SUBSET\text{-}SUM}\in\mathrm{NP}\)。</p>
<p><b>多项式时间归约与 NP 完全</b>：\(A\le_P B\iff\) 存在多项式时间可计算函数 \(f\) 使 \(x\in A\iff f(x)\in B\)。性质：\(A\le_P B\) 且 \(B\in\mathrm{P}\implies A\in\mathrm{P}\)；\(B\in\mathrm{NP}\implies A\in\mathrm{NP}\)。\(L\) 是 <b>\(\mathrm{NP}\)-hard</b> \(\iff\forall A\in\mathrm{NP},A\le_P L\)；\(L\) 是 <b>\(\mathrm{NP}\)-complete</b> \(\iff L\in\mathrm{NP}\) 且 \(L\) 是 \(\mathrm{NP}\)-hard。若任一 \(\mathrm{NP}\)-hard 语言属于 \(\mathrm{P}\)，则 \(\mathrm{P}=\mathrm{NP}\)。</p>

<h3>6. Practice Midterm 样卷与 PS5 高频考点速记</h3>
<p><b>样卷多选陷阱</b>：(1) 任何单个语言 \(A\subseteq\{0,1\}^*\)（含 \(A_{\mathrm{TM}}\)）和全体图灵机编码集都是<b>可数集</b>；全体<b>有限语言</b>的集合也是<b>可数集</b>；唯独全体语言 \(\mathcal{P}(\{0,1\}^*)\) 不可数。(2) 仅 \(\overline{L}\) 可判定能推出 \(L\) 可判定；\(L\subseteq A\)、\(A\le_m L\)（方向反了！应为 \(L\le_m A\)）、\(L=A\cup B\)（仅一方可判定）均不能推出 \(L\) 可判定。(3) \(T_B(n)=\Theta(n^2),T_C(n)=\Theta(n\log n)\) 表示<b>最坏</b>时间：不能推出 \(C\) 在所有输入上比 \(B\) 快，但对充分大的 \(n\)，在使 \(B\) 达到最坏时间 \(\Theta(n^2)\) 的那个输入 \(x_n\) 上 \(C\) 必比 \(B\) 快。</p>
<p><b>样卷简答与大题</b>：(1) 全体双射 \(f:\mathbb{N}\to\mathbb{N}\) <b>不可数</b>（将 \(\mathbb{N}\) 划分为配对块 \(\{2k,2k+1\}\)，在每块上独立取恒等或对换即可嵌入 \(\{0,1\}^{\mathbb{N}}\)）。(2) 每次固定跳 \(\pm 2\) 格的 TM <b>不能</b>判定所有可判定语言（磁头永远位于奇数坐标格 \(1+2k\)，看不见偶数位字符）。(3) \(A,B\) 可识别 \(\implies A\cup B\) 可识别：必须<b>按步交错模拟</b> \(M_A(x),M_B(x)\)，任一接受即接受。(4) \(\mathrm{COMPOSITE}\in\mathrm{NP}\)：证书为非平凡因子对 \((a,b)\)（\(1&lt;a,b&lt;N\)），验证机在 \(O(n^2)\) 内算乘法比对 \(ab=N\)。(5) \(L_{\mathrm{even\text{-}acc}}\) 不可识别：构造 \(N(x)\) 在 \(|x|\) 为偶数时直接接受，\(|x|\) 为奇数时模拟 \(M(w)\) 接受后才接受（归约 \(\overline{A_{\mathrm{TM}}}\le_m L_{\mathrm{even\text{-}acc}}\)）。(6) \(L=\{\langle M\rangle\mid\exists n\ge 0,0^n1^n\in L(M)\}\)：<b>可识别</b>（按阶段 \(s\) 交错模拟 \(n\le s\) 的 \(M(0^n1^n)\) 共 \(s\) 步）但<b>不可判定</b>（\(A_{\mathrm{TM}}\le_m L\) 或莱斯定理）。</p>
<p><b>PS5 核心结论</b>：(1) 单带 TM 隔一抹一判定 \(|w|=2^k\) 最坏耗时 \(\Theta(n\log n)\)；(2) \(\mathrm{INDEPENDENT\text{-}SET}\le_P\mathrm{CLIQUE}\)：输出补图 \(\langle\overline{G},k\rangle\)（\(k\) 不变，非自环边取反）。</p>
</div>
`,
  tm: [
    {
      id: "parity",
      name: "PARITY（奇偶校验机）",
      source: "Lecture 3 & Lecture 4",
      description: "判定输入串中 1 的个数是否为奇数：扫描时在 q_even 与 q_odd 之间翻转，遇到右端空白 ⊔ 时根据奇偶状态进入 q_acc 或 q_rej。",
      states: ["q0", "q_even", "q_odd", "q_acc", "q_rej"],
      startState: "q0",
      acceptState: "q_acc",
      rejectState: "q_rej",
      defaultInput: "01101",
      transitions: [
        { from: "q0", read: "⊔", to: "q_even", write: "⊔", move: "R", comment: "从左端起始空白格右移进入输入首字符，初始含偶数个 1" },
        { from: "q_even", read: "0", to: "q_even", write: "0", move: "R", comment: "读到 0，1 的奇偶性不变（仍为偶）" },
        { from: "q_even", read: "1", to: "q_odd", write: "1", move: "R", comment: "读到 1，1 的个数由偶变奇" },
        { from: "q_even", read: "⊔", to: "q_rej", write: "⊔", move: "L", comment: "到达右端空白，共有偶数个 1，拒绝" },
        { from: "q_odd", read: "0", to: "q_odd", write: "0", move: "R", comment: "读到 0，1 的奇偶性不变（仍为奇）" },
        { from: "q_odd", read: "1", to: "q_even", write: "1", move: "R", comment: "读到 1，1 的个数由奇变偶" },
        { from: "q_odd", read: "⊔", to: "q_acc", write: "⊔", move: "L", comment: "到达右端空白，共有奇数个 1，接受" }
      ]
    },
    {
      id: "contains01",
      name: "含子串 01",
      source: "Lecture 3 示例",
      description: "判定输入串是否包含子串 01：先找到一个 0 进入 q_saw0，若紧接着读到 1 则立即接受。",
      states: ["q0", "q_scan", "q_saw0", "q_acc", "q_rej"],
      startState: "q0",
      acceptState: "q_acc",
      rejectState: "q_rej",
      defaultInput: "11010",
      transitions: [
        { from: "q0", read: "⊔", to: "q_scan", write: "⊔", move: "R", comment: "离开左端空白格，开始向右扫描" },
        { from: "q_scan", read: "1", to: "q_scan", write: "1", move: "R", comment: "读到 1，尚未匹配到 0，继续扫描" },
        { from: "q_scan", read: "0", to: "q_saw0", write: "0", move: "R", comment: "读到 0，记录已见到前缀 0" },
        { from: "q_scan", read: "⊔", to: "q_rej", write: "⊔", move: "L", comment: "扫描结束未见 01，拒绝" },
        { from: "q_saw0", read: "0", to: "q_saw0", write: "0", move: "R", comment: "连续读到 0，当前字符仍可作为 01 的前缀 0" },
        { from: "q_saw0", read: "1", to: "q_acc", write: "1", move: "R", comment: "在 0 后紧跟 1，成功匹配 01，接受" },
        { from: "q_saw0", read: "⊔", to: "q_rej", write: "⊔", move: "L", comment: "输入结束仍未拼出 01，拒绝" }
      ]
    },
    {
      id: "ends1",
      name: "以 1 结尾",
      source: "Lecture 3 练习",
      description: "判定输入串最后一个字符是否为 1：扫描全串并用状态记住最近一次读到的字符，遇到右端空白 ⊔ 时揭晓结果。",
      states: ["q0", "q_last0", "q_last1", "q_acc", "q_rej"],
      startState: "q0",
      acceptState: "q_acc",
      rejectState: "q_rej",
      defaultInput: "0101",
      transitions: [
        { from: "q0", read: "⊔", to: "q_last0", write: "⊔", move: "R", comment: "离开左端空白，空串默认不以 1 结尾" },
        { from: "q_last0", read: "0", to: "q_last0", write: "0", move: "R", comment: "最近读到的字符为 0" },
        { from: "q_last0", read: "1", to: "q_last1", write: "1", move: "R", comment: "最近读到的字符更新为 1" },
        { from: "q_last0", read: "⊔", to: "q_rej", write: "⊔", move: "L", comment: "到达右端空白，末位不是 1（或为空串），拒绝" },
        { from: "q_last1", read: "0", to: "q_last0", write: "0", move: "R", comment: "最近读到的字符更新为 0" },
        { from: "q_last1", read: "1", to: "q_last1", write: "1", move: "R", comment: "最近读到的字符仍为 1" },
        { from: "q_last1", read: "⊔", to: "q_acc", write: "⊔", move: "L", comment: "到达右端空白，末位是 1，接受" }
      ]
    },
    {
      id: "first-eq-last",
      name: "首尾字符相同（长度 ≥ 2）",
      source: "Problem Set 1 §2.2(a)",
      description: "判定长度至少为 2 的二进制串首字符与尾字符是否相同：用状态记住首字符（q_first0 / q_first1），并区分是否已读到至少第二个字符。",
      states: ["q0", "q_start", "q_1char0", "q_1char1", "q_f0_end0", "q_f0_end1", "q_f1_end0", "q_f1_end1", "q_acc", "q_rej"],
      startState: "q0",
      acceptState: "q_acc",
      rejectState: "q_rej",
      defaultInput: "1011",
      transitions: [
        { from: "q0", read: "⊔", to: "q_start", write: "⊔", move: "R", comment: "离开左端空白格，准备读取首字符" },
        { from: "q_start", read: "⊔", to: "q_rej", write: "⊔", move: "L", comment: "空串长度 < 2，直接拒绝" },
        { from: "q_start", read: "0", to: "q_1char0", write: "0", move: "R", comment: "记录首字符为 0（当前长度 1）" },
        { from: "q_start", read: "1", to: "q_1char1", write: "1", move: "R", comment: "记录首字符为 1（当前长度 1）" },
        { from: "q_1char0", read: "⊔", to: "q_rej", write: "⊔", move: "L", comment: "单字符串长度 < 2，拒绝" },
        { from: "q_1char0", read: "0", to: "q_f0_end0", write: "0", move: "R", comment: "首字符 0，当前末字符 0（长度 ≥ 2）" },
        { from: "q_1char0", read: "1", to: "q_f0_end1", write: "1", move: "R", comment: "首字符 0，当前末字符 1（长度 ≥ 2）" },
        { from: "q_1char1", read: "⊔", to: "q_rej", write: "⊔", move: "L", comment: "单字符串长度 < 2，拒绝" },
        { from: "q_1char1", read: "0", to: "q_f1_end0", write: "0", move: "R", comment: "首字符 1，当前末字符 0（长度 ≥ 2）" },
        { from: "q_1char1", read: "1", to: "q_f1_end1", write: "1", move: "R", comment: "首字符 1，当前末字符 1（长度 ≥ 2）" },
        { from: "q_f0_end0", read: "0", to: "q_f0_end0", write: "0", move: "R", comment: "首 0，最新字符 0" },
        { from: "q_f0_end0", read: "1", to: "q_f0_end1", write: "1", move: "R", comment: "首 0，最新字符 1" },
        { from: "q_f0_end0", read: "⊔", to: "q_acc", write: "⊔", move: "L", comment: "首 0 且尾 0，接受" },
        { from: "q_f0_end1", read: "0", to: "q_f0_end0", write: "0", move: "R", comment: "首 0，最新字符 0" },
        { from: "q_f0_end1", read: "1", to: "q_f0_end1", write: "1", move: "R", comment: "首 0，最新字符 1" },
        { from: "q_f0_end1", read: "⊔", to: "q_rej", write: "⊔", move: "L", comment: "首 0 但尾 1，拒绝" },
        { from: "q_f1_end0", read: "0", to: "q_f1_end0", write: "0", move: "R", comment: "首 1，最新字符 0" },
        { from: "q_f1_end0", read: "1", to: "q_f1_end1", write: "1", move: "R", comment: "首 1，最新字符 1" },
        { from: "q_f1_end0", read: "⊔", to: "q_rej", write: "⊔", move: "L", comment: "首 1 但尾 0，拒绝" },
        { from: "q_f1_end1", read: "0", to: "q_f1_end0", write: "0", move: "R", comment: "首 1，最新字符 0" },
        { from: "q_f1_end1", read: "1", to: "q_f1_end1", write: "1", move: "R", comment: "首 1，最新字符 1" },
        { from: "q_f1_end1", read: "⊔", to: "q_acc", write: "⊔", move: "L", comment: "首 1 且尾 1，接受" }
      ]
    },
    {
      id: "mod3",
      name: "二进制 3 的倍数",
      source: "Problem Set 1 §2.2(c)",
      description: "判定非空二进制串表示的整数是否能被 3 整除：利用递推 val(wb) = 2·val(w) + b (mod 3) 维护余数状态 r0, r1, r2。",
      states: ["q0", "q_start", "r0", "r1", "r2", "q_acc", "q_rej"],
      startState: "q0",
      acceptState: "q_acc",
      rejectState: "q_rej",
      defaultInput: "110",
      transitions: [
        { from: "q0", read: "⊔", to: "q_start", write: "⊔", move: "R", comment: "离开左端空白格" },
        { from: "q_start", read: "⊔", to: "q_rej", write: "⊔", move: "L", comment: "空串不代表合法二进制数，拒绝" },
        { from: "q_start", read: "0", to: "r0", write: "0", move: "R", comment: "首字符 0，当前值 ≡ 0 (mod 3)" },
        { from: "q_start", read: "1", to: "r1", write: "1", move: "R", comment: "首字符 1，当前值 ≡ 1 (mod 3)" },
        { from: "r0", read: "0", to: "r0", write: "0", move: "R", comment: "(2×0 + 0) mod 3 = 0" },
        { from: "r0", read: "1", to: "r1", write: "1", move: "R", comment: "(2×0 + 1) mod 3 = 1" },
        { from: "r0", read: "⊔", to: "q_acc", write: "⊔", move: "L", comment: "扫描结束且余数为 0，接受" },
        { from: "r1", read: "0", to: "r2", write: "0", move: "R", comment: "(2×1 + 0) mod 3 = 2" },
        { from: "r1", read: "1", to: "r0", write: "1", move: "R", comment: "(2×1 + 1) mod 3 = 0" },
        { from: "r1", read: "⊔", to: "q_rej", write: "⊔", move: "L", comment: "扫描结束且余数为 1 ≠ 0，拒绝" },
        { from: "r2", read: "0", to: "r1", write: "0", move: "R", comment: "(2×2 + 0) mod 3 = 1" },
        { from: "r2", read: "1", to: "r2", write: "1", move: "R", comment: "(2×2 + 1) mod 3 = 2" },
        { from: "r2", read: "⊔", to: "q_rej", write: "⊔", move: "L", comment: "扫描结束且余数为 2 ≠ 0，拒绝" }
      ]
    },
    {
      id: "loop-recognizer",
      name: "会死循环的识别机（Recognizer vs Decider）",
      source: "Lecture 3 对比演示",
      description: "识别语言 L = {w | w 含至少一个 1}：若输入含 1 则立刻停机接受；若输入不含 1（如 000），到达右端后进入 q_loop 左右摇摆死循环。它识别 L 但不判定 L。",
      states: ["q0", "q_scan", "q_loop", "q_acc", "q_rej"],
      startState: "q0",
      acceptState: "q_acc",
      rejectState: "q_rej",
      defaultInput: "00",
      transitions: [
        { from: "q0", read: "⊔", to: "q_scan", write: "⊔", move: "R", comment: "离开左端空白格，开始向右寻找 1" },
        { from: "q_scan", read: "0", to: "q_scan", write: "0", move: "R", comment: "读到 0，继续向右寻找 1" },
        { from: "q_scan", read: "1", to: "q_acc", write: "1", move: "R", comment: "找到 1，立即停机接受" },
        { from: "q_scan", read: "⊔", to: "q_loop", write: "⊔", move: "L", comment: "到达右端仍未见到 1，转入死循环状态 q_loop" },
        { from: "q_loop", read: "0", to: "q_scan", write: "0", move: "R", comment: "在最右端字符与空白格之间往返无限循环" },
        { from: "q_loop", read: "⊔", to: "q_scan", write: "⊔", move: "R", comment: "空串情形下在相邻空白格之间往返无限循环" }
      ]
    }
  ]
});
