<template>
  <v-main class="main-content">
    <v-container class="introduction">
      <h2>Welcome To Eve Flash</h2>
      <p>The fun way to learn about Eve Online Ships!</p>
      <v-btn class="blue startNew" @click="router.push('game')">
        Start New Game
        <v-tooltip
          activator="parent"
          location="top"
          origin="centre"
          open-delay="220"
          attach="startNew"
        >
        Start a new game, using 'standard' settings.
      </v-tooltip>
      </v-btn>
      <v-btn class="blue gameSettings" @click="router.push('/setup')">
        Start Custom Game
        <v-tooltip
          activator="parent"
          location="bottom"
          origin="centre"
          open-delay="220"
          attach="gameSettings"
        >
        Tweak settings for personal taste
      </v-tooltip>
      </v-btn>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  const router = useRouter();

  import { useGameStateStore } from '@/stores/gameState'
  const store = useGameStateStore()

  onMounted(() => {
    // unsure if we should clear store on fresh mount? Could avoid issues re:mid game refresh etc etc
    store.reset();
  })
</script>

<style lang="scss" scoped>
  .options-container {
    display: flex;
    height: 100%;
    color: #fff;
  }

  .introduction {
    color: #fff;
    text-align: center;
    display: flex;
    flex: 1;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    h2 {
      margin-bottom: 30px;
    }
    p {
      margin-bottom: 20px;
    }
    .blue {
      max-width: 250px;
    }
  }
</style>
