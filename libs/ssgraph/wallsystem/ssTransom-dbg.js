sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase",
	"zss5lgraphics/libs/ssgraph/common/ssFrame",
	"zss5lgraphics/libs/ssgraph/common/ssTrapFrame",
	"zss5lgraphics/libs/ssgraph/common/ssTrapSash",
	"zss5lgraphics/libs/ssgraph/common/ssTrapPane",
	"zss5lgraphics/libs/ssgraph/common/ssScreen"
], function(ssMath, core, ssBase, ssFrame, ssTrapFrame, ssTrapSash, ssTrapPane, ssScreen) {
	return function(client, data, myParent, x, y) {
		this.data = data;
		this.client = client;
		this.x = x;
		this.y = y;
		this.ssparent = myParent;
		this.container = undefined;
		this.frame = undefined;
		this.isReady = false;

		if (this.x === undefined) {
			this.x = 0;
		}
		if (this.y === undefined) {
			this.y = 0;
		}

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
			var t;

			this.container = this.getParent().nested();
			this.isReady = true;

			if (data.model["TRANSOM.TYPE"] != undefined) {
				t = data.model["TRANSOM.TYPE"].value;
				if (t == undefined) {
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

			this.frame = new ssTrapFrame(this, this.x, this.y).render();
			if (!this.frame.isReady) {
				return this;
			};

			var sw = this.frame.framei.w;
			var lh = this.frame.framei.lh;
			var rh = this.frame.framei.rh;
			if (sw <= 0) return this;
			if (lh <= 0) return this;
			if (rh <= 0) return this;
			var x = this.frame.framei.x;
			var y = this.frame.framei.y;
			this.pane = new ssTrapPane(this, this.frame.framei.x1, this.frame.framei.y1, this.frame.framei.w, this.frame.framei.lh, this.frame.framei
				.rh).render();

			this.x1 = this.frame.x1;
			this.y1 = this.frame.y1;
			this.x2 = this.frame.x2;
			this.y2 = this.frame.y2;
			this.instanceId = data.model.InstanceId;
			this.client.hliteObject(this);
			return this;
		};
		this.renderPanel = function() {
			var data = this.getData();
			var w = 0;
			var lh = 0;
			var rh = 0;
			var x = this.x;
			var y = this.y;
			var t = 0;
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

			if (rh <= 0) return this;
			if (lh <= 0) return this;
			if (w <= 0) return this;

			if (data.model["EXTERIOR.COLOR"] != undefined) {
				color = data.model['EXTERIOR.COLOR'].value;
			}

			w = this.client.convert(w);
			lh = this.client.convert(lh);
			rh = this.client.convert(rh);

			this.frame = {
				container: undefined,
				svg: undefined
			};
			this.frame.container = this.container;
			this.frame.w = w;
			this.frame.lh = lh;
			this.frame.rh = rh;
			this.frame.x1 = x;
			this.frame.y1 = y;
			this.frame.x2 = this.frame.x1 + w;
			this.frame.y2 = this.frame.y1 + this.frame.lh;
			this.frame.y3 = this.frame.y2 - this.frame.rh;

			this.frame.svg = this.frame.container.polygon([this.frame.x1, this.frame.y1,
				this.frame.x1, this.frame.y2,
				this.frame.x2, this.frame.y2,
				this.frame.x2, this.frame.y3
			]);

			this.frame.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			return this;
		};
	};

});