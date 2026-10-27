Review.add({
  id: "l06", group: "lecture", n: 6,
  short: "L6 套接字与管道",
  title: "Lecture 6 · 进程间通信（IPC）：套接字与管道",
  meta: "9 月 24 日 · System Programming 4",
  sources: [{ label: "lec06 课件", href: "materials/lectures/lec06-sockets-pipes.pdf" }],
  html: String.raw`
<p class="lede">本讲将文件描述符抽象推广到进程间通信（IPC）：第一，介绍基于 TCP/IP 的网络套接字（Socket）接口、端口命名空间、五元组连接标识，以及从单进程串行服务器到多进程并发服务器、多线程服务器与线程池服务器的演进；第二，介绍用于具有亲缘关系进程间通信的匿名管道（Pipe），并对比各类 IPC 机制的适用范围。</p>

<h2>1. 套接字（Sockets）与 TCP 连接模型</h2>
<h3>1.1 套接字抽象与 IP 端口命名空间</h3>
<ul>
<li><b>套接字定义</b>：套接字是双向通信通道一端的抽象，在进程中表示为文件描述符 <code>fd</code>，内核为其维护输入队列与输出队列：调用 <code>write(sockfd, ...)</code> 将字节追加到发送队列，调用 <code>read(sockfd, ...)</code> 从接收队列取出字节（由于是流式队列，套接字不支持 <code>lseek()</code>）。</li>
<li><b>网络寻址与端口范围</b>：IPv4 地址为 32 位整数，IPv6 为 128 位整数。16 位端口号（<code>0..65535</code>）分为三段：
  <ul>
  <li><b><code>0–1023</code>（知名/系统端口）</b>：如 HTTP <code>80</code>、HTTPS <code>443</code>、SMTP <code>25</code>，调用 <code>bind()</code> 绑定此类端口需要超级用户（root）权限。</li>
  <li><b><code>1024–49151</code>（注册端口）</b>：由 IANA 登记分配给特定服务。</li>
  <li><b><code>49152–65535</code>（动态/私有临时端口）</b>：客户端发起连接时由操作系统自动分配。</li>
  </ul>
</li>
<li><b>TCP 连接的五元组（5-Tuple）唯一标识</b>：每一条已建立的 TCP 连接由 **<code>(源 IP, 目的 IP, 源端口, 目的端口, 协议=TCP)</code>** 唯一确定。因此同一服务器端口（如 <code>80</code>）可同时与成千上万个不同客户端（源 IP 或源端口不同）维持独立的连接。</li>
</ul>

<h3>1.2 客户端与服务器的系统调用序列</h3>
<table>
<thead><tr><th>阶段</th><th>客户端（Client）</th><th>服务器（Server）</th></tr></thead>
<tbody>
<tr><td>1. 创建套接字</td><td><code>sock_fd = socket(...)</code></td><td><code>server_socket = socket(...)</code>（监听套接字，<b>不可直接读写</b>）</td></tr>
<tr><td>2. 绑定地址与监听</td><td>（由内核在 <code>connect</code> 时自动分配临时端口）</td><td><code>bind(server_socket, addr)</code> \(\to\) <code>listen(server_socket, backlog)</code></td></tr>
<tr><td>3. 建立连接</td><td><code>connect(sock_fd, server_addr)</code></td><td><code>conn_socket = accept(server_socket, ...)</code>（<b>阻塞等待并返回一个全新的连接套接字描述符</b>）</td></tr>
<tr><td>4. 数据传输與关闭</td><td><code>write(sock_fd)</code> / <code>read(sock_fd)</code> \(\to\) <code>close(sock_fd)</code></td><td>在 <code>conn_socket</code> 上 <code>read</code>/<code>write</code> \(\to\) <code>close(conn_socket)</code></td></tr>
</tbody>
</table>

<h2>2. 服务器架构的五种演进版本</h2>
<ol>
<li><b>版本 1（单进程循环服务器）</b>：主循环依次执行 <code>accept</code> \(\to\) <code>serve_client(conn_socket)</code> \(\to\) <code>close(conn_socket)</code>。同一时刻只能服务一个客户端，后续客户端被阻塞在 <code>accept</code> 队列中。</li>
<li><b>版本 2（多进程 + <code>wait</code>）</b>：<code>accept</code> 后调用 <code>fork()</code> 由子进程服务客户端，但父进程在 <code>else</code> 分支中立即调用 <code>wait(NULL)</code>。该版本实现了<b>故障隔离</b>（子进程崩溃不影响主进程），但因父进程同步等待子进程结束，<b>仍然是串行服务</b>。</li>
<li><b>版本 3（多进程并发服务器）</b>：在版本 2 的基础上<b>删去父进程中的 <code>wait(NULL)</code></b>（改由信号或非阻塞方式回收僵尸进程），父进程关闭 <code>conn_socket</code> 后立即回到循环头部 <code>accept</code> 下一个连接，同时具备<b>进程级内存隔离与并发服务能力</b>。</li>
<li><b>版本 4（每连接一线程并发服务器）</b>：<code>accept</code> 后调用 <code>pthread_create</code> 创建新线程处理连接。相比多进程版本，线程创建与切换开销显著降低，但失去了地址空间隔离（单个线程崩溃会导致整个服务器进程退出），且共享内存访问必须加锁同步。</li>
<li><b>版本 5（有界线程池服务器）</b>：版本 4 在高并发突发流量下会创建海量线程，导致内存耗尽与上下文切换开销激增。线程池预先创建固定数量的工作线程，主线程 <code>accept</code> 后将 <code>conn_socket</code> 放入同步队列，工作线程循环从队列取出连接进行处理，从而严格限制最大并发度。</li>
</ol>
<pre>// 版本 3：多进程并发服务器核心代码
while (1) {
    int conn_socket = accept(server_socket, NULL, NULL);
    pid_t pid = fork();
    if (pid == 0) {                     // 子进程
        close(server_socket);           // 关闭不需要的监听套接字
        serve_client(conn_socket);
        close(conn_socket);
        exit(0);
    } else {                            // 父进程
        close(conn_socket);             // 必须关闭连接套接字！
    }
}</pre>
<div class="callout trap"><strong>为什么父进程必须调用 <code>close(conn_socket)</code></strong><p><code>fork()</code> 后父子进程的文件描述符表均持有指向 <code>conn_socket</code> 打开文件描述的引用（引用计数为 2）。若父进程不调用 <code>close(conn_socket)</code>，则即使子进程服务完毕并调用 <code>close(conn_socket)</code>，该连接套接字的引用计数仍为 1，内核不会发送 TCP FIN 包关闭连接（客户端将永久阻塞在 <code>read</code> 等待 EOF），且父进程最终会耗尽文件描述符表。</p></div>

<h2>3. 匿名管道（Pipes）</h2>
<p>系统调用 <code>int pipe(int pipefd[2])</code> 在内核中创建一个单向字节流队列，返回两个文件描述符：**<code>pipefd[1]</code> 为写入端，<code>pipefd[0]</code> 为读取端**。管道通常与 <code>fork()</code> 配合实现父子进程间通信：</p>
<pre>int pipe_fd[2];
pipe(pipe_fd);
pid_t pid = fork();
if (pid != 0) {                         // 父进程：向子进程发送数据
    close(pipe_fd[0]);                  // 关闭父进程的读端
    write(pipe_fd[1], msg, msglen);
    close(pipe_fd[1]);
} else {                                // 子进程：从父进程接收数据
    close(pipe_fd[1]);                  // 关闭子进程的写端
    ssize_t n = read(pipe_fd[0], buf, BUFSIZE);
    close(pipe_fd[0]);
}</pre>
<ul>
<li><b>阻塞与 EOF 规则</b>：当管道缓冲区满时 <code>write</code> 阻塞；当管道缓冲区空且<b>仍有至少一个进程持有打开的写端 <code>pipefd[1]</code></b> 时，<code>read</code> 阻塞等待；仅当<b>所有指向写端 <code>pipefd[1]</code> 的文件描述符全部关闭（写端引用计数归零）</b>后，<code>read</code> 才返回 <code>0</code>（EOF）。因此子进程（读者）必须首先调用 <code>close(pipe_fd[1])</code> 关闭自己从 <code>fork</code> 继承来的写端，否则子进程自身持有的写端会使 <code>read</code> 永远无法收到 EOF。</li>
</ul>

<h2>4. 进程间通信（IPC）机制对比与选型</h2>
<ul>
<li><b>父子进程之间为何优先用管道而非套接字或普通文件</b>：(1) 相比套接字，管道无需 IP/端口寻址、连接建立握手与网络协议栈开销，由 <code>fork()</code> 直接继承描述符；(2) 相比磁盘文件，管道无需全局路径名、不产生持久化残留文件，且由内核自动提供环形缓冲同步与阻塞唤醒。</li>
</ul>
<table>
<thead><tr><th>通信双方范围</th><th>标准通信机制</th></tr></thead>
<tbody>
<tr><td>同一线程内部</td><td>函数调用（栈帧传递参数与返回值）</td></tr>
<tr><td>同一进程内的不同线程</td><td>共享虚拟内存（全局变量与堆）</td></tr>
<tr><td>具有亲缘关系的父子/兄弟进程</td><td>匿名管道（<code>pipe</code>）</td></tr>
<tr><td>同一台机器上无亲缘关系的进程</td><td>UNIX 域套接字（UNIX Domain Socket）或命名共享内存/文件</td></tr>
<tr><td>跨网络的胡异机器进程</td><td>网络套接字（TCP/UDP Socket）</td></tr>
</tbody>
</table>

<h2>考前清单</h2>
<ul>
<li>端口号三段划分（<code>0–1023</code> 需 root 权限）；TCP 五元组；监听套接字与连接套接字的区别。</li>
<li>服务器 <code>socket</code> \(\to\) <code>bind</code> \(\to\) <code>listen</code> \(\to\) <code>accept</code> 与客户端 <code>socket</code> \(\to\) <code>connect</code> 序列。</li>
<li>五种服务器版本的演进差异（v1 串行、v2 多进程串行、v3 多进程并发、v4 多线程、v5 线程池）；父子进程各自关闭多余套接字的原因。</li>
<li><code>pipe(fd)</code> 的读写端编号（<code>fd[1]</code> 写、<code>fd[0]</code> 读）、关闭不用端的必要性（写端引用计数归零才产生 EOF）、IPC 选型表。</li>
</ul>
`,
  questions: [
    { id: "q1", tag: "slide", kind: "single", q: String.raw`TCP 服务器调用 &lt;code&gt;accept(server_socket, ...)&lt;/code&gt; 成功返回的值是`, choices: [["a", "原有的监听套接字 <code>server_socket</code>"], ["b", "专为本次客户端连接新建的连接套接字文件描述符"], ["c", "客户端的进程 PID"]], answer: ["b"], why: String.raw`监听套接字仅用于接受连接而不能读写；<code>accept</code> 为每个已建立的连接返回一个新的连接套接字描述符。` },
    { id: "q2", tag: "slide", kind: "multi", q: String.raw`唯一标识一条 TCP 网络连接的五元组（5-Tuple）包含`, choices: [["a", "源 IP 地址"], ["b", "目的 IP 地址"], ["c", "源端口号"], ["d", "目的端口号"], ["e", "传输层协议（TCP）"], ["f", "服务器进程 PID"]], answer: ["a", "b", "c", "d", "e"], why: String.raw`五元组由源/目的 IP、源/目的端口及协议组成，不含进程 PID。` },
    { id: "q3", tag: "slide", kind: "single", q: String.raw`在 UNIX 系统中，调用 &lt;code&gt;bind()&lt;/code&gt; 绑定 &lt;code&gt;0–1023&lt;/code&gt; 范围内的端口号需要`, choices: [["a", "超级用户（root）权限"], ["b", "普通用户权限即可"], ["c", "先创建管道"]], answer: ["a"], why: String.raw`<code>0–1023</code> 为系统知名端口，仅允许特权进程绑定。` },
    { id: "q4", tag: "slide", kind: "single", q: String.raw`在课件的服务器 v2 版本中（&lt;code&gt;accept&lt;/code&gt; 后 &lt;code&gt;fork&lt;/code&gt; 子进程服务客户端，父进程立即调用 &lt;code&gt;wait(NULL)&lt;/code&gt;），服务器能否同时并发处理多个客户端？`, choices: [["a", "能"], ["b", "不能，父进程阻塞在 <code>wait</code> 直至当前子进程结束，仍为串行处理"]], answer: ["b"], why: String.raw`v2 仅利用子进程实现了故障隔离；去掉阻塞 <code>wait</code> 的 v3 才是并发服务器。` },
    { id: "q5", tag: "slide", kind: "single", q: String.raw`在多进程并发服务器（v3）中，若父进程在 &lt;code&gt;fork()&lt;/code&gt; 后忘记调用 &lt;code&gt;close(conn_socket)&lt;/code&gt;，将导致的直接后果是`, choices: [["a", "子进程无法向客户端发送数据"], ["b", "子进程调用 <code>close(conn_socket)</code> 后连接引用计数仍不为 0，连接无法正常关闭且父进程泄漏文件描述符"], ["c", "监听套接字自动关闭"]], answer: ["b"], why: String.raw`打开文件描述在所有引用它的 <code>fd</code> 关闭前不会释放，父进程残留的 <code>conn_socket</code> 会阻止连接关闭。` },
    { id: "q6", tag: "slide", kind: "multi", q: String.raw`与“每连接一个子进程”相比，“每连接一个线程”的并发服务器具有哪些特点？`, choices: [["a", "创建与上下文切换开销更低"], ["b", "单个连接处理代码触发段错误不会影响其他连接"], ["c", "共享内存结构需要加锁同步以防止数据竞争"], ["d", "若不限制线程数量，高并发下可能耗尽资源导致吞吐量下降"]], answer: ["a", "c", "d"], why: String.raw`同一进程内的线程无地址空间隔离，一个线程段错误会使整个服务器进程崩溃。` },
    { id: "q7", tag: "slide", kind: "single", q: String.raw`调用 &lt;code&gt;pipe(fd)&lt;/code&gt; 创建匿名管道后，用于写入数据的文件描述符是`, choices: [["a", "<code>fd[0]</code>"], ["b", "<code>fd[1]</code>"]], answer: ["b"], why: String.raw`POSIX 规定 <code>fd[0]</code> 为读端，<code>fd[1]</code> 为写端。` },
    { id: "q8", tag: "slide", kind: "single", q: String.raw`父进程通过管道向子进程单向发送数据，在 &lt;code&gt;fork()&lt;/code&gt; 之后，父进程和子进程应分别首先关闭哪个描述符？`, choices: [["a", "父关 <code>fd[0]</code>，子关 <code>fd[1]</code>"], ["b", "父关 <code>fd[1]</code>，子关 <code>fd[0]</code>"], ["c", "父子均无需关闭任何描述符"]], answer: ["a"], why: String.raw`父进程只写不读故关 <code>fd[0]</code>；子进程只读不写故关 <code>fd[1]</code>（确保父进程写完关闭后写端引用计数归零）。` },
    { id: "q9", tag: "slide", kind: "multi", q: String.raw`在同一台机器的父子进程之间通信时，选择匿名管道而非网络套接字或磁盘文件的理由包括`, choices: [["a", "无需 IP/端口寻址与连接建立握手"], ["b", "无需在全局文件系统命名空间中创建路径名"], ["c", "管道中的数据在机器断电重启后仍然持久保存"], ["d", "天生通过 <code>fork()</code> 继承文件描述符"]], answer: ["a", "b", "d"], why: String.raw`管道是内核内存中的临时缓冲区，不具备磁盘持久性。` },
    { id: "q10", tag: "slide", kind: "single", q: String.raw`在同一台物理机器上两个无亲缘关系的进程之间进行高效通信，应选用`, choices: [["a", "匿名管道（<code>pipe</code>）"], ["b", "UNIX 域套接字（UNIX Domain Socket）或命名共享内存"], ["c", "普通函数调用"]], answer: ["b"], why: String.raw`匿名管道没有全局名称，只能通过 <code>fork()</code> 在亲缘进程间继承。` },
    { id: "q11", tag: "slide", kind: "tf", q: String.raw`可以对网络套接字描述符调用 &lt;code&gt;lseek()&lt;/code&gt; 来回退读取此前已经接收过的字节。`, answer: ["f"], why: String.raw`套接字是流式先入先出队列，数据读出后即从内核接收队列移除，不支持随机定位 <code>lseek</code>。` }
  ],
  cards: [
    [String.raw`套接字的队列模型`, String.raw`表示网络连接的一端，对应输入队列与输出队列；支持 <code>read</code>/<code>write</code>，不支持 <code>lseek</code>。`],
    [String.raw`TCP 端口号的三段划分`, String.raw`<code>0–1023</code> 知名端口（需 root）；<code>1024–49151</code> 注册端口；<code>49152–65535</code> 动态临时端口。`],
    [String.raw`唯一标识 TCP 连接的五元组`, String.raw`（源 IP，目的 IP，源端口，目的端口，协议 TCP）。`],
    [String.raw`TCP 服务器的四个系统调用顺序`, String.raw`<code>socket</code> \(\to\) <code>bind</code> \(\to\) <code>listen</code> \(\to\) <code>accept</code>（返回新连接套接字）。`],
    [String.raw`服务器监听套接字与连接套接字的区别`, String.raw`监听套接字仅用于 <code>listen</code>/<code>accept</code>，不可读写；连接套接字由 <code>accept</code> 返回，用于与特定客户端读写数据。`],
    [String.raw`服务器 v2 与 v3 的区别`, String.raw`v2 中父进程调用 <code>wait</code>（有隔离但串行）；v3 中父进程不阻塞 <code>wait</code>（有隔离且并发）。`],
    [String.raw`线程池服务器的作用`, String.raw`用固定数量的工作线程加任务队列限制最大并发线程数，避免线程创建与切换开销失控。`],
    [String.raw`<code>pipe(fd)</code> 的读写端与 EOF 条件`, String.raw`写 <code>fd[1]</code>、读 <code>fd[0]</code>；仅当所有写端 <code>fd[1]</code> 全部关闭时，<code>read</code> 才返回 <code>0</code>（EOF）。`],
    [String.raw`不同范围的 IPC 选型`, String.raw`同进程线程用共享内存；父子进程用匿名管道；同机无关进程用 UNIX 域套接字；跨机器用网络套接字。`]
  ]
});
