sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase",
	"zss5lgraphics/libs/ssgraph/common/ssSash"
], function (ssMath, core, ssBase, ssSash) {
	return function (myParent, x, y) {
		this.data = myParent.getData();
		this.x = x;
		this.y = y;
		this.isReady = false;
		if (this.x === undefined) {
			this.x = 0;
		}
		if (this.y === undefined) {
			this.y = 0;
		}
		this.ssparent = myParent;
		this.client = myParent.client;
		this.container = undefined;
		this.frameo = {
			container: undefined,
			x: 0,
			y: 0
		};
		this.framei = {
			container: undefined,
			x: 0,
			y: 0
		};
		this.sashes = [];

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
		this.render = function () {
			var data = this.getData();
			var w = 0;
			var h = 0;
			var t = 0;
			var color = "WH";

			if (!this.getParent().isReady) return this;

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
				if (w == undefined) {
					w = 1;
				}
			}
			if (data.isOffsetSide != undefined && data.isOffsetSide) {
				if (data.model["OFFSET.WIDTH"] != undefined) {
					w = Number(data.model["OFFSET.WIDTH"].value);
					if (w == undefined) {
						w = 1;
					}
				}
			}

			if (data.model["HEIGHT"] != undefined) {
				h = Number(data.model["HEIGHT"].value);
				if (h == undefined) {
					h = 1;
				}
			}
			if (data.model["FRAME.THICKNESS"] != undefined) {
				t = Number(data.model["FRAME.THICKNESS"].value);
				if (t == undefined) {
					t = 1;
				}
			}

			if (h <= 0) return this;
			if (w <= 0) return this;

			if (data.model["FRAME.COLOR"] != undefined) {
				color = data.model['FRAME.COLOR'].value;
			} else {
				if (data.model["EXTERIOR.COLOR"] != undefined) {
					color = data.model['EXTERIOR.COLOR'].value;
				}
			}

			w = this.getParent().client.convert(w);
			h = this.getParent().client.convert(h);
			t = this.getParent().client.convert(t);

			this.frameo.container = this.getParent().container.nested();
			this.frameo.w = w;
			this.frameo.h = h;
			this.frameo.svg = this.frameo.container.rect(w, h);
			this.frameo.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			this.frameo.svg.move(this.x, this.y);

			this.framei.container = this.frameo.container;
			this.framei.w = w - (2 * t);
			this.framei.h = h - (2 * t);
			this.framei.x = this.x + t;
			this.framei.y = this.y + t;

			this.framei.svg = this.framei.container.rect(this.framei.w, this.framei.h);
			this.framei.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"fill-opacity": "0.1",
				"stroke-width": 1
			});
			this.framei.svg.move(this.framei.x, this.framei.y);

			this.isReady = true;

			// use to put a bounding box when its selected  --- for hliting
			this.x1 = this.x;
			this.y1 = this.y;
			this.x2 = this.x + w;
			this.y2 = this.y + h;
			this.instanceId = data.model.InstanceId;
			this.client.hliteObject(this);

			return this;
		};
	};

});