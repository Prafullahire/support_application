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

const pagesDir = path.join(__dirname, '..', 'src', 'app');
const pages = walk(pagesDir);

const spinnerBlock =
  /<div className="flex h-\d+ items-center justify-center">\s*<div className="h-\d+ w-\d+ animate-spin rounded-full border-4 border-primary-600 border-t-transparent" \/>\s*<\/div>/g;

const errorBlock =
  /<div className="rounded-lg border border-primary-300 bg-red-50 px-4 py-3 text-primary-700">\{error\}<\/div>/g;

for (const file of pages) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (!content.includes("from 'sonner'") && !content.includes('from "sonner"')) {
    if (content.includes("'use client'")) {
      content = content.replace(
        /('use client';\s*\n)/,
        "$1import { toast } from 'sonner';\n",
      );
      changed = true;
    }
  }

  if (!content.includes('LoadingState') && spinnerBlock.test(content)) {
    if (!content.includes("from '@/components/ui/loading-state'")) {
      content = content.replace(
        /(import .+ from '@\/components\/layout\/page-header';\n)/,
        "$1import { LoadingState } from '@/components/ui/loading-state';\n",
      );
      if (!content.includes("from '@/components/ui/loading-state'")) {
        content = content.replace(
          /(import .+ from 'lucide-react';\n)/,
          "$1import { LoadingState } from '@/components/ui/loading-state';\n",
        );
      }
      if (!content.includes("from '@/components/ui/loading-state'")) {
        content = content.replace(
          /(import .+ from '@\/lib\/api';\n)/,
          "$1import { LoadingState } from '@/components/ui/loading-state';\n",
        );
      }
    }
    content = content.replace(spinnerBlock, '<LoadingState />');
    changed = true;
  }

  if (!content.includes('ErrorBanner') && errorBlock.test(content)) {
    if (!content.includes("from '@/components/ui/error-banner'")) {
      content = content.replace(
        /(import { LoadingState } from '@\/components\/ui\/loading-state';\n)/,
        "$1import { ErrorBanner } from '@/components/ui/error-banner';\n",
      );
    }
    content = content.replace(
      errorBlock,
      "<ErrorBanner error={error} onDismiss={() => setError('')} />",
    );
    changed = true;
  }

  if (content.includes('.catch((err) => setError(err.message))')) {
    content = content.replace(
      /\.catch\(\(err\) => setError\(err\.message\)\)/g,
      `.catch((err) => {
        const msg = err instanceof Error ? err.message : 'Failed to load';
        setError(msg);
        toast.error(msg);
      })`,
    );
    changed = true;
  }

  if (content.includes("setError(err instanceof Error ? err.message : 'Operation failed')")) {
    content = content.replace(
      /setError\(err instanceof Error \? err\.message : 'Operation failed'\);/g,
      `const msg = err instanceof Error ? err.message : 'Operation failed';
      setError(msg);
      toast.error(msg);`,
    );
    changed = true;
  }

  if (content.includes("setError(err instanceof Error ? err.message : 'Delete failed')")) {
    content = content.replace(
      /setError\(err instanceof Error \? err\.message : 'Delete failed'\);/g,
      `const msg = err instanceof Error ? err.message : 'Delete failed';
      setError(msg);
      toast.error(msg);`,
    );
    changed = true;
  }

  if (content.includes('modal.close();\n      resetForm();\n      loadData();')) {
    content = content.replace(
      /modal\.close\(\);\s*resetForm\(\);\s*loadData\(\);/g,
      `modal.close();
      resetForm();
      toast.success(modal.isEdit ? 'Updated successfully' : 'Created successfully');
      loadData();`,
    );
    changed = true;
  }

  if (content.includes('await requestsApi.delete') || content.includes('.delete(item.id)')) {
    content = content.replace(
      /(await \w+Api\.delete\([^)]+\);)\s*loadData\(\);/g,
      `$1
      toast.success('Deleted successfully');
      loadData();`,
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Updated:', path.relative(pagesDir, file));
  }
}

console.log('Done');
