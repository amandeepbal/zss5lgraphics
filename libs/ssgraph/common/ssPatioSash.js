sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase",
	"zss5lgraphics/libs/ssgraph/common/ssPane",
	"zss5lgraphics/libs/ssgraph/common/ssScreen",
	"zss5lgraphics/libs/ssgraph/common/ssSpreaderBar"
], function(ssMath,core,ssBase,ssPane,ssScreen,ssSpreaderBar) {
	return function(myParent,x,y,w,h) {
		this.data = myParent.getData();
		this.ssparent = myParent;
		this.client = myParent.client;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
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
 	        else{
   			  if(data.model["DOOR.COLOR"] !=undefined){
				color = data.model['DOOR.COLOR'].value;
			  }
 	        }  
			
			this.sasho = {container:undefined, svg: undefined};
			this.sasho.container  = this.getParent().frame.framei.container.nested();
            this.sasho.w = this.getW();
            this.sasho.h = this.getH();
            this.sasho.x = this.getX();
            this.sasho.y = this.getY();

			this.sasho.svg  = this.sasho.container.rect(this.sasho.w, this.sasho.h);
			this.sasho.svg.attr({fill: ssBase.color[color].htmlcolor,"stroke": "#000", "stroke-width": 1});
			this.sasho.svg.move(this.sasho.x,this.sasho.y);

			this.sashi = {container:undefined, svg: undefined};
			
			this.sashi.container  = this.sasho.container;
			this.sashi.w = this.sasho.w-(2*t);
			this.sashi.h = this.sasho.h-(2*t);
			this.sashi.x = this.sasho.x + t;
			this.sashi.y = this.sasho.y + t;

			this.sashi.svg  = this.sashi.container.rect(this.sashi.w, this.sashi.h);
			this.sashi.svg.attr({fill:ssBase.color[color].htmlcolor,"stroke": "#000", "fill-opacity": "0.1","stroke-width": 1});
			this.sashi.svg.move(this.sashi.x,this.sashi.y);
		    this.isReady = true;
	        
	        if(!data.model.hasScreenOnly){
	          this.pane = new ssPane(this,this.sashi.x,this.sashi.y).render();
	          this.spreader = new ssSpreaderBar(this.pane,this.pane.x,this.pane.y).render();
		    }


	        if(data.model.hasScreenOnly){
			    this.screen = new ssScreen(this,this.sashi.x,this.sashi.y).render();			
	            this.spreader = new ssSpreaderBar(this.screen,this.screen.x,this.screen.y).render();
		    }  	        

			// use to put a bounding box when its selected  --- for hliting
			this.x1 = this.sasho.x;
			this.y1 = this.sasho.y;
			this.x2 = this.sasho.x + this.sasho.w; 
			this.y2 = this.sasho.y + this.sasho.h;
			this.instanceId = data.model.InstanceId;
			this.client.hliteObject(this);
			
            return this;
		};
	
	};

});