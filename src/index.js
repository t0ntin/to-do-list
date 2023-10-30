import './style.css';
import Icon from './hamburger.jpg';

const title = document.querySelector('.title');
const myIcon = new Image();
myIcon.src = Icon;
title.append(myIcon);

console.log('testing');