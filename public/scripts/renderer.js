class Renderer {
    gl;
    canvas;
    constructor(canvas) {
        this.canvas = canvas;
        const context = canvas.getContext('webgl2');
        this.gl = context;
        window.addEventListener('resize', this.updateCanvasSize.bind(this));
        this.updateCanvasSize();
        const gl = this.gl;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }
    draw(game) {
        if (document.hasFocus()) {
            this.gl.clearColor(0, 0, 0, 1);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            const data = game.levelDataLevels;
            for (let i = 0; i < Math.max(data.length, game.entities.length); i++) {
                if (game.entities[i]) {
                    for (let j = 0; j < game.entities[i].length; j++) {
                        game.entities[i][j].draw(this.gl, game);
                    }
                }
                if (data[i] && data[i].tileSet) {
                    for (let j = 0; j < data[i].tileSet.length; j++) {
                        data[i].tiles[j].drawTiles(this.gl, game, j, i);
                    }
                }
            }
            if (game.gui) {
                game.gui.drawElements(game);
            }
        }
    }
    drawBasicTexture(gl, texture, x, y, w, h, reflectHorizontally = false, reflectVertically = false) {
        const x2 = x + w;
        const y2 = y + h;
        const posArray = new Float32Array([
            x, y,
            x2, y,
            x, y2,
            x, y2,
            x2, y,
            x2, y2
        ]);
        let defaultTexCoordArray = [
            0, 0,
            1, 0,
            0, 1,
            0, 1,
            1, 0,
            1, 1,
        ];
        if (reflectHorizontally) {
            for (let i = 0; i < defaultTexCoordArray.length; i += 2) {
                defaultTexCoordArray[i] = 1 - defaultTexCoordArray[i];
            }
        }
        if (reflectVertically) {
            for (let i = 0; i < defaultTexCoordArray.length; i += 2) {
                defaultTexCoordArray[i + 1] = 1 - defaultTexCoordArray[i + 1];
            }
        }
        const texCoordArray = new Float32Array(defaultTexCoordArray);
        this.drawTextures(gl, texture, posArray, texCoordArray, 6);
    }
    drawTextures(gl, texture, geometry, textureCoordinates, vertexCount, shader = TexturedShader) {
        gl.useProgram(GLUtils.getShader(shader, gl));
        gl.bindVertexArray(shader.vertexArrayObject);
        gl.uniform2f(shader.resolutionLocation, gl.canvas.width, gl.canvas.height);
        gl.uniform1i(shader.imageLocation, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, shader.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, textureCoordinates, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, shader.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, geometry, gl.DYNAMIC_DRAW);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    }
    updateCanvasSize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
}
class GLUtils {
    static createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            return shader;
        }
        console.warn(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        throw new Error('Shader failed to compile');
    }
    static createProgram(gl, vShader, fShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);
        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
            return program;
        }
        console.warn(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        throw new Error('Program failed to link');
    }
    static generateProgram(gl, vShaderCode, fShaderCode) {
        return this.createProgram(gl, this.createShader(gl, gl.VERTEX_SHADER, vShaderCode), this.createShader(gl, gl.FRAGMENT_SHADER, fShaderCode));
    }
    static getShader(type, gl) {
        if (!type.program) {
            type.program = GLUtils.generateProgram(gl, type.vShaderCode, type.fShaderCode);
            type.initShader(gl);
        }
        return type.program;
    }
    static setupTexture(gl, image) {
        const glTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        return glTexture;
    }
}
class Shader {
    static vShaderCode;
    static fShaderCode;
    static program;
    static initShader(gl) { }
}
class TexturedShader extends Shader {
    static vShaderCode = `#version 300 es
    in vec2 position;
    in vec2 texCoord;
    
    uniform vec2 resolution;
    
    out vec2 textureCoordinate;
    
    void main() {
        vec2 clipSpace = (position / resolution * 2.0 - 1.0) * vec2(1, -1);
        
        gl_Position = vec4(clipSpace, 0, 1);
        textureCoordinate = texCoord;
    }`;
    static fShaderCode = `#version 300 es
    precision highp float;
    
    uniform sampler2D image;
    
    in vec2 textureCoordinate;
    
    out vec4 outColor;
    
    void main() {
        outColor = texture(image, textureCoordinate);
    }`;
    static positionBuffer;
    static texCoordBuffer;
    static resolutionLocation;
    static imageLocation;
    static vertexArrayObject;
    static initShader(gl) {
        const program = TexturedShader.program;
        TexturedShader.vertexArrayObject = gl.createVertexArray();
        gl.bindVertexArray(TexturedShader.vertexArrayObject);
        const positionAttrLocation = gl.getAttribLocation(program, 'position');
        TexturedShader.positionBuffer = gl.createBuffer();
        gl.enableVertexAttribArray(positionAttrLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, TexturedShader.positionBuffer);
        gl.vertexAttribPointer(positionAttrLocation, 2, gl.FLOAT, false, 0, 0);
        const texCoordAttrLocation = gl.getAttribLocation(program, 'texCoord');
        TexturedShader.texCoordBuffer = gl.createBuffer();
        gl.enableVertexAttribArray(texCoordAttrLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, TexturedShader.texCoordBuffer);
        gl.vertexAttribPointer(texCoordAttrLocation, 2, gl.FLOAT, false, 0, 0);
        TexturedShader.resolutionLocation = gl.getUniformLocation(program, 'resolution');
        TexturedShader.imageLocation = gl.getUniformLocation(program, 'image');
    }
}
