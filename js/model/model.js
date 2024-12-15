import TaskView from '../view/views.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import TaskController from '../controller/controller.js';

const TaskModel = {
    saveData() {
        const tasks = TaskView.listContainer.innerHTML;
        localStorage.setItem('tasks', tasks);
    },

    showData() {
        const savedData = localStorage.getItem('tasks');
        if (savedData) {
            TaskView.listContainer.innerHTML = savedData;
            this.updateProgress();
        }
    },


    updateProgress() {
        const present_task = TaskView.listContainer.getElementsByTagName('li');

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
            } else if (currentDate.toDateString() == dueDate.toDateString() && !task.classList.contains("overdue-alert")) {
                task.classList.add("overdue-alert");
                progressBar.value = 70;
                progressBar.classList.add('due-today');
                progressBar.classList.remove('completed', 'overdue', 'not-started', 'in-progress');

                alert("Today is the Due Date of " + task.childNodes[0].nodeValue);
            } else if (currentDate > dueDate && !task.classList.contains("overdue-alert")) {
                progressBar.classList.remove('completed', 'due-today', 'not-started', 'in-progress');
                task.classList.add("overdue-alert");
                progressBar.value = 90;
                progressBar.classList.add('overdue');

                alert("Task is Overdue!!! ---> " + task.childNodes[0].nodeValue);
            } else if (currentDate > startDate && currentDate < dueDate) {
                const progress = ((currentDate - startDate) / (dueDate - startDate)) * 100;
                progressBar.classList.remove('completed', 'due-today', 'overdue', 'not-started');
                progressBar.classList.add('in-progress');
                progressBar.value = Math.min(progress, 100);
            }
        }
    },

};

export default TaskModel;
