const fs = require('fs');
const path = require('path');

function walk(dir, files = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else if (p.endsWith('page.tsx')) files.push(p);
  }
  return files;
}

const pages = walk(path.join(__dirname, '..', 'src', 'app'));

for (const file of pages) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  content = content.replace(
    /} catch \(err\) \{\s*setError\(err instanceof Error \? err\.message : '([^']+)'\);\s*\}/g,
    `} catch (err) {
      const message = err instanceof Error ? err.message : '$1';
      setError(message);
      toast.error(message);
    }`,
  );

  if (content !== original) {
    if (!content.includes("from 'sonner'")) {
      content = content.replace(/('use client';\s*\n)/, "$1import { toast } from 'sonner';\n");
    }
    fs.writeFileSync(file, content);
    console.log('Fixed:', path.basename(path.dirname(file)) + '/' + path.basename(file));
  }
}
