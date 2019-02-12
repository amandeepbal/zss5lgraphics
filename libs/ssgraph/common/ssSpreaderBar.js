sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase"
], function(ssMath,core,ssBase) {
	return function(myParent,x,y) {
		this.data = myParent.getData();
		this.client = myParent.client;
		this.ssparent = myParent;
		this.x = x;
		this.y = y;
		this.container = undefined;
		this.svg = undefined;
		this.isReady = false;
		this.w = 0;
		this.h = 0;
	    if(this.x === undefined){
			this.x = 0;
		}
		if(this.y === undefined){
			this.y = 0;
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
		this.render = function() {
			var data = this.getData();
			var t = 1;
			var color = 'WH';

	        if(!this.getParent().isReady) return this;			

 	        if(data.model["SPREADER.BAR"] !=undefined){
               if(!data.model["SPREADER.BAR"].value){return this;}
 	        }
 	        else{return this;}
	        
 	        if(data.model["SASH.COLOR"] !=undefined){
               color = data.model['SASH.COLOR'].value;
 	        }   
 	        else{
 	          if(data.model["FRAME.COLOR"] !=undefined){
               color = data.model['FRAME.COLOR'].value;
 	          }   
 	        }
 	        
 	        if(data.model["SASH.THICKNESS"] !=undefined){
               t = data.model['SASH.THICKNESS'].value;
 	        }   

	        t = this.client.convert(t);
	        
			this.container  = this.getParent().paneo.container.nested();
            if(!data.isHorizontal){
              this.w = t;
              this.h = this.getParent().paneo.h;
              this.x = this.x + (this.getParent().paneo.w / 2);
              this.y = this.y;
            }  
            if(data.isHorizontal){
              this.w = this.getParent().paneo.w;
              this.h = t;
              this.x = this.x;
              this.y = this.y + (this.getParent().paneo.h / 2);
            }  
			
			this.svg  = this.container.rect(this.w, this.h);
			this.svg.attr({fill: ssBase.color[color].htmlcolor,"stroke": "#000", "stroke-width": 1});
			this.svg.move(this.x,this.y);
			this.svg.front();
			
			this.isReady = true;
			
			// use to put a bounding box when its selected  --- for hliting
			this.x1 = this.x;
			this.y1 = this.y;
			this.x2 = this.x + this.w; 
			this.y2 = this.y + this.h;
			this.instanceId = data.model.InstanceId;
			this.client.hliteObject(this);

			return this;
		};
	};

});