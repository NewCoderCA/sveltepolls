<script>
import Card from '../shared/Card.svelte';
import PollStore from '../stores/PollStore.js';

export let poll;


//Reactive values for totals
$: totalVotes = poll.votesA + poll.votesB;

//Reactive poll vote moving percentages
$: percentA = Math.floor(100 / totalVotes * poll.votesA);
$: percentB = Math.floor(100 / totalVotes * poll.votesB);

//Handling Votes 
const handleVote = (option, id) => {
//Create update function on the Store
 PollStore.update((currentPolls) => {
  let copiedPolls = [...currentPolls];
  let upvotedPoll = copiedPolls.find((poll) => poll.id == id);

//Check which option to update
    if (option === 'a'){
        upvotedPoll.votesA++;
    }
    if (option === 'b'){
        upvotedPoll.votesB++;
    }
    return copiedPolls; 
  });
 };


</script>



<Card>
    <div class="poll">
    <h3>{ poll.question }</h3>
    <p>Total votes: { totalVotes }</p>
    <div class="answer" on:click={() => handleVote('a', poll.id)}>
        <div class="percent percent-a" style="width: {percentA}%"></div>
        <span>{ poll.answerA } ({ poll.votesA })</span>
    </div>
    <div class="answer" on:click={() => handleVote('b', poll.id)}>
        <div class="percent percent-b" style="width: {percentB}%"></div>
        <span>{ poll.answerB } ({ poll.votesB })</span>
    </div>
    </div>
</Card>



<style>
 h3 {
     margin: 0 auto;
     color: #555;
 }

 p {
     margin-top: 8px;
     font-size: 18px;
     color: #aaa;
     margin-bottom: 30px;
 }
 .answer {
     background: rgba(245, 187, 245, 0.1);
     cursor: pointer;
     margin: 10px auto;
     position: relative;
 }
 .answer:hover {
     opacity: 0.6;
 }
 span {
     display: inline-block;
     padding: 10px 20px;
 }
 .percent {
     height: 100%;
     position: absolute;
     box-sizing: border-box;
 }
 .percent-a {
     border-left: 4px solid #d91b42;
     background: rgba(195, 27, 217, 0.3);
 }
 .percent-b {
     border-left: 4px solid #45c496;
     background: rgba(99, 248, 193, 0.3);
 }
</style>