import {
  projectArray,
  Project,
  Todo,
  page,
  pushToProjectArray,
  renderProjectList,
  renderTodosInProjectArray,
  pushTodoToExistingProject,
  currentProject,
  makeElement,
  saveToLocalStorage,
} from "./dom.js";
import { format, parseISO } from "date-fns";

//PREPOPULATES DATE FIELD
export function prepopulateDate() {
  document.addEventListener("DOMContentLoaded", function () {
    const today = new Date();
    const dateFormatted = format(today, "yyyy-MM-dd");
    document.getElementById("date").value = dateFormatted;
  });
}

export function formatTodoDate(dateString) {
  const date = parseISO(dateString);
  const formattedDate = format(date, "MMM-d");
  return formattedDate;
}

// Was getting an error here when I was just using e.preventdefault(); I also had to add (e) to getpriority and to the event listener function: The error is due to calling preventDefault() on the event object even before ensuring its existence. Since not all events come with a preventDefault method, you should check if it exists before calling it.
export function getPriority(e) {
  if (e) {
    e.preventDefault();
    let priority = "Low";
    if (e.target.getAttribute("id") === "high") {
      priority = "High";
    }
    if (e.target.getAttribute("id") === "medium") {
      priority = "Medium";
    }
    return { priority };
  }
  return { priority };
}

export function getIndexAndCurrentTodo(target) {
  const todoItem = target.closest(".todo-item");

  if (todoItem) {
    const index = Array.from(page.todoContainer.children).indexOf(todoItem);

    if (index !== -1 && currentProject) {
      // Find the project in projectArray that matches the currentProject name
      const matchingProject = projectArray.find(
        (project) => project.name === currentProject
      );

      if (matchingProject) {
        // Access the projectItems property and get the currentTodo
        const currentTodo = matchingProject.projectItems[index];

        if (currentTodo) {
          return { index, currentTodo };
        } else {
          console.error("Current Todo is undefined.");
        }
      } else {
        console.error("Matching project not found in projectArray.");
      }
    }
  }

  return { index: -1, currentTodo: null };
}

page.todoContainer.addEventListener("click", togglePriority);

export function togglePriority(e) {
  const matchingProject = projectArray.find(
    (project) => project.name === currentProject
  );
  if (e.target) {
    const priorityEl = e.target.closest(".todo-priority");
    if (priorityEl) {
      const { index } = getIndexAndCurrentTodo(e.target);
      if (priorityEl.textContent === "High") {
        priorityEl.textContent = "Medium";
        priorityEl.classList.remove("todo-priority-high");
        priorityEl.classList.add("todo-priority-medium");
        matchingProject.projectItems[index].priority = "Medium";
      } else if (priorityEl.textContent === "Medium") {
        priorityEl.textContent = "Low";
        priorityEl.classList.remove("todo-priority-medium");
        priorityEl.classList.add("todo-priority-low");
        matchingProject.projectItems[index].priority = "Low";
      } else if (priorityEl.textContent === "Low") {
        priorityEl.textContent = "High";
        priorityEl.classList.remove("todo-priority-low");
        priorityEl.classList.add("todo-priority-high");
        matchingProject.projectItems[index].priority = "High";
      }
    }
    saveToLocalStorage();
  }
}

// INSIDE renderTodos();
export function setPriorityStyles(todo, todoUl) {
  const priorityEl = todoUl.querySelector(".todo-priority");
  if (priorityEl.textContent == "") {
    priorityEl.textContent = "Low";
    priorityEl.classList.add("todo-priority-low");
  }
  if (todo.priority === "High") {
    priorityEl.classList.add("todo-priority-high");
  }
  if (todo.priority === "Medium") {
    priorityEl.classList.add("todo-priority-medium");
  }
  if (todo.priority === "Low") {
    priorityEl.classList.add("todo-priority-low");
  }
}

export function determineProject(priority) {
  const untitledProjectExists = projectArray.find(
    (project) => project.name === "Untitled Project"
  );
  let userInputProjectName = page.projectInput.value;
  let existingProject = projectArray.find(
    (project) => project.name === userInputProjectName
  );
  // console.log( existingProject);
  const newToDo = new Todo(
    page.todoInput.value,
    page.dueDateInput.value,
    priority
  );

  if (!existingProject && userInputProjectName) {
    // console.log("firing 1");
    existingProject = new Project(userInputProjectName);
    projectArray.push(existingProject);
  }

  if (userInputProjectName && existingProject && existingProject.addItem) {
    // console.log("firing 2");
    pushTodoToExistingProject(newToDo, existingProject);
    renderProjectList();
    togglePriority(page.todoContainer);
    renderTodosInProjectArray(existingProject.name);
  }

  if (!userInputProjectName && untitledProjectExists) {
    // console.log("firing 3");
    pushTodoToExistingProject(newToDo, untitledProjectExists);
    renderProjectList();
    togglePriority(page.todoContainer);
    renderTodosInProjectArray("Untitled Project");
  }

  if (!userInputProjectName && !untitledProjectExists) {
    // console.log("firing 4");
    pushToProjectArray("Untitled Project", newToDo);
    renderProjectList();
    togglePriority(page.todoContainer);
    renderTodosInProjectArray("Untitled Project");
  }
  saveToLocalStorage();
}

function markAsDone(event) {
  const { index, currentTodo } = getIndexAndCurrentTodo(event.target);
  if (currentTodo) {
    const todoUl = page.todoContainer.children[index];
    console.log(todoUl);
    const todoTitleSpan = todoUl.querySelector(".todo-title-text");

    if (!currentTodo.isDone) {
      currentTodo.isDone = true;
      todoTitleSpan.classList.add("todo-marked-as-done");
      saveToLocalStorage();
    } else {
      console.log("Before applying class");
      todoTitleSpan.classList.remove("todo-marked-as-done");
      console.log("After applying class");
      currentTodo.isDone = false;
      console.log("marked as done removed");
      saveToLocalStorage();
    }
    console.log(projectArray);
  }
  console.log(currentTodo.isDone);
}

page.todoContainer.addEventListener("click", function (event) {
  if (
    event.target.classList.contains("todo-done") ||
    event.target.classList.contains("check-mark-svg")
  ) {
    markAsDone(event);
  }
});

page.todoContainer.addEventListener("click", moveTodoItem);

function moveTodoItem(event) {
  const { index, currentTodo } = getIndexAndCurrentTodo(event.target);
  if (currentTodo) {
    if (event.target.classList.contains("todo-move")) {
      positionElement(
        event,
        "+58",
        "+100",
        page.todoContainer,
        page.moveDropDownContainer
      );
      page.moveDropDownContainer.innerHTML = "";
      const dropdownArray = projectArray.filter(
        (project) => project.name !== currentProject
      );
      const dropdownTitle = makeElement(
        "div",
        "no-class",
        page.moveDropDownContainer,
        "Move this todo to:"
      );
      dropdownArray.forEach((dropdownArrayItem) => {
        const moveDropdownItemEl = makeElement(
          "button",
          "move-dropdown-item-el",
          page.moveDropDownContainer,
          dropdownArrayItem.name
        );
        moveDropdownItemEl.addEventListener("click", () => {
          const selectedProjectExists = projectArray.find(
            (project) => project.name === dropdownArrayItem.name
          );
          if (selectedProjectExists) {
            const matchingProject = projectArray.find(
              (project) => project.name === currentProject
            );
            console.log(selectedProjectExists);
            selectedProjectExists.addItem(currentTodo);
            matchingProject.removeItem(currentTodo);
            closePopupEl(page.moveDropDownContainer);
            renderTodosInProjectArray(currentProject);
            saveToLocalStorage();
          }
        });
      });

      showPopupEl(page.moveDropDownContainer);
    }
  }
}

page.todoContainer.addEventListener("click", (event) => handleDateClick(event));

function handleDateClick(event) {
  if (event.target.classList.contains("todo-date")) {
    const { index, currentTodo } = getIndexAndCurrentTodo(event.target);

    // Create a unique ID for the calendar element based on the todo index
    const calendarId = `popUpCalendar_${index}`;

    // Check if the calendar element already exists, if not, create it
    if (!document.getElementById(calendarId)) {
      const calendarElement = makeElement(
        "input",
        "popup-calendar",
        document.body
      );
      calendarElement.type = "date";
      calendarElement.id = calendarId;
    }

    // Show the unique calendar element
    showPopupEl(document.getElementById(calendarId));

    // Position the calendar element
    positionElement(
      event,
      "+15",
      "+23",
      page.todoContainer,
      document.getElementById(calendarId)
    );

    // Add an event listener to handle date selection
    document.getElementById(calendarId).addEventListener("change", function () {
      handleDateSelection(index, currentTodo);
    });
  }
}

function handleDateSelection(index, currentTodo) {
  const selectedDate = document.getElementById(`popUpCalendar_${index}`).value;
  currentTodo.dueDate = selectedDate;
  closePopupEl(document.getElementById(`popUpCalendar_${index}`));
  renderTodosInProjectArray(currentProject);
  saveToLocalStorage();
}

function showPopupEl(popupEl) {
  if (popupEl === null) {
    return;
  } else {
    popupEl.classList.add("active");
    page.overlayEl.classList.add("active");
    page.overlayEl.addEventListener("click", () => closePopupEl(popupEl));
  }
}

function positionElement(event, scrollY, scrollX, containerEl, element) {
  const elementRect = event.target.getBoundingClientRect();
  const topOffset = elementRect.bottom + window.scrollY + parseInt(scrollY);
  const leftOffset = elementRect.left + window.scrollX + parseInt(scrollX);
  containerEl.append(element);
  element.style.top = `${topOffset}px`;
  element.style.left = `${leftOffset}px`;
}

export function closePopupEl(popupEl) {
  if (popupEl === null) {
    return;
  } else {
    popupEl.classList.remove("active");
    page.overlayEl.classList.remove("active");
  }
}

page.todoContainer.addEventListener("input", (event) =>
  handleTodoUpdate(event)
);

function handleTodoUpdate(event) {
  if (event.target.classList.contains("todo-title")) {
    const { index, currentTodo } = getIndexAndCurrentTodo(event.target);
    currentTodo.todo = event.target.innerText;
  }
  saveToLocalStorage();
}

page.plusButtonContainer.addEventListener("click", handlePlusClick);

function handlePlusClick(event) {
  if (event.target.classList.contains("plus-svg")) {
    showPopupEl(page.modalEl);
  }
}

document.addEventListener("click", (event) => {
  if (event.target === page.closeModalButton) {
    closePopupEl(page.modalEl);
  }
});
