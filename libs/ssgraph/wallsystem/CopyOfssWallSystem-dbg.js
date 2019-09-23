sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase",
], function(ssMath, core, ssBase) {
	return function(client, data, myParent, x, y) {
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
			var w = 0;
			var d = 0;
			var color = "WH";
			var data = this.getData();
			this.isReady = true;

			var walls = core.getModels(this.getData(), 'wlWall');

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
			this.renderBuilding();

			var x = 0;
			var y = this.building.w;
			this.extrusions.push({
				x1: 0,
				y1: this.building.w,
				x2: 0,
				y2: this.building.w
			});

			for (var i = 0; i < walls.length; i++) {
				var awall = walls[i];
				this.renderWall(awall);
			}

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
			data.parent = this;
			this.building = this.getClient().draw(data, this.x, this.y, this.container);

		};
		this.renderWall = function(wdata) {
			var lastwall;
			if (this.walls.length > 0) {
				lastwall = this.walls[this.walls.length - 1];
			} else {
				lastwall = {
					direction: ""
				};
			}
			var thiswall = {
				direction: wdata.Data.Direction,
				inters: ""
			};
			thiswall.inters = lastwall.direction + thiswall.direction;
			this.walls.push(thiswall);
			this.renderWallBeginPost(wdata);
			this.renderWallStarter(wdata);
			this.renderWallStarterFiller(wdata);
			this.renderWallMods(wdata);
			this.renderWallReceiverFiller(wdata);
			this.renderWallReceiver(wdata);
			this.renderWallEndPost(wdata);
		};
		this.renderWallBeginPost = function(wdata) {
			var d = 2;
			var w;
			var l;
			var x;
			var y;
			var color = "WH";

			var thiswall = this.walls[this.walls.length - 1];

			var data = core.getModel(wdata, "exBeginPost");
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
	        var last = undefined;
			if (this.extrusions.length > 0) {
				last = this.extrusions[this.extrusions.length - 1];
			}
			var extrusion = {};
			extrusion.container = this.container;
			switch (thiswall.direction) {
				case "W":
					x = last.x1;
					y = last.y2;
					extrusion.w = w;
					extrusion.d = d;
					extrusion.x1 = x;
					extrusion.y1 = y;
					extrusion.x2 = extrusion.x1 + extrusion.d;
					extrusion.y2 = extrusion.y1 + extrusion.w;
					extrusion.y3 = extrusion.y1;
					break;
				case "S":
					x = last.x2;
					y = last.y2;
					extrusion.w = d;
					extrusion.d = w;
					extrusion.x1 = x;
					extrusion.y2 = y;
					extrusion.x2 = extrusion.x1 + extrusion.d;
					extrusion.y1 = extrusion.y2 - extrusion.w;
					extrusion.y3 = extrusion.y1;
					break;
				case "E":
					x = last.x2;
					y = last.y1;
					extrusion.w = w;
					extrusion.d = d;
					extrusion.x2 = x;
					extrusion.y2 = y;
					extrusion.x1 = extrusion.x2 - extrusion.d;
					extrusion.y1 = extrusion.y2 - extrusion.w;
					extrusion.y3 = extrusion.y1;
					break;
			}
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

			this.extrusions.push(extrusion);

		};
		this.renderWallStarter = function(wdata) {
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
	        var last = undefined;
			if (this.extrusions.length > 0) {
				last = this.extrusions[this.extrusions.length - 1];
			}
			var extrusion = {};
			extrusion.container = this.container;
			switch (thiswall.direction) {
				case "W":
					x = last.x1;
					y = last.y2;
					extrusion.w = w;
					extrusion.d = d;
					extrusion.x1 = x;
					extrusion.y1 = y;
					extrusion.x2 = extrusion.x1 + extrusion.d;
					extrusion.y2 = extrusion.y1 + extrusion.w;
					extrusion.y3 = extrusion.y1;
					break;
				case "S":
					x = last.x2;
					y = last.y2;
					extrusion.w = d;
					extrusion.d = w;
					extrusion.x1 = x;
					extrusion.y2 = y;
					extrusion.x2 = extrusion.x1 + extrusion.d;
					extrusion.y1 = extrusion.y2 - extrusion.w;
					extrusion.y3 = extrusion.y1;
					break;
				case "E":
					x = last.x2;
					y = last.y1;
					extrusion.w = w;
					extrusion.d = d;
					extrusion.x2 = x;
					extrusion.y2 = y;
					extrusion.x1 = extrusion.x2 - extrusion.d;
					extrusion.y1 = extrusion.y2 - extrusion.w;
					extrusion.y3 = extrusion.y1;
					break;
			}
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

			this.extrusions.push(extrusion);

		};
		this.renderWallStarterFiller = function(wdata) {
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
			var last = undefined;
			if (this.extrusions.length > 0) {
				last = this.extrusions[this.extrusions.length - 1];
			}
			var extrusion = {};
			var last = undefined;
			if (this.extrusions.length > 0) {
				last = this.extrusions[this.extrusions.length - 1];
			}
			extrusion.container = this.container;
			switch (thiswall.direction) {
				case "W":
					x = last.x1;
					y = last.y2;
					extrusion.w = w;
					extrusion.d = d;
					extrusion.x1 = x;
					extrusion.y1 = y;
					extrusion.x2 = extrusion.x1 + extrusion.d;
					extrusion.y2 = extrusion.y1 + extrusion.w;
					extrusion.y3 = extrusion.y1;
					break;
				case "S":
					x = last.x2;
					y = last.y2;
					extrusion.w = d;
					extrusion.d = w;
					extrusion.x1 = x;
					extrusion.y2 = y;
					extrusion.x2 = extrusion.x1 + extrusion.d;
					extrusion.y1 = extrusion.y2 - extrusion.w;
					extrusion.y3 = extrusion.y1;
					break;
				case "E":
					x = last.x2;
					y = last.y1;
					extrusion.w = w;
					extrusion.d = d;
					extrusion.x2 = x;
					extrusion.y2 = y;
					extrusion.x1 = extrusion.x2 - extrusion.d;
					extrusion.y1 = extrusion.y2 - extrusion.w;
					extrusion.y3 = extrusion.y1;
					break;
			}	
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
			this.extrusions.push(extrusion);

		};

		this.renderWallMods = function(data, x, y) {
			var w=0;
			var l=0;
			
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
					if (objmods[j].Data === undefined){ continue;}
					if (objmods[j].Data.Id === lstmods[i].Id) {
						break;
					}
				}
				var amod = objmods[j];
				if(amod === undefined){ continue;}
				if (amod.model["WIDTH"] != undefined) {
					w = Number(amod.model["WIDTH"].value);
					if (w == undefined) {
						w = 1;
					}
				}else{
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
		this.renderMod = function(data) {
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
			}
			else{
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

			var extrusion = {};
			var last = undefined;
			if (this.extrusions.length > 0) {
				last = this.extrusions[this.extrusions.length - 1];
			}
			extrusion.container = this.container;
			switch (thiswall.direction) {
				case "W":
					x = last.x1;
					y = last.y2;
					extrusion.w = w;
					extrusion.d = d;
					extrusion.x1 = x;
					extrusion.y1 = y;
					extrusion.x2 = extrusion.x1 + extrusion.d;
					extrusion.y2 = extrusion.y1 + extrusion.w;
					extrusion.y3 = extrusion.y1;
					break;
				case "S":
					x = last.x2;
					y = last.y2;
					extrusion.w = d;
					extrusion.d = w;
					extrusion.x1 = x;
					extrusion.y2 = y;
					extrusion.x2 = extrusion.x1 + extrusion.d;
					extrusion.y1 = extrusion.y2 - extrusion.w;
					extrusion.y3 = extrusion.y1;
					break;
				case "E":
					x = last.x2;
					y = last.y1;
					extrusion.w = w;
					extrusion.d = d;
					extrusion.x2 = x;
					extrusion.y2 = y;
					extrusion.x1 = extrusion.x2 - extrusion.d;
					extrusion.y1 = extrusion.y2 - extrusion.w;
					extrusion.y3 = extrusion.y1;
					break;			
				
			}
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

			this.extrusions.push(extrusion);

		};

		this.renderWallReceiver = function(wdata) {
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

			var last = undefined;
			if (this.extrusions.length > 0) {
				last = this.extrusions[this.extrusions.length - 1];
			}
			var extrusion = {};
			extrusion.container = this.container;
			switch (thiswall.direction) {
				case "W":
					x = last.x1;
					y = last.y2;
					extrusion.w = w;
					extrusion.d = d;
					extrusion.x1 = x;
					extrusion.y1 = y;
					extrusion.x2 = extrusion.x1 + extrusion.d;
					extrusion.y2 = extrusion.y1 + extrusion.w;
					extrusion.y3 = extrusion.y1;
					break;
				case "S":
					x = last.x2;
					y = last.y2;
					extrusion.w = d;
					extrusion.d = w;
					extrusion.x1 = x;
					extrusion.y2 = y;
					extrusion.x2 = extrusion.x1 + extrusion.d;
					extrusion.y1 = extrusion.y2 - extrusion.w;
					extrusion.y3 = extrusion.y1;
					break;
				case "E":
					x = last.x2;
					y = last.y1;
					extrusion.w = w;
					extrusion.d = d;
					extrusion.x2 = x;
					extrusion.y2 = y;
					extrusion.x1 = extrusion.x2 - extrusion.d;
					extrusion.y1 = extrusion.y2 - extrusion.w;
					extrusion.y3 = extrusion.y1;
					break;			
				
			}	
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

			this.extrusions.push(extrusion);

		};
		this.renderWallReceiverFiller = function(wdata) {
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
			var last = undefined;
			if (this.extrusions.length > 0) {
				last = this.extrusions[this.extrusions.length - 1];
			}
			var extrusion = {};
			extrusion.container = this.container;
			switch (thiswall.direction) {
				case "W":
					x = last.x1;
					y = last.y2;
					extrusion.w = w;
					extrusion.d = d;
					extrusion.x1 = x;
					extrusion.y1 = y;
					extrusion.x2 = extrusion.x1 + extrusion.d;
					extrusion.y2 = extrusion.y1 + extrusion.w;
					extrusion.y3 = extrusion.y1;
					break;
				case "S":
					x = last.x2;
					y = last.y2;
					extrusion.w = d;
					extrusion.d = w;
					extrusion.x1 = x;
					extrusion.y2 = y;
					extrusion.x2 = extrusion.x1 + extrusion.d;
					extrusion.y1 = extrusion.y2 - extrusion.w;
					extrusion.y3 = extrusion.y1;
					break;
				case "E":
					x = last.x2;
					y = last.y1;
					extrusion.w = w;
					extrusion.d = d;
					extrusion.x2 = x;
					extrusion.y2 = y;
					extrusion.x1 = extrusion.x2 - extrusion.d;
					extrusion.y1 = extrusion.y2 - extrusion.w;
					extrusion.y3 = extrusion.y1;
					break;
				}	
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
			this.extrusions.push(extrusion);

		};
		this.renderWallEndPost = function(wdata) {
			var d = 2;
			var w;
			var l;
			var x;
			var y;
			var color = "WH";

			var thiswall = this.walls[this.walls.length - 1];

			var data = core.getModel(wdata, "exEndPost");
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
	        var last = undefined;
			if (this.extrusions.length > 0) {
				last = this.extrusions[this.extrusions.length - 1];
			}
			var extrusion = {};
			extrusion.container = this.container;
			switch (thiswall.direction) {
				case "W":
					x = last.x1;
					y = last.y2;
					extrusion.w = w;
					extrusion.d = d;
					extrusion.x1 = x;
					extrusion.y1 = y;
					extrusion.x2 = extrusion.x1 + extrusion.d;
					extrusion.y2 = extrusion.y1 + extrusion.w;
					extrusion.y3 = extrusion.y1;
					break;
				case "S":
					x = last.x2;
					y = last.y2;
					extrusion.w = d;
					extrusion.d = w;
					extrusion.x1 = x;
					extrusion.y2 = y;
					extrusion.x2 = extrusion.x1 + extrusion.d;
					extrusion.y1 = extrusion.y2 - extrusion.w;
					extrusion.y3 = extrusion.y1;
					break;
				case "E":
					x = last.x2;
					y = last.y1;
					extrusion.w = w;
					extrusion.d = d;
					extrusion.x2 = x;
					extrusion.y2 = y;
					extrusion.x1 = extrusion.x2 - extrusion.d;
					extrusion.y1 = extrusion.y2 - extrusion.w;
					extrusion.y3 = extrusion.y1;
					break;
			}
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

			this.extrusions.push(extrusion);

		};

	};

});