// import TaskController from "./controller/controller.js";

// document.getElementById("addTaskButton").addEventListener("click", () => TaskController.addTask());


// main.js
// import { TodoController } from "./controller/controller01.js";

// const todoApp = new TodoController();
// document.getElementById("addTaskButton").addEventListener("click", () => todoApp.handleAddTask());


import { TodoView } from "./view/views01.js";
import { TodoController } from "./controller/controller01.js";


document.addEventListener("DOMContentLoaded", () => {
    
    const container = document.getElementById('container1');
    const container1 = document.getElementById('container2');
    
    if (!container) {
        throw new Error("Container element not found!");
    }

    const todoView1 = new TodoView(container1);
    const todoController1 = new TodoController(container1); 

    const todoView = new TodoView(container);
    const todoController = new TodoController(container); 
    // const todoModel= new TodoModel(container)
});

