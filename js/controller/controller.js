import TaskModel from "../model/model.js";
import TaskView from "../view/views.js";

const TaskController = {
    init() {
        this.addTask();
        this.taskComplete();
        this.removeTask();
        this.filterTasks();
        this.searchByKeyWords();
        this.filterByDate();
        this.groupByTask();
        this.search();
        TaskView.editTask()
        TaskModel.showData();
        TaskView.init();
        this.refresh()
        // this.bindEvents();
    },

    addTask: function() {
        console.log("Add Task button clicked!");
        const taskInput = document.getElementById('ipBox').value.trim();
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        if (!taskInput || !startDate || !endDate) {
            alert('Please fill in all fields!');
            return;
        }

        TaskView.addTaskElement(taskInput, startDate, endDate);
        TaskModel.saveData();
        TaskView.clearInputFields();
        TaskModel.updateProgress()
    },

    taskComplete() {
        TaskView.listContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'LI') {
                TaskView.toggleTaskCompletion(e.target);
                this.updateProgress();
                TaskModel.saveData(TaskView.listContainer.innerHTML);  // Pass listContainer here
            }
        });
    },

    removeTask() {
        TaskView.listContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'SPAN' && e.target.classList.contains('cross-btn')) {
                TaskView.removeTaskElement(e.target.parentElement);
                TaskModel.saveData(TaskView.listContainer.innerHTML);  // Pass listContainer here
            }
        });
    },

    updateProgress() {
        TaskModel.updateProgress(); 
        console.log("Updating progress...");  // Placeholder for progress calculation logic
    },

    // bindEvents() {
        
    // },

    filterTasks() {
        TaskView.all.addEventListener('click', function() {
            TaskController.filterTask('all');
        });

        TaskView.active.addEventListener('click', function() {
            TaskController.filterTask('active');
        });

        TaskView.completed.addEventListener('click', function() {
            TaskController.filterTask('completed');
        });
    },

    filterTask(status) {
        TaskView.filterTask(status);
    },

    search(){
        const searchIP = TaskView.searchIP;
    if (searchIP) {
        searchIP.addEventListener('input', () => {
            TaskView.searchTask(searchIP.value);
        });
    } else {
        console.error("Search input element not found.");
    }
    },


    searchByKeyWords() {
        const keywordSearchInput = TaskView.keywordSearch;
        keywordSearchInput.addEventListener('input', function() {
            console.log("Keyword search input:", keywordSearchInput.value);
            const selectedKeyword = keywordSearchInput.value.trim();
            if (selectedKeyword) {
                TaskView.bindsearchByKeyWords(selectedKeyword);
            }
        });
    },

    filterByDate() {
        // const filterStartDate=document.getElementById('filterStartDate')
        // const filterEndDate=document.getElementById('filterEndDate')
        
        TaskView.filterStartDate.addEventListener('input',function(){
            const start=new Date(TaskView.filterStartDate.value)
            const end=new Date(TaskView.filterEndDate.value)
            TaskView.filterByDate(start,end)
        })
        
        TaskView.filterEndDate.addEventListener('input',function(){
            const start=new Date(TaskView.filterStartDate.value)
            const end=new Date(TaskView.filterEndDate.value)
            TaskView.filterByDate(start,end)
        })
    },

    groupByTask() {
    //   const grpBy=  document.getElementById('sortOptions')
      TaskView.grpBy.addEventListener('change',function(){
        TaskView.groupByTask();
      })  
     
    },

    refresh(){
        const reset=document.getElementById('refresh')
        reset.addEventListener('click',function(){
            location.reload()
        })
    }


};

document.addEventListener('DOMContentLoaded', () => {
    TaskController.init();
});

export default TaskController;
