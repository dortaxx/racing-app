<template>
  <div class="game-controls">
    <div class="control-section">
      <div class="button-group">
        <button 
          @click="generateSchedule"
          :disabled="isGameRacing"
          class="btn btn-primary"
          data-test="generate-schedule"
        >
          Generate Race Schedule
        </button>
        
        <button 
          @click="startRaces"
          :disabled="!hasSchedule || isGameRacing"
          class="btn btn-success"
          data-test="start-races"
        >
          {{ isGameRacing ? 'Racing in Progress...' : 'Start Races' }}
        </button>
      </div>
      
      <div class="game-status" data-test="game-status" v-if="hasSchedule || !hasSchedule">
        <p><strong>Status:</strong> {{ gameStatus }}</p>
        <p v-if="currentRound > 0"><strong>Current Round:</strong> {{ currentRound }}/6</p>
      </div>
    </div>
    
    <div class="horses-preview" data-test="horses-list" v-if="allHorses.length > 0">
      <h4>Available Horses ({{ allHorses.length }})</h4>
      <div class="horses-grid">
        <div 
          v-for="horse in allHorses" 
          :key="horse.id"
          class="horse-card"
          data-test="horse-item"
        >
          <div 
            class="horse-color-indicator"
            :style="{ backgroundColor: horse.color }"
          ></div>
          <div class="horse-info">
            <span class="horse-name" data-test="horse-name">{{ horse.name }}</span>
            <span class="horse-condition" data-test="horse-condition">{{ horse.condition }}/100</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="schedule-preview" data-test="race-schedule" v-if="hasSchedule">
      <h4>Race Schedule</h4>
      <div class="schedule-rounds">
        <div 
          v-for="(round, index) in currentRaceSchedule" 
          :key="round.round"
          class="schedule-round"
          data-test="round-info"
          :class="{ 
            'completed': index < completedRounds,
            'current': index === currentRound - 1 && isGameRacing,
            'upcoming': index >= currentRound
          }"
        >
          <div class="round-info">
            <span class="round-number">Round {{ round.round }}</span>
            <span class="round-distance">{{ round.distance }}m</span>
          </div>
          <div class="round-horses">
            <span 
              v-for="horse in round.horses" 
              :key="horse.id"
              class="horse-dot"
              :style="{ backgroundColor: horse.color }"
              :title="horse.name"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'GameControls',
  setup() {
    const store = useStore()

    const allHorses = computed(() => store.getters.allHorses)
    const hasSchedule = computed(() => store.getters.hasSchedule)
    const isGameRacing = computed(() => store.getters.isGameRacing)
    const currentRound = computed(() => store.getters.currentRound)
    const currentRaceSchedule = computed(() => store.getters.currentRaceSchedule)
    const raceResults = computed(() => store.getters.raceResults)

    const completedRounds = computed(() => raceResults.value.length)

    const gameStatus = computed(() => {
      if (isGameRacing.value) {
        return `Racing Round ${currentRound.value}/6`
      }``
      if (completedRounds.value === 6) {
        return 'All races completed!'
      }
      if (hasSchedule.value) {
        return 'Schedule generated - Ready to race!'
      }
      return 'Generate schedule to begin'
    })

    const generateSchedule = async () => {
      await store.dispatch('generateRaceSchedule')
    }

    const startRaces = () => {
      store.dispatch('startRaces')
    }

    onMounted(() => {
      store.dispatch('generateHorses')
    })

    return {
      allHorses,
      hasSchedule,
      isGameRacing,
      currentRound,
      currentRaceSchedule,
      completedRounds,
      gameStatus,
      generateSchedule,
      startRaces
    }
  }
}
</script>

<style scoped>
.game-controls {
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.control-section h3 {
  margin-top: 0;
  color: #333;
  text-align: center;
}

.button-group {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.btn-success {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
}


.game-status {
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 20px;
}

.game-status p {
  margin: 5px 0;
  color: #333;
  font-weight: 600;
}

.horses-preview {
  margin-bottom: 20px;
}

.horses-preview h4 {
  margin-bottom: 15px;
  color: #333;
}

.horses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  max-height: 200px;
  overflow-y: auto;
}

.horse-card {
  display: flex;
  align-items: center;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.horse-color-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 10px;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.horse-info {
  display: flex;
  flex-direction: column;
}

.horse-name {
  font-size: 12px;
  font-weight: 600;
  color: #333;
}

.horse-condition {
  font-size: 10px;
  color: #666;
}

.schedule-preview h4 {
  margin-bottom: 15px;
  color: #333;
}

.schedule-rounds {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.schedule-round {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 6px;
  border: 2px solid #e9ecef;
  background: white;
}

.schedule-round.completed {
  background: #d4edda;
  border-color: #c3e6cb;
}

.schedule-round.current {
  background: #fff3cd;
  border-color: #ffeaa7;
  animation: pulse 2s infinite;
}

.schedule-round.upcoming {
  background: #f8f9fa;
  border-color: #e9ecef;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.round-info {
  display: flex;
  flex-direction: column;
}

.round-number {
  font-weight: 600;
  color: #333;
}

.round-distance {
  font-size: 12px;
  color: #666;
}

.round-horses {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.horse-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>