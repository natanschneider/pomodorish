let minutes = 25;
let seconds = 0;
let myInterval;
let Break = false;
let onlyRunOnce = true;

window.onload = () =>{
    document.getElementById('minutes').innerHTML = minutes;
    document.getElementById('seconds').innerHTML = seconds;
}

function check(){
    if(onlyRunOnce === true){
        onlyRunOnce = false;
        start();
    }else{
        return false;
    }
}

function start(){
    if(Break === false){
        seconds = 60;
        minutes = 24;
    }else if(Break === true){
        seconds = 60;
        minutes = 4;
    }

    let timerFunction = () => {
        seconds = seconds - 1;

        if(seconds === 0){
            minutes = minutes - 1;
            seconds = 59;
        }

        if(minutes === -1){
            stop();
            if(Break === true){
                Break = false;
                minutes = 25;
                seconds = 0;
                new Notification('Time to get back to work!');
            }else if(Break === false){
                Break = true;
                minutes = 5;
                seconds = 0;
                new Notification('You deserve a break now!');
            }
        }
        document.getElementById('minutes').innerHTML = minutes;
        document.getElementById('seconds').innerHTML = seconds;
    }
    myInterval = setInterval(timerFunction, 1000);
}

function stop(){
    clearInterval(myInterval);
    onlyRunOnce = true;
}