Review.add({
  id: "ps2",
  n: 22,
  group: "ps",
  short: "PS2 · 封闭性、单向带与 UTM 伪代码",
  title: "Problem Set 2 精讲 · 交与连接封闭性、单向无穷带等价性、一元转二进制与 UTM 伪代码",
  meta: "对应 Lectures 4–6 · 官方解答完整收录 · 交集双带与连接三带形式化状态转移 · 单向带双轨折叠证明 · UTM 四带伪代码",
  sources: [
    { href: "materials/PS2.pdf", label: "Problem Set 2" },
    { href: "materials/PS2(Solutions).pdf", label: "PS2 Official Solutions" }
  ],
  html: String.raw`
<h2>1. Problem 1：可判定语言对交集 \(L_1 \cap L_2\) 与连接 \(L_1 \circ L_2\) 的封闭性（元组级形式化证明）</h2>
<p>题目明确要求：<strong>必须清楚说明对状态集 \(Q\)、工作带字母表 \(\Sigma\) 和转移函数 \(\delta\) 所做的形式化修改</strong>（允许使用课堂讲过的多带或 Stay 变体）。设 \(M_i = (Q_i, \Sigma_i, \delta_i, \sqcup, q_{\mathrm{acc},i}, q_{\mathrm{rej},i}, q_{0,i})\)（\(i = 1, 2\)）分别为判定 \(L_1, L_2\) 的判定机。</p>

<h3>1.1 Problem 1(a)：交集 \(L_1 \cap L_2 = \{x \mid x \in L_1 \text{ 且 } x \in L_2\}\)</h3>
<p><strong>构造双带图灵机 \(M\)（官方解答完整形式化）</strong>：</p>
<ol>
  <li><strong>初始化过程</strong>：初始时输入 \(w \in \{0, 1\}^*\) 位于第 1 条工作带，第 2 条工作带全为空白。\(M\) 从初始状态 \(q_0\) 出发，将 \(w\) 完整拷贝到第 2 条工作带，将两条工作带的读写头都移回各自拷贝左端紧邻的空白格 \(\sqcup\) 上，然后进入积状态 \((q_{0,1}, q_{0,2})\)。</li>
  <li><strong>状态集 \(Q\)</strong>：
  <div class="formula">\[
    Q = Q_{\mathrm{init}} \;\cup\; (Q_1 \times Q_2) \;\cup\; \{q_{\mathrm{acc}}, q_{\mathrm{rej}}\},
  \]</div>
  其中 \(Q_{\mathrm{init}}\) 包含 \(q_0\) 以及拷贝输入和复位读写头所需的辅助状态（与 \(Q_1 \times Q_2\) 及停机状态互不相交）。</li>
  <li><strong>转移函数 \(\delta: (Q \setminus \{q_{\mathrm{acc}}, q_{\mathrm{rej}}\}) \times \Sigma_1 \times \Sigma_2 \to Q \times \Sigma_1 \times \Sigma_2 \times \{L, R, S\}^2\)</strong>：对当前扫描符号 \(a \in \Sigma_1, b \in \Sigma_2\)，分五种情形定义模拟阶段的转移：
    <ul>
      <li><strong>两台机器均未停机</strong>：若 \(q_1 \notin \{q_{\mathrm{acc},1}, q_{\mathrm{rej},1}\},\, q_2 \notin \{q_{\mathrm{acc},2}, q_{\mathrm{rej},2}\}\)，且 \(\delta_1(q_1, a) = (q'_1, a', D_1),\; \delta_2(q_2, b) = (q'_2, b', D_2)\)，则同步推进一步：
      <div class="formula">\[
        \delta\bigl((q_1, q_2), a, b\bigr) = \bigl((q'_1, q'_2), a', b', D_1, D_2\bigr).
      \]</div></li>
      <li><strong>任一机器已进入拒绝状态</strong>（短路拒绝）：对任意 \(q_1 \in Q_1, q_2 \in Q_2\)，
      <div class="formula">\[
        \delta\bigl((q_{\mathrm{rej},1}, q_2), a, b\bigr) = (q_{\mathrm{rej}}, a, b, S, S), \qquad \delta\bigl((q_1, q_{\mathrm{rej},2}), a, b\bigr) = (q_{\mathrm{rej}}, a, b, S, S).
      \]</div></li>
      <li><strong>两台机器均已进入接受状态</strong>：
      <div class="formula">\[
        \delta\bigl((q_{\mathrm{acc},1}, q_{\mathrm{acc},2}), a, b\bigr) = (q_{\mathrm{acc}}, a, b, S, S).
      \]</div></li>
      <li><strong>仅 \(M_1\) 已接受，\(M_2\) 仍在运行</strong>：保持第 1 条带及读写头原地不动（\(S\)），继续推进 \(M_2\)：
      <div class="formula">\[
        \delta\bigl((q_{\mathrm{acc},1}, q_2), a, b\bigr) = \bigl((q_{\mathrm{acc},1}, q'_2), a, b', S, D_2\bigr).
      \]</div></li>
      <li><strong>仅 \(M_2\) 已接受，\(M_1\) 仍在运行</strong>：保持第 2 条带及读写头原地不动（\(S\)），继续推进 \(M_1\)：
      <div class="formula">\[
        \delta\bigl((q_1, q_{\mathrm{acc},2}), a, b\bigr) = \bigl((q'_1, q_{\mathrm{acc},2}), a', b, D_1, S\bigr).
      \]</div></li>
    </ul>
  </li>
  <li><strong>停机性与正确性</strong>：因为 \(M_1, M_2\) 都是判定机，在输入 \(w\) 上各自必在有限步内停机。若任一方拒绝则 \(M\) 立即拒绝；否则双方最终都进入接受状态，\(M\) 进入 \(q_{\mathrm{acc}}\) 接受。故 \(M\) 判定 \(L_1 \cap L_2\)。</li>
</ol>

<h3>1.2 Problem 1(b)：连接运算 \(L_1 \circ L_2 = \{xy \mid x \in L_1 \text{ 且 } y \in L_2\}\)</h3>
<p><strong>核心难点</strong>：输入串 \(w = w_1 w_2 \cdots w_n\) 切分为前缀 \(u_k = w_1 \cdots w_{k-1}\) 和后缀 \(v_k = w_k \cdots w_n\) 的分割点未知，共有 \(n + 1\) 种可能切分（\(k = 1, 2, \dots, n+1\)，其中 \(u_1 = \varepsilon, v_{n+1} = \varepsilon\)）。因此必须分<strong>至多 \(n + 1\) 个阶段（phases）</strong>逐一测试每个切分点！</p>
<p><strong>三带图灵机 \(M\) 的形式化构造（官方解答）</strong>：</p>
<ul>
  <li><strong>三条工作带分工</strong>：
    <ul>
      <li><strong>Tape 1（主控与切分标记带）</strong>：存放原始输入 \(w\)，使用扩展字母表 \(\Sigma = \{0, 1, \sqcup, \overline{0}, \overline{1}, \overline{\sqcup}\}\)。在第 \(k\) 阶段（\(1 \le k \le n\)），将第 \(k\) 个字符 \(w_k\) 替换为带顶横线的 \(\overline{w_k}\) 以标记当前切分点（当 \(k = n + 1\) 时，将 \(w\) 右侧紧邻的空白格标记为 \(\overline{\sqcup}\)）。</li>
      <li><strong>Tape 2（模拟 \(M_1\) 的工作带，字母表 \(\Sigma_1\)）</strong>：在第 \(k\) 阶段存放前缀 \(u_k = w_1 \cdots w_{k-1}\)（即标记符左侧的子串），供模拟 \(M_1(u_k)\) 使用。</li>
      <li><strong>Tape 3（模拟 \(M_2\) 的工作带，字母表 \(\Sigma_2\)）</strong>：在第 \(k\) 阶段存放后缀 \(v_k = w_k \cdots w_n\)（即从标记符开始到末尾的子串），供模拟 \(M_2(v_k)\) 使用。</li>
    </ul>
  </li>
  <li><strong>状态集</strong>：\(Q = Q_{\mathrm{init}} \cup (Q_1 \times Q_2) \cup \{q_{\mathrm{acc}}, q_{\mathrm{rej}}\}\)，其中 \(Q_{\mathrm{init}}\) 含初始状态 \(q_0\)、阶段切换状态 \(q_{\mathrm{next}}\) 以及负责擦除 Tape 2/3、右移标记符、拷贝新切分 \(u_{k+1}, v_{k+1}\) 的辅助状态。</li>
  <li><strong>单阶段内的模拟转移（与 1(a) 的关键差异！）</strong>：
    <ul>
      <li>当 \((q_1, q_2)\) 到达 \((q_{\mathrm{acc},1}, q_{\mathrm{acc},2})\) 时，说明当前切分 \(w = u_k v_k\) 满足 \(u_k \in L_1 \land v_k \in L_2\)，<strong>直接转入全局接受状态 \(q_{\mathrm{acc}}\) 并停机</strong>！</li>
      <li>当 \(M_1\) 或 \(M_2\) 中<strong>任一台进入拒绝状态</strong>（如 \((q_{\mathrm{rej},1}, q_2)\) 或 \((q_1, q_{\mathrm{rej},2})\)）时，<strong>绝不能直接转入全局 \(q_{\mathrm{rej}}\)</strong>，而必须转入阶段推进状态 \(q_{\mathrm{next}}\)：
      <div class="formula">\[
        \delta\bigl((q_{\mathrm{rej},1}, q_2), a, b, c\bigr) = (q_{\mathrm{next}}, a, b, c, S, S, S), \qquad \delta\bigl((q_1, q_{\mathrm{rej},2}), a, b, c\bigr) = (q_{\mathrm{next}}, a, b, c, S, S, S).
      \]</div></li>
    </ul>
  </li>
  <li><strong>阶段推进状态 \(q_{\mathrm{next}}\) 的逻辑</strong>：检查 Tape 1 读写头当前指着的带横线标记符：
    <ul>
      <li>若该标记符已经是 \(\overline{\sqcup}\)，说明第 \(n + 1\) 个（最后一个）切分阶段也已失败，所有切分均不成立，此时才转入全局拒绝状态 \(q_{\mathrm{rej}}\)；</li>
      <li>否则（当前标记为 \(\overline{w_k}\)），清空 Tape 2 和 Tape 3，将 Tape 1 上的 \(\overline{w_k}\) 恢复为 \(w_k\)，将其右侧下一格标记上顶横线，按新切分点将 \(u_{k+1}\) 拷入 Tape 2、\(v_{k+1}\) 拷入 Tape 3，进入 \((q_{0,1}, q_{0,2})\) 启动第 \(k+1\) 阶段。</li>
    </ul>
  </li>
</ul>

<h2>2. Problem 2：单向无穷带图灵机与双向无穷带图灵机的等价性</h2>
<p><strong>问题</strong>：单向无穷带图灵机（One-way infinite tape TM）的工作带具有最左端单元格，仅向右侧无限延伸。证明它与本课程的标准双向无穷带图灵机判定相同的语言类。</p>

<div class="callout must">
  <strong>雙軌折疊模擬構造（Two-Track Folding，PS2 官方解答）</strong>
  <p>设双向无穷带图灵机 \(M_p\) 在任意时刻的工作带内容为 \(\cdots \sqcup a_{-n} \cdots a_{-1} a_0 a_1 \cdots a_m \sqcup \cdots\)，其中 \(a_0\) 是初始时刻读写头所在的单元格。单向无穷带图灵机 \(M_o\) 使用<strong>上下双轨（2-track）字母表 \(\Gamma' = \Gamma \times (\Gamma \cup \{\#\})\)</strong>，以初始格 \(a_0\) 为折点，将左半条带反转折叠到下轨：</p>
  <pre><code>单元格索引:    Cell 0 (最左端)    Cell 1       Cell 2      ...    Cell k
上轨 (Track 1):     a_0            a_1          a_2       ...     a_k      (存放初始格及右侧 a_i, i >= 0)
下轨 (Track 2):      #             a_{-1}       a_{-2}    ...     a_{-k}   (存放初始格左侧 a_{-i}, i >= 1，方向相反！)</code></pre>
  <p><strong>状态集与四个转移分支</strong>：令 \(M_o\) 的状态集为 \(K' = \{q'_0\} \cup (K \times \{1, 2\})\)，其中第二分量 \(t \in \{1, 2\}\) 记录当前正在模拟上轨（\(t=1\)，即原带 \(i \ge 0\) 区域）还是下轨（\(t=2\)，即原带 \(i &lt; 0\) 区域）。记 \(\overline{D}\) 为相反方向（\(\overline{L} = R,\, \overline{R} = L\)）：</p>
  <ol>
    <li><strong>初始步（在最左端做边界标记 \(\#\)）</strong>：若 \(M_p\) 的第一步为 \(\delta(q_0, a_0) = (q', A, D)\)：
      <ul>
        <li>当 \(D = R\) 时：\(\delta'(q'_0, [a_0, \sqcup]) = \bigl((q', 1), [A, \#], R\bigr)\)（留在上轨右移）；</li>
        <li>当 \(D = L\) 时：\(\delta'(q'_0, [a_0, \sqcup]) = \bigl((q', 2), [A, \#], R\bigr)\)（切入下轨右移，对应原带左移进入 \(a_{-1}\)！）。</li>
      </ul>
    </li>
    <li><strong>在上轨内部运行（\(t = 1\)，且下轨符号 \(b \ne \#\)）</strong>：若 \(\delta(q, a) = (q', c, D)\)，保持上轨同向移动：
    <div class="formula">\[
      \delta'\bigl((q, 1), [a, b]\bigr) = \bigl((q', 1), [c, b], D\bigr).
    \]</div></li>
    <li><strong>在下轨内部运行（\(t = 2\)，且下轨符号 \(b \ne \#\)）</strong>：若 \(\delta(q, b) = (q', c, D)\)，因为左半带是反向存储的，<strong>移动方向必须取反为 \(\overline{D}\)</strong>，且只修改下轨符号：
    <div class="formula">\[
      \delta'\bigl((q, 2), [a, b]\bigr) = \bigl((q', 2), [a, c], \overline{D}\bigr).
    \]</div></li>
    <li><strong>折返点跨越（扫描到最左格 \([a, \#]\)，即回到初始格 \(a_0\)）</strong>：不论此前处于哪条轨道 \(i \in \{1, 2\}\)，扫描到下轨为 \(\#\) 都代表当前位于原带初始格 \(a\)。若 \(\delta(q, a) = (p, A, D)\)：
      <ul>
        <li>当 \(D = R\) 时：\(\delta'\bigl((q, i), [a, \#]\bigr) = \bigl((p, 1), [A, \#], R\bigr)\)（进入上轨并右移）；</li>
        <li>当 \(D = L\) 时：\(\delta'\bigl((q, i), [a, \#]\bigr) = \bigl((p, 2), [A, \#], R\bigr)\)（进入下轨并右移）。</li>
      </ul>
      注意在两种情况下物理读写头都<strong>向右移动（\(R\)）</strong>，因此绝对不会越过最左端 Cell 0 掉下工作带！
    </li>
  </ol>
</div>

<h2>3. Problem 3：一元转二进制图灵机与二进制加 1 图灵机</h2>
<ol>
  <li><strong>Problem 3(a)：输入一元串 \(1^k\)，输出 \(k\) 的二进制表示 \(\langle k \rangle\) 并停机</strong>：
    <ul>
      <li><strong>工作带布局</strong>：将输入 \(1^k\) 左侧紧邻的初始空白格 \(\sqcup\) 改写为分隔符 \(\#\)，在 \(\#\) 的左侧初始化一个二进制计数器 \(0\)（即带布局为 \(\cdots \sqcup\, 0\, \#\, 11\cdots 1\, \sqcup \cdots\)）。</li>
      <li><strong>主循环</strong>：从 \(\#\) 向右扫描找到第一个尚未划掉的 \(1\)，将其改写为标记符 \(X\)；然后向左越过 \(\#\) 进入左侧二进制数区域，对其执行<strong>二进制加 \(1\)</strong>；完成后再向右越过 \(\#\) 寻找下一个未划掉的 \(1\)。</li>
      <li><strong>清理停机</strong>：当 \(\#\) 右侧不再有未标记的 \(1\)（遇到 \(\sqcup\)）时，擦除所有的 \(X\) 和分隔符 \(\#\)，将读写头移至左侧二进制结果 \(\langle k \rangle\) 的最高位并停机。</li>
    </ul>
  </li>
  <li><strong>Problem 3(b)：输入非负整数 \(x\) 的二进制表示 \(\langle x \rangle\)，原地替换为 \(\langle x + 1 \rangle\) 并停机</strong>：
    <ul>
      <li><strong>模拟手算进位（Carry Propagation）</strong>：读写头先从左端 \(\sqcup\) 一路向右扫描到二进制串的最低有效位（最右端字符，即遇到右侧 \(\sqcup\) 后左移一格）。</li>
      <li>在进位状态 \(q_{\mathrm{carry}}\) 下<strong>从右向左扫描</strong>：
        <ul>
          <li>每读到一个 \(1\)（\(1 + 1 = 10_2\)，本位变 \(0\) 并继续进位）：将其改写为 \(0\)，继续向左移动（保持 \(q_{\mathrm{carry}}\)）；</li>
          <li>一旦读到第一个 \(0\)（\(0 + 1 = 1\)，进位吸收完毕）：将其改写为 \(1\)，进位结束，直接移动读写头到最高位（或左端空白格）并停机；</li>
          <li>若一路全是 \(1\) 直到撞上左端空白格 \(\sqcup\)（例如输入为 \(111_2 = 7\)，加 \(1\) 变为 \(1000_2 = 8\)，位数增加 1 位）：可直接在左端空白格写入最高位 \(1\)（或将左端写为 \(1\)、原最低位右侧空白补一个 \(0\)）并停机。</li>
        </ul>
      </li>
    </ul>
  </li>
</ol>

<h2>4. Problem 4：四带通用图灵机 \(U\) 的标准伪代码（Quiz 2 &amp; 期中重点）</h2>
<p>给定编码 \(\langle M, w \rangle = \langle M \rangle w = 1^k 0 1^m 0 \langle \delta \rangle w\)（其中 \(|Q| = 2^k, |\Sigma| = 2^m\)，\(\langle 0 \rangle = 0^m, \langle 1 \rangle = 10^{m-1}, \langle \sqcup \rangle = 1^m\)，每条记录 \(q\langle b \rangle q'\langle b' \rangle\langle D \rangle\) 长 \(2k + 2m + 1\) 位），四带通用图灵机 \(U\) 的完整伪代码如下：</p>

<pre><code>Universal Turing Machine U: On input &lt;M&gt;w = 1^k 0 1^m 0 &lt;delta&gt; w on Tape 1:

Phase 1: Decoding &amp; Initialization
  1. Scan Tape 1 from the start: count the number of 1s before the first 0 to obtain k,
     and count the number of 1s between the first 0 and the second 0 to obtain m.
  2. Read the next 2^{k+m} * (2k + 2m + 1) bits after the second 0 (which form &lt;delta&gt;),
     and copy them onto Tape 3 (Machine Code Tape).
  3. On Tape 4 (Simulation Tape), write the initial blank block &lt;blank&gt; = 1^m.
     Then scan the remaining suffix w = w_1 ... w_n on Tape 1:
       - If w_i == 0, append block &lt;0&gt; = 0^m to Tape 4;
       - If w_i == 1, append block &lt;1&gt; = 10^{m-1} to Tape 4.
     Move the Tape 4 head back to the first bit of the initial blank block &lt;blank&gt; = 1^m.
  4. On Tape 2 (State Tape), write the k-bit encoding of M's start state q_0.

Phase 2: Step-by-Step Simulation Loop
  While True:
    1. If the k-bit string q on Tape 2 equals q_acc, ACCEPT and halt.
       If the k-bit string q on Tape 2 equals q_rej, REJECT and halt.
    2. Let q (in {0,1}^k) be the current state on Tape 2, and let &lt;v_1&gt; (in {0,1}^m) be the
       m-bit symbol block currently under the Tape 4 head.
    3. Scan Tape 3 (Machine Code Tape) record by record (each of length 2k + 2m + 1) to find
       the unique record whose first k + m bits match the lookup key q&lt;v_1&gt;.
    4. Read the remaining k + m + 1 bits q'&lt;v'_1&gt;&lt;D&gt; of that matched record:
       (a) Overwrite Tape 2 with the new k-bit state q'.
       (b) Overwrite the current m-bit block on Tape 4 with the new symbol encoding &lt;v'_1&gt;.
       (c) If &lt;D&gt; == 1 (Right): move the Tape 4 head m cells to the right
           (if entering uninitialized cells, initialize that m-cell block to &lt;blank&gt; = 1^m).
           If &lt;D&gt; == 0 (Left): move the Tape 4 head m cells to the left
           (if entering uninitialized cells to the left, initialize that m-cell block to 1^m).</code></pre>
`,
  questions: [
    {
      id: "ps2-q1",
      kind: "single",
      tag: "hw",
      q: String.raw`（PS2 Q1）在用多带图灵机证明可判定语言的封闭性时，“判定交集 \(L_1 \cap L_2\)”与“判定连接 \(L_1 \circ L_2\)”在遇到某一台被模拟机器进入拒绝状态 \(q_{\mathrm{rej},i}\) 时的处理有何本质区别？`,
      choices: [
        ["a", String.raw`判定 \(L_1 \cap L_2\) 时，只要 \(M_1\) 或 \(M_2\) 任一拒绝即可立即进入全局 \(q_{\mathrm{rej}}\)；而判定 \(L_1 \circ L_2\) 时，某次切分下 \(M_1\) 或 \(M_2\) 拒绝只能说明当前第 \(k\) 个切分点失败，必须转入 \(q_{\mathrm{next}}\) 测试下一个切分点，直到全部 \(n+1\) 个切分都失败才能进入全局 \(q_{\mathrm{rej}}\)`],
        ["b", String.raw`两者完全相同，只要有一台子机器拒绝就立即全局拒绝`],
        ["c", String.raw`判定 \(L_1 \cap L_2\) 需要枚举 \(n+1\) 个切分点，而判定 \(L_1 \circ L_2\) 不需要切分输入`],
        ["d", String.raw`判定 \(L_1 \circ L_2\) 时，只要 \(M_1\) 接受就可以忽略 \(M_2\) 直接全局接受`]
      ],
      answer: ["a"],
      why: String.raw`\(w \in L_1 \cap L_2\) 要求 \(w \in L_1\) 且 \(w \in L_2\)，无切分选择，一方拒绝即全盘否定；而 \(w \in L_1 \circ L_2\) 是存在性量词 \(\exists k \in \{1,\dots,n+1\}\) 使 \(u_k \in L_1 \land v_k \in L_2\)，只有当所有 \(n+1\) 种切分全部失败（标记符到达 \(\overline{\sqcup}\) 仍失败）时才能全局拒绝。`
    },
    {
      id: "ps2-q2",
      kind: "single",
      tag: "hw",
      q: String.raw`（PS2 Q2）在用单向无穷带图灵机 \(M_o\)（双轨折叠方案）模拟双向无穷带图灵机 \(M_p\) 时，若 \(M_o\) 当前处于下轨模式（状态为 \((q, 2)\)，对应 \(M_p\) 在初始格左侧区域），且 \(M_p\) 的转移函数指示向左移动（\(D = L\)），则 \(M_o\) 的物理读写头应当向哪个方向移动？`,
      choices: [
        ["a", String.raw`向右移动（\(R\)），因为 \(M_p\) 初始格左侧的单元格 \(a_{-1}, a_{-2}, \dots\) 在 \(M_o\) 的下轨上是按从左往右的顺序反向存放的`],
        ["b", String.raw`向左移动（\(L\)），与 \(M_p\) 的方向完全一致`],
        ["c", String.raw`原地不动（\(S\)）`],
        ["d", String.raw`直接跳回最左端标记 \(\#\)`]
      ],
      answer: ["a"],
      why: String.raw`在双轨折叠方案中，下轨的第 \(1, 2, 3, \dots\) 格依次存放原带左半部分的 \(a_{-1}, a_{-2}, a_{-3}, \dots\)。因此在原带左半部分继续向左走（从 \(a_{-k}\) 到 \(a_{-(k+1)}\)），对应在单向带的下轨上向右走（\(\overline{L} = R\)）！`
    },
    {
      id: "ps2-q3",
      kind: "single",
      tag: "hw",
      q: String.raw`（PS2 Q4）在通用图灵机 \(U\) 解析输入 \(\langle M \rangle w = 1^k 0 1^m 0 \langle \delta \rangle w\) 时，\(U\) 是如何在没有任何特殊分隔符的情况下，精确知道转移表编码 \(\langle \delta \rangle\) 在哪里结束、输入串 \(w\) 从哪里开始的？`,
      choices: [
        ["a", String.raw`先通过前两个 \(0\) 前面 \(1\) 的个数读出 \(k\) 和 \(m\)，然后计算出 \(\langle \delta \rangle\) 的精确总比特长度为 \(2^{k+m}(2k + 2m + 1)\)，从第二个 \(0\) 之后准确数出这么多比特即为 \(\langle \delta \rangle\)`],
        ["b", String.raw`因为输入串 \(w\) 只包含字母 \(a\) 和 \(b\)，不包含 \(0\) 和 \(1\)`],
        ["c", String.raw`因为 \(\langle \delta \rangle\) 的长度固定为 \(100\) 比特`],
        ["d", String.raw`通用图灵机通过非确定性猜测切分点`]
      ],
      answer: ["a"],
      why: String.raw`由于共有 \(|Q| \cdot |\Sigma| = 2^k \cdot 2^m = 2^{k+m}\) 个状态-符号对，且每条转移记录定长为 \(2k + 2m + 1\) 比特，一旦从前缀 \(1^k 0 1^m 0\) 中获知 \(k\) 和 \(m\)，整个转移表 \(\langle \delta \rangle\) 的总长度 \(2^{k+m}(2k + 2m + 1)\) 就完全确定了。`
    }
  ],
  cards: [
    [
      String.raw`（PS2 Q1）证明可判定语言对连接 \(L_1 \circ L_2\) 封闭时，长度为 \(n\) 的输入串 \(w\) 共有多少种切分方式？`,
      String.raw`共有 \(n + 1\) 种切分方式：\(u_k = w_1\cdots w_{k-1},\; v_k = w_k\cdots w_n\)（\(k = 1, 2, \dots, n+1\)），包含 \(u_1 = \varepsilon\) 和 \(v_{n+1} = \varepsilon\) 两种端点情形。`
    ],
    [
      String.raw`（PS2 Q2）单向无穷带图灵机模拟双向无穷带图灵机的核心构造是什么？`,
      String.raw`使用双轨字母表 \(\Gamma \times (\Gamma \cup \{\#\})\)：最左格下轨标 \(\#\)；上轨正向存放 \(a_0, a_1, a_2, \dots\)，下轨反向存放 \(a_{-1}, a_{-2}, \dots\)。在下轨运行时读写头移动方向取反（\(\overline{L}=R, \overline{R}=L\)）。`
    ]
  ]
});
