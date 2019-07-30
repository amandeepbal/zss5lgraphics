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
			var tw = 0;
			var px = this.x;
			var py = this.y;
			var color = "WH";
			var usetextures = false;
			var rs = "";
			var fb = false;

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

			if (w <= 0) return;
			if (l <= 0) return;

			l = this.client.convert(l);
			w = this.client.convert(w);

			this.w = w;
			this.l = l;
			this.x1 = x;
			this.y1 = y;
			this.x2 = this.x1 + w;
			this.y2 = this.y1 + l;
			this.y3 = this.y1;
			this.color = color;

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