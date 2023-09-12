<template>
  <Suspense>
    <v-main class="main-content">
      <flash-card
        v-if="loading === false  && gameOver === false"
        :loading="loading"
        :ship="selectedShip"
        :options="answerData"
        @finished="roundOver"
      ></flash-card>
      <EndGame
        v-if="gameOver === true"
        :score="(100 * correct) / cardsPlayed"
        @newGame="router.push('/')"
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
          You have completed {{ cardsPlayed }} out of {{ shipData.length }}
          <span class="correct">{{ correct }} Correct </span>
          <span class="incorrect">{{ incorrect }} Incorrect </span>
        </p>
      </div>
    </v-main>

    <!-- loading state via #fallback slot -->
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useGameStateStore } from '@/stores/gameState'
  import { storeToRefs } from 'pinia'
  import axios from 'axios'
  import JSConfetti from 'js-confetti'
  import FlashCard from '/src/components/FlashCard.vue'
  import EndGame from '/src/components/EndGame.vue'



  const router = useRouter();
  const store = useGameStateStore()
  const { gameObject } = storeToRefs(store)

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
  let difficulty =  ref('easy')
  let loading =  ref(true)
  let cardsPlayed = ref(0)
  let gameOver = ref(false)
  let correct = ref(0)
  let incorrect = ref(0)
  let streak = ref(0)


  let shipData = ref<Ship[]>([])
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
    for (var i = 0; i < shipData.value.length; i++){
      const ship : Ship = shipData.value[i];
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
    console.log("Game Component has finished generating local data set")
  }

  function generateRandomAnswers(){
    const loopLength = 4;

    // TODO: refactor this as currently the 'easy' setting only uses names,the rest is overhead?
    answerData.Names = [];
    answerData.Types = [];
    answerData.Factions = gameObject.value.factions;

    // Loop over the data to generate 'random' answers.
    while(answerData.Names.length < loopLength){
      const newName = localData.Names[randomIntFromInterval(0,localData.Names.length)];
      if(newName != null && newName != '' && !answerData.Names.includes(newName)){
        answerData.Names.push(newName);
      }
    }

    // TODO: see if the below is needed, removed for now as we only ask user to guess name
    /*
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
    */
  }

  // Ensures that the ship name appears in the answer. As the answers are random.
  function sanitiseAnswers(){
    const ship = selectedShip;
    if(!answerData.Names.includes(ship.Name)){
      const indexToAlter = randomIntFromInterval(0,answerData.Names.length - 1);
      answerData.Names.splice(indexToAlter, 1, ship.Name);
    }
  }


  // Called to generate our card
  async function initGame(){
    loading.value = true
    // Reset local vars
    currentShipID = 0
    cardsPlayed.value = 0
    streak.value = 0
    shipData.value = []
    gameOver.value = false

    localData.Names = []
    localData.Factions = []
    localData.Types = []


    await fetchShipData().then( () => {
      initCard()
      loading.value = false
    });
  }


  async function fetchShipData(){
      // loop over each faction and get its corrosponding data set,
      for(let i = 0; i< gameObject.value.factions.length; i++){
        console.log('Attempting to load data for ' + gameObject.value.factions[i])
        await axios.get('/shipData/'+ gameObject.value.factions[i] +'.json').then((res : any ) => {
          console.log('We have loaded the data for ' + gameObject.value.factions[i])
          // use spread operator to con cat our two array values into one.
          shipData.value = [...shipData.value, ...res.data]
        }).catch((err:any) => console.log(err))
      }
    shuffleArray(shipData.value)
    setupGameOptions()
  }

  function initCard(){
    loading.value = true
    const shipID = randomIntFromInterval(0,shipData.value.length - 1)
    currentShipID = shipID
    selectedShip = shipData.value[shipID]
    if(localData.Names.length === 0){
      generateLocalData()
    }
    generateRandomAnswers()
    sanitiseAnswers()

    // Reminder: this is purely cosmetic for our users, so it feels like the app is doing more heavy lifting.
    setTimeout(() => {
      loading.value = false
    }, 700)
  }

  function roundOver(result : string){
    cardsPlayed.value++;
    if(result  === 'correct'){
      correct.value++
      streak.value++
      if(streak.value % 10 == 0){
        jsConfetti.addConfetti({
          emojiSize: 100,
          confettiNumber: 400,
        })
      }
    } else {
      incorrect.value++
      streak.value = 0
    }

    // Remove the previous ship from the list of shipData.
    shipData.value.splice(currentShipID, 1)

    if(shipData.value.length !== 0){
      initCard()
    }else{
      gameOver.value = true
    }
  }

  //"Fisher-Yates" Sorting
  function shuffleArray(array: Ship[]){
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }


  function setupGameOptions(){
    // 'full' use all the ship data, no need to splice.
    // Standard rounds : 30 cards.
    if(gameObject.value.rounds === 'standard'){
      shipData.value.length = 30
    }
    // Quick rounds are 20 rounds.
    if(gameObject.value.rounds === 'quick'){
      shipData.value.length = 20
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

    .correct {
      color: green;
    }
    .incorrect {
      color: red;
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
