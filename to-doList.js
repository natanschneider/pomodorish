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
    deleteBtn.innerHTML = 'Delete';
    deleteBtn.onclick = function(){
        deleteItem(key);
    };

    div.appendChild(h4);
    div.appendChild(deleteBtn);
    document.body.appendChild(div);
}

function deleteItem(key){
    localStorage.removeItem(key);

    let div = document.getElementById(key);
    div.remove();
}

function listItems(){
    let i;
    let numberOfItems = localStorage.length;
    if(numberOfItems >= 1) {
        for (i = 1; i <= numberOfItems; i++) {
            getItem(i);
        }
    }else{
        return false;
    }
}