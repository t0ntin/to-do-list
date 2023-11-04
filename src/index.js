import './style.css';
import { getPriority, prepopulateDate, deleteTodo, priorityToggler } from './logic';

// import Icon from './hamburger.jpg';

// const title = document.querySelector('.title');
// const myIcon = new Image();
// myIcon.src = Icon;
// title.append(myIcon);


// export const mainTodoObj = [{
//   description : "This is the description of what I have to do.",
//   dueDate:  "2023-11-02",
//   priority : "High",
//   todo:  "This is what I have to do."}];
export const mainTodoObj = [];

class Todo {
  constructor(todo, dueDate, priority, description) {
    this.todo = todo;
    this.dueDate = dueDate;
    this.priority = priority;
    this.description = description;
    this.isDone = false;
  }
}

function addTodo (todo, dueDate, priority, description) {
  const newToDo = new Todo (todo, dueDate, priority, description);
  mainTodoObj.push(newToDo);
}

function submitToTodoContainer () {
  let priority = getPriority();
  const todo = document.querySelector('#to-do');
  const dueDate = document.querySelector('#date');
  const description = document.querySelector('#description');
  // priorityContainer IS INSIDE THE MODAL, NOT INSIDE THE TODOS.
  const priorityContainer = document.querySelector('.priority-container');
  const createTodoButton = document.querySelector("#create-todo-btn");
  const todoContainer = document.querySelector('.todo-container');

  priorityContainer.addEventListener('click',  (e) =>  {
    priority = getPriority(e);
  });

  createTodoButton.addEventListener('click', (e)=> {
  e.preventDefault();
    addTodo(todo.value, dueDate.value, priority, description.value);
    renderTodos(todoContainer);
    togglePriority(todoContainer);
    setupEventListenerForMarkAsDone(mainTodoObj);

    console.log(mainTodoObj);
  });
}

function renderTodos() {
  const todoContainer = document.querySelector('.todo-container');
  todoContainer.innerHTML = '';
  for (const todo of mainTodoObj) {
    const todoUl = document.createElement('ul');
    todoUl.classList.add('todo-item');
    todoUl.innerHTML = `
      <li class="todo-title" contenteditable="true">${todo.todo}</li>
      <li class="todo-description" contenteditable="true">${todo.description}</li>
      <li class="todo-date">${todo.dueDate}</li>
      <li class="todo-priority">${todo.priority}</li>
      <li class="todo-delete"></li>
      <li class="todo-select">Select</li>
      <li class="todo-done">Done</li>
    `;
    setPriorityStyles(todo, todoUl);
    const deleteButton = createDeleteButton(todo, todoUl);
    todoUl.querySelector('.todo-delete').appendChild(deleteButton);
    todoUl.setAttribute('id', mainTodoObj.indexOf(todo));
    todoContainer.append(todoUl);
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


function setupEventListenerForMarkAsDone (mainTodoObj) {
  const todoItems = document.querySelectorAll('.todo-item');

  todoItems.forEach((item, index) => {
    const todoDoneButton = item.querySelector('.todo-done');

    todoDoneButton.addEventListener('click', (e) => {
      markAsDone(e, mainTodoObj[index]);
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

// function setUpEventListeners(mainTodoObj) {
//   const todoItems = document.querySelectorAll('.todo-item');

//   todoItems.forEach((item, index) => {
//     const todoDoneButton = item.querySelector('.todo-done');

//     todoDoneButton.addEventListener('click', (e) => {
//       markAsDone(e, mainTodoObj[index]);
//     });
//   });
// }

// function markAsDone(e, currentTodo) {
//   const todoUl = e.target.closest('.todo-item');
//   const descriptionLi = todoUl.querySelector('.todo-description');
//   const todoTitleLi = todoUl.querySelector('.todo-title');
  
//   if (e.target.classList.contains('todo-done')) {
//     if (!currentTodo.isDone) {
//       descriptionLi.style.textDecoration = 'line-through';
//       todoTitleLi.style.textDecoration = 'line-through';
//       currentTodo.isDone = true;
//       console.log(currentTodo.isDone);
//     } else {
//       descriptionLi.style.textDecoration = 'none';
//       todoTitleLi.style.textDecoration = 'none'; 
//       currentTodo.isDone = false;
//       console.log(currentTodo.isDone);
//     }
//   }
// }



prepopulateDate();
submitToTodoContainer();
console.log(mainTodoObj);