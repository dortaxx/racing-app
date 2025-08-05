<template>
  <div class="race-track" v-if="currentRaceHorses.length > 0">
    <div class="track-header">
      <h3 data-test="race-info">Round {{ currentRound }} - {{ currentDistance }}m</h3>
      <div v-if="isRacing" data-test="racing-indicator" class="racing-status">Race in Progress</div>
    </div>
    
    <div class="track-container" :class="{ racing: isRacing }">
      <div class="start-line">START</div>
      <div class="finish-line" data-test="finish-line">FINISH</div>
      
      <div class="lanes">
        <div 
          v-for="horse in currentRaceHorses" 
          :key="horse.id"
          class="lane"
          data-test="race-horse"
        >
          <div class="lane-info">
            <span class="horse-name" data-test="horse-name">{{ horse.name }}</span>
            <span class="horse-condition">{{ horse.condition }}/100</span>
          </div>
          
          <div class="track-lane">
            <div 
              class="horse"
              data-test="horse-icon"
              :style="{ 
                backgroundColor: horse.color,
                left: horse.position + '%',
                color: horse.color
              }"
            >
              🏇
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else data-test="no-race-message" class="no-race">
    <p>No race in progress</p>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'RaceTrack',
  setup() {
    const store = useStore()

    const currentRaceHorses = computed(() => store.getters.currentRaceHorses)
    const currentRound = computed(() => store.getters.currentRound)
    const isRacing = computed(() => store.getters['ui/isGameRacing'])
    
    const currentDistance = computed(() => {
      const schedule = store.getters.currentRaceSchedule
      const round = store.getters.currentRound
      return schedule[round - 1]?.distance || 0
    })

    return {
      currentRaceHorses,
      currentRound,
      currentDistance,
      isRacing
    }
  }
}
</script>

<style scoped>
.race-track {
  margin: 20px 0;
  padding: 20px;
  border: 2px solid #333;
  border-radius: 10px;
  background: linear-gradient(180deg, #87CEEB 0%, #98FB98 100%);
}

.no-race {
  margin: 20px 0;
  padding: 40px;
  text-align: center;
  background: #f8f9fa;
  border-radius: 10px;
  color: #666;
}

.racing-status {
  background: #ff6b6b;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
  margin-top: 10px;
  display: inline-block;
}

.track-container.racing {
  animation: race-pulse 2s infinite;
}

@keyframes race-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.95; }
}

.track-header {
  text-align: center;
  margin-bottom: 20px;
}

.track-header h3 {
  margin: 0;
  font-size: 1.5em;
  color: #333;
}

.track-container {
  position: relative;
  background: #90EE90;
  border-radius: 8px;
  padding: 20px;
  min-height: 400px;
}

.start-line, .finish-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  color: white;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  z-index: 10;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.start-line {
  left: 40px;
  background: #4CAF50;
}

.finish-line {
  right: 20px;
  background: #f44336;
}

.lanes {
  margin-left: 50px;
  margin-right: 30px;
}

.lane {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  height: 35px;
}

.lane-info {
  width: 120px;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  margin-right: 15px;
}

.horse-name {
  font-weight: bold;
  color: #333;
}

.horse-condition {
  color: #666;
  font-size: 10px;
}

.track-lane {
  flex: 1;
  height: 30px;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  position: relative;
  overflow: hidden;
}

.horse {
  position: absolute;
  top: 50%;
  transform: translateY(-50%) scaleX(-1);
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: left 0.15s ease-out;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  will-change: left;
}
</style>