Review.add({
  id: "ps6",
  group: "ps",
  n: 6,
  short: "PS6 电路下界·PSIZE与公式叶数",
  title: "Problem Set 6 全解（Quiz 3 核心）· A_TM 的 NP-hard 性、EXACTONE、Shannon 计数、A_TM ∉ PSIZE 与 Subbotovskaya 公式下界",
  meta: "Problem Set 6 · 5 道大题完整严谨解答（官方尚未发答案，按满分证明标准精编）",
  sources: [
    { label: "Problem Set 6 (Official PDF)", href: "materials/PS6.pdf" }
  ],
  html: String.raw`
<p class="lede">根据课程考核规则，每次随堂小测（In-class Test / Quiz）直接基于对应的周期性作业题（Periodic Assignments）命题！<b>Problem Set 6 是期中后发布的第一份也是 Quiz 3 最核心的习题集</b>，官方尚未发布参考解答。本章按课程严格形式化标准给出全部 5 道大题的满分证明与易错点剖析。</p>

<h2>1. Question 1：\(A_{\mathrm{TM}}\) 是 \(\mathrm{NP}\)-hard 吗？是 \(\mathrm{NP}\)-complete 吗？</h2>
<p><b>原题</b>：Recall \(A_{\mathrm{TM}} = \{\langle M, w \rangle : M \text{ is a TM that accepts } w\}\). Determine whether \(A_{\mathrm{TM}}\) is \(\mathrm{NP}\)-complete and whether it is \(\mathrm{NP}\)-hard. Justify your answers.</p>

<div class="callout ex">
  <strong>标准满分解答：\(A_{\mathrm{TM}}\) 是 \(\mathrm{NP}\)-hard，但<u>不是</u> \(\mathrm{NP}\)-complete！</strong>
  <ol>
    <li><b>证明 \(A_{\mathrm{TM}}\) 是 \(\mathrm{NP}\)-hard（即 \(\forall L \in \mathrm{NP},\; L \le_P A_{\mathrm{TM}}\)）</b>：
      <ul>
        <li>任取语言 \(L \in \mathrm{NP}\)。由定义，存在一台多项式时间验证机 \(V_L\) 以及多项式 \(p(n)\)，使得对任意 \(x \in \{0,1\}^*\)：
        \[
          x \in L \iff \exists c \in \{0,1\}^*,\; |c| \le p(|x|) \text{ 使得 } V_L \text{ 接受 } (x, c).
        \]</li>
        <li>我们先为这个固定的语言 \(L\) 构造一台（指数时间的）<b>确定性判定图灵机 \(M_L\)</b>：给定输入 \(x\)，\(M_L\) 按字典序逐一枚举所有长度 \(\le p(|x|)\) 的候选证书串 \(c \in \{0,1\}^{\le p(|x|)}\)，对每个 \(c\) 运行 \(V_L(x, c)\)；一旦发现某个 \(c\) 使 \(V_L\) 接受，\(M_L\) 就停机并<b>接受</b>；若所有候选 \(c\) 均被拒绝，\(M_L\) 停机并<b>拒绝</b>。显然对一切 \(x\)，\(M_L\) 接受 \(x \iff x \in L\)。</li>
        <li>现在定义归约函数 \(f: \{0,1\}^* \to \{0,1\}^*\) 为：
        \[
          f(x) = \langle M_L, x \rangle.
        \]</li>
        <li><b>检验两个条件</b>：(i) <b>保持成员资格</b>：\(x \in L \iff M_L \text{ 接受 } x \iff \langle M_L, x \rangle \in A_{\mathrm{TM}}\)；(ii) <b>多项式时间可计算</b>：因为对于固定的语言 \(L\)，图灵机 \(M_L\) 的描述编码 \(\langle M_L \rangle\) 是一个<b>固定长度的常数串（\(|\langle M_L \rangle| = O(1)\)，与输入 \(x\) 无关！）</b>，归约机器根本不需要运行 \(M_L\)，只需把常数前缀 \(\langle M_L \rangle\) 和输入 \(x\) 拼接打包成 \(\langle M_L, x \rangle\)，耗时仅为 \(O(|x|)\) 线性时间（当然是多项式时间）！故 \(L \le_P A_{\mathrm{TM}}\)，\(A_{\mathrm{TM}}\) 是 \(\mathrm{NP}\)-hard。</li>
      </ul>
    </li>
    <li><b>证明 \(A_{\mathrm{TM}}\) 不是 \(\mathrm{NP}\)-complete（因为 \(A_{\mathrm{TM}} \notin \mathrm{NP}\)）</b>：
      <ul>
        <li>\(\mathrm{NP}\)-complete 要求同时满足 \(\mathrm{NP}\)-hard 且属于 \(\mathrm{NP}\)。</li>
        <li>然而<b>每一个属于 \(\mathrm{NP}\) 的语言都是可判定的（decidable）</b>！（如上所示，若 \(Y \in \mathrm{NP}\) 有时间界 \(O(n^k)\) 的验证机 \(V\)，暴力枚举所有长度 \(\le O(n^k)\) 的证书模拟 \(V\) 即可在有限步内停机判定 \(Y\)，即 \(\mathrm{NP} \subseteq \mathrm{EXP} \subseteq \mathrm{DECIDABLE}\)。）</li>
        <li>我们在 Lecture 7 已证 \(A_{\mathrm{TM}}\) 是<b>不可判定的（undecidable）</b>，因此 \(A_{\mathrm{TM}} \notin \mathrm{NP}\)，从而 \(A_{\mathrm{TM}}\) 不是 \(\mathrm{NP}\)-complete。\(\square\)</li>
      </ul>
    </li>
  </ol>
</div>

<h2>2. Question 2：恰有一个 1 的函数 \(\mathrm{EXACTONE}_n\) 的电路与展开公式</h2>
<p><b>原题</b>：\(\mathrm{EXACTONE}_n(x_1,\dots,x_n) = 1 \iff \sum_{i=1}^n x_i = 1\). (a) Construct a Boolean circuit and explain correctness. (b) Give asymptotic bounds on the size and depth of your circuit and on the size of the Boolean formula obtained by unfolding your circuit.</p>
<p><i>提示</i>：PS6 Recap 指出电路使用<b>无限制扇入</b>的 AND/OR 门（只统计 AND/OR 门），而布尔公式统计树表示中的<b>叶子总数</b>。下面给出两种标准构造（构造一最直接贴合无限制扇入定义；构造二采用分治共享门，展示“展开电路”降低叶数的精妙之处）：</p>

<div class="callout ex">
  <strong>构造一（无限制扇入 DNF 电路，最简洁标准解）</strong>
  <ul>
    <li><b>(a) 电路构造与正确性</b>：对每个下标 \(i \in \{1, \dots, n\}\)，先用 \(n\) 个 <code>NOT</code> 门算出 \(\neg x_1, \dots, \neg x_n\)，然后构造第 \(i\) 个 <code>AND</code> 门（扇入为 \(n\)）：
    \[
      g_i = x_i \;\land\; \bigwedge_{j \in \{1,\dots,n\}\setminus\{i\}} \neg x_j \qquad (i = 1, \dots, n),
    \]
    最后用一个扇入为 \(n\) 的顶层 <code>OR</code> 门输出 \(g_{\mathrm{out}} = \bigvee_{i=1}^n g_i\)（当 \(n=1\) 时直接输出 \(x_1\)，0 个门）。<br>
    <em>正确性</em>：\(g_i(x) = 1 \iff\) 第 \(i\) 位为 \(1\) 且其余 \(n-1\) 位全为 \(0\)。因此存在某个 \(i\) 使 \(g_i(x) = 1 \iff\) 输入串中恰好只有一位为 \(1\)，即 \(\sum_{i=1}^n x_i = 1\)。</li>
    <li><b>(b) 复杂度界</b>：
      <ul>
        <li><b>电路 Size</b>（仅计 AND/OR 门）：\(n\) 个 <code>AND</code> 门 \(+\) \(1\) 个 <code>OR</code> 门 \(= n + 1 = \mathbf{\Theta(n)}\)。</li>
        <li><b>电路 Depth</b>：任意输入到输出最多经过 \(1\) 个 <code>AND</code> 门和 \(1\) 个 <code>OR</code> 门，故 Depth \(= 2 = \mathbf{\Theta(1)}\)（若按二元扇入二叉树实现，则 Size 仍为 \(\Theta(n^2)\)、Depth 为 \(\Theta(\log n)\)）。</li>
        <li><b>展开为布尔公式后的叶数（Formula Size）</b>：每个 \(g_i\) 的子树包含全部 \(n\) 个变量的文字作为叶子，顶层 <code>OR</code> 连接了 \(n\) 个互不共享的 \(g_i\) 子树，故总叶子数为 \(n \times n = n^2 = \mathbf{\Theta(n^2)}\)。</li>
      </ul>
    </li>
  </ul>
</div>

<div class="callout ex">
  <strong>构造二（进阶分治电路：二元扇入下电路 Size \(\Theta(n)\)，展开公式叶数仅 \(\Theta(n\log n)\)！）</strong>
  <ul>
    <li><b>(a) 分治递推构造</b>：对任意区间 \(S\)，同时维护两个输出门：\(Z_S = 1 \iff S\) 中全为 \(0\)，\(E_S = 1 \iff S\) 中恰有一个 \(1\)。将 \(\{1,\dots,n\}\) 对半分为左半 \(L\) 和右半 \(R\)：
    \[
      Z_{L\cup R} = Z_L \land Z_R, \qquad E_{L\cup R} = (E_L \land Z_R) \lor (Z_L \land E_R)
    \]
    （基例 \(|S|=1\)：\(Z_{\{i\}} = \neg x_i,\; E_{\{i\}} = x_i\)）。因为左半和右半不重叠，“总和为 1”当且仅当“左 1 右 0”或“左 0 右 1”。</li>
    <li><b>(b) 复杂度界</b>：在电路中 \(Z_L, Z_R, E_L, E_R\) 的输出可复用，每次合并只用 \(4\) 个二元 AND/OR 门，递推 \(S(n) = 2S(n/2) + 4 \implies\) <b>电路 Size \(= \Theta(n)\)</b>，<b>Depth \(= \Theta(\log n)\)</b>！将它展开为树状公式时，\(Z_S\) 展开后就是 \(\bigwedge_{j\in S}\neg x_j\)（恰有 \(|S|\) 片叶子），而 \(E_S\) 的叶数满足 \(L_E(n) = L_E(\lfloor n/2\rfloor) + \lceil n/2\rceil + \lfloor n/2\rfloor + L_E(\lceil n/2\rceil) = 2L_E(n/2) + n\)，由主定理得展开后的<b>公式叶数为 \(\Theta(n \log n)\)</b>！</li>
  </ul>
</div>

<h2>3. Question 3：Shannon 计数下界定理（\(\forall n \ge 4,\ \exists f\) 需要电路 Size \(&gt; 2^{n/2}/4\)）</h2>
<p><b>原题</b>：Show that for every \(n \ge 4\), there exists \(f:\{0,1\}^n\to\{0,1\}\) that cannot be computed by any Boolean circuit of size at most \(2^{n/2}/4\).</p>

<div class="callout ex">
  <strong>严谨计数证明（严格适配“无限制扇入 + NOT 门免费”定义，对一切 \(n \ge 4\) 成立！）</strong>
  <ol>
    <li><b>统计 \(n\) 元布尔函数的总数</b>：真值表共有 \(2^n\) 行，每行输出可独立取 \(0\) 或 \(1\)，故共有 <b>\(2^{2^n}\)</b> 个不同的布尔函数 \(f: \{0,1\}^n \to \{0,1\}\)。</li>
    <li><b>上界估计 Size \(\le s = \lfloor 2^{n/2}/4 \rfloor\) 的电路所能计算的不同布尔函数个数</b>：
      <ul>
        <li>注意到在电路中，连续两个 <code>NOT</code> 门互相抵消（\(\neg\neg u = u\)），因此任意门的每条输入线只需决定是否对前驱信号取一次非。并且，任何使用 \(k &lt; s\) 个 AND/OR 门的电路，都可以通过在末尾添加 \(s - k\) 个无用哑门并指定真实输出线，补齐为<b>恰好含有 \(s\) 个 AND/OR 门</b> \(g_1, \dots, g_s\) 的电路（含 \(k=0\) 时直接输出文字 \(x_i, \neg x_i\) 或常量 \(0, 1\)）。</li>
        <li>考察第 \(k\) 个门 \(g_k\)（\(1 \le k \le s\)）的构造选择数：(i) 门的类型有 \(2\) 种选择（<code>AND</code> 或 <code>OR</code>）；(ii) 可供 \(g_k\) 连接的前驱信号源集合为 \(\{x_1, \dots, x_n, g_1, \dots, g_{k-1}\}\)，共 \(n + k - 1\) 个源。对每个源 \(v\)，它接入 \(g_k\) 的方式至多有 \(4\) 种（不接入、接入 \(v\)、接入 \(\neg v\)、同时接入 \(v\) 和 \(\neg v\)），故 \(g_k\) 的输入连线方式至多有 \(4^{n+k-1} = 2^{2(n+k-1)}\) 种。</li>
        <li>最后，电路最终输出可以是 \(\{0, 1, x_1, \neg x_1, \dots, x_n, \neg x_n, g_1, \neg g_1, \dots, g_s, \neg g_s\}\) 中的任意一个，共 \(2(n + s + 1)\) 种选择。</li>
        <li>因此，Size \(\le s\) 的电路所能计算的不同布尔函数总数 \(N(n, s)\) 满足：
        \[
          N(n, s) \;\le\; 2(n + s + 1) \prod_{k=1}^{s} \Bigl(2 \cdot 2^{2(n+k-1)}\Bigr) \;=\; 2(n + s + 1) \cdot 2^{s + 2ns + s(s-1)} \;=\; 2(n + s + 1) \cdot 2^{s^2 + 2ns}.
        \]</li>
      </ul>
    </li>
    <li><b>验证对所有 \(n \ge 4\) 均有 \(N(n, s) &lt; 2^{2^n}\)（即 \(\log_2 N(n, s) = s^2 + 2ns + \log_2(2(n+s+1)) &lt; 2^n\)）</b>：
      <ul>
        <li>当 \(n = 4\) 时，\(s = \lfloor 2^2 / 4 \rfloor = 1\)：\(\log_2 N(4,1) \le 1 + 8 + \log_2(12) &lt; 13 &lt; 16 = 2^4\)。</li>
        <li>当 \(n = 5\) 时，\(s = \lfloor 2^{2.5} / 4 \rfloor = 1\)：\(\log_2 N(5,1) \le 1 + 10 + \log_2(14) &lt; 15 &lt; 32 = 2^5\)。</li>
        <li>当 \(n \ge 6\) 时，由 \(s \le \frac{2^{n/2}}{4}\) 及对 \(n \ge 4\) 恒成立的 \(n \le 2^{n/2}\)，有：
        \[
          s^2 \le \frac{2^n}{16}, \qquad 2ns \le 2 \cdot 2^{n/2} \cdot \frac{2^{n/2}}{4} = \frac{2^n}{2}, \qquad \log_2\bigl(2(n+s+1)\bigr) &lt; 2n &lt; \frac{2^n}{4}.
        \]
        三式相加得 \(\log_2 N(n, s) &lt; \left(\frac{1}{16} + \frac{1}{2} + \frac{1}{4}\right) 2^n = \frac{13}{16} 2^n &lt; 2^n\)，故 \(N(n, s) &lt; 2^{2^n}\)！</li>
      </ul>
    </li>
    <li><b>结论</b>：因为 \(n\) 元布尔函数总数严格大于所有 Size \(\le 2^{n/2}/4\) 的电路所能表示的函数总数，由计数原理（鸽巢原理），对每个 \(n \ge 4\) 必然存在无法被任何 Size \(\le 2^{n/2}/4\) 的布尔电路计算的布尔函数 \(f\)。\(\square\)</li>
  </ol>
</div>

<h2>4. Question 4：构造显式可判定但 \(\notin \mathrm{PSIZE}\) 的语言，并证明 \(A_{\mathrm{TM}} \notin \mathrm{PSIZE}\)</h2>
<p><b>原题</b>：(a) Give an algorithm that, given \(n \ge 12\), outputs the truth table of \(f_n:\{0,1\}^n\to\{0,1\}\) not computable by any circuit of size \(\le 2^{\lfloor n/3 \rfloor}\). (b) Let \(L = \{x \in \{0,1\}^* : |x|\ge 12 \text{ and } f_{|x|}(x)=1\}\). Show \(L\) is decidable and \(L \notin \mathrm{PSIZE}\). (c) Prove \(A_{\mathrm{TM}} \notin \mathrm{PSIZE}\).</p>

<div class="callout ex">
  <strong>标准满分解答（暴力搜索构造对角硬函数 + 非一致归约）</strong>
  <ul>
    <li><b>(a) 暴力枚举搜索算法</b>：
      <ol>
        <li>给定整数 \(n \ge 12\)，因为 \(\lfloor n/3 \rfloor \le n/3\) 且对 \(n \ge 12\) 有 \(2^{\lfloor n/3 \rfloor} \le 2^{n/3} = \frac{2^{n/2}}{2^{n/6}} \le \frac{2^{n/2}}{2^2} = \frac{2^{n/2}}{4}\)，由 Question 3 的 Shannon 定理，<b>必然存在</b>至少一个无法被任何 Size \(\le s_n = 2^{\lfloor n/3 \rfloor}\) 的电路计算的 \(n\) 元布尔函数！</li>
        <li>算法将每个 \(n\) 元布尔函数的真值表视为一个长度为 \(2^n\) 的二进制串 \(T \in \{0,1\}^{2^n}\)，<b>按字典序从小到大依次枚举每一个真值表 \(T\)</b>：
          <ul>
            <li>对当前真值表 \(T\)，枚举所有规范化的、Size \(\le s_n\) 的 \(n\) 输入布尔电路 \(C\)（如 Q3 所示，只有有限个这样的电路 DAG，可逐一生成）；</li>
            <li>对每个候选电路 \(C\)，在全部 \(2^n\) 个输入 \(x \in \{0,1\}^n\) 上求值 \(C(x)\)（使用 \(\mathrm{CVP}\) 算法），检查其真值表是否与 \(T\) 完全一致；</li>
            <li>一旦发现某个真值表 \(T^*\) <b>与所有 Size \(\le s_n\) 的电路都不一致</b>，算法立即输出 \(T^*\) 并停机！</li>
          </ul>
        </li>
        <li>由于这样的函数由 Q3 保证必然存在，且真值表总数 \(2^{2^n}\) 与小电路总数均为有限数，该搜索必定在有限步内停机并输出唯一确定的函数 \(f_n\) 的真值表（字典序最小的那一个）。</li>
      </ol>
    </li>
    <li><b>(b) 证明 \(L\) 可判定且 \(L \notin \mathrm{PSIZE}\)</b>：
      <ul>
        <li><b>\(L\) 可判定</b>：构造判定机 \(D\)：在输入 \(x \in \{0,1\}^*\) 上，先算出长度 \(n = |x|\)；若 \(n &lt; 12\)，直接<b>拒绝</b>；若 \(n \ge 12\)，调用 (a) 中的停机算法算出 \(f_n\) 的完整真值表 \(T^*\)，然后在真值表中查出第 \(x\) 行的比特值 \(f_n(x)\)：若为 \(1\) 则<b>接受</b>，若为 \(0\) 则<b>拒绝</b>。因为对一切 \(x\) 都在有限步内停机，\(D\) 判定 \(L\)！（注：\(D\) 的运行时间约为双指数级 \(2^{O(2^n)}\)，但这完全符合“可判定”的定义！）</li>
        <li><b>\(L \notin \mathrm{PSIZE}\)</b>：反证法。假设 \(L \in \mathrm{PSIZE}\)，则存在多项式 \(p(n) = c n^k\) 及电路族 \(\{C_n\}_{n\ge 0}\)，使得每个 \(C_n\) 计算 \(L_n = L \cap \{0,1\}^n\) 且 \(\mathrm{size}(C_n) \le c n^k\)。对于 \(n \ge 12\)，\(L_n\) 的特征函数恰为 \(f_n\)！但由于指数增长快于任意多项式，存在充分大的整数 \(N \ge 12\) 使得 \(c N^k \le 2^{\lfloor N/3 \rfloor}\)。于是电路 \(C_N\) 计算了 \(f_N\) 且其大小 \(\le 2^{\lfloor N/3 \rfloor}\)，直接与 (a) 中 \(f_N\) 的定义矛盾！故 \(L \notin \mathrm{PSIZE}\)。</li>
      </ul>
    </li>
    <li><b>(c) 利用 (b) 证明 \(A_{\mathrm{TM}} \notin \mathrm{PSIZE}\)（一招制敌！）</b>：
      <ul>
        <li>固定 (b) 中判定 \(L\) 的那台具体图灵机 \(D\)，记常数 \(d = |\langle D, \varepsilon \rangle|\) 的固定编码开销。具体地，在标准配对编码下（例如将 \(\langle D, x \rangle\) 编码为定长前缀 \(\langle D \rangle 01\) 后直接拼接原始串 \(x\)，或将 \(x\) 每位重复编码为 \(00/11\)），存在固定常数 \(a, b \ge 1\)（仅依赖固定机器 \(D\)），使得对任意长为 \(n\) 的串 \(x \in \{0,1\}^n\)，编码串 \(y_x = \langle D, x \rangle\) 的长度<b>只依赖 \(n\)</b>，记为 \(m(n) = a n + b\)，且 \(y_x\) 的每一位要么是固定常数 \(0/1\)，要么直接等于某个输入位 \(x_i\)（或 \(\neg x_i\)）！</li>
        <li>反证法：假设 \(A_{\mathrm{TM}} \in \mathrm{PSIZE}\)，则存在多项式大小的电路族 \(\{A_m\}_{m\ge 0}\) 计算 \(A_{\mathrm{TM}}\)，其中 \(\mathrm{size}(A_m) \le m^k\)。</li>
        <li>现在对任意输入长度 \(n\)，我们用电路 \(A_{m(n)}\) 来构造计算 \(L_n\) 的电路 \(B_n(x_1,\dots,x_n)\)：将 \(A_{m(n)}\) 的 \(m(n)\) 条输入导线按照映射 \(x \mapsto \langle D, x \rangle\) 硬连线（固定前缀 \(\langle D \rangle\) 对应的导线接常量 \(0/1\)，代表 \(x\) 部分的导线直接连到输入变量 \(x_1, \dots, x_n\)）！</li>
        <li>由于 \(D\) 判定 \(L\)，有 \(B_n(x) = A_{m(n)}(\langle D, x \rangle) = 1 \iff \langle D, x \rangle \in A_{\mathrm{TM}} \iff D \text{ 接受 } x \iff x \in L_n\)！</li>
        <li>而且 \(B_n\) 的门数不超过 \(A_{m(n)}\) 的门数（外加至多 1 个造常量 \(0/1\) 的门），即 \(\mathrm{size}(B_n) \le (a n + b)^k + 1 = \mathrm{poly}(n)\)！这将推出 \(L \in \mathrm{PSIZE}\)，与 (b) 矛盾！（即使编码 \(x \mapsto \langle D, x \rangle\) 需要多项式时间图灵机预处理，由 Lecture 16 \(\mathrm{P} \subseteq \mathrm{PSIZE}\)，预处理本身也可转成 \(\mathrm{poly}(n)\) 大小的前置电路与 \(A_{m(n)}\) 串联，总大小依然是 \(\mathrm{poly}(n)\)！）故 \(A_{\mathrm{TM}} \notin \mathrm{PSIZE}\)。\(\square\)</li>
      </ul>
    </li>
  </ul>
</div>

<h2>5. Question 5：奇偶函数 \(\oplus_n\) 的公式叶数上界 \(O(n^2)\) 与 Subbotovskaya 下界 \(\Omega(n\log n)\)</h2>
<p><b>原题回顾</b>：\(\oplus_n(x_1,\dots,x_n) = \sum_{i=1}^n x_i \bmod 2\)，布尔公式复杂度 \(L(F)\) 为树表示中的叶子总数。</p>

<div class="callout ex">
  <strong>(a) 上界：\(L(\oplus_n) = O(n^2)\)（二分法公式构造）</strong>
  <p>基例 \(n = 1\)：公式就是单叶子 \(x_1\)，\(L(\oplus_1) = 1\)。对 \(n \ge 2\)，将变量对半分为前 \(a = \lfloor n/2 \rfloor\) 个与后 \(b = \lceil n/2 \rceil\) 个，记 \(A = \oplus_a(x_1,\dots,x_a)\)，\(B = \oplus_b(x_{a+1},\dots,x_n)\)。因为 \(\oplus_n = A \oplus B = (A \land \neg B) \lor (\neg A \land B)\)，且由下述 (b)(i) 知 \(\neg F\) 与 \(F\) 具有相同的叶数，展开为树后 \(A, \neg A, B, \neg B\) 各出现一次，故叶数满足递推：</p>
  \[
    L(\oplus_n) \le 2 L(\oplus_{\lfloor n/2 \rfloor}) + 2 L(\oplus_{\lceil n/2 \rceil}).
  \]
  <p>当 \(n = 2^k\) 时，\(L(\oplus_{2^k}) \le 4 L(\oplus_{2^{k-1}}) = 4^k = n^2\)；对一般 \(n\)，用归纳法易证 \(L(\oplus_n) \le 2 n^2\)（或补零到最近的 \(2^{\lceil\log_2 n\rceil} &lt; 2n\) 得 \(L(\oplus_n) &lt; 4n^2\)），故上界为 <b>\(O(n^2)\)</b>！</p>
</div>

<div class="callout ex">
  <strong>(b) Subbotovskaya 超线性下界 \(L(\oplus_n) \ge n\bigl(1 + \sum_{j=1}^{n-1}\frac{1}{j}\bigr) = \Omega(n\log n)\) 六步完整证明</strong>
  <p>设 \(n \ge 2\)，\(F\) 是计算 \(\oplus_n\) 的<b>叶数最小（minimum-leaf-size）</b>的二元扇入布尔公式（\(\neg\) 仅出现在叶子文字 \(x_j, \neg x_j\) 上，内部节点全为二元 \(\land, \lor\)，\(L(F) = L(\oplus_n)\)）：</p>
  <ol>
    <li><b>(i) 证明对任意布尔函数 \(f\) 有 \(L(\neg f) = L(f)\)</b>：<br>
    取计算 \(f\) 的最小公式 \(F_f\)（叶数 \(L(f)\)）。对 \(\neg F_f\) 反复应用 De Morgan 定律 \(\neg(P \land Q) \equiv \neg P \lor \neg Q\) 与 \(\neg(P \lor Q) \equiv \neg P \land \neg Q\) 将否定一路推到叶子层，在每个叶子上将 \(x_j\) 与 \(\neg x_j\) 互换（\(\neg\neg x_j = x_j\)）。所得合法公式计算 \(\neg f\) 且树的拓扑结构与叶子总数丝毫未变，故 \(L(\neg f) \le L(f)\)；将此结论应用于函数 \(\neg f\) 又得 \(L(f) = L(\neg\neg f) \le L(\neg f)\)，故 \(L(\neg f) = L(f)\)。</li>
    <li><b>(ii) 固定任意一个变量 \(x_i = b \in \{0, 1\}\) 后的函数</b>：<br>
    若固定 \(x_i = 0\)，则 \(\bigl(0 + \sum_{j\ne i} x_j\bigr) \bmod 2 = \oplus_{n-1}\)；若固定 \(x_i = 1\)，则 \(\bigl(1 + \sum_{j\ne i} x_j\bigr) \bmod 2 = 1 - \oplus_{n-1} = \neg \oplus_{n-1}\)。</li>
    <li><b>(iii) 设门 \(G\) 的一个输入是叶子文字 \(\ell \in \{x_j, \neg x_j\}\)，证明以 \(G\) 为根的子树必包含某个其它变量 \(x_k\ (k \ne j)\) 的文字作为叶子</b>：<br>
    <em>反证法</em>：假设以 \(G\) 为根的子树中的所有叶子全都是 \(x_j\) 或 \(\neg x_j\)。那么该子树计算的是一个<b>仅依赖单一变量 \(x_j\)</b> 的布尔函数 \(g(x_j)\)。单变量布尔函数一共只有 4 个：常量 \(0\)、常量 \(1\)、\(x_j\)、\(\neg x_j\)。
      <ul>
        <li>若 \(g(x_j) \equiv x_j\) 或 \(\neg x_j\)：因为 \(G\) 是二元门，其子树至少有 \(2\) 片叶子；直接把整个 \(G\) 子树替换成<b>单片叶子</b> \(x_j\)（或 \(\neg x_j\)），功能不变但叶数至少减少 \(1\)，与 \(F\) 的叶数最小性矛盾！</li>
        <li>若 \(g(x_j) \equiv 0\) 或 \(1\)：将该常量代入 \(G\) 的父节点并用 \(0\land H=0,\ 1\land H=H,\ 0\lor H=H,\ 1\lor H=1\) 化简（由于 \(n \ge 2\)，\(\oplus_n\) 不是常函数，\(G\) 不可能是整棵树的根，或者即便化简到底也严格减少了至少 \(2\) 片叶子），同样得到叶数严格更小的等价公式，与 \(F\) 最小性矛盾！</li>
      </ul>
    </li>
    <li><b>(iv) 证明存在下标 \(i \in \{1,\dots,n\}\) 使 \(x_i\) 或 \(\neg x_i\) 在 \(F\) 中至少占据 \(L(F)/n\) 片叶子</b>：<br>
    记 \(m_i\) 为变量 \(x_i\)（含 \(x_i\) 与 \(\neg x_i\)）在 \(F\) 中的叶子数，则 \(\sum_{i=1}^n m_i = L(F)\)。由平均值原理（鸽巢原理），\(\max_{1\le i\le n} m_i \ge \frac{1}{n}\sum_{i=1}^n m_i = \frac{L(F)}{n}\)。</li>
    <li><b>(v) 证明核心递推不等式 \(L(\oplus_{n-1}) \le L(\oplus_n)\left(1 - \frac{1}{n}\right) - 1\)</b>：<br>
    取 (iv) 中满足 \(m_i \ge L(\oplus_n)/n\) 的变量 \(x_i\)（因 \(\oplus_n\) 依赖每个变量，\(m_i \ge 1\)）。在 \(F\) 中任选一片属于 \(x_i\) 的叶子 \(\ell \in \{x_i, \neg x_i\}\)，设其父节点为二元门 \(G\)，\(G\) 的另一个输入子树记为 \(H\)。
      <ul>
        <li><b>选择“湮灭赋值”</b>：若 \(G\) 是 \(\land\) 门，我们给 \(x_i\) 赋使文字 \(\ell = 0\) 的值 \(b \in \{0,1\}\)（从而 \(G = 0 \land H \equiv 0\)）；若 \(G\) 是 \(\lor\) 门，我们给 \(x_i\) 赋使文字 \(\ell = 1\) 的值 \(b \in \{0,1\}\)（从而 \(G = 1 \lor H \equiv 1\)）！</li>
        <li>将 \(x_i = b\) 代入整棵公式 \(F\)，并反复应用恒等式 \(0\land Q=0,\ 1\land Q=Q,\ 0\lor Q=Q,\ 1\lor Q=1\) 彻底消去所有常量，得到不含常量的新公式 \(F'\)（因 \(n \ge 2\) 时 \(\oplus_{n-1}\) 和 \(\neg\oplus_{n-1}\) 均非常函数，\(F'\) 至少剩 1 片叶子）。</li>
        <li><b>清点消失的叶子数</b>：① \(F\) 中原本属于变量 \(x_i\) 的全部 \(m_i\) 片叶子都变成了常量并在化简中全部消失；② 在门 \(G\) 处，整个兄弟子树 \(H\) 被 \(\ell\) 直接短路湮灭而整棵删去！由 (iii) 知 \(G\) 的子树中必含至少一片<b>不属于 \(x_i\) 的其它变量 \(x_k\ (k \ne i)\)</b> 的叶子，既然 \(G\) 的左孩子只是单叶子 \(\ell\)，这片 \(x_k\) 的叶子<b>必定位于兄弟子树 \(H\) 中</b>！它与那 \(m_i\) 片 \(x_i\) 叶子互不重叠，也一同被删去了！</li>
        <li>因此化简后公式 \(F'\) 的叶数至多为：
        \[
          L(F') \;\le\; L(F) - m_i - 1 \;\le\; L(\oplus_n) - \frac{L(\oplus_n)}{n} - 1 \;=\; L(\oplus_n)\left(1 - \frac{1}{n}\right) - 1.
        \]
        由 (ii) 知 \(F'\) 计算 \(\oplus_{n-1}\) 或 \(\neg\oplus_{n-1}\)，再由 (i) 知 \(L(\oplus_{n-1}) = L(\neg\oplus_{n-1}) \le L(F')\)，不等式得证！</li>
      </ul>
    </li>
    <li><b>(vi) 望远镜求解得出 \(L(\oplus_n) \ge n\Bigl(1 + \sum_{j=1}^{n-1}\frac{1}{j}\Bigr) = \Omega(n \log n)\)</b>：<br>
    对任意 \(k \ge 2\)，将 (v) 的不等式 \(L(\oplus_{k-1}) \le \frac{k-1}{k} L(\oplus_k) - 1\) 两边同除以正数 \(k - 1\)，移项即得极其优美的线性差商关系：
    \[
      \frac{L(\oplus_{k-1})}{k - 1} \le \frac{L(\oplus_k)}{k} - \frac{1}{k - 1} \quad \Longleftrightarrow \quad \frac{L(\oplus_k)}{k} - \frac{L(\oplus_{k-1})}{k - 1} \ge \frac{1}{k - 1}.
    \]
    将上式从 \(k = 2\) 到 \(k = n\) 累加（望远镜求和），并代入基例 \(\frac{L(\oplus_1)}{1} = \frac{1}{1} = 1\)：
    \[
      \frac{L(\oplus_n)}{n} \;=\; \frac{L(\oplus_1)}{1} + \sum_{k=2}^{n}\left(\frac{L(\oplus_k)}{k} - \frac{L(\oplus_{k-1})}{k - 1}\right) \;\ge\; 1 + \sum_{k=2}^{n} \frac{1}{k - 1} \;=\; 1 + \sum_{j=1}^{n-1} \frac{1}{j}.
    \]
    两边同乘 \(n\) 即得 \(L(\oplus_n) \ge n\Bigl(1 + \sum_{j=1}^{n-1}\frac{1}{j}\Bigr)\)。由于调和级数 \(\sum_{j=1}^{n-1}\frac{1}{j} \ge \ln n = \Omega(\log n)\)，证毕 <b>\(L(\oplus_n) = \Omega(n \log n)\)</b>！（对比电路大小 \(\Theta(n)\)：这严格证明了对于奇偶校验，不允许复用的布尔公式比布尔电路严格更弱！）\(\square\)</li>
  </ol>
</div>
`,
  questions: [
    {
      id: "ps6-q1",
      kind: "single",
      tag: "hw",
      q: String.raw`（PS6 Q1）关于停机接受问题 \(A_{\mathrm{TM}} = \{\langle M, w \rangle : M \text{ accepts } w\}\) 与 \(\mathrm{NP}\)-hard / \(\mathrm{NP}\)-complete 的关系，下列哪项是完全正确的？`,
      choices: [
        ["a", String.raw`\(A_{\mathrm{TM}}\) 是 \(\mathrm{NP}\)-hard（对任意 \(L\in\mathrm{NP}\)，固定 \(L\) 的指数时间判定机 \(M_L\)，令 \(f(x)=\langle M_L, x\rangle\) 可在 \(O(|x|)\) 时间内计算），但 \(A_{\mathrm{TM}}\) 不是 \(\mathrm{NP}\)-complete（因为 \(\mathrm{NP}\) 中语言皆可判定，而 \(A_{\mathrm{TM}}\) 不可判定，故 \(A_{\mathrm{TM}} \notin \mathrm{NP}\)）`],
        ["b", String.raw`\(A_{\mathrm{TM}}\) 既是 \(\mathrm{NP}\)-hard 也是 \(\mathrm{NP}\)-complete`],
        ["c", String.raw`\(A_{\mathrm{TM}}\) 既不是 \(\mathrm{NP}\)-hard 也不是 \(\mathrm{NP}\)-complete，因为 \(M_L\) 运行需要指数时间，导致归约函数 \(f(x)\) 也需要指数时间`],
        ["d", String.raw`\(A_{\mathrm{TM}} \in \mathrm{NP}\)，但不是 \(\mathrm{NP}\)-hard`]
      ],
      answer: ["a"],
      why: String.raw`核心陷阱区分：<b>运行 \(M_L(x)\)</b> 需要指数时间，但归约机器只需要<b>写出字符串 \(\langle M_L, x \rangle\)</b> 而根本不需要运行 \(M_L\)！因为对固定语言 \(L\)，\(\langle M_L \rangle\) 是常数长度的前缀串，拼接输出只需 \(O(|x|)\) 时间！`
    },
    {
      id: "ps6-q2",
      kind: "single",
      tag: "hw",
      q: String.raw`（PS6 Q4）在 Lecture 14 中我们看到某些一元不可判定语言属于 \(\mathrm{PSIZE}\)。那么关于一般语言与 \(A_{\mathrm{TM}}\) 是否属于 \(\mathrm{PSIZE}\)，PS6 Q4 证明了什么重要结论？`,
      choices: [
        ["a", String.raw`可以通过对真值表与小电路做穷举搜索构造出一个<b>可判定（decidable）语言</b> \(L \notin \mathrm{PSIZE}\)；再固定 \(L\) 的判定机 \(D\) 考察输入 \(\langle D, x \rangle\)，即可证出 \(A_{\mathrm{TM}} \notin \mathrm{PSIZE}\)`],
        ["b", String.raw`所有可判定语言都属于 \(\mathrm{PSIZE}\)，只有不可判定语言才可能不属于 \(\mathrm{PSIZE}\)`],
        ["c", String.raw`\(A_{\mathrm{TM}} \in \mathrm{PSIZE}\)，因为非一致性可以硬编码所有输入`],
        ["d", String.raw`不存在任何可判定语言位于 \(\mathrm{PSIZE}\) 之外`]
      ],
      answer: ["a"],
      why: String.raw`在长度 \(n\) 上共有 \(2^n\) 个不同二进制串，硬编码一张任意复杂的真值表需要 \(\Omega(2^{n/2})\) 个门（Shannon 下界），多项式大小的电路根本装不下！因此不仅 \(A_{\mathrm{TM}} \notin \mathrm{PSIZE}\)，甚至在可判定语言（双指数时间）里就已经存在不属于 \(\mathrm{PSIZE}\) 的语言！`
    },
    {
      id: "ps6-q3",
      kind: "single",
      tag: "hw",
      q: String.raw`（PS6 Q5）对于 \(n\) 位奇偶校验函数 \(\oplus_n(x_1,\dots,x_n) = \sum_{i=1}^n x_i \bmod 2\)，它的最小布尔电路 Size、二分展开布尔公式叶数上界，以及 Subbotovskaya 证明的公式叶数下界分别为：`,
      choices: [
        ["a", String.raw`布尔电路 Size 为 \(\Theta(n)\)；公式叶数上界为 \(O(n^2)\)，Subbotovskaya 下界为 \(\Omega(n \log n)\)`],
        ["b", String.raw`布尔电路 Size 为 \(\Theta(n^2)\)；公式叶数上下界均为 \(\Theta(n)\)`],
        ["c", String.raw`布尔电路 Size 为 \(\Theta(2^n)\)；公式叶数下界为 \(\Omega(2^{n/2})\)`],
        ["d", String.raw`布尔电路与布尔公式的复杂度都是 \(\Theta(n)\)`]
      ],
      answer: ["a"],
      why: String.raw`电路可复用中间异或结果故仅需 \(\Theta(n)\) 个门；公式不允许扇出复用，二分法 \(A\oplus B = (A\land\neg B)\lor(\neg A\land B)\) 给出 \(L(\oplus_n)\le 4L(\oplus_{n/2}) \implies O(n^2)\)（事实上 Krapchenko 定理证明 \(n^2\) 就是紧下界，而 Subbotovskaya 随机/贪心限制法在 PS6 简化版中证出超线性下界 \(\Omega(n\log n)\)）。`
    },
    {
      id: "ps6-q4",
      kind: "single",
      tag: "hw",
      q: String.raw`（PS6 Q5b(v) 关键一步）在证明 \(L(\oplus_{n-1}) \le L(\oplus_n)(1 - \frac{1}{n}) - 1\) 时，设 \(x_i\) 是出现次数最多（\(m_i \ge L(\oplus_n)/n\)）的变量，为什么精心选择 \(x_i \in \{0,1\}\) 的赋值不仅能消去全部 \(m_i\) 片 \(x_i\) 叶子，还能额外多消去至少 <b>\(1\)</b> 片其它变量的叶子？`,
      choices: [
        ["a", String.raw`任取一片 \(x_i\)（或 \(\neg x_i\)）叶子 \(\ell\) 及其父门 \(G\)：若 \(G\) 是 \(\land\) 则令 \(\ell=0\)，若 \(G\) 是 \(\lor\) 则令 \(\ell=1\)，这会短路湮灭 \(G\) 的另一棵兄弟子树 \(H\)；而在最小公式中 \(H\) 必含至少一片不属于 \(x_i\) 的其它变量叶子！`],
        ["b", String.raw`因为每次赋值都会把整棵树的根节点消掉`],
        ["c", String.raw`因为奇偶函数固定一个变量后会变成常函数 \(0\)`],
        ["d", String.raw`因为 De Morgan 定律每次推送否定都会减少 1 片叶子`]
      ],
      answer: ["a"],
      why: String.raw`正是这额外湮灭的 \(-1\) 片其它变量叶子，使得不等式 \(L(\oplus_{n-1}) \le \frac{n-1}{n}L(\oplus_n) - 1\) 两边除以 \(n-1\) 后产生正增量 \(\frac{1}{n-1}\)，累加得出调和级数 \(\Omega(n\log n)\)！（若没有这个 \(-1\)，递推只能得出平凡的 \(L(\oplus_n) \ge n\)。）`
    }
  ],
  cards: [
    [
      String.raw`（PS6 Q1）\(A_{\mathrm{TM}}\) 是 \(\mathrm{NP}\)-hard 吗？是 \(\mathrm{NP}\)-complete 吗？为什么？`,
      String.raw`<b>是 \(\mathrm{NP}\)-hard，但不是 \(\mathrm{NP}\)-complete！</b><br>• 对任意 \(L\in\mathrm{NP}\)，固定其指数时间判定机 \(M_L\)，映射 \(f(x)=\langle M_L, x\rangle\) 只需拼接常数串，\(O(|x|)\) 时间可算，故 \(L\le_P A_{\mathrm{TM}}\)。<br>• \(\mathrm{NP}\) 中所有语言都可判定，而 \(A_{\mathrm{TM}}\) 不可判定，故 \(A_{\mathrm{TM}}\notin\mathrm{NP}\)。`
    ],
    [
      String.raw`（PS6 Q4）如何构造一个可判定但不属于 \(\mathrm{PSIZE}\) 的语言 \(L\)，并由此证明 \(A_{\mathrm{TM}} \notin \mathrm{PSIZE}\)？`,
      String.raw`• 对 \(n\ge 12\)，按字典序穷举真值表并与所有 Size \(\le 2^{\lfloor n/3\rfloor}\) 的电路比对，输出首个硬函数 \(f_n\)（由 Shannon 定理必存在），令 \(L=\{x:|x|\ge 12, f_{|x|}(x)=1\}\)。<br>• 固定 \(L\) 的判定机 \(D\)，若 \(A_{\mathrm{TM}}\in\mathrm{PSIZE}\)，在 \(A_{\mathrm{TM}}\) 电路中硬连线固定前缀 \(\langle D, \cdot\rangle\) 即得 \(L\) 的多项式电路族，矛盾！`
    ],
    [
      String.raw`（PS6 Q5）如何从 \(L(\oplus_{n-1}) \le L(\oplus_n)(1 - \frac{1}{n}) - 1\) 一步解出 \(L(\oplus_n) = \Omega(n\log n)\)？`,
      String.raw`两边同除以 \(n-1\) 得 \(\frac{L(\oplus_n)}{n} - \frac{L(\oplus_{n-1})}{n-1} \ge \frac{1}{n-1}\)；从 \(2\) 到 \(n\) 望远镜累加并代入 \(L(\oplus_1)/1 = 1\)，即得 \(L(\oplus_n) \ge n\bigl(1 + \sum_{j=1}^{n-1}\frac{1}{j}\bigr) = \Omega(n\log n)\)。`
    ]
  ]
});
