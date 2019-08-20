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
		this.openings = {
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
			var l = 0;
			var d = "1";
			var b = "1";
			var direction = "1";
			var tw = 0;
			var px = this.x;
			var py = this.y;
			var color = "WH";
			var rs = "";
			var fb = false;

			this.container = this.getParent().nested();
			var data = this.getData();
			this.isReady = true;

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};
			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
				if (w == undefined) {
					w = 1;
				}
			}
			if (data.model["DEPTH"] != undefined) {
				d = Number(data.model["DEPTH"].value);
				if (d == undefined) {
					d = 1;
				}
			}
			if (data.model["LENGTH"] != undefined) {
				l = Number(data.model["LENGTH"].value);
				if (l == undefined) {
					l = 1;
				}
			}

			if (w <= 0) return;
			if (l <= 0) return;

			l = this.client.convert(l);
			w = this.client.convert(w);
			d = this.client.convert(d);
			b = this.client.convert(1);

			this.w = w;
			this.l = l;
			this.bx1 = x;
			this.by1 = y;
			this.bx2 = this.bx1 + w + (b * 2);
			this.by2 = this.by1 - b;
			this.by3 = this.by1;
			this.x1 = x + b;
			this.y1 = y - b;
			this.x2 = this.x1 + d;
			this.y2 = this.y1 - l - (b * 2);
			this.y3 = this.y1;

			this.color = color;

			this.basesvg = this.container.polygon([this.bx1, this.by1,
				this.bx1, this.by2,
				this.bx2, this.by2,
				this.bx2, this.by3
			]);
			this.basesvg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": ssBase.color['BL'].htmlcolor,
				"stroke-width": 1
			});

			this.svg = this.container.polygon([this.x1, this.y1,
				this.x1, this.y2,
				this.x2, this.y2,
				this.x2, this.y3
			]);
			this.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": ssBase.color['BL'].htmlcolor,
				"stroke-width": 1
			});

			this.isReady = true;

			// use to put a bounding box when its selected  --- for hliting
			this.x1 = this.x1;
			this.y1 = this.y1;
			this.x2 = this.x2;
			this.y2 = this.y2;
			this.instanceId = data.model.InstanceId;
			this.client.hliteObject(this);
			return this;

		};

	};

});