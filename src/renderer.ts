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
    const dueDateFormatted = new Date(task.dueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    taskElement.innerHTML = `
      <a href="#" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-200 dark:border-gray-700 dark:hover:bg-gray-100">
      <h3 class="font-bold">${task.title}</h3>
      <p>${task.description}</p>
      <p>Due: ${dueDateFormatted}</p>
    </a>
    <br>
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
