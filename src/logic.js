

import { mainTodoObj } from ".";



//PREPOPULATES DATE FIELDS
export function prepopulateDate() {
  document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    
    const formattedToday = `${yyyy}-${mm}-${dd}`;
    document.getElementById('date').value = formattedToday;
  });
}

// Was getting an error here when I was just using e.preventdefault(); I also had to add (e) to getpriority and to the event listener function: The error is due to calling preventDefault() on the event object even before ensuring its existence. Since not all events come with a preventDefault method, you should check if it exists before calling it.
export function getPriority(e) {
  if (e) {
    e.preventDefault();
  let priority = '';
  if (e.target.getAttribute('id') === 'high' ) {
    priority = 'High';    
  }
  if (e.target.getAttribute('id') === 'medium' ) {
    priority = 'Medium';
  }
  if (e.target.getAttribute('id') === 'low' ) {
    priority = 'Low';
  }
  return priority;
} 
return '';
}

export function deleteTodo(todo) {
  const index = mainTodoObj.indexOf(todo);
  if (index > -1) {
    // "1" specifies the number of elements to be removed.
    mainTodoObj.splice(index, 1);
    console.log(mainTodoObj);
  }
}

// export function priorityToggler(e) {
//   if (e.target.classList.contains('todo-priority')) {
//   const priorityEl = e.target;
//   if (priorityEl.textContent === 'High') {
//     priorityEl.textContent = 'Medium';
//     priorityEl.classList.add('todo-priority-medium');
//   } else if (priorityEl.textContent === 'Medium') {
//     priorityEl.textContent = 'Low';
//     priorityEl.classList.add('todo-priority-low');
//   } else if (priorityEl.textContent === 'Low') {
//     priorityEl.textContent = 'High';
//     priorityEl.classList.add('todo-priority-high');
//   }
//     // priorityEl.style.backgroundColor = ''; 

// }
// }

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
