<script>
export let type = 'primary';
export let flat = false;
export let inverse = false;

</script>

<button class={type} class:flat={flat} class:inverse={inverse}>
    <slot></slot>
    <p>Passing any data as content through the slot to the component via this button</p>
</button>



<style>

p {
    font-size: 8px;
    color: grey;
}

button {
    border: 0;
    cursor: pointer;
    border-radius: 6px;
    padding: 8px 12px;
    font-weight: bold;
    font-size: 16px;
    box-shadow:  1px 2px 3px rgba(0,0,0,0.2);
}
.primary {
    background: blueviolet;
    color: white;
}
.secondary {
    background: #45c496;
    color: white;
}
.flat {
    box-shadow: none;
}
.primary.inverse {
    color: blueviolet;
    background: white;
    border: 2px solid blueviolet;
}
.secondary.inverse {
    color: #45c496;
    background: white;
    border: 2px solid #45c496;
}
</style>