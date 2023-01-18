<template>
  <div class="gameEnd">
    <div>
      <h3>Cards Completed</h3>
      <p>You have successfully completed all of the ships we currently have data for.</p>

      <hr>

      <h4>You've got a score of {{score.toFixed(2)}}%</h4>

      <div v-if="score < 29">
        <p>
          maybe try hitting those skill books, harder, with your head... try again!
        </p>
      </div>
      <div v-if="score >= 30 && score < 59">
        <p>
          alright, you know the basics... nice, but you ain't impressing anyone just yet
        </p>
      </div>
      <div v-if="score >= 60 && score <= 80">
        <p>
          Damn, You <strong>really</strong> know your ship! Well done!
        </p>
      </div>
      <div v-if="score >= 80 && score <= 100">
        <p>
          That's impressive, CCP should hire you! Like, now!
        </p>
      </div>

      <div class="v-btn blue" @click="$emit('newGame')">
        New Game?
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  props: ['score'],
  methods: {},
  mounted () {},
}
</script>

<style lang="scss" scoped>
  .gameEnd {
    background: #fff;
    margin: auto;
    width: 1000px;
    margin-bottom: 0;
    min-height: 400px;
    display: flex;
    box-shadow: 0px 0px 50px rgb(0 0 0);
    border: 1px solid rgba(101, 224, 212, 0.35);
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    text-align: center;
    flex-direction: column;
    background: #0b1920;
    color: #fff;

    h3 {
      width: 100%;
      text-align: center;
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    hr {
      margin: 20px;
      opacity: 0.1;
    }

    h4 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .v-btn {
      margin-top: 50px;
      margin-bottom: 0;
    }
  }
</style>
