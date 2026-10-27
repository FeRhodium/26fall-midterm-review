Review.add({
  id: "l04", group: "lecture", n: 4,
  short: "L4 同步导论与进程 API",
  title: "Lecture 4 · 指令交错、竞争条件、互斥锁与 UNIX 进程 API",
  meta: "9 月 17 日 · System Programming 2",
  sources: [{ label: "lec04 课件", href: "materials/lectures/lec04-process.pdf" }],
  html: String.raw`
<p class="lede">本讲分为两部分：前半部分从线程调度的任意交错出发，定义竞争条件（Race Condition）、同步、互斥、临界区与锁（<code>acquire</code>/<code>release</code>）；后半部分系统介绍 UNIX 进程管理 API（<code>exit</code>、<code>fork</code>、<code>exec</code>、<code>wait</code>、<code>kill</code>、<code>sigaction</code>）及命令行 Shell 的实现模式。</p>

<h2>1. 指令交错、竞争条件与互斥锁</h2>
<h3>1.1 非确定性交错与竞争条件</h3>
<p>不共享任何状态的线程称为<b>独立线程</b>，其执行结果确定且可复现；共享状态的线程称为<b>协作线程</b>。由于调度器可在任意时刻切换线程，当程序结果依赖于多个线程指令执行的相对时序时，即存在<b>竞争条件（Race Condition）</b>。</p>
<p><b>算例</b>：设共享变量初始值为 \(x=0,y=0\)。线程 A 执行 <code>x = y + 1;</code>，线程 B 依次执行 <code>y = 2; y = y * 2;</code>。按 A 读取 <code>y</code> 的时刻不同，有三种合法交错：</p>
<ul>
<li>A 在 <code>y = 2</code> 之前读取 <code>y</code>（读到 0）：最终 \(x = 1\)。</li>
<li>A 在 <code>y = 2</code> 与 <code>y = y * 2</code> 之间读取 <code>y</code>（读到 2）：最终 \(x = 3\)。</li>
<li>A 在 <code>y = y * 2</code> 之后读取 <code>y</code>（读到 4）：最终 \(x = 5\)。</li>
</ul>
<p>因此最终 \(x\in\{1,3,5\}\)。同理，若两个线程在不加同步的情况下并发修改同一棵二叉搜索树的指针，交错写入会直接破坏树的结构不变式。</p>

<h3>1.2 四个基本同步概念</h3>
<ul>
<li><b>同步（Synchronization）</b>：多个线程之间围绕共享数据或事件顺序进行的协调机制。</li>
<li><b>互斥（Mutual Exclusion）</b>：保证同一时刻至多只有一个线程执行特定操作的性质。</li>
<li><b>临界区（Critical Section）</b>：访问共享资源、要求同一时刻至多只有一个线程执行的代码段。</li>
<li><b>锁（Lock / Mutex）</b>：同一时刻至多只能被一个线程持有的同步对象，提供两个原子操作：
  <ul>
  <li><code>acquire()</code>（或 <code>pthread_mutex_lock</code>）：等待直至锁处于空闲状态，随后原子地将其置为占用状态并返回。</li>
  <li><code>release()</code>（或 <code>pthread_mutex_unlock</code>）：将锁置为空闲状态并唤醒等待线程；仅允许由当前持锁线程调用。</li>
  </ul>
</li>
</ul>

<h2>2. UNIX 进程管理 API</h2>
<table>
<thead><tr><th>系统调用</th><th>功能定义</th><th>对应线程接口</th></tr></thead>
<tbody>
<tr><td><code>exit(status)</code></td><td>终止当前进程，释放用户态资源并将退出状态码交给内核</td><td><code>pthread_exit</code></td></tr>
<tr><td><code>fork()</code></td><td>完整复制当前进程，创建一个拥有独立地址空间的新子进程</td><td><code>pthread_create</code>（创建执行流）</td></tr>
<tr><td><code>execv(path, argv)</code></td><td>用新可执行文件替换当前进程的代码段、数据段、堆和栈（PID 不变）</td><td>无对应</td></tr>
<tr><td><code>wait(&amp;status)</code></td><td>阻塞父进程直至任一子进程终止，回收其 PID 与退出状态</td><td><code>pthread_join</code></td></tr>
<tr><td><code>kill(pid, sig)</code></td><td>向指定 PID 的进程发送信号 <code>sig</code></td><td><code>pthread_kill</code></td></tr>
<tr><td><code>sigaction(sig, ...)</code></td><td>注册或修改进程对指定信号 <code>sig</code> 的自定义处理函数</td><td>无对应</td></tr>
</tbody>
</table>
<p>注：C 可执行文件的真正入口位于 C 运行时库（<code>crt0</code>），运行时库调用 <code>main()</code>，并在 <code>main()</code> 返回后自动调用 <code>exit()</code>。</p>

<h3>2.1 <code>fork()</code> 的精确语义</h3>
<div class="callout must"><strong><code>pid_t fork(void)</code> 的复制范围与返回值</strong><ul>
<li><b>复制内容</b>：内核为子进程分配新的 PID，复制父进程的虚拟地址空间（代码、全局变量、堆、栈）及打开的文件描述符表。<b>子进程仅包含调用 <code>fork()</code> 的那一个线程</b>（父进程的其他线程不会被复制到子进程中）。</li>
<li><b>三次分类返回值</b>：在<b>父进程</b>中返回子进程的 PID（\(&gt;0\)）；在<b>子进程</b>中返回 **<code>0</code>**；若创建失败则返回负数（\(&lt;0\)）。</li>
</ul></div>
<p><code>fork()</code> 返回后，父子进程各自独立并发执行后续指令，输出先后顺序由调度器决定（即使在循环中加入 <code>sleep(1)</code> 也只能增大交替出现的概率，不能提供确定性的顺序保证）。若连续无条件调用 \(k\) 次 <code>fork()</code>，每次调用使进程总数翻倍，最终共有 \(2^k\) 个进程。</p>

<h3>2.2 <code>exec</code>、<code>wait</code> 与 Shell 实现模式</h3>
<pre>pid_t cpid = fork();
if (cpid &gt; 0) {                         // 父进程（如 Shell）
    int status;
    pid_t tcpid = wait(&amp;status);        // 阻塞等待子进程结束
} else if (cpid == 0) {                 // 子进程
    char *args[] = {"ls", "-l", NULL};
    execv("/bin/ls", args);             // 装入新程序映像；若成功则永不返回
    perror("execv failed");             // 仅当 execv 失败时才会执行到此行
    exit(1);
}</pre>
<p><b>为什么 UNIX 将创建进程拆分为 <code>fork</code> + <code>exec</code> 两步</b>：分离设计允许父进程在 <code>fork()</code> 之后、子进程调用 <code>exec()</code> 之前，在子进程上下文中通过普通 C 代码修改子进程的环境状态（最典型的是关闭或复制文件描述符以实现输入输出重定向与管道连接），而无需给进程创建接口增加大量复杂的参数。</p>

<h3>2.3 信号（Signals）处理</h3>
<ul>
<li>信号是内核或进程向目标进程发送的软件事件通知。若进程未通过 <code>sigaction</code> 注册自定义处理函数，则执行系统默认动作：例如收到 <code>SIGINT</code>（终端按下 <code>Ctrl-C</code>）或 <code>SIGTERM</code>（<code>kill</code> 命令默认信号）时默认<b>终止进程</b>；收到 <code>SIGTSTP</code>（<code>Ctrl-Z</code>）时默认<b>暂停进程</b>。</li>
<li><b>不可捕获的信号</b>：**<code>SIGKILL</code> 与 <code>SIGSTOP</code> 不能被进程捕获、阻塞或忽略**。操作系统必须保留一种无条件终止或挂起任意失控/恶意进程的强制机制。</li>
</ul>

<h2>3. 多线程与多进程的工程权衡</h2>
<table>
<thead><tr><th>维度</th><th>多线程（同一进程内）</th><th>多进程（独立地址空间）</th></tr></thead>
<tbody>
<tr><td>创建与上下文切换开销</td><td>低（无需复制或切换地址空间/页表）</td><td>高（需创建并切换独立地址空间）</td></tr>
<tr><td>数据共享与通信开销</td><td>极低（直接读写共享全局变量与堆）</td><td>高（必须通过管道、套接字等内核 IPC）</td></tr>
<tr><td>故障隔离与安全性</td><td>弱（单线程非法内存访问会导致整个进程崩溃）</td><td>强（硬件边界隔离，单个进程崩溃不影响其他进程）</td></tr>
</tbody>
</table>

<h2>考前清单</h2>
<ul>
<li>竞争条件的定义与指令交错结果枚举；同步、互斥、临界区、锁（<code>acquire</code>/<code>release</code>）的区分。</li>
<li><code>fork</code> 的返回值（父 <code>&gt;0</code>、子 <code>0</code>、错 <code>&lt;0</code>）、单线程复制规则、\(k\) 次 <code>fork</code> 产生 \(2^k\) 个进程。</li>
<li><code>exec</code> 成功不返回的性质；Shell 的 <code>fork</code>–<code>exec</code>–<code>wait</code> 循环；<code>fork</code> 与 <code>exec</code> 分离的理由。</li>
<li>常见信号（<code>SIGINT</code>、<code>SIGTERM</code>、<code>SIGTSTP</code>）的默认行为；<code>SIGKILL</code> 与 <code>SIGSTOP</code> 不可捕获的原因。</li>
</ul>
`,
  questions: [
    { id: "q1", tag: "slide", kind: "multi", q: String.raw`设共享变量初值为 \(x=0,y=0\)。线程 A 执行 &lt;code&gt;x = y + 1;&lt;/code&gt;，线程 B 执行 &lt;code&gt;y = 2; y = y * 2;&lt;/code&gt;。两线程结束后 \(x\) 的可能取值包括`, choices: [["a", "1"], ["b", "2"], ["c", "3"], ["d", "4"], ["e", "5"]], answer: ["a", "c", "e"], why: String.raw`A 读取 <code>y</code> 时，<code>y</code> 的可能值为 0、2、4，故 \(x=y+1\in\{1,3,5\}\)。` },
    { id: "q2", tag: "slide", kind: "single", q: String.raw`“访问共享资源、要求同一时刻至多只有一个线程执行的代码段”称为`, choices: [["a", "互斥锁（Mutex）"], ["b", "临界区（Critical Section）"], ["c", "信号（Signal）"], ["d", "条件变量"]], answer: ["b"], why: String.raw`代码段本身称为临界区；互斥是性质，锁是实现互斥的对象。` },
    { id: "q3", tag: "slide", kind: "single", q: String.raw`当 &lt;code&gt;fork()&lt;/code&gt; 成功创建子进程时，它在子进程中的返回值是`, choices: [["a", "子进程自身的 PID"], ["b", "父进程的 PID"], ["c", "0"], ["d", "-1"]], answer: ["c"], why: String.raw`父进程获得子进程 PID（<code>&gt;0</code>），子进程获得 <code>0</code>。` },
    { id: "q4", tag: "slide", kind: "tf", q: String.raw`若一个含 4 个线程的进程调用 &lt;code&gt;fork()&lt;/code&gt;，新创建的子进程中也包含 4 个线程。`, answer: ["f"], why: String.raw`<code>fork()</code> 仅复制调用 <code>fork()</code> 的那一个执行线程，子进程初始只有 1 个线程。` },
    { id: "q5", tag: "practice", kind: "single", q: String.raw`单线程程序执行 <code>fork(); fork(); fork(); printf("x\n");</code>（假设均成功），共输出多少次 <code>x</code>？`, choices: [["a", "3"], ["b", "4"], ["c", "6"], ["d", "8"]], answer: ["d"], why: String.raw`3 次 <code>fork()</code> 共产生 \(2^3=8\) 个进程，每个进程各执行一次 <code>printf</code>。` },
    { id: "q6", tag: "slide", kind: "tf", q: String.raw`&lt;code&gt;execv&lt;/code&gt; 系统调用执行成功后会向调用者返回 0。`, answer: ["f"], why: String.raw`<code>execv</code> 成功时会将当前进程的代码段和栈完全替换为新程序，永远不会返回到原调用点；一旦返回说明调用失败。` },
    { id: "q7", tag: "slide", kind: "single", q: String.raw`未注册信号处理函数的进程收到 &lt;code&gt;SIGINT&lt;/code&gt;（Ctrl-C）信号时，系统默认行为是`, choices: [["a", "忽略该信号"], ["b", "终止该进程"], ["c", "仅打印警告信息"]], answer: ["b"], why: String.raw`<code>SIGINT</code> 的默认处理动作是终止进程。` },
    { id: "q8", tag: "slide", kind: "multi", q: String.raw`下列哪些信号不能通过 &lt;code&gt;sigaction&lt;/code&gt; 注册自定义处理函数或被忽略？`, choices: [["a", "SIGINT"], ["b", "SIGTERM"], ["c", "SIGKILL"], ["d", "SIGSTOP"]], answer: ["c", "d"], why: String.raw`内核强制保留 <code>SIGKILL</code> 与 <code>SIGSTOP</code> 的默认行为，以确保任何进程都可被终止或暂停。` },
    { id: "q9", tag: "slide", kind: "single", q: String.raw`UNIX 将创建新程序的接口设计为 &lt;code&gt;fork()&lt;/code&gt; 与 &lt;code&gt;exec()&lt;/code&gt; 两个独立调用的主要好处是`, choices: [["a", "减少硬件指令条数"], ["b", "允许子进程在调用 <code>exec()</code> 之前用普通代码修改其文件描述符等环境状态（如实现重定向）"], ["c", "避免使用页表"]], answer: ["b"], why: String.raw`在 <code>fork()</code> 与 <code>exec()</code> 之间插入代码可灵活配置子进程的 표준输入输出、工作目录与权限。` },
    { id: "q10", tag: "slide", kind: "tf", q: String.raw`在父子进程的打印循环中各加入 &lt;code&gt;sleep(1)&lt;/code&gt; 即可在逻辑上严格保证父子进程一行接一行地交替输出。`, answer: ["f"], why: String.raw`<code>sleep</code> 不能替代同步原语；当系统负载较高或调度延迟变化时，任意交错仍可能发生。` },
    { id: "q11", tag: "slide", kind: "single", q: String.raw`C 程序的 &lt;code&gt;main&lt;/code&gt; 函数直接执行 &lt;code&gt;return 0;&lt;/code&gt; 而未显式调用 &lt;code&gt;exit(0)&lt;/code&gt; 时，进程如何结束？`, choices: [["a", "进程死锁"], ["b", "调用 <code>main</code> 的 C 运行时库启动例程在 <code>main</code> 返回后自动调用 <code>exit</code>"], ["c", "触发非法指令异常"]], answer: ["b"], why: String.raw`C 运行时库入口代码形如 <code>exit(main(argc, argv));</code>。` }
  ],
  cards: [
    [String.raw`竞争条件（Race Condition）`, String.raw`程序输出或状态取决于多个并发线程指令执行的相对时序。`],
    [String.raw`互斥（Mutual Exclusion）与临界区（Critical Section）`, String.raw`互斥是同一时刻至多一个线程访问的性质；临界区是具有该要求的访问共享资源的代码段。`],
    [String.raw`锁的两个基本操作`, String.raw`<code>acquire()</code>：等待锁空闲并原子占用；<code>release()</code>：持锁者释放锁。`],
    [String.raw`<code>fork()</code> 的三类返回值`, String.raw`父进程返回子进程 PID（<code>&gt;0</code>）；子进程返回 <code>0</code>；失败返回 <code>&lt;0</code>。`],
    [String.raw`<code>fork()</code> 对线程的复制规则`, String.raw`子进程仅复制调用 <code>fork()</code> 的那一个线程。`],
    [String.raw`<code>exec</code> 的返回特性`, String.raw`用新程序替换当前进程映像（PID 不变）；调用成功时永不返回。`],
    [String.raw`Shell 执行外部命令的标准模式`, String.raw`父进程 <code>fork()</code> \(\to\) 子进程重定向并 <code>exec()</code> \(\to\) 父进程 <code>wait()</code>。`],
    [String.raw`不可捕获/不可忽略的两个信号`, String.raw`<code>SIGKILL</code>（强制终止）与 <code>SIGSTOP</code>（强制暂停）。`],
    [String.raw`多线程与多进程的核心权衡`, String.raw`多线程创建/通信快但无内存隔离；多进程硬件隔离安全但切换/IPC 开销高。`]
  ]
});
