import { existsSync } from 'node:fs';
import { join } from 'node:path';
import fg from 'fast-glob';

export interface TreeNode {
  name: string;
  path: string; // url path (sem prefixo)
  children: TreeNode[];
  isFile: boolean;
}

/**
 * Constrói árvore navegável a partir de docs/ do projeto-filho.
 * Inclui .md somente. Ordena alfabético com README primeiro.
 */
export async function buildDocsTree(projectRoot: string): Promise<TreeNode> {
  const docsDir = join(projectRoot, 'docs');
  if (!existsSync(docsDir)) {
    return { name: 'docs', path: '', children: [], isFile: false };
  }
  const files = await fg(['**/*.md'], {
    cwd: docsDir,
    onlyFiles: true,
    dot: false,
  });

  const root: TreeNode = { name: 'docs', path: '', children: [], isFile: false };
  for (const rel of files.sort()) {
    const parts = rel.split('/');
    let current = root;
    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i]!;
      const isLast = i === parts.length - 1;
      const accumPath = parts.slice(0, i + 1).join('/');
      let child = current.children.find((c) => c.name === part);
      if (!child) {
        child = {
          name: part,
          path: accumPath,
          children: [],
          isFile: isLast,
        };
        current.children.push(child);
      }
      current = child;
    }
  }
  sortTree(root);
  return root;
}

function sortTree(node: TreeNode): void {
  node.children.sort((a, b) => {
    // README primeiro
    if (a.name.toLowerCase().startsWith('readme')) return -1;
    if (b.name.toLowerCase().startsWith('readme')) return 1;
    // dirs antes de files
    if (a.isFile !== b.isFile) return a.isFile ? 1 : -1;
    return a.name.localeCompare(b.name);
  });
  for (const c of node.children) sortTree(c);
}

export function renderTreeHtml(node: TreeNode, currentPath?: string): string {
  if (node.children.length === 0) return '';
  const items = node.children.map((c) => {
    if (c.isFile) {
      const label = c.name.replace(/\.md$/, '');
      const isActive = currentPath === c.path;
      const cls = isActive
        ? 'block px-2 py-1 text-sm bg-cyan-50 text-cyan-900 rounded font-medium'
        : 'block px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 rounded';
      return `<li><a href="/docs/${c.path}" class="${cls}">${escape(label)}</a></li>`;
    }
    return `<li>
      <details ${isAncestor(c, currentPath) ? 'open' : ''}>
        <summary class="cursor-pointer px-2 py-1 text-sm font-medium text-slate-900 hover:bg-slate-100 rounded">${escape(c.name)}/</summary>
        <ul class="ml-3 border-l border-slate-200">${renderTreeHtml(c, currentPath)}</ul>
      </details>
    </li>`;
  });
  return items.join('');
}

function isAncestor(node: TreeNode, currentPath?: string): boolean {
  if (!currentPath) return false;
  return currentPath.startsWith(node.path + '/') || currentPath === node.path;
}

function escape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
