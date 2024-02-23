/*
 TASKLIST SECTION
*/

const taskForm = document.getElementById('enterTask');
const taskList = document.getElementById('taskList');
const taskItem = document.getElementById('task');
const checkOffTasks = document.getElementById('checkOffTasks');
const showTasks = document.getElementById('showCheckedTasks');
const resetTasks = document.getElementById('resetTasks');
const items = taskList.getElementsByClassName('checkbox');
const deleteTasks = taskList.getElementsByClassName('closeTask');
const listInstances = taskList.getElementsByTagName('li');

let taskAmount = items.length;

function clearTextArea(textarea) {
  textarea.value = '';
}

function addTask() {
  const task = taskItem.value;

  const addition = `<li class=individualTask> \
          <input type="checkbox" class="checkbox" \ /> \
          <span>${task}</span> \
          <button class="closeTask">Close</button> \
        </li>`;
  if (task != '') {
    taskList.innerHTML += addition;
  }

  return addition;
}

function removeTask(item) {
  taskList.removeChild(item);
}

function removeAllTasks() {
  let availableIndex = items.length;
  taskAmount = items.length;

  // doing it this way takes care of data races
  for (let i = 0; i < taskAmount; i++) {
    removeTask(listInstances[availableIndex - 1]);
    availableIndex--;
  }
}

function updateButtons() {
  for (let i = 0; i < deleteTasks.length; i++) {
    deleteTasks[i].addEventListener('click', function () {
      removeTask(deleteTasks[i].parentElement);
    });
  }
}

function removeAllCheckedBoxes() {
  taskAmount = items.length;

  for (let i = 0; i < taskAmount; i++) {
    if (items[i].checked == true) {
      listInstances[i].classList.add('hidden');
    }
  }
}

function showHiddenTasks() {
  taskAmount = items.length;

  for (let i = 0; i < taskAmount; i++) {
    if (items[i].checked == true) {
      listInstances[i].classList.remove('hidden');
    }
  }
}

checkOffTasks.addEventListener('click', function (e) {
  e.preventDefault();
  removeAllCheckedBoxes();
});

showCheckedTasks.addEventListener('click', function (e) {
  e.preventDefault();
  showHiddenTasks();
});

resetTasks.addEventListener('click', function (e) {
  e.preventDefault();
  removeAllTasks();
});

taskForm.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    addTask();
    clearTextArea(taskItem);
  }

  updateButtons();
});

taskForm.addEventListener('submit', function (e) {
  e.preventDefault(); //To prevent the button from autosubmitting
  addTask();
  clearTextArea(taskItem);

  updateButtons();
});


/*
 WEATHER SECTION
 **/

const zipCode = '20742,us';
const measurementUnit = 'standard';
const WEATHER_API_KEY = localStorage.getItem('WEATHER_API_KEY');
const weatherAPIUrl = new URL('https://api.openweathermap.org/data/2.5/weather');

const update = {
  zip: zipCode,
  units: measurementUnit,
  appid: WEATHER_API_KEY,
};

for (let key in update) {
  weatherAPIUrl.searchParams.append(key, update[key]);
}

const data = await fetch(weatherAPIUrl)
.then(response => response.json())
.catch(response => response.json()) 

console.log(await data);


