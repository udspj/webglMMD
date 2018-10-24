
var gl; // WebGL的全局变量

window.onload = function(){
	var canvas = document.getElementById("glcanvas");
	gl = initWebGL(canvas);   
	if (!gl) {
		alert('gl error');
		return;
	}

	gl.clearColor(0.0, 0.0, 0.0, 1.0);  
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
}

function initWebGL(canvas) {
	window.gl = null;
	try {
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	}
	catch(e) {}

	if (!gl) {
		alert("WebGL初始化失败，可能是因为您的浏览器不支持。");
		gl = null;
	}
	return gl;
}