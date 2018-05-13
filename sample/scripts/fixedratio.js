const SVGGeometry = require('../../src/modules/svg_geometry')

module.exports = function FixedRatio(){
	var svgTag = document.getElementById('svg_fixed_ratio');
	var svgGeometry = new SVGGeometry(svgTag);
	var kindSVGObj = [];

	var draw = function(){
		//Bule
		kindSVGObj.push(svgGeometry.draw({
			fillColor: '#7fa9e3',
			lineColor: '#7fa9e3',
			pointColor: '#7fa9e3',
			lineStrokeWidth: 4,
			circleRadius: 8,
			useCursor: true,
			fill: true,
			points: [
				[10, 10],
				[10, 100],
				[130, 100],
				[130, 10]
			],
			fixedRatio: true,
			useEvent: true
		}));

		//Red
		kindSVGObj.push(svgGeometry.draw({
			fillColor: '#e38d7f',
			lineColor: '#e38d7f',
			pointColor: '#e38d7f',
			lineStrokeWidth: 4,
			circleRadius: 8,
			useCursor: true,
			fill: true,
			points: [
				[200, 10],
				[200, 210],
				[400, 210],
				[400, 10]
			],
			fixedRatio: true,
			useEvent: true
		}));

		//Green
		kindSVGObj.push(svgGeometry.draw({
			fillColor: '#7fe3a8',
			lineColor: '#7fe3a8',
			pointColor: '#7fe3a8',
			lineStrokeWidth: 4,
			circleRadius: 8,
			useCursor: true,
			fill: true,
			points: [
				[100, 250],
				[100, 430],
				[460, 430],
				[460, 250]
			],
			fixedRatio: true,
			useEvent: true
		}));
	};

	function alignCenter(){
		for(var i = 0, ii = kindSVGObj.length; i < ii; i++){
			kindSVGObj[i].alignCenter();
		}
	}

	return {
		draw: draw,
		alignCenter: alignCenter
	};
}