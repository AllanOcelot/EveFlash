<template>
  <v-main class="main-content">
    <v-container v-if="selectionStep === 0" class="introduction">
      <h2>Welcome To Eve Flash</h2>
      <p>The fun way to learn about Eve Online Ships!</p>
      <v-btn class="blue" @click="router.push('game')">
        Start New Game
      </v-btn>
      <v-btn class="blue" @click="selectionStep = 1">
        Start Custom Game
      </v-btn>
    </v-container>

    <v-container class="options-container" v-else>
      <div class="options-configure">
        <div class="top">
          <h2>Configure Game Settings:</h2>
          <p class="config-details">
            I would like to play a
            <v-select
            :items="['quick', 'standard', 'full']"
            v-model="rounds"
            variant="underlined"
            />
            game of EveFlash, on the

            <v-select
              :items="['easy', 'medium', 'hard']"
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
            :prepend-avatar="'/icons/' + item.title + '.png'"
            :text="item.title"
          ></v-chip>
        </template>

        </v-autocomplete>
        </div>
        <div class="bottom">
          <v-btn class="blue" @click="changeStepSelection(false)" v-if="selectionStep >= 1">
            Prev
          </v-btn>
          <v-btn class="blue" @click="changeStepSelection(true)">
            Next
          </v-btn>
        </div>
      </div>
    </v-container>

  </v-main>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useRouter } from 'vue-router'
  const router = useRouter();


  import { useGameStateStore } from '@/stores/gameState'
  import { storeToRefs } from 'pinia'
  const store = useGameStateStore()
  const { gameObject } = storeToRefs(store)


  let selectionStep = ref(0);
  let rounds = ref('quick');
  let difficulty = ref('easy');
  const factionsList = ref<string[]>(['misc','amarr', 'caldari', 'gallente', 'minmatar'])


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




  const EmpiresData = ref<Array<Empire>>([
    {
      Name: "amarr",
      Image: "empire_1.png",
      Enabled: true,
      Color1: '#5c3e11',
      Color2: '#f9f5ba',
      Selected: true,
    },
    {
      Name: "caldari",
      Image: "empire_2.png",
      Enabled: true,
      Color1: '#0d0e12',
      Color2: '#adb4bb',
      Selected: true,
    },
    {
      Name: "gallente",
      Image: "empire_3.png",
      Enabled: true,
      Color1: '#191c1a',
      Color2: '#bfdddd',
      Selected: true,
    },
    {
      Name: "minmatar",
      Image: "empire_4.png",
      Enabled: true,
      Color1: '#2e1716',
      Color2: '#a13131',
      Selected: true,
    },
  ])

  // toggle a faction to 'selected factions' array.
  function selectFaction(index : number){
    if(EmpiresData.value[index].Selected === true ){
      EmpiresData.value[index].Selected = false
      store.removeFaction(EmpiresData.value[index].Name)
    } else {
      EmpiresData.value[index].Selected = true
      store.addFaction(EmpiresData.value[index].Name)
    }
  }

  function changeStepSelection(direction : boolean){
    if(direction === true){
      selectionStep.value++
    }else{
      selectionStep.value--
    }
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
