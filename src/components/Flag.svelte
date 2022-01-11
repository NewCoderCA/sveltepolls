<script>
 //import { fly } from 'svelte/transition';
 //import Countdown from '../components/Countdown.svelte';

 import { flagcheck } from '../stores/flagmatch.js';
let done = false;

//User form
const formValues = {
  flagName: ''
}

//Submitting User form information. Usually would be sent to an API Endpoint
function submitFlag() {
  console.log(formValues);
  flagcheck();
}


  

</script>

<form on:submit|preventDefault={submitFlag}>
<div class="card">
  <h2>Which country has this flag?</h2>

  <!-- <div class="timer">
    <h3>Start</h3>
    <Countdown countdown={9} on:completed="{() => done = true}" />
    {#if done}
    <p in:fly>Times up!</p>
    {/if}
  </div> -->

  <img src="./images/flagGhana.jpg" alt="Flag of Ghana" class="flag" >

  <div class="flag-country-label">
    <label for="flag-country">Country of flag</label>
    <input id="flag-country" bind:value={formValues.flagName}/>
      
    <button id="button">Submit</button>
  </div>
  

  <!-- Traversing flags  -->
<!-- Object.entries() converts an Object into an array of arrays, 
 each sub array first index is the a key and the second index is a value
 Object.entries({key: value, key:value}) => [[key, value], [key,value]] -->

<!-- {#each Object.entries(sections) as [flag1, ghana]}
  <p>{flag1}</p>
  <p>{ghana}</p>
{/each} -->
  
</div> 
</form>



<style>
.card {
    background: white;
    padding: 25px;
    margin: 100px;
    border-radius: 6px;
    box-shadow: 0px 2px 4px rgba(0,0,0,0.2);
    width:auto;  
    justify-content: center;
    align-items: center;
    }
.flag {
    width: 200px;
    height: 150px;
    margin: 25px;
}
#button {
    border-radius: 6px;
    border-color: blueviolet;
    padding: 10px;
}
#button:hover{
    background-color: #45c496;  
}
#flag-country {
    border-radius: 6px;
    border-color: blueviolet;
    padding: 10px;
    margin: 15px; 
}

</style>