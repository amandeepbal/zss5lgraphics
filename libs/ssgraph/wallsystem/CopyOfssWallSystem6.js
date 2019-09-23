sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase",
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
		this.walls = [];
		this.extrusions = [];
		this.lastx = 0;
		this.lasty = 0;

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
			var d = 0;
			var color = "WH";
			var data = this.getData();
			this.isReady = true;

			var walls = core.getModels(this.getData(), 'wsWall');
			var layout = data.model['LAYOUT'].value;

			for (var i = 0; i < walls.length; i++) {
				var awall = walls[i];
				if (awall.model != undefined) {
					if (Number(awall.model['WIDTH'].value) > w) {
						w = Number(awall.model['WIDTH'].value);
					}
				}
			}

			this.container = this.getParent().nested();
			w = this.client.convert(w);
			this.w = w;
			this.l = w;

			// Draw building
			if (layout != '10') {
				this.renderBuilding();
			}

			var x = 0;
			var y = this.building.w;
			//			this.extrusions.push({
			//				x1: 0,
			//				y1: this.building.w,
			//				x2: 0,
			//				y2: this.building.w
			//			});
			this.lastx1 = 0;
			this.lastx2 = 0;
			this.lasty1 = this.building.w;
			this.lasty2 = this.building.w;
			if (this.lasty1 === undefined || this.lasty1 <= 0) {
				this.lasty1 = 50;
				this.lasty2 = 50;
			}

			for (var i = 0; i < walls.length; i++) {
				var awall = walls[i];
				this.renderWall(awall);
			}
			return this;

		};
		this.renderBuilding = function () {
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
			data.parent = this;
			this.building = this.getClient().draw(data, this.x, this.y, this.container);

		};
		this.renderWall = function (wdata) {
			var lastwall;
			var thiswall = {
				direction: wdata.Data.Direction,
				joinprev: wdata.model.joinprev,
				joinnext: wdata.model.joinnext
			};
			this.walls.push(thiswall);
			this.renderWallBeginPost(wdata);
			this.renderWallStarter(wdata);
			this.renderWallStarterFiller(wdata);
			this.renderWallMods(wdata);
			this.renderWallReceiverFiller(wdata);
			this.renderWallReceiver(wdata);
			this.renderWallEndPost(wdata);
		};
		this.renderWallBeginPost = function (wdata) {
			var d = 2;
			var w;
			var wi;
			var l;
			var color = "WH";

			//			var thiswall = this.walls[this.walls.length - 1];

			var data = core.getModel(wdata, "exBeginPost");
			if (data === undefined) return;

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
				wi = Number(data.model["WIDTH"].inside);
				if (w === undefined) {
					w = 1;
				}
			}
			if (data.model["DEPTH"] != undefined) {
				d = Number(data.model["DEPTH"].value);
				if (d === undefined) {
					d = 1;
				}
			}

			if (data.model["LENGTH"] != undefined) {
				l = Number(data.model["LENGTH"].value);
				if (l === undefined) {
					l = 1;
				}
			}
			this.renderPost(color, w, wi, d, data.model.joinprev);
		};
		this.renderWallStarter = function (wdata) {
			var d = 2;
			var w;
			var l;
			var x;
			var y;
			var color = "WH";

			var thiswall = this.walls[this.walls.length - 1];

			var data = core.getModel(wdata, "modWallStarter");
			if (data === undefined) return;

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
				if (w === undefined) {
					w = 1;
				}
			}
			if (data.model["DEPTH"] != undefined) {
				d = Number(data.model["DEPTH"].value);
				if (d === undefined) {
					d = 1;
				}
			}

			if (data.model["LENGTH"] != undefined) {
				l = Number(data.model["LENGTH"].value);
				if (l === undefined) {
					l = 1;
				}
			}
			w = this.client.convert(w);
			l = this.client.convert(l);
			d = this.client.convert(d);
			this.renderSection(thiswall.direction, color, w, d, l);
		};
		this.renderWallStarterFiller = function (wdata) {
			var thiswall = this.walls[this.walls.length - 1];
			var d = 2;
			var w;
			var l;
			var x;
			var y;
			var color = "WH";

			var data = core.getModel(wdata, "modStarterFiller");
			if (data === undefined) return;

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
				if (w === undefined) {
					w = 1;
				}
			}
			if (data.model["DEPTH"] != undefined) {
				d = Number(data.model["DEPTH"].value);
				if (d === undefined) {
					d = 1;
				}
			}

			if (data.model["LENGTH"] != undefined) {
				l = Number(data.model["LENGTH"].value);
				if (l === undefined) {
					l = 1;
				}
			}
			w = this.client.convert(w);
			l = this.client.convert(l);
			d = this.client.convert(d);
			this.renderSection(thiswall.direction, color, w, d, l);
		};

		this.renderWallMods = function (data, x, y) {
			var w = 0;
			var l = 0;

			var lstmods = data.model['WALLMODS'].valueList;
			var objmods = core.getAllModels(data);
			if (lstmods === undefined) {
				return;
			}
			if (objmods === undefined) {
				return;
			}
			for (var i = 0; i < lstmods.length; i++) {
				for (var j = 0; j < objmods.length; j++) {
					if (objmods[j].Data === undefined) {
						continue;
					}
					if (objmods[j].Data.Id === lstmods[i].Id) {
						break;
					}
				}
				var amod = objmods[j];
				if (amod === undefined) {
					continue;
				}
				if (amod.model["WIDTH"] != undefined) {
					w = Number(amod.model["WIDTH"].value);
					if (w == undefined) {
						w = 1;
					}
				} else {
					if (amod.model["THICKNESS"] != undefined) {
						w = Number(amod.model["THICKNESS"].value);
						if (w == undefined) {
							w = 1;
						}
					}
				}
				w = this.client.convert(w);
				this.renderMod(amod);
			}
		};
		this.renderMod = function (data) {
			var d = 2;
			var w;
			var l;
			var x;
			var y;
			var color = "WH";

			var thiswall = this.walls[this.walls.length - 1];
			if (data === undefined) return;

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
				if (w === undefined) {
					w = 1;
				}
			}
			if (data.model["DEPTH"] != undefined) {
				d = Number(data.model["DEPTH"].value);
				if (d === undefined) {
					d = 1;
				}
			}

			if (data.model["LENGTH"] != undefined) {
				l = Number(data.model["LENGTH"].value);
				if (l === undefined) {
					l = 1;
				}
			} else {
				if (data.model["HEIGHT"] != undefined) {
					l = Number(data.model["HEIGHT"].value);
					if (l === undefined) {
						l = 1;
					}
				}
			}
			w = this.client.convert(w);
			l = this.client.convert(l);
			d = this.client.convert(d);
			this.renderSection(thiswall.direction, color, w, d, l);
		};

		this.renderWallReceiver = function (wdata) {
			var d = 2;
			var w;
			var l;
			var x;
			var y;
			var color = "WH";

			var thiswall = this.walls[this.walls.length - 1];

			var data = core.getModel(wdata, "modWallReceiver");
			if (data === undefined) return;

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
				if (w === undefined) {
					w = 1;
				}
			}
			if (data.model["DEPTH"] != undefined) {
				d = Number(data.model["DEPTH"].value);
				if (d === undefined) {
					d = 1;
				}
			}

			if (data.model["LENGTH"] != undefined) {
				l = Number(data.model["LENGTH"].value);
				if (l === undefined) {
					l = 1;
				}
			}
			w = this.client.convert(w);
			l = this.client.convert(l);
			d = this.client.convert(d);
			this.renderSection(thiswall.direction, color, w, d, l);

		};
		this.renderWallReceiverFiller = function (wdata) {
			var thiswall = this.walls[this.walls.length - 1];
			var d = 2;
			var w;
			var l;
			var x;
			var y;
			var color = "WH";

			var data = core.getModel(wdata, "modReceiverFiller");
			if (data === undefined) return;

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
				if (w === undefined) {
					w = 1;
				}
			}
			if (data.model["DEPTH"] != undefined) {
				d = Number(data.model["DEPTH"].value);
				if (d === undefined) {
					d = 1;
				}
			}

			if (data.model["LENGTH"] != undefined) {
				l = Number(data.model["LENGTH"].value);
				if (l === undefined) {
					l = 1;
				}
			}
			w = this.client.convert(w);
			l = this.client.convert(l);
			d = this.client.convert(d);
			this.renderSection(thiswall.direction, color, w, d, l);
		};
		// ---------------------------------------
		// End POST
		// ---------------------------------------
		this.renderWallEndPost = function (wdata) {
			var d = 2;
			var w;
			var wi;
			var l;
			var color = "WH";

			var thiswall = this.walls[this.walls.length - 1];

			var data = core.getModel(wdata, "exEndPost");
			if (data === undefined) return;

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
				wi = Number(data.model["WIDTH"].inside);
				if (w === undefined) {
					w = 1;
				}
			}
			if (data.model["DEPTH"] != undefined) {
				d = Number(data.model["DEPTH"].value);
				if (d === undefined) {
					d = 1;
				}
			}

			if (data.model["LENGTH"] != undefined) {
				l = Number(data.model["LENGTH"].value);
				if (l === undefined) {
					l = 1;
				}
			}
			this.renderPost(color, w, wi, d, data.model.joinnext);
		};
		// ---------------------------------------
		// End POST
		// ---------------------------------------
		this.renderPost = function (color, w, wi, d, joint) {
			w = this.client.convert(w);
			wi = this.client.convert(wi);
			d = this.client.convert(d);
			var extrusion = {};
			var extrusion1 = {};
			var extrusion2 = {};
			extrusion.container = this.container;
			extrusion1.container = this.container;
			extrusion2.container = this.container;

			switch (joint) {
			case "90-N-W":

				extrusion1.w = w;
				extrusion1.d = d;
				extrusion1.x1 = this.lastx1 + w;
				extrusion1.y1 = this.lasty1;

				extrusion1.x2 = this.lastx1;
				extrusion1.y2 = extrusion1.y1;

				extrusion1.x3 = extrusion1.x2 + d;
				extrusion1.y3 = extrusion1.y2 + d;

				extrusion1.x4 = extrusion1.x1;
				extrusion1.y4 = extrusion1.y3;

				extrusion1.svg = extrusion1.container.polygon([
					extrusion1.x1, extrusion1.y1,
					extrusion1.x2, extrusion1.y2,
					extrusion1.x3, extrusion1.y3,
					extrusion1.x4, extrusion1.y4
				]);

				extrusion1.svg.attr({
					fill: ssBase.color[color].htmlcolor,
					"stroke": "#000",
					"stroke-width": 1
				});

				extrusion2.w = w;
				extrusion2.d = d;
				extrusion2.x1 = this.lastx2;
				extrusion2.y1 = this.lasty2;

				extrusion2.x2 = extrusion2.x1;
				extrusion2.y2 = extrusion2.y1 + w;

				extrusion2.x3 = extrusion2.x2 + d;
				extrusion2.y3 = extrusion2.y2;

				extrusion2.x4 = extrusion1.x3;
				extrusion2.y4 = extrusion1.y3;

				extrusion2.svg = extrusion2.container.polygon([
					extrusion2.x1, extrusion2.y1,
					extrusion2.x2, extrusion2.y2,
					extrusion2.x3, extrusion2.y3,
					extrusion2.x4, extrusion2.y4
				]);
				extrusion2.svg.attr({
					fill: ssBase.color[color].htmlcolor,
					"stroke": "#000",
					"stroke-width": 1
				});

				this.lastx1 = extrusion2.x2;
				this.lasty1 = extrusion2.y2;
				this.lastx2 = extrusion2.x3;
				this.lasty2 = extrusion2.y2;

				break;
			case "90-W-S":

				extrusion1.w = w;
				extrusion1.d = d;
				extrusion1.x1 = this.lastx1;
				extrusion1.y1 = this.lasty1;

				extrusion1.x2 = this.lastx1;
				extrusion1.y2 = extrusion1.y1 + w;

				extrusion1.x3 = extrusion1.x1 + d;
				extrusion1.y3 = extrusion1.y2 - d;

				extrusion1.x4 = this.lastx2;
				extrusion1.y4 = this.lasty2;

				extrusion1.svg = extrusion1.container.polygon([
					extrusion1.x1, extrusion1.y1,
					extrusion1.x2, extrusion1.y2,
					extrusion1.x3, extrusion1.y3,
					extrusion1.x4, extrusion1.y4
				]);

				extrusion1.svg.attr({
					fill: ssBase.color[color].htmlcolor,
					"stroke": "#000",
					"stroke-width": 1
				});

				extrusion2.w = w;
				extrusion2.d = d;
				extrusion2.x1 = extrusion1.x1;
				extrusion2.y1 = extrusion1.y2;

				extrusion2.x2 = extrusion2.x1 + extrusion2.w;
				extrusion2.y2 = extrusion2.y1;

				extrusion2.x3 = extrusion2.x2;
				extrusion2.y3 = extrusion2.y1 - extrusion2.d;

				extrusion2.x4 = extrusion1.x3;
				extrusion2.y4 = extrusion1.y3;

				extrusion2.svg = extrusion2.container.polygon([
					extrusion2.x1, extrusion2.y1,
					extrusion2.x2, extrusion2.y2,
					extrusion2.x3, extrusion2.y3,
					extrusion2.x4, extrusion2.y4
				]);
				extrusion2.svg.attr({
					fill: ssBase.color[color].htmlcolor,
					"stroke": "#000",
					"stroke-width": 1
				});

				this.lastx1 = extrusion2.x2;
				this.lasty1 = extrusion2.y2;
				this.lastx2 = extrusion2.x2;
				this.lasty2 = extrusion2.y3;

				break;
			case "45-W-SW":
				extrusion1.w = w;
				extrusion1.wi = wi;
				extrusion1.d = d;

				var leg = ssMath.calcRightTriangleLeg(w);
				var legwi = ssMath.calcRightTriangleLeg(wi);

				extrusion1.x1 = this.lastx1;
				extrusion1.y1 = this.lasty1;

				extrusion1.x2 = this.lastx1;
				extrusion1.y2 = extrusion1.y1 + w;

				extrusion1.x3 = this.lastx2;
				extrusion1.y3 = this.lasty2 + wi;

				extrusion1.x4 = this.lastx2;
				extrusion1.y4 = this.lasty2;

				extrusion1.svg = extrusion1.container.polygon([
					extrusion1.x1, extrusion1.y1,
					extrusion1.x2, extrusion1.y2,
					extrusion1.x3, extrusion1.y3,
					extrusion1.x4, extrusion1.y4
				]);

				extrusion1.svg.attr({
					fill: ssBase.color[color].htmlcolor,
					"stroke": "#000",
					"stroke-width": 1
				});

				extrusion2.w = w;
				extrusion2.d = d;
				extrusion2.x1 = extrusion1.x1;
				extrusion2.y1 = extrusion1.y2;

				extrusion2.x2 = extrusion2.x1 + leg;
				extrusion2.y2 = extrusion2.y1 + leg;

				extrusion2.x3 = extrusion1.x3 + legwi;
				extrusion2.y3 = extrusion1.y3 + legwi;

				extrusion2.x4 = extrusion1.x3;
				extrusion2.y4 = extrusion1.y3;

				extrusion2.svg = extrusion2.container.polygon([
					extrusion2.x1, extrusion2.y1,
					extrusion2.x2, extrusion2.y2,
					extrusion2.x3, extrusion2.y3,
					extrusion2.x4, extrusion2.y4
				]);
				extrusion2.svg.attr({
					fill: ssBase.color[color].htmlcolor,
					"stroke": "#000",
					"stroke-width": 1
				});
				this.lastx1 = extrusion2.x2;
				this.lasty1 = extrusion2.y2;
				this.lastx2 = extrusion2.x3;
				this.lasty2 = extrusion2.y3;

				break;
			case "45-SW-S":
				extrusion1.w = w;
				extrusion1.d = d;

				extrusion1.x1 = this.lastx1;
				extrusion1.y1 = this.lasty1;

				var leg = ssMath.calcRightTriangleLeg(w);
				var legwi = ssMath.calcRightTriangleLeg(wi);

				extrusion1.x2 = extrusion1.x1 + leg;
				extrusion1.y2 = extrusion1.y1 + leg;

				extrusion1.x3 = this.lastx2 + legwi;
				extrusion1.y3 = this.lasty2 + legwi;

				extrusion1.x4 = this.lastx2;
				extrusion1.y4 = this.lasty2;

				extrusion1.svg = extrusion1.container.polygon([
					extrusion1.x1, extrusion1.y1,
					extrusion1.x2, extrusion1.y2,
					extrusion1.x3, extrusion1.y3,
					extrusion1.x4, extrusion1.y4
				]);

				extrusion1.svg.attr({
					fill: ssBase.color[color].htmlcolor,
					"stroke": "#000",
					"stroke-width": 1
				});

				extrusion2.w = w;
				extrusion2.d = d;
				extrusion2.x1 = extrusion1.x2;
				extrusion2.y1 = extrusion1.y2;

				extrusion2.x2 = extrusion2.x1 + w;
				extrusion2.y2 = extrusion2.y1;

				extrusion2.x3 = extrusion1.x3 + wi;
				extrusion2.y3 = extrusion2.y1 - d;

				extrusion2.x4 = extrusion1.x3;
				extrusion2.y4 = extrusion1.y3;

				extrusion2.svg = extrusion2.container.polygon([
					extrusion2.x1, extrusion2.y1,
					extrusion2.x2, extrusion2.y2,
					extrusion2.x3, extrusion2.y3,
					extrusion2.x4, extrusion2.y4
				]);
				extrusion2.svg.attr({
					fill: ssBase.color[color].htmlcolor,
					"stroke": "#000",
					"stroke-width": 1
				});
				this.lastx1 = extrusion2.x2;
				this.lasty1 = extrusion2.y2;
				this.lastx2 = extrusion2.x3;
				this.lasty2 = extrusion2.y3;

				break;

			case "45-S-SE":
				extrusion1.w = w;
				extrusion1.d = d;

				extrusion1.x1 = this.lastx1;
				extrusion1.y1 = this.lasty1;

				var leg = ssMath.calcRightTriangleLeg(w);
				var legwi = ssMath.calcRightTriangleLeg(wi);

				extrusion1.x2 = extrusion1.x1 + w;
				extrusion1.y2 = extrusion1.y1;

				extrusion1.x3 = this.lastx2 + wi;
				extrusion1.y3 = extrusion1.y2 - d;

				extrusion1.x4 = this.lastx2;
				extrusion1.y4 = this.lasty2;

				extrusion1.svg = extrusion1.container.polygon([
					extrusion1.x1, extrusion1.y1,
					extrusion1.x2, extrusion1.y2,
					extrusion1.x3, extrusion1.y3,
					extrusion1.x4, extrusion1.y4
				]);

				extrusion1.svg.attr({
					fill: ssBase.color[color].htmlcolor,
					"stroke": "#000",
					"stroke-width": 1
				});

				extrusion2.w = w;
				extrusion2.d = d;
				extrusion2.x1 = extrusion1.x2;
				extrusion2.y1 = extrusion1.y2;

				extrusion2.x2 = extrusion2.x1 + leg;
				extrusion2.y2 = extrusion2.y1 - leg;

				extrusion2.x3 = extrusion1.x3 + legwi;
				extrusion2.y3 = extrusion1.y3 - legwi;

				extrusion2.x4 = extrusion1.x3;
				extrusion2.y4 = extrusion1.y3;

				extrusion2.svg = extrusion2.container.polygon([
					extrusion2.x1, extrusion2.y1,
					extrusion2.x2, extrusion2.y2,
					extrusion2.x3, extrusion2.y3,
					extrusion2.x4, extrusion2.y4
				]);
				extrusion2.svg.attr({
					fill: ssBase.color[color].htmlcolor,
					"stroke": "#000",
					"stroke-width": 1
				});
				this.lastx1 = extrusion2.x2;
				this.lasty1 = extrusion2.y2;
				this.lastx2 = extrusion2.x3;
				this.lasty2 = extrusion2.y3;

				break;
			case "45-S-SW":
				extrusion1.w = w;
				extrusion1.d = d;

				extrusion1.x1 = this.lastx1;
				extrusion1.y1 = this.lasty1;

				var leg = ssMath.calcRightTriangleLeg(w);
				var legwi = ssMath.calcRightTriangleLeg(wi);

				extrusion1.x2 = extrusion1.x1 + wi;
				extrusion1.y2 = extrusion1.y1;

				extrusion1.x3 = this.lastx2 + w;
				extrusion1.y3 = extrusion1.y2 - d;

				extrusion1.x4 = this.lastx2;
				extrusion1.y4 = this.lasty2;

				extrusion1.svg = extrusion1.container.polygon([
					extrusion1.x1, extrusion1.y1,
					extrusion1.x2, extrusion1.y2,
					extrusion1.x3, extrusion1.y3,
					extrusion1.x4, extrusion1.y4
				]);

				extrusion1.svg.attr({
					fill: ssBase.color[color].htmlcolor,
					"stroke": "#000",
					"stroke-width": 1
				});

				extrusion2.w = w;
				extrusion2.d = d;
				extrusion2.x1 = extrusion1.x2;
				extrusion2.y1 = extrusion1.y2;

				extrusion2.x2 = extrusion2.x1 + legwi;
				extrusion2.y2 = extrusion2.y1 + legwi;

				extrusion2.x3 = extrusion1.x3 + leg;
				extrusion2.y3 = extrusion1.y3 + leg;

				extrusion2.x4 = extrusion1.x3;
				extrusion2.y4 = extrusion1.y3;

				extrusion2.svg = extrusion2.container.polygon([
					extrusion2.x1, extrusion2.y1,
					extrusion2.x2, extrusion2.y2,
					extrusion2.x3, extrusion2.y3,
					extrusion2.x4, extrusion2.y4
				]);
				extrusion2.svg.attr({
					fill: ssBase.color[color].htmlcolor,
					"stroke": "#000",
					"stroke-width": 1
				});
				this.lastx1 = extrusion2.x2;
				this.lasty1 = extrusion2.y2;
				this.lastx2 = extrusion2.x3;
				this.lasty2 = extrusion2.y3;

				break;
			case "45-SE-E":
				extrusion1.w = w;
				extrusion1.d = d;

				extrusion1.x1 = this.lastx1;
				extrusion1.y1 = this.lasty1;

				var leg = ssMath.calcRightTriangleLeg(w);
				var legwi = ssMath.calcRightTriangleLeg(wi);

				extrusion1.x2 = extrusion1.x1 + leg;
				extrusion1.y2 = extrusion1.y1 - leg;

				var legwi = ssMath.calcRightTriangleLeg(wi);
				extrusion1.x3 = this.lastx2 + legwi;
				extrusion1.y3 = this.lasty2 - legwi;

				extrusion1.x4 = this.lastx2;
				extrusion1.y4 = this.lasty2;

				extrusion1.svg = extrusion1.container.polygon([
					extrusion1.x1, extrusion1.y1,
					extrusion1.x2, extrusion1.y2,
					extrusion1.x3, extrusion1.y3,
					extrusion1.x4, extrusion1.y4
				]);

				extrusion1.svg.attr({
					fill: ssBase.color[color].htmlcolor,
					"stroke": "#000",
					"stroke-width": 1
				});

				extrusion2.w = w;
				extrusion2.d = d;
				extrusion2.x1 = extrusion1.x2;
				extrusion2.y1 = extrusion1.y2;

				extrusion2.x2 = extrusion2.x1;
				extrusion2.y2 = extrusion2.y1 - w;

				extrusion2.x3 = extrusion2.x2 - d;
				extrusion2.y3 = extrusion2.y2;

				extrusion2.x4 = extrusion1.x3;
				extrusion2.y4 = extrusion1.y3;

				extrusion2.svg = extrusion2.container.polygon([
					extrusion2.x1, extrusion2.y1,
					extrusion2.x2, extrusion2.y2,
					extrusion2.x3, extrusion2.y3,
					extrusion2.x4, extrusion2.y4
				]);
				extrusion2.svg.attr({
					fill: ssBase.color[color].htmlcolor,
					"stroke": "#000",
					"stroke-width": 1
				});
				this.lastx1 = extrusion2.x2;
				this.lasty1 = extrusion2.y2;
				this.lastx2 = extrusion2.x3;
				this.lasty2 = extrusion2.y3;

				break;
			case "45-SE-S":
				extrusion1.w = w;
				extrusion1.d = d;

				extrusion1.x1 = this.lastx1;
				extrusion1.y1 = this.lasty1;

				var leg = ssMath.calcRightTriangleLeg(w);
				var legwi = ssMath.calcRightTriangleLeg(wi);

				extrusion1.x2 = extrusion1.x1 + legwi;
				extrusion1.y2 = extrusion1.y1 - legwi;

				var legwi = ssMath.calcRightTriangleLeg(wi);
				extrusion1.x3 = this.lastx2 + leg;
				extrusion1.y3 = this.lasty2 - leg;

				extrusion1.x4 = this.lastx2;
				extrusion1.y4 = this.lasty2;

				extrusion1.svg = extrusion1.container.polygon([
					extrusion1.x1, extrusion1.y1,
					extrusion1.x2, extrusion1.y2,
					extrusion1.x3, extrusion1.y3,
					extrusion1.x4, extrusion1.y4
				]);

				extrusion1.svg.attr({
					fill: ssBase.color[color].htmlcolor,
					"stroke": "#000",
					"stroke-width": 1
				});

				extrusion2.w = w;
				extrusion2.d = d;
				extrusion2.x1 = extrusion1.x2;
				extrusion2.y1 = extrusion1.y2;

				extrusion2.x2 = extrusion2.x1 + wi;
				extrusion2.y2 = extrusion2.y1;

				extrusion2.x3 = extrusion2.x2;
				extrusion2.y3 = extrusion2.y2 - d;

				extrusion2.x4 = extrusion1.x3;
				extrusion2.y4 = extrusion1.y3;

				extrusion2.svg = extrusion2.container.polygon([
					extrusion2.x1, extrusion2.y1,
					extrusion2.x2, extrusion2.y2,
					extrusion2.x3, extrusion2.y3,
					extrusion2.x4, extrusion2.y4
				]);
				extrusion2.svg.attr({
					fill: ssBase.color[color].htmlcolor,
					"stroke": "#000",
					"stroke-width": 1
				});
				this.lastx1 = extrusion2.x2;
				this.lasty1 = extrusion2.y2;
				this.lastx2 = extrusion2.x3;
				this.lasty2 = extrusion2.y3;

				break;
			case "90-S-E":

				extrusion1.w = w;
				extrusion1.d = d;

				extrusion1.x1 = this.lastx1;
				extrusion1.y1 = this.lasty1;

				extrusion1.x2 = extrusion1.x1 + extrusion1.w;
				extrusion1.y2 = extrusion1.y1;

				extrusion1.x3 = extrusion1.x2 - extrusion1.d;
				extrusion1.y3 = extrusion1.y1 - extrusion1.d;

				extrusion1.x4 = this.lastx2;
				extrusion1.y4 = this.lasty2;

				extrusion1.svg = extrusion1.container.polygon([
					extrusion1.x1, extrusion1.y1,
					extrusion1.x2, extrusion1.y2,
					extrusion1.x3, extrusion1.y3,
					extrusion1.x4, extrusion1.y4
				]);
				extrusion1.svg.attr({
					fill: ssBase.color[color].htmlcolor,
					"stroke": "#000",
					"stroke-width": 1
				});

				extrusion2.w = w;
				extrusion2.d = d;
				extrusion2.x1 = extrusion1.x2;
				extrusion2.y1 = extrusion1.y2;

				extrusion2.x2 = extrusion2.x1;
				extrusion2.y2 = extrusion2.y1 - extrusion2.w;

				extrusion2.x3 = extrusion2.x2 - extrusion2.d;
				extrusion2.y3 = extrusion2.y2;

				extrusion2.x4 = extrusion1.x3;
				extrusion2.y4 = extrusion1.y3;

				extrusion2.svg = extrusion2.container.polygon([
					extrusion2.x1, extrusion2.y1,
					extrusion2.x2, extrusion2.y2,
					extrusion2.x3, extrusion2.y3,
					extrusion2.x4, extrusion2.y4
				]);
				extrusion2.svg.attr({
					fill: ssBase.color[color].htmlcolor,
					"stroke": "#000",
					"stroke-width": 1
				});
				this.lastx1 = extrusion2.x2;
				this.lasty1 = extrusion2.y2;
				this.lastx2 = extrusion2.x3;
				this.lasty2 = extrusion2.y3;

				break;
			case "90-E-N":

				extrusion1.w = w;
				extrusion1.d = d;

				extrusion1.x1 = this.lastx1;
				extrusion1.y1 = this.lasty1;

				extrusion1.x2 = extrusion1.x1;
				extrusion1.y2 = extrusion1.y1 - w;

				extrusion1.x3 = extrusion1.x2 - d;
				extrusion1.y3 = extrusion1.y1 - d;

				extrusion1.x4 = this.lastx2;
				extrusion1.y4 = this.lasty2;

				extrusion1.svg = extrusion1.container.polygon([
					extrusion1.x1, extrusion1.y1,
					extrusion1.x2, extrusion1.y2,
					extrusion1.x3, extrusion1.y3,
					extrusion1.x4, extrusion1.y4
				]);
				extrusion1.svg.attr({
					fill: ssBase.color[color].htmlcolor,
					"stroke": "#000",
					"stroke-width": 1
				});

				extrusion2.w = w;
				extrusion2.d = d;
				extrusion2.x1 = extrusion1.x2;
				extrusion2.y1 = extrusion1.y2;

				extrusion2.x2 = extrusion2.x1 - w;
				extrusion2.y2 = extrusion2.y1;

				extrusion2.x3 = extrusion2.x2;
				extrusion2.y3 = extrusion1.y3;

				extrusion2.x4 = extrusion1.x3;
				extrusion2.y4 = extrusion1.y3;

				extrusion2.svg = extrusion2.container.polygon([
					extrusion2.x1, extrusion2.y1,
					extrusion2.x2, extrusion2.y2,
					extrusion2.x3, extrusion2.y3,
					extrusion2.x4, extrusion2.y4
				]);
				extrusion2.svg.attr({
					fill: ssBase.color[color].htmlcolor,
					"stroke": "#000",
					"stroke-width": 1
				});
				this.lastx1 = extrusion2.x2;
				this.lasty1 = extrusion2.y2;
				this.lastx2 = extrusion2.x3;
				this.lasty2 = extrusion2.y3;

				break;
			case "E":
				extrusion.w = w;
				extrusion.d = d;
				extrusion.x2 = this.lastx1;
				extrusion.y2 = this.lasty1;
				extrusion.x1 = extrusion.x2 - extrusion.d;
				extrusion.y1 = extrusion.y2 - extrusion.w;
				extrusion.y3 = extrusion.y1;
				extrusion.svg = extrusion.container.polygon([extrusion.x1, extrusion.y1,
					extrusion.x1, extrusion.y2,
					extrusion.x2, extrusion.y2,
					extrusion.x2, extrusion.y3
				]);
				extrusion.svg.attr({
					fill: ssBase.color[color].htmlcolor,
					"stroke": "#000",
					"stroke-width": 1
				});
				break;
			}
		};

		// ---------------------------------------
		// Section
		// ---------------------------------------
		this.renderSection = function (direction, color, w, d, l) {
			var extrusion = {};
			extrusion.container = this.container;
			switch (direction) {
			case "W":
				extrusion.w = w;
				extrusion.d = d;
				extrusion.x1 = this.lastx1;
				extrusion.y1 = this.lasty1;
				extrusion.x2 = extrusion.x1 + extrusion.d;
				extrusion.y2 = extrusion.y1 + extrusion.w;
				extrusion.y3 = extrusion.y1;

				extrusion.svg = extrusion.container.polygon([extrusion.x1, extrusion.y1,
					extrusion.x1, extrusion.y2,
					extrusion.x2, extrusion.y2,
					extrusion.x2, extrusion.y3
				]);
				this.lastx = extrusion.x1;
				this.lasty = extrusion.y2;
				this.lastx1 = extrusion.x1;
				this.lasty1 = extrusion.y2;
				this.lastx2 = extrusion.x2;
				this.lasty2 = extrusion.y2;
				break;
			case "SW":
				extrusion.w = w;
				extrusion.d = d;
				extrusion.x1 = this.lastx1;
				extrusion.y1 = this.lasty1;

				var leg = ssMath.calcRightTriangleLeg(extrusion.w);
				extrusion.x2 = extrusion.x1 + leg;
				extrusion.y2 = extrusion.y1 + leg;

				extrusion.x3 = this.lastx2 + leg;
				extrusion.y3 = this.lasty2 + leg;

				extrusion.x4 = this.lastx2;
				extrusion.y4 = this.lasty2;

				extrusion.svg = extrusion.container.polygon([extrusion.x1, extrusion.y1,
					extrusion.x2, extrusion.y2,
					extrusion.x3, extrusion.y3,
					extrusion.x4, extrusion.y4
				]);
				this.lastx1 = extrusion.x2;
				this.lasty1 = extrusion.y2;
				this.lastx2 = extrusion.x3;
				this.lasty2 = extrusion.y3;
				break;

			case "S":
				extrusion.w = w;
				extrusion.d = d;
				extrusion.x1 = this.lastx1;
				extrusion.y1 = this.lasty1 - d;
				extrusion.x2 = extrusion.x1 + extrusion.w;
				extrusion.y2 = extrusion.y1 + extrusion.d;
				extrusion.y3 = extrusion.y1;

				extrusion.svg = extrusion.container.polygon([extrusion.x1, extrusion.y1,
					extrusion.x1, extrusion.y2,
					extrusion.x2, extrusion.y2,
					extrusion.x2, extrusion.y3
				]);
				this.lastx = extrusion.x2;
				this.lasty = extrusion.y2;
				this.lastx1 = extrusion.x2;
				this.lasty1 = extrusion.y2;
				this.lastx2 = extrusion.x2;
				this.lasty2 = extrusion.y3;
				break;
			case "SE":
				extrusion.w = w;
				extrusion.d = d;
				extrusion.x1 = this.lastx1;
				extrusion.y1 = this.lasty1;

				var leg = ssMath.calcRightTriangleLeg(w);
				extrusion.x2 = extrusion.x1 + leg;
				extrusion.y2 = extrusion.y1 - leg;

				extrusion.x3 = this.lastx2 + leg;
				extrusion.y3 = this.lasty2 - leg;

				extrusion.x4 = this.lastx2;
				extrusion.y4 = this.lasty2;

				extrusion.svg = extrusion.container.polygon([extrusion.x1, extrusion.y1,
					extrusion.x2, extrusion.y2,
					extrusion.x3, extrusion.y3,
					extrusion.x4, extrusion.y4
				]);
				this.lastx1 = extrusion.x2;
				this.lasty1 = extrusion.y2;
				this.lastx2 = extrusion.x3;
				this.lasty2 = extrusion.y3;
				break;

			case "E":
				extrusion.w = w;
				extrusion.d = d;
				extrusion.x1 = this.lastx1;
				extrusion.y1 = this.lasty1;
				extrusion.x2 = extrusion.x1 - extrusion.d;
				extrusion.y2 = extrusion.y1 - extrusion.w;
				extrusion.y3 = extrusion.y1;

				extrusion.svg = extrusion.container.polygon([extrusion.x1, extrusion.y1,
					extrusion.x1, extrusion.y2,
					extrusion.x2, extrusion.y2,
					extrusion.x2, extrusion.y3
				]);
				this.lastx1 = extrusion.x1;
				this.lasty1 = extrusion.y2;
				this.lastx2 = extrusion.x2;
				this.lasty2 = extrusion.y2;
				break;
			case "N":
				extrusion.w = w;
				extrusion.d = d;
				extrusion.x1 = this.lastx1;
				extrusion.y1 = this.lasty1;
				extrusion.x2 = extrusion.x1 - extrusion.w;
				extrusion.y2 = extrusion.y1 + extrusion.d;
				extrusion.y3 = extrusion.y1;

				extrusion.svg = extrusion.container.polygon([extrusion.x1, extrusion.y1,
					extrusion.x1, extrusion.y2,
					extrusion.x2, extrusion.y2,
					extrusion.x2, extrusion.y3
				]);
				this.lastx1 = extrusion.x2;
				this.lasty1 = extrusion.y1;
				this.lastx2 = extrusion.x2;
				this.lasty2 = extrusion.y2;
				break;
			}
			//          try{
			extrusion.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});

			//			this.extrusions.push(extrusion);
			//          }
			//        catch(e){};
		};

	};

});