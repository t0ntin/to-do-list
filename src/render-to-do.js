

import { mainTodoObj } from ".";


export function renderTodos() {
  const main = document.querySelector('.main');
  main.innerHTML = '';
  for (const todo of mainTodoObj) {
    main.innerHTML += `    
    <ul class="todo-item">
    <li class="todo-title">${todo.todo}</li>
    <li class="todo-description">${todo.description}</li>
    <li class="todo-date">${todo.dueDate}</li>
    <li class="todo-priority">${todo.priority}</li>
  </ul>`

  }
}