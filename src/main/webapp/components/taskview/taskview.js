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

        handleApiCalls(this.getAttribute("data-serviceurl"), this.taskBox, this.taskList, shadow);

        /**
         * Handle all async functions that requires API or need to happen in order
         * @public
         * @param {String} url
		 * @param {TaskBox} taskBox
		 * @param {TaskList} taskList
         */
		async function handleApiCalls(url, taskBox, taskList, shadow) {
			await getAllTasks(url, taskList);
			shadow.querySelector('#message').innerHTML = "Tasks succesfully recieved from server.";
			
        	const statuses = await getAvailableStatuses(url, taskBox, taskList);
        	taskBox.setStatuseslist(statuses.allstatuses);
			taskList.setStatuseslist(statuses.allstatuses);
        	        	
        	await handleTasklistStatusChangeCallback(url, taskList);
        	await handleTasklistRemoveButtonCallback(url, taskList);
        	await handleNewTaskAdded(url, taskBox, taskList);
		}
		
        /**
         * Handle adding a eventlistener which adds new tasks to the db and the table
         * @public
         * @param {String} url
		 * @param {TaskBox} taskBox
		 * @param {TaskList} taskList
         */
		async function handleNewTaskAdded(url, taskBox, taskList) {
			submitTaskButton.addEventListener('click', () => {
	            taskBox.newtaskCallback(
					async (task) => {
						console.log(`Have '${task.title}' with status ${task.status}.`);
						
						let newTask = await addNewTask(url, task, taskList);
						taskList.showTask(newTask.task);
						
						const statuses = await getAvailableStatuses(url);
						taskList.setStatuseslist(statuses.allstatuses);

						handleTasklistStatusChangeCallback(url, taskList);
						taskBox.close();
					}
				);
	        });
	        
		}
        
        /**
         * Handles getting the available statuses from the API
         * @public
         * @param {String} url
		 * @return {Object} statuses
         */
        async function getAvailableStatuses(url) {
			try {
				const response = await fetch (url + '/allstatuses', { method : "GET" });
				
				if (response.ok) {
					const statuses = await response.json();
					return statuses;
				}
			} catch (e) {
				console.log(`Got error ${e. message }.`);
			}
		}
		
        /**
         * Handle the API request to add the new task to the db
         * @public
         * @param {String} url
		 * @param {Object} task
		 * 
		 * @return {Object} data
         */
		async function addNewTask(url, task) {
			try {
				const response = await fetch (url + '/task', { 
					method : "POST", 
					headers: { "Content-Type": "application/json; charset=utf-8" },
					body: JSON.stringify(task)
				});
								
				if (response.ok) {
					const data = await response.json();
					return data;
				}
			} catch (e) {
				console.log(`Got error ${e. message }.`);
			}
		}
		
        /**
         * Handle the API request to get the Tasks and calling TaskList to create the html
		 * elements with the task details
         * @public
         * @param {String} url
		 * @param {TaskList} taskList
         */
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
		
        /**
         * Handle the callback for change of a task's status.
         * @public
         * @param {String} url
		 * @param {TaskList} taskList
         */
		async function handleTasklistStatusChangeCallback(url, taskList) {
			taskList.changestatusCallback(
				async (task) => {
					const taskStatus = { "status": task.status };
					try {
						const response = await fetch (url + '/task/' + task.id, { 
							method : "PUT", 
							headers: { "Content-Type": "application/json; charset=utf-8" },
							body: JSON.stringify(taskStatus)
						});
										
						if (response.ok) {
							const data = await response.json();
							console.log(data);
						}
					} catch (e) {
						console.log(`Got error ${e. message }.`);
					}
					
					taskList.updateTask(task);
				}
			);
		}
		
        /**
         * Handle the call for removal of a task from the list and db
         * @public
         * @param {String} url
		 * @param {TaskList} taskList
         */
		async function handleTasklistRemoveButtonCallback(url, taskList) {
			taskList.deletetaskCallback(
				async (task) => {
					try {
						const response = await fetch (url + '/task/' + task, { 
							method : "DELETE", 
						});
										
						if (response.ok) {
							const data = await response.json();
							console.log(data);
						}
					} catch (e) {
						console.log(`Got error ${e. message }.`);
					}
					
					taskList.removeTask(task);
				}
			)
		}
    }
}

customElements.define('task-view', TaskView);
