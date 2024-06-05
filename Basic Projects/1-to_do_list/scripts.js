document.addEventListener('DOMContentLoaded', () => {
  const taskList = document.getElementById('task-list');
  const taskInput = document.getElementById('new-task');
  const addButton = document.getElementById('add-button');
  const filterButtons = document.querySelectorAll('.filter-buttons button');
  const taskCount = document.getElementById('task-count');
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let filter = 'All';

  const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const updateTaskCount = () => {
    const remainingTasks = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${remainingTasks} tasks remaining`;
  };

  const renderTasks = () => {
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
      if (filter === 'All') return true;
      if (filter === 'Active') return !task.completed;
      if (filter === 'Completed') return task.completed;
    });

    filteredTasks.forEach((task, index) => {
      const li = document.createElement('li');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => toggleTaskCompletion(index));

      const taskText = document.createElement('span');
      taskText.textContent = task.text;

      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => editTask(index));

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => deleteTask(index));

      li.appendChild(checkbox);
      li.appendChild(taskText);
      li.appendChild(editButton);
      li.appendChild(deleteButton);

      taskList.appendChild(li);
    });

    updateTaskCount();
  };

  const addTask = () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
      tasks.push({ text: taskText, completed: false });
      taskInput.value = '';
      saveTasks();
      renderTasks();
    }
  };

  const toggleTaskCompletion = (index) => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  };

  const editTask = (index) => {
    const newText = prompt('Edit task:', tasks[index].text);
    if (newText !== null) {
      tasks[index].text = newText;
      saveTasks();
      renderTasks();
    }
  };

  const deleteTask = (index) => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  };

  addButton.addEventListener('click', addTask);

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      filter = button.textContent;
      renderTasks();
    });
  });

  renderTasks();
});
