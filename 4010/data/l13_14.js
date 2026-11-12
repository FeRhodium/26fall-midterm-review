Review.add({
  id: "l13_14",
  n: 13,
  group: "quiz3",
  short: "L13–14 · 布尔电路·公式与 PSIZE",
  title: "Lecture 13–14 · 首个 NP 完全语言、布尔电路与公式、Shannon 上下界与 PSIZE 非一致性",
  meta: "A_TM^cert · 电路 Size/Depth · 布尔公式叶数 · CNF · CVP ∈ P · CIRCUIT-SAT ∈ NP · Shannon 定理 · PSIZE 包含不可判定语言",
  sources: [
    { href: "materials/CSC4010_Lecture13(Annotated).pdf", label: "Lecture 13 (Annotated)" },
    { href: "materials/CSC4010_Lecture14(Annotated).pdf", label: "Lecture 14 (Annotated)" }
  ],
  html: String.raw`
<p class="lede">Lecture 13–14 从图灵机转向基于逻辑门网络的计算模型——<b>布尔电路（Boolean Circuits）</b>与<b>布尔公式（Boolean Formulas）</b>。本部分既是证明 Cook–Levin 定理（\(\mathrm{SAT}\) 为 \(\mathrm{NP}\)-complete）的核心跳板，也是 Problem Set 6 与 Quiz 3 的绝对重心。</p>

<h2>1. 第一个显式 \(\mathrm{NP}\)-Complete 语言：\(A_{\mathrm{TM}}^{\mathrm{cert}}\)（L13 Slides 8–9）</h2>
<p>在引入电路之前，我们可以直接利用验证机的通用模拟构造出第一个 \(\mathrm{NP}\) 完全语言：</p>
<div class="formula">\[
  A_{\mathrm{TM}}^{\mathrm{cert}} = \Bigl\{\langle M \rangle x 0^m 1^t \;\Big|\; \exists c \in \{0,1\}^*,\; |c| \le m \text{ 使得双带验证机 } M \text{ 在 } t \text{ 步内接受 } (x, c)\Bigr\}.
\]</div>
<p><b>注意为什么 \(m\) 和 \(t\) 必须用一元编码（unary，即 \(0^m 1^t\)）给出？</b>因为输入总长度 \(N = |\langle M \rangle x 0^m 1^t| \ge m + t\)，只有当 \(m, t\) 以一元形式写入输入时，“证书长度 \(\le m\)”与“模拟 \(t\) 步”才是关于输入长度 \(N\) 的<b>多项式</b>（若写成二进制，\(t\) 可达 \(2^N\)，模拟将耗时指数级）！</p>
<ul>
  <li><b>证明 \(A_{\mathrm{TM}}^{\mathrm{cert}} \in \mathrm{NP}\)</b>：验证机 \(V\) 在常规带读入 \(\langle M \rangle x 0^m 1^t\)，在证书带读入 \(c\)。检查 \(|c| \le m\)，然后模拟 \(M(x, c)\) 至多 \(t\) 步。每步模拟耗时 \(\mathrm{poly}(|\langle M\rangle| + |x| + m + t)\)，总时间关于输入长度 \(N\) 为多项式，且满足完备性与可靠性。</li>
  <li><b>证明 \(A_{\mathrm{TM}}^{\mathrm{cert}}\) 是 \(\mathrm{NP}\)-hard</b>：任取 \(L \in \mathrm{NP}\)，设其多项式时间验证机为 \(V_L\)，证书长度上界为多项式 \(p(n)\)，运行时间上界为多项式 \(q(n)\)。构造归约函数：
  \[
    f(x) = \langle V_L \rangle x 0^{p(|x|)} 1^{q(|x|)}.
  \]
  由于 \(V_L\) 是固定机器（\(|\langle V_L \rangle| = O(1)\)），写出 \(p(|x|)\) 个 \(0\) 和 \(q(|x|)\) 个 \(1\) 仅需 \(O(p(|x|) + q(|x|)) = \mathrm{poly}(|x|)\) 时间，且 \(x \in L \iff \exists c\ (|c|\le p(|x|))\text{ 使 }V_L(x,c)\text{ 在 }q(|x|)\text{ 步内接受} \iff f(x) \in A_{\mathrm{TM}}^{\mathrm{cert}}\)。故 \(L \le_P A_{\mathrm{TM}}^{\mathrm{cert}}\)。</li>
</ul>

<h2>2. 布尔电路（Boolean Circuits）：定义与复杂性度量（必考约定！）</h2>
<div class="callout must">
  <strong>定义 14.1（布尔电路及其 Size 与 Depth，L13 Slides 13–14 &amp; PS6 Recap）</strong>
  <ul>
    <li><b>结构（有向无环图 DAG）</b>：一个 \(n\) 输入布尔电路包含 \(n\) 个输入位 \(x_1, \dots, x_n\) 和一系列逻辑门 \(g_1, g_2, \dots, g_m\)。门分为三类：<code>NOT</code>（\(\neg\)，扇入为 1）、<code>AND</code>（\(\land\)，<b>无限制扇入 unrestricted fan-in</b>）、<code>OR</code>（\(\lor\)，<b>无限制扇入 unrestricted fan-in</b>）。</li>
    <li><b>无环拓扑条件</b>：第 \(k\) 个门 \(g_k\) 的输入只能来自输入位 \(x_1, \dots, x_n\) 或编号更小的门 \(g_1, \dots, g_{k-1}\)（这保证了电路是无向有向环的 DAG）。电路的最终输出为最后一个门 \(g_m\) 的输出，计算一个布尔函数 \(f: \{0,1\}^n \to \{0,1\}\)。允许扇出（fan-out）无限制：同一个门的输出线可以喂给后续任意多个门复用。</li>
    <li><b>大小（Size）——只数 AND 和 OR 门！</b>本课程与 PS6 明确规定：电路的 <b>Size</b> 定义为电路中 <b><code>AND</code> 门与 <code>OR</code> 门的总数</b>（<b>不计入 <code>NOT</code> 门和输入节点！</b>）。</li>
    <li><b>深度（Depth）</b>：从任意输入位到输出门的最长有向路径上经过的 <b><code>AND</code> 门与 <code>OR</code> 门的个数</b>（同样不计 <code>NOT</code> 门）。</li>
  </ul>
</div>

<h3>经典函数的电路构造示例（L13 Slides 16–17）</h3>
<ul>
  <li><b>2 位异或 \(a \oplus b\)</b>：写成 \((a \land \neg b) \lor (\neg a \land b)\)，需要 \(2\) 个 <code>AND</code> 门和 \(1\) 个 <code>OR</code> 门（Size \(= 3\)，Depth \(= 2\)）。</li>
  <li><b>\(n\) 位奇偶校验 \(\oplus_n(x_1, \dots, x_n) = \sum_{i=1}^n x_i \bmod 2\)</b>：将 \(n-1\) 个二元 XOR 子电路串联（或排成平衡二叉树）。因为<b>电路允许复用中间门的输出</b>（对子电路输出 \(A, B\) 无需重复计算两遍），每个二元 XOR 只需 \(3\) 个 AND/OR 门，故总 <b>Size \(= 3(n-1) = \Theta(n)\)</b>！若排成平衡二叉树，<b>Depth \(= 2\lceil\log_2 n\rceil = \Theta(\log n)\)</b>。</li>
  <li><b>\(n\) 位回文串 \(\mathrm{PALINDROME}_n\)</b>：\(x_1\dots x_n\) 是回文串 \(\iff \bigwedge_{i=1}^{\lfloor n/2 \rfloor} (x_i == x_{n-i+1})\)，其中相等判断 \((a == b) \equiv (a \land b) \lor (\neg a \land \neg b)\)（或 \(\neg((a\land\neg b)\lor(\neg a\land b))\)）。共 \(\lfloor n/2 \rfloor\) 对比较，最后接一个大 <code>AND</code> 门，总 Size \(= O(n)\)，Depth \(= O(1)\)。</li>
</ul>

<h2>3. 布尔公式（Boolean Formulas）与合取范式（CNF）</h2>
<div class="callout must">
  <strong>定义 14.2（布尔公式与叶数复杂度 \(L(F)\)，L13 Slides 20–23 &amp; PS6 Recap）</strong>
  <ul>
    <li><b>布尔公式 = 扇出至多为 1 的电路（树结构）</b>：如果一个布尔电路中<b>每个门的输出至多只能作为后续 1 个门的输入</b>（bounded fan-out \(\le 1\)，不允许共享中间计算结果），则称其为<b>布尔公式</b>。</li>
    <li><b>有界扇入树表示与叶数度量</b>：当每个 \(\land, \lor\) 门限制为二元扇入（fan-in \(= 2\)）且将 \(\neg\) 门通过 De Morgan 定律推到叶子层后，公式是一棵有根二叉树，内部节点为二元 \(\land, \lor\)，叶子为文字（literals）\(x_i\) 或 \(\neg x_i\) 的若干副本。<b>布尔公式的复杂度（Formula Size，记作 \(L(F)\)）定义为这棵树中叶子（leaves）的总数</b>（对于二元满树，内部 \(\land/\lor\) 门数恰好等于 \(L(F) - 1\)）。</li>
    <li><b>合取范式（CNF）</b>：文字（literal）是 \(x_i\) 或 \(\neg x_i\)；<b>子句（clause）</b>是若干文字的析取（OR）；<b>CNF 公式</b>是若干子句的合取（AND of ORs）。<b>定理</b>：任意布尔函数 \(f: \{0,1\}^n \to \{0,1\}\) 都存在一个等价的 CNF 公式，至多含 \(2^n\) 个子句，每个子句恰含 \(n\) 个文字（对真值表中每一个使 \(f(a)=0\) 的赋值行 \(a=(a_1,\dots,a_n)\)，写出唯一在该行取 \(0\) 的子句 \(C_a = \ell_1 \lor \cdots \lor \ell_n\)，其中 \(a_i=1\) 时取 \(\neg x_i\)、\(a_i=0\) 时取 \(x_i\)，再把所有 \(f(a)=0\) 的行合取起来即可）。</li>
  </ul>
</div>

<h2>4. Shannon 上下界定理：几乎所有布尔函数都需要指数级电路</h2>
<ol>
  <li><b>Shannon 上界定理（L13 Slide 18）</b>：对<b>每一个</b>布尔函数 \(f: \{0,1\}^n \to \{0,1\}\)，都存在一个 Size <b>至多为 \(2^n + 1\)</b> 的布尔电路计算 \(f\)。<br>
  <em>证明（DNF 真值表构造）</em>：列出 \(f\) 的 \(2^n\) 行真值表。对每一个满足 \(f(a) = 1\) 的输入行 \(a \in \{0,1\}^n\)，用一个 \(n\) 扇入的 <code>AND</code> 门识别该行：\(g_a(x) = \bigwedge_{i: a_i=1} x_i \land \bigwedge_{i: a_i=0} \neg x_i\)。真值表中至多有 \(2^n\) 行取 \(1\)，故至多需要 \(2^n\) 个 <code>AND</code> 门；最后用 <b>\(1\) 个大 <code>OR</code> 门</b>将所有这些 <code>AND</code> 门的输出析取起来（若 \(f\equiv 0\) 则用 \(x_1 \land \neg x_1\)，仅 1 个门）。由于 <code>NOT</code> 门不计入 Size，总门数 \(\le 2^n + 1\)！<br>
  <b>推论</b>：<b>任意语言 \(L \subseteq \{0,1\}^*\)（哪怕是不可判定语言！）</b>都存在一族布尔电路 \(\{C_n\}_{n\ge 0}\) 计算它（每个长度 \(n\) 单独取计算 \(L \cap \{0,1\}^n\) 的电路 \(C_n\)）。</li>
  <li><b>Shannon 下界定理（计数论证，L14 Slide 19 &amp; PS6 Q3）</b>：对每个 \(n \ge 4\)，<b>存在</b>布尔函数 \(f: \{0,1\}^n \to \{0,1\}\)，它<b>不能</b>被任何 Size \(\le \frac{2^{n/2}}{4}\) 的布尔电路计算！<br>
  <em>核心思想</em>：\(n\) 元布尔函数共有 <b>\(2^{2^n}\)</b> 个（每张真值表有 \(2^n\) 行输出位），而 Size \(\le s = \lfloor 2^{n/2}/4 \rfloor\) 的不同布尔电路总数仅约为 \(2^{O(s^2 + ns)} \ll 2^{2^n}\)（严格不等式推导见 PS6 Q3 精讲）。函数比小电路多得多，由鸽巢原理必存在无法用小电路计算的函数！（注：找出一个属于 \(\mathrm{NP}\) 的<b>显式</b>函数证明其需要超多项式甚至超线性电路下界，至今仍是理论计算机科学悬而未决的公开难题！）</li>
</ol>

<h2>5. 电路作为数据：\(\mathrm{CVP} \in \mathrm{P}\) 与 \(\mathrm{CIRCUIT\text{-}SAT} \in \mathrm{NP}\)（L14 Slides 15–17）</h2>
<p>就像图灵机可编码为串 \(\langle M \rangle\) 一样，含 \(n\) 个输入和 \(m\) 个门的电路 \(C\) 可编码为有向无环图邻接矩阵 + 节点类型标签的二进制串 \(\langle C \rangle\)：</p>
<ul>
  <li><b>电路求值问题（Circuit Value Problem, \(\mathrm{CVP}\)）</b>：
  \[
    \mathrm{CVP} = \bigl\{\langle C, x \rangle \;\big|\; C \text{ 是 } n \text{ 输入布尔电路},\; x \in \{0,1\}^n,\; C(x) = 1\bigr\}.
  \]
  <b>引理：\(\mathrm{CVP} \in \mathrm{P}\)</b>。<em>证明</em>：给定 \(\langle C, x \rangle\)，先将所有输入节点标上 \(x_i\) 的值；由于 \(C\) 是 DAG，循环扫描未求值的门 \(g\)，一旦喂给 \(g\) 的所有前驱节点均已标值，就按 \(g\) 的逻辑类型（AND/OR/NOT）算出 \(g\) 的输出值并标记。至多 \(m\) 轮扫描即可算出输出门的值，每轮耗时 \(O((n+m)^2)\)，总时间为 \(\mathrm{poly}(|\langle C, x\rangle|)\)。</li>
  <li><b>电路可满足性问题（Circuit Satisfiability, \(\mathrm{CIRCUIT\text{-}SAT}\)）</b>：
  \[
    \mathrm{CIRCUIT\text{-}SAT} = \bigl\{\langle C \rangle \;\big|\; C \text{ 是布尔电路，且 }\exists x \in \{0,1\}^n \text{ 使得 } C(x) = 1\bigr\}.
  \]
  <b>引理：\(\mathrm{CIRCUIT\text{-}SAT} \in \mathrm{NP}\)</b>。<em>证明</em>：输入为 \(\langle C \rangle\)，取证书 \(c = x \in \{0,1\}^n\)（显然 \(|x| = n \le |\langle C \rangle|\) 多项式有界）；验证机调用上述 \(\mathrm{CVP}\) 的多项式时间算法计算 \(C(x)\)，若为 \(1\) 则接受，否则拒绝。</li>
</ul>

<h2>6. 电路复杂性类 \(\mathrm{PSIZE}\) 与非一致性（Non-uniformity，L14 Slides 20–23）</h2>
<div class="callout must">
  <strong>定义 14.3（电路复杂性 \(S(n)\)、\(\mathrm{SIZE}(S)\) 与 \(\mathrm{PSIZE}\)）</strong>
  <ul>
    <li>对语言 \(Y \subseteq \{0,1\}^*\)，记第 \(n\) 层切片为 \(Y_n = Y \cap \{0,1\}^n\)（可看作布尔函数 \(Y_n: \{0,1\}^n \to \{0,1\}\)）。</li>
    <li>\(Y\) 的<b>电路复杂性</b> \(S(n)\) 定义为计算 \(Y_n\) 的<b>最小布尔电路的 Size</b>。</li>
    <li>\(\mathrm{SIZE}(S) = \{Y \subseteq \{0,1\}^* : Y \text{ 的电路复杂性为 } O(S(n))\}\)。</li>
    <li>\(\mathrm{PSIZE} = \bigcup_{k=1}^\infty \mathrm{SIZE}(n^k) = \{Y \subseteq \{0,1\}^* : Y \text{ 可由多项式大小的电路族 } \{C_n\}_{n\ge 0} \text{ 计算}\}\)（文献中也常记作 \(\mathrm{P/poly}\)）。</li>
  </ul>
</div>

<div class="callout trap">
  <strong>震撼定理（L14 Slide 21）：存在不可判定语言属于 \(\mathrm{SIZE}(n) \subseteq \mathrm{PSIZE}\)！（故 \(\mathrm{P} \subsetneq \mathrm{PSIZE}\)）</strong>
  <p><b>构造与证明</b>：将所有图灵机按编码排列为 \(M_1, M_2, \dots, M_n, \dots\)，定义<b>一元（unary）停机语言</b>：</p>
  <div class="formula">\[
    L_{\mathrm{unary}} = \bigl\{1^n \;\big|\; M_n \text{ 在空输入 } \varepsilon \text{ 上停机}\bigr\}.
  \]</div>
  <ol>
    <li><b>\(L_{\mathrm{unary}}\) 是不可判定的</b>：若 \(L_{\mathrm{unary}}\) 可判定，给定任意图灵机 \(\langle M \rangle\)，算出它在枚举中的编号 \(n\) 并查询 \(1^n \in L_{\mathrm{unary}}\)，就能判定 \(\varepsilon\)-停机问题，矛盾！</li>
    <li><b>但 \(L_{\mathrm{unary}}\) 的电路复杂性仅为 \(O(n)\)（甚至在无限制扇入下为 \(O(1)\)）！</b>为什么？因为对每个固定的输入长度 \(n\)，长度为 \(n\) 的全 \(1\) 串只有唯一一个 \(1^n\)：
      <ul>
        <li>如果 \(1^n \in L_{\mathrm{unary}}\)（客观上要么真要么假），我们就取电路 \(C_n(x_1,\dots,x_n) = x_1 \land x_2 \land \cdots \land x_n\)（仅当输入全为 \(1\) 时输出 \(1\)，二元扇入下至多 \(n-1 = O(n)\) 个门，无限制扇入下仅 \(1\) 个门）；</li>
        <li>如果 \(1^n \notin L_{\mathrm{unary}}\)，我们就取恒零电路 \(C_n(x_1,\dots,x_n) = x_1 \land \neg x_1\)（恒输出 \(0\)，仅 \(1\) 个门）！</li>
      </ul>
    </li>
    <li><b>本质剖析（Non-uniformity 非一致性 = “作弊”）</b>：图灵机是<b>一致模型（Uniform Model）</b>——必须用<b>同一台有限大小的机器</b>处理所有长度的输入；而电路族是<b>非一致模型（Non-uniform Model）</b>——允许对每个长度 \(n\) 挑选一个完全不同的电路 \(C_n\)，并且<b>不要求存在算法能根据 \(n\) 构造出 \(C_n\)</b>！这就把不可判定的停机答案“硬编码（hardcode）”进了无穷序列 \(\{C_n\}\) 的选择里。结合 Lecture 16 的 \(\mathrm{P} \subseteq \mathrm{PSIZE}\)，即得严格包含 \(\mathrm{P} \subsetneq \mathrm{PSIZE}\)。</li>
  </ol>
</div>
`,
  questions: [
    {
      id: "l1314-q1",
      kind: "single",
      tag: "slide",
      q: String.raw`在 Lecture 13 构造第一个 \(\mathrm{NP}\)-complete 语言 \(A_{\mathrm{TM}}^{\mathrm{cert}} = \{\langle M \rangle x 0^m 1^t \mid \exists c\ (|c|\le m)\text{ 使 }M\text{ 在 }t\text{ 步内接受 }(x,c)\}\) 时，为什么要把证书长度上界 \(m\) 和步数上界 \(t\) 写成一元串 \(0^m 1^t\) 而不是二进制数？`,
      choices: [
        ["a", String.raw`因为验证机模拟 \(M\) 运行 \(t\) 步需要 \(\mathrm{poly}(t)\) 时间；只有用一元编码使输入长度 \(\ge m + t\)，模拟时间和证书长度才关于输入总长度是多项式的`],
        ["b", String.raw`因为图灵机无法读取二进制编码的整数`],
        ["c", String.raw`因为写成二进制会使 \(A_{\mathrm{TM}}^{\mathrm{cert}}\) 变成不可判定语言`],
        ["d", String.raw`因为一元编码能把 \(A_{\mathrm{TM}}^{\mathrm{cert}}\) 放进复杂性类 \(\mathrm{P}\)`]
      ],
      answer: ["a"],
      why: String.raw`若 \(t\) 用二进制编码，仅需 \(\log_2 t\) 位即可表示指数大的步数 \(t = 2^k\)，此时模拟 \(t\) 步关于输入长度是指数时间，将导致该语言变成 \(\mathrm{NEXP}\)-complete 而不再属于 \(\mathrm{NP}\)。`
    },
    {
      id: "l1314-q2",
      kind: "single",
      tag: "slide",
      q: String.raw`按照本课程（Lecture 13–14 与 PS6 Recap）的形式化定义，布尔电路（Boolean circuit）的 Size 以及布尔公式（Boolean formula）的 Size 分别统计什么？`,
      choices: [
        ["a", String.raw`电路的 Size 只统计 <code>AND</code> 门和 <code>OR</code> 门的总数（不计 <code>NOT</code> 门）；公式的 Size 统计其树表示中叶子节点（leaves）的总数`],
        ["b", String.raw`电路和公式的 Size 都统计所有 <code>AND</code>、<code>OR</code>、<code>NOT</code> 门加输入变量的总数`],
        ["c", String.raw`电路的 Size 统计输入导线数；公式的 Size 统计树的深度`],
        ["d", String.raw`电路的 Size 只统计 <code>NOT</code> 门；公式的 Size 统计子句个数`]
      ],
      answer: ["a"],
      why: String.raw`务必牢记本课约定：布尔电路的 Size 与 Depth 均只计入 AND 和 OR 门（NOT 门免费）；布尔公式要求每个门扇出 \(\le 1\)，其复杂度 \(L(F)\) 定义为公式树表示中的叶子数。`
    },
    {
      id: "l1314-q3",
      kind: "single",
      tag: "slide",
      q: String.raw`为什么存在不可判定语言 \(L_{\mathrm{unary}} = \{1^n \mid M_n \text{ 在 }\varepsilon\text{ 上停机}\}\) 属于 \(\mathrm{PSIZE}\)，从而证明 \(\mathrm{P} \subsetneq \mathrm{PSIZE}\)？`,
      choices: [
        ["a", String.raw`因为 \(\mathrm{PSIZE}\) 是非一致（non-uniform）模型，允许为每个输入长度 \(n\) 单独指定一个电路 \(C_n\) 而不要求存在构造 \(C_n\) 的算法；在固定长度 \(n\) 上只需硬编码 \(1^n\) 这一个串是否在语言中（\(O(n)\) 门即可）`],
        ["b", String.raw`因为布尔电路可以在有限步内直接解出任意图灵机的停机问题`],
        ["c", String.raw`因为所有不可判定语言（包括 \(A_{\mathrm{TM}}\)）都属于 \(\mathrm{PSIZE}\)`],
        ["d", String.raw`因为 \(\mathrm{P}\) 中也包含不可判定语言`]
      ],
      answer: ["a"],
      why: String.raw`非一致性允许对每个 \(n\) 独立挑选 \(C_n\)（若 \(1^n\in L\) 取 \(x_1\land\cdots\land x_n\)，否则取恒 0），无需用单一算法生成 \(\{C_n\}\)。注意并非所有不可判定语言都在 \(\mathrm{PSIZE}\) 中——PS6 Q4 就严格证明了 \(A_{\mathrm{TM}} \notin \mathrm{PSIZE}\)（甚至存在可判定语言不在 \(\mathrm{PSIZE}\) 中）！`
    },
    {
      id: "l1314-q4",
      kind: "multi",
      tag: "slide",
      q: String.raw`下列关于布尔电路、布尔公式与 Shannon 定理的陈述中，哪些是正确的？`,
      choices: [
        ["a", String.raw`任意布尔函数 \(f:\{0,1\}^n\to\{0,1\}\) 都存在 Size 至多为 \(2^n + 1\) 的无限制扇入布尔电路计算它`],
        ["b", String.raw`对每个 \(n \ge 4\)，存在布尔函数 \(f:\{0,1\}^n\to\{0,1\}\) 无法被任何 Size \(\le 2^{n/2}/4\) 的布尔电路计算`],
        ["c", String.raw`电路求值问题 \(\mathrm{CVP} \in \mathrm{P}\)，而电路可满足性问题 \(\mathrm{CIRCUIT\text{-}SAT} \in \mathrm{NP}\)`],
        ["d", String.raw`任何布尔电路本身就是一个布尔公式，无需展开即可保持多项式叶数`]
      ],
      answer: ["a", "b", "c"],
      why: String.raw`(d) 错误！电路允许一个门的输出扇出给多个门复用；若将深度为 \(d\) 的二元扇入电路直接展开为树状公式，中间门被重复复制，叶数最坏可能暴增至 \(2^d\)（指数级膨胀）。`
    }
  ],
  cards: [
    [
      String.raw`本课程中布尔电路的 Size / Depth 与布尔公式的 Size 分别如何定义？`,
      String.raw`• <b>电路 Size</b>：电路中 <code>AND</code> 与 <code>OR</code> 门的总数（不计 <code>NOT</code> 门，扇入无限制）。<br>• <b>电路 Depth</b>：输入到输出最长路径上的 <code>AND</code>/<code>OR</code> 门个数。<br>• <b>公式 Size \(L(F)\)</b>：每个门扇出 \(\le 1\)，树表示中的<b>叶子总数</b>。`
    ],
    [
      String.raw`Shannon 电路上下界定理的两个核心数字是什么？`,
      String.raw`• <b>上界</b>：任意 \(f:\{0,1\}^n\to\{0,1\}\) 均可由 Size \(\le 2^n + 1\) 的电路计算（\(\le 2^n\) 个合取项 AND 门 + \(1\) 个顶层 OR 门）。<br>• <b>下界</b>：\(\forall n\ge 4\)，存在 \(f:\{0,1\}^n\to\{0,1\}\) 无法由 Size \(\le 2^{n/2}/4\) 的电路计算（计数法：\(2^{2^n}\) 个函数远多于小电路数）。`
    ],
    [
      String.raw`如何证明存在不可判定语言属于 \(\mathrm{PSIZE}\)（从而 \(\mathrm{P} \subsetneq \mathrm{PSIZE}\)）？`,
      String.raw`令 \(L = \{1^n : M_n \text{ 在 }\varepsilon\text{ 上停机}\}\)。\(L\) 不可判定，但对每个长度 \(n\)，若 \(1^n\in L\) 取 \(C_n = x_1\land\cdots\land x_n\)，否则取恒 \(0\) 电路。非一致性允许为每个 \(n\) 硬编码这 1 bit 信息，无需统一构造算法。`
    ]
  ]
});
