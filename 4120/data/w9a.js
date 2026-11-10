Review.add({
  id: "w9a", group: "lecture", n: 7,
  short: "W9A Huffman 与集合覆盖",
  title: "Week 9A · 贪心算法：Huffman 编码、信息熵与最小集合覆盖（Set Cover）",
  meta: "Week 9 Lecture 1 · Huffman Coding / Entropy / Set Cover Approximation",
  sources: [
    { label: "Huffman & Set Cover 2026 PDF", href: "materials/w9/Huffman_2026.pdf" },
    { label: "Pre-lecture: Huffman 讲义", href: "materials/w9/csc4120-huffman-portable.md" },
    { label: "交互单步器：Huffman 编码树代价", href: "materials/w9/huffman-cost-standalone.html" }
  ],
  html: String.raw`
<p class="lede">贪心算法（Greedy Algorithm）每一步只做当前看起来最好的局部选择（myopic behavior）。本讲研究两个典型案例：第一，贪心策略能严格达到全局最优的 <b>Huffman 前缀编码</b>（含编码树代价的内部节点求和恒等式、最优子结构及 Shannon 信息熵下界）；第二，贪心策略不能达到精确最优、但能保证 \(\ln n\) 近似比的 NP-hard 问题——<b>最小集合覆盖（Min Set Cover）</b>。</p>

<h2>1. 前缀码（Prefix-Free Code）与满二叉树表示</h2>
<ul>
<li><b>为什么要使用变长编码？</b>例如一段长 \(T = 1.3\times 10^8\) 的音频采样序列只取 \(\Gamma = \{A, B, C, D\}\) 四个符号。定长编码（每个符号 2 bits）固定消耗 \(2.6\times 10^8\) bits；若给高频符号分配短码字、低频符号分配长码字，可大幅压缩总体积。</li>
<li><b>歧义问题与前缀自由性质（Prefix-free Property）</b>：
  <ul>
  <li>若令 \(A = 0, B = 01, C = 1, D = 11\)，则比特流 <code>01</code> 既可以解码为单个符号 \(B\)，也可以解码为 \(A C\)——产生歧义！原因是 \(A\) 的码字 <code>0</code> 是 \(B\) 的码字 <code>01</code> 的<b>前缀（prefix）</b>。</li>
  <li><b>前缀码定义</b>：没有任何一个符号的码字是另一个符号码字的前缀。只有满足前缀自由性质，解码器才能从左到右不回溯、无前瞻（without looking ahead）地唯一解码。</li>
  <li><b>二叉树对应关系</b>：任何前缀码都一一对应一棵<b>符号仅位于叶子节点（leaves）的二叉树</b>（从根到叶子的路径上，左走记 0、右走记 1）。<b>最优前缀码对应的二叉树必定是满二叉树（Full Binary Tree，每个内部节点恰有 0 或 2 个孩子）</b>——若某个内部节点只有 1 个孩子，删去该节点可使其子树所有叶子深度减 1，严格降低总代价。</li>
  </ul>
</li>
</ul>

<h2>2. 编码树代价的两种等价计算公式（Pre-lecture &amp; Slide 6 核心）</h2>
<p>设符号 \(1, \dots, n\) 在文件中出现的频率（次数）分别为 \(f_1, \dots, f_n\)，在编码树 \(T\) 中的叶子深度（即码字长度）分别为 \(\text{depth}(1), \dots, \text{depth}(n)\)。定义每个<b>内部节点（internal node，含根节点）</b>的频率为其子树下所有叶子频率之和：</p>
<ul>
<li><b>定理（叶子求和 = 内部节点求和 = 合并代价之和）</b>：
\[\text{Cost}(T) = \sum_{i=1}^n f_i \cdot \text{depth}(i) = \sum_{v \in \text{Internal}(T)} f(v)\]
</li>
<li><b>为什么两者恒相等？</b>考察任意一个叶子 \(i\)（频率 \(f_i\)）：从叶子 \(i\) 向上走到根节点的路径上，恰好经过 \(\text{depth}(i)\) 个内部节点，因此 \(f_i\) 在右侧“所有内部节点频率之和”中恰好被累加了 \(\text{depth}(i)\) 次！</li>
<li><b>自底向上合并视角（Building by Merges）</b>：初始有 \(n\) 棵单叶子树；每次合并（merge）将两棵树挂在一个新内部节点下，新内部节点的频率为两棵树频率之和，且<b>每次合并刚好把该新内部节点的频率加进总代价</b>（共做 \(n-1\) 次合并）。越早被合并的符号，在后续每一次合并中都会被再次计入，因此<b>频率越小的符号应当越早合并（放在越深处）</b>！
  <ul>
  <li><i>算例 1（Pre-lecture）</i>：\(A:8, B:4, C:2, D:2\)（总计 16）。定长深度 2 树：内部节点为 \(A+B=12, C+D=4, \text{Root}=16\)，代价 \(12+4+16 = 32\)。若按 \(C+D=4 \to B+CD=8 \to A+BCD=16\) 合并，代价为 \(4 + 8 + 16 = 28\)（码字 \(A:0, B:10, C:110, D:111\)）。</li>
  <li><i>算例 2</i>：\(A:1, B:2, C:3, D:4\)。最优合并：\(A+B=3 \to AB+C=6 \to ABC+D=10\)，最小总代价 \(3 + 6 + 10 = 19\)（若先合最大的 \(C+D=7 \to B+CD=9 \to A+BCD=10\) 则代价高达 \(7+9+10 = 26\)）。</li>
  <li><i>算例 3（CLRS / Pre-lecture 6 符号经典题）</i>：\(A:45, B:13, C:12, D:16, E:9, F:5\)（总频数 100）。合并过程：
    <ol>
    <li>\(F(5) + E(9) = 14\)</li>
    <li>\(C(12) + B(13) = 25\)</li>
    <li>\(FE(14) + D(16) = 30\)</li>
    <li>\(CB(25) + FED(30) = 55\)</li>
    <li>\(A(45) + CBFED(55) = 100\)</li>
    </ol>
    总代价 \(= 14 + 25 + 30 + 55 + 100 = \mathbf{224}\)（相比 3-bit 定长编码的 \(300\) 节省了约 25%）。</li>
  </ul>
</li>
</ul>

<h2>3. Huffman 贪心算法与最优性（Slide 7）</h2>
<ul>
<li><b>贪心规则与最优子结构</b>：设频率满足 \(f_1 \le f_2 \le f_3 \le \dots \le f_n\)：
  <ol>
  <li><b>贪心选择性质（交换论证）</b>：存在一棵最优编码树 \(T\)，使得频率最小的两个符号 \(f_1, f_2\) 位于最深层且互为兄弟叶子（构成最低的 2-subtree）。（若最深层兄弟不是 \(f_1, f_2\)，将它们与 \(f_1, f_2\) 交换，因被换到深处的频率更小，总代价只减不增。）</li>
  <li><b>最优子结构</b>：将 \(f_1, f_2\) 合并为一个频率为 \(f' = f_1 + f_2\) 的新超级符号后，原树 \(T\) 缩减为 \(n-1\) 个符号 \(\{f_1+f_2, f_3, \dots, f_n\}\) 的编码树 \(T'\)，满足：
  \[\text{Cost}(T) = (f_1 + f_2) + \text{Cost}(T')\]
  因此 \(T\) 最优 \(\iff\) 缩减树 \(T'\) 对新集合最优！</li>
  </ol>
</li>
<li><b>算法与复杂度</b>：将 \(n\) 个频率放入最小堆（Min-Heap，建堆 \(O(n)\)）；重复 \(n-1\) 次：执行两次 <code>Extract-Min</code> 取出最小的两个频率 \(x, y\)，创建一个频率为 \(x+y\) 的父节点并 <code>Insert</code> 回最小堆。共 \(n-1\) 轮，每轮 \(O(\log n)\)，<b>总时间复杂度 \(O(n \log n)\)</b>。</li>
</ul>

<h2>4. Shannon 信息熵（Entropy）与压缩极限（Slide 9–10）</h2>
<ul>
<li><b>信息熵定义</b>：设信源有 \(n\) 个可能符号 \(s_1, \dots, s_n\)，出现概率分别为 \(p_1, \dots, p_n\)（\(\sum_{i=1}^n p_i = 1\)）。在 \(m\) 次独立抽样中期望频数为 \(f_i = m p_i\)。Shannon 定理指出：概率为 \(p_i\) 的事件携带的信息量为 \(\log_2(1/p_i)\) bits，该分布的<b>信息熵（Entropy）</b>定义为每个符号的平均最少比特数下界：
\[H(p_1, \dots, p_n) = \sum_{i=1}^n p_i \log_2 \frac{1}{p_i} = -\sum_{i=1}^n p_i \log_2 p_i\]
任何无损编码编码 \(m\) 个符号的期望总比特数至少为 \(m H = \sum_{i=1}^n f_i \log_2(1/p_i)\)。分布越随机（越接近均匀分布），熵越大，越难压缩；越可预测，熵越小，越容易压缩。</li>
<li><b>何时 Huffman 编码能精确达到信息熵下界？（DPV 5.19）</b>
  <ul>
  <li>当且仅当每个符号的概率都是 \(2\) 的整数次幂的倒数，即 <b>\(p_i = 2^{-k_i}\)（\(k_i \in \mathbb{Z}^+\)）</b> 时，Huffman 编码给符号 \(i\) 分配的码长恰好等于 \(k_i = \log_2(1/p_i)\)，平均码长精确等于信息熵 \(H\)！</li>
  <li><i>课件算例（Slide 10）</i>：\(p_A = 2^{-1},\ p_D = 2^{-2},\ p_B = p_C = 2^{-3}\)。合并过程：\(\{2^{-3}, 2^{-3}, 2^{-2}, 2^{-1}\} \to \{2^{-2}, 2^{-2}, 2^{-1}\} \to \{2^{-1}, 2^{-1}\} \to \{1\}\)，码长分别为 \(1, 2, 3, 3\)，平均码长 \(= \frac{1}{2}\cdot 1 + \frac{1}{4}\cdot 2 + \frac{1}{8}\cdot 3 + \frac{1}{8}\cdot 3 = 1.75\text{ bits} = H\)。</li>
  </ul>
</li>
</ul>

<h2>5. 最小集合覆盖（Min Set Cover）与贪心 \(\ln n\) 近似比证明</h2>
<ul>
<li><b>问题定义</b>：给定全集 \(B\)（含 \(|B| = n\) 个元素，如 \(n\) 个城镇）以及一族子集 \(S_1, \dots, S_m \subseteq B\)（每个子集代表在一处建校可覆盖的 30km 内城镇），求最少数量的子集使其并集等于 \(B\)。</li>
<li><b>贪心算法</b>：当还有未覆盖元素时，每一步挑选<b>当前能覆盖最多“尚未被覆盖元素”</b>的那个子集 \(S_i\) 加入解集，直到全部 \(n\) 个元素被覆盖。</li>
<li><b>贪心不是最优的，但它有多好？——\(\ln n\) 近似比定理（课件 Slide 13–14 必背证明）</b>：
  <ul>
  <li><b>定理</b>：设全集 \(|B| = n\)，最优覆盖 \(C^*\) 使用了 \(k\) 个集合。则贪心算法使用的集合数 \(C_g\) 满足：
  \[C_g \le k \ln n \quad \Longleftrightarrow \quad \frac{C_g}{C^*} \le \ln n\]</li>
  <li><b>严格证明（抽屉原理 + 指数衰减）</b>：
    <ol>
    <li>设 \(n_t\) 为贪心算法执行了 \(t\) 步后<b>仍未被覆盖的元素个数</b>（初始 \(n_0 = n\)）。</li>
    <li>无论前 \(t\) 步贪心选了什么，剩下的 \(n_t\) 个未覆盖元素一定能被最优解 \(C^*\) 中的那 \(k\) 个集合（除去也许已被贪心选走的若干个后，剩下的 \(k' \le k\) 个最优集合）完全覆盖！</li>
    <li>由平均值原理（抽屉原理），既然 \(k'\) 个集合覆盖了 \(n_t\) 个元素，其中<b>必定存在至少一个集合能覆盖至少 \(\frac{n_t}{k'} \ge \frac{n_t}{k}\) 个尚未覆盖的元素</b>。</li>
    <li>而贪心算法在第 \(t+1\) 步选的是覆盖新元素<b>最多</b>的集合，因此它至少也能覆盖 \(\frac{n_t}{k}\) 个元素！于是剩余未覆盖元素满足递推不等式：
    \[n_{t+1} \le n_t - \frac{n_t}{k} = n_t\left(1 - \frac{1}{k}\right)\]</li>
    <li>展开递推并利用基本不等式 \(1 - x &lt; e^{-x}\ (x \ne 0)\)：
    \[n_t \le n_0 \left(1 - \frac{1}{k}\right)^t &lt; n_0 e^{-t/k} = n e^{-t/k}\]</li>
    <li>当步数达到 \(t = k \ln n\) 时，未覆盖元素数满足 \(n_t &lt; n \cdot e^{-\ln n} = n \cdot \frac{1}{n} = 1\)。因为元素个数是整数，\(n_t &lt; 1 \implies n_t = 0\)，即所有元素均已被覆盖！\(\square\)</li>
    </ol>
  </li>
  </ul>
</li>
</ul>

<h2>考前清单</h2>
<ul>
<li>掌握编码树代价公式 \(\sum f_i \cdot \text{depth}(i) = \sum_{v \in \text{Internal}} f(v)\)，会手算给定频率的 Huffman 合并代价。</li>
<li>熟记 Shannon 信息熵公式 \(H = \sum p_i \log_2(1/p_i)\) 及精确达界条件 \(p_i = 2^{-k_i}\)。</li>
<li>能够完整默写 Set Cover 贪心算法的 \(n_{t+1} \le n_t(1-1/k) &lt; n_0 e^{-(t+1)/k} \implies C_g \le k\ln n\) 证明。</li>
</ul>
`,
  questions: [
    { id: "q1", tag: "slide", kind: "single", q: String.raw`设五个字符 A, B, C, D, E 的出现频率分别为 \(3, 4, 5, 6, 7\)（总计 25）。用 Huffman 算法构造最优前缀编码树，该编码树的总代价（即编码整个文件的总比特数 \(\sum f_i \cdot \text{depth}(i)\)）是多少？`, choices: [
      ["a", "57"],
      ["b", "55"],
      ["c", "60"],
      ["d", "50"]
    ], answer: ["a"], why: String.raw`利用“总代价等于每次合并产生的新内部节点频率之和”：① 合并最小的 3 和 4 得 7（当前队列：5, 6, 7, 7）；② 合并最小的 5 和 6 得 11（当前队列：7, 7, 11）；③ 合并两个 7 得 14（当前队列：11, 14）；④ 合并 11 和 14 得 25。总代价 \(= 7 + 11 + 14 + 25 = 57\)。` },
    { id: "q2", tag: "slide", kind: "single", q: String.raw`设信源有 4 个符号，概率分布为 \(p_A = 1/2,\ p_D = 1/4,\ p_B = 1/8,\ p_C = 1/8\)。该分布的 Shannon 信息熵 \(H = \sum p_i \log_2(1/p_i)\) 以及 Huffman 编码的平均码长分别为`, choices: [
      ["a", "信息熵为 1.75 bits，Huffman 平均码长也为 1.75 bits"],
      ["b", "信息熵为 1.5 bits，Huffman 平均码长为 1.75 bits"],
      ["c", "信息熵为 1.75 bits，Huffman 平均码长为 2.0 bits"],
      ["d", "信息熵为 2.0 bits，Huffman 平均码长为 2.0 bits"]
    ], answer: ["a"], why: String.raw`因为所有概率均为 \(2^{-k}\) 形式（\(2^{-1}, 2^{-2}, 2^{-3}, 2^{-3}\)），Huffman 编码精确达到信息熵下界：\(H = \frac{1}{2}\cdot 1 + \frac{1}{4}\cdot 2 + \frac{1}{8}\cdot 3 + \frac{1}{8}\cdot 3 = 1.75\) bits。` },
    { id: "q3", tag: "slide", kind: "single", q: String.raw`在最小集合覆盖（Min Set Cover）问题中，全集 \(B\) 有 \(n\) 个元素，假设未知的最优覆盖 \(C^*\) 仅需 \(k\) 个集合。当贪心算法已经选了 \(t\) 个集合、还剩 \(n_t\) 个未覆盖元素时，第 \(t+1\) 步贪心选出的集合至少能新覆盖多少个元素？由此推出的贪心近似比上界是多少？`, choices: [
      ["a", String.raw`至少覆盖 \(n_t / k\) 个新元素；近似比 \(C_g / C^* \le \ln n\)`],
      ["b", String.raw`至少覆盖 \(n / k\) 个新元素；近似比 \(C_g / C^* \le 2\)`],
      ["c", String.raw`至少覆盖 \(n_t / 2\) 个新元素；近似比 \(C_g / C^* \le \log_2 k\)`],
      ["d", String.raw`至少覆盖 \(\sqrt{n_t}\) 个新元素；近似比 \(C_g / C^* \le \sqrt{n}\)`]
    ], answer: ["a"], why: String.raw`剩下的 \(n_t\) 个元素可被最优解的 \(\le k\) 个集合完全覆盖，由抽屉原理其中必有一集合覆盖 \(\ge n_t/k\) 个未覆盖元素，故贪心第 \(t+1\) 步至少覆盖 \(n_t/k\) 个元素，得出 \(n_{t+1} \le n_t(1-1/k) &lt; n e^{-(t+1)/k}\)，最多 \(k\ln n\) 步覆盖完毕。` },
    { id: "q4", tag: "slide", kind: "tf", q: String.raw`在一棵前缀编码树中，某一片叶子 \(i\) 的频率 \(f_i\) 在“所有内部节点的频率之和”中被累加的次数，恰好等于该叶子在树中的深度 \(\text{depth}(i)\)（即其码字长度）。`, answer: ["t"], why: String.raw`True！每个内部节点的频率定义为它下方所有叶子频率之和，而位于叶子 \(i\) 上方的内部节点恰好就是从根到 \(i\) 路径上的 \(\text{depth}(i)\) 个祖先节点。` }
  ],
  cards: [
    [String.raw`为什么最优前缀编码树一定是满二叉树（Full Binary Tree）？`, String.raw`前缀自由要求所有符号都在叶子上；若某内部节点只有 1 个孩子，删去该节点可使其子树所有叶子深度减 1，严格减小总比特数。`],
    [String.raw`编码树总代价 \(\text{Cost}(T)\) 的两种等价表达式`, String.raw`\(\text{Cost}(T) = \sum_{i=1}^n f_i \cdot \text{depth}(i) = \sum_{v \in \text{Internal}(T)} f(v)\)（等于 \(n-1\) 次合并产生的新内部节点频率之和）。`],
    [String.raw`Shannon 信息熵公式及 Huffman 编码精确达到熵下界的条件`, String.raw`\(H = \sum_{i=1}^n p_i \log_2(1/p_i)\)；当所有符号概率均为 \(p_i = 2^{-k_i}\)（2 的整数次幂倒数）时，Huffman 码长恰为 \(k_i\)，精确达到熵下界。`],
    [String.raw`最小集合覆盖（Set Cover）贪心算法的递推不等式与近似比`, String.raw`若最优解有 \(k\) 个集合，则每步至少覆盖剩余 \(n_t\) 个元素的 \(1/k\)：\(n_{t+1} \le n_t(1-1/k) &lt; n e^{-(t+1)/k}\)，故 \(C_g \le k\ln n\)（近似比 \(\ln n\)）。`]
  ]
});
