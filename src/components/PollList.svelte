<script>
import { fade, slide, scale } from 'svelte/transition';
import { flip } from 'svelte/animate';
import PollStore from '../stores/PollStore.js';
import PollDetails from "./PollDetails.svelte";

</script>

<div class="poll-list">
  {#each $PollStore as poll (poll.id)} 
  <button in:fade out:slide|local animate:flip={{duration: 500}}>
    <PollDetails {poll} /> 
  </button>
  {/each}
</div>



<style>
.poll-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  padding:40px;
}
button {
  background: none;
  border-radius: 6px;
  border-color: transparent;
}
</style>