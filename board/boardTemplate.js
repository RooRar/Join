function taskCardHtml() {
  return /*html*/ `
      <div draggable="true" ondragstart="startDragging(${currentTask['id']})" class="task-card" 
      id="${currentTask['id']}" onclick="openCard('${currentTask['id']}')">
      <div id="task-card-move-menu-${currentTask['id']}" class='task-card-move-menu d-none'>
            <div class="task-card-move-menu-headline">
                <span>Move Task</span>
            </div>
            <div class="task-card-move-menu-item" id="todo-move-menu-item-${currentTask['id']}" 
            onclick="event.stopPropagation(); moveTaskToStatus('${currentTask['id']}', 'to do')">
                <span>To do</span>
            </div>
            <div class="task-card-move-menu-item" id="inprogress-move-menu-item-${currentTask['id']}" 
            onclick="event.stopPropagation(); moveTaskToStatus('${currentTask['id']}', 'in progress')">
                <span>In progress</span>
            </div>
            <div class="task-card-move-menu-item" id="awaitingfeedback-move-menu-item-${currentTask['id']}" 
            onclick="event.stopPropagation(); moveTaskToStatus('${currentTask['id']}', 'awaiting feedback')">
                <span>Awaiting Feedback</span>
            </div>
            <div class="task-card-move-menu-item" id="done-move-menu-item-${currentTask['id']}" 
            onclick="event.stopPropagation(); moveTaskToStatus('${currentTask['id']}', 'done')">
                <span>Done</span>
            </div>
        </div>
        <div class="task-card-header"> 
            <div class="task-card-category ${currentTask["color"]}">
                <span>${currentTask["category"]}</span>
            </div>
            <div>
                <img id="task-card-move-menu-icon-${currentTask['id']}" class="task-card-move-menu-icon" 
                src="../assets/img/arrow-59-32.png" onclick="event.stopPropagation(); toggleMoveMenu(${currentTask['id']})">
            </div>
        </div>
          <div>
              <p class="task-card-title">${currentTask["title"]}</p>
          </div>
  
          <div>
              <p class="task-card-description" max-="22">${currentTask["description"]}</p>
          </div>
  
          <div class="task-card-subtask" id="subtaskContainer${currentTask['id']}">
          </div>
  
          <div class="space-between">
              <div class="task-card-contact" id="contactContainer${currentTask['id']}">
              </div>
  
              <div class="task-card-prio">
                  <img src="../assets/img/prio-${currentTask["prio"]}.svg" />
              </div>
          </div>
      </div>
      `;
}

function openCardHtml() {
  return /*html*/ `
    <div class="openTaskCardContainer">
        <div class="openedTaskCard" id="openedTaskCard">
            <div class="open-task-headline">
                <h2 class="open-task-card-category ${currentTask["color"]}" id="catgeory${currentTask['id']}">${currentTask["category"]}</h2>
                <img src="../assets/img/close.png" onclick="closeCard()">
            </div>
            <div class="open-task-card-title">
                <h1>${currentTask["title"]}</h1>
            </div>
            <div class="text open-task-card-description">
                <span>${currentTask["description"]}</span>
            </div>
            <div class="text open-task-card-date">
                <p><b>Due Date:</b> ${currentTask["date"]}</p>
            </div>
            <div class="text align-center">
                <p><b>Priority:</b></p> <p class="${currentTask["prio"]} open-task-card-prio">${currentTask["prio"]} 
                <img src="/assets/img/${currentTask["prio"]}-white.svg"></p>
            </div>
            <div id="subtask">
                <p class="text"><b>Subtask:</b></p>
                <div class="flex-column scrollbar-st" id="openedSubtaskContainer${currentTask['id']}">
                </div>
            </div>
            <div class="text">
                <p><b>Assing To:</b></p>
                <div id="assingToCard${currentTask['id']}" class="scrollbar">
                    
                </div>
            </div>
            <div class="buttonsTaskCard">
                <img onclick="editCardHtml(${currentTask['id']})" title="Edit task" class="editBtn" src="../assets/img/editResponsive.png">
                <img src="../assets/img/trash.png" title="Delete contact" onclick="deleteTask(${currentTask['id']})" class="editBtnTrash">
            </div>
        </div>
    </div>
        `;
}

function openCardAssingToHtml(contact) {
  return `
        <div class="align-center">
            <div>
                <p class="contact contact-height" style="background-color:${contactColor}">${contactChar}</p>
            </div>
            <p class="open-task-card-name">${contact["firstName"]} ${contact["surname"]}</p>
        </div>
        `;
}

function openCardSubtaskToHtml(id, j) {
  return /*html*/ `
    <div class="align-center">
      <div id="${id}">
      </div>
        <p>${currentTask['subTask'][j]}</p>
    </div>
    `;
}

function subtaskHtml(width) {
  return /*html*/ `
    <div class="align-center">
        <div class="progress">
            <div class="the-progress" style="width: ${width}px; background-color: ${currentTask["color"]}"></div>
        </div>
        <p>${currentTask['subTaskFinish']} / ${currentTask['subTask'].length}</p>
    </div>
        `;
}

function assignToHtml() {
  return /*html*/ `
        <div>
            <p class="contact"style="background-color: ${contactColor}">${contactChar}</p>
        </div>
        `;
}

function assignToBigger3Html() {
  return /*html*/`
    <div>
      <p class="contact" style="background-color: ${contactColor}">${contactChar}</p>
    </div>
    `;
}

function editCardHtmlTemplate(id) {
  return /*html*/`
  <div onclick="closeAssignListEdit()" class="editCardContainer" >
    <div onclick="closeCard()" class="closeImgEdit"><img src="../assets/img/close.png"></div>
      <div w3-include-html="/shared/task/editTask.html"></div>
    </div>
  </div>
      `;
}

function renderContactsEditHtml(contact,checkboxState) {
  return ` 
    <div onclick="UserAssignSelectionChanged('${contact["id"]}')" id="${contact["id"]}-edit" class="assign-to-box inputHover" >
      ${contact["firstName"]} ${contact["surname"]}
      <input id="${contact["id"]}-input" type="checkbox" ${checkboxState}>
    </div>`;
}

function openAssignToListEditHtml() {
  return /*html*/ `
    <div class="category" onclick="closeAssignListEdit()" id="closedAssingToInputEdit">
      <input class="categoryInputField" type="text" placeholder="Assign to"/>
      <img class="rotate90deg" src="/assets/img/dropdown.svg">
    </div>
    <div id="AssignToListEdit" class="d-none categoryList">`;
}

function closeAssignListEditHtml() {
  return /*html*/ `
        <div class="category" onclick="openAssignToListEdit()" id="assignToInputEdit">
          <div>
            <input class="categoryInputField" type="text" placeholder="Assign to"/>
          </div>
          <div>
            <img src="/assets/img/dropdown.svg" />
          </div>
        </div>
        <div id="assignToListEdit" class="d-none categoryList"></div>
      </div>
      `;
}

function subtaskFinishHtml(htmlid, id) {
  return /*html*/`
    <input id="${htmlid}" type="checkbox" checked="true" onclick="addSubtaskToDelete('${htmlid}', '${id}')">
  `;
}

function subtaskAddHtml(htmlid, id) {
  return /*html*/ `
    <input id="${htmlid}" type="checkbox" onclick="addSubtaskToFinish('${htmlid}', ${id})">
  `;
}