sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase",
	"zss5lgraphics/libs/ssgraph/common/ssPentoidPane",
	"zss5lgraphics/libs/ssgraph/common/ssSpreaderBar"
], function(ssMath,core,ssBase,ssPentoidPane,ssSpreaderBar) {
	return function(myParent,x,y,w,lh,rh) {
		this.data = myParent.getData();
		this.ssparent = myParent;
		this.client = myParent.client;
		this.x = x;
		this.y = y;
		this.w = w;
		this.lh = lh;
		this.rh = rh;
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
			this.sasho.hw = w/2;
			this.sasho.lh = lh;
			this.sasho.rh = rh;
			this.sasho.x1 = x;
			this.sasho.y1 = y;
			this.sasho.x2 = this.sasho.x1 + w;
			this.sasho.y2 = this.sasho.y1 + rh;
			this.sasho.y3 = this.sasho.y2 - rh;
			this.sasho.y4 = this.sasho.y2 - lh;

			this.sasho.x3 = this.sasho.x1 + this.sasho.hw;
			this.sasho.svg = this.sasho.container.polygon([
				this.sasho.x1, this.sasho.y1,
				this.sasho.x1, this.sasho.y2,
				this.sasho.x2, this.sasho.y2,
				this.sasho.x2, this.sasho.y3,
				this.sasho.x3, this.sasho.y4,
			]);

			this.sasho.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});

			this.sashi = {container:undefined, svg: undefined};
			
			this.sashi.container  = this.sasho.container;
			this.sashi.w = w/2;
			this.sashi.lh = lh;
			this.sashi.rh = rh;
			this.sashi.x1 = x;
			this.sashi.y1 = y;
			this.sashi.x2 = this.sashi.x1 + w;
			this.sashi.y2 = this.sashi.y1 + rh;
			this.sashi.y3 = this.sashi.y2 - rh;
			this.sashi.y4 = this.sashi.y2 - lh;
			this.sashi.x3 = this.sashi.x1 + this.sashi.hw;
			
			this.sashi.svg = this.sashi.container.polygon([
				this.sashi.x1, this.sashi.y1,
				this.sashi.x1, this.sashi.y2,
				this.sashi.x2, this.sashi.y2,
				this.sashi.x2, this.sashi.y3,
				this.sashi.x3, this.sashi.y4,
			]);
	

			this.sashi.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
		    this.isReady = true;
	        
	        this.pane = new ssPentoidPane(this,this.sashi.x1,this.sashi.y1,this.sashi.w,this.sashi.lh,this.sashi.rh).render();

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