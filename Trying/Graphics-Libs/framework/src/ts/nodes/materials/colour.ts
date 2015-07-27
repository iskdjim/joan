/// <reference path="../../general/constants.ts" />
/// <reference path="../graphNode.ts" />


module Plexx {

    export class Colour extends GraphNode {
    
        static nodeTypeName: string = "ColourNode";
    
        private colorValueR: number;
        private colorValueG: number;
        private colorValueB: number;
        private colorValueA: number;
    
        private colourLiterals = {
            "black": "#000000",
            "red": "#ff0000",
            "green": "#00ff00",
            "blue": "#0000ff",
            "yellow": "#ffff00",
            "cyan": "#00ffff",
            "pink": "#ff00ff",
            "grey": "#c0c0c0",
            "white": "#ffffff"
        }
    
        constructor(colour?: string) {
            super();
    
            var colourValues: number[];
    
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
    
        private parseColourString(colourString: string): number[] {
            var parseableColourString = colourString.toLowerCase();
            var colourValues: number[] = [];
    
            if (parseableColourString.charAt(0) != "#") {
                if (this.colourLiterals[colourString]) {
                    parseableColourString = this.colourLiterals[colourString];
                }
                else return null;
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
        }
    
        private isHexValue(element: string): boolean {
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
                if (isHex == false) return false;
            }
    
            return true;
        }
    
        public setColour(colour: string) {
            var colourValues: number[] = [];
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
        }
    
        public getRHex() {
            return this.colorValueR;
        }
    
        public getGHex() {
            return this.colorValueG;
        }
    
        public getBHex() {
            return this.colorValueB;
        }
    
        public getAHex() {
            return this.colorValueA;
        }
    
        public getR() {
            return this.colorValueR / 0xFF;
        }
    
        public getG() {
            return this.colorValueG / 0xFF;
        }
    
        public getB() {
            return this.colorValueB / 0xFF;
        }
    
        public getA() {
            return this.colorValueA / 0xFF;
        }
    
        public getRGBString(): string {
            var textstring = "#";
            var colorStringR = this.colorValueR.toString(16);
            var colorStringG = this.colorValueG.toString(16);
            var colorStringB = this.colorValueB.toString(16);
    
            if (colorStringR.length == 1) textstring += "0" + colorStringR;
            else textstring += colorStringR;
    
            if (colorStringG.length == 1) textstring += "0" + colorStringG;
            else textstring += colorStringG;
    
            if (colorStringB.length == 1) textstring += "0" + colorStringB;
            else textstring += colorStringB;
    
            return textstring;
        }
    
        public getRGBAString(): string {
            var textstring = "#";
            var colorStringR = this.colorValueR.toString(16);
            var colorStringG = this.colorValueG.toString(16);
            var colorStringB = this.colorValueB.toString(16);
            var colorStringA = this.colorValueA.toString(16);
    
            if (colorStringR.length == 1) textstring += "0" + colorStringR;
            else textstring += colorStringR;
    
            if (colorStringG.length == 1) textstring += "0" + colorStringG;
            else textstring += colorStringG;
    
            if (colorStringB.length == 1) textstring += "0" + colorStringB;
            else textstring += colorStringB;
    
            if (colorStringA.length == 1) textstring += "0" + colorStringA;
            else textstring += colorStringA;
    
            return textstring;
        }
    
        public getCss3String(): string {
            var textstring = "";
    
            textstring += "rgba(";
            textstring += this.colorValueR.toString() + ",";
            textstring += this.colorValueG.toString() + ",";
            textstring += this.colorValueB.toString() + ",";
            textstring += (this.colorValueA / 0xFF) + ")";
    
            return textstring;
        }
    }
}
