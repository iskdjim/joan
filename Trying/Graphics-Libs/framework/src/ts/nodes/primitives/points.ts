/// <reference path="../../general/constants.ts" />
/// <reference path="../graphNode.ts" />
/// <reference path="../sceneGraphLeaf.ts" />
/// <reference path="../materials/colour.ts" />
/// <reference path="../../helper/xmlTag.ts" />
/// <reference path="../../helper/fdglMath.ts" />
/// <reference path="../../general/renderContext.ts" />


module Plexx {

    export class Points extends SceneGraphLeaf {
    
        private type: Constants.PointsType;
    
        private size: number;
    
        private borderColour: Colour;
    
        constructor(points: number[],
                    type?: Constants.PointsType,
                    size?: number,
                    borderColourString?: string) {
            super();
            this.setPointsFromArray(points);
            this.type = type || Constants.POINTS_DEFAULT_TYPE_ID;
            this.size = size || Constants.POINTS_DEFAULT_SIZE;
            this.borderColour = new Colour(borderColourString);
        }
    
        public setType(typeId: number) {
            this.type = typeId;
        }
    
        public getType(): number {
            return this.type;
        }
    
        public setBorderColour(borderColour: string) {
            this.borderColour.setColour(borderColour);
        }
    
        public getBorderColour(): string {
            return this.borderColour.getRGBString();
        }
    
        public render(renderContext: RenderContext): boolean {
            var currentRenderType = renderContext.getRenderType();
    
            if (currentRenderType == RenderType.CANVAS2D) {
                this.updateCanvas2d(renderContext);
            }
            else if (currentRenderType == RenderType.SVG) {
                this.updateSVG(renderContext);
            }
            else if (currentRenderType == RenderType.WEBGL) {
                this.updateWebGL(renderContext);
            }
            return true;
        }
    
        private updateCanvas2d(renderContext:RenderContext): boolean {
            var transformationMatrix: TSM.mat3 = this.getTransformationMatrix();
            var mirrorMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix: TSM.mat3 = mirrorMatrix.copy().multiply(transformationMatrix);
    
            if (this.type == Constants.PointsType.HollowCircle) {
                var context2D = renderContext.getCanvas2D().getContext("2d");
                context2D.save();
                context2D.setTransform(resultMatrix.at(0), resultMatrix.at(1), resultMatrix.at(3), resultMatrix.at(4), resultMatrix.at(6), resultMatrix.at(7));
    
                for (var i = 0; i< this.getPoints().length; i++) {
                    context2D.beginPath();
                    context2D.arc(this.getPoints()[i].x, this.getPoints()[i].y, this.size, 0, 2 * Math.PI, false);
                    context2D.fillStyle = "rgba(255, 255, 255, 0)";
                    context2D.fill();
                    context2D.strokeStyle = this.borderColour.getRGBString();
                    context2D.lineWidth = 0;
                    context2D.closePath();
                    context2D.stroke();
                }
    
                context2D.stroke();
                context2D.closePath();
                context2D.restore();
            }
            else if (this.type == Constants.PointsType.HollowDiamond) {
                var context2D = renderContext.getCanvas2D().getContext("2d");
    
                for (var i = 0; i < this.getPoints().length; i++) {
                    var currentPosition = this.getPoints()[i];
                    var x: number = this.getPoints()[i].x;
                    var y: number = this.getPoints()[i].y;
                    var s: number = this.size;
    
                    context2D.save();
                        context2D.setTransform(resultMatrix.at(0), resultMatrix.at(1), resultMatrix.at(3), resultMatrix.at(4), resultMatrix.at(6), resultMatrix.at(7));
                        context2D.lineWidth = 1;
                        context2D.translate(x, y);
                        context2D.rotate(Math.PI / 4);
                        context2D.fillStyle = this.borderColour.getRGBString();
                        context2D.strokeStyle = this.borderColour.getRGBString();
                        context2D.strokeRect((s / 2) * (-1), (s / 2) * (-1), this.size, this.size);
                        context2D.translate(-x, -y);
                    context2D.restore();
                }
            }
            return true;
        }
    
        private updateSVG(renderContext: RenderContext): boolean {
    
            var transformationMatrix: TSM.mat3 = this.getTransformationMatrix();
            var mirrorMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix: TSM.mat3 = mirrorMatrix.copy().multiply(transformationMatrix);
    
            if(this.type == Constants.PointsType.HollowCircle) {
                for (var i = 0; i < this.getPoints().length; i++) {
                    var SVGPoint = document.createElementNS(Constants.SVG_NAMESPACE, "circle");
                    var currentPosition = this.getPoints()[i];
    
                    SVGPoint.setAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " +  resultMatrix.at(3) + " " + resultMatrix.at(4) + " " +  resultMatrix.at(6) + " " + resultMatrix.at(7) + ")");
                    SVGPoint.setAttribute("r", String(this.size));
                    SVGPoint.setAttribute("cx", String(currentPosition.x));
                    SVGPoint.setAttribute("cy", String(currentPosition.y));
                    SVGPoint.setAttribute("fill", "none");
                    SVGPoint.setAttribute("stroke", this.borderColour.getRGBString());
                    renderContext.getSVG().appendChild(SVGPoint);
                }
            }
            else if(this.type == Constants.PointsType.HollowDiamond) {
                for (var i= 0; i < this.getPoints().length; i++) {
                    var currentPosition = this.getPoints()[i];
                    var x = currentPosition.x;
                    var y = currentPosition.y;
                    var s = this.size;
                    var SVGPoint = document.createElementNS(Constants.SVG_NAMESPACE, "rect");
    
                    SVGPoint.setAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " +  resultMatrix.at(3) + " " + resultMatrix.at(4) + " " +  resultMatrix.at(6) + " " + resultMatrix.at(7) + ") rotate(45, " + (x) + " ," + (y) + ")");
                    SVGPoint.setAttribute("width", String(s));
                    SVGPoint.setAttribute("height", String(s));
                    SVGPoint.setAttribute("x", String(x - s/2));
                    SVGPoint.setAttribute("y", String(y - s/2));
                    SVGPoint.setAttribute("fill", "none");
                    SVGPoint.setAttribute("stroke", this.borderColour.getRGBString());
                    renderContext.getSVG().appendChild(SVGPoint);
                }
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
            var rotationLocation = gl.getUniformLocation(shaderProgram, "rotation");
            gl.uniform2f(resolutionLocation, renderContext.getCanvasWebGL().getAttribute("width"), renderContext.getCanvasWebGL().getAttribute("height"));
            gl.uniform2f(rotationLocation, 0, 1);
    
            var tM = new Float32Array(this.getTransformationMatrix().all());
            var matrix = gl.getUniformLocation(shaderProgram, "matrix");
            gl.uniformMatrix3fv(matrix, false, tM);
    
            if (this.type == Constants.PointsType.HollowCircle) {
                for (var i: number = 0; i < this.getPoints().length; i++) {
                    var currentPosition = this.getPoints()[i];
                    var n: number = Constants.PRIMITIVES_POINTS_CIRCLE_SIDES;
                    var s: number = this.size;
                    var polygonVertices = new Float32Array(2 * n);
    
                    for (var j = 0; j < n; j++) {
                        polygonVertices[2 * j] = s * Math.cos(2 * (Math.PI / n) * j) + currentPosition.x;
                        polygonVertices[(2 * j) + 1] = s * Math.sin(2 * (Math.PI / n) * j) + currentPosition.y;
                    }
    
                    gl.bufferData(gl.ARRAY_BUFFER, polygonVertices, gl.STATIC_DRAW);
                    gl.enableVertexAttribArray(positionLocation);
                    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
                    gl.drawArrays(gl.LINE_LOOP, 0, n);
                }
            }
            else if (this.type == Constants.PointsType.HollowDiamond) {
                for (var i: number = 0; i < this.getPoints().length; i++) {
                    var currentPosition = this.getPoints()[i];
                    var n: number = Constants.PRIMITIVES_POINTS_CIRCLE_SIDES;
                    var s: number = this.size;
                    var polygonVertices = new Float32Array(2 * n);
    
                    for (var j = 0; j <= 4; j++) {
                        polygonVertices[2 * j] = Math.sqrt(2) * (s / 2) * Math.cos(2 * (Math.PI / 4) * j) + currentPosition.x;
                        polygonVertices[(2 * j) + 1] = Math.sqrt(2) * (s / 2) * Math.sin(2 * (Math.PI / 4) * j) + currentPosition.y;
                    }
    
                    gl.bufferData(gl.ARRAY_BUFFER, polygonVertices, gl.STATIC_DRAW);
                    gl.enableVertexAttribArray(positionLocation);
                    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
                    gl.drawArrays(gl.LINE_LOOP, 0, 4);
                    gl.lineWidth(1);
                }
            }
            return true;
        }
    
        private generateVertexShaderSource():string {
            var vertexShaderSource =
                "attribute vec2 aVertexPosition;                             \n" +
                "                                                            \n" +
                "uniform vec2 resolution;                                    \n" +
                "uniform vec2 rotation;                                      \n" +
                "uniform vec2 translation;                                      \n" +
                "                                                            \n" +
                "uniform mat3 matrix;                                          \n" +
                "                                                              \n" +
                "void main() {                                                 \n" +
                "  vec2 pos = (matrix * vec3(aVertexPosition, 1)).xy;          \n" +
                "  vec2 rotatedPosition = vec2(                              \n" +
                "       aVertexPosition.x * rotation.y + pos.y * rotation.x,           \n" +
                "       aVertexPosition.y * rotation.y - pos.x * rotation.x);          \n" +
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
                this.borderColour.getR() + ", " +
                this.borderColour.getG() + ", " +
                this.borderColour.getB() + ", " +
                this.borderColour.getA() + ");                               \n" +
                "}                                                           \n";
    
            return fragmentShaderSrc;
        }
    
        public toSVGString(): string {
            var svgString: string = "";
    
            if(this.type == Constants.PointsType.HollowCircle) {
                for (var i = 0; i < this.getPoints().length; i++) {
                    var xmlTag = new XMLTag("circle");
                    var x = this.getPoints()[i].x;
                    var y = this.getPoints()[i].y;
                    var s = this.size;
    
                    xmlTag.addAttribute("r", String(s));
                    xmlTag.addAttribute("cx", String(x));
                    xmlTag.addAttribute("cy", String(y));
                    xmlTag.addAttribute("fill", "none");
                    xmlTag.addAttribute("stroke", "" + this.borderColour.getRGBString());
                    svgString += xmlTag.getEmptyElementTag() + "\n";
                }
            }
            else if(this.type == Constants.PointsType.HollowDiamond) {
                for (var i= 0; i < this.getPoints().length; i++) {
                    var xmlTag = new XMLTag("rect");
                    var x = this.getPoints()[i].x;
                    var y = this.getPoints()[i].y;
                    var s = this.size;
    
                    xmlTag.addAttribute("width", String(s));
                    xmlTag.addAttribute("height", String(s));
                    xmlTag.addAttribute("x", String(x));
                    xmlTag.addAttribute("y", String(y));
                    xmlTag.addAttribute("fill", "none");
                    xmlTag.addAttribute("stroke", "" + this.borderColour.getRGBString());
                    xmlTag.addAttribute("transform", "rotate(45, " + (x + (s / 2)) + " ," + (y + (s / 2)) + ")");
                    svgString += xmlTag.getEmptyElementTag() + "\n";
                }
            }
            return svgString;
        }
    
        public copy(): Points {
            return new Points(this.getPointsAsArray(), this.type, this.size, this.borderColour.getRGBAString());
        }
     }
    
}
