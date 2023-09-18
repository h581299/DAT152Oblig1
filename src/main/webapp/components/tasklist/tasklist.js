const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" type="text/css" href="${import.meta.url.match(/.*\//)[0]}/tasklist.css"/>

    <div id="tasklist"></div>`;

const tasktable = document.createElement("template");
tasktable.innerHTML = `
    <table>
        <thead><tr><th>Task</th><th>Status</th></tr></thead>
        <tbody id="tableBody"></tbody>
    </table>`;
tasktable.id = "tasktable-template";

const taskrow = document.createElement("template");
taskrow.innerHTML = `
    <tr>
        <td></td>
        <td></td>
        <td>
            <select class="selectOptions">
                <option value="0" selected>&lt;Modify&gt;</option>
            </select>
        </td>
        <td><button type="button">Remove</button></td>
    </tr>`;
taskrow.id = "taskrow-template";


/**
  * TaskList
  * Manage view with list of tasks
  */
class TaskList extends HTMLElement {

        constructor() {
                super();

			    // Create shadow DOM and append the main template content
			    const shadow = this.attachShadow({ mode: 'open' });
			    const content = template.content.cloneNode(true);
			    shadow.appendChild(content);
			    
			    const taskListElement = shadow.querySelector('#tasklist');
			    const tableContent = tasktable.content.cloneNode(true);
			    taskListElement.appendChild(tableContent);
			    

        }

        /**
         * @public
         * @param {Array} list with all possible task statuses
         */
        setStatuseslist(allstatuses) {
			let selects = this.shadowRoot.querySelectorAll('select');
			let option = null;
			
			for (var i in selects) {
				for (var j in allstatuses) {
					option = document.createElement("option");
					option.value = j + 1;
					option.textContent = allstatuses[j];
					
					selects[i].appendChild(option);
				}
			}
        }

        /**
         * Add callback to run on change on change of status of a task, i.e. on change in the SELECT element
         * @public
         * @param {function} callback
         */
        changestatusCallback(callback) {
			const selectElements = this.shadowRoot.querySelectorAll('select');
			let task = {};
			
			for (var key in selectElements) {
				if (typeof selectElements[key] == "object") {
					selectElements[key].addEventListener('change', (self) => {
						task.id = self.target.id.slice(7);
						task.status = self.target.options[self.target.selectedIndex].textContent;
						
						if (task != undefined) {
							callback(task);
						}
					});
				}
			}

			callback();
        }

        /**
         * Add callback to run on click on delete button of a task
         * @public
         * @param {function} callback
         */
        deletetaskCallback(callback) {
			const buttonElements = this.shadowRoot.querySelectorAll('button');
			let task = null;
			
			for (var key in buttonElements) {
				if (typeof buttonElements[key] == "object") {
					buttonElements[key].addEventListener('click', (self) => {
						task = self.target.id.slice(7);
						
						callback(task);
					});
				}
			}
        }

        /**
         * Add task at top in list of tasks in the view
         * @public
         * @param {Object} task - Object representing a task
         */
        showTask(task) {
			const tableBodyElement = this.shadowRoot.querySelector('#tableBody');
			
			const rowContent = taskrow.content.cloneNode(true);
			
			const trElement = rowContent.querySelector("tr");
			const tdElements = trElement.querySelectorAll('td');
			
			if (tdElements.length >= 2) {
		    	tdElements[0].innerHTML = task.title;
		    	tdElements[1].innerHTML = task.status;
		    }
		    
		    trElement.id = "tableRow-" + task.id;
		    trElement.querySelector("select").id = "select-" + task.id;
		    trElement.querySelector("button").id = "button-" + task.id;
		    
		    tableBodyElement.insertBefore(rowContent, tableBodyElement.firstChild);
        }

        /**
         * Update the status of a task in the view
         * @param {Object} task - Object with attributes {'id':taskId,'status':newStatus}
         */
        updateTask(task) {
			const trElement = this.shadowRoot.querySelector("#tableRow-" + task.id);
			
			const tdElements = trElement.querySelectorAll('td');
				
			if (tdElements.length >= 2) {
		    	tdElements[1].innerHTML = task.status;
		    }
        }

        /**
         * Remove a task from the view
         * @param {Integer} task - ID of task to remove
         */
        removeTask(id) {
			const trElement = this.shadowRoot.querySelector("#tableRow-" + id);
			
			trElement.remove();
        }

        /**
         * @public
         * @return {Number} - Number of tasks on display in view
         */
        getNumtasks() {
			const num = this.shadowRoot.querySelectorAll("tr").length;

			return num;
        }
        
        /**
         * Create one row for each task in the table using the html templates provided
         * @public
         * @param {Object} tasks
         */
        createAllTasks(tasks) {
			const tableBodyElement = this.shadowRoot.querySelector('#tableBody');
			let rowContent = null;
			let tdElements = null;
			let trElement = null;
			
			for (var key in tasks) {
			    rowContent = taskrow.content.cloneNode(true);

				trElement = rowContent.querySelector("tr");
				tdElements = trElement.querySelectorAll('td');
				
				if (tdElements.length >= 2) {
			    	tdElements[0].innerHTML = tasks[key].title;
			    	tdElements[1].innerHTML = tasks[key].status;
			    }
			    
			    trElement.id = "tableRow-" + tasks[key].id;
			    trElement.querySelector("select").id = "select-" + tasks[key].id;
			    trElement.querySelector("button").id = "button-" + tasks[key].id;
			    
			    tableBodyElement.appendChild(rowContent);
				
			}
		}
}

customElements.define('task-list', TaskList);
