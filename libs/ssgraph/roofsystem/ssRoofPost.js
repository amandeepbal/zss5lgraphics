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
			var px = this.x;
			var py = this.y;
			var b = this.client.convert(3);
			var ox = 0;
			var oy = 0;

			this.container = this.getParent().nested();
			var data = this.getData();
			this.isReady = true;

			if (data.model["OFFSETX"] != undefined) {
				ox = data.model["OFFSETX"].value;
			}
			if (data.model["OFFSETY"] != undefined) {
				oy = data.model["OFFSETY"].value;
			}
			ox = this.client.convert(ox);
			oy = this.client.convert(oy);

			this.x1 = px + ox;
			this.y1 = py - oy;

			if (this.y1 < 0) {
				this.y1 = 0;
			};
			if (this.x1 > this.x2) {
				this.x1 = this.x2;
			};

			this.x2 = this.x1 + b;
			this.y2 = this.y2 + b;
			this.svg = this.container.polygon([this.x1, this.y1,
				this.x1, this.y2,
				this.x2, this.y2,
				this.x2, this.y1
			]);
			this.svg.attr({
				fill: "f000000",
				"stroke": ssBase.color['SC'].htmlcolor,
				"stroke-width": 1
			});

			this.isReady = true;

			// use to put a bounding box when its selected  --- for hliting
			this.instanceId = data.model.InstanceId;
			this.client.hliteObject(this);
			return this;

		};

	};

});