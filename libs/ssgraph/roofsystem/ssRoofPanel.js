sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase"
], function (ssMath, core, ssBase) {
	return function (client, data, myParent, x, y) {
		this.data = data;
		this.client = client;
		this.x = x;
		this.y = y;
		this.ssparent = myParent;
		this.container = undefined;
		this.openings = {
			container: undefined,
			svg: undefined,
			x: x,
			y: y
		};
		this.fanbeam = {
			container: undefined,
			svg: undefined,
			x: x,
			y: y
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
			var l = 0;
			var tw = 0;
			var px = this.x;
			var py = this.y;
			var color = "WH";
			var usetextures = false;
			var rs = "";
			var fb = false;
			var a = "B";
			var ao = 0;
			var rstyle = "";

			this.container = this.getParent().nested();
			var data = this.getData();
			this.isReady = true;

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
			if (data.model["ROOF.SYSTEM.TYPE"] != undefined) {
				rs = data.model['ROOF.SYSTEM.TYPE'].value;
			};
			if (data.model["ROOF.STYLE"] != undefined) {
				rstyle = data.model['ROOF.STYLE'].value;
			};

			if (data.model["ALIGNMENT"] != undefined) {
				a = data.model["ALIGNMENT"].value;
			}
			if (data.model["OFFSET"] != undefined) {
				ao = data.model["OFFSET"].value;
			}
			var rooflength = data.model.parent.model['LENGTH'].value;
			switch (rs) {
			case "1":
				if (data.model["EXTERIOR.TEXTURE"] != undefined) {
					color = data.model["EXTERIOR.TEXTURE"].value;
				};
				break;
			case "3":
				if (data.model["ACRYLIC.COLOR"] != undefined) {
					color = data.model["ACRYLIC.COLOR"].value;
				};
				break;
			case "5":
				color = "WHG";
				break;
			}

			if (w <= 0) return;
			if (l <= 0) return;

			l = this.client.convert(l);
			w = this.client.convert(w);

			this.w = w;
			this.l = l;
			if (data.isGable) {
				this.w = l;
				this.l = w;
			}

			if (!data.isGable) {
				this.x1 = x;
				this.y1 = y;
				this.x2 = this.x1 + this.w;
				this.y2 = this.y1 + this.l;
				this.y3 = this.y1;
				this.color = color;

				this.ox1 = this.x1;
				this.ox2 = this.x2;
				this.oy1 = this.y1;
				this.oy2 = this.y2;
				this.oy3 = this.y3;

				if (a != 'B') {
					if (a === 'F') {
						var lc = rooflength;
						lc = this.client.convert(lc);
						var oy = lc - this.l;
						this.y1 = this.y1 + oy;
						this.y2 = this.y1 + l;
						this.y3 = this.y1;
					}
					if (a === 'C') {
						ao = this.client.convert(ao);
						this.y1 = this.y1 + ao;
						this.y2 = this.y1 + l;
						this.y3 = this.y1;
					}
				}
			}
			if (data.isGable) {
				var lc = rooflength;
				lc = this.client.convert(lc);
				var ox = lc - this.w;
				if (data.side === 'L') {
					this.x1 = x + ox;
					this.y1 = y;
					this.x2 = this.x1 + this.w;
					this.y2 = this.y1 + this.l;
					this.y3 = this.y1;
					this.color = color;

					this.ox1 = this.x1;
					this.ox2 = this.x2;
					this.oy1 = this.y1;
					this.oy2 = this.y2;
					this.oy3 = this.y3;
					if (a === 'F') {
						this.x1 = x;
						this.x2 = this.x1 + this.w;
					}
					if (a === 'C') {
						ao = this.client.convert(ao);
						this.x1 = x + ao;
						this.x2 = this.x1 + l;
					}
				}
				if (data.side === 'R') {
					this.y1 = y;
					this.y2 = this.y1 + this.l;
					this.y3 = this.y1;
					this.color = color;

					if (a === 'F') {
						this.x1 = x + ox;
						this.x2 = this.x1 + this.w;
					}
					if (a === 'B') {
						this.x1 = x;
						this.x2 = this.x1 + this.w;
					}
					if (a === 'C') {
						ao = this.client.convert(ao);
						this.x1 = x + ao;
						this.x2 = this.x1 + l;
					}
					this.ox1 = this.x1;
					this.ox2 = this.x2;
					this.oy1 = this.y1;
					this.oy2 = this.y2;
					this.oy3 = this.y3;
				}
			}

			this.svg = this.container.polygon([this.x1, this.y1,
				this.x1, this.y2,
				this.x2, this.y2,
				this.x2, this.y3
			]);
			this.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": ssBase.color['SC'].htmlcolor,
				"stroke-width": 1
			});

			this.renderFanBeam();
			this.renderSkylights();
			this.isReady = true;

			// use to put a bounding box when its selected  --- for hliting
			this.instanceId = data.model.InstanceId;
			this.client.hliteObject(this);
			this.showItemLabel(this);
			return this;

		};
		this.renderFanBeam = function () {
			var h;
			var w;
			var x;
			var lo;
			var y;
			var color = "WH";

			var data = core.getModel(this.getData(), "rsFanBeam");
			if (data === undefined) return;

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (data.model["DEPTH"] != undefined) {
				w = Number(data.model["DEPTH"].value);
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
			if (data.model["LEFT.OFFSET"] != undefined) {
				lo = Number(data.model["LEFT.OFFSET"].value);
				if (lo < 0) {
					lo = 1;
				}
			}
			w = this.client.convert(w);
			h = this.client.convert(h);
			lo = this.client.convert(lo);

			this.fanbeam.container = this.container;
			x = this.x1 + lo;
			y = this.y1;
			this.fanbeam.w = w;
			this.fanbeam.h = h;
			if (data.isGable) {
				this.fanbeam.w = h;
				this.fanbeam.h = w;
				x = this.x1;
				y = this.y1 + lo;
			}

			this.fanbeam.x1 = x;
			this.fanbeam.y1 = y;
			this.fanbeam.x2 = this.fanbeam.x1 + w;
			this.fanbeam.y2 = this.fanbeam.y1 + this.fanbeam.h;
			this.fanbeam.y3 = this.fanbeam.y1;

			this.fanbeam.svg = this.fanbeam.container.polygon([this.fanbeam.x1, this.fanbeam.y1,
				this.fanbeam.x1, this.fanbeam.y2,
				this.fanbeam.x2, this.fanbeam.y2,
				this.fanbeam.x2, this.fanbeam.y3
			]);

			this.fanbeam.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});

			var obj = {
				x1: this.fanbeam.x1,
				y1: this.fanbeam.y1,
				x2: this.fanbeam.x2,
				y2: this.fanbeam.y2,
				instanceId: data.model.InstanceId
			};
			this.client.hliteObject(obj);

		};
		this.renderSkylights = function () {
			var lites = core.getModels(this.getData(), 'rsSkylight');
			if (lites === undefined) {
				return;
			}
			for (var i = 0; i < lites.length; i++) {
				var alite = lites[i];
				if (alite.model != undefined) {
					this.renderSkylight(alite);
				}
			}
		};
		this.renderSkylight = function (alite) {
			var h;
			var w;
			var x;
			var y;
			var color = "WH";
			var lo;
			var to;

			if (alite.model["EXTRUSION.COLOR"] != undefined) {
				color = alite.model['EXTRUSION.COLOR'].value;
			};

			if (alite.model["WIDTH"] != undefined) {
				w = Number(alite.model["WIDTH"].value);
			}
			if (alite.model["LENGTH"] != undefined) {
				h = Number(alite.model["LENGTH"].value);
			}
			if (alite.model["TOP.OFFSET"] != undefined) {
				to = Number(alite.model["TOP.OFFSET"].value);
				if (to < 0) {
					lo = 1;
				}
			}
			if (alite.model["LEFT.OFFSET"] != undefined) {
				lo = Number(alite.model["LEFT.OFFSET"].value);
				if (lo < 0) {
					lo = 1;
				}
			}
			w = this.client.convert(w);
			h = this.client.convert(h);
			lo = this.client.convert(lo);
			to = this.client.convert(to);

			x = this.x1 + lo;
			y = this.y1 + to;

			//			color = this.color;
			var theLite = {};
			theLite.container = this.container;
			theLite.w = w;
			theLite.h = h;
			theLite.x1 = x;
			theLite.y1 = y;
			theLite.x2 = theLite.x1 + w;
			theLite.y2 = theLite.y1 + theLite.h;
			theLite.y3 = theLite.y1;

			theLite.svg = theLite.container.polygon([theLite.x1, theLite.y1,
				theLite.x1, theLite.y2,
				theLite.x2, theLite.y2,
				theLite.x2, theLite.y3
			]);

			theLite.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});

			var obj = {
				x1: theLite.x1,
				y1: theLite.y1,
				x2: theLite.x2,
				y2: theLite.y2,
				instanceId: alite.model.InstanceId
			};
			this.client.hliteObject(obj);

		};
		this.showItemLabel = function (obj) {
			if (data.showLabels === undefined) {
				return;
			}
			if (!data.showLabels) {
				return;
			}
			var sText = this.data.model.label + " (" + core.formatMeasurement(this.data.model['WIDTH'].value) + " x " +
				core.formatMeasurement(this.data.model['LENGTH'].value) + ")";
			// Draw building
			var acontainer = this.getParent().nested();
			this.label = ssBase.showLabel(acontainer, sText, 'C', obj.x1, obj.y1, obj.x2, obj.y2);
		}
	};

});