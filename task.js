document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const searchInput = document.getElementById('search');
    const filterRadios = document.querySelectorAll('input[name="filter"]');

    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        taskList.innerHTML = '';
        tasks.forEach(task => addTaskToDOM(task));
    };

    const saveTasks = (tasks) => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const createTaskElement = (task) => {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        if (task.completed) li.classList.add('completed');

        const taskContent = document.createElement('div');
        const title = document.createElement('strong');
        title.textContent = task.title;
        const description = document.createElement('p');
        description.textContent = task.description;
        const dueDate = document.createElement('small');
        dueDate.textContent = `Due: ${task.dueDate}`;
        
        taskContent.appendChild(title);
        taskContent.appendChild(description);
        taskContent.appendChild(dueDate);
        
        const buttonContainer = document.createElement('div');
        
        const editButton = document.createElement('button');
        editButton.className = 'edit';
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editTask(task));
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTask(task.id));
        
        const completeButton = document.createElement('button');
        completeButton.className = 'complete';
        completeButton.textContent = task.completed ? 'Undo' : 'Complete';
        completeButton.addEventListener('click', () => toggleComplete(task.id));
        
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);
        buttonContainer.appendChild(completeButton);
        
        li.appendChild(taskContent);
        li.appendChild(buttonContainer);
        
        return li;
    };

    const addTaskToDOM = (task) => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    };

    const addTask = (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const dueDate = document.getElementById('due-date').value;

        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        const newTask = {
            id: Date.now(),
            title,
            description,
            dueDate,
            completed: false
        };
        
        tasks.push(newTask);
        saveTasks(tasks);
        addTaskToDOM(newTask);
        taskForm.reset();
    };

    const editTask = (task) => {
        const newTitle = prompt('New Title:', task.title);
        const newDescription = prompt('New Description:', task.description);
        const newDueDate = prompt('New Due Date:', task.dueDate);

        if (newTitle && newDescription && newDueDate) {
            const tasks = JSON.parse(localStorage.getItem('tasks'));
            const taskIndex = tasks.findIndex(t => t.id === task.id);
            tasks[taskIndex] = { ...tasks[taskIndex], title: newTitle, description: newDescription, dueDate: newDueDate };
            saveTasks(tasks);
            loadTasks();
        }
    };

    const deleteTask = (id) => {
        if (confirm('Are you sure you want to delete this task?')) {
            let tasks = JSON.parse(localStorage.getItem('tasks'));
            tasks = tasks.filter(task => task.id !== id);
            saveTasks(tasks);
            loadTasks();
        }
    };

    const toggleComplete = (id) => {
        let tasks = JSON.parse(localStorage.getItem('tasks'));
        tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
        saveTasks(tasks);
        loadTasks();
    };

    const filterTasks = () => {
        const filterValue = document.querySelector('input[name="filter"]:checked').value;
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        taskList.innerHTML = '';
        tasks
            .filter(task => filterValue === 'all' || (filterValue === 'completed' && task.completed) || (filterValue === 'incomplete' && !task.completed))
            .forEach(task => addTaskToDOM(task));
    };

    const searchTasks = () => {
        const query = searchInput.value.toLowerCase();
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        taskList.innerHTML = '';
        tasks
            .filter(task => task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query))
            .forEach(task => addTaskToDOM(task));
    };

    taskForm.addEventListener('submit', addTask);
    filterRadios.forEach(radio => radio.addEventListener('change', filterTasks));
    searchInput.addEventListener('input', searchTasks);

    loadTasks();
});
