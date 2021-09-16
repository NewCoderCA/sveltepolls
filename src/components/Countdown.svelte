<script>
 import { createEventDispatcher } from 'svelte';
 import { onMount, onDestroy, afterUpdate } from 'svelte';
 import { each } from 'svelte/internal';
 import { tweened } from 'svelte/motion';
 
 export let countdown = 0;
 const dispatch = createEventDispatcher();

 let timer = null;
 const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reverse();

 $: minutes = Math.floor(countdown / 60);
 $: seconds = countdown % 60;

 let secondH = tweened((9 - Math.floor(countdown % 60 / 10)) * 111, { duration: 900 });
 let secondL = tweened((9 - Math.floor(countdown % 60 % 10)) * 111, { duration: 900 });

 const value = tweened(0, { duration: 900 });

 onMount(() => {
     timer = setInterval(() => {
         countdown -= 1;
     }, 1000);
 })

 afterUpdate(() => {
     secondH.set((9 - Math.floor(seconds / 10)) * 41);
     secondL.set((9 - Math.floor(seconds % 10)) * 41);
 })


onDestroy(() => {
    if (timer) {
        clearInterval(timer);
    }
})

$: {
    if (countdown === 0) {
        clearInterval(timer);
        timer = null;
        dispatch('completed');
    }
}

</script>



<div class="timer">
    <ul>
    {#each numbers as num, i}
    <li class="num" style="transform: translateY(-{$secondH}px;">
        <span>{num}</span>
    </li>
    {/each}
    </ul>

    <ul>
        {#each numbers as num, i}
        <li class="num" style="transform: translateY(-{$secondL}px);">
            <span>{num}</span>
        </li>
        {/each}
    </ul>

</div>


<style>
ul {
    display: inline-block;
    list-style: none;
    overflow: hidden;
    height: 30px;
    padding: 0px;
    margin: 0px;
}
.num {
    font-size: 30px;
    font-weight: bold;
    color: blueviolet;
}
button {
    margin: 15px auto;
    padding: 10px;
    border-radius: 8px;
    border-color: blueviolet;;
}
</style>