export class TodoView {
    constructor(containerId) {

        this.container = containerId;
        if (!this.container) {
            throw new Error("Container not provided or not found.");
        }
        this.ipBox = this.getElement("task-input");
        this.listContainer = this.getElement("task-list-container");
        this.startDateInput = this.getElement("task-start-date");
        this.endDateInput = this.getElement("task-end-date");
        this.searchInput = this.getElement("search-task-input");
        this.keywordList = this.getElement("keyword-list");
        this.grpBy = this.getElement("group-by-select");
        this.filterStartDate = this.getElement("filter-start-date");
        this.filterEndDate = this.getElement("filter-end-date");
        this.keywordSearch = this.getElement("keyword-search-input");
        this.reset = this.getElement("reset-button");

        console.log(this.container);
    }

    getElement(className) {
        const element= this.container.getElementsByClassName(className)[0];
        if (!element) {
         console.error(`Element with class '${className}' not found in container with ID '${this.container.id}'`);
     }
     return element;
     }

    renderTask(task) {
        const li = document.createElement("li");
        li.innerHTML = task.text;
        li.dataset.lastModified = task.lastModified;
        
        const progressBar = document.createElement("progress");
        progressBar.value = 0;
        progressBar.max = 100;
        progressBar.className = "task-progress";
        li.appendChild(progressBar);

        const taskDates = document.createElement("div");
        taskDates.classList.add("task-dates");

        const startSpan = document.createElement("span");
        startSpan.className = "startDate";
        startSpan.textContent = `Start ${task.startDate}`;
        taskDates.appendChild(startSpan);

        const endSpan = document.createElement("span");
        endSpan.className = "endDate";
        endSpan.textContent = `End ${task.endDate}`;
        taskDates.appendChild(endSpan);

        li.appendChild(taskDates);

        const span = document.createElement("span");
        span.className = "cross-btn";
        span.innerHTML = "\u00d7";
        li.appendChild(span);

        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.textContent = "Edit";
        li.appendChild(editBtn);

        this.listContainer.appendChild(li);
        if (task.checked) {
            li.classList.add('checked');
        }
    }

    clearInputFields() {
        this.ipBox.value = "";
        this.startDateInput.value = "";
        this.endDateInput.value = "";
    }

    updateTaskCompletion(taskIndex, checked) {
        const li = this.listContainer.children[taskIndex];
        if (checked) {
            li.classList.add("checked");
        } else {
            li.classList.remove("checked");
        }
    }

    getInputValues() {
        return {
            taskText: this.ipBox.value,
            startDate: this.startDateInput.value,
            endDate: this.endDateInput.value,
        };
    }

    renderAllTasks(tasks) {
        this.listContainer.innerHTML = ''; 
        tasks.forEach((task) => {
            this.renderTask(task);
        });
    }

    async editTaskUI(taskText, taskIndex, taskId, containerId) {
        const li = this.listContainer.children[taskIndex];
        const input = document.createElement("input");
        input.type = "text";
        input.value = taskText;
        li.innerHTML = "";
        li.appendChild(input);

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        li.appendChild(saveButton);

        return new Promise((resolve) => {
            saveButton.addEventListener("click", () => {
                const newTaskText = input.value.trim();
                if (newTaskText) {
                    resolve({ newTaskText, taskId, containerId });
                }
            });
        });
    }

    filterTasksBySearch(searchValue) {
        const tasks = Array.from(this.listContainer.children);
        tasks.forEach(task => {
            const taskText = task.textContent || task.innerText;
            if (taskText.toLowerCase().indexOf(searchValue) > -1) {
                task.style.display = "";
            } else {
                task.style.display = "none";
            }
        });
    }

    getStartDate() {
        return this.filterStartDate.value;
    }

    getEndDate() {
        return this.filterEndDate.value;
    }

    getKeyWordList() {
        const options = document.querySelectorAll('#keywordList option'); 
        return Array.from(options).map(keyword => keyword.value.toLowerCase());
    }

    searchByKeyWords(KeyWords) {
        const present_task = this.listContainer.getElementsByTagName('li');
        const selectedKeyword = KeyWords.toLowerCase().trim();
    
        
        if (selectedKeyword === "") {
            for (let i = 0; i < present_task.length; i++) {
                present_task[i].style.display = "";
                present_task[i].classList.remove("filtered");
            }
            return;
        }
    
        
        for (let i = 0; i < present_task.length; i++) {
            const task = present_task[i];
            const taskText = task.textContent || task.innerText;
    
            if (taskText.toLowerCase().includes(selectedKeyword)) {
                task.style.display = "";
                task.classList.remove("filtered");
            } else {
                task.style.display = "none";
                task.classList.add("filtered");
            }
        }
    }
    
    
    getGroupByValue() {
        return this.grpBy.value;
    }

    resetTask(){
        this.reset.addEventListener('click',function(){
            location.reload()
        })
    }

}
