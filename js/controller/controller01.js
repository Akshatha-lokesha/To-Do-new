import { TodoView } from '../view/views01.js';
import { TodoModel } from '../model/model01.js';

export class TodoController {
    constructor(containerId) {
        if (!containerId) {
            throw new Error("Container not found.");
        }
        this.container = containerId;
        
        const container_ID= this.container.id
        if (!this.container) {
            throw new Error("Container not found.");
        }

        this.model = new TodoModel();
        this.view = new TodoView(this.container);
    
        this.model.loadData(container_ID); 
        this.view.renderAllTasks(this.model.tasks);

        this.addEventListeners();
        this.updateProgress(this.container); 
    }

    
    addEventListeners() {
       
       const containerElement = this.container;

        containerElement.querySelector(".search-task-input").addEventListener("input", (e) => this.handleSearch(e));
        containerElement.querySelector(".add-task-button").addEventListener("click", () => this.handleAddTask());

        containerElement.querySelector(".task-list-container").addEventListener("click", (e) => this.handleTaskComplete(e));
        containerElement.querySelector(".task-list-container").addEventListener("click", (e) => this.handleRemoveTask(e));
        containerElement.querySelector(".task-list-container").addEventListener("click", (e) => this.handleEditTask(e));

        containerElement.querySelector(".filter-start-date").addEventListener("input", () => this.filterTasksByDate());
        containerElement.querySelector(".filter-end-date").addEventListener("input", () => this.filterTasksByDate());
        containerElement.querySelector(".keyword-search-input").addEventListener("input", (e) => this.handleKeyWordSearch(e));
        containerElement.querySelector(".groupBy").addEventListener("change", () => this.handleGroupByChange());
        containerElement.querySelector(".reset-button").addEventListener("click", () => this.refreshPage());
        containerElement.querySelector('.filter-button-all').addEventListener('click', () => this.filterTask('all'));
        containerElement.querySelector('.filter-button-active').addEventListener('click', () => this.filterTask('active'));
        containerElement.querySelector('.filter-button-completed').addEventListener('click', () => this.filterTask('completed'));
    }

    handleAddTask() {
        const { taskText, startDate, endDate } = this.view.getInputValues();
        const containerId = this.container.id;

        if(!containerId){
            console.error("container not found");
        }

        if (!taskText) {
            alert("Please add one task.");
        } else if (!startDate || !endDate) {
            alert("Please specify both start and end dates.");
        } else {
            fetch("http://localhost:3001/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: taskText,
                    startDate,
                    endDate,
                    containerId
                }),
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.taskId) {
                    const task = {
                        text: taskText,
                        startDate,
                        endDate,
                        lastModified: new Date().toISOString(),
                        checked: false,
                        id: data.taskId,
                    };
                    this.view.renderTask(task);
                    this.view.clearInputFields();
                    this.updateProgress();
                }
            })
            .catch((err) => {
                console.error("Error adding task:", err);
                alert("Failed to add task. Please try again.");
            });
        }
    }

    handleTaskComplete(e) {
        if (e.target.tagName === "LI") {
            const taskId = e.target.dataset.id;
            const task = this.model.tasks.find(t => t.id == taskId);
    
            if (!task) {
                console.error("Task not found for ID:", taskId);
                return;
            }
    
            task.checked = !task.checked;
    
            fetch(`http://localhost:3001/tasks/${taskId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ checked: task.checked }),
            })
            .then(response => response.json())
            .then(() => {
                this.view.updateTaskCompletion(taskId, task.checked);
                this.updateProgress();
            })
            .catch(err => console.error("Error updating task completion status:", err));
        }
    }
    

    handleRemoveTask(e) {
        if (e.target.tagName === "SPAN" && e.target.classList.contains("cross-btn")) {
            const taskId = e.target.parentElement.dataset.id; // Assuming task ID is in `data-id`
    
            fetch(`http://localhost:3001/tasks/${taskId}`, {
                method: "DELETE",
            })
            .then(() => {
                this.model.tasks = this.model.tasks.filter(task => task.id != taskId);
                this.view.listContainer.removeChild(e.target.parentElement);
                this.updateProgress();
            })
            .catch(err => console.error("Error removing task:", err));
        }
    }
    
    async handleEditTask(e) {
        if (e.target.tagName === "BUTTON" && e.target.textContent === "Edit") {
            const taskIndex = Array.from(this.view.listContainer.children).indexOf(e.target.parentElement);
    
            if (taskIndex === -1 || taskIndex >= this.model.tasks.length) {
                console.error("Invalid task index or task does not exist:", taskIndex);
                return;
            }
    
            const task = this.model.tasks[taskIndex];
            if (!task) {
                console.error(`Task at index ${taskIndex} is undefined.`);
                return;
            }
    
            const { id: taskId, containerId, text: taskText } = task;
    
            try {
                const { newTaskText } = await this.view.editTaskUI(taskText, taskIndex, taskId, containerId);
                if (newTaskText) {
                    await this.model.editTask(taskId, containerId, newTaskText);
                    this.view.renderAllTasks(this.model.tasks);
                }
            } catch (error) {
                console.error("Error during task editing:", error);
            }
        }
    }
    

    handleSearch(e) {
        const searchValue = e.target.value.toLowerCase();
        this.view.filterTasksBySearch(searchValue);
    }

    filterTask(status) {
        const filteredTasks = this.model.filterTasks(status);
        this.view.renderAllTasks(filteredTasks);
        this.updateProgress()
    }

    filterTasksByDate() {
        const startDate = new Date(this.view.getStartDate());
        const endDate = new Date(this.view.getEndDate());

        const filteredTasks = this.model.tasks.filter(task => {
            const taskStartDate = new Date(task.startDate);
            const taskEndDate = new Date(task.endDate);
            return taskStartDate >= startDate && taskEndDate <= endDate;
        });

        this.view.renderAllTasks(filteredTasks);
        this.updateProgress()
    }

    handleKeyWordSearch(e) {
        const searchValue = e.target.value;
        this.view.searchByKeyWords(searchValue);
    }

    handleGroupByChange() {
        const groupBy = this.view.getGroupByValue();
        this.groupByTask(groupBy);
    }

    groupByTask(groupBy) {
        const presentTasks = Array.from(this.view.listContainer.getElementsByTagName('li'));
        this.view.listContainer.innerHTML = ''; 

        if (groupBy === 'grpbyTask') {
            const active = presentTasks.filter(task => !task.classList.contains('checked'));
            const complete = presentTasks.filter(task => task.classList.contains('checked'));
            active.forEach(task => this.view.listContainer.appendChild(task));
            complete.forEach(task => this.view.listContainer.appendChild(task));
        } else if (groupBy === 'recent') {
            presentTasks.sort((a, b) => {
                const dateA = new Date(a.dataset.lastModified || 0);
                const dateB = new Date(b.dataset.lastModified || 0);
                return dateB - dateA; 
            });
            presentTasks.forEach(task => this.view.listContainer.appendChild(task));
        } else if (groupBy === 'alphabetical') {
            presentTasks.sort((a, b) => a.textContent.localeCompare(b.textContent));
            presentTasks.forEach(task => this.view.listContainer.appendChild(task));
        } else if (groupBy === 'startDate') {
            presentTasks.sort((a, b) => new Date(a.querySelector('.startDate').textContent.replace('Start ', "")) - new Date(b.querySelector('.startDate').textContent.replace('Start ', "")));
            presentTasks.forEach(task => this.view.listContainer.appendChild(task));
        } else if (groupBy === 'endDate') {
            presentTasks.sort((a, b) => new Date(a.querySelector('.endDate').textContent.replace('End ', "")) - new Date(b.querySelector('.endDate').textContent.replace('End ', "")));
            presentTasks.forEach(task => this.view.listContainer.appendChild(task));
        }
    }

    updateProgress() {
        const present_task = this.view.listContainer.getElementsByTagName('li');

        for (let i = 0; i < present_task.length; i++) {
            const task = present_task[i];
            const progressBar = task.querySelector('progress');
            const taskDate = task.querySelector('.task-dates');
            if (!taskDate) {
                console.warn("Missing '.task-dates' for task:", task);
                continue; 
            }

            const startDate = new Date(taskDate.querySelector('.task-dates span:first-child').textContent.replace(' Start ', "").trim());
            const dueDate = new Date(taskDate.querySelector('.task-dates span:last-child').textContent.replace(' End ', "").trim());
            const currentDate = new Date();

            if (isNaN(startDate) || isNaN(dueDate)) {
                console.warn("Invalid dates in '.task-dates' for task:", task);
                continue; 
            }

            if (task.classList.contains('checked')) {
                progressBar.value = 100;
                progressBar.classList.add('completed');
                progressBar.classList.remove('due-today', 'overdue', 'not-started', 'in-progress');
            } else if (currentDate < startDate) {       
                progressBar.value = 0;
                progressBar.classList.add('not-started');
                progressBar.classList.remove('completed', 'due-today', 'overdue', 'in-progress');
            } else if (currentDate.toDateString() === dueDate.toDateString() && !task.classList.contains("overdue-alert")) {
                task.classList.add("overdue-alert");
                progressBar.value = 70;
                progressBar.classList.add('due-today');
                progressBar.classList.remove('completed', 'overdue', 'not-started', 'in-progress');
                alert("Today is the Due Date of " + task.childNodes[0].nodeValue);
            } else if (currentDate > dueDate && !task.classList.contains("overdue-alert")) {
                progressBar.classList.remove('completed', 'due-today', 'not-started', 'in-progress');
                task.classList.add("overdue-alert");
                progressBar.value = 100;
                progressBar.classList.add('overdue');
                alert("Task is Overdue!!! ---> " + task.childNodes[0].nodeValue);
            } else if (currentDate > startDate && currentDate < dueDate) {
                const progress = ((currentDate - startDate) / (dueDate - startDate)) * 100;
                progressBar.classList.remove('completed', 'due-today', 'overdue', 'not-started');
                progressBar.classList.add('in-progress');
                progressBar.value = Math.min(progress, 100);
            }
        }
    }

    refreshPage(){
        this.view.resetTask()
    }
}



// export const add=(a,b)=>{
//     return a+b;
// }


// const result=add(2,5);