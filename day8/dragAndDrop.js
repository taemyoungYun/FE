function dragAndDrop(dragElement, dropElement, event, fCallback) {

	function getGlobalOffset(elArg, type) {
		var nOffset = 0;
		while (elArg){
			nOffset += eval("elArg.offset" + type);
			elArg = elArg.offsetParent;
		}
		return nOffset;
	}

	var elToDrag = dragElement.cloneNode(true);
	document.body.appendChild(elToDrag);

	var mousePos = {
		x : event.clientX,
		y : event.clientY
	};

	var originalPos = {
		x : getGlobalOffset(dragElement,"Left"),
		y : getGlobalOffset(dragElement,"Top")
	};

	var movedPos = {
		x : mousePos.x - originalPos.x,
		y : mousePos.y - originalPos.y
	};

	if(document.addEventListener){
		document.addEventListener("mousemove", moveHandler, true);
		document.addEventListener("mouseup", upHandler, true);
	}else if(document.attachEvent){
		elToDrag.setCapture();
		elToDrag.attachEvent("onmousemove", moveHandler);
		elToDrag.attachEvent("onmouseup", upHandler);
		elToDrag.attachEvent("onlosecapture", upHandler);
	}

	if(event.stopPropagation)
		event.stopPropagation();
	else
		event.cancelBubble = true;

	if(event.preventDefault)
		event.preventDefault;
	else
		event.returnValue = false;

	function moveHandler(e) {
		if(!e)
			e = window.event;

		elToDrag.style.position = 'absolute';
		elToDrag.style.left = (e.clientX - movedPos.x) + "px";
		elToDrag.style.top = (e.clientY - movedPos.y) + "px";

		if(e.stopPropagation)
			e.stopPropagation();
		else
			e.cancelBubble = true;
	}

	function upHandler(e) {
		var isSucess = false;

		if(!e)
			e = window.event;
		mousePos = {
			x : e.clientX,
			y : e.clientY
		};
		var dropPos = {};
		dropPos.x = getGlobalOffset(dropElement, "Left");
		dropPos.y = getGlobalOffset(dropElement, "Top");
		dropPos.width = dropElement.offsetWidth;
		dropPos.height = dropElement.offsetHeight;

		if(document.removeEventListener){
			document.removeEventListener("mousemove", moveHandler, true);
			document.removeEventListener("mouseup", upHandler, true);
		}else if(document.detachEvent){
			elToDrag.detachEvent("onmousemove", moveHandler);
			elToDrag.detachEvent("onmouseup", upHandler);
			elToDrag.detachEvent("onlosecapture", upHandler);
		}

		if(mousePos.x > dropPos.x && mousePos.y > dropPos.y &&
				mousePos.x < (dropPos.x + dropPos.width) &&
				mousePos.y < (dropPos.y + dropPos.height)){
			isSucess = true;
		}

		fCallback(e, isSucess);

		document.body.removeChild(elToDrag);

		if(e.stopPropagation)
			e.stopPropagation();
		else
			e.cancelBubble = true;
	}
};

