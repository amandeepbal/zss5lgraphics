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
			this.laste = {
				x1: 0,
				y1: 0,
				x2: 0,
				y2: 0,
				x3: 0,
				y3: 0,
				x4: 0,
				y4: 0
			};
			this.prevf = "S";
			for (var i = 0; i < walls.length; i++) {
				var awall = walls[i];
				if (i === 0) {
					this.laste.x1 = Number(awall.model['WIDTH'].value);
					this.laste.x2 = Number(awall.model['WIDTH'].value);
					this.laste.x3 = Number(awall.model['WIDTH'].value);
					this.laste.x4 = Number(awall.model['WIDTH'].value);
					this.laste.y1 = this.building.w;
					this.laste.y2 = this.building.w;
					this.laste.y3 = this.building.w;
					this.laste.y4 = this.building.w;
					this.nextp = walls[0].model['FACING'].value;
				}
				if (Number(awall.model['WIDTH'].value) <= 0) {
					break;
				}

				this.nextf = "";
				if (i + 1 < walls.length - 1) {
					this.nextf = walls[i + 1].model['FACING'].value;
				}
				this.renderWall(awall);
				this.prevf = this.nextf;
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
			this.walls.push(wdata);
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
			this.renderPost(color, w, d, wdata.model['FACING'].value);
		};
		this.renderWallStarter = function (wdata) {
			var d = 2;
			var w;
			var l;
			var x;
			var y;
			var color = "WH";

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
			this.renderSection(color, w, d, wdata.model['FACING'].value);
		};
		this.renderWallStarterFiller = function (wdata) {
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
			this.renderSection(color, w, d, wdata.model['FACING'].value);
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
				this.renderMod(amod, data.model['FACING'].value);
			}
		};
		this.renderMod = function (data, f) {
			var d = 2;
			var w;
			var l;
			var x;
			var y;
			var color = "WH";

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
			this.renderSection(color, w, d, f);
		};

		this.renderWallReceiver = function (wdata) {
			var d = 2;
			var w;
			var l;
			var x;
			var y;
			var color = "WH";

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
			this.renderSection(color, w, d, wdata.model['FACING'].value);

		};
		this.renderWallReceiverFiller = function (wdata) {
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
			this.renderSection(color, w, d, wdata.model['FACING'].value);
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
			this.renderPost(color, w, d, wdata.model['FACING'].value);
		};
		// ---------------------------------------
		// End POST
		// ---------------------------------------
		this.renderPost = function (color, w, d, f) {
			w = this.client.convert(w);
			d = this.client.convert(d);
			var extrusion = {};
			extrusion.container = this.container;
			extrusion.w = w;
			extrusion.d = d;
			this.calcposition(extrusion, f);
			extrusion.svg = extrusion.container.polygon([
				extrusion.x1, extrusion.y1,
				extrusion.x2, extrusion.y2,
				extrusion.x3, extrusion.y3,
				extrusion.x4, extrusion.y4
			]);

			extrusion.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
		};

		this.calcposition = function (e, f) {
			switch (this.prevf) {
			case "":
				this.positionFromSouth(e, f);
				break;
			case "S":
				this.positionFromSouth(e, f);
				break;
			case "E":
				this.positionFromEast(e, f);
				break;
			case "N":
				this.positionFromNorth(e, f);
				break;
			case "W":
				this.positionFromWest(e, f);
				break;
			}
		};
		this.positionFromSouth = function (e, f) {
			var le = this.laste;
			var x = 0;
			var y = 0;
			switch (f) {
			case "S":
				x = le.x2;
				y = le.y2;
				e.x1 = x;
				e.y1 = y;
				e.x2 = x - e.w;
				e.y2 = y;
				e.x3 = x - e.w;
				e.y3 = y + e.d;
				e.x4 = x;
				e.y4 = y + e.d;
				this.prevf = "S";
				break;
			case "E":
				x = le.x3;
				y = le.y3;
				e.x1 = x;
				e.y1 = y;
				e.x2 = x;
				e.y2 = y + e.w;
				e.x3 = x + e.d;
				e.y3 = y + e.w;
				e.x4 = x + e.d;
				e.y4 = y;
				this.prevf = "E";
				break;
			}
			this.laste = e;
		};
		this.positionFromEast = function (e, f) {
			var le = this.laste;
			var x = 0;
			var y = 0;

			switch (f) {
			case "E":
				x = le.x2;
				y = le.y2;
				e.x1 = x;
				e.y1 = y;
				e.x2 = x;
				e.y2 = y + e.w;
				e.x3 = x + e.d;
				e.y3 = y + e.w;
				e.x4 = x + e.d;
				e.y4 = y;
				break;
				this.prevf = "E";
			case "N":
				x = le.x3;
				y = le.y3;
				e.x1 = x;
				e.y1 = y;
				e.x2 = x + e.w;
				e.y2 = y;
				e.x3 = x + e.w;
				e.y3 = y - e.d;
				e.x4 = x;
				e.y4 = y - e.d;
				this.prevf = "N";
				break;
			}
			this.laste = e;
		};
		this.positionFromNorth = function (e, f) {
			var le = this.laste;
			var x = 0;
			var y = 0;

			switch (f) {
			case "N":
				x = le.x2;
				y = le.y2;
				e.x1 = x;
				e.y1 = y;
				e.x2 = x + e.w;
				e.y2 = y;
				e.x3 = x + e.w;
				e.y3 = y - e.d;
				e.x4 = x;
				e.y4 = y - e.d;
				this.prevf = "N";
				break;
			case "W":
				x = le.x3;
				y = le.y3;
				e.x1 = x;
				e.y1 = y;
				e.x2 = x;
				e.y2 = y - e.w;
				e.x3 = x - e.d;
				e.y3 = y - e.w;
				e.x4 = x - e.d;
				e.y4 = y;
				this.prevf = "W";
				break;
			}
			this.laste = e;
		};
		this.positionFromWest = function (e, f) {
			var le = this.laste;
			var x = 0;
			var y = 0;

			switch (f) {
			case "W":
				x = le.x4;
				y = le.y4;
				e.x1 = x;
				e.y1 = y;
				e.x2 = x;
				e.y2 = y - e.w;
				e.x3 = x - e.d;
				e.y3 = y - e.w;
				e.x4 = x - e.d;
				e.y4 = y - e.w;
				this.prevf = "W";
				break;
			case "S":
				x = le.x4;
				y = le.y4;
				e.x1 = x;
				e.y1 = y;
				e.x2 = x - e.w;
				e.y2 = y - e.d;
				e.x3 = x - e.w;
				e.y3 = y - e.d;
				e.x4 = x;
				e.y4 = y - e.d;
				this.prevf = "S";
				break;
			}
		};

		// ---------------------------------------
		// Section
		// ---------------------------------------
		this.renderSection = function (color, w, d, f) {
			var extrusion = {};
			extrusion.container = this.container;
			extrusion.w = w;
			extrusion.d = d;
			this.calcposition(extrusion, f);

			extrusion.svg = extrusion.container.polygon([extrusion.x1, extrusion.y1,
				extrusion.x2, extrusion.y2,
				extrusion.x3, extrusion.y3,
				extrusion.x4, extrusion.y4
			]);
			extrusion.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});

		};

	};

});