nhn.SimpleSpinBox = $Class({
	$init : function(el,oOption){
		this._el = $Element($(el));
		this.option({
			nDefaultValue      : 200,
			nIncrementUnit     : 1,
			nDecrementUnit     : 1,
			nInterval          : 0.1,
			nIntervalStartTime : 0.5,
			sUpButtonText      : "up",
			sDownButtonText    : "down"
		});
		this.optionSetter("nInterval",function(){
			if(this._nIntervalId != undefined) clearInterval(this._nIntervalId);
			this._keepProcess();
		});
		this.optionSetter("sUpButtonText",function(){
			this._elUpBtt.text(this.option("sUpButtonText"));
		});
		this.optionSetter("sDownButtonText",function(){
			this._elDownBtt.text(this.option("sDownButtonText"));
		});
		
		this.option(oOption || {});
		
		this._elInput    = $Element('<INPUT>');
		this._elUpBtt    = $Element('<BUTTON>');
		this._elDownBtt  = $Element('<BUTTON>');
		this._elInput.attr("value",this.option("nDefaultValue"));
		this._elUpBtt.text(this.option("sUpButtonText"));
		this._elDownBtt.text(this.option("sDownButtonText"));
		
		this._el.append(this._elInput);
		this._el.append(this._elUpBtt);
		this._el.append(this._elDownBtt);
		
		this._els = { elInput : this._elInput , elUp : this._elUpBtt, elDown : this._elDownBtt};
		
		this._bind();
	},
	
	changeClass : function(sInputClass,sUpBttClass,sDownBttClass){
		if(sInputClass != undefined) this._elInput.className(sInputClass);
		if(sUpBttClass != undefined) this._elUpBtt.className(sUpBttClass);
		if(sDownBttClass != undefined) this._elDownBtt.className(sDownBttClass);
	},
	
	_bind : function(){
		$Fn(this._blur,this).attach(this._elInput,"blur");
		$Fn(this._focus,this).attach(this._elInput,"focus");
		$Fn(this._mouseOver,this).attach(this._elInput,"mouseover");
		$Fn(this._change,this).attach(this._elInput,"change");
		
		$Fn(this._focus,this).attach(this._elUpBtt,"focus");
		$Fn(this._mouseOver,this).attach(this._elUpBtt,"mouseover");
		$Fn(this._mouseDown,this).attach(this._elUpBtt,"mousedown");
		$Fn(this._mouseOut,this).attach(this._elUpBtt,"mouseout");
		$Fn(this._mouseUp,this).attach(this._elUpBtt,"mouseup");
		
		$Fn(this._focus,this).attach(this._elDownBtt,"focus");
		$Fn(this._mouseOver,this).attach(this._elDownBtt,"mouseover");
		$Fn(this._mouseDown,this).attach(this._elDownBtt,"mousedown");
		$Fn(this._mouseOut,this).attach(this._elDownBtt,"mouseout");
		$Fn(this._mouseUp,this).attach(this._elDownBtt,"mouseup");
	},
	
	_mouseDown : function(oEvent){
		if(!oEvent.mouse().left) return;
		
		var elFrom = $Element(oEvent.element);
		elFrom.text() == this._elUpBtt.text() ? this._bIsIncrement = true : this._bIsIncrement = false;
		this._bKeep = true;
		this._oTimer = $Fn(this._keepProcess, this).delay(this.option("nIntervalStartTime"));
		this.fireEvent("mousedown",oEvent);
	},
	
	_mouseUp : function(oEvent){
		if(!oEvent.mouse().left) return;
		
		var elFrom = $Element(oEvent.element);
		elFrom.text() == this._elUpBtt.text() ? this._bIsIncrement = true : this._bIsIncrement = false;
		this._bKeep = false;
		
		this._bIsIncrement ? this._increase() : this._decrease();
		
		if(this._oTimer != undefined) this._oTimer.stopDelay();
		if(this._nIntervalId != undefined) clearInterval(this._nIntervalId);
		this.fireEvent("mouseup",oEvent);
	},
	
	_mouseOut : function(oEvent){
		if(this._oTimer != undefined) this._oTimer.stopDelay();
		if(this._nIntervalId != undefined) clearInterval(this._nIntervalId);
		this.fireEvent("mouseout",oEvent);
	},
	
	_blur : function(oEvent){
		this.fireEvent("blur",oEvent);
	},
	
	_focus : function(oEvent){
		this.fireEvent("focus",oEvent);
	},
	
	_mouseOver : function(oEvent){
		this.fireEvent("mouseover",oEvent);
	},
	
	_change : function(oEvent){
		this.fireEvent("change",oEvent);
	},
	
	_increase : function(){
		this._elInput.attr("value", this._elInput.attr("value") - 0 + this.option("nIncrementUnit"));
		this._els.elFrom = this._elUpBtt;
		this.fireEvent("increase",this._els);
	},
	
	_decrease : function(){
		this._elInput.attr("value", this._elInput.attr("value") - this.option("nDecrementUnit"));
		this._els.elFrom = this._elDownBtt;
		this.fireEvent("decrease",this._els);
	},
	
	_keepProcess : function(){
		if(this._bKeep == true) {
			this.fireEvent("mousekeepdown",this._els);
			var nInverval = this.option("nInterval") - 0;
			this._nIntervalId = 
				this._bIsIncrement ? $Fn(this._increase,this).repeat(nInverval) : $Fn(this._decrease,this).repeat(nInverval);
		}
	}
	
}).extend(jindo.Component);