const taskList = document.getElementById('taskList');

document.getElementById('taskForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const input = document.getElementById('taskInput').value.trim();

  if (input) {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');
    
    const taskText = document.createElement('span');
    taskText.textContent = input;

    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.addEventListener('click', () => {
      taskItem.style.backgroundColor = checkBox.checked ? 'green' : '';
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      taskItem.remove();
    });

    taskItem.appendChild(checkBox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(deleteButton);

    taskList.appendChild(taskItem);

    document.getElementById('taskInput').value = '';
  }
});






































// document.addEventListener("DOMContentLoaded", function () {
//     const taskForm = document.getElementById("taskForm");
//     const taskInput = document.getElementById("taskInput");
//     const taskList = document.getElementById("taskList");
  
//     function createTaskItem(taskContent) {
//       const taskItem = document.createElement("li");
//       taskItem.classList.add("task-item");
  
//       const checkBox = document.createElement("input");
//       checkBox.type = "checkbox";
//       checkBox.addEventListener('click', function () {
//         taskText.style.backgroundColor = checkBox.checked ? 'green' : '';
//       });
  
//       const taskText = document.createElement("span");
//       taskText.textContent = taskContent;
  
//       const deleteButton = document.createElement("button");
//       deleteButton.textContent = "Delete";
//       deleteButton.addEventListener("click", function () {
//         taskItem.remove();
//       });
  
//       taskItem.appendChild(checkBox);
//       taskItem.appendChild(taskText);
//       taskItem.appendChild(deleteButton);
  
//       taskList.appendChild(taskItem);
//     }
  
//     taskForm.addEventListener("submit", function (event) {
//       event.preventDefault();
//       const taskContent = taskInput.value.trim();
//       if (taskContent !== "") {
//         createTaskItem(taskContent);
//         taskInput.value = "";
//       }
//     });
//   });
  