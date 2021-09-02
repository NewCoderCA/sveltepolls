<script>
export let name;
//Components
import Header from './components/Header.svelte';
import Footer from './components/Footer.svelte';
import PollList from './components/PollList.svelte';
import CreatePollForm from './components/CreatePollForm.svelte';
import Tabs from './shared/Tabs.svelte';



//Tabs 
let items = ['Current Polls', 'Add New Poll'];
let activeItem = 'Current Polls';

const tabChange = (e) => {
 activeItem = e.detail;           //e.detail is the item we send along in the <li tag>
}

//Polls now in writeable PollStore file
const handleAdd = (e) => {   
	activeItem = 'Current Polls';  //Only need to add active data to the Store
}

let firstName = '';
let lastName = '';
$: username = `${firstName} ${lastName}`;
const handleClick = () => {
	username = '';
}

const handleInput = (e) => {
  username = e.target.value
};
</script>

<Header />
<main>
	<h1>Hello {username} welcome to {name}!</h1>
	<button on:click={handleClick}>Insert your name</button>
	<!--<input type="text" on:input={handleInput} value={username}>-->
    <!--Alternative way for two-way-binding reactive name values below-->
    <input type="text" bind:value={firstName}>
	<input type="text" bind:value={lastName}>

	<Tabs {activeItem} {items} on:tabChange={tabChange} />
	{#if activeItem === 'Current Polls'}
	<PollList />
	{:else if activeItem === 'Add New Poll'}
	<CreatePollForm on:add={handleAdd} />
	{/if}

</main>
<Footer />




<style>
	main {
		max-width: 960px;
		margin: 30px auto;
	}
	h1 {
		color: rgb(204, 2, 245);
		text-transform: uppercase;
		text-align: center;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	button {
	   background: rgba(195, 27, 217, 0.1);
	   padding: 30px auto;
	   border-radius: 6px;
	}
	input[type="text"] {
		border-radius: 6px;
	}
</style>