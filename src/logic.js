

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
    priority = 'medium';
  }
  if (e.target.getAttribute('id') === 'low' ) {
    priority = 'low';
  }
  return priority;
} 
return '';
}
