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
		this.mullions = [];
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
			this.w = this.frame.frameo.w;
			this.h = this.frame.frameo.h;
			if (!this.frame.isReady) {
				return this;
			};
			var ws = this.frame.framei.w;
			var hs = this.frame.framei.h / 4;
			this.sashcount = 1;
			this.sashesperrow = 1;

			if (ws <= 0) return this;
			if (hs <= 0) return this;
			var x = this.frame.framei.x;
			var y = this.frame.framei.y;

			if (data.model["NUMBER.OF.SASHES"] != undefined) {
				this.sashcount = data.model["NUMBER.OF.SASHES"].value;
			}
			if (data.model["NUMBER.OF.SASHES.PER.ROW"] != undefined) {
				this.sashesperrow = data.model["NUMBER.OF.SASHES.PER.ROW"].value;
			}
			var m = 1;
			var mw = 0;
			if (this.sashesperrow > 1) {
				m = this.client.convert(m);
				mw = (this.sashesperrow - 1) * m;
			}

			var rows = this.sashcount / this.sashesperrow;
			this.ws = (this.frame.framei.w - mw) / this.sashesperrow;
			this.hs = this.frame.framei.h / rows;

			var mx = 0;
			var my = y;

			if (this.sashesperrow > 1) {
				mx = this.ws;
				for (var i = 1; i < this.sashesperrow; i++) {
					var mullion = this.renderMullion(this.frame.framei.container, mx, my, this.frame.framei.h);
					this.mullions.push(mullion);
					mx += this.ws;
				}
			}

			//         	var ws =  this.frame.framei.w / this.sashesperrow;
			//			var hs = 	this.frame.framei.h / rows;
			data.isMixedVents = false;
			if (data.model["MIXED.VENTS"] != undefined) {
				data.isMixedVents = data.model["MIXED.VENTS"].value;
			}

			data.currentVent = 0;
			for (var i = 0; i < rows; i++) {
				x = this.frame.framei.x;
				if (data.isMixedVents) {
					data.currentVent = i;
				}

				for (var j = 0; j < this.sashesperrow; j++) {
					if (j > 0) {
						x += this.mullions[0].w;
					}
					var sash = new ssSash(this, x, y, this.ws, this.hs).render();
					this.frame.sashes.push(sash);
					x += this.ws;
				}
				y += this.hs;
			}
			this.x1 = this.frame.x1;
			this.y1 = this.frame.y1;
			this.x2 = this.frame.x2;
			this.y2 = this.frame.y2;
			this.instanceId = data.model.InstanceId;
			this.client.hliteObject(this);

			return this;
		};
		this.renderMullion = function(cont, x, y, h) {
			var m = 1;
			m = this.client.convert(m);
			var mullion = {};
			mullion.w = m;
			mullion.h = h;
			var color = data.model["FRAME.COLOR"].value;
			mullion.svg = cont.rect(m, h);
			mullion.svg.move(x, y);
			mullion.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			return mullion;
		};
	};

});