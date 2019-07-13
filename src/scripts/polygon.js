const SVGGeometry = require('../src/modules/svg_geometry')

module.exports = function Polygon(){
	var svgTag = document.getElementById('svg_polygon');
	var svgGeometry = new SVGGeometry(svgTag);
	var polygonObject = null;

	var draw = function(){
		polygonObject = svgGeometry.draw({
			fillColor: '#ff6633',
			lineColor: '#ff6633',
			pointColor: '#ff6633',
			lineStrokeWidth: 5,
			circleRadius: 6,
			fill: true,
			points: [
				[156.5,370],
				[239.5,304],
				[321.5,366],
				[286.5,271],
				[370.5,220],
				[271.5,221],
				[238.5,125],
				[210.5,222],
				[114.5,225],
				[197.5,272]
			],
			minPoint: 2,
			maxPoint: 10,
			useEvent: true,
			useCursor: true,
			event: {
				mouseup: getPoints,
				polygoncontextmenu: function(){
					alert("polygoncontextmenu");
				}
			}
		});
	};

	var addPoint = function(){
		polygonObject.addPoint();
	};

	function getPoints(){
		var data = polygonObject.getData();
		var log = document.getElementById("svg_polygon_log");
		log.innerHTML = '';

		for(var i = 0, len = data.points.length; i < len; i++){
			var self = data.points[i];
			log.innerHTML += '[' + self[0] + ',' + self[1] + ']';

			if(i < len - 1){
				log.innerHTML += ',';
			}
		}
	}

	return {
		draw: draw,
		addPoint: addPoint,
		getPoints: getPoints
	};
}