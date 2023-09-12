import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'





// Define our interfaces
interface gameObject {
  factions: string[],
  difficulty: string,
  rounds: string
}

const defineDifficulty  = <string[]>['easy', 'medium','hard'];
const defineRounds  = <string[]>['quick', 'standard','full'];





export const useGameStateStore = defineStore('gameState', () => {

  // Default, we will select all factions.
  // Update: to save requests, lets have the default by the 'main 4' factions of the game.
  const factionList: Array<string> = ['misc','amarr', 'caldari', 'gallente', 'minmatar'];


  // Game object tracks all data relating to the instance of the game.
  const gameObject = ref<gameObject>({
    factions: factionList,
    difficulty: 'easy',
    rounds: 'standard'
  })


  function setDifficulty( difficulty : string ){
    if(defineDifficulty.includes(difficulty)){
      gameObject.value.difficulty = difficulty;
    }
  }

  function setRounds( rounds : string ){
    if(defineRounds.includes(rounds)){
      gameObject.value.difficulty = rounds;
    }
  }


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

  // Reset game options,
  function reset(){
    gameObject.value.factions = factionList
    gameObject.value.difficulty = 'easy'
    gameObject.value.rounds = 'standard'
  }




  return {
    gameObject,
    defineDifficulty,
    defineRounds,
    addFaction,
    removeFaction,
    setRounds,
    setDifficulty,
    reset,
   }
})
