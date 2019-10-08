sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase",
	"zss5lgraphics/libs/ssgraph/common/ssFrame",
	"zss5lgraphics/libs/ssgraph/common/ssSash",
	"zss5lgraphics/libs/ssgraph/common/ssPane",
	"zss5lgraphics/libs/ssgraph/common/ssScreen"
], function(ssMath, core, ssBase, ssFrame, ssSash, ssPane, ssScreen) {
	return function(client, data, myParent, x, y) {
		this.data = data;
		this.client = client;
		this.x = x;
		this.y = y;
		this.w = 0;
		this.h = 0;
		this.ssparent = myParent;
		this.container = undefined;
		this.frame = undefined;
		this.isReady = false;
		this.hlite = this.client.dim;
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

		this.calculate = function() {
			var data = this.getData();
		};

		this.render = function() {

			this.container = this.getParent().nested();
			this.isReady = true;
			this.frame = new ssFrame(this, this.x, this.y).render();
			this.w = this.frame.frameo.w;
			this.h = this.frame.frameo.h;
			if (!this.frame.isReady) {
				return this;
			};
			var ws = this.frame.framei.w;
			var hs = this.frame.framei.h;
			this.sashcount = 1;
			this.sashespercol = 1;

			if (ws <= 0) return this;
			if (hs <= 0) return this;

			var x = this.frame.framei.x;
			var y = this.frame.framei.y;

			if (data.model["NUMBER.OF.SASHES"] != undefined) {
				this.sashcount = data.model["NUMBER.OF.SASHES"].value;
			}

			this.ws = this.frame.framei.w / this.sashcount;
			this.hs = this.frame.framei.h;

			x = this.frame.framei.x;
			y = this.frame.framei.y;
			for (var j = 0; j < this.sashcount; j++) {
				var sash = new ssSash(this, x, y, this.ws, this.hs).render();
				this.frame.sashes.push(sash);
				x += this.ws;
			}

			this.x1 = this.frame.x1;
			this.y1 = this.frame.y1;
			this.x2 = this.frame.x2;
			this.y2 = this.frame.y2;
			this.instanceId = data.model.InstanceId;
			this.client.hliteObject(this);
			return this;
		};
	};

});