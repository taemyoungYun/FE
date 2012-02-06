var SpinBox = $Class({
	_bKeep          : null,
	_bIsIncrement   : null,
	_nIntervalId    : null,
	_oTimer         : null,
	elDiv           : null,
	elInput         : null,
	elUpBtt         : null,
	elDownBtt       : null,
	fCallback       : null,
	nUpLimit        : null,
	nDownLimit      : null,
	nSpeed          : null,
	isKeepGoingMode : null,
	
	$init : function(elTarget,nUpLimit,nDownLimit,nDefalutValue,nSpeed,fCallback,isKeepGoingMode){
		this.elDiv           = $Element(elTarget);
		this.nUpLimit        = nUpLimit;
		this.nDownLimit      = nDownLimit;
		this.nSpeed          = nSpeed;
		this.isKeepGoingMode = isKeepGoingMode;
		this.setCallBack(fCallback);
		
		this.elInput    = $Element('<INPUT>');
		this.elUpBtt    = $Element('<BUTTON>');
		this.elDownBtt  = $Element('<BUTTON>');
		this.elInput.attr("value",nDefalutValue);
		this.elUpBtt.text("up");
		this.elDownBtt.text("down");
		
		$Fn(this._onChangeHandler,this).attach(this.elInput,"change");
		$Fn(this._onBlurHandler,this).attach(this.elInput,"blur");
		$Fn(this._onMouseDownHandler,this).attach(this.elUpBtt,"mousedown");
		$Fn(this._onMouseUpHandler,this).attach(this.elUpBtt,"mouseup");
		$Fn(this._onMouseOutHandler,this).attach(this.elUpBtt,"mouseout");
		$Fn(this._onMouseDownHandler,this).attach(this.elDownBtt,"mousedown");
		$Fn(this._onMouseUpHandler,this).attach(this.elDownBtt,"mouseup");
		$Fn(this._onMouseOutHandler,this).attach(this.elDownBtt,"mouseout");
		
		$Element(this.elDiv).append(this.elInput);
		$Element(this.elDiv).append(this.elUpBtt);
		$Element(this.elDiv).append(this.elDownBtt);
	},
	
	toggleMode : function() {
		this.isKeepGoingMode = !this.isKeepGoingMode;
	}, 
	
	setCallBack : function(fCallback) {
		fCallback != undefined && typeof fCallback == "function" ? this.fCallback = fCallback : this.fCallback = function(){};
	},

	check : function(){	
		var nFlag;
		if(this.elInput.attr("value") <= this.nDownLimit){
			nFlag = -1;
		}else if(this.elInput.attr("value") >= this.nUpLimit){
			nFlag = -2;
		}else {
			nFlag = 1;
		};
		return nFlag;
	},
	
	increase : function(){
		var tmp = this.elInput.attr("value");
		if(this.check() == 1 || this.check() == -1) {
			this.elInput.attr("value", ++tmp);
			if(this.isKeepGoingMode) this.elInput.fireEvent("change");
		}
	},
	
	decrease : function(){
		var tmp = this.elInput.attr("value");
		if(this.check() == 1 || this.check() == -2){
			this.elInput.attr("value", --tmp);
			if(this.isKeepGoingMode) this.elInput.fireEvent("change");
		}
	},
	
	keepProcess : function(){
		if(this._bKeep == true)
			this._nIntervalId = this._bIsIncrement ? $Fn(this.increase,this).repeat(this.nSpeed) : $Fn(this.decrease,this).repeat(this.nSpeed);
	},
	
	_onMouseDownHandler : function(e){
		var elFrom = $Element($Event(window.event || e).element);
		var text = elFrom.text();
		
		elFrom.text() == "up" ? this._bIsIncrement = true : this._bIsIncrement = false;
		this._bKeep = true;
		
		this._oTimer = $Fn(this.keepProcess, this).delay(0.5);	
	},
	
	_onMouseUpHandler : function(e){
		var elFrom = $Element($Event(window.event || e).element);
		elFrom.text() == "up" ? this._bIsIncrement = true : this._bIsIncrement = false;
		this._bKeep = false;
		
		this._bIsIncrement ? this.increase() : this.decrease();
		
		if(this._oTimer != undefined) this._oTimer.stopDelay();
		if(this._nIntervalId != undefined) clearInterval(this._nIntervalId);
	},
	
	_onMouseOutHandler : function(){
		if(this._oTimer != undefined) this._oTimer.stopDelay();
		if(this._nIntervalId != undefined) clearInterval(this._nIntervalId);
	},
		
	_onChangeHandler : function(){
		if(this.check() != 1) {
			this.check() == -1 ? this.elInput.attr("value",this.nDownLimit) : this.elInput.attr("value",this.nUpLimit);
		} 
		this.fCallback();
		
	},
	
	_onBlurHandler : function(){
		this.elInput.attr("value",this.elInput.attr("value").replace(/\D+/gi,"")); 
		if(this.check() != 1) {
			this.check() == -1 ? this.elInput.attr("value",this.nDownLimit) : this.elInput.attr("value",this.nUpLimit);
		} 
	}
  }
);
