

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




function getIndexAndCurrentTodo(target) {
  const todoItem = target.closest('.todo-item');
  if (todoItem) {
    const index = Array.from(page.todoContainer.children).indexOf(todoItem);
    console.log(page.todoContainer.children);

    if (index !== -1 && currentProject) {
      const currentTodo = currentProject.projectItems[index];
      return { index, currentTodo };
    }
  }
  return { index: -1, currentTodo: null };
}


// export function priorityToggler(e) {
//   console.log('priorityToggler triggered');
//   // e.preventDefault();
//   // e.stopPropagation();
//   const { index, currentTodo } = getIndexAndCurrentTodo(e.target, currentProject);

//   if (currentTodo) {
//     if (e.target.classList.contains('todo-priority')) {
//       const priorityEl = e.target;

//       if (priorityEl.textContent === 'High') {
//         priorityEl.textContent = 'Medium';
//         priorityEl.classList.remove('todo-priority-high');
//         priorityEl.classList.add('todo-priority-medium');
//         currentTodo.priority = 'Medium';
//       } else if (priorityEl.textContent === 'Medium') {
//         priorityEl.textContent = 'Low';
//         priorityEl.classList.remove('todo-priority-medium');
//         priorityEl.classList.add('todo-priority-low');
//         currentTodo.priority = 'Low';
//       } else if (priorityEl.textContent === 'Low') {
//         priorityEl.textContent = 'High';
//         priorityEl.classList.remove('todo-priority-low');
//         priorityEl.classList.add('todo-priority-high');
//         currentTodo.priority = 'High';
//       }
//     }
//   }
// }





// export function priorityToggler(e) {

//   console.log('priorityToggler triggered');

//   const { index, currentTodo } = getIndexAndCurrentTodo(e.target);
//       if (currentTodo) {
        
//         if (e.target.classList.contains('todo-priority')) {
//           const priorityEl = e.target;
      
//           if (priorityEl.textContent === 'High') {
//             priorityEl.textContent = 'Medium';
//             priorityEl.classList.remove('todo-priority-high');
//             priorityEl.classList.add('todo-priority-medium');
//             currentProject.projectItems[index].priority = 'Medium';
//           } else if (priorityEl.textContent === 'Medium') {
//             priorityEl.textContent = 'Low';
//             priorityEl.classList.remove('todo-priority-medium');
//             priorityEl.classList.add('todo-priority-low');
//             currentProject.projectItems[index].priority = 'Low';
//           } else if (priorityEl.textContent === 'Low') {
//             priorityEl.textContent = 'High';
//             priorityEl.classList.remove('todo-priority-low');
//             priorityEl.classList.add('todo-priority-high');
//             currentProject.projectItems[index].priority = 'High';
//           }
//         }
//       }
// }

page.todoContainer.addEventListener('click', togglePriority);


export function togglePriority(e) {
  console.log('togglePriority triggered');
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
  const existingProject = projectArray.find((project) => project.name === userInputProjectName);
  const newToDo = new Todo(page.todoInput.value,page.dueDateInput.value, priority, page.descriptionInput.value);
  if (userInputProjectName && existingProject) {
    pushTodoToExistingProject(newToDo,existingProject);
    renderProjectList();
    togglePriority(page.todoContainer);
    renderTodosInProjectArray(existingProject.name);
  }
  if (userInputProjectName && !existingProject) {
    pushToProjectArray(userInputProjectName, newToDo)
    renderProjectList();
    togglePriority(page.todoContainer);
    renderTodosInProjectArray(userInputProjectName);
  }
  if (!userInputProjectName && untitledProjectExists){
    pushTodoToExistingProject(newToDo, untitledProjectExists);
    renderProjectList();
    togglePriority(page.todoContainer);
    renderTodosInProjectArray("Untitled Project");
  } 
  if (!userInputProjectName && !untitledProjectExists) {
    pushToProjectArray("Untitled Project", newToDo)
    renderProjectList();
    togglePriority(page.todoContainer);
    renderTodosInProjectArray("Untitled Project");
  }
  
}




function markAsDone(event) {
  const { index, currentTodo } = getIndexAndCurrentTodo(event.target);
    if (currentTodo) {
      const todoUl = page.todoContainer.children[index];
      const descriptionLi = todoUl.querySelector('.todo-description');
      const todoTitleLi = todoUl.querySelector('.todo-title');

      if (!currentTodo.isDone) {
        todoTitleLi.classList.add('todo-marked-as-done');
        descriptionLi.classList.add('todo-marked-as-done');
        currentTodo.isDone = true;
      } else {
        todoTitleLi.classList.remove('todo-marked-as-done');
        descriptionLi.classList.remove('todo-marked-as-done');
        currentTodo.isDone = false;
      }
      console.log('marked as done');
    }
}

page.todoContainer.addEventListener('click', function(event) {
  if (event.target.classList.contains('todo-done')) {
    markAsDone(event);
  }
});



page.todoContainer.addEventListener('click', moveTodoItem);


function moveTodoItem (event) {
  const { index, currentTodo } = getIndexAndCurrentTodo(event.target);
  if (currentTodo) {
    if (event.target.classList.contains('todo-move')) {
        const moveDropDownContainer = document.createElement('div');
        moveDropDownContainer.classList.add('dropdown-container')
        moveDropDownContainer.innerText = "Move this todo to:"
        page.todoContainer.append(moveDropDownContainer);
        const dropdownArray = projectArray.filter((project) => project.name !== currentProject.name);
        dropdownArray.forEach((dropdownArrayItem)  => {
          const moveDropDownEl = document.createElement('button');
          moveDropDownEl.classList.add('dropdown-button')
          moveDropDownEl.innerText = dropdownArrayItem.name;
          moveDropDownContainer.append(moveDropDownEl);
          moveDropDownEl.addEventListener('click', () => {
              const selectedProjectExists = projectArray.find((project) => project.name === dropdownArrayItem.name);
              console.log(selectedProjectExists);
              if (selectedProjectExists) {
                selectedProjectExists.addItem(currentTodo);
                currentProject.removeItem(currentTodo);
                renderTodosInProjectArray(currentProject);
                console.log(projectArray);
              }
          })
        })
    }
  }

}



