async function initIndex() {
    await includeHTMLLogin();
    await getDataFromBackend();
}

async function init() {
    await getDataFromBackend();
    await includeHTML();
}

async function getDataFromBackend() {
    setURL('http://roman-bartholemy.de/join/smallest_backend_ever');
    await downloadFromServer();
    contacts = await JSON.parse(await backend.getItem('contactsASText')) || [];
    tasks = await JSON.parse(await backend.getItem('tasks')) || [];
    categories = await JSON.parse(await backend.getItem('categories')) || [];
    subTasksFinish = await JSON.parse(await backend.getItem('subTasks')) || [];
}

async function setCategoriesToBackend(categories) {
    await backend.setItem("categories", JSON.stringify(categories));
}

async function includeHTMLLogin() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    await changeProfileImage();
    changeFocusNav();
}

async function changeProfileImage() {
    let profileImage = document.getElementById('profileImage');
    let userImg = await JSON.parse(localStorage.getItem("user")) || [];
    profileImage.innerHTML = `${userImg["firstName"].charAt(0).toUpperCase()}${userImg["surname"].charAt(0).toUpperCase()}`;
    document.getElementById('profileImage').style.background = `${userImg["background"]}`;
}

function getNewId() {
    return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
}

function changeFocusNav() {
    if (window.location.href.includes("contacts.html")) {
        document.getElementById('contactsNav').style.background = "#091931";
    }
    else if (window.location.href.includes("summary.html")) {
        document.getElementById('summaryNav').style.background = "#091931";
    }
    else if (window.location.href.includes("legal.html")) {
        document.getElementById('legalNav').style.background = "#091931";
    }
    else if (window.location.href.includes("add_task.html")) {
        document.getElementById('addTaskNav').style.background = "#091931";
    }
    else if (window.location.href.includes("board.html")) {
        document.getElementById('boardNav').style.background = "#091931";
    }
}

function getContactById(contactId) {
    return contacts.find(contact => contact.id == contactId);
}
function openLogoutOption() {
    if (window.matchMedia("(max-width: 900px)").matches) {
        document.getElementById('legalButton').classList.remove('dp-none');
        document.getElementById('helpButton').classList.remove('dp-none');
    }
    if (document.getElementById('logoutContainer').classList.contains('dp-none')) {
        document.getElementById('logoutContainer').classList.remove('dp-none');
    }
    else {
        document.getElementById('logoutContainer').classList.add('dp-none');
    }
}

function logOut() {
    localStorage.removeItem("user");
    window.location = '../index.html'
}