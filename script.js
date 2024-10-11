// var state = {
//     taskList: [
//         {
//             // imgUrl: "",
//             // taskTitle: "",
//             // taskType: "",
//             // taskDesc: ""
//         },
//{
//             // imgUrl: "",
//             // taskTitle: "",
//             // taskType: "",
//             // taskDesc: ""
//         }

//     ]
// }
// backup storage
const state = {
    taskList: [

    ]
};

const taskContents = document.querySelector(".task_contents");
const taskModal = document.querySelector(".task_modal_body");

const htmlTaskContent = ({ id, title, taskDescription, url, taskType }) => `
<div class='col-md-6 col-lg-4 col-sm-12 mt-4' id=${id} key=${id} >
<div class='card shadow-sm task_card'>

<div class='card-header d-flex justify-content-end task_card_header'>
<button type='button' class='btn btn-outline-primary me-2' name='${id}' onclick='editTask().apply(this,arguments)'><i class='fa-solid fa-pencil' name='${id}'></i></button>
<button type='button' class='btn btn-outline-danger' name='${id}' onclick='deleteTask().apply(this,arguments)'><i class='fa-solid fa-trash' name='${id}'></i></button>
</div>
<div class='card-body'>
 ${
    //url &&
    //     `<img width='100%' src='${url}' alt='card image' class='card-img-top mb-3 rounded-lg'/>`
    url ?
        `<img width='100%' src='${url}' alt='card image' class='card-img-top mb-3 rounded-lg'/>`
        :
        `<img width='100%' src='download.png' alt='card image' class='card-img-top mb-3 rounded-lg'/>`
    }
<h4 class='card-title task_card_title'>${title}</h4>
<p class='description trim-3-lines text-muted'> ${taskDescription}</p>
<div class='tags text-white d-flex flex-wrap'>
<span class='badge rounded-pill text-bg-primary m-1'>${taskType}</span>
</div>
</div>
<div class='card-footer mt-2'>
<button type='button' class='btn btn-outline-primary float-right' data-bs-toggle='modal' data-bs-target='#showTask' onclick='openTask()' id=${id}>Open Task</button></div>

</div>

</div>`
    ;


// modal body on click of open task

const htmlmodalContent = ({ id, title, taskDescription, url }) => {
    const date = new Date(parseInt(id));
    return `<div id='${id}'>
${
        //url &&
        //     `<img width='100%' src='${url}' alt='card image' class='card-img-top mb-3 rounded-lg'/>`
        url ?
            `<img width='100%' src='${url}' alt='card image' class='card-img-top mb-3 rounded-lg'/>`
            :
            `<img width='100%'  src='download.png' alt='card image' class='card-img-top mb-3 rounded-lg'/>`
        }
<strong class='text-muted text-sm'>Created on ${date.toDateString()}</strong>
<h2 class='mt-3 wrap-text'>${title}</h2>

<p class='text-muted wrap-text' >${taskDescription}</p>
</div>'`;

};

const updateLocalStorage = () => {
    localStorage.setItem('task', JSON.stringify({ tasks: state.taskList, }));
};
// convert string to json for rendering cards on screen
const loadInitialData = () => {
    const localStorageCopy = JSON.parse(localStorage.task);
    if (localStorageCopy) {
        state.taskList = localStorageCopy.tasks;
    }
    state.taskList.map((cardData) => {
        taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
    });
};


const handleSubmit = (event) => {
    const id = `${Date.now()}`;  //milliseconds since jan 1 1970
    const input = {
        url: document.getElementById("img-url").value,
        title: document.getElementById("task-title").value,
        taskType: document.getElementById("tags").value,
        taskDescription: document.getElementById("task-desc").value,
    };

    if (input.title == "" || input.taskType == "" || input.taskDescription == "") {
        alert("please fill in all required fields");
        return;
    }
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent({ ...input, id }));//spread operator
    state.taskList.push({ ...input, id });
    updateLocalStorage();
    clearForm();

};

function clearForm()
{
    document.getElementById("img-url").value="";
     document.getElementById("task-title").value="";
    document.getElementById("tags").value="";
     document.getElementById("task-desc").value="";   
}
const openTask = (e) => {
    if (!e) {
        e = window.event;
    }
    const getTask = state.taskList.find(({ id }) =>

        id === e.target.id
    );
    taskModal.innerHTML = htmlmodalContent(getTask);

}


const deleteTask = (e) => {
    if (!e) {
        e = window.event;
    }
    const targetId = e.target.getAttribute('name');
    const type = e.target.tagName;
    const removeTask = state.taskList.filter(({ id }) => id !== targetId);
    state.taskList=removeTask;
    updateLocalStorage();
    if (type === 'BUTTON') {
        return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentNode.parentNode

        );
    }

    return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
        e.target.parentNode.parentNode.parentNode.parentNode

    );

    // return;
}

const editTask = (e) => {
    if (!e) e = window.event;
    const targetId = e.target.id;
    const type = e.target.tagName;
    let parentNode;
    let taskTitle;
    let taskType;
    let taskDescription;
    let submitButton;
    if (type === 'BUTTON') {
        parentNode = e.target.parentNode.parentNode;
        // console.log(parentNode);
    }
    else {
        parentNode = e.target.parentNode.parentNode.parentNode;
    }

    // taskTitle=parentNode.childNodes;
    // console.log(taskTitle);
    // taskTitle=parentNode.childNodes[3].childNodes;
    // console.log(taskTitle);


    taskTitle = parentNode.childNodes[3].childNodes[3];
    taskDescription = parentNode.childNodes[3].childNodes[5];
    taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];

    submitButton = parentNode.childNodes[5].childNodes[1];

    taskTitle.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");

    submitButton.setAttribute("onclick", "saveEdit.apply(this,arguments)");
    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");
    submitButton.innerHTML = `Save Changes`;


};


const saveEdit = (e) => {
    if (!e) e = window.event;
    const targetId = e.target.id;
    const parentNode = e.target.parentNode.parentNode;

    taskTitle = parentNode.childNodes[3].childNodes[3];
    taskDescription = parentNode.childNodes[3].childNodes[5];
    taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    submitButton = parentNode.childNodes[5].childNodes[1];


    const updateData = {
        taskTitle: taskTitle.innerHTML,
        taskDescription: taskDescription.innerHTML,
        taskType: taskType.innerHTML,

    };
    let stateCopy = state.taskList;
    stateCopy=stateCopy.map((task) => task.id === targetId ?
        {
            id: task.id,
            title: updateData.taskTitle,
           taskDescription: updateData.taskDescription,
            taskType: updateData.taskType,
            url: task.url,
        }
        : task
    );
    state.taskList=stateCopy;
    updateLocalStorage();
    taskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");

    submitButton.setAttribute("onclick","openTask.apply(this,arguments)");

    submitButton.setAttribute("data-bs-toggle","modal");
    submitButton.setAttribute("data-bs-target","#showTask");
    submitButton.innerHTML = `Open Task`;
};

const searchTask=(e)=>
{  
    if(!e)e=window.target;
    // console.log(taskContents.firstChild);
    while(taskContents.firstChild)
    {
        taskContents.removeChild(taskContents.firstChild);
    }
    const resultData=state.taskList.filter(({title})=>
        title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    console.log(resultData);
    if(resultData=="")
    {
        taskContents.innerHTML="<center><h4 class='text-muted'>No results found</h4><center>";
    }
    else
    resultData.map((cardData)=>
        taskContents.insertAdjacentHTML("beforeend",htmlTaskContent(cardData))
);
};
