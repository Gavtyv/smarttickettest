// Based on an example:
//https://github.com/don/cordova-plugin-ble-central


// ASCII only
function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

// ASCII only
function stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}



//the bluefruit UART Service
var blue ={
	serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    txCharacteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e', // transmit is from the phone's perspective
    rxCharacteristic: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'  // receive is from the phone's perspective
}

var ConnDeviceId;
var bleDeviceName;
var deviceList =[];

setTimeout("window.location.reload();",120000); //reload siden hvert 20. sekund. Dermed genindlæses Bluetooth-liste
 
function onLoad(){
	document.addEventListener('deviceready', onDeviceReady, false);
    bleDeviceList.addEventListener('touchstart', conn, false); // assume not scrolling
}

function onDeviceReady(){
	refreshDeviceList();
}

	 
function refreshDeviceList(){
	//deviceList =[];
	document.getElementById("bleDeviceList").innerHTML = ''; // empties the list
	if (cordova.platformId === 'android') { // Android filtering is broken
		ble.scan([], 5, onDiscoverDevice, onError);
	} else {
		//alert("Disconnected");
		ble.scan([blue.serviceUUID], 5, onDiscoverDevice, onError);
	}
}


function onDiscoverDevice(device){
	//Make a list in html and show devises
	if(device.name == "Kasperishere"){
		
		var listItem = document.createElement('li'),
		html = device.name+ "," + device.id;
		listItem.innerHTML = html;
		document.getElementById("bleDeviceList").appendChild(listItem);
	}
	if(device.name == "Beaconsal"){
		var listItem = document.createElement('li'),
		html = device.name+ "," + device.id;
		listItem.innerHTML = html;
		document.getElementById("bleDeviceList").appendChild(listItem);
	}
}


function conn(){
	var  deviceTouch= event.srcElement.innerHTML;
	document.getElementById("debugDiv").innerHTML =""; // empty debugDiv
	var deviceTouchArr = deviceTouch.split(",");
	ConnDeviceId = deviceTouchArr[1];
	bleDeviceName = deviceTouchArr[0];
	document.getElementById("debugDiv").innerHTML += "<br>Debug: <br>"+deviceTouchArr[0]+"<br>"+deviceTouchArr[1]; //for debug:
	if(bleDeviceName  == "Kasperishere")
		test();
	if(bleDeviceName == "Beaconsal"){
		//ble.connect(ConnDeviceId, onConnect, onConnError);
		location.href="indtastpin.html";
	}
 }
 function onConnect(){//nyt i java
	document.getElementById("statusDiv").innerHTML = " Status: Connected";
	document.getElementById("bleId").innerHTML = ConnDeviceId;
	ble.startNotification(ConnDeviceId, blue.serviceUUID, blue.rxCharacteristic, onData, onError);
 }
 //failure
function onConnError(){ // nyt i java
	alert("Problem connecting");
	document.getElementById("statusDiv").innerHTML = " Status: Disonnected";
}
function data(txt){//nyt 
messageInput.value = txt;
} 

function onError(reason)  {
	alert("ERROR: " + reason); // real apps should use notification.alert
}



function test(){
	var url='https://testwebsitebeaconhtml.000webhostapp.com/';	
	openBrowser(url);
}

function openBrowser(url) {
   var target = '_blank';
   var options = "location=no"
   var ref = cordova.InAppBrowser.open(url, target, options);
}




