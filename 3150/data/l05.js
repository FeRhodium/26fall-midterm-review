Review.add({
  id: "l05", group: "lecture", n: 5,
  short: "L5 文件与描述符",
  title: "Lecture 5 · 文件系统抽象、C 标准流与内核文件描述符",
  meta: "9 月 22 日 · System Programming 3",
  sources: [{ label: "lec05 课件", href: "materials/lectures/lec05-files.pdf" }],
  html: String.raw`
<p class="lede">本讲阐述 UNIX“一切皆文件”的接口设计与 POSIX 标准，对比高层 C 标准流（<code>FILE*</code>，含用户态缓冲区）与底层系统调用（文件描述符 <code>fd</code>）的运行机制，并给出内核“进程文件描述符表 \(\to\) 打开文件描述（Open File Description）”的两级状态模型，重点分析 <code>fork()</code> 后父子进程共享文件偏移量的行为。</p>

<h2>1. UNIX I/O 架构与 POSIX 文件抽象</h2>
<ul>
<li><b>系统调用边界与标准库</b>：应用程序通常调用 C 标准库（<code>libc</code>）函数，由库函数在必要时陷入内核发起系统调用。<b>POSIX</b>（可移植操作系统接口）标准化了这一系统调用层，使源代码可在不同 UNIX 衍生系统间直接移植。</li>
<li><b>一切皆文件（Everything is a File）</b>：磁盘普通文件、字符/块设备（终端、打印机）、管道与网络套接字均通过统一的四个系统调用访问：<code>open()</code>、<code>read()</code>、<code>write()</code>、<code>close()</code>（特定设备参数控制使用 <code>ioctl()</code>）。</li>
<li><b>文件与目录</b>：POSIX 文件是命名的字节序列，附带元数据（文件大小、修改时间戳、所有者、权限位）。目录提供层次化命名空间；每个进程维护各自的<b>当前工作目录（CWD）</b>，可通过 <code>chdir()</code> 修改。以 <code>/</code> 开头的是绝对路径，不以 <code>/</code> 开头的是相对于 CWD 的相对路径。</li>
</ul>
<pre>高层 I/O 库       C 流（FILE*，用户态缓冲）     fopen / fread / fwrite / fprintf / fgets
系统调用层        文件描述符（int fd）          open / read / write / lseek / close
内核文件表        打开文件描述（struct file）   记录磁盘 inode 指针与当前读写偏移量 offset
文件系统与驱动    块缓存 / 文件系统 / 设备驱动  将字节流读写转换为磁盘块与 DMA 传输</pre>

<h2>2. 高层 I/O：C 标准流（<code>stdio.h</code>）</h2>
<p>调用 <code>FILE *fopen(const char *filename, const char *mode)</code> 返回指向用户空间 <code>FILE</code> 结构体的指针（失败返回 <code>NULL</code>，必须检查返回值）。常用打开模式：<code>r</code>（只读）、<code>w</code>（只写，不存在则创建、已存在则截断为空）、<code>a</code>（追加写）、<code>r+</code>（读写已有文件）、<code>w+</code>（截断或创建后读写）。</p>
<ul>
<li>每个进程启动时默认打开三个流：<code>stdin</code>（标准输入）、<code>stdout</code>（标准输出）、<code>stderr</code>（标准错误）。</li>
<li>读写与定位接口：按字符/行（<code>fgetc</code>/<code>fgets</code>/<code>fputc</code>/<code>fputs</code>）、按数据块（<code>fread</code>/<code>fwrite</code>）、格式化（<code>fprintf</code>/<code>fscanf</code>）、移动用户流偏移（<code>fseek</code>/<code>ftell</code>/<code>rewind</code>）。</li>
</ul>

<h2>3. 底层 I/O：文件描述符系统调用</h2>
<pre>int     open(const char *filename, int flags [, mode_t mode]);
int     close(int fd);
ssize_t read(int fd, void *buffer, size_t maxsize);
ssize_t write(int fd, const void *buffer, size_t size);
off_t   lseek(int fd, off_t offset, int whence);</pre>
<ul>
<li><b>文件描述符（File Descriptor，<code>fd</code>）</b>：<code>open()</code> 返回的非负整数（失败返回 <code>-1</code> 并设置全局变量 <code>errno</code>），本质是<b>当前进程私有文件描述符表的数组下标</b>。预定义常量：<code>STDIN_FILENO = 0</code>、<code>STDOUT_FILENO = 1</code>、<code>STDERR_FILENO = 2</code>。可用 <code>fileno(FILE*)</code> 提取流底层的 <code>fd</code>。</li>
<li><b><code>read(fd, buf, maxsize)</code> 的返回值语义</b>：请求至多读取 <code>maxsize</code> 字节，但<b>实际返回的字节数可能少于 <code>maxsize</code></b>（例如文件剩余字节不足、从管道/终端/套接字读取或被信号中断）。返回值 **<code>&gt; 0</code>** 为实际读取字节数；返回值 **<code>0</code> 表示到达文件末尾（EOF）**；返回值 **<code>-1</code> 表示出错**。</li>
<li><b>内核级块缓存（Kernel Buffering）</b>：即便直接调用 <code>read</code>/<code>write</code>，内核也在内存中维护磁盘块缓存——<code>read</code> 未命中缓存时阻塞当前进程并调度其他进程；<code>write</code> 将数据拷入内核缓冲区即返回，由内核在后台异步写回磁盘。</li>
</ul>

<h2>4. 用户态缓冲（<code>FILE*</code>）与系统调用（<code>fd</code>）的对比</h2>
<table>
<thead><tr><th>对比维度</th><th>底层系统调用（<code>open</code>/<code>read</code>/<code>write</code>）</th><th>高层 C 标准流（<code>fopen</code>/<code>fread</code>/<code>fwrite</code>/<code>printf</code>）</th></tr></thead>
<tbody>
<tr><td>句柄类型</td><td>整型 <code>fd</code>（内核表下标）</td><td>用户态结构体指针 <code>FILE*</code>（内含用户态缓冲区、<code>fd</code>、缓冲区读写指针）</td></tr>
<tr><td>系统调用频率</td><td><b>每次调用</b>均陷入内核（上下文切换开销高）</td><td>先读写用户态内存缓冲区；仅当缓冲区满/空、遇换行符（终端行缓冲）或调用 <code>fflush</code>/<code>fclose</code> 时才发起 <code>read</code>/<code>write</code> 系统调用</td></tr>
<tr><td>输出可见性</td><td>调用返回即对内核与其他进程立即可见</td><td>滞留在用户态缓冲区中，延迟可见</td></tr>
</tbody>
</table>
<pre>// 片段 A（系统调用）：立即输出前半句，10 秒后输出后半句
write(STDOUT_FILENO, "Beginning of line ", 18);
sleep(10);
write(STDOUT_FILENO, "and end of line \n", 16);

// 片段 B（C 标准流）：因第一句无 '\n'，滞留在用户态缓冲区，10 秒后整行一并输出
printf("Beginning of line ");
sleep(10);
printf("and end of line\n");</pre>
<p><b>设置用户态缓冲区的两条工程理由</b>：(1) <b>降低系统调用开销</b>（系统调用耗时远高于普通函数调用，逐字节调用 <code>read</code>/<code>write</code> 吞吐量极低，而 <code>fgetc</code> 在用户态缓冲区上操作可减少数千倍系统调用）；(2) <b>提供内核不直接支持的格式功能</b>（内核只按字节块读写，不解析换行符或格式化字符串，<code>fgets</code>/<code>fscanf</code> 在用户态缓冲区上实现按行和格式化解析，保持内核简洁）。</p>

<h2>5. 内核文件状态模型与 <code>fork()</code> 后的偏移量共享</h2>
<p>内核维护两级数据结构：</p>
<ol>
<li><b>每个进程私有的文件描述符表（File Descriptor Table）</b>：以 <code>fd</code> 为下标，表项是指向内核“打开文件描述”的指针。</li>
<li><b>系统全局的打开文件描述表（Open File Description Table，Linux 中为 <code>struct file</code>）</b>：每个表项记录<b>文件在磁盘上的位置指针（inode）</b>、<b>当前读写偏移量（offset）</b>、打开模式与<b>引用计数（reference count）</b>。</li>
</ol>
<div class="callout must"><strong><code>fork()</code> 与独立 <code>open()</code> 的根本区别</strong><ul>
<li><b>两个进程各自调用 <code>open("foo.txt")</code></b>：内核创建<b>两个独立</b>的打开文件描述，各自维护独立的 <code>offset</code>，互不干扰。</li>
<li><b>父进程先 <code>open("foo.txt")</code> 得到 <code>fd = 3</code>，再调用 <code>fork()</code></b>：子进程复制父进程的文件描述符表，父子进程的 <code>fd = 3</code> 指向<b>同一个</b>打开文件描述（引用计数变为 2），因此<b>父子进程共享同一个文件读写偏移量 <code>offset</code></b>。</li>
</ul></div>
<p><b>算例追踪</b>：父进程打开文件得 <code>fd = 3</code> 并读取 100 字节（<code>offset = 100</code>），随后调用 <code>fork()</code>。若父进程再执行 <code>read(3, buf, 100)</code>，读到的是第 <code>100..199</code> 字节，并将共享的 <code>offset</code> 推进至 <code>200</code>；此后子进程执行 <code>read(3, buf, 100)</code> 时，将从 <code>offset = 200</code> 处开始读取第 <code>200..299</code> 字节。若父进程随后调用 <code>close(3)</code>，仅删除父进程自己的 <code>fd = 3</code> 表项并将打开文件描述的引用计数减为 1，子进程的 <code>fd = 3</code> 仍然有效；直至子进程也关闭 <code>fd = 3</code>（引用计数归零），内核才释放该打开文件描述。</p>

<h2>考前清单</h2>
<ul>
<li>POSIX 的作用；<code>fopen</code> 各模式（尤其 <code>w</code> 截断 vs <code>a</code> 追加）；<code>stdin</code>/<code>stdout</code>/<code>stderr</code> 对应 <code>fd</code> 0/1/2。</li>
<li><code>read</code> 返回值的三种情形（<code>&gt;0</code> 实际字节数且可能小于请求、<code>0</code> EOF、<code>-1</code> 错误）。</li>
<li><code>FILE*</code> 用户态缓冲与 <code>fd</code> 系统调用的区别；<code>printf</code> 与 <code>write</code> 在 <code>sleep</code> 前后的输出差异；用户态缓冲的两条理由。</li>
<li><code>fd</code> 表 \(\to\) 打开文件描述（位置 + 偏移量 + 引用计数）两级模型；<code>fork()</code> 后共享偏移量与 <code>close()</code> 的引用计数语义。</li>
</ul>
`,
  questions: [
    { id: "q1", tag: "slide", kind: "single", q: String.raw`系统调用 &lt;code&gt;read(fd, buf, 100)&lt;/code&gt; 返回 &lt;code&gt;0&lt;/code&gt; 表示`, choices: [["a", "发生读取错误"], ["b", "已到达文件末尾（EOF）"], ["c", "成功读取了 100 字节的全零数据"]], answer: ["b"], why: String.raw`<code>read</code> 返回 <code>0</code> 表示 EOF，返回 <code>-1</code> 表示出错。` },
    { id: "q2", tag: "slide", kind: "tf", q: String.raw`只要文件中剩余的数据不少于 100 字节，调用 &lt;code&gt;read(fd, buf, 100)&lt;/code&gt; 就一定返回 100。`, answer: ["f"], why: String.raw`<code>read</code> 允许返回少于请求长度的字节数（short count），如遇到管道边界、终端行或信号中断。` },
    { id: "q3", tag: "slide", kind: "single", q: String.raw`在向终端输出时，执行 <code>printf("A "); sleep(10); printf("B\n");</code> 的现象是`, choices: [["a", "立即显示 <code>A </code>，10 秒后显示 <code>B</code>"], ["b", "等待 10 秒后同时显示 <code>A B</code>"], ["c", "仅显示 <code>B</code>"]], answer: ["b"], why: String.raw`<code>stdout</code> 在终端上默认采用行缓冲；第一句无 <code>\n</code>，数据滞留在用户态 <code>FILE</code> 缓冲区中，直到第二句的 <code>\n</code> 触发刷新才一并写出。` },
    { id: "q4", tag: "slide", kind: "single", q: String.raw`执行 <code>write(STDOUT_FILENO, "A ", 2); sleep(10); write(STDOUT_FILENO, "B\n", 2);</code> 的现象是`, choices: [["a", "立即显示 <code>A </code>，10 秒后显示 <code>B</code>"], ["b", "等待 10 秒后同时显示 <code>A B</code>"], ["c", "输出顺序不确定"]], answer: ["a"], why: String.raw`<code>write</code> 是系统调用，不经过 <code>stdio</code> 用户态缓冲区，每次调用立即将数据交给内核输出。` },
    { id: "q5", tag: "slide", kind: "multi", q: String.raw`C 标准库在用户空间维护 &lt;code&gt;FILE&lt;/code&gt; 缓冲区的主要原因包括`, choices: [["a", "大幅减少高开销的系统调用次数"], ["b", "在用户态实现按行读取（如 <code>fgets</code>）和格式化解析，使内核保持简洁"], ["c", "保证写入的数据比系统调用更早对其他进程可见"]], answer: ["a", "b"], why: String.raw`用户态缓冲会延迟数据的写出，不会使其更早可见。` },
    { id: "q6", tag: "slide", kind: "single", q: String.raw`内核中的“打开文件描述（Open File Description）”记录的最核心状态是`, choices: [["a", "文件在磁盘上的位置指针与当前读写偏移量（offset）"], ["b", "用户态 <code>stdio</code> 缓冲区地址"], ["c", "进程的命令行参数"]], answer: ["a"], why: String.raw`打开文件描述在内核中维护文件位置与当前读写偏移量。` },
    { id: "q7", tag: "slide", kind: "single", q: String.raw`进程打开 &lt;code&gt;foo.txt&lt;/code&gt; 得 &lt;code&gt;fd = 3&lt;/code&gt; 并读取了 100 字节（偏移量变为 100），随后调用 &lt;code&gt;fork()&lt;/code&gt;。若父进程先执行 &lt;code&gt;read(3, buf, 100)&lt;/code&gt;，接着子进程再执行 &lt;code&gt;read(3, buf, 100)&lt;/code&gt;，则子进程读到的是文件中的哪一段字节？`, choices: [["a", "0–99"], ["b", "100–199"], ["c", "200–299"]], answer: ["c"], why: String.raw`<code>fork()</code> 后父子进程的 <code>fd = 3</code> 指向同一个打开文件描述，共享同一个偏移量：父进程读取后偏移量变为 200，故子进程从 200 读到 299。` },
    { id: "q8", tag: "slide", kind: "tf", q: String.raw`在上述 &lt;code&gt;fork()&lt;/code&gt; 场景中，若父进程调用 &lt;code&gt;close(3)&lt;/code&gt;，子进程中的 &lt;code&gt;fd = 3&lt;/code&gt; 也将立即失效无法读取。`, answer: ["f"], why: String.raw`<code>close(3)</code> 仅移除父进程自己的描述符表项并将引用计数减 1；只要子进程未关闭，打开文件描述仍然存在且有效。` },
    { id: "q9", tag: "slide", kind: "single", q: String.raw`两个进程各自独立调用 <code>open("foo.txt", O_RDONLY)</code> 打开同一个文件，它们的文件读写偏移量`, choices: [["a", "共享同一个偏移量"], ["b", "相互独立，互不影响"]], answer: ["b"], why: String.raw`每次调用 <code>open</code> 都会在内核中创建一个新的打开文件描述，各自拥有独立的 <code>offset</code>。` },
    { id: "q10", tag: "slide", kind: "single", q: String.raw`使用 <code>fopen("data.txt", "w")</code> 打开一个已存在的非空文件时，会发生`, choices: [["a", "在文件末尾追加写入"], ["b", "将该文件原有内容截断为空（长度置 0）再从头写入"], ["c", "返回 <code>NULL</code> 并报错"]], answer: ["b"], why: String.raw`模式 <code>"w"</code> 会截断已有文件；模式 <code>"a"</code> 才是追加。` },
    { id: "q11", tag: "slide", kind: "single", q: String.raw`POSIX 标准错误输出 &lt;code&gt;STDERR_FILENO&lt;/code&gt; 对应的文件描述符整数值是`, choices: [["a", "0"], ["b", "1"], ["c", "2"]], answer: ["c"], why: String.raw`<code>0</code> 为标准输入，<code>1</code> 为标准输出，<code>2</code> 为标准错误。` }
  ],
  cards: [
    [String.raw`UNIX“一切皆文件”的四类统一操作`, String.raw`<code>open</code>、<code>read</code>、<code>write</code>、<code>close</code>（配合 <code>ioctl</code> 控制设备属性）。`],
    [String.raw`标准流对应的默认文件描述符`, String.raw`<code>stdin</code> = 0，<code>stdout</code> = 1，<code>stderr</code> = 2。`],
    [String.raw`<code>read(fd, buf, max)</code> 的三类返回值`, String.raw`<code>&gt;0</code>：实际读取字节数（可少于 <code>max</code>）；<code>0</code>：EOF；<code>-1</code>：错误（设置 <code>errno</code>）。`],
    [String.raw`<code>FILE*</code> 与 <code>fd</code> 的核心区别`, String.raw`<code>FILE*</code> 是含用户态缓冲区的 C 库结构体指针；<code>fd</code> 是内核进程文件描述符表的整数下标。`],
    [String.raw`用户态缓冲的两条原因`, String.raw`(1) 减少陷入内核的系统调用次数；(2) 在用户空间实现按行/格式化解析，简化内核。`],
    [String.raw`内核打开文件描述（Open File Description）的内容`, String.raw`磁盘文件位置指针、当前读写偏移量 <code>offset</code>、访问模式及引用计数。`],
    [String.raw`<code>fork()</code> 对文件描述符与偏移量的影响`, String.raw`复制进程的 <code>fd</code> 表，但父子对应表项指向同一个打开文件描述，因而共享读写偏移量。`]
  ]
});
