import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import GameControls from '../../../src/components/GameControls.vue';

describe('GameControls Component', () => {
  let wrapper;
  let store;

  const mockStoreConfig = {
    modules: {
      horses: {
        namespaced: false,
        state: { horses: [] },
        mutations: {
          SET_HORSES: (state, horses) => { state.horses = horses; }
        },
        actions: {
          generateHorses: ({ commit }) => {
            const mockHorses = Array.from({ length: 20 }, (_, i) => ({
              id: i + 1,
              name: `Horse ${i + 1}`,
              color: '#FF0000',
              condition: 80 + i
            }));
            commit('SET_HORSES', mockHorses);
          }
        },
        getters: {
          allHorses: state => state.horses
        }
      },
      races: {
        namespaced: false,
        state: {
          raceSchedule: [],
          currentRound: 0,
          raceResults: [],
          currentRaceHorses: [],
          raceProgress: {}
        },
        mutations: {
          SET_RACE_SCHEDULE: (state, schedule) => { state.raceSchedule = schedule; },
          SET_CURRENT_ROUND: (state, round) => { state.currentRound = round; },
          RESET_RACE_DATA: (state) => {
            state.currentRound = 0;
            state.raceResults = [];
            state.currentRaceHorses = [];
            state.raceProgress = {};
          }
        },
        actions: {
          generateRaceSchedule: ({ commit, dispatch }) => {
            dispatch('generateHorses');
            const mockSchedule = Array.from({ length: 6 }, (_, i) => ({
              round: i + 1,
              distance: 1200 + (i * 200),
              horses: []
            }));
            commit('SET_RACE_SCHEDULE', mockSchedule);
            commit('RESET_RACE_DATA');
          },
          startRaces: () => {}
        },
        getters: {
          hasSchedule: state => state.raceSchedule.length > 0,
          currentRound: state => state.currentRound,
          currentRaceSchedule: state => state.raceSchedule,
          raceResults: state => state.raceResults
        }
      },
      ui: {
        namespaced: true,
        state: { isRacing: false },
        mutations: {
          SET_IS_RACING: (state, isRacing) => { state.isRacing = isRacing; }
        },
        getters: {
          isGameRacing: state => state.isRacing
        }
      }
    }
  };

  beforeEach(() => {
    store = createStore(mockStoreConfig);
    
    wrapper = mount(GameControls, {
      global: {
        plugins: [store]
      }
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  describe('Component Rendering', () => {
    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('should display Generate Race Schedule button', () => {
      const button = wrapper.find('[data-test="generate-schedule"]');
      expect(button.exists()).toBe(true);
      expect(button.text()).toContain('Generate Race Schedule');
    });

    it('should display Start Races button', () => {
      const button = wrapper.find('[data-test="start-races"]');
      expect(button.exists()).toBe(true);
      expect(button.text()).toContain('Start Races');
    });
  });

  describe('Button States', () => {
    it('should enable Generate Race Schedule button initially', () => {
      const button = wrapper.find('[data-test="generate-schedule"]');
      expect(button.attributes('disabled')).toBeUndefined();
    });

    it('should disable Start Races button when no schedule exists', () => {
      const button = wrapper.find('[data-test="start-races"]');
      expect(button.attributes('disabled')).toBeDefined();
    });

    it('should enable Start Races button when schedule exists', async () => {
      await store.dispatch('generateRaceSchedule');
      await wrapper.vm.$nextTick();
      
      const button = wrapper.find('[data-test="start-races"]');
      expect(button.attributes('disabled')).toBeUndefined();
    });

    it('should disable both buttons during racing', async () => {
      await store.dispatch('generateRaceSchedule');
      store.commit('ui/SET_IS_RACING', true);
      await wrapper.vm.$nextTick();
      
      const generateButton = wrapper.find('[data-test="generate-schedule"]');
      const startButton = wrapper.find('[data-test="start-races"]');
      
      expect(generateButton.attributes('disabled')).toBeDefined();
      expect(startButton.attributes('disabled')).toBeDefined();
    });
  });

  describe('Basic Functionality', () => {
    it('should display horses after schedule generation', async () => {
      await store.dispatch('generateRaceSchedule');
      await wrapper.vm.$nextTick();
      
      const horses = wrapper.find('[data-test="horses-list"]');
      expect(horses.exists()).toBe(true);
    });

    it('should display schedule after generation', async () => {
      await store.dispatch('generateRaceSchedule');
      await wrapper.vm.$nextTick();
      
      const schedule = wrapper.find('[data-test="race-schedule"]');
      expect(schedule.exists()).toBe(true);
    });

    it('should display correct round information', async () => {
      await store.dispatch('generateRaceSchedule');
      await wrapper.vm.$nextTick();
      
      const rounds = wrapper.findAll('[data-test="round-info"]');
      expect(rounds).toHaveLength(6);
    });

    it('should display horse information correctly', async () => {
      await store.dispatch('generateRaceSchedule');
      await wrapper.vm.$nextTick();
      
      const horseItems = wrapper.findAll('[data-test="horse-item"]');
      expect(horseItems.length).toBeGreaterThan(0);
      
      const firstHorse = horseItems[0];
      expect(firstHorse.find('[data-test="horse-name"]').exists()).toBe(true);
      expect(firstHorse.find('[data-test="horse-condition"]').exists()).toBe(true);
    });

    it('should show game status', () => {
      const status = wrapper.find('[data-test="game-status"]');
      expect(status.exists()).toBe(true);
      expect(status.text()).toContain('Status:');
    });
  });
});