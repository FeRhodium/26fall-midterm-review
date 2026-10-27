Review.setup({
  key: "csc3150-v3",
  code: "CSC3150",
  name: "操作系统",
  other: { href: "../4010/", label: "CSC4010" },
  exam: {
    start: "2026-11-05T10:30:00+08:00",
    when: "11 月 5 日（周四）10:30–11:50 笔试",
    where: "Administration Building E101（课堂随堂笔试）",
    badge: "期中 <b>20%</b> · 11/5 10:30 · 可带 <b>1 张双面</b>小抄"
  },
  sheetKicker: "期中允许携带 1 张双面手写小抄（2026-10-27 公告）· 禁止电子设备 · 建议按本页提纲手写整理",
  groups: [
    { id: "lecture", label: "课程讲义 · Lecture 1–13", note: "按定义、机制、推导与实例的结构整理已发布的 lec01–lec13 全部课件内容（含 Lec11–12 调度与 EEVDF、Lec13 实时调度与死锁）。" },
    { id: "preview", label: "预习讲义 · Lecture 14", note: "对应课程表中期中前最后一讲：现代集群调度论文（Firmament / Gandiva / Synergy）。" },
    { id: "exam", label: "官方样卷 · Sample Final", note: "Spring 2026 Final 样卷逐题全解；期中重点 Q1–Q5 与 Q7.1，Q6/Q7.2–3/Q8 为期末预习。" }
  ],
  tags: { slide: "课件", sample: "样卷", practice: "练习" },
  home: String.raw`
<p class="kicker">CSC3150 Operating Systems · Fall 2026 · Prof. Yunming Xiao</p>
<h1>期中复习</h1>
<div class="facts">
  <div class="card"><dl>
    <dt>考试时间</dt><dd>2026 年 11 月 5 日（周四）课堂时间（10:30–11:50，AB E101），11 月 3 日为 Midterm Review。</dd>
    <dt>考试形式</dt><dd>闭卷笔试（占总评 20%）。可带 <b>1 张双面手写小抄</b>，禁止电子设备（2026-10-27 公告）。期末为上机考试（30%），4 个 xv6 项目共占 50%。</dd>
    <dt>考查范围</dt><dd>Lecture 1–14：操作系统概念、系统编程（线程、进程、文件、套接字、管道）、并发与同步（锁、信号量、管程、AI 系统并发）、CPU 调度（FCFS/RR/SRTF/MLFQ/Linux O(1)/Max-Min/Lottery/WFQ/EEVDF）、实时调度与死锁、集群调度论文。官方 <a href="#/c/sample">Sample Final 样卷</a>已发布（期中重点 Q1–Q5）。</dd>
    <dt>课程体系</dt><dd>基于 UC Berkeley CS162，参考教材为 OSTEP（Operating Systems: Three Easy Pieces）与 Silberschatz OS Concepts。</dd>
  </dl></div>
  <div class="card seat-card"><div><div>期中笔试</div><div class="big">11/5</div></div><p>占总评 20% · L1–L14</p></div>
</div>
<h2>分模块复习路径</h2>
<div class="plan">
  <article><b>模块一：核心抽象与进程（L1–L4）</b>操作系统的三类功能与评价指标；线程、地址空间、进程、双模式运行与 Base &amp; Bound；PCB 与上下文切换；pthread API；fork/exec/wait 与信号。</article>
  <article><b>模块二：I/O 与进程间通信（L5–L6）</b>POSIX 文件抽象；C 标准流（FILE*，用户态缓冲）与文件描述符（系统调用）的差异；打开文件描述表与 fork 后的偏移量共享；TCP 套接字服务器演进与匿名管道。</article>
  <article><b>模块三：并发与同步（L7–L10）</b>clone 标志与线程栈布局；竞争条件、原子操作与 Peterson 算法；关中断、test&amp;set 自旋锁、睡眠队列锁、Linux futex；信号量与管程（Mesa 语义）实现有界缓冲区和读者-写者锁；PipeDream（1F1B 与权重暂存）、Orca（迭代级调度）与 DistServe（Prefill/Decode 分离）。</article>
  <article class="today"><b>模块四：CPU 调度、EEVDF、死锁与集群论文（L11–L14）</b>FCFS 护航效应、RR 时间片权衡与等长作业反例、严格优先级与优先级反转、SRTF 磁盘利用率算例（\(9/201\approx 4.5\%\) vs \(90\%\)）与指数平均预测；MLFQ 与 Othello <code>printf</code> 攻击、Linux O(1) 双队列、Max-Min 公平（\(\sum\min(r_i,fw_i)=C\)）、Lottery、WFQ 虚拟时间 \(F_i^{k+1}\) 与 EEVDF（\(O(1)q\) 滞后）；EDF/RMS、死锁四条件、银行家算法与 Firmament/Gandiva/Synergy。</article>
</div>
`,
  sheet: String.raw`
<div class="sheet-grid">
<h3>核心概念（L1–L3）</h3>
<p>操作系统三类功能：资源保护与隔离（Referee）、硬件虚拟化（Illusionist）、公共标准服务（Glue）。评价维度：开销、公平性、可移植性、可靠性（MTTF/MTTR）、安全性（完整性/隐私）、性能（响应时间/吞吐量/可预测性）。</p>
<p>四个基本概念：线程 = 独立执行上下文（PC、寄存器、栈）；地址空间 = 可访问地址集合（代码、静态数据、堆向上、栈向下）；进程 = 地址空间 + 一个或多个线程（受限权限保护域）；双模式 = 用户态与内核态。</p>
<p>进入内核的三种非编程控制转移：系统调用（同步、主动）、中断（异步、外部设备/定时器）、异常/陷阱（同步、指令错误），通过中断向量表跳转。Base &amp; Bound：\(\text{物理地址}=\text{Base}+\text{虚拟地址}&lt;\text{Bound}\)。</p>
<p>同一进程内线程共享：全局变量、堆、代码、文件描述符；线程私有（存于 TCB）：寄存器（含 PC）、执行栈。并发（时间交叠处理多任务）\(\ne\) 并行（多核同时执行）。</p>
<h3>进程、文件与通信（L4–L6）</h3>
<p><code>fork</code>：父进程得子 PID（\(&gt;0\)），子进程得 \(0\)，失败 \(&lt;0\)；子进程仅含调用 <code>fork</code> 的单个线程；连续 \(k\) 次 <code>fork</code> 产生 \(2^k\) 个进程。<code>exec</code> 替换程序映像，成功不返回；Shell 循环为 <code>fork</code> + 子 <code>exec</code> + 父 <code>wait</code>。<code>SIGINT</code> 默认终止进程，<code>SIGKILL</code>/<code>SIGSTOP</code> 不可捕获或忽略。</p>
<p><code>FILE*</code> 含用户态缓冲区（减少系统调用开销并提供格式化/按行读），<code>printf</code> 无换行时延迟输出；<code>fd</code> 为内核表下标，<code>write</code> 立即进入内核。<code>read</code> 返回实际字节数（可少于请求），<code>0</code> 为 EOF，<code>-1</code> 为错误。<code>fd</code> 指向内核打开文件描述（含磁盘位置与当前偏移量）；<code>fork</code> 复制 <code>fd</code> 表但共享同一打开文件描述（共享文件偏移量）。</p>
<p>TCP 服务器：<code>socket</code> \(\to\) <code>bind</code> \(\to\) <code>listen</code> \(\to\) <code>accept</code>（返回新建连接套接字）；客户端：<code>socket</code> \(\to\) <code>connect</code>。<code>fork</code> 型服务器中子进程须关闭监听套接字、父进程须关闭连接套接字；v2 含 <code>wait</code>（串行），v3 去 <code>wait</code>（并发）。<code>pipe(fd)</code>：写 <code>fd[1]</code>、读 <code>fd[0]</code>，父子须关闭不用的一端以保证写端引用归零时读者收到 EOF。</p>
<h3>同步机制与 AI 系统并发（L7–L10）</h3>
<p><code>clone</code>：全开共享标志为线程，全关为进程。<code>counter++</code> 编译为 load/add/store 三条指令，交错导致更新丢失。Peterson 算法：<code>flag[i]=1; turn=j; while(flag[j] &amp;&amp; turn==j);</code>。</p>
<p>锁实现：(1) 关中断（不可用于用户态及多核；须在检查/修改锁变量期间关中断，睡眠前把开中断责任交给下一线程）；(2) <code>test&amp;set</code> 自旋锁（忙等消耗 CPU 并引发多核缓存行失效）；(3) guard + 睡眠队列（仅在修改锁状态时短暂自旋）；(4) Linux <code>futex(addr, WAIT/WAKE, val)</code>（无竞争时纯用户态原子操作，有竞争时仅当 <code>*addr == val</code> 才入睡以避免丢失唤醒）。</p>
<p>信号量：非负整数，<code>P()</code> 等待正数并减 1，<code>V()</code> 加 1 并唤醒；互斥锁初值为 1，条件同步初值为 0。有界缓冲区（<code>empty=N, full=0, mutex=1</code>）：<b>必须先 <code>P(empty/full)</code> 再 <code>P(mutex)</code></b>，顺序颠倒会导致死锁。</p>
<p>管程 = 单个互斥锁 + 条件变量。<code>wait(&amp;lock)</code> 原子地释放锁并睡眠，被唤醒返回前重新获取锁；Mesa 语义下被唤醒线程与新到线程竞争锁，<b>必须使用 <code>while</code> 循环重检条件</b>。写者优先读者-写者锁：读者等待 <code>AW + WW &gt; 0</code>，写者等待 <code>AW + AR &gt; 0</code>。</p>
<p>L10：数据并行（AllReduce 同步梯度）、模型并行（跨设备激活传输导致低利用率）、PipeDream 流水线并行（1F1B 调度与权重版本暂存 Weight Stashing）。Orca：迭代级调度 + 选择性批处理。DistServe：分离计算密集的 prefill（决定 TTFT）与访存密集的 decode（决定 TPOT）。</p>
<h3>CPU 调度、EEVDF、死锁与集群（L11–L14）</h3>
<p><b>L11 经典调度</b>：\(\text{周转}=\text{完成}-\text{到达}\)，\(\text{等待}=\text{周转}-\text{运行}\)。FCFS 有护航效应（\(24,3,3\) 平均等待 \(17\) vs \(3\)）。RR：\(n\) 进程时间片 \(q\) 至多等 \((n-1)q\)；切换开销 \(0.1\text{–}1\text{ ms}\)，现代 \(q\in[10,100]\text{ ms}\)（开销 \(\approx 1\%\)）；<b>等长作业下 RR 平均完成时间远差于 FCFS</b>（10 个 \(100\text{ s}\) 作业在 \(q=1\text{ s}\) 下平均完成 \(995.5\text{ s}\) vs FCFS \(550\text{ s}\)）。严格优先级有饥饿与<b>优先级反转</b>（低持锁、高等待、中抢占）。SRTF 全局最小化平均响应时间；A/B 纯 CPU + C（\(1\text{ ms}\) CPU + \(9\text{ ms}\) 磁盘）下，RR(\(100\text{ ms}\)) 磁盘利用率仅 \(9/201\approx 4.5\%\)，SRTF 达 \(90\%\)。指数平均预测 \(\tau_n=\alpha t_{n-1}+(1-\alpha)\tau_{n-1}\)。</p>
<p><b>L12 进阶与公平调度</b>：MLFQ 超时降级、未超时留高层（Othello 插入无用 <code>printf</code> 欺骗调度器）。Linux O(1)：140 级（0–99 实时/内核，100–139 用户 nice，数值越小优先级越高），Active/Expired 双队列交换指针，<code>sleep_avg = sleep - run</code> 与 Interactive Credit（\(\pm 5\)）。Max-Min 公平：小需求先满足并扣除容量（\(C=10,D=[8,6,2]\implies [4,4,2]\)）；加权方程 \(\sum\min(r_i,fw_i)=C\)（\(w=[3,1,1]\implies f=2,A=[6,2,2]\)）。Lottery：随机飞镖选首个前缀和 \(\ge d\) 的任务。WFQ：虚拟时间 \(\partial V/\partial t=C/N(t)\)，虚拟完成时间 \(F_i^{k+1}=\max(V(a_i^{k+1}),F_i^k)+L_i^{k+1}/w_i\)（WFQ 服务滞后 \(O(n)q\)）。<b>EEVDF</b>：仅调度虚拟开始时间 \(\le V(t)\) 的<b>合格（Eligible）</b>任务中虚拟截止期最早者，将服务滞后降至 <b>\(O(1)q\)</b>（与 \(n\) 无关），单次复杂度 \(O(\log n)\)（Lottery 滞后 \(O(\sqrt{n})q\)、复杂度 \(O(1)\)）。</p>
<p><b>L13–14 实时、死锁与集群</b>：实时调度 EDF（\(\sum C_i/T_i\le 1\)）与 RMS（\(\le n(2^{1/n}-1)\to\ln 2\)）。死锁四条件（互斥、持有并等待、不可抢占、循环等待；全局加锁顺序破坏循环等待）；RAG 单实例有环必死锁、多实例有环未必死锁；银行家算法 \(\text{Need}=\text{Max}-\text{Allocation}\)。集群论文：Firmament（最小费用最大流）、Gandiva（GPU 时间片与迁移）、Synergy（CPU/内存敏感度异构配比）。</p>
<h3>样卷高频题型速记（Sample Final Q1–Q5）</h3>
<p><b>pthread 指针</b>：<code>pthread_create</code> 的 <code>thread</code> 要回写新 ID 故传 <code>pthread_t*</code>；<code>arg</code> 传任意类型故 <code>void*</code>；<code>pthread_exit</code> 返回任意类型故 <code>void*</code>；<code>pthread_join</code> 要回写那个 <code>void*</code> 故传 <code>void**</code>。<b>fork</b>：父得子 PID、子得 0；地址空间逻辑复制（COW），打开文件描述（含偏移）共享，PID/信号/其它线程不共享。无亲缘 IPC 选 Socket / 命名共享内存，不选匿名管道。</p>
<p><b>有界缓冲区</b>：<code>put</code> 先 <code>wait(empty)</code> 再 <code>lock(m)</code>，写 <code>buf[tail]</code> 后 <code>signal(full)</code>；<code>get</code> 对称。先锁后等资源信号量会满时持锁死锁；删互斥锁则多生产者同写 <code>buf[tail]</code> 丢数据。<b>MLFQ 样卷</b>：降级 2/4/9，完成 B10、C11、A12，等待 A6/B6/C2。<b>死锁检测</b>：多实例先算 <code>Avail</code>，逐个找 <code>Request&lt;=Avail</code> 的进程归还 <code>Alloc</code>，剩下的即死锁。</p>
</div>
`
});
