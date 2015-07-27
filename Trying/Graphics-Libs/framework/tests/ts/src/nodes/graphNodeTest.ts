/// <reference path="../../../../libs/tsUnit/tsUnit.ts" />
/// <reference path="../../../../src/ts/nodes/graphNode.ts" />

class GraphNodeTest extends tsUnit.TestClass {

    constructorTest() {
        var node1 = new GraphNode();
        this.areIdentical(1, 1);
    }

    addChildNodeTest() {
        var node1 = new GraphNode();
        var node2 = new GraphNode();
        this.areIdentical(0, node1.getNumberOfChildNodes());
        node1.addChild(node2);
        this.areIdentical(1, node1.getNumberOfChildNodes());

    }


}
