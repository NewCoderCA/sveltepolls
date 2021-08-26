<script>
import PollStore from '../stores/PollStore.js';
import { createEventDispatcher } from 'svelte';
import Button from '../shared/Button.svelte';

let dispatch = createEventDispatcher();
let fields = { question: '', answerA: '', answerB: ''};
let errors = { question: '', answerA: '', answerB: ''};
let valid = false;

const submmitHandler = () => {
  valid = true;
  //Form is true at beginning if any answers fail form is false
  if (fields.question.trim().length < 2) {
    valid = false;
    errors.question = 'Question must be at least 2 characters long';
  } else {
    errors.question = '';
} 
//Validate AnswerA
if (fields.answerA.trim().length < 1) {
    valid = false;
    errors.answerA = 'Answer A cannot be empty';
  } else {
    errors.answerA = '';
}
//Validate AnswerB
if (fields.answerB.trim().length < 1) {
    valid = false;
    errors.answerB = 'Answer B cannot be empty';
  } else {
    errors.answerB = '';
}
//Add New Poll if Valid is True
if (valid) {
    let poll = {...fields, votesA: 0, votesB: 0, id: Math.random()};
    //Line below saves poll direct to Store using callback function update
    PollStore.update(currentPolls => {
        return [poll, ...currentPolls];      //Return new poll and copy of all currentPolls
    })
    dispatch('add');
}

}
</script>


<form on:submit|preventDefault={submmitHandler}>
    <div class="form-field">
        <label for="question">Poll Question:</label>
        <input type="text" id="question" bind:value={fields.question}>
        <div class="errors">{ errors.question }</div>
    </div>
    <div class="form-field">
        <label for="answer-a">Answer A:</label>
        <input type="text" id="answer-a" bind:value={fields.answerA}>
        <div class="errors">{ errors.answerA }</div>
    </div>
    <div class="form-field">
        <label for="answer-b">Answer B:</label>
        <input type="text" id="answer-b" bind:value={fields.answerB}>
        <div class="errors">{ errors.answerB }</div>
    </div>
    <Button type="secondary" flat={true}>Add Poll</Button>
</form>


<style>
 form {
     width: 500px;
     margin: 0 auto;
     text-align: center;
 }

.form-field {
    margin: 18px auto;
}
 input {
     width: 100%;
     border-radius: 6px;
 }

 label {
     margin: 10px auto;
     text-align: left;
 }
 .errors {
     font-weight: bold;
     font-size: 12px;
     color: #d91b42;
 }
</style>