/**
 * Created by lvu on 12/8/2016.
 */


/**
 A Very Simple Textured Plane using native WebGL.

 Notice that it is possible to only use twgl for math.

 Also, due to security restrictions the image was encoded as a Base64 string.
 It is very simple to use somthing like this (http://dataurl.net/#dataurlmaker) to create one
 then its as simple as
     var image = new Image()
     image.src = <base64string>


 **/

var grobjects = grobjects || [];


(function() {
    "use strict";

    var vertexSource = ""+
        "precision highp float;" +
        "attribute vec3 aPosition;" +
        "attribute vec2 aTexCoord;" +
        "attribute vec3 vnormal;" +
        "varying vec2 vTexCoord;" +
        "uniform mat4 pMatrix;" +
        "uniform mat4 vMatrix;" +
        "uniform mat4 mMatrix;" +
        "varying vec3 outPos;" +
        "varying vec3 outNormal;" +
        "varying vec3 fNormal;" +

        "void main(void) {" +
        "outPos = (vMatrix * mMatrix * vec4(aPosition, 1.0)).xyz;" +
        "fNormal = vnormal;" +
        "outNormal = normalize(vMatrix * mMatrix * vec4(vnormal,0.0)).xyz;" +
        "  gl_Position = pMatrix * vMatrix * mMatrix * vec4(aPosition, 1.0);" +
        "  vTexCoord = aTexCoord;" +
        "}";

    var fragmentSource = "" +
        "precision highp float;" +
        "varying vec2 vTexCoord;" +
        "uniform mat4 vMatrix;" +
        "uniform mat4 mMatrix;" +
        "uniform sampler2D uTexture;" +
        "uniform vec3 uLight;" +
        "varying vec3 outPos;" +
        "varying vec3 outNormal;" +
        "varying vec3 fNormal;" +

        "const vec3  lightV    = vec3(0.0,0.0,1.0);" +
        "const float lightI    = 1.0;" +
        "const float ambientC  = 0.55;" +
        "const float diffuseC  = 1.3;" +
        "const float specularC = 1.0;" +
        "const float specularE = 16.0;" +
        "const vec3  lightCol  = vec3(1.0,1.0,1.0);" +
        "const vec3  objectCol = vec3(1.0,0.6,0.0);" +
        "vec2 blinnPhongDir(vec3 lightDir, vec3 n, float lightInt, float Ka," +
        "float Kd, float Ks, float shininess) {" +
        "vec3 s = normalize(lightDir);" +
        "vec3 v = normalize(-outPos);" +
        "vec3 h = normalize(v+s);" +
        "float diffuse = Ka + Kd * lightInt * max(0.0, dot(normalize(n), s));" +
        "float spec =  Ks * pow(max(0.0, dot(normalize(n),h)), shininess);" +
        "return vec2(diffuse, spec);" +
        "}" +


        "void main(void) {" +
        "vec3 texColor = texture2D(uTexture, vTexCoord).xyz;" +
        "vec3 n = (vMatrix * mMatrix * vec4(fNormal, 0.0)).xyz;" +
        "vec3 ColorS  = blinnPhongDir(uLight,n,0.0   ,0.0,     0.0,     specularC,specularE).y*lightCol;" +
        "vec3 ColorAD = blinnPhongDir(uLight,n,lightI,ambientC,diffuseC,0.0,      1.0      ).x*texColor;" +
        "gl_FragColor = vec4(ColorAD,1.0);" +
        "}";

         var car2 = LoadedOBJFiles["Gost House (5).obj"];
//vertexes/////////////////////////////////////////////////
        var data = [];//[geometries.vertices.length*3];
        for(var i = 0; i < car2.vertices.length; i++){
            for(var j = 0; j < 3; j++) {
                data[(i*3) + j] = car2.vertices[i][j];
            }
        }

        //get indices for vertices
        var data3 = [];
        var k = 0;
        for(var i = 0; i < car2.groups['Gost_House_(www.3dislands.blogspot.com)' ].faces.length; i++){
            var tmp = car2.groups['Gost_House_(www.3dislands.blogspot.com)' ].faces[i];
            for(var j = 0; j < 3; j++) {
                var tmp2 = tmp[j];
                data3[k] = tmp2[0];
                k++;
            }
        }

//correct order for vertices
    var vec4 = [];
    var o = 0;
    for(var m = 0; m < data3.length; m++) {
        //vec4[m] = data[data3[m]];
        //console.log(3*(data3[m]));
        for(var n = 0; n < 3; n++) {
            //vec4[o] = data[data3[n]];
            var indexVal = 3*(data3[m]);
            vec4[o] = data[indexVal + n];
            o++;
        }
    }

//normal////////////////////////////////////////
        var data2 = [];//[geometries.vertices.length*3];
        for(var i = 0; i < car2.normals.length; i++){
            for(var j = 0; j < 3; j++) {
                data2[(i*3) + j] = car2.normals[i][j];
            }
        }
    //get indices for normal
        var data5 = [];
        var k = 0;
        for(var i = 0; i < car2.groups['Gost_House_(www.3dislands.blogspot.com)' ].faces.length; i++){
            var tmp = car2.groups['Gost_House_(www.3dislands.blogspot.com)' ].faces[i];
            for(var j = 0; j < 3; j++) {
                var tmp2 = tmp[j];
                data5[k] = tmp2[2];
                k++;
            }
        }
    //correct order for normal
    var vec5 = [];
    var p = 0;
    for(var m = 0; m < data5.length; m++) {
        for(var n = 0; n < 3; n++) {
            var indexVal = 3*(data5[m]);
            vec5[p] = data2[indexVal + n];
            p++;
        }
    }
//vt////////////////////////////////////////
        var data10 = [];//[geometries.vertices.length*3];
        for(var i = 0; i < car2.texCoords.length; i++){
            for(var j = 0; j < 2; j++) {
                data10[(i*2) + j] = car2.texCoords[i][j];
            }
        }
    //get indices for vt
        var data11 = [];
        var k = 0;
        for(var i = 0; i < car2.groups['Gost_House_(www.3dislands.blogspot.com)' ].faces.length; i++){
            var tmp = car2.groups['Gost_House_(www.3dislands.blogspot.com)' ].faces[i];
            for(var j = 0; j < 3; j++) {
                var tmp2 = tmp[j];
                data11[k] = tmp2[1];
                k++;
            }
        }
    //correct order for vt
    var vec12 = [];
    var p = 0;
    for(var m = 0; m < data11.length; m++) {
        for(var n = 0; n < 2; n++) {
            var indexVal = 2*(data11[m]);
            vec12[p] = data10[indexVal + n];
            p++;
        }
    }


    var vertices = new Float32Array(vec4);

    var uvs = new Float32Array(vec12);

     var normal = new Float32Array(vec5);

    //useful util function to simplify shader creation. type is either gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
    var createGLShader = function (gl, type, src) {
        var shader = gl.createShader(type)
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            console.log("warning: shader failed to compile!")
            console.log(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    //see above comment on how this works.
    var image = new Image();

    //useful util function to return a glProgram from just vertex and fragment shader source.
    var createGLProgram = function (gl, vSrc, fSrc) {
        var program = gl.createProgram();
        var vShader = createGLShader(gl, gl.VERTEX_SHADER, vSrc);
        var fShader = createGLShader(gl, gl.FRAGMENT_SHADER, fSrc);
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);

        if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
            console.log("warning: program failed to link");
            return null;

        }
        return program;
    }

    //creates a gl buffer and unbinds it when done.
    var createGLBuffer = function (gl, data, usage) {
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, usage);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return buffer;
    }

    var findAttribLocations = function (gl, program, attributes) {
        var out = {};
        for(var i = 0; i < attributes.length;i++){
            var attrib = attributes[i];
            out[attrib] = gl.getAttribLocation(program, attrib);
        }
        return out;
    }

    var findUniformLocations = function (gl, program, uniforms) {
        var out = {};
        for(var i = 0; i < uniforms.length;i++){
            var uniform = uniforms[i];
            out[uniform] = gl.getUniformLocation(program, uniform);
        }
        return out;
    }

    var enableLocations = function (gl, attributes) {
        for(var key in attributes){
            var location = attributes[key];
            gl.enableVertexAttribArray(location);
        }
    }

    //always a good idea to clean up your attrib location bindings when done. You wont regret it later.
    var disableLocations = function (gl, attributes) {
        for(var key in attributes){
            var location = attributes[key];
            gl.disableVertexAttribArray(location);
        }
    }

    //creates a gl texture from an image object. Sometiems the image is upside down so flipY is passed to optionally flip the data.
    //it's mostly going to be a try it once, flip if you need to.
    var createGLTexture = function (gl, image, flipY) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        if(flipY){
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        }
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,  gl.LINEAR);
        // Prevents s-coordinate wrapping (repeating).
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
// Prevents t-coordinate wrapping (repeating).
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        //gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

     var TexturedPlane = function () {
        this.name = "TexturedPlane"
        this.position = new Float32Array([0, 0, 0]);
        this.scale = new Float32Array([1, 1, 1]);
        this.program = null;
        this.attributes = null;
        this.uniforms = null;
        this.buffers = [null, null]
        this.texture = null;
    }

    TexturedPlane.prototype.init = function (drawingState) {

        var gl = drawingState.gl;

        this.program = createGLProgram(gl, vertexSource, fragmentSource);
        this.attributes = findAttribLocations(gl, this.program, ["aPosition", "aTexCoord", "vnormal"]);
        this.uniforms = findUniformLocations(gl, this.program, ["pMatrix", "vMatrix", "mMatrix", "uTexture","uLight"]);

        this.texture = createGLTexture(gl, image, true);

        this.buffers[0] = createGLBuffer(gl, vertices, gl.STATIC_DRAW);
        this.buffers[1] = createGLBuffer(gl, uvs, gl.STATIC_DRAW);
        this.buffers[2] = createGLBuffer(gl, normal, gl.STATIC_DRAW);
    }

    TexturedPlane.prototype.center = function () {
        return this.position;
    }

    //var inc = .05;
    TexturedPlane.prototype.draw = function (drawingState) {

        var gl = drawingState.gl;

        gl.useProgram(this.program);
        gl.disable(gl.CULL_FACE);

        var modelM = twgl.m4.scaling([this.scale[0],this.scale[1], this.scale[2]]);
        twgl.m4.setTranslation(modelM,this.position, modelM);
//         var theta = Number(drawingState.realtime)/200.0;
 twgl.m4.rotateY(modelM, 1.5708, modelM);
//             if (this.position[2] < -9 || this.position[2] > 8) {
//                 inc = (-1)*inc;
//             }
//             this.position[2] += inc;
        gl.uniformMatrix4fv(this.uniforms.pMatrix, gl.FALSE, drawingState.proj);
        gl.uniformMatrix4fv(this.uniforms.vMatrix, gl.FALSE, drawingState.view);
        gl.uniformMatrix4fv(this.uniforms.mMatrix, gl.FALSE, modelM);
        gl.uniform3fv(this.uniforms.uLight,drawingState.sunDirection);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(this.uniforms.uTexture, 0);



        enableLocations(gl, this.attributes)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[0]);
        gl.vertexAttribPointer(this.attributes.aPosition, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[1]);
        gl.vertexAttribPointer(this.attributes.aTexCoord, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[2]);
        gl.vertexAttribPointer(this.attributes.vnormal, 3, gl.FLOAT, false, 0, 0);



        gl.drawArrays(gl.TRIANGLES, 0, vec4.length/3);

        disableLocations(gl, this.attributes);
    }


    var test = new TexturedPlane();
    test.position[0] = -30;
        test.position[1] = 0;
     test.position[2] = -30;
        test.scale = [.02, .02, .02];

    grobjects.push(test);

})();