import { writable } from 'svelte/store';

const PollStore = writable([
    {
		id: 1,
		question: 'Mountain or River',
		answerA: 'Mountain',
		answerB: 'River',
		votesA: 9,
		votesB: 15,
	},
    {
		id: 2,
		question: 'Nollywood or Holloywood movies',
		answerA: 'Nollywood',
		answerB: 'Hollywood',
		votesA: 58,
		votesB: 42,
	},
	{
		id: 3,
		question: 'Jellof rice or Rice and peas',
		answerA: 'Jellof',
		answerB: 'Rice and peas',
		votesA: 29,
		votesB: 8,
	},
]);

export default PollStore;