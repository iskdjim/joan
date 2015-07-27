/// <reference path="../../../../libs/tsUnit/tsUnit.ts" />

/// <reference path="../../../../src/ts/nodes/sceneGraphComponent.ts" />
/// <reference path="../../../../src/ts/nodes/sceneGraphComposite.ts" />
/// <reference path="../../../../src/ts/nodes/sceneGraphLeaf.ts" />

/// <reference path="../../../../src/ts/general/renderContext.ts" />

class SceneGraphComponentTest extends tsUnit.TestClass {

    public basicSceneGraphLeafTest() {
        var sceneGraphLeaf: SceneGraphLeaf = new SceneGraphLeaf();
        this.areIdentical("<!-- default leaf -->", sceneGraphLeaf.toSVGString());
    }

    public basicSceneGraphCompositeTest() {
        var composite: SceneGraphComposite = new SceneGraphComposite();
        this.areIdentical("default composite", composite.toString());
        this.areIdentical("<!-- default composite -->", composite.toSVGString());
        var leaf1: SceneGraphLeaf = new SceneGraphLeaf();
        var leaf2: SceneGraphLeaf = new SceneGraphLeaf();
        composite.add(leaf1); 
        composite.add(leaf2); 
        this.areIdentical(2, composite.getChilds().length);
        composite.remove(leaf1); 
        this.areIdentical(1, composite.getChilds().length);
    }


}
