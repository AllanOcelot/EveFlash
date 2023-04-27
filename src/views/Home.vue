<template>
  <v-main class="main-content">
    <v-container class="options-container">
      <div class="options-configure">
        <div class="top">
          <h2>EVEFLASH : Learn The Ships Of Eve Online</h2>
          <p>Select factions and configure options below to begin training.</p>
        </div>
        <div class="middle">
          <div class="factions">
            <div class="empires">
              <div class="block"
                  v-for="empire in EmpiresData" :key="empire.Name"
                  :style="`background-image: linear-gradient(360deg, ${empire.Color1}, ${empire.Color2});`"
                  :class="empire.Enabled ? '' : 'unavailable'"
                  >
                <img :src="'/icons/' + empire.Image" :alt="empire.Name">
                <p class="info" :class="empire.Enabled ? '' : 'unavailable'">
                  <span v-if="empire.Enabled" @click="store.addFaction(empire.Name)">
                    Select {{ empire.Name }}
                  </span>
                  <span v-else>
                    Not Currently Available
                  </span>
                </p>
              </div>
            </div>
            <div class="minor">

            </div>
          </div>
        </div>
        <div class="bottom">
          <p>I would like to play for {{rounds}} on {{difficulty}} difficulty.</p>
        </div>
      </div>
    </v-container>

  </v-main>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  import { useGameStateStore } from '@/stores/gameState'
  const store = useGameStateStore()


  let rounds = ref(0);
  let difficulty = ref('Easy');

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

  const EmpiresData = [
    {
      Name: "Amarr Empire",
      Image: "empire_1.png",
      Enabled: false,
      Color1: '#5c3e11',
      Color2: '#f9f5ba'
    },
    {
      Name: "Caldari State",
      Image: "empire_2.png",
      Enabled: false,
      Color1: '#0d0e12',
      Color2: '#adb4bb'
    },
    {
      Name: "Gallente Federation",
      Image: "empire_3.png",
      Enabled: false,
      Color1: '#191c1a',
      Color2: '#bfdddd'
    },
    {
      Name: "Minmatar Empire",
      Image: "empire_4.png",
      Enabled: true,
      Color1: '#2e1716',
      Color2: '#a13131'
    },
  ]

  onMounted(() => {
    console.log("Hello friend");
  })
</script>

<style lang="scss" scoped>
  .options-container {
    display: flex;
    height: 100%;
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

    .middle {
      .factions {
        width: 100%;
        .empires {
          display: flex;
          flex-direction: row;
          .block {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1 auto;
            text-align: center;
            height: 450px;
            border: 1px solid rgba(0,0,0,0.2);
            transition: all 0.6s;
            transition-delay: 0.01s;
            position: relative;

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
  }
</style>
