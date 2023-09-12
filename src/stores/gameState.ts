import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'





// Define our interfaces
interface gameObject {
  factions: string[],
  difficulty: string,
  rounds: string
}



export const useGameStateStore = defineStore('gameState', () => {

  // These values are referenced for game setup.
  const defineDifficulty  = ref<string[]>(['easy', 'medium','hard']);
  const defineRounds  = ref<string[]>(['quick', 'standard','full']);
  const factionList = ref<string[]>(['misc','amarr', 'caldari', 'gallente', 'minmatar']);


  // Game object tracks all data relating to the instance of the game.
  const gameObject = ref<gameObject>({
    factions: factionList.value,
    difficulty: 'easy',
    rounds: 'standard'
  })


  function setDifficulty( difficulty : string ){
    if(defineDifficulty.value.includes(difficulty)){
      gameObject.value.difficulty = difficulty;
    }
  }

  function setRounds( rounds : string ){
    if(defineRounds.value.includes(rounds)){
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
    gameObject.value.factions = factionList.value
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
    reset
   }
})
