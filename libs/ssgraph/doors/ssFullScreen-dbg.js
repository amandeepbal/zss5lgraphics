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

		this.calculate = function() {
			var data = this.getData();
		};

		this.render = function() {

			this.container = this.getParent().nested();
			this.isReady = true;

			if (!this.getParent().isReady) return this;
			this.frame = new ssFrame(this, this.x, this.y).render();

			var ws = this.frame.framei.w;
			var hs = this.frame.framei.h / 4;
			if (ws <= 0) return;
			if (hs <= 0) return;
			var x = this.frame.framei.x;
			var y = this.frame.framei.y;
			for (var i = 0; i < 4; i++) {
				var sash = new ssSash(this.frame.framei, x, y, ws, hs).render();
				this.frame.framei.sashes.push(sash);
				y += hs;
			}
			return this;
		};
	};

});