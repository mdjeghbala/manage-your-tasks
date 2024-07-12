interface Task {
  title: string;
  description: string;
  dueDate: string;
}

function renderTasks(tasks: Task[]) {
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

document.getElementById('add-task-button')?.addEventListener('click', async () => {
  const title = (document.getElementById('inline-full-name') as HTMLInputElement).value;
  const description = (document.getElementById('message') as HTMLTextAreaElement).value;
  const dueDate = (document.getElementById('datepicker-format') as HTMLInputElement).value;

  const newTask: Task = { title, description, dueDate };
  console.log('Adding task:', newTask);

  const updatedTasks = await (window as any).electron.addTask(newTask);
  renderTasks(updatedTasks);
});

document.addEventListener('DOMContentLoaded', async () => {
  const tasks = await (window as any).electron.loadTasks();
  renderTasks(tasks);
});
