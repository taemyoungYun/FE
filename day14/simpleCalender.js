nhn.SimpleCalender = $Class({
	$init : function(oOption) {
		this.option({
			elTitleBox : $Element("<DIV>"),
			elContentBox : $Element("<TABLE>"),
			oDate : new $Date(Date.now()),
			arrDayFormat : ["Sun", "Mon", "Tue", "Wed", "Ths", "Fri", "Sat"]
		});

		this.option(oOption || {});
		this.option("elTitleBox", $Element(this.option("elTitleBox")));
		this.option("elContentBox", $Element(this.option("elContentBox")));

		this._oToday = {
			month : new $Date(Date.now()).month(),
			day : new $Date(Date.now()).date(),
		};
		this._templateDraw();
		
		$Element(this.option("elContentBox")).delegate("mouseover","*",$Fn(this._mouseOver,this).bind());
		$Element(this.option("elContentBox")).delegate("mouseout","*",$Fn(this._mouseOut,this).bind());
		$Element(this.option("elContentBox")).delegate("mouseover","*",$Fn(this._mouseOver,this).bind());
		$Element(this.option("elContentBox")).delegate("mouseover","*",$Fn(this._mouseOver,this).bind());
		
		$Element(this.option("elContentBox")).delegate("click", ".calender-date", $Fn(function(oEvent) {
			alert($Element(oEvent.element).attr("date"));
			this.fireEvent("click", oEvent);
		}, this).bind());
		
		$Element(this.option("elTitleBox")).delegate("mouseover","*",$Fn(this._mouseOver,this).bind());
		$Element(this.option("elTitleBox")).delegate("mouseout","*",$Fn(this._mouseOut,this).bind());
		$Element(this.option("elTitleBox")).delegate("mouseover","*",$Fn(this._mouseOver,this).bind());
		$Element(this.option("elTitleBox")).delegate("mouseover","*",$Fn(this._mouseOver,this).bind());
		$Element(this.option("elTitleBox")).delegate("click","*",$Fn(this._click,this).bind());
	},
	
	_templateDraw : function() {
		this.option("elTitleBox").empty();
		this.option("elContentBox").empty();
		if(this._elTbody != undefined) this._elTbody.empty();
		
		this._elPrevBtn = this.option("elTitleBox").query(".calender-btn-prev");
		this._elTitle = this.option("elTitleBox").query(".calender-title");
		this._elNextBtn = this.option("elTitleBox").query(".calender-btn-next");
		this._elCategory = this.option("elContentBox").query(".calender-category");
		this._weekTmpl = this.option("elContentBox").query(".calender-week") || this._weekTmpl;

		if(this._elPrevBtn == null)
			this._makePrevBtn();
		if(this._elTitle == null)
			this._makeTitle();
		if(this._elNextBtn == null)
			this._makeNextBtn();
		if(this._elCategory == null)
			this._makeCategory();
		if(this._weekTmpl == null)
			this._makeWeekTmpl();
			
		this._draw();
	},
	
	_draw : function() {
		var oDate = $Date(this.option("oDate").time());
		var nThisMonth = oDate.month();

		var arrDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		if(this.option("oDate").isLeapYear())
			arrDaysInMonth[1] = 29;
		oDate.date(1);
		/*�쒕떖��紐뉗＜�몄� 援ы븳*/
		var nTmp = (oDate.day() + arrDaysInMonth[nThisMonth]) / 7;
		var nWeeks = (nTmp != Math.floor(nTmp)) ? Math.floor(nTmp) + 1 : Math.floor(nTmp);
		this._elWeeks = $A();
		
		for(var i = 0; i < nWeeks; i++) {
			var elWeek = this._weekTmpl.$value().cloneNode(true);
			this._elWeeks.push(elWeek);
			this._elTbody.append(elWeek);
		}
		
		this.option("elContentBox").append(this._elTbody);
		
		if(oDate.day() != 0) oDate.date(oDate.date() - oDate.day());
		
		$A(this._elTbody.queryAll(".calender-date")).forEach($Fn(function(value,index,array){
			var el = $Element(array[index]);

			if(oDate.month() == nThisMonth - 1) {
				el.addClass("calender-prev-month-date");
			} else if(oDate.month() == nThisMonth) {
				el.addClass("calender-this-month-date");
			} else if(oDate.month() == nThisMonth + 1) {
				el.addClass("calender-next-month-date");
			}

			if(oDate.month() == this._oToday.month && oDate.date() == this._oToday.day)
				el.addClass("calender-today");
			if(oDate.day() == 0)
				el.addClass("calender-sun");
			if(oDate.day() == 6)
				el.addClass("calender-sat");

			el.attr("date", oDate.year() + "년" + parseInt(oDate.month() + 1) + "월 " + oDate.date() + "일");
			el.text(oDate.date());

			oDate.date(oDate.date() + 1);
		},this).bind());
		
		this._bind();
	},
	_makePrevBtn : function() {
		this._elPrevBtn = $Element("<A>");
		this._elPrevBtn.addClass("calender-btn-prev");
		this._elPrevBtn.text("<");
		this.option("elTitleBox").append(this._elPrevBtn);
	},
	_makeTitle : function() {
		this._elTitle = $Element("<STRONG>");
		this._elTitle.addClass("calender-title");
		this._elTitle.text(this.option("oDate").year() + "/" + parseInt(this.option("oDate").month() + 1));
		this.option("elTitleBox").append(this._elTitle);
	},
	_makeNextBtn : function() {
		this._elNextBtn = $Element("<A>");
		this._elNextBtn.addClass("calender-btn-next");
		this._elNextBtn.text(">");
		this.option("elTitleBox").append(this._elNextBtn);
	},
	_makeCategory : function() {
		this._elCategory = $Element("<TR>");
		this._elCategory.addClass("calender-category");

		for(var i = 0; i < 7; i++) {
			var elTh = $Element("<TH>");
			elTh.text(this.option("arrDayFormat")[i]);
			this._elCategory.append(elTh);
		}

		var elThead = $Element("<THEAD>");
		this.option("elContentBox").append(elThead.append(this._elCategory));
	},
	_makeWeekTmpl : function() {
		this._elTbody = $Element("<TBODY>");
		this._weekTmpl = $Element("<TR>");

		for(var i = 0; i < 7; i++) {
			var elTd = $Element("<TD>");
			elTd.addClass("calender-date");
			this._weekTmpl.append(elTd);
		}
		
		this._weekTmpl.addClass("calender-week");
	},
	_goPrevious : function(oEvent) {
		this.option("oDate").month(this.option("oDate").month() - 1);
		this._templateDraw();
		this.fireEvent("before", oEvent);
	},
	_goNext : function(oEvent) {
		this.option("oDate").month(this.option("oDate").month() + 1);
		this._templateDraw();
		this.fireEvent("next", oEvent);
	},
	_click : function(oEvent) {
		this.fireEvent("click", oEvent);
	},
	_mouseOver : function(oEvent) {
		this.fireEvent("mouseover", oEvent);
	},
	_mouseOut : function(oEvent) {
		this.fireEvent("mouseout", oEvent);
	},
	_bind : function() {
		$Fn(this._goPrevious, this).attach(this._elPrevBtn, "click");
		$Fn(this._goNext, this).attach(this._elNextBtn, "click");
	}
}).extend(jindo.Component);
