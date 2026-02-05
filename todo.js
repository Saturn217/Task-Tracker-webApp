allTodo = []
let currentFilter = "all"


function addTodo() {
    let todo = document.getElementById("todo").value
    let todoDate = document.getElementById("todoDate").value
    let todoTime = document.getElementById("todoTime").value
    let warningMsg = document.getElementById("warningMsg")
    let myScreen = document.getElementById("myScreen")
    let completed = false

    if (!todo || !todoDate || !todoTime) {
        warningMsg.style.display = "block"

        setTimeout(() => {
            warningMsg.style.display = "none";
        }, 3000);


    }

    else {

        let todoObj = {
            todo,
            todoDate,
            todoTime,
            completed
        }
        allTodo.push(todoObj)
        console.log(allTodo);

        document.getElementById("todo").value = ""
        document.getElementById("todoDate").value = ""
        document.getElementById("todoTime").value = ""
        saveTodo()

        // displayTodo()
        filterTodos('all')
        updateDeleteAll()
        updateFooter()

    }


}

function displayTodo() {

    myScreen.innerHTML = ""
    for (let i = 0; i < allTodo.length; i++) {
        myScreen.innerHTML +=

            `
                <div class="d-flex align-items-center justify-content-between todo-item ${allTodo[i].completed ? 'completed' : ''}">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" ${allTodo[i].completed ? 'checked' : ''} onchange="toggleDone(${i})">
                        <div class="todo-content">
                            <h6>${allTodo[i].todo}</h6>
                            <div class="todo-meta">
                                <span><i class="fas fa-calendar"></i> ${formatDate(allTodo[i].todoDate)}</span>
                                <span><i class="fas fa-clock"></i> ${formatTime(allTodo[i].todoTime)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="todo-actions">
                        <button onclick="editTask(${i})" class="btn btn-sm btn-outline-info">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button onclick="deleteTask(${i})" class="btn btn-sm btn-outline-danger">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
             </div>`;

    }




}


function editTask(i) {
    editIndex = i;
    document.getElementById("newTodo").value = allTodo[i].todo
    document.getElementById("newTodoDate").value = allTodo[i].todoDate
    document.getElementById("newTodoTime").value = allTodo[i].todoTime
    myModal = new bootstrap.Modal(document.getElementById('editTodoModal'))

    myModal.show()

}

const saveChanges = () => {
    allTodo[editIndex].todo = document.getElementById("newTodo").value
    allTodo[editIndex].todoDate = document.getElementById("newTodoDate").value
    allTodo[editIndex].todoTime = document.getElementById("newTodoTime").value
    // displayTodo()
    filterTodos(currentFilter)
    saveTodo()
    updateDeleteAll()
    updateFooter()

    myModal.hide()

}

const deleteTask = (i) => {
    deleteIndex = i

    deleteModal = new bootstrap.Modal(document.getElementById('deleteTodoModal'))
    deleteModal.show()
}

const deleteTodo = () => {
    allTodo.splice(deleteIndex, 1)
    saveTodo()
    // displayTodo()
    filterTodos(currentFilter)
    updateDeleteAll()
    updateFooter()
    deleteModal.hide()

}

const saveTodo = () => {
    JSON.stringify(allTodo)
    localStorage.setItem("saveMyTodo", JSON.stringify(allTodo))
}

const fetchTodo = () => {
    localStorage.getItem("saveMyTodo")
    allTodo = JSON.parse(localStorage.getItem("saveMyTodo")) || []
    // displayTodo()
    filterTodos('all')
    updateDeleteAll()
    updateFooter()

}

const updateDeleteAll = () => {
    let btn = document.getElementById("clearAll")
    let deleteTextSpan = document.getElementById("deleteAllText")
    let taskCountSpan = document.getElementById("taskCount")
    let filterLabel = document.getElementById("filterLabel")

    let count = 0
    let buttonText = ""
    let modalText = ""

    if (currentFilter === "active") {
        count = allTodo.filter((task) => !task.completed).length
        buttonText = count === 0 ? "No active tasks" : `Delete All (${count})`
        modalText = count === 1 ? "active task" : "active tasks"
    }
    else if (currentFilter === "completed") {
        count = allTodo.filter((task) => task.completed).length
        buttonText = count === 0 ? "No completed tasks" : `Delete All (${count})`
        modalText = count === 1 ? "completed task" : "completed tasks"
    }
    else {
        count = allTodo.length
        buttonText = count === 0 ? "No tasks" : `Delete All (${count})`;
        modalText = count === 1 ? "task" : "tasks"
    }

    deleteTextSpan.textContent = buttonText
    filterLabel.textContent = modalText
    taskCountSpan.textContent = count


    if (count > 0) {
        btn.classList.remove("btn-outline-danger")
        btn.classList.add("btn-danger")
        btn.disabled = false
    }

    else {
        btn.classList.remove("btn-danger")
        btn.classList.add("btn-outline-danger")
        btn.disabled = true
    }
}


const deleteAllTodo = () => {
    let taskCount = document.getElementById("taskCount")

    let count = 0

    if (currentFilter === "active") {
        count = allTodo.filter((task) => !task.completed).length

    }
    else if (currentFilter === "completed") {
        count = allTodo.filter((task) => task.completed).length

    }
    else {
        count = allTodo.length
    }

    taskCount.textContent = count



    deleteAllModal = new bootstrap.Modal(document.getElementById('deleteAllModal'))
    deleteAllModal.show()

}

const executeDelete = () => {

    const successToastE1 = document.getElementById("successToast")
    let newAllTodo;

    if (currentFilter === "active") {
        newAllTodo = allTodo.filter((task) => task.completed) //delete active, keep completed
        if (successToastE1) {
            successToastE1.querySelector(".toast-body").innerHTML = '<i class="fas fa-check-circle me-2"></i><strong>All Active Tasks deleted!</strong>';
            myToast = bootstrap.Toast.getOrCreateInstance(successToastE1, { delay: 3000 })
            myToast.show()
        }

    }
    else if (currentFilter === "completed") {
        newAllTodo = allTodo.filter((task) => !task.completed) // delete completed
        if (successToastE1) {
            successToastE1.querySelector(".toast-body").innerHTML = '<i class="fas fa-check-circle me-2"></i><strong>All Completed Tasks deleted!</strong>';
            myToast = bootstrap.Toast.getOrCreateInstance(successToastE1, { delay: 3000 })
            myToast.show()
        }

    }
    else {
        newAllTodo = []
        if (successToastE1) {
            successToastE1.querySelector(".toast-body").innerHTML = '<i class="fas fa-check-circle me-2"></i><strong>All Tasks deleted!</strong>';
            myToast = bootstrap.Toast.getOrCreateInstance(successToastE1, { delay: 3000 })
            myToast.show()
        }
    }

    allTodo = newAllTodo
    localStorage.setItem("saveMyTodo", JSON.stringify(allTodo));

    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteAllModal'));
    if (modal) modal.hide();
    // deleteAllModal.hide()

    // displayTodo()
    filterTodos(currentFilter)
    updateDeleteAll()
    updateFooter()




}



function toggleDone(i) {
    allTodo[i].completed = !allTodo[i].completed
    saveTodo()
    // displayTodo()
    filterTodos(currentFilter)
    updateFooter()
}


const updateFooter = () => {
    pendingCount = document.getElementById("pendingCount")
    taskMessage = document.getElementById("taskMessage")

    pending = allTodo.filter((task) => !task.completed).length

    taskMessage.innerHTML = `You have <span id="pendingCount">${pending}</span> pending task${pending === 1 ? '' : 's'}`;

}

const filterTodos = (mode) => {
    currentFilter = mode
    let filtered;

    document.getElementById("tab-all").classList.remove("btn-primary")
    document.getElementById("tab-all").classList.add("btn-outline-primary")
    document.getElementById("tab-active").classList.remove("btn-primary");
    document.getElementById("tab-active").classList.add("btn-outline-primary");
    document.getElementById("tab-completed").classList.remove("btn-primary");
    document.getElementById("tab-completed").classList.add("btn-outline-primary");

    document.getElementById(`tab-${mode}`).classList.remove("btn-outline-primary")
    document.getElementById(`tab-${mode}`).classList.add("btn-primary")



    if (mode === "active") {
        filtered = allTodo.filter((todo) => !todo.completed)

    }
    else if (mode === "completed") {
        filtered = allTodo.filter((todo) => todo.completed)
    }
    else {
        filtered = allTodo
    }


    myScreen.innerHTML = ""

    if (filtered.length === 0) {
        let emptyIcon = mode === "active" ? "fa-clipboard-check" : mode === "completed" ? "fa-trophy" : "fa-clipboard-list";
        let emptyMessage = mode === "active" ? "No active tasks" : mode === "completed" ? "No completed tasks yet" : "No tasks yet";

        document.getElementById("myScreen").innerHTML = `
            <div class="empty-state">
                <i class="fas ${emptyIcon}"></i>
                <p>${emptyMessage}</p>
            </div>
        `;

    }

    filtered.forEach((task) => {
        const originalIndex = allTodo.indexOf(task)
        myScreen.innerHTML +=
            `
                <div class="d-flex align-items-start justify-content-between todo-item ${task.completed ? 'completed' : ''}">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleDone(${originalIndex})">
                        <div class="todo-content">
                            <h6>${task.todo}</h6>
                            <div class="todo-meta">
                                <span><i class="fas fa-calendar"></i> ${formatDate(task.todoDate)}</span>
                                <span><i class="fas fa-clock"></i> ${formatTime(task.todoTime)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="todo-actions">
                        ${task.completed ? "" : `<button onclick="editTask(${originalIndex})" class="btn btn-sm btn-outline-info"><i class="fas fa-edit"></i> Edit</button>`}
                        <button onclick="deleteTask(${originalIndex})" class="btn btn-sm btn-outline-danger"><i class="fas fa-trash"></i> Delete</button>
                    </div>
             </div>`;

    })

    updateDeleteAll()

}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}


function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
}

function toggleDarkMode() {
    const body = document.body;
    const modeIcon = document.getElementById('modeIcon');
    const modeText = document.getElementById('modeText');

    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        modeIcon.classList.remove('fa-moon');
        modeIcon.classList.add('fa-sun');
        modeText.textContent = 'Light';
    } else {
        localStorage.setItem('darkMode', 'disabled');
        modeIcon.classList.remove('fa-sun');
        modeIcon.classList.add('fa-moon');
        modeText.textContent = 'Dark';
    }
}

const loadToggle = () => {
    const savedMode = localStorage.getItem('darkMode');
    const body = document.body;
    const modeIcon = document.getElementById('modeIcon');
    const modeText = document.getElementById('modeText');
    const darkModeToggle = document.getElementById('darkModeToggle');

    if (savedMode === 'enabled') {
        body.classList.add('dark-mode');
        darkModeToggle.checked = true;
        modeIcon.classList.remove('fa-moon');
        modeIcon.classList.add('fa-sun');
        modeText.textContent = 'Light';
    } else {
        body.classList.remove('dark-mode');
        darkModeToggle.checked = false;
        modeIcon.classList.remove('fa-sun');
        modeIcon.classList.add('fa-moon');
        modeText.textContent = 'Dark';
    }
}