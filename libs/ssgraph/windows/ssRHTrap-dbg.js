sap.ui.define([], function(){

  var ssRHTrap = function(){};
	ssRHTrap.prototype.setData  = function(data) {
		this.data = data;
	};
	ssRHTrap.prototype.setData  = function() {
		return this.data;
	};
    ssRHTrap.prototype.setCanvas = function(canvas){
    	this.canvas = canvas;
    };
    ssRHTrap.prototype.getCanvas = function(){
    	return this.canvas;
    };

// add methods to its prototype
    ssRHTrap.prototype.drawSash = function() {
		// Changes the default style for vertices "in-place"
		// to use the custom shape.
		var style = graph.getStylesheet().getDefaultVertexStyle();
		style[mxConstants.STYLE_SHAPE] = 'box';

		var t = 5;
		if (options != undefined && options.thickness != undefined) {
			if (options.thickness != null && options.thickness > 1) {
				t = options.thickness;
			}
		}
		// Adds a gradient and shadow to improve the user experience
		style[mxConstants.STYLE_GRADIENTCOLOR] = '#FFFFFF';
		style[mxConstants.STYLE_SHADOW] = false;

		// Gets the default parent for inserting new cells. This
		// is normally the first child of the root (ie. layer 0).
		if (parent === undefined) {
			parent = graph.getDefaultParent();
		};
		var sFrameColor = ";fillColor=white";
		if (options != undefined && options.sashes != undefined) {
			if (options.sashes.frameColor != undefined) {
				sFrameColor = options.sashes.frameColor.color;
			}
		}
		var sFrameStyle = ";" + sFrameColor + ";strokeColor=black";

		var sPaneColor = ";fillColor=white";
		if (options != undefined && options.sashes != undefined) {
			if (options.sashes.vinylTint != undefined) {
				sPaneColor = options.sashes.vinylTint.color;
			}
		}

		var sPaneStyle = ";" + sPaneColor;

		// Adds cells to the model in a single step
		graph.getModel().beginUpdate();
		try {
			var v1 = graph.insertVertex(parent, null, null, x, y, w, h, sFrameStyle);
			var v2 = graph.insertVertex(v1, null, null, t, t, w - (t * 2), h - (t * 2), sPaneStyle);
		} finally {
			// Updates the display
			graph.getModel().endUpdate();
		}

	};

	ssRHTrap.prototype.drawFrame  = function() {
		var t = 10;
		if (options != undefined && options.thickness != undefined) {
			if (options.thickness != null && options.thickness > 1) {
				t = options.thickness;
			}
		}
		var x = 0;
		var y = 0;
		var data = this.getData();
		var cb = data["CUTBACK"];
		if(cb == undefined){
			cb = 0.75;
		}  
		var bw = data["BASE.WIDTH"];
		if(bw == undefined){
			bw = 1;
		}  
		var lh = data["LONG.HEIGHT"].newValue;
		if(lh == undefined){
			lh = 1;
		}  
		var sh = data["SHORT.HEIGHT"].newValue;
		if(sh == undefined){
			sh = 1;
		}  
		var polygon = draw.polygon([[bw,lh], [bw,0],[ 0,0],[0,sh]]).fill('#000').stroke({ width: 1 });
//		if (options != undefined && options.frame != undefined) {
//			if (options.sashes.frameColor != undefined) {
//				sFrameColor = options.frame.frameColor.color;
//			}
//		}

	};
	ssRHTrap.prototype.draw  = function(container, graph, x, y, w, h, options) {
		// Gets the default parent for inserting new cells. This
		// is normally the first child of the root (ie. layer 0).
		var parent = graph.getDefaultParent();
//		if (options != undefined && options.parent != undefined) {
//			parent = options.parent;
//		};

		this.drawFrame();
//		this.drawSash(container, graph, 0, hs * 2, ws, hs, options, v2);

	};
	return ssRHTrap;
});