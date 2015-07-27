/// <reference path="../../libs/tsUnit/tsUnit.ts" />
/// <reference path="src/nodes/graphNodeTest.ts" />
/// <reference path="src/nodes/sceneGraphComponentTest.ts" />
/// <reference path="src/helper/xmlTagTest.ts" />
/// <reference path="src/helper/xmlCommentTest.ts" />
/// <reference path="src/nodes/materials/colourTest.ts" />
/// <reference path="../../src/ts/nodes/graphNode.ts" />
/// <reference path="../../src/ts/nodes/materials/colour.ts" />

var tests = new tsUnit.Test();

//tests.addTestClass(new GraphNodeTest(), "GraphNodeTests");
tests.addTestClass(new ColourNodeTest(), "ColourNodeTests");
//tests.addTestClass(new SceneGraphComponentTest(), "SceneGraphComponentTest");
//tests.addTestClass(new XmlTagTest(), "XmlTagTest");
//tests.addTestClass(new XmlCommentTest(), "XmlCommentTest");

tests.showResults(document.getElementById("results"), tests.run());
