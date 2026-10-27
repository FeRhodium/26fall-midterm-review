Review.add({
  id: "ps1",
  n: 21,
  group: "ps",
  short: "PS1 · 基数、康托尔定理与图灵机设计",
  title: "Problem Set 1 精讲 · 基数辨析、有限整数序列可数性、康托尔定理与图灵机状态设计",
  meta: "对应 Lectures 1–4 · 6 道基数正误题 · ⋃ N^k 可数性三种证明 · 3 台经典图灵机形式化构造",
  sources: [
    { href: "materials/HW1.pdf", label: "Problem Set 1 (HW1.pdf)" }
  ],
  html: String.raw`
<h2>1. 第一部分（Lectures 1 &amp; 2）：基数与可数性</h2>

<h3>1.1 Problem 1.1：六道核心基数概念正误题全解</h3>
<table>
  <thead>
    <tr>
      <th>小题</th>
      <th>命题内容</th>
      <th>结论</th>
      <th>严格证明 / 反例</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>(a)</strong></td>
      <td>若 \(A \subseteq B\)，则 \(|A| \le |B|\)。</td>
      <td><strong>True</strong></td>
      <td>定义包含映射 \(\iota: A \to B\) 为 \(\iota(x) = x\)。对任意 \(x, y \in A\)，\(\iota(x) = \iota(y) \implies x = y\)，故 \(\iota\) 是单射，从而 \(|A| \le |B|\)。</td>
    </tr>
    <tr>
      <td><strong>(b)</strong></td>
      <td>若 \(A \subsetneq B\)（真子集），则 \(|A| &lt; |B|\)。</td>
      <td><strong>False</strong></td>
      <td>反例：取 \(A = \mathbb{Z}^+ = \{1, 2, 3, \dots\}\)，\(B = \mathbb{N} = \{0, 1, 2, \dots\}\)。显然 \(A \subsetneq B\)，但双射 \(f(n) = n + 1\) 证明了 \(|A| = |B|\)。无穷集可以与其真子集等势。</td>
    </tr>
    <tr>
      <td><strong>(c)</strong></td>
      <td>可数集的任意子集都是可数集。</td>
      <td><strong>True</strong></td>
      <td>设 \(B\) 可数（即 \(|B| \le |\mathbb{N}|\)，存在单射 \(g: B \to \mathbb{N}\)），且 \(A \subseteq B\)。则包含映射 \(\iota: A \to B\) 与 \(g\) 的复合 \(g \circ \iota: A \to \mathbb{N}\) 仍是单射，故 \(|A| \le |\mathbb{N}|\)，即 \(A\) 可数。</td>
    </tr>
    <tr>
      <td><strong>(d)</strong></td>
      <td>可数无穷集的任意子集都是可数无穷集。</td>
      <td><strong>False</strong></td>
      <td>反例：\(\mathbb{N}\) 是可数无穷集，但其有限子集 \(A = \{0, 1\}\) 的基数为 \(2 \ne |\mathbb{N}|\)，是有限集而非可数无穷集（“可数”包含有限与可数无穷，但“可数无穷”不包含有限集）。</td>
    </tr>
    <tr>
      <td><strong>(e)</strong></td>
      <td>每个语言 \(L \subseteq \{0, 1\}^*\) 都是可数的。</td>
      <td><strong>True</strong></td>
      <td>由 Lecture 1 定理 1.3 知 \(\{0, 1\}^*\) 是可数集（\(|\{0, 1\}^*| = |\mathbb{N}|\)）。任何单个语言 \(L\) 都是 \(\{0, 1\}^*\) 的子集，由 (c) 知 \(|L| \le |\{0, 1\}^*| = |\mathbb{N}|\)，故每个语言 \(L\) 必定可数。</td>
    </tr>
    <tr>
      <td><strong>(f)</strong></td>
      <td>全体语言的集合 \(\mathcal{L} = \{L \mid L \subseteq \{0, 1\}^*\}\) 是可数的。</td>
      <td><strong>False</strong></td>
      <td>\(\mathcal{L} = \mathcal{P}(\{0, 1\}^*)\) 是可数无穷集 \(\{0, 1\}^*\) 的幂集。由康托尔定理知 \(|\mathcal{P}(\{0, 1\}^*)| &gt; |\{0, 1\}^*| = |\mathbb{N}|\)，故全体语言的集合不可数。</td>
    </tr>
  </tbody>
</table>

<h3>1.2 Problem 1.2：全体有限非负整数序列 \(S = \bigcup_{k \in \mathbb{N}} \mathbb{N}^k\) 的可数性</h3>
<p><strong>题目</strong>：设 \(S = \bigcup_{k \in \mathbb{N}} \mathbb{N}^k\) 为所有有限长度非负整数序列的集合（其中 \(k = 0\) 对应空序列 \(()\)）。证明 \(S\) 是可数的。</p>

<details class="solve" open>
  <summary>完整解答（提供三种满分证法：分隔符编码单射、素数幂单射、权重分层枚举）</summary>
  <div>
    <p><strong>证法一（构造到已知可数集 \(\{0, 1\}^*\) 的单射 \(f: S \to \{0, 1\}^*\)）</strong>：</p>
    <ul>
      <li>对任意序列 \(s = (n_1, n_2, \dots, n_k) \in \mathbb{N}^k\)（当 \(k = 0\) 时 \(s = ()\)），将每个非负整数 \(n_i \in \mathbb{N}\) 表示为长度恰好为 \(n_i + 1\) 的全 \(1\) 串 \(1^{n_i + 1}\)，并用单个字符 \(0\) 作为相邻元素之间的分隔符兼尾标记：
      <div class="formula">\[
        f(n_1, n_2, \dots, n_k) = 1^{n_1 + 1}\, 0\, 1^{n_2 + 1}\, 0\, \cdots\, 1^{n_k + 1}\, 0 \;\in\; \{0, 1\}^*, \qquad f(()) = \varepsilon.
      \]</div>
      （例如：\((0, 2, 1) \mapsto 101110110\)，\((0) \mapsto 10\)，\(() \mapsto \varepsilon\)）。</li>
      <li><strong>单射性证明</strong>：给定像串 \(w = f(s) \in \{0, 1\}^*\)，其中 \(0\) 的总个数唯一恢复出序列长度 \(k\)；第 \(i\) 个 \(0\) 之前连续 \(1\) 的个数减去 \(1\) 唯一恢复出第 \(i\) 个分量 \(n_i\)。因此若 \(f(s) = f(s')\)，必有 \(k = k'\) 且对所有 \(1 \le i \le k\) 有 \(n_i = n'_i\)，即 \(s = s'\)。</li>
      <li>由于 \(f: S \to \{0, 1\}^*\) 是单射且 \(|\{0, 1\}^*| = |\mathbb{N}|\)，故 \(|S| \le |\{0, 1\}^*| = |\mathbb{N}|\)，即 \(S\) 可数。</li>
    </ul>

    <p><strong>证法二（素数幂单射 \(g: S \to \mathbb{N}\)）</strong>：</p>
    <ul>
      <li>记第 \(i\) 个素数为 \(p_i\)（\(p_1 = 2, p_2 = 3, p_3 = 5, \dots\)）。定义 \(g(()) = 1\)，且对 \(k \ge 1\) 定义：
      <div class="formula">\[
        g(n_1, n_2, \dots, n_k) = p_1^{n_1 + 1} p_2^{n_2 + 1} \cdots p_k^{n_k + 1}.
      \]</div>
      注意指数取 \(n_i + 1 \ge 1\)（严格正整数）是为了区分末尾补 \(0\) 的不同长度序列（如 \((2)\) 映射为 \(2^3 = 8\)，而 \((2, 0)\) 映射为 \(2^3 \cdot 3^1 = 24 \ne 8\)）。由算术基本定理，正整数分解为素数幂乘积的方式唯一，最高素因子下标唯一决定 \(k\)，各素因子指数减 \(1\) 唯一决定 \((n_1, \dots, n_k)\)，故 \(g\) 是单射。</li>
    </ul>

    <p><strong>证法三（按总权重 \(W = k + n_1 + \cdots + n_k\) 分层枚举）</strong>：</p>
    <ul>
      <li>对任意序列 \(s = (n_1, \dots, n_k) \in S\)，定义其权重 \(W(s) = k + \sum_{i=1}^k n_i \in \mathbb{N}\)。</li>
      <li>对于任意固定的非负整数 \(W \in \mathbb{N}\)，满足 \(W(s) = W\) 的序列长度必满足 \(0 \le k \le W\)，且每个分量满足 \(0 \le n_i \le W\)，因此<strong>权重等于 \(W\) 的有限集 \(S_W = \{s \in S \mid W(s) = W\}\) 只包含有限个元素</strong>！</li>
      <li>按 \(W = 0, 1, 2, \dots\) 递增（同一 \(S_W\) 内按字典序）依次列出元素：
        <ul>
          <li>\(W = 0\)：\(()\)；</li>
          <li>\(W = 1\)：\((0)\)；</li>
          <li>\(W = 2\)：\((1), (0, 0)\)；</li>
          <li>\(W = 3\)：\((2), (0, 1), (1, 0), (0, 0, 0)\)；\(\dots\)</li>
        </ul>
      因为任何元素 \(s \in S\) 都有有限权重 \(W_0 = W(s)\)，它在枚举列表中的位置至多为 \(\sum_{W=0}^{W_0} |S_W| &lt; \infty\)，故 \(S\) 可数。</li>
    </ul>
  </div>
</details>

<h3>1.3 Problem 1.3：康托尔定理 \(|\mathbb{N}| &lt; |\mathcal{P}(\mathbb{N})|\) 与 \(|X| &lt; |\mathcal{P}(X)|\)</h3>
<p><strong>标准三步证明结构（已整理于 Lecture 2 第 4 节，考试直接默写）</strong>：</p>
<ol>
  <li><strong>单射方向 \(|X| \le |\mathcal{P}(X)|\)</strong>：构造 \(g: X \to \mathcal{P}(X),\, g(x) = \{x\}\)。由 \(\{x\} = \{y\} \implies x = y\) 知 \(g\) 为单射。</li>
  <li><strong>反证无双射 \(|X| \ne |\mathcal{P}(X)|\)</strong>：假设存在双射 \(f: \mathcal{P}(X) \to X\)。定义对角子集 \(D_f = \{x \in X \mid x \notin f^{-1}(x)\} \in \mathcal{P}(X)\)，令 \(y = f(D_f) \in X\)（从而 \(f^{-1}(y) = D_f\)）。</li>
  <li><strong>导出等价矛盾</strong>：由 \(D_f\) 的定义，\(y \in D_f \iff y \notin f^{-1}(y) = D_f\)，矛盾！故不存在双射 \(f\)，从而 \(|X| &lt; |\mathcal{P}(X)|\)。</li>
</ol>

<h2>2. 第二部分（Lectures 3 &amp; 4）：图灵机行为分析与形式化设计</h2>

<h3>2.1 Problem 2.1：状态图追踪与计算历史（Computational History）</h3>
<p>在书写图灵机在输入 \(w\) 上的计算历史 \(C_0, C_1, \dots, C_k\) 时，务必严格遵守 Lecture 4 的四条准则：</p>
<ol>
  <li><strong>初始配置 \(C_0 = q_0 \sqcup w\)</strong>：读写头初始在 \(w\) 左侧紧邻的空白格 \(\sqcup\) 上；</li>
  <li><strong>配置记法 \(uqv\)</strong>：状态符号 \(q\) 紧贴在当前扫描符号 \(v_1\) 的<strong>左侧</strong>；</li>
  <li><strong>右端出界补 \(\sqcup\)</strong>：当读写头在最右端字符 \(v_1\) 上执行右移 \(R\) 时，新配置末尾必须显式补出 \(\sqcup\)（写作 \(\cdots b q' \sqcup\)）；</li>
  <li><strong>识别 vs. 判定判据</strong>：任何图灵机 \(M\) 都<strong>识别</strong>其接受语言 \(L(M) = \{w \mid M \text{ accepts } w\}\)（因此“\(M\) 是否识别某个语言？”答案永远是 <strong>Yes</strong>！）；但只有当 \(M\) <strong>在所有输入 \(w \in \{0, 1\}^*\) 上都停机（不存在任何会导致无限循环的输入串）</strong>时，\(M\) 才<strong>判定</strong> \(L(M)\)。</li>
</ol>

<h3>2.2 Problem 2.2：三台必考判定图灵机的完整设计</h3>

<details class="solve" open>
  <summary>(a) 首尾字符相同的非空二进制串：\(L_a = \{w \in \{0, 1\}^+ \mid w_1 = w_{|w|}\}\)</summary>
  <div>
    <p><strong>算法与状态设计（只需一次从左到右扫描，无需修改工作带）</strong>：</p>
    <ul>
      <li>注意：单字符串 <code>0</code> 和 <code>1</code> 的首字符与尾字符是同一个字符，因此属于 \(L_a\)（若题目附加要求 \(|w| \ge 2\)，只需将长度 1 的状态指向 \(q_{\mathrm{rej}}\)，见模拟器预设机 4）。</li>
      <li>状态集 \(Q = \{q_0, q_{\mathrm{start}}, q_{0,0}, q_{0,1}, q_{1,0}, q_{1,1}, q_{\mathrm{acc}}, q_{\mathrm{rej}}\}\)，其中状态 \(q_{a,b}\)（\(a, b \in \{0, 1\}\)）的第一下标 \(a\) 永久记录<strong>首字符 \(w_1 = a\)</strong>，第二下标 \(b\) 动态记录<strong>最近刚读到的字符为 \(b\)</strong>。</li>
      <li><strong>转移函数 \(\delta\)</strong>：
        <ul>
          <li>\(\delta(q_0, \sqcup) = (q_{\mathrm{start}}, \sqcup, R)\)（离开左端起始空白格）；</li>
          <li>在 \(q_{\mathrm{start}}\) 下：若读到 \(\sqcup\)（说明输入为空串 \(\varepsilon\)），转入 \((q_{\mathrm{rej}}, \sqcup, L)\)；若读到 \(0\)，转入 \((q_{0,0}, 0, R)\)；若读到 \(1\)，转入 \((q_{1,1}, 1, R)\)。</li>
          <li>在 \(q_{a, b}\)（\(a, b \in \{0, 1\}\)）下：
            <ul>
              <li>若读到 \(c \in \{0, 1\}\)，保持第一下标 \(a\) 不变，更新第二下标为 \(c\)：\(\delta(q_{a,b}, c) = (q_{a,c}, c, R)\)；</li>
              <li>若读到右端空白符 \(\sqcup\)（扫描结束，此时 \(b\) 即为尾字符 \(w_{|w|}\)）：当 \(a = b\) 时转入 \((q_{\mathrm{acc}}, \sqcup, L)\)，当 \(a \ne b\) 时转入 \((q_{\mathrm{rej}}, \sqcup, L)\)。</li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</details>

<details class="solve" open>
  <summary>(b) 含有相同个数 \(0\) 和 \(1\) 的二进制串：\(L_b = \{w \in \{0, 1\}^* \mid \#_0(w) = \#_1(w)\}\)</summary>
  <div>
    <p><strong>为什么不能像 (a) 那样只扫描一遍？</strong>因为输入长度任意大，有限状态控制器无法记录无界的计数差 \(\#_0(w) - \#_1(w)\)，必须利用工作带写入标记符号 \(X\) 进行<strong>配对抵消（Cross-off Pairing）</strong>！</p>
    <p><strong>工作带字母表</strong>：\(\Sigma = \{0, 1, X, \sqcup\}\)。</p>
    <p><strong>阶段式伪代码与状态机逻辑</strong>：</p>
    <ol>
      <li><strong>寻找未配对的首字符</strong>：从左端空白格 \(\sqcup\) 出发向右扫描，跳过所有已标记的 \(X\)：
        <ul>
          <li>若一路只看到 \(X\) 直到遇上右端空白 \(\sqcup\)，说明所有 \(0\) 和 \(1\) 已全部成对抵消完毕，<strong>停机接受（进入 \(q_{\mathrm{acc}}\)）</strong>；</li>
          <li>若遇到第一个未标记的 \(0\)，将其改写为 \(X\)，进入“寻找 \(1\)”状态 \(q_{\mathrm{find1}}\) 并继续向右（或先回左端再向右）扫描；</li>
          <li>若遇到第一个未标记的 \(1\)，将其改写为 \(X\)，进入“寻找 \(0\)”状态 \(q_{\mathrm{find0}}\) 并扫描。</li>
        </ul>
      </li>
      <li><strong>寻找配对字符并回退</strong>：
        <ul>
          <li>在 \(q_{\mathrm{find1}}\)（或 \(q_{\mathrm{find0}}\)）下向右扫描：若找到第一个未标记的 \(1\)（或 \(0\)），将其改写为 \(X\)，然后进入回退状态 \(q_{\mathrm{rewind}}\) 一路向左移回左端起始空白格 \(\sqcup\)，开始下一轮配对；</li>
          <li>若撞上右端空白 \(\sqcup\) 仍未找到可配对的互补字符，说明 \(0\) 和 \(1\) 数量不等，立即<strong>停机拒绝（进入 \(q_{\mathrm{rej}}\)）</strong>。</li>
        </ul>
      </li>
    </ol>
    <p><strong>停机性与正确性</strong>：每轮成功配对都会使工作带上未标记的 \(0, 1\) 总数减少 \(2\)，故至多经过 \(\lfloor |w|/2 \rfloor + 1\) 轮（总步数 \(O(|w|^2)\)）必定停机，且恰好当 \(\#_0(w) = \#_1(w)\) 时接受。</p>
  </div>
</details>

<details class="solve" open>
  <summary>(c) 二进制表示能被 \(3\) 整除的非空串：\(L_c = \{w \in \{0, 1\}^+ \mid \mathrm{val}_2(w) \equiv 0 \pmod 3\}\)</summary>
  <div>
    <p><strong>数学不变量（Horner 法则模 \(3\) 递推）</strong>：</p>
    <p>当我们在已读二进制前缀 \(u\)（代表数值 \(\mathrm{val}_2(u)\)）右侧追加一位比特 \(b \in \{0, 1\}\) 时，新数值满足：</p>
    <div class="formula">\[
      \mathrm{val}_2(ub) = 2 \cdot \mathrm{val}_2(u) + b \pmod 3.
    \]</div>
    <p>因此只需维护三个余数状态 \(r_0, r_1, r_2\)（其中 \(r_i\) 表示当前已读前缀的二进制值模 \(3\) 余 \(i\)），状态转移完全由 \((2i + b) \bmod 3\) 决定：</p>
    <table>
      <thead>
        <tr>
          <th>当前余数状态 \(r_i\)</th>
          <th>读到 \(b = 0\) 后的新状态 \(r_{(2i+0)\bmod 3}\)</th>
          <th>读到 \(b = 1\) 后的新状态 \(r_{(2i+1)\bmod 3}\)</th>
          <th>读到右端空白 \(\sqcup\) 的动作</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>\(r_0\)（余 \(0\)）</td>
          <td>\((2\times 0 + 0)\bmod 3 = 0 \implies (r_0, 0, R)\)</td>
          <td>\((2\times 0 + 1)\bmod 3 = 1 \implies (r_1, 1, R)\)</td>
          <td>\((q_{\mathrm{acc}}, \sqcup, L)\)（余数为 \(0\)，接受）</td>
        </tr>
        <tr>
          <td>\(r_1\)（余 \(1\)）</td>
          <td>\((2\times 1 + 0)\bmod 3 = 2 \implies (r_2, 0, R)\)</td>
          <td>\((2\times 1 + 1)\bmod 3 = 0 \implies (r_0, 1, R)\)</td>
          <td>\((q_{\mathrm{rej}}, \sqcup, L)\)（余数为 \(1\)，拒绝）</td>
        </tr>
        <tr>
          <td>\(r_2\)（余 \(2\)）</td>
          <td>\((2\times 2 + 0)\bmod 3 = 1 \implies (r_1, 0, R)\)</td>
          <td>\((2\times 2 + 1)\bmod 3 = 2 \implies (r_2, 1, R)\)</td>
          <td>\((q_{\mathrm{rej}}, \sqcup, L)\)（余数为 \(2\)，拒绝）</td>
        </tr>
      </tbody>
    </table>
    <p>（为排除空串 \(\varepsilon\)，从 \(q_0\) 读左端 \(\sqcup\) 先右移进入 \(q_{\mathrm{start}}\)：若 \(q_{\mathrm{start}}\) 立即读到 \(\sqcup\) 则拒绝；若读到 \(0\) 则进入 \(r_0\)，读到 \(1\) 则进入 \(r_1\)。可在 <a href="#/tm/mod3">图灵机模拟器</a> 中交互运行）。</p>
  </div>
</details>
`,
  questions: [
    {
      id: "ps1-q1",
      kind: "tf",
      tag: "hw",
      q: String.raw`（PS1 Q1(d)）判断正误：可数无穷集的任意子集都是可数无穷集（Every subset of a countably infinite set is countably infinite）。`,
      answer: ["f"],
      why: String.raw`错误！可数无穷集（如 \(\mathbb{N}\)）的子集可能是<strong>有限集</strong>（如 \(\{0, 1\}\)），有限集是可数集（countable），但不是可数无穷集（countably infinite）。`
    },
    {
      id: "ps1-q2",
      kind: "single",
      tag: "hw",
      q: String.raw`（PS1 Q2）在证明全体有限长度非负整数序列 \(S = \bigcup_{k \in \mathbb{N}} \mathbb{N}^k\) 可数时，为什么<strong>不能</strong>简单地按字典序先排完所有长度为 \(1\) 的序列 \((0), (1), (2), \dots\)，再去排长度为 \(2\) 的序列 \((0,0), (0,1), \dots\)？`,
      choices: [
        ["a", String.raw`因为长度为 \(1\) 的序列本身就有无穷多个，排在后面的长度 \(\ge 2\) 的序列将位于无穷远处，没有任何有限的序号（无法构成与 \(\mathbb{N}\) 的对应）`],
        ["b", String.raw`因为 \(\mathbb{N}^2\) 本身是不可数集合`],
        ["c", String.raw`因为空序列 \(()\) 不属于 \(S\)`],
        ["d", String.raw`因为非负整数不能转化为二进制串`]
      ],
      answer: ["a"],
      why: String.raw`合法的枚举要求集合中的<strong>每一个元素都必须出现在某个有限的位置 \(m \in \mathbb{N}\) 上</strong>。因此必须按有限层（如总权重 \(W = k + n_1 + \cdots + n_k = 0, 1, 2, \dots\)）组织枚举，使得每一层只有有限个序列。`
    },
    {
      id: "ps1-q3",
      kind: "single",
      tag: "hw",
      q: String.raw`（PS1 §2.2(c)）在判定“二进制串表示的整数是 3 的倍数”的图灵机中，假设当前已读前缀的数值模 3 余 2（处于状态 \(r_2\)），此时读写头读到下一个字符为 \(0\)，控制器应当转移到哪个余数状态？`,
      choices: [
        ["a", String.raw`\(r_1\)（因为 \((2 \times 2 + 0) \bmod 3 = 4 \bmod 3 = 1\)）`],
        ["b", String.raw`\(r_2\)（因为读到 \(0\) 不改变余数）`],
        ["c", String.raw`\(r_0\)（因为 \(2 + 0\) 变成了偶数）`],
        ["d", String.raw`立即进入 \(q_{\mathrm{rej}}\)`]
      ],
      answer: ["a"],
      why: String.raw`在二进制表示末尾追加一个 \(0\) 相当于将原数值乘以 \(2\)。当原数值 \(\equiv 2 \pmod 3\) 时，乘以 \(2\) 后变为 \(2 \times 2 = 4 \equiv 1 \pmod 3\)，故转移到 \(r_1\)。`
    }
  ],
  cards: [
    [
      String.raw`（PS1 Q2）如何构造从全体有限非负整数序列 \(S = \bigcup_{k\in\mathbb{N}} \mathbb{N}^k\) 到 \(\{0,1\}^*\) 的单射？`,
      String.raw`将每个分量 \(n_i \in \mathbb{N}\) 编码为 \(n_i+1\) 个连续的 \(1\)，并用 \(0\) 分隔：\(f(n_1,\dots,n_k) = 1^{n_1+1}0\,1^{n_2+1}0\cdots 1^{n_k+1}0\)，空序列映射为 \(\varepsilon\)。`
    ],
    [
      String.raw`（PS1 §2.2）判定二进制串是否为 3 的倍数的状态转移递推公式是什么？`,
      String.raw`维护模 3 余数状态 \(r_i\)（\(i \in \{0,1,2\}\)）。读入比特 \(b \in \{0,1\}\) 时，新余数为 \((2i + b) \bmod 3\)。`
    ]
  ]
});
