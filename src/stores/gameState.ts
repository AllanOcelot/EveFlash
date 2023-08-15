import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'


// Define our interfaces
interface gameObject {
  factions: string[],
  difficulty: number,
  rounds: number
}



export const useGameStateStore = defineStore('gameState', () => {

  const gameObject = ref<gameObject>({
    factions: [],
    difficulty: 0,
    rounds: 0
  })

  const gameData = ref({})



  const selectedFactions = ref<string[]>([]);


  // Functions
  function addFaction( faction : string ){
    selectedFactions.value.push(faction)
    console.log('Added following faction ' + faction );
  }
  function removeFaction( faction : string ){
    const removeIndex = selectedFactions.value.indexOf(faction);
    selectedFactions.value.splice(removeIndex, 1)
    console.log('Store now contains the following factions ' + selectedFactions.value)
  }


  // Get data for each selected factions
  function getGameData () {
    for(let i  = 0; 0 < gameObject.value.factions.length; i++){
      axios.get('/' + gameObject.value.factions[i]  + '.json')
      .then(res => {
        res.data
      }
      ).catch(err => console.log(err))
    }
  }




  return {
    addFaction,
    removeFaction,
   }
})
