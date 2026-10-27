Review.add({
  id: "ps3",
  n: 23,
  group: "ps",
  short: "PS3 · 莱斯定理与可判定性辨析",
  title: "Problem Set 3 精讲 · 莱斯定理（Rice's Theorem）证明与七道经典不可判定/可判定题全解",
  meta: "对应 Lectures 7–9 · 官方解答与 USTF 笔记完整整合 · 语义性质 vs 语法/步数性质 · 燕尾法 (Dovetailing) · 平方步填充",
  sources: [
    { href: "materials/PS3.pdf", label: "Problem Set 3" },
    { href: "materials/SolutionsHW3.pdf", label: "PS3 Official Solutions" },
    { href: "materials/PS3%20notes%20from%20Youran.pdf", label: "USTF Tutorial Notes" }
  ],
  html: String.raw`
<h2>1. 莱斯定理（Rice's Theorem）的严格陈述、证明与适用边界（PS3 Q3）</h2>
<p>在证明了 \(A_{\mathrm{TM}}, \mathrm{EMPTY}_{\mathrm{TM}}, \mathrm{EQ}_{\mathrm{TM}}, L_{01}\) 等一系列关于图灵机语言的问题不可判定之后，<strong>莱斯定理（Rice's Theorem, 1951）</strong>给出了一个一劳永逸的元定理：<strong>关于图灵机所识别语言 \(L(M)\) 的任何非平凡性质都是不可判定的</strong>。</p>

<div class="callout must">
  <strong>定理 13.1（莱斯定理 / Rice's Theorem，PS3 Q3）</strong>
  <p>设 \(\mathcal{P}\) 是全体图灵可识别语言的一个子族（称为可识别语言的一个<strong>性质 Property</strong>）。称性质 \(\mathcal{P}\) 是<strong>非平凡的（non-trivial）</strong>，如果：</p>
  <ol>
    <li>存在至少一台图灵机 \(M_1\) 使得 \(L(M_1) \in \mathcal{P}\)（即 \(\mathcal{P} \ne \emptyset\)）；且</li>
    <li>存在至少一台图灵机 \(M_2\) 使得 \(L(M_2) \notin \mathcal{P}\)（即 \(\mathcal{P}\) 不是全体可识别语言的集合）。</li>
  </ol>
  <p>对于任何非平凡的可识别语言性质 \(\mathcal{P}\)，对应的判定语言</p>
  <div class="formula">\[
    L_{\mathcal{P}} = \{\langle M \rangle \mid M \text{ 是一台图灵机，且 } L(M) \in \mathcal{P}\}
  \]</div>
  <p>必定是<strong>不可判定的（Undecidable）</strong>。</p>
</div>

<p><strong>莱斯定理的两种标准证明（官方解答证法：从 \(L_{\mathrm{self}}\) 归约；Tutorial 证法：从 \(A_{\mathrm{TM}}\) 归约）</strong>：</p>
<ul>
  <li><strong>证法 A（官方解答：归约自 \(L_{\mathrm{self}} = \{\langle M \rangle \mid M \text{ 停机并拒绝 } \langle M \rangle\}\)）</strong>：
    <ol>
      <li>不妨设空语言 \(\emptyset \notin \mathcal{P}\)（若 \(\emptyset \in \mathcal{P}\)，则以补性质 \(\overline{\mathcal{P}}\) 代替 \(\mathcal{P}\)；由于 \(L_{\overline{\mathcal{P}}} = \overline{L_{\mathcal{P}}}\) 且可判定语言对补运算封闭，证明 \(L_{\overline{\mathcal{P}}}\) 不可判定即证明了 \(L_{\mathcal{P}}\) 不可判定）。</li>
      <li>因为 \(\mathcal{P}\) 非平凡，存在某台固定的图灵机 \(T\) 使得 \(L(T) \in \mathcal{P}\)。</li>
      <li>给定输入 \(\langle M \rangle\)，构造新图灵机 \(N\)：
<pre><code>Machine N: On input x in {0, 1}*:
  1. Simulate M on input &lt;M&gt;.
  2. If M halts and REJECTS &lt;M&gt; (i.e. &lt;M&gt; in L_self):
       Simulate T on input x, and accept iff T accepts x.
  3. Otherwise (if M accepts &lt;M&gt;, or loops forever on &lt;M&gt;):
       Reject (or loop forever on) x.</code></pre>
      </li>
      <li>分析 \(L(N)\)：
      <div class="formula">\[
        L(N) = \begin{cases}
          L(T) \in \mathcal{P}, &amp; \text{若 } \langle M \rangle \in L_{\mathrm{self}}, \\
          \emptyset \notin \mathcal{P}, &amp; \text{若 } \langle M \rangle \notin L_{\mathrm{self}}.
        \end{cases}
      \]</div>
      因此 \(\langle M \rangle \in L_{\mathrm{self}} \iff L(N) \in \mathcal{P} \iff \langle N \rangle \in L_{\mathcal{P}}\)。若 \(L_{\mathcal{P}}\) 可判定，则 \(L_{\mathrm{self}}\) 可判定，矛盾！</li>
    </ol>
  </li>
  <li><strong>证法 B（课堂/Tutorial 常用：归约自 \(A_{\mathrm{TM}}\)）</strong>：同样设 \(\emptyset \notin \mathcal{P}\) 且 \(L(T) \in \mathcal{P}\)。对输入 \(\langle M, w \rangle\)，构造 \(N(x)\)：先模拟 \(M(w)\)；若 \(M\) 接受 \(w\)，则在 \(x\) 上模拟 \(T(x)\)。于是 \(\langle M, w \rangle \in A_{\mathrm{TM}} \iff L(N) = L(T) \in \mathcal{P} \iff \langle N \rangle \in L_{\mathcal{P}}\)，故 \(A_{\mathrm{TM}} \le_m L_{\mathcal{P}}\)。</li>
</ul>

<div class="callout trap">
  <strong>使用莱斯定理前必须核对的两大前提（考试高频陷阱！）</strong>
  <p>要对语言 \(L = \{\langle M \rangle \mid \dots\}\) 调用莱斯定理，必须同时满足：</p>
  <ol>
    <li><strong>条件一：必须是纯粹关于语言 \(L(M)\) 的“语义性质（Semantic Property）”</strong>——即对于任意两台识别相同语言的图灵机 \(M_1, M_2\)（满足 \(L(M_1) = L(M_2)\)），必须有 \(\langle M_1 \rangle \in L \iff \langle M_2 \rangle \in L\)。如果条件涉及<strong>机器的状态数、磁带操作细节、运行步数或是否在某输入上停机</strong>，则<strong>不是关于 \(L(M)\) 的性质，绝对不能使用莱斯定理</strong>！</li>
    <li><strong>条件二：性质在“可识别语言（Recognizable Languages）”范围内必须是非平凡的</strong>——必须能显式举出一台图灵机 \(M_1\) 使 \(L(M_1) \in \mathcal{P}\)，以及另一台图灵机 \(M_2\) 使 \(L(M_2) \notin \mathcal{P}\)。如果<strong>所有</strong>图灵机的语言都满足 \(\mathcal{P}\)，或者<strong>没有任何</strong>图灵机的语言能满足 \(\mathcal{P}\)（例如要求 \(L(M)\) 等于某个不可识别语言），则该性质在可识别语言上是<strong>平凡的（trivial）</strong>，此时语言 \(L\) 反而是<strong>可判定的</strong>！</li>
  </ol>
</div>

<h2>2. Problem Set 3 全部七道大题逐题详解</h2>

<details class="solve" open>
  <summary>Problem 1（经典反转陷阱！）：\(L = \{\langle M \rangle \mid L(M) = \overline{A_{\mathrm{TM}}}\}\) 是否可判定？</summary>
  <div>
    <p><strong>结论</strong>：<strong>可判定（Decidable）！</strong>（千万不要误以为它不可判定！）</p>
    <p><strong>严格证明</strong>：</p>
    <ul>
      <li>由 Lecture 7 推论 7.1，\(\overline{A_{\mathrm{TM}}}\) 是<strong>不可识别的（unrecognizable）</strong>。</li>
      <li>根据“不可识别”的定义，<strong>根本不存在任何图灵机 \(M\) 能够识别 \(\overline{A_{\mathrm{TM}}}\)</strong>（即对一切图灵机 \(M\)，都有 \(L(M) \ne \overline{A_{\mathrm{TM}}}\)）。</li>
      <li>因此，集合 \(L = \{\langle M \rangle \mid L(M) = \overline{A_{\mathrm{TM}}}\} = \emptyset\)（空集）！</li>
      <li>空集 \(\emptyset\) 显然是可判定的：只需构造一台对所有输入都立即进入 \(q_{\mathrm{rej}}\) 拒绝的图灵机，即可在 \(1\) 步内判定 \(L\)。</li>
    </ul>
  </div>
</details>

<details class="solve" open>
  <summary>Problem 2：\(L = \{\langle M \rangle \mid M \text{ 是图灵机且 } L(M) \text{ 是可判定的}\}\) 是否可判定？</summary>
  <div>
    <p><strong>结论</strong>：<strong>不可判定（Undecidable）</strong>。</p>
    <p><strong>证法一（直接应用莱斯定理）</strong>：性质 \(\mathcal{P} = \{A \subseteq \{0,1\}^* \mid A \text{ 可判定}\}\) 仅依赖于 \(L(M)\)（语义性质），且非平凡：取永远拒绝的机器 \(M_\emptyset\)，有 \(L(M_\emptyset) = \emptyset \in \mathcal{P}\)；取通用图灵机 \(U\)，有 \(L(U) = A_{\mathrm{TM}} \notin \mathcal{P}\)（因为 \(A_{\mathrm{TM}}\) 可识别但不可判定）。由莱斯定理，\(L\) 不可判定。</p>
    <p><strong>证法二（官方解答：直接从 \(A_{\mathrm{TM}}\) 归约）</strong>：假设 \(D\) 判定 \(L\)。给定 \(\langle M, w \rangle\)，构造图灵机 \(N_w\)，在任意输入 \(x\) 上：</p>
    <ol>
      <li>先模拟 \(M\) 在 \(w\) 上的运行；</li>
      <li>若 \(M\) 接受 \(w\)，则在输入 \(x\) 上模拟 \(A_{\mathrm{TM}}\) 的固定识别机 \(U(x)\)，当且仅当 \(U\) 接受 \(x\) 时接受；</li>
      <li>若 \(M\) 拒绝 \(w\)，则拒绝 \(x\)（若 \(M\) 死循环，则一直循环）。</li>
    </ol>
    <p>于是：</p>
    <div class="formula">\[
      L(N_w) = \begin{cases}
        A_{\mathrm{TM}} \text{（不可判定）}, &amp; \text{若 } M \text{ 接受 } w, \\
        \emptyset \text{（可判定）}, &amp; \text{若 } M \text{ 不接受 } w.
      \end{cases}
    \]</div>
    <p>因此 \(\langle M, w \rangle \in A_{\mathrm{TM}} \iff L(N_w) \text{ 不可判定} \iff \langle N_w \rangle \notin L\)。运行 \(D(\langle N_w \rangle)\) 并将输出取反即可判定 \(A_{\mathrm{TM}}\)，矛盾！</p>
  </div>
</details>

<details class="solve" open>
  <summary>Problem 3(a)–(e)：五道莱斯定理适用性辨析题全解</summary>
  <div>
    <table>
      <thead>
        <tr>
          <th>题号与语言定义</th>
          <th>可判定性</th>
          <th>能否用莱斯定理？</th>
          <th>完整理由与证明</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>(a)</strong> \(L = \{\langle M \rangle \mid L(M) \text{ 是可识别的}\}\)</td>
          <td><strong>可判定</strong></td>
          <td><strong>不能（平凡性质）</strong></td>
          <td>根据定义，<strong>任何</strong>图灵机 \(M\) 识别的语言 \(L(M)\) 天然就是可识别的（由 \(M\) 自身识别）！不存在任何图灵机 \(M_2\) 使得 \(L(M_2)\) 不可识别。因此 \(L\) 就是全体合法图灵机编码的集合，判定机只需检查输入串是否为语法合法的图灵机编码即可。</td>
        </tr>
        <tr>
          <td><strong>(b)</strong> \(L = \{\langle M \rangle \mid M \text{ 至多有 } 30 \text{ 个状态}\}\)</td>
          <td><strong>可判定</strong></td>
          <td><strong>不能（非语义性质）</strong></td>
          <td>这是关于图灵机硬件描述 \(\langle M \rangle\) 的<strong>语法性质</strong>，而非关于语言 \(L(M)\) 的性质。判定机只需读取编码 \(\langle M \rangle = 1^k 0 1^m 0 \langle \delta \rangle\) 的前缀，检查状态数 \(2^k \le 30\) 即可停机判定。</td>
        </tr>
        <tr>
          <td><strong>(c)</strong> \(L = \{\langle M \rangle \mid M \text{ 在空串 } \varepsilon \text{ 上停机}\}\)</td>
          <td><strong>不可判定</strong></td>
          <td><strong>不能（非语义性质，需直接归约）</strong></td>
          <td><strong>为什么不能用莱斯定理？</strong>因为“在 \(\varepsilon\) 上停机”是机器的计算行为性质而非语言性质：设 \(M_1\) 在所有输入上立即停机拒绝，\(M_2\) 在所有输入上死循环，则 \(L(M_1) = L(M_2) = \emptyset\)，但 \(\langle M_1 \rangle \in L\) 而 \(\langle M_2 \rangle \notin L\)！<br><strong>直接归约（\(\mathrm{HALT}_{\mathrm{TM}} \le_m L\)）</strong>：给定 \(\langle M, w \rangle\)，构造 \(N\)：忽略自身输入（包括 \(\varepsilon\)），直接模拟 \(M\) 在 \(w\) 上的运行。则 \(\langle M, w \rangle \in \mathrm{HALT}_{\mathrm{TM}} \iff N\) 在 \(\varepsilon\) 上停机 \(\iff \langle N \rangle \in L\)。故 \(L\) 不可判定。</td>
        </tr>
        <tr>
          <td><strong>(d)</strong> \(L = \{\langle M \rangle \mid L(M) \text{ 可被某台具有偶数个状态的图灵机识别}\}\)</td>
          <td><strong>可判定</strong></td>
          <td><strong>不能（平凡性质！）</strong></td>
          <td>注意题干说的是“\(L(M)\) 可被<strong>某台</strong>偶数状态图灵机识别”！对任意图灵机 \(M\)，若 \(M\) 已有偶数个状态，则它自己就是见证；若 \(M\) 有奇数个状态，只需向 \(M\) 添加 \(1\) 个永远不可达的哑状态（dummy state）得到 \(M'\)，则 \(M'\) 有偶数个状态且 \(L(M') = L(M)\)！因此<strong>所有可识别语言都具有该性质</strong>，性质平凡，\(L\) 包含全部合法图灵机编码，可判定！</td>
        </tr>
        <tr>
          <td><strong>(e)</strong> \(L = \{\langle M \rangle \mid L(M) \text{ 可被某台状态数 } \le 30 \text{ 且带字母表大小 } \le 30 \text{ 的图灵机识别}\}\)</td>
          <td><strong>不可判定</strong></td>
          <td><strong>能！（非平凡语义性质）</strong></td>
          <td>该性质只依赖语言 \(L(M)\)。验证非平凡性：(1) 非空：\(\emptyset \in \mathcal{P}\)（1 个初始兼拒绝状态的极小图灵机即可识别 \(\emptyset\)）；(2) 非全集：状态数 \(\le 30\) 且字母表大小 \(\le 30\) 的图灵机总数是<strong>有限的</strong>，因此 \(\mathcal{P}\) 中只包含<strong>有限个</strong>语言；然而可识别语言有无穷多个（例如对每个串 \(w\)，单元素语言 \(\{w\}\) 都可识别）。故存在 \(M_2\) 使 \(L(M_2) \notin \mathcal{P}\)。由莱斯定理，\(L\) 不可判定。</td>
        </tr>
      </tbody>
    </table>
  </div>
</details>

<details class="solve" open>
  <summary>Problem 4：\(L = \{\langle M \rangle \mid L(M) \text{ 包含至少一个回文串}\}\)（燕尾法可识别 + 归约不可判定）</summary>
  <div>
    <p><strong>结论</strong>：\(L\) 是<strong>不可判定的（Undecidable）</strong>，但它是<strong>可识别的（Recognizable）</strong>。</p>
    <ol>
      <li><strong>证明 \(L\) 可识别（燕尾法 / Dovetailing，必考技术！）</strong>：
        <ul>
          <li>将全体回文串按规范序排列为无穷序列 \(p_1, p_2, p_3, \dots\)。</li>
          <li>如果直接依次完整运行 \(M(p_1), M(p_2), \dots\)，一旦 \(M(p_1)\) 死循环，就永远无法测试 \(p_2\)！</li>
          <li><strong>燕尾法（Dovetailing）分阶段调度</strong>：构造识别机 \(R\)，在输入 \(\langle M \rangle\) 上分阶段 \(i = 1, 2, 3, \dots\) 运行：在<strong>第 \(i\) 阶段</strong>，让 \(M\) 在前 \(i\) 个回文串 \(p_1, p_2, \dots, p_i\) 上各自（或推进至）运行 \(i\) 步（或各推进 \(1\) 步）。</li>
          <li>若 \(L(M)\) 包含某个回文串 \(p_k\)，且 \(M\) 在 \(p_k\) 上于第 \(t\) 步停机接受，则在有限的第 \(\max(k, t)\)（或 \(k + t\)）阶段内，\(R\) 必定模拟到该接受状态并停机接受 \(\langle M \rangle\)；若 \(L(M)\) 不含任何回文串，\(R\) 永不接受。故 \(R\) 识别 \(L\)。</li>
        </ul>
      </li>
      <li><strong>证明 \(L\) 不可判定（可用莱斯定理，或如下直接归约 \(A_{\mathrm{TM}} \le_m L\)）</strong>：
        <p>给定 \(\langle M, w \rangle\)，构造机器 \(M'_w(x)\)：若 \(x \ne w w^R\) 则立即拒绝；若 \(x = w w^R\)，则模拟 \(M(w)\) 并当 \(M\) 接受 \(w\) 时接受。由于 \(w w^R\) 必定是回文串，当 \(M\) 接受 \(w\) 时 \(L(M'_w) = \{w w^R\}\)（含回文串），否则 \(L(M'_w) = \emptyset\)（不含回文串）。故 \(\langle M, w \rangle \in A_{\mathrm{TM}} \iff \langle M'_w \rangle \in L\)。</p>
      </li>
    </ol>
  </div>
</details>

<details class="solve" open>
  <summary>Problem 5：\(L = \{\langle M \rangle \mid M \text{ 在完全平方步数（perfect-square steps）内接受串 } 01\}\)</summary>
  <div>
    <p><strong>结论</strong>：<strong>不可判定（Undecidable）</strong>。（注意：不能用莱斯定理，因为步数是机器性质而非语言性质！）</p>
    <p><strong>证明（从 \(A_{\mathrm{TM}}\) 归约 + 平方步数填充 Padding）</strong>：给定 \(\langle M, u \rangle\)，构造图灵机 \(N\)：</p>
    <ul>
      <li>在输入 \(x \ne 01\) 上，\(N\) 立即拒绝。</li>
      <li>在输入 \(x = 01\) 上，\(N\) 模拟 \(M\) 在 \(u\) 上的运行，同时在单独的轨道上用一元记数符实时记录自身自启动以来已消耗的精确步数 \(T\)。</li>
      <li>若 \(M(u)\) 拒绝或死循环，\(N\) 绝不进入接受状态；若 \(M(u)\) 在某时刻接受，设此时累计步数为 \(T\)。\(N\) 将该长度为 \(T\) 的一元块拷贝一份作为倒计时器，在原块上往返扫 \(T\) 趟（耗时 \(T^2 + O(T)\) 步），再补上固定常数步使总步数精确凑成完全平方数 \((T + k)^2\)，随后进入 \(q_{\mathrm{acc}}\) 接受 \(01\)。</li>
      <li>于是 \(\langle M, u \rangle \in A_{\mathrm{TM}} \iff N\) 在完全平方步内接受 \(01 \iff \langle N \rangle \in L\)。故 \(L\) 不可判定。</li>
    </ul>
  </div>
</details>

<details class="solve" open>
  <summary>Problem 6：\(L = \{\langle M \rangle \mid \forall w \in \{0, 1\}^*,\, M \text{ 接受 } w \iff M \text{ 接受 } w^R\}\)（语言对反转对称）</summary>
  <div>
    <p><strong>结论</strong>：<strong>不可判定（Undecidable）</strong>。</p>
    <p><strong>证法一（莱斯定理）</strong>：条件“\(\forall w,\, w \in L(M) \iff w^R \in L(M)\)”等价于 \(L(M) = (L(M))^R\)，完全只依赖 \(L(M)\)（语义性质），且非平凡：\(\emptyset = \emptyset^R \in \mathcal{P}\)，而只接受 <code>01</code> 的语言 \(\{01\} \ne \{10\} = \{01\}^R \notin \mathcal{P}\)。由莱斯定理知 \(L\) 不可判定。</p>
    <p><strong>证法二（官方解答显式归约 \(A_{\mathrm{TM}} \le_m L\)）</strong>：给定 \(\langle M, u \rangle\)，构造图灵机 \(N(x)\)：</p>
    <ul>
      <li>若 \(x = 01\)，直接<strong>接受</strong>；</li>
      <li>若 \(x = 10\)，模拟 \(M\) 在 \(u\) 上的运行，当且仅当 \(M\) 接受 \(u\) 时接受；</li>
      <li>对所有其他输入 \(x \notin \{01, 10\}\)，直接<strong>拒绝</strong>。</li>
    </ul>
    <p>分析 \(L(N)\)：若 \(M\) 接受 \(u\)，则 \(L(N) = \{01, 10\}\)（满足反转对称，\(\langle N \rangle \in L\)）；若 \(M\) 不接受 \(u\)，则 \(L(N) = \{01\}\)（含 \(01\) 但不含 \(01^R = 10\)，不满足反转对称，\(\langle N \rangle \notin L\)）。故 \(\langle M, u \rangle \in A_{\mathrm{TM}} \iff \langle N \rangle \in L\)。</p>
  </div>
</details>

<details class="solve" open>
  <summary>Problem 7：判断双带图灵机是否在某个输入上会在第 2 条带上写入非空白符</summary>
  <div>
    <p><strong>形式化语言定义</strong>：\(L = \{\langle M \rangle \mid M \text{ 是双带图灵机，且存在某输入 } x \text{ 使 } M(x) \text{ 在第 2 条带上写过非空白符}\}\)。</p>
    <p><strong>结论</strong>：<strong>不可判定（Undecidable）</strong>（同样属于机器实现细节，不可用莱斯定理，须直接归约 \(A_{\mathrm{TM}} \le_m L\)）。</p>
    <p><strong>证明</strong>：给定 \(\langle M, w \rangle\)（其中 \(M\) 为单带图灵机），构造双带图灵机 \(N_w\)：在任意输入 \(x\) 上，\(N_w\) 完全只使用<strong>第 1 条工作带</strong>去模拟单带机 \(M\) 在 \(w\) 上的运行（保持第 2 条工作带全为空白且不写入任何符号）；<strong>仅当模拟发现 \(M\) 在 \(w\) 上进入接受状态 \(q_{\mathrm{acc}}\) 时</strong>，\(N_w\) 才在第 2 条工作带上写入一个非空白符 <code>1</code> 并停机。于是 \(\langle M, w \rangle \in A_{\mathrm{TM}} \iff N_w\) 会在第 2 条带上写入非空白符 \(\iff \langle N_w \rangle \in L\)。故 \(L\) 不可判定。</p>
  </div>
</details>
`,
  questions: [
    {
      id: "ps3-q1",
      kind: "single",
      tag: "hw",
      q: String.raw`（PS3 Q1，高频易错题！）考虑语言 \(L = \{\langle M \rangle \mid L(M) = \overline{A_{\mathrm{TM}}}\}\)。关于 \(L\) 的可判定性，下列哪项是正确的？`,
      choices: [
        ["a", String.raw`\(L\) 是可判定的（Decidable），因为 \(\overline{A_{\mathrm{TM}}}\) 不可识别，不存在任何图灵机 \(M\) 满足 \(L(M) = \overline{A_{\mathrm{TM}}}\)，故 \(L = \emptyset\)，总是拒绝的图灵机即可判定它`],
        ["b", String.raw`\(L\) 是不可判定的，由莱斯定理直接得出`],
        ["c", String.raw`\(L\) 是可识别但不可判定的`],
        ["d", String.raw`\(L\) 包含所有图灵机的编码`]
      ],
      answer: ["a"],
      why: String.raw`莱斯定理要求性质 \(\mathcal{P}\) 在<strong>可识别语言</strong>的范围内非空（存在 \(M_1\) 使 \(L(M_1) \in \mathcal{P}\)）。由于 \(\overline{A_{\mathrm{TM}}}\) 是不可识别语言，没有任何图灵机能识别它，因此满足 \(L(M) = \overline{A_{\mathrm{TM}}}\) 的图灵机集合是空集 \(L = \emptyset\)，而空集天然可判定！`
    },
    {
      id: "ps3-q2",
      kind: "single",
      tag: "hw",
      q: String.raw`（PS3 Q3(d) vs Q3(e)）对比以下两个语言：<br>
\(L_d = \{\langle M \rangle \mid L(M) \text{ 可被某台具有偶数个状态的图灵机识别}\}\)，<br>
\(L_e = \{\langle M \rangle \mid L(M) \text{ 可被某台状态数 } \le 30 \text{ 且字母表大小 } \le 30 \text{ 的图灵机识别}\}\)。<br>
它们的可判定性分别是什么？`,
      choices: [
        ["a", String.raw`\(L_d\) 可判定（因为任何图灵机都可通过加 1 个不可达哑状态凑成偶数状态而不改变语言，性质平凡）；\(L_e\) 不可判定（因为状态和字母表受限的图灵机只有有限台，只能识别有限个语言，性质非平凡，由莱斯定理知不可判定）`],
        ["b", String.raw`\(L_d\) 和 \(L_e\) 都可判定`],
        ["c", String.raw`\(L_d\) 和 \(L_e\) 都不可判定`],
        ["d", String.raw`\(L_d\) 不可判定，\(L_e\) 可判定`]
      ],
      answer: ["a"],
      why: String.raw`对于 \(L_d\)，任意可识别语言 \(L(M)\) 若原识别机状态数为奇数，加一个不可达状态即变为偶数状态且语言不变，故全体可识别语言都满足该性质（\(L_d\) 等于全体合法编码，可判定）。对于 \(L_e\)，满足 \(|Q|\le 30, |\Sigma|\le 30\) 的图灵机只有有限多台，故该性质只包含有限个可识别语言（非空且非全集），由莱斯定理知不可判定。`
    },
    {
      id: "ps3-q3",
      kind: "single",
      tag: "hw",
      q: String.raw`（PS3 Q4）在证明 \(L = \{\langle M \rangle \mid L(M) \text{ 包含至少一个回文串}\}\) 是<strong>可识别的（recognizable）</strong>时，为什么必须使用<strong>燕尾法（dovetailing）</strong>按阶段交错模拟 \(M\) 在 \(p_1, p_2, \dots, p_i\) 上的运行，而不能逐个把 \(M(p_1)\) 跑完再跑 \(M(p_2)\)？`,
      choices: [
        ["a", String.raw`因为 \(M\) 可能在第一个回文串 \(p_1\) 上无限循环，却在第二个回文串 \(p_2\) 上停机接受；若逐个串行运行，死循环在 \(p_1\) 上会导致永远无法发现 \(p_2 \in L(M)\)`],
        ["b", String.raw`因为回文串的集合是不可数的`],
        ["c", String.raw`因为燕尾法可以把不可判定语言变成可判定语言`],
        ["d", String.raw`因为图灵机不能判断一个给定的字符串是不是回文串`]
      ],
      answer: ["a"],
      why: String.raw`当无穷多个候选输入（\(p_1, p_2, \dots\)）中有些会导致 \(M\) 死循环、有些会被 \(M\) 在第 \(t\) 步接受时，只有通过燕尾法（在第 \(i\) 阶段对前 \(i\) 个输入各模拟 \(1\) 步或 \(i\) 步），才能保证任何一个在有限步 \(t\) 内接受的 \(p_k\) 都一定会在有限阶段（如第 \(k+t\) 阶段）被探测到。`
    }
  ],
  cards: [
    [
      String.raw`莱斯定理（Rice's Theorem）的两个前提条件是什么？`,
      String.raw`1. <strong>语义性质（Semantic）</strong>：只依赖于图灵机识别的语言 \(L(M)\)，与机器的具体状态数、步数或内部动作无关；<br>2. <strong>非平凡性（Non-trivial）</strong>：在可识别语言范围内既非空也非全集（\(\exists M_1,\, L(M_1)\in\mathcal{P}\) 且 \(\exists M_2,\, L(M_2)\notin\mathcal{P}\)）。`
    ],
    [
      String.raw`（PS3 Q1）为什么 \(L = \{\langle M \rangle \mid L(M) = \overline{A_{\mathrm{TM}}}\}\) 是可判定的？`,
      String.raw`因为 \(\overline{A_{\mathrm{TM}}}\) 是不可识别语言，没有任何图灵机能够识别它，故 \(L = \emptyset\)。空语言可由永远拒绝的图灵机判定。`
    ],
    [
      String.raw`什么是燕尾法（Dovetailing）？它用于解决什么问题？`,
      String.raw`当需要在可数无穷多个计算分支 \(M(x_1), M(x_2), \dots\) 中寻找是否存在某一个停机接受的分支时，分阶段 \(i=1,2,\dots\) 让前 \(i\) 个分支各推进 \(1\) 步（或运行 \(i\) 步），防止被单个死循环分支卡死。`
    ]
  ]
});
