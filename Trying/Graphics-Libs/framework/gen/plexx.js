var Constants;
(function (Constants) {
    // svg constants
    Constants.SVG_NAMESPACE = "http://www.w3.org/2000/svg";
    Constants.SVG_DOCTYPE = "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\"\n" + "\"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">";
    Constants.SVG_XML_PROLOG = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>";
    Constants.SVG_INDENT = "  ";
    // canvas default values
    Constants.DEFAULT_CANVAS_WIDTH = 1000;
    Constants.DEFAULT_CANVAS_HEIGHT = 1000;
    Constants.DEFAULT_CANVAS_COLOUR = "white";
    // primitives
    Constants.DEFAULT_COLOUR = "green";
    Constants.DEFAULT_X = 0;
    Constants.DEFAULT_Y = 0;
    Constants.DEFAULT_HEIGHT = 100;
    Constants.DEFAULT_WIDTH = 100;
    Constants.DEFAULT_CIRCLE_SIDES = 100;
    // primitives - points
    Constants.PRIMITIVES_POINTS_CIRCLE_SIDES = 100;
    (function (PointsType) {
        PointsType[PointsType["HollowCircle"] = 1] = "HollowCircle";
        PointsType[PointsType["HollowDiamond"] = 2] = "HollowDiamond";
    })(Constants.PointsType || (Constants.PointsType = {}));
    var PointsType = Constants.PointsType;
    ;
    // primitives - line
    (function (LineType) {
        LineType[LineType["Default"] = 1] = "Default";
    })(Constants.LineType || (Constants.LineType = {}));
    var LineType = Constants.LineType;
    ;
    // debug panel
    Constants.COLOR;
    //
    Constants.POINTS_DEFAULT_TYPE_ID = 1;
    Constants.POINTS_DEFAULT_SIZE = 1;
})(Constants || (Constants = {}));
var XMLTag = (function () {
    function XMLTag(name) {
        this.attributeList = [];
        this.name = name;
    }
    XMLTag.prototype.addAttribute = function (attributeName, attributeValue) {
        var newValueIndex = this.attributeList.length;
        this.attributeList[newValueIndex] = [attributeName, attributeValue];
    };
    XMLTag.prototype.getStartTag = function () {
        var xmlString = "";
        xmlString += "<" + this.name;
        for (var attributeIndex = 0; attributeIndex < this.attributeList.length; attributeIndex++) {
            xmlString += " " + this.attributeList[attributeIndex][0] + "=\"" + this.attributeList[attributeIndex][1] + "\"";
        }
        xmlString += ">";
        return xmlString;
    };
    XMLTag.prototype.getEndTag = function () {
        var xmlString = "";
        xmlString = "</" + this.name + ">";
        return xmlString;
    };
    XMLTag.prototype.getEmptyElementTag = function () {
        var xmlString = "";
        xmlString += "<" + this.name + "";
        for (var attributeIndex = 0; attributeIndex < this.attributeList.length; attributeIndex++) {
            xmlString += " " + this.attributeList[attributeIndex][0] + "=\"" + this.attributeList[attributeIndex][1] + "\"";
        }
        xmlString += "/>";
        return xmlString;
    };
    return XMLTag;
})();
/// <reference path="../general/renderContext.ts" />
/// <reference path="../general/constants.ts" />
var Plexx;
(function (Plexx) {
    var GraphNode = (function () {
        function GraphNode() {
            this.childGraphNodes = [];
        }
        GraphNode.prototype.render = function (renderContext) {
            for (var subNodeIndex = 0; subNodeIndex < this.childGraphNodes.length; subNodeIndex++) {
                var currentSubNodeRenderStatus = this.childGraphNodes[subNodeIndex].render(renderContext);
                if (currentSubNodeRenderStatus != 0) {
                    return currentSubNodeRenderStatus;
                }
            }
            return 0;
        };
        GraphNode.prototype.addChild = function (childNode) {
            childNode.setParentNode(this);
            this.childGraphNodes.push(childNode);
        };
        GraphNode.prototype.getChildNodes = function () {
            return this.childGraphNodes;
        };
        GraphNode.prototype.getNumberOfChildNodes = function () {
            return this.childGraphNodes.length;
        };
        GraphNode.prototype.getParentNode = function () {
            return this.parentGraphNode;
        };
        GraphNode.prototype.setParentNode = function (parentGraphNode) {
            this.parentGraphNode = parentGraphNode;
        };
        GraphNode.prototype.toSVGString = function () {
            var svgString;
            svgString = "";
            for (var subNodeIndex = 0; subNodeIndex < this.getChildNodes().length; subNodeIndex++) {
                svgString = svgString + this.getChildNodes()[subNodeIndex].toSVGString();
            }
            return svgString;
        };
        GraphNode.nodeTypeName = "GraphNode";
        return GraphNode;
    })();
    Plexx.GraphNode = GraphNode;
})(Plexx || (Plexx = {}));
/// <reference path="../../general/constants.ts" />
/// <reference path="../graphNode.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Plexx;
(function (Plexx) {
    var Colour = (function (_super) {
        __extends(Colour, _super);
        function Colour(colour) {
            _super.call(this);
            this.colourLiterals = {
                "black": "#000000",
                "red": "#ff0000",
                "green": "#00ff00",
                "blue": "#0000ff",
                "yellow": "#ffff00",
                "cyan": "#00ffff",
                "pink": "#ff00ff",
                "grey": "#c0c0c0",
                "white": "#ffffff"
            };
            var colourValues;
            if (colour) {
                colourValues = this.parseColourString(colour);
                if (colourValues == null) {
                    console.log("[FDGL] " + Colour.nodeTypeName + "Error: Colour (" + colour + ") not recognized! Fallback to default colour value");
                }
            }
            else {
                colourValues = this.parseColourString(Constants.DEFAULT_CANVAS_COLOUR);
                console.log("[FDGL] " + Colour.nodeTypeName + " No colour value set, fallback to default colour.");
            }
            this.colorValueR = colourValues[0];
            this.colorValueG = colourValues[1];
            this.colorValueB = colourValues[2];
            this.colorValueA = colourValues[3];
        }
        Colour.prototype.parseColourString = function (colourString) {
            var parseableColourString = colourString.toLowerCase();
            var colourValues = [];
            if (parseableColourString.charAt(0) != "#") {
                if (this.colourLiterals[colourString]) {
                    parseableColourString = this.colourLiterals[colourString];
                }
                else
                    return null;
            }
            if (this.isHexValue(parseableColourString.substring(1, parseableColourString.length - 1))) {
                colourValues[0] = +("0x" + parseableColourString[1] + parseableColourString[2]);
                colourValues[1] = +("0x" + parseableColourString[3] + parseableColourString[4]);
                colourValues[2] = +("0x" + parseableColourString[5] + parseableColourString[6]);
                if (parseableColourString.length == 9) {
                    colourValues[3] = +("0x" + parseableColourString[7] + parseableColourString[8]);
                }
                else {
                    colourValues[3] = 0xFF;
                }
                return colourValues;
            }
            return null;
        };
        Colour.prototype.isHexValue = function (element) {
            var elementLowercase = element.toUpperCase();
            var hexChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
            for (var index = 0; index <= elementLowercase.length; index++) {
                var currentValue = elementLowercase[index];
                var isHex = false;
                for (var hexCharIndex = 0; hexCharIndex <= hexChars.length; hexCharIndex++) {
                    if (currentValue == hexChars[hexCharIndex]) {
                        isHex = true;
                    }
                }
                if (isHex == false)
                    return false;
            }
            return true;
        };
        Colour.prototype.setColour = function (colour) {
            var colourValues = [];
            colourValues = this.parseColourString(colour);
            if (colourValues != null) {
                this.colorValueR = colourValues[0];
                this.colorValueG = colourValues[1];
                this.colorValueB = colourValues[2];
                this.colorValueA = colourValues[3];
            }
            else {
                colourValues = this.parseColourString(Constants.DEFAULT_COLOUR);
                this.colorValueR = colourValues[0];
                this.colorValueG = colourValues[1];
                this.colorValueB = colourValues[2];
                this.colorValueA = colourValues[3];
            }
        };
        Colour.prototype.getRHex = function () {
            return this.colorValueR;
        };
        Colour.prototype.getGHex = function () {
            return this.colorValueG;
        };
        Colour.prototype.getBHex = function () {
            return this.colorValueB;
        };
        Colour.prototype.getAHex = function () {
            return this.colorValueA;
        };
        Colour.prototype.getR = function () {
            return this.colorValueR / 0xFF;
        };
        Colour.prototype.getG = function () {
            return this.colorValueG / 0xFF;
        };
        Colour.prototype.getB = function () {
            return this.colorValueB / 0xFF;
        };
        Colour.prototype.getA = function () {
            return this.colorValueA / 0xFF;
        };
        Colour.prototype.getRGBString = function () {
            var textstring = "#";
            var colorStringR = this.colorValueR.toString(16);
            var colorStringG = this.colorValueG.toString(16);
            var colorStringB = this.colorValueB.toString(16);
            if (colorStringR.length == 1)
                textstring += "0" + colorStringR;
            else
                textstring += colorStringR;
            if (colorStringG.length == 1)
                textstring += "0" + colorStringG;
            else
                textstring += colorStringG;
            if (colorStringB.length == 1)
                textstring += "0" + colorStringB;
            else
                textstring += colorStringB;
            return textstring;
        };
        Colour.prototype.getRGBAString = function () {
            var textstring = "#";
            var colorStringR = this.colorValueR.toString(16);
            var colorStringG = this.colorValueG.toString(16);
            var colorStringB = this.colorValueB.toString(16);
            var colorStringA = this.colorValueA.toString(16);
            if (colorStringR.length == 1)
                textstring += "0" + colorStringR;
            else
                textstring += colorStringR;
            if (colorStringG.length == 1)
                textstring += "0" + colorStringG;
            else
                textstring += colorStringG;
            if (colorStringB.length == 1)
                textstring += "0" + colorStringB;
            else
                textstring += colorStringB;
            if (colorStringA.length == 1)
                textstring += "0" + colorStringA;
            else
                textstring += colorStringA;
            return textstring;
        };
        Colour.prototype.getCss3String = function () {
            var textstring = "";
            textstring += "rgba(";
            textstring += this.colorValueR.toString() + ",";
            textstring += this.colorValueG.toString() + ",";
            textstring += this.colorValueB.toString() + ",";
            textstring += (this.colorValueA / 0xFF) + ")";
            return textstring;
        };
        Colour.nodeTypeName = "ColourNode";
        return Colour;
    })(Plexx.GraphNode);
    Plexx.Colour = Colour;
})(Plexx || (Plexx = {}));
var XMLComment = (function () {
    function XMLComment(commentText) {
        this.commentText = commentText;
    }
    XMLComment.prototype.getLineCommentTag = function () {
        return "<!-- " + this.commentText + " -->";
    };
    XMLComment.prototype.getBlockCommentTag = function () {
        return "<!--\n" + this.commentText + "\n-->";
    };
    return XMLComment;
})();
/// <reference path="../general/renderContext.ts" />
/// <reference path="../general/constants.ts" />
/// <reference path="../../../libs/TSM/tsm-0.7.d.ts" />
/// <reference path="../general/constants.ts" />
/// <reference path="../general/renderContext.ts" />
/// <reference path="../helper/xmlComment.ts" />
/// <reference path="sceneGraphComponent.ts" />
var Plexx;
(function (Plexx) {
    var SceneGraphLeaf = (function () {
        function SceneGraphLeaf(name) {
            this.name = "Default";
            this.transformationMatrix = new TSM.mat3().setIdentity();
            this.points = new Array();
        }
        SceneGraphLeaf.prototype.toString = function () {
            var stringtext = "";
            stringtext += "Node {name = " + this.name + ", points =" + this.getPointsAsArray().toString() + "}";
            return stringtext;
        };
        SceneGraphLeaf.prototype.copy = function () {
            var sceneGraphLeafCopy = {};
            for (var key in this) {
                if (this.hasOwnProperty(key))
                    sceneGraphLeafCopy[key] = this[key];
            }
            return sceneGraphLeafCopy;
        };
        SceneGraphLeaf.prototype.render = function (renderContext) {
            return false;
        };
        SceneGraphLeaf.prototype.toSVGString = function (renderContext) {
            var xmlComment = new XMLComment(this.name);
            return xmlComment.getLineCommentTag();
        };
        SceneGraphLeaf.prototype.getName = function () {
            return this.name;
        };
        SceneGraphLeaf.prototype.setName = function (name) {
            this.name = name;
        };
        SceneGraphLeaf.prototype.setPoints = function (points) {
            this.points = points;
        };
        SceneGraphLeaf.prototype.setPointsFromArray = function (pointsArray) {
            for (var i = 0; i < pointsArray.length; i += 2) {
                this.points.push(new TSM.vec2([pointsArray[i], pointsArray[i + 1]]));
            }
        };
        SceneGraphLeaf.prototype.getPoints = function () {
            return this.points;
        };
        SceneGraphLeaf.prototype.getPointsAsArray = function () {
            var pointArray = [];
            for (var index = 0; index < this.points.length; index++) {
                pointArray.push[this.points[index].x];
                pointArray.push[this.points[index].y];
            }
            return pointArray;
        };
        SceneGraphLeaf.prototype.getTransformationMatrix = function () {
            return this.transformationMatrix;
        };
        SceneGraphLeaf.prototype.setTransformationMatrix = function (transformationMatrix) {
            this.transformationMatrix = transformationMatrix;
        };
        SceneGraphLeaf.prototype.translateX = function (translateX) {
            this.transformationMatrix = this.transformationMatrix.copy().multiply(new TSM.mat3([1, 0, 0, 0, 1, 0, translateX, 0, 1]));
            return this;
        };
        SceneGraphLeaf.prototype.translateY = function (translateY) {
            this.transformationMatrix = this.transformationMatrix.copy().multiply(new TSM.mat3([1, 0, 0, 0, 1, 0, 0, translateY, 1]));
            return this;
        };
        SceneGraphLeaf.prototype.translateXY = function (translateX, translateY) {
            this.transformationMatrix = this.transformationMatrix.copy().multiply(new TSM.mat3([1, 0, 0, 0, 1, 0, translateX, translateY, 1]));
            return this;
        };
        SceneGraphLeaf.prototype.scaleXY = function (scaleX, scaleY) {
            this.transformationMatrix = this.transformationMatrix.copy().multiply(new TSM.mat3([scaleX, 0, 0, 0, scaleY, 0, 0, 0, 1]));
            return this;
        };
        SceneGraphLeaf.prototype.setCanvasNode = function (canvasNode) {
            this.canvasNode = canvasNode;
        };
        SceneGraphLeaf.prototype.getCanvasNode = function () {
            return this.canvasNode;
        };
        return SceneGraphLeaf;
    })();
    Plexx.SceneGraphLeaf = SceneGraphLeaf;
})(Plexx || (Plexx = {}));
/// <reference path="../../general/constants.ts" />
/// <reference path="../graphNode.ts" />
/// <reference path="../sceneGraphLeaf.ts" />
/// <reference path="../materials/colour.ts" />
/// <reference path="../../helper/xmlTag.ts" />
/// <reference path="../../general/renderContext.ts" />
var Plexx;
(function (Plexx) {
    var Line = (function (_super) {
        __extends(Line, _super);
        function Line(x1, y1, x2, y2, width, type, colourValue, startArrow, endArrow) {
            _super.call(this, "Line");
            this.arrowScale = 10;
            this.i = 0;
            this.setPointsFromArray([x1, y1, x2, y2]);
            this.width = width || Constants.DEFAULT_HEIGHT;
            this.type = type || Constants.LineType.Default;
            this.colour = new Plexx.Colour(colourValue);
            this.startArrow = startArrow || false;
            this.endArrow = endArrow || false;
            console.log("[FDGL] " + this.toString() + " created");
        }
        Line.prototype.setType = function (typeId) {
            this.type = typeId;
        };
        Line.prototype.getType = function () {
            return this.type;
        };
        Line.prototype.setColour = function (colour) {
            this.colour.setColour(colour);
        };
        Line.prototype.getColour = function () {
            return this.colour.getRGBString();
        };
        Line.prototype.render = function (renderContext) {
            var currentRenderType = renderContext.getRenderType();
            if (currentRenderType == Plexx.RenderType.CANVAS2D) {
                this.updateCanvas2d(renderContext);
            }
            else if (currentRenderType == Plexx.RenderType.SVG) {
                this.updateSVG(renderContext);
            }
            else if (currentRenderType == Plexx.RenderType.WEBGL) {
                this.updateWebGL(renderContext);
            }
            return true;
        };
        Line.prototype.updateCanvas2d = function (renderContext) {
            var phi = 0;
            var x1 = this.getPoints()[0].x;
            var y1 = this.getPoints()[0].y;
            var x2 = this.getPoints()[1].x;
            var y2 = this.getPoints()[1].y;
            var x3 = 0;
            var y3 = 0;
            var x4 = 0;
            var y4 = 0;
            var l = Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1));
            var transformationMatrix = this.getTransformationMatrix();
            var mirrorMatrix = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix = mirrorMatrix.copy().multiply(transformationMatrix);
            var context2D = renderContext.getCanvas2D().getContext("2d");
            context2D.setTransform(resultMatrix.at(0), resultMatrix.at(1), resultMatrix.at(3), resultMatrix.at(4), resultMatrix.at(6), resultMatrix.at(7));
            if (this.type == Constants.LineType.Default) {
                context2D.beginPath();
                if (this.startArrow) {
                    phi = Math.atan2(y1 - y2, x1 - x2);
                    x4 = x2 + (l - this.arrowScale * 5) * Math.cos(phi);
                    y4 = y2 + (l - this.arrowScale * 5) * Math.sin(phi);
                }
                else {
                    x4 = x1;
                    y4 = y1;
                }
                context2D.moveTo(x4, y4);
                if (this.endArrow) {
                    phi = Math.atan2(y2 - y1, x2 - x1);
                    x3 = x1 + (l - this.arrowScale * 5) * Math.cos(phi);
                    y3 = y1 + (l - this.arrowScale * 5) * Math.sin(phi);
                }
                else {
                    x3 = x2;
                    y3 = y2;
                }
                context2D.lineTo(x3, y3);
                context2D.strokeStyle = this.colour.getCss3String();
                context2D.fill();
                context2D.lineWidth = this.width;
                context2D.closePath();
                context2D.stroke();
            }
            if (this.startArrow) {
                var s = this.arrowScale;
                context2D.save();
                context2D.lineWidth = 1;
                context2D.translate(x1, y1);
                context2D.rotate(Math.PI + Math.atan2(y2 - y1, x2 - x1));
                context2D.beginPath();
                context2D.moveTo(-5 * s, s);
                context2D.lineTo(-5 * s, -s);
                context2D.lineTo(0, 0);
                context2D.fillStyle = this.colour.getRGBString();
                context2D.fill();
                context2D.strokeStyle = "none";
                context2D.lineWidth = 0;
                context2D.closePath();
                context2D.translate(-x1, -y1);
                context2D.stroke();
                context2D.restore();
            }
            if (this.endArrow) {
                var s = 10;
                context2D.save();
                context2D.lineWidth = 1;
                context2D.translate(x2, y2);
                context2D.rotate(Math.atan2(y2 - y1, x2 - x1));
                context2D.beginPath();
                context2D.moveTo(-5 * s, s);
                context2D.lineTo(-5 * s, -s);
                context2D.lineTo(0, 0);
                context2D.fillStyle = this.colour.getRGBString();
                context2D.fill();
                context2D.strokeStyle = "none";
                context2D.lineWidth = 0;
                context2D.closePath();
                context2D.translate(-x2, -y2);
                context2D.stroke();
                context2D.restore();
            }
            return true;
        };
        Line.prototype.updateSVG = function (renderContext) {
            var phi = 0;
            var x1 = this.getPoints()[0].x;
            var y1 = this.getPoints()[0].y;
            var x2 = this.getPoints()[1].x;
            var y2 = this.getPoints()[1].y;
            var x3 = 0;
            var y3 = 0;
            var x4 = 0;
            var y4 = 0;
            var l = Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1));
            var transformationMatrix = this.getTransformationMatrix();
            var mirrorMatrix = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix = mirrorMatrix.copy().multiply(transformationMatrix);
            // draw line
            if (this.type == Constants.LineType.Default) {
                var SVGPoint = document.createElementNS(Constants.SVG_NAMESPACE, "line");
                SVGPoint.setAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " + resultMatrix.at(3) + " " + resultMatrix.at(4) + " " + resultMatrix.at(6) + " " + resultMatrix.at(7) + ")");
                if (this.startArrow) {
                    phi = Math.atan2(y1 - y2, x1 - x2);
                    x4 = x2 + (l - this.arrowScale * 5) * Math.cos(phi);
                    y4 = y2 + (l - this.arrowScale * 5) * Math.sin(phi);
                }
                else {
                    x4 = x1;
                    y4 = y1;
                }
                if (this.endArrow) {
                    phi = Math.atan2(y2 - y1, x2 - x1);
                    x3 = x1 + (l - this.arrowScale * 5) * Math.cos(phi);
                    y3 = y1 + (l - this.arrowScale * 5) * Math.sin(phi);
                }
                else {
                    x3 = x2;
                    y3 = y2;
                }
                SVGPoint.setAttribute("x1", String(x3));
                SVGPoint.setAttribute("y1", String(y3));
                SVGPoint.setAttribute("x2", String(x4));
                SVGPoint.setAttribute("y2", String(y4));
                SVGPoint.setAttribute("stroke", this.colour.getRGBString());
                SVGPoint.setAttribute("stroke-width", String(this.width));
                renderContext.getSVG().appendChild(SVGPoint);
            }
            // draw start arrow
            if (this.startArrow) {
                var s = this.arrowScale;
                var SVGObject = document.createElementNS(Constants.SVG_NAMESPACE, "polygon");
                //            SVGObject.setAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " +  resultMatrix.at(3) + " " + resultMatrix.at(4) + " " +  resultMatrix.at(6) + " " + resultMatrix.at(7) + ")");
                SVGObject.setAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " + resultMatrix.at(3) + " " + resultMatrix.at(4) + " " + resultMatrix.at(6) + " " + resultMatrix.at(7) + ") rotate(" + ((Math.PI + Math.atan2(y2 - y1, x2 - x1)) * 180 / Math.PI) + "," + String(x1) + "," + String(y1) + ") ");
                SVGObject.setAttribute("points", String(x1 + -5 * s) + "," + String(y1 + s) + " " +
                    String(x1 + -5 * s) + "," + String(y1 - s) + " " +
                    String(x1) + "," + String(y1));
                SVGObject.setAttribute("fill", this.colour.getRGBString());
                SVGObject.setAttribute("stroke", "none");
                renderContext.getSVG().appendChild(SVGObject);
            }
            // draw end arrow
            if (this.endArrow) {
                var s = this.arrowScale;
                var SVGObject2 = document.createElementNS(Constants.SVG_NAMESPACE, "polygon");
                SVGObject2.setAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " + resultMatrix.at(3) + " " + resultMatrix.at(4) + " " + resultMatrix.at(6) + " " + resultMatrix.at(7) + ") rotate(" + ((Math.atan2(y2 - y1, x2 - x1)) * 180 / Math.PI) + "," + String(x2) + "," + String(y2) + ") ");
                SVGObject2.setAttribute("points", String(x2 - 5 * s) + "," + String(y2 + s) + " " +
                    String(x2 - 5 * s) + "," + String(y2 - s) + " " +
                    String(x2) + "," + String(y2));
                SVGObject2.setAttribute("fill", this.colour.getRGBString());
                SVGObject2.setAttribute("stroke", "none");
                renderContext.getSVG().appendChild(SVGObject2);
            }
            return true;
        };
        Line.prototype.updateWebGL = function (renderContext) {
            var phi = 0;
            var x1 = this.getPoints()[0].x;
            var y1 = this.getPoints()[0].y;
            var x2 = this.getPoints()[1].x;
            var y2 = this.getPoints()[1].y;
            var x3 = 0;
            var y3 = 0;
            var x4 = 0;
            var y4 = 0;
            var l = Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1));
            var gl = renderContext.getCanvasWebGL().getContext("webgl");
            // vertex shader
            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, this.generateVertexShaderSource());
            gl.compileShader(vertexShader);
            // fragment shader
            var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, this.generateFragmentShaderSource());
            gl.compileShader(fragmentShader);
            // shaderProgram
            var shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            gl.useProgram(shaderProgram);
            var positionLocation = gl.getAttribLocation(shaderProgram, "aVertexPosition");
            // buffer
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            var resolutionLocation = gl.getUniformLocation(shaderProgram, "resolution");
            var rotationLocation = gl.getUniformLocation(shaderProgram, "rotation");
            var translationLocation = gl.getUniformLocation(shaderProgram, "translation");
            console.log(resolutionLocation);
            gl.uniform2f(resolutionLocation, renderContext.getCanvasWebGL().getAttribute("width"), renderContext.getCanvasWebGL().getAttribute("height"));
            gl.uniform2f(rotationLocation, Math.sqrt(2) / 2, Math.sqrt(2));
            gl.lineWidth(this.width);
            var tM = new Float32Array(this.getTransformationMatrix().all());
            var matrix = gl.getUniformLocation(shaderProgram, "matrix");
            gl.uniformMatrix3fv(matrix, false, tM);
            if (this.type == Constants.LineType.Default) {
                var polygonVertices = new Float32Array(4);
                if (this.startArrow) {
                    phi = Math.atan2(y1 - y2, x1 - x2);
                    x4 = x2 + (l - this.arrowScale * 5) * Math.cos(phi);
                    y4 = y2 + (l - this.arrowScale * 5) * Math.sin(phi);
                }
                else {
                    x4 = x1;
                    y4 = y1;
                }
                if (this.endArrow) {
                    phi = Math.atan2(y2 - y1, x2 - x1);
                    x3 = x1 + (l - this.arrowScale * 5) * Math.cos(phi);
                    y3 = y1 + (l - this.arrowScale * 5) * Math.sin(phi);
                }
                else {
                    x3 = x2;
                    y3 = y2;
                }
                polygonVertices[0] = x3;
                polygonVertices[1] = y3;
                polygonVertices[2] = x4;
                polygonVertices[3] = y4;
                gl.bufferData(gl.ARRAY_BUFFER, polygonVertices, gl.STATIC_DRAW);
                gl.enableVertexAttribArray(positionLocation);
                gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
                var rotation = [0, 1];
                gl.uniform2fv(translationLocation, [0, 0]);
                gl.uniform2fv(rotationLocation, rotation);
                gl.drawArrays(gl.LINE_STRIP, 0, 2);
            }
            if (this.endArrow) {
                var gl = renderContext.getCanvasWebGL().getContext("webgl");
                // vertex shader
                var vertexShader = gl.createShader(gl.VERTEX_SHADER);
                gl.shaderSource(vertexShader, this.generateVertexShaderSource());
                gl.compileShader(vertexShader);
                // fragment shader
                var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
                gl.shaderSource(fragmentShader, this.generateFragmentShaderSource());
                gl.compileShader(fragmentShader);
                // shaderProgram
                var shaderProgram = gl.createProgram();
                gl.attachShader(shaderProgram, vertexShader);
                gl.attachShader(shaderProgram, fragmentShader);
                gl.linkProgram(shaderProgram);
                gl.useProgram(shaderProgram);
                var positionLocation = gl.getAttribLocation(shaderProgram, "aVertexPosition");
                // buffer
                var buffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                var rotationLocation = gl.getUniformLocation(shaderProgram, "rotation");
                var resolutionLocation = gl.getUniformLocation(shaderProgram, "resolution");
                var translationLocation = gl.getUniformLocation(shaderProgram, "translation");
                var tM = new Float32Array(this.getTransformationMatrix().all());
                var matrix = gl.getUniformLocation(shaderProgram, "matrix");
                gl.uniformMatrix3fv(matrix, false, tM);
                gl.lineWidth(this.width);
                var s = this.arrowScale;
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                    0, s,
                    0, -s,
                    5 * s, 0]), gl.STATIC_DRAW);
                gl.enableVertexAttribArray(positionLocation);
                gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
                gl.uniform2f(resolutionLocation, renderContext.getCanvasWebGL().getAttribute("width"), renderContext.getCanvasWebGL().getAttribute("height"));
                var phi = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2;
                gl.uniform2fv(translationLocation, [x3, y3]);
                var rotation = [Math.cos(phi), Math.sin(phi)];
                gl.uniform2fv(rotationLocation, rotation);
                gl.drawArrays(gl.TRIANGLES, 0, 3);
            }
            if (this.startArrow) {
                var gl = renderContext.getCanvasWebGL().getContext("webgl");
                // vertex shader
                var vertexShader = gl.createShader(gl.VERTEX_SHADER);
                gl.shaderSource(vertexShader, this.generateVertexShaderSource());
                gl.compileShader(vertexShader);
                // fragment shader
                var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
                gl.shaderSource(fragmentShader, this.generateFragmentShaderSource());
                gl.compileShader(fragmentShader);
                // shaderProgram
                var shaderProgram = gl.createProgram();
                gl.attachShader(shaderProgram, vertexShader);
                gl.attachShader(shaderProgram, fragmentShader);
                gl.linkProgram(shaderProgram);
                gl.useProgram(shaderProgram);
                var positionLocation = gl.getAttribLocation(shaderProgram, "aVertexPosition");
                // buffer
                var buffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                var rotationLocation = gl.getUniformLocation(shaderProgram, "rotation");
                var resolutionLocation = gl.getUniformLocation(shaderProgram, "resolution");
                var translationLocation = gl.getUniformLocation(shaderProgram, "translation");
                var tM = new Float32Array(this.getTransformationMatrix().all());
                var matrix = gl.getUniformLocation(shaderProgram, "matrix");
                gl.uniformMatrix3fv(matrix, false, tM);
                gl.lineWidth(this.width);
                var s = this.arrowScale;
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                    0, s,
                    0, -s,
                    5 * s, 0]), gl.STATIC_DRAW);
                gl.enableVertexAttribArray(positionLocation);
                gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
                gl.uniform2f(resolutionLocation, renderContext.getCanvasWebGL().getAttribute("width"), renderContext.getCanvasWebGL().getAttribute("height"));
                var phi = Math.atan2(y2 - y1, x2 - x1) - Math.PI / 2;
                gl.uniform2fv(translationLocation, [x4, y4]);
                var rotation = [Math.cos(phi), Math.sin(phi)];
                gl.uniform2fv(rotationLocation, rotation);
                gl.drawArrays(gl.TRIANGLES, 0, 3);
            }
            return true;
        };
        Line.prototype.generateVertexShaderSource = function () {
            var vertexShaderSource = "attribute vec2 aVertexPosition;                             \n" +
                "                                                            \n" +
                "uniform vec2 resolution;                                    \n" +
                "uniform vec2 rotation;                                      \n" +
                "uniform vec2 translation;                                      \n" +
                "                                                            \n" +
                "uniform mat3 matrix;                                          \n" +
                "                                                              \n" +
                "void main() {                                                 \n" +
                "  vec2 pos = (matrix * vec3(aVertexPosition, 1)).xy;          \n" +
                "  vec2 rotatedPosition = vec2(                              \n" +
                "       aVertexPosition.x * rotation.y + pos.y * rotation.x,           \n" +
                "       aVertexPosition.y * rotation.y - pos.x * rotation.x);          \n" +
                "  vec2 position = rotatedPosition + translation;                 \n" +
                "  vec2 tmp1 = position / resolution;                 \n" +
                "  vec2 tmp2 = tmp1 * 2.0;                                   \n" +
                "  vec2 tmp3 = tmp2 - 1.0;                                   \n" +
                "  gl_Position = vec4(tmp3, 0, 1);             \n" +
                "}                                                           \n";
            return vertexShaderSource;
        };
        Line.prototype.generateFragmentShaderSource = function () {
            var fragmentShaderSrc = "precision mediump float;                                    \n" +
                "                                                            \n" +
                "void main() {                                               \n" +
                "  gl_FragColor = vec4(" +
                this.colour.getR() + ", " +
                this.colour.getG() + ", " +
                this.colour.getB() + ", " +
                this.colour.getA() + ");                                     \n" +
                "}                                                           \n";
            return fragmentShaderSrc;
        };
        Line.prototype.toSVGString = function () {
            var svgString = "";
            return svgString;
        };
        Line.prototype.copy = function () {
            return new Line(this.getPoints()[0].x, this.getPoints()[0].y, this.getPoints()[1].x, this.getPoints()[1].y, this.width, this.type, this.colour.getRGBAString(), this.startArrow, this.endArrow);
        };
        return Line;
    })(Plexx.SceneGraphLeaf);
    Plexx.Line = Line;
})(Plexx || (Plexx = {}));
/// <reference path="../general/renderContext.ts" />
/// <reference path="../general/constants.ts" />
/// <reference path="sceneGraphComponent.ts" />
/// <reference path="sceneGraphLeaf.ts" />
/// <reference path="../helper/xmlComment.ts" />
var Plexx;
(function (Plexx) {
    var SceneGraphCompositeNode = (function () {
        function SceneGraphCompositeNode(name) {
            this.childSceneGraphComponents = [];
            this.name = "Default";
            this.childSceneGraphComponents = [];
        }
        SceneGraphCompositeNode.prototype.toString = function () {
            return this.name;
        };
        SceneGraphCompositeNode.prototype.render = function (renderContext) {
            for (var currentIndex = 0; currentIndex < this.childSceneGraphComponents.length; currentIndex++) {
                var currentStatus = this.childSceneGraphComponents[currentStatus].render(renderContext);
                if (currentStatus == false) {
                    return false;
                }
            }
            return true;
        };
        SceneGraphCompositeNode.prototype.copy = function () {
            var sceneGraphCompositeCopy = {};
            for (var key in this) {
                if (this.hasOwnProperty(key))
                    sceneGraphCompositeCopy[key] = this[key];
            }
            return sceneGraphCompositeCopy;
        };
        SceneGraphCompositeNode.prototype.toSVGString = function (rendercontext) {
            var xmlComment = new XMLComment(this.name);
            return xmlComment.getLineCommentTag();
        };
        SceneGraphCompositeNode.prototype.add = function (sceneGraphComponent) {
            this.childSceneGraphComponents.push(sceneGraphComponent);
        };
        SceneGraphCompositeNode.prototype.addAtTop = function (sceneGraphComponent) {
            this.childSceneGraphComponents.unshift(sceneGraphComponent);
        };
        SceneGraphCompositeNode.prototype.remove = function (sceneGraphComponent) {
            var sceneGraphComponentIndex = this.childSceneGraphComponents.indexOf(sceneGraphComponent);
            if (sceneGraphComponentIndex != -1) {
                this.childSceneGraphComponents.splice(sceneGraphComponentIndex, 1);
            }
        };
        SceneGraphCompositeNode.prototype.getChilds = function () {
            return this.childSceneGraphComponents;
        };
        SceneGraphCompositeNode.prototype.getAllLeafs = function () {
            var leafs = [];
            for (var subNodeIndex = 0; subNodeIndex < this.getChilds().length; subNodeIndex++) {
                var childNode = this.getChilds()[subNodeIndex];
                if (childNode instanceof SceneGraphCompositeNode) {
                    var sceneGraphCompositeChildNode = this.getChilds()[subNodeIndex];
                    for (var subNodeIndex2 = 0; subNodeIndex2 < sceneGraphCompositeChildNode.getAllLeafs().length; subNodeIndex2++) {
                        var sceneGraphLeafChildNode = sceneGraphCompositeChildNode.getChilds()[subNodeIndex2];
                        leafs.push(sceneGraphLeafChildNode);
                    }
                }
                else if (childNode instanceof Plexx.SceneGraphLeaf) {
                    leafs.push(childNode);
                }
            }
            return leafs;
        };
        SceneGraphCompositeNode.prototype.setName = function (name) {
            this.name = name;
        };
        SceneGraphCompositeNode.prototype.getName = function () {
            return this.name;
        };
        return SceneGraphCompositeNode;
    })();
    Plexx.SceneGraphCompositeNode = SceneGraphCompositeNode;
})(Plexx || (Plexx = {}));
/// <reference path="../general/constants.ts" />
/// <reference path="../general/renderContext.ts" />
/// <reference path="../helper/xmlTag.ts" />
/// <reference path="../nodes/materials/colour.ts" />
/// <reference path="../nodes/primitives/line.ts" />
/// <reference path="graphNode.ts" />
/// <reference path="sceneGraphComponent.ts" />
/// <reference path="sceneGraphComposite.ts" />
/// <reference path="sceneGraphLeaf.ts" />
var Plexx;
(function (Plexx) {
    var CanvasNode = (function (_super) {
        __extends(CanvasNode, _super);
        function CanvasNode(width, height, colour) {
            _super.call(this);
            this.canvasWidth = width || Constants.DEFAULT_CANVAS_WIDTH;
            this.canvasHeight = height || Constants.DEFAULT_CANVAS_HEIGHT;
            if (colour) {
                this.canvasColour = new Plexx.Colour(colour);
            }
            else {
                this.canvasColour = new Plexx.Colour();
            }
            this.debugOrigin = [];
            this.debugLines = [];
            this.areLinesVisible = false;
            this.areLinesVisible = false;
        }
        CanvasNode.prototype.render = function (renderContext) {
            this.lastTimeRendered = new Date();
            renderContext.setCanvasNode(this);
            this.showLines(this.areLinesVisible);
            this.showOrigin(this.isOriginVisible);
            var currentRenderType = renderContext.getRenderType();
            if (currentRenderType == Plexx.RenderType.CANVAS2D) {
                this.updateCanvas2d(renderContext);
            }
            else if (currentRenderType == Plexx.RenderType.SVG) {
                this.updateSVG(renderContext);
            }
            else if (currentRenderType == Plexx.RenderType.WEBGL) {
                this.updateWebGL(renderContext);
            }
            for (var subNodeIndex = 0; subNodeIndex < this.getChilds().length; subNodeIndex++) {
                var currentSubNodeRenderStatus = this.getChilds()[subNodeIndex].render(renderContext);
                if (currentSubNodeRenderStatus == false) {
                    return false;
                }
            }
            var currentTime = new Date();
            this.renderTime = (currentTime.getTime() - this.lastTimeRendered.getTime()) / 1000;
            return true;
        };
        CanvasNode.prototype.updateCanvas2d = function (renderContext) {
            renderContext.getCanvas2D().width = this.canvasWidth;
            renderContext.getCanvas2D().height = this.canvasHeight;
            renderContext.getCanvas2D().style = "height:100%;width:100%;background-color: " + this.canvasColour.getRGBString();
            return 0;
        };
        CanvasNode.prototype.updateSVG = function (renderContext) {
            renderContext.getSVG().setAttributeNS(null, "viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);
            renderContext.getSVG().setAttributeNS(null, "preserveAspectRatio", "" + "none");
            renderContext.getSVG().setAttributeNS(null, "width", "" + this.canvasWidth);
            renderContext.getSVG().setAttributeNS(null, "height", "" + this.canvasHeight);
            renderContext.getSVG().setAttributeNS(null, "shape-rendering", "geometricPrecision");
            renderContext.getSVG().setAttributeNS(null, "style", "width: 100%; height: 100%; background: " + this.canvasColour.getRGBString());
            return 0;
        };
        CanvasNode.prototype.updateWebGL = function (renderContext) {
            renderContext.getCanvasWebGL().setAttribute("height", this.canvasHeight);
            renderContext.getCanvasWebGL().setAttribute("width", this.canvasWidth);
            renderContext.getCanvasWebGL().setAttribute("style", "width: 100%; height: 100%;");
            var gl = renderContext.getCanvasWebGL().getContext("webgl");
            gl.clearColor(this.canvasColour.getR() * this.canvasColour.getA(), this.canvasColour.getG() * this.canvasColour.getA(), this.canvasColour.getB() * this.canvasColour.getA(), this.canvasColour.getA());
            gl.clear(gl.COLOR_BUFFER_BIT);
            // enable alpha blending
            gl.enable(gl.BLEND);
            gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
            // set blend function
            gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            return 0;
        };
        CanvasNode.prototype.getHeight = function () {
            return this.canvasHeight;
        };
        CanvasNode.prototype.getWidth = function () {
            return this.canvasWidth;
        };
        CanvasNode.prototype.setHeight = function (height) {
            this.canvasHeight = height;
        };
        CanvasNode.prototype.setWidth = function (width) {
            this.canvasWidth = width;
        };
        CanvasNode.prototype.getTime = function () {
            return this.renderTime;
        };
        CanvasNode.prototype.toSVGString = function (renderContext) {
            var svgString = "";
            svgString += Constants.SVG_XML_PROLOG + "\n";
            svgString += Constants.SVG_DOCTYPE + "\n";
            var xmlTag = new XMLTag("svg");
            xmlTag.addAttribute("width", String(this.canvasWidth) + "px");
            xmlTag.addAttribute("height", String(this.canvasHeight) + "px");
            xmlTag.addAttribute("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);
            xmlTag.addAttribute("viewport-fill", this.canvasColour.getRGBString());
            xmlTag.addAttribute("style", "width: " + String(this.canvasWidth) + "px" + "; height: " + String(this.canvasWidth) + "px" + "; background: " + this.canvasColour.getRGBString());
            xmlTag.addAttribute("xmlns", "http://www.w3.org/2000/svg");
            xmlTag.addAttribute("version", "1.1");
            svgString += xmlTag.getStartTag() + "\n";
            for (var subNodeIndex = 0; subNodeIndex < this.getChilds().length; subNodeIndex++) {
                var subNodeSVGLines = this.getChilds()[subNodeIndex].toSVGString(renderContext).split("\n");
                for (var subNodeSVGLinesIndex = 0; subNodeSVGLinesIndex < subNodeSVGLines.length; subNodeSVGLinesIndex++) {
                    if (subNodeSVGLines[subNodeSVGLinesIndex] != "")
                        svgString += Constants.SVG_INDENT + subNodeSVGLines[subNodeSVGLinesIndex] + "\n";
                }
            }
            svgString = svgString + xmlTag.getEndTag() + "\n";
            return svgString;
        };
        CanvasNode.prototype.showLines = function (show) {
            var xMax = this.canvasWidth;
            var yMax = this.canvasHeight;
            if (!show && this.debugLines.length != 0) {
                for (var i = 0; i < this.debugLines.length; i++) {
                    this.remove(this.debugLines[i]);
                }
                this.debugLines = [];
            }
            else if (show && this.debugLines.length == 0) {
                for (var yIndex = 0; yIndex <= yMax; yIndex = yIndex + 100) {
                    var currentLine = new Plexx.Line(0, yIndex, xMax, yIndex, 1, Constants.LineType.Default, "grey");
                    this.debugLines.push(currentLine);
                }
                for (var xIndex = 0; xIndex <= xMax; xIndex = xIndex + 100) {
                    var currentLine = new Plexx.Line(xIndex, 0, xIndex, yMax, 1, Constants.LineType.Default, "grey");
                    this.debugLines.push(currentLine);
                }
                for (var i = 0; i < this.debugLines.length; i++) {
                    this.addAtTop(this.debugLines[i]);
                }
            }
        };
        CanvasNode.prototype.showOrigin = function (show) {
            if (!show && this.debugOrigin.length != 0) {
                for (var i = 0; i < this.debugOrigin.length; i++) {
                    this.remove(this.debugOrigin[i]);
                }
                this.debugOrigin = [];
            }
            else if (show && this.debugOrigin.length == 0) {
                var xOrigin = new Plexx.Line(0, 0, 0, 100, 3, Constants.LineType.Default, "grey", false, true);
                var yOrigin = new Plexx.Line(0, 0, 100, 0, 3, Constants.LineType.Default, "grey", false, true);
                this.debugOrigin.push(xOrigin);
                this.debugOrigin.push(yOrigin);
                for (var i = 0; i < this.debugOrigin.length; i++) {
                    this.add(this.debugOrigin[i]);
                }
            }
        };
        return CanvasNode;
    })(Plexx.SceneGraphCompositeNode);
    Plexx.CanvasNode = CanvasNode;
})(Plexx || (Plexx = {}));
/// <reference path="constants.ts" />
/// <reference path="../nodes/canvasnode.ts" />
var Plexx;
(function (Plexx) {
    var RenderContext = (function () {
        function RenderContext(domId) {
            var elementOfDomId = document.getElementById(domId);
            if (elementOfDomId == null) {
                console.log("[FDGL] Can\'t create render context for " + domId + ". Element in DOM not found!");
            }
            this.domId = domId;
            this.setRenderType(RenderType.CANVAS2D);
        }
        RenderContext.prototype.setRenderType = function (renderType) {
            if (this.renderType == RenderType.CANVAS2D) {
                document.getElementById(this.domId).removeChild(this.canvas2D);
            }
            else if (this.renderType == RenderType.SVG) {
                document.getElementById(this.domId).removeChild(this.svg);
            }
            else if (this.renderType == RenderType.WEBGL) {
                document.getElementById(this.domId).removeChild(this.canvasWebGL);
            }
            if (renderType == RenderType.CANVAS2D) {
                this.initCanvas2D();
                document.getElementById(this.domId).appendChild(this.canvas2D);
            }
            else if (renderType == RenderType.SVG) {
                this.initSVG();
                document.getElementById(this.domId).appendChild(this.svg);
            }
            else if (renderType == RenderType.WEBGL) {
                this.initWebGLCanvas();
                document.getElementById(this.domId).appendChild(this.canvasWebGL);
            }
            this.renderType = renderType;
        };
        RenderContext.prototype.getRenderType = function () {
            return this.renderType;
        };
        RenderContext.prototype.initCanvas2D = function () {
            this.canvas2D = document.createElement("canvas");
            this.canvas2D.id = "canvas";
            this.canvas2D.style.height = "100%";
            this.canvas2D.style.width = "100%";
        };
        RenderContext.prototype.initSVG = function () {
            this.svg = document.createElementNS(Constants.SVG_NAMESPACE, "svg");
        };
        RenderContext.prototype.initWebGLCanvas = function () {
            console.log("[FDGL] init webGL");
            this.canvasWebGL = document.createElement("canvas");
            this.canvasWebGL.setAttribute("id", "webGLCanvas");
            this.canvasWebGL.setAttribute("height", 1000);
            this.canvasWebGL.setAttribute("width", 1000);
        };
        RenderContext.prototype.getId = function () {
            return this.domId;
        };
        RenderContext.prototype.getCanvas2D = function () {
            return this.canvas2D;
        };
        RenderContext.prototype.getCanvas2dContext = function () {
            return this.canvas2D.getContext("2d");
        };
        RenderContext.prototype.getSVG = function () {
            return this.svg;
        };
        RenderContext.prototype.getCanvasWebGL = function () {
            return this.canvasWebGL;
        };
        RenderContext.prototype.getFDGLElementHeight = function () {
            var height = document.getElementById(this.domId).style.height;
            return height;
        };
        RenderContext.prototype.getFDGLElementWidth = function () {
            return document.getElementById(this.domId).style.width;
        };
        RenderContext.prototype.getHeight = function () {
            return this.canvasNode.getHeight();
        };
        RenderContext.prototype.getWidth = function () {
            return this.canvasNode.getWidth();
        };
        RenderContext.prototype.setCanvasNode = function (canvasNode) {
            this.canvasNode = canvasNode;
        };
        RenderContext.prototype.isWebGLEnabled = function () {
            if (this.canvasWebGL == null)
                this.initWebGLCanvas();
            try {
                var gl = this.canvasWebGL.getContext("webgl");
            }
            catch (x) {
                gl = null;
            }
            if (gl == null) {
                return false;
            }
            return true;
        };
        return RenderContext;
    })();
    Plexx.RenderContext = RenderContext;
    (function (RenderType) {
        RenderType[RenderType["CANVAS2D"] = 0] = "CANVAS2D";
        RenderType[RenderType["SVG"] = 1] = "SVG";
        RenderType[RenderType["WEBGL"] = 2] = "WEBGL";
    })(Plexx.RenderType || (Plexx.RenderType = {}));
    var RenderType = Plexx.RenderType;
})(Plexx || (Plexx = {}));
/// <reference path="../general/renderContext.ts" />
/// <reference path="../nodes/canvasnode.ts" />
/// <reference path="../nodes/sceneGraphComponent.ts" />
/// <reference path="../nodes/sceneGraphComposite.ts" />
/// <reference path="../nodes/sceneGraphLeaf.ts" />
var Plexx;
(function (Plexx) {
    var DebugHelper = (function () {
        function DebugHelper(debugpanelId, renderContext, rootNode) {
            this.modalSVGExportTemplateBegin = "<div id=\"openModal\" class=\"modalDialog\">" +
                "<div>" +
                "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>" +
                "<h4>FDGL Snapshot</h4>" +
                "<pre style=\"overflow-y: scroll; height: 40em;\"><code id=\"svgcode\">";
            this.modalSVGExportTemplateEnd = "</code></pre>" +
                "</div>" +
                "</div>";
            this.modalSVGExportCSS = "<style>" +
                ".modalDialog {" +
                "    position: fixed;" +
                "    font-family: Arial, Helvetica, sans-serif;" +
                "    top: 0;" +
                "    right: 0;" +
                "    bottom: 0;" +
                "    left: 0;" +
                "    background: rgba(0,0,0,0.8);" +
                "    z-index: 99999;" +
                "    opacity:0;" +
                "    pointer-events: none;" +
                "}" +
                ".modalDialog:target {" +
                "    opacity:1;" +
                "    pointer-events: auto;" +
                "}" +
                ".modalDialog > div {" +
                "    width: 80em;" +
                "    height: 42em;" +
                "    position: relative;" +
                "    margin: 10% auto;" +
                "    padding: 5px 20px 13px 20px;" +
                "    background: #fff;" +
                "}" +
                "</style>";
            this.panelSVGExportCSS = "<style>" +
                "nav {" +
                "    background-color: #1C1C1C;" +
                "    list-style-type: none;" +
                "    padding: 1px;" +
                "    height: 1.4em;" +
                "    width: auto;" +
                "}" +
                ".fdgl-debugpanel ul, fdgl-debugpanel li {" +
                "    padding: 0;" +
                "}" +
                ".fdgl-debugpanel ul {" +
                "    background: #556070;" +
                "    list-style: none;" +
                "    width: 100%;" +
                "    height: auto;" +
                "    margin: 0;" +
                "}" +
                ".fdgl-debugpanel li {" +
                "    float: left;" +
                "    position: relative;" +
                "    text-align: center;" +
                "    width: auto;" +
                "    margin: 0 .2em 0 .1em;" +
                "}" +
                ".fdgl-debugpanel a {" +
                "    background: #556070;" +
                "    color: #FFFFFF;" +
                "    display: block;" +
                "    font: 12px 'Lucida Grande', LucidaGrande, Lucida, Helvetica, Arial, sans-serif;" +
                "    padding: 0.1em 5px;" +
                "    text-align: center;" +
                "    float: left;" +
                "    width: 50px;" +
                "    text-decoration: none;" +
                "    cursor: pointer;" +
                "    -webkit-user-select: none;" +
                "    -moz-user-select: none;" +
                "    -ms-user-select: none;" +
                "}" +
                "li#fdgl-debugpanel-left {" +
                "    float: left;" +
                "}" +
                "li#fdgl-debugpanel-center {" +
                "    color: #FFFFFF;" +
                "    display: block;" +
                "    font: 12px 'Lucida Grande', LucidaGrande, Lucida, Helvetica, Arial, sans-serif;" +
                "    padding: 2px 25px;" +
                "    text-align: center;" +
                "    text-decoration: none;" +
                "}" +
                "li#fdgl-debugpanel-right{" +
                "    float: right;" +
                "}" +
                "li#fdgl-debugpanel-right a{" +
                "    width: 100px;" +
                "}" +
                ".opt li {" +
                "    float: left;" +
                "    position: relative;" +
                "    width: auto;" +
                "    padding: 10px;" +
                "}" +
                "</style>";
            this.debugpanelId = debugpanelId;
            this.renderContext = renderContext;
            this.rootNode = rootNode;
            this.debugPanelElement = document.getElementById(this.debugpanelId);
            this.debugPanelElement.setAttribute("id", this.debugpanelId);
            this.debugPanelElement.setAttribute("class", "fdgl-debugpanel");
            this.debugPanelElement.style.width = document.getElementById(renderContext.getId()).style.width;
            this.debugPanelElement.innerHTML += this.modalSVGExportTemplateBegin + this.modalSVGExportTemplateEnd;
            this.debugPanelElement.innerHTML += this.modalSVGExportCSS;
            this.debugPanelElement.innerHTML += this.panelSVGExportCSS;
            var fdglElement = document.getElementsByClassName("plexx")[0];
            var parentFdglElement = fdglElement.parentNode;
            parentFdglElement.insertBefore(this.debugPanelElement, fdglElement.nextSibling);
            this.renderInfo = document.createElement("li");
            this.renderInfo.setAttribute("id", "resolutionInfo");
            var currentTime = new Date();
            this.renderInfo.innerHTML = rootNode.getWidth() + "x" + rootNode.getHeight();
            this.debugPanelElement.appendChild(this.renderInfo);
            this.debugPanelElementList = document.createElement("ul");
            this.debugPanelElement.appendChild(this.debugPanelElementList);
            this.initDebugPanelLeftElement();
            this.initDebugPanelCenterElement();
            this.initDebugPanelRightElement();
        }
        DebugHelper.prototype.initDebugPanelLeftElement = function () {
            var _this = this;
            var optionCanvas = document.createElement("a");
            var optionSVG = document.createElement("a");
            var optionWebGL = document.createElement("a");
            optionCanvas.type = "submit";
            optionCanvas.innerHTML = "Canvas";
            optionCanvas.id = "rendertypeCanvas";
            optionCanvas.style.color = "white";
            optionCanvas.style.backgroundColor = "blue";
            optionCanvas.onclick = function (e) {
                _this.renderContext.setRenderType(Plexx.RenderType.CANVAS2D);
                _this.rootNode.render(_this.renderContext);
                _this.updateInfo(_this.renderContext, _this.rootNode);
                optionCanvas.style.color = "white";
                optionCanvas.style.backgroundColor = "blue";
                optionSVG.style.color = "blue";
                optionSVG.style.backgroundColor = "white";
                if (_this.renderContext.isWebGLEnabled()) {
                    optionWebGL.style.color = "blue";
                    optionWebGL.style.backgroundColor = "white";
                }
            };
            optionSVG.type = "submit";
            optionSVG.innerHTML = "SVG";
            optionSVG.id = "rendertypeSVG";
            optionSVG.style.color = "blue";
            optionSVG.style.backgroundColor = "white";
            optionSVG.onclick = function (e) {
                _this.renderContext.setRenderType(Plexx.RenderType.SVG);
                _this.rootNode.render(_this.renderContext);
                _this.updateInfo(_this.renderContext, _this.rootNode);
                optionCanvas.style.color = "blue";
                optionCanvas.style.backgroundColor = "white";
                optionSVG.style.color = "white";
                optionSVG.style.backgroundColor = "blue";
                if (_this.renderContext.isWebGLEnabled()) {
                    optionWebGL.style.color = "blue";
                    optionWebGL.style.backgroundColor = "white";
                }
            };
            optionWebGL.type = "submit";
            optionWebGL.innerHTML = "WebGL";
            optionWebGL.id = "rendertypeWebGL";
            optionWebGL.style.color = "black";
            optionWebGL.style.backgroundColor = "grey";
            if (this.renderContext.isWebGLEnabled()) {
                optionWebGL.style.color = "blue";
                optionWebGL.style.backgroundColor = "white";
                optionWebGL.onclick = function (e) {
                    _this.renderContext.setRenderType(Plexx.RenderType.WEBGL);
                    _this.rootNode.render(_this.renderContext);
                    optionCanvas.style.color = "blue";
                    optionCanvas.style.backgroundColor = "white";
                    optionSVG.style.color = "blue";
                    optionSVG.style.backgroundColor = "white";
                    optionWebGL.style.color = "white";
                    optionWebGL.style.backgroundColor = "blue";
                };
            }
            if (!this.renderContext.isWebGLEnabled()) {
            }
            var leftOptionsUl = document.createElement("ul");
            var optionCanvasLi = document.createElement("li");
            var optionSVGLi = document.createElement("li");
            var optionWebGLLi = document.createElement("li");
            var optionsLi = document.createElement("li");
            optionSVGLi.setAttribute("class", "opt");
            optionWebGLLi.setAttribute("class", "opt");
            optionCanvasLi.setAttribute("class", "opt");
            optionsLi.id = "left";
            optionCanvasLi.appendChild(optionCanvas);
            optionSVGLi.appendChild(optionSVG);
            optionWebGLLi.appendChild(optionWebGL);
            leftOptionsUl.appendChild(optionCanvasLi);
            leftOptionsUl.appendChild(optionSVGLi);
            leftOptionsUl.appendChild(optionWebGLLi);
            optionsLi.appendChild(leftOptionsUl);
            this.debugPanelElementList.appendChild(optionsLi);
        };
        DebugHelper.prototype.initDebugPanelCenterElement = function () {
            var _this = this;
            var centerOptionsUl = document.createElement("ul");
            var infoLi = document.createElement("li");
            infoLi.id = "fdgl-debugpanel-center";
            this.debugPanelElement.appendChild(this.renderInfo);
            this.debugPanelElementList.appendChild(infoLi);
            infoLi.appendChild(this.renderInfo);
            var optionLines = document.createElement("a");
            optionLines.type = "submit";
            optionLines.innerHTML = "Lines";
            optionLines.style.color = "white";
            optionLines.style.backgroundColor = "grey";
            optionLines.onclick = function (e) {
                if (!_this.rootNode.areLinesVisible) {
                    _this.rootNode.areLinesVisible = true;
                    optionLines.style.color = "white";
                    optionLines.style.backgroundColor = "green";
                }
                else {
                    _this.rootNode.areLinesVisible = false;
                    optionLines.style.color = "white";
                    optionLines.style.backgroundColor = "grey";
                }
                _this.renderContext.setRenderType(_this.renderContext.getRenderType());
                _this.rootNode.render(_this.renderContext);
                _this.updateInfo(_this.renderContext, _this.rootNode);
            };
            var optionOrigin = document.createElement("a");
            optionOrigin.type = "submit";
            optionOrigin.innerHTML = "Origin";
            optionOrigin.style.color = "white";
            optionOrigin.style.backgroundColor = "grey";
            optionOrigin.onclick = function (e) {
                if (!_this.rootNode.isOriginVisible) {
                    _this.rootNode.isOriginVisible = true;
                    optionOrigin.style.color = "white";
                    optionOrigin.style.backgroundColor = "green";
                }
                else {
                    _this.rootNode.isOriginVisible = false;
                    optionOrigin.style.color = "white";
                    optionOrigin.style.backgroundColor = "grey";
                }
                _this.renderContext.setRenderType(_this.renderContext.getRenderType());
                _this.rootNode.render(_this.renderContext);
            };
            var optionOriginLi = document.createElement("li");
            var optionLinesLi = document.createElement("li");
            var optionsLi = document.createElement("li");
            optionOriginLi.setAttribute("class", "opt");
            optionLinesLi.setAttribute("class", "opt");
            optionsLi.id = "left";
            optionOriginLi.appendChild(optionOrigin);
            optionLinesLi.appendChild(optionLines);
            centerOptionsUl.appendChild(infoLi);
            centerOptionsUl.appendChild(optionOriginLi);
            centerOptionsUl.appendChild(optionLinesLi);
            optionsLi.appendChild(centerOptionsUl);
            this.debugPanelElementList.appendChild(optionsLi);
        };
        DebugHelper.prototype.initDebugPanelRightElement = function () {
            var _this = this;
            var otherOptions = document.createElement("div");
            var exportSVG = document.createElement("a");
            exportSVG.type = "submit";
            exportSVG.innerHTML = "export SVG";
            exportSVG.onclick = function (e) {
                var pom = document.createElement('a');
                var s = new XMLSerializer();
                var d = _this.renderContext.getSVG();
                var str = _this.rootNode.toSVGString(_this.renderContext);
                str = str.replace(/>/g, "&gt;");
                str = str.replace(/</g, "&lt;");
                document.getElementById("svgcode").innerHTML = "";
                document.getElementById("svgcode").insertAdjacentHTML("beforeend", str);
                location.href = "#" + "openModal";
            };
            var debugPanelRightElement = document.createElement("li");
            debugPanelRightElement.id = "fdgl-debugpanel-right";
            this.debugPanelElementList.appendChild(debugPanelRightElement);
            debugPanelRightElement.appendChild(exportSVG);
            this.debugPanelElement.appendChild(this.debugPanelElementList);
        };
        DebugHelper.prototype.updateInfo = function (renderContext, rootNode) {
            this.renderInfo.innerHTML = rootNode.getWidth() + "x" + rootNode.getHeight();
        };
        return DebugHelper;
    })();
    Plexx.DebugHelper = DebugHelper;
})(Plexx || (Plexx = {}));
var FdglMath;
(function (FdglMath) {
    function binomial(n, k) {
        console.log("binomial(" + n + ", " + k + ")");
        var result = 0;
        result = factorial(n) / (factorial(k) * factorial(n - k));
        return result;
    }
    FdglMath.binomial = binomial;
    function factorial(n) {
        var rval = 1;
        for (var i = 2; i <= n; i++)
            rval = rval * i;
        return rval;
    }
    FdglMath.factorial = factorial;
    var Point2d = (function () {
        function Point2d(x, y) {
            this.x = 0;
            this.y = 0;
            this.x = x;
            this.y = y;
        }
        Point2d.prototype.translate = function (xD, yD) {
            this.x += xD;
            this.y += yD;
        };
        return Point2d;
    })();
    FdglMath.Point2d = Point2d;
    //    export class Point2dArray{
    //        public points: Array<Point2d> = new Array<Point2d>();
    //        
    //        constructor(point2dArray: Points[]) {
    //            for(var i: number = 0; i < pointsArray.length; i += 2) {
    //                this.points.push(new Point2d(pointsArray[i], pointsArray[i+1]));
    //            }
    //        constructor(pointsArray: number[]) {
    //            for(var i: number = 0; i < pointsArray.length; i += 2) {
    //                this.points.push(new Point2d(pointsArray[i], pointsArray[i+1]));
    //            }
    //        }
    //    }
    var vec2 = (function () {
        function vec2(x0, x1) {
            this.x0 = 0;
            this.x1 = 0;
            this.x0 = x0;
            this.x1 = x1;
        }
        vec2.prototype.add = function (v0) {
            return new vec2(this.x0 + v0.x0, this.x1 + v0.x1);
        };
        vec2.prototype.mul = function (n) {
            return new vec2(this.x0 * n, this.x1 * n);
        };
        return vec2;
    })();
    FdglMath.vec2 = vec2;
    var mat3 = (function () {
        function mat3(values) {
            this.values = values;
        }
        mat3.prototype.times = function (multi) {
            var result = [];
            var resultMatrix;
            result[0] = this.values[0] * multi.values[0] + this.values[1] * multi.values[3] + this.values[2] * multi.values[6];
            result[1] = this.values[0] * multi.values[1] + this.values[1] * multi.values[4] + this.values[2] * multi.values[7];
            result[2] = this.values[0] * multi.values[2] + this.values[1] * multi.values[5] + this.values[2] * multi.values[8];
            result[3] = this.values[3] * multi.values[0] + this.values[4] * multi.values[3] + this.values[5] * multi.values[6];
            result[4] = this.values[3] * multi.values[1] + this.values[4] * multi.values[4] + this.values[5] * multi.values[7];
            result[5] = this.values[3] * multi.values[2] + this.values[4] * multi.values[5] + this.values[5] * multi.values[8];
            result[6] = this.values[6] * multi.values[0] + this.values[7] * multi.values[3] + this.values[8] * multi.values[6];
            result[7] = this.values[6] * multi.values[1] + this.values[7] * multi.values[4] + this.values[8] * multi.values[7];
            result[8] = this.values[6] * multi.values[2] + this.values[7] * multi.values[5] + this.values[8] * multi.values[8];
            resultMatrix = new mat3(result);
            return resultMatrix;
        };
        mat3.prototype.getArray = function () {
            return this.values;
        };
        return mat3;
    })();
    FdglMath.mat3 = mat3;
})(FdglMath || (FdglMath = {}));
/// <reference path="../general/renderContext.ts" />
/// <reference path="../general/constants.ts" />
/// <reference path="sceneGraphComponent.ts" />
/// <reference path="sceneGraphComposite.ts" />
/// <reference path="sceneGraphLeaf.ts" />
/// <reference path="../helper/xmlComment.ts" />
var Plexx;
(function (Plexx) {
    var GroupNode = (function (_super) {
        __extends(GroupNode, _super);
        function GroupNode(x, y, rotation, scaleX, scaleY) {
            _super.call(this, "GroupNode");
            this.rotation = 0;
            this.scale = [];
            this.childSceneGraphComponents = [];
            this.setPoints([new TSM.vec2([x, y])]);
            this.rotation = rotation;
            this.scale = [scaleX, scaleY];
        }
        GroupNode.prototype.render = function (renderContext) {
            var childNodeLeafs = this.getAllLeafs();
            // pre-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = childNodeLeafs[subNodeIndex];
                var sinTerm = Math.sin(-this.rotation * Math.PI / 180);
                var cosTerm = Math.cos(-this.rotation * Math.PI / 180);
                var gx = this.getPoints()[0].x;
                var gy = this.getPoints()[0].y;
                var childTransformationMatrix = sceneGraphLeafChildNode.getTransformationMatrix();
                var transformationMatrix = this.getTransformationMatrix();
                var scaleMatrix = new TSM.mat3([this.scale[0], 0, 0, 0, this.scale[1], 0, 0, 0, 1]);
                var translationMatrix = new TSM.mat3([1, 0, 0, 0, 1, 0, gx, gy, 1]);
                var tempMatrix1 = translationMatrix.copy().multiply(scaleMatrix.copy().multiply(childTransformationMatrix));
                var translateBeforeRotationMatrix = new TSM.mat3([1, 0, 0, 0, 1, 0, -gx, -gy, 1]);
                var rotationMatrix = new TSM.mat3([cosTerm, -sinTerm, 0, sinTerm, cosTerm, 0, 0, 0, 1]);
                var translateAfterRotationMatrix = new TSM.mat3([1, 0, 0, 0, 1, 0, gx, gy, 1]);
                var tempMatrix2 = translateAfterRotationMatrix.copy().multiply(rotationMatrix.copy().multiply(translateBeforeRotationMatrix));
                var tempMatrix3 = transformationMatrix.copy().multiply(tempMatrix2.copy().multiply(tempMatrix1));
                sceneGraphLeafChildNode.setTransformationMatrix(tempMatrix3);
            }
            // render
            for (var subNodeIndex = 0; subNodeIndex < this.getChilds().length; subNodeIndex++) {
                var currentSubNodeRenderStatus = this.getChilds()[subNodeIndex].render(renderContext);
                if (currentSubNodeRenderStatus == false) {
                    return false;
                }
            }
            /// post-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = childNodeLeafs[subNodeIndex];
                var childTransformationMatrix = sceneGraphLeafChildNode.getTransformationMatrix();
                var transformationMatrix = this.getTransformationMatrix();
                var sinTerm = Math.sin(this.rotation * Math.PI / 180);
                var cosTerm = Math.cos(this.rotation * Math.PI / 180);
                var gx = this.getPoints()[0].x;
                var gy = this.getPoints()[0].y;
                var inverseTransformationMatrix = transformationMatrix.copy().inverse();
                var tempMatrix1 = inverseTransformationMatrix.copy().multiply(childTransformationMatrix);
                var translateBeforeRotationMatrix = new TSM.mat3([1, 0, 0, 0, 1, 0, -gx, -gy, 1]);
                var inverseRotationMatrix = new TSM.mat3([cosTerm, -sinTerm, 0, sinTerm, cosTerm, 0, 0, 0, 1]);
                var translateAfterRotationMatrix = new TSM.mat3([1, 0, 0, 0, 1, 0, gx, gy, 1]);
                var tempMatrix3 = translateAfterRotationMatrix.copy().multiply(inverseRotationMatrix.copy().multiply(translateBeforeRotationMatrix));
                var inverseTranslationMatrix = new TSM.mat3([1, 0, 0, 0, 1, 0, -this.getPoints()[0].x, -this.getPoints()[0].y, 1]);
                var tempMatrix2 = tempMatrix3.copy().multiply(tempMatrix1);
                var inverseScaleMatrix = new TSM.mat3([1 / this.scale[0], 0, 0, 0, 1 / this.scale[1], 0, 0, 0, 1]);
                var tempMatrix3 = inverseTranslationMatrix.copy().multiply(tempMatrix2);
                var tempMatrix4 = inverseScaleMatrix.copy().multiply(tempMatrix3);
                sceneGraphLeafChildNode.setTransformationMatrix(tempMatrix4);
            }
            return true;
        };
        GroupNode.prototype.toSVGString = function (renderContext) {
            var childNodeLeafs = this.getAllLeafs();
            // pre-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = childNodeLeafs[subNodeIndex];
                var sinTerm = Math.sin(-this.rotation * Math.PI / 180);
                var cosTerm = Math.cos(-this.rotation * Math.PI / 180);
                var gx = this.getPoints()[0].x;
                var gy = this.getPoints()[0].y;
                var childTransformationMatrix = sceneGraphLeafChildNode.getTransformationMatrix();
                var transformationMatrix = this.getTransformationMatrix();
                var scaleMatrix = new TSM.mat3([this.scale[0], 0, 0, 0, this.scale[1], 0, 0, 0, 1]);
                var translationMatrix = new TSM.mat3([1, 0, 0, 0, 1, 0, gx, gy, 1]);
                var tempMatrix1 = translationMatrix.copy().multiply(scaleMatrix.copy().multiply(childTransformationMatrix));
                var translateBeforeRotationMatrix = new TSM.mat3([1, 0, 0, 0, 1, 0, -gx, -gy, 1]);
                var rotationMatrix = new TSM.mat3([cosTerm, -sinTerm, 0, sinTerm, cosTerm, 0, 0, 0, 1]);
                var translateAfterRotationMatrix = new TSM.mat3([1, 0, 0, 0, 1, 0, gx, gy, 1]);
                var tempMatrix2 = translateAfterRotationMatrix.copy().multiply(rotationMatrix.copy().multiply(translateBeforeRotationMatrix));
                var tempMatrix3 = transformationMatrix.copy().multiply(tempMatrix2.copy().multiply(tempMatrix1));
                sceneGraphLeafChildNode.setTransformationMatrix(tempMatrix3);
            }
            // render
            var svgString = "";
            var xmlTag = new XMLTag("g");
            var position = this.getPoints()[0];
            xmlTag.addAttribute("transform", "translate(" + this.getPoints()[0].x + "," + this.getPoints()[0].y + ") rotate(" + this.rotation + ") scale(" + this.scale[0] + "," + this.scale[1] + ")");
            svgString += xmlTag.getStartTag() + "\n";
            for (var subNodeIndex = 0; subNodeIndex < this.getChilds().length; subNodeIndex++) {
                svgString = svgString + "  " + this.getChilds()[subNodeIndex].toSVGString(renderContext);
            }
            svgString += xmlTag.getEndTag() + "\n";
            /// post-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = childNodeLeafs[subNodeIndex];
                var childTransformationMatrix = sceneGraphLeafChildNode.getTransformationMatrix();
                var transformationMatrix = this.getTransformationMatrix();
                var sinTerm = Math.sin(this.rotation * Math.PI / 180);
                var cosTerm = Math.cos(this.rotation * Math.PI / 180);
                var gx = this.getPoints()[0].x;
                var gy = this.getPoints()[0].y;
                var inverseTransformationMatrix = transformationMatrix.copy().inverse();
                var tempMatrix1 = inverseTransformationMatrix.copy().multiply(childTransformationMatrix);
                var translateBeforeRotationMatrix = new TSM.mat3([1, 0, 0, 0, 1, 0, -gx, -gy, 1]);
                var inverseRotationMatrix = new TSM.mat3([cosTerm, -sinTerm, 0, sinTerm, cosTerm, 0, 0, 0, 1]);
                var translateAfterRotationMatrix = new TSM.mat3([1, 0, 0, 0, 1, 0, gx, gy, 1]);
                var tempMatrix3 = translateAfterRotationMatrix.copy().multiply(inverseRotationMatrix.copy().multiply(translateBeforeRotationMatrix));
                var inverseTranslationMatrix = new TSM.mat3([1, 0, 0, 0, 1, 0, -this.getPoints()[0].x, -this.getPoints()[0].y, 1]);
                var tempMatrix2 = tempMatrix3.copy().multiply(tempMatrix1);
                var inverseScaleMatrix = new TSM.mat3([1 / this.scale[0], 0, 0, 0, 1 / this.scale[1], 0, 0, 0, 1]);
                var tempMatrix3 = inverseTranslationMatrix.copy().multiply(tempMatrix2);
                var tempMatrix4 = inverseScaleMatrix.copy().multiply(tempMatrix3);
                sceneGraphLeafChildNode.setTransformationMatrix(tempMatrix4);
            }
            return svgString;
        };
        GroupNode.prototype.getX = function () {
            return this.getPoints()[0].x;
        };
        GroupNode.prototype.setX = function (x) {
            this.getPoints()[0].x = x;
            return this;
        };
        GroupNode.prototype.getY = function () {
            return this.getPoints()[0].y;
        };
        GroupNode.prototype.setY = function (y) {
            this.getPoints()[0].y = y;
            return this;
        };
        GroupNode.prototype.add = function (sceneGraphComponent) {
            console.log("add Element " + sceneGraphComponent);
            this.childSceneGraphComponents.push(sceneGraphComponent);
        };
        GroupNode.prototype.addAtTop = function (sceneGraphComponent) {
            console.log("add Element " + sceneGraphComponent);
            this.childSceneGraphComponents.unshift(sceneGraphComponent);
        };
        GroupNode.prototype.remove = function (sceneGraphComponent) {
            var sceneGraphComponentIndex = this.childSceneGraphComponents.indexOf(sceneGraphComponent);
            console.log("remove Element " + sceneGraphComponentIndex);
            if (sceneGraphComponentIndex != -1) {
                this.childSceneGraphComponents.splice(sceneGraphComponentIndex, 1);
            }
        };
        GroupNode.prototype.getChilds = function () {
            return this.childSceneGraphComponents;
        };
        GroupNode.prototype.getAllLeafs = function () {
            var leafs = [];
            for (var subNodeIndex = 0; subNodeIndex < this.getChilds().length; subNodeIndex++) {
                var childNode = this.getChilds()[subNodeIndex];
                if (childNode instanceof Plexx.SceneGraphCompositeNode) {
                    var sceneGraphCompositeChildNode = this.getChilds()[subNodeIndex];
                    for (var subNodeIndex2 = 0; subNodeIndex2 < sceneGraphCompositeChildNode.getAllLeafs().length; subNodeIndex2++) {
                        var sceneGraphLeafChildNode = sceneGraphCompositeChildNode.getChilds()[subNodeIndex2];
                        leafs.push(sceneGraphLeafChildNode);
                    }
                }
                else if (childNode instanceof Plexx.SceneGraphLeaf) {
                    leafs.push(childNode);
                }
            }
            return leafs;
        };
        GroupNode.prototype.copy = function () {
            var groupNodeCopy = new GroupNode(this.getPoints()[0].x, this.getPoints()[0].y, this.rotation, this.scale[0], this.scale[1]);
            var sceneGraphs = [];
            for (var currentIndex = 0; currentIndex < this.childSceneGraphComponents.length; currentIndex++) {
                sceneGraphs.push(this.childSceneGraphComponents[currentIndex].copy());
            }
            groupNodeCopy.childSceneGraphComponents = sceneGraphs;
            return groupNodeCopy;
        };
        return GroupNode;
    })(Plexx.SceneGraphLeaf);
    Plexx.GroupNode = GroupNode;
})(Plexx || (Plexx = {}));
/// <reference path="../../general/constants.ts" />
/// <reference path="../../general/renderContext.ts" />
/// <reference path="../../helper/xmlComment.ts" />
/// <reference path="../sceneGraphComponent.ts" />
/// <reference path="../sceneGraphComposite.ts" />
/// <reference path="../sceneGraphLeaf.ts" />
var Plexx;
(function (Plexx) {
    var ScaleNode = (function (_super) {
        __extends(ScaleNode, _super);
        function ScaleNode(scaleX, scaleY) {
            _super.call(this);
            this.scaleX = scaleX;
            this.scaleY = scaleY;
            this.setName("ScaleNode");
        }
        ScaleNode.prototype.render = function (renderContext) {
            var childNodeLeafs = this.getAllLeafs();
            // pre-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = childNodeLeafs[subNodeIndex];
                var m = sceneGraphLeafChildNode.getTransformationMatrix();
                var k = new TSM.mat3([this.scaleX, 0, 0, 0, this.scaleY, 0, 0, 0, 1]);
                var a = m.multiply(k);
                sceneGraphLeafChildNode.setTransformationMatrix(a);
            }
            // render
            for (var subNodeIndex = 0; subNodeIndex < this.getChilds().length; subNodeIndex++) {
                var currentSubNodeRenderStatus = this.getChilds()[subNodeIndex].render(renderContext);
                if (currentSubNodeRenderStatus == false) {
                    return false;
                }
            }
            /// post-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = childNodeLeafs[subNodeIndex];
                var m = sceneGraphLeafChildNode.getTransformationMatrix();
                var k = new TSM.mat3([1 / this.scaleX, 0, 0, 0, 1 / this.scaleY, 0, 0, 0, 1]);
                var a = m.multiply(k);
                sceneGraphLeafChildNode.setTransformationMatrix(a);
            }
            return true;
        };
        ScaleNode.prototype.toSVGString = function (renderContext) {
            var svgString = "";
            var childNodeLeafs = this.getAllLeafs();
            // pre-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = childNodeLeafs[subNodeIndex];
                var m = sceneGraphLeafChildNode.getTransformationMatrix();
                var k = new TSM.mat3([this.scaleX, 0, 0, 0, this.scaleY, 0, 0, 0, 1]);
                var a = m.multiply(k);
                sceneGraphLeafChildNode.setTransformationMatrix(a);
            }
            // render
            var svgString = "";
            var xmlComment = new XMLComment(this.getName() + " scaleX=\"" + this.scaleX + "\" scaleY=\"" + this.scaleY + "\" {");
            svgString = xmlComment.getLineCommentTag() + "\n";
            for (var subNodeIndex = 0; subNodeIndex < this.getChilds().length; subNodeIndex++) {
                svgString += this.getChilds()[subNodeIndex].toSVGString(renderContext) + "\n";
            }
            /// post-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = childNodeLeafs[subNodeIndex];
                var m = sceneGraphLeafChildNode.getTransformationMatrix();
                var k = new TSM.mat3([1 / this.scaleX, 0, 0, 0, 1 / this.scaleY, 0, 0, 0, 1]);
                var a = m.multiply(k);
                sceneGraphLeafChildNode.setTransformationMatrix(a);
            }
            var xmlComment = new XMLComment("}");
            svgString += xmlComment.getLineCommentTag() + "\n";
            return svgString;
        };
        return ScaleNode;
    })(Plexx.SceneGraphCompositeNode);
    Plexx.ScaleNode = ScaleNode;
})(Plexx || (Plexx = {}));
/// <reference path="../../../../libs/TSM/tsm-0.7.d.ts" />
/// <reference path="../../general/constants.ts" />
/// <reference path="../../general/renderContext.ts" />
/// <reference path="../../helper/xmlComment.ts" />
/// <reference path="../sceneGraphComponent.ts" />
/// <reference path="../sceneGraphComposite.ts" />
/// <reference path="../sceneGraphLeaf.ts" />
var Plexx;
(function (Plexx) {
    var TranslationNode = (function (_super) {
        __extends(TranslationNode, _super);
        function TranslationNode(posX, posY) {
            _super.call(this, "TranslationNode");
            this.translation = new TSM.vec2([posX, posY]);
            console.log("[FDGL] " + this.toString() + " created");
        }
        TranslationNode.prototype.render = function (renderContext) {
            var childNodeLeafs = this.getAllLeafs();
            // pre-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = childNodeLeafs[subNodeIndex];
                var childTransformationMatrix = sceneGraphLeafChildNode.getTransformationMatrix();
                var translationMatrix = new TSM.mat3([1, 0, 0, 0, 1, 0, this.translation.x, this.translation.y, 1]);
                sceneGraphLeafChildNode.setTransformationMatrix(childTransformationMatrix.multiply(translationMatrix));
            }
            // render
            for (var subNodeIndex = 0; subNodeIndex < this.getChilds().length; subNodeIndex++) {
                var currentSubNodeRenderStatus = this.getChilds()[subNodeIndex].render(renderContext);
                if (currentSubNodeRenderStatus == false) {
                    return false;
                }
            }
            /// post-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = childNodeLeafs[subNodeIndex];
                var childTransformationMatrix = sceneGraphLeafChildNode.getTransformationMatrix();
                var translationMatrix = new TSM.mat3([1, 0, 0, 0, 1, 0, -this.translation.x, -this.translation.y, 1]);
                sceneGraphLeafChildNode.setTransformationMatrix(childTransformationMatrix.multiply(translationMatrix));
            }
            return true;
        };
        TranslationNode.prototype.toSVGString = function (renderContext) {
            var childNodeLeafs = this.getAllLeafs();
            // pre-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = childNodeLeafs[subNodeIndex];
                var childTransformationMatrix = sceneGraphLeafChildNode.getTransformationMatrix();
                var translationMatrix = new TSM.mat3([1, 0, 0, 0, 1, 0, this.translation.x, this.translation.y, 1]);
                sceneGraphLeafChildNode.setTransformationMatrix(childTransformationMatrix.multiply(translationMatrix));
            }
            // render
            var svgString = "";
            var xmlComment = new XMLComment(this.getName() + " translationX=\"" + this.translation.x + "\" translationY=\"" + this.translation.y + "\" {");
            svgString = xmlComment.getLineCommentTag() + "\n";
            for (var subNodeIndex = 0; subNodeIndex < this.getChilds().length; subNodeIndex++) {
                svgString += this.getChilds()[subNodeIndex].toSVGString(renderContext) + "\n";
            }
            /// post-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = childNodeLeafs[subNodeIndex];
                var childTransformationMatrix = sceneGraphLeafChildNode.getTransformationMatrix();
                var translationMatrix = new TSM.mat3([1, 0, 0, 0, 1, 0, -this.translation.x, -this.translation.y, 1]);
                sceneGraphLeafChildNode.setTransformationMatrix(childTransformationMatrix.multiply(translationMatrix));
            }
            var xmlComment = new XMLComment("}");
            svgString += xmlComment.getLineCommentTag() + "\n";
            return svgString;
        };
        return TranslationNode;
    })(Plexx.SceneGraphCompositeNode);
    Plexx.TranslationNode = TranslationNode;
})(Plexx || (Plexx = {}));
/// <reference path="../../general/constants.ts" />
/// <reference path="../../general/renderContext.ts" />
/// <reference path="../../helper/xmlComment.ts" />
/// <reference path="../sceneGraphComponent.ts" />
/// <reference path="../sceneGraphComposite.ts" />
/// <reference path="../sceneGraphLeaf.ts" />
var Plexx;
(function (Plexx) {
    var RotationNode = (function (_super) {
        __extends(RotationNode, _super);
        function RotationNode(rotation) {
            _super.call(this);
            this.rotation = rotation;
            this.setName("RotationNode");
            console.log("[FDGL] " + "RotationNode" + " (" + this.rotation + ") created");
        }
        RotationNode.prototype.render = function (renderContext) {
            var childNodeLeafs = this.getAllLeafs();
            // pre-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = childNodeLeafs[subNodeIndex];
                var m = sceneGraphLeafChildNode.getTransformationMatrix();
                console.log("ROTATIONMatrixM " + m.all().toString());
                var rotation = this.rotation;
                var x = sceneGraphLeafChildNode.getPoints()[0].x;
                var y = sceneGraphLeafChildNode.getPoints()[0].y;
                var sinR = Math.sin(-rotation * Math.PI / 180);
                var cosR = Math.cos(-rotation * Math.PI / 180);
                var r = new TSM.mat3([1, 0, 0, 0, 1, 0, -x, -y, 1]);
                var k = new TSM.mat3([cosR, -sinR, 0, sinR, cosR, 0, 0, 0, 1]);
                var rv = new TSM.mat3([1, 0, 0, 0, 1, 0, x, y, 1]);
                //            console.log("MatrixK " + k.all().toString());
                var p = k.copy().multiply(r);
                var an = rv.copy().multiply(p);
                var a = m.copy().multiply(an);
                //            console.log("MatrixA " + a.all().toString());
                sceneGraphLeafChildNode.setTransformationMatrix(a);
            }
            // render
            for (var subNodeIndex = 0; subNodeIndex < this.getChilds().length; subNodeIndex++) {
                console.log(subNodeIndex + "RENDER EVERYTHING");
                var currentSubNodeRenderStatus = this.getChilds()[subNodeIndex].render(renderContext);
                if (currentSubNodeRenderStatus == false) {
                    return false;
                }
            }
            /// post-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = childNodeLeafs[subNodeIndex];
                //            var m: TSM.mat3 = sceneGraphLeafChildNode.getTransformationMatrix();
                //            sceneGraphLeafChildNode.setTransformationMatrix(m);
                var m = sceneGraphLeafChildNode.getTransformationMatrix();
                var x = sceneGraphLeafChildNode.getPoints()[0].x;
                var y = sceneGraphLeafChildNode.getPoints()[0].y;
                var sinR = Math.sin(rotation * Math.PI / 180);
                var cosR = Math.cos(rotation * Math.PI / 180);
                //            var k: TSM.mat3 = new TSM.mat3([cosR, -sinR, 0, sinR, cosR, 0, x - x*cosR + y*sinR , y-x*sinR - y*cosR, 1]);
                var k = new TSM.mat3([cosR, -sinR, 0, sinR, cosR, 0, 0, 0, 1]);
                var ja = k.copy().multiply(r);
                var js = rv.copy().multiply(ja);
                console.log("MatrixM " + m.all().toString());
                //            console.log("MatrixK " + k.all().toString());
                var a = m.copy().multiply(js);
                console.log("MatrixA " + a.all().toString());
                sceneGraphLeafChildNode.setTransformationMatrix(a);
            }
            return true;
        };
        RotationNode.prototype.toSVGString = function (renderContext) {
            var childNodeLeafs = this.getAllLeafs();
            // pre-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = childNodeLeafs[subNodeIndex];
                var m = sceneGraphLeafChildNode.getTransformationMatrix();
                console.log("ROTATIONMatrixM " + m.all().toString());
                var rotation = this.rotation;
                var x = sceneGraphLeafChildNode.getPoints()[0].x;
                var y = sceneGraphLeafChildNode.getPoints()[0].y;
                var sinR = Math.sin(-rotation * Math.PI / 180);
                var cosR = Math.cos(-rotation * Math.PI / 180);
                var r = new TSM.mat3([1, 0, 0, 0, 1, 0, -x, -y, 1]);
                var k = new TSM.mat3([cosR, -sinR, 0, sinR, cosR, 0, 0, 0, 1]);
                var rv = new TSM.mat3([1, 0, 0, 0, 1, 0, x, y, 1]);
                //            console.log("MatrixK " + k.all().toString());
                var p = k.copy().multiply(r);
                var an = rv.copy().multiply(p);
                var a = m.copy().multiply(an);
                //            console.log("MatrixA " + a.all().toString());
                sceneGraphLeafChildNode.setTransformationMatrix(a);
            }
            // render
            var svgString = "";
            var xmlComment = new XMLComment(this.getName() + " rotation=\"" + this.rotation + "\" {");
            svgString = xmlComment.getLineCommentTag() + "\n";
            for (var subNodeIndex = 0; subNodeIndex < this.getChilds().length; subNodeIndex++) {
                svgString += this.getChilds()[subNodeIndex].toSVGString(renderContext) + "\n";
            }
            /// post-render
            for (var subNodeIndex = 0; subNodeIndex < childNodeLeafs.length; subNodeIndex++) {
                var sceneGraphLeafChildNode = childNodeLeafs[subNodeIndex];
                //            var m: TSM.mat3 = sceneGraphLeafChildNode.getTransformationMatrix();
                //            sceneGraphLeafChildNode.setTransformationMatrix(m);
                var m = sceneGraphLeafChildNode.getTransformationMatrix();
                var x = sceneGraphLeafChildNode.getPoints()[0].x;
                var y = sceneGraphLeafChildNode.getPoints()[0].y;
                var sinR = Math.sin(rotation * Math.PI / 180);
                var cosR = Math.cos(rotation * Math.PI / 180);
                //            var k: TSM.mat3 = new TSM.mat3([cosR, -sinR, 0, sinR, cosR, 0, x - x*cosR + y*sinR , y-x*sinR - y*cosR, 1]);
                var k = new TSM.mat3([cosR, -sinR, 0, sinR, cosR, 0, 0, 0, 1]);
                var ja = k.copy().multiply(r);
                var js = rv.copy().multiply(ja);
                console.log("MatrixM " + m.all().toString());
                //            console.log("MatrixK " + k.all().toString());
                var a = m.copy().multiply(js);
                console.log("MatrixA " + a.all().toString());
                sceneGraphLeafChildNode.setTransformationMatrix(a);
            }
            var xmlComment = new XMLComment("}");
            svgString += xmlComment.getLineCommentTag() + "\n";
            return svgString;
        };
        return RotationNode;
    })(Plexx.SceneGraphCompositeNode);
    Plexx.RotationNode = RotationNode;
})(Plexx || (Plexx = {}));
/// <reference path="../../general/constants.ts" />
/// <reference path="../../general/renderContext.ts" />
/// <reference path="../../helper/fdglMath.ts" />
/// <reference path="../../helper/xmlTag.ts" />
/// <reference path="../graphNode.ts" />
/// <reference path="../materials/colour.ts" />
/// <reference path="../sceneGraphLeaf.ts" />
var Plexx;
(function (Plexx) {
    var Circle = (function (_super) {
        __extends(Circle, _super);
        function Circle(radius, posX, posY, colour) {
            _super.call(this, "Circle");
            this.circleSides = 120;
            this.setPoints([new TSM.vec2([posX, posY])]);
            this.radius = radius;
            this.colourNode = new Plexx.Colour(colour);
            console.log("[FDGL] " + this.toString() + " created");
        }
        Circle.prototype.toString = function () {
            var textString = "";
            textString = this.getName() + " { points = [ ";
            for (var index = 0; index < this.getPoints().length; index++) {
                if (index == 0)
                    textString += this.getPoints()[index];
                textString += ", " + this.getPoints()[index];
            }
            textString += "],";
            return textString;
        };
        Circle.prototype.setRadius = function (radius) {
            this.radius = radius;
        };
        Circle.prototype.getRadius = function () {
            return this.radius;
        };
        Circle.prototype.setColour = function (colour) {
            this.colourNode.setColour(colour);
        };
        Circle.prototype.getColour = function () {
            return this.colourNode.getRGBString();
        };
        Circle.prototype.render = function (renderContext) {
            var currentRenderType = renderContext.getRenderType();
            if (currentRenderType == Plexx.RenderType.CANVAS2D) {
                this.updateCanvas2d(renderContext);
            }
            else if (currentRenderType == Plexx.RenderType.SVG) {
                this.updateSVG(renderContext);
            }
            else if (currentRenderType == Plexx.RenderType.WEBGL) {
                this.updateWebGL(renderContext);
            }
            return true;
        };
        Circle.prototype.updateCanvas2d = function (renderContext) {
            var context = renderContext.getCanvas2D().getContext("2d");
            var position = this.getPoints()[0];
            var transformationMatrix = this.getTransformationMatrix();
            var mirrorMatrix = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix = mirrorMatrix.copy().multiply(transformationMatrix);
            context.save();
            context.beginPath();
            context.setTransform(resultMatrix.at(0), resultMatrix.at(1), resultMatrix.at(3), resultMatrix.at(4), resultMatrix.at(6), resultMatrix.at(7));
            context.arc(position.x, position.y, this.radius, 0, 2 * Math.PI, false);
            context.fillStyle = this.colourNode.getCss3String();
            context.fill();
            context.strokeStyle = "none";
            context.closePath();
            context.restore();
            return true;
        };
        Circle.prototype.updateSVG = function (renderContext) {
            var SVGObject = document.createElementNS(Constants.SVG_NAMESPACE, "circle");
            var position = this.getPoints()[0];
            var transformationMatrix = this.getTransformationMatrix();
            var mirrorMatrix = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix = mirrorMatrix.copy().multiply(transformationMatrix);
            SVGObject.setAttribute("r", String(this.radius));
            SVGObject.setAttribute("cx", String(position.x));
            SVGObject.setAttribute("cy", String(position.y));
            SVGObject.setAttribute("fill", this.colourNode.getCss3String());
            SVGObject.setAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " + resultMatrix.at(3) + " " + resultMatrix.at(4) + " " + resultMatrix.at(6) + " " + resultMatrix.at(7) + ")");
            SVGObject.setAttribute("stroke", "none");
            renderContext.getSVG().appendChild(SVGObject);
            return true;
        };
        Circle.prototype.updateWebGL = function (renderContext) {
            var gl = renderContext.getCanvasWebGL().getContext("webgl");
            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, this.generateVertexShaderSource());
            gl.compileShader(vertexShader);
            var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, this.generateFragmentShaderSource());
            gl.compileShader(fragmentShader);
            var shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            gl.useProgram(shaderProgram);
            var positionLocation = gl.getAttribLocation(shaderProgram, "aVertexPosition");
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            var resolutionLocation = gl.getUniformLocation(shaderProgram, "resolution");
            gl.uniform2f(resolutionLocation, renderContext.getCanvasWebGL().getAttribute("width"), renderContext.getCanvasWebGL().getAttribute("height"));
            var tM = new Float32Array(this.getTransformationMatrix().all());
            var matrix = gl.getUniformLocation(shaderProgram, "matrix");
            gl.uniformMatrix3fv(matrix, false, tM);
            var polygonVertices = new Float32Array(2 * (this.circleSides));
            var position = this.getPoints()[0];
            var canvasHeight = renderContext.getHeight();
            for (var i = 0; i < this.circleSides; i++) {
                polygonVertices[2 * i] = this.radius * Math.cos(2 * Math.PI / this.circleSides * i) + position.x;
                polygonVertices[(2 * i) + 1] = this.radius * Math.sin(2 * Math.PI / this.circleSides * i) + position.y;
            }
            gl.bufferData(gl.ARRAY_BUFFER, polygonVertices, gl.STATIC_DRAW);
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, this.circleSides);
            return true;
        };
        Circle.prototype.generateVertexShaderSource = function () {
            var vertexShaderSource = "attribute vec2 aVertexPosition;                               \n" +
                "                                                              \n" +
                "uniform int matrix_size;                                      \n" +
                "uniform mat3 matrix;                                          \n" +
                "uniform vec2 resolution;                                      \n" +
                "                                                              \n" +
                "void main() {                                                 \n" +
                "  vec2 pos = (matrix * vec3(aVertexPosition, 1)).xy;          \n" +
                "  vec2 tmp1 = pos / (resolution);                             \n" +
                "  vec2 tmp2 = tmp1 * 2.0;                                     \n" +
                "  vec2 tmp3 = tmp2 - 1.0;                                     \n" +
                "  gl_Position = vec4(tmp3 , 0, 1);                            \n" +
                "}                                                             \n";
            return vertexShaderSource;
        };
        Circle.prototype.generateFragmentShaderSource = function () {
            var fragmentShaderSrc = "precision mediump float;                                      \n" +
                "                                                              \n" +
                "void main() {                                                 \n" +
                "  gl_FragColor = vec4(" + this.colourNode.getR() + "," + this.colourNode.getG() + "," + this.colourNode.getB() + "," + this.colourNode.getA() + ");                          \n" +
                "}                                                             \n";
            return fragmentShaderSrc;
        };
        Circle.prototype.toSVGString = function (renderContext) {
            var position = this.getPoints()[0];
            var canvasHeight = renderContext.getHeight();
            var svgString = "";
            var xmlTag = new XMLTag("circle");
            xmlTag.addAttribute("cx", String(position.x));
            xmlTag.addAttribute("cy", String(canvasHeight - position.y));
            xmlTag.addAttribute("r", "" + this.radius);
            xmlTag.addAttribute("fill", "" + this.colourNode.getCss3String());
            xmlTag.addAttribute("stroke", "none");
            svgString = xmlTag.getEmptyElementTag() + "\n";
            return svgString;
        };
        Circle.prototype.copy = function () {
            return new Circle(this.radius, this.getPoints()[0].x, this.getPoints()[0].y, this.colourNode.getRGBAString());
        };
        return Circle;
    })(Plexx.SceneGraphLeaf);
    Plexx.Circle = Circle;
})(Plexx || (Plexx = {}));
/// <reference path="../../general/constants.ts" />
/// <reference path="../../general/renderContext.ts" />
/// <reference path="../../helper/xmlTag.ts" />
/// <reference path="../../helper/fdglMath.ts" />
/// <reference path="../graphNode.ts" />
/// <reference path="../materials/colour.ts" />
/// <reference path="../sceneGraphLeaf.ts" />
/// <reference path="../../../../libs/TSM/tsm-0.7.d.ts" />
var Plexx;
(function (Plexx) {
    var Rectangle = (function (_super) {
        __extends(Rectangle, _super);
        function Rectangle(width, height, x, y, colour) {
            _super.call(this, "Rectangle");
            this.setPoints([new TSM.vec2([x, y])]);
            this.setTransformationMatrix(new TSM.mat3().setIdentity());
            this.height = height || Constants.DEFAULT_HEIGHT;
            this.width = width || Constants.DEFAULT_WIDTH;
            this.colourNode = new Plexx.Colour(colour);
            console.log("[FDGL] " + this.toString() + " created");
        }
        Rectangle.prototype.toString = function () {
            var textString = "";
            textString = this.getName() + " {width = " + this.width + ", height = " + this.height + ", x = " + this.getPoints()[0].x + ", y = " + this.getPoints()[0].y + "}";
            return textString;
        };
        Rectangle.prototype.getX = function () {
            return this.getPoints()[0].x;
        };
        Rectangle.prototype.setX = function (x) {
            this.getPoints()[0].x = x;
            return this;
        };
        Rectangle.prototype.getY = function () {
            return this.getPoints()[0].y;
        };
        Rectangle.prototype.setY = function (y) {
            this.getPoints()[0].y = y;
            return this;
        };
        Rectangle.prototype.setHeight = function (height) {
            this.height = height;
        };
        Rectangle.prototype.getHeight = function () {
            return this.height;
        };
        Rectangle.prototype.setWidth = function (width) {
            this.width = width;
        };
        Rectangle.prototype.getWidth = function () {
            return this.width;
        };
        Rectangle.prototype.setColour = function (colour) {
            this.colourNode.setColour(colour);
        };
        Rectangle.prototype.getColour = function () {
            return this.colourNode.getRGBAString();
        };
        Rectangle.prototype.render = function (renderContext) {
            var currentRenderType = renderContext.getRenderType();
            if (currentRenderType == Plexx.RenderType.CANVAS2D) {
                return this.updateCanvas2d(renderContext);
            }
            else if (currentRenderType == Plexx.RenderType.SVG) {
                return this.updateSVG(renderContext);
            }
            else if (currentRenderType == Plexx.RenderType.WEBGL) {
                return this.updateWebGL(renderContext);
            }
            else
                return false;
        };
        Rectangle.prototype.updateCanvas2d = function (renderContext) {
            var context = renderContext.getCanvas2D().getContext("2d");
            var position = this.getPoints()[0];
            var transformationMatrix = this.getTransformationMatrix();
            var mirrorMatrix = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix = mirrorMatrix.copy().multiply(transformationMatrix);
            context.save();
            context.setTransform(resultMatrix.at(0), resultMatrix.at(1), resultMatrix.at(3), resultMatrix.at(4), resultMatrix.at(6), resultMatrix.at(7));
            context.fillStyle = this.colourNode.getCss3String();
            context.fillRect(position.x, position.y, this.width, this.height);
            context.restore();
            return true;
        };
        Rectangle.prototype.updateSVG = function (renderContext) {
            var SVGObject = document.createElementNS(Constants.SVG_NAMESPACE, "rect");
            var position = this.getPoints()[0];
            var transformationMatrix = this.getTransformationMatrix();
            var mirrorMatrix = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix = mirrorMatrix.copy().multiply(transformationMatrix);
            SVGObject.setAttribute("width", String(this.width));
            SVGObject.setAttribute("height", String(this.height));
            SVGObject.setAttribute("x", String(position.x));
            SVGObject.setAttribute("y", String(position.y));
            SVGObject.setAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " + resultMatrix.at(3) + " " + resultMatrix.at(4) + " " + resultMatrix.at(6) + " " + resultMatrix.at(7) + ")");
            SVGObject.setAttribute("fill", this.colourNode.getCss3String());
            SVGObject.setAttribute("stroke", "none");
            renderContext.getSVG().appendChild(SVGObject);
            return true;
        };
        Rectangle.prototype.updateWebGL = function (renderContext) {
            var gl = renderContext.getCanvasWebGL().getContext("webgl");
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, this.generateVertexShaderSource());
            gl.compileShader(vertexShader);
            var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, this.generateFragmentShaderSource());
            gl.compileShader(fragmentShader);
            var shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            gl.useProgram(shaderProgram);
            var positionLocation = gl.getAttribLocation(shaderProgram, "aVertexPosition");
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            var resolutionLocation = gl.getUniformLocation(shaderProgram, "resolution");
            gl.uniform2f(resolutionLocation, renderContext.getCanvasWebGL().getAttribute("width"), renderContext.getCanvasWebGL().getAttribute("height"));
            var matrixSize = gl.getUniformLocation(shaderProgram, "resolution");
            gl.uniform1f(matrixSize, 1);
            var tM = new Float32Array(this.getTransformationMatrix().all());
            var matrix = gl.getUniformLocation(shaderProgram, "matrix");
            gl.uniformMatrix3fv(matrix, false, tM);
            var position = this.getPoints()[0];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                position.x, position.y,
                position.x + this.width, position.y,
                position.x, position.y + this.height,
                position.x, position.y + this.height,
                position.x + this.width, position.y,
                position.x + this.width, position.y + this.height]), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            return true;
        };
        Rectangle.prototype.generateVertexShaderSource = function () {
            var vertexShaderSource = "attribute vec2 aVertexPosition;                               \n" +
                "                                                              \n" +
                "uniform int matrix_size;                                      \n" +
                "uniform mat3 matrix;                                          \n" +
                "uniform vec2 resolution;                                      \n" +
                "                                                              \n" +
                "void main() {                                                 \n" +
                "  vec2 pos = (matrix * vec3(aVertexPosition, 1)).xy;          \n" +
                "  vec2 tmp1 = pos / (resolution);                             \n" +
                "  vec2 tmp2 = tmp1 * 2.0;                                     \n" +
                "  vec2 tmp3 = tmp2 - 1.0;                                     \n" +
                "  gl_Position = vec4(tmp3 , 0, 1);                            \n" +
                "}                                                             \n";
            return vertexShaderSource;
        };
        Rectangle.prototype.generateFragmentShaderSource = function () {
            var fragmentShaderSrc = "precision mediump float;                                      \n" +
                "                                                              \n" +
                "void main() {                                                 \n" +
                "  gl_FragColor = vec4(" + this.colourNode.getR() + "," + this.colourNode.getG() + "," + this.colourNode.getB() + "," + this.colourNode.getA() + ");                          \n" +
                "}                                                             \n";
            return fragmentShaderSrc;
        };
        Rectangle.prototype.toSVGString = function (renderContext) {
            var svgString = "";
            var xmlTag = new XMLTag("rect");
            var position = this.getPoints()[0];
            var transformationMatrix = this.getTransformationMatrix();
            var mirrorMatrix = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix = mirrorMatrix.copy().multiply(transformationMatrix);
            xmlTag.addAttribute("width", String(this.width));
            xmlTag.addAttribute("height", String(this.height));
            xmlTag.addAttribute("x", String(position.x));
            xmlTag.addAttribute("y", String(position.y));
            xmlTag.addAttribute("fill", String(this.colourNode.getCss3String()));
            xmlTag.addAttribute("stroke", "none");
            xmlTag.addAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " + resultMatrix.at(3) + " " + resultMatrix.at(4) + " " + resultMatrix.at(6) + " " + resultMatrix.at(7) + ")");
            svgString = xmlTag.getEmptyElementTag() + "\n";
            return svgString;
        };
        Rectangle.prototype.copy = function () {
            return new Rectangle(this.width, this.height, this.getPoints()[0].x, this.getPoints()[0].y, this.colourNode.getRGBAString());
        };
        return Rectangle;
    })(Plexx.SceneGraphLeaf);
    Plexx.Rectangle = Rectangle;
})(Plexx || (Plexx = {}));
/// <reference path="../../general/constants.ts" />
/// <reference path="../graphNode.ts" />
/// <reference path="../sceneGraphLeaf.ts" />
/// <reference path="../materials/colour.ts" />
/// <reference path="../../helper/xmlTag.ts" />
/// <reference path="../../general/renderContext.ts" />
var Plexx;
(function (Plexx) {
    var Triangle = (function (_super) {
        __extends(Triangle, _super);
        function Triangle(x1, y1, x2, y2, x3, y3, colour) {
            _super.call(this, "Triangle");
            this.setPointsFromArray([x1, y1, x2, y2, x3, y3]);
            this.colourNode = new Plexx.Colour(colour);
            console.log("[FDGL] " + this.toString() + " created");
        }
        Triangle.prototype.toString = function () {
            var textString = "";
            textString = this.getName() + " { points = [ ";
            for (var index = 0; index < this.getPoints().length; index++) {
                if (index == 0)
                    textString += this.getPoints()[index];
                textString += ", " + this.getPoints()[index];
            }
            textString += "],";
            return textString;
        };
        Triangle.prototype.setColour = function (colour) {
            this.colourNode.setColour(colour);
        };
        Triangle.prototype.getColour = function () {
            return this.colourNode.getRGBString();
        };
        Triangle.prototype.render = function (renderContext) {
            var currentRenderType = renderContext.getRenderType();
            if (currentRenderType == Plexx.RenderType.CANVAS2D) {
                return this.updateCanvas2d(renderContext);
            }
            else if (currentRenderType == Plexx.RenderType.SVG) {
                this.updateSVG(renderContext);
            }
            else if (currentRenderType == Plexx.RenderType.WEBGL) {
                this.updateWebGL(renderContext);
            }
            else
                return false;
        };
        Triangle.prototype.updateCanvas2d = function (renderContext) {
            var context = renderContext.getCanvas2D().getContext("2d");
            var position = this.getPoints()[0];
            var transformationMatrix = this.getTransformationMatrix();
            var mirrorMatrix = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix = mirrorMatrix.copy().multiply(transformationMatrix);
            context.save();
            context.beginPath();
            context.setTransform(resultMatrix.at(0), resultMatrix.at(1), resultMatrix.at(3), resultMatrix.at(4), resultMatrix.at(6), resultMatrix.at(7));
            context.moveTo(this.getPoints()[0].x, this.getPoints()[0].y);
            context.lineTo(this.getPoints()[1].x, this.getPoints()[1].y);
            context.lineTo(this.getPoints()[2].x, this.getPoints()[2].y);
            context.fillStyle = this.colourNode.getCss3String();
            context.strokeStyle = "none";
            context.fill();
            context.closePath();
            context.restore();
            return true;
        };
        Triangle.prototype.updateSVG = function (renderContext) {
            var SVGObject = document.createElementNS(Constants.SVG_NAMESPACE, "polygon");
            var points = "";
            var transformationMatrix = this.getTransformationMatrix();
            var mirrorMatrix = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix = mirrorMatrix.copy().multiply(transformationMatrix);
            points = this.getPoints()[0].x + "," + this.getPoints()[0].y;
            points += " " + this.getPoints()[1].x + "," + this.getPoints()[1].y;
            points += " " + this.getPoints()[2].x + "," + this.getPoints()[2].y;
            SVGObject.setAttribute("points", points);
            SVGObject.setAttribute("fill", this.colourNode.getCss3String());
            SVGObject.setAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " + resultMatrix.at(3) + " " + resultMatrix.at(4) + " " + resultMatrix.at(6) + " " + resultMatrix.at(7) + ")");
            SVGObject.setAttribute("stroke", "none");
            renderContext.getSVG().appendChild(SVGObject);
            return true;
        };
        Triangle.prototype.updateWebGL = function (renderContext) {
            var gl = renderContext.getCanvasWebGL().getContext("webgl");
            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, this.generateVertexShaderSource());
            gl.compileShader(vertexShader);
            var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, this.generateFragmentShaderSource());
            gl.compileShader(fragmentShader);
            var shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            gl.useProgram(shaderProgram);
            var positionLocation = gl.getAttribLocation(shaderProgram, "aVertexPosition");
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            var resolutionLocation = gl.getUniformLocation(shaderProgram, "resolution");
            console.log(resolutionLocation);
            gl.uniform2f(resolutionLocation, renderContext.getCanvasWebGL().getAttribute("width"), renderContext.getCanvasWebGL().getAttribute("height"));
            var tM = new Float32Array(this.getTransformationMatrix().all());
            var matrix = gl.getUniformLocation(shaderProgram, "matrix");
            gl.uniformMatrix3fv(matrix, false, tM);
            var polygonVertices = new Float32Array(6);
            polygonVertices[0] = this.getPoints()[0].x;
            polygonVertices[1] = this.getPoints()[0].y;
            polygonVertices[2] = this.getPoints()[1].x;
            polygonVertices[3] = this.getPoints()[1].y;
            polygonVertices[4] = this.getPoints()[2].x;
            polygonVertices[5] = this.getPoints()[2].y;
            gl.bufferData(gl.ARRAY_BUFFER, polygonVertices, gl.STATIC_DRAW);
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);
            return true;
        };
        Triangle.prototype.generateVertexShaderSource = function () {
            var vertexShaderSource = "attribute vec2 aVertexPosition;                               \n" +
                "                                                              \n" +
                "uniform int matrix_size;                                      \n" +
                "uniform mat3 matrix;                                          \n" +
                "uniform vec2 resolution;                                      \n" +
                "                                                              \n" +
                "void main() {                                                 \n" +
                "  vec2 pos = (matrix * vec3(aVertexPosition, 1)).xy;          \n" +
                "  vec2 tmp1 = pos / (resolution);                             \n" +
                "  vec2 tmp2 = tmp1 * 2.0;                                     \n" +
                "  vec2 tmp3 = tmp2 - 1.0;                                     \n" +
                "  gl_Position = vec4(tmp3 , 0, 1);                            \n" +
                "}                                                             \n";
            return vertexShaderSource;
        };
        Triangle.prototype.generateFragmentShaderSource = function () {
            console.log("  gl_FragColor = vec4(" + this.colourNode.getR() + "," + this.colourNode.getG() + "," + this.colourNode.getB() + "," + this.colourNode.getA() + ");                          \n");
            var fragmentShaderSrc = "precision mediump float;                                    \n" +
                "                                                            \n" +
                "void main() {                                               \n" +
                "  gl_FragColor = vec4(" + this.colourNode.getR() + "," + this.colourNode.getG() + "," + this.colourNode.getB() + "," + this.colourNode.getA() + ");                          \n" +
                "}                                                           \n";
            return fragmentShaderSrc;
        };
        Triangle.prototype.toSVGString = function (renderContext) {
            var svgString = "";
            var xmlTag = new XMLTag("polygon");
            var points = "";
            var transformationMatrix = this.getTransformationMatrix();
            var mirrorMatrix = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix = mirrorMatrix.copy().multiply(transformationMatrix);
            points = this.getPoints()[0].x + "," + this.getPoints()[0].y;
            points += " " + this.getPoints()[1].x + "," + this.getPoints()[1].y;
            points += " " + this.getPoints()[2].x + "," + this.getPoints()[2].y;
            xmlTag.addAttribute("points", points);
            xmlTag.addAttribute("fill", "" + this.colourNode.getRGBString());
            xmlTag.addAttribute("stroke", "" + this.colourNode.getRGBString());
            xmlTag.addAttribute("stroke-width", "0");
            xmlTag.addAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " + resultMatrix.at(3) + " " + resultMatrix.at(4) + " " + resultMatrix.at(6) + " " + resultMatrix.at(7) + ")");
            svgString = xmlTag.getEmptyElementTag() + "\n";
            return svgString;
        };
        Triangle.prototype.copy = function () {
            return new Triangle(this.getPoints()[0].x, this.getPoints()[0].y, this.getPoints()[1].x, this.getPoints()[1].y, this.getPoints()[2].x, this.getPoints()[2].y, this.colourNode.getRGBAString());
        };
        return Triangle;
    })(Plexx.SceneGraphLeaf);
    Plexx.Triangle = Triangle;
})(Plexx || (Plexx = {}));
/// <reference path="../../general/constants.ts" />
/// <reference path="../graphNode.ts" />
/// <reference path="../sceneGraphLeaf.ts" />
/// <reference path="../materials/colour.ts" />
/// <reference path="../../helper/xmlTag.ts" />
/// <reference path="../../general/renderContext.ts" />
var Plexx;
(function (Plexx) {
    var Ellipse = (function (_super) {
        __extends(Ellipse, _super);
        function Ellipse(radiusX, radiusY, posX, posY, colour) {
            _super.call(this, "Ellipse");
            this.circleSides = 128;
            this.setPoints([new TSM.vec2([posX, posY])]);
            this.radiusX = radiusX || Constants.DEFAULT_HEIGHT;
            this.radiusY = radiusY || Constants.DEFAULT_HEIGHT;
            this.colourNode = new Plexx.Colour(colour);
            console.log("[FDGL] " + this.toString() + " created");
        }
        Ellipse.prototype.toString = function () {
            var textString = "";
            textString = this.getName() + " { points = [ ";
            for (var index = 0; index < this.getPoints().length; index++) {
                if (index == 0)
                    textString += this.getPoints()[index];
                textString += ", " + this.getPoints()[index];
            }
            textString += "],";
            return textString;
        };
        Ellipse.prototype.setRadiusX = function (radiusX) {
            this.radiusX = radiusX;
        };
        Ellipse.prototype.setRadiusY = function (radiusY) {
            this.radiusY = radiusY;
        };
        Ellipse.prototype.getRadiusX = function () {
            return this.radiusX;
        };
        Ellipse.prototype.getRadiusY = function () {
            return this.radiusY;
        };
        Ellipse.prototype.setColour = function (colour) {
            this.colourNode.setColour(colour);
        };
        Ellipse.prototype.getColour = function () {
            return this.colourNode.getRGBString();
        };
        Ellipse.prototype.render = function (renderContext) {
            var currentRenderType = renderContext.getRenderType();
            if (currentRenderType == Plexx.RenderType.CANVAS2D) {
                return this.updateCanvas2d(renderContext);
            }
            else if (currentRenderType == Plexx.RenderType.SVG) {
                return this.updateSVG(renderContext);
            }
            else if (currentRenderType == Plexx.RenderType.WEBGL) {
                return this.updateWebGL(renderContext);
            }
            else
                return false;
        };
        Ellipse.prototype.updateCanvas2d = function (renderContext) {
            var context = renderContext.getCanvas2D().getContext("2d");
            var position = this.getPoints()[0];
            var transformationMatrix = this.getTransformationMatrix();
            var mirrorMatrix = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix = mirrorMatrix.copy().multiply(transformationMatrix);
            context.save();
            context.beginPath();
            context.setTransform(resultMatrix.at(0), resultMatrix.at(1), resultMatrix.at(3), resultMatrix.at(4), resultMatrix.at(6), resultMatrix.at(7));
            context.translate(position.x, position.y);
            context.scale(this.radiusX, this.radiusY);
            context.arc(0, 0, 1, 0, 2 * Math.PI, false);
            context.fillStyle = this.colourNode.getCss3String();
            context.fill();
            context.strokeStyle = "none";
            context.closePath();
            context.restore();
            return true;
        };
        Ellipse.prototype.updateSVG = function (renderContext) {
            var SVGObject = document.createElementNS(Constants.SVG_NAMESPACE, "ellipse");
            var position = this.getPoints()[0];
            var canvasHeight = renderContext.getHeight();
            var transformationMatrix = this.getTransformationMatrix();
            var mirrorMatrix = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix = mirrorMatrix.copy().multiply(transformationMatrix);
            SVGObject.setAttribute("cx", String(position.x));
            SVGObject.setAttribute("cy", String(position.y));
            SVGObject.setAttribute("rx", String(this.radiusX));
            SVGObject.setAttribute("ry", String(this.radiusY));
            SVGObject.setAttribute("fill", this.colourNode.getCss3String());
            SVGObject.setAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " + resultMatrix.at(3) + " " + resultMatrix.at(4) + " " + resultMatrix.at(6) + " " + resultMatrix.at(7) + ")");
            SVGObject.setAttribute("stroke", "none");
            renderContext.getSVG().appendChild(SVGObject);
            return true;
        };
        Ellipse.prototype.updateWebGL = function (renderContext) {
            var gl = renderContext.getCanvasWebGL().getContext("webgl");
            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, this.generateVertexShaderSource());
            gl.compileShader(vertexShader);
            var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, this.generateFragmentShaderSource());
            gl.compileShader(fragmentShader);
            var shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            gl.useProgram(shaderProgram);
            var positionLocation = gl.getAttribLocation(shaderProgram, "aVertexPosition");
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            var resolutionLocation = gl.getUniformLocation(shaderProgram, "resolution");
            console.log(resolutionLocation);
            gl.uniform2f(resolutionLocation, renderContext.getCanvasWebGL().getAttribute("width"), renderContext.getCanvasWebGL().getAttribute("height"));
            var tM = new Float32Array(this.getTransformationMatrix().all());
            var matrix = gl.getUniformLocation(shaderProgram, "matrix");
            gl.uniformMatrix3fv(matrix, false, tM);
            var polygonVertices = new Float32Array(2 * (this.circleSides));
            var position = this.getPoints()[0];
            var canvasHeight = renderContext.getHeight();
            for (var i = 0; i < this.circleSides; i++) {
                polygonVertices[2 * i] = this.radiusX * Math.cos(2 * Math.PI / this.circleSides * i) + position.x;
                polygonVertices[(2 * i) + 1] = this.radiusY * Math.sin(2 * Math.PI / this.circleSides * i) + position.y;
            }
            gl.bufferData(gl.ARRAY_BUFFER, polygonVertices, gl.STATIC_DRAW);
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, this.circleSides);
            return true;
        };
        Ellipse.prototype.generateVertexShaderSource = function () {
            var vertexShaderSource = "attribute vec2 aVertexPosition;                               \n" +
                "                                                              \n" +
                "uniform int matrix_size;                                      \n" +
                "uniform mat3 matrix;                                          \n" +
                "uniform vec2 resolution;                                      \n" +
                "                                                              \n" +
                "void main() {                                                 \n" +
                "  vec2 pos = (matrix * vec3(aVertexPosition, 1)).xy;          \n" +
                "  vec2 tmp1 = pos / (resolution);                             \n" +
                "  vec2 tmp2 = tmp1 * 2.0;                                     \n" +
                "  vec2 tmp3 = tmp2 - 1.0;                                     \n" +
                "  gl_Position = vec4(tmp3 , 0, 1);                            \n" +
                "}                                                             \n";
            return vertexShaderSource;
        };
        Ellipse.prototype.generateFragmentShaderSource = function () {
            console.log("  gl_FragColor = vec4(" + this.colourNode.getR() + "," + this.colourNode.getG() + "," + this.colourNode.getB() + "," + this.colourNode.getA() + ");                          \n");
            var fragmentShaderSrc = "precision mediump float;                                    \n" +
                "                                                            \n" +
                "void main() {                                               \n" +
                "  gl_FragColor = vec4(" + this.colourNode.getR() + "," + this.colourNode.getG() + "," + this.colourNode.getB() + "," + this.colourNode.getA() + ");                          \n" +
                "}                                                           \n";
            return fragmentShaderSrc;
        };
        Ellipse.prototype.toSVGString = function (renderContext) {
            var position = this.getPoints()[0];
            var canvasHeight = renderContext.getHeight();
            var svgString = "";
            var xmlTag = new XMLTag("ellipse");
            xmlTag.addAttribute("cx", String(position.x));
            xmlTag.addAttribute("cy", String(position.y));
            xmlTag.addAttribute("rX", "" + this.radiusX);
            xmlTag.addAttribute("rY", "" + this.radiusY);
            xmlTag.addAttribute("fill", "" + this.colourNode.getRGBString());
            xmlTag.addAttribute("stroke", "none");
            svgString = xmlTag.getEmptyElementTag() + "\n";
            return svgString;
        };
        Ellipse.prototype.copy = function () {
            return new Ellipse(this.getPoints()[0].x, this.getPoints()[0].y, this.radiusX, this.radiusY, this.colourNode.getRGBAString());
        };
        return Ellipse;
    })(Plexx.SceneGraphLeaf);
    Plexx.Ellipse = Ellipse;
})(Plexx || (Plexx = {}));
/// <reference path="../../general/constants.ts" />
/// <reference path="../graphNode.ts" />
/// <reference path="../sceneGraphLeaf.ts" />
/// <reference path="../materials/colour.ts" />
/// <reference path="../../helper/xmlTag.ts" />
/// <reference path="../../helper/fdglMath.ts" />
/// <reference path="../../general/renderContext.ts" />
var Plexx;
(function (Plexx) {
    var Points = (function (_super) {
        __extends(Points, _super);
        function Points(points, type, size, borderColourString) {
            _super.call(this);
            this.setPointsFromArray(points);
            this.type = type || Constants.POINTS_DEFAULT_TYPE_ID;
            this.size = size || Constants.POINTS_DEFAULT_SIZE;
            this.borderColour = new Plexx.Colour(borderColourString);
        }
        Points.prototype.setType = function (typeId) {
            this.type = typeId;
        };
        Points.prototype.getType = function () {
            return this.type;
        };
        Points.prototype.setBorderColour = function (borderColour) {
            this.borderColour.setColour(borderColour);
        };
        Points.prototype.getBorderColour = function () {
            return this.borderColour.getRGBString();
        };
        Points.prototype.render = function (renderContext) {
            var currentRenderType = renderContext.getRenderType();
            if (currentRenderType == Plexx.RenderType.CANVAS2D) {
                this.updateCanvas2d(renderContext);
            }
            else if (currentRenderType == Plexx.RenderType.SVG) {
                this.updateSVG(renderContext);
            }
            else if (currentRenderType == Plexx.RenderType.WEBGL) {
                this.updateWebGL(renderContext);
            }
            return true;
        };
        Points.prototype.updateCanvas2d = function (renderContext) {
            var transformationMatrix = this.getTransformationMatrix();
            var mirrorMatrix = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix = mirrorMatrix.copy().multiply(transformationMatrix);
            if (this.type == Constants.PointsType.HollowCircle) {
                var context2D = renderContext.getCanvas2D().getContext("2d");
                context2D.save();
                context2D.setTransform(resultMatrix.at(0), resultMatrix.at(1), resultMatrix.at(3), resultMatrix.at(4), resultMatrix.at(6), resultMatrix.at(7));
                for (var i = 0; i < this.getPoints().length; i++) {
                    context2D.beginPath();
                    context2D.arc(this.getPoints()[i].x, this.getPoints()[i].y, this.size, 0, 2 * Math.PI, false);
                    context2D.fillStyle = "rgba(255, 255, 255, 0)";
                    context2D.fill();
                    context2D.strokeStyle = this.borderColour.getRGBString();
                    context2D.lineWidth = 0;
                    context2D.closePath();
                    context2D.stroke();
                }
                context2D.stroke();
                context2D.closePath();
                context2D.restore();
            }
            else if (this.type == Constants.PointsType.HollowDiamond) {
                var context2D = renderContext.getCanvas2D().getContext("2d");
                for (var i = 0; i < this.getPoints().length; i++) {
                    var currentPosition = this.getPoints()[i];
                    var x = this.getPoints()[i].x;
                    var y = this.getPoints()[i].y;
                    var s = this.size;
                    context2D.save();
                    context2D.setTransform(resultMatrix.at(0), resultMatrix.at(1), resultMatrix.at(3), resultMatrix.at(4), resultMatrix.at(6), resultMatrix.at(7));
                    context2D.lineWidth = 1;
                    context2D.translate(x, y);
                    context2D.rotate(Math.PI / 4);
                    context2D.fillStyle = this.borderColour.getRGBString();
                    context2D.strokeStyle = this.borderColour.getRGBString();
                    context2D.strokeRect((s / 2) * (-1), (s / 2) * (-1), this.size, this.size);
                    context2D.translate(-x, -y);
                    context2D.restore();
                }
            }
            return true;
        };
        Points.prototype.updateSVG = function (renderContext) {
            var transformationMatrix = this.getTransformationMatrix();
            var mirrorMatrix = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix = mirrorMatrix.copy().multiply(transformationMatrix);
            if (this.type == Constants.PointsType.HollowCircle) {
                for (var i = 0; i < this.getPoints().length; i++) {
                    var SVGPoint = document.createElementNS(Constants.SVG_NAMESPACE, "circle");
                    var currentPosition = this.getPoints()[i];
                    SVGPoint.setAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " + resultMatrix.at(3) + " " + resultMatrix.at(4) + " " + resultMatrix.at(6) + " " + resultMatrix.at(7) + ")");
                    SVGPoint.setAttribute("r", String(this.size));
                    SVGPoint.setAttribute("cx", String(currentPosition.x));
                    SVGPoint.setAttribute("cy", String(currentPosition.y));
                    SVGPoint.setAttribute("fill", "none");
                    SVGPoint.setAttribute("stroke", this.borderColour.getRGBString());
                    renderContext.getSVG().appendChild(SVGPoint);
                }
            }
            else if (this.type == Constants.PointsType.HollowDiamond) {
                for (var i = 0; i < this.getPoints().length; i++) {
                    var currentPosition = this.getPoints()[i];
                    var x = currentPosition.x;
                    var y = currentPosition.y;
                    var s = this.size;
                    var SVGPoint = document.createElementNS(Constants.SVG_NAMESPACE, "rect");
                    SVGPoint.setAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " + resultMatrix.at(3) + " " + resultMatrix.at(4) + " " + resultMatrix.at(6) + " " + resultMatrix.at(7) + ") rotate(45, " + (x) + " ," + (y) + ")");
                    SVGPoint.setAttribute("width", String(s));
                    SVGPoint.setAttribute("height", String(s));
                    SVGPoint.setAttribute("x", String(x - s / 2));
                    SVGPoint.setAttribute("y", String(y - s / 2));
                    SVGPoint.setAttribute("fill", "none");
                    SVGPoint.setAttribute("stroke", this.borderColour.getRGBString());
                    renderContext.getSVG().appendChild(SVGPoint);
                }
            }
            return true;
        };
        Points.prototype.updateWebGL = function (renderContext) {
            var gl = renderContext.getCanvasWebGL().getContext("webgl");
            // vertex shader
            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, this.generateVertexShaderSource());
            gl.compileShader(vertexShader);
            // fragment shader
            var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, this.generateFragmentShaderSource());
            gl.compileShader(fragmentShader);
            // shaderProgram
            var shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            gl.useProgram(shaderProgram);
            var positionLocation = gl.getAttribLocation(shaderProgram, "aVertexPosition");
            // buffer
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            var resolutionLocation = gl.getUniformLocation(shaderProgram, "resolution");
            var rotationLocation = gl.getUniformLocation(shaderProgram, "rotation");
            gl.uniform2f(resolutionLocation, renderContext.getCanvasWebGL().getAttribute("width"), renderContext.getCanvasWebGL().getAttribute("height"));
            gl.uniform2f(rotationLocation, 0, 1);
            var tM = new Float32Array(this.getTransformationMatrix().all());
            var matrix = gl.getUniformLocation(shaderProgram, "matrix");
            gl.uniformMatrix3fv(matrix, false, tM);
            if (this.type == Constants.PointsType.HollowCircle) {
                for (var i = 0; i < this.getPoints().length; i++) {
                    var currentPosition = this.getPoints()[i];
                    var n = Constants.PRIMITIVES_POINTS_CIRCLE_SIDES;
                    var s = this.size;
                    var polygonVertices = new Float32Array(2 * n);
                    for (var j = 0; j < n; j++) {
                        polygonVertices[2 * j] = s * Math.cos(2 * (Math.PI / n) * j) + currentPosition.x;
                        polygonVertices[(2 * j) + 1] = s * Math.sin(2 * (Math.PI / n) * j) + currentPosition.y;
                    }
                    gl.bufferData(gl.ARRAY_BUFFER, polygonVertices, gl.STATIC_DRAW);
                    gl.enableVertexAttribArray(positionLocation);
                    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
                    gl.drawArrays(gl.LINE_LOOP, 0, n);
                }
            }
            else if (this.type == Constants.PointsType.HollowDiamond) {
                for (var i = 0; i < this.getPoints().length; i++) {
                    var currentPosition = this.getPoints()[i];
                    var n = Constants.PRIMITIVES_POINTS_CIRCLE_SIDES;
                    var s = this.size;
                    var polygonVertices = new Float32Array(2 * n);
                    for (var j = 0; j <= 4; j++) {
                        polygonVertices[2 * j] = Math.sqrt(2) * (s / 2) * Math.cos(2 * (Math.PI / 4) * j) + currentPosition.x;
                        polygonVertices[(2 * j) + 1] = Math.sqrt(2) * (s / 2) * Math.sin(2 * (Math.PI / 4) * j) + currentPosition.y;
                    }
                    gl.bufferData(gl.ARRAY_BUFFER, polygonVertices, gl.STATIC_DRAW);
                    gl.enableVertexAttribArray(positionLocation);
                    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
                    gl.drawArrays(gl.LINE_LOOP, 0, 4);
                    gl.lineWidth(1);
                }
            }
            return true;
        };
        Points.prototype.generateVertexShaderSource = function () {
            var vertexShaderSource = "attribute vec2 aVertexPosition;                             \n" +
                "                                                            \n" +
                "uniform vec2 resolution;                                    \n" +
                "uniform vec2 rotation;                                      \n" +
                "uniform vec2 translation;                                      \n" +
                "                                                            \n" +
                "uniform mat3 matrix;                                          \n" +
                "                                                              \n" +
                "void main() {                                                 \n" +
                "  vec2 pos = (matrix * vec3(aVertexPosition, 1)).xy;          \n" +
                "  vec2 rotatedPosition = vec2(                              \n" +
                "       aVertexPosition.x * rotation.y + pos.y * rotation.x,           \n" +
                "       aVertexPosition.y * rotation.y - pos.x * rotation.x);          \n" +
                "  vec2 position = rotatedPosition + translation;                 \n" +
                "  vec2 tmp1 = position / resolution;                 \n" +
                "  vec2 tmp2 = tmp1 * 2.0;                                   \n" +
                "  vec2 tmp3 = tmp2 - 1.0;                                   \n" +
                "  gl_Position = vec4(tmp3, 0, 1);             \n" +
                "}                                                           \n";
            return vertexShaderSource;
        };
        Points.prototype.generateFragmentShaderSource = function () {
            var fragmentShaderSrc = "precision mediump float;                                    \n" +
                "                                                            \n" +
                "void main() {                                               \n" +
                "  gl_FragColor = vec4(" +
                this.borderColour.getR() + ", " +
                this.borderColour.getG() + ", " +
                this.borderColour.getB() + ", " +
                this.borderColour.getA() + ");                               \n" +
                "}                                                           \n";
            return fragmentShaderSrc;
        };
        Points.prototype.toSVGString = function () {
            var svgString = "";
            if (this.type == Constants.PointsType.HollowCircle) {
                for (var i = 0; i < this.getPoints().length; i++) {
                    var xmlTag = new XMLTag("circle");
                    var x = this.getPoints()[i].x;
                    var y = this.getPoints()[i].y;
                    var s = this.size;
                    xmlTag.addAttribute("r", String(s));
                    xmlTag.addAttribute("cx", String(x));
                    xmlTag.addAttribute("cy", String(y));
                    xmlTag.addAttribute("fill", "none");
                    xmlTag.addAttribute("stroke", "" + this.borderColour.getRGBString());
                    svgString += xmlTag.getEmptyElementTag() + "\n";
                }
            }
            else if (this.type == Constants.PointsType.HollowDiamond) {
                for (var i = 0; i < this.getPoints().length; i++) {
                    var xmlTag = new XMLTag("rect");
                    var x = this.getPoints()[i].x;
                    var y = this.getPoints()[i].y;
                    var s = this.size;
                    xmlTag.addAttribute("width", String(s));
                    xmlTag.addAttribute("height", String(s));
                    xmlTag.addAttribute("x", String(x));
                    xmlTag.addAttribute("y", String(y));
                    xmlTag.addAttribute("fill", "none");
                    xmlTag.addAttribute("stroke", "" + this.borderColour.getRGBString());
                    xmlTag.addAttribute("transform", "rotate(45, " + (x + (s / 2)) + " ," + (y + (s / 2)) + ")");
                    svgString += xmlTag.getEmptyElementTag() + "\n";
                }
            }
            return svgString;
        };
        Points.prototype.copy = function () {
            return new Points(this.getPointsAsArray(), this.type, this.size, this.borderColour.getRGBAString());
        };
        return Points;
    })(Plexx.SceneGraphLeaf);
    Plexx.Points = Points;
})(Plexx || (Plexx = {}));
/// <reference path="../../general/constants.ts" />
/// <reference path="../../general/renderContext.ts" />
/// <reference path="../../helper/xmlTag.ts" />
/// <reference path="../../helper/fdglMath.ts" />
/// <reference path="../graphNode.ts" />
/// <reference path="../materials/colour.ts" />
/// <reference path="../sceneGraphLeaf.ts" />
/// <reference path="../../../../libs/TSM/tsm-0.7.d.ts" />
var Plexx;
(function (Plexx) {
    var Text = (function (_super) {
        __extends(Text, _super);
        function Text(text, x, y, colour, fontSize, fontFamily, textAlignment, textBaseline) {
            _super.call(this, "TextNode");
            this.VSHADER_SOURCE = "attribute vec4 a_Position;                                    \n" +
                "attribute vec2 a_TextureCoordinates;                          \n" +
                "varying vec2 v_TextureCoordinates;                            \n" +
                "uniform vec2 u_Resolution;                                    \n" +
                "                                                              \n" +
                "void main() {                                                 \n" +
                "  vec2 tmp1 = vec2(a_Position.x, a_Position.y) / u_Resolution;\n" +
                "  vec2 tmp2 = tmp1 * 2.0;                                     \n" +
                "  vec2 tmp3 = tmp2 - 1.0;                                     \n" +
                "  gl_Position = vec4(tmp3 , a_Position.z, a_Position.w);      \n" +
                "  v_TextureCoordinates = a_TextureCoordinates;                \n" +
                "}                                                             \n";
            this.FSHADER_SOURCE = "precision mediump float;                                      \n" +
                "uniform sampler2D u_Sampler;                                  \n" +
                "varying vec2 v_TextureCoordinates;                            \n" +
                "                                                              \n" +
                "void main() {                                                 \n" +
                "  gl_FragColor = texture2D(u_Sampler, v_TextureCoordinates);  \n" +
                "}                                                             \n";
            this.setName("TextNode");
            this.setTransformationMatrix(new TSM.mat3().setIdentity());
            this.text = text;
            this.setPoints([new TSM.vec2([x, y])]);
            this.textColour = new Plexx.Colour(colour);
            this.fontSize = fontSize;
            this.fontFamily = fontFamily;
            this.textAlignment = textAlignment;
            this.textBaseline = textBaseline;
            console.log("[FDGL] " + "Create " + this.toString());
        }
        Text.prototype.copy = function () {
            var textNodeCopy = new Text(this.text, this.getPoints()[0].x, this.getPoints()[0].y, this.textColour.getRGBAString());
            return textNodeCopy;
        };
        Text.prototype.toString = function () {
            var textString = "";
            textString += this.getName() + " {";
            textString += "text = " + this.text + ", ";
            textString += "x = " + this.getPoints()[0].x + ", ";
            textString += "y = " + this.getPoints()[0].y + ", ";
            textString += "textColour = " + this.textColour.getRGBAString() + "}";
            return textString;
        };
        Text.prototype.render = function (renderContext) {
            var currentRenderType = renderContext.getRenderType();
            if (currentRenderType == Plexx.RenderType.CANVAS2D) {
                return this.renderCanvas2d(renderContext);
            }
            else if (currentRenderType == Plexx.RenderType.SVG) {
                return this.renderSVG(renderContext);
            }
            else if (currentRenderType == Plexx.RenderType.WEBGL) {
                return this.renderWebGL(renderContext);
            }
            else
                return false;
        };
        /*
         * -----------------------------------------------------------------------------
         * WebGL
         * -----------------------------------------------------------------------------
         */
        Text.prototype.getValidTextureSize = function (size) {
            var validSize = 2;
            while (size > validSize) {
                validSize *= 2;
            }
            return validSize;
        };
        Text.prototype.createCanvasTexture = function () {
            var textureCanvas = document.createElement("canvas");
            textureCanvas.id = "textureCanvas";
            textureCanvas.width = 1024;
            textureCanvas.height = 1024;
            var context = textureCanvas.getContext("2d");
            context.font = this.fontSize + "pt " + this.fontFamily;
            var textWidth = context.measureText(this.text).width;
            textureCanvas.width = this.getValidTextureSize(textWidth);
            textureCanvas.height = this.getValidTextureSize(this.fontSize * 2);
            context.font = this.fontSize + "pt " + this.fontFamily;
            context.fillStyle = this.textColour.getCss3String();
            context.fillText(this.text, 0, textureCanvas.height / 2);
            this.textureCanvas = textureCanvas;
        };
        Text.prototype.renderWebGL = function (renderContext) {
            this.createCanvasTexture();
            var gl = renderContext.getCanvasWebGL().getContext("webgl");
            var canvasHeight = renderContext.getCanvasWebGL().getAttribute("height");
            var canvasWidth = renderContext.getCanvasWebGL().getAttribute("width");
            // init shaders
            this.initShaders(gl);
            // set vertex information
            var n = this.initVertexBuffers(gl, canvasWidth, canvasHeight);
            // set textures
            this.initTexture(gl, n);
            return true;
        };
        Text.prototype.initShaders = function (gl) {
            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, this.VSHADER_SOURCE);
            gl.compileShader(vertexShader);
            var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, this.FSHADER_SOURCE);
            gl.compileShader(fragmentShader);
            this.program = gl.createProgram();
            gl.attachShader(this.program, vertexShader);
            gl.attachShader(this.program, fragmentShader);
            gl.linkProgram(this.program);
            gl.useProgram(this.program);
        };
        Text.prototype.initVertexBuffers = function (gl, canvasWidth, canvasHeight) {
            var position = this.getPoints()[0];
            var height = this.textureCanvas.height;
            var width = this.textureCanvas.width;
            var x = position.x;
            var y = position.y - height / 2;
            var verticesTextureCoordinates = new Float32Array([
                x, y + height, 0.0, 1.0,
                x, y, 0.0, 0.0,
                x + width, y + height, 1.0, 1.0,
                x + width, y, 1.0, 0.0,
            ]);
            var n = 4; // number of vertices
            var vertexTextureCoordinatesBuffer = gl.createBuffer();
            // bind buffer object to target
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordinatesBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, verticesTextureCoordinates, gl.STATIC_DRAW);
            var FSIZE = verticesTextureCoordinates.BYTES_PER_ELEMENT;
            var u_Resolution = gl.getUniformLocation(this.program, "u_Resolution");
            gl.uniform2f(u_Resolution, canvasWidth, canvasHeight);
            var a_Position = gl.getAttribLocation(this.program, "a_Position");
            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
            gl.enableVertexAttribArray(a_Position);
            var a_TextureCoordinates = gl.getAttribLocation(this.program, "a_TextureCoordinates");
            gl.vertexAttribPointer(a_TextureCoordinates, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
            gl.enableVertexAttribArray(a_TextureCoordinates);
            return n;
        };
        Text.prototype.initTexture = function (gl, n) {
            var canvasTexture = gl.createTexture();
            var u_Sampler = gl.getUniformLocation(this.program, 'u_Sampler');
            this.loadTexture(gl, n, canvasTexture, u_Sampler, this.textureCanvas);
        };
        Text.prototype.loadTexture = function (gl, n, texture, u_Sampler, textureCanvas) {
            // flip the image's y axis
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            // bind the texture object to the target
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureCanvas);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            // Set the texture unit 0 to the sampler
            gl.uniform1i(u_Sampler, 0);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
        };
        /*
         * -----------------------------------------------------------------------------
         * HTML5 canvas
         * -----------------------------------------------------------------------------
         */
        Text.prototype.renderCanvas2d = function (renderContext) {
            var context = renderContext.getCanvas2dContext();
            var position = this.getPoints()[0];
            var textHeight = this.fontSize;
            var transformationMatrix = this.getTransformationMatrix();
            var translationMatrix = new TSM.mat3([1, 0, 0, 0, 1, 0, 0, renderContext.getHeight() - 2 * position.y, 1]);
            var resultMatrix = translationMatrix.copy().multiply(transformationMatrix);
            try {
                context.save();
                context.setTransform(resultMatrix.at(0), resultMatrix.at(1), resultMatrix.at(3), resultMatrix.at(4), resultMatrix.at(6), resultMatrix.at(7));
                context.fillStyle = this.textColour.getCss3String();
                context.font = this.fontSize + "pt " + this.fontFamily;
                context.fillText(this.text, position.x, position.y);
                context.restore();
            }
            catch (e) {
                console.log("Canvas2D rendering error!");
                return false;
            }
            return true;
        };
        /*
         * -----------------------------------------------------------------------------
         * SVG
         * -----------------------------------------------------------------------------
         */
        Text.prototype.renderSVG = function (renderContext) {
            var svgElement = document.createElementNS(Constants.SVG_NAMESPACE, "text");
            var position = this.getPoints()[0];
            var transformationMatrix = this.getTransformationMatrix();
            var textHeight = this.fontSize;
            var translationMatrix = new TSM.mat3([1, 0, 0, 0, 1, 0, 0, renderContext.getHeight() - 2 * position.y, 1]);
            var resultMatrix = translationMatrix.copy().multiply(transformationMatrix);
            try {
                svgElement.setAttribute("x", String(position.x));
                svgElement.setAttribute("y", String(position.y));
                svgElement.setAttribute("transform", "matrix(" + resultMatrix.at(0) +
                    " " + resultMatrix.at(1) +
                    " " + resultMatrix.at(3) +
                    " " + resultMatrix.at(4) +
                    " " + resultMatrix.at(6) +
                    " " + resultMatrix.at(7) +
                    ")");
                svgElement.setAttribute("fill", this.textColour.getCss3String());
                svgElement.setAttribute("style", "font-family: " + this.fontFamily + ";" +
                    "font-size: " + this.fontSize + "pt;" +
                    "kerning: " + "auto;" +
                    "letter-spacing: " + "normal;");
                var textNode = document.createTextNode(this.text);
                svgElement.appendChild(textNode);
                renderContext.getSVG().appendChild(svgElement);
            }
            catch (e) {
                return false;
            }
            return true;
        };
        Text.prototype.toSVGString = function (renderContext) {
            var svgElement = "";
            var xmlTag = new XMLTag("text");
            svgElement = xmlTag.getStartTag() + "\n";
            var position = this.getPoints()[0];
            var transformationMatrix = this.getTransformationMatrix();
            var textHeight = this.fontSize;
            var translationMatrix = new TSM.mat3([1, 0, 0, 0, 1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix = translationMatrix.copy().multiply(transformationMatrix);
            xmlTag.addAttribute("x", String(position.x));
            xmlTag.addAttribute("y", String(position.y));
            xmlTag.addAttribute("transform", "matrix(" + resultMatrix.at(0) +
                " " + resultMatrix.at(1) +
                " " + resultMatrix.at(3) +
                " " + resultMatrix.at(4) +
                " " + resultMatrix.at(6) +
                " " + resultMatrix.at(7) +
                ")");
            xmlTag.addAttribute("fill", this.textColour.getCss3String());
            xmlTag.addAttribute("style", "font-family: " + this.fontFamily + "; font-size: " + this.fontSize + "pt;");
            svgElement = xmlTag.getStartTag() + this.text + xmlTag.getEndTag() + "\n";
            return svgElement;
        };
        return Text;
    })(Plexx.SceneGraphLeaf);
    Plexx.Text = Text;
})(Plexx || (Plexx = {}));
/// <reference path="../../general/constants.ts" />
/// <reference path="../graphNode.ts" />
/// <reference path="../sceneGraphLeaf.ts" />
/// <reference path="../materials/colour.ts" />
/// <reference path="../../helper/xmlTag.ts" />
/// <reference path="../../general/renderContext.ts" />
var Plexx;
(function (Plexx) {
    var PolyLine = (function (_super) {
        __extends(PolyLine, _super);
        function PolyLine(points, width, type, colourValue) {
            _super.call(this, "PolyLine");
            this.setPointsFromArray(points);
            this.width = width || Constants.DEFAULT_HEIGHT;
            this.type = type || Constants.LineType.Default;
            this.colour = new Plexx.Colour(colourValue);
            console.log("[FDGL] " + this.toString() + " created");
        }
        PolyLine.prototype.setType = function (typeId) {
            this.type = typeId;
        };
        PolyLine.prototype.getType = function () {
            return this.type;
        };
        PolyLine.prototype.setColour = function (colour) {
            this.colour.setColour(colour);
        };
        PolyLine.prototype.getColour = function () {
            return this.colour.getRGBString();
        };
        PolyLine.prototype.render = function (renderContext) {
            var currentRenderType = renderContext.getRenderType();
            if (currentRenderType == Plexx.RenderType.CANVAS2D) {
                return this.updateCanvas2d(renderContext);
            }
            else if (currentRenderType == Plexx.RenderType.SVG) {
                return this.updateSVG(renderContext);
            }
            else if (currentRenderType == Plexx.RenderType.WEBGL) {
                return this.updateWebGL(renderContext);
            }
            else
                return false;
        };
        PolyLine.prototype.updateCanvas2d = function (renderContext) {
            var context2D = renderContext.getCanvas2D().getContext("2d");
            var transformationMatrix = this.getTransformationMatrix();
            var mirrorMatrix = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix = mirrorMatrix.copy().multiply(transformationMatrix);
            if (this.type == Constants.LineType.Default) {
                context2D.save();
                context2D.setTransform(resultMatrix.at(0), resultMatrix.at(1), resultMatrix.at(3), resultMatrix.at(4), resultMatrix.at(6), resultMatrix.at(7));
                context2D.beginPath();
                context2D.moveTo(this.getPoints()[0].x, this.getPoints()[0].y);
                for (var i = 1; i < this.getPoints().length; i++) {
                    context2D.lineTo(this.getPoints()[i].x, this.getPoints()[i].y);
                }
                context2D.fillStyle = "rgba(255, 255, 255, 0)";
                context2D.fill();
                context2D.strokeStyle = this.colour.getRGBString();
                context2D.lineWidth = this.width;
                context2D.stroke();
                context2D.restore();
            }
            return true;
        };
        PolyLine.prototype.updateSVG = function (renderContext) {
            var transformationMatrix = this.getTransformationMatrix();
            var mirrorMatrix = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix = mirrorMatrix.copy().multiply(transformationMatrix);
            if (this.type == Constants.LineType.Default) {
                var SVGPoint = document.createElementNS(Constants.SVG_NAMESPACE, "polyline");
                var pointString = String(this.getPoints()[0].x) + "," + String(this.getPoints()[0].y);
                for (var i = 1; i < this.getPoints().length; i++) {
                    pointString += " " + String(this.getPoints()[i].x) + "," + String(this.getPoints()[i].y);
                }
                SVGPoint.setAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " + resultMatrix.at(3) + " " + resultMatrix.at(4) + " " + resultMatrix.at(6) + " " + resultMatrix.at(7) + ")");
                SVGPoint.setAttribute("points", pointString);
                SVGPoint.setAttribute("stroke", this.colour.getRGBString());
                SVGPoint.setAttribute("fill", "none");
                SVGPoint.setAttribute("stroke-width", String(this.width));
                renderContext.getSVG().appendChild(SVGPoint);
            }
            return true;
        };
        PolyLine.prototype.updateWebGL = function (renderContext) {
            var gl = renderContext.getCanvasWebGL().getContext("webgl");
            // vertex shader
            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, this.generateVertexShaderSource());
            gl.compileShader(vertexShader);
            // fragment shader
            var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, this.generateFragmentShaderSource());
            gl.compileShader(fragmentShader);
            // shaderProgram
            var shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            gl.useProgram(shaderProgram);
            var positionLocation = gl.getAttribLocation(shaderProgram, "aVertexPosition");
            // buffer
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            var resolutionLocation = gl.getUniformLocation(shaderProgram, "resolution");
            console.log(resolutionLocation);
            gl.uniform2f(resolutionLocation, renderContext.getCanvasWebGL().getAttribute("width"), renderContext.getCanvasWebGL().getAttribute("height"));
            gl.lineWidth(this.width);
            gl.uniform2f(rotationLocation, 0, 1);
            var polygonVertices = new Float32Array(2 * this.getPoints().length);
            for (var i = 0; i < this.getPoints().length; i++) {
                polygonVertices[2 * i] = this.getPoints()[i].x;
                polygonVertices[(2 * i) + 1] = this.getPoints()[i].y;
            }
            var tM = new Float32Array(this.getTransformationMatrix().all());
            var matrix = gl.getUniformLocation(shaderProgram, "matrix");
            var rotationLocation = gl.getUniformLocation(shaderProgram, "rotation");
            gl.uniformMatrix3fv(matrix, false, tM);
            gl.bufferData(gl.ARRAY_BUFFER, polygonVertices, gl.STATIC_DRAW);
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            var rotation = [0, 1];
            gl.uniform2fv(rotationLocation, rotation);
            gl.drawArrays(gl.LINE_STRIP, 0, this.getPoints().length);
            return true;
        };
        PolyLine.prototype.generateVertexShaderSource = function () {
            var vertexShaderSource = "attribute vec2 aVertexPosition;                               \n" +
                "                                                              \n" +
                "uniform vec2 resolution;                                      \n" +
                "uniform vec2 rotation;                                        \n" +
                "uniform vec2 translation;                                     \n" +
                "                                                              \n" +
                "uniform mat3 matrix;                                          \n" +
                "                                                              \n" +
                "void main() {                                                 \n" +
                "  vec2 pos = (matrix * vec3(aVertexPosition, 1)).xy;          \n" +
                "  vec2 rotatedPosition = vec2(                                \n" +
                "       aVertexPosition.x * rotation.y + pos.y * rotation.x,   \n" +
                "       aVertexPosition.y * rotation.y - pos.x * rotation.x);  \n" +
                "  vec2 position = rotatedPosition + translation;                 \n" +
                "  vec2 tmp1 = position / resolution;                 \n" +
                "  vec2 tmp2 = tmp1 * 2.0;                                   \n" +
                "  vec2 tmp3 = tmp2 - 1.0;                                   \n" +
                "  gl_Position = vec4(tmp3, 0, 1);             \n" +
                "}                                                           \n";
            return vertexShaderSource;
        };
        PolyLine.prototype.generateFragmentShaderSource = function () {
            var fragmentShaderSrc = "precision mediump float;                                    \n" +
                "                                                            \n" +
                "void main() {                                               \n" +
                "  gl_FragColor = vec4(" +
                this.colour.getR() + ", " +
                this.colour.getG() + ", " +
                this.colour.getB() + ", " +
                this.colour.getA() + ");                                     \n" +
                "}                                                           \n";
            return fragmentShaderSrc;
        };
        PolyLine.prototype.toSVGString = function () {
            var svgString = "";
            return svgString;
        };
        PolyLine.prototype.copy = function () {
            return new PolyLine(this.getPointsAsArray(), this.width, this.type, this.colour.getRGBAString());
        };
        return PolyLine;
    })(Plexx.SceneGraphLeaf);
    Plexx.PolyLine = PolyLine;
})(Plexx || (Plexx = {}));
/// <reference path="../../general/constants.ts" />
/// <reference path="../graphNode.ts" />
/// <reference path="../sceneGraphLeaf.ts" />
/// <reference path="../materials/colour.ts" />
/// <reference path="../../helper/xmlTag.ts" />
/// <reference path="../../general/renderContext.ts" />
var Plexx;
(function (Plexx) {
    var Polygon = (function (_super) {
        __extends(Polygon, _super);
        function Polygon(points, colour) {
            _super.call(this, "Polygon");
            this.setPointsFromArray(points);
            this.colourNode = new Plexx.Colour(colour);
            console.log("[FDGL] " + this.toString() + " created");
        }
        Polygon.prototype.toString = function () {
            var textString = "";
            textString = this.getName() + " { points = [ ";
            for (var index = 0; index < this.getPoints().length; index++) {
                if (index == 0)
                    textString += this.getPoints()[index];
                textString += ", " + this.getPoints()[index];
            }
            textString += "],";
            return textString;
        };
        Polygon.prototype.setColour = function (colour) {
            this.colourNode.setColour(colour);
        };
        Polygon.prototype.getColour = function () {
            return this.colourNode.getRGBString();
        };
        Polygon.prototype.render = function (renderContext) {
            var currentRenderType = renderContext.getRenderType();
            if (currentRenderType == Plexx.RenderType.CANVAS2D) {
                return this.updateCanvas2d(renderContext);
            }
            else if (currentRenderType == Plexx.RenderType.SVG) {
                return this.updateSVG(renderContext);
            }
            else if (currentRenderType == Plexx.RenderType.WEBGL) {
                return this.updateWebGL(renderContext);
            }
            else
                return false;
        };
        Polygon.prototype.updateCanvas2d = function (renderContext) {
            var context = renderContext.getCanvas2D().getContext("2d");
            var position = this.getPoints()[0];
            var transformationMatrix = this.getTransformationMatrix();
            var mirrorMatrix = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix = mirrorMatrix.copy().multiply(transformationMatrix);
            context.save();
            context.beginPath();
            context.setTransform(resultMatrix.at(0), resultMatrix.at(1), resultMatrix.at(3), resultMatrix.at(4), resultMatrix.at(6), resultMatrix.at(7));
            context.lineTo(position.x, position.y);
            for (var i = 1; i < this.getPoints().length; i++) {
                var position = this.getPoints()[i];
                context.lineTo(position.x, position.y);
            }
            context.fillStyle = this.colourNode.getCss3String();
            context.fill();
            context.strokeStyle = "none";
            context.lineWidth = 0;
            context.closePath();
            context.restore();
            return true;
        };
        Polygon.prototype.updateSVG = function (renderContext) {
            var points = "";
            var SVGObject = document.createElementNS(Constants.SVG_NAMESPACE, "polygon");
            var transformationMatrix = this.getTransformationMatrix();
            var mirrorMatrix = new TSM.mat3([1, 0, 0, 0, -1, 0, 0, renderContext.getHeight(), 1]);
            var resultMatrix = mirrorMatrix.copy().multiply(transformationMatrix);
            var position = this.getPoints()[0];
            points = position.x + "," + position.y;
            for (var i = 1; i < this.getPoints().length; i++) {
                var position = this.getPoints()[i];
                points += " " + position.x + "," + position.y;
            }
            SVGObject.setAttribute("points", points);
            SVGObject.setAttribute("transform", "matrix(" + resultMatrix.at(0) + " " + resultMatrix.at(1) + " " + resultMatrix.at(3) + " " + resultMatrix.at(4) + " " + resultMatrix.at(6) + " " + resultMatrix.at(7) + ")");
            SVGObject.setAttribute("fill", this.colourNode.getRGBString());
            SVGObject.setAttribute("stroke", "none");
            SVGObject.setAttribute("stroke-width", "0");
            renderContext.getSVG().appendChild(SVGObject);
            return true;
        };
        Polygon.prototype.updateWebGL = function (renderContext) {
            var gl = renderContext.getCanvasWebGL().getContext("webgl");
            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, this.generateVertexShaderSource());
            gl.compileShader(vertexShader);
            var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, this.generateFragmentShaderSource());
            gl.compileShader(fragmentShader);
            var shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            gl.useProgram(shaderProgram);
            var positionLocation = gl.getAttribLocation(shaderProgram, "aVertexPosition");
            var tM = new Float32Array(this.getTransformationMatrix().all());
            var matrix = gl.getUniformLocation(shaderProgram, "matrix");
            gl.uniformMatrix3fv(matrix, false, tM);
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            var resolutionLocation = gl.getUniformLocation(shaderProgram, "resolution");
            console.log(resolutionLocation);
            gl.uniform2f(resolutionLocation, renderContext.getCanvasWebGL().getAttribute("width"), renderContext.getCanvasWebGL().getAttribute("height"));
            var polygonVertices = new Float32Array(this.getPoints().length * 2);
            for (var i = 0; i < this.getPoints().length; i++) {
                var position = this.getPoints()[i];
                polygonVertices[2 * i] = position.x;
                polygonVertices[(2 * i) + 1] = position.y;
            }
            gl.bufferData(gl.ARRAY_BUFFER, polygonVertices, gl.STATIC_DRAW);
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, this.getPoints().length);
            return true;
        };
        Polygon.prototype.generateVertexShaderSource = function () {
            var vertexShaderSource = "attribute vec2 aVertexPosition;                               \n" +
                "                                                              \n" +
                "uniform int matrix_size;                                      \n" +
                "uniform mat3 matrix;                                          \n" +
                "uniform vec2 resolution;                                      \n" +
                "                                                              \n" +
                "void main() {                                                 \n" +
                "  vec2 pos = (matrix * vec3(aVertexPosition, 1)).xy;          \n" +
                "  vec2 tmp1 = pos / (resolution);                             \n" +
                "  vec2 tmp2 = tmp1 * 2.0;                                     \n" +
                "  vec2 tmp3 = tmp2 - 1.0;                                     \n" +
                "  gl_Position = vec4(tmp3 , 0, 1);                            \n" +
                "}                                                             \n";
            return vertexShaderSource;
        };
        Polygon.prototype.generateFragmentShaderSource = function () {
            console.log("  gl_FragColor = vec4(" + this.colourNode.getR() + "," + this.colourNode.getG() + "," + this.colourNode.getB() + "," + this.colourNode.getA() + ");                          \n");
            var fragmentShaderSrc = "precision mediump float;                                      \n" +
                "                                                              \n" +
                "void main() {                                                 \n" +
                "  gl_FragColor = vec4(" + this.colourNode.getR() + "," + this.colourNode.getG() + "," + this.colourNode.getB() + "," + this.colourNode.getA() + ");                          \n" +
                "}                                                             \n";
            return fragmentShaderSrc;
        };
        Polygon.prototype.toSVGString = function () {
            var svgString = "";
            var xmlTag = new XMLTag("polygon");
            var points = "";
            var position = this.getPoints()[0];
            points = position.x + "," + position.y;
            for (var i = 2; i < this.getPoints().length; i++) {
                var position = this.getPoints()[i];
                points += " " + String(position.x) + "," + String(position.y);
            }
            xmlTag.addAttribute("points", points);
            xmlTag.addAttribute("fill", "" + this.colourNode.getRGBString());
            xmlTag.addAttribute("stroke", "" + this.colourNode.getRGBString());
            xmlTag.addAttribute("stroke-width", "0");
            svgString = xmlTag.getEmptyElementTag() + "\n";
            return svgString;
        };
        Polygon.prototype.copy = function () {
            return new Polygon(this.getPointsAsArray(), this.colourNode.getRGBAString());
        };
        return Polygon;
    })(Plexx.SceneGraphLeaf);
    Plexx.Polygon = Polygon;
})(Plexx || (Plexx = {}));
