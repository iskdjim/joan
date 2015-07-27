/// <reference path="../../general/constants.ts" />
/// <reference path="../../general/renderContext.ts" />
/// <reference path="../../helper/xmlComment.ts" />
/// <reference path="../sceneGraphComponent.ts" />
/// <reference path="../sceneGraphComposite.ts" />
/// <reference path="../sceneGraphLeaf.ts" />


module Plexx {

    export class ScaleNode extends SceneGraphCompositeNode {
    
        private scaleX: number;
        private scaleY: number;
    
        constructor(scaleX: number, scaleY) {
            super();
            this.scaleX = scaleX;
            this.scaleY = scaleY;
            
            this.setName("ScaleNode");
    
        }
    
        public render(renderContext: RenderContext): boolean {
            var childNodeLeafs: SceneGraphComponent[] = this.getAllLeafs();
            // pre-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = <SceneGraphLeaf>childNodeLeafs[subNodeIndex];
                var m: TSM.mat3 = sceneGraphLeafChildNode.getTransformationMatrix();
                var k: TSM.mat3 = new TSM.mat3([this.scaleX, 0, 0, 0, this.scaleY, 0, 0, 0, 1]);
                var a: TSM.mat3 = m.multiply(k);
                sceneGraphLeafChildNode.setTransformationMatrix(a);
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
                var m: TSM.mat3 = sceneGraphLeafChildNode.getTransformationMatrix();
                var k: TSM.mat3 = new TSM.mat3([1/this.scaleX, 0, 0, 0, 1/this.scaleY, 0, 0, 0, 1]);
                var a: TSM.mat3 = m.multiply(k);
                sceneGraphLeafChildNode.setTransformationMatrix(a);
            }
            return true;
        }
    
        public toSVGString(renderContext: RenderContext): string {
            var svgString: string = "";
            var childNodeLeafs: SceneGraphComponent[] = this.getAllLeafs();
            // pre-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = <SceneGraphLeaf>childNodeLeafs[subNodeIndex];
                var m: TSM.mat3 = sceneGraphLeafChildNode.getTransformationMatrix();
                var k: TSM.mat3 = new TSM.mat3([this.scaleX, 0, 0, 0, this.scaleY, 0, 0, 0, 1]);
                var a: TSM.mat3 = m.multiply(k);
                sceneGraphLeafChildNode.setTransformationMatrix(a);
            }
    
            // render
            var svgString: string = "";
    
            var xmlComment = new XMLComment(this.getName() + " scaleX=\"" + this.scaleX + "\" scaleY=\"" + this.scaleY + "\" {");
            svgString = xmlComment.getLineCommentTag() + "\n";
    
            for (var subNodeIndex = 0; subNodeIndex < this.getChilds().length; subNodeIndex++) {
                svgString += this.getChilds()[subNodeIndex].toSVGString(renderContext) + "\n";
            }
    
            /// post-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = <SceneGraphLeaf>childNodeLeafs[subNodeIndex];
                var m: TSM.mat3 = sceneGraphLeafChildNode.getTransformationMatrix();
                var k: TSM.mat3 = new TSM.mat3([1/this.scaleX, 0, 0, 0, 1/this.scaleY, 0, 0, 0, 1]);
                var a: TSM.mat3 = m.multiply(k);
                sceneGraphLeafChildNode.setTransformationMatrix(a);
            }
    
            var xmlComment = new XMLComment("}");
            svgString += xmlComment.getLineCommentTag() + "\n";
    
            return svgString;
        }
    }
}
