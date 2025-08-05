import { ROUND_DISTANCES } from '../constants.js'
import { selectRandomHorses, calculateRaceSpeed } from '../utils.js'

const state = {
  raceSchedule: [],
  currentRound: 0,
  raceResults: [],
  currentRaceHorses: [],
  raceProgress: {}
}

const mutations = {
  SET_RACE_SCHEDULE(state, schedule) {
    state.raceSchedule = schedule
  },

  SET_CURRENT_ROUND(state, round) {
    state.currentRound = round
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

  RESET_RACE_DATA(state) {
    state.currentRound = 0
    state.raceResults = []
    state.currentRaceHorses = []
    state.raceProgress = {}
  }
}

const actions = {
  async generateRaceSchedule({ commit, rootState, dispatch }) {
    if (rootState.horses.horses.length === 0) {
      await dispatch('generateHorses')
    }
    
    const schedule = ROUND_DISTANCES.map((distance, index) => ({
      round: index + 1,
      distance,
      horses: selectRandomHorses(rootState.horses.horses, 10)
    }))
    
    commit('SET_RACE_SCHEDULE', schedule)
    commit('RESET_RACE_DATA')
  },

  async startRaces({ dispatch, state, commit }) {
    if (state.raceSchedule.length === 0) return

    commit('ui/SET_IS_RACING', true, { root: true })

    for (let i = 0; i < state.raceSchedule.length; i++) {
      await dispatch('runSingleRace', i)
      if (i < state.raceSchedule.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    commit('ui/SET_IS_RACING', false, { root: true })
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
}

const getters = {
  currentRaceSchedule: state => state.raceSchedule,
  currentRound: state => state.currentRound,
  raceResults: state => state.raceResults,
  currentRaceHorses: state => state.currentRaceHorses,
  hasSchedule: state => state.raceSchedule.length > 0
}

export default {
  namespaced: false,
  state,
  mutations,
  actions,
  getters
}