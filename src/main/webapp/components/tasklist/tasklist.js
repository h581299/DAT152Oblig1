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
            <select>
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
        /**
         * Fill inn rest of code
         */
        }

        /**
         * Add callback to run on change on change of status of a task, i.e. on change in the SELECT element
         * @public
         * @param {function} callback
         */
        changestatusCallback(callback) {
        /**
         * Fill inn rest of code
         */
        }

        /**
         * Add callback to run on click on delete button of a task
         * @public
         * @param {function} callback
         */
        deletetaskCallback(callback) {
        /**
         * Fill inn rest of code
         */
        }

        /**
         * Add task at top in list of tasks in the view
         * @public
         * @param {Object} task - Object representing a task
         */
        showTask(task) {
        /**
         * Fill inn rest of code
         */
        }

        /**
         * Update the status of a task in the view
         * @param {Object} task - Object with attributes {'id':taskId,'status':newStatus}
         */
        updateTask(task) {
        /**
         * Fill inn rest of code
         */
        }

        /**
         * Remove a task from the view
         * @param {Integer} task - ID of task to remove
         */
        removeTask(id) {
        /**
         * Fill inn rest of code
         */
        }

        /**
         * @public
         * @return {Number} - Number of tasks on display in view
         */
        getNumtasks() {
        /**
         * Fill inn rest of code
         */
        }
        
        createAllTasks(tasks) {
			console.log(tasks);
			const tableBodyElement = this.shadowRoot.querySelector('#tableBody');
			let rowContent = null;
			let tdElements = null;
			
			for (var key in tasks) {
			    rowContent = taskrow.content.cloneNode(true);
				tableBodyElement.appendChild(rowContent);
				
				tdElements = rowContent.querySelectorAll('td');
				console.log(tdElements);
				
				if (tdElements.length >= 2) {
			    	tdElements[0].innerHTML = tasks[key].title;
			    	tdElements[1].innerHTML = tasks[key].status;
			    }
				
			}
		}
}

customElements.define('task-list', TaskList);
