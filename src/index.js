console.log('index.js loaded');
import './style.css';
import { getPriority, formatTodoDate, prepopulateDate, deleteTodo, priorityToggler, determineProject,setPriorityStyles } from './logic';
// import { isFirstDayOfMonth } from 'date-fns';

// import Icon from './hamburger.jpg';

// const title = document.querySelector('.title');
// const myIcon = new Image();
// myIcon.src = Icon;
// title.append(myIcon);

function myPage() {
  const projectInput = document.querySelector('#project-input');
  const todoInput = document.querySelector('#to-do');
  const dueDateInput = document.querySelector('#date');
  const descriptionInput = document.querySelector('#description');
  // priorityContainer IS INSIDE THE MODAL, NOT INSIDE THE TODOS.
  const priorityContainer = document.querySelector('.priority-container');
  const createTodoButton = document.querySelector("#create-todo-btn");
  const todoContainer = document.querySelector('.todo-container');
  const bottomControlsCont = document.querySelector('.bottom-controls');
  
  return {projectInput, todoInput, dueDateInput, descriptionInput, priorityContainer, createTodoButton, todoContainer, bottomControlsCont};
}
export const page = myPage();

const projectList = {};
const projectArray = [];
export const mainTodoArray = [];

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

export function pushToMainTodoArray (todo, dueDate, priority, description) {
    const newToDo = new Todo (todo, dueDate, priority, description);
    mainTodoArray.push(newToDo);
}

export function pushToProjectArray(name, projectItem) {
  const newProject = new Project(name);
  newProject.addItem(projectItem);
  projectArray.push(newProject);
}

function submitToTodoContainer () {
  let priority = 'Low';
  page.priorityContainer.addEventListener('click',  (e) =>  {
    priority = getPriority(e).priority;
  });
  page.createTodoButton.addEventListener('click', (e)=> {
  e.preventDefault();
    determineProject(priority);
  });
}

export function renderTodos() {
  page.todoContainer.innerHTML = '';
  for (const todo of mainTodoArray) {
    const todoUl = document.createElement('ul');
    todoUl.classList.add('todo-item');
    const formattedDate = formatTodoDate(todo.dueDate);
    todoUl.innerHTML = `
      <li class="todo-title" contenteditable="true">${todo.todo}</li>
      <li class="todo-description" contenteditable="true">${todo.description}</li>
      <li class="todo-date">${formattedDate}</li>
      <li class="todo-priority">${todo.priority}</li>
      <li class="todo-delete"></li>
      <li class="todo-select">Select</li>
      <li class="todo-done">Done</li>
    `;
    setPriorityStyles(todo, todoUl);
    const deleteButton = createDeleteButton(todo, todoUl);
    todoUl.querySelector('.todo-delete').appendChild(deleteButton);
    todoUl.setAttribute('id', mainTodoArray.indexOf(todo));
    page.todoContainer.append(todoUl);
  }
}

export function renderProjects() {
  page.bottomControlsCont.innerHTML = '';
  for (const project of projectArray) {
    const projectEl = document.createElement('li');
    projectEl.innerText = project.name;
    projectEl.addEventListener('click', () => {
      renderTodosInProjectArray(project);
    })
    page.bottomControlsCont.append(projectEl);
  }
}

function renderTodosInProjectArray(project) {
  page.todoContainer.innerHTML = '';
  for (const todoItem of project.projectItems) {
    const todoUl = document.createElement('ul');
    todoUl.classList.add('todo-item');
    const formattedDate = formatTodoDate(todoItem.dueDate);
    todoUl.innerHTML = `
      <li class="todo-title" contenteditable="true">${todoItem.todo}</li>
      <li class="todo-description" contenteditable="true">${todoItem.description}</li>
      <li class="todo-date">${formattedDate}</li>
      <li class="todo-priority">${todoItem.priority}</li>
      <li class="todo-delete"></li>
      <li class="todo-select">Select</li>
      <li class="todo-done">Done</li>
    `;
    setPriorityStyles(todoItem, todoUl);
    const deleteButton = createDeleteButton(todoItem, todoUl);
    todoUl.querySelector('.todo-delete').appendChild(deleteButton);
    todoUl.setAttribute('id', project.projectItems.indexOf(todoItem));
    page.todoContainer.append(todoUl);
  }
}

function createDeleteButton(todo, todoUl) {
  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Delete';
  deleteButton.addEventListener('click', () => {
      deleteTodo(todo);
      todoUl.remove();
    });
  return deleteButton;
}





// function setupEventListenerForMarkAsDone (mainTodoArray) {
//   const todoItems = document.querySelectorAll('.todo-item');

//   todoItems.forEach((item, index) => {
//     const todoDoneButton = item.querySelector('.todo-done');

//     todoDoneButton.addEventListener('click', (e) => {
//       markAsDone(e, mainTodoArray[index]);
//     });
//   });
// }
 


prepopulateDate();
submitToTodoContainer();
// console.log(mainTodoArray);
// console.log(projectArray);