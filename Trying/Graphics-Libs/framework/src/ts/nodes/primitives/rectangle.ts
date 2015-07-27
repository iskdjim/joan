/// <reference path="../../general/constants.ts" />
/// <reference path="../../general/renderContext.ts" />
/// <reference path="../../helper/xmlTag.ts" />
/// <reference path="../../helper/fdglMath.ts" />
/// <reference path="../graphNode.ts" />
/// <reference path="../materials/colour.ts" />
/// <reference path="../sceneGraphLeaf.ts" />
/// <reference path="../../../../libs/TSM/tsm-0.7.d.ts" />


module Plexx {

    export class Rectangle extends SceneGraphLeaf {
    
        private width: number;
        private height: number;
        private colourNode: Colour;
    
        constructor(width?: number,
                    height?: number,
                    x?: number,
                    y?: number,
                    colour?: string) {
            super("Rectangle");
    
            this.setPoints([new TSM.vec2([x, y])]);
            this.setTransformationMatrix(new TSM.mat3().setIdentity());
            this.height = height || Constants.DEFAULT_HEIGHT;
            this.width = width || Constants.DEFAULT_WIDTH;
            this.colourNode = new Colour(colour); 
    
            console.log("[FDGL] " + this.toString() + " created");
        }
    
        public toString() {
            var textString: string = "";
    
            textString = this.getName() + " {width = " + this.width + ", height = " + this.height + ", x = " + this.getPoints()[0].x + ", y = " + this.getPoints()[0].y + "}";
    
            return textString;
        }
    
        public getX(): number {
            return this.getPoints()[0].x;
        }
    
        public setX(x: number): Rectangle {
            this.getPoints()[0].x = x;
            return this;
        }
    
        public getY(): number {
            return this.getPoints()[0].y;
        }
    
        public setY(y: number): Rectangle {
            this.getPoints()[0].y = y;
            return this;
        }
    
        public setHeight(height:number) {
            this.height = height;
        }
    
        public getHeight(): number {
            return this.height;
        }
    
        public setWidth(width:number) {
            this.width = width;
        }
    
        public getWidth(): number {
            return this.width;
        }
    
        public setColour(colour:string) {
            this.colourNode.setColour(colour);
        }
    
        public getColour(): string {
            return this.colourNode.getRGBAString();
        }
    
        public render(renderContext: RenderContext): boolean {
            var currentRenderType = renderContext.getRenderType();
            if (currentRenderType == RenderType.CANVAS2D) {
                return this.updateCanvas2d(renderContext);
            }
            else if (currentRenderType == RenderType.SVG) {
                return this.updateSVG(renderContext);
            }
            else if (currentRenderType == RenderType.WEBGL) {
                return this.updateWebGL(renderContext);
            }
            else return false;
        }
    
        private updateCanvas2d(renderContext:RenderContext): boolean {
            var context = renderContext.getCanvas2D().getContext("2d");
            var position = this.getPoints()[0];
    
            var transformationMatrix: TSM.mat3 = this.getTransformationMatrix();
            var mirrorMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix: TSM.mat3 = mirrorMatrix.copy().multiply(transformationMatrix);
    
            context.save();
                context.setTransform(resultMatrix.at(0), resultMatrix.at(1), resultMatrix.at(3), resultMatrix.at(4), resultMatrix.at(6), resultMatrix.at(7));
                context.fillStyle = this.colourNode.getCss3String();
                context.fillRect(position.x, position.y, this.width, this.height);
            context.restore();
    
            return true;
        }
    
        private updateSVG(renderContext:RenderContext): boolean {
            var SVGObject = document.createElementNS(Constants.SVG_NAMESPACE, "rect");
            var position = this.getPoints()[0];
    
            var transformationMatrix: TSM.mat3 = this.getTransformationMatrix();
            var mirrorMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix: TSM.mat3 = mirrorMatrix.copy().multiply(transformationMatrix);
    
            SVGObject.setAttribute("width", String(this.width));
            SVGObject.setAttribute("height", String(this.height));
            SVGObject.setAttribute("x", String(position.x));
            SVGObject.setAttribute("y", String(position.y));
            SVGObject.setAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " +  resultMatrix.at(3) + " " + resultMatrix.at(4) + " " +  resultMatrix.at(6) + " " + resultMatrix.at(7) + ")");
     
            SVGObject.setAttribute("fill", this.colourNode.getCss3String());
            SVGObject.setAttribute("stroke", "none");
    
            renderContext.getSVG().appendChild(SVGObject);
    
            return true;
        }
    
        private updateWebGL(renderContext:RenderContext): boolean {
            var gl = <WebGLRenderingContext> renderContext.getCanvasWebGL().getContext("webgl");
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, this.generateVertexShaderSource());
            gl.compileShader(vertexShader);
    
            var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, this.generateFragmentShaderSource());
            gl.compileShader(fragmentShader);
    
            var shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            gl.useProgram(shaderProgram);
            var positionLocation = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            var resolutionLocation = gl.getUniformLocation(shaderProgram, "resolution");
            gl.uniform2f(resolutionLocation, renderContext.getCanvasWebGL().getAttribute("width"), renderContext.getCanvasWebGL().getAttribute("height"));
    
    
            var matrixSize = gl.getUniformLocation(shaderProgram, "resolution");
            gl.uniform1f(matrixSize, 1);
    
            var tM = new Float32Array(this.getTransformationMatrix().all());
            var matrix = gl.getUniformLocation(shaderProgram, "matrix");
            gl.uniformMatrix3fv(matrix, false, tM);
    
            var position = this.getPoints()[0];
            gl.bufferData(gl.ARRAY_BUFFER,
                          new Float32Array([
                          position.x, position.y,
                          position.x + this.width, position.y,
                          position.x, position.y + this.height,
                          position.x, position.y + this.height,
                          position.x + this.width, position.y,
                          position.x + this.width, position.y + this.height]), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            return true;
        }
    
        private generateVertexShaderSource():string {
            var vertexShaderSource: string =
                "attribute vec2 aVertexPosition;                               \n" +
                "                                                              \n" +
                "uniform int matrix_size;                                      \n" +
                "uniform mat3 matrix;                                          \n" +
                "uniform vec2 resolution;                                      \n" +
                "                                                              \n" +
                "void main() {                                                 \n" +
                "  vec2 pos = (matrix * vec3(aVertexPosition, 1)).xy;          \n" +
                "  vec2 tmp1 = pos / (resolution);                             \n" +
                "  vec2 tmp2 = tmp1 * 2.0;                                     \n" +
                "  vec2 tmp3 = tmp2 - 1.0;                                     \n" +
                "  gl_Position = vec4(tmp3 , 0, 1);                            \n" +
                "}                                                             \n";
    
    
            return vertexShaderSource;
        }
    
        private generateFragmentShaderSource():string {
            var fragmentShaderSrc =
                "precision mediump float;                                      \n" +
                "                                                              \n" +
                "void main() {                                                 \n" +
                "  gl_FragColor = vec4("+this.colourNode.getR()+","+this.colourNode.getG()+","+this.colourNode.getB()+","+this.colourNode.getA()+");                          \n" +
                "}                                                             \n";
    
    
            return fragmentShaderSrc;
        }
    
        public toSVGString(renderContext: RenderContext): string {
            var svgString: string = "";
            var xmlTag = new XMLTag("rect");
            var position = this.getPoints()[0];
    
            var transformationMatrix: TSM.mat3 = this.getTransformationMatrix();
            var mirrorMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix: TSM.mat3 = mirrorMatrix.copy().multiply(transformationMatrix);
    
            xmlTag.addAttribute("width", String(this.width));
            xmlTag.addAttribute("height", String(this.height));
            xmlTag.addAttribute("x", String(position.x));
            xmlTag.addAttribute("y", String(position.y));
            xmlTag.addAttribute("fill", String(this.colourNode.getCss3String()));
            xmlTag.addAttribute("stroke", "none");
            xmlTag.addAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " +  resultMatrix.at(3) + " " + resultMatrix.at(4) + " " +  resultMatrix.at(6) + " " + resultMatrix.at(7) + ")");
    
            svgString = xmlTag.getEmptyElementTag() + "\n";
    
            return svgString;
        }
    
        public copy(): Rectangle {
            return new Rectangle(this.width, this.height, this.getPoints()[0].x, this.getPoints()[0].y, this.colourNode.getRGBAString());
        }
    
     }

}
