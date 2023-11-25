
import { getPriority, formatTodoDate, determineProject,setPriorityStyles } from './logic';
import trashImage from "./images/delete.svg";
import checkMarkImage from "./images/check.svg";
import plusImage from "./images/plus.svg";

function myPage() {
  const mainEl = document.querySelector('.main');
  const projectInput = document.querySelector('#project-input');
  const todoInput = document.querySelector('#to-do');
  const dueDateInput = document.querySelector('#date');
  // priorityContainer IS INSIDE THE MODAL, NOT INSIDE THE TODOS.
  const priorityContainer = document.querySelector('.priority-container');
  const createTodoButton = document.querySelector("#create-todo-btn");
  const todoContainer = document.querySelector('.todo-container');
  const bottomControlsCont = document.querySelector('.bottom-controls');

  const moveDropDownContainer = document.createElement('div');
  moveDropDownContainer.classList.add('dropdown-container')
  
  const popUpCalendarEl = document.createElement('input');
  popUpCalendarEl.type = 'date';
  popUpCalendarEl.classList.add('popup-calendar');

  const overlayEl = document.createElement('div');
  // const overlayEl = document.querySelector('#overlay');
  overlayEl.setAttribute('id', 'overlay');    
  mainEl.append(overlayEl);
  // overlayEl.classList.add('overlay');    

  const projectListContainer = document.querySelector('.project-list-container');
  const plusButtonContainer = document.querySelector('.plus-button-container');

  return {projectInput, todoInput, dueDateInput, priorityContainer, createTodoButton, todoContainer, bottomControlsCont, moveDropDownContainer, popUpCalendarEl, overlayEl, projectListContainer, plusButtonContainer};
}
export const page = myPage();

export const projectArray = [];
export let currentProject;


class Project {
  constructor(name) {
      this.name = name;
      this.projectItems = [];
  }
  addItem(toDoItem) {
    this.projectItems.push(toDoItem);
  }
  removeItem(toDoItem) {
      this.projectItems.splice(this.projectItems.indexOf(toDoItem), 1);
  }
}

export class Todo {
  constructor(todo, dueDate, priority) {
    this.todo = todo;
    this.dueDate = dueDate;
    this.priority = priority;
    // this.description = description;
    this.isDone = false;
  }
}

export function pushToProjectArray(name, projectItem) {
  const newProject = new Project(name);
  newProject.addItem(projectItem);
  projectArray.push(newProject);
  currentProject = newProject;
  console.log(newProject);
  console.log(projectArray);
}
 
export function pushTodoToExistingProject(newToDo, existingProject) {
  existingProject.addItem(newToDo);
  currentProject = existingProject;
  console.log(existingProject);
  console.log(projectArray);
}

export function submitToTodoContainer () {
  let priority = 'Low';
  page.priorityContainer.addEventListener('click',  (e) =>  {
    priority = getPriority(e).priority;
  });
  page.createTodoButton.addEventListener('click', (e)=> {
  e.preventDefault();
    determineProject(priority);
    styleCurrentProjectonProjectList();
  });
}

function makeElement(elementTag, className, appendToEl) {
  const element = document.createElement(elementTag);
  element.classList.add(className);
  if (appendToEl) {
    appendToEl.append(element);
  } 
  return element;
}

export function renderProjectList() {
  page.projectListContainer.innerHTML = '';
  // const projListContainer = makeElement('div', 'project-list-container', page.bottomControlsCont)
  for (const project of projectArray) {
    const projectEl = makeElement('li', 'project-name-element', page.projectListContainer);
    const trashSVG = new Image();
    trashSVG.src = trashImage;
    trashSVG.classList.add("project-list-trash-svg");
    // The image would not append the normal way. I had to use this createTextNode function.
    projectEl.appendChild(document.createTextNode(project.name));
    projectEl.append(trashSVG);
    // projectEl.innerText = project.name;
    projectEl.addEventListener('click', () => {
      renderTodosInProjectArray(project);
      currentProject = project;
    styleCurrentProjectonProjectList();
    })
    trashSVG.addEventListener('click', () =>  deleteProject(projectEl, project));
  }
}

function deleteProject(projectEl, project) {
  if (projectEl.innerText === project.name) {
    const projectIndex = projectArray.indexOf(project);
    if (projectIndex !== -1) {
      projectArray.splice(projectIndex, 1);
    }
    projectEl.remove();
    renderProjectList();
    // Without the delay, it renders the project that had been deleted instead of currentProject.
    setTimeout(() => {
      currentProject = projectArray.length > 0 ? projectArray[0] : null;
      console.log(currentProject);
      renderTodosInProjectArray(currentProject);
      console.log(currentProject);
      styleCurrentProjectonProjectList();
    }, 50);
  }
}

export function createPlusButton() {
  const plusPNG = new Image();
  plusPNG.src = plusImage;
  page.plusButtonContainer.append(plusPNG);
  plusPNG.classList.add("plus-png");

}


function styleCurrentProjectonProjectList() {
  const currentProjectName = currentProject.name;
  const projectListContainer = document.querySelector('.project-list-container');
    const projectListItems = Array.from(projectListContainer.children);
    for (const projectListItem of projectListItems) {
        projectListItem.classList.remove('current-project-styles');
      if (projectListItem.innerText === currentProjectName) {
        projectListItem.classList.add('current-project-styles');
      }
    }
}

export function renderTodosInProjectArray(projectNameOrObject) {
  page.todoContainer.innerHTML = '';
  // console.log("render function after clearing screen");
  if (!projectArray || projectArray.length === 0) {
    console.log('No projects found. Rendering empty page.');
    return;
  }

  let project;

  if (typeof projectNameOrObject === 'string') {
    project = projectArray.find((p) => p.name === projectNameOrObject);
  } else if (typeof projectNameOrObject === 'object') {
    project = projectNameOrObject;
  } else {
    console.error(`Invalid project argument: ${projectNameOrObject}`);
    return;
  }
    if (project) {
      for (const todoItem of project.projectItems) {


        const todoUl = document.createElement('ul');
        todoUl.classList.add('todo-item');
        const formattedDate = formatTodoDate(todoItem.dueDate);
        todoUl.innerHTML = `
        <li class="todo-title ${todoItem.isDone ? 'todo-marked-as-done' : ''}" contenteditable="true"><span class="todo-title-text">${todoItem.todo}</li>
        <li class="todo-date">${formattedDate}</li>
        <li class="todo-priority">${todoItem.priority}</li>

        <li class="todo-move">Move to:</li>
        `;
        setPriorityStyles(todoItem, todoUl);
        const doneButtonEl = createDoneButton(todoUl);
        const deleteButton = createTodoDeleteButton(todoItem, todoUl, currentProject)
        todoUl.setAttribute('id', project.projectItems.indexOf(todoItem));
        page.todoContainer.append(todoUl);
      }
    } else {
      console.log(project + "no project found");
    }
}

function createTodoDeleteButton(todo, todoUl, currentProject) {
  const deleteButtonEl = makeElement('li', 'todo-delete', todoUl)
  const trashSVG = new Image();
  trashSVG.src = trashImage;
  deleteButtonEl.append(trashSVG);
  trashSVG.classList.add("trash-svg");
  deleteButtonEl.addEventListener('click', () => {
    currentProject.removeItem(todo);
    todoUl.remove();
    console.log(projectArray);
  });
  return deleteButtonEl;
}


// For some reason, the image wasn't appending, and I had to add this "onload" check.
function createDoneButton(todoUl) {
  const doneButtonEl = makeElement('li', 'todo-done', todoUl)
  const checkMark = new Image();
  checkMark.onload = function() {
    doneButtonEl.append(checkMark);
  };
  checkMark.src = checkMarkImage;
  checkMark.classList.add("check-mark-svg");
  doneButtonEl.innerText = "Done";
  
  return doneButtonEl;
}

