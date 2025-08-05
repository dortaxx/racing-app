import { createStore } from 'vuex'

const ROUND_DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200]
const HORSE_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
  '#C44569', '#F8B500', '#6C5CE7', '#A29BFE', '#6C5B7B',
  '#FDA7DF', '#4834D4', '#686DE0', '#30336B', '#130F40'
]

const HORSE_NAMES = [
  'Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton', 'Katherine Johnson',
  'Dorothy Vaughan', 'Mary Jackson', 'Hedy Lamarr', 'Radia Perlman',
  'Barbara Liskov', 'Frances Allen', 'Shafi Goldwasser', 'Susan Kare',
  'Carol Shaw', 'Roberta Williams', 'Brenda Laurel', 'Adele Goldberg',
  'Jean Sammet', 'Betty Holberton', 'Marlyn Meltzer', 'Ruth Teitelbaum'
]

function generateHorse(id) {
  return {
    id,
    name: HORSE_NAMES[id - 1],
    color: HORSE_COLORS[id - 1],
    condition: Math.floor(Math.random() * 100) + 1,
    position: 0,
    isRacing: false
  }
}

function generateAllHorses() {
  return Array.from({ length: 20 }, (_, i) => generateHorse(i + 1))
}

function selectRandomHorses(horses, count = 10) {
  const shuffled = [...horses].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function calculateRaceSpeed(horse, distance) {
  // Normalize condition to be between 0.7 and 1.3 (instead of 0.01 to 1.0)
  // This ensures horses with low condition aren't extremely slow
  const normalizedCondition = 0.7 + (horse.condition / 100) * 0.6
  
  // Random factor between 0.8 and 1.2 for race excitement
  const randomFactor = Math.random() * 0.4 + 0.8
  
  // Distance factor - longer races are slightly slower
  const distanceFactor = 1000 / distance
  
  // Add some extra randomness for exciting finishes
  const raceLuck = Math.random() * 0.3 + 0.85
  
  return normalizedCondition * randomFactor * distanceFactor * raceLuck * 2.5
}

export default createStore({
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
    SET_HORSES(state, horses) {
      state.horses = horses
    },

    SET_RACE_SCHEDULE(state, schedule) {
      state.raceSchedule = schedule
    },

    SET_CURRENT_ROUND(state, round) {
      state.currentRound = round
    },

    SET_IS_RACING(state, isRacing) {
      state.isRacing = isRacing
    },

    SET_CURRENT_RACE_HORSES(state, horses) {
      state.currentRaceHorses = horses
    },

    UPDATE_HORSE_POSITION(state, { horseId, position }) {
      const horse = state.currentRaceHorses.find(h => h.id === horseId)
      if (horse) {
        horse.position = position
      }
    },

    ADD_RACE_RESULT(state, result) {
      state.raceResults.push(result)
    },

    RESET_HORSE_POSITIONS(state) {
      state.currentRaceHorses.forEach(horse => {
        horse.position = 0
        horse.isRacing = false
      })
    },

    RESET_GAME(state) {
      state.currentRound = 0
      state.isRacing = false
      state.raceResults = []
      state.currentRaceHorses = []
      state.raceProgress = {}
    }
  },

  actions: {
    generateHorses({ commit }) {
      const horses = generateAllHorses()
      commit('SET_HORSES', horses)
    },

    async generateRaceSchedule({ commit, state, dispatch }) {
      // Ensure horses are generated first
      if (state.horses.length === 0) {
        await dispatch('generateHorses')
      }
      
      const schedule = ROUND_DISTANCES.map((distance, index) => ({
        round: index + 1,
        distance,
        horses: selectRandomHorses(state.horses, 10)
      }))
      
      commit('SET_RACE_SCHEDULE', schedule)
      commit('RESET_GAME')
    },

    async startRaces({ dispatch, state, commit }) {
      if (state.raceSchedule.length === 0) return

      commit('SET_IS_RACING', true)

      for (let i = 0; i < state.raceSchedule.length; i++) {
        await dispatch('runSingleRace', i)
        if (i < state.raceSchedule.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      }

      commit('SET_IS_RACING', false)
    },

    async runSingleRace({ commit, state }, roundIndex) {
      const race = state.raceSchedule[roundIndex]
      commit('SET_CURRENT_ROUND', roundIndex + 1)
      commit('SET_CURRENT_RACE_HORSES', [...race.horses])
      commit('RESET_HORSE_POSITIONS')

      const racePromises = race.horses.map(horse => {
        return new Promise(resolve => {
          const speed = calculateRaceSpeed(horse, race.distance)
          const totalTime = race.distance / speed
          const steps = 100
          const stepTime = totalTime / steps
          let currentStep = 0

          const interval = setInterval(() => {
            currentStep++
            const progress = currentStep / steps
            commit('UPDATE_HORSE_POSITION', {
              horseId: horse.id,
              position: progress * 100
            })

            if (currentStep >= steps) {
              clearInterval(interval)
              resolve({
                horse,
                finishTime: totalTime
              })
            }
          }, stepTime * 10)
        })
      })

      const results = await Promise.all(racePromises)
      results.sort((a, b) => a.finishTime - b.finishTime)

      const raceResult = {
        round: roundIndex + 1,
        distance: race.distance,
        results: results.map((result, index) => ({
          position: index + 1,
          horse: result.horse,
          time: result.finishTime.toFixed(2)
        }))
      }

      commit('ADD_RACE_RESULT', raceResult)
    }
  },

  getters: {
    allHorses: state => state.horses,
    currentRaceSchedule: state => state.raceSchedule,
    currentRound: state => state.currentRound,
    isGameRacing: state => state.isRacing,
    raceResults: state => state.raceResults,
    currentRaceHorses: state => state.currentRaceHorses,
    hasSchedule: state => state.raceSchedule.length > 0
  }
})