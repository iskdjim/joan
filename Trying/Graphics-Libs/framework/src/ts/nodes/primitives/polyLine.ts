/// <reference path="../../general/constants.ts" />
/// <reference path="../graphNode.ts" />
/// <reference path="../sceneGraphLeaf.ts" />
/// <reference path="../materials/colour.ts" />
/// <reference path="../../helper/xmlTag.ts" />
/// <reference path="../../general/renderContext.ts" />


module Plexx {

    export class PolyLine extends SceneGraphLeaf {
    
        private width: number;
        private type: Constants.LineType;
        private colour: Colour;
    
        constructor(points: number[],
                    width?: number,
                    type?: Constants.LineType,
                    colourValue?: string) {
            super("PolyLine");
            this.setPointsFromArray(points);
            this.width = width || Constants.DEFAULT_HEIGHT;
            this.type = type || Constants.LineType.Default;
            this.colour= new Colour(colourValue);
    
            console.log("[FDGL] " + this.toString() + " created");
        }
    
        public setType(typeId: number) {
            this.type = typeId;
        }
    
        public getType(): number {
            return this.type;
        }
    
        public setColour(colour: string) {
            this.colour.setColour(colour);
        }
    
        public getColour(): string {
            return this.colour.getRGBString();
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
            var context2D = renderContext.getCanvas2D().getContext("2d");
    
            var transformationMatrix: TSM.mat3 = this.getTransformationMatrix();
            var mirrorMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix: TSM.mat3 = mirrorMatrix.copy().multiply(transformationMatrix);
    
            if (this.type == Constants.LineType.Default) {
                context2D.save();
                    context2D.setTransform(resultMatrix.at(0), resultMatrix.at(1), resultMatrix.at(3), resultMatrix.at(4), resultMatrix.at(6), resultMatrix.at(7));
                    context2D.beginPath();
                        context2D.moveTo(this.getPoints()[0].x, this.getPoints()[0].y);
                        for (var i: number = 1; i < this.getPoints().length; i++) {
                            context2D.lineTo(this.getPoints()[i].x, this.getPoints()[i].y);
                        }
                        context2D.fillStyle = "rgba(255, 255, 255, 0)";
                        context2D.fill();
                        context2D.strokeStyle = this.colour.getRGBString();
                        context2D.lineWidth = this.width;
                    context2D.stroke();
                context2D.restore();
            }
            return true;
        }
    
        private updateSVG(renderContext: RenderContext): boolean {
    
            var transformationMatrix: TSM.mat3 = this.getTransformationMatrix();
            var mirrorMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix: TSM.mat3 = mirrorMatrix.copy().multiply(transformationMatrix);
    
            if (this.type == Constants.LineType.Default) {
                var SVGPoint = document.createElementNS(Constants.SVG_NAMESPACE, "polyline");
                var pointString: string = String(this.getPoints()[0].x) + "," + String(this.getPoints()[0].y);
                for (var i: number = 1; i < this.getPoints().length; i++) {
                    pointString += " " + String(this.getPoints()[i].x) + "," + String(this.getPoints()[i].y);
                }
                SVGPoint.setAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " +  resultMatrix.at(3) + " " + resultMatrix.at(4) + " " +  resultMatrix.at(6) + " " + resultMatrix.at(7) + ")")
                SVGPoint.setAttribute("points", pointString);
                SVGPoint.setAttribute("stroke", this.colour.getRGBString());
                SVGPoint.setAttribute("fill", "none");
                SVGPoint.setAttribute("stroke-width", String(this.width));
                renderContext.getSVG().appendChild(SVGPoint);
            }
    
            return true;
        }
    
        private updateWebGL(renderContext:RenderContext): boolean {
            var gl = <WebGLRenderingContext> renderContext.getCanvasWebGL().getContext("webgl");
    
            // vertex shader
            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, this.generateVertexShaderSource());
            gl.compileShader(vertexShader);
    
            // fragment shader
            var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, this.generateFragmentShaderSource());
            gl.compileShader(fragmentShader);
    
            // shaderProgram
            var shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            gl.useProgram(shaderProgram);
            var positionLocation = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    
            // buffer
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            var resolutionLocation = gl.getUniformLocation(shaderProgram, "resolution");
            console.log(resolutionLocation);
            gl.uniform2f(resolutionLocation, renderContext.getCanvasWebGL().getAttribute("width"), renderContext.getCanvasWebGL().getAttribute("height"));
            gl.lineWidth(this.width);
            gl.uniform2f(rotationLocation, 0, 1);
            var polygonVertices = new Float32Array(2 * this.getPoints().length);
            for (var i = 0; i < this.getPoints().length; i++) {
                polygonVertices[2*i] = this.getPoints()[i].x;
                polygonVertices[(2 * i) + 1] = this.getPoints()[i].y;
            }
    
            var tM = new Float32Array(this.getTransformationMatrix().all());
            var matrix = gl.getUniformLocation(shaderProgram, "matrix");
            var rotationLocation = gl.getUniformLocation(shaderProgram, "rotation");
            gl.uniformMatrix3fv(matrix, false, tM);
    
    
    
            gl.bufferData(gl.ARRAY_BUFFER, polygonVertices, gl.STATIC_DRAW);
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            var rotation = [0, 1];
            gl.uniform2fv(rotationLocation, rotation);
            gl.drawArrays(gl.LINE_STRIP, 0, this.getPoints().length);
            return true;
        }
    
        private generateVertexShaderSource():string {
            var vertexShaderSource =
                "attribute vec2 aVertexPosition;                               \n" +
                "                                                              \n" +
                "uniform vec2 resolution;                                      \n" +
                "uniform vec2 rotation;                                        \n" +
                "uniform vec2 translation;                                     \n" +
                "                                                              \n" +
                "uniform mat3 matrix;                                          \n" +
                "                                                              \n" +
                "void main() {                                                 \n" +
                "  vec2 pos = (matrix * vec3(aVertexPosition, 1)).xy;          \n" +
                "  vec2 rotatedPosition = vec2(                                \n" +
                "       aVertexPosition.x * rotation.y + pos.y * rotation.x,   \n" +
                "       aVertexPosition.y * rotation.y - pos.x * rotation.x);  \n" +
                "  vec2 position = rotatedPosition + translation;                 \n" +
                "  vec2 tmp1 = position / resolution;                 \n" +
                "  vec2 tmp2 = tmp1 * 2.0;                                   \n" +
                "  vec2 tmp3 = tmp2 - 1.0;                                   \n" +
                "  gl_Position = vec4(tmp3, 0, 1);             \n" +
                "}                                                           \n";
    
            return vertexShaderSource;
        }
    
        private generateFragmentShaderSource():string {
            var fragmentShaderSrc =
                "precision mediump float;                                    \n" +
                "                                                            \n" +
                "void main() {                                               \n" +
                "  gl_FragColor = vec4(" + 
                this.colour.getR() + ", " +
                this.colour.getG() + ", " +
                this.colour.getB() + ", " +
                this.colour.getA() + ");                                     \n" +
                "}                                                           \n";
    
            return fragmentShaderSrc;
        }
    
        public toSVGString(): string {
            var svgString: string = "";
    
            return svgString;
        }
    
        public copy(): PolyLine {
            return new PolyLine(this.getPointsAsArray(), this.width, this.type, this.colour.getRGBAString());
        }
     }
    
}
