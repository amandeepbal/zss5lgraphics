sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase"

], function(ssMath, core, ssBase) {
	return function(client, data, myParent, x, y) {
		this.data = data;
		this.client = client;
		this.x = x;
		this.y = y;
		this.ssparent = myParent;
		this.container = undefined;
		this.building = {
			container: undefined,
			svg: undefined,
			x: 0,
			y: 0
		};
		this.kneewall = undefined;
		this.transom = undefined;

		this.isReady = false;
		this.w = 0;
		this.h = 0;
		this.walls = [];

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
			var d = 0;
			var color = "WH";
			var data = this.getData();
			this.isReady = true;

			var walls = core.getModels(this.getData(), 'wlWall');
			for (var i = 0; i < walls.length; i++) {
				var awall = walls[i];
				if (awall.model != undefined) {
					if (Number(awall.model['WIDTH'].value) > d) {
						d = Number(awall.model['WIDTH'].value);
					}
				}
			}

			// Draw building
			this.container = this.getParent().nested();
			w = Number(5);

			w = this.client.convert(w);
			d = this.client.convert(d);

			this.w = w;
			this.d = d;
			var pattern = this.container.pattern(20, 20, function(add) {
				add.rect(20, 20).fill(ssBase.color["SG"].htmlcolor);
				add.rect(10, 10);
				add.rect(10, 10).move(10, 10);
			});
			this.svg = this.container.rect(d, w);
			//			this.svg.attr({fill: ssBase.color[color].htmlcolor,"stroke": "#000", "stroke-width": 1});
			this.svg.attr({
				fill: pattern
			});
			this.svg.move(0, 0);
			var x = 0;
			var y = w;
			for (var i = 0; i < walls.length; i++) {
				var awall = walls[i];
				this.renderWall(awall, x, y);
			}
			this.isReady = true;
			return this;

		};
		this.renderWall = function(wall, x, y) {
			var w = 0;
			var d = 2;
			var w1 = 0;
			var d1 = 0;
			var x1 = 0;
			var x2 = 0;
			var y1 = 0;
			var y2 = 0;

			var thiswall = {
				svg: undefined,
				container: undefined
			};
			thiswall.container = this.container;
			if (wall.model["WIDTH"] != undefined) {
				w = Number(wall.model["WIDTH"].value);
				if (w === undefined) {
					w = 1;
				}
			}
			w = this.client.convert(w);
			d = this.client.convert(d);
			thiswall.facing = wall.Data.Facing;

			var lastwall;
			var inters;
			if (this.walls.length > 0) {
				lastwall = this.walls[this.walls.length - 1];
			} else {
				lastwall = {
					x1: 0,
					y1: 0,
					x2: x,
					y2: y,
					facing: ""
				};
			}
			inters = lastwall.facing + thiswall.facing;

			switch (inters) {
				case "W":
					w1 = w;
					d1 = d;
					x1 = lastwall.x2;
					y1 = lastwall.y2;
					x2 = x1 + d1;
					y2 = y1 + w1;
					break;
				case "WS":
					w1 = d;
					d1 = w;
					x1 = lastwall.x2;
					y1 = lastwall.y2;
					x2 = x1 + d1;
					y2 = y1 - w1;
					break;
				case "SE":
					w1 = w;
					d1 = d;
					x1 = lastwall.x2;
					y1 = lastwall.y1;
					x2 = x1 + d1;
					y2 = y1 - w1;
					break;
			}

			thiswall.w = w1;
			thiswall.d = d1;
			thiswall.x1 = x1;
			thiswall.y1 = y1;
			thiswall.x2 = x2;
			thiswall.y2 = y2;

			thiswall.svg = thiswall.container.polygon([thiswall.x1, thiswall.y1,
				thiswall.x1, thiswall.y2,
				thiswall.x2, thiswall.y2,
				thiswall.x2, thiswall.y1
			]);
			thiswall.svg.attr({
				fill: ssBase.color["WH"].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			this.walls.push(thiswall);

		};
		this.renderMods = function() {
			var w;
			var lh;
			var rh;
			var tw = 0;
			var color = this.color;
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
			if (data.model["EXTERIOR.COLOR"] != undefined) {
				color = data.model['EXTERIOR.COLOR'].value;
			};
			if (color === undefined) {
				color = "WH";
			}

			w = this.client.convert(w);
			lh = this.client.convert(lh);
			rh = this.client.convert(rh);
			tw = this.client.convert(tw);

			x = this.headerextrusion.x1;
			y = this.headerextrusion.y1;

			if (this.trap != undefined) {
				drop = w * this.trap.pitch;
			}

			if (this.starterfillerextrusion.container != undefined) {
				x = this.starterfillerextrusion.x2;
				y = this.starterfillerextrusion.y3;
			} else {
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
			this.

			this.headerextrusion.svg.front();
			var lstmods = data.model['WALLMODS'].valueList;
			if (lstmods === undefined) {
				return;
			}

			lstmods.sort(function(a, b) {
				return (Number(a.Position) > Number(b.Position)) ? 1 : ((Number(b.Position) > Number(a.Position)) ? -1 : 0);
			});
			var x = this.openings.x1;
			var y = this.openings.y1;
			for (var i = 0; i < lstmods.length; i++) {
				var amod = lstmods[i];
				var w = amod.Width;
				var mod = this.getClient().draw(data, x, y, this.openings.container);
				this.mods.push(mod);
				x = x + w;
				var drop = 0;
				if (this.trap != undefined) {
					drop = w * this.trap.pitch;
				}
				y = y + w;
			};
		};
		this.renderStarterChannel = function() {
			var h = this.openings.lh;
			var lh;
			var rh;
			var w;
			var x;
			var y;
			var tw = 0;
			var drop = 0;
			var color = "WH";
			w = 0.50;
			w = this.client.convert(w);

			lh = h;
			rh = h;
			if (this.trap != undefined) {
				lh = h;
				drop = w * this.trap.pitch;
				rh = lh - drop;
			}

			x = this.openings.x1;
			y = this.openings.y1;

			color = this.color;
			this.starterchannel.container = this.container;
			this.starterchannel.w = w;
			this.starterchannel.lh = lh;
			this.starterchannel.rh = rh;
			this.starterchannel.drop = drop;
			this.starterchannel.x1 = x;
			this.starterchannel.y1 = y;
			this.starterchannel.x2 = this.starterchannel.x1 + w;
			this.starterchannel.y2 = this.starterchannel.y1 + this.starterchannel.lh;
			this.starterchannel.y3 = this.starterchannel.y1 + this.starterchannel.drop;

			this.starterchannel.svg = this.starterchannel.container.polygon([this.starterchannel.x1, this.starterchannel.y1,
				this.starterchannel.x1, this.starterchannel.y2,
				this.starterchannel.x2, this.starterchannel.y2,
				this.starterchannel.x2, this.starterchannel.y3
			]);

			this.starterchannel.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			this.headerextrusion.svg.front();
		};
		this.renderReceiverChannel = function() {
			var h = this.openings.rh;
			var lh;
			var rh;
			var w;
			var x;
			var y;
			var tw = 0;
			var drop = 0;
			var color = "WH";
			w = 0.50;
			w = this.client.convert(w);

			lh = h;
			rh = h;
			if (this.trap != undefined) {
				lh = h;
				drop = w * this.trap.pitch;
				rh = lh - drop;
			}

			x = this.openings.x2 - w;
			y = this.openings.y1 + this.openings.drop;

			color = this.color;
			this.receiverchannel.container = this.container;
			this.receiverchannel.w = w;
			this.receiverchannel.lh = lh;
			this.receiverchannel.rh = rh;
			this.receiverchannel.drop = drop;
			this.receiverchannel.x1 = x;
			this.receiverchannel.y1 = y;
			this.receiverchannel.x2 = this.receiverchannel.x1 + w;
			this.receiverchannel.y2 = this.receiverchannel.y1 + this.receiverchannel.lh;
			this.receiverchannel.y3 = this.receiverchannel.y1 + this.receiverchannel.drop;

			this.receiverchannel.svg = this.receiverchannel.container.polygon([this.receiverchannel.x1, this.receiverchannel.y1,
				this.receiverchannel.x1, this.receiverchannel.y2,
				this.receiverchannel.x2, this.receiverchannel.y2,
				this.receiverchannel.x2, this.receiverchannel.y3
			]);

			this.receiverchannel.svg.attr({
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
			h = this.client.convert(h);

			x = this.openings.x1;
			y = this.openings.y1 + this.openings.lh - h;
			this.kneewall = this.getClient().draw(data, x, y, this.openings.container);
			this.starterchannel.svg.front();
			this.receiverchannel.svg.front();
			this.headerextrusion.svg.front();
		};
		this.renderTransom = function(x, y) {
			var x;
			var y;
			var w;
			var lh;
			var rh;
			var hp;
			var data = this.getModel(this.getData(), "modTransom");
			if (data.model["LEFT.HEIGHT"] != undefined) {
				lh = Number(data.model["LEFT.HEIGHT"].value);
				if (lh === undefined) {
					lh = 1;
				}
			}
			if (data.model["RIGHT.HEIGHT"] != undefined) {
				rh = Number(data.model["RIGHT.HEIGHT"].value);
				if (rh === undefined) {
					rh = 1;
				}
			}
			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
				if (w === undefined) {
					w = 1;
				}
			}
			if (this.getData().model["HEADER.PUNCH"] != undefined) {
				hp = Number(this.getData().model["HEADER.PUNCH"].value);
				if (hp === undefined) {
					hp = 1;
				}
			}
			w = this.client.convert(w);
			lh = this.client.convert(lh);
			rh = this.client.convert(rh);
			hp = this.client.convert(hp);

			x = this.openings.x1;
			y = this.lh - hp - lh;
			this.transom = this.getClient().draw(data, x, y, this.openings.container);
			this.starterchannel.svg.front();
			this.receiverchannel.svg.front();
			this.headerextrusion.svg.front();

		};

	};

});