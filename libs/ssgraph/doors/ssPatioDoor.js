sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase",
	"zss5lgraphics/libs/ssgraph/common/ssPatioFrame",
	"zss5lgraphics/libs/ssgraph/common/ssPatioSash",
	"zss5lgraphics/libs/ssgraph/common/ssPane"
], function(ssMath, core, ssBase, ssPatioFrame, ssPatioSash, ssPane) {
	return function(client, data, myParent, x, y) {
		this.data = data;
		this.client = client;
		this.x = x;
		this.y = y;
		this.ssparent = myParent;
		this.container = undefined;
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
			this.container = this.getParent().nested();
			this.isReady = true;
			this.frame = new ssPatioFrame(this, this.x, this.y).render();
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

			this.sashcount = 2;

			var cols = this.sashcount / this.sashcount;
			this.ws = this.frame.framei.w / this.sashcount;
			this.hs = this.frame.framei.h;

			x = this.frame.framei.x;
			y = this.frame.framei.y;
			for (var i = 0; i < this.sashcount; i++) {
				var sash = new ssPatioSash(this, x, y, this.ws, this.hs).render();
				this.frame.sashes.push(sash);
				x += this.ws;
			}

			return this;

		};
	};

});