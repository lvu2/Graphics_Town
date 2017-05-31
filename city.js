/**
 * Created by lvu on 12/9/2016.
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
        "const float ambientC  = .55;" +
        "const float diffuseC  = 1.3;" +
        "const float specularC = 1.0;" +
        "const float specularE = 6.0;" +
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
         var car2 = LoadedOBJFiles["Lamborghini.obj"];
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
        for(var i = 0; i < car2.groups['Box01' ].faces.length; i++){
            var tmp = car2.groups['Box01' ].faces[i];
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
        for(var i = 0; i < car2.groups['Box01' ].faces.length; i++){
            var tmp = car2.groups['Box01' ].faces[i];
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
        for(var i = 0; i < car2.groups['Box01' ].faces.length; i++){
            var tmp = car2.groups['Box01' ].faces[i];
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

     var normal = new Float32Array(vec4);

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
         this.image = new Image();
         this.vertices = [null];
         this.normal = [null];
         this.textCoords = [null];
    }

    TexturedPlane.prototype.init = function (drawingState) {

        var gl = drawingState.gl;

        this.program = createGLProgram(gl, vertexSource, fragmentSource);
        this.attributes = findAttribLocations(gl, this.program, ["aPosition", "aTexCoord", "vnormal"]);
        this.uniforms = findUniformLocations(gl, this.program, ["pMatrix", "vMatrix", "mMatrix", "uTexture","uLight"]);

        this.texture = createGLTexture(gl, this.image, true);

        this.buffers[0] = createGLBuffer(gl, this.vertices, gl.STATIC_DRAW);
        this.buffers[1] = createGLBuffer(gl, this.textCoords, gl.STATIC_DRAW);
        this.buffers[2] = createGLBuffer(gl, this.normal, gl.STATIC_DRAW);
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
/*         var theta = Number(drawingState.realtime)/200.0;
 twgl.m4.rotateY(modelM, 1.5708, modelM);
             if (this.position[2] < -9 || this.position[2] > 8) {
                 inc = (-1)*inc;
             }
             this.position[2] += inc;*/
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



        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length/3);

        disableLocations(gl, this.attributes);
    }


    var test = new TexturedPlane();
    test.position[0] = 10;
    test.position[1] = -3.5;
    test.position[2] = -90;
    test.scale = [.08, .08, -.08];
    var obj = LoadedOBJFiles["The City.obj"];
    test.vertices = new Float32Array(vertCalc(obj.groups['mesh01' ]));
    test.normal = new Float32Array(normCalc(obj.groups['mesh01' ]));
    test.textCoords = new Float32Array(textCoordCalc(obj.groups['mesh01' ]));
    grobjects.push(test);

   /* var test2 = new TexturedPlane();
    test2.position[0] = 0;
    test2.position[1] = 5;
    test2.position[2] = 0;
    test2.scale = [.004, .004, .004];
    var obj = LoadedOBJFiles["The City.obj"];
    test2.vertices = new Float32Array(vertCalc(obj.groups['' ]));
    test2.normal = new Float32Array(normCalc(obj.groups['' ]));
    test2.textCoords = new Float32Array(textCoordCalc(obj.groups['' ]));
    test2.image.src = "cty2x.jpg"
    grobjects.push(test2);*/
    // glass
   /*    var glass = new TexturedPlane();
    glass.position[0] = 0;
    glass.position[1] = 0;
    glass.position[2] = 0;
    glass.scale = [.004, .004, .004];
    var obj = LoadedOBJFiles["Lamborghini.obj"];
    glass.vertices = new Float32Array(vertCalc(obj.groups['Glass' ]));
    glass.normal = new Float32Array(normCalc(obj.groups['Glass' ]));
    glass.textCoords = new Float32Array(textCoordCalc(obj.groups['Glass' ]));
    glass.image.src = "data:;base64,RERTIHwAAAAHEAIAIAAAACAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAEAAAARFhUMQAAAAAAAAAAAAAAAAAAAAAAAAAACBBAAAAAAAAAAAAAAAAAAAAAAAD4tZel1fW9Lzm+uK2tLwsCWsY5vq2rqupaxvi1qur6fhm+t63o+v5/2LW3rV5fV1W4rbelKqoqCvi1uK29rSsKOb64rb2vKwpaxhm+qaqiqFrG+LWo6Pp+Gb63reD4/n/Ytbetfl9XVbitt6WqqioK+LW4rbWtKwr4tdm1CgIAgFrGGb4tiqKgWsb4taDo+noZvtit6HpeV9i1t61+X1dVuK23paqqKgr4tbitta0rCvi12bUKAgCA+LW4rYCg6Hpaxhm2qOh6Xhm+2K3geF5X2LW3rX5fV1W4rbelqqoqCvi1uK21rSsK+LXZtQoCAID4tbitgKDoeti1l6Xo+n5fOb64rej6fl/Ytbetfl9XVbitt6WqqioK+LW4rbWtKwr4tdm1CgIAgPi1uK2AoOh62LWXpej6fl+XpXelAMCwrNi1t61+X1VVuK23paqqKgr4tbitta0rCvi12bUKAgCA+LW4rYCg6HrYtZel6Pp+X5eld6UAwLCsl6V3pSuKIgi4rbelqqoqCvi1uK21rSsK+LXZtQoCAID4tbitgKDoeti1l6Xo+n5fl6V3pQDAsKyXpXelK4oiCJeld6UCAAAA+LW4rbWtKwr4tdm1CgIAgPi1uK2AoOh62LWXpej6fl+XpXelAMCwrJeld6UriiIIl6V3pQIAAACYpZelVVVVVTm+d6W1LSsKOb7YrQCA4Hj4tZel4Pj+/9i1l6W/LwsCOr7XrQKA4Hj4tZel4Pj+/9i1l6W/LwsC+LWXpYKg6Hr4tZel4Pj+/9i1l6W/LwsC+LW3rYrieF7YrXeleF5XVdi1l6W/LwsC+LWXpYKg6HrYrXeleF5XVZald6W1rauqWsaXpS2L4nj4tZel3L4ti/i1l6XYvi2L+LV3peJ4XlcZvnelwbjuaw=="
    grobjects.push(glass);
    // tyre01
       var tyre1 = new TexturedPlane();
    tyre1.position[0] = 0;
    tyre1.position[1] = 0;
    tyre1.position[2] = 0;
    tyre1.scale = [.004, .004, .004];
    var obj = LoadedOBJFiles["Lamborghini.obj"];
    tyre1.vertices = new Float32Array(vertCalc(obj.groups['tyre01' ]));
    tyre1.normal = new Float32Array(normCalc(obj.groups['tyre01' ]));
    tyre1.textCoords = new Float32Array(textCoordCalc(obj.groups['tyre01' ]));
    grobjects.push(tyre1);
    // tyre03
       var tyre2 = new TexturedPlane();
    tyre2.position[0] = 0;
    tyre2.position[1] = 0;
    tyre2.position[2] = 0;
    tyre2.scale = [.004, .004, .004];
    var obj = LoadedOBJFiles["Lamborghini.obj"];
    tyre2.vertices = new Float32Array(vertCalc(obj.groups['tyre03' ]));
    tyre2.normal = new Float32Array(normCalc(obj.groups['tyre03' ]));
    tyre2.textCoords = new Float32Array(textCoordCalc(obj.groups['tyre03' ]));
    grobjects.push(tyre2);*/
})();