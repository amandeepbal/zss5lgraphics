sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase"
], function(ssMath, core,ssBase) {
	return function(client, data, myParent, x, y) {
		this.data = data;
		this.client = client;
		this.x = x;
		this.y = y;
		this.ssparent = myParent;
		this.container = undefined;
		this.headerextrusion = {
			container: undefined,
			svg: undefined,
			x: 0,
			y: 0
		};
		this.opening = undefined;
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
			var h = 0;
			var tw = 0;
			var color = "WH";
			var usetextures = false;
			
			this.container = this.getParent().nested();
			var data = this.getData();
			this.isReady = true;

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
			color="WH";

			if (data.model["USE.TEXTURES"] != undefined) {
				usetextures = data.model['USE.TEXTURES'].value;
			};
			if(usetextures){
		 	 if (data.model["EXTERIOR.TEXTURE"] != undefined) {
			 	color = data.model["TEXTURE"].value;
			 };
				
			}
			else{
		 	 if (data.model["ROOF.PANEL.EXTERIOR.COLOR"] != undefined) {
			 	color = data.model["ROOF.PANEL.EXTERIOR.COLOR"].value;
			 }
			}

			tw = ssBase.convert(tw);
			h = ssBase.convert(h);
			w = ssBase.convert(w);
			this.w = w;
			this.h = h;
			this.tw = tw;
			this.color = color;

			if (w <= 0) return;
			if (h <= 0) return;

			this.container = this.container.nested();
			this.x1 = x;
			this.y1 = y;
			this.x2 = this.x1 + w;
			this.y2 = this.y1 + h;
			this.y3 = this.y1 ;

			this.svg = this.container.polygon([this.x1, this.y1,
				this.x1, this.y2,
				this.x2, this.y2,
				this.x2, this.y3
			]);
			this.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": ssBase.color['BL'].htmlcolor,
				"stroke-width": 1
			});
//			var data = core.getFirstModel(this.getData());
//			if(data != undefined){
//			  this.opening = this.getClient().draw(data, x, y,this.container);
//			}  

			this.isReady = true;

			return this;

		};


	};

});