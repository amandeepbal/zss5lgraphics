sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lgraphics/libs/ssgraph/common/ssBase"
], function (ssMath, ssBase) {
	//	return function(myParent,x,y) {
	return function (client, data, myParent, x, y) {
		this.data = data;
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
		this.client = client;
		this.container = undefined;
		this.svg = undefined;

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
		this.render = function () {
			var data = this.getData();
			var w = 5;
			var l = 0;
			var color = "WH";

			//           if(!this.getParent().isReady) return this;

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
				if (w == undefined) {
					w = 5;
				}
			}
			if (data.model["LENGTH"] != undefined) {
				l = Number(data.model["LENGTH"].value);
				if (l == undefined) {
					l = 1;
				}
			}

			//			l = l + 20;
			w = this.client.convert(w);
			l = l + this.client.convert(20);

			this.container = this.getParent().nested();
			this.w = w;
			this.l = l;

			if (l <= 0) return this;

			var pattern = this.container.pattern(20, 20, function (add) {
				add.rect(20, 20).fill(ssBase.color["SG"].htmlcolor);
				add.rect(10, 10).fill(ssBase.color["DG"].htmlcolor);
				add.rect(10, 10).fill(ssBase.color["DG"].htmlcolor).move(10, 10);
			});
			this.svg = this.container.rect(l, w);
			//			this.svg.attr({ fill: pattern });
			this.svg.attr({
				fill: ssBase.color["DG"].htmlcolor,
				"stroke": ssBase.color["DG"].htmlcolor,
				"stroke-width": 1
			});
			this.svg.move(this.x, this.y);

			this.isReady = true;

			return this;
		};
	};

});