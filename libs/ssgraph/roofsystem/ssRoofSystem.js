sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase"

], function (ssMath, core, ssBase) {
	return function (client, data, myParent, x, y) {
		this.data = data;
		this.client = client;
		this.x = x;
		this.y = y;
		this.ssparent = myParent;
		this.container = undefined;
		this.building = {
			container: undefined,
			svg: undefined,
			x: 0,
			y: 0
		};

		this.isReady = false;
		this.w = 0;
		this.h = 0;
		this.roofs = [];
		this.posts = [];
		if (this.x === undefined) {
			this.x = 0;
		}
		if (this.y === undefined) {
			this.y = 0;
		};

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
			var w = 0;
			var l = 0;
			var d = 0;
			var bx = 20;
			var by = 5;
			var color = "WH";
			var data = this.getData();
			this.isReady = true;

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
			}
			if (data.model["ROOF.PROJECTION"] != undefined) {
				l = Number(data.model["ROOF.PROJECTION"].value);
			}
			if (data.model["ROOF.STYLE"] != undefined) {
				this.roofStyle = data.model["ROOF.STYLE"].value;
			}
			// Draw building
			this.container = this.getParent().nested();

			w = this.client.convert(w);
			l = this.client.convert(l);
			d = this.client.convert(d);
			bx = this.client.convert(bx);
			by = this.client.convert(by);

			this.w = w;
			this.d = d;
			var x = this.client.convert(20);
			var y = this.client.convert(5);
			this.isReady = true;

			if (w <= 0) {
				return this;
			}
			if (l <= 0) {
				return this;
			}

			this.x1 = x;
			this.y1 = y;

			var roofs = core.getAllModels(this.getData());
			this.renderBuilding(roofs);

			if (this.roofStyle === 'S') {
				this.x1 = x + bx;
				this.y1 = y + by;
				this.x2 = this.x1 + w;
				this.y2 = this.y1 + l;
				this.y3 = this.y1;
			} else {
				this.x1 = x + bx;
				this.y1 = y + by;
				this.x2 = this.x1 + l;
				this.y2 = this.y1 + w;
				this.y3 = this.y1;
			}
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

			for (var i = 0; i < roofs.length; i++) {

				var aroof = roofs[i];
				aroof.showBuilding = false;
				aroof.showDimensions = data.showDimensions;
				aroof.showLabels = data.showLabels;

				//				aroof.showDimensions = this.getData().showDimensions;
				try {
					var theroof = this.getClient().draw(aroof, x, y, this.container);
					x = theroof.x2;
					y = this.y1;
					this.x2 = x;
					this.y2 = y + theroof.y2;
					this.showDimensions(aroof, theroof, x, y);
					this.roofs.push(aroof);
				} catch (e) {}
			}
			this.renderPosts();
			// use to put a bounding box when its selected  --- for hliting
			this.instanceId = data.model.InstanceId;
			this.client.hliteObject(this);

			return this;

		};
		this.renderPosts = function () {
			var oposts = core.getModel(this.getData(), "rsPosts");
			if (oposts === undefined) return;

			var objmods = core.getModels(oposts, "rsPost");
			if (objmods === undefined) {
				return;
			}
			objmods.sort(function (a, b) {
				return (Number(a.Data.Position) > Number(b.Data.Position)) ? 1 : ((Number(b.Data.Position) > Number(a.Data.Position)) ? -1 : 0);
			});
			var px = this.x1;
			var py = this.y2;
			var w = 0;
			var l = 0;
			var b = this.client.convert(this.beamwidth);

			for (var i = 0; i < objmods.length; i++) {
				var amod = objmods[i];
				amod.showDimensions = data.showDimensions;
				amod.showLabels = data.showLabels;
				var mod = this.drawPost(amod, px, py);
				if (mod === undefined) {
					continue;
				}
				this.post.push(mod);
			}
		};
		this.drawPost = function (mod, x1, y1) {
			mod.roofx1 = this.x1;
			mod.roofy1 = this.y1;
			mod.roofx2 = this.x2;
			mod.roofy2 = this.y2;
			var opost = this.getClient().draw(mod, this.x1, this.y2, this.container);
			this.posts.push(opost);
		};

		this.showDimensions = function (aroof, theroof, x, y) {
			if (data.showDimensions === undefined) {
				return;
			}
			if (!data.showDimensions) {
				return;
			}
			var roofStyle = "S";
			if (data.model["ROOF.STYLE"] != undefined) {
				roofStyle = aroof.model["ROOF.STYLE"].value;
			}
			switch (roofStyle) {
			case "S":
				this.dimensionsprojection = ssBase.showLabel(this.container, core.formatMeasurement(aroof.model['LENGTH'].value), 'V',
					10,
					theroof.y1,
					10,
					theroof.y2
				);
				this.dimensionswidth = ssBase.showLabel(this.container, core.formatMeasurement(aroof.model['WIDTH'].value), 'H',
					theroof.x1,
					theroof.y2 + 20,
					theroof.x2,
					theroof.y2 + 20);
				break;
			case "G":
				if (theroof.side === "L") {
					this.dimensionsprojectionleft = ssBase.showLabel(this.container, core.formatMeasurement(aroof.model['WIDTH'].value), 'V',
						10,
						theroof.y1,
						10,
						theroof.y2
					);
					this.dimensionswidthleft = ssBase.showLabel(this.container, core.formatMeasurement(aroof.model['LENGTH'].value), 'H',
						theroof.x1,
						theroof.y2 + 20,
						theroof.x2,
						theroof.y2 + 20);
					break;
				}
				if (theroof.side === "R") {
					this.dimensionsprojectionleft = ssBase.showLabel(this.container, core.formatMeasurement(aroof.model['WIDTH'].value), 'V',
						theroof.x2 + 10,
						theroof.y1,
						theroof.x2 + 10,
						theroof.y2
					);
					this.dimensionswidthleft = ssBase.showLabel(this.container, core.formatMeasurement(aroof.model['LENGTH'].value), 'H',
						theroof.x1,
						theroof.y2 + 20,
						theroof.x2,
						theroof.y2 + 20);
					break;
				}
			}

		};
		this.renderBuilding = function (roofs) {

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
	};

});