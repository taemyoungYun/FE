nhn.MySpinBox = $Class({
	$init : function(el,oOption){
		this.option({nUpLimit : 300, nDownLimit : 100});
		this.option(oOption || {});	
	},
	
	_bind : function(){
		this.$super._bind();
		this.attach("increase", this._check);
		this.attach("decrease", this._check);
		this.attach("blur",this._blurHandler);
	},
	
	_check : function(oCustomEvent){
		if(this._elInput.attr("value") >= this.option("nUpLimit")){
			this._elInput.attr("value",this.option("nUpLimit"));
			this.fireEvent("overlimit",oCustomEvent);
		}if(this._elInput.attr("value") <= this.option("nDownLimit")){
			this._elInput.attr("value",this.option("nDownLimit"));
			this.fireEvent("underlimit",oCustomEvent);
		}else{
			this.fireEvent("valuechange",oCustomEvent);	
		}
	},
	
	_blurHandler : function(oCustomEvent){
		this._elInput.attr("value",this._elInput.attr("value").replace(/\D+/gi,""));
		this._check(oCustomEvent);
	}
}).extend(nhn.SimpleSpinBox);