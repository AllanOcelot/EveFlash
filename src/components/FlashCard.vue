<template>
  <div class="flashcard" v-if="ship" :class="cardStatus">
    <div class="image" :style="{'background-image': 'url('  + cardData.image + ')'}"></div>

    <!-- Guess the name dude, how much easier can it be ? -->
    <div class="info easy" v-if="difficulty === 1">
      <v-btn v-for="(item, index) in options.Names" class="blue" :key="index" @click="checkEasy(item)">
        {{ item }}
      </v-btn>
    </div>

    <!-- Guess the name, and ship type (frig, destroyer etc )-->
    <div class="info medium" v-if="difficulty === 2">
      <p>Medium difficulty</p>
      {{ ship}}
      <div class="question">
        <div class="title">Name:</div>
        <div class="answer">
          <input type="text">
        </div>
      </div>
    </div>

    <!-- Guess ALL the info about this ship -->
    <div class="info hard" v-if="difficulty === 3">
      <p>Name: </p>
      <p>Size: </p>
      <p>Faction: </p>
      <p></p>
    </div>

    <transition name="bounce">
      <div class="overlay" :class="cardStatus" v-if="cardStatus !== null">
        <div class="content">
          <div v-if="cardStatus === 'correct'">
            <h3>Bingo</h3>
            <p>You know your ship!</p>
            <p class="desc">{{ship.Desc}}</p>
          </div>
          <div v-else>
            <h3>Wrong!</h3>
            <p>It was a {{ship.Name}}.</p>
          </div>
          <v-btn class="continue blue" @click="finished()">
            Continue
          </v-btn>
        </div>
        <v-progress-linear
          indeterminate
          color="white"
        >
        </v-progress-linear>
      </div>
    </transition>

  </div>
</template>

<script>
export default {
  data() {
    return {
      cardData: {
        image: null,
      },
      cardStatus: null
    }
  },
  props: ['ship', 'options', 'difficulty'],
  methods: {
    generateRandomImage(){
      const imageLength = this.ship.Images.length;
      return this.ship.Images[Math.floor(Math.random() * (imageLength - 0) + 0)];
    },

    initCard(){
      this.cardStatus = null;
      this.cardData.image = this.generateRandomImage();
    },


    // Simple, just check if they got the name right
    checkEasy(nameInput){
      if(nameInput === this.ship.Name){
        console.log('We got a winner')
        this.cardStatus = 'correct';
      }else{
        console.log('loser!');
        this.cardStatus = 'wrong';
      }
    },

    finished() {
      this.$emit('finished', this.cardStatus)
    }

  },
  mounted () {
    this.initCard();
  },
}
</script>

<style lang="scss" scoped>
  .flashcard {
    background: #fff;
    margin: auto;
    width: 1000px;
    margin-bottom: 0;
    min-height: 400px;
    display: flex;
    box-shadow: 0px 0px 50px rgb(0 0 0);
    border: 1px solid rgb(76 203 190 / 35%);
    position: relative;
    overflow: hidden;

    .image {
      display: flex;
      flex: 1 auto;
      width: 50%;
      background-size: cover;
      background-position: center center;
    }

    .info {
      padding: 20px;
      width: 50%;
      background: #0b1920;

      &.easy {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }

    .overlay {
      position: absolute;
      left: 0;
      height: 100%;
      width: 100%;
      opacity: 0;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #fff;
      transition: opacity 0.1s;

      h3 {
        font-size: 60px;
        cursor: default;
      }
      p {
        cursor: default;
        font-size: 20px;
        &.desc {
          font-size: 16px;
          margin-top: 50px;
        }
      }

      .content {
        display: flex;
        align-items: center;
        padding: 50px 25px;
        flex-direction: column;
        flex: 1 auto;
      }

      .v-progress-linear {
        margin-top: auto;
        margin-bottom: 0;
        height: 20px;
      }

      &.correct {
        opacity: 0.97;
        background: #06320c;
      }
      &.wrong {
        opacity: 0.97;
        background: #320606;
      }

      .v-btn {
        margin-top: auto;
        margin-bottom: 10px;
        opacity: 1;
        width: 300px;
      }
    }
  }











  .bounce-enter-active {
    animation: bounce-in .5s;
  }
  .bounce-leave-active {
    animation: bounce-out .1s;
  }

  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes bounce-out {
    0% {
      opacity: 0.85;
    }
    100% {
      opacity: 0;
      transition: all 0.3s;
    }
  }

</style>
