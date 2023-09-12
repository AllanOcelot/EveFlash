<template>
  <v-main class="main-content">
    <v-container class="introduction">
      <h2>404: SHIP NOT FOUND</h2>
      <p>Looks like you warped to the wrong system friend....</p>
      <v-btn class="blue" @click="router.push('/')">
        Warp Home
      </v-btn>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  const router = useRouter();
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
