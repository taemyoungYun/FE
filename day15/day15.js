var day15 = $Class({
	$init : function(){
		this._arrElDrags = $A();
		this._arrElDrops = $A();
		var elBody = $Element(document.body);

		for(var i = 0; i < 9; i++){
			if(Math.random() < Math.random()){
				var elDrag = $Element("<DIV>");
				var elDrop = $Element("<DIV>");

				elDrag.offset(this._getRandomNum(0,600),this._getRandomNum(0,800));
				elDrag.addClass("dragBox");
				elDrag.addClass("draggable");
				elDrag.addClass("rollover");

				elDrop.offset(this._getRandomNum(0,600),this._getRandomNum(0,800));
				elDrop.addClass("dropBox");
				elDrop.addClass("droppable");
				elDrop.text(0);

				this._arrElDrags.push(elDrag);
				this._arrElDrops.push(elDrop);
				elBody.append(elDrag);
				elBody.append(elDrop);
			}
		}


		var oTransition = new jindo.Transition();
		var oDragArea = new jindo.DragArea(document);
		var oDropArea = new jindo.DropArea(document,{ sClassName : "droppable", oDragInstance : oDragArea});
		var oRollOverArea = new jindo.RolloverArea(document,{ sClassName : "rollover", sClassPrefix: "rollover-"});
		var oFoggy = new jindo.Foggy();

		var elTransition;
		/*dragBox effect*/
		oDragArea.attach({
			"dragStart" : function(e){
				var elClone = $Element(e.elHandle.cloneNode(true));
				$Element(document.body).append(elClone);
				e.elDrag = elClone.$value();
				oTransition.abort();
			}
		});

		/*dropBox effect*/
		oDropArea.attach({
			"over" :function(e){
				$Element(e.elDrop).css("backgroundColor","skyBlue");
			},

			"out":function(e){
				$Element(e.elDrop).css("backgroundColor","blue");
			},

			"drop":function(e){
				$Element(e.elDrag).leave();
				$Element(e.elDrop).text(e.elDrop.innerHTML - 0 + 1);
			},

			"dragEnd":function(e){
				if(e.aDrop.length != 0){
					$A(e.aDrop).forEach(function(value,index,array){
						$Element(array[index]).css("backgroundColor","blue");	
					});
				}else{
					elTransition = e.elDrag;
					oTransition.start(1000,e.elDrag,{
						"@top"  : $Element(e.elHandle).offset().top + "px",
						"@left" : $Element(e.elHandle).offset().left + "px"
					});
				}
			}
		});
		
		oTransition.attach({
			"abort" : function(){
				$Element(elTransition).leave();
			},
			"end" : function(){
				$Element(elTransition).leave();
			}
		});

		/* dim effect */
		oFoggy.getFog().onclick = function(){ oFoggy.hide(); };
		$A($Element(document).queryAll(".dropBox")).forEach(function(value,index,array){
			$Fn(function(){oFoggy.show(array[index]);}).attach(array[index],"click");
		});
	},

	_getRandomNum : function(nDownLimit,nUpLimit){
		return Math.floor((Math.random() * (nUpLimit - nDownLimit + 1)) + nDownLimit);
	}
});