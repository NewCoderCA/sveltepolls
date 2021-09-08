<script>
import { fly } from 'svelte/transition';
import Countdown from '../components/Countdown.svelte';
let done = false;
//User form

const formValues = {
  flagName: ''
}

//Submitting User form information. Usually would be sent to an API Endpoint
function submitFlag() {
  console.log(formValues);
}

</script>

<form on:submit|preventDefault={submitFlag}>
<div class="card">
  <h2>Which country has this flag?</h2>

  <div class="timer">
    <p>Start</p>
    <Countdown countdown={9} on:completed="{() => done = true}" />
    {#if done}
    <p in:fly>Times up!</p>
    {/if}
  </div>

  <img src="./images/flagGhana.jpg" alt="Flag of Ghana" class="flag" >

  <div>
    <label for="whichflag">Country of flag</label>
    <input id="whichflag" bind:value={formValues.flagName}/>
    <button id="button">Submit</button>
  </div>

</div> 
</form>



<style>
h2 {
    margin: 0;
    padding: 0;
  }
.card {
    background: white;
    padding: 25px;
    border-radius: 6px;
    box-shadow: 0px 2px 4px rgba(0,0,0,0.2);
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 20px;     
    }
.flag {
    width: 200px;
    height: 150px;
    justify-content: center;
    align-items: center;
}
#button {
    border-radius: 6px;
    border-color: blueviolet;
    padding: 10px;
}
#button:hover{
    background-color: #45c496;  
}
#whichflag {
    border-radius: 6px;
    border-color: blueviolet;
    padding: 10px;
    margin: 10px;
}
.timer {
  margin: 0;
  padding:0;
}
  </style>