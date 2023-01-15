<template>
  <v-app-bar :elevation="0" class="main-header">
    <v-container>
      <v-row align="center">
        <v-col class="text-left">
          <span class="logo">
            EveFlash
          </span>
        </v-col>
        <v-col class="text-right">
          <a href="/" title="Github">
            <v-icon>
            mdi-github
          </v-icon>
          </a>
          <v-btn
            @click="dialog = true"
            elevation="2"
          >
          About {{ dialog }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>



  <!-- Simple about us modal -->
  <InfoModal :visible="dialog" @close-modal="closeModal" />
</template>

<script>
  import InfoModal from '/src/components/InfoModal.vue'

  export default {
    data() {
      return {
        dialog: false
      }
    },
    components: { InfoModal },
    props: [],
    methods: {
      closeModal(){
        this.dialog = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .logo {
    font-size: 25px;
    font-weight: 700;
    color: #f5c745;
    text-shadow: 1px 1px 4px rgb(0 0 0 / 70%);
  }


  .v-app-bar.v-toolbar.main-header {
    background: #4f717a59;
    color: #fff;
    border-bottom: 1px solid #f1f1f173;
  }
</style>
