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
		this.sideN = {
			container: undefined,
			svg: undefined,
			x: 0,
			y: 0
		};
		this.sideS = {
			container: undefined,
			svg: undefined,
			x: 0,
			y: 0
		};
		this.sideE = {
			container: undefined,
			svg: undefined,
			x: 0,
			y: 0
		};
		this.sideW = {
			container: undefined,
			svg: undefined,
			x: 0,
			y: 0
		};

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
			var h = 0;
			var l = 0;
			var bx = 10;
			var by = 5;
			var color = "WH";

			this.container = this.getParent().nested();
			var data = this.getData();
			this.isReady = true;

			if (data.model["HEIGHT"] != undefined) {
				h = Number(data.model["HEIGHT"].value);
				if (h == undefined) {
					h = 1;
				}
			}
			if (data.model["LENGTH"] != undefined) {
				l = Number(data.model["LENGTH"].value);
				if (l == undefined) {
					l = 1;
				}
			}

			if (h <= 0) return;
			if (l <= 0) return;

			l = this.client.convert(l);
			h = this.client.convert(h);
			bx = this.client.convert(bx);
			by = this.client.convert(by);

			this.h = h;
			this.l = l;
			this.tw = tw;
			this.color = color;

			this.x1 = x + bx;
			this.y1 = this.client.convert(90);
			this.x2 = this.x1 + l;
			this.y2 = this.y1 - h;
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
			var d = '1';

			//	        if (data.model["DECK.DIRECTION"] != undefined) {
			//				d = data.model["DECK.DIRECTION"].value;
			//			}			
			//			var objDeckPlanks = core.getModel(this.getData(), 'dsDeckPlanks');
			//			if (objDeckPlanks === undefined) {
			//				return;
			//			}

			var objmods = core.getAllModels(this.data);
			if (objmods === undefined) {
				return;
			}
			objmods.sort(function(a, b) {
				return (Number(a.Data.Position) > Number(b.Data.Position)) ? 1 : ((Number(b.Data.Position) > Number(a.Data.Position)) ? -1 : 0);
			});
			var x = this.x1;
			//			var y = this.y2;
			var y = this.client.convert(90);
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
				//				 y = mod.y2; 
			}

		};
		this.renderNosing = function() {
			var l = 0;
			var w = 0;

			if (data.model["LENGTH"] != undefined) {
				l = data.model["LENGTH"].value;
			}
			if (data.model["WIDTH"] != undefined) {
				w = data.model["WIDTH"].value;
			}

			l = this.client.convert(l);
			w = this.client.convert(w);
			var objDeckNosing = core.getModel(this.getData(), 'dsDeckNosing');
			if (objDeckNosing === undefined) {
				return;
			}

			var objmods = core.getModels(objDeckNosing, 'dsDeckNosingMolding');
			if (objmods === undefined) {
				return;
			}
			objmods.sort(function(a, b) {
				return (Number(a.Data.Position) > Number(b.Data.Position)) ? 1 : ((Number(b.Data.Position) > Number(a.Data.Position)) ? -1 : 0);
			});
			var x = this.x1;
			var y = this.y1;

			for (var i = 0; i < objmods.length; i++) {
				var amod = objmods[i];
				if (amod.Code != 'dsDeckNosingMolding') {
					continue;
				}
				switch (amod.model['ATTACHED.TO.SIDE'].value) {
					case "N":
						this.renderSideN(amod, this.x1, this.y1);
						break;
					case "S":
						this.renderSideS(amod, this.x1, this.y1 + l);
						break;
					case "W":
						this.renderSideW(amod, this.x1, this.y1);
						break;
					case "E":
						this.renderSideE(amod, this.x1 + w, this.y1);
						break;
				}
			}

		};

		this.renderSideN = function(data, x, y) {
			var l;
			var w;
			var d;
			var color = "WH";

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

			this.sideN.container = this.container;
			this.sideN.w = w;
			this.sideN.d = d;
			this.sideN.l = l;
			this.sideN.x1 = x;
			this.sideN.y1 = y;
			this.sideN.x2 = this.sideN.x1 + this.sideN.l;
			this.sideN.y2 = this.sideN.y1 + this.sideN.d;
			this.sideN.y3 = this.sideN.y1;

			this.sideN.svg = this.sideN.container.polygon([this.sideN.x1, this.sideN.y1,
				this.sideN.x1, this.sideN.y2,
				this.sideN.x2, this.sideN.y2,
				this.sideN.x2, this.sideN.y3
			]);

			this.sideN.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});

			this.sideN.svg.stroke(this.hlite);
			if (this.getClient().showParent) {
				if (this.getClient().hliteThis === data) {
					this.sideN.svg.stroke(this.getClient().hlite);
				}
			}

		};
		this.renderSideS = function(data, x, y) {
			var l;
			var w;
			var d;
			var color = "WH";

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

			this.sideS.container = this.container;
			this.sideS.w = w;
			this.sideS.d = d;
			this.sideS.l = l;
			this.sideS.x1 = x;
			this.sideS.y1 = y - d;
			this.sideS.x2 = this.sideS.x1 + this.sideS.l;
			this.sideS.y2 = this.sideS.y1 + this.sideS.d;
			this.sideS.y3 = this.sideS.y1;

			this.sideS.svg = this.sideS.container.polygon([this.sideS.x1, this.sideS.y1,
				this.sideS.x1, this.sideS.y2,
				this.sideS.x2, this.sideS.y2,
				this.sideS.x2, this.sideS.y3
			]);

			this.sideS.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});

			this.sideS.svg.stroke(this.hlite);
			if (this.getClient().showParent) {
				if (this.getClient().hliteThis === data) {
					this.sideS.svg.stroke(this.getClient().hlite);
				}
			}

		};
		this.renderSideE = function(data, x, y) {
			var l;
			var w;
			var d;
			var color = "WH";

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

			this.sideE.container = this.container;
			this.sideE.w = w;
			this.sideE.d = d;
			this.sideE.l = l;
			this.sideE.x1 = x - d;
			this.sideE.y1 = y;
			this.sideE.x2 = this.sideE.x1 + this.sideE.d;
			this.sideE.y2 = this.sideE.y1 + this.sideE.l;
			this.sideE.y3 = this.sideE.y1;

			this.sideE.svg = this.sideE.container.polygon([this.sideE.x1, this.sideE.y1,
				this.sideE.x1, this.sideE.y2,
				this.sideE.x2, this.sideE.y2,
				this.sideE.x2, this.sideE.y3
			]);

			this.sideE.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});

			this.sideE.svg.stroke(this.hlite);
			if (this.getClient().showParent) {
				if (this.getClient().hliteThis === data) {
					this.sideE.svg.stroke(this.getClient().hlite);
				}
			}

		};
		this.renderSideW = function(data, x, y) {
			var l;
			var w;
			var d;
			var color = "WH";

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

			this.sideW.container = this.container;
			this.sideW.w = w;
			this.sideW.d = d;
			this.sideW.l = l;
			this.sideW.x1 = x;
			this.sideW.y1 = y;
			this.sideW.x2 = this.sideW.x1 + this.sideW.d;
			this.sideW.y2 = this.sideW.y1 + this.sideW.l;
			this.sideW.y3 = this.sideW.y1;

			this.sideW.svg = this.sideW.container.polygon([this.sideW.x1, this.sideW.y1,
				this.sideW.x1, this.sideW.y2,
				this.sideW.x2, this.sideW.y2,
				this.sideW.x2, this.sideW.y3
			]);

			this.sideW.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});

			this.sideW.svg.stroke(this.hlite);
			if (this.getClient().showParent) {
				if (this.getClient().hliteThis === data) {
					this.sideW.svg.stroke(this.getClient().hlite);
				}
			}

		};

	};

});