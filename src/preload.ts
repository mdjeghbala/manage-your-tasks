import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  loadTasks: () => ipcRenderer.invoke('load-tasks'),
  addTask: (task: { title: string, description: string, dueDate: string }) => ipcRenderer.invoke('add-task', task),
});
