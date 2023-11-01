import './style.css';
// import Icon from './hamburger.jpg';

// const title = document.querySelector('.title');
// const myIcon = new Image();
// myIcon.src = Icon;
// title.append(myIcon);


const mainTodoObj = [];



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
  let priority = 'testing';
  const createTodoBtn = document.querySelector('#create-todo-btn');
  createTodoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const todo = document.querySelector('#to-do').value;
    const dueDate = document.querySelector('#date').value;
    const description = document.querySelector('#description').value;

    addTodo(todo, dueDate, priority, description);
    console.log(mainTodoObj);
  });
}

handleSubmitToMain();



//PREPOPULATES FIELDS
document.addEventListener('DOMContentLoaded', function() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();

  const formattedToday = `${yyyy}-${mm}-${dd}`;
  document.getElementById('date').value = formattedToday;
});

console.log(mainTodoObj);
console.log('testing');