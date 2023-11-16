
import { getPriority, formatTodoDate, deleteTodo, determineProject,setPriorityStyles } from './logic';



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
export let currentProject;

export const projectArray = [];

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
    console.log(mainTodoArray);
  }
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
  console.log('Before rendering todos:', projectArray, projectNameOrObject);

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
      console.log('Project found:', project);
      console.log(projectArray);
      console.log('Type of projectItems:', typeof project.projectItems);
      console.log('Type of projectItems:', Array.isArray(project.projectItems) ? 'Array' : 'Not an Array');



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
        <li class="todo-select">Select</li>
        <li class="todo-done">Done</li>
        `;
        setPriorityStyles(todoItem, todoUl);
        const deleteButton = createDeleteButton(todoItem, todoUl);
        todoUl.querySelector('.todo-delete').appendChild(deleteButton);
        todoUl.setAttribute('id', project.projectItems.indexOf(todoItem));
        page.todoContainer.append(todoUl);
      }
    } else {
      console.log(project); // This will log the project object
    }
  // } else {
  //   console.error(`Invalid project name: ${projectName}`);
  // }
}

// export function renderTodosInProjectArray(projectName) {
//   page.todoContainer.innerHTML = '';
//   console.log('Before rendering todos:', projectArray, projectName);

//   if (typeof projectName === 'string') {
//     const project = projectArray.find((project) => project.name === projectName);

//     if (project) {
//       console.log('Project found:', project);
//       console.log(projectArray);

//       for (const todoItem of project.projectItems) {

//         const todoUl = document.createElement('ul');
//         todoUl.classList.add('todo-item');
//         const formattedDate = formatTodoDate(todoItem.dueDate);
//         todoUl.innerHTML = `
//         <li class="todo-title ${todoItem.isDone ? 'todo-marked-as-done' : ''}" contenteditable="true">${todoItem.todo}</li>
//         <li class="todo-description ${todoItem.isDone ? 'todo-marked-as-done' : ''}" contenteditable="true">${todoItem.description}</li>
//         <li class="todo-date">${formattedDate}</li>
//         <li class="todo-priority">${todoItem.priority}</li>
//         <li class="todo-delete"></li>
//         <li class="todo-select">Select</li>
//         <li class="todo-done">Done</li>
//       `;
//         setPriorityStyles(todoItem, todoUl);
//         const deleteButton = createDeleteButton(todoItem, todoUl);
//         todoUl.querySelector('.todo-delete').appendChild(deleteButton);
//         todoUl.setAttribute('id', project.projectItems.indexOf(todoItem));
//         page.todoContainer.append(todoUl);
//       }
//     } else {
//       console.log(project); // This will log the project object
//     }
//   } else {
//     console.error(`Invalid project name: ${projectName}`);
//   }
// }



function createDeleteButton(todo, todoUl) {
  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Delete';
  deleteButton.addEventListener('click', () => {
      deleteTodo(todo);
      todoUl.remove();
    console.log(projectArray);

    });
  return deleteButton;
}