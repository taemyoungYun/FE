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

function removeEventHandler(target, sEvent, fHandler) {
	if(target.addEventListener){
		target.removeEventListener(sEvent, fHandler, false);
	}else if(target.attachEvent){
		target.dettachEvent(sEvent, fHandler);
	}
}

var vendingMachine = function() {
	var insertedMoney = 0;
	var currentMoney = 0;
	var leftMoney = 0;

	var isPaperSelected = 0;

	var oMoney = {
		inserted : 0,
		current : 10000,
		selected : 0
	};
	function Item(name, price) {
		this.name = name;
		this.price = price;
		this.stock = parseInt(Math.random() * 10) % 3 + 1;
	}

	var init = function() {
		var arrItems = [ new Item("쥬스", 100), new Item("콜라", 200),
				new Item("사이다", 300), new Item("물", 400), new Item("소주", 500),
				new Item("맥주", 600), new Item("위스키", 700), new Item("식혜", 800) ];

		arrItems.sort(function(a, b) {
			var rNum = (parseInt(Math.random() * 10) % 9 * 2) - 1;
			return a.price % rNum - b.price % rNum;
		});

		for( var i = 0; i < 8; i++){
			var productDiv = document.createElement("div");

			productDiv.setAttribute("name", arrItems[i].name);
			productDiv.setAttribute("price", arrItems[i].price);
			productDiv.setAttribute("stock", arrItems[i].stock);
			productDiv.className = "product";

			var productDivImg = document.createElement("div");
			productDivImg.innerHTML = arrItems[i].name;
			productDivImg.className = "divImg";

			var productDivTxt = document.createElement("div");
			productDivTxt.innerHTML = arrItems[i].price;
			productDivTxt.className = "divTxt";

			productDiv.appendChild(productDivImg);
			productDiv.appendChild(productDivTxt);

			getById("productPannel").appendChild(productDiv);
		}
	}();

	var insertCoin = function() {
		var dropElement = getById("insertBox");

		oMoney.fPay = function(event, isSucess) {
			var target = event.target || event.srcElement;
			oMoney.selected = parseInt(target.id);

			if(oMoney.current >= oMoney.selected){
				oMoney.current -= oMoney.selected;
				if(isSucess){
					oMoney.selected == 1000 ? isPaperSelected++
							: isPaperSelected;

					if(oMoney.selected == 1000 && isPaperSelected > 1){
						oMoney.current += oMoney.selected;
						log("지폐는 두장이상 넣을 수 없습니다.");
					}else{
						oMoney.inserted += oMoney.selected;
					}
				}else{
					leftMoney += oMoney.selected;
					log("돈을 흘리셨습니다.");
				}
			}else{
				log("가지고 있는 돈이 부족합니다.");
			}

			writeConsole();
		};

		function addDragAndDrop(elToDrag) {
			if(elToDrag.addEventListener){
				elToDrag.addEventListener("mousedown", function(e) {
					dragAndDrop(elToDrag, dropElement, e, oMoney.fPay);
				}, false);
			}else if(elToDrag.attachEvent){
				elToDrag.attachEvent("onmousedown", function(e) {
					e = window.event || e;
					dragAndDrop(elToDrag, dropElement, e, oMoney.fPay);
				});
			}
		};
		addDragAndDrop(getById("50wonImg"));
		addDragAndDrop(getById("100wonImg"));
		addDragAndDrop(getById("500wonImg"));
		addDragAndDrop(getById("1000wonImg"));
	}();

	var reFund = function() {
		addEventHandler(getById("refundBox"), "click", function() {
			oMoney.current += oMoney.inserted;
			log(oMoney.inserted + " 원이 반환되었습니다");
			getById("pocketMoney").innerHTML = "내가 가진 돈 : " +
					parseInt(oMoney.current);
			oMoney.inserted = 0;
			getById("insertBox").innerHTML = oMoney.inserted + " 원";
			isPaperSelected = 0;
		});
	}();

	var buy = function() {
		var arrProductDives = getById("productPannel").getElementsByTagName("div");
		for( var i = 0; i < arrProductDives.length; i++){
			var _elDiv = arrProductDives[i];
			if(_elDiv.parentNode.id == "productPannel"){
				addEventHandler(_elDiv, "click", function(event) {
							event = window.event || event;
							var elTarget = event.target || event.srcElement;
							elTarget = elTarget.parentNode.id == "productPannel" ? elTarget	: elTarget.parentNode;
							
							var _price = elTarget.getAttribute("price");
							var _stock = elTarget.getAttribute("stock");
							var _name = elTarget.getAttribute("name");
							
							if(_stock <= 0){
								log("품절입니다.");
								return;
							}
							
							if(oMoney.inserted >= _price){
								oMoney.inserted -= _price;
								elTarget.setAttribute("stock", _stock - 1);
								log(_name + " 나왔습니다.");
								writeConsole();
							}else{
								log("돈이 부족합니다");
							}
						});
			}
		}
	}();
	
	function log(sLog) {
		var logger = document.getElementById("consolePannel");
		logger.innerHTML = logger.innerHTML + sLog + "<br/>";
		logger.scrollTop = logger.scrollHeight;
	}

	function writeConsole() {
		getById("pocketMoney").innerHTML = "내가 가진 돈 : " +
				parseInt(oMoney.current);
		getById("insertBox").innerHTML = oMoney.inserted + " 원";
	}
};