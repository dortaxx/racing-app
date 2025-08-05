<script setup>
import GameControls from './components/GameControls.vue'
import RaceTrack from './components/RaceTrack.vue'
import RaceResults from './components/RaceResults.vue'
</script>

<template>
  <div class="app">
    <main class="app-main">
      <div class="game-container">
        <GameControls />
        <RaceTrack />
        <RaceResults />
      </div>
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Arial', sans-serif;
}

.app-header {
  text-align: center;
  padding: 30px 20px;
  color: white;
}

.app-header h1 {
  margin: 0 0 10px 0;
  font-size: 2.5em;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.app-header p {
  margin: 0;
  font-size: 1.1em;
  opacity: 0.9;
}

.app-main {
  padding: 0 20px 40px 20px;
}

.game-container {
  max-width: 1200px;
  margin: 0 auto;
}

.app-footer {
  text-align: center;
  padding: 20px;
  color: white;
  opacity: 0.7;
  font-size: 0.9em;
}

.app-footer p {
  margin: 0;
}

@media (max-width: 768px) {
  .app-header h1 {
    font-size: 2em;
  }
  
  .app-header p {
    font-size: 1em;
  }
  
  .app-main {
    padding: 0 10px 20px 10px;
  }
}
</style>
