/// <reference path="../../general/constants.ts" />
/// <reference path="../../general/renderContext.ts" />
/// <reference path="../../helper/xmlComment.ts" />
/// <reference path="../sceneGraphComponent.ts" />
/// <reference path="../sceneGraphComposite.ts" />
/// <reference path="../sceneGraphLeaf.ts" />


module Plexx {

    export class RotationNode extends SceneGraphCompositeNode {
    
        private rotation: number;
    
        constructor(rotation: number) {
            super();
            this.rotation = rotation;
            
            this.setName("RotationNode");
    
            console.log("[FDGL] " + "RotationNode" + " (" + this.rotation + ") created");
        }
    
        public render(renderContext: RenderContext): boolean {
            var childNodeLeafs: SceneGraphComponent[] = this.getAllLeafs();
            // pre-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = <SceneGraphLeaf>childNodeLeafs[subNodeIndex];
                var m: TSM.mat3 = sceneGraphLeafChildNode.getTransformationMatrix();
                console.log("ROTATIONMatrixM " + m.all().toString());
                var rotation = this.rotation;
                var x = sceneGraphLeafChildNode.getPoints()[0].x;
                var y = sceneGraphLeafChildNode.getPoints()[0].y;
                var sinR = Math.sin(-rotation * Math.PI/180);
                var cosR = Math.cos(-rotation * Math.PI/180);
                var r: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, 1, 0, -x, -y, 1]);
                var k: TSM.mat3 = new TSM.mat3([cosR, -sinR, 0, sinR, cosR, 0, 0, 0, 1]);
                var rv: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, 1, 0, x, y, 1]);
                //            console.log("MatrixK " + k.all().toString());
                var p: TSM.mat3 = k.copy().multiply(r);
                var an: TSM.mat3 = rv.copy().multiply(p);
                var a: TSM.mat3 = m.copy().multiply(an);
                //            console.log("MatrixA " + a.all().toString());
                sceneGraphLeafChildNode.setTransformationMatrix(a);
                //            var l: TSM.mat3 = new TSM.mat3([1, 0, 0, 1, -this.translation.x0, -this.translation.x1, 0, 0, 1]);
                //            console.log("MatrixT " + a.multiply(l).all().toString());
            }
    
            // render
            for (var subNodeIndex = 0; subNodeIndex < this.getChilds().length; subNodeIndex++) {
            console.log(subNodeIndex + "RENDER EVERYTHING");
                var currentSubNodeRenderStatus = this.getChilds()[subNodeIndex].render(renderContext);
                if (currentSubNodeRenderStatus == false) {
                    return false;
                }
            }
    
            /// post-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = <SceneGraphLeaf>childNodeLeafs[subNodeIndex];
                    //            var m: TSM.mat3 = sceneGraphLeafChildNode.getTransformationMatrix();
                    //            sceneGraphLeafChildNode.setTransformationMatrix(m);
                var m: TSM.mat3 = sceneGraphLeafChildNode.getTransformationMatrix();
                var x = sceneGraphLeafChildNode.getPoints()[0].x;
                var y = sceneGraphLeafChildNode.getPoints()[0].y;
                var sinR = Math.sin(rotation * Math.PI/180);
                var cosR = Math.cos(rotation * Math.PI/180);
                //            var k: TSM.mat3 = new TSM.mat3([cosR, -sinR, 0, sinR, cosR, 0, x - x*cosR + y*sinR , y-x*sinR - y*cosR, 1]);
                var k: TSM.mat3 = new TSM.mat3([cosR, -sinR, 0, sinR, cosR, 0, 0 , 0, 1]);
                var ja: TSM.mat3 = k.copy().multiply(r);
                var js: TSM.mat3 = rv.copy().multiply(ja);
                console.log("MatrixM " + m.all().toString());
                //            console.log("MatrixK " + k.all().toString());
                var a: TSM.mat3 = m.copy().multiply(js);
                console.log("MatrixA " + a.all().toString());
                sceneGraphLeafChildNode.setTransformationMatrix(a);
            }
            return true;
        }
    
        public toSVGString(renderContext: RenderContext): string {
            var childNodeLeafs: SceneGraphComponent[] = this.getAllLeafs();
            // pre-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = <SceneGraphLeaf>childNodeLeafs[subNodeIndex];
                var m: TSM.mat3 = sceneGraphLeafChildNode.getTransformationMatrix();
                console.log("ROTATIONMatrixM " + m.all().toString());
                var rotation = this.rotation;
                var x = sceneGraphLeafChildNode.getPoints()[0].x;
                var y = sceneGraphLeafChildNode.getPoints()[0].y;
                var sinR = Math.sin(-rotation * Math.PI/180);
                var cosR = Math.cos(-rotation * Math.PI/180);
                var r: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, 1, 0, -x, -y, 1]);
                var k: TSM.mat3 = new TSM.mat3([cosR, -sinR, 0, sinR, cosR, 0, 0, 0, 1]);
                var rv: TSM.mat3 = new TSM.mat3([1, 0, 0, 0, 1, 0, x, y, 1]);
                //            console.log("MatrixK " + k.all().toString());
                var p: TSM.mat3 = k.copy().multiply(r);
                var an: TSM.mat3 = rv.copy().multiply(p);
                var a: TSM.mat3 = m.copy().multiply(an);
                //            console.log("MatrixA " + a.all().toString());
                sceneGraphLeafChildNode.setTransformationMatrix(a);
                //            var l: TSM.mat3 = new TSM.mat3([1, 0, 0, 1, -this.translation.x0, -this.translation.x1, 0, 0, 1]);
                //            console.log("MatrixT " + a.multiply(l).all().toString());
            }
    
            // render
            var svgString: string = "";
    
            var xmlComment = new XMLComment(this.getName() + " rotation=\"" + this.rotation + "\" {");
            svgString = xmlComment.getLineCommentTag() + "\n";
    
            for (var subNodeIndex = 0; subNodeIndex < this.getChilds().length; subNodeIndex++) {
                svgString += this.getChilds()[subNodeIndex].toSVGString(renderContext) + "\n";
            }
    
            /// post-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = <SceneGraphLeaf>childNodeLeafs[subNodeIndex];
                    //            var m: TSM.mat3 = sceneGraphLeafChildNode.getTransformationMatrix();
                    //            sceneGraphLeafChildNode.setTransformationMatrix(m);
                var m: TSM.mat3 = sceneGraphLeafChildNode.getTransformationMatrix();
                var x = sceneGraphLeafChildNode.getPoints()[0].x;
                var y = sceneGraphLeafChildNode.getPoints()[0].y;
                var sinR = Math.sin(rotation * Math.PI/180);
                var cosR = Math.cos(rotation * Math.PI/180);
                //            var k: TSM.mat3 = new TSM.mat3([cosR, -sinR, 0, sinR, cosR, 0, x - x*cosR + y*sinR , y-x*sinR - y*cosR, 1]);
                var k: TSM.mat3 = new TSM.mat3([cosR, -sinR, 0, sinR, cosR, 0, 0 , 0, 1]);
                var ja: TSM.mat3 = k.copy().multiply(r);
                var js: TSM.mat3 = rv.copy().multiply(ja);
                console.log("MatrixM " + m.all().toString());
                //            console.log("MatrixK " + k.all().toString());
                var a: TSM.mat3 = m.copy().multiply(js);
                console.log("MatrixA " + a.all().toString());
                sceneGraphLeafChildNode.setTransformationMatrix(a);
            }
    
            var xmlComment = new XMLComment("}");
            svgString += xmlComment.getLineCommentTag() + "\n";
    
            return svgString;
        }
    }
}
