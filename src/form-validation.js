import { page } from "./dom.js";

 export function validateForm() {
   page.errorMessageContainer.innerText = '';
  
}

// page.todoInput.addEventListener('blur', () => {
//   if (!page.todoInput.value) {
//     console.log('blurred');
//     console.log((page.errorMessageContainer));
//     page.errorMessageContainer.innerText = 'testing';
//   }
// })
page.todoInput.addEventListener('blur', () => {
  if (!page.todoInput.value) {
      page.errorMessageContainer.innerText = '*Remember to enter your to-do.';
      page.todoInput.style.border = '1px solid red';

  }
});

