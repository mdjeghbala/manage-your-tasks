import * as fs from 'fs';
import * as path from 'path';

export interface Task {
    title: string;
    description: string;
    dueDate: string;
  }

const tasksFilePath = path.join(__dirname, 'tasks.json');

function loadTasks(): Task[] {
  try {
    const data = fs.readFileSync(tasksFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Could not read tasks file:', err);
    return [];
  }
}

function saveTasks(tasks: Task[]) {
  try {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
  } catch (err) {
    console.error('Could not write tasks file:', err);
  }
}

let tasks: Task[] = loadTasks();

function addTask(task: Task) {
  tasks.push(task);
  saveTasks(tasks);
  renderTasks();
}

function renderTasks() {
  const taskList = document.getElementById('task-list');
  if (!taskList) return;

  taskList.innerHTML = ''; 

  tasks.forEach(task => {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    taskElement.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <p>Due: ${task.dueDate}</p>
    `;
    taskList.appendChild(taskElement);
  });
}

document.getElementById('add-task-button')?.addEventListener('click', () => {
  const title = (document.getElementById('inline-full-name') as HTMLInputElement).value;
  const description = (document.getElementById('message') as HTMLTextAreaElement).value;
  const dueDate = (document.getElementById('datepicker-format') as HTMLInputElement).value;

  const newTask: Task = { title, description, dueDate };
  console.log('Adding task:', newTask);
  addTask(newTask);
});

document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
});