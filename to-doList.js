let lastKey = 0;
let storageLength = localStorage.length;

function setItem(value){
	lastKey++;
	localStorage.setItem(lastKey.toString(), value);
	getItem(lastKey);
}

function getItem(key){
	let item = localStorage.getItem(key);
	
	let div = document.createElement('div');
	
	div.class = 'taskItem';
	div.id = key;
	
	let h4 = document.createElement('h4');
	h4.textContent = item;
	
	let deleteBtn = document.createElement('button');
	deleteBtn.id = 'deleteTask';
	deleteBtn.innerHTML = '<img src="images/cancel.png"  alt="" id="deleteImg"/>';
	deleteBtn.onclick = function(){
		deleteItem(key);
	};

	h4.appendChild(deleteBtn);
	div.appendChild(h4);
	document.getElementById('tasks').appendChild(div);
}

function deleteItem(key){
	localStorage.removeItem(key);
	
	let div = document.getElementById(key);
	div.remove();
}

function listItems(){
	let keys = Object.keys(localStorage);

	if(storageLength !== 0){
		for(let key of keys){
	  		getItem(key);
			if(key > lastKey){
				lastKey = key;
			}
		}
	}else{
		return false;
	}
}