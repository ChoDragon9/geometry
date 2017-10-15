function Line(){
	var svgTag = document.getElementById('svg_line');
	var svgGeometry = new SVGGeometry(svgTag);
	var lineObject = [];

	var draw = function(){
		lineObject.push(svgGeometry.draw({
			lineColor: '#ff6633',
			pointColor: '#ff6633',
			lineStrokeWidth: 4,
			circleRadius: 6,
			minPoint: 2,
			maxPoint: 8,
			points: [
				[70,242],
				[362,380]
			],
			useEvent: true
		}));

		lineObject.push(svgGeometry.draw({
			lineColor: '#ff6633',
			pointColor: '#ff6633',
			lineStrokeWidth: 4,
			circleRadius: 6,
			minPoint: 2,
			maxPoint: 8,
			points: [
				[70,270],
				[380,270]
			],
			useEvent: true
		}));

		svgGeometry.customEditor({
			lineColor: '#ff6633',
			pointColor: '#ff6633',
			lineStrokeWidth: 4,
			circleRadius: 6,
			minPoint: 2,
			maxPoint: 8,
			useEvent: true
		});
	};

	return {
		draw: draw
	}
}