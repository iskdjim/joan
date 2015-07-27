/// <reference path="../general/renderContext.ts" />
/// <reference path="../nodes/canvasnode.ts" />
/// <reference path="../nodes/sceneGraphComponent.ts" />
/// <reference path="../nodes/sceneGraphComposite.ts" />
/// <reference path="../nodes/sceneGraphLeaf.ts" />


module Plexx {

    export class DebugHelper {
    
        private debugPanelElement;
        private debugPanelElementList;
        private renderInfo;
        private debugpanelId: string;
        private renderContext: RenderContext;
        private rootNode: CanvasNode;
    
        private modalSVGExportTemplateBegin: string = "<div id=\"openModal\" class=\"modalDialog\">" +
                                                      "<div>" +
    		                                          "<a href=\"#close\" title=\"Close\" class=\"close\">X</a>"+
    		                                          "<h4>FDGL Snapshot</h4>" +
    		                                          "<pre style=\"overflow-y: scroll; height: 40em;\"><code id=\"svgcode\">";
    
        private modalSVGExportTemplateEnd: string = "</code></pre>" +
                                                    "</div>" +
                                                    "</div>";
    
        private modalSVGExportCSS: string = "<style>" +
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
                                            "</style>" 
    
        private panelSVGExportCSS: string = "<style>" +
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
                                            "</style>"
    
        constructor(debugpanelId: string, renderContext: RenderContext, rootNode: CanvasNode) {
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
    
            var fdglElement: any = document.getElementsByClassName("plexx")[0];
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
    
        public initDebugPanelLeftElement(): void {
            var optionCanvas = document.createElement("a");
            var optionSVG = document.createElement("a");
            var optionWebGL = document.createElement("a");
    
            optionCanvas.type = "submit";
            optionCanvas.innerHTML = "Canvas";
            optionCanvas.id = "rendertypeCanvas"
            optionCanvas.style.color = "white"
            optionCanvas.style.backgroundColor = "blue"
            optionCanvas.onclick = (e) => {
                this.renderContext.setRenderType(RenderType.CANVAS2D);
                this.rootNode.render(this.renderContext);
                this.updateInfo(this.renderContext, this.rootNode);
                optionCanvas.style.color = "white"
                optionCanvas.style.backgroundColor = "blue"
                optionSVG.style.color = "blue"
                optionSVG.style.backgroundColor = "white"
                if(this.renderContext.isWebGLEnabled()) {
                    optionWebGL.style.color = "blue"
                    optionWebGL.style.backgroundColor = "white"
                }
            }
    
            optionSVG.type = "submit";
            optionSVG.innerHTML = "SVG";
            optionSVG.id = "rendertypeSVG"
            optionSVG.style.color = "blue"
            optionSVG.style.backgroundColor = "white"
            optionSVG.onclick = (e) => {
                this.renderContext.setRenderType(RenderType.SVG);
                this.rootNode.render(this.renderContext);
                this.updateInfo(this.renderContext, this.rootNode);
                optionCanvas.style.color = "blue"
                optionCanvas.style.backgroundColor = "white"
                optionSVG.style.color = "white"
                optionSVG.style.backgroundColor = "blue"
                if(this.renderContext.isWebGLEnabled()) {
                    optionWebGL.style.color = "blue"
                    optionWebGL.style.backgroundColor = "white"
                }
            }
    
            optionWebGL.type = "submit";
            optionWebGL.innerHTML = "WebGL";
            optionWebGL.id = "rendertypeWebGL";
            optionWebGL.style.color = "black"
            optionWebGL.style.backgroundColor = "grey"
            if(this.renderContext.isWebGLEnabled()) {
                optionWebGL.style.color = "blue"
                optionWebGL.style.backgroundColor = "white"
                optionWebGL.onclick = (e) => {
                    this.renderContext.setRenderType(RenderType.WEBGL);
                    this.rootNode.render(this.renderContext);
                    optionCanvas.style.color = "blue"
                    optionCanvas.style.backgroundColor = "white"
                    optionSVG.style.color = "blue"
                    optionSVG.style.backgroundColor = "white"
                    optionWebGL.style.color = "white"
                    optionWebGL.style.backgroundColor = "blue"
                }
            }
    
            if(!this.renderContext.isWebGLEnabled()) {
//                optionWebGL.disabled = true;
    
            }
    
            var leftOptionsUl = document.createElement("ul");
            var optionCanvasLi = document.createElement("li");
            var optionSVGLi = document.createElement("li");
            var optionWebGLLi = document.createElement("li");
            var optionsLi = document.createElement("li");
            optionSVGLi.setAttribute("class","opt");
            optionWebGLLi.setAttribute("class","opt");
            optionCanvasLi.setAttribute("class","opt");
            optionsLi.id = "left"
            optionCanvasLi.appendChild(optionCanvas);
            optionSVGLi.appendChild(optionSVG);
            optionWebGLLi.appendChild(optionWebGL);
            leftOptionsUl.appendChild(optionCanvasLi);
            leftOptionsUl.appendChild(optionSVGLi);
            leftOptionsUl.appendChild(optionWebGLLi);
            optionsLi.appendChild(leftOptionsUl);
            this.debugPanelElementList.appendChild(optionsLi);
        }
    
        public initDebugPanelCenterElement(): void {
            var centerOptionsUl = document.createElement("ul");
            var infoLi = document.createElement("li");
            infoLi.id = "fdgl-debugpanel-center";
    
            this.debugPanelElement.appendChild(this.renderInfo);
            this.debugPanelElementList.appendChild(infoLi);
            infoLi.appendChild(this.renderInfo);
    
            var optionLines = document.createElement("a");
    
            optionLines.type = "submit";
            optionLines.innerHTML = "Lines";
            optionLines.style.color = "white"
            optionLines.style.backgroundColor = "grey"
            optionLines.onclick = (e) => {
                if (!this.rootNode.areLinesVisible) {
                    this.rootNode.areLinesVisible = true;
                    optionLines.style.color = "white"
                    optionLines.style.backgroundColor = "green"
                }
                else {
                    this.rootNode.areLinesVisible = false;
                    optionLines.style.color = "white"
                    optionLines.style.backgroundColor = "grey"
                }
                this.renderContext.setRenderType(this.renderContext.getRenderType());
                this.rootNode.render(this.renderContext);
                this.updateInfo(this.renderContext, this.rootNode);
            }
    
            var optionOrigin = document.createElement("a");
    
            optionOrigin.type = "submit";
            optionOrigin.innerHTML = "Origin";
            optionOrigin.style.color = "white"
            optionOrigin.style.backgroundColor = "grey"
            optionOrigin.onclick = (e) => {
                if (!this.rootNode.isOriginVisible) {
                    this.rootNode.isOriginVisible = true;
                    optionOrigin.style.color = "white"
                    optionOrigin.style.backgroundColor = "green"
                }
                else {
                    this.rootNode.isOriginVisible = false;
                    optionOrigin.style.color = "white"
                    optionOrigin.style.backgroundColor = "grey"
                }
                this.renderContext.setRenderType(this.renderContext.getRenderType());
                this.rootNode.render(this.renderContext);
            }
            var optionOriginLi = document.createElement("li");
            var optionLinesLi = document.createElement("li");
            var optionsLi = document.createElement("li");
            optionOriginLi.setAttribute("class","opt");
            optionLinesLi.setAttribute("class","opt");
            optionsLi.id = "left"
            optionOriginLi.appendChild(optionOrigin);
            optionLinesLi.appendChild(optionLines);
            centerOptionsUl.appendChild(infoLi);
            centerOptionsUl.appendChild(optionOriginLi);
            centerOptionsUl.appendChild(optionLinesLi);
            optionsLi.appendChild(centerOptionsUl);
            this.debugPanelElementList.appendChild(optionsLi);
        }
    
        public initDebugPanelRightElement(): void {
            var otherOptions = document.createElement("div");
            var exportSVG = document.createElement("a");
            exportSVG.type = "submit";
            exportSVG.innerHTML = "export SVG";
            exportSVG.onclick = (e) => {
                 var pom = document.createElement('a');
                 var s = new XMLSerializer();
                 var d = this.renderContext.getSVG();
                 var str = this.rootNode.toSVGString(this.renderContext);
                 str = str.replace(/>/g,"&gt;");
                 str = str.replace(/</g,"&lt;");
                 document.getElementById("svgcode").innerHTML = "";
                 document.getElementById("svgcode").insertAdjacentHTML("beforeend", str);
                 location.href = "#" + "openModal";
            }
    
            var debugPanelRightElement = document.createElement("li");
            debugPanelRightElement.id = "fdgl-debugpanel-right";
            this.debugPanelElementList.appendChild(debugPanelRightElement);
            debugPanelRightElement.appendChild(exportSVG);
            this.debugPanelElement.appendChild(this.debugPanelElementList);
        }
    
    
        updateInfo(renderContext: RenderContext, rootNode:CanvasNode) {
            this.renderInfo.innerHTML = rootNode.getWidth() + "x" + rootNode.getHeight();
        }
    }
}
