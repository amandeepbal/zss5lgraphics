sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase",
], function (ssMath, core, ssBase) {
	return function (client, data, myParent, x, y) {
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
		this.headerrightextrusion = {
			container: undefined,
			svg: undefined,
			x: 0,
			y: 0
		};
		this.leftopenings = {
			container: undefined,
			svg: undefined,
			x: x,
			y: y
		};
		this.starterleftextrusion = {
			container: undefined,
			svg: undefined,
			x: 0,
			y: 0
		};
		this.starterrightextrusion = {
			container: undefined,
			svg: undefined,
			x: 0,
			y: 0
		};

		this.rightopenings = {
			container: undefined,
			svg: undefined,
			x: x,
			y: y
		};
		this.gablepostextrusion = {
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

		this.setData = function (data) {
			this.data = data;
		};
		this.getData = function () {
			return this.data;
		};
		this.setParent = function (parent) {
			this.ssparent = parent;
		};
		this.getParent = function () {
			return this.ssparent;
		};
		this.getClient = function () {
			return this.client;
		};

		this.calculate = function () {
			var data = this.getData();
		};

		this.render = function () {
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
		this.renderStudio = function () {
			var w = 0;
			var lh = 0;
			var rh = 0;
			var tw = 0;
			var drop = 0;
			var rise = 0;
			var px = this.x;
			var py = this.y;
			var color = "WH";
			this.pitch = data.model.pitch;

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
			this.ground = this.y + lh;
			if (rh > lh) {
				this.ground =
					this.y = this.y + (rh - lh);
				this.ground = this.rh;
			}

			this.renderHeaderTrack();
			this.renderBeginPost();
			this.renderStarter();
			this.renderStarterFiller();
			this.renderMods();
			this.renderReceiverFiller(false);
			this.renderReceiver(false);
			this.renderEndPost(false);
			this.renderFloorTrack();
			this.putHeaderInFront();
			this.isReady = true;

			// use to put a bounding box when its selected  --- for hliting
			this.x1 = this.x;
			this.y1 = this.y;
			this.x2 = this.x1 + w;
			this.y2 = this.y1 + lh;
			this.client.hliteObject(this.getData(), this);
			return this;
		};
		this.renderHeaderTrack = function () {
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
			this.headerextrusion.x1 = this.x;
			this.headerextrusion.y1 = this.y;
			this.headerextrusion.x2 = this.headerextrusion.x1 + this.w;
			this.headerextrusion.y2 = this.headerextrusion.y1 + (this.lh - this.rh);
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

			var obj = {
				x1: this.headerextrusion.x1,
				y1: this.headerextrusion.y1,
				x2: this.headerextrusion.x2,
				y2: this.headerextrusion.y2,
				instanceId: data.model.InstanceId
			};

			this.client.hliteObject(obj);

		};
		this.putHeaderInFront = function () {
			if (this.headerextrusion.svg === undefined) {
				return;
			}
			this.headerextrusion.svg.front();
		};

		this.renderBeginPost = function () {
			var l;
			var w;
			var x;
			var y;
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
				l = Number(data.model["LENGTH"].value);
				if (l === undefined) {
					l = 1;
				}
			}
			w = this.client.convert(w);
			l = this.client.convert(l);

			var diff = w * this.pitch;
			this.beginpostextrusion.container = this.container;
			this.beginpostextrusion.w = w;
			this.beginpostextrusion.l = l;

			this.beginpostextrusion.x1 = this.x;
			this.beginpostextrusion.y1 = this.ground;
			this.beginpostextrusion.x2 = this.beginpostextrusion.x1 + w;
			this.beginpostextrusion.y2 = this.beginpostextrusion.y1 - l;
			this.beginpostextrusion.y3 = this.beginpostextrusion.y2 + diff;

			this.beginpostextrusion.svg = this.beginpostextrusion.container.polygon([this.beginpostextrusion.x1, this.beginpostextrusion.y1,
				this.beginpostextrusion.x1, this.beginpostextrusion.y2,
				this.beginpostextrusion.x2, this.beginpostextrusion.y3,
				this.beginpostextrusion.x2, this.beginpostextrusion.y1
			]);

			this.beginpostextrusion.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});

			var obj = {
				x1: this.beginpostextrusion.x1,
				y1: this.beginpostextrusion.y1,
				x2: this.beginpostextrusion.x2,
				y2: this.beginpostextrusion.y2,
				instanceId: data.model.InstanceId
			};

			this.client.hliteObject(obj);

		};
		this.putBeginPostInFront = function () {
			if (this.beginpostextrusion.svg === undefined) {
				return;
			}
			this.beginpostextrusion.svg.front();
		};

		this.renderStarter = function () {
			var l;
			var w;
			var x;
			var y;
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
				l = Number(data.model["LENGTH"].value);
				if (l === undefined) {
					l = 1;
				}
			}
			w = this.client.convert(w);
			l = this.client.convert(l);

			x = this.x;
			y = this.y;
			if (this.beginpostextrusion.container != undefined) {
				x = this.beginpostextrusion.x2;
			}

			var diff = w * this.pitch;
			this.starterextrusion.container = this.container;
			this.starterextrusion.w = w;
			this.starterextrusion.l = l;

			this.starterextrusion.x1 = x;
			this.starterextrusion.y1 = this.ground;
			this.starterextrusion.x2 = this.starterextrusion.x1 + w;
			this.starterextrusion.y2 = this.starterextrusion.y1 - this.starterextrusion.l;
			this.starterextrusion.y3 = this.starterextrusion.y2 + diff;
			this.starterextrusion.svg = this.starterextrusion.container.polygon([this.starterextrusion.x1, this.starterextrusion.y1,
				this.starterextrusion.x1, this.starterextrusion.y2,
				this.starterextrusion.x2, this.starterextrusion.y3,
				this.starterextrusion.x2, this.starterextrusion.y1
			]);

			this.starterextrusion.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});

			// use to put a bounding box when its selected  --- for hliting
			var obj = {
				x1: this.starterextrusion.x1,
				y1: this.starterextrusion.y1,
				x2: this.starterextrusion.x2,
				y2: this.starterextrusion.y2,
				instanceId: data.model.InstanceId
			};

			this.client.hliteObject(obj);

		};
		this.putStarterInFront = function () {
			if (this.starterextrusion.svg === undefined) {
				return;
			}
			this.starterextrusion.svg.front();
		};
		this.renderStarterFiller = function () {
			var x;
			var y;
			var w;
			var l;
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
				l = Number(data.model["LENGTH"].value);
				if (l == undefined) {
					l = 1;
				}
			}
			w = this.client.convert(w);
			l = this.client.convert(l);

			x = this.x;
			y = this.y;

			if (this.starterextrusion.container != undefined) {
				x = this.starterextrusion.x2;
			} else {
				if (this.beginpostextrusion.container != undefined) {
					x = this.beginpostextrusion.x2;
				}
			}

			var diff = w * this.pitch;
			this.starterfillerextrusion.container = this.container;
			this.starterfillerextrusion.w = w;
			this.starterfillerextrusion.l = l;

			this.starterfillerextrusion.x1 = x;
			this.starterfillerextrusion.y1 = this.ground;
			this.starterfillerextrusion.x2 = this.starterfillerextrusion.x1 + w;
			this.starterfillerextrusion.y2 = this.starterfillerextrusion.y1 - this.starterfillerextrusion.l;
			this.starterfillerextrusion.y3 = this.starterfillerextrusion.y2 + diff;

			this.starterfillerextrusion.svg = this.starterfillerextrusion.container.polygon([
				this.starterfillerextrusion.x1, this.starterfillerextrusion.y1,
				this.starterfillerextrusion.x1, this.starterfillerextrusion.y2,
				this.starterfillerextrusion.x2, this.starterfillerextrusion.y3,
				this.starterfillerextrusion.x2, this.starterfillerextrusion.y1
			]);

			this.starterfillerextrusion.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});

			// use to put a bounding box when its selected  --- for hliting
			var obj = {
				x1: this.starterfillerextrusion.x1,
				y1: this.starterfillerextrusion.y1,
				x2: this.starterfillerextrusion.x2,
				y2: this.starterfillerextrusion.y2,
				instanceId: data.model.InstanceId
			};

			this.client.hliteObject(obj);
		};
		this.putStarterFillerInFront = function () {
			if (this.starterfillerextrusion.svg === undefined) {
				return;
			}
			this.starterfillerextrusion.svg.front();
		};

		this.renderMods = function () {
			var x;
			var y;
			var w;
			var lh;
			var rh;
			var color = this.color;

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

			x = this.x;
			y = this.y;

			if (this.starterfillerextrusion.container != undefined) {
				x = this.starterfillerextrusion.x2;
			} else {
				if (this.starterextrusion.container != undefined) {
					x = this.starterextrusion.x2;
				} else {
					if (this.beginpostextrusion.container != undefined) {
						x = this.beginpostextrusion.x2;
					}

				}
			}

			var diff = w * this.pitch;
			this.openings.container = this.container.nested();
			this.openings.w = w;
			this.openings.lh = lh;
			this.openings.rh = rh;
			this.openings.x1 = x;
			this.openings.y1 = this.ground;
			this.openings.x2 = this.openings.x1 + w;
			this.openings.y2 = this.openings.y1 - lh;
			this.openings.y3 = this.openings.y2 + diff;

			this.openings.svg = this.openings.container.polygon([this.openings.x1, this.openings.y1,
				this.openings.x1, this.openings.y2,
				this.openings.x2, this.openings.y3,
				this.openings.x2, this.openings.y1
			]);
			this.openings.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"fill-opacity": "0.5",
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

			lstmods.sort(function (a, b) {
				return (Number(a.Position) > Number(b.Position)) ? 1 : ((Number(b.Position) > Number(a.Position)) ? -1 : 0);
			});
			var x = this.openings.x1;
			var y = this.openings.y2;
			for (var i = 0; i < lstmods.length; i++) {
				var isFound = false;
				for (var j = 0; j < objmods.length; j++) {
					if (objmods[j].Data === undefined) {
						continue;
					}
					if (objmods[j].Data.Id === lstmods[i].Id) {
						isFound = true;
						break;
					}
				}
				if (!isFound) {
					continue;
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
				if (mod === undefined) continue;
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
		this.renderReceiverFiller = function (isGable) {
			var x;
			var y;
			var w;
			var l;
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
				l = Number(data.model["LENGTH"].value);
				if (l == undefined) {
					l = 1;
				}
			}
			w = this.client.convert(w);
			l = this.client.convert(l);

			x = this.x;
			y = this.y;

			if (!isGable) {
				if (this.openings.container != undefined) {
					x = this.openings.x2;
				}
			} else {
				if (this.rightopenings.container != undefined) {
					x = this.rightopenings.x2;
				}
			}

			var diff = w * this.pitch;
			this.receiverfillerextrusion.container = this.container;
			this.receiverfillerextrusion.w = w;
			this.receiverfillerextrusion.l = l;
			this.receiverfillerextrusion.x1 = x;
			this.receiverfillerextrusion.y1 = this.ground;
			this.receiverfillerextrusion.x2 = this.receiverfillerextrusion.x1 + w;
			this.receiverfillerextrusion.y2 = this.receiverfillerextrusion.y1 - l;
			this.receiverfillerextrusion.y3 = this.receiverfillerextrusion.y2 + diff;

			this.receiverfillerextrusion.svg = this.receiverfillerextrusion.container.polygon([
				this.receiverfillerextrusion.x1, this.receiverfillerextrusion.y1,
				this.receiverfillerextrusion.x1, this.receiverfillerextrusion.y2,
				this.receiverfillerextrusion.x2, this.receiverfillerextrusion.y3,
				this.receiverfillerextrusion.x2, this.receiverfillerextrusion.y1
			]);

			this.receiverfillerextrusion.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});

			// use to put a bounding box when its selected  --- for hliting
			var obj = {
				x1: this.receiverfillerextrusion.x1,
				y1: this.receiverfillerextrusion.y1,
				x2: this.receiverfillerextrusion.x2,
				y2: this.receiverfillerextrusion.y2,
				instanceId: data.model.InstanceId
			};
			this.client.hliteObject(obj);

		};
		this.putReceiverFillerInFront = function () {
			if (this.receiverfillerextrusion.svg === undefined) {
				return;
			}
			this.receiverfillerextrusion.svg.front();
		};
		this.renderReceiver = function (isGable) {
			var l;
			var w;
			var x;
			var y;
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
				l = Number(data.model["LENGTH"].value);
				if (l === undefined) {
					l = 1;
				}
			}
			w = this.client.convert(w);
			l = this.client.convert(l);

			x = this.x;
			y = this.y;

			if (this.receiverfillerextrusion.container != undefined) {
				x = this.receiverfillerextrusion.x2;
			} else {
				if (!isGable) {
					if (this.openings.container != undefined) {
						x = this.openings.x2;
					}
				} else {
					if (this.rightopenings.container != undefined) {
						x = this.rightopenings.x2;
					}

				}
			}

			var diff = w * this.pitch;
			color = this.color;
			this.receiverextrusion.container = this.container;

			this.receiverextrusion.w = w;
			this.receiverextrusion.l = l;
			this.receiverextrusion.x1 = x;
			this.receiverextrusion.y1 = this.ground;
			this.receiverextrusion.x2 = this.receiverextrusion.x1 + w;
			this.receiverextrusion.y2 = this.receiverextrusion.y1 - this.receiverextrusion.l;
			this.receiverextrusion.y3 = this.receiverextrusion.y2 + diff;

			this.receiverextrusion.svg = this.receiverextrusion.container.polygon([this.receiverextrusion.x1, this.receiverextrusion.y1,
				this.receiverextrusion.x1, this.receiverextrusion.y2,
				this.receiverextrusion.x2, this.receiverextrusion.y3,
				this.receiverextrusion.x2, this.receiverextrusion.y1
			]);

			this.receiverextrusion.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});

			// use to put a bounding box when its selected  --- for hliting
			var obj = {
				x1: this.receiverextrusion.x1,
				y1: this.receiverextrusion.y1,
				x2: this.receiverextrusion.x2,
				y2: this.receiverextrusion.y2,
				instanceId: data.model.InstanceId
			};

			this.client.hliteObject(obj);

		};
		this.putReceiverInFront = function () {
			if (this.receiverextrusion.svg === undefined) {
				return;
			}
			this.receiverextrusion.svg.front();
		};

		this.renderEndPost = function (isGable) {
			var l;
			var w;
			var x;
			var y;
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
				l = Number(data.model["LENGTH"].value);
				if (l === undefined) {
					l = 1;
				}
			}
			w = this.client.convert(w);
			l = this.client.convert(l);

			x = this.x;
			y = this.y;

			if (this.receiverextrusion.container != undefined) {
				x = this.receiverextrusion.x2;
			} else {
				if (this.receiverfillerextrusion.container != undefined) {
					x = this.receiverfillerextrusion.x2;
				} else {
					if (!isGable) {
						if (this.openings.container != undefined) {
							x = this.openings.x2;
						}
					} else {
						if (this.rightopenings.container != undefined) {
							x = this.rightopenings.x2;
						}
					}
				}
			}
			var diff = w * this.pitch;
			color = this.color;
			this.endpostextrusion.container = this.container;

			this.endpostextrusion.w = w;
			this.endpostextrusion.l = l;
			this.endpostextrusion.x1 = x;
			this.endpostextrusion.y1 = this.ground;
			this.endpostextrusion.x2 = this.endpostextrusion.x1 + w;
			this.endpostextrusion.y2 = this.endpostextrusion.y1 - this.endpostextrusion.l;
			this.endpostextrusion.y3 = this.endpostextrusion.y2 + diff;

			this.endpostextrusion.svg = this.endpostextrusion.container.polygon([this.endpostextrusion.x1, this.endpostextrusion.y1,
				this.endpostextrusion.x1, this.endpostextrusion.y2,
				this.endpostextrusion.x2, this.endpostextrusion.y3,
				this.endpostextrusion.x2, this.endpostextrusion.y1
			]);

			this.endpostextrusion.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});

			// use to put a bounding box when its selected  --- for hliting
			var obj = {
				x1: this.endpostextrusion.x1,
				y1: this.endpostextrusion.y1,
				x2: this.endpostextrusion.x2,
				y2: this.endpostextrusion.y2,
				instanceId: data.model.InstanceId
			};

			this.client.hliteObject(obj);

		};
		this.putEndPostInFront = function () {
			if (this.endpostextrusion.svg === undefined) {
				return;
			}
			this.endpostextrusion.svg.front();
		};

		this.renderFloorTrack = function () {
			var x1 = 0;
			var x2 = 0;
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
				wallmods.sort(function (a, b) {
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
							this.renderTrack(x1, x2, xdata);
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
			this.renderTrack(x1, x2, xdata);

		};

		this.renderTrack = function (x1,x2,data) {
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
			atrack.x2 = x2;
			atrack.y1 = this.ground - w;
			atrack.y2 = atrack.y1 + atrack.w;
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

			// use to put a bounding box when its selected  --- for hliting
			var obj = {
				x1: atrack.x1,
				y1: atrack.y1,
				x2: atrack.x2,
				y2: atrack.y2,
				instanceId: data.model.InstanceId
			};

			this.client.hliteObject(obj);

			this.tracks.push(atrack);
		};

		/////////////////////////////
		//   Gable
		/////////////////////////////

		this.renderGable = function () {
			this.renderGableLeft();
			this.renderGablePost();
			this.renderGableRight();
			this.isReady = true;
			return this;
		};
		/////////////////////////////
		//   Gable Left
		/////////////////////////////

		this.renderGableLeft = function () {
			var w = 0;
			var l = 0;
			var lh = 0;
			var rh = 0;
			var ph = 0;
			var color = "WH";

			var data1 = core.getModel(this.getData(), "wlWallGableLeft");
			var pitch = data1.model.pitch;

			this.dataleft = data1;

			if (data1.model["WIDTH"] != undefined) {
				w = Number(data1.model["WIDTH"].value);
				if (w == undefined) {
					w = 1;
				}
			}
			if (data1.model["LEFT.HEIGHT"] != undefined) {
				lh = Number(data1.model["LEFT.HEIGHT"].value);
				if (lh == undefined) {
					lh = 1;
				}
			}
			if (data1.model["RIGHT.HEIGHT"] != undefined) {
				rh = Number(data1.model["RIGHT.HEIGHT"].value);
				if (rh == undefined) {
					rh = 1;
				}
			}
			if (this.data.model["PEAK.HEIGHT"] != undefined) {
				ph = Number(this.data.model["PEAK.HEIGHT"].value);
			}

			if (this.data.model["FRAME.COLOR"] != undefined) {
				color = this.data.model['FRAME.COLOR'].value;
			};

			lh = this.client.convert(lh);
			rh = this.client.convert(rh);
			w = this.client.convert(w);

			this.lw = w;
			this.lrh = rh;
			this.llh = lh;
			this.color = color;

			if (w <= 0) return;
			if (lh <= 0) return;
			if (rh <= 0) return;

			this.renderHeaderLeftTrack();
			this.renderBeginPost(this.headerleftextrusion.y2);
			this.renderStarter(this.headerleftextrusion.y2);
			this.renderStarterFiller(this.headerleftextrusion.y2);
			this.renderLeftMods(this.y);
			this.renderStarterLeft(this.headerleftextrusion.y1);
			this.renderFloorLeftTrack();
			this.putLeftHeaderInFront();
		};
		this.renderGableRight = function () {
			var w = 0;
			var lh = 0;
			var rh = 0;
			var ph = 0;
			var tw = 0;
			var color = "WH";

			var data1 = core.getModel(this.getData(), "wlWallGableRight");
			var pitch = data1.model.pitch;

			this.dataright = data1;
			if (data1.model["WIDTH"] != undefined) {
				w = Number(data1.model["WIDTH"].value);
				if (w == undefined) {
					w = 1;
				}
			}
			if (data1.model["LEFT.HEIGHT"] != undefined) {
				lh = Number(data1.model["LEFT.HEIGHT"].value);
				if (lh == undefined) {
					lh = 1;
				}
			}
			if (data1.model["RIGHT.HEIGHT"] != undefined) {
				rh = Number(data1.model["RIGHT.HEIGHT"].value);
				if (rh == undefined) {
					rh = 1;
				}
			}
			if (this.data.model["PEAK.HEIGHT"] != undefined) {
				ph = Number(this.data.model["PEAK.HEIGHT"].value);
			}

			if (this.data.model["FRAME.COLOR"] != undefined) {
				color = this.data.model['FRAME.COLOR'].value;
			};

            this.ground = this.y + ph;
			lh = this.client.convert(lh);
			rh = this.client.convert(rh);
			w = this.client.convert(w);

			this.rw = w;
			this.rrh = rh;
			this.rlh = lh;
			this.tw = tw;
			this.color = color;

			if (w <= 0) return;
			if (lh <= 0) return;
			if (rh <= 0) return;

			this.renderHeaderRightTrack();
			this.renderStarterRight(this.headerrightextrusion.y1);
			this.renderRightMods(this.y);
			this.renderReceiverFiller(true);
			this.renderReceiver(true);
			this.renderEndPost(true);
			this.renderFloorRightTrack();
			this.putRightHeaderInFront();
		};
		this.renderHeaderLeftTrack = function () {
			var w = 0;
			var lh = 0;
			var rh = 0;
			var tw = 0;
			var color = "WH";

			if (this.dataleft.model["WIDTH"] != undefined) {
				w = Number(this.dataleft.model["WIDTH"].value);
				if (w == undefined) {
					w = 1;
				}
			}
			if (this.dataleft.model["LEFT.HEIGHT"] != undefined) {
				lh = Number(this.dataleft.model["LEFT.HEIGHT"].value);
				if (lh == undefined) {
					lh = 1;
				}
			}
			if (this.dataleft.model["RIGHT.HEIGHT"] != undefined) {
				rh = Number(this.dataleft.model["RIGHT.HEIGHT"].value);
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

			this.headerleftextrusion.container = this.container;
			this.headerleftextrusion.drop = this.drop;
			this.headerleftextrusion.rise = this.rise;

			this.headerleftextrusion.x1 = this.x + w;
			this.headerleftextrusion.x2 = this.x;
			this.headerleftextrusion.y1 = this.ground;
			this.headerleftextrusion.y2 = this.headerleftextrusion.y1 - (rh - lh);
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

			// use to put a bounding box when its selected  --- for hliting
			var obj = {
				x1: this.headerleftextrusion.x1,
				y1: this.headerleftextrusion.y1,
				x2: this.headerleftextrusion.x2,
				y2: this.headerleftextrusion.y2,
				instanceId: data.model.InstanceId
			};

			this.client.hliteObject(obj);

		};
		this.putLeftHeaderInFront = function () {
			if (this.headerleftextrusion.svg === undefined) {
				return;
			}
			this.headerleftextrusion.svg.front();
		};

		this.renderHeaderRightTrack = function () {
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

			if (this.dataright.model["WIDTH"] != undefined) {
				w = Number(this.dataright.model["WIDTH"].value);
				if (w == undefined) {
					w = 1;
				}
			}
			if (this.dataright.model["LEFT.HEIGHT"] != undefined) {
				lh = Number(this.dataright.model["LEFT.HEIGHT"].value);
				if (lh == undefined) {
					lh = 1;
				}
			}
			if (this.dataright.model["RIGHT.HEIGHT"] != undefined) {
				rh = Number(this.dataright.model["RIGHT.HEIGHT"].value);
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

			this.headerrightextrusion.w = w;
			this.headerrightextrusion.lh = lh;
			this.headerrightextrusion.rh = rh;
			this.headerrightextrusion.tw = tw;

			this.headerrightextrusion.container = this.container;
			this.headerrightextrusion.drop = this.drop;
			this.headerrightextrusion.rise = this.rise;

			this.headerrightextrusion.x1 = this.gablepostextrusion.x2;
			this.headerrightextrusion.x2 = this.headerrightextrusion.x1 + w;
			this.headerrightextrusion.y1 = this.gablepostextrusion.y1;
			this.headerrightextrusion.y2 = this.headerrightextrusion.y1 + (lh - rh);
			this.headerrightextrusion.svg = this.headerrightextrusion.container.polygon([
				this.headerrightextrusion.x1, this.headerrightextrusion.y1,
				this.headerrightextrusion.x2, this.headerrightextrusion.y2,
				this.headerrightextrusion.x2, this.headerrightextrusion.y2 + tw,
				this.headerrightextrusion.x1, this.headerrightextrusion.y1 + tw
			]);

			this.headerrightextrusion.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			// use to put a bounding box when its selected  --- for hliting
			var obj = {
				x1: this.headerrightextrusion.x1,
				y1: this.headerrightextrusion.y1,
				x2: this.headerrightextrusion.x2,
				y2: this.headerrightextrusion.y2,
				instanceId: data.model.InstanceId
			};

			this.client.hliteObject(obj);
		};
		this.putRightHeaderInFront = function () {
			if (this.headerrightextrusion.svg === undefined) {
				return;
			}
			this.headerrightextrusion.svg.front();
		};

		this.renderLeftMods = function () {
			var x;
			var y;
			var w;
			var lh;
			var rh;
			var color = this.color;

			if (this.dataleft.model["INNER.WIDTH"] != undefined) {
				w = Number(this.dataleft.model["INNER.WIDTH"].value);
				if (w == undefined) {
					w = 1;
				}
			}
			if (this.dataleft.model["INNER.LEFT.HEIGHT"] != undefined) {
				lh = Number(this.dataleft.model["INNER.LEFT.HEIGHT"].value);
				if (lh == undefined) {
					lh = 1;
				}
			}
			if (this.dataleft.model["INNER.RIGHT.HEIGHT"] != undefined) {
				rh = Number(this.dataleft.model["INNER.RIGHT.HEIGHT"].value);
				if (rh == undefined) {
					rh = 1;
				}
			}
			if (this.data.model["EXTERIOR.COLOR"] != undefined) {
				color = this.data.model['EXTERIOR.COLOR'].value;
			};
			if (color === undefined) {
				color = "WH";
			}

			w = this.client.convert(w);
			lh = this.client.convert(lh);
			rh = this.client.convert(rh);

			x = this.x;
			y = this.y + (rh - lh);

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
			this.leftopenings.lh = lh;
			this.leftopenings.rh = rh;
			this.leftopenings.x1 = x;
			this.leftopenings.y1 = y;
			this.leftopenings.x2 = x + w;
			this.leftopenings.y2 = this.leftopenings.y1 + lh;
			this.leftopenings.y3 = this.leftopenings.y2 - rh;

			this.leftopenings.svg = this.leftopenings.container.polygon([this.leftopenings.x1, this.leftopenings.y1,
				this.leftopenings.x1, this.leftopenings.y2,
				this.leftopenings.x2, this.leftopenings.y2,
				this.leftopenings.x2, this.leftopenings.y3
			]);
			this.leftopenings.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			this.leftopenings.svg.stroke(this.hlite);

			var lstmods = this.dataleft.model['WALLMODS'].valueList;
			var objmods = core.getAllModels(this.dataleft);
			if (lstmods === undefined) {
				return;
			}
			if (objmods === undefined) {
				return;
			}

			lstmods.sort(function (a, b) {
				return (Number(a.Position) > Number(b.Position)) ? 1 : ((Number(b.Position) > Number(a.Position)) ? -1 : 0);
			});

			x = this.leftopenings.x1;
			y = this.leftopenings.y1;
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
		this.renderRightMods = function () {
			var x;
			var y;
			var w;
			var lh;
			var rh;
			var color = this.color;

			if (this.dataright.model["INNER.WIDTH"] != undefined) {
				w = Number(this.dataright.model["INNER.WIDTH"].value);
				if (w == undefined) {
					w = 1;
				}
			}
			if (this.dataright.model["INNER.LEFT.HEIGHT"] != undefined) {
				lh = Number(this.dataright.model["INNER.LEFT.HEIGHT"].value);
				if (lh == undefined) {
					lh = 1;
				}
			}
			if (this.dataright.model["INNER.RIGHT.HEIGHT"] != undefined) {
				rh = Number(this.dataright.model["INNER.RIGHT.HEIGHT"].value);
				if (rh == undefined) {
					rh = 1;
				}
			}
			if (this.data.model["EXTERIOR.COLOR"] != undefined) {
				color = this.data.model['EXTERIOR.COLOR'].value;
			};
			if (color === undefined) {
				color = "WH";
			}

			w = this.client.convert(w);
			lh = this.client.convert(lh);
			rh = this.client.convert(rh);

			x = this.x;
			y = this.y;

			if (this.starterrightextrusion.container != undefined) {
				x = this.starterrightextrusion.x2;
				y = this.starterrightextrusion.y3;
			}

			this.rightopenings.container = this.container.nested();
			this.rightopenings.w = w;
			this.rightopenings.lh = lh;
			this.rightopenings.rh = rh;
			this.rightopenings.x1 = x;
			this.rightopenings.y1 = y;
			this.rightopenings.x2 = x + w;
			this.rightopenings.y2 = this.rightopenings.y1 + lh;
			this.rightopenings.y3 = this.rightopenings.y2 - rh;

			this.rightopenings.svg = this.rightopenings.container.polygon([this.rightopenings.x1, this.rightopenings.y1,
				this.rightopenings.x1, this.rightopenings.y2,
				this.rightopenings.x2, this.rightopenings.y2,
				this.rightopenings.x2, this.rightopenings.y3
			]);
			this.rightopenings.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			this.rightopenings.svg.stroke(this.hlite);

			var lstmods = this.dataright.model['WALLMODS'].valueList;
			var objmods = core.getAllModels(this.dataright);
			if (lstmods === undefined) {
				return;
			}
			if (objmods === undefined) {
				return;
			}

			lstmods.sort(function (a, b) {
				return (Number(a.Position) > Number(b.Position)) ? 1 : ((Number(b.Position) > Number(a.Position)) ? -1 : 0);
			});

			x = this.rightopenings.x1;
			y = this.rightopenings.y1;
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
				var mod = this.getClient().draw(amod, x, y, this.rightopenings.container);
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

		this.renderGablePost = function () {
			var l;
			var lh;
			var rh;
			var w;
			var x;
			var y;
			var tw = 0;
			var color = "WH";

			var data = core.getModel(this.getData(), "exGablePost");
			if (data === undefined) {
				return;
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
				l = Number(data.model["LENGTH"].value);
				if (l === undefined) {
					l = 1;
				}
			}
			w = this.client.convert(w);
			l = this.client.convert(l);

			x = this.x;
			y = this.y;
			if (this.starterleftextrusion.container != undefined) {
				x = this.starterleftextrusion.x2;
			}

			color = this.color;
			this.gablepostextrusion.container = this.container;
			this.gablepostextrusion.w = w;
			this.gablepostextrusion.lh = l;
			this.gablepostextrusion.rh = l;
			this.gablepostextrusion.y1 = y;
			this.gablepostextrusion.x2 = this.gablepostextrusion.x1 + w;
			this.gablepostextrusion.y2 = this.gablepostextrusion.y1 + this.gablepostextrusion.lh;
			this.gablepostextrusion.y3 = this.gablepostextrusion.y1;

			this.gablepostextrusion.svg = this.gablepostextrusion.container.polygon([this.gablepostextrusion.x1, this.gablepostextrusion.y1,
				this.gablepostextrusion.x1, this.gablepostextrusion.y2,
				this.gablepostextrusion.x2, this.gablepostextrusion.y2,
				this.gablepostextrusion.x2, this.gablepostextrusion.y3
			]);

			this.gablepostextrusion.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			// use to put a bounding box when its selected  --- for hliting
			var obj = {
				x1: this.gablepostextrusion.x1,
				y1: this.gablepostextrusion.y1,
				x2: this.gablepostextrusion.x2,
				y2: this.gablepostextrusion.y2,
				instanceId: data.model.InstanceId
			};

			this.client.hliteObject(obj);

		};
		this.putGablePostInFront = function () {
			if (this.gablepostextrusion.svg === undefined) {
				return;
			}
			this.gablepostextrusion.svg.front();
		};
		this.renderStarterLeft = function () {
			var l;
			var w;
			var x;
			var y;
			var color = "WH";

			var data = core.getModel(this.getData(), "modWallStarterGableLeft");
			if (data === undefined) return;

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
			}
			if (data.model["LENGTH"] != undefined) {
				l = Number(data.model["LENGTH"].value);
			}
			w = this.client.convert(w);
			l = this.client.convert(l);

			x = this.x;
			y = this.y;
			if (this.leftopenings.container != undefined) {
				x = this.leftopenings.x2;
				y = this.leftopenings.y3;
			}

			var diff = w * this.pitch;
			this.starterleftextrusion.container = this.container;
			this.starterleftextrusion.w = w;
			this.starterleftextrusion.l = l;
			this.starterleftextrusion.x1 = x;
			this.starterleftextrusion.y1 = y;
			this.starterleftextrusion.x2 = this.starterleftextrusion.x1 + w;
			this.starterleftextrusion.y2 = this.starterleftextrusion.y1 + this.starterleftextrusion.l;
			this.starterleftextrusion.y3 = this.starterleftextrusion.y1 + diff;

			this.starterleftextrusion.svg = this.starterleftextrusion.container.polygon([this.starterleftextrusion.x1, this.starterleftextrusion
				.y1,
				this.starterleftextrusion.x1, this.starterleftextrusion.y2,
				this.starterleftextrusion.x2, this.starterleftextrusion.y2,
				this.starterleftextrusion.x2, this.starterleftextrusion.y3
			]);

			this.starterleftextrusion.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});

			// use to put a bounding box when its selected  --- for hliting
			var obj = {
				x1: this.starterleftextrusion.x1,
				y1: this.starterleftextrusion.y1,
				x2: this.starterleftextrusion.x2,
				y2: this.starterleftextrusion.y2,
				instanceId: data.model.InstanceId
			};

			this.client.hliteObject(obj);

		};
		this.putStarterLeftInFront = function () {
			if (this.starterleftextrusion.svg === undefined) {
				return;
			}
			this.starterleftextrusion.svg.front();
		};
		this.renderStarterRight = function () {
			var l;
			var w;
			var x;
			var y;
			var color = "WH";

			var data = core.getModel(this.getData(), "modWallStarterGableRight");
			if (data === undefined) return;

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
			}
			if (data.model["LENGTH"] != undefined) {
				l = Number(data.model["LENGTH"].value);
			}
			w = this.client.convert(w);
			l = this.client.convert(l);

			x = this.x;
			y = this.y;
			if (this.gablepostextrusion.container != undefined) {
				x = this.gablepostextrusion.x2;
				y = this.gablepostextrusion.y3;
			}

			var diff = w * this.pitch;
			this.starterrightextrusion.container = this.container;
			this.starterrightextrusion.w = w;
			this.starterrightextrusion.l = l;
			this.starterrightextrusion.x1 = x;
			this.starterrightextrusion.y1 = y;
			this.starterrightextrusion.x2 = this.starterrightextrusion.x1 + w;
			this.starterrightextrusion.y2 = this.starterrightextrusion.y1 + this.starterrightextrusion.l;
			this.starterrightextrusion.y3 = this.starterrightextrusion.y1 + diff;

			this.starterrightextrusion.svg = this.starterrightextrusion.container.polygon([this.starterrightextrusion.x1, this.starterrightextrusion
				.y1,
				this.starterrightextrusion.x1, this.starterrightextrusion.y2,
				this.starterrightextrusion.x2, this.starterrightextrusion.y2,
				this.starterrightextrusion.x2, this.starterrightextrusion.y3
			]);

			this.starterrightextrusion.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});

			// use to put a bounding box when its selected  --- for hliting
			var obj = {
				x1: this.starterrightextrusion.x1,
				y1: this.starterrightextrusion.y1,
				x2: this.starterrightextrusion.x2,
				y2: this.starterrightextrusion.y2,
				instanceId: data.model.InstanceId
			};

			this.client.hliteObject(obj);

		};
		this.putStarterRightInFront = function () {
			if (this.starterrightextrusion.svg === undefined) {
				return;
			}
			this.starterrightextrusion.svg.front();
		};

		this.renderFloorLeftTrack = function () {
			var x1 = 0;
			//		var y1 = this.leftopenings.y2;
			var y1 = this.ground;
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

			var wallmods = this.dataleft.model['WALLMODS'].valueList;
			var objmods = core.getModels(this.dataleft, 'modWallModule');
			if (wallmods != undefined && objmods != undefined) {
				wallmods.sort(function (a, b) {
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
		this.renderFloorRightTrack = function () {
			var x1 = 0;
			var y1 = this.rightopenings.y2;
			//			var y1 = this.ground;
			var x2 = 0;
			var y2 = 0;
			var started = false;

			var xdata = core.getModel(this.getData(), "wsFloorTrack");
			if (xdata === undefined) {
				return;
			}

			if (this.starterrightextrusion.container != undefined) {
				if (!started) {
					x1 = this.starterrightextrusion.x1;
					x2 = this.starterrightextrusion.x2;
				} else {
					x2 = this.starterextrusion.x2;
				}
				started = true;
			}

			var wallmods = this.dataright.model['WALLMODS'].valueList;
			var objmods = core.getModels(this.dataright, 'modWallModule');
			if (wallmods != undefined && objmods != undefined) {
				wallmods.sort(function (a, b) {
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

	};
});