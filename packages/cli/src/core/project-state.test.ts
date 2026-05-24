import { describe, it, expect } from 'vitest';
import {
  buildDefaultConfig,
  setSkillStatus,
  setActivePhase,
  progressByPhase,
  nextPhase,
  type GenesisConfig,
} from './project-state.js';

describe('project-state', () => {
  describe('buildDefaultConfig', () => {
    it('cria config com skills em pending + phase = discovery', () => {
      const cfg = buildDefaultConfig('meu-projeto', [
        { id: 'plan-init-project', phase: 'planning' },
        { id: 'sec-threat-model', phase: 'security' },
      ]);
      expect(cfg.version).toBe(1);
      expect(cfg.project.name).toBe('meu-projeto');
      expect(cfg.phase.active).toBe('discovery');
      expect(cfg.skills).toHaveLength(2);
      expect(cfg.skills[0]?.status).toBe('pending');
    });
  });

  describe('setSkillStatus', () => {
    it('muda status + grava updatedAt', () => {
      const cfg = buildDefaultConfig('p', [{ id: 's1', phase: 'planning' }]);
      setSkillStatus(cfg, 's1', 'done', 'feito ontem');
      expect(cfg.skills[0]?.status).toBe('done');
      expect(cfg.skills[0]?.notes).toBe('feito ontem');
      expect(cfg.skills[0]?.updatedAt).toBeTruthy();
    });
    it('throw quando skill inexistente', () => {
      const cfg = buildDefaultConfig('p', []);
      expect(() => setSkillStatus(cfg, 'nope', 'done')).toThrow(/não está no config/);
    });
  });

  describe('setActivePhase', () => {
    it('aceita phase válida', () => {
      const cfg: GenesisConfig = buildDefaultConfig('p', []);
      setActivePhase(cfg, 'security');
      expect(cfg.phase.active).toBe('security');
    });
    it('throw em phase inválida', () => {
      const cfg = buildDefaultConfig('p', []);
      expect(() => setActivePhase(cfg, 'fakephase')).toThrow(/phase inválida/);
    });
  });

  describe('progressByPhase', () => {
    it('agrega done/total/skip', () => {
      const cfg = buildDefaultConfig('p', [
        { id: 'a', phase: 'planning' },
        { id: 'b', phase: 'planning' },
        { id: 'c', phase: 'security' },
      ]);
      setSkillStatus(cfg, 'a', 'done');
      setSkillStatus(cfg, 'b', 'skip');
      const p = progressByPhase(cfg);
      expect(p.get('planning')).toEqual({ done: 1, total: 2, skip: 1 });
      expect(p.get('security')).toEqual({ done: 0, total: 1, skip: 0 });
      expect(p.get('lgpd')).toEqual({ done: 0, total: 0, skip: 0 });
    });
  });

  describe('nextPhase', () => {
    it('discovery → planning', () => {
      expect(nextPhase('discovery')).toBe('planning');
    });
    it('maintenance → null (última)', () => {
      expect(nextPhase('maintenance')).toBeNull();
    });
  });
});
