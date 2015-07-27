/// <reference path="../general/constants.ts" />
/// <reference path="../general/renderContext.ts" />
/// <reference path="../helper/xmlTag.ts" />
/// <reference path="../nodes/materials/colour.ts" />
/// <reference path="../nodes/primitives/line.ts" />
/// <reference path="graphNode.ts" />
/// <reference path="sceneGraphComponent.ts" />
/// <reference path="sceneGraphComposite.ts" />
/// <reference path="sceneGraphLeaf.ts" />


module Plexx {

    export class CanvasNode extends Plexx.SceneGraphCompositeNode {

        private canvasHeight:number;
        private canvasWidth:number;
        private canvasColour:Plexx.Colour;

        private debugLines:Line[];
        private debugOrigin:Line[];

        public isOriginVisible:boolean;
        public areLinesVisible:boolean;

        private lastTimeRendered:Date;
        private renderTime:number;

        public constructor(width:number,
                           height:number,
                           colour?:string) {
            super();
            this.canvasWidth = width || Constants.DEFAULT_CANVAS_WIDTH;
            this.canvasHeight = height || Constants.DEFAULT_CANVAS_HEIGHT;
            if (colour) {
                this.canvasColour = new Colour(colour);
            }
            else {
                this.canvasColour = new Colour();
            }
            this.debugOrigin = [];
            this.debugLines = [];
            this.areLinesVisible = false;
            this.areLinesVisible = false;
        }

        public render(renderContext:RenderContext):boolean {
            this.lastTimeRendered = new Date();
            renderContext.setCanvasNode(this);

            this.showLines(this.areLinesVisible);
            this.showOrigin(this.isOriginVisible);

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
            for (var subNodeIndex = 0; subNodeIndex < this.getChilds().length; subNodeIndex++) {
                var currentSubNodeRenderStatus = this.getChilds()[subNodeIndex].render(renderContext);
                if (currentSubNodeRenderStatus == false) {
                    return false;
                }
            }
            var currentTime = new Date();
            this.renderTime = (currentTime.getTime() - this.lastTimeRendered.getTime()) / 1000;
            return true;
        }

        private updateCanvas2d(renderContext:RenderContext):number {
            renderContext.getCanvas2D().width = this.canvasWidth;
            renderContext.getCanvas2D().height = this.canvasHeight;
            renderContext.getCanvas2D().style = "height:100%;width:100%;background-color: " + this.canvasColour.getRGBString();
            return 0;
        }

        private updateSVG(renderContext:RenderContext):number {
            renderContext.getSVG().setAttributeNS(null, "viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);
            renderContext.getSVG().setAttributeNS(null, "preserveAspectRatio", "" + "none");
            renderContext.getSVG().setAttributeNS(null, "width", "" + this.canvasWidth);
            renderContext.getSVG().setAttributeNS(null, "height", "" + this.canvasHeight);
            renderContext.getSVG().setAttributeNS(null, "shape-rendering", "geometricPrecision");
            renderContext.getSVG().setAttributeNS(null, "style", "width: 100%; height: 100%; background: " + this.canvasColour.getRGBString());
            return 0;
        }

        private updateWebGL(renderContext:RenderContext):number {
            renderContext.getCanvasWebGL().setAttribute("height", this.canvasHeight);
            renderContext.getCanvasWebGL().setAttribute("width", this.canvasWidth);
            renderContext.getCanvasWebGL().setAttribute("style", "width: 100%; height: 100%;");
            var gl = <WebGLRenderingContext> renderContext.getCanvasWebGL().getContext("webgl");
            gl.clearColor(this.canvasColour.getR() * this.canvasColour.getA(), this.canvasColour.getG() * this.canvasColour.getA(), this.canvasColour.getB() * this.canvasColour.getA(), this.canvasColour.getA());
            gl.clear(gl.COLOR_BUFFER_BIT);

            // enable alpha blending
            gl.enable(gl.BLEND);

            gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);

            // set blend function
            gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

            return 0;
        }

        public getHeight():number {
            return this.canvasHeight;
        }

        public getWidth():number {
            return this.canvasWidth;
        }

        public setHeight(height:number) {
            this.canvasHeight = height;
        }

        public setWidth(width:number) {
            this.canvasWidth = width;
        }

        public getTime():number {
            return this.renderTime;
        }

        public toSVGString(renderContext:RenderContext):string {
            var svgString:string = "";
            svgString += Constants.SVG_XML_PROLOG + "\n";
            svgString += Constants.SVG_DOCTYPE + "\n";
            var xmlTag = new XMLTag("svg");

            xmlTag.addAttribute("width", String(this.canvasWidth) + "px");
            xmlTag.addAttribute("height", String(this.canvasHeight) + "px");
            xmlTag.addAttribute("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);
            xmlTag.addAttribute("viewport-fill", this.canvasColour.getRGBString());
            xmlTag.addAttribute("style", "width: " + String(this.canvasWidth) + "px" +"; height: " + String(this.canvasWidth) + "px" +"; background: " + this.canvasColour.getRGBString());
            xmlTag.addAttribute("xmlns", "http://www.w3.org/2000/svg");
            xmlTag.addAttribute("version", "1.1");

            svgString += xmlTag.getStartTag() + "\n";

            for (var subNodeIndex = 0; subNodeIndex < this.getChilds().length; subNodeIndex++) {
                var subNodeSVGLines:string[] = this.getChilds()[subNodeIndex].toSVGString(renderContext).split("\n");
                for (var subNodeSVGLinesIndex = 0; subNodeSVGLinesIndex < subNodeSVGLines.length; subNodeSVGLinesIndex++) {
                    if (subNodeSVGLines[subNodeSVGLinesIndex] != "")
                        svgString += Constants.SVG_INDENT + subNodeSVGLines[subNodeSVGLinesIndex] + "\n";

                }
            }
            svgString = svgString + xmlTag.getEndTag() + "\n";
            return svgString;
        }

        private showLines(show:boolean) {
            var xMax:number = this.canvasWidth;
            var yMax:number = this.canvasHeight;

            if (!show && this.debugLines.length != 0) {
                for (var i = 0; i < this.debugLines.length; i++) {
                    this.remove(this.debugLines[i]);
                }
                this.debugLines = [];
            }
            else if (show && this.debugLines.length == 0) {
                for (var yIndex:number = 0; yIndex <= yMax; yIndex = yIndex + 100) {
                    var currentLine:Line = new Line(0, yIndex, xMax, yIndex, 1, Constants.LineType.Default, "grey");
                    this.debugLines.push(currentLine);
                }

                for (var xIndex:number = 0; xIndex <= xMax; xIndex = xIndex + 100) {
                    var currentLine:Line = new Line(xIndex, 0, xIndex, yMax, 1, Constants.LineType.Default, "grey");
                    this.debugLines.push(currentLine);
                }
                for (var i = 0; i < this.debugLines.length; i++) {
                    this.addAtTop(this.debugLines[i]);
                }
            }
        }

        private showOrigin(show:boolean) {
            if (!show && this.debugOrigin.length != 0) {
                for (var i = 0; i < this.debugOrigin.length; i++) {
                    this.remove(this.debugOrigin[i]);
                }
                this.debugOrigin = [];
            }
            else if (show && this.debugOrigin.length == 0) {
                var xOrigin:Line = new Line(0, 0, 0, 100, 3, Constants.LineType.Default, "grey", false, true);
                var yOrigin:Line = new Line(0, 0, 100, 0, 3, Constants.LineType.Default, "grey", false, true);
                this.debugOrigin.push(xOrigin);
                this.debugOrigin.push(yOrigin);
                for (var i = 0; i < this.debugOrigin.length; i++) {
                    this.add(this.debugOrigin[i]);
                }
            }
        }
    }
}
