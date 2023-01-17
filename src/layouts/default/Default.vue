<template>
  <v-app class="main-app">
    <TopNavigation />
    <v-main class="main-content">
      <Transition name="fade" mode="out-in">
      <flash-card
        v-if="loading === false"
        :loading="loading"
        :difficulty="difficulty"
        :ship="selectedShip"
        :options="answerData"
        @finished="roundOver"
      ></flash-card>
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
            You got {{ totalScore }} out of {{ cardsPlayed }} correct.
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
        shipData: [],
        selectedShip: null,
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
      generateRandomAnswers(){
        let Factions = [];
        let Types = [];
        let Names = [];

        for (var i = 0; i < this.shipData.length; i++){
          const ship = this.shipData[i];
          if(!Names.includes(ship.Name)){
            Names.push(ship.Name)
          }
          if(!Factions.includes(ship.Faction)){
            Factions.push(ship.Faction)
          }
          if(!Types.includes(ship.Type)){
            Types.push(ship.Type)
          }
        }

        console.log('We have ' + this.shipData.length + ' Individual ships.');
        console.log('We have ' + Names.length + " Ship names.");
        console.log('We have ' + Types.length + " Ship types.");
        console.log('We have ' + Factions.length + " Faction types.");


        // End of console logs, for now.
        // let loopLength = 3 * this.difficulty;
        const loopLength = 3;
        this.answerData.Names = [];
        this.answerData.Types = [];
        this.answerData.Factions = [];

        // Loop over the data to generate 'random' answers.
        while(this.answerData.Names.length < loopLength){
          const newName = Names[this.randomIntFromInterval(0,Names.length)];
          if(newName != null && newName != '' && !this.answerData.Names.includes(newName)){
            this.answerData.Names.push(newName);
          }
        }
        while(this.answerData.Types.length < loopLength){
          const newType = Types[this.randomIntFromInterval(0,Types.length)];
          if(newType != null && newType != '' && !this.answerData.Types.includes(newType)){
            this.answerData.Types.push(newType);
          }
        }
        while(this.answerData.Factions.length < loopLength){
          const newFaction = Factions[this.randomIntFromInterval(0,Factions.length)];
          if(newFaction != null && newFaction != '' && !this.answerData.Factions.includes(newFaction)){
            this.answerData.Factions.push(newFaction);
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
          this.totalScore++;
          if(this.totalScore % 10 == 0){
            jsConfetti.addConfetti({
              emojiSize: 100,
              confettiNumber: 400,
            })
          }
        }
        this.previousShip = this.currentShipID;
        this.initCard()
      },


      // Called to generate our card
      initCard(){
        this.loading = true;
        const shipID = this.randomIntFromInterval(0, this.shipData.length - 1);
        this.currentShipID = shipID;
        this.selectedShip = this.shipData[shipID];
        this.generateRandomAnswers();
        this.sanitiseAnswers();
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }
    },
    mounted(){
      axios.get('/data.json')
      .then(res => {
        this.shipData = res.data;
        this.initCard();
      }
      ).catch(err => console.log(err))
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
  }

  // Transitions
  .fade-enter-active,.fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter,.fade-leave-active {
    opacity: 0
  }
</style>
