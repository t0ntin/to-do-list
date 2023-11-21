
import { getPriority, formatTodoDate, determineProject,setPriorityStyles } from './logic';



function myPage() {
  const mainEl = document.querySelector('.main');
  const projectInput = document.querySelector('#project-input');
  const todoInput = document.querySelector('#to-do');
  const dueDateInput = document.querySelector('#date');
  const descriptionInput = document.querySelector('#description');
  // priorityContainer IS INSIDE THE MODAL, NOT INSIDE THE TODOS.
  const priorityContainer = document.querySelector('.priority-container');
  const createTodoButton = document.querySelector("#create-todo-btn");
  const todoContainer = document.querySelector('.todo-container');
  const bottomControlsCont = document.querySelector('.bottom-controls');

  const moveDropDownContainer = document.createElement('div');
  moveDropDownContainer.classList.add('dropdown-container')
  
  // const moveDropDownEl = document.createElement('button');
  // moveDropDownEl.classList.add('dropdown-button')

  // const dialogEl = document.createElement('dialog');  //added
  const popUpCalendarEl = document.createElement('input');
  popUpCalendarEl.type = 'date';
  popUpCalendarEl.classList.add('popup-calendar');

  // dialogEl.append(popUpCalendarEl);                   //added

  const overlayEl = document.createElement('div');
  // const overlayEl = document.querySelector('#overlay');
  overlayEl.setAttribute('id', 'overlay');    
  mainEl.append(overlayEl);
  // overlayEl.classList.add('overlay');    


  return {projectInput, todoInput, dueDateInput, descriptionInput, priorityContainer, createTodoButton, todoContainer, bottomControlsCont, moveDropDownContainer, popUpCalendarEl, overlayEl};
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
  constructor(todo, dueDate, priority, description) {
    this.todo = todo;
    this.dueDate = dueDate;
    this.priority = priority;
    this.description = description;
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
  });
}

export function renderProjectList() {
  page.bottomControlsCont.innerHTML = '';
  for (const project of projectArray) {
    const projectEl = document.createElement('li');
    projectEl.innerText = project.name;
    projectEl.addEventListener('click', () => {
      renderTodosInProjectArray(project);
      currentProject = project;
      console.log(project);
    })
    page.bottomControlsCont.append(projectEl);
  }
}


export function renderTodosInProjectArray(projectNameOrObject) {
  page.todoContainer.innerHTML = '';
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
        <li class="todo-title ${todoItem.isDone ? 'todo-marked-as-done' : ''}" contenteditable="true">${todoItem.todo}</li>
        <li class="todo-description ${todoItem.isDone ? 'todo-marked-as-done' : ''}" contenteditable="true">${todoItem.description}</li>
        <li class="todo-date">${formattedDate}</li>
        <li class="todo-priority">${todoItem.priority}</li>
        <li class="todo-delete"></li>
        <li class="todo-move">Move</li>
        <li class="todo-done">Done</li>
        `;
        setPriorityStyles(todoItem, todoUl);
        const deleteButton = createDeleteButton(todoItem, todoUl, currentProject);
        todoUl.querySelector('.todo-delete').appendChild(deleteButton);
        todoUl.setAttribute('id', project.projectItems.indexOf(todoItem));
        page.todoContainer.append(todoUl);
      }
    } else {
      console.log(project); // This will log the project object
    }
}

export function createDeleteButton(todo, todoUl, currentProject) {
  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Delete';
  deleteButton.addEventListener('click', () => {
    currentProject.removeItem(todo);
    todoUl.remove();
    console.log(projectArray);
  });
  return deleteButton;
}