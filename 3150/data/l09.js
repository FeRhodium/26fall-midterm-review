Review.add({
  id: "l09", group: "lecture", n: 9,
  short: "L9 管程与读写锁",
  title: "Lecture 9 · 管程与条件变量、Mesa 与 Hoare 语义、读者-写者问题",
  meta: "10 月 13 日 · Synchronization 3",
  sources: [{ label: "lec09 课件", href: "materials/lectures/lec09-concurrency3.pdf" }],
  html: String.raw`
<p class="lede">本讲针对信号量将“互斥”与“条件等待”混用导致的死锁隐患，引入管程（Monitor）范式：用一把互斥锁专门负责共享数据的互斥访问，用条件变量（Condition Variable）专门负责临界区内的条件同步。本讲的核心推导包括：(1) <code>cond_wait</code>“原子释放锁并阻塞、唤醒返回前重获锁”的三步语义；(2) Mesa 语义与 Hoare 语义的对比及必须用 <code>while</code> 循环重检条件的原因；(3) 用管程实现有界缓冲区与写者优先的读者-写者锁（含 <code>AR/WR/AW/WW</code> 状态追踪）。</p>

<h2>1. 管程（Monitor）与条件变量</h2>
<div class="callout must"><strong>定义：管程（Monitor）</strong><p>管程是由<b>一把互斥锁（Lock）+ 零个或多个条件变量（Condition Variables）</b>构成的同步结构：互斥锁保证任意时刻至多只有一个线程进入管程执行或修改共享状态；条件变量允许已持有锁的线程在某个业务条件不满足时<b>在管程内部安全地挂起等待</b>。</p></div>
<p>条件变量 <code>cv</code> 维护一个等待线程队列，提供三个必须在<b>已持有管程锁 <code>lock</code> 的前提下</b>调用的操作：</p>
<ul>
<li><b><code>cond_wait(&amp;cv, &amp;lock)</code></b>：执行三个不可分割的阶段——(i) <b>原子地释放 <code>lock</code> 并将当前线程挂入 <code>cv</code> 的等待队列睡眠</b>；(ii) 等待其他线程调用 <code>signal</code>/<code>broadcast</code> 将其移出等待队列；(iii) <b>在从 <code>cond_wait</code> 函数返回之前，重新竞争并获取 <code>lock</code></b>。</li>
<li><b><code>cond_signal(&amp;cv)</code></b>：若 <code>cv</code> 的等待队列非空，则从中唤醒<b>一个</b>等待线程（将其移入调度器的就绪队列）；若当前无等待线程，则该操作<b>不产生任何效果（No-op）</b>。</li>
<li><b><code>cond_broadcast(&amp;cv)</code></b>：唤醒当前挂在 <code>cv</code> 等待队列上的<b>所有</b>线程。</li>
</ul>
<div class="callout trap"><strong>条件变量与信号量的本质区别</strong><p>信号量内部维护整数计数值，在无等待者时执行 <code>V()</code> 会使计数值加 1，后续的 <code>P()</code> 会立即观察到该增量；而<b>条件变量没有任何内部计数记忆</b>——若在没有任何线程等待时调用 <code>cond_signal(&amp;cv)</code>，该信号直接丢弃，后续调用 <code>cond_wait</code> 的线程仍会阻塞。因此状态的真假必须保存在受管程锁保护的显式共享变量中。</p></div>

<h2>2. Hoare 语义与 Mesa 语义：为什么必须使用 <code>while</code> 循环</h2>
<table>
<thead><tr><th>维度</th><th>Hoare 语义（理论教科书模型）</th><th>Mesa 语义（绝大多数真实操作系统：pthreads、Java 等）</th></tr></thead>
<tbody>
<tr><td><code>cond_signal</code> 时的控制权移交</td><td>发信号线程立即将锁与 CPU 控制权<b>直接移交</b>给被唤醒的等待线程；等待线程立即运行，退出管程后再交还</td><td>发信号线程<b>继续持有锁并继续运行</b>；被唤醒的等待线程仅从条件等待队列移入内核就绪队列，与其它线程平等竞争锁</td></tr>
<tr><td>被唤醒线程返回 <code>cond_wait</code> 时的条件状态</td><td>发信号时刻成立的条件<b>必然仍然成立</b></td><td>在被唤醒线程排上 CPU 并重新拿到锁之前，<b>可能有其他新到达的线程先拿到锁并修改了共享状态</b>，使条件再次变为不成立</td></tr>
<tr><td>条件检查写法</td><td>可用 <code>if (!condition) cond_wait(...);</code></td><td><b>必须使用 <code>while (!condition) cond_wait(...);</code></b></td></tr>
</tbody>
</table>
<p>注：Mesa 语义下的 <code>while (!condition) cond_wait(&amp;cv, &amp;lock);</code> <b>不是忙等待</b>——当条件不满足时，线程在 <code>cond_wait</code> 内部处于阻塞睡眠状态，仅在被唤醒并重新获得锁后才执行一次循环条件重检。</p>

<h2>3. 管程实现有界缓冲区（Bounded Buffer）</h2>
<pre>lock buf_lock;
condition is_not_empty, is_not_full;

void Producer(item) {
    acquire(&amp;buf_lock);
    while (buffer_is_full())
        cond_wait(&amp;is_not_full, &amp;buf_lock);     // 原子释放 buf_lock 并睡眠；返回时已重获 buf_lock
    enqueue(item);
    cond_signal(&amp;is_not_empty);
    release(&amp;buf_lock);
}

Item Consumer() {
    acquire(&amp;buf_lock);
    while (buffer_is_empty())
        cond_wait(&amp;is_not_empty, &amp;buf_lock);
    item = dequeue();
    cond_signal(&amp;is_not_full);
    release(&amp;buf_lock);
    return item;
}</pre>

<h2>4. 读者-写者问题（Readers-Writers Problem）</h2>
<h3>4.1 并发约束与状态变量定义</h3>
<p>共享数据库支持两类访问：只读的读者（Reader）与读写的写者（Writer）。并发约束为：<b>允许多个读者同时读取；但写者访问时必须独占（既不能有其他活跃写者，也不能有任何活跃读者）</b>。</p>
<p>为实现这一约束，不能直接用管程锁包裹耗时很长的 <code>access_database()</code>（否则读者之间也会被串行化），而是在进入和离开数据库前后，用管程锁 <code>lock</code> 保护四个整型状态计数器（初值均为 <code>0</code>）与两个条件变量：</p>
<ul>
<li><code>AR</code>（Active Readers）：当前正在执行 <code>access_database(read_only)</code> 的活跃读者数。</li>
<li><code>WR</code>（Waiting Readers）：当前阻塞在 <code>ok_to_read</code> 条件变量上的等待读者数。</li>
<li><code>AW</code>（Active Writers）：当前正在执行 <code>access_database(read_write)</code> 的活跃写者数（取值 \(\in\{0,1\}\)）。</li>
<li><code>WW</code>（Waiting Writers）：当前阻塞在 <code>ok_to_write</code> 条件变量上的等待写者数。</li>
</ul>

<h3>4.2 写者优先的读者-写者管程代码</h3>
<pre>void Reader() {
    acquire(&amp;lock);
    while ((AW + WW) &gt; 0) {                     // 只要有活跃写者【或等待中的写者】，新读者就必须等待
        WR++;
        cond_wait(&amp;ok_to_read, &amp;lock);
        WR--;
    }
    AR++;
    release(&amp;lock);

    access_database(read_only);                 // 在管程锁外并发读取

    acquire(&amp;lock);
    AR--;
    if (AR == 0 &amp;&amp; WW &gt; 0)                      // 最后一个活跃读者离开时，唤醒一个等待中的写者
        cond_signal(&amp;ok_to_write);
    release(&amp;lock);
}

void Writer() {
    acquire(&amp;lock);
    while ((AW + AR) &gt; 0) {                     // 只要有活跃写者或活跃读者，写者就必须等待
        WW++;
        cond_wait(&amp;ok_to_write, &amp;lock);
        WW--;
    }
    AW++;
    release(&amp;lock);

    access_database(read_write);                // 独占读写（此时必有 AW == 1 且 AR == 0）

    acquire(&amp;lock);
    AW--;
    if (WW &gt; 0)                                 // 优先唤醒等待中的写者
        cond_signal(&amp;ok_to_write);
    else if (WR &gt; 0)                            // 若无等待写者，则广播唤醒全部等待中的读者
        cond_broadcast(&amp;ok_to_read);
    release(&amp;lock);
}</pre>

<h3>4.3 状态追踪算例：依次到达 <code>R1</code>、<code>R2</code>、<code>W1</code>、<code>R3</code></h3>
<table>
<thead><tr><th>步骤事件</th><th><code>AR</code></th><th><code>WR</code></th><th><code>AW</code></th><th><code>WW</code></th><th>状态转移说明</th></tr></thead>
<tbody>
<tr><td>初始状态</td><td>0</td><td>0</td><td>0</td><td>0</td><td>空闲</td></tr>
<tr><td>1. <code>R1</code> 到达</td><td>1</td><td>0</td><td>0</td><td>0</td><td><code>AW + WW == 0</code>，<code>R1</code> 直接进入读取</td></tr>
<tr><td>2. <code>R2</code> 到达</td><td>2</td><td>0</td><td>0</td><td>0</td><td><code>AW + WW == 0</code>，<code>R2</code> 与 <code>R1</code> 并发读取</td></tr>
<tr><td>3. <code>W1</code> 到达</td><td>2</td><td>0</td><td>0</td><td>1</td><td><code>AW + AR == 2 &gt; 0</code>，<code>W1</code> 睡眠在 <code>ok_to_write</code></td></tr>
<tr><td>4. <code>R3</code> 到达</td><td>2</td><td>1</td><td>0</td><td>1</td><td>因 <code>WW == 1 &gt; 0</code>（写者优先），<code>R3</code> 睡眠在 <code>ok_to_read</code></td></tr>
<tr><td>5. <code>R2</code> 完成读取</td><td>1</td><td>1</td><td>0</td><td>1</td><td><code>AR</code> 减为 1（\(\ne 0\)），不发送信号</td></tr>
<tr><td>6. <code>R1</code> 完成读取</td><td>0</td><td>1</td><td>0</td><td>1</td><td><code>AR == 0 &amp;&amp; WW &gt; 0</code>，调用 <code>cond_signal(&amp;ok_to_write)</code></td></tr>
<tr><td>7. <code>W1</code> 被唤醒进入</td><td>0</td><td>1</td><td>1</td><td>0</td><td><code>WW--</code>，重检 <code>AW + AR == 0</code> 通过，<code>AW++</code>，开始写入</td></tr>
<tr><td>8. <code>W1</code> 完成写入</td><td>0</td><td>1</td><td>0</td><td>0</td><td><code>AW--</code>；因 <code>WW == 0 &amp;&amp; WR &gt; 0</code>，调用 <code>cond_broadcast(&amp;ok_to_read)</code></td></tr>
<tr><td>9. <code>R3</code> 被唤醒进入</td><td>1</td><td>0</td><td>0</td><td>0</td><td><code>WR--</code>，重检 <code>AW + WW == 0</code> 通过，<code>AR++</code>，开始读取</td></tr>
<tr><td>10. <code>R3</code> 完成读取</td><td>0</td><td>0</td><td>0</td><td>0</td><td>恢复初始空闲状态</td></tr>
</tbody>
</table>

<h3>4.4 四个代码变体正确性辨析</h3>
<ul>
<li><b>变体 1：上述方案中读者是否可能发生饥饿（Starvation）？</b> <b>会</b>。由于读者的等待条件是 <code>AW + WW &gt; 0</code>，且写者退出时优先唤醒等待写者，若写者源源不断到达使 <code>WW + AW</code> 始终大于 0，等待中的读者将无限期无法进入。</li>
<li><b>变体 2：若删去读者离开时的 <code>if (AR == 0 &amp;&amp; WW &gt; 0)</code> 判断，改为无条件调用 <code>cond_signal(&amp;ok_to_write)</code>，程序是否仍然正确？</b> <b>仍然正确，仅降低效率</b>。被提前唤醒的写者在 <code>while ((AW + AR) &gt; 0)</code> 中重检时会发现 <code>AR &gt; 0</code>，从而再次调用 <code>cond_wait</code> 入睡，不会破坏互斥，仅产生多余的伪唤醒开销。</li>
<li><b>变体 3：若将读者离开时的 <code>cond_signal(&amp;ok_to_write)</code> 改为 <code>cond_broadcast(&amp;ok_to_write)</code>，是否仍然正确？</b> <b>仍然正确，仅降低效率</b>。所有等待写者被唤醒后依次获取 <code>lock</code>，第一个拿到锁的写者将 <code>AW</code> 置为 1，其余写者在 <code>while ((AW + AR) &gt; 0)</code> 重检中发现 <code>AW == 1</code> 而重新入睡。</li>
<li><b>变体 4：若将 <code>ok_to_read</code> 和 <code>ok_to_write</code> 合并为单个条件变量 <code>ok_continue</code>，唤醒时能否使用 <code>cond_signal</code>？</b> <b>不能，必须使用 <code>cond_broadcast</code></b>。若所有读者和写者共用同一个等待队列且只调用 <code>cond_signal</code> 唤醒一个线程，则当最后一个读者离开（此时 <code>WW &gt; 0, WR &gt; 0</code>）时，<code>signal</code> 可能恰好唤醒了一个等待中的读者；该读者重检发现 <code>WW &gt; 0</code> 后再次入睡，而真正满足运行条件的写者未被唤醒，导致所有线程永久睡眠（死锁）。</li>
</ul>

<h2>5. 编程语言层面的锁生命周期管理（RAII）</h2>
<p>在 C 语言中手动调用 <code>acquire</code>/<code>release</code> 时，若函数存在多条提前 <code>return</code> 的错误分支，或在支持异常（Exception）的语言中临界区抛出异常跳出作用域，极易遗漏 <code>release</code> 导致死锁。现代语言通过作用域绑定自动管理锁的释放：C++ 的 <code>std::lock_guard&lt;std::mutex&gt;</code>（构造时加锁、离开作用域析构时自动解锁）、Python 的 <code>with lock:</code> 上下文管理器、以及 Java 的 <code>synchronized</code> 方法/代码块（配合对象内置的 <code>wait()</code>/<code>notify()</code>/<code>notifyAll()</code>）。</p>

<h2>考前清单</h2>
<ul>
<li>管程的组成（1 把锁 + 条件变量）；<code>cond_wait</code> 的三步语义；条件变量“无记忆”与信号量的区别。</li>
<li>Hoare 语义与 Mesa 语义的区别；Mesa 语义下必须使用 <code>while</code> 循环重检条件的原因。</li>
<li>读者-写者锁：四个状态计数器（<code>AR/WR/AW/WW</code>）、读者等待条件 <code>AW + WW &gt; 0</code>、写者等待条件 <code>AW + AR &gt; 0</code>、读者/写者离开时的唤醒逻辑、<code>R1, R2, W1, R3</code> 状态追踪及四个代码变体问答。</li>
</ul>
`,
  questions: [
    { id: "q1", tag: "slide", kind: "single", q: String.raw`调用 &lt;code&gt;cond_wait(&amp;cv, &amp;lock)&lt;/code&gt; 时的完整原子行为是`, choices: [["a", "保持持有 <code>lock</code> 并直接睡眠"], ["b", "原子地释放 <code>lock</code> 并进入睡眠队列；被唤醒后在函数返回前重新获取 <code>lock</code>"], ["c", "无需持有 <code>lock</code> 即可直接调用"]], answer: ["b"], why: String.raw`原子释放锁使其他线程得以进入管程修改状态并发出唤醒信号；返回前重获锁保证管程互斥不变式。` },
    { id: "q2", tag: "slide", kind: "single", q: String.raw`在采用 Mesa 语义的管程中，等待条件必须写为 &lt;code&gt;while (!cond) cond_wait(...)&lt;/code&gt; 而非 &lt;code&gt;if (!cond) cond_wait(...)&lt;/code&gt;，根本原因是`, choices: [["a", "<code>while</code> 关键字的编译速度更快"], ["b", "从 <code>cond_signal</code> 发出到被唤醒线程真正获得锁运行之间，其他线程可能先获得锁并修改了共享状态，使条件再次不成立"], ["c", "<code>if</code> 语句无法通过 C 编译器语法检查"]], answer: ["b"], why: String.raw`Mesa 语义仅将被唤醒线程放入就绪队列，不立即移交锁，其他线程可能在此窗口期内改变状态。` },
    { id: "q3", tag: "slide", kind: "single", q: String.raw`在 Hoare 语义的管程中，当线程 A 调用 &lt;code&gt;cond_signal(&amp;cv)&lt;/code&gt; 唤醒等待线程 B 时`, choices: [["a", "线程 A 继续持有锁并执行后续语句"], ["b", "线程 A 立即将锁和 CPU 移交给线程 B，使 B 立即在条件成立的状态下运行"], ["c", "所有等待线程同时并行进入临界区"]], answer: ["b"], why: String.raw`Hoare 语义立即将控制权和锁转交给被唤醒者，故等待者被唤醒时条件必然成立。` },
    { id: "q4", tag: "slide", kind: "tf", q: String.raw`Mesa 管程中的 &lt;code&gt;while (need_to_wait) cond_wait(&amp;cv, &amp;lock);&lt;/code&gt; 属于消耗 CPU 的忙等待（Busy-Waiting）。`, answer: ["f"], why: String.raw`线程在 <code>cond_wait</code> 内部处于睡眠阻塞状态，不占用 CPU，仅在被唤醒后重检一次条件。` },
    { id: "q5", tag: "slide", kind: "tf", q: String.raw`当条件变量 &lt;code&gt;cv&lt;/code&gt; 的等待队列为空时调用 &lt;code&gt;cond_signal(&amp;cv)&lt;/code&gt;，该唤醒信号会被保存下来，使下一次调用 &lt;code&gt;cond_wait(&amp;cv, &amp;lock)&lt;/code&gt; 的线程无需等待直接返回。`, answer: ["f"], why: String.raw`条件变量没有内部计数或记忆，队列为空时的 <code>cond_signal</code> 是空操作（No-op）。` },
    { id: "q6", tag: "slide", kind: "single", q: String.raw`在课件的写者优先读者-写者管程中，读者进入前的等待循环条件是`, choices: [["a", "<code>while (AW &gt; 0)</code>"], ["b", "<code>while ((AW + WW) &gt; 0)</code>"], ["c", "<code>while ((AW + AR) &gt; 0)</code>"]], answer: ["b"], why: String.raw`只要有活跃写者（<code>AW &gt; 0</code>）或等待中的写者（<code>WW &gt; 0</code>），新到达的读者都必须等待（<code>(AW + AR) &gt; 0</code> 是写者的等待条件）。` },
    { id: "q7", tag: "slide", kind: "single", q: String.raw`在读者-写者锁中，依次到达 &lt;code&gt;R1&lt;/code&gt;、&lt;code&gt;R2&lt;/code&gt;、&lt;code&gt;W1&lt;/code&gt;、&lt;code&gt;R3&lt;/code&gt;（前两者尚未读完）。此时四个状态变量 &lt;code&gt;(AR, WR, AW, WW)&lt;/code&gt; 的值为`, choices: [["a", "<code>(3, 0, 0, 1)</code>"], ["b", "<code>(2, 1, 0, 1)</code>"], ["c", "<code>(2, 0, 0, 1)</code>"], ["d", "<code>(2, 1, 1, 0)</code>"]], answer: ["b"], why: String.raw`<code>R1, R2</code> 正在读（<code>AR=2</code>）；<code>W1</code> 因 <code>AR&gt;0</code> 等待（<code>WW=1</code>）；<code>R3</code> 因 <code>WW&gt;0</code> 等待（<code>WR=1</code>）。` },
    { id: "q8", tag: "slide", kind: "single", q: String.raw`当一个写者完成写入离开时，若此时既有等待写者（&lt;code&gt;WW &gt; 0&lt;/code&gt;）又有等待读者（&lt;code&gt;WR &gt; 0&lt;/code&gt;），课件代码会执行`, choices: [["a", "<code>cond_broadcast(&amp;ok_to_read)</code>"], ["b", "<code>cond_signal(&amp;ok_to_write)</code>"], ["c", "同时唤醒所有读者和写者"]], answer: ["b"], why: String.raw`代码为 <code>if (WW &gt; 0) cond_signal(&amp;ok_to_write); else if (WR &gt; 0) cond_broadcast(&amp;ok_to_read);</code>，优先唤醒写者。` },
    { id: "q9", tag: "slide", kind: "tf", q: String.raw`在课件的写者优先读者-写者方案中，若写者源源不断到达，等待中的读者可能发生饥饿（Starvation）。`, answer: ["t"], why: String.raw`持续到达的写者使 <code>AW + WW &gt; 0</code> 恒成立，读者无法跳出 <code>while</code> 循环。` },
    { id: "q10", tag: "slide", kind: "single", q: String.raw`若将读者-写者锁中的两个条件变量合并为单个条件变量 &lt;code&gt;ok_continue&lt;/code&gt;，则在唤醒等待线程时必须使用`, choices: [["a", "<code>cond_signal</code>"], ["b", "<code>cond_broadcast</code>"], ["c", "二者皆可"]], answer: ["b"], why: String.raw`若用 <code>cond_signal</code> 可能唤醒一个仍不满足继续条件的线程（如在 <code>WW &gt; 0</code> 时唤醒了读者），导致真正可运行的写者未被唤醒而全体死锁。` },
    { id: "q11", tag: "slide", kind: "single", q: String.raw`在读者离开的代码中，若删去 &lt;code&gt;if (AR == 0 &amp;&amp; WW &gt; 0)&lt;/code&gt; 条件判断，改为每次读者离开都调用 &lt;code&gt;cond_signal(&amp;ok_to_write)&lt;/code&gt;，则程序`, choices: [["a", "仍然保持互斥正确性，仅增加不必要的唤醒与重检开销"], ["b", "会导致两个写者同时进入数据库"], ["c", "会导致读者与写者同时进入数据库"]], answer: ["a"], why: String.raw`被唤醒的写者会在 <code>while ((AW + AR) &gt; 0)</code> 中重新检查，若仍有活跃读者（<code>AR &gt; 0</code>）则会再次入睡。` },
    { id: "q12", tag: "slide", kind: "multi", q: String.raw`下列哪些语言机制能够在代码离开作用域（包括因抛出异常而跳出）时自动释放所持有的互斥锁？`, choices: [["a", "C++ <code>std::lock_guard&lt;std::mutex&gt;</code>"], ["b", "Python <code>with lock:</code> 语句块"], ["c", "Java <code>synchronized</code> 方法或代码块"], ["d", "C 语言直接调用 <code>pthread_mutex_lock</code>"]], answer: ["a", "b", "c"], why: String.raw`(a)(b)(c) 均通过作用域绑定（RAII/上下文管理/字节码 finally）自动释放锁；C 语言需程序员在每条退出路径上手动解锁。` }
  ],
  cards: [
    [String.raw`管程（Monitor）的组成与分工`, String.raw`1 把互斥锁（负责共享状态互斥）+ 零个或多个条件变量（负责临界区内条件等待）。`],
    [String.raw`<code>cond_wait(&amp;cv, &amp;lock)</code> 的三步语义`, String.raw`原子释放 <code>lock</code> 并挂入 <code>cv</code> 睡眠 \(\to\) 等待被唤醒 \(\to\) 返回前重新获取 <code>lock</code>。`],
    [String.raw`条件变量与信号量在记忆性上的区别`, String.raw`条件变量无计数记忆，无人等待时的 <code>signal</code> 直接丢失；信号量的 <code>V()</code> 会使计数值加 1。`],
    [String.raw`Hoare 语义与 Mesa 语义的核心差异`, String.raw`Hoare 语义立即把锁和 CPU 移交给被唤醒者（可用 <code>if</code>）；Mesa 语义仅将等待者移入就绪队列（必须用 <code>while</code> 重检）。`],
    [String.raw`读者-写者锁的四个状态计数器`, String.raw`<code>AR</code>（活跃读者）、<code>WR</code>（等待读者）、<code>AW</code>（活跃写者）、<code>WW</code>（等待写者）。`],
    [String.raw`写者优先读者-写者锁的进入等待条件`, String.raw`读者：<code>while ((AW + WW) &gt; 0)</code>；写者：<code>while ((AW + AR) &gt; 0)</code>。`],
    [String.raw`读者与写者离开时的唤醒规则`, String.raw`读者离开：当 <code>AR == 0 &amp;&amp; WW &gt; 0</code> 时 <code>signal</code> 写者；写者离开：若 <code>WW &gt; 0</code> 则 <code>signal</code> 写者，否则若 <code>WR &gt; 0</code> 则 <code>broadcast</code> 读者。`],
    [String.raw`读者与写者共用单个条件变量时的要求`, String.raw`唤醒时必须使用 <code>cond_broadcast</code>，否则 <code>cond_signal</code> 唤醒不可运行的线程会导致全体死锁。`]
  ]
});
