import { ipcRenderer } from 'electron';

const list = document.querySelector('ul') as HTMLUListElement;
const span = document.querySelector('span') as HTMLSpanElement;

ipcRenderer.on('todo:add', (event, todo) => {
  const li = document.createElement('li');
  const text = document.createTextNode(todo);

  li.appendChild(text);
  list.appendChild(li);
});

span.addEventListener('click', () => {
  ipcRenderer.send('todo:add', 'hello world');
});

console.log('hello world');
