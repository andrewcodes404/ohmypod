import '../sass/style.scss';

import { $, $$ } from './modules/bling';


const hamburger = document.querySelector('#hamburger');
const menu = document.querySelector('#menu')

hamburger.addEventListener('click', (e)=>{
  hamburger.classList.toggle('rotate');
  menu.classList.toggle('show');
});
