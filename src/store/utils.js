import { HORSE_NAMES, HORSE_COLORS } from './constants.js'

export function generateHorse(id) {
  return {
    id,
    name: HORSE_NAMES[id - 1],
    color: HORSE_COLORS[id - 1],
    condition: Math.floor(Math.random() * 100) + 1,
    position: 0,
    isRacing: false
  }
}

export function generateAllHorses() {
  return Array.from({ length: 20 }, (_, i) => generateHorse(i + 1))
}

export function selectRandomHorses(horses, count = 10) {
  const shuffled = [...horses].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export function calculateRaceSpeed(horse, distance) {
  const normalizedCondition = 0.7 + (horse.condition / 100) * 0.6
  const randomFactor = Math.random() * 0.4 + 0.8
  const distanceFactor = 1000 / distance
  const raceLuck = Math.random() * 0.3 + 0.85
  
  return normalizedCondition * randomFactor * distanceFactor * raceLuck * 2.5
}