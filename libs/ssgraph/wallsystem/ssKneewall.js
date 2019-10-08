sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase",
	"zss5lgraphics/libs/ssgraph/common/ssFrame",
	"zss5lgraphics/libs/ssgraph/common/ssSash",
	"zss5lgraphics/libs/ssgraph/common/ssPane",
	"zss5lgraphics/libs/ssgraph/common/ssScreen"
], function (ssMath, core, ssBase, ssFrame, ssSash, ssPane, ssScreen) {
	return function (client, data, myParent, x, y) {
		this.data = data;
		this.client = client;
		this.x = x;
		this.y = y;
		this.ssparent = myParent;
		this.container = undefined;
		this.frame = undefined;
		this.svg = undefined;
		this.isReady = false;
		this.hlite = this.client.dim;

		if (this.x === undefined) {
			this.x = 0;
		}
		if (this.y === undefined) {
			this.y = 0;
		}

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
			var t;
			var w = 0;
			var h = 0;

			this.container = this.getParent().nested();
			this.isReady = true;
			if (data.model["WIDTH"] !== undefined) {
				w = Number(data.model["WIDTH"].value);
			}
			if (data.model["HEIGHT"] !== undefined) {
				h = Number(data.model["HEIGHT"].value);
			}
			if (w === 0) {
				return this;
			}
			if (h === 0) {
				return this;
			}

			if (data.model["KNEEWALL.TYPE"] !== undefined) {
				t = data.model["KNEEWALL.TYPE"].value;
				if (t === undefined) {
					t = "S";
				}
			}
			if (t === "S") {
				this.renderPanel();
				this.x1 = this.frame.x1;
				this.y1 = this.frame.y1;
				this.x2 = this.frame.x2;
				this.y2 = this.frame.y2;
				this.instanceId = this.data.model.InstanceId;
				this.client.hliteObject(this);

				return this;
			};

			this.frame = new ssFrame(this, this.x, this.y).render();
			if (!this.frame.isReady) {
				return this;
			};

			var sw = this.frame.framei.w;
			var sh = this.frame.framei.h;
			if (sw <= 0) return this;
			if (sh <= 0) return this;
			var x = this.frame.framei.x;
			var y = this.frame.framei.y;
			var sash = new ssSash(this, x, y, sw, sh).render();
			this.frame.sashes.push(sash);

			this.x1 = this.frame.x1;
			this.y1 = this.frame.y1;
			this.x2 = this.frame.x2;
			this.y2 = this.frame.y2;
			this.instanceId = this.data.model.InstanceId;
			this.client.hliteObject(this);
			return this;
		};
		this.renderPanel = function () {
			var data = this.getData();
			var w = 0;
			var h = 0;
			var t = 0;
			var color = "WH";

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
				if (w == undefined) {
					w = 1;
				}
			}
			if (data.model["HEIGHT"] != undefined) {
				h = Number(data.model["HEIGHT"].value);
				if (h == undefined) {
					h = 1;
				}
			}

			if (h <= 0) return this;
			if (w <= 0) return this;

			if (data.model["EXTERIOR.TEXTURE"] != undefined) {
				color = data.model['EXTERIOR.TEXTURE'].value;
			}

			if (color === 'NS') {
				if (data.model["EXTERIOR.COLOR"] != undefined) {
					color = data.model['EXTERIOR.COLOR'].value;
				}
			}
			w = this.client.convert(w);
			h = this.client.convert(h);
			this.frame = {
				container: undefined,
				svg: undefined
			};
			this.frame.container = this.container.nested();
			this.frame.w = w;
			this.frame.h = h;
			this.frame.x1 = this.x;
			this.frame.y1 = this.y;
			this.frame.x2 = this.frame.x1 + w;
			this.frame.y2 = this.frame.y1 + h;
			this.frame.svg = this.frame.container.rect(w, h);
			this.frame.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			this.frame.svg.stroke(this.hlite);
			this.frame.svg.move(this.x, this.y);

		};
	};

});