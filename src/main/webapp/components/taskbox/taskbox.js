const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" type="text/css" href="${import.meta.url.match(/.*\//)[0]}/taskbox.css"/>

    <dialog id="dialog">
       <!-- Modal content -->
        <span id="closeModal">&times;</span>
        <div>
            <div>Title:</div><div><input id="taskTitle" type="text" size="25" maxlength="80" placeholder="Task title" autofocus/></div>
            <div>Status:</div><div><select id="selectStatus"></select></div>
        </div>
        <p><button id="submitTaskButton" type="submit">Add task</button></p>
     </dialog>`;

/**
  * TaskBox
  * Manage view to add a new task
  */
class TaskBox extends HTMLElement {

    constructor() {
		super();
            
		const shadow = this.attachShadow({mode: 'open'});
		const content = template.content.cloneNode(true);
		shadow.appendChild(content);
		
		this.newTaskButton = shadow.querySelector('#closeModal');
		
		this.newTaskButton.addEventListener('click', () => {
            this.close();
        });

    }
    
    /**
     * Opens the modal box of view
     * @public
     */
    async show() {	
    	const dialogElement = this.shadowRoot.querySelector('#dialog');
    	dialogElement.showModal();
    }

    /**
     * Set the list of possible task states
     * @public
     * @param{Array<Object>} statuslist
     */
    setStatuseslist(statuslist) {
    	const dialogElement = this.shadowRoot.querySelector('#selectStatus');
    	
    	statuslist.forEach(function (item) {
			const option = document.createElement("option");
    		option.value = item;
    		option.text = item;
    		dialogElement.add(option);
		});
    	
    }

    /**
     * Add callback to run at click on the "Add task" button
     * @public
     * @param {function} callback
     */
    newtaskCallback(callback) {
		
		const taskTitleElement = this.shadowRoot.querySelector('#taskTitle');
		const selectStatusElement = this.shadowRoot.querySelector('#selectStatus');
		
		const title = taskTitleElement.value;
		const status = selectStatusElement.value;
		
		let task = {
			title: title,
			status: status
		};
		
		callback(task);
    }

    /**
     * Closes the modal box
     * @public
     */
    close() {
    	const dialogElement = this.shadowRoot.querySelector('#dialog');
    	dialogElement.close();
    }
}

customElements.define('task-box', TaskBox);

export default TaskBox;
