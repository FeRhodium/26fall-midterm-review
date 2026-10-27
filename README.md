# 期中复习

CSC4010 和 CSC3150 的复习站，放在同一个端口上。

在线版（GitHub Pages）：https://ferhodium.github.io/26fall-midterm-review/

```bash
python3 serve.py            # 默认 8765 端口
```

- http://127.0.0.1:8765/ 入口
- http://127.0.0.1:8765/4010/ 理论计算机科学导论：Lecture 1–12 讲义、Problem Set 1–5 精讲、Practice Midterm 样卷、图灵机单步模拟器
- http://127.0.0.1:8765/3150/ 操作系统：Lecture 1–13 讲义、Lecture 14 预习、Spring 2026 Final 样卷全解

做题记录、闪卡进度和已读标记保存在浏览器的 localStorage 里。

## 目录

- `shared/`：两门课共用的渲染脚本 `engine.js`、样式 `site.css`、本地 KaTeX，以及数据校验脚本 `check.js`
- `4010/data/`、`3150/data/`：每章一个数据文件（讲义 HTML、题目、闪卡），`course.js` 是首页和考前提纲
- `4010/materials/`：来自课程官网 https://aditidudeja.github.io/courses/csc4010-f26/ 的全部 Lecture 0–13 课件、Tutorial 1–2、Problem Set 1–5 与 Practice Midterm PDF 及解答
- `3150/materials/`：来自 Blackboard 的 lec01–lec13 课件、Midterm Sample Paper（Spring 2026 Final 样卷）和课程表

## 改内容之后

```bash
node shared/check.js 4010/data/*.js 3150/data/*.js
```

它检查 JS 语法、字段、HTML 标签是否闭合，以及每个公式能否被 KaTeX 解析。需要先在 `/tmp/katexcheck` 里 `npm install katex@0.16.11`。
