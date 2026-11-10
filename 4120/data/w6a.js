Review.add({
  id: "w6a", group: "lecture", n: 1,
  short: "W6A 摊还分析",
  title: "Week 6A · 摊还分析（Amortized Analysis）：四种方法与经典数据结构",
  meta: "Week 6 Lecture 1 · Aggregate / Accounting / Charging / Potential",
  sources: [
    { label: "L04_1 Amortized Analysis 课件 PDF", href: "materials/w6/L04_1_amortized_analysis_2026.pdf" },
    { label: "Pre-lecture: Stack & Potential 讲义", href: "materials/w6/csc4120-amortized-potential-stack-portable.md" },
    { label: "HW5 官方解答 PDF", href: "materials/hw/HW5_Solution.pdf" }
  ],
  html: String.raw`
<p class="lede">单个操作的最坏情况代价往往过于悲观——昂贵操作（如哈希表扩容、栈清空、2-3 树连环分裂）之所以昂贵，是因为前面已经执行了大量廉价操作“攒下了势能”。摊还分析（Amortized Analysis）不涉及任何概率假设，而是在<b>最坏情况操作序列</b>下，为每类操作指定一个固定的“摊还价格（Amortized Cost）”，使得任意时刻累计支付的摊还总价始终覆盖累计真实总代价。</p>

<h2>1. 摊还代价的形式化定义</h2>
<ul>
<li>设系统从初始状态 \(\text{DS}_0\) 出发，依次执行操作序列 \(\text{op}_1, \text{op}_2, \dots\)，第 \(t\) 步的实际代价（Actual Cost）记为 \(c(t)\)，我们为其设定的摊还代价（Amortized Cost）记为 \(a(t)\)。</li>
<li><b>核心覆盖不等式（前缀合法性条件）</b>：对于<b>任意合法操作序列</b>以及该序列的<b>任意前缀长度 \(t \ge 1\)</b>，必须满足：
\[\sum_{t'=1}^{t} c(t') \le \sum_{t'=1}^{t} a(t')\]
等价于维护一个初始余额为 0 的银行账户：每次操作支付 \(a(t)\)，扣除实际开销 \(c(t)\) 后，剩余的 \(a(t)-c(t)\) 存入银行（若 \(a(t)&lt;c(t)\) 则从银行支取补贴），要求<b>在任何时刻 \(t\) 银行账户余额绝不能为负</b>。</li>
<li><b>多操作类型定价</b>：若数据结构支持 \(k\) 种操作 \(\text{op}_1,\dots,\text{op}_k\)，给定一组价格向量 \((a_1,\dots,a_k)\)，只要对任意混合操作序列的任意前缀都有 \(\sum c(t') \le \sum a_{\text{type}(t')}\)，则 \((a_1,\dots,a_k)\) 就是合法的摊还界。<b>合法的摊还价格向量不是唯一的</b>（例如 2-3 树既可以定为“插入 \(O(\log n)\)、删除 \(O(\log n)\)”，也可以定为“插入 \(O(\log n^*)\)、删除 \(0\)”）。</li>
</ul>

<h2>2. 四种摊还分析方法对比</h2>
<table>
<thead><tr><th>方法名称</th><th>核心思路</th><th>证明步骤与要点</th><th>典型适用场景</th></tr></thead>
<tbody>
<tr><td><b>聚合分析（Aggregate Method）</b></td><td>直接求任意 \(n\) 次操作的最坏总实际代价上界 \(T(n)\)</td><td>证明对所有 \(n\)，前 \(n\) 次操作总代价 \(T(n) \le a\cdot n\)，从而单次摊还代价 \(a = T(n)/n\)</td><td>仅插入的动态表倍增、栈的 Push + Multipop/Empty</td></tr>
<tr><td><b>记账法（Accounting Method）</b></td><td>平时操作除了付自身成本外，额外向银行存入固定硬币 \(c=\Theta(1)\)</td><td>证明当昂贵操作发生时，银行里自上次昂贵事件以来攒下的硬币总数足以支付本次开销</td><td>动态表倍增（每次插入存 2 枚硬币）</td></tr>
<tr><td><b>回溯收费法（Charging Method）</b></td><td>昂贵操作发生时，将其代价<b>向过去（绝不向未来！）</b>分摊给导致它的历史操作</td><td>\(a(t) = c(t) - \text{向过去收费} + \text{被未来收费}\)。需证：① 每次昂贵事件有足够多历史操作可分摊；② 每个历史操作在全生命周期内<b>最多被收费常数次</b></td><td>HW5 Q7(a) 动态表倍增与缩半、HW5 Q7(b) 2-3 树 0 成本删除</td></tr>
<tr><td><b>势函数法（Potential Method）</b></td><td>将银行存款建模为数据结构当前状态的函数 \(\Phi(\text{DS}) \ge 0\)</td><td>定义 \(a(t) = c(t) + \Phi(\text{DS}_t) - \Phi(\text{DS}_{t-1})\)。望远镜求和得 \(\sum_{t=1}^T a(t) = \sum_{t=1}^T c(t) + \Phi(\text{DS}_T) - \Phi(\text{DS}_0)\)。若 \(\Phi(\text{DS}_0)=0\) 且 \(\Phi\ge 0\)，则总摊还必覆盖总实际代价</td><td>二进制计数器、2-3 树分裂次数、动态表扩缩容</td></tr>
</tbody>
</table>

<h2>3. 课件与作业五大必考模型精讲</h2>

<h3>模型一：栈的 <code>push(x)</code> 与 <code>empty()</code>（Pre-lecture 核心例）</h3>
<ul>
<li><b>设定</b>：栈初始为空。<code>push(x)</code> 压入 1 个元素，实际代价 \(1\)；<code>empty()</code> 清空栈中全部 \(k\) 个元素，实际代价 \(k\)（空栈时为 \(0\)）。</li>
<li><b>朴素最坏界 vs 真实界</b>：单次 <code>empty()</code> 最坏代价为 \(O(n)\)，朴素相乘得 \(n\) 次操作 \(O(n^2)\)。但每个元素最多被 <code>push</code> 一次、被 <code>empty</code> 移除一次，故任意 \(n\) 次操作总代价 \(\le 2 \times (\#\text{pushes}) \le 2n = O(n)\)。</li>
<li><b>势函数证明</b>：定义势函数 \(\Phi(\text{DS}) = \text{当前栈中的元素个数}\)。显然初始空栈 \(\Phi(\text{DS}_0)=0\) 且始终 \(\Phi \ge 0\)：
  <ul>
  <li><b><code>push</code></b>：实际代价 \(c=1\)，栈元素增加 1（\(\Delta\Phi = +1\)），故 \(a_{\text{push}} = 1 + 1 = 2 = O(1)\)。</li>
  <li><b><code>empty</code>（栈中有 \(k\) 个元素）</b>：实际代价 \(c=k\)，清空后 \(\Phi\) 从 \(k\) 变为 \(0\)（\(\Delta\Phi = -k\)），故 \(a_{\text{empty}} = k + (0 - k) = 0 = O(1)\)。</li>
  </ul>
</li>
<li><b>课件变体（5 槽位内存池）</b>：容量为 5 的槽位，插入空槽代价 1，当 5 个槽全满后再插入时需先清空全部 5 个旧元素（代价 5）再插入（代价 1，共 6）。取 \(\Phi = \text{当前已满槽位数}\)，则普通插入 \(a = 1 + 1 = 2\)，满时插入 \(a = 6 + (1 - 5) = 2\)，恒为 \(O(1)\)。</li>
</ul>

<h3>模型二：二进制计数器递增（Binary Counter Increment）</h3>
<ul>
<li><b>设定</b>：从全 0 开始反复执行 <code>increment</code>。若当前二进制数末尾有 \(k\) 个连续的 1（trailing 1 bits，例如 <code>000110101111</code> 有 \(k=4\) 个末尾 1），加 1 会把这 \(k\) 个 1 全翻成 0，并把紧邻的那个 0 翻成 1，实际代价为 \(c(t) = \Theta(1 + k)\)。</li>
<li><b>势函数证明</b>：什么代表未来的高代价风险？计数器里的 <code>1</code> 越多，未来进位清零的开销越大。定义：
\[\Phi(\text{DS}) = c \cdot (\text{计数器中 1 的个数}), \quad \Phi(\text{DS}_0) = 0\]
一次末尾有 \(k\) 个 1 的递增操作会把 \(k\) 个 1 变成 0，并把 1 个 0 变成 1，因此 1 的净变化量为 \(-k + 1\)：
\[\Delta\Phi = c(-k + 1)\]
故单次递增的摊还代价为：
\[a(t) = \Theta(1 + k) + c(-k + 1) = O(1)\]
只需选取常数 \(c\) 等于 \(\Theta(1+k)\) 中 \(k\) 的比例系数，即可精确抵消 \(k\)，得到 \(a(t) = O(1)\)。</li>
</ul>

<h3>模型三：2-3 树插入的分裂次数（Amortized Splits in 2-3 Trees）</h3>
<ul>
<li><b>设定</b>：2-3 树的每个内部节点要么是 2-节点（1 个键、2 个孩子），要么是 3-节点（2 个键、3 个孩子，即满节点）。高度为 \(O(\log n)\)，单次插入在最坏情况下可能从叶子一路向上连环分裂到根，产生 \(O(\log n)\) 次分裂（splits）。</li>
<li><b>为什么均摊只有 \(O(1)\) 次分裂？</b>因为只有<b>满节点（3-节点）</b>才会发生分裂！每次分裂都会把一个现有的 3-节点拆成两个 2-节点（使 3-节点数减少 1），而向父节点提升键至多在停止处产生 1 个新的 3-节点。</li>
<li><b>势函数证明</b>：定义 \(\Phi(\text{DS}) = \text{树中 3-节点的个数}\ge 0\)，空树 \(\Phi(\text{DS}_0)=0\)。若某次插入发生了 \(s\) 次分裂，则每发生 1 次分裂就消灭 1 个 3-节点，最后至多新增 1 个 3-节点，因此：
\[\Delta\Phi \le 1 - s\]
于是本次插入的摊还分裂次数为：
\[a = s + \Delta\Phi \le s + (1 - s) = 1 = O(1)\]
</li>
</ul>

<h3>模型四：动态表倍增与缩半（Table Doubling &amp; Halving，HW5 Q7a）</h3>
<ul>
<li><b>设定</b>：哈希表/动态数组有 \(m\) 个槽位、\(n\) 个元素。① 当插入导致 \(n = m\) 时，表大小倍增为 \(2m\)，重哈希实际代价 \(\Theta(m) = cm\)；② 当删除导致 \(n = m/4\)（即 \(1/4\) 满）时，表大小缩半为 \(m/2\)，重哈希实际代价 \(\Theta(m) = cm\)。（注意：不能在 \(n=m/2\) 时立刻缩半，否则在 \(m/2\) 边界交替插入删除会每次都触发 \(\Theta(m)\) 重建！）</li>
<li><b>用回溯收费法（Charging Method）证明插入和删除均摊皆为 \(O(1)\)</b>：
  <ol>
  <li><b>倍增事件 \(m \to 2m\)（此时 \(n=m\)）</b>：考察上一次重建（倍增或缩半）结束得到大小为 \(m\) 的表的那一刻，当时表中恰有 \(m/2\) 个元素。如今元素涨到了 \(m\)，说明两次重建之间<b>至少发生了 \(m/2\) 次插入</b>。将本次倍增代价 \(cm\) 平摊给这 \(m/2\) 次插入，每次插入至多被追加收费 \(\frac{cm}{m/2} = 2c = O(1)\)，且这些插入只为这一次倍增买单（只被收费一次）。</li>
  <li><b>缩半事件 \(m \to m/2\)（此时 \(n=m/4\)）</b>：考察上一次重建结束产生大小为 \(m\) 的表的那一刻——无论上次是倍增（从 \(m/2\) 扩到 \(m\)，含 \(m/2\) 个元素）还是缩半（从 \(2m\) 缩到 \(m\)，含 \(2m/4 = m/2\) 个元素），当时表中都恰有 \(m/2\) 个元素！如今只剩 \(m/4\) 个元素，说明两次事件之间<b>至少发生了 \(m/2 - m/4 = m/4\) 次删除</b>。将本次缩半代价 \(cm\) 平摊给这 \(m/4\) 次删除，每次删除至多被追加收费 \(\frac{cm}{m/4} = 4c = O(1)\)，且每次删除最多被收费一次。</li>
  </ol>
</li>
</ul>

<h3>模型五：2-3 树“插入 \(O(\log n)\)、删除 \(0\)”定价（课件 Slide 7 &amp; HW5 Q7b）</h3>
<ul>
<li><b>课件全局上界视角（最大规模 \(n^*\)）</b>：任意含 \(t\) 次建树、\(i\) 次插入、\(d\) 次删除的合法序列必满足 \(d \le i\)。每次插入或删除实际代价 \(\le c_2 \log n^*\)，故总实际代价 \(\le t c_1 + (i+d) c_2 \log n^* \le t c_1 + i(2c_2 \log n^*) + d\cdot 0\)。</li>
<li><b>HW5 Q7(b) 依赖当前规模 \(n\) 的 Charging 证明</b>：当一棵含 \(n\) 个键的 2-3 树执行删除（使规模从 \(n \to n-1\)，实际代价 \(O(\log n)\)）时，将该删除的 \(O(\log n)\) 成本<b>回溯收费给历史上最近一次使树规模从 \(n-1\) 增长到 \(n\) 的那次插入操作</b>！为什么每次插入最多只会被收费一次？因为一旦那次 \(n-1\to n\) 的插入被本次 \(n\to n-1\) 的删除收费后，树规模已降回 \(n-1\)；若未来还要发生另一次从 \(n\to n-1\) 的删除，中间必定先发生了一次<b>新的</b> \(n-1\to n\) 插入来承担下一次删除的费用。因此每次插入最多承担自身 \(O(\log n)\) 加一次同规模删除的 \(O(\log n)\)，删除摊还代价为 \(0\)。</li>
</ul>

<h2>考前清单</h2>
<ul>
<li>默写势函数法公式 \(a(t) = c(t) + \Phi(\text{DS}_t) - \Phi(\text{DS}_{t-1})\) 及要求 \(\Phi(\text{DS})\ge 0,\ \Phi(\text{DS}_0)=0\) 的原因。</li>
<li>解释为什么动态表要在 \(1/4\) 满而不是 \(1/2\) 满时缩半，并能写出 Charging Method 证明（\(m/2 \to m/4\) 必有 \(\ge m/4\) 次删除）。</li>
<li>掌握二进制计数器（\(\Phi = c\cdot\#1\text{s}\)）与 2-3 树分裂（\(\Phi = \#\text{3-nodes}\)）的势函数构造。</li>
</ul>
`,
  questions: [
    { id: "q1", tag: "slide", kind: "single", q: String.raw`在势函数法（Potential Method）中，设第 \(t\) 次操作的实际代价为 \(c(t)\)，操作前后的势函数分别为 \(\Phi(\text{DS}_{t-1})\) 与 \(\Phi(\text{DS}_t)\)，且 \(\Phi(\text{DS}_0)=0\)。要保证对任意长度 \(T\) 的操作序列都有 \(\sum_{t=1}^T a(t) \ge \sum_{t=1}^T c(t)\)，必须满足的条件是`, choices: [
      ["a", String.raw`\(a(t) = c(t) + \Phi(\text{DS}_t) - \Phi(\text{DS}_{t-1})\) 且对一切状态有 \(\Phi(\text{DS}) \ge 0\)`],
      ["b", String.raw`\(a(t) = c(t) + \Phi(\text{DS}_{t-1}) - \Phi(\text{DS}_t)\) 且 \(\Phi(\text{DS})\) 单调递增`],
      ["c", String.raw`每一步都必须有 \(\Delta\Phi = \Phi(\text{DS}_t) - \Phi(\text{DS}_{t-1}) \ge 0\)`],
      ["d", String.raw`\(\Phi(\text{DS}_T) = 0\) 对所有 \(T\) 成立`]
    ], answer: ["a"], why: String.raw`由望远镜求和 \(\sum_{t=1}^T a(t) = \sum_{t=1}^T c(t) + \Phi(\text{DS}_T) - \Phi(\text{DS}_0)\)。当 \(\Phi(\text{DS}_0)=0\) 且任意状态的 \(\Phi(\text{DS}_T)\ge 0\) 时，总摊还代价恒大于等于总实际代价；单步的 \(\Delta\Phi\) 完全可以为负（昂贵操作释放势能）。` },
    { id: "q2", tag: "slide", kind: "single", q: String.raw`对二进制计数器执行一次 <code>increment</code> 操作，若操作前该二进制数末尾有 \(k\) 个连续的 1（如 <code>...01111</code> 中 \(k=4\)），设势函数 \(\Phi\) 为计数器中 1 的个数，则本次操作的 \(\Delta\Phi\) 为`, choices: [
      ["a", String.raw`\(k + 1\)`],
      ["b", String.raw`\(-k + 1\)`],
      ["c", String.raw`\(-k\)`],
      ["d", String.raw`\(1\)`]
    ], answer: ["b"], why: String.raw`末尾的 \(k\) 个 1 全部进位变为 0（减少 \(k\) 个 1），而原本紧邻它们的那个 0 变为 1（增加 1 个 1），故 \(\Delta\Phi = -k + 1\)。` },
    { id: "q3", tag: "slide", kind: "single", q: String.raw`在证明 2-3 树每次插入的摊还分裂次数（amortized number of splits）至多为 \(1\) 时，课件选取的势函数 \(\Phi(\text{DS})\) 是`, choices: [
      ["a", "树中叶子节点的个数"],
      ["b", "树的高度 \(h\)"],
      ["c", "树中 3-节点（即存有 2 个键的满节点）的个数"],
      ["d", "树中 2-节点的个数"]
    ], answer: ["c"], why: String.raw`只有满节点（3-节点）才会分裂。每次分裂将一个 3-节点拆成两个 2-节点（使 \(\Phi\) 减 1），而插入结束时至多新形成 1 个 3-节点，故 \(\Delta\Phi \le 1 - s\)，摊还分裂数 \(s + \Delta\Phi \le 1\)。` },
    { id: "q4", tag: "hw", kind: "tf", q: String.raw`在动态表中，如果我们在表满（\(n=m\)）时倍增为 \(2m\)，并在表半满（\(n=m/2\)）时立刻缩半为 \(m/2\)，那么任意插入和删除序列的均摊代价仍然是 \(O(1)\)。`, answer: ["f"], why: String.raw`错！若在 \(n=m/2\) 时缩半，当表刚从 \(m/2\) 倍增到 \(m\)（此时有 \(n=m/2\) 个元素）后，交替执行一次删除、一次插入就会在 \(m/2\) 边界反复触发倍增和缩半，每次操作实际代价均为 \(\Theta(m)\)，均摊 \(\Theta(n)\)。必须在 \(n=m/4\) 时才缩半。` },
    { id: "q5", tag: "hw", kind: "single", q: String.raw`（HW5 Q7a）动态表在 \(n=m\) 时倍增为 \(2m\)，在 \(n=m/4\) 时缩半为 \(m/2\)。当一次缩半事件 \(m \to m/2\) 发生时，自上一次表大小变为 \(m\) 的重建事件（无论是倍增还是缩半）以来，至少发生了多少次删除操作？`, choices: [
      ["a", String.raw`\(m/2\) 次`],
      ["b", String.raw`\(m/4\) 次`],
      ["c", String.raw`\(3m/4\) 次`],
      ["d", String.raw`\(1\) 次`]
    ], answer: ["b"], why: String.raw`上一次重建产生大小为 \(m\) 的表时（无论是从 \(m/2\) 倍增上来，还是从 \(2m\) 在 \(1/4\) 满时缩半下来），表中都恰好有 \(m/2\) 个元素。要降到 \(m/4\) 个元素触发本次缩半，期间必然至少发生了 \(m/2 - m/4 = m/4\) 次删除。` },
    { id: "q6", tag: "hw", kind: "single", q: String.raw`（HW5 Q7b）在 2-3 树上用 Charging Method 证明“插入摊还代价 \(O(\log n)\)、删除摊还代价 \(0\)”（\(n\) 为操作时的树规模）时，一次将树规模从 \(n\) 减至 \(n-1\) 的删除操作应当把它的 \(O(\log n)\) 实际代价分摊给谁？`, choices: [
      ["a", "分摊给树中最早的那次插入操作"],
      ["b", "分摊给历史上最近一次使树规模从 \(n-1\) 增长到 \(n\) 的插入操作"],
      ["c", "分摊给未来下一次使树规模从 \(n-1\) 增长到 \(n\) 的插入操作"],
      ["d", "平均分摊给过去所有的 \(n\) 次插入操作"]
    ], answer: ["b"], why: String.raw`Charging Method 只能向过去收费，不能向未来收费。将 \(n\to n-1\) 的删除费用收给最近一次 \(n-1\to n\) 的插入，可保证该插入最多只被同规模的删除收费一次且两次操作的 \(\log n\) 完全同阶。` }
  ],
  cards: [
    [String.raw`摊还代价（Amortized Cost）的核心前缀不等式`, String.raw`对任意操作序列及任意前缀 \(t\)，\(\sum_{t'=1}^t c(t') \le \sum_{t'=1}^t a(t')\)（银行账户余额永不小于 0）。`],
    [String.raw`势函数法（Potential Method）公式与合法条件`, String.raw`\(a(t) = c(t) + \Phi(\text{DS}_t) - \Phi(\text{DS}_{t-1})\)；要求 \(\Phi(\text{DS}_0)=0\) 且对一切状态 \(\Phi(\text{DS})\ge 0\)。`],
    [String.raw`二进制计数器递增的势函数与 \(\Delta\Phi\)`, String.raw`\(\Phi = c\cdot(\text{1 的个数})\)；若有 \(k\) 个末尾 1，实际代价 \(\Theta(1+k)\)，\(\Delta\Phi = c(-k+1)\)，均摊 \(O(1)\)。`],
    [String.raw`2-3 树分裂次数 \(O(1)\) 的势函数`, String.raw`\(\Phi = \text{3-节点（满节点）个数}\)；发生 \(s\) 次分裂时 \(\Delta\Phi \le 1 - s\)，故摊还分裂数 \(s + \Delta\Phi \le 1\)。`],
    [String.raw`动态表倍增与缩半的触发阈值及原因`, String.raw`满 \(n=m\) 倍增至 \(2m\)（攒下 \(\ge m/2\) 次插入），\(n=m/4\) 缩半至 \(m/2\)（从上次重建后的 \(m/2\) 降到 \(m/4\) 攒下 \(\ge m/4\) 次删除）。`],
    [String.raw`2-3 树如何用 Charging Method 实现删除摊还代价为 0？`, String.raw`将规模 \(n\to n-1\) 的删除代价 \(O(\log n)\) 回溯收费给历史上最近一次使规模从 \(n-1\to n\) 的插入操作。`]
  ]
});
