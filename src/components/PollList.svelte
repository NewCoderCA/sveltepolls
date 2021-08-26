<script>
// import { onMount, onDestroy } from 'svelte'; //Hooks to subscribe and destroy store

import PollStore from '../stores/PollStore';
import PollDetails from "./PollDetails.svelte";

//export let polls = []; //No need for local variable or function below as we now have access to store data
// const unsubcri = PollStore.subscribe(data => {
//   polls = data;
// });
// onMount(() => {
//   console.log('component mounted'); //Resubscribe to component and store
// });
// onDestroy(() => {
// console.log('component destroyed'); //Unsubscribe and destroy the store
// unsubcri();
// })

</script>

<div class="poll-list">
<!-- {#each polls as poll (poll.id)} --> <!--Same below Using $ to subscribe get data and automatic unsubscribe when data is destroyed when leaving the Store-->
  {#each $PollStore as poll (poll.id)} 
  <div>
    <PollDetails {poll} on:vote />
  </div>
  {/each}
</div>



<style>
.poll-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
}
</style>