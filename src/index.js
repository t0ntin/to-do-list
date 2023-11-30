import "./style.css";
import { prepopulateDate } from "./logic";
import {
  createPlusButton,
  submitToTodoContainer,
  renderProjectList,
  renderTodosInProjectArray,
  projectArray,
  currentProject,
} from "./dom.js";
import { validateForm } from "./form-validation.js";

window.onload = () => {
  renderTodosInProjectArray(currentProject);
  renderProjectList();
  console.log(projectArray);
};

prepopulateDate();
submitToTodoContainer();
createPlusButton();
