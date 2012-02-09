/**
 * Jindo Component
 * @version 1.0.2
 * NHN_Library:Jindo_Component-1.0.2;JavaScript Components for Jindo;
 */


jindo.Component=jindo.$Class({_htEventHandler:null,_htOption:null,$init:function(){var aInstance=this.constructor.getInstance();aInstance.push(this);this._htEventHandler={};this._htOption={};this._htOption._htSetter={};},option:function(sName,vValue){switch(typeof sName){case"undefined":return this._htOption;case"string":if(typeof vValue!="undefined"){if(sName=="htCustomEventHandler"){if(typeof this._htOption[sName]=="undefined"){this.attach(vValue);}else{return this;}}
this._htOption[sName]=vValue;if(typeof this._htOption._htSetter[sName]=="function"){this._htOption._htSetter[sName](vValue);}}else{return this._htOption[sName];}
break;case"object":for(var sKey in sName){if(sKey=="htCustomEventHandler"){if(typeof this._htOption[sKey]=="undefined"){this.attach(sName[sKey]);}else{continue;}}
this._htOption[sKey]=sName[sKey];if(typeof this._htOption._htSetter[sKey]=="function"){this._htOption._htSetter[sKey](sName[sKey]);}}
break;}
return this;},optionSetter:function(sName,fSetter){switch(typeof sName){case"undefined":return this._htOption._htSetter;case"string":if(typeof fSetter!="undefined"){this._htOption._htSetter[sName]=jindo.$Fn(fSetter,this).bind();}else{return this._htOption._htSetter[sName];}
break;case"object":for(var sKey in sName){this._htOption._htSetter[sKey]=jindo.$Fn(sName[sKey],this).bind();}
break;}
return this;},fireEvent:function(sEvent,oEvent){oEvent=oEvent||{};var fInlineHandler=this['on'+sEvent],aHandlerList=this._htEventHandler[sEvent]||[],bHasInlineHandler=typeof fInlineHandler=="function",bHasHandlerList=aHandlerList.length>0;if(!bHasInlineHandler&&!bHasHandlerList){return true;}
aHandlerList=aHandlerList.concat();oEvent.sType=sEvent;if(typeof oEvent._aExtend=='undefined'){oEvent._aExtend=[];oEvent.stop=function(){if(oEvent._aExtend.length>0){oEvent._aExtend[oEvent._aExtend.length-1].bCanceled=true;}};}
oEvent._aExtend.push({sType:sEvent,bCanceled:false});var aArg=[oEvent],i,nLen;for(i=2,nLen=arguments.length;i<nLen;i++){aArg.push(arguments[i]);}
if(bHasInlineHandler){fInlineHandler.apply(this,aArg);}
if(bHasHandlerList){var fHandler;for(i=0,fHandler;(fHandler=aHandlerList[i]);i++){fHandler.apply(this,aArg);}}
return!oEvent._aExtend.pop().bCanceled;},attach:function(sEvent,fHandlerToAttach){if(arguments.length==1){jindo.$H(arguments[0]).forEach(jindo.$Fn(function(fHandler,sEvent){this.attach(sEvent,fHandler);},this).bind());return this;}
var aHandler=this._htEventHandler[sEvent];if(typeof aHandler=='undefined'){aHandler=this._htEventHandler[sEvent]=[];}
aHandler.push(fHandlerToAttach);return this;},detach:function(sEvent,fHandlerToDetach){if(arguments.length==1){jindo.$H(arguments[0]).forEach(jindo.$Fn(function(fHandler,sEvent){this.detach(sEvent,fHandler);},this).bind());return this;}
var aHandler=this._htEventHandler[sEvent];if(aHandler){for(var i=0,fHandler;(fHandler=aHandler[i]);i++){if(fHandler===fHandlerToDetach){aHandler=aHandler.splice(i,1);break;}}}
return this;},detachAll:function(sEvent){var aHandler=this._htEventHandler;if(arguments.length){if(typeof aHandler[sEvent]=='undefined'){return this;}
delete aHandler[sEvent];return this;}
for(var o in aHandler){delete aHandler[o];}
return this;}});jindo.Component.factory=function(aObject,htOption){var aReturn=[],oInstance;if(typeof htOption=="undefined"){htOption={};}
for(var i=0,el;(el=aObject[i]);i++){oInstance=new this(el,htOption);aReturn[aReturn.length]=oInstance;}
return aReturn;};jindo.Component.getInstance=function(){if(typeof this._aInstance=="undefined"){this._aInstance=[];}
return this._aInstance;};jindo.UIComponent=jindo.$Class({$init:function(){this._bIsActivating=false;},isActivating:function(){return this._bIsActivating;},activate:function(){if(this.isActivating()){return this;}
this._bIsActivating=true;if(arguments.length>0){this._onActivate.apply(this,arguments);}else{this._onActivate();}
return this;},deactivate:function(){if(!this.isActivating()){return this;}
this._bIsActivating=false;if(arguments.length>0){this._onDeactivate.apply(this,arguments);}else{this._onDeactivate();}
return this;}}).extend(jindo.Component);jindo.Effect=function(fEffect){if(this instanceof arguments.callee){throw new Error("You can't create a instance of this");}
var rxNumber=/^(\-?[0-9\.]+)(%|px|pt|em)?$/,rxRGB=/^rgb\(([0-9]+)\s?,\s?([0-9]+)\s?,\s?([0-9]+)\)$/i,rxHex=/^#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,rx3to6=/^#([0-9A-F])([0-9A-F])([0-9A-F])$/i;var getUnitAndValue=function(v){var nValue=v,sUnit;if(rxNumber.test(v)){nValue=parseFloat(v);sUnit=RegExp.$2||"";}else if(rxRGB.test(v)){nValue=[parseInt(RegExp.$1,10),parseInt(RegExp.$2,10),parseInt(RegExp.$3,10)];sUnit='color';}else if(rxHex.test(v=v.replace(rx3to6,'#$1$1$2$2$3$3'))){nValue=[parseInt(RegExp.$1,16),parseInt(RegExp.$2,16),parseInt(RegExp.$3,16)];sUnit='color';}
return{nValue:nValue,sUnit:sUnit};};return function(nStart,nEnd){var sUnit;if(arguments.length>1){nStart=getUnitAndValue(nStart);nEnd=getUnitAndValue(nEnd);sUnit=nEnd.sUnit;}else{nEnd=getUnitAndValue(nStart);nStart=null;sUnit=nEnd.sUnit;}
if(nStart&&nEnd&&nStart.sUnit!=nEnd.sUnit){throw new Error('unit error');}
nStart=nStart&&nStart.nValue;nEnd=nEnd&&nEnd.nValue;var fReturn=function(p){var nValue=fEffect(p),getResult=function(s,d){return(d-s)*nValue+s+sUnit;};if(sUnit=='color'){var r=Math.max(0,Math.min(255,parseInt(getResult(nStart[0],nEnd[0]),10)))<<16;r|=Math.max(0,Math.min(255,parseInt(getResult(nStart[1],nEnd[1]),10)))<<8;r|=Math.max(0,Math.min(255,parseInt(getResult(nStart[2],nEnd[2]),10)));r=r.toString(16).toUpperCase();for(var i=0;6-r.length;i++){r='0'+r;}
return'#'+r;}
return getResult(nStart,nEnd);};if(nStart===null){fReturn.setStart=function(s){s=getUnitAndValue(s);if(s.sUnit!=sUnit){throw new Error('unit eror');}
nStart=s.nValue;};}
return fReturn;};};jindo.Effect.linear=jindo.Effect(function(s){return s;});jindo.Effect.easeInSine=jindo.Effect(function(s){return(s==1)?1:-Math.cos(s*(Math.PI/2))+1;});jindo.Effect.easeOutSine=jindo.Effect(function(s){return Math.sin(s*(Math.PI/2));});jindo.Effect.easeInOutSine=jindo.Effect(function(s){return(s<0.5)?jindo.Effect.easeInSine(0,1)(2*s)*0.5:jindo.Effect.easeOutSine(0,1)((2*s)-1)*0.5+0.5;});jindo.Effect.easeOutInSine=jindo.Effect(function(s){return(s<0.5)?jindo.Effect.easeOutSine(0,1)(2*s)*0.5:jindo.Effect.easeInSine(0,1)((2*s)-1)*0.5+0.5;});jindo.Effect.easeInQuad=jindo.Effect(function(s){return s*s;});jindo.Effect.easeOutQuad=jindo.Effect(function(s){return-(s*(s-2));});jindo.Effect.easeInOutQuad=jindo.Effect(function(s){return(s<0.5)?jindo.Effect.easeInQuad(0,1)(2*s)*0.5:jindo.Effect.easeOutQuad(0,1)((2*s)-1)*0.5+0.5;});jindo.Effect.easeOutInQuad=jindo.Effect(function(s){return(s<0.5)?jindo.Effect.easeOutQuad(0,1)(2*s)*0.5:jindo.Effect.easeInQuad(0,1)((2*s)-1)*0.5+0.5;});jindo.Effect.easeInCubic=jindo.Effect(function(s){return Math.pow(s,3);});jindo.Effect.easeOutCubic=jindo.Effect(function(s){return Math.pow((s-1),3)+1;});jindo.Effect.easeInOutCubic=jindo.Effect(function(s){return(s<0.5)?jindo.Effect.easeIn(0,1)(2*s)*0.5:jindo.Effect.easeOut(0,1)((2*s)-1)*0.5+0.5;});jindo.Effect.easeOutInCubic=jindo.Effect(function(s){return(s<0.5)?jindo.Effect.easeOut(0,1)(2*s)*0.5:jindo.Effect.easeIn(0,1)((2*s)-1)*0.5+0.5;});jindo.Effect.easeInQuart=jindo.Effect(function(s){return Math.pow(s,4);});jindo.Effect.easeOutQuart=jindo.Effect(function(s){return-(Math.pow(s-1,4)-1);});jindo.Effect.easeInOutQuart=jindo.Effect(function(s){return(s<0.5)?jindo.Effect.easeInQuart(0,1)(2*s)*0.5:jindo.Effect.easeOutQuart(0,1)((2*s)-1)*0.5+0.5;});jindo.Effect.easeOutInQuart=jindo.Effect(function(s){return(s<0.5)?jindo.Effect.easeOutQuart(0,1)(2*s)*0.5:jindo.Effect.easeInQuart(0,1)((2*s)-1)*0.5+0.5;});jindo.Effect.easeInQuint=jindo.Effect(function(s){return Math.pow(s,5);});jindo.Effect.easeOutQuint=jindo.Effect(function(s){return Math.pow(s-1,5)+1;});jindo.Effect.easeInOutQuint=jindo.Effect(function(s){return(s<0.5)?jindo.Effect.easeInQuint(0,1)(2*s)*0.5:jindo.Effect.easeOutQuint(0,1)((2*s)-1)*0.5+0.5;});jindo.Effect.easeOutInQuint=jindo.Effect(function(s){return(s<0.5)?jindo.Effect.easeOutQuint(0,1)(2*s)*0.5:jindo.Effect.easeInQuint(0,1)((2*s)-1)*0.5+0.5;});jindo.Effect.easeInCircle=jindo.Effect(function(s){return-(Math.sqrt(1-(s*s))-1);});jindo.Effect.easeOutCircle=jindo.Effect(function(s){return Math.sqrt(1-(s-1)*(s-1));});jindo.Effect.easeInOutCircle=jindo.Effect(function(s){return(s<0.5)?jindo.Effect.easeInCircle(0,1)(2*s)*0.5:jindo.Effect.easeOutCircle(0,1)((2*s)-1)*0.5+0.5;});jindo.Effect.easeOutInCircle=jindo.Effect(function(s){return(s<0.5)?jindo.Effect.easeOutCircle(0,1)(2*s)*0.5:jindo.Effect.easeInCircle(0,1)((2*s)-1)*0.5+0.5;});jindo.Effect.easeInBack=jindo.Effect(function(s){var n=1.70158;return(s==1)?1:(s/1)*(s/1)*((1+n)*s-n);});jindo.Effect.easeOutBack=jindo.Effect(function(s){var n=1.70158;return(s===0)?0:(s=s/1-1)*s*((n+1)*s+n)+1;});jindo.Effect.easeInOutBack=jindo.Effect(function(s){return(s<0.5)?jindo.Effect.easeInBack(0,1)(2*s)*0.5:jindo.Effect.easeOutBack(0,1)((2*s)-1)*0.5+0.5;});jindo.Effect.easeInElastic=jindo.Effect(function(s){var p=0,a=0,n;if(s===0){return 0;}
if((s/=1)==1){return 1;}
if(!p){p=0.3;}
if(!a||a<1){a=1;n=p/4;}else{n=p/(2*Math.PI)*Math.asin(1/a);}
return-(a*Math.pow(2,10*(s-=1))*Math.sin((s-1)*(2*Math.PI)/p));});jindo.Effect.easeOutElastic=jindo.Effect(function(s){var p=0,a=0,n;if(s===0){return 0;}
if((s/=1)==1){return 1;}
if(!p){p=0.3;}
if(!a||a<1){a=1;n=p/4;}else{n=p/(2*Math.PI)*Math.asin(1/a);}
return(a*Math.pow(2,-10*s)*Math.sin((s-n)*(2*Math.PI)/p)+1);});jindo.Effect.easeInOutElastic=jindo.Effect(function(s){var p=0,a=0,n;if(s===0){return 0;}
if((s/=1/2)==2){return 1;}
if(!p){p=(0.3*1.5);}
if(!a||a<1){a=1;n=p/4;}else{n=p/(2*Math.PI)*Math.asin(1/a);}
if(s<1){return-0.5*(a*Math.pow(2,10*(s-=1))*Math.sin((s-n)*(2*Math.PI)/p));}
return a*Math.pow(2,-10*(s-=1))*Math.sin((s-n)*(2*Math.PI)/p)*0.5+1;});jindo.Effect.easeOutBounce=jindo.Effect(function(s){if(s<(1/2.75)){return(7.5625*s*s);}else if(s<(2/2.75)){return(7.5625*(s-=(1.5/2.75))*s+0.75);}else if(s<(2.5/2.75)){return(7.5625*(s-=(2.25/2.75))*s+0.9375);}else{return(7.5625*(s-=(2.625/2.75))*s+0.984375);}});jindo.Effect.easeInBounce=jindo.Effect(function(s){return 1-jindo.Effect.easeOutBounce(0,1)(1-s);});jindo.Effect.easeInOutBounce=jindo.Effect(function(s){return(s<0.5)?jindo.Effect.easeInBounce(0,1)(2*s)*0.5:jindo.Effect.easeOutBounce(0,1)((2*s)-1)*0.5+0.5;});jindo.Effect.easeInExpo=jindo.Effect(function(s){return(s===0)?0:Math.pow(2,10*(s-1));});jindo.Effect.easeOutExpo=jindo.Effect(function(s){return(s==1)?1:-Math.pow(2,-10*s/1)+1;});jindo.Effect.easeInOutExpo=jindo.Effect(function(s){return(s<0.5)?jindo.Effect.easeInExpo(0,1)(2*s)*0.5:jindo.Effect.easeOutExpo(0,1)((2*s)-1)*0.5+0.5;});jindo.Effect.easeOutInExpo=jindo.Effect(function(s){return(s<0.5)?jindo.Effect.easeOutExpo(0,1)(2*s)*0.5:jindo.Effect.easeInExpo(0,1)((2*s)-1)*0.5+0.5;});jindo.Effect._cubicBezier=function(x1,y1,x2,y2){return function(t){var cx=3.0*x1,bx=3.0*(x2-x1)-cx,ax=1.0-cx-bx,cy=3.0*y1,by=3.0*(y2-y1)-cy,ay=1.0-cy-by;function sampleCurveX(t){return((ax*t+bx)*t+cx)*t;}
function sampleCurveY(t){return((ay*t+by)*t+cy)*t;}
function sampleCurveDerivativeX(t){return(3.0*ax*t+2.0*bx)*t+cx;}
function solveCurveX(x,epsilon){var t0,t1,t2,x2,d2,i;for(t2=x,i=0;i<8;i++){x2=sampleCurveX(t2)-x;if(Math.abs(x2)<epsilon){return t2;}
d2=sampleCurveDerivativeX(t2);if(Math.abs(d2)<1e-6){break;}
t2=t2-x2/d2;}
t0=0.0;t1=1.0;t2=x;if(t2<t0){return t0;}
if(t2>t1){return t1;}
while(t0<t1){x2=sampleCurveX(t2);if(Math.abs(x2-x)<epsilon){return t2;}
if(x>x2){t0=t2;}else{t1=t2;}
t2=(t1-t0)*0.5+t0;}
return t2;}
return sampleCurveY(solveCurveX(t,1/200));};};jindo.Effect.cubicBezier=function(x1,y1,x2,y2){return jindo.Effect(jindo.Effect._cubicBezier(x1,y1,x2,y2));};jindo.Effect.cubicEase=jindo.Effect.cubicBezier(0.25,0.1,0.25,1);jindo.Effect.cubicEaseIn=jindo.Effect.cubicBezier(0.42,0,1,1);jindo.Effect.cubicEaseOut=jindo.Effect.cubicBezier(0,0,0.58,1);jindo.Effect.cubicEaseInOut=jindo.Effect.cubicBezier(0.42,0,0.58,1);jindo.Effect.cubicEaseOutIn=jindo.Effect.cubicBezier(0,0.42,1,0.58);jindo.Effect.overphase=jindo.Effect(function(s){s/=0.652785;return(Math.sqrt((2-s)*s)+(0.1*s)).toFixed(5);});jindo.Effect.sinusoidal=jindo.Effect(function(s){return(-Math.cos(s*Math.PI)/2)+0.5;});jindo.Effect.mirror=jindo.Effect(function(s){return(s<0.5)?jindo.Effect.sinusoidal(0,1)(s*2):jindo.Effect.sinusoidal(0,1)(1-(s-0.5)*2);});jindo.Effect.pulse=function(nPulse){return jindo.Effect(function(s){return(-Math.cos((s*(nPulse-0.5)*2)*Math.PI)/2)+0.5;});};jindo.Effect.wave=function(nPeriod,nHeight){return jindo.Effect(function(s){return(nHeight||1)*(Math.sin(nPeriod*(s*360)*Math.PI/180)).toFixed(5);});};jindo.Effect.easeIn=jindo.Effect.easeInCubic;jindo.Effect.easeOut=jindo.Effect.easeOutCubic;jindo.Effect.easeInOut=jindo.Effect.easeInOutCubic;jindo.Effect.easeOutIn=jindo.Effect.easeOutInCubic;jindo.Effect.bounce=jindo.Effect.easeOutBounce;jindo.Effect.elastic=jindo.Effect.easeInElastic;jindo.Transition=jindo.$Class({_nFPS:30,_aTaskQueue:null,_oTimer:null,_bIsWaiting:true,_bIsPlaying:false,$init:function(htOption){this._aTaskQueue=[];this._oTimer=new jindo.Timer();this._oSleepTimer=new jindo.Timer();this.option({fEffect:jindo.Effect.linear,bCorrection:false});this.option(htOption||{});},fps:function(nFPS){if(arguments.length>0){this._nFPS=nFPS;return this;}
return this._nFPS;},isPlaying:function(){return this._bIsPlaying;},abort:function(){this._aTaskQueue=[];this._oTimer.abort();this._oSleepTimer.abort();if(this._bIsPlaying){this.fireEvent("abort");}
this._bIsWaiting=true;this._bIsPlaying=false;this._htTaskToDo=null;return this;},start:function(nDuration,elTarget,htInfo){if(arguments.length>0){this.queue.apply(this,arguments);}
this._prepareNextTask();return this;},queue:function(nDuration,aCommand){var htTask;if(typeof arguments[0]=='function'){htTask={sType:"function",fTask:arguments[0]};}else{var a=[];if(arguments[1]instanceof Array){a=arguments[1];}else{var aInner=[];jindo.$A(arguments).forEach(function(v,i){if(i>0){aInner.push(v);if(i%2===0){a.push(aInner.concat());aInner=[];}}});}
htTask={sType:"task",nDuration:nDuration,aList:[]};for(var i=0,nLen=a.length;i<nLen;i++){var aValue=[],htArg=a[i][1],sEnd;for(var sKey in htArg){sEnd=htArg[sKey];if(/^(@|style\.)(\w+)/i.test(sKey)){aValue.push(["style",RegExp.$2,sEnd]);}else{aValue.push(["attr",sKey,sEnd]);}}
htTask.aList.push({elTarget:a[i][0],aValue:aValue});}}
this._queueTask(htTask);return this;},pause:function(){if(this._oTimer.abort()){this.fireEvent("pause");}
return this;},resume:function(){if(this._htTaskToDo){if(this._bIsWaiting===false&&this._bIsPlaying===true){this.fireEvent("resume");}
this._doTask();this._bIsWaiting=false;this._bIsPlaying=true;var self=this;this._oTimer.start(function(){var bEnd=!self._doTask();if(bEnd){self._bIsWaiting=true;setTimeout(function(){self._prepareNextTask();},0);}
return!bEnd;},this._htTaskToDo.nInterval);}
return this;},precede:function(nDuration,elTarget,htInfo){this.start.apply(this,arguments);return this;},sleep:function(nDuration,fCallback){if(typeof fCallback=="undefined"){fCallback=function(){};}
this._queueTask({sType:"sleep",nDuration:nDuration,fCallback:fCallback});this._prepareNextTask();return this;},_queueTask:function(v){this._aTaskQueue.push(v);},_dequeueTask:function(){var htTask=this._aTaskQueue.shift();if(htTask){if(htTask.sType=="task"){var aList=htTask.aList;for(var i=0,nLength=aList.length;i<nLength;i++){var elTarget=aList[i].elTarget,welTarget=jindo.$Element(elTarget);for(var j=0,aValue=aList[i].aValue,nJLen=aValue.length;j<nJLen;j++){var sType=aValue[j][0],sKey=aValue[j][1],fFunc=aValue[j][2];if(typeof fFunc!="function"){var fEffect=this.option("fEffect");if(fFunc instanceof Array){fFunc=fEffect(fFunc[0],fFunc[1]);}else{fFunc=fEffect(fFunc);}
aValue[j][2]=fFunc;}
if(fFunc.setStart){if(this._isHTMLElement(elTarget)){switch(sType){case"style":fFunc.setStart(welTarget.css(sKey));break;case"attr":fFunc.setStart(welTarget.$value()[sKey]);break;}}else{fFunc.setStart(elTarget.getter(sKey));}}}}}
return htTask;}else{return null;}},_prepareNextTask:function(){if(this._bIsWaiting){var htTask=this._dequeueTask();if(htTask){switch(htTask.sType){case"task":if(!this._bIsPlaying){this.fireEvent("start");}
var nInterval=1000/this._nFPS,nGap=nInterval/htTask.nDuration;this._htTaskToDo={aList:htTask.aList,nRatio:0,nInterval:nInterval,nGap:nGap,nStep:0,nTotalStep:Math.ceil(htTask.nDuration/nInterval)};this.resume();break;case"function":if(!this._bIsPlaying){this.fireEvent("start");}
htTask.fTask();this._prepareNextTask();break;case"sleep":if(this._bIsPlaying){this.fireEvent("sleep",{nDuration:htTask.nDuration});htTask.fCallback();}
var self=this;this._oSleepTimer.start(function(){self.fireEvent("awake");self._prepareNextTask();},htTask.nDuration);break;}}else{if(this._bIsPlaying){this._bIsPlaying=false;this.abort();this.fireEvent("end");}}}},_isHTMLElement:function(el){return("tagName"in el);},_doTask:function(){var htTaskToDo=this._htTaskToDo,nRatio=parseFloat(htTaskToDo.nRatio.toFixed(5),1),nStep=htTaskToDo.nStep,nTotalStep=htTaskToDo.nTotalStep,aList=htTaskToDo.aList,htCorrection={},bCorrection=this.option("bCorrection");for(var i=0,nLength=aList.length;i<nLength;i++){var elTarget=aList[i].elTarget,welTarget=jindo.$Element(elTarget);for(var j=0,aValue=aList[i].aValue,nJLen=aValue.length;j<nJLen;j++){var sType=aValue[j][0],sKey=aValue[j][1],sValue=aValue[j][2](nRatio);if(this._isHTMLElement(elTarget)){if(bCorrection){var sUnit=/^\-?[0-9\.]+(%|px|pt|em)?$/.test(sValue)&&RegExp.$1||"";if(sUnit){var nValue=parseFloat(sValue);nValue+=htCorrection[sKey]||0;nValue=parseFloat(nValue.toFixed(5));if(i==nLength-1){sValue=Math.round(nValue)+sUnit;}else{htCorrection[sKey]=nValue-Math.floor(nValue);sValue=parseInt(nValue,10)+sUnit;}}}
switch(sType){case"style":welTarget.css(sKey,sValue);break;case"attr":welTarget.$value()[sKey]=sValue;break;}}else{elTarget.setter(sKey,sValue);}
if(this._bIsPlaying){this.fireEvent("playing",{element:elTarget,sKey:sKey,sValue:sValue,nStep:nStep,nTotalStep:nTotalStep});}}}
htTaskToDo.nRatio=Math.min(htTaskToDo.nRatio+htTaskToDo.nGap,1);htTaskToDo.nStep+=1;return nRatio!=1;}}).extend(jindo.Component);(function(){var b=jindo.$Element.prototype.css;jindo.$Element.prototype.css=function(k,v){if(k=="opacity"){return typeof v!="undefined"?this.opacity(parseFloat(v)):this.opacity();}else{return v!="undefined"?b.call(this,k,v):b.call(this,k);}};})();jindo.Timer=jindo.$Class({$init:function(){this._nTimer=null;this._nLatest=null;this._nRemained=0;this._nDelay=null;this._fRun=null;this._bIsRunning=false;},start:function(fRun,nDelay){this.abort();this._nRemained=0;this._nDelay=nDelay;this._fRun=fRun;this._bIsRunning=true;this._nLatest=this._getTime();this.fireEvent('wait');this._excute(this._nDelay,false);return true;},isRunning:function(){return this._bIsRunning;},_getTime:function(){return new Date().getTime();},_clearTimer:function(){var bFlag=false;if(this._nTimer){clearInterval(this._nTimer);this._bIsRunning=false;bFlag=true;}
this._nTimer=null;return bFlag;},abort:function(){var bReturn=this._clearTimer();if(bReturn){this.fireEvent('abort');this._fRun=null;}
return bReturn;},pause:function(){var nPassed=this._getTime()-this._nLatest;this._nRemained=Math.max(this._nDelay-nPassed,0);return this._clearTimer();},_excute:function(nDelay,bResetDelay){var self=this;this._clearTimer();this._bIsRunning=true;this._nTimer=setInterval(function(){if(self._nTimer){self.fireEvent('run');var r=self._fRun();self._nLatest=self._getTime();if(!r){clearInterval(self._nTimer);self._nTimer=null;self._bIsRunning=false;self.fireEvent('end');return;}
self.fireEvent('wait');if(bResetDelay){self._excute(self._nDelay,false);}}},nDelay);},resume:function(){if(!this._fRun||this.isRunning()){return false;}
this._bIsRunning=true;this.fireEvent('wait');this._excute(this._nRemained,true);this._nRemained=0;return true;}}).extend(jindo.Component);jindo.DragArea=jindo.$Class({$init:function(el,htOption){this.option({sClassName:'draggable',bFlowOut:true,bSetCapture:true,nThreshold:0});this.option(htOption||{});this._el=el;this._bIE=jindo.$Agent().navigator().ie;this._htDragInfo={"bIsDragging":false,"bPrepared":false,"bHandleDown":false,"bForceDrag":false};this._wfOnMouseDown=jindo.$Fn(this._onMouseDown,this);this._wfOnMouseMove=jindo.$Fn(this._onMouseMove,this);this._wfOnMouseUp=jindo.$Fn(this._onMouseUp,this);this._wfOnDragStart=jindo.$Fn(this._onDragStart,this);this._wfOnSelectStart=jindo.$Fn(this._onSelectStart,this);this.activate();},_findDraggableElement:function(el){if(jindo.$$.test(el,"input[type=text], textarea, select")){return null;}
var self=this;var sClass='.'+this.option('sClassName');var isChildOfDragArea=function(el){if(el===null){return false;}
if(self._el===document||self._el===el){return true;}
return jindo.$Element(self._el).isParentOf(el);};var elReturn=jindo.$$.test(el,sClass)?el:jindo.$$.getSingle('! '+sClass,el);if(!isChildOfDragArea(elReturn)){elReturn=null;}
return elReturn;},isDragging:function(){var htDragInfo=this._htDragInfo;return htDragInfo.bIsDragging&&!htDragInfo.bPrepared;},stopDragging:function(){this._stopDragging(true);return this;},_stopDragging:function(bInterupted){this._wfOnMouseMove.detach(document,'mousemove');this._wfOnMouseUp.detach(document,'mouseup');if(this.isDragging()){var htDragInfo=this._htDragInfo,welDrag=jindo.$Element(htDragInfo.elDrag);htDragInfo.bIsDragging=false;htDragInfo.bForceDrag=false;htDragInfo.bPrepared=false;if(this._bIE&&this._elSetCapture){this._elSetCapture.releaseCapture();this._elSetCapture=null;}
this.fireEvent('dragEnd',{"elArea":this._el,"elHandle":htDragInfo.elHandle,"elDrag":htDragInfo.elDrag,"nX":parseInt(welDrag.css("left"),10)||0,"nY":parseInt(welDrag.css("top"),10)||0,"bInterupted":bInterupted});}},_onActivate:function(){this._wfOnMouseDown.attach(this._el,'mousedown');this._wfOnDragStart.attach(this._el,'dragstart');this._wfOnSelectStart.attach(this._el,'selectstart');},_onDeactivate:function(){this._wfOnMouseDown.detach(this._el,'mousedown');this._wfOnDragStart.detach(this._el,'dragstart');this._wfOnSelectStart.detach(this._el,'selectstart');},attachEvent:function(){this.activate();},detachEvent:function(){this.deactivate();},isEventAttached:function(){return this.isActivating();},startDragging:function(el){var elDrag=this._findDraggableElement(el);if(elDrag){this._htDragInfo.bForceDrag=true;this._htDragInfo.bPrepared=true;this._htDragInfo.elHandle=elDrag;this._htDragInfo.elDrag=elDrag;this._wfOnMouseMove.attach(document,'mousemove');this._wfOnMouseUp.attach(document,'mouseup');return true;}
return false;},_onMouseDown:function(we){if(!we.mouse().left||we.mouse().right){this._stopDragging(true);return;}
var el=this._findDraggableElement(we.element);if(el){var oPos=we.pos(),htDragInfo=this._htDragInfo;htDragInfo.bHandleDown=true;htDragInfo.bPrepared=true;htDragInfo.nButton=we._event.button;htDragInfo.elHandle=el;htDragInfo.elDrag=el;htDragInfo.nPageX=oPos.pageX;htDragInfo.nPageY=oPos.pageY;if(this.fireEvent('handleDown',{elHandle:el,elDrag:el,weEvent:we})){this._wfOnMouseMove.attach(document,'mousemove');}
this._wfOnMouseUp.attach(document,'mouseup');we.stop(jindo.$Event.CANCEL_DEFAULT);}},_onMouseMove:function(we){var htDragInfo=this._htDragInfo,htParam,htRect,oPos=we.pos(),htGap={"nX":oPos.pageX-htDragInfo.nPageX,"nY":oPos.pageY-htDragInfo.nPageY};if(htDragInfo.bPrepared){var nThreshold=this.option('nThreshold'),htDiff={};if(!htDragInfo.bForceDrag&&nThreshold){htDiff.nPageX=oPos.pageX-htDragInfo.nPageX;htDiff.nPageY=oPos.pageY-htDragInfo.nPageY;var nDistance=Math.sqrt(htDiff.nPageX*htDiff.nPageX+htDiff.nPageY*htDiff.nPageY);if(nThreshold>nDistance){return;}}
if(this._bIE&&this.option("bSetCapture")){this._elSetCapture=(this._el===document)?document.body:this._findDraggableElement(we.element);if(this._elSetCapture){this._elSetCapture.setCapture(false);}}
htParam={elArea:this._el,elHandle:htDragInfo.elHandle,elDrag:htDragInfo.elDrag,htDiff:htDiff,weEvent:we};htDragInfo.bIsDragging=true;htDragInfo.bPrepared=false;if(this.fireEvent('dragStart',htParam)){var welDrag=jindo.$Element(htParam.elDrag),htOffset=welDrag.offset();htDragInfo.elHandle=htParam.elHandle;htDragInfo.elDrag=htParam.elDrag;htDragInfo.nX=parseInt(welDrag.css('left'),10)||0;htDragInfo.nY=parseInt(welDrag.css('top'),10)||0;htDragInfo.nClientX=htOffset.left+welDrag.width()/2;htDragInfo.nClientY=htOffset.top+welDrag.height()/2;}else{htDragInfo.bPrepared=true;return;}}
if(htDragInfo.bForceDrag){htGap.nX=oPos.clientX-htDragInfo.nClientX;htGap.nY=oPos.clientY-htDragInfo.nClientY;}
htParam={"elArea":this._el,"elFlowOut":htDragInfo.elDrag.parentNode,"elHandle":htDragInfo.elHandle,"elDrag":htDragInfo.elDrag,"weEvent":we,"nX":htDragInfo.nX+htGap.nX,"nY":htDragInfo.nY+htGap.nY,"nGapX":htGap.nX,"nGapY":htGap.nY};if(this.fireEvent('beforeDrag',htParam)){var elDrag=htDragInfo.elDrag;if(this.option('bFlowOut')===false){var elParent=htParam.elFlowOut,aSize=[elDrag.offsetWidth,elDrag.offsetHeight],nScrollLeft=0,nScrollTop=0;if(elParent==document.body){elParent=null;}
if(elParent&&aSize[0]<=elParent.scrollWidth&&aSize[1]<=elParent.scrollHeight){htRect={nWidth:elParent.clientWidth,nHeight:elParent.clientHeight};nScrollLeft=elParent.scrollLeft;nScrollTop=elParent.scrollTop;}else{var htClientSize=jindo.$Document().clientSize();htRect={nWidth:htClientSize.width,nHeight:htClientSize.height};}
if(htParam.nX!==null){htParam.nX=Math.max(htParam.nX,nScrollLeft);htParam.nX=Math.min(htParam.nX,htRect.nWidth-aSize[0]+nScrollLeft);}
if(htParam.nY!==null){htParam.nY=Math.max(htParam.nY,nScrollTop);htParam.nY=Math.min(htParam.nY,htRect.nHeight-aSize[1]+nScrollTop);}}
if(htParam.nX!==null){elDrag.style.left=htParam.nX+'px';}
if(htParam.nY!==null){elDrag.style.top=htParam.nY+'px';}
this.fireEvent('drag',htParam);}else{htDragInfo.bIsDragging=false;}},_onMouseUp:function(we){this._stopDragging(false);var htDragInfo=this._htDragInfo;htDragInfo.bHandleDown=false;this.fireEvent("handleUp",{weEvent:we,elHandle:htDragInfo.elHandle,elDrag:htDragInfo.elDrag});},_onDragStart:function(we){if(this._findDraggableElement(we.element)){we.stop(jindo.$Event.CANCEL_DEFAULT);}},_onSelectStart:function(we){if(this.isDragging()||this._findDraggableElement(we.element)){we.stop(jindo.$Event.CANCEL_DEFAULT);}}}).extend(jindo.UIComponent);jindo.RolloverArea=jindo.$Class({$init:function(el,htOption){this.option({sClassName:"rollover",sClassPrefix:"rollover-",bCheckMouseDown:true,bActivateOnload:true,htStatus:{sOver:"over",sDown:"down"}});this.option(htOption||{});this._elArea=jindo.$(el);this._aOveredElements=[];this._aDownedElements=[];this._wfMouseOver=jindo.$Fn(this._onMouseOver,this);this._wfMouseOut=jindo.$Fn(this._onMouseOut,this);this._wfMouseDown=jindo.$Fn(this._onMouseDown,this);this._wfMouseUp=jindo.$Fn(this._onMouseUp,this);if(this.option("bActivateOnload")){this.activate();}},_addOvered:function(el){this._aOveredElements.push(el);},_removeOvered:function(el){this._aOveredElements.splice(jindo.$A(this._aOveredElements).indexOf(el),1);},_addStatus:function(el,sStatus){jindo.$Element(el).addClass(this.option('sClassPrefix')+sStatus);},_removeStatus:function(el,sStatus){jindo.$Element(el).removeClass(this.option('sClassPrefix')+sStatus);},_isInnerElement:function(elParent,elChild){return elParent===elChild?true:jindo.$Element(elParent).isParentOf(elChild);},_onActivate:function(){jindo.$Element.prototype.preventTapHighlight&&jindo.$Element(this._elArea).preventTapHighlight(true);this._wfMouseOver.attach(this._elArea,'mouseover');this._wfMouseOut.attach(this._elArea,'mouseout');if(this.option("bCheckMouseDown")){this._wfMouseDown.attach(this._elArea,'mousedown');this._wfMouseUp.attach(document,'mouseup');}},_onDeactivate:function(){jindo.$Element.prototype.preventTapHighlight&&jindo.$Element(this._elArea).preventTapHighlight(false);this._wfMouseOver.detach(this._elArea,'mouseover');this._wfMouseOut.detach(this._elArea,'mouseout');this._wfMouseDown.detach(this._elArea,'mousedown');this._wfMouseUp.detach(document,'mouseup');this._aOveredElements.length=0;this._aDownedElements.length=0;},_findRollover:function(el){var sClassName=this.option('sClassName');return jindo.$$.test(el,'.'+sClassName)?el:jindo.$$.getSingle('! .'+sClassName,el);},_onMouseOver:function(we){var el=we.element,elRelated=we.relatedElement,htParam;for(;(el=this._findRollover(el));el=el.parentNode){if(elRelated&&this._isInnerElement(el,elRelated)){continue;}
this._addOvered(el);htParam={element:el,htStatus:this.option("htStatus"),weEvent:we};if(this.fireEvent('over',htParam)){this._addStatus(htParam.element,htParam.htStatus.sOver);}}},_onMouseOut:function(we){var el=we.element,elRelated=we.relatedElement,htParam;for(;(el=this._findRollover(el));el=el.parentNode){if(elRelated&&this._isInnerElement(el,elRelated)){continue;}
this._removeOvered(el);htParam={element:el,htStatus:this.option("htStatus"),weEvent:we};if(this.fireEvent('out',htParam)){this._removeStatus(htParam.element,htParam.htStatus.sOver);}}},_onMouseDown:function(we){var el=we.element,htParam;while((el=this._findRollover(el))){htParam={element:el,htStatus:this.option("htStatus"),weEvent:we};this._aDownedElements.push(el);if(this.fireEvent('down',htParam)){this._addStatus(htParam.element,htParam.htStatus.sDown);}
el=el.parentNode;}},_onMouseUp:function(we){var el=we.element,aTargetElementDatas=[],aDownedElements=this._aDownedElements,htParam,elMouseDown,i;for(i=0;(elMouseDown=aDownedElements[i]);i++){aTargetElementDatas.push({element:elMouseDown,htStatus:this.option("htStatus"),weEvent:we});}
for(;(el=this._findRollover(el));el=el.parentNode){if(jindo.$A(aDownedElements).indexOf(el)>-1){continue;}
aTargetElementDatas.push({element:el,htStatus:this.option("htStatus"),weEvent:we});}
for(i=0;(htParam=aTargetElementDatas[i]);i++){if(this.fireEvent('up',htParam)){this._removeStatus(htParam.element,htParam.htStatus.sDown);}}
this._aDownedElements=[];}}).extend(jindo.UIComponent);jindo.Foggy=jindo.$Class({_elFog:null,_bFogAppended:false,_oExcept:null,_bFogVisible:false,_bFogShowing:false,_oTransition:null,$init:function(htOption){this.option({sClassName:"fog",nShowDuration:200,nShowOpacity:0.5,nHideDuration:200,nHideOpacity:0,fShowEffect:jindo.Effect.linear,fHideEffect:jindo.Effect.linear,nFPS:15,nZIndex:32000});this.option(htOption||{});this._elFog=jindo.$('<div class="'+this.option("sClassName")+'">');this._welFog=jindo.$Element(this._elFog);document.body.insertBefore(this._elFog,document.body.firstChild);this._welFog.opacity(this.option('nHideOpacity'));this._welFog.hide();this._oExcept={};this._oTransition=new jindo.Transition().fps(this.option("nFPS"));this._fOnResize=jindo.$Fn(this._fitFogToDocument,this);this._fOnScroll=jindo.$Fn(this._fitFogToDocumentScrollSize,this);},_getScroll:function(wDocument){return{top:window.pageYOffset||document[wDocument._docKey].scrollTop,left:window.pageXOffset||document[wDocument._docKey].scrollLeft};},_fitFogToDocument:function(){var wDocument=jindo.$Document();this._elFog.style.left=this._getScroll(wDocument).left+'px';this._elFog.style.width="100%";var self=this;clearTimeout(this._nTimer);this._nTimer=null;this._nTimer=setTimeout(function(){var oSize=wDocument.clientSize();self._elFog.style.top=self._getScroll(wDocument).top+'px';self._elFog.style.height=oSize.height+'px';self._elFog.style.left=self._getScroll(wDocument).left+'px';},100);},_fitFogToDocumentScrollSize:function(){var oSize=jindo.$Document().scrollSize();this._elFog.style.left="0";this._elFog.style.top="0";this._elFog.style.width=oSize.width+'px';this._elFog.style.height=oSize.height+'px';},getFog:function(){return this._elFog;},isShown:function(){return this._bFogVisible;},isShowing:function(){return this._bFogShowing;},show:function(elExcept){if(!this._bFogVisible){if(this.fireEvent('beforeShow')){if(elExcept){this._oExcept.element=elExcept;var sPosition=jindo.$Element(elExcept).css('position');if(sPosition=='static'){elExcept.style.position='relative';}
this._oExcept.position=elExcept.style.position;this._oExcept.zIndex=elExcept.style.zIndex;elExcept.style.zIndex=this.option('nZIndex')+1;}
this._elFog.style.zIndex=this.option('nZIndex');this._elFog.style.display='none';this._fitFogToDocument();this._fOnResize.attach(window,"resize");this._fOnScroll.attach(window,"scroll");this._elFog.style.display='block';var self=this;this._bFogShowing=true;this._oTransition.abort().start(this.option('nShowDuration'),this._elFog,{'@opacity':this.option("fShowEffect")(this.option('nShowOpacity'))}).start(function(){self._bFogVisible=true;self._bFogShowing=false;self.fireEvent('show');});}}},hide:function(){if(this._bFogVisible||this._bFogShowing){if(this.fireEvent('beforeHide')){var self=this;this._oTransition.abort().start(this.option('nHideDuration'),this._elFog,{'@opacity':this.option("fHideEffect")(this.option('nHideOpacity'))}).start(function(){self._elFog.style.display='none';var elExcept=self._oExcept.element;if(elExcept){elExcept.style.position=self._oExcept.position;elExcept.style.zIndex=self._oExcept.zIndex;}
self._oExcept={};self._fOnResize.detach(window,"resize");self._fOnScroll.detach(window,"scroll");self._bFogVisible=false;self.fireEvent('hide');});}}}}).extend(jindo.Component);jindo.DropArea=jindo.$Class({$init:function(el,htOption){this._el=jindo.$(el);this._wel=jindo.$Element(this._el);this.option({sClassName:'droppable',oDragInstance:null});this.option(htOption||{});this._waOveredDroppableElement=jindo.$A([]);this._elHandle=null;this._elDragging=null;this._wfMouseMove=jindo.$Fn(this._onMouseMove,this);this._wfMouseOver=jindo.$Fn(this._onMouseOver,this);this._wfMouseOut=jindo.$Fn(this._onMouseOut,this);var oDrag=this.option('oDragInstance');if(oDrag){var self=this;oDrag.attach({handleDown:function(oCustomEvent){self._elHandle=oCustomEvent.elHandle;self._waOveredDroppableElement.empty();},dragStart:function(oCustomEvent){self._reCalculate();self.fireEvent(oCustomEvent.sType,oCustomEvent);self._wfMouseMove.attach(document,'mousemove');},drag:function(oCustomEvent){self._elDragging=oCustomEvent.elDrag;},dragEnd:function(oCustomEvent){var o={};for(var sKey in oCustomEvent){o[sKey]=oCustomEvent[sKey];}
o.aDrop=self.getOveredLists().concat();self._clearOveredDroppableElement(oCustomEvent.weEvent,oCustomEvent.bInterupted);self.fireEvent(oCustomEvent.sType,o);self._wfMouseMove.detach(document,'mousemove');},handleUp:function(oCustomEvent){self._elDragging=null;self._elHandle=null;}});}},_addOveredDroppableElement:function(elDroppable){if(this._waOveredDroppableElement.indexOf(elDroppable)==-1){this._waOveredDroppableElement.push(elDroppable);this.fireEvent('over',{elHandle:this._elHandle,elDrag:this._elDragging,elDrop:elDroppable});}},_fireMoveEvent:function(elDroppable,oRect,oPos,we){var nRatioX=(oPos.pageX-oRect.nLeft)/(oRect.nRight-oRect.nLeft);var nRatioY=(oPos.pageY-oRect.nTop)/(oRect.nBottom-oRect.nTop);this.fireEvent('move',{weEvent:we,elHandle:this._elHandle,elDrag:this._elDragging,elDrop:elDroppable,nRatioX:nRatioX,nRatioY:nRatioY});},_removeOveredDroppableElement:function(elDroppable){var nIndex=this._waOveredDroppableElement.indexOf(elDroppable);if(nIndex!=-1){this._waOveredDroppableElement.splice(nIndex,1);this.fireEvent('out',{elHandle:this._elHandle,elDrag:this._elDragging,elDrop:elDroppable});}},_clearOveredDroppableElement:function(weEvent,bInterupted){if(bInterupted){this._waOveredDroppableElement.empty();return;}
for(var elDroppable;(elDroppable=this._waOveredDroppableElement.$value()[0]);){this._waOveredDroppableElement.splice(0,1);this.fireEvent('drop',{weEvent:weEvent,elHandle:this._elHandle,elDrag:this._elDragging,elDrop:elDroppable});}},getOveredLists:function(){return this._waOveredDroppableElement?this._waOveredDroppableElement.$value():[];},_isChildOfDropArea:function(el){if(this._el===document||this._el===el){return true;}
return this._wel.isParentOf(el);},_findDroppableElement:function(el){if(!el)return null;var sClass='.'+this.option('sClassName');var elDroppable=jindo.$$.test(el,sClass)?el:jindo.$$.getSingle('! '+sClass,el);if(!this._isChildOfDropArea(el)){elDroppable=null;}
return elDroppable;},_isDragging:function(){var oDrag=this.option('oDragInstance');return(oDrag&&oDrag.isDragging());},_onMouseMove:function(we){if(this._isDragging()){var oPos=we.pos();if(we.element==this._elDragging||jindo.$Element(this._elDragging).isParentOf(we.element)){var aItem=this._aItem;var aItemRect=this._aItemRect;for(var i=0,htRect,el;((htRect=aItemRect[i])&&(el=aItem[i]));i++){if(htRect.nLeft<=oPos.pageX&&oPos.pageX<=htRect.nRight&&htRect.nTop<=oPos.pageY&&oPos.pageY<=htRect.nBottom){this._addOveredDroppableElement(el);this._fireMoveEvent(el,htRect,oPos,we);}else{this._removeOveredDroppableElement(el);}}}else{var elDroppable=this._findDroppableElement(we.element);if(this.elPrevMove&&this.elPrevMove!=elDroppable){this._removeOveredDroppableElement(this.elPrevMove);this.elPrevMove=null;}
if(elDroppable==we.element||(!elDroppable&&document.elementFromPoint)){elDroppable=this._findDroppableElement(document.elementFromPoint(oPos.pageX,oPos.pageY));}
if(!elDroppable){return;}
this.elPrevMove=elDroppable;this._addOveredDroppableElement(elDroppable);var htOffset=jindo.$Element(elDroppable).offset();var htArea={"nLeft":htOffset.left,"nTop":htOffset.top,"nRight":htOffset.left+elDroppable.offsetWidth,"nBottom":htOffset.top+elDroppable.offsetHeight};if(htArea.nLeft<=oPos.pageX&&oPos.pageX<=htArea.nRight&&htArea.nTop<=oPos.pageY&&oPos.pageY<=htArea.nBottom){this._fireMoveEvent(elDroppable,htArea,oPos,we);}}}},_onMouseOver:function(we){if(this._isDragging()){var elDroppable=this._findDroppableElement(we.element);if(elDroppable){this._addOveredDroppableElement(elDroppable);}}},_onMouseOut:function(we){if(this._isDragging()){var elDroppable=this._findDroppableElement(we.element);if(elDroppable&&we.relatedElement&&!jindo.$Element(we.relatedElement).isChildOf(we.element)){this._removeOveredDroppableElement(elDroppable);}}},_getRectInfo:function(el){var htOffset=jindo.$Element(el).offset();return{nLeft:htOffset.left,nTop:htOffset.top,nRight:htOffset.left+el.offsetWidth,nBottom:htOffset.top+el.offsetHeight};},_reCalculate:function(){var aItem=jindo.$$('.'+this.option('sClassName'),this._el);if(this._el.tagName&&jindo.$$.test(this._el,'.'+this.option('sClassName'))){aItem.push(this._el);}
this._aItem=aItem;this._aItemRect=[];for(var i=0,el;(el=aItem[i]);i++){this._aItemRect.push(this._getRectInfo(el));}}}).extend(jindo.Component);