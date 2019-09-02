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
			var w = 0;
			var lh = 0;
			var rh = 0;
			var tw = 0;
			var px = this.x;
			var py = this.y;
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
			if (data.model["LEFT.HEIGHT"] != undefined) {
				lh = Number(data.model["LEFT.HEIGHT"].value);
				if (lh == undefined) {
					lh = 1;
				}
			}
			if (data.model["RIGHT.HEIGHT"] != undefined) {
				rh = Number(data.model["RIGHT.HEIGHT"].value);
				if (rh == undefined) {
					rh = 1;
				}
			}

			if (data.model["FRAME.COLOR"] != undefined) {
				color = data.model['FRAME.COLOR'].value;
			};

			lh = this.client.convert(lh);
			rh = this.client.convert(rh);
			w = this.client.convert(w);
			this.w = w;
			this.rh = rh;
			this.lh = lh;
			this.color = color;

			if (w <= 0) return;
			if (lh <= 0) return;
			if (rh <= 0) return;

			// if left and right heights are different, then its a trapzoid and we need to get angles for our cuts
			this.trap = undefined;
			if (lh != rh) {
				this.trap = ssMath.calcTrap(lh, rh, w);
			}

			this.isRight = false;
			if (rh > lh) {
				this.isRight = true;
			}
			// add in mod openings
			this.renderOpenings();

			this.isReady = true;
			// use to put a bounding box when its selected  --- for hliting
			this.x1 = this.openings.x1;
			this.y1 = this.openings.y1;
			this.x2 = this.openings.x2;
			this.y2 = this.openings.y2;
			this.instanceId = data.model.InstanceId;
			this.client.hliteObject(this);
			return this;

		};
		this.renderOpenings = function() {
			var w;
			var lh;
			var rh;
			var tw = 0;
			var color = this.color;
			var drop = 0;
			var rise = 0;

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
				if (w == undefined) {
					w = 1;
				}
			}
			if (data.model["LEFT.HEIGHT"] != undefined) {
				lh = Number(data.model["LEFT.HEIGHT"].value);
				if (lh == undefined) {
					lh = 1;
				}
			}
			if (data.model["RIGHT.HEIGHT"] != undefined) {
				rh = Number(data.model["RIGHT.HEIGHT"].value);
				if (rh == undefined) {
					rh = 1;
				}
			}
			if (data.model["EXTERIOR.COLOR"] != undefined) {
				color = data.model['EXTERIOR.COLOR'].value;
			};
			if (color === undefined) {
				color = "WH";
			}

			w = this.client.convert(w);
			lh = this.client.convert(lh);
			rh = this.client.convert(rh);
			tw = this.client.convert(tw);

			if (this.trap != undefined) {
				if (!this.isRight) {
					drop = w * this.trap.pitch;
				} else {
					rise = (w * this.trap.pitch) * -1;
				}
			}

			x = this.x;
			y = this.y;

			this.openings.container = this.container.nested();
			this.openings.w = w;
			this.openings.drop = drop;
			this.openings.rise = rise;
			this.openings.lh = lh;
			this.openings.rh = rh;
			this.openings.x1 = x;
			this.openings.y1 = y;
			this.openings.x2 = this.openings.x1 + w;
			this.openings.y2 = this.openings.y1 + lh;
			this.openings.y3 = this.openings.y2 - rh;

			this.openings.svg = this.openings.container.polygon([this.openings.x1, this.openings.y1,
				this.openings.x1, this.openings.y2,
				this.openings.x2, this.openings.y2,
				this.openings.x2, this.openings.y3
			]);
			this.openings.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			//			this.headerextrusion.svg.front();

			var lstmods = data.model['OPENINGS'].valueList;
			var objmods = core.getAllModels(this.getData());
			if (lstmods === undefined) {
				return;
			}
			if (objmods === undefined) {
				return;
			}

			lstmods.sort(function(a, b) {
				return (Number(a.Position) > Number(b.Position)) ? 1 : ((Number(b.Position) > Number(a.Position)) ? -1 : 0);
			});
			var x = this.openings.x1;
			var y = this.openings.y1;
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
				if (amod.model["LEFT.HEIGHT"] != undefined) {
					lh = Number(amod.model["LEFT.HEIGHT"].value);
					if (lh == undefined) {
						lh = 1;
					}
				}
				if (amod.model["RIGHT.HEIGHT"] != undefined) {
					rh = Number(amod.model["RIGHT.HEIGHT"].value);
					if (rh == undefined) {
						rh = 1;
					}
				}
				lh = this.client.convert(lh);
				rh = this.client.convert(rh);
				var mod = this.getClient().draw(amod, x, y, this.openings.container);
				this.mods.push(mod);
				try {
					x = mod.frame.framei.x1;
					y = mod.frame.framei.y2;
				} catch (e) {
					try {
						x = mod.frame.frameo.x1;
						y = mod.frame.frameo.y2;
					} catch (e) {
						try {
							x = mod.frame.x1;
							y = mod.frame.y2;
						} catch (e) {

						}
					}
				}

			}
		};

	};
});