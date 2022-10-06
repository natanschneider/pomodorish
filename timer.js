let minutes = 25;
let seconds = 0;
let myInterval;
let Break = false;
let onlyRunOnce = true;
let stopBtn = false;
let numBreak = 1;

window.onload = async () =>{
	document.getElementById('minutes').innerHTML = minutes;
	document.getElementById('seconds').innerHTML = seconds;
	
	listItems();
	let permission = await Notification.requestPermission();
}

function check(){
	if(onlyRunOnce === true) {
		onlyRunOnce = false;
		start();
	}
}

function start(){
	if(stopBtn === true){
		minutes = document.getElementById('minutes').innerHTML;
		seconds = document.getElementById('seconds').innerHTML;
		stopBtn = false;
	}else if(Break === false && stopBtn === false){
		seconds = 60;
		minutes = 24;
	}else if(Break === true && numBreak === 4 && stopBtn === false){
		seconds = 60;
		minutes = 14;
		numBreak = 0;
	}else if(Break === true && stopBtn === false){
		seconds = 60;
		minutes = 4;
		numBreak++;
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

function stopButton(){
	clearInterval(myInterval);
	onlyRunOnce = true;
	stopBtn = true;
}

// The diference between the function stop and stopButton is: the stop function is meant to be called by another function, stopButton is meant to be called by the user
// When start function is called if stopButton was called the clock keeps going from where is stopped, and if stop was called, it checks which pomodoro cycle the user is and starts from there.