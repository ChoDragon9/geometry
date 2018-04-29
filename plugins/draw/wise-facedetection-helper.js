/**
 * Wise Face Detection 헬퍼
 */
function WiseFaceDetectionHelper(draw) {
  var wiseFaceDetectionCircle = null;
  var wiseFaceDetection = draw.options.wiseFaceDetection;

  function changeFillColor(fillColor){
    wiseFaceDetectionCircle.style.color = fillColor;
  }

  function add() {
    wiseFaceDetectionCircle = document.createElement("span");
    wiseFaceDetectionCircle.className = "tui tui-wn5-smile";
    wiseFaceDetectionCircle.style.position = "absolute";
    changeFillColor(wiseFaceDetection.fillColor);
  }

  function append() {
    try{
      document.getElementById("sketchbook").appendChild(wiseFaceDetectionCircle);
    }catch(e){

    }
  }

  function remove() {
    try{
      document.getElementById("sketchbook").removeChild(wiseFaceDetectionCircle);
    }catch(e){

    }
  }

  function updateCircle(xAxis, yAxis, height) {
    var radius = height / 100;

    if ("heightRatio" in wiseFaceDetection) {
      radius *= wiseFaceDetection.heightRatio;
    } else if ("widthRatio" in wiseFaceDetection) {
      radius *= wiseFaceDetection.widthRatio;
    }

    wiseFaceDetectionCircle.style.top = (yAxis - radius) + "px";
    wiseFaceDetectionCircle.style.left = (xAxis - radius) + "px";
    wiseFaceDetectionCircle.style.fontSize = (radius * 2) + "px";
  }

  if (wiseFaceDetection !== false) {
    wiseFaceDetection.fillColor = typeof wiseFaceDetection.fillColor === "undefined" ? '#dd2200' : wiseFaceDetection.fillColor;
    wiseFaceDetection.heightRatio = typeof wiseFaceDetection.heightRatio === "undefined" ? 2.2 : wiseFaceDetection.heightRatio;
    wiseFaceDetection.widthRatio = typeof wiseFaceDetection.widthRatio === "undefined" ? false : wiseFaceDetection.widthRatio;

    this.updateCircle = updateCircle
    this.append = append
    this.add = add
    this.remove = remove
    this.changeFillColor = changeFillColor
  }
}