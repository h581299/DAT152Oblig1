import '../tasklist/tasklist.js';
import '../taskbox/taskbox.js';

const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" type="text/css" href="${import.meta.url.match(/.*\//)[0]}/taskview.css"/>

    <h1>Tasks</h1>

    <div id="message"><p>Waiting for server data.</p></div>
    <div id="newtask"><button type="button" id="newTaskButton">New task</button></div>

    <!-- The task list -->
    <task-list></task-list>
            
    <!-- The Modal -->
    <task-box></task-box>`;

/** 
  * TaskView
  * The full application view
  */
class TaskView extends HTMLElement {

    constructor() {
        super();
	
		const shadow = this.attachShadow({mode: 'open'});
		const content = template.content.cloneNode(true);
		shadow.appendChild(content);

		this.taskBox = shadow.querySelector('task-box');
		this.taskList = shadow.querySelector('task-list');
		
		this.newTaskButton = shadow.querySelector('#newTaskButton');
		
		this.newTaskButton.addEventListener('click', () => {
            this.taskBox.show();
        });
        
        const submitTaskButton = this.taskBox.shadowRoot.querySelector('#submitTaskButton');

		submitTaskButton.addEventListener('click', () => {
            this.taskBox.newtaskCallback(
				(task) => {
					console.log(`Have '${task.title}' with status ${task.status}.`);
					addNewTask(this.getAttribute("data-serviceurl"), task);
				}
			);
        });
        
        getAvailableStatuses(this.getAttribute("data-serviceurl"), this.taskBox);
        getAllTasks(this.getAttribute("data-serviceurl"), this.taskList);
        
        async function getAvailableStatuses(url, taskBox) {
			try {
				const response = await fetch (url + '/allstatuses', { method : "GET" });
				
				if (response.ok) {
					const data = await response.json();
					taskBox.setStatuseslist(data.allstatuses);
				}
			} catch (e) {
				console.log(`Got error ${e. message }.`);
			}
		}
		
		async function addNewTask(url, task) {
			try {
				const response = await fetch (url + '/task', { 
					method : "POST", 
					headers: { "Content-Type": "application/json; charset=utf-8" },
					body: JSON.stringify(task)
				});
								
				if (response.ok) {
					const data = await response.json();
					console.log(data);
				}
			} catch (e) {
				console.log(`Got error ${e. message }.`);
			}
		}
		
		async function getAllTasks(url, taskList) {
			try {
				const response = await fetch(url + '/tasklist', { method: "GET"});
				
				if (response.ok) {
					const data = await response.json();
					
					taskList.createAllTasks(data.tasks);
				}
			} catch (e) {
				console.log(`Got error ${e. message }.`);
			}
		}
    }
}

customElements.define('task-view', TaskView);
