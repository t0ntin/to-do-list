import './style.css';
// import Icon from './hamburger.jpg';

// const title = document.querySelector('.title');
// const myIcon = new Image();
// myIcon.src = Icon;
// title.append(myIcon);


const mainTodoObj = [];
// let priority = getPriority();

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
  let priority = '';
  const todo = document.querySelector('#to-do').value;
  const dueDate = document.querySelector('#date');
  const description = document.querySelector('#description').value;
  const priorityContainer = document.querySelector('.priority-container');
  const createTodoButton = document.querySelector("#create-todo-btn");

  priorityContainer.addEventListener('click', function (e){
    e.preventDefault();
    if (e.target.getAttribute('id') === 'high' ) {
      priority = 'High';
    }
    if (e.target.getAttribute('id') === 'medium' ) {
      priority = 'medium';
    }
        if (e.target.getAttribute('id') === 'low' ) {
      priority = 'low';
    }

  }) 
  createTodoButton.addEventListener('click', function createTodo(e) {
    e.preventDefault();
    addTodo(todo, dueDate.value, priority, description);
  });
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