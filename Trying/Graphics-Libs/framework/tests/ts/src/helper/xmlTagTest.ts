/// <reference path="../../../../libs/tsUnit/tsUnit.ts" />

/// <reference path="../../../../src/ts/helper/xmlTag.ts" />

class XmlTagTest extends tsUnit.TestClass {

    public generateXmlTagTest() {
        var xmlTag: XMLTag = new XMLTag("tag");
        this.areIdentical("<tag>", xmlTag.getStartTag())
        this.areIdentical("</tag>", xmlTag.getEndTag())
        this.areIdentical("<tag/>", xmlTag.getEmptyElementTag())
    }

    public generateXmlTagWithAttributesTest() {
        var xmlTag: XMLTag = new XMLTag("tag");
        xmlTag.addAttribute("attribute1", "value1");
        xmlTag.addAttribute("attribute2", "value2");

        this.areIdentical("<tag attribute1=\"value1\" attribute2=\"value2\">", xmlTag.getStartTag())
        this.areIdentical("</tag>", xmlTag.getEndTag())
        this.areIdentical("<tag attribute1=\"value1\" attribute2=\"value2\"/>", xmlTag.getEmptyElementTag())
    }
    

}
