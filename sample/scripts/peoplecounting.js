function PeopleCounting(){
	var svgTag = document.getElementById('svg_pc');
	var svgGeometry = new SVGGeometry(svgTag);
	var lineObject = [];

	var changeArrow = function(){
		var log = document.getElementById("svg_pc_log");
		log.innerHTML += 'Arrow is changed!!<br>';
	};

	var eventObj = {
		mouseup: getPoints
	};

	var draw = function(){
		lineObject.push(svgGeometry.draw({
			lineStrokeWidth: 5,
			circleRadius: 8,
			minLineLength: 120,
			points: [
				[70,242],
				[362,380]
			],
			textInCircle: '1',
			arrow: {
				mode: 'R',
				min: 'L',
				max: 'R'
			},
			useEvent: true,
			event: eventObj
		}));

		lineObject.push(svgGeometry.draw({
			lineStrokeWidth: 5,
			circleRadius: 8,
			minLineLength: 120,
			points: [
				[380, 362],
				[242, 70]
			],
			textInCircle: '2',
			arrow: {
				mode: 'L',
				min: 'L',
				max: 'R'
			},
			useEvent: true,
			event: eventObj
		}));
	};

	function getPoints(){
		var log = document.getElementById("svg_pc_log");
		log.innerHTML = '';	

		for(var j = 0, jLen = lineObject.length; j < jLen; j++){
			log.innerHTML += j + 1  + " : ";
			var lineSelf = lineObject[j].getData();
			for(var i = 0, len = lineSelf.points.length; i < len; i++){
				var self = lineSelf.points[i];
				log.innerHTML += '[' + self[0] + ',' + self[1] + ']';

				if(i < len - 1){
					log.innerHTML += ',';
				}
			}
			log.innerHTML += " Arrow: " + lineSelf.arrow;
			log.innerHTML += "<br>";	
		}
	}

	return {
		draw: draw,
		getPoints: getPoints
	};
}