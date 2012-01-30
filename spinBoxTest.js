function getById(id) {
	return document.getElementById(id);
}

function addEventHandler(target, sEvent, fHandler) {
	if (target.addEventListener) {
		target.addEventListener(sEvent, fHandler, false);
	} else if (target.attachEvent) {
		sEvent = "on" + sEvent;
		target.attachEvent(sEvent, fHandler);
	}
}

function removeEventHandler(target, sEvent, fHandler) {
	if (target.addEventListener) {
		target.removeEventListener(sEvent, fHandler, false);
	} else if (target.attachEvent) {
		sEvent = "on" + sEvent;
		target.dettachEvent(sEvent, fHandler);
	}
}

addEventHandler(window, "load", function() {

	getById("content").value = 200;
	var fIncrement = function() {
		if (getById("content").value < 300)
			getById("content").value++;
	};
	var fDecrement = function() {
		if (getById("content").value > 100)
			getById("content").value--;
	};
	var isMouseUp;
	var timeOutId;

	test("defaultValueSetting test", function() {
		ok(getById("content").value == 200);
	});

	test("onClickEventHandler()", function() {
		var beforeVal = getById("content").value;
		var clickCount = 0;
		addEventHandler(getById("increment"), "click", function() {
			if (getById("content").value < 300) {
				getById("content").value++;
				clickCount++;
			}
		});
		addEventHandler(getById("decrement"), "click", function() {
			if (getById("content").value > 100) {
				getById("content").value--;
				clickCount--;
			}
		});
		ok(getById("content").value == parseInt(beforeVal) + clickCount);
	});

	test("onBlurHandler()", function() {
		addEventHandler(getById("content"), "blur",
				function() {
					var beforeVal = getById("content").value;
					getById("content").value = getById("content").value
							.replace(/[^0-9]/gi, "");

					if (getById("content").value > 300) {
						getById("content").value = 300;
					} else if (getById("content").value < 100) {
						getById("content").value = 100;
					}

					equals(beforeVal, getById("content").value.replace(/[^0-9]/gi, ""));
				});
	});

	test("onMouseDownHandler", function() {
		addEventHandler(getById("increment"), "mousedown", function() {
			isMouseUp = false;
			setTimeout(function() {
				if (!isMouseUp)
					timeOutId = setInterval(fIncrement, 100);
			}, 500);
		});
		addEventHandler(getById("decrement"), "mousedown", function() {
			isMouseUp = false;
			setTimeout(function() {
				if (!isMouseUp)
					timeOutId = setInterval(fDecrement, 100);
			}, 500);
		});
	});

	test("onMouseUpHandler()", function() {
		addEventHandler(getById("increment"), "mouseup", function() {
			isMouseUp = true;
			if (timeOutId !== undefined)
				clearInterval(timeOutId);
		});
		addEventHandler(getById("decrement"), "mouseup", function() {
			isMouseUp = true;
			if (timeOutId !== undefined)
				clearInterval(timeOutId);
		});
	});

});