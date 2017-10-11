function UWAPrivacyRectangle(){
	var svgTag = document.getElementById('svg_privacy_rectangle');
	var svgGeometry = new SVGGeometry(svgTag);
	var svgDrawingObj = [];
	var minSize = {
		width: 50,
		height: 50
	};
	var maxSize = {
		width: 250,
		height: 250
	};

	var startDrawing = function(){
		var options = {
			lineStrokeWidth: 5,
			circleRadius: 8,
			useEvent: false,
			useResizeRectangle: true,
			fill: true,
			fillOpacity: 0,
			fixedRatio: true,
			minSize: minSize,
			maxSize: maxSize,
			ratio: [1, 1],
			event: {
				mouseup: updatelog
			}
		};

		options.event.end = function(obj){
			svgDrawingObj.push(obj);
			updatelog();
		};

		options.wiseFaceDetection = {
			strokeWidth: 2,
			strokeColor: '#dd5500',
			fillOpacity: 0,
			heightRatio: 2.2
		};

		svgGeometry.customEditor(options);

		options.points = [
			 [0, 0],
			 [0, 100],
			 [100, 100],
			 [100, 0]
		];

		svgDrawingObj.push(svgGeometry.draw(options));
	};

	var updatelog = function(){
		var svgPrivacyLog = document.getElementById("svg_privacy_rectangle_log");
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
	};

	function changeMinMaxSize(){
		var minElem = document.getElementById("svg_privacy_rectangle_min");
		var maxElem = document.getElementById("svg_privacy_rectangle_max");

		minSize.width = minSize.height = parseInt(minElem.value);
		maxSize.width = maxSize.height = parseInt(maxElem.value);

		for(var i = 0, len = svgDrawingObj.length; i < len; i++){
			var self = svgDrawingObj[i];
			self.changeMinSizeOption(minSize);
			self.changeMaxSizeOption(maxSize);
		}
	}

	function changeRectangleToMinSize(){
		for(var i = 0, len = svgDrawingObj.length; i < len; i++){
			var self = svgDrawingObj[i];
			self.changeRectangleToSize(minSize.width, minSize.height);
		}	
	}

	function changeRectangleToMaxSize(){
		for(var i = 0, len = svgDrawingObj.length; i < len; i++){
			var self = svgDrawingObj[i];
			self.changeRectangleToSize(maxSize.width, maxSize.height);
		}	
	}

	return {
		startDrawing: startDrawing,
		changeMinMaxSize: changeMinMaxSize,
		changeRectangleToMinSize: changeRectangleToMinSize,
		changeRectangleToMaxSize: changeRectangleToMaxSize
	};
}