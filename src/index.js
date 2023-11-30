
import './style.css';
// import './form-validation.js'
import { prepopulateDate } from './logic';
import { createPlusButton, submitToTodoContainer, renderProjectList, renderTodosInProjectArray,  projectArray, getProjects, currentProject } from './dom.js';
import { validateForm } from './form-validation.js';


window.onload = () => {

  renderTodosInProjectArray(currentProject);
  renderProjectList();

};



prepopulateDate();

submitToTodoContainer();
createPlusButton();