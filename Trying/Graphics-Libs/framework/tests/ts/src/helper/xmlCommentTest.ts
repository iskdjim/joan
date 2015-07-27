/// <reference path="../../../../libs/tsUnit/tsUnit.ts" />

/// <reference path="../../../../src/ts/helper/xmlComment.ts" />

class XmlCommentTest extends tsUnit.TestClass {

    public generateXmlCommentTest() {
        var xmlComment: XMLComment = new XMLComment("tag");
        this.areIdentical("<!-- tag -->", xmlComment.getLineCommentTag())
        this.areIdentical("<!--\ntag\n-->", xmlComment.getBlockCommentTag())
    }

}
