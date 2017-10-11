function LineCross(){
	var svgTag = document.getElementById('svg_line_cross');
	var svgGeometry = new SVGGeometry(svgTag);
	var lineCrossObject = [];

	var draw = function(){
		lineCrossObject.push(svgGeometry.draw({
			lineStrokeWidth: 5,
			circleRadius: 8,
			minPoint: 2,
			maxPoint: 8,
			points: [
				[70,242],
				[362,380]
			],
			textInCircle: '1',
			arrow: {
				mode: 'LR',
				min: 'L',
				max: 'LR'
			},
			useEvent: true
		}));

		lineCrossObject.push(svgGeometry.draw({
			lineStrokeWidth: 5,
			circleRadius: 8,
			points: [
				[70,270],
				[380,270]
			],
			minPoint: 2,
			maxPoint: 8,
			textInCircle: '2',
			arrow: {
				mode: 'LR',
				min: 'L',
				max: 'LR',
				text: true
			},
			useEvent: true
		}));
	};

	function changeArrow(arrow){
		console.log(arrow);
		lineCrossObject[1].changeArrow(arrow);
	}

	return {
		draw: draw,
		changeArrow: changeArrow
	}
}