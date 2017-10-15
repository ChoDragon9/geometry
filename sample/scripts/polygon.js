function Polygon(){
	var svgTag = document.getElementById('svg_polygon');
	var svgGeometry = new SVGGeometry(svgTag);
	var polygonObject = null;

	var draw = function(){
		polygonObject = svgGeometry.draw({
			fillColor: '#ff9832',
			lineColor: '#ff9832',
			pointColor: '#ff9832',
			lineStrokeWidth: 5,
			circleRadius: 8,
			fill: true,
			points: [
				[48,214],[182,206],[215,116],[159,29],[76,50],[25,139]
			],
			minPoint: 2,
			maxPoint: 8,
			useEvent: true,
			useCursor: true,
			event: {
				mouseup: getPoints,
				polygoncontextmenu: function(){
					alert("polygoncontextmenu");
				}
			}
		});
		
		polygonObject2 = svgGeometry.draw({
			fillColor: '#ff9832',
			lineColor: '#ff9832',
			pointColor: '#ff9832',
			lineStrokeWidth: 5,
			circleRadius: 8,
			fill: true,
			useEvent: true,
			points: [
				[303,469],[437,461],[475,374],[423,248],[291,270],[224,388],[219,472]
			],
			minPoint: 2,
			maxPoint: 8,
			event: {
				mouseup: getPoints,
				polygoncontextmenu: function(event){
					event.preventDefault();
					alert("polygoncontextmenu");
				}
			}
		});
	};

	var addPoint = function(){
		polygonObject.addPoint();
		polygonObject2.addPoint();
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