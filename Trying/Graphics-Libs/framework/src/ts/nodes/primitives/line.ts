/// <reference path="../../general/constants.ts" />
/// <reference path="../graphNode.ts" />
/// <reference path="../sceneGraphLeaf.ts" />
/// <reference path="../materials/colour.ts" />
/// <reference path="../../helper/xmlTag.ts" />
/// <reference path="../../general/renderContext.ts" />


module Plexx {

    export class Line extends SceneGraphLeaf {
    
        private width: number;
        private type: Constants.LineType;
        private colour: Colour;
        private startArrow: boolean;
        private endArrow: boolean;
        private arrowScale: number = 10;
        private i: number;
    
        constructor(x1: number,
                    y1: number,
                    x2: number,
                    y2: number,
                    width?: number,
                    type?: Constants.LineType,
                    colourValue?: string,
                    startArrow?: boolean,
                    endArrow?: boolean) {
            super("Line");
            this.i = 0;
            this.setPointsFromArray([x1, y1, x2, y2]);
            this.width = width || Constants.DEFAULT_HEIGHT;
            this.type = type || Constants.LineType.Default;
            this.colour = new Colour(colourValue);
            this.startArrow = startArrow || false;
            this.endArrow = endArrow || false;
    
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
            var phi: number = 0;
            var x1: number = this.getPoints()[0].x;
            var y1: number = this.getPoints()[0].y;
            var x2: number = this.getPoints()[1].x;
            var y2: number = this.getPoints()[1].y;
            var x3: number = 0;
            var y3: number = 0;
            var x4: number = 0;
            var y4: number = 0;
            var l: number = Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1));
    
            var transformationMatrix: TSM.mat3 = this.getTransformationMatrix();
            var mirrorMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix: TSM.mat3 = mirrorMatrix.copy().multiply(transformationMatrix);
    
            var context2D = renderContext.getCanvas2D().getContext("2d");
            context2D.setTransform(resultMatrix.at(0), resultMatrix.at(1), resultMatrix.at(3), resultMatrix.at(4), resultMatrix.at(6), resultMatrix.at(7));
    
            if (this.type == Constants.LineType.Default) {
                context2D.beginPath();
                    if (this.startArrow) {
                        phi = Math.atan2(y1 - y2, x1 - x2);
                        x4 = x2 + (l - this.arrowScale * 5) * Math.cos(phi);
                        y4 = y2 + (l - this.arrowScale * 5) * Math.sin(phi);
                    }
                    else {
                        x4 = x1;
                        y4 = y1;
                    }
                    context2D.moveTo(x4, y4);
                    if (this.endArrow) {
                        phi = Math.atan2(y2 - y1, x2 - x1);
                        x3 = x1 + (l - this.arrowScale * 5) * Math.cos(phi);
                        y3 = y1 + (l - this.arrowScale * 5) * Math.sin(phi);
                    }
                    else {
                        x3 = x2;
                        y3 = y2;
                    }
                    context2D.lineTo(x3, y3);
                    context2D.strokeStyle = this.colour.getCss3String();
                    context2D.fill();
                    context2D.lineWidth = this.width;
                context2D.closePath();
                context2D.stroke();
            }
    
            if (this.startArrow) {
                var s: number = this.arrowScale;
                context2D.save();
                    context2D.lineWidth = 1;
                    context2D.translate(x1, y1);
                    context2D.rotate(Math.PI + Math.atan2(y2 - y1, x2 - x1));
                    context2D.beginPath();
                        context2D.moveTo(-5 * s, s);
                        context2D.lineTo(-5 * s, -s);
                        context2D.lineTo(0 , 0);
                        context2D.fillStyle = this.colour.getRGBString();
                        context2D.fill();
                        context2D.strokeStyle = "none";
                        context2D.lineWidth = 0;
                    context2D.closePath();
                    context2D.translate(-x1, -y1);
                    context2D.stroke();
                context2D.restore();
            }
    
            if (this.endArrow) {
                var s: number = 10;
                context2D.save();
                    context2D.lineWidth = 1;
                    context2D.translate(x2, y2);
                    context2D.rotate(Math.atan2(y2 - y1, x2 - x1));
                    context2D.beginPath();
                        context2D.moveTo(-5 * s, s);
                        context2D.lineTo(-5 * s, -s);
                        context2D.lineTo(0 , 0);
                        context2D.fillStyle = this.colour.getRGBString();
                        context2D.fill();
                        context2D.strokeStyle = "none";
                        context2D.lineWidth = 0;
                    context2D.closePath();
                    context2D.translate(-x2, -y2);
                    context2D.stroke();
                context2D.restore();
            }
            return true;
        }
    
        private updateSVG(renderContext: RenderContext): boolean {
            var phi: number = 0;
            var x1: number = this.getPoints()[0].x;
            var y1: number = this.getPoints()[0].y;
            var x2: number = this.getPoints()[1].x;
            var y2: number = this.getPoints()[1].y;
            var x3: number = 0;
            var y3: number = 0;
            var x4: number = 0;
            var y4: number = 0;
            var l: number = Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1));
    
            var transformationMatrix: TSM.mat3 = this.getTransformationMatrix();
            var mirrorMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix: TSM.mat3 = mirrorMatrix.copy().multiply(transformationMatrix);
    
            // draw line
            if (this.type == Constants.LineType.Default) {
                var SVGPoint = document.createElementNS(Constants.SVG_NAMESPACE, "line");
                SVGPoint.setAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " +  resultMatrix.at(3) + " " + resultMatrix.at(4) + " " +  resultMatrix.at(6) + " " + resultMatrix.at(7) + ")");
                if (this.startArrow) {
                    phi = Math.atan2(y1 - y2, x1 - x2);
                    x4 = x2 + (l - this.arrowScale * 5) * Math.cos(phi);
                    y4 = y2 + (l - this.arrowScale * 5) * Math.sin(phi);
                }
                else {
                    x4 = x1;
                    y4 = y1;
                }
                if (this.endArrow) {
                    phi = Math.atan2(y2 - y1, x2 - x1);
                    x3 = x1 + (l - this.arrowScale * 5) * Math.cos(phi);
                    y3 = y1 + (l - this.arrowScale * 5) * Math.sin(phi);
                }
                else {
                    x3 = x2;
                    y3 = y2;
                }
                SVGPoint.setAttribute("x1", String(x3));
                SVGPoint.setAttribute("y1", String(y3));
                SVGPoint.setAttribute("x2", String(x4));
                SVGPoint.setAttribute("y2", String(y4));
                SVGPoint.setAttribute("stroke", this.colour.getRGBString());
                SVGPoint.setAttribute("stroke-width", String(this.width));
                renderContext.getSVG().appendChild(SVGPoint);
            }
    
    
            // draw start arrow
    
            if (this.startArrow) {
                var s: number = this.arrowScale;
                var SVGObject = document.createElementNS(Constants.SVG_NAMESPACE, "polygon");
                //            SVGObject.setAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " +  resultMatrix.at(3) + " " + resultMatrix.at(4) + " " +  resultMatrix.at(6) + " " + resultMatrix.at(7) + ")");
                SVGObject.setAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " +  resultMatrix.at(3) + " " + resultMatrix.at(4) + " " +  resultMatrix.at(6) + " " + resultMatrix.at(7) + ") rotate(" + ((Math.PI + Math.atan2(y2 - y1, x2 - x1)) * 180 / Math.PI) + "," + String(x1) + "," + String(y1) + ") ");
                SVGObject.setAttribute("points", String(x1 + -5 * s) + "," + String(y1 + s) + " " +
                                                 String(x1 + -5 * s) + "," + String(y1 - s) + " " +
                                                 String(x1) + "," + String(y1));
                SVGObject.setAttribute("fill", this.colour.getRGBString());
                SVGObject.setAttribute("stroke", "none");
                renderContext.getSVG().appendChild(SVGObject);
            }
    
    
            // draw end arrow
    
            if (this.endArrow) {
                var s: number = this.arrowScale;
                var SVGObject2 = document.createElementNS(Constants.SVG_NAMESPACE, "polygon");
                SVGObject2.setAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " +  resultMatrix.at(3) + " " + resultMatrix.at(4) + " " +  resultMatrix.at(6) + " " + resultMatrix.at(7) + ") rotate(" + ((Math.atan2(y2 - y1, x2 - x1)) * 180 / Math.PI) + "," + String(x2) + "," + String(y2) + ") ");
                SVGObject2.setAttribute("points", String(x2 -5 * s) + "," + String(y2 + s) + " " +
                                                 String(x2 -5 * s) + "," + String(y2 - s) + " " +
                                                 String(x2) + "," + String(y2));
                SVGObject2.setAttribute("fill", this.colour.getRGBString());
                SVGObject2.setAttribute("stroke", "none");
                renderContext.getSVG().appendChild(SVGObject2);
            }
    
            return true;
        }
    
        private updateWebGL(renderContext:RenderContext): boolean {
            var phi: number = 0;
            var x1: number = this.getPoints()[0].x;
            var y1: number = this.getPoints()[0].y;
            var x2: number = this.getPoints()[1].x;
            var y2: number = this.getPoints()[1].y;
            var x3: number = 0;
            var y3: number = 0;
            var x4: number = 0;
            var y4: number = 0;
            var l: number = Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1));
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
            var translationLocation = gl.getUniformLocation(shaderProgram, "translation");
            console.log(resolutionLocation);
            gl.uniform2f(resolutionLocation, renderContext.getCanvasWebGL().getAttribute("width"), renderContext.getCanvasWebGL().getAttribute("height"));
            gl.uniform2f(rotationLocation, Math.sqrt(2) / 2, Math.sqrt(2));
            gl.lineWidth(this.width);
    
            var tM = new Float32Array(this.getTransformationMatrix().all());
            var matrix = gl.getUniformLocation(shaderProgram, "matrix");
            gl.uniformMatrix3fv(matrix, false, tM);
    
            if (this.type == Constants.LineType.Default) {
                var polygonVertices = new Float32Array(4);
    
                if (this.startArrow) {
                    phi = Math.atan2(y1 - y2, x1 - x2);
                    x4 = x2 + (l - this.arrowScale * 5) * Math.cos(phi);
                    y4 = y2 + (l - this.arrowScale * 5) * Math.sin(phi);
                }
                else {
                    x4 = x1;
                    y4 = y1;
                }
                if (this.endArrow) {
                    phi = Math.atan2(y2 - y1, x2 - x1);
                    x3 = x1 + (l - this.arrowScale * 5) * Math.cos(phi);
                    y3 = y1 + (l - this.arrowScale * 5) * Math.sin(phi);
                }
                else {
                    x3 = x2;
                    y3 = y2;
                }
                polygonVertices[0] = x3;
                polygonVertices[1] = y3;
                polygonVertices[2] = x4;
                polygonVertices[3] = y4;
    
                gl.bufferData(gl.ARRAY_BUFFER, polygonVertices, gl.STATIC_DRAW);
                gl.enableVertexAttribArray(positionLocation);
                gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
                var rotation = [0, 1];
                gl.uniform2fv(translationLocation, [0, 0]);
                gl.uniform2fv(rotationLocation, rotation);
                gl.drawArrays(gl.LINE_STRIP, 0, 2);
            }
    
            if (this.endArrow) {
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
                var rotationLocation = gl.getUniformLocation(shaderProgram, "rotation");
                var resolutionLocation = gl.getUniformLocation(shaderProgram, "resolution");
                var translationLocation = gl.getUniformLocation(shaderProgram, "translation");
    
                var tM = new Float32Array(this.getTransformationMatrix().all());
                var matrix = gl.getUniformLocation(shaderProgram, "matrix");
                gl.uniformMatrix3fv(matrix, false, tM);
    
                gl.lineWidth(this.width);
                var s: number = this.arrowScale;
                gl.bufferData(gl.ARRAY_BUFFER,
                              new Float32Array([
                              0, s,
                              0, -s,
                              5*s, 0]), gl.STATIC_DRAW);
                gl.enableVertexAttribArray(positionLocation);
                gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
                gl.uniform2f(resolutionLocation, renderContext.getCanvasWebGL().getAttribute("width"), renderContext.getCanvasWebGL().getAttribute("height"));
                var phi = Math.atan2(y2 - y1, x2 - x1) + Math.PI/2;
                gl.uniform2fv(translationLocation, [x3, y3]);
                var rotation = [Math.cos(phi), Math.sin(phi)];
                gl.uniform2fv(rotationLocation, rotation);
                gl.drawArrays(gl.TRIANGLES, 0, 3);
            }
            if (this.startArrow) {
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
                var rotationLocation = gl.getUniformLocation(shaderProgram, "rotation");
                var resolutionLocation = gl.getUniformLocation(shaderProgram, "resolution");
                var translationLocation = gl.getUniformLocation(shaderProgram, "translation");
    
                var tM = new Float32Array(this.getTransformationMatrix().all());
                var matrix = gl.getUniformLocation(shaderProgram, "matrix");
                gl.uniformMatrix3fv(matrix, false, tM);
    
                gl.lineWidth(this.width);
                var s: number = this.arrowScale;
                gl.bufferData(gl.ARRAY_BUFFER,
                              new Float32Array([
                              0, s,
                              0, -s,
                              5*s, 0]), gl.STATIC_DRAW);
                gl.enableVertexAttribArray(positionLocation);
                gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
                gl.uniform2f(resolutionLocation, renderContext.getCanvasWebGL().getAttribute("width"), renderContext.getCanvasWebGL().getAttribute("height"));
                var phi = Math.atan2(y2 - y1, x2 - x1) - Math.PI/2;
                gl.uniform2fv(translationLocation, [x4, y4]);
                var rotation = [Math.cos(phi), Math.sin(phi)];
                gl.uniform2fv(rotationLocation, rotation);
                gl.drawArrays(gl.TRIANGLES, 0, 3);
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
    
        public copy(): Line {
            return new Line(this.getPoints()[0].x, this.getPoints()[0].y, this.getPoints()[1].x, this.getPoints()[1].y, this.width, this.type, this.colour.getRGBAString(), this.startArrow, this.endArrow);
        }
    }
} 
