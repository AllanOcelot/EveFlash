<template>
  <v-app-bar :elevation="0" class="main-header">
    <router-link class="text-left logo" to="/">
      EveFlash
    </router-link>
    <div class="text-right links">
      <v-btn
        class="more-info"
        @click="dialog = true"
      >
        More Information
      </v-btn>
    <a href="https://github.com/AllanOcelot/EveFlash" target="blank" title="Github">
      <v-icon>
        mdi-github
      </v-icon>
    </a>
    </div>
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

  // We need to over specify here
  .v-app-bar.v-toolbar.main-header {
    z-index: 998 !important;
    background: transparent;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .logo {
    font-size: 25px;
    font-weight: 700;
    color: #f5c745;
    text-shadow: 1px 1px 4px rgb(0 0 0 / 70%);
    margin: 0 auto 0 20px;
    text-decoration: none;
    opacity: 0.6;
    transition: all 0.3s;
    &:hover{
      opacity: 1;
    }
  }


  .links {
    margin: 0 20px 0 auto;

    a {
      color: #f1f1f1;
      opacity: 0.6;
      transition: all 0.3s;
      text-decoration: none;
      &:hover{
        color: #fff;
        opacity: 1;
      }
    }
  }



  .more-info {
    margin-right: 20px;
    font-size: 12px;
    padding: 0 10px;
    background: rgba(255,255,255,0.2);
  }


  @media screen and (max-width: 800px){
    .more-info {
      font-size: 10px;
    }
    .text-left {
      max-width: 128px;
    }
  }

</style>
