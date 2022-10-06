let num;
let storageLength = localStorage.length;

if(storageLength !== 0){
	num = storageLength;
}else{
	num = 1;
}

function setItem(value){
	let key = num;
	localStorage.setItem(key.toString(), value);
	getItem(key);
	num++;
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
		}
	}else{
		return false;
	}
}