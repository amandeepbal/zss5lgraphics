sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase"

], function(ssMath,core, ssBase) {
	return function(myParent, x, y) {
		this.data = myParent.getData();
		this.client = myParent.client;
		this.x = x;
		this.y = y;
		this.w = 0;
		this.h = 0;
		this.slab = {
			container: undefined,
			x: 0,
			y: 0,
			w: 0,
			h: 0
		};
		this.isReady = false;
		
		if (this.x === undefined) {
			this.x = 0;
		}
		if (this.y === undefined) {
			this.y = 0;
		}

		this.ssparent = myParent;
		this.container = undefined;

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
			var w = 30;
			var h = 80;
			var t = 0;
			var color = "WH";
			var ow = 0;
			var nw = 0;
			if (!this.getParent().isReady) return this;

			if (data.model["WIDTH"] != undefined) {
				w = Number(data.model["WIDTH"].value);
				if (w === undefined) {
					w = 30;
				}
			}
			if (data.model["HEIGHT"] != undefined) {
				h = Number(data.model["HEIGHT"].value);
				if (h === undefined) {
					h = 80;
				}
			}
			if (data.isFrench ){
			  if (data.model["OFFSET"] != undefined) {
				ow = Number(data.model["OFFSET"].value);
			  }
			}


			if (h <= 0) return this;
			if (w <= 0) return this;
 
  
			if (data.isFrench ){
			  nw = w;
			  w = w /2;
				if(data.isOffset &&  data.isOffsetSide && ow > 0){
				   w = ow;
			    }	
				if(data.isOffset &&  !data.isOffsetSide && ow > 0){
				   w = nw - ow;
			    }	
			}


			if (data.model["DOOR.COLOR"] != undefined) {
				color = data.model['DOOR.COLOR'].value;
			}

			w = this.client.convert(w);
			h = this.client.convert(h);
			t = this.client.convert(t);

			this.w = w;
			this.h = h;

			this.container = this.getParent().container.nested();
			this.svg = this.container.rect(this.w, this.h);
			this.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			this.svg.move(this.x, this.y);

			// use to put a bounding box when its selected  --- for hliting
			this.x1 = this.x;
			this.y1 = this.y;
			this.x2 = this.x + this.w; 
			this.y2 = this.y + this.h;
			this.instanceId = data.model.InstanceId;
			this.client.hliteObject(this);

			this.isReady = true;

			return this;
		};
	};

});