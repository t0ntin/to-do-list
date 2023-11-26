
import './style.css';
// import './form-validation.js'
import { prepopulateDate } from './logic';
import { createPlusButton, submitToTodoContainer } from './dom.js';
import { validateForm } from './form-validation.js';

prepopulateDate();
submitToTodoContainer();
createPlusButton();
