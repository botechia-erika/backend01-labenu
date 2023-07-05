import { countries } from "./../dataJS/countries.js";

/*exercicio 01 - procurar um pais na lista*/
const query = process.argv[2]
//npm run start brasil



if (!query) {
  console.log('argumento nao registrado')
} else {
  const result = countries.find(country => country.name.toUpperCase().includes(query.toUpperCase()))
  return query
}


