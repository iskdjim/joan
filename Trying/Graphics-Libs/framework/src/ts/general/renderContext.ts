/// <reference path="constants.ts" />
/// <reference path="../nodes/canvasnode.ts" />

module Plexx {

    export class RenderContext {
        private renderType: RenderType;
        private canvas2D;
        private svg;
        private canvasWebGL;
        private domId: string;
        private canvasNode: CanvasNode;
    
        public constructor(domId: string) {
            var elementOfDomId = document.getElementById(domId);
            if (elementOfDomId == null) {
                console.log("[FDGL] Can\'t create render context for " + domId + ". Element in DOM not found!");
            }
    
            this.domId = domId;
            this.setRenderType(RenderType.CANVAS2D);
        }
    
        public setRenderType(renderType: RenderType) {
                if (this.renderType == RenderType.CANVAS2D) {
                    document.getElementById(this.domId).removeChild(this.canvas2D);
                }
                else if (this.renderType == RenderType.SVG) {
                    document.getElementById(this.domId).removeChild(this.svg);
                }
                else if (this.renderType == RenderType.WEBGL) {
                    document.getElementById(this.domId).removeChild(this.canvasWebGL);
                }
    
                if (renderType == RenderType.CANVAS2D) {
                    this.initCanvas2D();
                    document.getElementById(this.domId).appendChild(this.canvas2D);
                }
                else if (renderType == RenderType.SVG) {
                    this.initSVG();
                    document.getElementById(this.domId).appendChild(this.svg);
                }
                else if (renderType == RenderType.WEBGL) {
                    this.initWebGLCanvas();
                    document.getElementById(this.domId).appendChild(this.canvasWebGL);
                }
    
                this.renderType = renderType;
        }
    
        public getRenderType():RenderType {
            return this.renderType;
        }
    
        public initCanvas2D() {
            this.canvas2D = document.createElement("canvas");
            this.canvas2D.id = "canvas";
            this.canvas2D.style.height = "100%";
            this.canvas2D.style.width = "100%";
        }
    
        public initSVG() {
            this.svg = document.createElementNS(Constants.SVG_NAMESPACE, "svg");
        }
    
    
    
        public initWebGLCanvas() {
            console.log("[FDGL] init webGL");
            this.canvasWebGL = document.createElement("canvas");
            this.canvasWebGL.setAttribute("id", "webGLCanvas");
            this.canvasWebGL.setAttribute("height", 1000);
            this.canvasWebGL.setAttribute("width", 1000);
        }
    
        public getId(): string {
            return this.domId;
        }
    
        public getCanvas2D() {
            return this.canvas2D;
        }
    
        public getCanvas2dContext() {
            return this.canvas2D.getContext("2d");
        }
    
        public getSVG() {
            return this.svg;
        }
    
        public getCanvasWebGL() {
            return this.canvasWebGL;
        }
    
        public getFDGLElementHeight() {
            var height = (<HTMLElement><any>document.getElementById(this.domId)).style.height;
            return height;
        }
    
        public getFDGLElementWidth() {
            return (<HTMLElement><any>document.getElementById(this.domId)).style.width;
        }
    
        public getHeight() {
            return this.canvasNode.getHeight();
        }
    
        public getWidth() {
            return this.canvasNode.getWidth();
        }
    
        public setCanvasNode(canvasNode: CanvasNode) {
            this.canvasNode = canvasNode;
        }
    
    
        public isWebGLEnabled(): boolean {
            if (this.canvasWebGL == null) this.initWebGLCanvas();
            try {
                var gl = this.canvasWebGL.getContext("webgl");
            } catch (x) {
                gl = null;
            }
            if (gl == null) {
                return false;
            }
            return true;
        }
    
    }
    
    export enum RenderType {
        CANVAS2D,
        SVG,
        WEBGL
    }
}    
