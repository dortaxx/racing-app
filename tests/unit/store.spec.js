import { describe, it, expect } from 'vitest';
import store from '../../src/store/index.js';

describe('Modular Vuex Store', () => {
  it('should have all required modules', () => {
    expect(store.hasModule('horses')).toBe(true);
    expect(store.hasModule('races')).toBe(true);
    expect(store.hasModule('ui')).toBe(true);
  });

  it('should generate horses correctly', async () => {
    await store.dispatch('generateHorses');
    const horses = store.getters.allHorses;
    
    expect(horses).toHaveLength(20);
    expect(horses[0]).toHaveProperty('id');
    expect(horses[0]).toHaveProperty('name');
    expect(horses[0]).toHaveProperty('color');
    expect(horses[0]).toHaveProperty('condition');
  });

  it('should manage racing state through UI module', () => {
    expect(store.getters['ui/isGameRacing']).toBe(false);
    
    store.commit('ui/SET_IS_RACING', true);
    expect(store.getters['ui/isGameRacing']).toBe(true);
    
    store.commit('ui/SET_IS_RACING', false);
    expect(store.getters['ui/isGameRacing']).toBe(false);
  });

  it('should generate race schedule correctly', async () => {
    await store.dispatch('generateRaceSchedule');
    
    const schedule = store.getters.currentRaceSchedule;
    const hasSchedule = store.getters.hasSchedule;
    
    expect(hasSchedule).toBe(true);
    expect(schedule).toHaveLength(6);
    expect(schedule[0]).toHaveProperty('round', 1);
    expect(schedule[0]).toHaveProperty('distance', 1200);
    expect(schedule[0]).toHaveProperty('horses');
  });

  it('should reset race data properly', async () => {
    await store.dispatch('generateRaceSchedule');
    store.commit('SET_CURRENT_ROUND', 3);
    store.commit('ADD_RACE_RESULT', { round: 1, results: [] });
    
    store.commit('RESET_RACE_DATA');
    
    expect(store.getters.currentRound).toBe(0);
    expect(store.getters.raceResults).toHaveLength(0);
  });

  it('should have all required getters', () => {
    const getters = [
      'allHorses',
      'currentRaceSchedule', 
      'currentRound',
      'raceResults',
      'hasSchedule',
      'ui/isGameRacing'
    ];
    
    getters.forEach(getter => {
      expect(() => store.getters[getter]).not.toThrow();
    });
  });
});