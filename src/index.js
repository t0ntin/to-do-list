import './style.css';
// import Icon from './hamburger.jpg';

// const title = document.querySelector('.title');
// const myIcon = new Image();
// myIcon.src = Icon;
// title.append(myIcon);



class Todo {
  constructor(todo, dueDate, priority, description) {
    this.todo = todo;
    this.dueDate = dueDate;
    this.priority = priority;
    this.description = description;
  }
}

function addTodo (todo, dueDate, priority, description) {
  const todoObj = [];
  const newToDo = new Todo (todo, dueDate, priority, description);
  todoObj.push(newToDo);
}

console.log('testing');