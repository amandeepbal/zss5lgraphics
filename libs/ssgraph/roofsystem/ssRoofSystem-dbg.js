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

			var roofs = core.getAllModels(this.getData());

			// Draw building
			this.container = this.getParent().nested();

			w = this.client.convert(w);
			l = this.client.convert(l);
			d = this.client.convert(d);
			bx = this.client.convert(bx);
			by = this.client.convert(by);

			this.w = w;
			this.d = d;
			//			var x = this.client.convert(20);
			//			var y = this.client.convert(5);
			this.isReady = true;

			if (w <= 0) {
				return this;
			}
			if (l <= 0) {
				return this;
			}

			//			this.x1 = x;
			//			this.y1 = y;

			//			var roofs = core.getAllModels(this.getData());

			if (this.roofStyle === 'S') {
				this.x1 = x + bx;
				this.y1 = y + by;
				this.x2 = this.x1 + w;
				this.y2 = this.y1 + l;
				this.y3 = this.y1;
				this.l = w;
			} else {
				this.x1 = x + bx;
				this.y1 = y + by;
				this.x2 = this.x1 + (2 * l);
				this.y2 = this.y1 + w;
				this.y3 = this.y1;
				this.l = (2 * l);
				this.l = 0;
				for (var i = 0; i < roofs.length; i++) {
					var aroof = roofs[i];
					if (aroof.Group === undefined || aroof.Group != 'RF') {
						continue;
					}
					this.l += this.client.convert(aroof.model['LENGTH'].value);
				}
			}
			//			this.svg = this.container.polygon([this.x1, this.y1,
			//				this.x1, this.y2,
			//				this.x2, this.y2,
			//				this.x2, this.y3
			//			]);
			//			this.svg.attr({
			//				fill: ssBase.color[color].htmlcolor,
			//				"stroke": ssBase.color['SC'].htmlcolor,
			//				"stroke-width": 1
			//			});
			this.renderBuilding(roofs);

			x = this.x1;
			y = this.y1;

			this.renderBeam();
			this.renderPosts();

			for (var i = 0; i < roofs.length; i++) {
				var aroof = roofs[i];
				if (aroof.Group === undefined || aroof.Group != 'RF') {
					continue;
				}

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
			// use to put a bounding box when its selected  --- for hliting
			this.instanceId = data.model.InstanceId;
			this.client.hliteObject(this);

			return this;

		};
		this.renderBeam = function () {
			var h;
			var w;
			var x;
			var y;
			var f = 1.5;
			var oh = 0;
			var drop = 0;
			var color = "WH";
			var oExtrusions = core.getModel(this.getData(), "rsSupports");
			if (oExtrusions === undefined) {
				return;
			}
			var data = core.getModel(oExtrusions, "rsBeam");
			if (data === undefined) return;

			if (this.getData().model["OVERHANG"] != undefined) {
				oh = this.getData().model['OVERHANG'].value;
			};
			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (data.model["DEPTH"] != undefined) {
				w = Number(data.model["DEPTH"].value);
			}
			if (data.model["LENGTH"] != undefined) {
				h = Number(data.model["LENGTH"].value);
			}
			w = this.client.convert(w);
			h = this.client.convert(h);
			f = this.client.convert(f);
			oh = this.client.convert(oh);
			x = this.x1 + oh;
			y = this.y2 - oh - w;

			this.beam = {};
			this.beam.container = this.container;
			this.beam.w = w;
			this.beam.h = h;
			this.beam.x1 = x;
			this.beam.y1 = y;
			this.beam.x2 = this.beam.x1 + h;
			this.beam.y2 = this.beam.y1 + this.beam.w;
			this.beam.y3 = this.beam.y1;

			this.beam.svg = this.beam.container.polygon([this.beam.x1, this.beam.y1,
				this.beam.x1, this.beam.y2,
				this.beam.x2, this.beam.y2,
				this.beam.x2, this.beam.y3
			]);

			this.beam.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			var obj = {
				x1: this.beam.x1,
				y1: this.beam.y1,
				x2: this.beam.x2,
				y2: this.beam.y2,
				instanceId: data.model.InstanceId
			};
			this.client.hliteObject(obj);
		};
		this.renderPosts = function () {
			if (this.getData().model["OVERHANG"] != undefined) {
				oh = this.getData().model['OVERHANG'].value;
			};
			var oSupports = core.getModel(this.getData(), "rsSupports");
			if (oSupports === undefined) return;

			var objmods = core.getModels(oSupports, "rsPost");
			if (objmods === undefined) {
				return;
			}
			objmods.sort(function (a, b) {
				return (Number(a.Data.Position) > Number(b.Data.Position)) ? 1 : ((Number(b.Data.Position) > Number(a.Data.Position)) ? -1 : 0);
			});
			var w = 0;
			var l = 0;
			var oh = this.client.convert(oh);

			for (var i = 0; i < objmods.length; i++) {
				var amod = objmods[i];
				var px = this.x1;
				var py = this.y2;
				var ox = 0;
				var oy = 0;
				amod.showDimensions = data.showDimensions;
				amod.showLabels = data.showLabels;
				if (amod.model["OFFSETX"] != undefined) {
					ox = amod.model['OFFSETX'].value;
				};
				if (amod.model["OFFSETY"] != undefined) {
					oy = amod.model['OFFSETY'].value;
				};

				ox = this.client.convert(ox);
				oy = this.client.convert(oy);
				px = px + ox;
				py = py - oy;
				var mod = this.drawPost(amod, px, py);
				if (mod === undefined) {
					continue;
				}
				this.post.push(mod);
			}
		};
		this.drawPost = function (mod, x1, y1) {
			var pw = 3;
			pw = this.client.convert(pw);
			var opost = {};
			opost.container = this.container;
			opost.x1 = x1;
			opost.y1 = y1 - pw;
			opost.x2 = opost.x1 + pw;
			opost.y2 = opost.y1 + pw;
			opost.y3 = opost.y1;

			opost.svg = this.beam.container.polygon([opost.x1, opost.y1,
				opost.x1, opost.y2,
				opost.x2, opost.y2,
				opost.x2, opost.y3
			]);

			opost.svg.attr({
				fill: ssBase.color["WH"].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			var obj = {
				x1: opost.x1,
				y1: opost.y1,
				x2: opost.x2,
				y2: opost.y2,
				instanceId: mod.model.InstanceId
			};
			this.client.hliteObject(obj);
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
						value: this.l
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