sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase",
], function(ssMath, core, ssBase) {
	return function(client, data, myParent, x, y) {
		this.data = data;
		this.client = client;
		this.x = x;
		this.y = y;
		this.ssparent = myParent;
		this.container = undefined;
		this.hlite = client.dim;

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
		this.beginpostextrusion = {
			container: undefined,
			svg: undefined,
			x: 0,
			y: 0
		};
		this.endpostextrusion = {
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
		this.starterchannel = {
			container: undefined,
			svg: undefined,
			x: 0,
			y: 0
		};
		this.receiverchannel = {
			container: undefined,
			svg: undefined,
			x: 0,
			y: 0
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
		this.headerleftextrusion = {
			container: undefined,
			svg: undefined,
			x: 0,
			y: 0
		};

		this.kneewall = undefined;
		this.transom = undefined;

		this.mods = [];
		this.tracks = [];
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
			this.container = this.getParent().nested();
			var data = this.getData();
			this.isReady = true;

			var hasGable = false;
			if (data.model["HAS.GABLE.POST"] != undefined) {
				hasGable = data.model["HAS.GABLE.POST"].value;
			}
			if (!hasGable) {
				this.renderStudio();
				return this;
			} else {
				this.renderGable();
				return this;
			}
		};
		this.renderStudio = function() {
			var w = 0;
			var lh = 0;
			var rh = 0;
			var tw = 0;
			var drop = 0;
			var rise = 0;
			var px = this.x;
			var py = this.y;
			var color = "WH";
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

			if (data.model["FRAME.COLOR"] != undefined) {
				color = data.model['FRAME.COLOR'].value;
			};

			tw = this.client.convert(tw);
			lh = this.client.convert(lh);
			rh = this.client.convert(rh);
			w = this.client.convert(w);

			this.w = w;
			this.rh = rh;
			this.lh = lh;
			this.tw = tw;
			this.color = color;

			if (w <= 0) return;
			if (lh <= 0) return;
			if (rh <= 0) return;

			this.isRight = false;
			if (rh > lh) {
				this.isRight = true;
			}

			if (this.y <= 0) {
				this.y = 50;
			}

			// if left and right heights are different, then its a trapzoid and we need to get angles for our cuts
			this.trap = undefined;
			if (lh != rh) {
				this.trap = ssMath.calcTrap(lh, rh, w);
				if (!this.isRight) {
					drop = w * this.trap.pitch;
				} else {
					rise = (w * this.trap.pitch) * -1;
					this.y = this.y + rise;
				}
			}

			this.renderHeaderTrack();
			this.renderBeginPost();
			this.renderStarter();
			this.renderStarterFiller();
			this.renderMods();
			this.renderReceiverFiller();
			this.renderReceiver();
			this.renderEndPost();
			this.renderFloorTrack();
			this.putHeaderInFront();
			this.isReady = true;

			return this;
		};
		this.renderHeaderTrack = function() {
			var tw = 0;
			var color = "WH";

			var data = core.getModel(this.getData(), "wsHeaderTrack");
			if (data === undefined) {
				return;
			}

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			this.headerextrusion.container = this.container;
			this.headerextrusion.w = this.w;
			this.headerextrusion.drop = this.drop;
			this.headerextrusion.rise = this.rise;
			if (!this.isRight) {
				this.headerextrusion.x1 = this.x;
				this.headerextrusion.y1 = this.y;
				this.headerextrusion.x2 = this.headerextrusion.x1 + this.w;
				this.headerextrusion.y2 = this.headerextrusion.y1 + (this.lh - this.rh);
			} else {
				this.headerextrusion.x1 = this.x;
				this.headerextrusion.x2 = this.headerextrusion.x1 + this.w;
				this.headerextrusion.y1 = this.y;
				this.headerextrusion.y2 = this.headerextrusion.y1 - this.headerextrusion.rise;
			}
			this.headerextrusion.svg = this.headerextrusion.container.polygon([this.headerextrusion.x1, this.headerextrusion.y1,
				this.headerextrusion.x1 + this.headerextrusion.w, this.headerextrusion.y2,
				this.headerextrusion.x1 + this.headerextrusion.w, this.headerextrusion.y2 + this.tw,
				this.headerextrusion.x1, this.headerextrusion.y1 + this.tw,
				this.headerextrusion.x1, this.headerextrusion.y1
			]);

			this.headerextrusion.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			if (this.getClient().showParent) {
				if (this.getClient().hliteThis === data) {
					this.headerextrusion.svg.stroke(this.getClient().hlite);
				}
			}
		};
		this.putHeaderInFront = function() {
			if (this.headerextrusion.svg === undefined) {
				return;
			}
			this.headerextrusion.svg.front();
		};

		this.renderBeginPost = function() {
			var h;
			var lh;
			var rh;
			var w;
			var x;
			var y;
			var tw = 0;
			var drop = 0;
			var rise = 0;
			var color = "WH";

			var data = core.getModel(this.getData(), "exBeginPost");
			if (data === undefined) {
				data = core.getModel(this.getData(), "exBeginPostGhost");
				if (data === undefined) {
					return;
				}
			}

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
				if (w === undefined) {
					w = 1;
				}
			}
			if (data.model["LENGTH"] != undefined) {
				h = Number(data.model["LENGTH"].value);
				if (h === undefined) {
					h = 1;
				}
			}
			w = this.client.convert(w);
			h = this.client.convert(h);

			// Calculate the short side of this extrusion being cut
			lh = h;
			rh = h;
			if (this.trap != undefined) {
				if (!this.isRight) {
					drop = w * this.trap.pitch;
					rh = rh - drop;
				} else {
					rise = (w * this.trap.pitch) * -1;
					lh = lh - rise;
				}
			}

			x = this.x;
			y = this.y;
			this.beginpostextrusion.container = this.container;
			this.beginpostextrusion.w = w;
			this.beginpostextrusion.lh = lh;
			this.beginpostextrusion.rh = rh;
			this.beginpostextrusion.drop = drop;
			this.beginpostextrusion.rise = rise;
			if (!this.isRight) {
				this.beginpostextrusion.x1 = x;
				this.beginpostextrusion.y1 = y;
				this.beginpostextrusion.x2 = this.beginpostextrusion.x1 + w;
				this.beginpostextrusion.y2 = this.beginpostextrusion.y1 + this.beginpostextrusion.lh;
				this.beginpostextrusion.y3 = this.beginpostextrusion.y1 + this.beginpostextrusion.drop;
			} else {
				this.beginpostextrusion.x1 = x;
				this.beginpostextrusion.y1 = y + rise;
				this.beginpostextrusion.x2 = this.beginpostextrusion.x1 + w;
				this.beginpostextrusion.y2 = this.beginpostextrusion.y1 + this.beginpostextrusion.lh;
				this.beginpostextrusion.y3 = this.beginpostextrusion.y1 + this.beginpostextrusion.rise;
			}

			this.beginpostextrusion.svg = this.beginpostextrusion.container.polygon([this.beginpostextrusion.x1, this.beginpostextrusion.y1,
				this.beginpostextrusion.x1, this.beginpostextrusion.y2,
				this.beginpostextrusion.x2, this.beginpostextrusion.y2,
				this.beginpostextrusion.x2, this.beginpostextrusion.y3
			]);

			this.beginpostextrusion.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			this.beginpostextrusion.svg.stroke(this.hlite);
			if (this.getClient().showParent) {
				if (this.getClient().hliteThis === data) {
					this.beginpostextrusion.svg.stroke(this.getClient().hlite);
				}
			}

		};
		this.putBeginPostInFront = function() {
			if (this.beginpostextrusion.svg === undefined) {
				return;
			}
			this.beginpostextrusion.svg.front();
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
			var rise = 0;
			var color = "WH";

			var data = core.getModel(this.getData(), "modWallStarter");
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
			if (data.model["LENGTH"] != undefined) {
				h = Number(data.model["LENGTH"].value);
				if (h === undefined) {
					h = 1;
				}
			}
			w = this.client.convert(w);
			h = this.client.convert(h);

			// Calculate the short side of this extrusion being cut
			lh = h;
			rh = h;
			if (this.trap != undefined) {
				if (!this.isRight) {
					drop = w * this.trap.pitch;
					rh = rh - drop;
				} else {
					rise = (w * this.trap.pitch) * -1;
					lh = lh - rise;
				}
			}

			x = this.x;
			y = this.y;
			if (this.beginpostextrusion.container != undefined) {
				x = this.beginpostextrusion.x2;
				y = this.beginpostextrusion.y3;
			}

			this.starterextrusion.container = this.container;
			this.starterextrusion.w = w;
			this.starterextrusion.lh = lh;
			this.starterextrusion.rh = rh;
			this.starterextrusion.drop = drop;
			this.starterextrusion.rise = rise;
			if (!this.isRight) {
				this.starterextrusion.x1 = x;
				this.starterextrusion.y1 = y;
				this.starterextrusion.x2 = this.starterextrusion.x1 + w;
				this.starterextrusion.y2 = this.starterextrusion.y1 + this.starterextrusion.lh;
				this.starterextrusion.y3 = this.starterextrusion.y1 + this.starterextrusion.drop;
			} else {
				this.starterextrusion.x1 = x;
				this.starterextrusion.y1 = y + rise;
				this.starterextrusion.x2 = this.starterextrusion.x1 + w;
				this.starterextrusion.y2 = this.starterextrusion.y1 + this.starterextrusion.lh;
				this.starterextrusion.y3 = this.starterextrusion.y1 + this.starterextrusion.rise;
			}

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

			this.starterextrusion.svg.stroke(this.hlite);
			if (this.getClient().showParent) {
				if (this.getClient().hliteThis === data) {
					this.starterextrusion.svg.stroke(this.getClient().hlite);
				}
			}

		};
		this.putStarterInFront = function() {
			if (this.starterextrusion.svg === undefined) {
				return;
			}
			this.starterextrusion.svg.front();
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
			var rise = 0;

			var color = "WH";
			var data = core.getModel(this.getData(), "modStarterFiller");
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
			if (data.model["LENGTH"] != undefined) {
				h = Number(data.model["LENGTH"].value);
				if (h == undefined) {
					h = 1;
				}
			}
			w = this.client.convert(w);
			h = this.client.convert(h);

			// Calculate the short side of this extrusion being cut
			lh = h;
			rh = h;
			if (this.trap != undefined) {
				if (!this.isRight) {
					drop = w * this.trap.pitch;
					rh = rh - drop;
				} else {
					rise = (w * this.trap.pitch) * -1;
					lh = lh - rise;
				}
			}

			x = this.x;
			y = this.y;

			if (this.starterextrusion.container != undefined) {
				x = this.starterextrusion.x2;
				y = this.starterextrusion.y3;
			} else {
				if (this.beginpostextrusion.container != undefined) {
					x = this.beginpostextrusion.x2;
					y = this.beginpostextrusion.y3;
				}
			}

			var tw = 0;

			this.starterfillerextrusion.container = this.container;
			this.starterfillerextrusion.w = w;
			this.starterfillerextrusion.drop = drop;
			this.starterfillerextrusion.rise = rise;
			this.starterfillerextrusion.lh = lh;
			this.starterfillerextrusion.rh = rh;

			if (!this.isRight) {
				this.starterfillerextrusion.x1 = x;
				this.starterfillerextrusion.y1 = y;
				this.starterfillerextrusion.x2 = this.starterfillerextrusion.x1 + w;
				this.starterfillerextrusion.y2 = this.starterfillerextrusion.y1 + this.starterfillerextrusion.lh;
				this.starterfillerextrusion.y3 = this.starterfillerextrusion.y1 + this.starterfillerextrusion.drop;
			} else {
				this.starterfillerextrusion.x1 = x;
				this.starterfillerextrusion.y1 = y + rise;
				this.starterfillerextrusion.x2 = this.starterfillerextrusion.x1 + w;
				this.starterfillerextrusion.y2 = this.starterfillerextrusion.y1 + this.starterfillerextrusion.lh;
				this.starterfillerextrusion.y3 = this.starterfillerextrusion.y1 + this.starterfillerextrusion.rise;
			}

			this.starterfillerextrusion.svg = this.starterfillerextrusion.container.polygon([
				this.starterfillerextrusion.x1, this.starterfillerextrusion.y1,
				this.starterfillerextrusion.x1, this.starterfillerextrusion.y2,
				this.starterfillerextrusion.x2, this.starterfillerextrusion.y2,
				this.starterfillerextrusion.x2, this.starterfillerextrusion.y3
			]);

			this.starterfillerextrusion.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			this.starterfillerextrusion.svg.stroke(this.hlite);
			if (this.getClient().showParent) {
				if (this.getClient().hliteThis === data) {
					this.starterfillerextrusion.svg.stroke(this.getClient().hlite);
				}
			}

		};
		this.putStarterFillerInFront = function() {
			if (this.starterfillerextrusion.svg === undefined) {
				return;
			}
			this.starterfillerextrusion.svg.front();
		};

		this.renderMods = function() {
			var w;
			var lh;
			var rh;
			var tw = 0;
			var color = this.color;
			var drop = 0;
			var rise = 0;

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

			x = this.x;
			y = this.y;

			if (this.trap != undefined) {
				if (!this.isRight) {
					drop = w * this.trap.pitch;
					//				rh = rh - drop;
				} else {
					rise = (w * this.trap.pitch) * -1;
					//					lh = lh - rise;
				}
			}

			if (this.starterfillerextrusion.container != undefined) {
				x = this.starterfillerextrusion.x2;
				y = this.starterfillerextrusion.y3;
			} else {
				if (this.starterextrusion.container != undefined) {
					x = this.starterextrusion.x2;
					y = this.starterextrusion.y3;
				} else {
					if (this.beginpostextrusion.container != undefined) {
						x = this.beginpostextrusion.x2;
						y = this.beginpostextrusion.y3;
					}

				}
			}

			this.openings.container = this.container.nested();
			this.openings.w = w;
			this.openings.drop = drop;
			this.openings.rise = rise;
			this.openings.lh = lh;
			this.openings.rh = rh;
			if (!this.isRight) {
				this.openings.x1 = x;
				this.openings.y1 = y;
				this.openings.x2 = this.openings.x1 + w;
				this.openings.y2 = this.openings.y1 + lh;
				this.openings.y3 = this.openings.y1 + this.openings.drop;
			} else {
				this.openings.x1 = x;
				this.openings.y1 = y;
				this.openings.x2 = this.openings.x1 + w;
				this.openings.y2 = this.openings.y1 + lh;
				this.openings.y3 = this.openings.y1 - this.openings.rise;
			}

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
			this.openings.svg.stroke(this.hlite);

			var lstmods = data.model['WALLMODS'].valueList;
			var objmods = core.getAllModels(this.getData());
			if (lstmods === undefined) {
				return;
			}
			if (objmods === undefined) {
				return;
			}

			lstmods.sort(function(a, b) {
				return (Number(a.Position) > Number(b.Position)) ? 1 : ((Number(b.Position) > Number(a.Position)) ? -1 : 0);
			});
			var x = this.openings.x1;
			var y = this.openings.y1;
			for (var i = 0; i < lstmods.length; i++) {
				for (var j = 0; j < objmods.length; j++) {
					if (objmods[j].Data === undefined) {
						continue;
					}
					if (objmods[j].Data.Id === lstmods[i].Id) {
						break;
					}
				}
				var amod = objmods[j];
				if (amod === undefined) {
					continue;
				}
				if (amod.model["WIDTH"] != undefined) {
					w = Number(amod.model["WIDTH"].value);
					if (w == undefined) {
						w = 1;
					}
				} else {
					if (amod.model["THICKNESS"] != undefined) {
						w = Number(amod.model["THICKNESS"].value);
						if (w == undefined) {
							w = 1;
						}
					}
				}
				w = this.client.convert(w);
				var mod = this.getClient().draw(amod, x, y, this.openings.container);
				this.mods.push(mod);
				try {
					x = mod.openings.x2;
					y = mod.openings.y3;
				} catch (e) {
					try {
						x = mod.x2;
						y = mod.y3;
					} catch (e) {}
				}

			}
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
			var rise = 0;
			var color = "WH";

			var data = core.getModel(this.getData(), "modReceiverFiller");
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
			if (data.model["LENGTH"] != undefined) {
				h = Number(data.model["LENGTH"].value);
				if (h == undefined) {
					h = 1;
				}
			}
			w = this.client.convert(w);
			h = this.client.convert(h);

			// Calculate the short side of this extrusion being cut
			lh = h;
			rh = h;
			if (this.trap != undefined) {
				drop = w * this.trap.pitch;
				if (!this.isRight) {
					drop = w * this.trap.pitch;
					rh = rh - drop;
				} else {
					rise = (w * this.trap.pitch) * -1;
					lh = lh - rise;
				}
			}

			x = this.x;
			y = this.y;

			if (this.openings.container != undefined) {
				x = this.openings.x2;
				y = this.openings.y3;
			}

			var tw = 0;

			this.receiverfillerextrusion.container = this.container;
			this.receiverfillerextrusion.w = w;
			this.receiverfillerextrusion.drop = drop;
			this.receiverfillerextrusion.rise = rise;
			this.receiverfillerextrusion.lh = lh;
			this.receiverfillerextrusion.rh = rh;

			if (!this.isRight) {
				this.receiverfillerextrusion.x1 = x;
				this.receiverfillerextrusion.y1 = y;
				this.receiverfillerextrusion.x2 = this.receiverfillerextrusion.x1 + w;
				this.receiverfillerextrusion.y2 = this.receiverfillerextrusion.y1 + lh;
				this.receiverfillerextrusion.y3 = this.receiverfillerextrusion.y1 + this.receiverfillerextrusion.drop;
			} else {
				this.receiverfillerextrusion.x1 = x;
				this.receiverfillerextrusion.y1 = y;
				this.receiverfillerextrusion.x2 = this.receiverfillerextrusion.x1 + w;
				this.receiverfillerextrusion.y2 = this.receiverfillerextrusion.y1 + rh;
				this.receiverfillerextrusion.y3 = this.receiverfillerextrusion.y1 - this.receiverfillerextrusion.rise;
			}

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
			this.receiverfillerextrusion.svg.stroke(this.hlite);
			if (this.getClient().showParent) {
				if (this.getClient().hliteThis === data) {
					this.receiverfillerextrusion.svg.stroke(this.getClient().hlite);
				}
			}

		};
		this.putReceiverFillerInFront = function() {
			if (this.receiverfillerextrusion.svg === undefined) {
				return;
			}
			this.receiverfillerextrusion.svg.front();
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

			var data = core.getModel(this.getData(), "modWallReceiver");
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
			if (data.model["LENGTH"] != undefined) {
				h = Number(data.model["LENGTH"].value);
				if (h === undefined) {
					h = 1;
				}
			}
			w = this.client.convert(w);
			h = this.client.convert(h);

			// Calculate the short side of this extrusion being cut
			lh = h;
			rh = h;
			if (this.trap != undefined) {
				lh = h;
				drop = w * this.trap.pitch;
				rh = lh - drop;
			}

			x = this.x;
			y = this.y;
			if (this.receiverfillerextrusion.container != undefined) {
				x = this.receiverfillerextrusion.x2;
				y = this.receiverfillerextrusion.y3;
			} else {
				if (this.openings.container != undefined) {
					x = this.openings.x2;
					y = this.openings.y3;
				}
			}

			color = this.color;
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
			this.receiverextrusion.svg.stroke(this.hlite);
			if (this.getClient().showParent) {
				if (this.getClient().hliteThis === data) {
					this.receiverextrusion.svg.stroke(this.getClient().hlite);
				}
			}
		};
		this.putReceiverInFront = function() {
			if (this.receiverextrusion.svg === undefined) {
				return;
			}
			this.receiverextrusion.svg.front();
		};

		this.renderEndPost = function() {
			var h;
			var lh;
			var rh;
			var w;
			var x;
			var y;
			var tw = 0;
			var drop = 0;
			var color = "WH";

			var data = core.getModel(this.getData(), "exEndPost");
			if (data === undefined) {
				data = core.getModel(this.getData(), "exEndPostGhost");
				if (data === undefined) {
					return;
				}
			}

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
				if (w === undefined) {
					w = 1;
				}
			}
			if (data.model["LENGTH"] != undefined) {
				h = Number(data.model["LENGTH"].value);
				if (h === undefined) {
					h = 1;
				}
			}
			w = this.client.convert(w);
			h = this.client.convert(h);

			// Calculate the short side of this extrusion being cut
			lh = h;
			rh = h;
			if (this.trap != undefined) {
				lh = h;
				drop = w * this.trap.pitch;
				rh = lh - drop;
			}

			x = this.x;
			y = this.y;
			if (this.receiverextrusion.container != undefined) {
				x = this.receiverextrusion.x2;
				y = this.receiverextrusion.y3;
			} else {
				if (this.receiverfillerextrusion.container != undefined) {
					x = this.receiverfillerextrusion.x2;
					y = this.receiverfillerextrusion.y3;
				} else {
					if (this.openings.container != undefined) {
						x = this.openings.x2;
						y = this.openings.y3;
					}
				}
			}
			color = this.color;
			this.endpostextrusion.container = this.container;
			this.endpostextrusion.w = w;
			this.endpostextrusion.lh = lh;
			this.endpostextrusion.rh = rh;
			this.endpostextrusion.drop = drop;
			this.endpostextrusion.x1 = x;
			this.endpostextrusion.y1 = y;
			this.endpostextrusion.x2 = this.endpostextrusion.x1 + w;
			this.endpostextrusion.y2 = this.endpostextrusion.y1 + this.endpostextrusion.lh;
			this.endpostextrusion.y3 = this.endpostextrusion.y1 + this.endpostextrusion.drop;

			this.endpostextrusion.svg = this.endpostextrusion.container.polygon([this.endpostextrusion.x1, this.endpostextrusion.y1,
				this.endpostextrusion.x1, this.endpostextrusion.y2,
				this.endpostextrusion.x2, this.endpostextrusion.y2,
				this.endpostextrusion.x2, this.endpostextrusion.y3
			]);

			this.endpostextrusion.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			this.endpostextrusion.svg.stroke(this.hlite);
			if (this.getClient().showParent) {
				if (this.getClient().hliteThis === data) {
					this.endpostextrusion.svg.stroke(this.getClient().hlite);
				}
			}
		};
		this.putEndPostInFront = function() {
			if (this.endpostextrusion.svg === undefined) {
				return;
			}
			this.endpostextrusion.svg.front();
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
			//			this.putStarterchannel.svg.front();
			//			this.receiverchannel.svg.front();
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
			//			this.starterchannel.svg.front();
			//			this.receiverchannel.svg.front();

		};
		this.renderFloorTrack = function() {
			var x1 = 0;
			var y1 = this.openings.y2;
			var x2 = 0;
			var y2 = 0;
			var started = false;

			var xdata = core.getModel(this.getData(), "wsFloorTrack");
			if (xdata === undefined) {
				return;
			}

			if (this.beginpostextrusion.container != undefined) {
				x1 = this.beginpostextrusion.x1;
				x2 = this.beginpostextrusion.x2;
				started = true;
			}

			if (this.starterextrusion.container != undefined) {
				if (!started) {
					x1 = this.starterextrusion.x1;
					x2 = this.starterextrusion.x2;
				} else {
					x2 = this.starterextrusion.x2;
				}
				started = true;
			}

			if (this.starterfillerextrusion.container != undefined) {
				if (!started) {
					x1 = this.starterfillerextrusion.x1;
					x2 = this.starterfillerextrusion.x2;
				} else {
					x2 = this.starterfillerextrusion.x2;
				}
				started = true;
			}

			var wallmods = data.model['WALLMODS'].valueList;
			var objmods = core.getModels(this.getData(), 'modWallModule');
			if (wallmods != undefined && objmods != undefined) {
				wallmods.sort(function(a, b) {
					return (Number(a.Position) > Number(b.Position)) ? 1 : ((Number(b.Position) > Number(a.Position)) ? -1 : 0);
				});
			} else {
				wallmods = [];
				objmods = [];
			}

			for (var i = 0; i < wallmods.length; i++) {
				for (var j = 0; j < objmods.length; j++) {
					var amodnode = objmods[j];
					if (objmods[j].Data.Id === wallmods[i].Id) {
						var amod = amodnode.model;
						var modtype = amod['WALL.MOD.TYPE'].value;

						switch (modtype) {
							case 'D':
								this.renderTrack(x1, y1, x2, y2, xdata);
								started = false;
								var width = wallmods[i].Width;
								x1 = x2 + this.client.convert(width);
								x2 = x1;
								break;
							case 'W':
								var width = wallmods[i].Width;
								if (!started) {
									x1 = x2;
									x2 = x2 + this.client.convert(width);
								} else {
									x2 = x2 + this.client.convert(width);
								}
								started = true;
								break;
							case 'S':
								var width = amod['WIDTH'].value;
								var width = wallmods[i].Width;
								if (!started) {
									x1 = x2;
									x2 = x2 + this.client.convert(width);
								} else {
									x2 = x2 + this.client.convert(width);
								}
								started = true;
								break;
							case 'O':
								var width = amod['WIDTH'].value;
								var width = wallmods[i].Width;
								if (!started) {
									x1 = x2;
									x2 = x2 + this.client.convert(width);
								} else {
									x2 = x2 + this.client.convert(width);
								}
								started = true;
								break;
						}
					}
				}
			}
			if (this.receiverfillerextrusion.container != undefined) {
				if (!started) {
					x1 = this.receiverfillerextrusion.x1;
					x2 = this.receiverfillerextrusion.x2;
				} else {
					x2 = this.receiverfillerextrusion.x2;
				}
				started = true;
			}
			if (this.receiverextrusion.container != undefined) {
				if (!started) {
					x1 = this.receiverextrusion.x1;
					x2 = this.receiverextrusion.x2;
				} else {
					x2 = this.receiverextrusion.x2;
				}
				started = true;
			}
			if (this.endpostextrusion.container != undefined) {
				if (!started) {
					x1 = this.endpostextrusion.x1;
					x2 = this.endpostextrusion.x2;
				} else {
					x2 = this.endpostextrusion.x2;
				}
				started = true;
			}
			this.renderTrack(x1, y1, x2, y2, xdata);

		};

		this.renderTrack = function(x1, y1, x2, y2, data) {
			var atrack = {
				container: undefined,
				svg: undefined
			};
			var w = 0.5;
			var color = "WH";
			w = this.client.convert(w);
			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			atrack.color = color;
			atrack.container = this.container;
			atrack.w = w;
			atrack.l = x2 - x1;
			atrack.x1 = x1;
			atrack.y1 = y1;
			atrack.x2 = x2;
			atrack.y2 = y1 + atrack.w;
			atrack.y3 = atrack.y1;

			atrack.svg = atrack.container.polygon([atrack.x1, atrack.y1,
				atrack.x1, atrack.y2,
				atrack.x2, atrack.y2,
				atrack.x2, atrack.y3
			]);

			atrack.svg.attr({
				fill: ssBase.color["WH"].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			atrack.svg.stroke(this.hlite);
			if (this.getClient().showParent) {
				if (this.getClient().hliteThis === data) {
					atrack.svg.stroke(this.getClient().hlite);
				}
			}
			this.tracks.push(atrack);
		};
		this.renderGable = function() {
			this.renderGableLeft();
			this.renderGablePost();
			this.renderGableRight();
			this.isReady = true;
			return this;
		};
		this.renderGableLeft = function() {
			var w = 0;
			var lh = 0;
			var rh = 0;
			var ph = 0;
			var tw = 0;
			var drop = 0;
			var rise = 0;
			var px = this.x;
			var py = this.y;
			var color = "WH";

			if (data.model["LEFT.WIDTH"] != undefined) {
				w = Number(data.model["LEFT.WIDTH"].value);
				if (w == undefined) {
					w = 1;
				}
			}
			if (data.model["LEFT.LEFT.HEIGHT"] != undefined) {
				lh = Number(data.model["LEFT.LEFT.HEIGHT"].value);
				if (lh == undefined) {
					lh = 1;
				}
			}
			if (data.model["LEFT.RIGHT.HEIGHT"] != undefined) {
				rh = Number(data.model["LEFT.RIGHT.HEIGHT"].value);
				if (rh == undefined) {
					rh = 1;
				}
			}
			if (data.model["PEAK.HEIGHT"] != undefined) {
				ph = Number(data.model["PEAK.HEIGHT"].value);
			}
			if (data.model["TRACK.WIDTH"] != undefined) {
				tw = Number(data.model["TRACK.WIDTH"].value);
				if (tw == undefined) {
					tw = 1;
				}
			}

			if (data.model["FRAME.COLOR"] != undefined) {
				color = data.model['FRAME.COLOR'].value;
			};

			tw = this.client.convert(tw);
			lh = this.client.convert(lh);
			rh = this.client.convert(rh);
			w = this.client.convert(w);

			//            if(this.y <=0){
			//           	this.y = 50;
			//            }

			this.lw = w;
			this.lrh = rh;
			this.llh = lh;
			this.tw = tw;
			this.color = color;

			if (w <= 0) return;
			if (lh <= 0) return;
			if (rh <= 0) return;

			// if left and right heights are different, then its a trapzoid and we need to get angles for our cuts
			//			this.trap = undefined;
			//			if (lh != rh) {
			//				this.trap = ssMath.calcTrap(lh, rh, w);
			//				if (lh > rh) {
			//					drop = w * this.trap.pitch;
			//				} else {
			//					rise = (w * this.trap.pitch) * -1;
			//					this.y = this.y + rise;
			//				}
			//			}

			this.renderHeaderLeftTrack();
			this.renderBeginPost();
			this.renderStarter();
			this.renderStarterFiller();
			this.renderLeftMods();
			//			this.renderReceiverFiller();
			//			this.renderReceiver();
			//			this.renderFloorLeftTrack();
			this.putLeftHeaderInFront();
		};
		this.renderGableRight = function() {
			return;
			this.renderHeaderRightTrack();
			this.renderLeftMods();
			this.renderReceiverFiller();
			this.renderReceiver();
			this.renderEndPost();
			this.renderFloorRightTrack();
			//			this.putHeaderInFront();
		};
		this.renderHeaderLeftTrack = function() {
			var w = 0;
			var lh = 0;
			var rh = 0;
			var tw = 0;
			var drop = 0;
			var rise = 0;
			var px = this.x;
			var py = this.y;
			var tw = 0;

			var color = "WH";

			if (this.data.model["LEFT.WIDTH"] != undefined) {
				w = Number(this.data.model["LEFT.WIDTH"].value);
				if (w == undefined) {
					w = 1;
				}
			}
			if (this.data.model["LEFT.LEFT.HEIGHT"] != undefined) {
				lh = Number(this.data.model["LEFT.LEFT.HEIGHT"].value);
				if (lh == undefined) {
					lh = 1;
				}
			}
			if (this.data.model["LEFT.RIGHT.HEIGHT"] != undefined) {
				rh = Number(this.data.model["LEFT.RIGHT.HEIGHT"].value);
				if (rh == undefined) {
					rh = 1;
				}
			}
			if (this.data.model["TRACK.WIDTH"] != undefined) {
				tw = Number(this.data.model["TRACK.WIDTH"].value);
				if (tw == undefined) {
					tw = 1;
				}
			}

			var data1 = core.getModel(this.getData(), "wsHeaderTrack");
			if (data1 === undefined) {
				return;
			}

			if (data1.model["EXTRUSION.COLOR"] != undefined) {
				color = data1.model['EXTRUSION.COLOR'].value;
			};

			tw = this.client.convert(tw);
			lh = this.client.convert(lh);
			rh = this.client.convert(rh);
			w = this.client.convert(w);

			this.headerleftextrusion.w = w;
			this.headerleftextrusion.lh = lh;
			this.headerleftextrusion.rh = rh;
			this.headerleftextrusion.tw = tw;

			this.headerleftextrusion.container = this.container.nested();
			this.headerleftextrusion.w = w;
			this.headerleftextrusion.drop = this.drop;
			this.headerleftextrusion.rise = this.rise;

			this.headerleftextrusion.x1 = this.x + w;
			this.headerleftextrusion.x2 = this.x;
			this.headerleftextrusion.y1 = this.y;
			this.headerleftextrusion.y2 = this.headerleftextrusion.y1 + (rh - lh);
			this.headerleftextrusion.svg = this.headerleftextrusion.container.polygon([
				this.headerleftextrusion.x1, this.headerleftextrusion.y1,
				this.headerleftextrusion.x2, this.headerleftextrusion.y2,
				this.headerleftextrusion.x2, this.headerleftextrusion.y2 + tw,
				this.headerleftextrusion.x1, this.headerleftextrusion.y1 + tw
			]);

			this.headerleftextrusion.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			if (this.getClient().showParent) {
				if (this.getClient().hliteThis === data) {
					this.headerleftextrusion.svg.stroke(this.getClient().hlite);
				}
			}
		};
		this.putLeftHeaderInFront = function() {
			if (this.headerleftextrusion.svg === undefined) {
				return;
			}
			this.headerleftextrusion.svg.front();
		};
		this.renderLeftBeginPost = function() {
			var h;
			var lh;
			var rh;
			var w;
			var x;
			var y;
			var tw = 0;
			var drop = 0;
			var rise = 0;
			var color = "WH";

			var data = core.getModel(this.getData(), "exBeginPost");
			if (data === undefined) {
				data = core.getModel(this.getData(), "exBeginPostGhost");
				if (data === undefined) {
					return;
				}
			}

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
				if (w === undefined) {
					w = 1;
				}
			}
			if (data.model["LENGTH"] != undefined) {
				h = Number(data.model["LENGTH"].value);
				if (h === undefined) {
					h = 1;
				}
			}
			w = this.client.convert(w);
			h = this.client.convert(h);

			// Calculate the short side of this extrusion being cut
			lh = h;
			rh = h;
			if (this.trap != undefined) {
				if (!this.isRight) {
					drop = w * this.trap.pitch;
					rh = rh - drop;
				} else {
					rise = (w * this.trap.pitch) * -1;
					lh = lh - rise;
				}
			}

			x = this.x;
			y = this.y;
			this.beginpostextrusion.container = this.container;
			this.beginpostextrusion.w = w;
			this.beginpostextrusion.lh = lh;
			this.beginpostextrusion.rh = rh;
			this.beginpostextrusion.drop = drop;
			this.beginpostextrusion.rise = rise;
			if (!this.isRight) {
				this.beginpostextrusion.x1 = x;
				this.beginpostextrusion.y1 = y;
				this.beginpostextrusion.x2 = this.beginpostextrusion.x1 + w;
				this.beginpostextrusion.y2 = this.beginpostextrusion.y1 + this.beginpostextrusion.lh;
				this.beginpostextrusion.y3 = this.beginpostextrusion.y1 + this.beginpostextrusion.drop;
			} else {
				this.beginpostextrusion.x1 = x;
				this.beginpostextrusion.y1 = y + rise;
				this.beginpostextrusion.x2 = this.beginpostextrusion.x1 + w;
				this.beginpostextrusion.y2 = this.beginpostextrusion.y1 + this.beginpostextrusion.lh;
				this.beginpostextrusion.y3 = this.beginpostextrusion.y1 + this.beginpostextrusion.rise;
			}

			this.beginpostextrusion.svg = this.beginpostextrusion.container.polygon([this.beginpostextrusion.x1, this.beginpostextrusion.y1,
				this.beginpostextrusion.x1, this.beginpostextrusion.y2,
				this.beginpostextrusion.x2, this.beginpostextrusion.y2,
				this.beginpostextrusion.x2, this.beginpostextrusion.y3
			]);

			this.beginpostextrusion.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			this.beginpostextrusion.svg.stroke(this.hlite);
			if (this.getClient().showParent) {
				if (this.getClient().hliteThis === data) {
					this.beginpostextrusion.svg.stroke(this.getClient().hlite);
				}
			}

		};
		this.putLeftBeginPostInFront = function() {
			if (this.beginpostextrusion.svg === undefined) {
				return;
			}
			this.beginpostextrusion.svg.front();
		};

		this.renderLeftMods = function() {
			var w;
			var lh;
			var rh;
			var tw = 0;
			var color = this.color;
			var drop = 0;
			var rise = 0;

			if (data.model["LEFT.INNER.WIDTH"] != undefined) {
				w = Number(data.model["LEFTINNER.WIDTH"].value);
				if (w == undefined) {
					w = 1;
				}
			}
			if (data.model["LEFT.INNER.LEFT.HEIGHT"] != undefined) {
				lh = Number(data.model["LEFT.INNER.LEFT.HEIGHT"].value);
				if (lh == undefined) {
					lh = 1;
				}
			}
			if (data.model["LEFT.INNER.RIGHT.HEIGHT"] != undefined) {
				rh = Number(data.model["LEFT.INNER.RIGHT.HEIGHT"].value);
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

			x = this.x;
			y = this.y;

			if (this.starterfillerextrusion.container != undefined) {
				x = this.starterfillerextrusion.x2;
				y = this.starterfillerextrusion.y3;
			} else {
				if (this.starterextrusion.container != undefined) {
					x = this.starterextrusion.x2;
					y = this.starterextrusion.y3;
				} else {
					if (this.beginpostextrusion.container != undefined) {
						x = this.beginpostextrusion.x2;
						y = this.beginpostextrusion.y3;
					}

				}
			}

			this.leftopenings.container = this.container.nested();
			this.leftopenings.w = w;
			this.leftopenings.drop = drop;
			this.leftopenings.rise = rise;
			this.leftopenings.lh = lh;
			this.leftopenings.rh = rh;
			this.leftopenings.x1 = x + w;
			this.leftopenings.y1 = y;
			this.leftopenings.x2 = x;
			this.leftopenings.y2 = this.leftopenings.y1 + rh - lh;
			this.leftopenings.y3 = this.leftopenings.y1 + lh;

			this.leftopenings.svg = this.leftopenings.container.polygon([this.leftopenings.x1, this.leftopenings.y1,
				this.leftopenings.x2, this.leftopenings.y2,
				this.leftopenings.x2, this.leftopenings.y3,
				this.leftopenings.x1, this.leftopenings.y3
			]);
			this.leftopenings.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			this.leftopenings.svg.stroke(this.hlite);

			var lstmods = data.model['LEFT.WALLMODS'].valueList;
			var objmods = core.getAllModels(this.getData());
			if (lstmods === undefined) {
				return;
			}
			if (objmods === undefined) {
				return;
			}

			lstmods.sort(function(a, b) {
				return (Number(a.Position) > Number(b.Position)) ? 1 : ((Number(b.Position) > Number(a.Position)) ? -1 : 0);
			});
			var x = this.leftopenings.x2;
			var y = this.leftopenings.y2;
			for (var i = 0; i < lstmods.length; i++) {
				for (var j = 0; j < objmods.length; j++) {
					if (objmods[j].Data === undefined) {
						continue;
					}
					if (objmods[j].Data.Id === lstmods[i].Id) {
						break;
					}
				}
				var amod = objmods[j];
				if (amod === undefined) {
					continue;
				}
				if (amod.model["WIDTH"] != undefined) {
					w = Number(amod.model["WIDTH"].value);
					if (w == undefined) {
						w = 1;
					}
				} else {
					if (amod.model["THICKNESS"] != undefined) {
						w = Number(amod.model["THICKNESS"].value);
						if (w == undefined) {
							w = 1;
						}
					}
				}
				w = this.client.convert(w);
				var mod = this.getClient().draw(amod, x, y, this.leftopenings.container);
				this.mods.push(mod);
				try {
					x = mod.leftopenings.x2;
					y = mod.leftopenings.y3;
				} catch (e) {
					try {
						x = mod.x2;
						y = mod.y3;
					} catch (e) {}
				}

			}
		};

	};
});