<template>
  <v-main class="main-content">
      <flash-card
        v-if="loading === false  && gameOver === false"
        :loading="loading"
        :difficulty="difficulty"
        :ship="selectedShip"
        :options="answerData"
        @finished="roundOver"
      ></flash-card>
      <EndGame
        v-if="gameOver === true"
        :score="(100 * totalScore) / cardsPlayed"
        @newGame="initGame"
      />
      <div v-if="loading === true" class="pre-loader">
          <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>

      <div class="score" v-if="loading === false">
        <p>
          You have completed {{ totalScore }} out of {{ cardsPlayed }} <span> {{ shipData.length }} remaining. </span>
        </p>
      </div>
  </v-main>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import JSConfetti from 'js-confetti'
  import FlashCard from '/src/components/FlashCard.vue'
  import EndGame from '/src/components/EndGame.vue'

  const jsConfetti = new JSConfetti()

  interface Ship  {
      Name: string,
      Desc: string,
      Faction: string,
      Type: string,
      Tank: string,
      Turret: string,
      TechLevel: string,
      Images: string[]
  }
  interface localDataIT {
    Names: string[],
    Factions: string[],
    Types: string[]
  }
  interface answerDataIT {
    Names: string[],
    Factions: string[],
    Types: string[]
  }

  let currentShipID = 0

  // Difficulty, 1 = easy, 2 = med, 3 = hard
  let difficulty =  1
  let loading =  ref(true)
  let cardsPlayed = ref(0)
  let totalScore = ref(0)
  let gameOver = ref(false)
  let streak = ref(0)


  let shipData : Ship[] = []
  let selectedShip : Ship;
  let localData : localDataIT ={
    Names: [],
    Factions: [],
    Types:[]
  }
  let answerData : answerDataIT = {
    Names : [],
    Factions: [],
    Types: [],
  }



  // Start functions
  function randomIntFromInterval(min : number, max : number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  function generateLocalData(){
    for (var i = 0; i < shipData.length; i++){
      const ship : Ship = shipData[i];
      if(!localData.Names.includes(ship.Name)){
        localData.Names.push(ship.Name)
      }
      if(!localData.Factions.includes(ship.Faction)){
        localData.Factions.push(ship.Faction)
      }
      if(!localData.Types.includes(ship.Type)){
        localData.Types.push(ship.Type)
      }
    }
  }

  function generateRandomAnswers(){
    const loopLength = 4;
    answerData.Names = [];
    answerData.Types = [];
    answerData.Factions = [];

    // Loop over the data to generate 'random' answers.
    while(answerData.Names.length < loopLength){
      const newName = localData.Names[randomIntFromInterval(0,localData.Names.length)];
      if(newName != null && newName != '' && !answerData.Names.includes(newName)){
        answerData.Names.push(newName);
      }
    }
    while(answerData.Factions.length < loopLength){
      const newFaction = localData.Factions[randomIntFromInterval(0,localData.Factions.length)];
      if(newFaction != null && newFaction != '' && !answerData.Factions.includes(newFaction)){
        answerData.Factions.push(newFaction);
      }
    }
    while(answerData.Types.length < loopLength){
      const newType = localData.Types[randomIntFromInterval(0,localData.Types.length)];
      if(newType != null && newType != '' && !answerData.Types.includes(newType)){
        answerData.Types.push(newType);
      }
    }
  }

  function sanitiseAnswers(){
    const ship = selectedShip;
    if(!answerData.Names.includes(ship.Name)){
      answerData.Names.splice(randomIntFromInterval(0,answerData.Names.length - 1), 1);
      answerData.Names.splice(randomIntFromInterval(0,answerData.Names.length - 1), 0, ship.Name);
    }
  }


  // Called to generate our card
  function initGame(){
    loading.value = true
    // Reset local vars
    currentShipID = 0
    difficulty =  1
    cardsPlayed.value = 0
    totalScore.value = 0
    streak.value = 0
    gameOver.value = false

    localData.Names = []
    localData.Factions = []
    localData.Types = []

    axios.get('/data.json')
    .then(res => {
      shipData = res.data
      initCard()
      loading.value = false
    }
    ).catch(err => console.log(err))
  }

    function initCard(){
      loading.value = true
      const shipID = randomIntFromInterval(0,shipData.length - 1)
      currentShipID = shipID
      selectedShip = shipData[shipID]
      if(localData.Names.length === 0){
        generateLocalData()
      }
      generateRandomAnswers()
      sanitiseAnswers()
      setTimeout(() => {
        loading.value = false
      }, 700)
    }

    function roundOver(result : string){
      cardsPlayed.value++;
      if(result  === 'correct'){
        totalScore.value++
        streak.value++
        if(streak.value % 10 == 0){
          jsConfetti.addConfetti({
            emojiSize: 100,
            confettiNumber: 400,
          })
        }
      } else {
        streak.value = 0
      }

      // Remove the previous ship from the list of shipData.
      shipData.splice(currentShipID, 1)

      if(shipData.length !== 0){
        initCard()
      }else{
        gameOver.value = true
      }
    }


    onMounted(() => {
      initGame()
    })
</script>

<style lang="scss" scoped>
  .main-content {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .pre-loader {
    text-align: center;
    margin: auto;
    height: 400px;
    width: 1000px;
    display: flex;
    justify-content: center;
    align-items: center;
    .v-progress-circular {
      width: 100px !important;
      height: 100px !important;
      color: #57aadb !important;
    }
  }

  .score {
    margin: auto;
    width: 90%;
    max-width: 1000px;
    margin-top: 0;
    padding: 12px 30px;
    background: rgba(0,0,0,0.25);
    color: #f1f1f1;
    border-radius: 0 0 20px 20px;
    font-size: 14px;
    text-align: center;
    span {
      font-weight: 600;
      margin-left: 10px;
      padding-left: 10px;
      border-left: 1px solid rgba(255,255,255,0.5);
    }
  }

  // Transitions
  .fade-enter-active,.fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter,.fade-leave-active {
    opacity: 0
  }

  @media screen and (max-width: 800px){
    .score {
      font-size: 12px;
    }
  }
</style>
