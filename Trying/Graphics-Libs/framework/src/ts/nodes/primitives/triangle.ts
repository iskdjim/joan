/// <reference path="../../general/constants.ts" />
/// <reference path="../graphNode.ts" />
/// <reference path="../sceneGraphLeaf.ts" />
/// <reference path="../materials/colour.ts" />
/// <reference path="../../helper/xmlTag.ts" />
/// <reference path="../../general/renderContext.ts" />


module Plexx {

    export class Triangle extends SceneGraphLeaf {
    
        private colourNode: Colour;
        private polygonSides;
    
        constructor(x1: number,
                    y1: number,
                    x2: number,
                    y2: number,
                    x3: number,
                    y3: number,
                    colour?: string) {
            super("Triangle");
            this.setPointsFromArray([x1, y1, x2, y2, x3, y3]);
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
                this.updateSVG(renderContext);
            }
            else if (currentRenderType == RenderType.WEBGL) {
                this.updateWebGL(renderContext);
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
                    context.moveTo(this.getPoints()[0].x, this.getPoints()[0].y);
                    context.lineTo(this.getPoints()[1].x, this.getPoints()[1].y);
                    context.lineTo(this.getPoints()[2].x, this.getPoints()[2].y);
                    context.fillStyle = this.colourNode.getCss3String();
                    context.strokeStyle = "none";
                    context.fill();
                context.closePath();
            context.restore();
    
            return true;
        }
    
        private updateSVG(renderContext:RenderContext): boolean {
            var SVGObject = document.createElementNS(Constants.SVG_NAMESPACE, "polygon");
            var points: string = "";
    
            var transformationMatrix: TSM.mat3 = this.getTransformationMatrix();
            var mirrorMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix: TSM.mat3 = mirrorMatrix.copy().multiply(transformationMatrix);
    
            points = this.getPoints()[0].x + "," + this.getPoints()[0].y;
            points += " " + this.getPoints()[1].x + "," + this.getPoints()[1].y;
            points += " " + this.getPoints()[2].x + "," + this.getPoints()[2].y;
    
            SVGObject.setAttribute("points", points);
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
    
            var polygonVertices = new Float32Array(6);
            polygonVertices[0] = this.getPoints()[0].x;
            polygonVertices[1] = this.getPoints()[0].y;
            polygonVertices[2] = this.getPoints()[1].x;
            polygonVertices[3] = this.getPoints()[1].y;
            polygonVertices[4] = this.getPoints()[2].x;
            polygonVertices[5] = this.getPoints()[2].y;
    
            gl.bufferData(gl.ARRAY_BUFFER, polygonVertices, gl.STATIC_DRAW);
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);
    
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
            var svgString: string = "";
            var xmlTag = new XMLTag("polygon");
            var points: string = "";
    
            var transformationMatrix: TSM.mat3 = this.getTransformationMatrix();
            var mirrorMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix: TSM.mat3 = mirrorMatrix.copy().multiply(transformationMatrix);
    
            points = this.getPoints()[0].x + "," + this.getPoints()[0].y;
            points += " " + this.getPoints()[1].x + "," + this.getPoints()[1].y;
            points += " " + this.getPoints()[2].x + "," + this.getPoints()[2].y;
    
            xmlTag.addAttribute("points", points);
            xmlTag.addAttribute("fill", "" + this.colourNode.getRGBString());
            xmlTag.addAttribute("stroke", "" + this.colourNode.getRGBString());
            xmlTag.addAttribute("stroke-width", "0");
            xmlTag.addAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " +  resultMatrix.at(3) + " " + resultMatrix.at(4) + " " +  resultMatrix.at(6) + " " + resultMatrix.at(7) + ")");
            svgString = xmlTag.getEmptyElementTag() + "\n";
    
            return svgString;
        }
    
        public copy(): Triangle {
            return new Triangle(this.getPoints()[0].x, this.getPoints()[0].y, this.getPoints()[1].x, this.getPoints()[1].y, this.getPoints()[2].x, this.getPoints()[2].y,this.colourNode.getRGBAString());
        }
     }
    
}
