async function loadViewTask() {
    setData();
    setTaskPriority();
    setTaskAssignedUsers();
    setButtons();
}

function setData() {
    document.getElementById("taskTitle").innerHTML = currentTask.title;
    document.getElementById("taskDescription").innerHTML = currentTask.description;
    document.getElementById("taskCategory").innerHTML = currentTask.category;
    document.getElementById("taskCategory").setAttribute("class", "")
    document.getElementById("taskCategory").classList.add(currentTask.color)
    document.getElementById("taskId").innerHTML = currentTask.id;
    document.getElementById("taskAssignTo").innerHTML = currentTask.assignTo;
    document.getElementById("taskDueDate").innerHTML = currentTask.date;
    document.getElementById("taskPriority").innerHTML =  `<img src="/assets/img/${currentTask.prio}-white.svg">`; 

    document.getElementById("taskSubtask").innerHTML = "";
    currentTask.subTask.forEach( subTask => {
        document.getElementById("taskSubtask").innerHTML += subTask + '<br>';

    });
}
function setTaskPriority() {
    document.getElementById('taskPriority').classList.remove('low');
    document.getElementById('taskPriority').classList.remove('medium');
    document.getElementById('taskPriority').classList.remove('urgent');

    switch (currentTask.prio){
        case "low":
            document.getElementById('taskPriority').classList.add('low');
            break;
        case "urgent":
            document.getElementById('taskPriority').classList.add('urgent');
            break;
        case "medium":
            document.getElementById('taskPriority').classList.add('medium');
            break;
    }
}

function setTaskAssignedUsers() {
    document.getElementById('taskAssignTo').innerHTML = '';

    currentTask.contact.forEach(contact => {
        document.getElementById('taskAssignTo').innerHTML += `<span id="assignedUser-${contact.id}" class="assignedUser">${contact.firstName?.charAt(0).toUpperCase()} `+ ' ' + `${contact.surname?.charAt(0).toUpperCase()}</span>`;
        document.getElementById(`assignedUser-${contact.id}`).style.background = contact.background;
    });
}

function setButtons() {
    document.getElementById("taskDetailsEditButton").setAttribute("onclick",`taskDetailsEditTask("${currentTask.id}")`);
    document.getElementById("taskDetailsTrashButton").setAttribute("onclick",`taskDetailsDeleteTask("${currentTask.id}")`);
}

function taskDetailsEditTask() {
    openAddTaskContainer(currentTask.status);
    setEditTaskData();
}

function taskDetailsDeleteTask() {
    deleteTask(currentTask.id);
}
