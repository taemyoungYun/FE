var DragAndDrop = $Class({
	
	$init : function(dragElement,dropElement, fCallback, isCloneMode){
		this._elDrag = $Element(dragElement);
		this._elOrigin =  $Element(dragElement);
		this._elDrop = $Element(dropElement);
		this._fCallback = fCallback;
		this._isCloneMode = isCloneMode;
		
		$Fn(this._onMouseDownHandler,this).bind();
		$Fn(this._onMouseMoveHandler,this).bind();
		$Fn(this._onMouseUpHandler,this).bind();
		$Fn(this._onMouseDownHandler,this).attach(this._elDrag,"mousedown",true);
	},
	
	_onMouseDownHandler : function(oEvent){
		var pos = oEvent.pos();
		var offset = this._elOrigin.offset()
		
		this._oMousePos = { x : pos.pageX, y : pos.pageY};
		this._oOriginalPos = { x : offset.left, y : offset.top};
		this._oMovedPos = { x : this._oMousePos.x - this._oOriginalPos.x, y : this._oMousePos.y - this._oOriginalPos.y};

		if(this._isCloneMode){
			this._elDrag = $Element($Element(oEvent.element).outerHTML());
			this._elDrag.appendTo(document.body);
		}
		this._bIsDown = true;
		this._fMoveHandler = $Fn(this._onMouseMoveHandler,this).attach(document,"mousemove",true);
		this._fUpHandler = $Fn(this._onMouseUpHandler,this).attach(document,"mouseup",true);
		oEvent.stop($Event.CANCEL_ALL);
	},
	
	_onMouseMoveHandler : function(oEvent){
		var pos = oEvent.pos();
		this._elDrag.offset(pos.clientY - this._oMovedPos.y, pos.clientX - this._oMovedPos.x);
		oEvent.stop($Event.CANCEL_ALL);
	},
	
	_onMouseUpHandler : function(oEvent){
		if(!this._bIsDown) return;
		var _bSucess = false;
		var pos = oEvent.pos();
		this._oMousePos = { x : pos.clientX, y : pos.clientY};
		
		if(this._oMousePos.x > this._elDrop.offset().left &&
		   this._oMousePos.y > this._elDrop.offset().top  &&
		   this._oMousePos.x < this._elDrop.offset().left + this._elDrop.width() &&
		   this._oMousePos.y < this._elDrop.offset().top + this._elDrop.height()) {
		   		_bSucess = true;
		   }
		if(typeof this._fCallback == "function" ) this._fCallback(oEvent,_bSucess);
		
		this._elDrag.leave();
		oEvent.stop($Event.CANCEL_ALL);
		this._fMoveHandler.detach($Element(document),"mousemove");
		this._fUpHandler.detach($Element(document),"mouseup");
		this._bIsDown = false;
	}
});
