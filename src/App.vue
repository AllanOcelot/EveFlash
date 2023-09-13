<template>
  <v-app class="main-app blueprint-background">
    <TopNavigation />
      <router-view />
    <BottomNavigation />
  </v-app>
</template>

<script lang="ts" setup>
  import TopNavigation from '@/components/TopNavigation.vue'
  import BottomNavigation from '/src/components/BottomNavigation.vue'
</script>

<style lang="scss">
  .main-app.blueprint-background {
    background: #0a0a13;
    background-size: 20px 20px;
    background-image: linear-gradient(90deg,hsla(0,0%,100%,.05) 1px,transparent 0),linear-gradient(180deg,hsla(0,0%,100%,.05) 1px,transparent 0);
  }
</style>
