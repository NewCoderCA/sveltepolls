<script>

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

//User form
const formValues = {
    country: '',
    relocationSummary: '',
    multiRegion: [],
    numberofPolls: []
}

//Submitting User form information. Usually would be sent to an API Endpoint
function submitForm() {
  console.log(formValues);

}
</script>




<form on:submit|preventDefault={submitForm}>
<div>
    <label for="country">Choose your residential African Country</label>
    <select id="country" bind:value={formValues.country}>
        <option value="">Select a country</option>
        <option value="algeria">Algeria</option>
        <option value="angola">Angola</option>
        <option value="benin">Benin</option>
        <option value="botswana">Botswana</option>
        <option value="berkina faso">Berkina Faso</option>
        <option value="burundi">Burundi</option>
        <option value="cape verde">Cape Verde</option>
        <option value="cameroon">Cameroon</option>
        <option value="central african republic">Central African Republic</option>
        <option value="chad">Chad</option>
        <option value="comoros">Comoros</option>
        <option value="congo democratic republic of the">Congo, Democratic Republic of the</option>
        <option value="congo republic of the">Congo, Republic of the</option>
        <option value="cote d'ivoire">Cote d'Ivoire (Ivory Coast)</option>
        <option value="djibouti">Djibouti</option>
        <option value="egypt">Egypt</option>
        <option value="equatorial guinea">Equatorial Guinea</option>
        <option value="eritrea">Eritrea</option>
        <option value="eswatini (formerly swaziland)">Eswatini (formerly Swaziland)</option>
        <option value="ethiopia">Ethiopia</option>
        <option value="gabon">Gabon</option>
        <option value="gambia">Gambia</option>
        <option value="ghana">Ghana</option>
        <option value="guinea-bissau">Guinea-Bissau</option>
        <option value="kenya">Kenya</option>
        <option value="lesotho">Lesotho</option>
        <option value="liberia">Liberia</option>
        <option value="madagascar">Madagascar</option>
        <option value="malawi">Malawi</option>
        <option value="mali">Mali</option>
        <option value="mauritius">Mauritius</option>
        <option value="morocco">Morocco</option>
        <option value="mozambique">Mozambique</option>
        <option value="namibia">Namibia</option>
        <option value="niger">Niger</option>
        <option value="nigeria">Nigeria</option>
        <option value="rwanda">Rwanda</option>
        <option value="sao time and principe">Sao tome and Principe</option>
        <option value="senegal">Senegal</option>
        <option value="seychelles">Seychelles</option>
        <option value="sierra leone">Sierra Leone</option>
        <option value="somalia">Somalia</option>
        <option value="south africa">South Africa</option>
        <option value="south sudan">South Sudan</option>
        <option value="sudan">Sudan</option>
        <option value="tanzania">Tanzania</option>
        <option value="togo">Togo</option>
        <option value="tunisia">Tunisia</option>
        <option value="uganda">Uganda</option>
        <option value="zambia">Zambia</option>
        <option value="zimbabwe">Zimbabwe</option>
    </select>
</div>

<div>
    <label for="relocation">Desired relocation countries</label>
    <textarea id="relocation" bind:value={formValues.relocationSummary} />
</div>

<div>
    <label for="mulitRegion">Relocation region</label>
    <select id="mulitRegion" bind:value={formValues.multiRegion} multiple>
        <option value="">Select a relocation region</option>
        <option value="north africa">North Africa</option>
        <option value="south africa">South Africa</option>
        <option value="central">Central</option>
        <option value="east africa">East Africa</option>
        <option value="west africa">West Africa</option>
    </select>
</div>

<div>
    <label>Number of Polls taken before</label>
    <input type="radio" id="0-2" value="0-2" bind:group={formValues.numberofPolls} />
    <label for="0-2">0-2 polls</label>
    <input type="radio" id="3-5" value="3-5" bind:group={formValues.numberofPolls} />
    <label for="3-5">3-5 polls</label>
    <input type="radio" id="5+" value="5+" bind:group={formValues.numberofPolls} />
    <label for="5+">5+ polls</label>
</div>

<div>
    <button id="button">Submit</button>
</div>
</form>

<style>

form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  padding:10px auto;
} 
label{
    margin: 20px auto;
}
#relocation {
	border-radius: 6px;
    width: 300px;
}
input[type="radio"] + label {
    display: inline-block;
    padding: 10px;
    margin: 0px;
}
input[type="radio"]{
    transform: scale(2);
}
#button {
    border-radius: 6px;
    border-color: blueviolet;
    padding: 10px;
}
#button:hover{
    background-color: #45c496;  
}
</style>