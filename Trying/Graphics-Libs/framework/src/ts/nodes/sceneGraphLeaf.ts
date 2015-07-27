/// <reference path="../../../libs/TSM/tsm-0.7.d.ts" />

/// <reference path="../general/constants.ts" />
/// <reference path="../general/renderContext.ts" />
/// <reference path="../helper/xmlComment.ts" />
/// <reference path="sceneGraphComponent.ts" />


module Plexx {

    export class SceneGraphLeaf implements SceneGraphComponent {
    
        private name: string;
        private points: Array<TSM.vec2>;
        private transformationMatrix: TSM.mat3;
    
        private canvasNode: CanvasNode;
    
        constructor(name?: string) {
            this.name = "Default"
            this.transformationMatrix = new TSM.mat3().setIdentity();
            this.points = new Array<TSM.vec2>();
        }
    
        public toString(): string {
            var stringtext: string = "";
    
            stringtext += "Node {name = " + this.name + ", points =" + this.getPointsAsArray().toString() + "}";
    
            return stringtext;
        }
    
        public copy(): SceneGraphComponent {
            var sceneGraphLeafCopy = <SceneGraphLeaf>{};
    
            for (var key in this)
            {
                if (this.hasOwnProperty(key)) sceneGraphLeafCopy[key] = this[key];
            }
    
            return sceneGraphLeafCopy;
        }
    
        public render(renderContext: RenderContext): boolean { 
            return false;
        }
    
        public toSVGString(renderContext: RenderContext): string {
            var xmlComment = new XMLComment(this.name);
            return xmlComment.getLineCommentTag();
        }
    
        public getName(): string {
            return this.name;
        }
    
        public setName(name: string) {
            this.name = name;
        }
    
        public setPoints(points: Array<TSM.vec2>) {
            this.points = points;
        }
    
        public setPointsFromArray(pointsArray: number[]) {
            for(var i: number = 0; i < pointsArray.length; i += 2) {
                this.points.push(new TSM.vec2([pointsArray[i], pointsArray[i+1]]));
            }
        }
    
        public getPoints(): Array<TSM.vec2> {
            return this.points;
        }
    
        public getPointsAsArray(): number[] {
            var pointArray: number[] = [];
    
            for (var index: number = 0; index < this.points.length; index++) {
                pointArray.push[this.points[index].x];
                pointArray.push[this.points[index].y];
            }
    
            return pointArray;
        }
    
        public getTransformationMatrix(): TSM.mat3 {
            return this.transformationMatrix;
        }
    
        public setTransformationMatrix(transformationMatrix: TSM.mat3) {
            this.transformationMatrix = transformationMatrix;
        }
    
        public translateX(translateX: number): SceneGraphLeaf {
            this.transformationMatrix = this.transformationMatrix.copy().multiply(new TSM.mat3([1, 0, 0, 0, 1, 0, translateX, 0, 1]))
            return this;
        }
    
        public translateY(translateY: number): SceneGraphLeaf {
            this.transformationMatrix = this.transformationMatrix.copy().multiply(new TSM.mat3([1, 0, 0, 0, 1, 0, 0, translateY, 1]))
            return this;
        }
    
        public translateXY(translateX: number, translateY: number): SceneGraphLeaf {
            this.transformationMatrix = this.transformationMatrix.copy().multiply(new TSM.mat3([1, 0, 0, 0, 1, 0, translateX, translateY, 1]))
            return this;
        }
    
        public scaleXY(scaleX: number, scaleY: number): SceneGraphLeaf {
            this.transformationMatrix = this.transformationMatrix.copy().multiply(new TSM.mat3([scaleX, 0, 0, 0, scaleY, 0, 0, 0, 1]));
            return this;
        }
    
        public setCanvasNode(canvasNode: CanvasNode) {
            this.canvasNode = canvasNode;
        }
    
        public getCanvasNode(): CanvasNode {
            return this.canvasNode;
        }
    
    }
}
