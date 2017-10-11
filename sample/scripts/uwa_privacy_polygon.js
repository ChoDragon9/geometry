function UWAPrivacyPolygon(){
	var svgTag = document.getElementById('svg_privacy_polygon');
	var selectTag = document.getElementById("svg_privacy_polygon_list");
	var svgGeometry = new SVGGeometry(svgTag);
	var svgDrawingObj = [];

	var customObj = null;

	var options = {
		lineStrokeWidth: 5,
		circleRadius: 8,
		useEvent: true,
		maxPoint: 8,
		fill: true,
		fillOpacity: 0,
		event: {
			end: function(obj){
				addSvgDrawingObj(obj);
				updatelog();
			},
			mouseup: updatelog
		}
	};

	function addSvgDrawingObj(obj){
		svgDrawingObj.push(obj);
		selectTag.innerHTML = '';
		for(var i = 0, len = svgDrawingObj.length; i < len; i++){
			selectTag.innerHTML += "<option>" + i + "</option>";
		}
	}

	function selectShape(){
		for(var i = 0, len = svgDrawingObj.length; i < len; i++){
			var method = parseInt(selectTag.value) === i ? "active" : "normal";
			svgDrawingObj[i][method]();
		}	
	}

	function addPoint(){
		var selectedObjIndex = parseInt(selectTag.value);
		svgDrawingObj[selectedObjIndex].addPoint();
	}

	function startDrawing(){
		if(customObj === null){
			customObj = svgGeometry.customEditor(options);	
		}
	}

	function init(){
		startDrawing();

		options.points = [
			[219, 59],[80, 109],[96, 238],[190, 189]
		];

		addSvgDrawingObj(svgGeometry.draw(options));

		options.points = [
			[363, 81],[302, 133],[348, 217],[466, 160]
		];

		addSvgDrawingObj(svgGeometry.draw(options));
	}

	function stopDrawing(){
		if(customObj !== null){
			customObj.destroy();
			customObj = null;
		}
	}

	function updatelog(){
		var svgPrivacyLog = document.getElementById("svg_privacy_polygon_log");
		var logStr = '';

		for(var i = 0, len = svgDrawingObj.length; i < len; i++){
			var data = svgDrawingObj[i].getData().points;
			logStr += "index : " + i + " data: ";

			for(var j = 0, jLen = data.length; j < jLen; j++){
				logStr += "[" + data[j][0] + ", " + data[j][1] + "],";
			}

			logStr += "<br>";
		}

		svgPrivacyLog.innerHTML = logStr;
	}

	function removeDrawingGeometry(){
		if(customObj !== null){
			customObj.removeDrawingGeometry();
		}
	}

	return {
		selectShape: selectShape,
		init: init,
		startDrawing: startDrawing,
		stopDrawing: stopDrawing,
		addPoint: addPoint,
		removeDrawingGeometry: removeDrawingGeometry
	}
}