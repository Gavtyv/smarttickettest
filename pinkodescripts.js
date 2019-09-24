var pin2 = "1234";
var pin3 = "4321";
var indtastetpin;

function tjekpin(){
	indtastetpin = document.getElementById("pin").value;
	switch(indtastetpin){
		case"1234":
			if (indtastetpin == pin2){
			document.getElementById("udskrivning").innerHTML = "godkendt pin, sender 1 til arduino";
			data("1");
		
		}
		break;
		
		case"4321":
			if (indtastetpin == pin3){
			document.getElementById("udskrivning").innerHTML = "godkendt pin, sender 1 til arduino";
			data("1");
		}
		break;
		
		default:
			document.getElementById("udskrivning").innerHTML = " Forkert pin sender 0";
			data("0");
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

function sendData() { // send data to Arduino
	 var data = stringToBytes(messageInput.value);
	ble.writeWithoutResponse(ConnDeviceId, blue.serviceUUID, blue.txCharacteristic, data, onSend, onError);
}
var ConnDeviceId;//nyt
var blue ={//nyt
	serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    txCharacteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e', // transmit is from the phone's perspective
    rxCharacteristic: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'  // receive is from the phone's perspective
}

function data(txt){//nyt
	messageInput.value = txt;
}

function onSend(){ //nyt
	document.getElementById("sendDiv").innerHTML = "Sent: " + messageInput.value + "<br/>";
}
function onError(reason)  {//nyt
	alert("ERROR: " + reason); // real apps should use notification.alert
}

function stringToBytes(string) {//nyt
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}	