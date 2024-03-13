let prios = [];
let subTask = [];
let subTaskFinish = [];
let assignTo = [];
let category;
let color;
let currentPrio;
let currentId;
let user = JSON.parse(localStorage.getItem("user")) || [];

async function loadAll() {
  await init();
  renderAssignToList();
  setEditTaskData(undefined);
}

function setEditTaskData(task) {
  if (task) {
    document.getElementById("editTaskHeadlineText").innerHTML = `<img src="../assets/img/logo.png"><h2>Edit Task</h2><img src="../assets/img/close_white.png" id="closeButton" onclick="closeAddTaskContainer()">`;
    document.getElementById("taskSaveButton").innerHTML = `Save Task<img src="../assets/img/check.svg" />`
    document.getElementById("input-title").value = task.title;
    document.getElementById("input-description").value = task.description;
    document.getElementById("input-date").value = task.date;
    
    currentId = task.id;
    assignTo = task.contact ? task.contact : [];
    currentStatus = task.status;
    renderImgEdit();
    category = task.category;
    color = task.color;
    closeCategoryList();
    currentPrio = task.prio;
    getPrio(task.prio);
    subTask = [];
    document.getElementById("newSubtask").innerHTML = '';
    task.subTask.forEach(task => {
      subTask.push(task);
      document.getElementById("newSubtask").innerHTML += createNewSubtaskHtml(task);
    });
    document.getElementById("taskClearButton").classList.add('d-none');    
  }
  else {
    currentId = getNewId();
    document.getElementById("editTaskHeadlineText").innerHTML =  `<img src="../assets/img/logo.png"><h2>Add Task</h2><img src="../assets/img/close_white.png" id="closeButton" onclick="closeAddTaskContainer()">`;
    document.getElementById("taskSaveButton").innerHTML = `Create Task<img src="../assets/img/check.svg" />`
    document.getElementById("taskClearButton").classList.remove('d-none');
    clearEditTaskData();
  }
}

function clearEditTaskData() {
  assignTo = [];
  currentStatus = 'to do';
  category = "";
  renderImgEdit();
  document.getElementById("input-title").value = "";
  document.getElementById("input-description").value = "";
  document.getElementById("input-date").value = "";
  document.getElementById("categoryListContainer").innerHTML = clearCategoryHtml();
  if (document.getElementById("taskSubtask"))
    document.getElementById("taskSubtask").innerHTML = '';
  currentPrio = "";
  document.getElementById('low').classList.remove('low');
  document.getElementById('medium').classList.remove('medium');
  document.getElementById('urgent').classList.remove('urgent');
  document.getElementById('newSubtask').innerHTML = '';
  subTask = [];
  
}

/** displays all user images which are already assign to the task */
function renderImgEdit() {

  document.getElementById('profileImgEdit').innerHTML = ``;

  contacts.forEach( contact => {
    document.getElementById('profileImgEdit').innerHTML += `<div class="profilePictureEdit dp-none" id="profilePictureEdit-${contact.id}"></div>`;
    let AssignedUserImage = document.getElementById(`profilePictureEdit-${contact.id}`);
    
    if (assignTo.findIndex(c => c.id == contact.id) > -1)
      AssignedUserImage.classList.remove('dp-none');  

    AssignedUserImage.style.background = contact.background;
    AssignedUserImage.innerHTML = 
    `<img onclick="deleteAssignUser('${contact.id}')" src="../assets/img/cancel.png">
    <span>
      ${contact["firstName"]?.charAt(0).toUpperCase() + contact["surname"]?.charAt(0).toUpperCase()}
    </span>`;
  });
}

/** disables past days in calendar */
function disableDateinput() {
  var today = new Date().toISOString().split("T")[0];
  document.getElementsByName("input-date")[0].setAttribute("min", today);
}

/** disables past days in template calendar */
function disableDateInputTemplate() {
  var today = new Date().toISOString().split("T")[0];
  document.getElementsByName("inputDateTemplate")[0].setAttribute("min", today);
}

/**
 * adds the priority to the task
 * @param {string} prio = task priority
 */
function addingPrio(prio) {
  if (prios.includes(prio)) {
    checkPrio(prio);
  } else {
    prios.push(prio);
    checkPrio(prio);
  }
}

/**
 * checks which prio is already set 
 * @param {string} newprio = task priority
 */
function checkPrio(newprio) {
  for (let i = 0; i < prios.length; i++) {
    let prio = prios[i];
    if (prio != newprio || currentPrio == newprio) {
      takePrio(prio);
    } else {
      getPrio(prio);
    }
  }
  currentPrio = newprio;
}

/**
 * displays current pressed priority
 * @param {string} prio = task priority
 */
function getPrio(prio) {
  document.getElementById(prio).classList.add(prio);
  document.getElementById(`${prio}-img`).src = `../assets/img/${prio}-white.svg`;
  prios = [prio];
}

/**
 * removes past pressed priority
 * @param {string} prio = task priority
 */
function takePrio(prio) {
  document.getElementById(prio).classList.remove(prio);
  document.getElementById(`${prio}-img`).src = `../assets/img/prio-${prio}.svg`;
}

/** checks if every necessary field is filled */
function mustFields() {
  if (!category && !currentPrio) {
    mustFieldsWithoutBoth();
  }
  else if (!category && currentPrio) {
    mustFieldsOnlyPrio();
  }
  else if (!currentPrio && category) {
    mustFieldsOnlyCategory();
  }
  else {
    createTask();
  }
}

/** displays that two fields are not filled */
function mustFieldsWithoutBoth() {
  document.getElementById("categoryInput").classList.add("error");
  document.getElementById("prios").classList.add("error");
  setTimeout(() => {
    document.getElementById("prios").classList.remove("error");
    document.getElementById("categoryInput").classList.remove("error");
  }, 1500);
}

/** displays that category field is not filled */
function mustFieldsOnlyPrio() {
  document.getElementById("categoryInput").classList.add("error");
  setTimeout(() => {
    document.getElementById("categoryInput").classList.remove("error");
  }, 1500);
}

/** displays that new category field is not filled */
function mustFieldsNewCategory() {
  document.getElementById("newCategory").classList.add("error");
  setTimeout(() => {
    document.getElementById("newCategory").classList.remove("error");
  }, 1500);
}

/** displays that priority field is not filled */
function mustFieldsOnlyCategory() {
  document.getElementById("prios").classList.add("error");
  setTimeout(() => {
    document.getElementById("prios").classList.remove("error");
  }, 1500);
}

/**
 * creates a new task
 */
function createTask() {
  const taskIndex = tasks.findIndex(tsk => tsk.id == currentId)
  if ( taskIndex > -1)
    tasks.splice(taskIndex,1);

  tasks.push({
    title: document.getElementById("input-title").value,
    description: document.getElementById("input-description").value,
    date: document.getElementById("input-date").value,
    prio: currentPrio,
    category: category,
    color: color,
    subTask: subTask,
    contact: assignTo ? assignTo : [],
    status: currentStatus,
    subTaskFinish: subTaskFinish,
    id: currentId,
  });
  addTaskAndLinkToBoard();
}

/**
 * add the task and link to board page
 */
function addTaskAndLinkToBoard() {
  addTasks();
  linkToBoard();
}

/** link to board page */
function linkToBoard() {
  document.getElementById("addedToBoard").classList.remove("d-none");
  setTimeout(function () {
    window.location.href = "../board/board.html";
    document.getElementById("addedToBoard").classList.add("d-none");
    clearEditTaskData();
    currentTask = undefined;
  }, 1500);
}

/** add a new subtask */
function addNewSubtask() {
  document.getElementById("addNewSubtask").innerHTML = addNewSubtaskHtml();
  document.getElementById("new-subTask").select();
}

/** empty subtask field */
function clearSubtask() {
  document.getElementById("emptySubtask").classList.add("d-none");
  document.getElementById("addNewSubtask").innerHTML = clearSubtaskHtml();
}

/** create new subtask after clicking on check */
function createNewSubtask() {
  if (document.getElementById("new-subTask").value.length < 1) {
    document.getElementById("emptySubtask").classList.remove("d-none");
  } else {
    document.getElementById("emptySubtask").classList.add("d-none");
    let newSubTask = {id: getNewId(), name: document.getElementById("new-subTask").value, finished: false};
    subTask.push(newSubTask);
    document.getElementById("newSubtask").innerHTML += createNewSubtaskHtml(newSubTask);
    clearSubtask();
  }
}

function toggleSubTask(subTaskId) {
  const subtaskIndex = subTask.findIndex(s => s.id == subTaskId);
  if (subtaskIndex > -1) {
    subTask[subtaskIndex].finished = subTask[subtaskIndex].finished == true ? false : true;
  } 

}

/** opens "category" list */
function openCategoryList() {  
  closeAssignList();
  document.getElementById("categoryListContainer").innerHTML = openCategoryListHtml();

  categories.forEach(cat => {
    document.getElementById("categoryList").innerHTML += addCategoryOption(cat);
  });

  document.getElementById("closedCategoryInput").classList.add("border-drop-down");
  document.getElementById("categoryList").classList.remove("d-none");
  document.getElementById("categoryList").style = `border-top: none`;
}

function renderAssignToList() {
  document.getElementById("assignToContainer").innerHTML = openAssignToListHtml();
  renderAllContacts();
}

/** close "assign to" list */
function closeAssignList() {
  if (!document.getElementById("AssignToList").classList.contains("d-none")) {
    toggleAssignList();
  }
}

/** opens "assign to" list */
function openAssignToList() {
  closeCategoryList();
  document.getElementById("AssignToList").classList.remove("d-none");
  document.getElementById("closedAssingToInput").classList.add("border-drop-down");
}

/** toggle "assign to" list */
function toggleAssignList() {
  console.log("toggle")
  if (document.getElementById("AssignToList").classList.contains("d-none")) {
    renderAssignToList();
    document.getElementById("AssignToList").classList.remove("d-none"); 
  }
  else {
    document.getElementById("AssignToList").classList.add("d-none");
  }
  document.getElementById("assignToListDropDownIcon").classList.toggle("rotate90deg");
  document.getElementById("closedAssingToInput").classList.toggle("border-drop-down");
}

/** close "category" list */
function closeCategoryList() {
  document.getElementById("categoryListContainer").innerHTML = closeCategoryListHtml();
  if (category != undefined) {
    document.getElementById("colorContainer").innerHTML += `<div class="${color} color-container"></div>`;
    document.getElementById("category").value = `${category}`;
  }
}

/** open new category container */
function newCategory() {
  document.getElementById("categoryListContainer").innerHTML = newCategoryHtml();
}

/** creates a new category */
function createNewCategory() {
  let createdCategory = document.getElementById("newCategory").value;
  if (createdCategory == "" || color == undefined) {
    mustFieldsNewCategory();
  }
  else {
    document.getElementById("newCategoryInput").innerHTML += newCreatedCategory(createdCategory);
    let cat = [getNewId(), createdCategory, color, currentId];
    categories.push({
      id: cat[0],
      name: cat[1],
      color: cat[2]
    });
    setCategoriesToBackend(categories);
    closeCategoryList();
    getCategory(cat[0]);
  }
}

function deleteCategory(categoryId) {
  const categoryIndex = categories.findIndex(category => category.id == categoryId);
  if (categoryIndex > -1) {
    categories.splice(categoryIndex, 1);
    setCategoriesToBackend(categories);
  }
  closeCategoryList();
  document.getElementById('category').value = "";
  document.getElementById('colorContainer').innerHTML = ""
}

/**
 * gets name and color of category
 * @param {string} name = name of category
 * @param {string} newcolor = name of color
 */
function getCategory(id) {
  cat = categories.find(c => c.id == id )
  if (cat) {
    category = cat.name;
    color = cat.color;  
  }
  else {
    clearCategory();
  }
  closeCategoryList();
}

/**
 * checks which color is used for the category
 * @param {string} newcolor = name of color
 */
function getColorForCategory(newcolor) {
  color = newcolor;
  if (color == newcolor) {
    document.getElementById(newcolor).classList.add("active-color");
  } else {
    document.getElementById(newcolor).classList.remove("active-color");
  }
}

/** empty category container */
function clearCategory() {
  document.getElementById("newCategoryInput").classList.add("d-none");
  document.getElementById("categoryListContainer").innerHTML = clearCategoryHtml();
} 

/** display all contacts in assign to list */
function renderAllContacts() {
  contacts.forEach(contact => {
    const checkboxState = assignTo.some(aUser => aUser.id == contact.id) ? "checked" : "";
    document.getElementById("AssignToList").innerHTML += renderContactsHtml(contact,checkboxState);
    if (contact.id == user.id) {
      document.getElementById(contact.id + '-add').style.order = -1
      document.getElementById('assignToDisplayedName-' + contact.id).innerHTML = 'You'
      document.getElementById('assignToDisplayedName-' + contact.id).classList.add('assignToSpanTextYou');
    }
  });
}

/**
 * adds or remove  assign to contact
 * @param {string} firstName = first name of assign to contact
 * @param {string} surname = surname of assign to contact
 * @param {id} i = id of contact
 */
function assignContactTo(contactId) {
  let contact = getContactById(contactId);
  let assignUserCheckbox = document.getElementById(`${contactId}-input`);

  if (!assignUserCheckbox.checked) {
    assignUserCheckbox.checked = 'checked';
    assignTo.push(contact);
  } 
  else {
    assignTo.splice(assignTo.findIndex(aUser => aUser.id == contactId),1);
    assignUserCheckbox.checked = '';
  }
  renderImgEdit();
}

/** adds task of database */
async function addTasks() {
  await backend.setItem("tasks", JSON.stringify(tasks));
}

function createNewSubtaskHtml(newSubtask) {
    return /*html*/ `
            <div class="checkSubtask-Container">
              <input id="SubTaskCheckBox-${newSubtask["id"]}" readonly style="z-index: -1" type="checkbox" onclick="toggleSubTask('${newSubtask["id"]}')" ${newSubtask.finished ? 'checked' : ''}>
              <span> ${newSubtask["name"]}</span>
          </div>`;
  }
  
  function clearSubtaskHtml() {
    return /*html*/ `<input class="task-board-input-fields" placeholder="Add new Subtasks" id="input-subTask" readonly onclick="addNewSubtask()"/>
    <img class="plus" src="../assets/img/plus.svg" onclick="addNewSubtask()">`;
  }
  
  function addNewSubtaskHtml() {
    return /*html*/ `
      <input type="text" type="text" maxlength="20" class="task-board-input-fields" placeholder="Add new Subtasks" id="new-subTask"/>
      <img class="cancelSubtask textHover" src="../assets/img/clear.svg" onclick="clearSubtask()">
      <img class="checkSubtask textHover" src="../assets/img/check-black.svg" onclick="createNewSubtask()" onsubmit="create()">`;
  }
  
  function newCategoryHtml() {
    return /*html*/ `
    <div class="d-flex" id="newCategoryInput">
      <input class="task-board-input-fields" placeholder="Add new Category" type="text" maxlength="20" id="newCategory"/>
      <img class="cancelSubtask textHover" src="../assets/img/clear.svg" onclick="clearCategory()">
      <img class="checkSubtask textHover" src="../assets/img/check-black.svg" onclick="createNewCategory()">
    </div>
    <div class="chooseColor">
      <span class="blue color-container" id="blue" onclick="getColorForCategory('blue')"></span>
      <span class="red color-container" id="red" onclick="getColorForCategory('red')"></span>
      <span class="green color-container" id="green" onclick="getColorForCategory('green')"></span>
      <span class="orange color-container" id="orange" onclick="getColorForCategory('orange')"></span>
      <span class="purple color-container" id="purple" onclick="getColorForCategory('purple')"></span>
      <span class="darkblue color-container" id="darkblue" onclick="getColorForCategory('darkblue')"></span>
    </div>`;
  }
  
  function openCategoryListHtml() {
    return /*html*/ `
    <div class="category" onclick="closeCategoryList()" id="closedCategoryInput">
      <input class="categoryInputField" type="text" placeholder="Enter a Category"/>
      <div class="dropdownContainer">
        <img class="rotate90deg" src="../assets/img/dropdown.svg">
      </div>
    </div>
    <div id="categoryList" class="d-none categoryList">
      <div class="category-option inputHover">
        <p class="newCategory" onclick="newCategory()">New Category</p>
      </div>
    </div>`;
  }

  function addCategoryOption(cat) {
    return /*html*/ `   
    <div class="category-option inputHover" onclick="getCategory('${cat["id"]}')">
      <p>${cat["name"]}</p>
      <div class="categoryListItemButtons">
      <span class="${cat["color"]} color-container"></span>
      <img class="deleteCategoryIcon imgHover" src="../assets/img/trash.png" onclick="event.stopPropagation(); deleteCategory('${cat["id"]}')">
      </div>
    </div>`;
  }
  
  function closeCategoryListHtml() {
    return /*html*/ `
    <div class="category inputHover" onclick="openCategoryList()" id="categoryInput">
      <div class="categoryInputContainer">
        <input class="categoryInputField" type="text" placeholder="Enter a Category" id="category"/>
      </div>
      <div id="colorContainer">
    </div>
    <div class="dropdownContainer">
      <img id="categoryListDropDownIcon" src="../assets/img/dropdown.svg" />
    </div>`;
  }
  
  function newCreatedCategory(createdCategory) {
    return /*html*/ `  
    <p>${createdCategory}</p>
    <span class="${color}"></span>`;
  }
  
  function clearCategoryHtml() {
    return /*html*/ `
    <div class="category inputHover" onclick="openCategoryList()" id="categoryInput">
    <div class="categoryInputContainer">
      <input class="categoryInputField" type="text" placeholder="Enter a Category"/>
    </div>
    <div>
      <img id="categoryListDropDownIcon" src="../assets/img/dropdown.svg" />
    </div>`;
  }
  
  function openAssignToListHtml() {
    return /*html*/ `
    <div class="category inputHover" onclick="toggleAssignList()" id="closedAssingToInput">
    <input class="categoryInputField" type="text" placeholder="Assign to"/>
    <div class="dropdownContainer">
    <img id="assignToListDropDownIcon" src="../assets/img/dropdown.svg">
    </div>
    </div>
    <div id="AssignToList" class="d-none categoryList">`;
  }
  
  function closeAssignListHtml() {
    return /*html*/ `
    <div class="category" onclick="openAssignToList()" id="assignToInput">
      <div class="categoryInputContainer">
        <input class="categoryInputField" type="text" placeholder="Assign to"/>
      </div>
      <div class="dropdownContainer">
        <img id="assignToListDropDownIcon" src="../assets/img/dropdown.svg" />
      </div>
    </div>
    <div id="AssignToList" class="d-none categoryList"></div>
    </div>`;
  }
  
  function renderContactsHtml(contact,checkboxState) {
    return /*html*/ `
    <div onclick="assignContactTo('${contact["id"]}')" id="${contact["id"]}-add" class="assign-to-box inputHover" >
      <span id="assignToDisplayedName-${contact["id"]}">${contact["firstName"]} ${contact["surname"]}</span>
      <input type="checkbox" id="${contact["id"]}-input" ${checkboxState} >
    </div>`;
  }