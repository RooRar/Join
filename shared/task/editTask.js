let tasks = [];
let prios = [];
let subTask = [];
let assignTo = [];
let category;
let color;
let currentPrio;
let currentId;
let currentStatusTemp;
let user = JSON.parse(localStorage.getItem("user")) || [];

window.onload (loadAll());

async function loadAll() {
  await init();
  getTasksId();
  renderAssignToList();
}

function setEditTaskData() {
  if (currentTask) {
    document.getElementById("editTaskHeadlineText").innerHTML = "<h1>Edit Task</h1>";
    document.getElementById("input-title").value = currentTask.title;
    document.getElementById("input-description").value = currentTask.description;
    document.getElementById("input-date").value = currentTask.date;
    
    assignTo = currentTask.contact;
    currentStatus = currentTask.status;
    renderImgEdit();
    category = currentTask.category;
    color = currentTask.color;
    closeCategoryList();
    console.log(currentTask.prio);
    getPrio("medium");
    currentTask.subTask.forEach(task => {
      subTask.push(task);
      document.getElementById("newSubtask").innerHTML += createNewSubtaskHtml(task);
    });
  }
  else {
    document.getElementById("editTaskHeadlineText").innerHTML = "<h1>Add Task</h1>";
  }
}

function clearEditTaskData() {

}

/** creates a random task id */
function getTasksId() {
  currentId = Math.random() + tasks.length;
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
  console.log("addingPrio")
  if (prios.includes(prio)) {
    checkPrio(prio);
  } else {
    console.log("pushPrio " + prio)
    prios.push(prio);
    checkPrio(prio);
  }
}

/**
 * checks which prio is already set 
 * @param {string} newprio = task priority
 */
function checkPrio(newprio) {
  console.log("checkPrio");
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
  console.log("getPrio " + prio)
  document.getElementById(prio).classList.add(prio);
  document.getElementById(`${prio}-img`).src = `/assets/img/${prio}-white.svg`;
  prios = [prio];
}

/**
 * removes past pressed priority
 * @param {string} prio = task priority
 */
function takePrio(prio) {
  document.getElementById(prio).classList.remove(prio);
  document.getElementById(`${prio}-img`).src = `/assets/img/prio-${prio}.svg`;
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
    getValuesFromInputs();
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

/** gets the values of the inputfields */
function getValuesFromInputs() {
  let title = document.getElementById("input-title");
  let description = document.getElementById("input-description");
  let date = document.getElementById("input-date");
  createTask(title, description, date);
}

/**
 * creates a new task
 * @param {input} title = inputfield of the title
 * @param {input} description = inputfield of the description
 * @param {input} date = inputfield of the date
 */
function createTask(title, description, date) {
  tasks.push({
    title: title.value,
    description: description.value,
    date: date.value,
    prio: currentPrio,
    category: category,
    color: color,
    subTask: subTask,
    contact: assignTo,
    status: currentStatus,
    subTaskFinish: 0,
    id: currentId,
  });
  addTaskAndLinkToBoard(title, description, date);
}

/**
 * add the task and link to board page
 * @param {input} title = inputfield of the title
 * @param {input} description = inputfield of the description
 * @param {input} date = inputfield of the date
 */
function addTaskAndLinkToBoard(title, description, date) {
  addTasks();
  linkToBoard();
  title.value = "";
  description.value = "";
  date.value = "";
}

/** link to board page */
function linkToBoard() {
  document.getElementById("addedToBoard").classList.remove("d-none");
  setTimeout(function () {
    window.location.href = "../board/board.html";
  }, 3000);
  document.getElementById("addedToBoard").classList.add("d-none");
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
    let newSubtask = document.getElementById("new-subTask").value;
    subTask.push(newSubtask);
    document.getElementById("newSubtask").innerHTML += createNewSubtaskHtml(newSubtask);
    clearSubtask();
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
  renderAddTaskContacts();
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
  }
}

/**
 * gets name and color of category
 * @param {string} name = name of category
 * @param {string} newcolor = name of color
 */
function getCategory(id) {
  cat = categories.find(c => c.id == id )
  category = cat.name;
  color = cat.color;
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
  document.getElementById("categoryListContainer").innerHTML =
    clearCategoryHtml();
}

/** clears add task page */
function clearAll() {
  window.location.href = "add_task.html";
}

/**
 * checks if contact is already in assign to and disable the name if so
 * @param {id} contact = id of contact
 */
function renderNoAssignToContacts(contact) {
  for (let j = 0; j < assignTo.length; j++) {
    if (document.getElementById(`${contact["id"]}-add`).innerText == `${assignTo[j]["firstName"]} ${assignTo[j]["surname"]}`) {
      document.getElementById(`${contact["id"]}-add`).classList.add("d-none");
    }
  }
}

/** display all contacts in assign to list */
function renderAllContacts() {
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const checkboxState = assignTo.some(aUser => aUser.id == contact.id) ? "checked" : "";
    document.getElementById("AssignToList").innerHTML += renderContactsHtml(contact,checkboxState);

    if (document.getElementById(`${contact["id"]}-add`).innerText == `${user["firstName"]} ${user["surname"]}`) {
      document.getElementById(`${contact["id"]}-add`).classList.add("d-none");
    }
    renderNoAssignToContacts(contact);
  }
}

/** checks if guest is logged in so display all users or a user is logged in and display the assign to you */
function renderAddTaskContacts() {
  if (user["firstName"] === "Ghost" && user["surname"] === "Guest") {
    renderAllContacts();
  }
  else if (!assignTo.some((item) => item.firstName === `${user["firstName"]}`) &&
    !assignTo.some((item) => item.surname === `${user["surname"]}`)) {
    document.getElementById("AssignToList").innerHTML = assignToYouTemplate();
    renderAllContacts();
  } else {
    renderAllContacts();
  }
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

/**
 * adds or remove  assign to you
 * @param {string} firstName = first name of assign to contact
 * @param {string} surname = surname of assign to contact
 */
function assignContactToYou(firstName, surname) {
  if (document.getElementById(`${user["mail"]}-inputYou`).checked == false) {
    document.getElementById(`${user["mail"]}-inputYou`).click();
    assignTo.push({
      firstName: firstName,
      surname: surname,
    });
  } else if (
    document.getElementById(`${user["mail"]}-inputYou`).checked == true
  ) {
    for (let j = 0; j < assignTo.length; j++) {
      if (assignTo[j]["firstName"] == firstName) {
        document.getElementById(`${user["mail"]}-inputYou`).click();
        assignTo.splice([j]);
      }
    }
  }
}

/**
 * push new subtask to subtask array
 * @param {string} newSubtask = name of new subtask
 */
function newSubTaskValue(newSubtask) {
  subTask.push(newSubtask);
}

/** adds task of database */
async function addTasks() {
  await backend.setItem("tasks", JSON.stringify(tasks));
}

/**
* creates a new task in template
 * @param {input} title = inputfield of the title
 * @param {input} description = inputfield of the description
 * @param {input} date = inputfield of the date
 */
function pushTaskOfTemplate(title, description, date) {
  tasks.push({
    title: title.value,
    description: description.value,
    date: date.value,
    prio: currentPrio,
    category: category,
    color: color,
    subTask: subTask,
    contact: assignTo,
    status: currentStatusTemp,
    subTaskFinish: 0,
    id: currentId,
  });
}

/** sets current status if no status is set */
function setCurrentStatus() {
  if (currentStatusTemp == undefined) { currentStatusTemp = "to do" }
  else { currentStatusTemp };
}

/** get values of inputfields in template */
function getValuesFromInputsTemplate() {
  let templateTitle = document.getElementById("inputTitleTemplate");
  let templateDescription = document.getElementById("inputDescriptionTemplate");
  let templateDate = document.getElementById("inputDateTemplate");
  createTaskTemplate(templateTitle, templateDescription, templateDate);
}

/**
 * add the task in template and link to board page if not on board page
 * @param {input} title = inputfield of the title
 * @param {input} description = inputfield of the description
 * @param {input} date = inputfield of the date
 */
async function createTaskTemplate(title, description, date) {
  getTasksId();
  setCurrentStatus();
  pushTaskOfTemplate(title, description, date);
  if (window.location.pathname == '/join/board/board.html' ||
    window.location.pathname == '/board/board.html') {
    addTasks();
    await updateHtml();
    title.value = "";
    description.value = "";
    date.value = "";
    closeAddTaskContainer();
  }
  else {
    addTaskAndLinkToBoard(title, description, date);
  }
}

function createNewSubtaskHtml(newSubtask) {

    return /*html*/ `
            <div class="checkSubtask-Container">
              <input readonly style="z-index: -1" type="checkbox">
              <span> ${newSubtask}</span>
          </div>
      `;
  }
  
  function clearSubtaskHtml() {
    return /*html*/ `<input class="task-board-input-fields" placeholder="Add new Subtasks" id="input-subTask" readonly onclick="addNewSubtask()"/>
    <img class="plus" src="../assets/img/plus.svg" onclick="addNewSubtask()">
    `;
  }
  
  function addNewSubtaskHtml() {
    return /*html*/ `
      <input type="text" type="text" maxlength="20" class="task-board-input-fields" placeholder="Add new Subtasks" id="new-subTask"/>
      <img class="cancelSubtask" src="../assets/img/clear.svg" onclick="clearSubtask()">
      <img class="checkSubtask" src="../assets/img/check-black.svg" onclick="createNewSubtask()" onsubmit="createNewSubtask()">
    `;
  }
  
  function newCategoryHtml() {
    return /*html*/ `
    <div class="d-flex" id="newCategoryInput">
      <input class="task-board-input-fields" placeholder="Add new Category" type="text" maxlength="20" id="newCategory"/>
      <img class="cancelSubtask" src="../assets/img/clear.svg" onclick="clearCategory()">
      <img class="checkSubtask" src="../assets/img/check-black.svg" onclick="createNewCategory()">
    </div>
    <div class="chooseColor">
      <span class="blue color-container" id="blue" onclick="getColorForCategory('blue')"></span>
      <span class="red color-container" id="red" onclick="getColorForCategory('red')"></span>
      <span class="green color-container" id="green" onclick="getColorForCategory('green')"></span>
      <span class="orange color-container" id="orange" onclick="getColorForCategory('orange')"></span>
      <span class="purple color-container" id="purple" onclick="getColorForCategory('purple')"></span>
      <span class="darkblue color-container" id="darkblue" onclick="getColorForCategory('darkblue')"></span>
    </div>
    `;
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
      <div class="category-option">
        <p class="newCategory" onclick="newCategory()">New Category</p>
      </div>
    </div>`;
  }

  function addCategoryOption(cat) {
    return /*html*/ `   
    <div class="category-option" onclick="getCategory('${cat["id"]}')">
      <p>${cat["name"]}</p>
      <span class="${cat["color"]} color-container"></span>
    </div>`;
  }
  
  function closeCategoryListHtml() {
    return /*html*/ `
    <div class="category" onclick="openCategoryList()" id="categoryInput">
      <div class="categoryInputContainer">
        <input class="categoryInputField" type="text" placeholder="Enter a Category" id="category"/>
      </div>
      <div id="colorContainer">
    </div>
    <div class="dropdownContainer">
      <img id="categoryListDropDownIcon" src="/assets/img/dropdown.svg" />
    </div>`;
  }
  
  function newCreatedCategory(createdCategory) {
    return /*html*/ `  
    <p>${createdCategory}</p>
    <span class="${color}"></span>
    `;
  }
  
  function clearCategoryHtml() {
    return /*html*/ `
    <div class="category" onclick="openCategoryList()" id="categoryInput">
    <div class="categoryInputContainer">
      <input class="categoryInputField" type="text" placeholder="Enter a Category" id="categoryInputField"/>
    </div>
    <div>
      <img id="categoryListDropDownIcon" src="/assets/img/dropdown.svg" />
    </div>
  `;
  }
  
  function openAssignToListHtml() {
    return /*html*/ `
    <div class="category" onclick="toggleAssignList()" id="closedAssingToInput">
    <input class="categoryInputField" type="text" placeholder="Assign to"/>
    <div class="dropdownContainer">
    <img id="assignToListDropDownIcon" src="/assets/img/dropdown.svg">
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
        <img id="assignToListDropDownIcon" src="/assets/img/dropdown.svg" />
      </div>
    </div>
    <div id="AssignToList" class="d-none categoryList"></div>
  </div>
  `;
  }
  
  function renderContactsHtml(contact,checkboxState) {
    return /*html*/ `
    <div onclick="assignContactTo('${contact["id"]}')" id="${contact["id"]}-add" class="assign-to-box" >
      ${contact["firstName"]} ${contact["surname"]}
      <input type="checkbox" id="${contact["id"]}-input" ${checkboxState} >
    </div>`;
  }
    
  function assignToYouTemplate() {
    return /*html*/ `
    <div onclick="assignContactToYou('${user["firstName"]}','${user["surname"]}')" 
    id="${user["mail"]}-addYou" class="assign-to-box" >
      You
      <input type="checkbox" id="${user["mail"]}-inputYou" >
    </div>`;
  }