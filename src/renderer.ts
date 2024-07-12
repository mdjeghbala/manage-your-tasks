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
  const toast = document.createElement('div');
  toast.className = 'fixed top-24 left-1/2 transform -translate-x-1/2 z-50';
  toast.innerHTML = `
    <div>
      <div id="toast-success"
          class="flex items-center w-full max-w-xs p-4 mb-4 px-6 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
          role="alert">
          <div
              class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
              <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                      d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span class="sr-only">Check icon</span>
          </div>
          <div class="ml-3 text-sm font-normal">Task added successfully.</div>
          <button type="button" class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close">
          <span class="sr-only">Close</span>
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
      </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  const closeButton = toast.querySelector('button');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      document.body.removeChild(toast);
    });
  }

  setTimeout(() => {
    if (document.body.contains(toast)) {
      document.body.removeChild(toast);
    }
  }, 5000);

  const updatedTasks = await (window as any).electron.addTask(newTask);
  renderTasks(updatedTasks);
});

document.addEventListener('DOMContentLoaded', async () => {
  const tasks = await (window as any).electron.loadTasks();
  renderTasks(tasks);
});
