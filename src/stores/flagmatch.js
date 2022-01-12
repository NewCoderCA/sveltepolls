import { flagmatch } from 'svelte/store';


const flags = ['Algeria', 'Angola', 'Benin', 'Berkina Faso', 'Botswana', 'Burundi', 
              'Cameroon', 'Cape Verde', 'Central African Republic', 'Chad', 'Comoros', 'Congo Democratic Republic', 'Congo Republic',
              'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea Bissau',
              'Kenya', 'Lesotho', 'Liberia', 'Madagascar', 'Malawi', 'Mali', 'Mauritius', 'Morocco', 'Mozambique',
              'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia',
              'Somalia', 'South Africa', 'Sudan', 'Tanzania', 'Uganda', 'Zambia', 'Zimbabwe'];


export const flagcheck = function(flagName) {
  
let answer = false;
    for(let i = 0; i <flags.length; i++){
        if(flags.indexOf(flagName) !== -1){  
         answer = true;
        }
    }
    return answer; 
}
