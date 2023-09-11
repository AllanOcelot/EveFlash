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

        </div>
        <div class="choice-selection middle">
          <div class="choice-block factions">
            <div class="empires">
              <div class="block"
                  v-for="(empire, index) in EmpiresData" :key="index"
                  :style="`background-image: linear-gradient(360deg, ${empire.Color1}, ${empire.Color2});`"
                  :class="[(empire.Enabled ? '' : 'unavailable'), (empire.Selected ? '' : 'Selected')]"
                  @click="selectFaction(index)"
                  >
                <img :src="'/icons/' + empire.Image" :alt="empire.Name">
              </div>
            </div>
            <div class="minor">

            </div>
          </div>
        </div>
        <div class="bottom">
          <v-btn class="blue" @click="changeStepSelection(false)" v-if="selectionStep >= 1">
            Prev
          </v-btn>
          <v-btn class="blue" @click="changeStepSelection(true)">
            Next
          </v-btn>
          <div class="selection-choices">
            <p>I would like to play for {{rounds}} on {{difficulty}} difficulty.</p>
          </div>
        </div>
      </div>
    </v-container>

  </v-main>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  const router = useRouter();


  import { useGameStateStore } from '@/stores/gameState'
  const store = useGameStateStore()


  let selectionStep = ref(0);
  let rounds = ref(0);
  let difficulty = ref('Easy');

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
    display: flex;
    flex-direction: column;
    justify-content: center;

    .top {
      text-align: center;
      padding: 50px 0 20px 0;
      font-size: 1rem;
      color: #fff;
    }


    .choice-selection {

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
          .block {
            margin: auto 5px;
            height: 160px;
            border-radius: 0;
            overflow: hidden;
            border: 1px solid rgba(255,255,255, 0.05);
            display: flex;
            flex: 1;
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

            img {
              max-width: 100px;
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
      flex-direction: column;
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
