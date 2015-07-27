/// <reference path="../../general/constants.ts" />
/// <reference path="../../general/renderContext.ts" />
/// <reference path="../../helper/xmlTag.ts" />
/// <reference path="../../helper/fdglMath.ts" />
/// <reference path="../graphNode.ts" />
/// <reference path="../materials/colour.ts" />
/// <reference path="../sceneGraphLeaf.ts" />
/// <reference path="../../../../libs/TSM/tsm-0.7.d.ts" />


module Plexx {

    export class Text extends SceneGraphLeaf {

        private text: string;
        private textColour: Colour;
        private fontSize: number;
        private fontFamily: string;
        private textAlignment: string;
        private textBaseline: string;
    
        private textureCanvas;
        public constructor(text: string,
                           x: number,
                           y: number,
                           colour?: string,
                           fontSize?: number,
                           fontFamily?: string,
                           textAlignment?: string,
                           textBaseline?: string) {
            super("TextNode");
            this.setName("TextNode");
            this.setTransformationMatrix(new TSM.mat3().setIdentity());

            this.text = text;
            this.setPoints([new TSM.vec2([x, y])]);
            this.textColour = new Colour(colour); 
            this.fontSize = fontSize;
            this.fontFamily = fontFamily;
            this.textAlignment = textAlignment;
            this.textBaseline = textBaseline;
    
            console.log("[FDGL] " + "Create " + this.toString());
        }
    
        public copy(): Text{
            var textNodeCopy = new Text(this.text,
                                            this.getPoints()[0].x,
                                            this.getPoints()[0].y,
                                            this.textColour.getRGBAString());
            return textNodeCopy;
        }

        public toString() {
            var textString: string = "";
            textString += this.getName() + " {";
            textString += "text = " + this.text + ", ";
            textString += "x = " + this.getPoints()[0].x + ", ";
            textString += "y = " + this.getPoints()[0].y + ", ";
            textString += "textColour = " + this.textColour.getRGBAString() + "}";
            return textString;
        }
    
        public render(renderContext: RenderContext): boolean {
            var currentRenderType = renderContext.getRenderType();
            if (currentRenderType == RenderType.CANVAS2D) {
                return this.renderCanvas2d(renderContext);
            }
            else if (currentRenderType == RenderType.SVG) {
                return this.renderSVG(renderContext);
            }
            else if (currentRenderType == RenderType.WEBGL) {
                return this.renderWebGL(renderContext);
            }
            else return false;
        }

    
/*
 * -----------------------------------------------------------------------------
 * WebGL
 * -----------------------------------------------------------------------------
 */
    
        private getValidTextureSize(size: number): number {
            var validSize = 2;
            while (size > validSize) {
                validSize *= 2;
            }
            return validSize;
        }

        private createCanvasTexture() {
            var textureCanvas = <HTMLCanvasElement> document.createElement("canvas");
            textureCanvas.id = "textureCanvas";
            textureCanvas.width = 1024;
            textureCanvas.height = 1024;
            var context: any = textureCanvas.getContext("2d");
            context.font = this.fontSize + "pt " + this.fontFamily;
            var textWidth = context.measureText(this.text).width;
            textureCanvas.width = this.getValidTextureSize(textWidth);
            textureCanvas.height = this.getValidTextureSize(this.fontSize * 2);

            context.font = this.fontSize + "pt " + this.fontFamily;
            context.fillStyle = this.textColour.getCss3String();
            context.fillText(this.text, 0, textureCanvas.height/2);
            this.textureCanvas = textureCanvas;
        }
    
        private VSHADER_SOURCE: string =
            "attribute vec4 a_Position;                                    \n" +
            "attribute vec2 a_TextureCoordinates;                          \n" +
            "varying vec2 v_TextureCoordinates;                            \n" +
            "uniform vec2 u_Resolution;                                    \n" +
            "                                                              \n" +
            "void main() {                                                 \n" +
            "  vec2 tmp1 = vec2(a_Position.x, a_Position.y) / u_Resolution;\n" +
            "  vec2 tmp2 = tmp1 * 2.0;                                     \n" +
            "  vec2 tmp3 = tmp2 - 1.0;                                     \n" +
            "  gl_Position = vec4(tmp3 , a_Position.z, a_Position.w);      \n" +
            "  v_TextureCoordinates = a_TextureCoordinates;                \n" +
            "}                                                             \n";
    
    
        private FSHADER_SOURCE: string =
            "precision mediump float;                                      \n" +
            "uniform sampler2D u_Sampler;                                  \n" +
            "varying vec2 v_TextureCoordinates;                            \n" +
            "                                                              \n" +
            "void main() {                                                 \n" +
            "  gl_FragColor = texture2D(u_Sampler, v_TextureCoordinates);  \n" +
            "}                                                             \n";
    
        private program;
    
        private renderWebGL(renderContext: RenderContext): boolean {
            this.createCanvasTexture();
    
            var gl = <WebGLRenderingContext> renderContext.getCanvasWebGL().getContext("webgl");
            var canvasHeight: number = renderContext.getCanvasWebGL().getAttribute("height");
            var canvasWidth: number = renderContext.getCanvasWebGL().getAttribute("width");
    
            // init shaders
            this.initShaders(gl);
    
            // set vertex information
            var n = this.initVertexBuffers(gl, canvasWidth, canvasHeight);
    
            // set textures
            this.initTexture(gl, n);
    
            return true;
        }
    
        private initShaders(gl: WebGLRenderingContext) {
            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, this.VSHADER_SOURCE);
            gl.compileShader(vertexShader);
    
            var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
            gl.shaderSource(fragmentShader, this.FSHADER_SOURCE);
            gl.compileShader(fragmentShader);
    
            this.program = gl.createProgram();
            gl.attachShader(this.program, vertexShader);
            gl.attachShader(this.program, fragmentShader);
            gl.linkProgram(this.program);
            gl.useProgram(this.program);
    
        }
    
        private initVertexBuffers(gl: WebGLRenderingContext, canvasWidth: number, canvasHeight: number): number {
            var position = this.getPoints()[0];
            var height = this.textureCanvas.height;
            var width = this.textureCanvas.width;
            var x = position.x;
            var y = position.y - height/2;
            var verticesTextureCoordinates = new Float32Array([
                             x,  y + height, 0.0, 1.0,
                             x, y, 0.0, 0.0,
                             x + width, y + height , 1.0, 1.0,
                             x + width, y, 1.0, 0.0,
                          ]);
            var n = 4; // number of vertices
    
            var vertexTextureCoordinatesBuffer = gl.createBuffer();
    
            // bind buffer object to target
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordinatesBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, verticesTextureCoordinates, gl.STATIC_DRAW);
    
            var FSIZE = verticesTextureCoordinates.BYTES_PER_ELEMENT;
    
            var u_Resolution = gl.getUniformLocation(this.program, "u_Resolution");
            gl.uniform2f(u_Resolution, canvasWidth, canvasHeight);
    
            var a_Position = gl.getAttribLocation(this.program, "a_Position");
    
            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
            gl.enableVertexAttribArray(a_Position);
    
            var a_TextureCoordinates = gl.getAttribLocation(this.program, "a_TextureCoordinates");
    
            gl.vertexAttribPointer(a_TextureCoordinates, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
            gl.enableVertexAttribArray(a_TextureCoordinates);
    
            return n;
        }
    
        private initTexture(gl, n) {
            var canvasTexture = gl.createTexture();
            var u_Sampler = gl.getUniformLocation(this.program, 'u_Sampler');
            this.loadTexture(gl, n, canvasTexture, u_Sampler, this.textureCanvas);
        }
    
        private loadTexture(gl: WebGLRenderingContext, n,texture, u_Sampler, textureCanvas) {
            // flip the image's y axis
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    
            // bind the texture object to the target
            gl.bindTexture(gl.TEXTURE_2D, texture);
    
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureCanvas);
    
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    
            // Set the texture unit 0 to the sampler
            gl.uniform1i(u_Sampler, 0);
    
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    
        }
    
/*
 * -----------------------------------------------------------------------------
 * HTML5 canvas
 * -----------------------------------------------------------------------------
 */
    
        private renderCanvas2d(renderContext: RenderContext): boolean {
    
            var context = renderContext.getCanvas2dContext();
            var position: TSM.vec2 = this.getPoints()[0];

            var textHeight = this.fontSize;

            var transformationMatrix: TSM.mat3 = this.getTransformationMatrix();
            var translationMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, 1, 0, 0, renderContext.getHeight() - 2 * position.y, 1]);
            var resultMatrix: TSM.mat3 = translationMatrix.copy().multiply(transformationMatrix);
    

            try {
                context.save();
                    context.setTransform(resultMatrix.at(0),
                                         resultMatrix.at(1),
                                         resultMatrix.at(3),
                                         resultMatrix.at(4),
                                         resultMatrix.at(6),
                                         resultMatrix.at(7));
                    context.fillStyle = this.textColour.getCss3String();
                    context.font = this.fontSize + "pt " + this.fontFamily;
                    context.fillText(this.text, position.x, position.y);
                context.restore();
            } catch(e) {
                console.log("Canvas2D rendering error!");
                return false;
            }
    
            return true;
        }
    
/*
 * -----------------------------------------------------------------------------
 * SVG
 * -----------------------------------------------------------------------------
 */
    
        private renderSVG(renderContext: RenderContext): boolean {
    
            var svgElement = document.createElementNS(Constants.SVG_NAMESPACE, "text");
    
            var position = this.getPoints()[0];
            var transformationMatrix: TSM.mat3 = this.getTransformationMatrix();
            var textHeight = this.fontSize;
            var translationMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, 1, 0, 0, renderContext.getHeight() - 2 * position.y, 1]);
            var resultMatrix: TSM.mat3 = translationMatrix.copy().multiply(transformationMatrix);
    
            try {
                svgElement.setAttribute("x", String(position.x));
                svgElement.setAttribute("y", String(position.y));
                svgElement.setAttribute("transform", "matrix(" + resultMatrix.at(0) + 
                                                          " " + resultMatrix.at(1) +
                                                          " " + resultMatrix.at(3) + 
                                                          " " + resultMatrix.at(4) +
                                                          " " + resultMatrix.at(6) +
                                                          " " + resultMatrix.at(7) +
                                                          ")");
     
                svgElement.setAttribute("fill", this.textColour.getCss3String());
                svgElement.setAttribute("style", "font-family: " + this.fontFamily + ";" +
                                                 "font-size: " + this.fontSize + "pt;" +
                                                 "kerning: " + "auto;" +
                                                 "letter-spacing: " + "normal;");
    
                var textNode = document.createTextNode(this.text);
                svgElement.appendChild(textNode);
                renderContext.getSVG().appendChild(svgElement);
            } catch (e) {
                return false;
            }
    
            return true;
        }
    
        public toSVGString(renderContext: RenderContext): string {
            var svgElement: string = "";
            var xmlTag = new XMLTag("text");
    
            svgElement = xmlTag.getStartTag() + "\n";
    
            var position = this.getPoints()[0];
            var transformationMatrix: TSM.mat3 = this.getTransformationMatrix();
            var textHeight = this.fontSize;
            var translationMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, 1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix: TSM.mat3 = translationMatrix.copy().multiply(transformationMatrix);
    
            xmlTag.addAttribute("x", String(position.x));
            xmlTag.addAttribute("y", String(position.y));
            xmlTag.addAttribute("transform", "matrix(" + resultMatrix.at(0) + 
                                                      " " + resultMatrix.at(1) +
                                                      " " + resultMatrix.at(3) + 
                                                      " " + resultMatrix.at(4) +
                                                      " " + resultMatrix.at(6) +
                                                      " " + resultMatrix.at(7) +
                                                      ")");
 
            xmlTag.addAttribute("fill", this.textColour.getCss3String());
            xmlTag.addAttribute("style", "font-family: " + this.fontFamily + "; font-size: " + this.fontSize + "pt;");

            svgElement = xmlTag.getStartTag() + this.text + xmlTag.getEndTag() + "\n";

            return svgElement;
        }
    }
}
