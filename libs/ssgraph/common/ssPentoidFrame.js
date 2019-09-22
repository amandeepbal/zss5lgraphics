sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase",
	"zss5lgraphics/libs/ssgraph/common/ssSash"
], function (ssMath, core, ssBase, ssSash) {
	return function (myParent, x, y) {
		this.data = myParent.getData();
		this.client = myParent.client;
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
			var lh = 0;
			var rh = 0;
			var tl = 0;
			var iw = 0;
			var ilh = 0;
			var irh = 0;
			var itl = 0;

			var t = 0;
			var cb = 0;
			var color = "WH";
			var drop = 0;

			if (!this.getParent().isReady) return this;

			if (data.model["FRAME.THICKNESS"] != undefined) {
				t = Number(data.model["FRAME.THICKNESS"].value);
				if (t == undefined) {
					t = 1;
				}
			}
			if (data.model["FRAME.COLOR"] != undefined) {
				color = data.model['FRAME.COLOR'].value;
			}

			if (data.model["CUTBACK"] != undefined) {
				var cb = Number(data.model["CUTBACK"].value);
				if (cb == undefined) {
					cb = 0.75;
				}
			}
			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
				if (w == undefined) {
					w = 1;
				}
			}
			if (data.model["LONG.HEIGHT"] != undefined) {
				lh = Number(data.model["LONG.HEIGHT"].value);
				if (lh == undefined) {
					lh = 1;
				}
			}
			if (data.model["SHORT.HEIGHT"] != undefined) {
				rh = Number(data.model["SHORT.HEIGHT"].value);
				if (rh == undefined) {
					rh = 1;
				}
			}

			if (lh <= 0) return this;
			if (rh <= 0) return this;
			if (w <= 0) return this;

			w = this.client.convert(w);
			lh = this.client.convert(lh);
			rh = this.client.convert(rh);
			this.lh = lh;
			this.rh = rh;
			this.w = w;

			t = this.client.convert(t);
			if (cb <= 0) {
				cb = 0.75;
			}
			cb = this.client.convert(cb);

			this.frameo = {
				container: undefined,
				svg: undefined
			};
			this.frameo.container = this.getParent().container.nested();
			this.frameo.w = w;
			this.frameo.hw = w/2;
			this.frameo.lh = lh;
			this.frameo.rh = rh;
			this.frameo.x1 = x;
			this.frameo.y1 = y;
			this.frameo.x2 = this.frameo.x1 + w;
			this.frameo.y2 = this.frameo.y1 + rh;
			this.frameo.y3 = this.frameo.y2 - rh;
			this.frameo.y4 = this.frameo.y2 - lh;

			this.frameo.x3 = this.frameo.x1 + this.frameo.hw;
			this.frameo.svg = this.frameo.container.polygon([
				this.frameo.x1, this.frameo.y1,
				this.frameo.x1, this.frameo.y2,
				this.frameo.x2, this.frameo.y2,
				this.frameo.x2, this.frameo.y3,
				this.frameo.x3, this.frameo.y4
			]);

			this.frameo.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});

			// if left and right heights are different, then its a trapzoid and we need to get angles for our cuts
			this.trap = undefined;
			if (this.frameo.lh != this.frameo.rh) {
				this.trap = ssMath.calcTrap(this.frameo.lh, this.frameo.rh, this.frameo.w);
			}

			iw = this.frameo.w - (cb * 2);
			ilh = this.frameo.lh - (cb * 2);
			irh = this.frameo.rh - (cb * 2);

//			if (this.trap != undefined) {
//				drop = iw * this.trap.pitch;
//				irh = ilh - drop;
//			}
			this.framei.container = this.frameo.container;
			this.framei.w = iw;
			this.framei.hw = iw / 2;
			this.framei.lh = ilh;
			this.framei.rh = irh;
			this.framei.x1 = this.frameo.x1 + cb;
			this.framei.y1 = this.frameo.y1 + cb;
			this.framei.x2 = this.framei.x1 + this.framei.w;
			this.framei.y2 = this.framei.y1 + this.framei.rh;
			this.framei.y3 = this.framei.y2 - this.framei.rh;
			this.framei.y4 = this.framei.y2 - this.framei.lh;
			
			this.framei.x3 = this.framei.x1 + this.framei.hw;

			this.framei.svg = this.framei.container.polygon([
				this.framei.x1, this.framei.y1,
				this.framei.x1, this.framei.y2,
				this.framei.x2, this.framei.y2,
				this.framei.x2, this.framei.y3,
				this.framei.x3, this.framei.y4
			]);


			this.framei.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			this.isReady = true;

			// use to put a bounding box when its selected  --- for hliting
			this.x1 = this.frameo.x1;
			this.y1 = this.frameo.y1;
			this.x2 = this.frameo.x2;
			this.y2 = this.frameo.y2;
			this.instanceId = data.model.InstanceId;
			this.client.hliteObject(this);

			return this;
		};
	};

});