/* global SVG:true */
sap.ui.define([
	"zss5lgraphics/libs/ssgraph/common/ssCurrentStructure",
	"zss5lgraphics/libs/ssgraph/common/ssNoShape",
	"zss5lgraphics/libs/ssgraph/common/ssExtrusion",
	"zss5lgraphics/libs/ssgraph/common/ssShade",
	"zss5lgraphics/libs/ssgraph/windows/ssTrapezoid",
	"zss5lgraphics/libs/ssgraph/windows/ssChoppedTrapezoid",
	"zss5lgraphics/libs/ssgraph/windows/ssV4T",
	"zss5lgraphics/libs/ssgraph/windows/ssH",
	"zss5lgraphics/libs/ssgraph/windows/ssWinScreen",
	"zss5lgraphics/libs/ssgraph/windows/ssWinFxGlass",
	"zss5lgraphics/libs/ssgraph/windows/ssWinFxGlassColonial",
	"zss5lgraphics/libs/ssgraph/doors/ssEntryDoor",
	"zss5lgraphics/libs/ssgraph/doors/ssPatioDoor",
	"zss5lgraphics/libs/ssgraph/doors/ssFrenchDoors",
	"zss5lgraphics/libs/ssgraph/wallsystem/ssMod",
	"zss5lgraphics/libs/ssgraph/wallsystem/ssWindowArea",
	"zss5lgraphics/libs/ssgraph/wallsystem/ssDoorOpening",
	"zss5lgraphics/libs/ssgraph/wallsystem/ssOpening",
	"zss5lgraphics/libs/ssgraph/wallsystem/ssKneewall",
	"zss5lgraphics/libs/ssgraph/wallsystem/ssTransom",
	"zss5lgraphics/libs/ssgraph/wallsystem/ssTransomArea",
	"zss5lgraphics/libs/ssgraph/wallsystem/ssWall",
	"zss5lgraphics/libs/ssgraph/wallsystem/ssWallSystem",
	"zss5lgraphics/libs/ssgraph/roofsystem/ssRoofSystem",
	"zss5lgraphics/libs/ssgraph/roofsystem/ssRoof",
	"zss5lgraphics/libs/ssgraph/roofsystem/ssRoofPanel",
	"zss5lgraphics/libs/ssgraph/floorsystem/ssFloorSystem",
	"zss5lgraphics/libs/ssgraph/floorsystem/ssFloor",
	"zss5lgraphics/libs/ssgraph/floorsystem/ssFloorPanel",
	"zss5lgraphics/libs/ssgraph/decksystem/ssDeck",
	"zss5lgraphics/libs/ssgraph/decksystem/ssDeckPlank",
	"zss5lgraphics/libs/ssgraph/decksystem/ssDeckSub",
	"zss5lgraphics/libs/ssgraph/decksystem/ssDeckJoist",
	"zss5lgraphics/libs/ssgraph/decksystem/ssDeckStairSet",
	"zss5lgraphics/libs/ssgraph/decksystem/ssDeckStringer",
	"zss5lgraphics/libs/ssgraph/decksystem/ssDeckTread",
	"zss5lgraphics/libs/ssgraph/decksystem/ssDeckMidSupport",
	"zss5lgraphics/libs/ssgraph/railingsystem/ssSpan",
	"zss5lgraphics/libs/ssgraph/railingsystem/ssCornerPost",
	"zss5lgraphics/libs/ssgraph/railingsystem/ssSection",
	"zss5lgraphics/libs/svgjs/svg"
], function(ssBuilding,ssNoShape,ssExtrusion,ssShade,
            ssTrapezoid, ssChoppedTrapezoid, 
            ssV4T, ssH, ssWinScreen,
            ssWinFxGlass, ssWinFxGlassColonial,
            ssEntryDoor,ssPatioDoor,ssFrenchDoors,
            ssMod, ssWindowArea,ssDoorOpening,ssOpening,
            ssKneewall,ssTransom, ssTransomArea,
            ssWall,ssWallSystem, 
            ssRoofSystem, ssRoof,ssRoofPanel,
            ssFloorSystem, ssFloor,ssFloorPanel,
            ssDeck,ssDeckPlank,
            ssDeckSub,ssDeckJoist,
            ssDeckStairSet,ssDeckStringer,ssDeckTread,ssDeckMidSupport,
            ssSpan,ssCornerPost,ssSection) {
	return function(id,data) {
		this.ssCanvas = undefined;
		this.data = undefined;
		this.scale = 5;
		this.modelInstance = undefined;
		this.hliteThis = undefined;
		this.hliteThisNow = false;
		this.showParent = false;
		this.hlite = {color: "#0000FF",width:"8"};
		this.noHlite = false;
		this.dim =  {color: "#000",width:"1"};
		if(id !=undefined && id != ''){
			if (this.ssCanvas === undefined) {
				this.ssCanvas = SVG(id).size("2000px", "2000px");
//				this.ssCanvas = SVG(id);
			}
		}
		if(data !=undefined){
			this.data = data;
		}	

		this.setCanvas = function(id,w,h) {
			if (this.ssCanvas === undefined) {
				if(w != undefined && h !=undefined){
				  this.ssCanvas = SVG(id).size(w, h);	
				}
				else{
				  this.ssCanvas = SVG(id).size("2000px", "2000px");
//				  this.ssCanvas = SVG(id);
				} 
			}
		};
		this.getCanvas = function() {
			return this.ssCanvas;
		};
		this.setData = function(data) {
		    this.data = data;
		};
		this.getData = function() {
			return this.data;
		};
		this.setNoHlite = function(tf) {
			this.noHlite = tf;
		};

		this.convert = function(anum) {
//			anum = anum * 5;
			anum = anum * this.getScale();
			
			return anum;
		};
		this.setScale = function(scale) {
			this.scale = scale;
			return;
			this.scale = 1 + ((scale-5) /10);
//			this.getCanvas().scale(this.getScale());
//			this.parent.transform("Scale").this.getScale();
		};
		this.getScale = function() {
			return this.scale;
		};
		this.clearCanvas = function() {
			if (this.ssCanvas != undefined) {
				this.ssCanvas.clear();
			}
		};

		this.draw = function(data, x, y,acanvas) {
			var canvas = this.getCanvas();
			if(data === undefined){return;}
			if(data.model === undefined){return;}
			if(data.model.Content === undefined){return;}
			if(data.model.Content.general.shape === undefined){return;}
			
			if(acanvas != undefined){
				canvas = acanvas;
			}
			switch (data.model.Content.general.shape) {
				case "BUILDING":
					return new ssBuilding(this,data, canvas, x, y).render();;
					break;
				case "EXTRUSION":
					return new ssExtrusion(this,data, canvas, x, y).render();;
					break;
				case "TRAPEZOID":
					return new ssTrapezoid(this,data, canvas, x, y).render();
					break;
				case "CHOPPEDTRAPEZOID":
					return new ssChoppedTrapezoid(this,data, canvas, x, y).render();
					break;	
				case "SUNSHADE":
					return new ssShade(this,data, canvas, x, y).render();
					break;
				case "V4T":
					return new ssV4T(this,data, canvas, x, y).render();
					break;
				case "HORIZONTAL":
					return new ssH(this,data, canvas, x, y).render();
					break;
				case "WINSCREEN":
					return new ssWinScreen(this,data, canvas, x, y).render();
					break;
				case "WINFXGLASS":
					return new ssWinFxGlass(this,data, canvas, x, y).render();
					break;
				case "WINFXGLASSCOLONIAL":
					return new ssWinFxGlassColonial(this,data, canvas, x, y).render();
					break;
				case "ENTRYDOOR":
					return new ssEntryDoor(this, data,canvas, x, y).render();
					break;
				case "FRENCHDOORS":
					return new ssFrenchDoors(this, data,canvas, x, y).render();
					break;
				case "PATIODOOR":
					return new ssPatioDoor(this,data, canvas, x, y).render();
					break;
				case "KNEEWALL":
					return new ssKneewall(this,data, canvas, x, y).render();
					break;
				case "TRANSOM":
					return new ssTransom(this,data, canvas, x, y).render();
					break;
				case "TRANSOMAREA":
					return new ssTransomArea(this,data, canvas, x, y).render();
					break;
				case "WALLMOD":
					return new ssMod(this,data, canvas, x, y).render();
					break;
				case "WINDOWAREA":
					return new ssWindowArea(this,data, canvas, x, y).render();
					break;
				case "DOOROPENING":
					return new ssDoorOpening(this,data, canvas, x, y).render();
					break;
				case "MODOPENING":
					return new ssOpening(this,data, canvas, x, y).render();
					break;
				case "WALL":
					return new ssWall(this,data, canvas, x, y).render();
					break;
				case "WALLSYSTEM":
					return new ssWallSystem(this,data, canvas, x, y).render();
					break;
				case "ROOFSYSTEM":
					return new ssRoofSystem(this,data, canvas, x, y).render();
					break;
				case "ROOF":
					return new ssRoof(this,data, canvas, x, y).render();
					break;
				case "ROOFPANEL":
					return new ssRoofPanel(this,data, canvas, x, y).render();
					break;
				case "FLOORSYSTEM":
					return new ssFloorSystem(this,data, canvas, x, y).render();
					break;
				case "FLOOR":
					return new ssFloor(this,data, canvas, x, y).render();
					break;
				case "FLOORPANEL":
					return new ssFloorPanel(this,data, canvas, x, y).render();
					break;
				case "DECK":
					return new ssDeck(this,data, canvas, x, y).render();
					break;
				case "DECKPLANK":
					return new ssDeckPlank(this,data, canvas, x, y).render();
					break;
				case "DECKSUB":
					return new ssDeckSub(this,data, canvas, x, y).render();
					break;
				case "DECKJOIST":
					return new ssDeckJoist(this,data, canvas, x, y).render();
					break;
				case "DECKSTAIRS":
					return new ssDeckStairSet(this,data, canvas, x, y).render();
					break;
				case "DECKSTRINGER":
					return new ssDeckStringer(this,data, canvas, x, y).render();
					break;
				case "DECKTREAD":
					return new ssDeckTread(this,data, canvas, x, y).render();
					break;
				case "DECKMIDSUPPORT":
					return new ssDeckMidSupport(this,data, canvas, x, y).render();
					break;
				case "RAILINGSPAN":
					return new ssSpan(this,data, canvas, x, y).render();
					break;
				case "RAILINGPOST":
					return new ssCornerPost(this,data, canvas, x, y).render();
					break;
				case "RAILINGSECTION":
					return new ssSection(this,data, canvas, x, y).render();
					break;
				default:
					return new ssNoShape(this,data, canvas, x, y).render();
					break;
			}
		};
		this.hliteObject = function(me){
			if(this.noHlite){return;}
	       if(this.modelInstance != me.instanceId){return;}
	       if(this.parentInstance === undefined){return;}
	       if(this.modelInstance === this.parentInstance){return;}
			var svg = this.getCanvas().polygon([me.x1, me.y1,
				me.x1, me.y2,
				me.x2, me.y2,
				me.x2, me.y1
			]);
			svg.attr({
				fill: "#FFFFFF",
				"fill-opacity": 0,
				"stroke": "#000",
				"stroke-width": 1
			});
			svg.stroke(this.hlite);
			svg.front();
		};

	};
});