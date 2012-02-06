var VendingMachine = $Class({
	isPaperInserted : false,
	oMoney : {inserted : 0, current : 0, selected : 0},

	$init : function(nCurrentoMoney){
		this.oMoney.current = nCurrentoMoney;
		this.oCoinBox = {
				x : $Element("moneyPocketBox").offset().left,
				y : $Element("moneyPocketBox").offset().top,
				width : $Element("moneyPocketBox").width(),
				height : $Element("moneyPocketBox").height(),
		};
		
		function Item(name,price){
			this.name = name;
			this.price = price;
			this.stock = parseInt(Math.random() * 10) % 3 + 1;
		}

		this.arrItems = $A([ new Item("쥬스", 100), new Item("콜라", 200),
		                     new Item("사이다", 300), new Item("물", 400), new Item("소주", 500),
		                     new Item("맥주", 600), new Item("위스키", 700), new Item("식혜", 800) ]);

		this.arrItems.shuffle();
		this.arrItems.forEach($Fn(function(value,index,array){
			var productDiv    = $Element("<DIV>");
			var productDivImg = $Element("<DIV>");
			var productDivTxt = $Element("<DIV>");

			productDiv.className("product");
			productDivImg.className("divImg");
			productDivTxt.className("divTxt");

			productDiv.attr("index",index);
			productDivImg.text(array[index].name);
			productDivTxt.text(array[index].price);

			productDiv.append(productDivImg);
			productDiv.append(productDivTxt);
			productDiv.appendTo($("productPannel"));
		},this).bind());

		$Element("productPannel").delegate("click","*",$Fn(function(oEvent){
			var elParent = $Element(oEvent.element).parent();
			
			if(elParent.className() == "product") {
				var item = this.arrItems.get(parseInt(elParent.attr("index")));

				if(item.stock <= 0){
					this.log("품절입니다!!");
					return;	
				}
				if(this.oMoney.inserted >= item.price){
					this.oMoney.inserted -= item.price;
					item.stock -= 1;
					this.log(item.name + " 나왔습니다~!!");
					this.update();
				}else{
					this.log("돈이 부족합니다.");
				}
			}
		},this).bind());

		var drag50   = new DragAndDrop($("50wonImg"),$("insertBox"),$Fn(this.insertCoin,this).bind(),true);
		var drag100  = new DragAndDrop($("100wonImg"),$("insertBox"),$Fn(this.insertCoin,this).bind(),true);
		var drag500  = new DragAndDrop($("500wonImg"),$("insertBox"),$Fn(this.insertCoin,this).bind(),true);
		var drag1000 = new DragAndDrop($("1000wonImg"),$("insertBox"),$Fn(this.insertCoin,this).bind(),true);
		this.refund();
	},

	insertCoin : function(oEvent,isSucess){
		this.oMoney.selected = parseInt($Element(oEvent.element).attr("id"));
		
		var pos = oEvent.pos();
		if(pos.pageX > this.oCoinBox.x && pos.pageY > this.oCoinBox.y &&
				pos.pageX < this.oCoinBox.x + this.oCoinBox.width &&
				pos.pageY < this.oCoinBox.y + this.oCoinBox.height) 
			return;
		
		if(this.oMoney.inserted == 0) this.isPaperInserted = false;
		
		if(this.oMoney.current > this.oMoney.selected){
			this.oMoney.current -= this.oMoney.selected;
			if(isSucess){
				if(this.oMoney.selected == 1000 && this.isPaperInserted){
					this.log("지폐는 두장이상 넣을 수 없습니다.");
					this.oMoney.current += this.oMoney.selected;
				}else{
					this.oMoney.selected == 1000 ? this.isPaperInserted = true : this.isPaperInserted;
					this.oMoney.inserted += this.oMoney.selected;
				}
			}else{
				this.log("돈을 흘리셨습니다.");
			}
		}else{
			this.log("가지고 있는 돈이 부족합니다!");
		}
		this.update();
	},

	refund : function(){
		$Fn(function(){
			this.oMoney.current += this.oMoney.inserted;
			this.log(this.oMoney.inserted + " 원이 반환됩니다.");
			this.oMoney.inserted = 0;
			this.update();
		},this).attach($("refundBox"),"click",false);
	},

	log : function(sLogMsg){
		var logger = document.getElementById("consolePannel");
		logger.innerHTML = logger.innerHTML + sLogMsg + "<br/>";
		logger.scrollTop = logger.scrollHeight;
	},

	update : function(){
		$Element($("pocketMoney")).text("내가 가진 돈 : " + parseInt(this.oMoney.current));
		$Element($("insertBox")).text(this.oMoney.inserted + "원");
	}
});
