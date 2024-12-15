const ip=document.getElementById("ipBox")
const lis=document.getElementById("listContainer")

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function addTask(){

    const startDate=document.getElementById('startDate').value
    const endDate=document.getElementById('endDate').value

    if(ip.value===""){
        alert("Please add one task.")
    }else if(!startDate||!endDate){
        alert("Please specify both start and end dates.")
    }
    else{
        const li=document.createElement('li')
        li.innerHTML=ip.value
        li.dataset.lastModified = new Date().toISOString(); 
        
        lis.appendChild(li)

        const progressBar=document.createElement('progress')
        progressBar.value=0
        progressBar.max=100
        progressBar.className="task-progress"
        li.appendChild(progressBar)

        const taskDates=document.createElement('div')
        taskDates.classList.add('task-dates')

        const startSpan=document.createElement('span')
        startSpan.className="startDate"
        startSpan.textContent=`Start ${startDate}`
        taskDates.appendChild(startSpan)

        const endSpan=document.createElement('span')
        endSpan.className="endDate"
        
        endSpan.textContent=`End ${endDate}`
        taskDates.appendChild(endSpan)

        li.appendChild(taskDates)

        const span=document.createElement('span')
        span.className="cross-btn"
        span.innerHTML='\u00d7'
        li.appendChild(span)

        const ebtn=document.createElement('button')
        ebtn.className="edit-btn"
        ebtn.textContent="Edit"
        li.appendChild(ebtn)

        saveData()
    }
    ip.value=""
    document.getElementById('startDate').value = "";
    document.getElementById('endDate').value = "";
    updateProgress()
   
}

function taskComplete(){
    lis.addEventListener('click',function(e){
        if(e.target.tagName==='LI'){
            e.target.classList.toggle('checked')
            updateProgress()
            saveData()
        } 
    }) 
}
taskComplete() 


function removeTask(){
   lis.addEventListener('click',function(e){
    if(e.target.tagName==='SPAN'&&e.target.classList.contains('cross-btn')){
        e.target.parentElement.remove()
        saveData()
    }
   })
}
removeTask()



function editTask(){
    lis.addEventListener('click',function(e){
        if(e.target.tagName==="BUTTON"&& e.target.textContent==="Edit"&&e.target.classList.contains('edit-btn')){
            const li=e.target.parentElement
            const cT=li.childNodes[0].nodeValue
            const edIp=document.createElement('input')
            edIp.type="text"
            edIp.value=cT.trim()
                li.childNodes[0].nodeValue=""
                e.target.textContent="Save"
                li.appendChild(edIp)
                edIp.focus()
        
                e.target.addEventListener('click',function(){
                    if(edIp.value===""){
                        alert("Task cannot be empty")
                        return
                    }
                    li.childNodes[0].nodeValue=edIp.value+" "
                    li.removeChild(edIp)
                    e.target.textContent="Edit"
                    li.dataset.lastModified=new Date().toISOString()
                    saveData()

                    location.reload()
                    
                },{once:true})
                e.target.blur();
        }
    })
}
editTask()


function saveData(){
    localStorage.setItem('data',lis.innerHTML)
}

function showData(){
    lis.innerHTML=localStorage.getItem('data')
    updateProgress()
}
showData()

const searchIP=document.getElementById('searchTask')

function search(){
    searchIP.addEventListener('input',function(){
        const search_task=searchIP.value.toLowerCase()
        const present_task=lis.getElementsByTagName('li')

        for(let i=0;i<present_task.length;i++){
            const task=present_task[i]
            if(task.classList.contains('filtered')){
            const taskText=task.textContent||task.innerText
            if(taskText.toLowerCase().indexOf(search_task)>-1){
                task.style.display=""
            }else{
                 task.style.display="none"
            }

        }
    }

    })
}
search()

const all=document.getElementById('all')
const active=document.getElementById('active')
const completed=document.getElementById('completed')

all.addEventListener('click',function(){
    filterTask('all')
})

active.addEventListener('click',function(){
    filterTask('active')
})
completed.addEventListener('click',function(){
    filterTask('completed')
})

function filterTask(status){
    const present_task=lis.getElementsByTagName('li')
    for(let i=0;i<present_task.length;i++){
        const task=present_task[i]
        task.classList.remove("filtered")
        if(status==='all'){
            task.style.display=""
            task.classList.add("filtered")
        }else if(status==='active' && !task.classList.contains('checked')){
            task.style.display=""
            task.classList.add("filtered")
        }else if(status==='completed' && task.classList.contains('checked')){
            task.style.display=""
            task.classList.add("filtered")
        }else{
            task.style.display="none"
        }
    }
}


function filterByDate(StartDate,EndDate){
    const present_task=lis.getElementsByTagName('li')
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

}


function getKeyWordList(){
    const options=document.querySelectorAll('#keywordList .keyword')
    return Array.from(options).map(keyword=>keyword.value.toLowerCase())
}

function searchByKeyWords(KeyWords){
    const present_task=lis.getElementsByTagName('li')
    const definedKeyword=getKeyWordList()
    const selectedKeyword=KeyWords.toLowerCase().trim()

    if(selectedKeyword===""){
        for(let i=0;i<present_task.length;i++){
            present_task[i].style.display=""
            present_task.classList.remove("filtered")
        }
        return
    }

    for(let i=0;i<present_task.length;i++){
        const task=present_task[i]
        const taskText=task.textContent||task.innerText
        // task.classList.remove("filtered")

        task.classList.add("filtered")
        if(definedKeyword.some(key=>taskText.toLowerCase().includes(key))){
            task.style.display=taskText.toLowerCase().includes(selectedKeyword)?"":"none";
            
        }else{
            task.style.display="none"
        }
    }

}


const keywordSearch=document.getElementById('keywordSearch')
keywordSearch.addEventListener('input',function(){
    searchByKeyWords(keywordSearch.value)
})


const filterStartDate=document.getElementById('filterStartDate')
const filterEndDate=document.getElementById('filterEndDate')

filterStartDate.addEventListener('input',function(){
    const start=new Date(filterStartDate.value)
    const end=new Date(filterEndDate.value)
    filterByDate(start,end)
})

filterEndDate.addEventListener('input',function(){
    const start=new Date(filterStartDate.value)
    const end=new Date(filterEndDate.value)
    filterByDate(start,end)
})


const grpBy=document.getElementById('sortOptions')

grpBy.addEventListener('change',function(){
    groupByTask()
})

function groupByTask(){
    const present_task=Array.from(lis.getElementsByTagName('li'))
    lis.innerHTML=""

    const groupBy=grpBy.value

    if(groupBy==='grpbyTask'){
    const active=present_task.filter(task=> !task.classList.contains('checked'))
    const complete=present_task.filter(task=> task.classList.contains('checked'))
   
    active.forEach(task=>lis.appendChild(task))
    complete.forEach(task=>lis.appendChild(task))
    }else if(groupBy==='recent'){
        present_task.sort((a, b) => {
            const dateA = new Date(a.dataset.lastModified || 0);
            const dateB = new Date(b.dataset.lastModified || 0);
            return dateB - dateA;
        });
        present_task.forEach(task=>lis.appendChild(task))
    }else if(groupBy==='alphabetical'){
        present_task.sort((a,b)=>a.textContent.localeCompare(b.textContent))
        present_task.forEach(task=>lis.appendChild(task))
    }else if(groupBy==='startDate'){
        present_task.sort((a,b)=>new Date(a.querySelector('.startDate').textContent.replace('Start ',""))-new Date(b.querySelector(".startDate").textContent.replace('Start ',"")))
        present_task.forEach(task=>lis.appendChild(task))
    }else if(groupBy==='endDate'){
        present_task.sort((a,b)=>new Date(a.querySelector('.endDate').textContent.replace('End ',""))-new Date(b.querySelector(".endDate").textContent.replace('End ',"")))
        present_task.forEach(task=>lis.appendChild(task))
    }

    // present_task.forEach(task=>lis.appendChild(task))
}


function updateProgress(){
    const present_task=lis.getElementsByTagName('li')

    for(let i=0;i<present_task.length;i++){
        const task=present_task[i]
        const progressBar=task.querySelector('progress')
        const taskDate=task.querySelector('.task-dates')
        if (!taskDate){
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
        

        if(task.classList.contains('checked')){
            progressBar.value=100
            progressBar.classList.add('completed');
            progressBar.classList.remove('due-today', 'overdue', 'not-started', 'in-progress');
            }
        else if(currentDate<startDate){       
            progressBar.value=0
            progressBar.classList.add('not-started');
            progressBar.classList.remove('completed', 'due-today', 'overdue', 'in-progress');

        }
        else if(currentDate.toDateString()==dueDate.toDateString()&& !task.classList.contains("overdue-alert")){
            task.classList.add("overdue-alert");
            progressBar.value = 70;
            progressBar.classList.add('due-today');
            progressBar.classList.remove('completed', 'overdue', 'not-started', 'in-progress');

            alert("Today is the Due Date of "+task.childNodes[0].nodeValue)
        }
        else if (currentDate > dueDate && !task.classList.contains("overdue-alert")) {
            progressBar.classList.remove('completed', 'due-today', 'not-started', 'in-progress');
            task.classList.add("overdue-alert");
            progressBar.value = 90;
            progressBar.classList.add('overdue');

            alert("Task is Overdue!!! ---> "+task.childNodes[0].nodeValue);
        }else if(currentDate>startDate && currentDate<dueDate){
            const progress=((currentDate-startDate)/(dueDate-startDate))*100
            progressBar.classList.remove('completed', 'due-today', 'overdue', 'not-started');
            progressBar.classList.add('in-progress');
            progressBar.value=Math.min(progress,100)

        }
    }

}

updateProgress()


const reset=document.getElementById('refresh')

reset.addEventListener('click',function(){
    location.reload()
})

