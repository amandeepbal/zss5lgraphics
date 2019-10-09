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

		this.kneewall = undefined;
		this.transom = undefined;
		this.tracks = [];
		this.mod = undefined;
		this.isReady = false;
		this.w = 0;
		this.h = 0;
		this.hlite = client.dim;

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

			// if left and right heights are different, then its a trapzoid and we need to get angles for our cuts
			this.trap = undefined;
			if (lh != rh) {
				this.trap = ssMath.calcTrap(lh, rh, w);
			}

			this.isRight = false;
			if (rh > lh) {
				this.isRight = true;
			}
			// add in mod openings
			this.renderOpenings();

			this.isReady = true;

			// use to put a bounding box when its selected  --- for hliting
			this.x1 = this.openings.x1;
			this.y1 = this.openings.y1;
			this.x2 = this.openings.x2;
			this.y2 = this.openings.y2;

			this.instanceId = data.model.InstanceId;
			this.client.hliteObject(this);
			return this;

		};
		this.renderOpenings = function () {
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

			if (this.trap != undefined) {
				if (!this.isRight) {
					drop = w * this.trap.pitch;
				} else {
					rise = (w * this.trap.pitch) * -1;
				}
			}

			x = this.x;
			y = this.y;

			this.openings.container = this.container.nested();
			this.openings.w = w;
			this.openings.drop = drop;
			this.openings.rise = rise;
			this.openings.lh = lh;
			this.openings.rh = rh;
			this.openings.x1 = x;
			this.openings.y1 = y;
			this.openings.x2 = this.openings.x1 + w;
			this.openings.y2 = this.openings.y1 + lh;
			this.openings.y3 = this.openings.y2 - rh;

			this.openings.svg = this.openings.container.polygon([this.openings.x1, this.openings.y1,
				this.openings.x1, this.openings.y2,
				this.openings.x2, this.openings.y2,
				this.openings.x2, this.openings.y3
			]);
			this.openings.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				//				"fill-opacity": 0.1,
				"stroke": "#000",
				"stroke-width": 1
			});
			//			this.openings.svg.stroke(this.hlite);
			//			if(this.hlite != this.client.dim){
			//			  this.openings.svg.front();
			//			}  

			this.renderStarterChannel();
			this.renderWindowArea(); //if there
			this.renderDoorOpening(); //if there
			this.renderReceiverChannel();
			this.renderTransomArea();
			this.renderKneewall();
			//			this.transomArea.openings.svg.front();
			//			this.opening1.openings.svg.front();

			this.starterchannel.svg.backward();
			this.receiverchannel.svg.backward();
		};

		this.renderStarterChannel = function () {
			var h = this.openings.lh;
			var lh;
			var rh;
			var w;
			var x;
			var y;
			var tw = 0;
			var drop = 0;
			var rise = 0;
			var color = "WH";
			w = 0.50;
			w = this.client.convert(w);

			lh = h;
			rh = h;
			if (this.trap != undefined) {
				lh = h;
				if (!this.isRight) {
					drop = w * this.trap.pitch;
					rh = rh - drop;
				} else {
					rise = (w * this.trap.pitch) * -1;
					lh = lh - rise;

				}
			}

			x = this.openings.x1;
			y = this.openings.y1;

			color = this.color;
			this.starterchannel.container = this.container;
			this.starterchannel.w = w;
			this.starterchannel.lh = lh;
			this.starterchannel.rh = rh;
			this.starterchannel.drop = drop;
			this.starterchannel.rise = rise;
			if (!this.isRight) {
				this.starterchannel.x1 = x;
				this.starterchannel.y1 = y;
				this.starterchannel.x2 = this.starterchannel.x1 + w;
				this.starterchannel.y2 = this.starterchannel.y1 + this.starterchannel.lh;
				this.starterchannel.y3 = this.starterchannel.y1 + this.starterchannel.drop;
			} else {
				this.starterchannel.x1 = x;
				this.starterchannel.y1 = y;
				this.starterchannel.x2 = this.starterchannel.x1 + w;
				this.starterchannel.y2 = this.starterchannel.y1 + this.starterchannel.lh;
				this.starterchannel.y3 = this.starterchannel.y1 - this.starterchannel.rise;

			}
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

			//			this.headerextrusion.svg.front();
		};

		this.renderWindowArea = function () {
			var h = 0;
			var data = core.getModel(this.getData(), "modWindowArea");
			if (data === undefined) {
				data = core.getModel(this.getData(), "modOpening");
				if (data === undefined) {
					return;
				}
			}
			if (data === undefined) {
				return;
			}
			if (data.model["HEIGHT"] != undefined) {
				h = Number(data.model["HEIGHT"].value);
				if (h == undefined) {
					h = 1;
				}
			}
			h = this.client.convert(h);

			var kh = 0;
			var kneewall = core.getModel(this.getData(), 'modKneewall');
			if (kneewall != undefined) {
				if (kneewall.model != undefined) {
					kh = kneewall.model['HEIGHT'].value;
					kh = this.client.convert(kh);
				}
			}

			x = this.openings.x1;
			y = this.openings.y1 + this.openings.lh - h - kh;

			this.opening1 = this.getClient().draw(data, x, y, this.openings.container);
			//            this.opening1.openings.svg.back();
		};
		this.renderDoorOpening = function () {
			var h = 0;
			//			var data = core.getModel(this.getData(), "modDoorOpening");
			var data = core.getModel(this.getData(), "doorEntry");
			if (data === undefined) {
				return;
			}
			if (data.model["HEIGHT"] != undefined) {
				h = Number(data.model["HEIGHT"].value);
				if (h == undefined) {
					h = 1;
				}
			}
			h = this.client.convert(h);
			x = this.openings.x1;
			y = this.openings.y1 + this.openings.lh - h;
			this.opening1 = this.getClient().draw(data, x, y, this.openings.container);
		};

		this.renderReceiverChannel = function () {
			var h = this.openings.rh;
			var lh;
			var rh;
			var w;
			var x;
			var y;
			var tw = 0;
			var drop = 0;
			var rise = 0;
			var color = "WH";
			w = 0.50;
			w = this.client.convert(w);

			lh = h;
			rh = h;
			if (this.trap != undefined) {
				if (!this.isRight) {
					drop = w * this.trap.pitch;
					rh = lh - drop;
				} else {
					rise = (w * this.trap.pitch) * -1;
					lh = lh - rise;
				}
			}

			x = this.openings.x2 - w;
			y = this.openings.y1 + this.openings.drop - this.openings.rise;

			color = this.color;
			this.receiverchannel.container = this.container;
			this.receiverchannel.w = w;
			this.receiverchannel.lh = lh;
			this.receiverchannel.rh = rh;
			this.receiverchannel.drop = drop;
			this.receiverchannel.rise = rise;
			if (!this.isRight) {
				this.receiverchannel.x1 = x;
				this.receiverchannel.y1 = y;
				this.receiverchannel.x2 = this.receiverchannel.x1 + w;
				this.receiverchannel.y2 = this.receiverchannel.y1 + this.receiverchannel.lh;
				this.receiverchannel.y3 = this.receiverchannel.y1 + this.receiverchannel.drop;
			} else {
				this.receiverchannel.x1 = x;
				this.receiverchannel.y1 = y;
				this.receiverchannel.x2 = this.receiverchannel.x1 + w;
				this.receiverchannel.y2 = this.receiverchannel.y1 + this.receiverchannel.lh;
				this.receiverchannel.y3 = this.receiverchannel.y1 - this.receiverchannel.rise;

			}
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

			//			this.headerextrusion.svg.front();
		};
		this.renderKneewall = function (x, y) {
			var x;
			var y;
			var w;
			var h;
			var data = core.getModel(this.getData(), "modKneewall");
			if (data === undefined) {
				return;
			}

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
		};
		this.renderTransomArea = function (x, y) {
			var x;
			var y;
			var w;
			var lh;
			var rh;
			var hp;

			var data = core.getModel(this.getData(), "modTransomArea");
			if (data === undefined) {
				data = core.getModel(this.getData(), "modTransom");
				if (data === undefined) {
					return;
				}
			}

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
			y = this.openings.y1;
			this.transomArea = this.getClient().draw(data, x, y, this.openings.container);
		};

	};
});