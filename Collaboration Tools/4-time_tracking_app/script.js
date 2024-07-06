// Sample data (can be replaced with actual data handling logic)
let tasks = [];

// Selectors
const taskForm = document.getElementById('taskForm');
const taskNameInput = document.getElementById('taskName');
const taskList = document.getElementById('taskList');

// Event listeners
taskForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const taskName = taskNameInput.value.trim();
    if (taskName !== '') {
        addTask(taskName);
        taskNameInput.value = '';
    }
});

taskList.addEventListener('click', function(event) {
    const element = event.target;
    if (element.tagName === 'BUTTON') {
        const taskId = element.parentElement.dataset.taskId;
        const action = element.dataset.action;

        if (action === 'delete') {
            deleteTask(taskId);
        } else if (action === 'start') {
            startTask(taskId);
        } else if (action === 'pause') {
            pauseTask(taskId);
        } else if (action === 'end') {
            endTask(taskId);
        }
    }
});

// Functions
function addTask(taskName) {
    const task = {
        id: Date.now(),
        name: taskName,
        startTime: null,
        endTime: null,
        totalTime: 0,
        paused: false,
        completed: false
    };
    tasks.push(task);
    renderTasks();
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id != taskId);
    renderTasks();
}

function startTask(taskId) {
    const task = tasks.find(task => task.id == taskId);
    if (task) {
        task.startTime = new Date();
        task.paused = false;
        renderTasks();
    }
}

function pauseTask(taskId) {
    const task = tasks.find(task => task.id == taskId);
    if (task && !task.paused && task.startTime) {
        const currentTime = new Date();
        const elapsed = currentTime - task.startTime;
        task.totalTime += elapsed;
        task.paused = true;
        renderTasks();
    }
}

function endTask(taskId) {
    const task = tasks.find(task => task.id == taskId);
    if (task && task.startTime && !task.completed) {
        const currentTime = new Date();
        const elapsed = currentTime - task.startTime;
        task.totalTime += elapsed;
        task.endTime = currentTime;
        task.completed = true;
        renderTasks();
    }
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.dataset.taskId = task.id;
        let taskInfo = `${task.name}`;
        if (task.startTime && !task.completed) {
            taskInfo += ` - Time: ${formatTime(task.totalTime)}`;
            li.innerHTML = `<span>${taskInfo}</span>
                            <button data-action="pause">Pause</button>
                            <button data-action="end">End</button>
                            <button data-action="delete">Delete</button>`;
        } else if (task.completed) {
            const totalTimeFormatted = formatTime(task.totalTime);
            li.innerHTML = `<span>${taskInfo} - Completed (Total Time: ${totalTimeFormatted})</span>
                            <button data-action="delete">Delete</button>`;
        } else {
            li.innerHTML = `<span>${taskInfo}</span>
                            <button data-action="start">Start</button>
                            <button data-action="delete">Delete</button>`;
        }
        taskList.appendChild(li);
    });
}

function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

// Initial render
renderTasks();
