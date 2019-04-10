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
		this.getClient = function() {
			return this.client;
		};

		this.calculate = function() {
			var data = this.getData();
		};

		this.render = function() {
			this.container = this.getParent().nested();
			this.isReady = true;
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
			this.renderColonial();
			this.x1 = this.frame.x1;
			this.y1 = this.frame.y1;
			this.x2 = this.frame.x2;
			this.y2 = this.frame.y2;
			this.instanceId = data.model.InstanceId;
			this.client.hliteObject(this);
			return this;
		};

		this.renderColonial = function() {
			var pane = this.frame.sashes[0].pane.paneo;
			var w = pane.w;
			var h = pane.h;
			var x = pane.x;
			var y = pane.y;
			var s = 4;
			var t = .5;
			s = this.client.convert(s);
			t = this.client.convert(t);
			var cols = w / s;
			var rows = h / s;
			for (var r = 0; r < rows; r++) {
				var svgr = pane.container.rect(w, t);
				svgr.attr({
					fill: ssBase.color["WH"].htmlcolor,
					"stroke": "#000",
					"stroke-width": 1
				});
				svgr.move(x, y);
				y = y + s;
			}
			y = pane.y;
			for (var c = 0; c < cols; c++) {
				var svgc = pane.container.rect(t, h);
				svgc.attr({
					fill: ssBase.color["WH"].htmlcolor,
					"stroke": "#000",
					"stroke-width": 1
				});
				svgc.move(x, y);
				x = x + s;
			}
		};
	};

});