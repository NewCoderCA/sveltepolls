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
 activeItem = e.detail; //e.detail is the item we send along in the li
}

//Polls
let polls = [
	{
		id: 1,
		question: 'Mountain or River',
		answerA: 'Mountain',
		answerB: 'River',
		votesA: 9,
		votesB: 15,
	},
];

const handleAdd = (e) => {
	const poll = e.detail;
	polls = [poll, ...polls];
	console.log(polls);
	activeItem = 'Current Polls';
}
</script>


<Header />
<main>
	<h1>Hello {name}!</h1>
	<Tabs {activeItem} {items} on:tabChange={tabChange} />
	{#if activeItem === 'Current Polls'}
	<PollList {polls} />
	{:else if activeItem === 'Add New Poll'}
	<CreatePollForm on:add={handleAdd} />
	{/if}

</main>
<Footer />




<style>
	/* main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	} */

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
</style>