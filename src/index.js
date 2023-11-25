import './style.css';
import { prepopulateDate } from './logic';
import { createPlusButton, submitToTodoContainer } from './dom.js';
// import { isFirstDayOfMonth } from 'date-fns';

// import Icon from './hamburger.jpg';

// const title = document.querySelector('.title');
// const myIcon = new Image();
// myIcon.src = Icon;
// title.append(myIcon);









prepopulateDate();
submitToTodoContainer();
createPlusButton();
// console.log(mainTodoArray);
// console.log(projectArray);