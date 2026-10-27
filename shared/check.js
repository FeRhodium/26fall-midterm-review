#!/usr/bin/env node
// Usage: node shared/check.js 4120/data/w1.js [more files...]
const fs = require("fs");
const vm = require("vm");
const path = require("path");

let katex;
for (const p of ["/tmp/katexcheck/node_modules/katex", "katex"]) {
  try { katex = require(p); break; } catch (e) { /* try next */ }
}
if (!katex) { console.error("katex not found: cd /tmp/katexcheck && npm install katex@0.16.11"); process.exit(2); }

const VOID = new Set(["br", "hr", "img", "input", "meta", "link", "wbr", "col", "source"]);
const decode = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");

function mathErrors(html, where) {
  const errs = [];
  const text = decode(html.replace(/<[^>]*>/g, " "));
  const re = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/g;
  let m;
  while ((m = re.exec(text))) {
    const tex = m[1] !== undefined ? m[1] : m[2];
    try { katex.renderToString(tex, { displayMode: m[1] !== undefined, throwOnError: true, strict: "ignore" }); }
    catch (e) { errs.push(`${where}: KaTeX: ${e.message.split("\n")[0]}  <<${tex.slice(0, 80)}>>`); }
  }
  const leftovers = text.replace(re, "");
  if (/\\\(|\\\)|\\\[|\\\]/.test(leftovers)) errs.push(`${where}: unbalanced math delimiter`);
  return errs;
}

function tagErrors(html, where) {
  const stack = [];
  const re = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(\/?)>/g;
  let m;
  while ((m = re.exec(html))) {
    const name = m[1].toLowerCase();
    if (VOID.has(name) || m[2] === "/") continue;
    if (m[0][1] === "/") {
      if (stack[stack.length - 1] === name) stack.pop();
      else return [`${where}: unexpected </${name}> (open: ${stack.slice(-3).join(",") || "none"})`];
    } else stack.push(name);
  }
  return stack.length ? [`${where}: unclosed <${stack.join(">, <")}>`] : [];
}

function checkText(s, where) {
  if (typeof s !== "string" || !s.trim()) return [`${where}: empty or not a string`];
  return [...mathErrors(s, where), ...tagErrors(s, where)];
}

let failed = false;
const seen = new Set();
for (const file of process.argv.slice(2)) {
  const coursePrefix = path.normalize(file).split(path.sep)[0] || "";
  const chapters = [];
  const sandbox = { window: {} };
  sandbox.window.Review = { add: (c) => chapters.push(c), setup: (c) => chapters.push({ __setup: true, ...c }) };
  sandbox.Review = sandbox.window.Review;
  const errs = [];
  try { vm.runInNewContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file }); }
  catch (e) { errs.push(`syntax/runtime: ${e.message}`); }
  let nq = 0, nc = 0;
  for (const c of chapters) {
    if (c.__setup) {
      for (const k of ["home", "sheet"]) if (c[k]) errs.push(...checkText(c[k], `setup.${k}`));
      continue;
    }
    const id = c.id || "?";
    for (const k of ["id", "group", "short", "title", "meta", "html"]) if (!c[k]) errs.push(`${id}: missing ${k}`);
    if (seen.has(`${coursePrefix}:${id}`)) errs.push(`${id}: duplicate chapter id`);
    seen.add(`${coursePrefix}:${id}`);
    errs.push(...checkText(c.html || "", `${id}.html`));
    const qids = new Set();
    (c.questions || []).forEach((q, i) => {
      const w = `${id}.questions[${i}]${q.id ? "(" + q.id + ")" : ""}`;
      if (!q.id) errs.push(`${w}: missing id`);
      if (qids.has(q.id)) errs.push(`${w}: duplicate id`);
      qids.add(q.id);
      if (!["tf", "single", "multi"].includes(q.kind)) errs.push(`${w}: bad kind ${q.kind}`);
      if (!["slide", "hw", "sample", "practice"].includes(q.tag)) errs.push(`${w}: bad tag ${q.tag}`);
      errs.push(...checkText(q.q, `${w}.q`), ...checkText(q.why, `${w}.why`));
      const ids = q.kind === "tf" ? ["t", "f"] : (q.choices || []).map((x) => x[0]);
      if (q.kind !== "tf") {
        if (!Array.isArray(q.choices) || q.choices.length < 2) errs.push(`${w}: needs >=2 choices`);
        (q.choices || []).forEach((ch, j) => errs.push(...checkText(ch[1], `${w}.choices[${j}]`)));
      }
      if (!Array.isArray(q.answer) || !q.answer.length) errs.push(`${w}: answer must be a non-empty array`);
      else if (!q.answer.every((a) => ids.includes(a))) errs.push(`${w}: answer ${q.answer} not in choices`);
      if (q.kind !== "multi" && q.answer && q.answer.length !== 1) errs.push(`${w}: ${q.kind} needs exactly one answer`);
      nq++;
    });
    (c.cards || []).forEach((cd, i) => {
      if (!Array.isArray(cd) || cd.length !== 2) errs.push(`${id}.cards[${i}]: must be [front, back]`);
      else errs.push(...checkText(cd[0], `${id}.cards[${i}].front`), ...checkText(cd[1], `${id}.cards[${i}].back`));
      nc++;
    });
  }
  const real = chapters.filter((c) => !c.__setup);
  if (!chapters.length) errs.push("no Review.add(...) call found");
  if (errs.length) { failed = true; console.log(`FAIL ${path.normalize(file)}`); errs.forEach((e) => console.log("  " + e)); }
  else console.log(`OK   ${path.normalize(file)}  chapters=${real.length} questions=${nq} cards=${nc} html=${real.reduce((s, c) => s + (c.html || "").length, 0)} chars`);
}
process.exit(failed ? 1 : 0);
