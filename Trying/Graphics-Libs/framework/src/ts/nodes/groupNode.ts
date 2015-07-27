/// <reference path="../general/renderContext.ts" />
/// <reference path="../general/constants.ts" />
/// <reference path="sceneGraphComponent.ts" />
/// <reference path="sceneGraphComposite.ts" />
/// <reference path="sceneGraphLeaf.ts" />
/// <reference path="../helper/xmlComment.ts" />


module Plexx {

    export class GroupNode extends Plexx.SceneGraphLeaf {
    
        private rotation: number = 0;
        private scale: number[] = [];
        private childSceneGraphComponents: Plexx.SceneGraphComponent[] = [];
    
        constructor(x: number,
                    y: number,
                    rotation: number,
                    scaleX: number,
                    scaleY: number) {
            super("GroupNode");
            this.setPoints([new TSM.vec2([x, y])]);
            this.rotation = rotation;
            this.scale = [scaleX, scaleY];
        }
    
        public render(renderContext: RenderContext): boolean {
            var childNodeLeafs: Plexx.SceneGraphComponent[] = this.getAllLeafs();
    
            // pre-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = <SceneGraphLeaf>childNodeLeafs[subNodeIndex];
    
                var sinTerm = Math.sin(-this.rotation * Math.PI / 180);
                var cosTerm = Math.cos(-this.rotation * Math.PI / 180);
    
                var gx = this.getPoints()[0].x;
                var gy = this.getPoints()[0].y;
    
                var childTransformationMatrix: TSM.mat3 = sceneGraphLeafChildNode.getTransformationMatrix();
                var transformationMatrix: TSM.mat3 = this.getTransformationMatrix();
    
                var scaleMatrix: TSM.mat3 = new TSM.mat3([this.scale[0], 0, 0, 0, this.scale[1], 0, 0, 0, 1]);
    
                var translationMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, 1, 0, gx, gy, 1]);
                
                var tempMatrix1: TSM.mat3 = translationMatrix.copy().multiply(scaleMatrix.copy().multiply(childTransformationMatrix));
    
                var translateBeforeRotationMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, 1, 0, -gx, -gy, 1]);
                var rotationMatrix: TSM.mat3 = new TSM.mat3([cosTerm, -sinTerm, 0, sinTerm, cosTerm, 0, 0, 0, 1]);
                var translateAfterRotationMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, 1, 0, gx, gy, 1]);
    
                var tempMatrix2: TSM.mat3 = translateAfterRotationMatrix.copy().multiply(rotationMatrix.copy().multiply(translateBeforeRotationMatrix));
    
                var tempMatrix3: TSM.mat3 = transformationMatrix.copy().multiply(tempMatrix2.copy().multiply(tempMatrix1));
    
                sceneGraphLeafChildNode.setTransformationMatrix(tempMatrix3);
            }
    
            // render
            for (var subNodeIndex = 0; subNodeIndex < this.getChilds().length; subNodeIndex++) {
                var currentSubNodeRenderStatus = this.getChilds()[subNodeIndex].render(renderContext);
                if (currentSubNodeRenderStatus == false) {
                    return false;
                }
            }
    
            /// post-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = <SceneGraphLeaf>childNodeLeafs[subNodeIndex];
                var childTransformationMatrix: TSM.mat3 = sceneGraphLeafChildNode.getTransformationMatrix();
                var transformationMatrix: TSM.mat3 = this.getTransformationMatrix();
    
                var sinTerm = Math.sin(this.rotation * Math.PI / 180);
                var cosTerm = Math.cos(this.rotation * Math.PI / 180);
    
                var gx = this.getPoints()[0].x;
                var gy = this.getPoints()[0].y;
    
                var inverseTransformationMatrix = transformationMatrix.copy().inverse();
    
                var tempMatrix1 = inverseTransformationMatrix.copy().multiply(childTransformationMatrix);
    
    
                var translateBeforeRotationMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, 1, 0, -gx, -gy, 1]);
                var inverseRotationMatrix: TSM.mat3 = new TSM.mat3([cosTerm, -sinTerm, 0, sinTerm, cosTerm, 0, 0, 0, 1]);
                var translateAfterRotationMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, 1, 0, gx, gy, 1]);
    
                var tempMatrix3: TSM.mat3 = translateAfterRotationMatrix.copy().multiply(inverseRotationMatrix.copy().multiply(translateBeforeRotationMatrix));
    
                var inverseTranslationMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, 1, 0, -this.getPoints()[0].x, -this.getPoints()[0].y, 1]);
    
                var tempMatrix2: TSM.mat3 = tempMatrix3.copy().multiply(tempMatrix1);
    
                var inverseScaleMatrix: TSM.mat3 = new TSM.mat3([1 / this.scale[0], 0, 0, 0, 1 / this.scale[1], 0, 0, 0, 1]);
    
                var tempMatrix3 = inverseTranslationMatrix.copy().multiply(tempMatrix2);
    
                var tempMatrix4 = inverseScaleMatrix.copy().multiply(tempMatrix3);
    
                sceneGraphLeafChildNode.setTransformationMatrix(tempMatrix4);
    
            }
            return true;
    
        }
    
        public toSVGString(renderContext: RenderContext): string {

            var childNodeLeafs: Plexx.SceneGraphComponent[] = this.getAllLeafs();

            // pre-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = <SceneGraphLeaf>childNodeLeafs[subNodeIndex];

                var sinTerm = Math.sin(-this.rotation * Math.PI / 180);
                var cosTerm = Math.cos(-this.rotation * Math.PI / 180);

                var gx = this.getPoints()[0].x;
                var gy = this.getPoints()[0].y;

                var childTransformationMatrix: TSM.mat3 = sceneGraphLeafChildNode.getTransformationMatrix();
                var transformationMatrix: TSM.mat3 = this.getTransformationMatrix();

                var scaleMatrix: TSM.mat3 = new TSM.mat3([this.scale[0], 0, 0, 0, this.scale[1], 0, 0, 0, 1]);

                var translationMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, 1, 0, gx, gy, 1]);

                var tempMatrix1: TSM.mat3 = translationMatrix.copy().multiply(scaleMatrix.copy().multiply(childTransformationMatrix));

                var translateBeforeRotationMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, 1, 0, -gx, -gy, 1]);
                var rotationMatrix: TSM.mat3 = new TSM.mat3([cosTerm, -sinTerm, 0, sinTerm, cosTerm, 0, 0, 0, 1]);
                var translateAfterRotationMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, 1, 0, gx, gy, 1]);

                var tempMatrix2: TSM.mat3 = translateAfterRotationMatrix.copy().multiply(rotationMatrix.copy().multiply(translateBeforeRotationMatrix));

                var tempMatrix3: TSM.mat3 = transformationMatrix.copy().multiply(tempMatrix2.copy().multiply(tempMatrix1));

                sceneGraphLeafChildNode.setTransformationMatrix(tempMatrix3);
            }

            // render
            var svgString: string = "";
            var xmlTag = new XMLTag("g");
            var position = this.getPoints()[0];
    
            xmlTag.addAttribute("transform", "translate(" + this.getPoints()[0].x  + "," + this.getPoints()[0].y + ") rotate(" + this.rotation + ") scale(" + this.scale[0] + "," + this.scale[1] + ")");
            svgString += xmlTag.getStartTag() + "\n";
            for (var subNodeIndex = 0; subNodeIndex < this.getChilds().length; subNodeIndex++) {
                svgString = svgString + "  " + this.getChilds()[subNodeIndex].toSVGString(renderContext);
            }
            svgString += xmlTag.getEndTag() + "\n";
            /// post-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = <SceneGraphLeaf>childNodeLeafs[subNodeIndex];
                var childTransformationMatrix: TSM.mat3 = sceneGraphLeafChildNode.getTransformationMatrix();
                var transformationMatrix: TSM.mat3 = this.getTransformationMatrix();

                var sinTerm = Math.sin(this.rotation * Math.PI / 180);
                var cosTerm = Math.cos(this.rotation * Math.PI / 180);

                var gx = this.getPoints()[0].x;
                var gy = this.getPoints()[0].y;

                var inverseTransformationMatrix = transformationMatrix.copy().inverse();

                var tempMatrix1 = inverseTransformationMatrix.copy().multiply(childTransformationMatrix);


                var translateBeforeRotationMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, 1, 0, -gx, -gy, 1]);
                var inverseRotationMatrix: TSM.mat3 = new TSM.mat3([cosTerm, -sinTerm, 0, sinTerm, cosTerm, 0, 0, 0, 1]);
                var translateAfterRotationMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, 1, 0, gx, gy, 1]);

                var tempMatrix3: TSM.mat3 = translateAfterRotationMatrix.copy().multiply(inverseRotationMatrix.copy().multiply(translateBeforeRotationMatrix));

                var inverseTranslationMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, 1, 0, -this.getPoints()[0].x, -this.getPoints()[0].y, 1]);

                var tempMatrix2: TSM.mat3 = tempMatrix3.copy().multiply(tempMatrix1);

                var inverseScaleMatrix: TSM.mat3 = new TSM.mat3([1 / this.scale[0], 0, 0, 0, 1 / this.scale[1], 0, 0, 0, 1]);

                var tempMatrix3 = inverseTranslationMatrix.copy().multiply(tempMatrix2);

                var tempMatrix4 = inverseScaleMatrix.copy().multiply(tempMatrix3);

                sceneGraphLeafChildNode.setTransformationMatrix(tempMatrix4);

            }
            return svgString;

        }
    
        public getX(): number {
            return this.getPoints()[0].x;
        }
    
        public setX(x: number): GroupNode {
            this.getPoints()[0].x = x;
            return this;
        }
    
        public getY(): number {
            return this.getPoints()[0].y;
        }
    
        public setY(y: number): GroupNode {
            this.getPoints()[0].y = y;
            return this;
        }
    
        add(sceneGraphComponent: Plexx.SceneGraphComponent) {
            console.log("add Element " + sceneGraphComponent);
            this.childSceneGraphComponents.push(sceneGraphComponent);
        }
    
        addAtTop(sceneGraphComponent: Plexx.SceneGraphComponent) {
            console.log("add Element " + sceneGraphComponent);
            this.childSceneGraphComponents.unshift(sceneGraphComponent);
        }
    
        public remove(sceneGraphComponent: Plexx.SceneGraphComponent) {
            var sceneGraphComponentIndex = this.childSceneGraphComponents.indexOf(sceneGraphComponent);
            console.log("remove Element " + sceneGraphComponentIndex);
            if (sceneGraphComponentIndex != -1) {
               this.childSceneGraphComponents.splice(sceneGraphComponentIndex, 1);
            }
        }
    
        getChilds(): Plexx.SceneGraphComponent[] {
            return this.childSceneGraphComponents;
        }
    
        public getAllLeafs(): SceneGraphLeaf[] {
            var leafs: SceneGraphLeaf[] = [];
            for (var subNodeIndex = 0; subNodeIndex < this.getChilds().length; subNodeIndex++) {
                var childNode = this.getChilds()[subNodeIndex];
                if(childNode instanceof SceneGraphCompositeNode) {
                    var sceneGraphCompositeChildNode = <SceneGraphCompositeNode>this.getChilds()[subNodeIndex];
                    for (var subNodeIndex2 = 0; subNodeIndex2 < sceneGraphCompositeChildNode.getAllLeafs().length; subNodeIndex2++) {
                            var sceneGraphLeafChildNode = <SceneGraphLeaf>sceneGraphCompositeChildNode.getChilds()[subNodeIndex2];
                            leafs.push(sceneGraphLeafChildNode);
                    }
                }
                else if(childNode instanceof SceneGraphLeaf) {
                    leafs.push(<SceneGraphLeaf>childNode);
                }
            }
            return leafs;
        }
    
        public copy(): GroupNode {
            var groupNodeCopy: GroupNode = new GroupNode(this.getPoints()[0].x, this.getPoints()[0].y, this.rotation, this.scale[0], this.scale[1]);
            var sceneGraphs: SceneGraphComponent[] = [];
    
    
            for (var currentIndex = 0; currentIndex < this.childSceneGraphComponents.length; currentIndex++) {
                sceneGraphs.push(this.childSceneGraphComponents[currentIndex].copy());
            }
    
            groupNodeCopy.childSceneGraphComponents = sceneGraphs;
    
            return groupNodeCopy;
        }
    
    }
}
