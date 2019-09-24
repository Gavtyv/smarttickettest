var pin2 = "1234";
var pin3 = "4321";
var indtastetpin;

function tjekpin(){
	indtastetpin = document.getElementById("pin").value;
	switch(indtastetpin){
		case"1234":
			if (indtastetpin == pin2){
			document.getElementById("udskrivning").innerHTML = "godkendt pin, sender 1 til arduino";
		
		}
		break;
		
		case"4321":
			if (indtastetpin == pin3){
			document.getElementById("udskrivning").innerHTML = "godkendt pin, sender 1 til arduino";
		
		}
		break;
		
		default:
			document.getElementById("udskrivning").innerHTML = " Forkert pin sender 0";
	}
	
}
function input(e) {
    document.getElementById("pin").value += e;
//tbInput.value = tbInput.value + e.value;
}

function del() {
	//document.getElementById("pin").value  = "";
    var tbInput = document.getElementById("pin").value; // pinkode textbox indhold gemems i variable
document.getElementById("pin").value = tbInput.substr(0, tbInput.length - 1 );// den tager fra starten til men tager ikke den sidste cirfre med (eks 256 = 25) og så fjerne den sidste cifre
}