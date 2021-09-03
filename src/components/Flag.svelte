<script>
//Submitting User form information. Usually would be sent to an API Endpoint
function submitForm() {
  console.log(formValues);
}

</script>

<form on:submit|preventDefault={submitForm}>
<div class="card">
  <h2>Which country holds this flag?</h2>
  <img src="./images/flagGhana.jpg" alt="Flag of Ghana" class="flag" >
  
  <div>
    <label for="whichflag">Country of flag</label>
    <input id="whichflag" />
    <button id="button">Submit</button>
 </div>

</div>
</form>



<style>
.card {
    background: white;
    padding: 25px;
    border-radius: 6px;
    box-shadow: 0px 2px 4px rgba(0,0,0,0.2);
    height: 300px;        
    width: 300px;

    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 20px;     
    }
.flag {
    width: 150px;
    height: 100px;
    justify-content: center;
}

#button {
    border-radius: 6px;
    border-color: blueviolet;
    padding: 10px;
}
#button:hover{
    background-color: #45c496;  
}
#whichflag {
    border-radius: 6px;
    border-color: blueviolet;
    padding: 10px;
    margin: 10px;
}
  </style>