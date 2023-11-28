
import './style.css';
// import './form-validation.js'
import { prepopulateDate } from './logic';
import { createPlusButton, submitToTodoContainer, renderProjectList, renderTodosInProjectArray,  projectArray, getProjects } from './dom.js';
import { validateForm } from './form-validation.js';


// let currentProject = null;
window.onload = () => {
  if (localStorage.getItem('projects') === null) {
    localStorage.setItem('projects', '[]');
  }
  console.log(projectArray);
  getProjects(); // This will populate projectArray with data from local storage
  renderTodosInProjectArray(projectArray);
  renderProjectList();
};



prepopulateDate();

submitToTodoContainer();
createPlusButton();