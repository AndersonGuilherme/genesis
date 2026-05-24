import { describe, it, expect } from 'vitest';
import { compareManifests, isUserOwned, type Manifest } from './manifest.js';

describe('manifest', () => {
  describe('compareManifests', () => {
    const pristine: Manifest = {
      generatedAt: '',
      version: '1.0',
      files: {
        'a.md': 'hash-a-v1',
        'b.md': 'hash-b-v1',
        'c.md': 'hash-c-v1',
      },
    };
    const next: Manifest = {
      generatedAt: '',
      version: '2.0',
      files: {
        'a.md': 'hash-a-v1', // não mudou
        'b.md': 'hash-b-v2', // upstream mudou
        // c.md removido
        'd.md': 'hash-d-v2', // novo
      },
    };

    it('unchanged: current==pristine==new', () => {
      const diffs = compareManifests(pristine, { 'a.md': 'hash-a-v1', 'b.md': 'hash-b-v1', 'c.md': 'hash-c-v1' }, next);
      const a = diffs.find((d) => d.path === 'a.md');
      expect(a?.kind).toBe('unchanged');
    });

    it('safe-overwrite: current==pristine, new diferente', () => {
      const diffs = compareManifests(pristine, { 'a.md': 'hash-a-v1', 'b.md': 'hash-b-v1', 'c.md': 'hash-c-v1' }, next);
      const b = diffs.find((d) => d.path === 'b.md');
      expect(b?.kind).toBe('safe-overwrite');
    });

    it('user-customized: current diferente, pristine==new', () => {
      const nextSame: Manifest = { ...pristine, version: '2.0' };
      const diffs = compareManifests(pristine, { 'a.md': 'user-edit', 'b.md': 'hash-b-v1', 'c.md': 'hash-c-v1' }, nextSame);
      const a = diffs.find((d) => d.path === 'a.md');
      expect(a?.kind).toBe('user-customized');
    });

    it('conflict: current!=pristine, pristine!=new (ambos mudaram)', () => {
      const diffs = compareManifests(pristine, { 'a.md': 'hash-a-v1', 'b.md': 'user-edit-b', 'c.md': 'hash-c-v1' }, next);
      const b = diffs.find((d) => d.path === 'b.md');
      expect(b?.kind).toBe('conflict');
    });

    it('added-upstream: path novo só em next', () => {
      const diffs = compareManifests(pristine, { 'a.md': 'hash-a-v1', 'b.md': 'hash-b-v1', 'c.md': 'hash-c-v1' }, next);
      const d = diffs.find((diff) => diff.path === 'd.md');
      expect(d?.kind).toBe('added-upstream');
    });

    it('removed-upstream: path só em pristine', () => {
      const diffs = compareManifests(pristine, { 'a.md': 'hash-a-v1', 'b.md': 'hash-b-v1', 'c.md': 'hash-c-v1' }, next);
      const c = diffs.find((diff) => diff.path === 'c.md');
      expect(c?.kind).toBe('removed-upstream');
    });
  });

  describe('isUserOwned', () => {
    it('docs/ é sempre user-owned', () => {
      expect(isUserOwned('docs/product/vision.md')).toBe(true);
      expect(isUserOwned('docs/README.md')).toBe(true);
    });
    it('manifest.lock e .backup/ são user-owned', () => {
      expect(isUserOwned('.genesis/manifest.lock.json')).toBe(true);
      expect(isUserOwned('.genesis/.backup/xyz/file.md')).toBe(true);
      expect(isUserOwned('.genesis/.cache/transcripts.sqlite')).toBe(true);
    });
    it('CHANGELOG.md raiz é user-owned', () => {
      expect(isUserOwned('CHANGELOG.md')).toBe(true);
    });
    it('outros paths não são user-owned por default', () => {
      expect(isUserOwned('.claude/rules/foo.md')).toBe(false);
      expect(isUserOwned('CLAUDE.md')).toBe(false);
      expect(isUserOwned('.genesis/templates/foo.md')).toBe(false);
    });
  });
});
