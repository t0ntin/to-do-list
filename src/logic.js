

import { mainTodoArray, projectArray,Todo, page, pushToMainTodoArray, pushToProjectArray, renderTodos, renderProjectList, renderTodosInProjectArray } from "./dom.js";
import {format} from 'date-fns';


//PREPOPULATES DATE FIELDS
export function prepopulateDate() {
  document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const dateFormatted = format(today, "yyyy-MM-dd");
    document.getElementById('date').value = dateFormatted;
  });
} 
export function formatTodoDate(dateString) {
  const date = new Date(dateString);
  const formattedDate = format(date, 'MMM d');
  return formattedDate;
}

// Was getting an error here when I was just using e.preventdefault(); I also had to add (e) to getpriority and to the event listener function: The error is due to calling preventDefault() on the event object even before ensuring its existence. Since not all events come with a preventDefault method, you should check if it exists before calling it.
export function getPriority(e) {
  if (e) {
    e.preventDefault();
    let priority = 'Low';
  if (e.target.getAttribute('id') === 'high' ) {
    priority = 'High';    
  }
  if (e.target.getAttribute('id') === 'medium' ) {
    priority = 'Medium';
  }
  return {priority};
} 
return {priority};
}

export function deleteTodo(todo) {
  const index = mainTodoArray.indexOf(todo);
  if (index > -1) {
    // "1" specifies the number of elements to be removed.
    mainTodoArray.splice(index, 1);
    console.log(mainTodoArray);
  }
}

export function priorityToggler(e) {
  if (e.target.classList.contains('todo-priority')) {
    const priorityEl = e.target;

    if (priorityEl.textContent === 'High') {
      priorityEl.textContent = 'Medium';
      priorityEl.classList.remove('todo-priority-high');
      priorityEl.classList.add('todo-priority-medium');
    } else if (priorityEl.textContent === 'Medium') {
      priorityEl.textContent = 'Low';
      priorityEl.classList.remove('todo-priority-medium');
      priorityEl.classList.add('todo-priority-low');
    } else if (priorityEl.textContent === 'Low') {
      priorityEl.textContent = 'High';
      priorityEl.classList.remove('todo-priority-low');
      priorityEl.classList.add('todo-priority-high');
    }
  }
}

function togglePriority(todoContainer) {
  todoContainer.addEventListener('click', (e) => {
    if (e.target.matches('.todo-priority')) {
      priorityToggler(e);
    }
  });
}

// INSIDE renderTodos();
export function setPriorityStyles(todo, todoUl) {
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


export function determineProject(priority) {
  if (page.projectInput.value.trim() === '') {
    pushToMainTodoArray(
      page.todoInput.value, page.dueDateInput.value, priority, page.descriptionInput.value
    );
    renderTodos(page.todoContainer);
    togglePriority(page.todoContainer);
  } else {
    const newToDo = new Todo(page.todoInput.value,page.dueDateInput.value, priority, page.descriptionInput.value
    );
    const projectName = page.projectInput.value;
    pushToProjectArray(projectName, newToDo);

    // Find the project object from projectArray based on the project name
    const selectedProject = projectArray.find((project) => project.name === projectName);

    // Check if the selected project is defined before rendering
    if (selectedProject) {
      renderProjectList();
      togglePriority(page.todoContainer);
      renderTodosInProjectArray(selectedProject);
    } else {
      console.error("The selected project is not found in the projectArray.");
    }
  }
}

  page.todoContainer.addEventListener('click', function(event) {
    if (event.target.classList.contains('todo-done')) {
      const todoItem = event.target.closest('.todo-item');
      if (todoItem) {
        const index = Array.from(page.todoContainer.children).indexOf(todoItem);
        console.log(index);
        if (index > -1) {
          const currentArray = mainTodoArray.length > index ? mainTodoArray : projectArray;
          const currentTodo = currentArray[index];
          markAsDone(event, currentTodo);
        }
      }
    }
  });

function markAsDone(e, currentTodo) {
  const todoUl = e.target.closest('.todo-item');
  const descriptionLi = todoUl.querySelector('.todo-description');
  const todoTitleLi = todoUl.querySelector('.todo-title');
  if (e.target.classList.contains('todo-done')) {
    if (!currentTodo.isDone) {

      todoTitleLi.classList.add('todo-marked-as-done');
      descriptionLi.classList.add('todo-marked-as-done');
      currentTodo.isDone = true;
    } else {

      todoTitleLi.classList.remove('todo-marked-as-done');
      descriptionLi.classList.remove('todo-marked-as-done');
      currentTodo.isDone = false;
    }
  }
}
