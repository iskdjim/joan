/// <reference path="../../../../libs/TSM/tsm-0.7.d.ts" />
/// <reference path="../../general/constants.ts" />
/// <reference path="../../general/renderContext.ts" />
/// <reference path="../../helper/xmlComment.ts" />
/// <reference path="../sceneGraphComponent.ts" />
/// <reference path="../sceneGraphComposite.ts" />
/// <reference path="../sceneGraphLeaf.ts" />


module Plexx {

    export class TranslationNode extends SceneGraphCompositeNode {
    
        private translation: TSM.vec2;
    
        constructor(posX?: number,
                    posY?: number) {
            super("TranslationNode");
            this.translation = new TSM.vec2([posX, posY]);
            
            console.log("[FDGL] " + this.toString() + " created");
        }
    
        public render(renderContext: RenderContext): boolean {
            var childNodeLeafs: SceneGraphComponent[] = this.getAllLeafs();
            // pre-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = <SceneGraphLeaf>childNodeLeafs[subNodeIndex];
                var childTransformationMatrix: TSM.mat3 = sceneGraphLeafChildNode.getTransformationMatrix();
                var translationMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, 1, 0, this.translation.x, this.translation.y, 1]);
    
                sceneGraphLeafChildNode.setTransformationMatrix(childTransformationMatrix.multiply(translationMatrix));
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
                var translationMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, 1, 0, -this.translation.x, -this.translation.y, 1]);
    
                sceneGraphLeafChildNode.setTransformationMatrix(childTransformationMatrix.multiply(translationMatrix));
            }
            return true;
        }
    
        public toSVGString(renderContext: RenderContext): string {
            var childNodeLeafs: SceneGraphComponent[] = this.getAllLeafs();
            // pre-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = <SceneGraphLeaf>childNodeLeafs[subNodeIndex];
                var childTransformationMatrix: TSM.mat3 = sceneGraphLeafChildNode.getTransformationMatrix();
                var translationMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, 1, 0, this.translation.x, this.translation.y, 1]);
    
                sceneGraphLeafChildNode.setTransformationMatrix(childTransformationMatrix.multiply(translationMatrix));
            }
    
            // render
            var svgString: string = "";
    
            var xmlComment = new XMLComment(this.getName() + " translationX=\"" + this.translation.x + "\" translationY=\"" + this.translation.y + "\" {");
            svgString = xmlComment.getLineCommentTag() + "\n";
    
            for (var subNodeIndex = 0; subNodeIndex < this.getChilds().length; subNodeIndex++) {
                svgString += this.getChilds()[subNodeIndex].toSVGString(renderContext) + "\n";
            }
    
            /// post-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = <SceneGraphLeaf>childNodeLeafs[subNodeIndex];
                var childTransformationMatrix: TSM.mat3 = sceneGraphLeafChildNode.getTransformationMatrix();
                var translationMatrix: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, 1, 0, -this.translation.x, -this.translation.y, 1]);
    
                sceneGraphLeafChildNode.setTransformationMatrix(childTransformationMatrix.multiply(translationMatrix));
            }
    
            var xmlComment = new XMLComment("}");
            svgString += xmlComment.getLineCommentTag() + "\n";
    
            return svgString;
        }
    }
}
