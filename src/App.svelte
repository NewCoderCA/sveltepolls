<script>
export let name;
//Components
import Header from './components/Header.svelte';
import AfricanCountry from './components/AfricanCountry.svelte';
import Flag from './components/Flag.svelte';
import Footer from './components/Footer.svelte';
import PollList from './components/PollList.svelte';
import CreatePollForm from './components/CreatePollForm.svelte';
import Tabs from './shared/Tabs.svelte';
import Countdown from './components/Countdown.svelte'
import Timer from './components/Timer.svelte';


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

//Users name will appear in title
let firstName = '';
let lastName = '';
$: username = `${firstName} ${lastName}`;
const handleChange = () => {
	username = '';
}

const handleInput = (e) => {
  username = e.target.value
};
</script>

<Header />
<main>
	<h1>Hello {username} welcome to {name} Polls!</h1>
	<Timer />
	<div on:change={handleChange}>Insert your full name</div>
	<!--<input type="text" on:input={handleInput} value={username}>-->
    <!--Alternative way for two-way-binding reactive name values below-->
    <!-- <input type="text" bind:value={firstName}>
	<input type="text" bind:value={lastName}> -->
	<input type="text" bind:value={username}>

    <AfricanCountry />
	<Tabs {activeItem} {items} on:tabChange={tabChange} />
	{#if activeItem === 'Current Polls'}
	<PollList />
	{:else if activeItem === 'Add New Poll'}
	<CreatePollForm on:add={handleAdd} />
	{/if}

	<Flag />
	<Countdown />

	<p>Thank you {username} for taking part!</p>
	<p>Please share</p>
	<!-- Share via Social Media -->
    <a href="https://www.facebook.com/sharer/sharer.php?u=example.org" target="_blank">
    	<img src="./images/facebook.png" alt="Facebook logo" id="facebook" />
    </a>
	<a href="http://twitter.com/share?url=http://www.example.com&text=Simple Share Buttons&hashtags=simplesharebuttons" target="_blank">
		<img src="./images/twitter.png" alt="Twitter logo" id="twitter" />
	</a>
	<a href="https://www.linkedin.com/sharing/share-offsite/?url=https://example.com" target="_blank">
		<img src="./images/linkedin.jpeg" alt="LinkedIn logo" id="linkedin" />
	</a>
	<a href="javascript:void((function()%7Bvar%20e=document.createElement('script');e.setAttribute('type','text/javascript');e.setAttribute('charset','UTF-8');e.setAttribute('src','http://assets.pinterest.com/js/pinmarklet.js?r='+Math.random()*99999999);document.body.appendChild(e)%7D)());">
		<img src="./images/pinterest.png" alt="Pinterest logo" id="pinterest" />
	</a>
    <a href="mailto:?Subject=Simple Share Buttons&Body=I%20saw%20this%20and%20thought%20of%20you!%20 http://www.example.com">
		<img src="./images/email.png" alt="Email logo" id="email" />
	</a>
	<a href="https://instagram.com/" target="_blank">
		<img src="./images/instagram.jpeg" alt="Instagram logo" id="instagram" />
	</a>
	
   
</main>
<Footer />




<style>
main {
	max-width: 960px;
	margin: 30px auto;
	text-align: center;
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
	background: rgba(185, 92, 197, 0.1);
	padding: 35px auto;
	border-radius: 6px;
}

input[type="text"] {
	border-radius: 6px;
	margin: 20px auto;
}

#facebook, #twitter, #linkedin, #pinterest, #email, #instagram {
	max-width: 50px;
	max-height: 50px;
	border-radius: 10px;
	margin:10px;
}
	
#facebook:hover, #facebook:focus {
	background: #e1e1e1;
    border: 2px solid blueviolet;
}
	
#twitter:hover, #twitter:focus {
	background: #e1e1e1;
    border: 2px solid blueviolet;
}
#linkedin:hover, #linkedin:focus {
	background: #e1e1e1;
    border: 2px solid blueviolet;
}
#pinterest:hover, #pinterest:focus {
	background: #e1e1e1;
    border: 2px solid blueviolet;
}
#email:hover, #email:focus {
	background: #e1e1e1;
    border: 2px solid blueviolet;
}
#instagram:hover, #instagram:focus {
	background: #e1e1e1;
    border: 2px solid blueviolet;
}
</style>