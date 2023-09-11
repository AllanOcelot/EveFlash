<template>
  <v-footer class="footer">
    EveShips is created by Allan Antollare. EVE Online and the EVE logo are the registered trademarks of CCP.
  </v-footer>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    components: { },
    props: [],
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
.footer {
  border-top: 1px solid #f1f1f1;
  color: #f1f1f1;
  justify-content: center;
  font-size: 12px;
  font-weight: 100;
  max-height: 50px;
  background: rgba(0,0,0,0.3);
}

@media screen and (max-width: 800px){
  .footer {
    padding: 5px;
    font-size: 10px;
    text-align: center;
  }
}
</style>
