import './style.css';
import { getPriority, formatTodoDate, prepopulateDate, deleteTodo, priorityToggler } from './logic';
import { isFirstDayOfMonth } from 'date-fns';

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
  
  return {projectInput, todoInput, dueDateInput, descriptionInput, priorityContainer, createTodoButton, todoContainer};
}
const page = myPage();

const projectList = {};
const projectArray = [];
export const mainTodoArray = [];

class Project {
  constructor(name) {
      this.name = name;
      this.projectItems = [];
  }
  addItem(toDoItem) {
    // console.log("Adding item:", toDoItem);

      this.projectItems.push(toDoItem);
      // console.log("Current project items:", this.projectItems);

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

function pushToMainTodoArray (todo, dueDate, priority, description) {
    const newToDo = new Todo (todo, dueDate, priority, description);
    mainTodoArray.push(newToDo);
}

function pushToProjectArray(name, projectItem) {
  const newProject = new Project(name);
  newProject.addItem(projectItem);
  projectArray.push(newProject);
}



function determineProject(priority) {
  if  (page.projectInput.value.trim() === '') {
    pushToMainTodoArray(page.todoInput.value, page.dueDateInput.value, priority, page.descriptionInput.value);
  } else {
    const newToDo = new Todo(page.todoInput.value, page.dueDateInput.value, priority, page.descriptionInput.value);
    pushToProjectArray(page.projectInput.value, newToDo);
  }
}

// function addToProjectList(project) {
//   projectList[project.name] = project;
//   projectArray.push(project);
// }

function submitToTodoContainer () {
  let priority = getPriority.priority;
  page.priorityContainer.addEventListener('click',  (e) =>  {
    priority = getPriority(e).priority;
  });
  page.createTodoButton.addEventListener('click', (e)=> {
  e.preventDefault();
    determineProject(priority);
    renderTodos(page.todoContainer);
    togglePriority(page.todoContainer);
    setupEventListenerForMarkAsDone(mainTodoArray);
    console.log(mainTodoArray);
  });
}

function renderTodos() {
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

function renderTodosInProjectArray() {
  page.todoContainer.innerHTML = '';
  for (const project of projectArray) {
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


function createDeleteButton(todo, todoUl) {
  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Delete';
  deleteButton.addEventListener('click', () => {
      deleteTodo(todo);
      todoUl.remove();
    });
  return deleteButton;
}

// INSIDE renderTodos();
function setPriorityStyles(todo, todoUl) {
  const priorityEl = todoUl.querySelector('.todo-priority');
  if (priorityEl.textContent == '') {
      priorityEl.textContent = 'Low';
      priorityEl.classList.add('todo-priority-low');
  }
  if (todo.priority === 'High') {
    priorityEl.classList.add('todo-priority-high');
  }
  if (todo.priority === 'Medium') {
    priorityEl.classList.add('todo-priority-medium');
  }
  if (todo.priority === 'Low') {
    priorityEl.classList.add('todo-priority-low');
  }
}

function togglePriority(todoContainer) {
  todoContainer.addEventListener('click', (e) => {
    if (e.target.matches('.todo-priority')) {
      priorityToggler(e);
    }
  });
}


function setupEventListenerForMarkAsDone (mainTodoArray) {
  const todoItems = document.querySelectorAll('.todo-item');

  todoItems.forEach((item, index) => {
    const todoDoneButton = item.querySelector('.todo-done');

    todoDoneButton.addEventListener('click', (e) => {
      markAsDone(e, mainTodoArray[index]);
    });
  });
}
 
function markAsDone(e, currentTodo) {
  const todoUl = e.target.closest('.todo-item');
  const descriptionLi = todoUl.querySelector('.todo-description');
  const todoTitleLi = todoUl.querySelector('.todo-title');
  
  if (e.target.classList.contains('todo-done')) {
    if (!currentTodo.isDone) {
      descriptionLi.style.textDecoration = 'line-through';
      todoTitleLi.style.textDecoration = 'line-through';
      currentTodo.isDone = true;
      console.log(currentTodo.isDone);
    } else {
      descriptionLi.style.textDecoration = 'none';
      todoTitleLi.style.textDecoration = 'none'; 
      currentTodo.isDone = false;
      console.log(currentTodo.isDone);
    }
  }
}



prepopulateDate();
submitToTodoContainer();
console.log(mainTodoArray);