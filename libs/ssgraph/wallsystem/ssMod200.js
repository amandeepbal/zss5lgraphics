sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lgraphics/libs/ssgraph/common/ssBase",
	"zss5lgraphics/libs/ssgraph/common/ssStarter",
	"zss5lgraphics/libs/ssgraph/common/ssFiller",
	"zss5lgraphics/libs/ssgraph/common/ssPane",
	"zss5lgraphics/libs/ssgraph/common/ssScreen",
	"zss5lgraphics/libs/ssgraph/common/ssDoorHardware"
], function(ssMath, ssBase, ssStarter, ssFiller, ssPane, ssScreen, ssDoorHardware) {
	return function(client, data, myParent, x, y) {
		this.data = data;
		this.client = client;
		this.x = x;
		this.y = y;
		this.ssparent = myParent;
		this.container = undefined;
		this.headerextrusion = {
			container: undefined,
			svg: undefined,
			x: 0,
			y: 0
		};
		this.floorextrusion = {
			container: undefined,
			svg: undefined,
			x: 0,
			y: 0
		};
		this.starterextrusion = {
			container: undefined,
			svg: undefined,
			x: 0,
			y: 0
		};
		this.starterfillerextrusion = {
			container: undefined,
			svg: undefined,
			x: 0,
			y: 0
		};
		this.openings = {
			container: undefined,
			svg: undefined,
			x: x,
			y: y
		};

		this.receiverextrusion = {
			container: undefined,
			svg: undefined,
			x: 0,
			y: 0
		};
		this.receiverfillerextrusion = {
			container: undefined,
			svg: undefined,
			x: 0,
			y: 0
		};
		this.mod = undefined;
		this.isReady = false;
		this.w = 0;
		this.h = 0;

		if (this.x === undefined) {
			this.x = 0;
		}
		if (this.y === undefined) {
			this.y = 0;
		};

		this.setData = function(data) {
			this.data = data;
		};
		this.getData = function() {
			return this.data;
		};
		this.setParent = function(parent) {
			this.ssparent = parent;
		};
		this.getParent = function() {
			return this.ssparent;
		};
		this.getClient = function() {
			return this.client;
		};

		this.calculate = function() {
			var data = this.getData();
		};

		this.render = function() {
			var w = 0;
			var lh = 0;
			var rh = 0;
			var tw = 0;
			var px = this.x;
			var py = this.y;
			var color = "WH";
			this.container = this.getParent().nested();
			var data = this.getData();
			this.isReady = true;

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
				if (w == undefined) {
					w = 1;
				}
			}
			if (data.model["LEFT.HEIGHT"] != undefined) {
				lh = Number(data.model["LEFT.HEIGHT"].value);
				if (lh == undefined) {
					lh = 1;
				}
			}
			if (data.model["RIGHT.HEIGHT"] != undefined) {
				rh = Number(data.model["RIGHT.HEIGHT"].value);
				if (rh == undefined) {
					rh = 1;
				}
			}
			if (data.model["TRACK.WIDTH"] != undefined) {
				tw = Number(data.model["TRACK.WIDTH"].value);
				if (tw == undefined) {
					tw = 1;
				}
			}

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			tw = ssBase.convert(tw);
			lh = ssBase.convert(lh);
			rh = ssBase.convert(rh);
			w = ssBase.convert(w);
			this.w = w;
			this.rh = rh;
			this.lh = lh;
			this.tw = tw;
			this.color = color;

			if (w <= 0) return;
			if (lh <= 0) return;
			if (rh <= 0) return;

			// if left and right heights are different, then its a trapzoid and we need to get angles for our cuts
			this.trap = undefined;
			if (lh != rh) {
				this.trap = ssMath.calcTrap(lh, rh, w);
			}

			var hd = lh - rh;
			this.isLeft = true;
			this.isRight = false;
			if (hd < 0) {
				this.isLeft = false;
				this.isRight = true;
			}

			// Start with header track

			this.headerextrusion.container = this.container;
			this.headerextrusion.w = w;
			if (this.isLeft) {
				this.headerextrusion.x1 = px;
				this.headerextrusion.y1 = py;
				this.headerextrusion.x2 = px + w;
				this.headerextrusion.y2 = py + (lh - rh);
			} else {
				this.headerextrusion.x1 = px;
				this.headerextrusion.y1 = py + (lh - rh);
				this.headerextrusion.x2 = px + w;
				this.headerextrusion.y2 = py;
			}
			this.headerextrusion.svg = this.headerextrusion.container.polygon([this.headerextrusion.x1, this.headerextrusion.y1,
				this.headerextrusion.x1 + this.headerextrusion.w, this.headerextrusion.y2,
				this.headerextrusion.x1 + this.headerextrusion.w, this.headerextrusion.y2 + tw,
				this.headerextrusion.x1, this.headerextrusion.y1 + tw,
				this.headerextrusion.x1, this.headerextrusion.y1
			]);

			this.headerextrusion.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});

			// add in upright starter
			this.renderStarter();
			// add in filler
			this.renderStarterFiller();

			// add in mod openings
			this.renderOpenings();

			// add in receiver filler
			this.renderReceiverFiller();
			
			// add in upright receiver
			this.renderReceiver();

			this.isReady = true;

			return this;

		};
		this.renderStarter = function() {
			var h;
			var lh;
			var rh;
			var w;
			var x;
			var y;
			var tw = 0;
			var drop = 0;
			var color= "WH";

			if (this.getData().model["INCLUDE.STARTERS.RECEIVERS"] === undefined) {
				return;
			}
			if (!this.getData().model["INCLUDE.STARTERS.RECEIVERS"].value) {
				return;
			}

			var data = this.getModel(this.getData(), "modWallStarter");
			if (data === undefined) return;

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
				if (w === undefined) {
					w = 1;
				}
			}
			if (data.model["HEIGHT"] != undefined) {
				h = Number(data.model["HEIGHT"].value);
				if (h === undefined) {
					h = 1;
				}
			}
			w = ssBase.convert(w);
			h = ssBase.convert(h);

			// Calculate the short side of this extrusion being cut
			lh = h;
			rh = h;
			if (this.trap != undefined) {
				lh = h;
				drop = w * this.trap.pitch;
				rh = lh - drop;
			}

			x = this.headerextrusion.x1;
			y = this.headerextrusion.y1;
			var color = this.color;
			this.starterextrusion.container = this.container;
			this.starterextrusion.w = w;
			this.starterextrusion.lh = lh;
			this.starterextrusion.rh = rh;
			this.starterextrusion.drop = drop;
			this.starterextrusion.x1 = x;
			this.starterextrusion.y1 = y;
			this.starterextrusion.x2 = this.starterextrusion.x1 + w;
			this.starterextrusion.y2 = this.starterextrusion.y1 + this.starterextrusion.lh;
			this.starterextrusion.y3 = this.starterextrusion.y1 + this.starterextrusion.drop;

			this.starterextrusion.svg = this.starterextrusion.container.polygon([this.starterextrusion.x1, this.starterextrusion.y1,
				this.starterextrusion.x1, this.starterextrusion.y2,
				this.starterextrusion.x2, this.starterextrusion.y2,
				this.starterextrusion.x2, this.starterextrusion.y3
			]);

			this.starterextrusion.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			this.headerextrusion.svg.front();
		};
		this.renderStarterFiller = function() {
			var x;
			var y;
			var y3 = 0;
			var w;
			var h;
			var lh;
			var rh;
			var drop = 0;
			if (this.getData().model["INCLUDE.FILLERS"] === undefined) {
				return;
			}
			if (!this.getData().model["INCLUDE.FILLERS"].value) {
				return;
			}

			var data = this.getModel(this.getData(), "modStarterFiller");
			if (data === undefined) return;

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
				if (w == undefined) {
					w = 1;
				}
			}
			if (data.model["HEIGHT"] != undefined) {
				h = Number(data.model["HEIGHT"].value);
				if (h == undefined) {
					h = 1;
				}
			}
			w = ssBase.convert(w);
			h = ssBase.convert(h);

			// Calculate the short side of this extrusion being cut
			lh = h;
			rh = h;
			if (this.trap != undefined) {
				lh = h;
				drop = w * this.trap.pitch;
				rh = lh - drop;
			}

			x = this.headerextrusion.x1;
			y = this.headerextrusion.y1;

			if (this.starterextrusion.container != undefined) {
				x = this.starterextrusion.x2;
				y = this.starterextrusion.y3;
			}

			var tw = 0;
			var color = this.color;


			this.starterfillerextrusion.container = this.container;
			this.starterfillerextrusion.w = w;
			this.starterfillerextrusion.drop = drop;
			this.starterfillerextrusion.lh = lh;
			this.starterfillerextrusion.rh = rh;
			this.starterfillerextrusion.x1 = x;
			this.starterfillerextrusion.y1 = y;
			this.starterfillerextrusion.x2 = this.starterfillerextrusion.x1 + w;
			this.starterfillerextrusion.y2 = this.starterfillerextrusion.y1 + lh;
			this.starterfillerextrusion.y3 = this.starterfillerextrusion.y1 + this.starterfillerextrusion.drop;

			this.starterfillerextrusion.svg = this.starterfillerextrusion.container.polygon([
				this.starterfillerextrusion.x1, this.starterfillerextrusion.y1,
				this.starterfillerextrusion.x1, this.starterfillerextrusion.y2,
				this.starterfillerextrusion.x2, this.starterfillerextrusion.y2,
				this.starterfillerextrusion.x2, this.starterfillerextrusion.y3
			]);

			this.starterfillerextrusion.svg.attr({
				fill: ssBase.frameColor[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			this.headerextrusion.svg.front();

		};
		this.getModel = function(data, code) {
			if (data.inodes.length <= 0) {
				return undefined;
			}
			var isThere = false;
			for (var i = 0; i < data.inodes.length; i++) {
				var anode = data.inodes[i];
				if (anode.Code === code) {
					isThere = true;
					return anode;
				}
				//				return this.getModel(anode, code);
			}
			if (!isThere) return undefined;
		};
		this.renderOpenings = function() {
			var w;
			var lh;
			var rh;
			var tw = 0;
			var color = "WH";
			var drop = 0;

			if (data.model["INNER.WIDTH"] != undefined) {
				w = Number(data.model["INNER.WIDTH"].value);
				if (w == undefined) {
					w = 1;
				}
			}
			if (data.model["INNER.LEFT.HEIGHT"] != undefined) {
				lh = Number(data.model["INNER.LEFT.HEIGHT"].value);
				if (lh == undefined) {
					lh = 1;
				}
			}
			if (data.model["INNER.RIGHT.HEIGHT"] != undefined) {
				rh = Number(data.model["INNER.RIGHT.HEIGHT"].value);
				if (rh == undefined) {
					rh = 1;
				}
			}
			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			w = ssBase.convert(w);
			lh = ssBase.convert(lh);
			rh = ssBase.convert(rh);
			tw = ssBase.convert(tw);

			x = this.headerextrusion.x1;
			y = this.headerextrusion.y1;
			
			if (this.trap != undefined) {
				drop = w * this.trap.pitch;
			}

			
			if(this.starterfillerextrusion.container !=undefined){
				x = this.starterfillerextrusion.x2;
				y = this.starterfillerextrusion.y3;
			}
			else{
				if (this.starterextrusion.container != undefined) {
				  x = this.starterextrusion.x2;
				  y = this.starterextrusion.y3;
			    }
			}    

			this.openings.container = this.container.nested();
			this.openings.w = w;
			this.openings.drop = drop;
			this.openings.lh = lh;
			this.openings.rh = rh;
			this.openings.x1 = x;
			this.openings.y1 = y;
			this.openings.x2 = this.openings.x1 + w;
			this.openings.y2 = this.openings.y1 + lh;
			this.openings.y3 = this.openings.y1 + this.openings.drop;

			this.openings.svg = this.openings.container.polygon([this.openings.x1, this.openings.y1,
				this.openings.x1, this.openings.y2,
				this.openings.x2, this.openings.y2,
				this.openings.x2, this.openings.y3
			]);
			this.openings.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			this.headerextrusion.svg.front();
			
			this.renderKneewall();
		};
		
		this.renderReceiverFiller = function() {
			var x;
			var y;
			var y3 = 0;
			var w;
			var h;
			var lh;
			var rh;
			var drop = 0;
			var color= "WH";
			if (this.getData().model["INCLUDE.FILLERS"] === undefined) {
				return;
			}
			if (!this.getData().model["INCLUDE.FILLERS"].value) {
				return;
			}

			var data = this.getModel(this.getData(), "modReceiverFiller");
			if (data === undefined) return;

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
				if (w == undefined) {
					w = 1;
				}
			}
			if (data.model["HEIGHT"] != undefined) {
				h = Number(data.model["HEIGHT"].value);
				if (h == undefined) {
					h = 1;
				}
			}
			w = ssBase.convert(w);
			h = ssBase.convert(h);

			// Calculate the short side of this extrusion being cut
			lh = h;
			rh = h;
			if (this.trap != undefined) {
				lh = h;
				drop = w * this.trap.pitch;
				rh = lh - drop;
			}

			x = this.headerextrusion.x1;
			y = this.headerextrusion.y1;

			if (this.openings.container != undefined) {
				x = this.openings.x2;
				y = this.openings.y3;
			}

			var tw = 0;


			this.receiverfillerextrusion.container = this.container;
			this.receiverfillerextrusion.w = w;
			this.receiverfillerextrusion.drop = drop;
			this.receiverfillerextrusion.lh = lh;
			this.receiverfillerextrusion.rh = rh;
			this.receiverfillerextrusion.x1 = x;
			this.receiverfillerextrusion.y1 = y;
			this.receiverfillerextrusion.x2 = this.receiverfillerextrusion.x1 + w;
			this.receiverfillerextrusion.y2 = this.receiverfillerextrusion.y1 + lh;
			this.receiverfillerextrusion.y3 = this.receiverfillerextrusion.y1 + this.receiverfillerextrusion.drop;

			this.receiverfillerextrusion.svg = this.receiverfillerextrusion.container.polygon([
				this.receiverfillerextrusion.x1, this.receiverfillerextrusion.y1,
				this.receiverfillerextrusion.x1, this.receiverfillerextrusion.y2,
				this.receiverfillerextrusion.x2, this.receiverfillerextrusion.y2,
				this.receiverfillerextrusion.x2, this.receiverfillerextrusion.y3
			]);

			this.receiverfillerextrusion.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			this.headerextrusion.svg.front();

		};
		this.renderReceiver = function() {
			var h;
			var lh;
			var rh;
			var w;
			var x;
			var y;
			var tw = 0;
			var drop = 0;
			var color = "WH";

			if (this.getData().model["INCLUDE.STARTERS.RECEIVERS"] === undefined) {
				return;
			}
			if (!this.getData().model["INCLUDE.STARTERS.RECEIVERS"].value) {
				return;
			}

			var data = this.getModel(this.getData(), "modWallReceiver");
			if (data === undefined) return;

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
				if (w === undefined) {
					w = 1;
				}
			}
			if (data.model["HEIGHT"] != undefined) {
				h = Number(data.model["HEIGHT"].value);
				if (h === undefined) {
					h = 1;
				}
			}
			w = ssBase.convert(w);
			h = ssBase.convert(h);

			// Calculate the short side of this extrusion being cut
			lh = h;
			rh = h;
			if (this.trap != undefined) {
				lh = h;
				drop = w * this.trap.pitch;
				rh = lh - drop;
			}

			x = this.headerextrusion.x1;
			y = this.headerextrusion.y1;
			if (this.receiverfillerextrusion.container != undefined) {
				x = this.receiverfillerextrusion.x2;
				y = this.receiverfillerextrusion.y3;
			}
			else{
				if (this.openings.container != undefined) {
				  x = this.openings.x2;
				  y = this.openings.y3;
			    }
			}    

			var color = this.color;
			this.receiverextrusion.container = this.container;
			this.receiverextrusion.w = w;
			this.receiverextrusion.lh = lh;
			this.receiverextrusion.rh = rh;
			this.receiverextrusion.drop = drop;
			this.receiverextrusion.x1 = x;
			this.receiverextrusion.y1 = y;
			this.receiverextrusion.x2 = this.receiverextrusion.x1 + w;
			this.receiverextrusion.y2 = this.receiverextrusion.y1 + this.receiverextrusion.lh;
			this.receiverextrusion.y3 = this.receiverextrusion.y1 + this.receiverextrusion.drop;

			this.receiverextrusion.svg = this.receiverextrusion.container.polygon([this.receiverextrusion.x1, this.receiverextrusion.y1,
				this.receiverextrusion.x1, this.receiverextrusion.y2,
				this.receiverextrusion.x2, this.receiverextrusion.y2,
				this.receiverextrusion.x2, this.receiverextrusion.y3
			]);

			this.receiverextrusion.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			this.headerextrusion.svg.front();
		};
		this.renderKneewall = function(x, y) {
			var x;
			var y;
			var w;
			var h;
			var data = this.getModel(this.getData(), "modKneewall");
			if (data.model["HEIGHT"] != undefined) {
				h = Number(data.model["HEIGHT"].value);
				if (h === undefined) {
					h = 1;
				}
			}
			h = ssBase.convert(h);

			x = this.openings.x1;
			y = this.openings.y1 + this.openings.lh - h;
			this.kneewall = this.getClient().draw(data, x, y);

		};
		
	};

});