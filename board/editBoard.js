let rightPrio;
let loadedTask;

/**
 * open the edit card container for the task
 * @param {id} id = id of task
 */
function editCardHtml(taskId) {
  loadTask(taskId);
  //document.getElementById("openTaskCard").innerHTML = editCardHtmlTemplate(taskId);
}

/** displays all user images which are already assign to the task */
async function renderImgEdit() {
  
  document.getElementById('profileImgEdit').innerHTML = ``;

  contacts.forEach( contact => {
    document.getElementById('profileImgEdit').innerHTML += `<div class="profilePictureEdit" id="profilePictureEdit-${contact.id}"></div>`;
    let AssignedUserImage = document.getElementById(`profilePictureEdit-${contact.id}`);
    
    if (!UserIdIsAssigned(contact.id))
      AssignedUserImage.classList.add('dp-none');  

    AssignedUserImage.style.background = contact.background;
    AssignedUserImage.innerHTML = 
    `<img onclick="deleteAssignUser('${contact.id}')" src="../assets/img/cancel.png">
    <span>
      ${contact["firstName"]?.charAt(0).toUpperCase() + contact["surname"]?.charAt(0).toUpperCase()}
    </span>`;
  });
}

/**
 * deletes assign to contact out of task
 * @param {id} contactId = id of assign to contact
 */
function deleteAssignUser(contactId) {
    assignTo.splice(assignTo.findIndex(usr => usr.id == contactId), 1);
    renderImgEdit();
    document.getElementById(`${contactId}-input`).checked = "";
}

/**
 * loads current task
 */
function loadTask(taskId) {
  loadedTask = tasks.find((task) => task.id == taskId);
  document.getElementById('input-title').value = `${loadedTask.title}`;
  document.getElementById('input-description').value = `${loadedTask.description}`;
  document.getElementById('input-date').value = `${loadedTask.date}`;
  renderImgEdit();
}

/** displays if prio is urgent */
function ifPrioUrgent() {
  document.getElementById('urgent-edit').classList.add('urgent');
  document.getElementById('urgent-img-edit').src = "/assets/img/urgent-white.svg";
  document.getElementById('low-edit').classList.remove('low');
  document.getElementById('low-img-edit').src = "/assets/img/prio-low.svg";
  document.getElementById('medium-edit').classList.remove('medium');
  document.getElementById('medium-img-edit').src = "/assets/img/prio-medium.svg";
}

/** displays if prio is medium */
function ifPrioMedium() {
  document.getElementById('medium-edit').classList.add('medium');
  document.getElementById('medium-img-edit').src = "/assets/img/medium-white.svg";
  document.getElementById('urgent-edit').classList.remove('urgent');
  document.getElementById('urgent-img-edit').src = "/assets/img/prio-urgent.svg";
  document.getElementById('low-edit').classList.remove('low');
  document.getElementById('low-img-edit').src = "/assets/img/prio-low.svg";
}

/** displays if prio is low */
function ifPrioLow() {
  document.getElementById('low-edit').classList.add('low');
  document.getElementById('low-img-edit').src = "/assets/img/low-white.svg";
  document.getElementById('urgent-edit').classList.remove('urgent');
  document.getElementById('urgent-img-edit').src = "/assets/img/prio-urgent.svg";
  document.getElementById('medium-edit').classList.remove('medium');
  document.getElementById('medium-img-edit').src = "/assets/img/prio-medium.svg";
}

/**
 * gets the values of all inputs of the edit card
 * @param {id} id = id of task 
 */
function getValuesFromInputsEdit(id) {
  let title = document.getElementById("input-title-edit");
  let description = document.getElementById("input-description-edit");
  let date = document.getElementById("input-date-edit");
  addRightPrio();
  editTask(title, description, date, id);
}

/**
 * edit task of changes in edit card
 * @param {container} title = container of title inputfield
 * @param {container} description = container of description inputfield
 * @param {container} date = container of date inputfield
 * @param {id} id = id of task 
 */
function editTask(title, description, date, id) {
  loadedTask.title = title.value;
  loadedTask.description = description.value;
  loadedTask.date = date.value;
  loadedTask.prio = rightPrio;

  addTasks();
  updateHtml();
  openCard(id);
}

/**
 * adds new priority to task
 * @param {string} prio = string of pressed priority
 */
function addingPrioEdit(prio) {
  if (prios.includes(prio)) {
    checkPrioEdit(prio);
  }
  else {
    prios.push(prio);
    checkPrioEdit(prio);
  }
}

/** checks which prio was pressed */
function addRightPrio() {
  if (document.getElementById('low-edit').classList.contains('low')) {
    rightPrio = "low";
  }
  else if (document.getElementById('medium-edit').classList.contains('medium')) {
    rightPrio = "medium";
  }
  else if (document.getElementById('urgent-edit').classList.contains('urgent')) {
    rightPrio = "urgent";
  }
  else { rightPrio = "low" }
}

/**
 * checks which prio is already set
 * @param {string} newprio = string of priority
 */
function checkPrioEdit(newprio) {
  for (let i = 0; i < prios.length; i++) {
    let prio = prios[i];
    if (prio != newprio || currentPrio == newprio) {
      takePrioEdit(prio);
    }
    else {
      getPrioEdit(prio);
    }
  }
  currentPrio = newprio;
}

/**
 * changes image of priority
 * @param {string} prio = string of priority
 */
function getPrioEdit(prio) {
  document.getElementById(prio + '-edit').classList.add(prio);
  document.getElementById(`${prio}-img-edit`).src = `/assets/img/${prio}-white.svg`;
  if (document.getElementById(prio + '-edit') == document.getElementById('urgent-edit')) {
    ifPrioEditSameUrgent();
  }
  else if (document.getElementById(prio + '-edit') == document.getElementById('medium-edit')) {
    ifPrioEditSameMedium();
  }
  else if (document.getElementById(prio + '-edit') == document.getElementById('low-edit')) {
    ifPrioEditSameLow();
  }
}

/** removes rest priority when urgent priority is pressed */
function ifPrioEditSameUrgent() {
  document.getElementById('low-edit').classList.remove('low');
  document.getElementById('low-img-edit').src = "/assets/img/prio-low.svg";
  document.getElementById('medium-edit').classList.remove('medium');
  document.getElementById('medium-img-edit').src = "/assets/img/prio-medium.svg";
}

/** removes rest priority when medium priority is pressed */
function ifPrioEditSameMedium() {
  document.getElementById('low-edit').classList.remove('low');
  document.getElementById('low-img-edit').src = "/assets/img/prio-low.svg";
  document.getElementById('urgent-edit').classList.remove('urgent');
  document.getElementById('urgent-img-edit').src = "/assets/img/prio-urgent.svg";
}

/** removes rest priority when low priority is pressed */
function ifPrioEditSameLow() {
  document.getElementById('medium-edit').classList.remove('medium');
  document.getElementById('medium-img-edit').src = "/assets/img/prio-medium.svg";
  document.getElementById('urgent-edit').classList.remove('urgent');
  document.getElementById('urgent-img-edit').src = "/assets/img/prio-urgent.svg";
}

/**
 * removes priority color if it was already priority color
 * @param {string} prio = string of priority
 */
function takePrioEdit(prio) {
  document.getElementById(prio + '-edit').classList.remove(prio);
  document.getElementById(`${prio}-img-edit`).src = `/assets/img/prio-${prio}.svg`;
}

/** opens assign to list container */
function openAssignToListEdit() {
  document.getElementById("assignToContainerEdit").innerHTML = openAssignToListEditHtml();
  document.getElementById("AssignToListEdit").classList.remove("d-none");
  document.getElementById("closedAssingToInputEdit").classList.add("border-drop-down");
  renderAddTaskContactsEdit();
}

/** closes assign to list container */
function closeAssignListEdit() {
  document.getElementById("assignToContainerEdit").innerHTML = closeAssignListEditHtml();
}

/** renders all contacts in edit card */
function renderAddTaskContactsEdit() {
  document.getElementById("AssignToListEdit").innerHTML = ``;
  contacts.forEach(contact => {
    document.getElementById("AssignToListEdit").innerHTML += renderContactsEditHtml(contact,UserIdIsAssigned(contact.id) ? 'checked' : '');
  });
}

function UserAssignSelectionChanged(contactId) {
  let assignUserCheckbox = document.getElementById(`${contactId}-input`);

    if (!assignUserCheckbox.checked){
      loadedTask.contact.push(contacts.find(c => c.id == contactId));
      assignUserCheckbox.checked = 'checked';
    }
    else {
      loadedTask.contact.splice(loadedTask.contact.findIndex(aUser => aUser.id == contactId),1);
      assignUserCheckbox.checked = '';
    }
    renderImgEdit();
}

function UserIdIsAssigned(userId) {
  return loadedTask.contact.findIndex(aUser => aUser.id == userId) > -1;
}

/** renders tasks and assign user */
function renderTasksEdit() {
  for (let i = 0; i < tasks.length; i++) {
    for (let k = 0; k < loadedTask.contact.length; k++) {
      contactColor = loadedTask.contact[k]["background"];
      document.getElementById("to do").innerHTML += taskCardHtml(i);
      renderArrays(i);
    }
  }
}