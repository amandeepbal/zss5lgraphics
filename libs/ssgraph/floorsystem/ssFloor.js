sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase"
], function(ssMath, core, ssBase) {
	return function(client, data, myParent, x, y) {
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
		this.building = undefined;

		this.mods = [];
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
			var tw = 0;
			var w = 0;
			var l = 0;
			var bx = 10;
			var by = 5;
			var color = "WH";

			this.container = this.getParent().nested();
			var data = this.getData();
			this.isReady = true;

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
				if (w == undefined) {
					w = 1;
				}
			}
			if (data.model["LENGTH"] != undefined) {
				l = Number(data.model["LENGTH"].value);
				if (l == undefined) {
					l = 1;
				}
			}

			if (w <= 0) return;
			if (l <= 0) return;

			l = this.client.convert(l);
			w = this.client.convert(w);
			bx = this.client.convert(bx);
			by = this.client.convert(by);

			this.w = w;
			this.l = l;
			this.tw = tw;
			this.color = color;

			this.x1 = x + bx;
			this.y1 = y + by;
			this.x2 = this.x1 + w;
			this.y2 = this.y1 + l;
			this.y3 = this.y1;

			this.svg = this.container.polygon([this.x1, this.y1,
				this.x1, this.y2,
				this.x2, this.y2,
				this.x2, this.y3
			]);
			this.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": ssBase.color['SC'].htmlcolor,
				"stroke-width": 1
			});
			this.isReady = true;

			this.renderBuilding();
			this.renderMods();

			return this;

		};
		this.renderBuilding = function() {
			var data = {
				model: {
					"EXTRUSION.COLOR": {
						value: "WH"
					},
					"LENGTH": {
						value: this.w
					},
					Content: {
						general: {
							shape: "BUILDING"
						}
					}
				}
			};
			this.building = this.getClient().draw(data, this.x, this.y, this.container);

		};
		this.renderMods = function() {
			var objmods = core.getModels(this.getData(), 'flrFloorPanelT');
			if (objmods === undefined) {
				return;
			}
			objmods.sort(function(a, b) {
				return (Number(a.Data.Position) > Number(b.Data.Position)) ? 1 : ((Number(b.Data.Position) > Number(a.Data.Position)) ? -1 : 0);
			});
			var x = this.x1;
			var y = this.y1;
			var w = 0;
			var l = 0;
			for (var i = 0; i < objmods.length; i++) {
				var amod = objmods[i];
				var mod = this.getClient().draw(amod, x, y, this.container);
				if (mod === undefined) {
					continue;
				}
				this.mods.push(mod);
				x = mod.x2;
				y = mod.y1;
			}

		};

	};

});