function ajaxRequest() {
	var oAjax = new $Ajax("data_XML_for_XHR.xml", {
		type : "xhr", 
		method : "get",
		onload : function(res){
			var elList = $Element('list1');
			var elData = cssquery.getSingle('data', res.xml());
			elList.empty();
			elList.html(elData.firstChild.nodeValue);  
		}
	}).request();
}

function ajaxRequestToJSON() {
	var oAjax = new $Ajax("data_JSON_for_XHR.txt", {
		type : "xhr", 
		method : "get",
		onload : function(res){
			var elList = $Element("list2");
			var jsonData = res.json();
			elList.empty();
			for(var i = 0; i < jsonData.length; i++){  
				elList.append($("<li>" + jsonData[i] + "</li>"));
			}
		}
	}).request();
}

function ajaxRequestToPlainText() {
	var oAjax = new $Ajax("data_PlainText_for_XHR.txt", {
		type : "xhr", 
		method : "get",
		onload : function(res){
			var elList = $Element("list3");
			elList.empty();
			elList.html(res.text());
		}
	}).request();
} 

function ajaxRequestJSONByJSON(){
	var oAjax = new $Ajax("data_JSON_for_JSONP.txt", {
		type : "jsonp",
		jsonp_charset: 'utf-8',
		method : "get",
		onload : function(res){
			var elList = $Element("list4");
			var jsonData = eval(res.json());
			
			elList.empty();
			for(var i = 0; i < jsonData.length; i++){
				if(jsonData[i]!=="\n")
					elList.append($("<li>" + jsonData[i] + "</li>"));
			}
		},
		callbackid : "16085",
		callbackname : "jsonCallback"
	}).request();
}
function ajaxRequestJSONByPlainText(){
	var oAjax = new $Ajax("data_PlainText_for_JSONP.txt", {
		type : "jsonp", 
		jsonp_charset: 'utf-8',
		method : "get",
		onload : function(res){
			var elList = $Element("list5");
			elList.empty();
			elList.html(res.json());
		},
		callbackid : "16086",
		callbackname : "plainCallback"
	});
	oAjax.request();
}