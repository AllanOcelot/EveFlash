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
    // 0 - easy: show faction, show tech level. 1 - medium : show faction: hard: show nothing.
    difficulty: 'easy',
    // divide the total number of cards by.
    rounds: 0
  })


  function setDifficulty( difficulty : string ){
    if(difficulty === 'easy' || difficulty === 'medium' || difficulty === 'hard'){
      gameObject.value.difficulty = difficulty;
    }
  }

  function setRounds( rounds : number ){
    if(difficulty === 0 || difficulty === 25 || difficulty === 50){
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
    gameObject.value.difficulty = 0
    gameObject.value.rounds = 0
  }




  return {
    gameObject,
    addFaction,
    removeFaction,
    setRounds,
    setDifficulty,
    reset,
   }
})
