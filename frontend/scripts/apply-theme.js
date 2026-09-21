const fs = require('fs');
const path = require('path');

function walk(dir, files = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else if (p.endsWith('.tsx')) files.push(p);
  }
  return files;
}

const root = path.join(__dirname, '..', 'src');
const replacements = [
  [/text-slate-900/g, 'text-black'],
  [/text-slate-800/g, 'text-black'],
  [/text-slate-700/g, 'text-neutral-800'],
  [/text-slate-600/g, 'text-neutral-600'],
  [/text-slate-500/g, 'text-neutral-500'],
  [/text-slate-400/g, 'text-neutral-400'],
  [/border-slate-200/g, 'border-neutral-200'],
  [/border-slate-100/g, 'border-neutral-100'],
  [/bg-slate-50/g, 'bg-neutral-50'],
  [/hover:bg-slate-100/g, 'hover:bg-neutral-100'],
  [/text-blue-600/g, 'text-primary-600'],
  [/text-amber-600/g, 'text-primary-600'],
  [/text-primary-700/g, 'text-primary-600'],
];

for (const file of walk(root)) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const [from, to] of replacements) {
    if (from.test(content)) {
      content = content.replace(from, to);
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(file, content);
}

console.log('Theme colors updated across all TSX files');
