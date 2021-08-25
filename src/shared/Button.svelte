<script>
export let type = 'primary';
export let flat = false;
export let inverse = false;

</script>

<button class={type}>
    <slot></slot>
    <p>Passing whatever data through the slot to the component via the button as content</p>
</button>



<style>

p {
    font-size: 10px;
    color: grey;
}

button {
    border: 0;
    curser: pointer;
    border-radius: 6px;
    padding: 8px 12px;
    font-weight: bold;
    box-shadow:  1px 2px 3px rgba(0,0,0,0.2);
}
.primary {
    background: blueviolet;
    color: white;
}
.secondary {
    background: rgb(2, 216, 109);
    color: white;
}
</style>