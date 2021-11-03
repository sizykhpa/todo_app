const form = document.querySelector("form");
const listToDo = document.querySelector("#list_todo");
const completedTasks = document.querySelector("#completed_tasks")
const buttonHide = document.querySelector("#button_hide")
const completedDiv = document.querySelector("#completed")
const boxIsCheckedToMove = document.querySelector(".boxIsChecked")

let todoDict = {};
let statusDict = {};
let dictIdNumber = null;
let getIdOfTask = null;
let firstPartOfId = "id";
let fullId = null;

function createElements(){
  const newLi = document.createElement("li");
  const newCheck = document.createElement("input");
  const newSpan = document.createElement("span");
  const newButton = document.createElement("button");
  return {
    newLi, 
    newCheck, 
    newSpan, 
    newButton
  }
}
//Set position of the collapse/expand buttun to the last saved
if (localStorage.getItem("hide_button") === "1"){
    buttonHide.children.arrow_symbol.classList.remove("rotate_arrow");
    completedDiv.style.display = "none";
  }
//Get last value of dictIdNumber
if (localStorage.getItem("dict_number") === null){
  dictIdNumber = 1;
} else {
  dictIdNumber = parseInt(localStorage.getItem("dict_number"));
}
//Re-create two dictionaries from local storage
if (JSON.parse(localStorage.getItem("todo_items")) != null) {
  todoDict = JSON.parse(localStorage.getItem("todo_items"));
}
if (JSON.parse(localStorage.getItem("status_items")) != null) {
  statusDict = JSON.parse(localStorage.getItem("status_items"));
}

//Retreive tasks from local storage and append them in to the page when page reloaded
document.addEventListener("DOMContentLoaded", function(){
  for (var key in todoDict) {
    const { newLi, newCheck, newSpan, newButton } = createElements(); //create new elements
    newSpan.innerText = todoDict[key];
    newSpan.classList.add("todo_span", key);
    newCheck.setAttribute("type", "checkbox");
    newCheck.classList.add("check_box")
    newButton.innerText = "Remove";
    newButton.classList.add("remove_button")
    
    newLi.prepend(newCheck);
    newLi.append(newSpan);
    newLi.append(newButton);
    if (statusDict[key] === false){ //Append item to the todo list if "id" is false
      listToDo.prepend(newLi);
    } else { //Otherwise append item in to the completed section, add cross-line class, add attribute checked
      newLi.classList.add("cross_line")
      newLi.children[0].setAttribute("checked", true)
      newSpan.classList.add("completed")
      newCheck.classList.add("boxIsChecked")
      completedTasks.append(newLi);
    }    
  }
});

//Create a new item and append it in to the todo list
form.addEventListener("submit", function(event) {
  event.preventDefault();
  const newTaskInput = document.querySelector("#task_todo");
  //Create elements
  const { newLi, newCheck, newSpan, newButton } = createElements();

  newSpan.innerText = newTaskInput.value; //Get a value from input and insert it to the task
  
  fullId = firstPartOfId + dictIdNumber;
  todoDict[fullId] = newSpan.innerText; //Add item to the todo dictionary
  statusDict[fullId] = newSpan.classList.contains("completed") //Add item to the status dictionary
  localStorage.setItem("todo_items", JSON.stringify(todoDict)); //Save todo dictionary to the "todo items" local storage 
  localStorage.setItem("status_items", JSON.stringify(statusDict)); //Save status dictionary to the "status items" local storage 
  dictIdNumber++;
  localStorage.setItem("dict_number", dictIdNumber) // Save dictIdNumber to the "dict_number" local storage
  
  newButton.innerText = "Remove";
  newButton.classList.add("remove_button");
  newSpan.classList.add("todo_span", fullId);
  newCheck.setAttribute("type", "checkbox");
  newCheck.classList.add("check_box");
  
  newLi.prepend(newCheck);
  newLi.append(newSpan);
  newLi.append(newButton);
  listToDo.prepend(newLi);
  
  form.reset();
});

//Remove a task when the remove button is clicked. 
document.querySelector("body").addEventListener("click", function(event) {
  if (event.target.classList.contains("remove_button") === true) {
   getIdOfTask = event.target.previousElementSibling.classList[1];
    for(var key in todoDict) {
      if (key === getIdOfTask) {
        delete todoDict[key];
        delete statusDict[key];
        localStorage.setItem("todo_items", JSON.stringify(todoDict));
        localStorage.setItem("status_items", JSON.stringify(statusDict));
      }
    }
    event.target.parentElement.remove();
  } else if (event.target.classList.contains("check_box") === true) {
    let a = event.target.parentElement //<li>
    let b = event.target //<input> checkbox
    let c = event.target.nextElementSibling //<span>
// Move item back to the todo section       
    if (event.target.classList.contains("boxIsChecked") === true) {
      a.classList.remove("cross_line")
      b.classList.remove("boxIsChecked")
      b.setAttribute("checked", false)
      c.classList.remove("completed")
      ll = c.classList[1]
      statusDict[ll] = c.classList.contains("completed");
      localStorage.setItem("status_items", JSON.stringify(statusDict)); 
      listToDo.prepend(a)
//Move item from the todo list to the completed section.       
    } else {
      a.classList.add("cross_line")
      b.classList.add("boxIsChecked")
      b.setAttribute("checked", true)
      c.classList.add("completed")
      ll = c.classList[1] //get value of id from <span>
      statusDict[ll] = c.classList.contains("completed"); //set status of the id as "true" in the statusDict dictionary
      localStorage.setItem("status_items", JSON.stringify(statusDict)); //save to the "status_items" local storage
      completedTasks.append(a)
    }
  } 
});

//Collapse/Expand completed tasks, set the hide button value and save to local storage
buttonHide.addEventListener("click", function(event){
  event.preventDefault(); 
  if (completedDiv.style.display === "none") {
    completedDiv.style.display = "block";
    buttonHide.children.arrow_symbol.classList.add("rotate_arrow")
    localStorage.setItem("hide_button", 0);
  } else {
    completedDiv.style.display = "none";
    buttonHide.children.arrow_symbol.classList.remove("rotate_arrow")
    localStorage.setItem("hide_button", 1);
  }
});