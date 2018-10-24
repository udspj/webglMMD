

window.onload = function(){


var gl; // WebGL的全局变量



// function start() {
  var canvas = document.getElementById("glcanvas");
  gl = initWebGL(canvas);   
  if (!gl) {
    alert('gl error');
    // return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    alert('shaders error');
    // return;
  }

  var n = initVertexBuffers(gl);



  if(!initTextures(gl, n)) {
    // return;
  }

  gl.clearColor(1.0, 0.0, 0.0, 1.0);  
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);






  var u_ModelMatrix = gl.getUniformLocation(gl.program,"u_ModelMatrix");
  var modelMatrix = new Matrix4();

  function changeVertices() {
  var scale = 0.7*window.innerHeight*2/window.innerWidth/0.5
  if(window.innerWidth < window.innerHeight) {
       scale = 0.9*window.innerWidth/2/window.innerHeight/0.5
    modelMatrix.setScale(0.9/0.5,scale,1);
  }else{
    modelMatrix.setScale(scale,0.7/0.5,1);
  }
  
     gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
  gl.drawElements(gl.TRIANGLES, 30, gl.UNSIGNED_BYTE, 0);
}
changeVertices()


// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {
    canvas.style.width = window.innerWidth + "px"; 
    canvas.style.height = window.innerHeight + "px";

    changeVertices()
}
resizeCanvas();







  // var u_LightColor = gl.getUniformLocation(gl.program, "u_LightColor");
  // var u_LightDirection = gl.getUniformLocation(gl.program, "u_LightDirection");
  // gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
  // var lightdirection = new Vector3([1.5, 3.0, 4.0]);
  // lightdirection.normalize();
  // gl.uniform3fv(u_LightDirection, lightdirection.elements);


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

  // var u_ModelMatrix = gl.getUniformLocation(gl.program,"u_ModelMatrix");
  // var modelMatrix = new Matrix4();
  // modelMatrix.setTranslate(0.75,0,0);
  gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);

  // gl.enable(gl.POLYGON_OFFSET_FILL);
  // gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  // gl.drawArrays(gl.TRIANGLES, 0, n);
  // gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

  // gl.polygonOffset(1.0,1.0);

  // modelMatrix.setTranslate(-0.75,0,0);
  // gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);
  // gl.drawArrays(gl.TRIANGLES, 0, n);
// }

function initVertexBuffers(gl) {

  // var n = 6;
  var vertexColorbuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  // var colorBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
  // var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  // gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
  // gl.enableVertexAttribArray(a_Color);


  // var normalBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
  // var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  // gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
  // gl.enableVertexAttribArray(a_Normal);

  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  // if (!initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT)) return -1;
  // if (!initArrayBuffer(gl, 'a_Color', colors, 3, gl.FLOAT)) return -1;
  // if (!initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT)) return -1;

  // // Write the indices to the buffer object
  // var indexBuffer = gl.createBuffer();
  // if (!indexBuffer) {
  //   console.log('Failed to create the buffer object');
  //   return false;
  // }

  // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  var a_FSIZE = TexCoords.BYTES_PER_ELEMENT;

  var vertexTexCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, TexCoords, gl.STATIC_DRAW);

  var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, a_FSIZE * 2, 0);
  gl.enableVertexAttribArray(a_TexCoord);

  return 20;
}

function initArrayBuffer (gl, attribute, data, num, type) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return true;
}








function initTextures(gl, n) {
  var texture0 = gl.createTexture();
  var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  var image0 = new Image();
  image0.onload = function() {
    loadTexture(gl, n, texture0, u_Sampler0, image0, 0);
  }
  image0.src = require('./source/kabe.jpg')//'/static/kabe.jpg';

  return true;
}

  var viewMatrix = new Matrix4();
    var u_ViewMatrix = gl.getUniformLocation(gl.program,"u_ViewMatrix");
var g_texUnit0 = false;
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








document.onmousemove = function(ev){
            var oEvent=ev||event;
             // console.log(canvas.width/2+","+canvas.height/2)
            changeCamera((oEvent.clientX - window.innerWidth/2)/1000, (oEvent.clientY - window.innerHeight/2)/1000)
        }

        function changeCamera(x,y) {
          viewMatrix.setLookAt(x,y,5,0,0,0,0,1,0);
  gl.uniformMatrix4fv(u_ViewMatrix,false,viewMatrix.elements);

  // modelMatrix.setTranslate(0,0,0);
  // gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
  gl.drawElements(gl.TRIANGLES, 30, gl.UNSIGNED_BYTE, 0);
        }




function initWebGL(canvas) {
  // 创建全局变量
  window.gl = null;
  
  try {
    // 尝试创建标准上下文，如果失败，回退到试验性上下文
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  }
  catch(e) {}
  
  // 如果没有GL上下文，马上放弃
  if (!gl) {
    alert("WebGL初始化失败，可能是因为您的浏览器不支持。");
    gl = null;
  }
  return gl;
}




	
        }
