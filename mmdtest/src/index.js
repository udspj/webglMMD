var MMDParser = require('mmd-parser');

window.onload = function(){

var parser = new MMDParser.Parser();

var position = [];
var normal = [];
var uv = [];

  function load (url, responseType, mimeType, onLoad, onProgress, onError) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.addEventListener('load', function (event) {
      var response = event.target.response;
      if (this.status === 200) {
        onLoad(response);
      } else if (this.status === 0) {
        console.warn('HTTP Status 0 received.');
        onLoad(response);
      } else {
        console.warn('HTTP Status ' + this.status + ' received.');
        onError(event);
      }
    }, false);
    if (onProgress !== undefined) request.addEventListener('progress', onProgress, false);
    if (onError !== undefined) request.addEventListener('error', onError, false);
    request.responseType = responseType;
    if (mimeType !== undefined) request.overrideMimeType(mimeType)
    request.send(null);
    console.log('downloading: ' + url);
  }

  function testPmd () {
    console.log('PMD parse test');
    load(
      'http://localhost:8081/natumiku.pmx',
      'arraybuffer',
      undefined,
      function (buffer) {
        var pmd = parser.parsePmx(buffer);
        console.log(pmd);

        const vertices=pmd["vertices"];
        const verticesCount = vertices.length
        for (var i = verticesCount - 1; i >= 0; i--) {
          position.push(vertices[i]["position"][0]);
          position.push(vertices[i]["position"][1]);
          position.push(vertices[i]["position"][2]);
          normal.push(vertices[i]["normal"][0]);
          normal.push(vertices[i]["normal"][1]);
          normal.push(vertices[i]["normal"][2]);
          uv.push(vertices[i]["uv"][0]);
          uv.push(vertices[i]["uv"][1]);
        }
        console.log(position);
        console.log(normal);
        console.log(uv);


        var gl; // WebGL的全局变量

var canvas = document.getElementById("glcanvas");
gl = initWebGL(canvas);   
if (!gl) {
  alert('gl error');
}

if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
  alert('shaders error');
}

var u_ModelMatrix = gl.getUniformLocation(gl.program,"u_ModelMatrix");
var modelMatrix = new Matrix4();

var u_ViewMatrix = gl.getUniformLocation(gl.program,"u_ViewMatrix");
var viewMatrix = new Matrix4();
// viewMatrix.setLookAt(0.20, 0.25, 0.25, 0,0,0, 0,1,0);
viewMatrix.setLookAt(0,0,5,0,0,0,0,1,0);
gl.uniformMatrix4fv(u_ViewMatrix,false,viewMatrix.elements);

var u_ProjMatrix = gl.getUniformLocation(gl.program,"u_ProjMatrix");
var projMatrix = new Matrix4();
// modelMatrix.setOrtho(-5,5,-5,5,-5,5);
projMatrix.setPerspective(30, 1, 1, 100);
gl.uniformMatrix4fv(u_ProjMatrix,false,projMatrix.elements);

gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);


var viewMatrix = new Matrix4();
var u_ViewMatrix = gl.getUniformLocation(gl.program,"u_ViewMatrix");
var g_texUnit0 = false;



var n = initVertexBuffers(gl);

initTextures(gl, n);



      }
    );
  }

  testPmd();


























// function changeVertices() {
//   var scale = 0.7*window.innerHeight*2/window.innerWidth/0.5
//   if(window.innerWidth < window.innerHeight) {
//     scale = 0.9*window.innerWidth/2/window.innerHeight/0.5
//     modelMatrix.setScale(0.9/0.5,scale,1);
//   }else{
//     modelMatrix.setScale(scale,0.7/0.5,1);
//   }

//   gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);

//   gl.clearColor(0.0, 0.0, 0.0, 1.0);
//   gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
//   // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
//   gl.drawElements(gl.TRIANGLES, 30, gl.UNSIGNED_BYTE, 0);
// }
// // changeVertices()


// // resize the canvas to fill browser window dynamically
// window.addEventListener('resize', resizeCanvas, false);
// function resizeCanvas() {
//   canvas.style.width = window.innerWidth + "px"; 
//   canvas.style.height = window.innerHeight + "px";

//   changeVertices()
// }
// resizeCanvas();







function initVertexBuffers(gl) {

  var vertexColorbuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);


  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  var a_FSIZE = TexCoords.BYTES_PER_ELEMENT;

  var vertexTexCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, TexCoords, gl.STATIC_DRAW);

  var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, a_FSIZE * 2, 0);
  gl.enableVertexAttribArray(a_TexCoord);

  return 20;
}

// function initArrayBuffer (gl, attribute, data, num, type) {
//   // Create a buffer object
//   var buffer = gl.createBuffer();
//   if (!buffer) {
//     console.log('Failed to create the buffer object');
//     return false;
//   }
//   // Write date into the buffer object
//   gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//   gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
//   // Assign the buffer object to the attribute variable
//   var a_attribute = gl.getAttribLocation(gl.program, attribute);
//   if (a_attribute < 0) {
//     console.log('Failed to get the storage location of ' + attribute);
//     return false;
//   }
//   gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
//   // Enable the assignment of the buffer object to the attribute variable
//   gl.enableVertexAttribArray(a_attribute);

//   gl.bindBuffer(gl.ARRAY_BUFFER, null);

//   return true;
// }







function initTextures(gl, n) {
  var texture0 = gl.createTexture();
  var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  var image0 = new Image();
  image0.onload = function() {
    loadTexture(gl, n, texture0, u_Sampler0, image0, 0);
  }
  image0.src = require('./resource/kabe.jpg')//'/static/kabe.jpg';

  return true;
}

function loadTexture(gl, n, texture, u_Sampler, image, texUnit) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  if (texUnit == 0) {
    gl.activeTexture(gl.TEXTURE0);
    g_texUnit0 = true;
  }
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler, texUnit);

  if (g_texUnit0) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    gl.drawElements(gl.TRIANGLES, 30, gl.UNSIGNED_BYTE, 0);
  }
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












	
}
