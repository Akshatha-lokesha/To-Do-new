
export class TodoModel {
    constructor() {
        this.tasks = [];
    }
    
    

    addTask(taskText, startDate, endDate, containerId) {
        const task = {
            text: taskText,
            startDate,
            endDate,
            lastModified: new Date().toISOString(),
            checked: false,
        };
        fetch("http://localhost:3001/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text: taskText,
                startDate,
                endDate,
                containerId,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.taskId) {
                    task.id = data.taskId;
                    task.containerId = containerId;
                    
                    this.tasks.push(task);
                    
                    this.saveData(containerId);
                }
            })
            .catch((err) => {
                console.error("Error adding task to backend:", err);
                alert("Failed to add task. Please try again.");
            });
    }

    removeTask(taskIndex) {
        this.tasks.splice(taskIndex, 1);
    }

    toggleTaskComplete(taskIndex) {
        const task = this.tasks[taskIndex];
        task.checked = !task.checked
        this.saveData()
    }

    async editTask(taskId, containerId, newText) {
        const task = this.tasks.find(task => task.id === taskId && task.containerId === containerId);
        if (task) {
            task.text = newText;
            task.lastModified = new Date().toISOString();

            await fetch("http://localhost:3001/tasks", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: taskId,
                    containerId,
                    text: newText,
                }),
            }).catch((err) => console.error("Error updating task:", err));
        }
    }

    
    saveData(containerId) {
        localStorage.setItem(`tasks-${containerId}`, JSON.stringify(this.tasks));
    }

    loadData(containerId) {
        fetch(`http://localhost:3001/tasks?containerId=${containerId}`)
            .then(response => response.json())
            .then(data => {
                this.tasks = data.tasks; 
            })
            .catch(err => console.error("Error loading tasks from backend:", err));
    }
    
    filterTasks(status) {
        if (status === 'all') {
            return this.tasks;
        } else if (status === 'active') {
            return this.tasks.filter(task => !task.checked);
        } else if (status === 'completed') {
            return this.tasks.filter(task => task.checked);
        }
    }
}