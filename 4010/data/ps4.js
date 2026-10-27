Review.add({
  id: "ps4",
  n: 24,
  group: "ps",
  short: "PS4 · 不可识别归约模板与进阶题",
  title: "Problem Set 4 精讲 · 不可识别证明标准构造模板、A_TM 完备性、无用状态、有限语言与滞后机器",
  meta: "对应 Lectures 8–9 · 官方归约模板 Part 1 / Part 2 · A 可识别 ⟺ A <=_m A_TM · USELESS 状态 · L_finite · L_LAG",
  sources: [
    { href: "materials/PS4.pdf", label: "Problem Set 4 (PS4.pdf)" },
    { href: "materials/PS4(Solutions).pdf", label: "Official Solutions (PS4(Solutions).pdf)" }
  ],
  html: String.raw`
<h2>1. 官方不可识别性证明标准构造模板（PS4 Page 1 核心讲义）</h2>
<p>Problem Set 4 开篇给出了课程官方总结的<strong>证明目标语言 \(L\) 不可识别的通用归约模板</strong>：构造从 \(\overline{A_{\mathrm{TM}}}\) 到 \(L\) 的映射归约 \(\overline{A_{\mathrm{TM}}} \le_m L\)，即定义全可计算函数 \(f\) 满足</p>
<div class="formula">\[
  \langle M, w \rangle \in \overline{A_{\mathrm{TM}}} \iff f(\langle M, w \rangle) \in L.
\]</div>

<div class="callout must">
  <strong>官方机器构造模板（Part 1 + 模拟过滤门 + Part 2）</strong>
  <pre><code>Machine F (computes the reduction function f): On input &lt;M, w&gt;:
  1. Construct the description &lt;N&gt; of the following Turing machine N:
       Machine N: On input x:
         (a) Part 1: [Initial behavior on x, executed BEFORE simulating M(w).]
             (May immediately accept or reject selected inputs x regardless of M(w).)
         (b) Simulation Gate: Simulate M on input w:
             - If M accepts w, proceed to Part 2.
             - If M rejects w, LOOP FOREVER (do not proceed to Part 2!).
             - If M loops on w, continue simulating forever.
         (c) Part 2: [Remaining behavior on x, reached ONLY IF Part 1 continued AND M accepted w.]
  2. Return f(&lt;M, w&gt;) = &lt;N&gt;.</code></pre>
  <p><strong>模板工作原理与设计秘诀</strong>：</p>
  <ul>
    <li>因为中间的 Simulation Gate 在“\(M\) 拒绝 \(w\)”时也被强制设为<strong>死循环（loop forever）</strong>，所以<strong>当且仅当 \(M\) 接受 \(w\) 时，计算才能穿透中间门到达 Part 2</strong>！</li>
    <li>因此，\(N\) 的行为被干净地一分为二：
      <ul>
        <li><strong>情形 A（\(\langle M, w \rangle \in \overline{A_{\mathrm{TM}}}\)，即 \(M\) 不接受 \(w\)）</strong>：Part 2 永远不可达，\(N\) 的行为<strong>完全由 Part 1 决定</strong>！我们设计 Part 1，使得此时 \(\langle N \rangle \in L\)。</li>
        <li><strong>情形 B（\(\langle M, w \rangle \in A_{\mathrm{TM}}\)，即 \(M\) 接受 \(w\)）</strong>：Part 1 放行的所有输入 \(x\) 都会进入 Part 2！我们设计 Part 2 来“破坏”语言 \(L\) 的条件，使得此时 \(\langle N \rangle \notin L\)。</li>
      </ul>
    </li>
    <li><strong>答题必写四要素（官方评分标准）</strong>：(1) 清楚写出 \(f\) 和辅助机 \(N\) 的构造；(2) 解释为什么 \(f\) 是全可计算的（因为 \(F\) 只生成代码 \(\langle N \rangle\) 而不运行 \(N\)）；(3) 分 \(M\) 接受 \(w\) 和 \(M\) 不接受 \(w\) 两种情况证明双向等价；(4) 说明由 \(\overline{A_{\mathrm{TM}}}\) 不可识别推出 \(L\) 不可识别。</li>
  </ul>
</div>

<h2>2. Problem Set 4 四道大题完整形式化证明</h2>

<details class="solve" open>
  <summary>Problem 1(a)：证明语言 \(A\) 是可识别的 \(\iff A \le_m A_{\mathrm{TM}}\)（\(A_{\mathrm{TM}}\) 对可识别语言类的完备性）</summary>
  <div>
    <p><strong>完整双向证明</strong>：</p>
    <ol>
      <li><strong>反方向（\(\Longleftarrow\)）</strong>：假设 \(A \le_m A_{\mathrm{TM}}\)。由 Lecture 7 定理 7.2 知 \(A_{\mathrm{TM}}\) 是可识别的；再由 Lecture 8 定理 8.1(2)（映射归约向下传递可识别性：若 \(A \le_m B\) 且 \(B\) 可识别，则 \(A\) 可识别），直接推出 \(A\) 是可识别的。</li>
      <li><strong>正方向（\(\implies\)）</strong>：假设 \(A\) 是可识别的，则存在一台识别 \(A\) 的固定图灵机 \(M_A\)（满足 \(\forall x \in \{0, 1\}^*,\; x \in A \iff M_A \text{ 接受 } x\)）。
        <p>定义函数 \(f: \{0, 1\}^* \to \{0, 1\}^*\) 为：</p>
        <div class="formula">\[
          f(w) = \langle M_A, w \rangle = \langle M_A \rangle w.
        \]</div>
        <ul>
          <li><strong>\(f\) 的可计算性</strong>：因为 \(M_A\) 是固定图灵机，其编码 \(\langle M_A \rangle\) 是一个固定常量字符串。转换器 \(F\) 在输入 \(w\) 上只需在 \(w\) 左侧拼接固定前缀 \(\langle M_A \rangle\) 即可停机，故 \(f\) 是全可计算函数。</li>
          <li><strong>双向充要性</strong>：对任意 \(w \in \{0, 1\}^*\)，
          <div class="formula">\[
            w \in A \iff M_A \text{ 接受 } w \iff \langle M_A, w \rangle \in A_{\mathrm{TM}} \iff f(w) \in A_{\mathrm{TM}}.
          \]</div></li>
        </ul>
        <p>因此 \(A \le_m A_{\mathrm{TM}}\)。</p>
      </li>
    </ol>
  </div>
</details>

<details class="solve" open>
  <summary>Problem 1(b)：证明语言 \(A\) 是可判定的 \(\iff A \le_m L_{0^* 1^*}\)，其中 \(L_{0^* 1^*} = \{0^m 1^n \mid m, n \ge 0\}\)</summary>
  <div>
    <p><strong>完整双向证明</strong>：</p>
    <ol>
      <li><strong>反方向（\(\Longleftarrow\)）</strong>：首先说明 \(L_{0^* 1^*}\) 是可判定的：图灵机从左到右扫描输入串，只要在看到 \(1\) 之后又看到 \(0\)（即出现子串 \(10\)）就停机拒绝，若扫描到右端空白 \(\sqcup\) 仍未出现 \(10\) 则停机接受。因此 \(L_{0^* 1^*}\) 可判定。若 \(A \le_m L_{0^* 1^*}\)，由定理 8.1(1)（映射归约向下传递可判定性）知 \(A\) 必可判定。</li>
      <li><strong>正方向（\(\implies\)）</strong>：假设 \(A\) 是可判定的，设 \(M_A\) 是判定 \(A\) 的<strong>判定机（Decider）</strong>。取固定正例串 \(y_{\mathrm{yes}} = 01 \in L_{0^* 1^*}\)（对应 \(m=1, n=1\)）和固定反例串 \(y_{\mathrm{no}} = 10 \notin L_{0^* 1^*}\)。定义归约函数 \(f: \{0, 1\}^* \to \{0, 1\}^*\)：
      <div class="formula">\[
        f(w) = \begin{cases}
          01, &amp; \text{若 } M_A \text{ 接受 } w, \\
          10, &amp; \text{若 } M_A \text{ 拒绝 } w.
        \end{cases}
      \]</div>
        <ul>
          <li><strong>为什么 \(f\) 是可计算函数？</strong>因为 \(M_A\) 是<strong>判定机</strong>，在任何输入 \(w\) 上都必定在有限步内停机（接受或拒绝）。计算 \(f\) 的图灵机 \(F\) 只需在 \(w\) 上完整运行 \(M_A(w)\)：若 \(M_A\) 接受则清空工作带写下 \(01\) 并停机；若 \(M_A\) 拒绝则清空工作带写下 \(10\) 并停机。</li>
          <li><strong>双向充要性</strong>：\(w \in A \iff M_A\) 接受 \(w \iff f(w) = 01 \in L_{0^* 1^*}\)。故 \(A \le_m L_{0^* 1^*}\)。</li>
        </ul>
      </li>
    </ol>
  </div>
</details>

<details class="solve" open>
  <summary>Problem 2：无用状态问题 \(\mathrm{USELESS}_{\mathrm{TM}}\) 的形式化与不可识别性证明</summary>
  <div>
    <p><strong>1. 语言形式化</strong>：图灵机 \(M\) 中的状态 \(q\) 称为<strong>无用状态（useless state）</strong>，如果对于一切输入串 \(x \in \{0, 1\}^*\)，\(M\) 在 \(x\) 上的计算过程都永远不会进入状态 \(q\)。将该问题形式化为语言：</p>
    <div class="formula">\[
      \mathrm{USELESS}_{\mathrm{TM}} = \{\langle M \rangle \mid M \text{ 是一台图灵机，且 } M \text{ 至少包含一个无用状态}\}.
    \]</div>
    <p><strong>2. 证明 \(\mathrm{USELESS}_{\mathrm{TM}}\) 不可识别（套用官方模板：\(\overline{A_{\mathrm{TM}}} \le_m \mathrm{USELESS}_{\mathrm{TM}}\)）</strong>：</p>
    <ul>
      <li><strong>设计思路</strong>：给定 \(\langle M, w \rangle\)，我们要构造图灵机 \(N\)，使其满足：
        <ul>
          <li>当 \(M\) <strong>不接受</strong> \(w\)（\(\langle M, w \rangle \in \overline{A_{\mathrm{TM}}}\)）时，\(N\) <strong>存在</strong>无用状态（例如 \(N\) 的接受状态 \(q_{\mathrm{acc},N}\) 永远不可达）；</li>
          <li>当 \(M\) <strong>接受</strong> \(w\)（\(\langle M, w \rangle \in A_{\mathrm{TM}}\)）时，\(N\) 的<strong>所有状态都可达（没有任何无用状态）</strong>！</li>
        </ul>
      </li>
      <li><strong>精细构造机器 \(N\)</strong>：在构造 \(N\) 时，模拟 \(M(w)\) 的子模块本身可能含有 \(M\) 原有的某些不可达状态。为了彻底消除这一干扰，我们<strong>不把 \(M\) 的状态直接嵌为 \(N\) 的状态</strong>，而是让 \(N\) 调用<strong>固定且无冗余状态的通用图灵机子程序</strong>（或者更直接地：利用单步查表模拟，并在 \(M\) 接受 \(w\) 后，让 \(N\) 执行一段<strong>显式遍历访问自身所有状态</strong>的巡检链）！具体构造如下：
<pre><code>Machine N: On input x in {0, 1}*:
  1. Part 1: Proceed directly to the simulation gate.
  2. Simulation Gate: Using a minimal universal simulator (all of whose internal states are
     visited during initialization/step-1), simulate M on input w.
     - If M accepts w, proceed to Part 2.
     - If M rejects w or loops, loop forever in the simulator's already-visited state.
  3. Part 2: Enter a dedicated state q_special (or q_{acc,N}) and halt.</code></pre>
      （注：也可以把 \(N\) 的状态设计为 \(\{q_0, q_1, \dots, q_m, q_{\mathrm{acc},N}, q_{\mathrm{rej},N}\}\)，其中当输入 \(x = 0\) 时 \(N\) 直接进入 \(q_{\mathrm{rej},N}\)，在启动模拟 \(M(w)\) 的过程中依次经过 \(q_0, \dots, q_m\)，而<strong>唯一未经过的状态 \(q_{\mathrm{acc},N}\) 仅在 \(M\) 接受 \(w\) 时才在 Part 2 中进入</strong>！）</li>
      <li><strong>双向充要性验证</strong>：
        <ul>
          <li>若 \(\langle M, w \rangle \in \overline{A_{\mathrm{TM}}}\)（\(M\) 不接受 \(w\)）：Part 2 永远无法到达，因此状态 \(q_{\mathrm{acc},N}\) 在任何输入 \(x\) 上都永远不会被进入，它是 \(N\) 的一个无用状态，故 \(\langle N \rangle \in \mathrm{USELESS}_{\mathrm{TM}}\)。</li>
          <li>若 \(\langle M, w \rangle \notin \overline{A_{\mathrm{TM}}}\)（\(M\) 接受 \(w\)）：在输入 \(x = 0\) 上 \(q_{\mathrm{rej},N}\) 被访问，在输入 \(x = 1\) 上模拟模块的所有状态 \(q_0, \dots, q_m\) 以及 Part 2 的 \(q_{\mathrm{acc},N}\) 全部被访问，故 \(N\) 没有任何无用状态，\(\langle N \rangle \notin \mathrm{USELESS}_{\mathrm{TM}}\)。</li>
        </ul>
      </li>
      <li>由于 \(f(\langle M, w \rangle) = \langle N \rangle\) 可计算且 \(\overline{A_{\mathrm{TM}}}\) 不可识别，故 \(\mathrm{USELESS}_{\mathrm{TM}}\) 不可识别。</li>
    </ul>
  </div>
</details>

<details class="solve" open>
  <summary>Problem 3：有限语言问题 \(L_{\mathrm{finite}} = \{\langle M \rangle \mid L(M) \text{ 是有限集}\}\) 不可识别</summary>
  <div>
    <p><strong>证明（直接套用官方模板：\(\overline{A_{\mathrm{TM}}} \le_m L_{\mathrm{finite}}\)）</strong>：</p>
    <ol>
      <li><strong>构造归约函数 \(f(\langle M, w \rangle) = \langle N \rangle\)</strong>，其中图灵机 \(N\) 按模板定义为：
<pre><code>Machine N: On input x in {0, 1}*:
  1. Part 1: (Do nothing; pass all inputs x to the simulation gate.)
  2. Simulation Gate: Simulate M on input w:
     - If M accepts w, proceed to Part 2.
     - If M rejects w, loop forever.
     - If M loops on w, continue simulating forever.
  3. Part 2: ACCEPT x.</code></pre>
      </li>
      <li><strong>可计算性说明</strong>：转换器 \(F\) 仅根据 \(\langle M, w \rangle\) 静态生成机器 \(N\) 的编码 \(\langle N \rangle\)，并不实际运行 \(N\) 或 \(M(w)\)，故 \(F\) 在所有输入上停机，\(f\) 是全可计算函数。</li>
      <li><strong>双向充要性验证</strong>：
        <ul>
          <li><strong>情形 1：若 \(\langle M, w \rangle \in \overline{A_{\mathrm{TM}}}\)（\(M\) 不接受 \(w\)）</strong>。则对任意输入 \(x \in \{0, 1\}^*\)，\(N(x)\) 都会卡在 Simulation Gate 中无限循环，永远不会到达 Part 2。因此 \(L(N) = \emptyset\)。因为空集 \(\emptyset\) 的元素个数为 \(0 &lt; \infty\)，是<strong>有限集</strong>，所以 \(\langle N \rangle \in L_{\mathrm{finite}}\)。</li>
          <li><strong>情形 2：若 \(\langle M, w \rangle \notin \overline{A_{\mathrm{TM}}}\)（\(M\) 接受 \(w\)）</strong>。则对<strong>每一个</strong>输入串 \(x \in \{0, 1\}^*\)，模拟 \(M(w)\) 都会在有限步后接受并进入 Part 2 接受 \(x\)。因此 \(L(N) = \{0, 1\}^*\)，是<strong>无限集</strong>，所以 \(\langle N \rangle \notin L_{\mathrm{finite}}\)。</li>
        </ul>
      </li>
      <li><strong>结论</strong>：\(\langle M, w \rangle \in \overline{A_{\mathrm{TM}}} \iff f(\langle M, w \rangle) \in L_{\mathrm{finite}}\)，即 \(\overline{A_{\mathrm{TM}}} \le_m L_{\mathrm{finite}}\)。由于 \(\overline{A_{\mathrm{TM}}}\) 不可识别，故 \(L_{\mathrm{finite}}\) <strong>不可识别</strong>。</li>
    </ol>
  </div>
</details>

<details class="solve" open>
  <summary>Problem 4：机器滞后问题 \(L_{\mathrm{LAG}} = \{\langle M_1, M_2 \rangle \mid M_1 \text{ lags behind } M_2\}\) 不可识别</summary>
  <div>
    <p><strong>题目定义回顾</strong>：称图灵机 \(M_1\) <strong>滞后于（lags behind）</strong>\(M_2\)，如果对所有输入串 \(x \in \{0, 1\}^*\)，蕴涵式“<strong>若 \(M_2(x)\) 接受，则 \(M_1(x)\) 无限循环（loops）</strong>”恒成立（若 \(M_2(x)\) 不接受，则 \(M_1(x)\) 的行为任意）。</p>
    <p><strong>证明（\(\overline{A_{\mathrm{TM}}} \le_m L_{\mathrm{LAG}}\)）</strong>：</p>
    <ol>
      <li><strong>设计思路</strong>：我们需要从输入 \(\langle M, w \rangle\) 构造一对图灵机 \(\langle M_1, M_2 \rangle\)。为了简化条件，我们可以把 \(M_2\) 固定为<strong>接受所有输入的机器 \(M_{\mathrm{acc}}\)</strong>（即对一切 \(x \in \{0, 1\}^*\)，\(M_2(x)\) 都接受）！这样一来，“\(M_1\) 滞后于 \(M_2\)”的条件就简化为：“<strong>对一切 \(x \in \{0, 1\}^*\)，\(M_1(x)\) 都无限循环</strong>”！</li>
      <li><strong>构造归约函数 \(f(\langle M, w \rangle) = \langle M_1, M_2 \rangle\)</strong>：
        <ul>
          <li>令 \(M_2 = M_{\mathrm{acc}}\)（在所有输入 \(x\) 上立即停机接受）；</li>
          <li>按官方模板构造 \(M_1\)：
<pre><code>Machine M_1: On input x in {0, 1}*:
  1. Part 1: (Pass directly to Simulation Gate.)
  2. Simulation Gate: Simulate M on input w:
     - If M accepts w, proceed to Part 2.
     - If M rejects w, loop forever.
     - If M loops on w, continue simulating forever.
  3. Part 2: ACCEPT and halt (so M_1 halts on x!).</code></pre>
          </li>
        </ul>
      </li>
      <li><strong>双向充要性验证</strong>：
        <ul>
          <li><strong>若 \(\langle M, w \rangle \in \overline{A_{\mathrm{TM}}}\)（\(M\) 不接受 \(w\)）</strong>：不论 \(M\) 是拒绝 \(w\) 还是在 \(w\) 上死循环，\(M_1\) 在<strong>所有输入 \(x \in \{0, 1\}^*\)</strong> 上都会在 Simulation Gate 中<strong>无限循环（loops）</strong>。因此，对所有使 \(M_2(x)\) 接受的 \(x\)，\(M_1(x)\) 确实都无限循环，即 \(M_1\) 滞后于 \(M_2\)，\(\langle M_1, M_2 \rangle \in L_{\mathrm{LAG}}\)。</li>
          <li><strong>若 \(\langle M, w \rangle \notin \overline{A_{\mathrm{TM}}}\)（\(M\) 接受 \(w\)）</strong>：对任意输入 \(x\)（例如 \(x = \varepsilon\)），\(M_2(\varepsilon)\) 接受，但 \(M_1(\varepsilon)\) 在模拟完 \(M(w)\) 接受后会进入 Part 2 并<strong>停机接受（不再无限循环！）</strong>。这违反了“\(M_2(x)\) 接受 \(\implies M_1(x)\) 死循环”的定义，故 \(\langle M_1, M_2 \rangle \notin L_{\mathrm{LAG}}\)。</li>
        </ul>
      </li>
      <li><strong>结论</strong>：\(\overline{A_{\mathrm{TM}}} \le_m L_{\mathrm{LAG}}\)。由于 \(f\) 可计算且 \(\overline{A_{\mathrm{TM}}}\) 不可识别，故 \(L_{\mathrm{LAG}}\) <strong>不可识别</strong>。</li>
    </ol>
    <p class="muted">（注：另一种对称构造是令 \(M_1\) 在所有输入上立即停机接受，而令 \(M_2(x)\) 按模板模拟 \(M(w)\) 并在 \(M\) 接受 \(w\) 时接受 \(x\)。此时若 \(M\) 不接受 \(w\)，则 \(M_2\) 永不接受任何 \(x\)，蕴涵式的前提“\(M_2(x)\) 接受”恒假，从而蕴涵式<strong>空真（vacuously true）</strong>，\(\langle M_1, M_2 \rangle \in L_{\mathrm{LAG}}\)；若 \(M\) 接受 \(w\)，则 \(M_2(x)\) 接受但 \(M_1(x)\) 停机不循环，故 \(\langle M_1, M_2 \rangle \notin L_{\mathrm{LAG}}\)。两种证法均满分！）</p>
  </div>
</details>
`,
  questions: [
    {
      id: "ps4-q1",
      kind: "single",
      tag: "hw",
      q: String.raw`（PS4 官方归约模板）在使用 PS4 的通用模板构造辅助图灵机 \(N(x)\) 以证明 \(\overline{A_{\mathrm{TM}}} \le_m L\) 时，为什么在中间的模拟步（Simulation Gate）中，当被模拟的 \(M\) 在 \(w\) 上<strong>停机拒绝（rejects）</strong>时，模板要求 \(N\) 必须<strong>主动进入无限循环（loop forever）</strong>，而不是跟着停机拒绝？`,
      choices: [
        ["a", String.raw`为了将“\(M\) 拒绝 \(w\)”与“\(M\) 在 \(w\) 上死循环”合并为完全相同的外在行为（都永不进入 Part 2），从而保证 Part 2 仅当 \(\langle M, w \rangle \in A_{\mathrm{TM}}\) 时才可达`],
        ["b", String.raw`因为图灵机 \(N\) 没有拒绝状态 \(q_{\mathrm{rej}}\)`],
        ["c", String.raw`为了让计算归约函数 \(f\) 的机器 \(F\) 也进入无限循环`],
        ["d", String.raw`因为只有死循环的图灵机才有合法的二进制编码`]
      ],
      answer: ["a"],
      why: String.raw`\(\overline{A_{\mathrm{TM}}}\) 包含两种情形：\(M\) 在 \(w\) 上停机拒绝，或 \(M\) 在 \(w\) 上死循环。如果在“\(M\) 拒绝 \(w\)”时让 \(N\) 主动进入死循环，那么对于所有 \(\langle M, w \rangle \in \overline{A_{\mathrm{TM}}}\)，Simulation Gate 的行为就百分之百统一为“死循环”，彻底消除了“拒绝”与“死循环”的分歧！`
    },
    {
      id: "ps4-q2",
      kind: "single",
      tag: "hw",
      q: String.raw`（PS4 Q1(b)）在证明“若语言 \(A\) 可判定，则 \(A \le_m L_{0^* 1^*}\)”时，我们将 \(w \in A\) 映射为 \(01\)、将 \(w \notin A\) 映射为 \(10\)。为什么同样的技巧<strong>不能</strong>证明“若 \(A\) 可识别，则 \(A \le_m L_{0^* 1^*}\)”？`,
      choices: [
        ["a", String.raw`因为映射归约要求转换函数 \(f\) 必须是全可计算的（在所有输入上停机）；若 \(A\) 只是可识别而不可判定，识别机 \(M_A\) 在 \(w \notin A\) 上可能无限循环，无法在有限步内停机输出 \(10\)`],
        ["b", String.raw`因为 \(L_{0^* 1^*}\) 本身是不可识别语言`],
        ["c", String.raw`因为 \(01\) 不属于 \(L_{0^* 1^*}\)`],
        ["d", String.raw`因为可识别语言都是空集`]
      ],
      answer: ["a"],
      why: String.raw`计算映射归约函数 \(f\) 的图灵机 \(F\) 必须在<strong>每一个输入 \(w\)</strong> 上都停机。只有当 \(A\) 可判定（拥有必停机的判定机 \(M_A\)）时，\(F\) 才能通过运行 \(M_A(w)\) 区分 \(w \in A\) 与 \(w \notin A\) 并分别输出 \(01\) 和 \(10\)。事实上若 \(A \le_m L_{0^* 1^*}\)，由 \(L_{0^* 1^*}\) 可判定必然反推出 \(A\) 可判定。`
    },
    {
      id: "ps4-q3",
      kind: "single",
      tag: "hw",
      q: String.raw`（PS4 Q3）在证明 \(L_{\mathrm{finite}} = \{\langle M \rangle \mid L(M) \text{ 是有限集}\}\) 不可识别时，对输入 \(\langle M, w \rangle\)，我们构造机器 \(N(x)\)：“忽略 \(x\)，模拟 \(M(w)\)；若 \(M\) 接受 \(w\) 则接受 \(x\)”。当 \(\langle M, w \rangle \in \overline{A_{\mathrm{TM}}}\) 和 \(\langle M, w \rangle \notin \overline{A_{\mathrm{TM}}}\) 时，\(L(N)\) 分别是什么？`,
      choices: [
        ["a", String.raw`当 \(\langle M, w \rangle \in \overline{A_{\mathrm{TM}}}\) 时 \(L(N) = \emptyset\)（有限集，故 \(\langle N \rangle \in L_{\mathrm{finite}}\)）；当 \(\langle M, w \rangle \notin \overline{A_{\mathrm{TM}}}\) 时 \(L(N) = \{0,1\}^*\)（无限集，故 \(\langle N \rangle \notin L_{\mathrm{finite}}\)）`],
        ["b", String.raw`当 \(\langle M, w \rangle \in \overline{A_{\mathrm{TM}}}\) 时 \(L(N) = \{0,1\}^*\)；当 \(\langle M, w \rangle \notin \overline{A_{\mathrm{TM}}}\) 时 \(L(N) = \emptyset\)`],
        ["c", String.raw`两种情况下 \(L(N)\) 都是单元素集 \(\{w\}\)`],
        ["d", String.raw`两种情况下 \(L(N)\) 都是空集 \(\emptyset\)`]
      ],
      answer: ["a"],
      why: String.raw`因为 \(N(x)\) 的行为与 \(x\) 无关：若 \(M\) 不接受 \(w\)，\(N\) 不接受任何 \(x\)，\(L(N) = \emptyset\)（大小为 \(0\)，有限！）；若 \(M\) 接受 \(w\)，\(N\) 接受所有 \(x \in \{0,1\}^*\)，\(L(N) = \{0,1\}^*\)（无穷多字符串，无限！）。这完美建立了 \(\overline{A_{\mathrm{TM}}} \le_m L_{\mathrm{finite}}\)。`
    },
    {
      id: "ps4-q4",
      kind: "single",
      tag: "hw",
      q: String.raw`（PS4 Q4）在 \(L_{\mathrm{LAG}} = \{\langle M_1, M_2 \rangle \mid \forall x,\, M_2(x)\text{ accepts} \implies M_1(x)\text{ loops}\}\) 中，如果某台图灵机 \(M_2\) 满足 \(L(M_2) = \emptyset\)（即 \(M_2\) 从不接受任何输入 \(x\)），那么对于任意图灵机 \(M_1\)，\(\langle M_1, M_2 \rangle\) 是否属于 \(L_{\mathrm{LAG}}\)？`,
      choices: [
        ["a", String.raw`一定属于 \(L_{\mathrm{LAG}}\)（因为对所有 \(x\)，蕴涵式的前提“\(M_2(x)\) 接受”恒为假，故该全称蕴涵命题空真 vacuously true）`],
        ["b", String.raw`一定不属于 \(L_{\mathrm{LAG}}\)`],
        ["c", String.raw`仅当 \(M_1\) 也是空语言时才属于 \(L_{\mathrm{LAG}}\)`],
        ["d", String.raw`取决于 \(M_1\) 的状态数是否为偶数`]
      ],
      answer: ["a"],
      why: String.raw`逻辑蕴涵 \(P \implies Q\) 在前提 \(P\) 为假时恒为真（vacuously true）。当 \(L(M_2) = \emptyset\) 时，对任意 \(x\)，“\(M_2(x)\) 接受”均为假，因此无论 \(M_1(x)\) 做什么，\(\forall x,\, (M_2(x)\text{ accepts} \implies M_1(x)\text{ loops})\) 都恒成立！`
    }
  ],
  cards: [
    [
      String.raw`（PS4 模板）简述证明语言 \(L\) 不可识别的 Part 1 / Simulation Gate / Part 2 模板。`,
      String.raw`给定 \(\langle M, w \rangle\)，构造 \(N(x)\)：<br>1. <strong>Part 1</strong>：对特定 \(x\) 预先接受/拒绝，使 \(M\) 不接受 \(w\) 时 \(\langle N \rangle \in L\)；<br>2. <strong>Gate</strong>：模拟 \(M(w)\)，若拒绝或死循环则<strong>一律死循环</strong>，仅当接受时进入 Part 2；<br>3. <strong>Part 2</strong>：破坏 \(L\) 的性质，使 \(M\) 接受 \(w\) 时 \(\langle N \rangle \notin L\)。`
    ],
    [
      String.raw`（PS4 Q1）语言 \(A\) 可识别、可判定的映射归约充要条件分别是什么？`,
      String.raw`1. \(A\) 可识别 \(\iff A \le_m A_{\mathrm{TM}}\)（归约函数 \(f(w) = \langle M_A, w \rangle\)）；<br>2. \(A\) 可判定 \(\iff A \le_m L_{0^*1^*}\)（用判定机 \(M_A(w)\) 将接受映射为 \(01\)，拒绝映射为 \(10\)）。`
    ],
    [
      String.raw`（PS4 Q3）如何用一句话证明 \(L_{\mathrm{finite}} = \{\langle M \rangle \mid |L(M)| &lt; \infty\}\) 不可识别？`,
      String.raw`构造 \(N(x)\)：忽略 \(x\)，模拟 \(M(w)\)，接受当且仅当 \(M\) 接受 \(w\)。则 \(\langle M, w \rangle \in \overline{A_{\mathrm{TM}}} \iff L(N) = \emptyset\)（有限）\(\iff \langle N \rangle \in L_{\mathrm{finite}}\)（反之 \(L(N)=\{0,1\}^*\) 无限）。`
    ]
  ]
});
