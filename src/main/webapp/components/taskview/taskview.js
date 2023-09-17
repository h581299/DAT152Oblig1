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
		
		this.newTaskButton = shadow.querySelector('#newTaskButton');
		
		this.newTaskButton.addEventListener('click', () => {
            this.taskBox.show();
        });
        
        
        
        this.taskBox.setStatuseslist(["WATING","ACTIVE","DONE"]);
        
        requestData();
        
        async function requestData () {
			console.log('trying...');
			try {
				const response = await fetch ("../TaskServices/api/services/allstatuses", { method : "GET" });
				console.log(`Got response from server: ${ JSON.stringify(response) }`);
			} catch (e) {
				console.log(`Got error ${e. message }. `);
			}
		}
    }
}

customElements.define('task-view', TaskView);
