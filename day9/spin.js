function getById(id) {
	return document.getElementById(id);
}

function addEventHandler(target, sEvent, fHandler) {
	if(target.addEventListener){
		target.addEventListener(sEvent, fHandler, false);
	}else if(target.attachEvent){
		sEvent = "on" + sEvent;
		target.attachEvent(sEvent, fHandler);
	}
}

var spin = function(elSpinBox, elControl) {
	var context;
	var oOption = {};
	var arrLines = [];
	var elCanvas;
	var nSpinTimerId;

	var setControlPannel = function() {
		elCanvas = document.createElement("canvas");
		elCanvas.id = "spin";
		elCanvas.className = "spin";
		elSpinBox.appendChild(elCanvas);
		context = elCanvas.getContext("2d");

		elControl.appendChild(addControlUnit("line", 10,40,10));
		elControl.appendChild(addControlUnit("length", 20,30,5));
		elControl.appendChild(addControlUnit("width", 8,20,5));
		elControl.appendChild(addControlUnit("radius", 30,50,0));
		elControl.appendChild(addControlUnit("speed", 300,400,100));
		elControl.appendChild(addControlUnit("colorR", "204"),255,0);
		elControl.appendChild(addControlUnit("colorG", "000"),255,0);
		elControl.appendChild(addControlUnit("colorB", "051"),255,0);

		function addControlUnit(sId, defaulVal, nUpLimit, nBttLimit) {
			var elDiv = document.createElement("div");
			var _elLabel = document.createElement("label");
			var _elInput = document.createElement("input");

			elDiv.id = sId;
			_elLabel.innerHTML = sId + "( " + nUpLimit + " ~ " + nBttLimit +
					" )" + ":";
			_elInput.id = sId + "Input";
			_elInput.type = "range";
			_elInput.max = nUpLimit;
			_elInput.min = nBttLimit;
			_elInput.value = defaulVal;

			addEventHandler(_elInput, "change", function() {
				clearInterval(nSpinTimerId);
				setOptions();
				fDraw();
			});

			elDiv.appendChild(_elLabel);
			elDiv.appendChild(_elInput);

			return elDiv;
		}

		setOptions();
	};

	var setOptions = function() {
		oOption.line = parseInt(document.getElementById("lineInput").value);
		oOption.length = parseInt(document.getElementById("lengthInput").value);
		oOption.width = parseInt(document.getElementById("widthInput").value);
		oOption.speed = document.getElementById("speedInput").max - parseInt(document.getElementById("speedInput").value);
		oOption.radius = parseInt(document.getElementById("radiusInput").value);
		oOption.color = {
			r : parseInt(document.getElementById("colorRInput").value),
			g : parseInt(document.getElementById("colorGInput").value),
			b : parseInt(document.getElementById("colorBInput").value)
		};

		oOption.centerX = document.getElementById("spin").width / 2;
		oOption.centerY = document.getElementById("spin").height / 2;
		setArrLines();
	};

	var setArrLines = function() {
		arrLines = new Array(parseInt(oOption.line));
		var nInnerRad = oOption.radius;
		var nOuterRad = nInnerRad + oOption.length;
		var _anglePerLine = Math.PI * 2 / oOption.line;

		for( var i = 0, j = 0; i < arrLines.length; i++, j += _anglePerLine){
			arrLines[i] = {};
			arrLines[i].beginX = oOption.centerX + Math.cos(j) * nInnerRad;
			arrLines[i].beginY = oOption.centerY + Math.sin(j) * nInnerRad;
			arrLines[i].endX = oOption.centerX + Math.cos(j) * nOuterRad;
			arrLines[i].endY = oOption.centerY + Math.sin(j) * nOuterRad;
		}
	};

	var fDraw = function() {
		nSpinTimerId = setInterval(function() {
			var nAlpha = 1.0;

			context.clearRect(0, 0, elCanvas.width, elCanvas.height);
			context.fillRect(0, 0, elCanvas.width, elCanvas.height);
			context.lineWidth = oOption.width;
			context.lineLength = oOption.length;
			context.lineCap = "round";

			for( var i = 0; i < arrLines.length; i++){
				context.strokeStyle = 'rgba(' + oOption.color.r + ', ' +
						oOption.color.g + ', ' + oOption.color.b + ', ' +
						nAlpha + ')';
				context.beginPath();
				context.moveTo(arrLines[i].beginX, arrLines[i].beginY);
				context.lineTo(arrLines[i].endX, arrLines[i].endY);
				context.stroke();
				context.closePath();

				nAlpha = nAlpha > 0.5 ? nAlpha - 0.1 : 0.5;
			}

			var lineToPush = arrLines.shift();
			arrLines.push(lineToPush);
		}, oOption.speed);
	};

	var initSpin = function() {
		setControlPannel();
		setOptions();
		fDraw();
	}();
};