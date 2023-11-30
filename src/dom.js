import {
  getPriority,
  formatTodoDate,
  determineProject,
  setPriorityStyles,
  closePopupEl,
} from "./logic";
import trashImage from "./images/delete.svg";
import checkMarkImage from "./images/check.svg";
import plusImage from "./images/plus.svg";

function myPage() {
  const mainEl = document.querySelector(".main");
  const projectInput = document.querySelector("#project-input");
  const todoInput = document.querySelector("#to-do");
  const dueDateInput = document.querySelector("#date");
  // priorityContainer IS INSIDE THE MODAL, NOT INSIDE THE TODOS.
  const priorityContainer = document.querySelector(".priority-container");
  const createTodoButton = document.querySelector("#create-todo-btn");
  const todoContainer = document.querySelector(".todo-container");
  const bottomControlsCont = document.querySelector(".bottom-controls");

  const moveDropDownContainer = document.createElement("div");
  moveDropDownContainer.classList.add("dropdown-container");

  const popUpCalendarEl = document.createElement("input");
  popUpCalendarEl.type = "date";
  popUpCalendarEl.classList.add("popup-calendar");

  const overlayEl = document.querySelector("#overlay");

  const projectListContainer = document.querySelector(
    ".project-list-container"
  );
  const plusButtonContainer = document.querySelector(".plus-button-container");

  const modalEl = document.querySelector(".modal");

  const closeModalButton = document.querySelector(".close-modal-button");
  const errorMessageContainer = document.querySelector(".error-msg-container");

  return {
    projectInput,
    todoInput,
    dueDateInput,
    priorityContainer,
    createTodoButton,
    todoContainer,
    bottomControlsCont,
    moveDropDownContainer,
    popUpCalendarEl,
    overlayEl,
    projectListContainer,
    plusButtonContainer,
    modalEl,
    closeModalButton,
    errorMessageContainer,
  };
}

export const page = myPage();

// export let projectArray =  JSON.parse(localStorage.getItem('projects')) || [];

const storedCurrentProject = localStorage.getItem("currentProject");
export let currentProject = storedCurrentProject || null;

export function saveToLocalStorage() {
  // Here, we are "serializing" the object.
  localStorage.setItem("projects", JSON.stringify(projectArray));
}

function saveCurrentProjectToLocalStorage() {
  // const timestamp = new Date().toISOString();
  localStorage.setItem("currentProject", currentProject);
}

export class Project {
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
  static createFromObject(projectObject) {
    const project = new Project(projectObject.name);
    projectObject.projectItems.forEach((todoItem) => project.addItem(todoItem));
    return project;
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

const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
export let projectArray = storedProjects.map(Project.createFromObject);

export function pushToProjectArray(name, projectItem) {
  const newProject = new Project(name);
  newProject.addItem(projectItem);
  projectArray.push(newProject);
  currentProject = newProject.name;
  console.log(currentProject);
  localStorage.setItem("currentProject", newProject.name);
}

export function pushTodoToExistingProject(newToDo, existingProject) {
  existingProject.addItem(newToDo);
  currentProject = existingProject.name;
  console.log(currentProject);
  localStorage.setItem("currentProject", existingProject.name);
  console.log(existingProject);
  console.log(projectArray);
}

export function submitToTodoContainer() {
  let priority = "Low";
  page.priorityContainer.addEventListener("click", (e) => {
    priority = getPriority(e).priority;
  });
  page.createTodoButton.addEventListener("click", (e) => {
    e.preventDefault();
    determineProject(priority);
    styleCurrentProjectonProjectList();
    saveToLocalStorage();
    closePopupEl(page.modalEl);
  });
}

export function makeElement(elementTag, className, appendToEl, textInside) {
  const element = document.createElement(elementTag);
  element.classList.add(className);
  if (appendToEl) {
    appendToEl.append(element);
  }
  if (textInside) {
    element.innerText = textInside;
  }
  return element;
}

export function renderProjectList() {
  page.projectListContainer.innerHTML = "";
  for (const project of projectArray) {
    const projectEl = makeElement(
      "li",
      "project-name-element",
      page.projectListContainer
    );
    const trashSVG = new Image();
    trashSVG.src = trashImage;
    trashSVG.classList.add("project-list-trash-svg");
    // The image would not append the normal way. I had to use this createTextNode function.
    projectEl.appendChild(document.createTextNode(project.name));
    projectEl.append(trashSVG);
    // projectEl.innerText = project.name;
    projectEl.addEventListener("click", () => {
      renderTodosInProjectArray(project.name);
      currentProject = project.name;
      saveCurrentProjectToLocalStorage();
      // localStorage.setItem('currentProject', currentProject);
      console.log(currentProject);
      styleCurrentProjectonProjectList();
    });
    trashSVG.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteProject(projectEl, project);
    });
  }
}

function deleteProject(projectEl, project) {
  const userWantsToDelete = confirm(
    "Do you really want to delete this project?"
  );

  if (!userWantsToDelete) {
    return;
  } else {
    if (projectEl.innerText === project.name) {
      const projectIndex = projectArray.findIndex(
        (p) => p.name === project.name
      );

      if (projectIndex !== -1) {
        projectArray.splice(projectIndex, 1); // Modifying projectArray directly

        projectEl.remove();
        renderProjectList();
        saveToLocalStorage();
        renderTodosInProjectArray(currentProject);
        // If there are remaining projects, set the first one as the current project
        if (projectArray.length > 0) {
          const firstProject = projectArray[0];
          currentProject = firstProject.name;
          saveToLocalStorage();
          console.log("Current project before saving:", currentProject);
          // saveCurrentProjectToLocalStorage();
          localStorage.setItem("currentProject", currentProject);
          styleCurrentProjectonProjectList();
          renderTodosInProjectArray(currentProject);
        }
      }
      console.log(projectArray);
    }
  }
}

export function createPlusButton() {
  const plusSVG = new Image();
  plusSVG.src = plusImage;
  page.plusButtonContainer.append(plusSVG);
  plusSVG.classList.add("plus-svg");
}

export function styleCurrentProjectonProjectList(selectedProjectExists) {
  // const currentProjectName = currentProject;
  const projectListContainer = document.querySelector(
    ".project-list-container"
  );
  const projectListItems = Array.from(projectListContainer.children);
  for (const projectListItem of projectListItems) {
    projectListItem.classList.remove("current-project-styles");
    if (projectListItem.innerText === currentProject) {
      projectListItem.classList.add("current-project-styles");
    }
  }
}

export function renderTodosInProjectArray(projectName) {
  page.todoContainer.innerHTML = "";

  if (!projectName) {
    console.log("No project name found. Rendering empty page.");
    return;
  }

  const project = projectArray.find((p) => p.name === projectName);

  if (!project) {
    console.log(`Project not found: ${projectName}`);
    return;
  }

  if (project.projectItems && Array.isArray(project.projectItems)) {
    for (const todoItem of project.projectItems) {
      const todoUl = document.createElement("ul");
      todoUl.classList.add("todo-item");
      const formattedDate = formatTodoDate(todoItem.dueDate);
      todoUl.innerHTML = `
      <li class="todo-title" contenteditable="true">
      <span class="todo-title-text ${
        todoItem.isDone ? "todo-marked-as-done" : ""
      }">
        ${todoItem.todo}</span></li>
        <li class="todo-date">${formattedDate}</li>
        <li class="todo-priority">${todoItem.priority}</li>
        <li class="todo-move">Move to:</li>
      `;
      setPriorityStyles(todoItem, todoUl);
      const doneButtonEl = createDoneButton(todoUl);
      const deleteButton = createTodoDeleteButton(todoItem, todoUl, project);
      todoUl.setAttribute("id", project.projectItems.indexOf(todoItem));
      page.todoContainer.append(todoUl);
    }
  } else {
    console.log(`Invalid project or projectItems: ${JSON.stringify(project)}`);
  }
}

function createTodoDeleteButton(todo, todoUl, project) {
  const deleteButtonEl = makeElement("li", "todo-delete", todoUl);
  const trashSVG = new Image();
  trashSVG.src = trashImage;
  deleteButtonEl.append(trashSVG);
  trashSVG.classList.add("trash-svg");

  deleteButtonEl.addEventListener("click", () => {
    const userWantsToDelete = confirm(
      "Do you really want to delete this item?"
    );
    if (userWantsToDelete && project) {
      project.removeItem(todo);
      // Update 'projects' key in localStorage with the modified projectArray
      // Remove the todo from the DOM
      todoUl.remove();
      console.log(projectArray);
    }
  });
  return deleteButtonEl;
}

// For some reason, the image wasn't appending, and I had to add this "onload" check.
function createDoneButton(todoUl) {
  const doneButtonEl = makeElement("li", "todo-done", todoUl);
  const checkMark = new Image();
  checkMark.onload = function () {
    doneButtonEl.append(checkMark);
  };
  checkMark.src = checkMarkImage;
  checkMark.classList.add("check-mark-svg");
  doneButtonEl.innerText = "Done";

  return doneButtonEl;
}
