var MMDParser = require('mmd-parser');

window.onload = function(){

var parser = new MMDParser.Parser();

var position = [];
var normal = [];
var uv = [];
var materials = [];
var faces = [];
var textures = [];

var images = [];

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
      'http://10.0.1.239:8080/yellow/miku.pmx',
      'arraybuffer',
      undefined,
      function (buffer) {
        var pmd = parser.parsePmx(buffer);
        console.log(pmd);
        // console.log(pmd.metadata)

        const vertices = pmd["vertices"];
        const verticesCount = vertices.length
        for (var i = 0; i < verticesCount ; i++) {
          position.push(vertices[i]["position"][0]);
          position.push(vertices[i]["position"][1]);
          position.push(vertices[i]["position"][2]);
          normal.push(vertices[i]["normal"][0]);
          normal.push(vertices[i]["normal"][1]);
          normal.push(vertices[i]["normal"][2]);
          uv.push(vertices[i]["uv"][0]);
          uv.push(vertices[i]["uv"][1]);
        }
        materials = pmd["materials"];
        textures = pmd["textures"];
        const faceCount = pmd["faces"].length;
        for (var i = 0 ; i < faceCount; i++) {
          faces.push(pmd["faces"][i]["indices"][0]);
          faces.push(pmd["faces"][i]["indices"][1]);
          faces.push(pmd["faces"][i]["indices"][2]);
        }

        const txCount = textures.length;
        var compindex = 0;
        for (var i = 0 ; i < txCount; i++) {
          var image0 = new Image();
          image0.onload = function() {
            compindex++;
            if(compindex == txCount) {
              initVertexBuffers("glcanvas",-50,{"a":180,"x":0,"y":0,"z":1},{"x":0,"y":-15,"z":0});
              // initVertexBuffers("glcanvas2",50);
            }
          }
          image0.src = require('./resource/yellow/'+textures[i].replace(/\\/, "/"))//'/static/kabe.jpg';
            images.push(image0);
        }
console.log(images)
      }
    );
  }


testPmd();


function initVertexBuffers(canvasname,lookrotate,rotate,translate) {


        var gl; // WebGL的全局变量

        var canvas = document.getElementById(canvasname);
        gl = initWebGL(canvas);   
        if (!gl) {
          alert('gl error');
        }

        if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
          alert('shaders error');
        }

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

        var u_ModelMatrix = gl.getUniformLocation(gl.program,"u_ModelMatrix");
        var modelMatrix = new Matrix4();

        var u_ViewMatrix = gl.getUniformLocation(gl.program,"u_ViewMatrix");
        var viewMatrix = new Matrix4();
        // viewMatrix.setLookAt(0.20, 0.25, 0.25, 0,0,0, 0,1,0);
        viewMatrix.setLookAt(0,0,lookrotate,0,7,0,0,1,0);
        gl.uniformMatrix4fv(u_ViewMatrix,false,viewMatrix.elements);

        var u_ProjMatrix = gl.getUniformLocation(gl.program,"u_ProjMatrix");
        var projMatrix = new Matrix4();
        // modelMatrix.setOrtho(-5,5,-5,5,-5,5);
        projMatrix.setPerspective(30, 1, 1, 100);
        gl.uniformMatrix4fv(u_ProjMatrix,false,projMatrix.elements);
modelMatrix.rotate(rotate.a,rotate.x,rotate.y,rotate.z)
modelMatrix.translate(translate.x,translate.y,translate.z)
        gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);


        var viewMatrix = new Matrix4();
        var u_ViewMatrix = gl.getUniformLocation(gl.program,"u_ViewMatrix");
        var g_texUnit0 = false;
        // console.log(position);
        // console.log(normal);
        // console.log(uv);
        // console.log(materials);

  var vertexColorbuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);


  var a_FSIZE = uv.BYTES_PER_ELEMENT;

  var vertexTexCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);

  var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_TexCoord);



    var texture0 = gl.createTexture();
    var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');

    const materialsCount = materials.length;
    var offset = 0;
    for (var i = 0; i < materialsCount; i++) {
          const count = materials[i]["faceCount"] * 3

          var indexes = faces.slice(offset,offset+count)
          // console.log(indexes)
        offset += count;
        
      var indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexes), gl.STATIC_DRAW);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture0);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, images[materials[i]["textureIndex"]]);
        gl.uniform1i(u_Sampler0, 0);


          
            // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
          gl.drawElements(gl.TRIANGLES, indexes.length, gl.UNSIGNED_SHORT, 0);
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
