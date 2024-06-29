document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todoForm');
    const userInput = document.getElementById('user-input');
    const daysSelect = document.getElementById('days');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const task = userInput.value.trim();
        const day = daysSelect.value;

        if (task && day !== 'chooseDay') {
            addTaskToDay(day, task);
            saveTasks();
            userInput.value = '';
            daysSelect.value = 'chooseDay';
        }
    });

    function addTaskToDay(day, task, isLoaded = false) {
        const dayList = document.getElementById(day.toLowerCase());
        const listItem = document.createElement('li');
        
        const taskText = document.createElement('span');
        taskText.textContent = task;
        taskText.className = 'task-text';

        const deleteButton = document.createElement('span');
        deleteButton.textContent = '✖';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', handleDelete);

        listItem.addEventListener('click', handleClick);
        
        listItem.appendChild(taskText);
        listItem.appendChild(deleteButton);
        dayList.appendChild(listItem);

        if (!isLoaded) {
            saveTasks();
        }
    }

    function handleClick(event) {
        if (event.target.classList.contains('delete-button')) return;

        const taskText = event.currentTarget.querySelector('.task-text');
        if (taskText.style.textDecoration === 'line-through') {
            taskText.style.textDecoration = 'none';
        } else {
            taskText.style.textDecoration = 'line-through';
        }
        saveTasks();
    }

    function handleDelete(event) {
        const listItem = event.target.parentElement;
        listItem.remove();
        saveTasks();
    }

    function saveTasks() {
        const tasks = {};
        document.querySelectorAll('.day-in-week').forEach(dayDiv => {
            const day = dayDiv.querySelector('h2').textContent.toLowerCase();
            const tasksList = [];
            dayDiv.querySelectorAll('li').forEach(li => {
                tasksList.push({
                    text: li.querySelector('.task-text').textContent,
                    done: li.querySelector('.task-text').style.textDecoration === 'line-through'
                });
            });
            tasks[day] = tasksList;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            for (const day in tasks) {
                tasks[day].forEach(task => {
                    addTaskToDay(day, task.text, true);
                    if (task.done) {
                        const dayList = document.getElementById(day.toLowerCase());
                        const listItem = dayList.lastElementChild;
                        listItem.querySelector('.task-text').style.textDecoration = 'line-through';
                    }
                });
            }
        }
    }

    loadTasks();
});
