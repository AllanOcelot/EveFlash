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

  // Default, we will select all factions.
  // Update: to save requests, lets have the default by the 'main 4' factions of the game.
  const factionList: Array<string> = ['misc','amarr', 'caldari', 'gallente', 'minmatar'];


  // Game object tracks all data relating to the instance of the game.
  const gameObject = ref<gameObject>({
    factions: factionList,
    difficulty: 0,
    rounds: 0
  })



  // Functions
  function addFaction( faction : string ){
    if(!gameObject.value.factions.includes(faction)){
      gameObject.value.factions.push(faction)
      console.log('Added following faction ' + faction );
    }
  }
  function removeFaction( faction : string ){
    if(gameObject.value.factions.includes(faction)){
      gameObject.value.factions.splice(gameObject.value.factions.indexOf(faction), 1)
      console.log('Removed following faction ' + faction );
    }
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
    gameObject,
    addFaction,
    removeFaction,
   }
})
