#set text(font: "New Computer Modern", size: 11pt, lang: "en")
#set page(margin: (x: 2.2cm, y: 2.4cm))
#set enum(numbering: "(a)")
#set math.equation(numbering: "(1)")

*1.*

#enum(
  [Valid. Deterministic and maps into $\{0, dots, N-1\}$ (all keys collide, but it is a legal hash function).],
  [Invalid. Not deterministic: the same key may map to a different slot at search time.],
  [Valid. This is the division method.],
  [Valid, but a poor choice. Deterministic, computable in $O(1)$, and every value is a legal slot; it merely never uses slots $N-2$ and $N-1$ (wastes 2 slots — the same defect as (a), which uses only slot 0, only milder).],
  [Valid as a function (deterministic, range $\{0, dots, N-1\}$), but unusable: every operation costs $Theta(N^2)$ just to evaluate $h$.],
)

*2.*  Let $x = x_(r-1) dots x_1 x_0$ with $x_i in {0, dots, 2^p - 1}$:

$ k(x) = sum_(i=0)^(r-1) x_i dot (2^p)^i. $

Since $2^p equiv 1 " (mod" 2^p - 1")"$, every power satisfies $(2^p)^i equiv 1 " (mod" m")"$, so

$ h(x) = (sum_(i=0)^(r-1) x_i) "mod" m, $

which depends only on the sum of the characters, not their positions. Hence permuting the characters of $y$ gives $h(x) = h(y)$. $square$

*3.*  #enum(
  [False. Open addressing: $1/(1-alpha)$ probes; chaining: $1 + alpha$ probes. Since $1/(1-alpha) > 1 + alpha$ for all $0 < alpha < 1$, chaining is faster.],
  [False. Insertion costs $1/(1-alpha)$ probes vs. $1 + alpha$ in chaining; deletion in open addressing needs tombstones or shifting, so it is not faster either.],
  [True. No pointers per slot/element; for the same storage a larger table (lower load factor) is possible.],
  [False. Open addressing: the initial probe finds an occupied slot with probability exactly $alpha$. Chaining: a new key lands in a non-empty bucket with probability $1 - (1 - 1/m)^n approx 1 - e^(-alpha) = alpha - alpha^2/2 + dots.c < alpha$. Not equal.],
)

*4.*  Expected empty slots: $ m (1 - 1/m)^n approx m e^(-n/m). $

#enum(
  [$m = sqrt(n)$: $sqrt(n) e^(-sqrt(n)) -> 0$ — *(ii) zero*.],
  [$m = c n$: $c n e^(-1/c) = Theta(n) -> infinity$ — *(iii) infinity*.],
  [$m = n^a$, $a > 1$: $n/m -> 0$, so $n^a (1-o(1)) -> infinity$ — *(iii) infinity*.],
)

*5.*  Linear probing, $h(k) = k "mod" m$, initial $m = 4$, double when load factor would exceed $0.75$.

#table(
  columns: (auto, auto, auto, auto),
  inset: 5pt,
  align: center,
  [*Insert*], [*Trace*], [*Placement*], [*Resize?*],
  [12], [$12 "mod" 4 = 0$], [slot 0], [no ($1/4$)],
  [43], [$43 "mod" 4 = 3$], [slot 3], [no ($2/4$)],
  [13], [$13 "mod" 4 = 1$], [slot 1], [no ($3/4 = 0.75$)],
  [88], [$88"mod"4=0 -> 0,1$ busy $-> 2$], [slot 2], [$4/4 = 1 > 0.75$: double to $m = 8$],
  [23], [$23 "mod" 8 = 7$], [slot 7], [no ($5/8$)],
  [26], [$26 "mod" 8 = 2$], [slot 2], [no ($6/8 = 0.75$)],
  [11], [$11"mod"8=3 -> 3,4,5$ busy $-> 6$], [slot 6], [$7/8 > 0.75$: double to $m = 16$],
  [5], [$5 "mod" 16 = 5$], [slot 5], [no ($8/16 = 0.5$)],
)

*Rehash to $m = 8$*: 12 $-> 4$, 43 $-> 3$, 13 $-> 5$, 88 $-> 0$:
$ [88 | dot | dot | 43 | 12 | 13 | dot | dot] $

*Rehash to $m = 16$*: 88 $-> 8$, 43 $-> 11$, 12 $-> 12$, 13 $-> 13$, 23 $-> 7$, 26 $-> 10$, 11 $-> 11,12,13$ busy $-> 14$.

*Final table* ($m = 16$, $dot$ = empty):

#table(
  columns: 17,
  align: center,
  inset: 4pt,
  stroke: 0.5pt,
  [*slot*],[0],[1],[2],[3],[4],[5],[6],[7],[8],[9],[10],[11],[12],[13],[14],[15],
  [*key*],[•],[•],[•],[•],[•],[*5*],[•],[*23*],[*88*],[•],[*26*],[*43*],[*12*],[*13*],[*11*],[•],
)

*6.*

(a) Some 3 of the 4 keys hash to the same slot and the fourth elsewhere:

$ P = binom(4,3) dot (1/m)^2 dot (1 - 1/m) = (4 (m-1)) / m^3 . $

(b) "At least 4" is the complement of "exactly 3", which requires $k_2$ to avoid $k_1$'s slot ($1 - 1/m$) and $k_3$ to avoid both ($1 - 2/m$):

$ P("total" >= 4) = 1 - (1 - 1/m)(1 - 2/m) = (3m - 2)/m^2 . $

(c) Expected probes for an unsuccessful search: $1/(1-alpha)$.

$ 1/(1 - alpha) = 1/(1/sqrt(n)) = sqrt(n) = Theta(sqrt(n)). $

*7.*

(a) *Insertions.* Charge 3 per insertion: 1 for the insert, 2 stored as credit on the new element. Right after a doubling, the table of size $m$ holds $m/2$ elements. The next doubling occurs only after at least $m/2$ more insertions, which bank $2 dot m/2 = m$ credits — enough to pay the $Theta(m)$ cost. Hence amortized cost $O(1)$.

*Deletions.* Charge a sufficiently large constant $c$ per deletion: 1 for the delete, $c-1$ banked. Right after a halving, the table of size $m$ holds $m/2$ elements. The next halving occurs only after at least $m/4$ deletions, which bank $(c-1) dot m/4 = Theta(m)$ credits — enough to pay the $Theta(m)$ halving cost for a suitable constant $c$. (If a doubling happens first, it is paid by the insertion credits.) Hence amortized cost $O(1)$. $square$

(b) All leaves of a 2-3 tree are at depth $<= log_2 n$, so any insertion or deletion costs at most $c_1 log n$ actual work.

*Charging scheme (common bank).* Insertions are charged extra and deposit the surplus into a single common bank; deletions pay their entire actual cost out of this bank, so they are charged 0. Track the bank balance as $Phi = K n log n$, where $n$ is the current number of keys and $K = 2 c_1$.

*Insertion.* When the tree has $n$ keys, the actual cost is $<= c_1 log n$, and the bank must grow by

$ Delta Phi = K[(n+1) log(n+1) - n log n] <= K (log n + 2). $

Charge the insertion an amortized $(c_1 + K)(log n + 2) = O(log n)$: it pays its own cost and deposits the surplus.

*Deletion.* Before the deletion the tree has $n$ keys; the actual cost is $<= c_1 log n$, and the bank releases

$ Delta Phi = K[n log n - (n-1) log(n-1)] >= K log(n-1) >= K(log n - 1). $

The release $K(log n - 1) = 2 c_1 log n - K >= c_1 log n$ for $log n >= 2$ (and the remaining cases are constants covered by the constant terms) covers the actual cost, so the deletion is charged $0$.

*Balance.* $Phi = K n log n >= 0$ always, so the bank never goes negative; the amortized costs — $O(log n)$ per insertion, $0$ per deletion — are valid. $square$
