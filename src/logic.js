
import { projectArray,Todo, page, pushToProjectArray, renderProjectList, renderTodosInProjectArray, pushTodoToExistingProject, currentProject} from "./dom.js";
import {format, parseISO} from 'date-fns';


//PREPOPULATES DATE FIELDS
export function prepopulateDate() {
  document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const dateFormatted = format(today, "yyyy-MM-dd");
    document.getElementById('date').value = dateFormatted;
  });
} 


export function formatTodoDate(dateString) {
  const date = parseISO(dateString);
  const formattedDate = format(date, 'MMM-d');
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


export function getIndexAndCurrentTodo(target) {
  const todoItem = target.closest('.todo-item');
  if (todoItem) {
    const index = Array.from(page.todoContainer.children).indexOf(todoItem);
    // console.log(page.todoContainer.children);
    if (index !== -1 && currentProject) {
      const currentTodo = currentProject.projectItems[index];
      // console.log(page.todoContainer.children);
      return { index, currentTodo };
    }
  }
  return { index: -1, currentTodo: null };
}

page.todoContainer.addEventListener('click', togglePriority);


export function togglePriority(e) {
  if (e.target) {
    const priorityEl = e.target.closest('.todo-priority');
    if (priorityEl) {
          const { index, currentTodo } = getIndexAndCurrentTodo(e.target);
          if (currentTodo) {
            if (priorityEl.textContent === 'High') {
              priorityEl.textContent = 'Medium';
              priorityEl.classList.remove('todo-priority-high');
              priorityEl.classList.add('todo-priority-medium');
              currentProject.projectItems[index].priority = 'Medium';
            } else if (priorityEl.textContent === 'Medium') {
              priorityEl.textContent = 'Low';
              priorityEl.classList.remove('todo-priority-medium');
              priorityEl.classList.add('todo-priority-low');
              currentProject.projectItems[index].priority = 'Low';
            } else if (priorityEl.textContent === 'Low') {
              priorityEl.textContent = 'High';
              priorityEl.classList.remove('todo-priority-low');
              priorityEl.classList.add('todo-priority-high');
              currentProject.projectItems[index].priority = 'High';
            }
          }
        }
  }
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
  const untitledProjectExists = projectArray.find((project) => project.name === 'Untitled Project');
  let userInputProjectName = page.projectInput.value;
  let existingProject = projectArray.find((project) => project.name === userInputProjectName);
  console.log("projectArray at determineProject: " + projectArray);
  const newToDo = new Todo(page.todoInput.value, page.dueDateInput.value, priority);

  if (!existingProject && userInputProjectName) {
    existingProject = new Project(userInputProjectName);
    projectArray.push(existingProject);
  }

  if (userInputProjectName && existingProject && existingProject.addItem) {
    pushTodoToExistingProject(newToDo, existingProject);
    renderProjectList();
    togglePriority(page.todoContainer);
    renderTodosInProjectArray(existingProject.name);
  }

  if (!userInputProjectName && untitledProjectExists) {
    pushTodoToExistingProject(newToDo, untitledProjectExists);
    renderProjectList();
    togglePriority(page.todoContainer);
    renderTodosInProjectArray("Untitled Project");
  }

  if (!userInputProjectName && !untitledProjectExists) {
    pushToProjectArray("Untitled Project", newToDo);
    renderProjectList();
    togglePriority(page.todoContainer);
    renderTodosInProjectArray("Untitled Project");
  }
}



// export function determineProject(priority) {
//   const untitledProjectExists = projectArray.find((project) => project.name === 'Untitled Project');
//   let userInputProjectName = page.projectInput.value;
//   const existingProject = projectArray.find((project) => project.name === userInputProjectName);
//   if (existingProject) {
//     existingProject = new Project(existingProject.name);
//   }
//   const newToDo = new Todo(page.todoInput.value,page.dueDateInput.value, priority);
//   if (userInputProjectName && existingProject) {
//     pushTodoToExistingProject(newToDo,existingProject);
//     renderProjectList();
//     togglePriority(page.todoContainer);
//     renderTodosInProjectArray(existingProject.name);
//   }
//   if (userInputProjectName && !existingProject) {
//     pushToProjectArray(userInputProjectName, newToDo)
//     renderProjectList();
//     togglePriority(page.todoContainer);
//     renderTodosInProjectArray(userInputProjectName);
//   }
//   if (!userInputProjectName && untitledProjectExists){
//     pushTodoToExistingProject(newToDo, untitledProjectExists);
//     renderProjectList();
//     togglePriority(page.todoContainer);
//     renderTodosInProjectArray("Untitled Project");
//   } 
//   if (!userInputProjectName && !untitledProjectExists) {
//     pushToProjectArray("Untitled Project", newToDo)
//     renderProjectList();
//     togglePriority(page.todoContainer);
//     renderTodosInProjectArray("Untitled Project");
//   }
// }

function markAsDone(event) {
  const { index, currentTodo } = getIndexAndCurrentTodo(event.target);
    if (currentTodo) {
      const todoUl = page.todoContainer.children[index];
      // const descriptionLi = todoUl.querySelector('.todo-description');
      const todoTitleSpan = todoUl.querySelector('.todo-title-text');

      if (!currentTodo.isDone) {
        todoTitleSpan.classList.add('todo-marked-as-done');
        // descriptionLi.classList.add('todo-marked-as-done');
        currentTodo.isDone = true;
      } else {
        todoTitleSpan.classList.remove('todo-marked-as-done');
        // descriptionLi.classList.remove('todo-marked-as-done');
        currentTodo.isDone = false;
      }
      console.log('marked as done');
    }
}

page.todoContainer.addEventListener('click', function(event) {
  if (event.target.classList.contains('todo-done') || event.target.classList.contains('check-mark-svg')) {
    markAsDone(event);
  }
});


page.todoContainer.addEventListener('click', moveTodoItem);

function moveTodoItem(event) {
  const { index, currentTodo } = getIndexAndCurrentTodo(event.target);
  if (currentTodo) {
    if (event.target.classList.contains('todo-move')) {
      positionElement(event, '+58', '+100', page.todoContainer, page.moveDropDownContainer);
      page.moveDropDownContainer.innerHTML = '';
      const dropdownArray = projectArray.filter((project) => project.name !== currentProject.name);
      const dropdownTitle = document.createElement('div');
dropdownTitle.innerText = "Move this todo to:";
page.moveDropDownContainer.appendChild(dropdownTitle);
      dropdownArray.forEach((dropdownArrayItem) => {
        const moveDropdownItemEl = document.createElement('button');
        moveDropdownItemEl.innerText = dropdownArrayItem.name;
        moveDropdownItemEl.classList.add('move-dropdown-item-el');
        page.moveDropDownContainer.append(moveDropdownItemEl);
        moveDropdownItemEl.addEventListener('click', () => {
          const selectedProjectExists = projectArray.find((project) => project.name === dropdownArrayItem.name);
          if (selectedProjectExists) {
            selectedProjectExists.addItem(currentTodo);
            currentProject.removeItem(currentTodo);
            closePopupEl(page.moveDropDownContainer);
            renderTodosInProjectArray(currentProject);
          }
        });
      });

      showPopupEl(page.moveDropDownContainer);
    }
  }
}


page.todoContainer.addEventListener('click',  (event) => handleDateClick(event));


function handleDateClick(event) {
  if (event.target.classList.contains('todo-date')) {
    // const dateElement = event.target.classList.contains('todo-date');
    const { index, currentTodo } = getIndexAndCurrentTodo(event.target);
    console.log(currentTodo);
    console.log(index)
  console.log(event.target);
  
    showPopupEl(page.popUpCalendarEl);
    positionElement(event, '+15', '+23', page.todoContainer, page.popUpCalendarEl);  
    page.popUpCalendarEl.addEventListener('change',  function() {
      handleDateSelection(index, currentTodo);
    });
  }
}

function handleDateSelection( index, currentTodo) {
  console.log(currentTodo);
  console.log(index)
    let selectedDate = page.popUpCalendarEl.value;
    console.log(selectedDate);
    currentTodo.dueDate = selectedDate;
    closePopupEl(page.popUpCalendarEl);
    renderTodosInProjectArray(currentProject);
}

function showPopupEl(popupEl) {
  if (popupEl === null) {
    return;
  } else {
    popupEl.classList.add("active");
    page.overlayEl.classList.add("active");
    page.overlayEl.addEventListener('click', () => closePopupEl(popupEl));
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
    popupEl.classList.remove('active');
    page.overlayEl.classList.remove('active');
  }
}

page.todoContainer.addEventListener('input', (event) => handleTodoUpdate(event));

function handleTodoUpdate(event) {
  if (event.target.classList.contains('todo-title')) {
    const { index, currentTodo } = getIndexAndCurrentTodo(event.target);
      currentTodo.todo = event.target.innerText;
  }
}


page.plusButtonContainer.addEventListener('click', handlePlusClick);

function handlePlusClick(event) {
  if (event.target.classList.contains('plus-svg')) {
    showPopupEl(page.modalEl);
  }
}

document.addEventListener('click', (event) => {
  if (event.target === page.closeModalButton) {
    closePopupEl(page.modalEl);
  }
})