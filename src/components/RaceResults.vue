<template>
  <div class="race-results" data-test="results-container" v-if="raceResults.length > 0">
    <h3>Race Results</h3>
    
    <div class="results-container">
      <div 
        v-for="result in raceResults" 
        :key="result.round"
        class="round-result"
      >
        <div class="round-header" data-test="round-header">
          <h4>Round {{ result.round }} - {{ result.distance }}m</h4>
        </div>
        
        <div class="results-table">
          <div class="table-header">
            <span class="position-col">Pos</span>
            <span class="horse-col">Horse</span>
            <span class="condition-col">Condition</span>
            <span class="time-col">Time (s)</span>
          </div>
          
          <div 
            v-for="horseResult in result.results" 
            :key="horseResult.horse.id"
            class="result-row"
            data-test="result-item"
            :class="{ 
              'winner first-place': horseResult.position === 1,
              'second second-place': horseResult.position === 2,
              'third third-place': horseResult.position === 3
            }"
          >
            <span class="position-col">
              <span class="position-badge" data-test="position">{{ horseResult.position }}</span>
            </span>
            <span class="horse-col">
              <span 
                class="horse-color" 
                data-test="horse-color"
                :style="{ backgroundColor: horseResult.horse.color }"
              ></span>
              <span data-test="horse-name">{{ horseResult.horse.name }}</span>
            </span>
            <span class="condition-col">{{ horseResult.horse.condition }}/100</span>
            <span class="time-col" data-test="finish-time">{{ horseResult.time }}s</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="no-results" data-test="no-results-message">
    <p>No race results yet</p>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'RaceResults',
  setup() {
    const store = useStore()
    
    const raceResults = computed(() => store.getters.raceResults)
    
    return {
      raceResults
    }
  }
}
</script>

<style scoped>
.race-results {
  margin: 20px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.race-results h3 {
  margin-top: 0;
  color: #333;
  text-align: center;
}

.results-container {
  max-height: 500px;
  overflow-y: auto;
}

.round-result {
  margin-bottom: 25px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.round-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 10px 15px;
  margin: 0;
}

.round-header h4 {
  margin: 0;
  font-size: 1.1em;
}

.results-table {
  padding: 0;
}

.table-header {
  display: flex;
  background: #e9ecef;
  font-weight: bold;
  padding: 10px;
  border-bottom: 2px solid #dee2e6;
  color: #333;
}

.result-row {
  display: flex;
  padding: 8px 10px;
  border-bottom: 1px solid #e9ecef;
  align-items: center;
  color: #333;
}

.result-row:last-child {
  border-bottom: none;
}

.result-row.winner {
  background: linear-gradient(90deg, #ffd700, #fff);
  color: #333;
  font-weight: 600;
}

.result-row.second {
  background: linear-gradient(90deg, #c0c0c0, #fff);
  color: #333;
  font-weight: 600;
}

.result-row.third {
  background: linear-gradient(90deg, #cd7f32, #fff);
  color: #333;
  font-weight: 600;
}

.position-col {
  width: 60px;
  text-align: center;
}

.position-badge {
  display: inline-block;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  line-height: 25px;
  font-size: 12px;
  font-weight: bold;
}

.winner .position-badge {
  background: #ffd700;
  color: #333;
}

.second .position-badge {
  background: #c0c0c0;
  color: #333;
}

.third .position-badge {
  background: #cd7f32;
  color: white;
}

.horse-col {
  flex: 1;
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #333;
}

.horse-color {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 8px;
  border: 1px solid #ccc;
}

.condition-col {
  width: 80px;
  text-align: center;
  font-size: 0.9em;
  color: #666;
}

.time-col {
  width: 80px;
  text-align: right;
  font-family: monospace;
  font-weight: bold;
  color: #333;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #333;
  font-style: italic;
  font-size: 1.1em;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  margin: 20px;
}
</style>