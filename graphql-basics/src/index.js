import message, {  name, location, greetings } from './myModule'
import differenceNumber,  { add } from './math';

console.log(name, location, message)

console.log(greetings("Banglore"))

console.log( "addition of number is: ", add(5,6))
console.log('substraction of a number is :', differenceNumber(10, 8))