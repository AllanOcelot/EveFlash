<template>
  <v-app class="main-app">
    <TopNavigation />
    <v-main class="main-content">
      <Transition name="fade" mode="out-in">
        <flash-card
          v-if="loading === false  && gameOver === false"
          :loading="loading"
          :difficulty="difficulty"
          :ship="selectedShip"
          :options="answerData"
          @finished="roundOver"
        ></flash-card>
      </transition>
      <Transition name="fade" mode="out-in">
        <EndGame
          v-if="gameOver === true"
          :score="(100 * totalScore) / cardsPlayed"
          @newGame="initGame"
        />
      </transition>
      <div v-if="loading === true" class="pre-loader">
          <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>
      <Transition name="fade" mode="out-in">
        <div class="score" v-if="loading === false">
          <p>
            You have completed {{ totalScore }} out of {{ cardsPlayed }} <span> {{ shipData.length }} remaining. </span>
          </p>
        </div>
      </transition>
    </v-main>
    <BottomNavigation />
  </v-app>
</template>

<script>
  import axios from 'axios'
  import JSConfetti from 'js-confetti'
  const jsConfetti = new JSConfetti()

  import TopNavigation from '/src/components/TopNavigation.vue'
  import BottomNavigation from '/src/components/BottomNavigation.vue'
  import FlashCard from '/src/components/FlashCard.vue'
  import EndGame from '/src/components/EndGame.vue'

  export default {
    data() {
      return {
        previousShip: 0,
        currentShipID: 0,
        // Difficulty, 1 = easy, 2 = med, 3 = hard
        difficulty: 1,
        loading: true,
        cardsPlayed: 0,
        totalScore: 0,
        gameOver: false,
        shipData: [],
        selectedShip: null,
        localData: {
          Names: [],
          Factions: [],
          Types:[]
        },
        answerData: {
          Names : [],
          Factions: [],
          Types: [],
        }
      }
    },
    components: {
      TopNavigation,
      FlashCard,
      EndGame,
      BottomNavigation
    },
    methods: {
      randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
      },
      selectRandomShip(){
        const dataLength = this.shipData.length;
        const shipID = Math.floor(Math.random() * (dataLength - 0) + 0);
        this.currentShipID = shipID;
        // dont show the same ship twice, people hate that
        if(this.previousShip === shipID){
          if(shipID === dataLength){
            this.shipID = shipID - 1;
          }else{
            this.shipID = shipID + 1;
          }
        }
        return shipID;
      },

      shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
      },

      generateLocalData(){
        for (var i = 0; i < this.shipData.length; i++){
          const ship = this.shipData[i];
          if(!this.localData.Names.includes(ship.Name)){
            this.localData.Names.push(ship.Name)
          }
          if(!this.localData.Factions.includes(ship.Faction)){
            this.localData.Factions.push(ship.Faction)
          }
          if(!this.localData.Types.includes(ship.Type)){
            this.localData.Types.push(ship.Type)
          }
        }
        console.log('We have ' + this.shipData.length + ' Individual ships.');
        console.log('We have ' + this.localData.Names.length + " Ship names.");
        console.log('We have ' + this.localData.Factions.length + " Ship types.");
        console.log('We have ' + this.localData.Types.length + " Faction types.");
      },

      generateRandomAnswers(){
        const loopLength = 3;
        this.answerData.Names = [];
        this.answerData.Types = [];
        this.answerData.Factions = [];

        // Loop over the data to generate 'random' answers.
        while(this.answerData.Names.length < loopLength){
          const newName = this.localData.Names[this.randomIntFromInterval(0,this.localData.Names.length)];
          if(newName != null && newName != '' && !this.answerData.Names.includes(newName)){
            this.answerData.Names.push(newName);
          }
        }
        while(this.answerData.Factions.length < loopLength){
          const newFaction = this.localData.Factions[this.randomIntFromInterval(0,this.localData.Factions.length)];
          if(newFaction != null && newFaction != '' && !this.answerData.Factions.includes(newFaction)){
            this.answerData.Factions.push(newFaction);
          }
        }
        while(this.answerData.Types.length < loopLength){
          const newType = this.localData.Types[this.randomIntFromInterval(0,this.localData.Types.length)];
          if(newType != null && newType != '' && !this.answerData.Types.includes(newType)){
            this.answerData.Types.push(newType);
          }
        }
      },

      sanitiseAnswers(){
        // Sanitise this data and ensure the 'correct' data exists in each category
        const ship = this.selectedShip;
        if(!this.answerData.Names.includes(ship.Name)){
          this.answerData.Names.splice(this.randomIntFromInterval(0, this.answerData.Names.length - 1), 1);
          this.answerData.Names.splice(this.randomIntFromInterval(0,this.answerData.Names.length - 1), 0, ship.Name);
        }
      },

      roundOver(result){
        this.cardsPlayed++;
        if(result  === 'correct'){
          this.totalScore++
          this.streak++
          if(this.streak % 10 == 0){
            jsConfetti.addConfetti({
              emojiSize: 100,
              confettiNumber: 400,
            })
          }
        } else {
          this.streak = 0
        }

        // Remove the previous ship from the list of shipData.
        this.shipData.splice(this.currentShipID, 1)
        this.previousShip = this.currentShipID

        if(this.shipData.length !== 0){
          this.initCard()
        }else{
          this.gameOver = true
        }
      },


      // Called to generate our card
      initGame(){
        this.loading = true

        // Reset local vars
        this.previousShip =  0
        this.currentShipID = 0
        this.difficulty =  1
        this.cardsPlayed = 0
        this.totalScore = 0
        this.streak = 0
        this.gameOver = false
        this.localData.Names = []
        this.localData.Factions = []
        this.localData.Types = []

        axios.get('/data.json')
        .then(res => {
          this.shipData = res.data
          this.initCard()
          this.loading = false
        }
        ).catch(err => console.log(err))
      },

      initCard(){
        this.loading = true
        const shipID = this.randomIntFromInterval(0, this.shipData.length - 1)
        this.currentShipID = shipID
        this.selectedShip = this.shipData[shipID]
        if(this.localData.Names.length === 0){
         this.generateLocalData()
        }
        this.generateRandomAnswers()
        this.sanitiseAnswers()
        setTimeout(() => {
          this.loading = false
        }, 700)
      }
    },
    mounted(){
      this.initGame()
    }
  }
</script>

<style lang="scss" scoped>
  .main-app {
    background: #0a0a13;
    background-size: 20px 20px;
    background-image: linear-gradient(90deg,hsla(0,0%,100%,.05) 1px,transparent 0),linear-gradient(180deg,hsla(0,0%,100%,.05) 1px,transparent 0);
  }

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
    width: 1000px;
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
</style>
