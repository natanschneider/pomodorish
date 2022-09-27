let minutes = 25;
let seconds = 0;
let myInterval;

window.onload = () =>{
    document.getElementById('minutes').innerHTML = minutes;
    document.getElementById('seconds').innerHTML = seconds;
}

function start(){
    seconds = 4;
    minutes = 24;

    let timerFunction = () => {
        seconds = seconds - 1;

        if (seconds === 0) {
            minutes = minutes - 1;
            seconds = 59;
        }

        document.getElementById('minutes').innerHTML = minutes;
        document.getElementById('seconds').innerHTML = seconds;
    }
    myInterval = setInterval(timerFunction, 1000);
}

function stop(){

}