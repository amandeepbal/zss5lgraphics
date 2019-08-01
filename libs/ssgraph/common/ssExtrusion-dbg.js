sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase"
], function(ssMath, core, ssBase) {
	return function(client, data, myParent, x, y) {
		this.data = data;
		this.client = client;
		this.ssparent = myParent;
		this.x = x;
		this.y = y;
		this.isReady = false;

		if (this.x === undefined) {
			this.x = 0;
		}
		if (this.y === undefined) {
			this.y = 0;
		}
		this.container = undefined;
		this.svg = undefined;

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
		this.render = function() {
			var data = this.getData();
			var w = 0;
			var l = 0;
			var t = 0;
			var d = "NS";
			var color = "WH";

			if (data.model["LENGTH"] != undefined) {
				l = Number(data.model["LENGTH"].value);
				if (l == undefined) {
					l = 1;
				}
			} else {
				if (data.model["HEIGHT"] != undefined) {
					l = Number(data.model["HEIGHT"].value);
					if (l == undefined) {
						l = 1;
					}
				}

			}
			if (data.model["WIDTH"] != undefined) {
				t = Number(data.model["WIDTH"].value);
			}
			if(t === 0){
				if (data.model["THICKNESS"] != undefined) {
					t = Number(data.model["THICKNESS"].value);
				}
			}
			if(t === 0){
			   if (data.model["DEPTH"] != undefined) {
			  	  t = Number(data.model["DEPTH"].value);
			   }
			}
			if (t === 0) {
			 	t = 1;
			}
			if (data.model["DIRECTION"] != undefined) {
				d = data.model["DIRECTION"].value;
				if (d == undefined) {
					d = "NS";
				}
			}

			if (l <= 0) return this;

			if (data.model["EXTRUSION.COLOR"] != undefined) {
				color = data.model['EXTRUSION.COLOR'].value;
			}

			w = this.client.convert(w);
			l = this.client.convert(l);
			t = this.client.convert(t);

			this.container = this.getParent().nested();
			this.w = w;
			this.t = t;
			this.l = l;
			this.direction = d;
			this.x1 = this.x;
			this.y1 = this.y;
			this.x2 = this.x;
			this.y2 = this.y;
			this.y3 = this.y1;

			var aw = 0;
			var ah = 0;
			switch (d) {
				case "NS":
					aw = t;
					ah = l;
					this.x2 = this.x1 + aw;
					this.y2 = this.y1 + ah;
					break;
				case "SN":
					aw = t;
					ah = l;
					this.x2 = this.x1 + aw;
					this.y2 = this.y1 + ah;
					break;
				case "EW":
					aw = l;
					ah = t;
					this.x2 = this.x1 + aw;
					this.y2 = this.y1 + ah;
					break;
				case "WE":
					aw = l;
					ah = t;
					this.x2 = this.x1 + aw;
					this.y2 = this.y1 + ah;
					break;
			}
			this.svg = this.container.rect(aw, ah); //w by h
			this.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			this.svg.move(this.x, this.y);

			// use to put a bounding box when its selected  --- for hliting
			this.x1 = this.x;
			this.y1 = this.y;
			this.x2 = this.x + aw; 
			this.y2 = this.y + ah;
			this.instanceId = data.model.InstanceId;
			this.client.hliteObject(this);

			this.isReady = true;

			return this;
		};
	};

});