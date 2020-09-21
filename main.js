import {GDP} from '/scripts/GDP.js';
import {Doping} from '/scripts/Doping.js'
import {Temperature} from '/scripts/Temperature.js'
import {Education} from '/scripts/Education.js'
import {Movie} from '/scripts/Movie.js'

var scripts = {
    GDP : GDP,
    Doping : Doping,
    Temperature : Temperature,
    Education : Education,
    Movie: Movie
}

var buttons = document.getElementsByTagName('button');

var showed ='';

for (let i = 0; i <buttons.length;i++){
    buttons[i].addEventListener('click',function(event){  
        var scriptName = buttons[i].id;
        if(showed != scriptName){
            clear();
            scripts[scriptName]();
            showed = scriptName;
        }
    })
}

function clear(){
    document.getElementById('container').innerHTML = '';
}
