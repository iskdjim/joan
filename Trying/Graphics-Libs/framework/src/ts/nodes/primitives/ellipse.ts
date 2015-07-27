/// <reference path="../../general/constants.ts" />
/// <reference path="../graphNode.ts" />
/// <reference path="../sceneGraphLeaf.ts" />
/// <reference path="../materials/colour.ts" />
/// <reference path="../../helper/xmlTag.ts" />
/// <reference path="../../general/renderContext.ts" />


module Plexx {

    export class Ellipse extends SceneGraphLeaf {
    
        private radiusX: number;
        private radiusY: number;
        private colourNode: Colour;
    
        private circleSides = 128;
    
        constructor(radiusX: number,
                    radiusY: number,
                    posX?: number,
                    posY?: number,
                    colour?: string) {
            super("Ellipse");
            this.setPoints([new TSM.vec2([posX, posY])]);
            this.radiusX = radiusX || Constants.DEFAULT_HEIGHT;
            this.radiusY = radiusY || Constants.DEFAULT_HEIGHT;
            this.colourNode = new Colour(colour);
    
            console.log("[FDGL] " + this.toString() + " created");
        }
    
        public toString() {
            var textString: string = "";
    
            textString = this.getName() + " { points = [ ";
            for (var index: number = 0; index < this.getPoints().length; index++) {
                if (index == 0) textString += this.getPoints()[index];
                textString += ", " + this.getPoints()[index];
            }
            textString += "],"
    
            return textString;
        }
    
        public setRadiusX(radiusX: number) {
            this.radiusX = radiusX;
        }
    
        public setRadiusY(radiusY: number) {
            this.radiusY = radiusY;
        }
    
        public getRadiusX(): number {
            return this.radiusX;
        }
    
        public getRadiusY(): number {
            return this.radiusY;
        }
        public setColour(colour:string) {
            this.colourNode.setColour(colour);
        }
    
        public getColour(): string {
            return this.colourNode.getRGBString();
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
                context.beginPath();
                    context.setTransform(resultMatrix.at(0), resultMatrix.at(1), resultMatrix.at(3), resultMatrix.at(4), resultMatrix.at(6), resultMatrix.at(7));
                    context.translate(position.x, position.y);
                    context.scale(this.radiusX, this.radiusY);
                    context.arc(0, 0, 1, 0, 2 * Math.PI, false);
                    context.fillStyle = this.colourNode.getCss3String();
                    context.fill();
                    context.strokeStyle = "none"
                context.closePath();
            context.restore();
    
            return true;
        }
    
        private updateSVG(renderContext: RenderContext): boolean {
            var SVGObject = document.createElementNS(Constants.SVG_NAMESPACE, "ellipse");
            var position: TSM.vec2 = this.getPoints()[0];
            var canvasHeight = renderContext.getHeight();
    
            var transformationMatrix: TSM.mat3 = this.getTransformationMatrix();
            var mirrorMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix: TSM.mat3 = mirrorMatrix.copy().multiply(transformationMatrix);
    
            SVGObject.setAttribute("cx", String(position.x));
            SVGObject.setAttribute("cy", String(position.y));
            SVGObject.setAttribute("rx", String(this.radiusX));
            SVGObject.setAttribute("ry", String(this.radiusY));
            SVGObject.setAttribute("fill", this.colourNode.getCss3String());
            SVGObject.setAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " +  resultMatrix.at(3) + " " + resultMatrix.at(4) + " " +  resultMatrix.at(6) + " " + resultMatrix.at(7) + ")");
            SVGObject.setAttribute("stroke", "none");
    
            renderContext.getSVG().appendChild(SVGObject);
    
            return true;
        }
    
        private updateWebGL(renderContext:RenderContext): boolean {
            var gl = <WebGLRenderingContext> renderContext.getCanvasWebGL().getContext("webgl");
    
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
            console.log(resolutionLocation);
            gl.uniform2f(resolutionLocation, renderContext.getCanvasWebGL().getAttribute("width"), renderContext.getCanvasWebGL().getAttribute("height"));
    
            var tM = new Float32Array(this.getTransformationMatrix().all());
            var matrix = gl.getUniformLocation(shaderProgram, "matrix");
            gl.uniformMatrix3fv(matrix, false, tM);
    
            var polygonVertices = new Float32Array ( 2 * (this.circleSides));
            var position: TSM.vec2 = this.getPoints()[0];
            var canvasHeight = renderContext.getHeight();
    
            for (var i = 0; i < this.circleSides; i++) {
                polygonVertices[2 * i] = this.radiusX*Math.cos(2 * Math.PI / this.circleSides * i) + position.x;
                polygonVertices[(2 * i) + 1] = this.radiusY*Math.sin(2 * Math.PI / this.circleSides * i) + position.y;
            }
    
            gl.bufferData(gl.ARRAY_BUFFER, polygonVertices, gl.STATIC_DRAW);
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, this.circleSides);
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
            console.log("  gl_FragColor = vec4("+this.colourNode.getR()+","+this.colourNode.getG()+","+this.colourNode.getB()+","+this.colourNode.getA()+");                          \n")
            var fragmentShaderSrc =
                "precision mediump float;                                    \n" +
                "                                                            \n" +
                "void main() {                                               \n" +
                "  gl_FragColor = vec4("+this.colourNode.getR()+","+this.colourNode.getG()+","+this.colourNode.getB()+","+this.colourNode.getA()+");                          \n" +
                "}                                                           \n";
    
    
            return fragmentShaderSrc;
        }
    
        public toSVGString(renderContext: RenderContext): string {
            var position: TSM.vec2 = this.getPoints()[0];
            var canvasHeight = renderContext.getHeight();
    
            var svgString: string = "";
            var xmlTag = new XMLTag("ellipse");
    
            xmlTag.addAttribute("cx", String(position.x));
            xmlTag.addAttribute("cy", String(position.y));
            xmlTag.addAttribute("rX", "" + this.radiusX);
            xmlTag.addAttribute("rY", "" + this.radiusY);
            xmlTag.addAttribute("fill", "" + this.colourNode.getRGBString());
            xmlTag.addAttribute("stroke", "none");
            svgString = xmlTag.getEmptyElementTag() + "\n";
            return svgString;
        }
    
        public copy(): Ellipse {
            return new Ellipse(this.getPoints()[0].x, this.getPoints()[0].y, this.radiusX, this.radiusY, this.colourNode.getRGBAString());
        }
     }
}
