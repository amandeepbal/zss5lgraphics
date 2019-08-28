sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase",
	"zss5lgraphics/libs/ssgraph/common/ssChoppedTrapPane",
	"zss5lgraphics/libs/ssgraph/common/ssSpreaderBar"
], function(ssMath,core,ssBase,ssChoppedTrapPane,ssSpreaderBar) {
	return function(myParent,x,y,w,lh,rh,tl) {
		this.data = myParent.getData();
		this.ssparent = myParent;
		this.client = myParent.client;
		this.x = x;
		this.y = y;
		this.w = w;
		this.lh = lh;
		this.rh = rh;
		this.tl = tl;
		this.isReady = false;
	
	    if(this.x === undefined){
			this.x = 0;
		}
		if(this.y === undefined){
			this.y = 0;
		}		
	    if(this.w === undefined){
			this.w = 0;
		}
		if(this.h === undefined){
			this.h = 0;
		}		
		
		this.setData = function(data) {
			this.data = data;
		};
		this.getData = function() {
			return this.data;
		};
		this.setParent= function(parent) {
			this.ssparent = parent;
		};
		this.getParent = function() {
			return this.ssparent;
		};
		this.getClient = function() {
			return this.client;
		};
		this.setX= function(x) {
			this.x = x;
		};
		this.getX = function() {
			return this.x;
		};
		this.setY= function(y) {
			this.y = y;
		};
		this.getY = function() {
			return this.y;
		};
		this.setW= function(w) {
			this.w = w;
		};
		this.getW = function() {
			return this.w;
		};
		this.setH= function(h) {
			this.h = h;
		};
		this.getH = function() {
			return this.h;
		};

		this.setLH= function(lh) {
			this.lh = lh;
		};
		this.getLH = function() {
			return this.lh;
		};
		this.setRH= function(rh) {
			this.rh = rh;
		};
		this.getRH = function() {
			return this.rh;
		};

		this.render = function() {
			var data = this.getData();
			var t =1;
			var color = "WH";
			
			if(!this.getParent().isReady) return this;
	        
	        if(data.model["SASH.THICKNESS"] !=undefined){
		      t = Number(data.model["SASH.THICKNESS"].value);
			  if (t == undefined) {
				t = 1;
			  }
	       }  
			t = this.client.convert(t);

            if(data.model["SASH.COLOR"] !=undefined){
               color = data.model['SASH.COLOR'].value;
 	        }   
//			if(data["FRAME.COLOR"] !=undefined){
//				color = data['FRAME.COLOR'].value;
//			}
			if(this.getParent().frame.framei.container === undefined){
				return this;
			}
			this.sasho = {container:undefined, svg: undefined};
			this.sasho.container  = this.getParent().frame.framei.container.nested();

			this.sasho.w = w;
			this.sasho.lh = lh;
			this.sasho.rh = rh;
			this.sasho.tl = tl;
			this.sasho.x1 = x;
			this.sasho.y1 = y;
			this.sasho.x2 = this.sasho.x1 + w;
			this.sasho.y2 = this.sasho.y1 + lh;
			this.sasho.y3 = this.sasho.y2 - rh;


			if (lh > rh) {
				this.sasho.x3 = this.sasho.x1 + tl;
				this.sasho.svg = this.sasho.container.polygon([
					this.sasho.x3, this.sasho.y1,
					this.sasho.x1, this.sasho.y1,
					this.sasho.x1, this.sasho.y2,
					this.sasho.x2, this.sasho.y2,
					this.sasho.x2, this.sasho.y3
				]);
			} else {
				this.sasho.x3 = this.sasho.x2 - tl;
				this.sasho.svg = this.sasho.container.polygon([
					this.sasho.x1, this.sasho.y1,
					this.sasho.x1, this.sasho.y2,
					this.sasho.x2, this.sasho.y2,
					this.sasho.x2, this.sasho.y3,
					this.sasho.x3, this.sasho.y1,
				]);
			}

			this.sasho.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});

			this.sashi = {container:undefined, svg: undefined};
			
			this.sashi.container  = this.sasho.container;
			this.sashi.w = w;
			this.sashi.lh = lh;
			this.sashi.rh = rh;
			this.sashi.tl = tl;
			this.sashi.x1 = x;
			this.sashi.y1 = y;
			this.sashi.x2 = this.sashi.x1 + w;
			this.sashi.y2 = this.sashi.y1 + lh;
			this.sashi.y3 = this.sashi.y1 + (this.sashi.lh - this.sashi.rh);


			if (lh > rh) {
				this.sashi.x3 = this.sashi.x1 + tl;
				this.sashi.svg = this.sashi.container.polygon([
					this.sashi.x3, this.sashi.y1,
					this.sashi.x1, this.sashi.y1,
					this.sashi.x1, this.sashi.y2,
					this.sashi.x2, this.sashi.y2,
					this.sashi.x2, this.sashi.y3
				]);
			} else {
				this.sashi.x3 = this.sashi.x2 - tl;
				this.sashi.svg = this.sashi.container.polygon([
					this.sashi.x1, this.sashi.y1,
					this.sashi.x1, this.sashi.y2,
					this.sashi.x2, this.sashi.y2,
					this.sashi.x2, this.sashi.y3,
					this.sashi.x3, this.sashi.y3,
				]);
			}




			this.sashi.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
		    this.isReady = true;
	        
	        this.pane = new ssChoppedTrapPane(this,this.sashi.x1,this.sashi.y1,this.sashi.w,this.sashi.lh,this.sashi.rh,this.sashi.tl).render();

			// use to put a bounding box when its selected  --- for hliting
			this.x1 = this.sasho.x1;
			this.y1 = this.sasho.y1;
			this.x2 = this.sasho.x2; 
			this.y2 = this.sasho.y2;
			this.instanceId = data.model.InstanceId;
			this.client.hliteObject(this);
			
            return this;
		};
	
	};

});