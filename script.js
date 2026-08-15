const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const searchInput = document.getElementById("searchInput");
const themeButton = document.getElementById("themeButton");
const priorityInput = document.getElementById("priorityInput");

const allButton = document.getElementById("allButton");
const activeButton = document.getElementById("activeButton");
const completedButton = document.getElementById("completedButton");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let searchText = "";

renderTasks();

addButton.addEventListener("click", addTask);

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    const task = {
        text: taskText,
        completed: false,
        priority: priorityInput.value
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
}

function renderTasks() {
    taskList.innerHTML = "";
    const totalTasks = tasks.length;

const completedTasks = tasks.filter(task => task.completed).length;

const activeTasks = totalTasks - completedTasks;

taskCounter.textContent =
    `Всего: ${totalTasks} | Выполнено: ${completedTasks} | Осталось: ${activeTasks}`;

    tasks.forEach(function(task, index) {

        if (currentFilter === "active" && task.completed) {
            return;
        }

        if (currentFilter === "completed" && !task.completed) {
            return;
        }
        if (
    !task.text.toLowerCase().includes(searchText)
) {
    return;
}

        const li = document.createElement("li");

        // Поле редактирования
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = task.text;
        editInput.style.display = "none";
        const editPriority = document.createElement("select");
        editInput.style.width = "100%";
editInput.style.marginBottom = "10px";

const lowOption = document.createElement("option");
lowOption.value = "low";
lowOption.textContent = "Низкий";

const mediumOption = document.createElement("option");
mediumOption.value = "medium";
mediumOption.textContent = "Средний";

const highOption = document.createElement("option");
highOption.value = "high";
highOption.textContent = "Высокий";

editPriority.appendChild(lowOption);
editPriority.appendChild(mediumOption);
editPriority.appendChild(highOption);

editPriority.value = task.priority || "low";
editPriority.style.display = "none";
editPriority.style.marginBottom = "10px";

        // Текст задачи
        const taskText = document.createElement("span");
        taskText.textContent = task.text;

        // Приоритет
        const priorityText = document.createElement("span");
        priorityText.classList.add("priority");

        if (task.priority === "high") {
            priorityText.textContent = "Высокий";
            priorityText.classList.add("high");
        } else if (task.priority === "medium") {
            priorityText.textContent = "Средний";
            priorityText.classList.add("medium");
        } else {
            priorityText.textContent = "Низкий";
            priorityText.classList.add("low");
        }

        // Выполненная задача
        if (task.completed) {
            taskText.classList.add("completed");
        }

        taskText.addEventListener("click", function() {
            tasks[index].completed = !tasks[index].completed;

            saveTasks();
            renderTasks();
        });

        // Кнопка изменения
        const editButton = document.createElement("button");
        editButton.textContent = "Изменить";
        const saveButton = document.createElement("button");
saveButton.textContent = "Сохранить";
saveButton.classList.add("save-btn");
saveButton.style.display = "none";
saveButton.style.marginRight = "8px";

const cancelButton = document.createElement("button");
cancelButton.textContent = "Отмена";
cancelButton.classList.add("cancel-btn");
cancelButton.style.display = "none";

        editButton.addEventListener("click", function() {
            li.classList.add("edit-mode");
            taskText.style.display = "none";
priorityText.style.display = "none";
    editInput.style.display = "inline-block";
    editPriority.style.display = "inline-block";
    saveButton.style.display = "inline-block";
    cancelButton.style.display = "inline-block";
    editButton.style.display = "none";
    editInput.focus();
});

        // Сохранение изменения при нажатии Enter
        editInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const newText = editInput.value.trim();
        const newPriority = editPriority.value;

        if (newText !== "") {
            tasks[index].text = newText;
            tasks[index].priority = newPriority;

            saveTasks();
            renderTasks();
        }
    }
});
saveButton.addEventListener("click", function() {
    const newText = editInput.value.trim();
    const newPriority = editPriority.value;

    if (newText !== "") {
        tasks[index].text = newText;
        tasks[index].priority = newPriority;
        li.classList.remove("edit-mode");

        saveTasks();
        renderTasks();
    }
});
cancelButton.addEventListener("click", function() {
    li.classList.remove("edit-mode");
    taskText.style.display = "inline-block";
priorityText.style.display = "inline-block";
    editInput.value = task.text;
    editPriority.value = task.priority || "low";

    editInput.style.display = "none";
    editPriority.style.display = "none";
    saveButton.style.display = "none";
    cancelButton.style.display = "none";
    editButton.style.display = "inline-block";
});

        // Кнопка удаления
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Удалить";
        deleteButton.classList.add("delete-btn");

        deleteButton.addEventListener("click", function() {
            tasks.splice(index, 1);

            saveTasks();
            renderTasks();
        });

        // Добавляем элементы
        li.appendChild(taskText);
li.appendChild(editInput);
li.appendChild(editPriority);
li.appendChild(priorityText);
li.appendChild(editButton);
li.appendChild(saveButton);
li.appendChild(cancelButton);
li.appendChild(deleteButton);

        taskList.appendChild(li);
    });
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Загружаем тему
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

// Переключение темы
themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});

// Фильтр "Все"
allButton.addEventListener("click", function() {
    currentFilter = "all";
    renderTasks();
});

// Фильтр "Активные"
activeButton.addEventListener("click", function() {
    currentFilter = "active";
    renderTasks();
});

// Фильтр "Выполненные"
completedButton.addEventListener("click", function() {
    currentFilter = "completed";
    renderTasks();
});
searchInput.addEventListener("input", function() {
    searchText = searchInput.value.toLowerCase();
    renderTasks();
});