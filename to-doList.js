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
	h4.textContent = item + '  ';
	h4.id = 'h4' + key;
	
	let deleteBtn = document.createElement('button');
	let checkBtn = document.createElement('button');

	deleteBtn.id = 'deleteTask';
	checkBtn.id = 'checkTask';

	deleteBtn.class = 'dynamicButton';
	checkBtn.class = 'dynamicButton';

	deleteBtn.innerHTML = '<img src="images/cancel.png"  alt="" id="deleteImg"/>';
	checkBtn.innerHTML = '<img src="images/check.png"  alt="" id="checkImg"/>';

	deleteBtn.onclick = function(){
		deleteItem(key);
	};

	checkBtn.onclick = function(){
		checkItem(key);
	};

	h4.appendChild(checkBtn);
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

function clearItems(){
	localStorage.clear();
	let div = document.getElementById('tasks');
	div.innerHTML = '';
}

function checkItem(key){
	localStorage.removeItem(key);

	let h4 = document.getElementById('h4' + key);
	h4.style = 'text-decoration: line-through';
}