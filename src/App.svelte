<script>
    export let name;
//Components
	import Header from './components/Header.svelte';
	import Footer from './components/Footer.svelte';
    import CreatePollForm from './components/CreatePollForm.svelte';
	import Tabs from './shared/Tabs.svelte';

//Tabs 
let items = ['Current Polls', 'Add New Poll'];
let activeItem = 'Current Polls';

const tabChange = (e) => {
 activeItem = e.detail; //e.detail is the item we send along in the li
}
</script>


<Header />
<main>
	<h1>Hello {name}!</h1>
	<Tabs {activeItem} {items} on:tabChange={tabChange} />
	{#if activeItem === 'Current Polls'}
	<p>Poll list component goes in here</p>
	{:else if activeItem === 'Add New Poll'}
	<p>New poll form component instead</p>
	<CreatePollForm />
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