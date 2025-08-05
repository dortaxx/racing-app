<script setup>
import GameControls from './components/GameControls.vue'
import RaceTrack from './components/RaceTrack.vue'
import RaceResults from './components/RaceResults.vue'
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1 class="game-title">🏇 Horse Racing 🏆</h1>
    </header>
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
  padding: 20px 20px 10px;
  color: white;
}

.game-title {
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #ffd700, #ffed4e, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: glow 2s ease-in-out infinite alternate;
  letter-spacing: 2px;
}

@keyframes glow {
  from { text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 215, 0, 0.4); }
  to { text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 215, 0, 0.8); }
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
