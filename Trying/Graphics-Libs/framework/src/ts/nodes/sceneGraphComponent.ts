/// <reference path="../general/renderContext.ts" />
/// <reference path="../general/constants.ts" />


module Plexx {

    export interface SceneGraphComponent {
    
        render(renderContext: RenderContext): boolean; 
    
        toString(): string;
    
        toSVGString(renderContext: RenderContext): string;
    
        copy(): SceneGraphComponent;
    
    }
    
}
