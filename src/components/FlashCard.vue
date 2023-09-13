<template>
  <div class="flashcard" v-if="ship && cardData.image" :class="cardStatus">
    <div class="image" :style="{'background-image': 'url('  + ship.Images[shipImageIndex] + ')'}">
      <div class="faction-icon" v-if="difficulty === 'easy'">
        <img :src="factionImage" alt="Faction">
      </div>
      <div class="tech-icon" v-if="ship.TechLevel !== '1' && difficulty != 'hard'">
        <img :src="techImage" alt="Tech level">
      </div>
      <div class="imageControl left"
        v-if="canSelectPrevImage"
        @click="shipImageIndex--">
        <v-icon>
          mdi-menu-left-outline
        </v-icon>
      </div>
      <div class="imageControl right"
        v-if="canSelectNextImage"
        @click="shipImageIndex++">
        <v-icon>
          mdi-menu-right-outline
        </v-icon>
      </div>
    </div>

    <!-- Guess the name dude, how much easier can it be ? -->
    <div class="info easy">
      <v-btn v-for="(item, index) in options.Names" class="blue" :key="index" @click="checkEasy(item)">
        {{ item }}
      </v-btn>
    </div>

    <!-- Guess the name, and ship type (frig, destroyer etc )-->
    <!--
    <div class="info medium" v-if="difficulty === 'medium'">
      <p>Medium difficulty</p>
      {{ ship}}
      <div class="question">
        <div class="title">Name:</div>
        <div class="answer">
          <input type="text">
        </div>
      </div>
    </div>


    <div class="info hard" v-if="difficulty === 'hard'">
      <p>Name: </p>
      <p>Size: </p>
      <p>Faction: </p>
      <p></p>
    </div>
  -->

    <transition name="bounce">
      <div class="overlay" :class="cardStatus" v-if="cardStatus !== ''">
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

<script lang="ts" setup>
  import { ref, onMounted, computed } from 'vue'

  // Import store.
  import { useGameStateStore } from '@/stores/gameState'
  import { storeToRefs } from 'pinia'
  const store = useGameStateStore()
  const { gameObject } = storeToRefs(store)

  let difficulty = ref<string>('');

  const shipImage = ref<string>();
  const shipImageIndex = ref<number>(0)

  let cardData = ref({
    image: null,
  })
  let cardStatus = ref<string>()


  const props = defineProps(['ship', 'options'])
  const emit = defineEmits(['finished'])


  function initCard(){
    cardStatus.value = ''
    cardData.value.image = props.ship.Images[shipImageIndex.value]
  }

  function checkEasy(nameInput:string){
    if(nameInput === props.ship.Name){
      console.log('We got a winner')
      cardStatus.value = 'correct';
    }else{
      console.log('loser!');
      cardStatus.value = 'wrong';
    }
  }

  function finished() {
    emit('finished', cardStatus.value)
  }

  // computed
  const factionImage = computed(() => {
    const imgURL = '/images/icons/factions/' + props.ship.Faction + '.png'
    return imgURL
  })
  const techImage = computed(() => {
    const imgURL = '/images/icons/tech/' + props.ship.TechLevel + '.png'
    return imgURL
  })

  const canSelectPrevImage = computed(() => {
    return props.ship.Images.length > 0 && shipImageIndex.value != 0
  })
  const canSelectNextImage = computed(() => {
    return props.ship.Images.length > 0 && shipImageIndex.value != props.ship.Images.length-1
  })





  onMounted(() => {
    difficulty.value = gameObject.value.difficulty;
    initCard()
  })
</script>

<style lang="scss" scoped>
  .flashcard {
    background: #fff;
    margin: auto;
    width: 90%;
    max-width: 1000px;
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
      position: relative;

      .faction-icon{
        position: absolute;
        top: 0;
        left: 0;
        padding: 10px;
        background: rgba(0,0,0,0.2);
        z-index: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          max-width: 60px;
        }
      }
      .tech-icon {
        left: 0;
        top: 0;
        background: transparent;
        z-index: 2;
        img {
          min-width: 40px;
        }
      }

      .imageControl {
        position: absolute;
        z-index: 1;
        color: #fff;
        top: calc(50% - 30px);
        height: 60px;
        width: 60px;
        font-size: 20px;
        background: rgba(0,0,0,0.4);
        line-height: 60px;
        text-align: center;
        cursor: pointer;
        pointer-events:stroke;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
         -khtml-user-select: none;
           -moz-user-select: none;
            -ms-user-select: none;
                user-select: none;

        &.left {
          border-radius: 0 16px 16px 0;
          left: 0;
        }
        &.right {
          border-radius: 16px 0 0 16px;
          right: 0;
        }
      }

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
      z-index: 10;

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

  @media screen and (max-width: 800px){
    .flashcard {
      flex-direction: column;

      .image {
        width: 100%;
        min-height: 200px;
      }

      .info {
        width: 100%;
        .v-btn {
          height: 34px;
          margin: 0 0 10px 0;
        }
      }
    }
  }




</style>
