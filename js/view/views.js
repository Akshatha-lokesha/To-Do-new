import TaskController from '../controller/controller.js';
import TaskModel from '../model/model.js';  

const TaskView = {
    

    ipBox: document.getElementById("ipBox"),
    listContainer: document.getElementById("listContainer"),
    searchIP: document.getElementById('searchTask'),
    all: document.getElementById('all'),
    active: document.getElementById('active'),
    completed: document.getElementById('completed'),
    keywordSearch: document.getElementById('keywordSearch'),
    filterStartDate: document.getElementById('filterStartDate'),
    filterEndDate: document.getElementById('filterEndDate'),
    grpBy: document.getElementById('sortOptions'),


    addTaskElement(ipValue, startDate, endDate) {
        console.log("Adding task:", ipValue, startDate, endDate);
        const li = document.createElement('li');
        li.classList.add("filtered")
        li.innerHTML = ipValue;
        li.dataset.lastModified = new Date().toISOString();
        
        this.listContainer.appendChild(li);

        const progressBar = document.createElement('progress');
        progressBar.value = 0;
        progressBar.max = 100;
        progressBar.className = "task-progress";
        li.appendChild(progressBar);

        const taskDates = document.createElement('div');
        taskDates.classList.add('task-dates');

        const startSpan = document.createElement('span');
        startSpan.className = "startDate";
        startSpan.textContent = `Start ${startDate}`;
        taskDates.appendChild(startSpan);

        const endSpan = document.createElement('span');
        endSpan.className = "endDate";
        endSpan.textContent = `End ${endDate}`;
        taskDates.appendChild(endSpan);

        li.appendChild(taskDates);

        const span = document.createElement('span');
        span.className = "cross-btn";
        span.innerHTML = '\u00d7';
        li.appendChild(span);

        const ebtn = document.createElement('button');
        ebtn.className = "edit-btn";
        ebtn.textContent = "Edit";
        li.appendChild(ebtn);
    },

    toggleTaskCompletion(taskElement) {
        taskElement.classList.toggle('checked');
    },

    removeTaskElement(taskElement) {
        taskElement.remove();
    },

    clearInputFields() {
        this.ipBox.value = "";
        document.getElementById('startDate').value = "";
        document.getElementById('endDate').value = "";
    },
 
    init() {
        document.addEventListener("DOMContentLoaded", () => {
            console.log("DOM fully loaded and parsed");
            this.editTask();
            this.searchTask();
            this.getKeyWordList()
            this.bindsearchByKeyWords();
            this.filterByDate();
            this.filterStartDate.addEventListener('input', () => TaskController.filterByDate());
            this.filterEndDate.addEventListener('input', () => TaskController.filterByDate());
            this.bindFilterByDate();
            this.groupByTask();
            this.addButton = document.getElementById('addTaskButton');
this.addButton.addEventListener('click', function() {
    console.log("Add Task button clicked!");  
    const taskInput = TaskView.ipBox.value.trim();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    TaskModel.updateProgress()
    TaskController.search()
    TaskView.addTask(taskInput, startDate, endDate);
    TaskModel.saveData(); 
    TaskView.clearInputFields();
});
        });
    },

    editTask() {
        this.listContainer.addEventListener('click', function(e) {
            if (e.target.tagName === "BUTTON" && e.target.textContent === "Edit" && e.target.classList.contains('edit-btn')) {
                const li = e.target.parentElement;
                const cT = li.childNodes[0].nodeValue;
                const edIp = document.createElement('input');
                edIp.type = "text";
                edIp.value = cT.trim();
                li.childNodes[0].nodeValue = "";
                e.target.textContent = "Save";
                li.appendChild(edIp);
                edIp.focus();

                e.target.addEventListener('click', function() {
                    if (edIp.value === "") {
                        alert("Task cannot be empty");
                        return;
                    }
                    li.childNodes[0].nodeValue = edIp.value + " ";
                    li.removeChild(edIp);
                    e.target.textContent = "Edit";
                    li.dataset.lastModified = new Date().toISOString();
                    TaskModel.saveData(); 

                    location.reload();
                }, { once: true });
                e.target.blur();
            }
        });
    },

    searchTask(SearchSentence) {
       
            const search_task = SearchSentence.toLowerCase();
            const present_task = this.listContainer.getElementsByTagName('li');

            for (let i = 0; i < present_task.length; i++) {
                const task = present_task[i];
                if (task.classList.contains('filtered')) {
                    const taskText = task.textContent || task.innerText;
                    if (taskText.toLowerCase().indexOf(search_task) > -1) {
                        task.style.display = "";
                    } else {
                        task.style.display = "none";
                    }
                }
            }
        
    },

    filterTask(status) {
        const present_task = TaskView.listContainer.getElementsByTagName('li');
        for (let i = 0; i < present_task.length; i++) {
            const task = present_task[i];
            task.classList.remove("filtered");
            if (status === 'all') {
                task.style.display = "";
                task.classList.add("filtered");
            } else if (status === 'active' && !task.classList.contains('checked')) {
                task.style.display = "";
                task.classList.add("filtered");
            } else if (status === 'completed' && task.classList.contains('checked')) {
                task.style.display = "";
                task.classList.add("filtered");
            } else {
                task.style.display = "none";
            }
        }
    },

    filterByDate(StartDate,EndDate){
        const present_task=this.listContainer.getElementsByTagName('li')
        for(let i=0;i<present_task.length;i++){
            const task=present_task[i]
            const taskDate=task.querySelector('.task-dates')
            task.classList.remove("filtered")
    
            if(!taskDate) continue
    
            const taskStartDate= new Date(taskDate.querySelector('.startDate').textContent.replace('Start ','').trim())
            const taskEndDate= new Date(taskDate.querySelector('.endDate').textContent.replace('End ','').trim())
    
            if(StartDate&&EndDate){
                if(taskStartDate>=StartDate&&taskEndDate<=EndDate){
                    task.style.display=""
                    task.classList.add("filtered");
                }else{
                    task.style.display="none"
                }
            }else{
                task.style.display=""
            }
        }
    
    },

     getKeyWordList(){
        const options=document.querySelectorAll('#keywordList option')
        return Array.from(options).map(keyword=>keyword.value.toLowerCase())
    },
    
     bindsearchByKeyWords(KeyWords){

        
        const present_task=this.listContainer.getElementsByTagName('li')
        const definedKeyword=this.getKeyWordList()
        const selectedKeyword=KeyWords.toLowerCase()


    for (let task of present_task) {
        const taskText = task.textContent.toLowerCase();
        task.style.display = definedKeyword.includes(selectedKeyword) && taskText.includes(selectedKeyword) ? "" : "none";
    }
    
        // if(selectedKeyword===""){
        //     for(let i=0;i<present_task.length;i++){
        //         present_task[i].style.display="block"
        //         // present_task.classList.remove("filtered")
        //     }
        //     return
        // }
    
        // for(let i=0;i<present_task.length;i++){
        //     const task=present_task[i]
        //     const taskText=task.textContent||task.innerText
            
        //     task.classList.remove("filtered")
    
        //     if(definedKeyword.some(key=>taskText.toLowerCase().includes(key))){
        //         task.classList.add("filtered")
        //         task.style.display=taskText.toLowerCase().includes(selectedKeyword)?"":"none";
                
        //     }else{
        //         task.style.display="none"
        //     }
        // }
    
    },

    // bindsearchByKeyWords() {
    //     this.keywordSearch.addEventListener('input', function() {
    //         const selectedKeyword = TaskView.keywordSearch.value.toLowerCase();
    //         TaskController.searchByKeyWords(selectedKeyword);
    //     });
    // },

    bindFilterByDate(StartDate,EndDate) {
        const present_task=this.listContainer.getElementsByTagName('li')
        for(let i=0;i<present_task.length;i++){
            const task=present_task[i]
            const taskDate=task.querySelector('.task-dates')
            task.classList.remove("filtered")
    
            if(!taskDate) continue
    
            const taskStartDate= new Date(taskDate.querySelector('.startDate').textContent.replace('Start ','').trim())
            const taskEndDate= new Date(taskDate.querySelector('.endDate').textContent.replace('End ','').trim())
    
            if(StartDate&&EndDate){
                if(taskStartDate>=StartDate&&taskEndDate<=EndDate){
                    task.style.display=""
                    task.classList.add("filtered");
                }else{
                    task.style.display="none"
                }
            }
        }
    
        // this.filterStartDate.addEventListener('input', function() {
        //     const start = new Date(TaskView.filterStartDate.value);
        //     const end = new Date(TaskView.filterEndDate.value);
        //     TaskController.filterByDate(start, end);
        // });

        // this.filterEndDate.addEventListener('input', function() {
        //     const start = new Date(TaskView.filterStartDate.value);
        //     const end = new Date(TaskView.filterEndDate.value);
        //     TaskController.filterByDate(start, end);
        // });
    },

    groupByTask() {
        // this.grpBy.addEventListener('change', function() {
        //     const groupBy = TaskView.grpBy.value;
        //     TaskController.groupByTask(groupBy);
        // });

       

            const present_task = Array.from(TaskView.listContainer.getElementsByTagName('li'));
            TaskView.listContainer.innerHTML = "";

            const groupBy=this.grpBy.value
    
            if (groupBy === 'grpbyTask') {
                const active = present_task.filter(task => !task.classList.contains('checked'));
                const complete = present_task.filter(task => task.classList.contains('checked'));
                active.forEach(task => TaskView.listContainer.appendChild(task));
                complete.forEach(task => TaskView.listContainer.appendChild(task));
            } else if (groupBy === 'recent') {
                present_task.sort((a, b) => new Date(b.dataset.lastModified) - new Date(a.dataset.lastModified));
                present_task.forEach(task => TaskView.listContainer.appendChild(task));
            } else if (groupBy === 'alphabetical') {
                present_task.sort((a, b) => a.textContent.localeCompare(b.textContent));
                present_task.forEach(task => TaskView.listContainer.appendChild(task));
            } else if (groupBy === 'startDate') {
                present_task.sort((a, b) => new Date(a.querySelector('.startDate').textContent.replace('Start ', "")) - new Date(b.querySelector(".startDate").textContent.replace('Start ', "")));
                present_task.forEach(task => TaskView.listContainer.appendChild(task));
            } else if (groupBy === 'endDate') {
                present_task.sort((a, b) => new Date(a.querySelector('.endDate').textContent.replace('End ', "")) - new Date(b.querySelector(".endDate").textContent.replace('End ', "")));
                present_task.forEach(task => TaskView.listContainer.appendChild(task));
            }
    
    },

};




export default TaskView;
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");
});
