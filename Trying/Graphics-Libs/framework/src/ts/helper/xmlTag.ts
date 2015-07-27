class XMLTag {

    private name: string;
    private attributeList: string[][] = [];

    public constructor(name: string) {
        this.name = name;
    }

    public addAttribute(attributeName: string, attributeValue: string) {
        var newValueIndex = this.attributeList.length;
        this.attributeList[newValueIndex] = [attributeName, attributeValue]
    }

    public getStartTag(): string {
        var xmlString: string = "";
        xmlString += "<" + this.name;
        for(var attributeIndex = 0; attributeIndex < this.attributeList.length; attributeIndex++) {
            xmlString += " " + this.attributeList[attributeIndex][0] + "=\"" + this.attributeList[attributeIndex][1] + "\"";
        }
        xmlString += ">";
        return xmlString;
    }

    public getEndTag(): string {
        var xmlString: string = "";
        xmlString = "</" + this.name + ">";
        return xmlString;
    }

    public getEmptyElementTag(): string {
        var xmlString: string = "";
        xmlString += "<" + this.name + "";
        for(var attributeIndex = 0; attributeIndex < this.attributeList.length; attributeIndex++) {
            xmlString += " " + this.attributeList[attributeIndex][0] + "=\"" + this.attributeList[attributeIndex][1] + "\"";
        }
        xmlString += "/>";
        return xmlString;
    }
}
