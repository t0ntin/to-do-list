

import { mainTodoObj } from ".";


export function renderTodos() {
  const todoContainer = document.querySelector('.todo-container');
  todoContainer.innerHTML = '';
  for (const todo of mainTodoObj) {
    todoContainer.innerHTML += `    
    <ul class="todo-item">
    <li class="todo-title">${todo.todo}</li>
    <li class="todo-description">${todo.description}</li>
    <li class="todo-date">${todo.dueDate}</li>
    <li class="todo-priority">${todo.priority}</li>
    <li class="todo-delete">Delete</li>
    <li class="todo-select">Select</li>
    <li class="todo-done">Done</li>
  </ul>`

  }
}