<template>
  <v-main class="main-content">
    <v-container class="options-container">
      <div class="options-configure">
        <div class="top">
          <h2>Configure Game Settings:</h2>
          <p class="config-details">
            I would like to play a
            <v-select
            :items="defineRounds"
            v-model="rounds"
            variant="underlined"
            />
            game of EveFlash, on the

            <v-select
              :items="defineDifficulty"
              v-model="difficulty"
              variant="underlined"
            ></v-select>
            difficulty setting.
        </P>

        <p>Using the following factions</p>
        <v-autocomplete
          chips
          label="Faction Selection"
          :items="factionsList"
          v-model="gameObject.factions"
          multiple
          class="factionSelection"
        >
          <template v-slot:chip="{ props, item }">
            <v-chip
              v-bind="props"
              :prepend-avatar="'/images/icons/factions/' + item.title + '.png'"
              :text="item.title"
            ></v-chip>
          </template>
        </v-autocomplete>

          <v-alert
            v-if="errorMessage"
            type="error"
            title="Warning:"
            :text="errorMessage"
          ></v-alert>

        </div>

        <div class="bottom">
          <v-btn class="blue" @click="router.push('/')">
            Prev
          </v-btn>
          <v-btn class="blue" @click="startGame()">
            Next
          </v-btn>
        </div>
      </div>
    </v-container>

  </v-main>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useGameStateStore } from '@/stores/gameState'
  import { storeToRefs } from 'pinia'

  const router = useRouter();

  const store = useGameStateStore()
  const { defineRounds, defineDifficulty, gameObject } = storeToRefs(store)

  let selectionStep = ref(0)
  let rounds = ref('quick')
  let difficulty = ref('easy')
  const factionsList = ref<string[]>(['misc','amarr', 'caldari', 'gallente', 'minmatar'])
  let errorMessage = ref<string>()

  interface Empire {
    Name: string,
    Image: string,
    Enabled: boolean,
    Color1: string,
    Color2: string,
    Selected: Boolean
  }

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



  function startGame(){
    console.log(defineDifficulty.value)
    if(!defineDifficulty.value.includes(difficulty.value)){
      errorMessage.value = 'Please select a difficulty from the provided list.'
      return
    }else{
      gameObject.value.difficulty = difficulty.value;
    }
    if(!defineRounds.value.includes(rounds.value)){
      errorMessage.value = 'Please select a rounds options from the provided list.'
      return
    }else{
      gameObject.value.rounds = rounds.value;
    }
    if(gameObject.value.factions.length < 1 || gameObject.value.factions.length > factionsList.value.length){
      errorMessage.value = 'You must select at least one faction.'
      return
    }
    router.push('/game')
  }


  onMounted(() => {
    // unsure if we should clear store on fresh mount? Could avoid issues re:mid game refresh etc etc
    store.reset();
  })
</script>

<style lang="scss" scoped>
  .options-container {
    display: flex;
    height: 100%;
    color: #fff;
  }

  .introduction {
    color: #fff;
    text-align: center;
    display: flex;
    flex: 1;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    h2 {
      margin-bottom: 30px;
    }
    p {
      margin-bottom: 20px;
    }
    .blue {
      max-width: 250px;
    }
  }

  .options-configure {
    width: 100%;
    max-width: 724px;
    display: flex;
    margin: 0 auto;
    flex-direction: column;
    justify-content: center;

    .top {
      text-align: center;
      padding: 50px 0 20px 0;
      font-size: 1rem;
      color: #fff;
      margin: auto auto 0 auto;
    }

    .config-details {
      display: flex;
      align-items: center;
      justify-content: center;
      .v-input {
        margin: 0 20px;
        display: inline-block;
        max-width: 100px;
      }
    }

    .factionSelection {
      max-width: 600px;
      margin: 5px auto auto auto;
    }


    .choice-selection {

    }

    .selectedFactions {
      border: 1px solid #fff;
      background: transparent;
      display: inline-block;
    }

    .empireBlock {
      margin: auto 5px;
      height: 80px;
      max-width: 160px;
      overflow: hidden;
      display: flex;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1 auto;
      text-align: center;
      border: 1px solid rgba(0,0,0,0.2);
      transition: all 0.6s;
      transition-delay: 0.01s;
      position: relative;
      border-radius: 60px;

      img {
        max-width: 60px;
      }

      .info {
        position: absolute;
        bottom: 0px;
        border-top: 1px solid rgb(255 255 255 / 44%);
        padding: 20px 0;
        width: 100%;
        text-align: center;
        color: #fff;
        font-weight: bold;
        background: rgba(0,0,0,0.5);
        &.unavailable {
          color: red;
          border-color: red;
        }
      }

      &:hover {
        opacity: 1;
      }
      &.unavailable {
        cursor: default;
      }
    }



    .middle {
      display: flex;
      flex: 1;
      .factions {
        display: flex;
        flex: 1 auto;
        width: 100%;
        align-items: center;
        .empires {
          display: flex;
          flex-direction: row;
          height: 70%;
          width: 100%;
          justify-content: center;
          &:hover {
            .block {
              opacity: 0.5;
            }
            .block:hover {
              opacity: 1;
            }
          }
        }
      }
    }
    .bottom {
      display: flex;
      flex-direction: row;
      margin: auto 0;
      .v-btn {
        margin: 0 auto;
        max-width: 200px;
        &:first-of-type {
          margin-left: 0;
          margin-right: auto;
        }
        &:last-of-type {
          margin-left: auto;
          margin-right: 0;
        }
      }
      .selection-choices {
        display: flex;
        justify-content: center;
        color: #fff;
      }
    }
  }
</style>
