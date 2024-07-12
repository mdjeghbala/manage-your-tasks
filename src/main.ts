import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as fs from "fs";

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    width: 1000,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

export interface Task {
    title: string;
    description: string;
    dueDate: string;
  }

const tasksFilePath = path.join(__dirname, 'tasks.json');

function loadTasks(): Task[] {
  try {
    if (!fs.existsSync(tasksFilePath)) {
      fs.writeFileSync(tasksFilePath, '[]'); 
    }

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

ipcMain.handle('load-tasks', async () => {
  tasks = loadTasks();
  return tasks;
});

ipcMain.handle('add-task', async (event, task: Task) => {
  tasks.push(task);
  saveTasks(tasks);
  return tasks;
});
