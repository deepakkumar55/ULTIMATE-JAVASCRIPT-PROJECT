document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const taskList = document.getElementById('task-list');
  const taskInput = document.getElementById('new-task');
  const addButton = document.getElementById('add-button');
  const addTaskBtn = document.getElementById('add-task-btn');
  const cancelAddBtn = document.getElementById('cancel-add');
  const taskInputPanel = document.getElementById('task-input-panel');
  const navItems = document.querySelectorAll('.nav-item');
  const taskCount = document.getElementById('task-count');
  const currentView = document.getElementById('current-view');
  const themeToggle = document.getElementById('theme-toggle');
  const searchInput = document.getElementById('search-tasks');
  
  // State
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let filter = 'All';
  let searchTerm = '';
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  // Helper functions
  const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const updateTaskCount = () => {
    const remainingTasks = tasks.filter(task => !task.completed).length;
    taskCount.textContent = remainingTasks;
  };

  const toggleTaskInputPanel = () => {
    taskInputPanel.classList.toggle('hidden');
    if (!taskInputPanel.classList.contains('hidden')) {
      taskInput.focus();
    }
  };

  const filterAndSearchTasks = () => {
    let filteredTasks = tasks;
    
    // Apply filter
    if (filter !== 'All') {
      filteredTasks = filteredTasks.filter(task => 
        filter === 'Active' ? !task.completed : task.completed
      );
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.text.toLowerCase().includes(term)
      );
    }
    
    return filteredTasks;
  };

  const renderTasks = () => {
    taskList.innerHTML = '';
    const filteredTasks = filterAndSearchTasks();
    
    if (filteredTasks.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.innerHTML = `
        <i class="fas fa-clipboard-list" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
        <p style="color: var(--text-secondary);">No tasks found</p>
      `;
      emptyState.style.textAlign = 'center';
      emptyState.style.padding = '3rem';
      emptyState.style.gridColumn = '1 / -1';
      taskList.appendChild(emptyState);
    }

    filteredTasks.forEach((task, index) => {
      const taskCard = document.createElement('div');
      taskCard.className = `task-card ${task.completed ? 'completed' : ''}`;
      taskCard.dataset.id = index;
      
      const taskHeader = document.createElement('div');
      taskHeader.className = 'task-header';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'task-checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => toggleTaskCompletion(index));
      
      const taskContent = document.createElement('div');
      taskContent.className = 'task-content';
      
      const taskText = document.createElement('p');
      taskText.className = 'task-text';
      taskText.textContent = task.text;
      
      const taskDate = document.createElement('p');
      taskDate.className = 'task-date';
      taskDate.textContent = task.date || new Date().toLocaleDateString();
      taskDate.style.fontSize = '0.75rem';
      taskDate.style.color = 'var(--text-secondary)';
      
      const taskActions = document.createElement('div');
      taskActions.className = 'task-card-actions';
      
      const editBtn = document.createElement('button');
      editBtn.className = 'edit-btn';
      editBtn.innerHTML = '<i class="fas fa-edit"></i>';
      editBtn.title = 'Edit Task';
      editBtn.addEventListener('click', () => editTask(index));
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
      deleteBtn.title = 'Delete Task';
      deleteBtn.addEventListener('click', () => deleteTask(index));
      
      // Build the task card
      taskHeader.appendChild(checkbox);
      taskContent.appendChild(taskText);
      taskContent.appendChild(taskDate);
      taskActions.appendChild(editBtn);
      taskActions.appendChild(deleteBtn);
      
      taskCard.appendChild(taskHeader);
      taskCard.appendChild(taskContent);
      taskCard.appendChild(taskActions);
      
      taskList.appendChild(taskCard);
    });

    updateTaskCount();
  };

  const addTask = () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
      tasks.push({ 
        text: taskText, 
        completed: false,
        date: new Date().toLocaleDateString(),
        id: Date.now()
      });
      taskInput.value = '';
      toggleTaskInputPanel();
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
    if (newText !== null && newText.trim() !== '') {
      tasks[index].text = newText.trim();
      tasks[index].updated = new Date().toLocaleDateString();
      saveTasks();
      renderTasks();
    }
  };

  const deleteTask = (index) => {
    if (confirm('Are you sure you want to delete this task?')) {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    }
  };

  const toggleTheme = () => {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    themeToggle.innerHTML = isDarkMode ? 
      '<i class="fas fa-sun"></i>' : 
      '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  };

  // Event Listeners
  addTaskBtn.addEventListener('click', toggleTaskInputPanel);
  cancelAddBtn.addEventListener('click', toggleTaskInputPanel);
  addButton.addEventListener('click', addTask);
  themeToggle.addEventListener('click', toggleTheme);
  
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });
  
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(btn => btn.classList.remove('active'));
      item.classList.add('active');
      filter = item.dataset.filter;
      currentView.textContent = item.querySelector('span').textContent;
      renderTasks();
    });
  });
  
  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderTasks();
  });
  
  // Initial render
  renderTasks();
});
