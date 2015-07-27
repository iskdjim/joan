/// <reference path="../../general/constants.ts" />
/// <reference path="../graphNode.ts" />
/// <reference path="../sceneGraphLeaf.ts" />
/// <reference path="../materials/colour.ts" />
/// <reference path="../../helper/xmlTag.ts" />
/// <reference path="../../general/renderContext.ts" />


module Plexx {

    export class Polygon extends SceneGraphLeaf {
    
        private colourNode: Colour;
        private polygonSides;
    
        constructor(points: number[],
                    colour?: string) {
            super("Polygon");
            this.setPointsFromArray(points);
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
    
        private updateCanvas2d(renderContext: RenderContext): boolean {
            var context = renderContext.getCanvas2D().getContext("2d");
            var position = this.getPoints()[0];
    
            var transformationMatrix: TSM.mat3 = this.getTransformationMatrix();
            var mirrorMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix: TSM.mat3 = mirrorMatrix.copy().multiply(transformationMatrix);
    
            context.save();
                context.beginPath();
                    context.setTransform(resultMatrix.at(0), resultMatrix.at(1), resultMatrix.at(3), resultMatrix.at(4), resultMatrix.at(6), resultMatrix.at(7));
                    context.lineTo(position.x, position.y);
                    for (var i = 1; i < this.getPoints().length; i++) {
                        var position = this.getPoints()[i];
                        context.lineTo(position.x, position.y);
                    }
                    context.fillStyle = this.colourNode.getCss3String();
                    context.fill();
                    context.strokeStyle = "none";
                    context.lineWidth = 0;
                context.closePath();
            context.restore();
    
            return true;
        }
    
        private updateSVG(renderContext:RenderContext): boolean {
            var points: string = "";
            var SVGObject = document.createElementNS(Constants.SVG_NAMESPACE, "polygon");
    
            var transformationMatrix: TSM.mat3 = this.getTransformationMatrix();
            var mirrorMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix: TSM.mat3 = mirrorMatrix.copy().multiply(transformationMatrix);
    
            var position = this.getPoints()[0];
            points = position.x + "," + position.y;
            for (var i = 1; i < this.getPoints().length; i++) {
                var position = this.getPoints()[i];
                points += " " + position.x + "," + position.y;
            }
            SVGObject.setAttribute("points", points);
            SVGObject.setAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " +  resultMatrix.at(3) + " " + resultMatrix.at(4) + " " +  resultMatrix.at(6) + " " + resultMatrix.at(7) + ")");
            SVGObject.setAttribute("fill", this.colourNode.getRGBString());
            SVGObject.setAttribute("stroke", "none");
            SVGObject.setAttribute("stroke-width", "0");
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
    
            var tM = new Float32Array(this.getTransformationMatrix().all());
            var matrix = gl.getUniformLocation(shaderProgram, "matrix");
            gl.uniformMatrix3fv(matrix, false, tM);
    
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            var resolutionLocation = gl.getUniformLocation(shaderProgram, "resolution");
            console.log(resolutionLocation);
            gl.uniform2f(resolutionLocation, renderContext.getCanvasWebGL().getAttribute("width"), renderContext.getCanvasWebGL().getAttribute("height"));
    
            var polygonVertices = new Float32Array(this.getPoints().length * 2);
            for (var i = 0; i < this.getPoints().length; i++) {
                var position = this.getPoints()[i];
                polygonVertices[2*i] = position.x;
                polygonVertices[(2*i) + 1] = position.y;
            }
    
            gl.bufferData(gl.ARRAY_BUFFER, polygonVertices, gl.STATIC_DRAW);
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, this.getPoints().length);
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
                "precision mediump float;                                      \n" +
                "                                                              \n" +
                "void main() {                                                 \n" +
                "  gl_FragColor = vec4("+this.colourNode.getR()+","+this.colourNode.getG()+","+this.colourNode.getB()+","+this.colourNode.getA()+");                          \n" +
                "}                                                             \n";
    
    
            return fragmentShaderSrc;
        }
    
        public toSVGString(): string {
            var svgString: string = "";
            var xmlTag = new XMLTag("polygon");
            var points: string = "";
            var position = this.getPoints()[0];
            points = position.x + "," + position.y;
            for (var i = 2; i < this.getPoints().length; i++) {
                var position = this.getPoints()[i];
                points += " " + String(position.x) + "," + String(position.y);
            }
            xmlTag.addAttribute("points", points);
            xmlTag.addAttribute("fill", "" + this.colourNode.getRGBString());
            xmlTag.addAttribute("stroke", "" + this.colourNode.getRGBString());
            xmlTag.addAttribute("stroke-width", "0");
            svgString = xmlTag.getEmptyElementTag() + "\n";
    
            return svgString;
        }
    
        public copy(): Polygon {
            return new Polygon(this.getPointsAsArray(), this.colourNode.getRGBAString());
        }
     }
    
}
