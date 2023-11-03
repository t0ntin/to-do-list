import './style.css';
import { renderTodos } from './render-to-do';
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
  }
}

function addTodo (todo, dueDate, priority, description) {
  const newToDo = new Todo (todo, dueDate, priority, description);
  mainTodoObj.push(newToDo);
}

function handleSubmitToMain () {
  let priority = getPriority();
  const todo = document.querySelector('#to-do');
  const dueDate = document.querySelector('#date');
  const description = document.querySelector('#description');
  const priorityContainer = document.querySelector('.priority-container');
  const createTodoButton = document.querySelector("#create-todo-btn");

  priorityContainer.addEventListener('click',  (e) =>  {
    priority = getPriority(e); // Pass the event object to getPriority
  });

  createTodoButton.addEventListener('click', (e)=> {
  e.preventDefault();
    addTodo(todo.value, dueDate.value, priority, description.value);
    renderTodos();
  });
}

// Was getting an error here when I was just using e.preventdefault(); I also had to add (e) to getpriority and to the event listener function: The error is due to calling preventDefault() on the event object even before ensuring its existence. Since not all events come with a preventDefault method, you should check if it exists before calling it.
function getPriority(e) {
  if (e) {
    e.preventDefault();
  let priority = '';
  if (e.target.getAttribute('id') === 'high' ) {
    priority = 'High';
  }
  if (e.target.getAttribute('id') === 'medium' ) {
    priority = 'medium';
  }
  if (e.target.getAttribute('id') === 'low' ) {
    priority = 'low';
  }
  return priority;
} 
return '';
}

//PREPOPULATES DATE FIELDS
document.addEventListener('DOMContentLoaded', function() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  
  const formattedToday = `${yyyy}-${mm}-${dd}`;
  document.getElementById('date').value = formattedToday;
});

handleSubmitToMain();
console.log(mainTodoObj);
console.log('testing');