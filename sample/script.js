var lineObject = null;
var kindSVGDrawing = null;
window.onload = function(){
	var polygon = new Polygon();
	polygon.draw();
	getElem("svg_polygon_add_point").onclick = polygon.addPoint;
	getElem("svg_polygon_get_point").onclick = polygon.getPoints;

	var fixedRatio = new FixedRatio();
	fixedRatio.draw();
	getElem("svg_fixed_ratio_btn").onclick = fixedRatio.alignCenter;

	var peopleCounting = new PeopleCounting();
	peopleCounting.draw();
	getElem("svg_pc_get_point").onclick = peopleCounting.getPoints;

	var lineCross = new LineCross();
	lineCross.draw();
	getElem("svg_line_cross_change_left").onclick = function(){
		lineCross.changeArrow('L');
	};
	getElem("svg_line_cross_change_right").onclick = function(){
		lineCross.changeArrow('R');
	};
	getElem("svg_line_cross_change_left_right").onclick = function(){
		lineCross.changeArrow('LR');
	};

	var uwaPrivacyPolygon = new UWAPrivacyPolygon();
	uwaPrivacyPolygon.init();
	getElem("svg_privacy_polygon_remove_drawing_geometry").onclick = uwaPrivacyPolygon.removeDrawingGeometry;
	getElem("svg_privacy_polygon_stop_drawing").onclick = uwaPrivacyPolygon.stopDrawing;
	getElem("svg_privacy_polygon_start_drawing").onclick = uwaPrivacyPolygon.startDrawing;
	getElem("svg_privacy_polygon_list").onchange = uwaPrivacyPolygon.selectShape;
	getElem("svg_privacy_polygon_add_point").onclick = uwaPrivacyPolygon.addPoint;

	var uwaPrivacyRectangle = new UWAPrivacyRectangle();
	uwaPrivacyRectangle.startDrawing();
	getElem("svg_privacy_rectangle_min").onchange = uwaPrivacyRectangle.changeMinMaxSize;
	getElem("svg_privacy_rectangle_max").onchange = uwaPrivacyRectangle.changeMinMaxSize;
	getElem("svg_privacy_rectangle_change_min").onclick = uwaPrivacyRectangle.changeRectangleToMinSize;
	getElem("svg_privacy_rectangle_change_max").onclick = uwaPrivacyRectangle.changeRectangleToMaxSize;
};

function getElem(id){
	return document.getElementById(id);
}