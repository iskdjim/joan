/// <reference path="../general/renderContext.ts" />
/// <reference path="../general/constants.ts" />


module Plexx {

    export class GraphNode {
    
        private parentGraphNode: GraphNode;
        private childGraphNodes: GraphNode[] = [];
    
        public static nodeTypeName: string = "GraphNode";
    
        constructor() {
        }
    
        render(renderContext: RenderContext): number {
            for (var subNodeIndex = 0; subNodeIndex < this.childGraphNodes.length; subNodeIndex++) {
                var currentSubNodeRenderStatus = this.childGraphNodes[subNodeIndex].render(renderContext);
                if (currentSubNodeRenderStatus != 0) {
                    return currentSubNodeRenderStatus;
                }
            }
            return 0;
        }
    
        addChild(childNode: GraphNode) {
            childNode.setParentNode(this);
            this.childGraphNodes.push(childNode);
        }
    
        getChildNodes(): GraphNode[] {
            return this.childGraphNodes;
        }
    
        getNumberOfChildNodes(): number {
            return this.childGraphNodes.length;
        }
    
        getParentNode(): GraphNode {
            return this.parentGraphNode;
        }
    
        setParentNode(parentGraphNode: GraphNode) {
            this.parentGraphNode = parentGraphNode;
        }
    
        public toSVGString(): string {
            var svgString: string;
            svgString = ""
            for (var subNodeIndex = 0; subNodeIndex < this.getChildNodes().length; subNodeIndex++) {
                svgString = svgString + this.getChildNodes()[subNodeIndex].toSVGString();
            }
            return svgString;
        }
    }
}
