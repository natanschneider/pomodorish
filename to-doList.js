function setItem(value){
    let key = 1;

    localStorage.setItem(key.toString(), value);
    getItem(key);
    key++;
}

function getItem(key){
    let item = localStorage.getItem(key);

    let div = document.createElement('div');

    div.id = 'taskItem';

    let h4 = document.createElement('h4');
    h4.textContent = item;
    div.appendChild(h4);

    document.body.appendChild(div);
}

function deleteItem(key){
    localStorage.removeItem(key);
}

function editItem(){

}