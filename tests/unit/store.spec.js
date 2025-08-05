import { describe, it, expect } from 'vitest';
import { createStore } from 'vuex';

describe('Vuex Store Configuration', () => {
  const testStoreConfig = {
    state: {
      horses: [],
      raceSchedule: [],
      currentRound: 0,
      isRacing: false,
      raceResults: [],
      currentRaceHorses: [],
      raceProgress: {}
    },
    mutations: {
      SET_HORSES: (state, horses) => { state.horses = horses; },
      SET_RACE_SCHEDULE: (state, schedule) => { state.raceSchedule = schedule; },
      SET_IS_RACING: (state, isRacing) => { state.isRacing = isRacing; },
      SET_CURRENT_ROUND: (state, round) => { state.currentRound = round; },
      RESET_GAME: (state) => {
        state.currentRound = 0;
        state.isRacing = false;
        state.raceResults = [];
        state.currentRaceHorses = [];
        state.raceProgress = {};
      }
    },
    actions: {
      generateHorses: ({ commit }) => {
        const horses = Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          name: `Horse ${i + 1}`,
          color: '#FF0000',
          condition: 80 + i
        }));
        commit('SET_HORSES', horses);
      },
      generateRaceSchedule: ({ commit, dispatch }) => {
        dispatch('generateHorses');
        const schedule = Array.from({ length: 6 }, (_, i) => ({
          round: i + 1,
          distance: 1200 + (i * 200),
          horses: []
        }));
        commit('SET_RACE_SCHEDULE', schedule);
      }
    },
    getters: {
      allHorses: state => state.horses,
      hasSchedule: state => state.raceSchedule.length > 0,
      isGameRacing: state => state.isRacing,
      currentRound: state => state.currentRound,
      currentRaceSchedule: state => state.raceSchedule,
      raceResults: state => state.raceResults,
      currentRaceHorses: state => state.currentRaceHorses
    }
  };

  describe('Initial State', () => {
    it('should have correct initial state structure', () => {
      const store = createStore(testStoreConfig);
      
      expect(store.state.horses).toEqual([]);
      expect(store.state.raceSchedule).toEqual([]);
      expect(store.state.currentRound).toBe(0);
      expect(store.state.isRacing).toBe(false);
      expect(store.state.raceResults).toEqual([]);
      expect(store.state.currentRaceHorses).toEqual([]);
      expect(store.state.raceProgress).toEqual({});
    });
  });

  describe('Mutations', () => {
    it('should set horses correctly', () => {
      const store = createStore(testStoreConfig);
      const horses = [{ id: 1, name: 'Test Horse' }];
      
      store.commit('SET_HORSES', horses);
      expect(store.state.horses).toEqual(horses);
    });

    it('should set race schedule correctly', () => {
      const store = createStore(testStoreConfig);
      const schedule = [{ round: 1, distance: 1200 }];
      
      store.commit('SET_RACE_SCHEDULE', schedule);
      expect(store.state.raceSchedule).toEqual(schedule);
    });

    it('should set racing status correctly', () => {
      const store = createStore(testStoreConfig);
      
      store.commit('SET_IS_RACING', true);
      expect(store.state.isRacing).toBe(true);
    });

    it('should reset game state correctly', () => {
      const store = createStore(testStoreConfig);
      
      store.commit('SET_CURRENT_ROUND', 3);
      store.commit('SET_IS_RACING', true);
      
      store.commit('RESET_GAME');
      
      expect(store.state.currentRound).toBe(0);
      expect(store.state.isRacing).toBe(false);
      expect(store.state.raceResults).toEqual([]);
    });
  });

  describe('Actions', () => {
    it('should generate horses', async () => {
      const store = createStore(testStoreConfig);
      
      await store.dispatch('generateHorses');
      
      expect(store.state.horses).toHaveLength(20);
      expect(store.state.horses[0]).toHaveProperty('id');
      expect(store.state.horses[0]).toHaveProperty('name');
    });

    it('should generate race schedule', async () => {
      const store = createStore(testStoreConfig);
      
      await store.dispatch('generateRaceSchedule');
      
      expect(store.state.raceSchedule).toHaveLength(6);
      expect(store.state.horses).toHaveLength(20);
    });
  });

  describe('Getters', () => {
    it('should return correct types for getters', () => {
      const store = createStore(testStoreConfig);
      
      expect(Array.isArray(store.getters.allHorses)).toBe(true);
      expect(typeof store.getters.hasSchedule).toBe('boolean');
      expect(typeof store.getters.isGameRacing).toBe('boolean');
      expect(typeof store.getters.currentRound).toBe('number');
    });

    it('should return correct values after generating schedule', async () => {
      const store = createStore(testStoreConfig);
      
      await store.dispatch('generateRaceSchedule');
      
      expect(store.getters.hasSchedule).toBe(true);
      expect(store.getters.allHorses).toHaveLength(20);
    });
  });
});