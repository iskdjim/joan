/// <reference path="../../../../../libs/tsUnit/tsUnit.ts" />
/// <reference path="../../../../../src/ts/nodes/materials/colour.ts" />
/// <reference path="../../../../../src/ts/nodes/graphNode.ts" />

class ColourNodeTest extends tsUnit.TestClass {

    constructorTest() {
        var node1 = new Colour();
        this.areIdentical(1, 1);
    }

}
