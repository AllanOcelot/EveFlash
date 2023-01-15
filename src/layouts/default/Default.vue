<template>
  <v-app class="theme-dark">
    <v-main class="main-content">
      <default-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
  import DefaultView from '/src/layouts/default/View.vue'

  export default {
    data() {
      return {

      }
    }
    ,
    components: { DefaultView }
  }


</script>
