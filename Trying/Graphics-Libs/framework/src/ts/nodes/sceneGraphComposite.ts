/// <reference path="../general/renderContext.ts" />
/// <reference path="../general/constants.ts" />
/// <reference path="sceneGraphComponent.ts" />
/// <reference path="sceneGraphLeaf.ts" />
/// <reference path="../helper/xmlComment.ts" />


module Plexx {

    export class SceneGraphCompositeNode implements SceneGraphComponent {
        private name: string;
        private childSceneGraphComponents: SceneGraphComponent[] = [];
        private parentSceneGraphComponent: SceneGraphComponent;
    
        public constructor(name?: string) {
            this.name = "Default"
            this.childSceneGraphComponents = [];
        }
    
        public toString(): string {
            return this.name;
        }
    
        public render(renderContext: RenderContext): boolean {
            for (var currentIndex = 0; currentIndex < this.childSceneGraphComponents.length; currentIndex++) {
                var currentStatus = this.childSceneGraphComponents[currentStatus].render(renderContext);
                if (currentStatus == false) {
                    return false;
                }
            }
            return true;
        }
    
        public copy(): SceneGraphComponent {
            var sceneGraphCompositeCopy = <SceneGraphCompositeNode>{};
    
            for (var key in this)
            {
                if (this.hasOwnProperty(key)) sceneGraphCompositeCopy[key] = this[key];
            }
    
            return sceneGraphCompositeCopy;
        }
    
    
        public toSVGString(rendercontext: RenderContext): string {
            var xmlComment = new XMLComment(this.name);
            return xmlComment.getLineCommentTag();
        }
    
        public add(sceneGraphComponent: SceneGraphComponent) {
            this.childSceneGraphComponents.push(sceneGraphComponent);
        }
    
        public addAtTop(sceneGraphComponent: SceneGraphComponent) {
            this.childSceneGraphComponents.unshift(sceneGraphComponent);
        }
    
        public remove(sceneGraphComponent: SceneGraphComponent) {
            var sceneGraphComponentIndex = this.childSceneGraphComponents.indexOf(sceneGraphComponent);
            if (sceneGraphComponentIndex != -1) {
               this.childSceneGraphComponents.splice(sceneGraphComponentIndex, 1);
            }
        }
    
        public getChilds(): SceneGraphComponent[] {
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
    
        public setName(name: string) {
            this.name = name;
        }
    
        public getName() {
            return this.name;
        }
    }
    
}
