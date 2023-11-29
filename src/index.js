
import './style.css';
// import './form-validation.js'
import { prepopulateDate } from './logic';
import { createPlusButton, submitToTodoContainer, renderProjectList, renderTodosInProjectArray,  projectArray, getProjects, currentProject } from './dom.js';
import { validateForm } from './form-validation.js';


// let currentProject = null;
window.onload = () => {
  // if (localStorage.getItem('projects') === null) {
  //   localStorage.setItem('projects', '[]');
  // }
  // console.log(projectArray);
  // getProjects(); // This will populate projectArray with data from local storage
  renderTodosInProjectArray(currentProject);
  renderProjectList();
  console.log(localStorage.getItem('projects'));
  console.log(localStorage.getItem('currentProject'));
};

// window.onload = () => {
//   if (localStorage.getItem('projects') === null) {
//     localStorage.setItem('projects', JSON.stringify([]));
//   }
//   projectArray = JSON.parse(localStorage.getItem('projects'));
//   renderTodosInProjectArray(projectArray);
//   renderProjectList();
// };

prepopulateDate();

submitToTodoContainer();
createPlusButton();