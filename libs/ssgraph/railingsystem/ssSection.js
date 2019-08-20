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
		this.mod = undefined;
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
			var w = 0;
			var l = 0;
			var h = 0;
			var d = "1";
			var direction = "1";
			var tw = 0;
			var px = this.x;
			var py = this.y;
			var color = "WH";
			var rs = "";
			var fb = false;

			this.container = this.getParent().nested();
			var data = this.getData();
			this.isReady = true;

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			};
			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
				if (w == undefined) {
					w = 1;
				}
			}
			if (data.model["HEIGHT"] != undefined) {
				h = Number(data.model["HEIGHT"].value);
				if (h == undefined) {
					h = 1;
				}
			}

			if (data.model["DEPTH"] != undefined) {
				d = Number(data.model["DEPTH"].value);
				if (d == undefined) {
					d = 1;
				}
			}
			if (data.model["LENGTH"] != undefined) {
				l = Number(data.model["LENGTH"].value);
				if (l == undefined) {
					l = 1;
				}
			}

			if (l <= 0) return;
			if (h <= 0) return;

			l = this.client.convert(l);
			w = this.client.convert(3);
			h = this.client.convert(h);
			d = this.client.convert(d);

			this.w = w;
			this.l = l;
			this.h = h;
			this.tx1 = x;
			this.ty1 = y - h;
			this.tx2 = this.tx1 + l;
			this.ty2 = this.ty1 + w;
			this.ty3 = this.ty1;
			this.ph = this.client.convert(30.5);

			this.color = color;

			this.toprailsvg = this.container.polygon([this.tx1, this.ty1,
				this.tx1, this.ty2,
				this.tx2, this.ty2,
				this.tx2, this.ty3
			]);
			this.toprailsvg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": ssBase.color['BL'].htmlcolor,
				"stroke-width": 1
			});

			this.bx1 = x;
			this.by1 = y;
			this.bx2 = this.bx1 + l;
			this.by2 = this.by1 - w;
			this.by3 = this.by1;
			this.bottomrailsvg = this.container.polygon([this.bx1, this.by1,
				this.bx1, this.by2,
				this.bx2, this.by2,
				this.bx2, this.by3
			]);
			this.bottomrailsvg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": ssBase.color['BL'].htmlcolor,
				"stroke-width": 1
			});

			this.isReady = true;

			// use to put a bounding box when its selected  --- for hliting
			this.x1 = this.tx1;
			this.x2 = this.tx2;
			this.y1 = this.ty1;
			this.y2 = this.by1;
			this.instanceId = data.model.InstanceId;
			this.client.hliteObject(this);
			return this;

		};
		this.renderPickets = function() {
			var spacing = 4.5;
			if (data.model["RAILING.PICKET.SPACING"] != undefined) {
				spacing = Number(data.model["RAILING.PICKET.SPACING"].value);
			}

			var objmods = core.getModels(this.data, "rsRailingPicket");
			if (objmods === undefined) {
				return;
			}
			objmods.sort(function(a, b) {
				return (Number(a.Data.Position) > Number(b.Data.Position)) ? 1 : ((Number(b.Data.Position) > Number(a.Data.Position)) ? -1 : 0);
			});
			var x = this.tx1;
			var y = this.ty2;
			var y = this.client.convert(90);
			var w = 0;
			var l = 0;
			for (var i = 0; i < objmods.length; i++) {
				var amod = objmods[i];
				this.renderPicket(x, y);
				x = mod.x2;
				//				 y = mod.y2; 
			}
		};
		this.renderPicket = function(x, y) {
			var y = this.client.convert(90);
			var psvg = this.container.polygon([this.bx1, this.by1,
				this.bx1, this.by2,
				this.bx2, this.by2,
				this.bx2, this.by3
			]);
			psvg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": ssBase.color['BL'].htmlcolor,
				"stroke-width": 1
			});
		};

	};

});