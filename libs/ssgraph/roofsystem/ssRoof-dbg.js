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
		this.beamwidth = Number(0.50);
		this.ssparent = myParent;
		this.container = undefined;
		this.openings = {
			container: undefined,
			svg: undefined,
			x: x,
			y: y
		};
		this.building = undefined;
		this.receiver = {
			container: undefined,
			svg: undefined,
			x: x,
			y: y
		};
		this.roofStyle = "S";
		this.side = "";

		this.fascialeft = {
			container: undefined,
			svg: undefined,
			x: x,
			y: y
		};
		this.fasciaright = {
			container: undefined,
			svg: undefined,
			x: x,
			y: y
		};
		this.gutter = {
			container: undefined,
			svg: undefined,
			x: x,
			y: y
		};
		this.dimensionsprojection = {
			container: undefined,
			svg1: undefined,
			svg2: undefined,
			svg3: undefined,
			x: x,
			y: y
		};
		this.dimensionswidth = {
			container: undefined,
			svg: undefined,
			x: x,
			y: y
		};

		this.mods = [];
		this.posts = [];
		this.isReady = false;
		this.w = 0;
		this.h = 0;

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
			var tw = 0;
			var w = 0;
			var l = 0;
			var bx = 20;
			var by = 5;
			var color = "WH";

			this.container = this.getParent().nested();
			var data = this.getData();
			this.isReady = true;

			if (data.model["ROOF.STYLE"] != undefined) {
				this.roofStyle = data.model["ROOF.STYLE"].value;
			}
			this.side = data.model.side;

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
			}
			if (data.model["LENGTH"] != undefined) {
				l = Number(data.model["LENGTH"].value);
			}
			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (w <= 0) return;
			if (l <= 0) return;

			this.isAcrylic = false;
			if (data.model.Code === 'rsAcrylicStudioRoof' ||
				data.model.Code === 'rsAcrylicCornerRoof' ||
				data.model.Code === 'rsAcrylicGableLeftRoof' ||
				data.model.Code === 'rsAcrylicGableRightRoof') {
				this.isAcrylic = true;
				this.beamwidth = Number(3.125);
			}

			l = this.client.convert(l);
			w = this.client.convert(w);
			bx = this.client.convert(bx);
			by = this.client.convert(by);

			this.w = w;
			this.l = l;
			this.tw = tw;
			this.color = color;

			if (data.showBuilding != undefined && !data.showBuilding) {
				by = 0;
				bx = 0;
			}

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
			this.isReady = true;

			if (data.showBuilding != undefined && !data.showBuilding) {} else {
				this.renderBuilding();
			}

			switch (this.roofStyle) {
			case "S":
				this.renderStudioReceiver();
				this.renderStudioFasciaLeft();
				this.renderStudioGutter();
				this.renderStudioFasciaRight();
				this.renderStudioMods();
				this.receiverInFront();
				this.renderStudioPosts();
				this.showStudioDimensions();
				break;
			case "C":
				this.renderStudioReceiver();
				//			      this.renderStudioFasciaLeft();
				this.renderCornerReceiverLeft();
				this.renderStudioGutter();
				this.renderStudioFasciaRight();
				this.renderStudioMods();
				this.receiverInFront();
				break;
			case "G":
				if (this.side === "L") {
					this.renderGableReceiverLeft();
					this.renderGableMods();
					this.renderGableGutterLeft();
					this.renderGableFasciaLeft();
					this.showGableDimensionsLeft();
				}
				if (this.side === "R") {
					this.renderGableReceiverRight();
					this.renderGableMods();
					this.renderGableGutterRight();
					this.renderGableFasciaRight();
					this.showGableDimensionsRight();
				}
				this.receiverInFront();
				break;
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
			this.building = this.getClient().draw(data, this.x, this.y, this.container);

		};
		this.renderStudioReceiver = function () {
			var h;
			var w;
			var x;
			var y;
			var drop = 0;
			var color = "WH";

			var data = core.getModel(this.getData(), "rsReceiver");
			if (data === undefined) return;

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
			x = this.x1;
			y = this.y1;

			this.receiver.container = this.container;
			this.receiver.w = w;
			this.receiver.h = h;
			this.receiver.x1 = x;
			this.receiver.y1 = y;
			this.receiver.x2 = this.receiver.x1 + h;
			this.receiver.y2 = this.receiver.y1 + this.receiver.w;
			this.receiver.y3 = this.receiver.y1;

			this.receiver.svg = this.receiver.container.polygon([this.receiver.x1, this.receiver.y1,
				this.receiver.x1, this.receiver.y2,
				this.receiver.x2, this.receiver.y2,
				this.receiver.x2, this.receiver.y3
			]);

			this.receiver.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			var obj = {
				x1: this.receiver.x1,
				y1: this.receiver.y1,
				x2: this.receiver.x2,
				y2: this.receiver.y2,
				instanceId: data.model.InstanceId
			};
			this.client.hliteObject(obj);
		};
		this.renderGableReceiverLeft = function () {
			var h;
			var w;
			var x;
			var y;
			var drop = 0;
			var color = "WH";

			var data = core.getModel(this.getData(), "rsReceiver");
			if (data === undefined) return;

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
			x = this.x1;
			y = this.y1;

			this.receiverleft = {};
			this.receiverleft.container = this.container;
			this.receiverleft.w = w;
			this.receiverleft.h = h;
			this.receiverleft.x1 = x;
			this.receiverleft.y1 = y;
			this.receiverleft.x2 = this.receiverleft.x1 + this.receiverleft.h;
			this.receiverleft.y2 = this.receiverleft.y1 + this.receiverleft.w;
			this.receiverleft.y3 = this.receiverleft.y1;

			this.receiverleft.svg = this.receiverleft.container.polygon([this.receiverleft.x1, this.receiverleft.y1,
				this.receiverleft.x1, this.receiverleft.y2,
				this.receiverleft.x2, this.receiverleft.y2,
				this.receiverleft.x2, this.receiverleft.y3
			]);

			this.receiverleft.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			var obj = {
				x1: this.receiverleft.x1,
				y1: this.receiverleft.y1,
				x2: this.receiverleft.x2,
				y2: this.receiverleft.y2,
				instanceId: data.model.InstanceId
			};
			this.client.hliteObject(obj);
		};

		this.renderGableReceiverRight = function () {
			var h;
			var w;
			var x;
			var y;
			var drop = 0;
			var color = "WH";

			var data = core.getModel(this.getData(), "rsReceiver");
			if (data === undefined) return;

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
			x = this.x1;
			y = this.y1;

			this.receiverright = {};
			this.receiverright.container = this.container;
			this.receiverright.w = w;
			this.receiverright.h = h;
			this.receiverright.x1 = x;
			this.receiverright.y1 = y;
			this.receiverright.x2 = this.receiverright.x1 + this.receiverright.h;
			this.receiverright.y2 = this.receiverright.y1 + this.receiverright.w;
			this.receiverright.y3 = this.receiverright.y1;

			this.receiverright.svg = this.receiverright.container.polygon([this.receiverright.x1, this.receiverright.y1,
				this.receiverright.x1, this.receiverright.y2,
				this.receiverright.x2, this.receiverright.y2,
				this.receiverright.x2, this.receiverright.y3
			]);

			this.receiverright.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			var obj = {
				x1: this.receiverright.x1,
				y1: this.receiverright.y1,
				x2: this.receiverright.x2,
				y2: this.receiverright.y2,
				instanceId: data.model.InstanceId
			};
			this.client.hliteObject(obj);
		};

		this.receiverInFront = function () {
			if (this.receiver != undefined && this.receiver.svg != undefined) {
				this.receiver.svg.front();
			}
			if (this.receiverleft != undefined && this.receiverleft.svg != undefined) {
				this.receiverleft.svg.front();
			}
			if (this.receiverright != undefined && this.receiverright.svg != undefined) {
				this.receiverright.svg.front();
			}
		};
		this.renderStudioBeam = function (x, y, l) {
			var w = this.beamwidth;
			var color = this.color;
			w = this.client.convert(w);
			l = this.client.convert(l);

			var beam = {};
			beam.container = this.container;
			beam.w = w;
			beam.l = l;
			beam.x1 = x;
			beam.y1 = y;
			beam.x2 = beam.x1 + w;
			beam.y2 = beam.y1 + beam.l;
			beam.y3 = beam.y1;

			beam.svg = beam.container.polygon([beam.x1, beam.y1,
				beam.x1, beam.y2,
				beam.x2, beam.y2,
				beam.x2, beam.y3
			]);

			beam.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
		};
		this.renderGableBeam = function (x, y, l) {
			var w = this.beamwidth;
			var color = this.color;

			w = this.client.convert(w);
			l = this.client.convert(l);

			var beam = {};
			beam.container = this.container;
			beam.w = w;
			beam.l = l;
			beam.x1 = x;
			beam.y1 = y;
			beam.x2 = beam.x1 + beam.l;
			beam.y2 = beam.y1 + beam.w;
			beam.y3 = beam.y1;

			beam.svg = beam.container.polygon([beam.x1, beam.y1,
				beam.x1, beam.y2,
				beam.x2, beam.y2,
				beam.x2, beam.y3
			]);

			beam.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
		};

		this.renderStudioFasciaLeft = function () {
			var h;
			var w;
			var x;
			var y;
			var color = "WH";

			var data = core.getModel(this.getData(), "rsFasciaLeft");
			if (data === undefined) return;

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (data.model["DEPTH"] != undefined) {
				w = Number(data.model["DEPTH"].value);
				if (w === undefined) {
					w = 1;
				}
			}
			if (data.model["LENGTH"] != undefined) {
				h = Number(data.model["LENGTH"].value);
				if (h === undefined) {
					h = 1;
				}
			}
			w = this.client.convert(w);
			h = this.client.convert(h);

			x = this.x1 - w;
			y = this.y1;

			//			color = this.color;
			this.fascialeft.container = this.container;
			this.fascialeft.w = w;
			this.fascialeft.h = h;
			this.fascialeft.x1 = x;
			this.fascialeft.y1 = y;
			this.fascialeft.x2 = this.fascialeft.x1 + w;
			this.fascialeft.y2 = this.fascialeft.y1 + this.fascialeft.h;
			this.fascialeft.y3 = this.fascialeft.y1;

			this.fascialeft.svg = this.fascialeft.container.polygon([this.fascialeft.x1, this.fascialeft.y1,
				this.fascialeft.x1, this.fascialeft.y2,
				this.fascialeft.x2, this.fascialeft.y2,
				this.fascialeft.x2, this.fascialeft.y3
			]);

			this.fascialeft.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			var obj = {
				x1: this.fascialeft.x1,
				y1: this.fascialeft.y1,
				x2: this.fascialeft.x2,
				y2: this.fascialeft.y2,
				instanceId: data.model.InstanceId
			};
			this.client.hliteObject(obj);
		};
		this.renderGableFasciaLeft = function () {
			var h;
			var w;
			var x;
			var y;
			var color = "WH";
			var rs = "S";

			var data = core.getModel(this.getData(), "rsFasciaLeft");
			if (data === undefined) return;

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (data.model["DEPTH"] != undefined) {
				w = Number(data.model["DEPTH"].value);
				if (w === undefined) {
					w = 1;
				}
			}
			if (data.model["LENGTH"] != undefined) {
				h = Number(data.model["LENGTH"].value);
				if (h === undefined) {
					h = 1;
				}
			}
			w = this.client.convert(w);
			h = this.client.convert(h);

			x = this.x1;
			if (this.gutterleft != undefined) {
				x = this.gutterleft.x1;
			}

			y = this.y1 + this.l;

			//			color = this.color;
			this.fascialeft.container = this.container;
			this.fascialeft.w = w;
			this.fascialeft.h = h;
			this.fascialeft.x1 = x;
			this.fascialeft.y1 = y;
			this.fascialeft.x2 = this.fascialeft.x1 + this.fascialeft.h;
			this.fascialeft.y2 = this.fascialeft.y1 + this.fascialeft.w;
			this.fascialeft.y3 = this.fascialeft.y1;

			this.fascialeft.svg = this.fascialeft.container.polygon([this.fascialeft.x1, this.fascialeft.y1,
				this.fascialeft.x1, this.fascialeft.y2,
				this.fascialeft.x2, this.fascialeft.y2,
				this.fascialeft.x2, this.fascialeft.y3
			]);

			this.fascialeft.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			var obj = {
				x1: this.fascialeft.x1,
				y1: this.fascialeft.y1,
				x2: this.fascialeft.x2,
				y2: this.fascialeft.y2,
				instanceId: data.model.InstanceId
			};
			this.client.hliteObject(obj);
		};
		this.renderCornerReceiverLeft = function () {
			var h;
			var w;
			var x;
			var y;
			var color = "WH";

			var data = core.getModel(this.getData(), "rsReceiverCorner");
			if (data === undefined) return;

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (data.model["DEPTH"] != undefined) {
				w = Number(data.model["DEPTH"].value);
				if (w === undefined) {
					w = 1;
				}
			}
			if (data.model["LENGTH"] != undefined) {
				h = Number(data.model["LENGTH"].value);
				if (h === undefined) {
					h = 1;
				}
			}
			w = this.client.convert(w);
			h = this.client.convert(h);

			x = this.x1 - w;
			y = this.y1;

			//			color = this.color;
			this.receiverleft = {};
			this.receiverleft.container = this.container;
			this.receiverleft.w = w;
			this.receiverleft.h = h;
			this.receiverleft.x1 = x;
			this.receiverleft.y1 = y;
			this.receiverleft.x2 = this.receiverleft.x1 + w;
			this.receiverleft.y2 = this.receiverleft.y1 + this.receiverleft.h;
			this.receiverleft.y3 = this.receiverleft.y1;

			this.receiverleft.svg = this.receiverleft.container.polygon([this.receiverleft.x1, this.receiverleft.y1,
				this.receiverleft.x1, this.receiverleft.y2,
				this.receiverleft.x2, this.receiverleft.y2,
				this.receiverleft.x2, this.receiverleft.y3
			]);

			this.receiverleft.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			var obj = {
				x1: this.receiverleft.x1,
				y1: this.receiverleft.y1,
				x2: this.receiverleft.x2,
				y2: this.receiverleft.y2,
				instanceId: data.model.InstanceId
			};
			this.client.hliteObject(obj);
		};
		this.renderStudioGutter = function () {
			var h;
			var w;
			var x;
			var y;
			var drop = 0;
			var color = "WH";

			var data = core.getModel(this.getData(), "rsGutter");
			if (data === undefined) return;

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (data.model["DEPTH"] != undefined) {
				w = Number(data.model["DEPTH"].value);
				if (w === undefined) {
					w = 1;
				}
			}
			if (data.model["LENGTH"] != undefined) {
				h = Number(data.model["LENGTH"].value);
				if (h === undefined) {
					h = 1;
				}
			}
			w = this.client.convert(w);
			h = this.client.convert(h);

			x = this.x1;
			y = this.y2;

			this.gutter.container = this.container;
			this.gutter.w = w;
			this.gutter.h = h;
			this.gutter.x1 = x;
			this.gutter.y1 = y;
			this.gutter.x2 = this.gutter.x1 + h;
			this.gutter.y2 = this.gutter.y1 + this.gutter.w;
			this.gutter.y3 = this.gutter.y1;

			this.gutter.svg = this.gutter.container.polygon([this.gutter.x1, this.gutter.y1,
				this.gutter.x1, this.gutter.y2,
				this.gutter.x2, this.gutter.y2,
				this.gutter.x2, this.gutter.y3
			]);

			this.gutter.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			var obj = {
				x1: this.gutter.x1,
				y1: this.gutter.y1,
				x2: this.gutter.x2,
				y2: this.gutter.y2,
				instanceId: data.model.InstanceId
			};
			this.client.hliteObject(obj);

		};
		this.renderGableGutterLeft = function () {
			var h;
			var w;
			var x;
			var y;
			var drop = 0;
			var color = "WH";

			var data = core.getModel(this.getData(), "rsGutter");
			if (data === undefined) return;

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (data.model["DEPTH"] != undefined) {
				w = Number(data.model["DEPTH"].value);
				if (w === undefined) {
					w = 1;
				}
			}
			if (data.model["LENGTH"] != undefined) {
				h = Number(data.model["LENGTH"].value);
				if (h === undefined) {
					h = 1;
				}
			}
			w = this.client.convert(w);
			h = this.client.convert(h);

			x = this.x1;
			y = this.y1;

			this.gutterleft = {};
			this.gutterleft.container = this.container;
			this.gutterleft.w = w;
			this.gutterleft.h = h;
			this.gutterleft.x1 = x - w;
			this.gutterleft.y1 = y;
			this.gutterleft.x2 = this.gutterleft.x1 + w;
			this.gutterleft.y2 = this.gutterleft.y1 + this.gutterleft.h;
			this.gutterleft.y3 = this.gutterleft.y1;

			this.gutterleft.svg = this.gutterleft.container.polygon([this.gutterleft.x1, this.gutterleft.y1,
				this.gutterleft.x1, this.gutterleft.y2,
				this.gutterleft.x2, this.gutterleft.y2,
				this.gutterleft.x2, this.gutterleft.y3
			]);

			this.gutterleft.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			var obj = {
				x1: this.gutterleft.x1,
				y1: this.gutterleft.y1,
				x2: this.gutterleft.x2,
				y2: this.gutterleft.y2,
				instanceId: data.model.InstanceId
			};
			this.client.hliteObject(obj);

		};
		this.renderGableGutterRight = function () {
			var h;
			var w;
			var x;
			var y;
			var drop = 0;
			var color = "WH";

			var data = core.getModel(this.getData(), "rsGutter");
			if (data === undefined) return;

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (data.model["DEPTH"] != undefined) {
				w = Number(data.model["DEPTH"].value);
				if (w === undefined) {
					w = 1;
				}
			}
			if (data.model["LENGTH"] != undefined) {
				h = Number(data.model["LENGTH"].value);
				if (h === undefined) {
					h = 1;
				}
			}
			w = this.client.convert(w);
			h = this.client.convert(h);

			x = this.x1 + this.w;
			y = this.y1;

			this.gutterright = {};
			this.gutterright.container = this.container;
			this.gutterright.w = w;
			this.gutterright.h = h;
			this.gutterright.x1 = x;
			this.gutterright.y1 = y;
			this.gutterright.x2 = this.gutterright.x1 + w;
			this.gutterright.y2 = this.gutterright.y1 + this.gutterright.h;
			this.gutterright.y3 = this.gutterright.y1;

			this.gutterright.svg = this.gutterright.container.polygon([this.gutterright.x1, this.gutterright.y1,
				this.gutterright.x1, this.gutterright.y2,
				this.gutterright.x2, this.gutterright.y2,
				this.gutterright.x2, this.gutterright.y3
			]);

			this.gutterright.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			var obj = {
				x1: this.gutterright.x1,
				y1: this.gutterright.y1,
				x2: this.gutterright.x2,
				y2: this.gutterright.y2,
				instanceId: data.model.InstanceId
			};
			this.client.hliteObject(obj);

		};

		this.renderStudioFasciaRight = function () {
			var h;
			var w;
			var x;
			var y;
			var color = "WH";

			var data = core.getModel(this.getData(), "rsFasciaRight");
			if (data === undefined) return;

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (data.model["DEPTH"] != undefined) {
				w = Number(data.model["DEPTH"].value);
				if (w === undefined) {
					w = 1;
				}
			}
			if (data.model["LENGTH"] != undefined) {
				h = Number(data.model["LENGTH"].value);
				if (h === undefined) {
					h = 1;
				}
			}
			w = this.client.convert(w);
			h = this.client.convert(h);

			x = this.x2;
			y = this.y1;

			this.fasciaright.container = this.container;
			this.fasciaright.w = w;
			this.fasciaright.h = h;
			this.fasciaright.x1 = x;
			this.fasciaright.y1 = y;
			this.fasciaright.x2 = this.fasciaright.x1 + w;
			this.fasciaright.y2 = this.fasciaright.y1 + this.fasciaright.h;
			this.fasciaright.y3 = this.fasciaright.y1;

			this.fasciaright.svg = this.fasciaright.container.polygon([this.fasciaright.x1, this.fasciaright.y1,
				this.fasciaright.x1, this.fasciaright.y2,
				this.fasciaright.x2, this.fasciaright.y2,
				this.fasciaright.x2, this.fasciaright.y3
			]);

			this.fasciaright.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			var obj = {
				x1: this.fasciaright.x1,
				y1: this.fasciaright.y1,
				x2: this.fasciaright.x2,
				y2: this.fasciaright.y2,
				instanceId: data.model.InstanceId
			};
			this.client.hliteObject(obj);
		};
		this.renderGableFasciaRight = function () {
			var h;
			var w;
			var x;
			var y;
			var color = "WH";

			var data = core.getModel(this.getData(), "rsFasciaRight");
			if (data === undefined) return;

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};

			if (data.model["DEPTH"] != undefined) {
				w = Number(data.model["DEPTH"].value);
				if (w === undefined) {
					w = 1;
				}
			}
			if (data.model["LENGTH"] != undefined) {
				h = Number(data.model["LENGTH"].value);
				if (h === undefined) {
					h = 1;
				}
			}
			w = this.client.convert(w);
			h = this.client.convert(h);

			x = this.x1;
			y = this.y2;

			this.fasciaright.container = this.container;
			this.fasciaright.w = w;
			this.fasciaright.h = h;
			this.fasciaright.x1 = x;
			this.fasciaright.y1 = y;
			this.fasciaright.x2 = this.fasciaright.x1 + this.fasciaright.h;
			this.fasciaright.y2 = this.fasciaright.y1 + this.fasciaright.w;
			this.fasciaright.y3 = this.fasciaright.y1;

			this.fasciaright.svg = this.fasciaright.container.polygon([this.fasciaright.x1, this.fasciaright.y1,
				this.fasciaright.x1, this.fasciaright.y2,
				this.fasciaright.x2, this.fasciaright.y2,
				this.fasciaright.x2, this.fasciaright.y3
			]);

			this.fasciaright.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			var obj = {
				x1: this.fasciaright.x1,
				y1: this.fasciaright.y1,
				x2: this.fasciaright.x2,
				y2: this.fasciaright.y2,
				instanceId: data.model.InstanceId
			};
			this.client.hliteObject(obj);
		};

		this.renderStudioMods = function () {
			var objmods = core.getModels(this.getData(), 'rsPanel');
			if (objmods === undefined) {
				return;
			}
			objmods.sort(function (a, b) {
				return (Number(a.Data.Position) > Number(b.Data.Position)) ? 1 : ((Number(b.Data.Position) > Number(a.Data.Position)) ? -1 : 0);
			});
			var x = this.x1;
			var y = this.y1;
			var w = 0;
			var l = 0;
			var b = this.client.convert(this.beamwidth);

			for (var i = 0; i < objmods.length; i++) {
				var amod = objmods[i];
				amod.isGable = false;
				if (this.isAcrylic && i == 0) {
					this.renderStudioBeam(x, y, amod.model['LENGTH'].value);
					x = x + b;
				}
				var mod = this.getClient().draw(amod, x, y, this.container);
				this.mods.push(mod);
				if (mod === undefined) {
					continue;
				}
				x = mod.ox2;
				this.renderStudioBeam(x, y, amod.model['LENGTH'].value);
				x = mod.ox2 + b;
				y = mod.oy1;
			}
			//			if(this.isAcrylic) {this.renderStudioBeam(x,y, amod.model['LENGTH'].value);}

		};
		this.renderGableMods = function () {
			var objmods = core.getModels(this.getData(), 'rsPanel');
			if (objmods === undefined) {
				return;
			}
			objmods.sort(function (a, b) {
				return (Number(a.Data.Position) > Number(b.Data.Position)) ? 1 : ((Number(b.Data.Position) > Number(a.Data.Position)) ? -1 : 0);
			});
			var x = this.x1;
			var y = this.y1;
			var w = 0;
			var l = 0;
			var b = this.client.convert(this.beamwidth);
			for (var i = 0; i < objmods.length; i++) {
				var amod = objmods[i];
				amod.isGable = true;
				if (this.isAcrylic && i == 0) {
					this.renderGableBeam(x, y, amod.model['LENGTH'].value);
					y = y + b;
				}
				var mod = this.getClient().draw(amod, x, y, this.container);
				if (mod === undefined) {
					continue;
				}
				this.mods.push(mod);
				y = mod.oy2;
				this.renderGableBeam(x, y, amod.model['LENGTH'].value);
				x = mod.ox1;
				y = mod.oy2 + b;
			}
			//			if(this.isAcrylic) {this.renderGableBeam(x,y, amod.model['LENGTH'].value);}
		};
		this.renderStudioPosts = function () {
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
				var mod = this.drawPost(amod, px, py);
				this.mods.push(mod);
				if (mod === undefined) {
					continue;
				}
			}
		};
		this.drawPost = function (mod, x1, y1) {
			//			var b = this.client.convert(3);
			//			var ox = Number(mod.model['OFFSETX'].value);
			//			var oy = Number(mod.model['OFFSETY'].value);
			//			ox = this.client.convert(ox);
			//			oy = this.client.convert(oy);

			//			var px = x1 + ox;
			//			var py = y1 - oy;
			//			if (py < 0) {
			//				py = 0;
			//			};
			//			if (px > this.x2) {
			//				px = this.x2;
			//			};
			//			var svg = this.container.polygon([px, py,
			//				px, py + b,
			//				px + b, py + b,
			//				px + b, py
			//			]);
			//			svg.attr({
			//				fill: '000000',
			//				"stroke": ssBase.color['SC'].htmlcolor,
			//				"stroke-width": 1
			//			});
			var opost = this.getClient().draw(mod, this.x1, this.y2, this.container);
			this.posts.push(opost);
		};

		this.showStudioDimensions = function () {
			var data = this.getData();
			if (data.showDimensions === undefined || !data.showDimensions) {
				return;
			}
			var l = 1;
			var w = 1;
			if (data === undefined) return;

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
			}
			if (data.model["LENGTH"] != undefined) {
				l = Number(data.model["LENGTH"].value);
			}
			w = this.client.convert(w);
			l = this.client.convert(l);

			var tx1 = this.x1;
			var tx2 = this.x1 + w;
			var ty1 = this.y1;
			var ty2 = this.y1 + l;

			this.dimensionsprojection = ssBase.showLabel(this.container, core.formatMeasurement(data.model['LENGTH'].value), 'V', 10, ty1, 10,
				ty2);
			this.dimensionswidth = ssBase.showLabel(this.container, core.formatMeasurement(data.model['WIDTH'].value), 'H', tx1, ty2 + 20, tx2,
				ty2 + 20);
		};
		this.showGableDimensionsLeft = function () {
			var data = this.getData();
			if (data.showDimensions === undefined || !data.showDimensions) {
				return;
			}
			var l = 1;
			var w = 1;
			if (data === undefined) return;

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
			}
			if (data.model["LENGTH"] != undefined) {
				l = Number(data.model["LENGTH"].value);
			}
			w = this.client.convert(w);
			l = this.client.convert(l);

			var tx1 = this.x1;
			var tx2 = this.x1 + l;
			var ty1 = this.y1;
			var ty2 = this.y1 + w;

			this.dimensionsprojection = ssBase.showLabel(this.container, core.formatMeasurement(data.model['WIDTH'].value), 'V', 10, ty1, 10,
				ty2);
			this.dimensionswidth = ssBase.showLabel(this.container, core.formatMeasurement(data.model['LENGTH'].value), 'H', x + tx1, ty2 + 20,
				tx2,
				ty2 + 20);

		};
		this.showGableDimensionsRight = function () {
			var data = this.getData();
			if (data.showDimensions === undefined || !data.showDimensions) {
				return;
			}
			var l = 1;
			var w = 1;
			if (data === undefined) return;

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
			}
			if (data.model["LENGTH"] != undefined) {
				l = Number(data.model["LENGTH"].value);
			}
			w = this.client.convert(w);
			l = this.client.convert(l);

			var tx1 = this.x1;
			var tx2 = this.x1 + l;
			var ty1 = this.y1;
			var ty2 = this.y1 + w;

			this.dimensionsprojection = ssBase.showLabel(this.container, core.formatMeasurement(data.model['WIDTH'].value), 'V', tx2 + 10, ty1,
				tx2 + 10,
				ty2);
			this.dimensionswidth = ssBase.showLabel(this.container, core.formatMeasurement(data.model['LENGTH'].value), 'H', tx1, ty2 + 20, tx2,
				ty2 + 20);
		};
	};

});