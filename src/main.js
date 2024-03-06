// Import functions from modules
import { createAndAppend } from "./modules/display.js";
import { deleteTasks, getTasks, patchTasks, postTasks } from "./modules/fetch.js";

// Global variable to store tasks data
let tasksData;

// DOM elements
const form = document.querySelector("form");
const toDoContainer = document.querySelector("#toDo");
const inProgressContainer = document.querySelector("#inProgress");
const doneContainer = document.querySelector("#done");

// Function till tasks
const handleAssignTask = (task, inputValue) => {
  if (inputValue.length > 2) {
    patchTasks(task, "-" + inputValue, "in progress").then(() => {
      window.location.reload();
    }).catch(e => console.log(e));
  } else {
    alert("Please enter a name!");
  }
};

// Funktion för att hantera att markera en uppgift som klar
const handleMarkDone = (task) => {
  // Se till att tasksData är definierad och innehåller uppgiften
  if (tasksData && tasksData[task]) {
    patchTasks(task, tasksData[task].assigned, "done").then(() => {
      window.location.reload();
    }).catch(e => console.log(e));
  } else {
    console.log("Error: Task not found in tasksData");
  }
};

// Funktion för att hantera att ta bort en uppgift
const handleRemoveTask = (task) => {
  deleteTasks(task).then(() => {
    window.location.reload();
  }).catch(e => console.log(e));
};

// Hämta uppgifter och fyll i behållare
getTasks().then(data => {
  tasksData = data;

  for (const task in tasksData) {
    let taskCardStyle;

    // Ställ in TaskCardStyle baserat på kategori
    switch (tasksData[task].category) {
      case "ux":
        taskCardStyle = "uxTask";
        break;
      case "dev backend":
        taskCardStyle = "backDevTask";
        break;
      case "dev frontend":
        taskCardStyle = "frontDevTask";
        break;
      default:
        taskCardStyle = "";
    }

    if (tasksData[task].status == "to do") {
      let inputField = document.createElement("input");
      createAndAppend(tasksData[task].task, tasksData[task].assigned, inputField, "Assign>>", task, taskCardStyle, toDoContainer);

      inputField.id = task;
      toDoContainer.addEventListener("click", ({ target }) => {
        if (target.innerText == "Assign>>" && task == target.id) {
          let inputValue = document.getElementById(task).value;
          handleAssignTask(task, inputValue);
        }
      });
    } else if (tasksData[task].status == "in progress") {
      createAndAppend(tasksData[task].task, tasksData[task].assigned, null, "Done>>", task, taskCardStyle, inProgressContainer);

      inProgressContainer.addEventListener("click", ({ target }) => {
        if (target.innerText == "Done>>" && task == target.id) {
          handleMarkDone(task);
        }
      });
    } else if (tasksData[task].status == "done") {
      createAndAppend(tasksData[task].task, tasksData[task].assigned, null, "Remove X", task, taskCardStyle, doneContainer);

      doneContainer.addEventListener("click", ({ target }) => {
        if (target.innerText == "Remove X" && task == target.id) {
          handleRemoveTask(task);
        }
      });
    }
  }
});

// Event listener 
form.addEventListener("submit", (event) => {
  event.preventDefault();


  let category = document.querySelector("#category").value;
  let task = document.querySelector("#taskInput").value;
  form.reset();

  //Lägg upp uppgiften och ladda om sidan
  postTasks(category, task).then(() => {
    window.location.reload();
  }).catch(e => console.log(e));
});
