sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase",
	"zss5lgraphics/libs/ssgraph/common/ssPentoidScreen"
], function(ssMath,core,ssBase,ssPentoidScreen) {
	return function(myParent,x,y,w,lh,rh) {
		this.data = myParent.getData();
		this.ssparent = myParent;
		this.client = myParent.client;
		this.x = x;
		this.y = y;
		this.w = w;
		this.lh = lh;
		this.rh = rh;
		this.isGlass = false;
		this.isTemperedGlass = false;
		this.paneo = undefined;
		this.isReady = false;
	
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
			var color = 'CL';
			var colorCode = "#FFFFFF";

	        if(!this.getParent().isReady) return this;			

            var ttype = "S";
 	          if(data.model["TRANSOM.TYPE"] !=undefined){
 	        	ttype = data.model["TRANSOM.TYPE"].value;
 	          }
 	          else{
 	          	ttype = "V";
 	          	if(data.model["GLASS.COLOR"] !=undefined){
 	          		ttype = "G";
 	          	}
 	          }

 	        if(ttype === "V" && data.model["VINYL.COLOR"] !=undefined){
               color = data.model['VINYL.COLOR'].value;
               colorCode = ssBase.color[color].htmlcolor;
 	        }   
            if(ttype === "G" && data.model["GLASS.COLOR"] !=undefined){
                color = data.model['GLASS.COLOR'].value; 	        	
                 this.isGlass = true;
                 colorCode = ssBase.color[color].htmlcolor;
                 if(data.model["TEMPERED.GLASS"] !=undefined){
                   this.isTemperedGlass = data.model['TEMPERED.GLASS'].value; 	        	
                 } 
 	        }
			this.paneo = {container: undefined, svg: undefined};
 	        if(this.getParent().sashi != undefined) {
			  this.paneo.container = this.getParent().sashi.container.nested();
 	        }
 	        else{
			  this.paneo.container = this.getParent().frame.framei.container.nested();
 	        }
 	        
			this.paneo.w = w;
			this.paneo.hw = w/2;
			this.paneo.lh = lh;
			this.paneo.rh = rh;
			this.paneo.x1 = x;
			this.paneo.y1 = y;
			this.paneo.x2 = this.paneo.x1 + w;
			this.paneo.y2 = this.paneo.y1 + rh;
			this.paneo.y3 = this.paneo.y2 - rh;
			this.paneo.y4 = this.paneo.y2 - lh;
			this.paneo.x3 = this.paneo.x1 + this.paneo.hw;

			this.paneo.svg = this.paneo.container.polygon([
					this.paneo.x1, this.paneo.y1,
					this.paneo.x1, this.paneo.y2,
					this.paneo.x2, this.paneo.y2,
					this.paneo.x2, this.paneo.y3,
					this.paneo.x3, this.paneo.y4,
				]);

			this.paneo.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});	


            var  centerx = this.paneo.x1 + (this.paneo.w/2);
            var  centery;
            this.paneo.h = this.paneo.lh;
            if(this.paneo.lh >= this.paneo.rh){
            	centery = this.paneo.y4 + (this.paneo.lh/2);
            	centery  = centery + 10;
            }	
            if(this.paneo.rh > this.paneo.lh){
            	centery = this.paneo.y4 + (this.paneo.rh/2);
            	centery  = centery + 10;
               this.paneo.h = this.paneo.rh;
            }	

            if(ttype === 'G'){
			  this.paneo.svgx = this.paneo.container.line(centerx+5,centery-15,centerx-15,centery+5);
			  this.paneo.svgx.attr({fill: ssBase.color["DG"].htmlcolor,"stroke": "#000", "stroke-width": 1});
			
			  this.paneo.svgx = this.paneo.container.line(centerx+20,centery-20,centerx-20,centery+20);
			  this.paneo.svgx.attr({fill: ssBase.color["SG"].htmlcolor,"stroke": "#000", "stroke-width": 1});
			
			  this.paneo.svgx = this.paneo.container.line(centerx+15,centery-5,centerx-5,centery+15);
  			  this.paneo.svgx.attr({fill: ssBase.color["SG"].htmlcolor,"stroke": "#000", "stroke-width": 1});
            }
            else{
      	         centerx = this.x + (this.paneo.w/2);
                 centery = this.paneo.y4 + (this.paneo.h/2);
              
			     this.paneo.svgx = this.paneo.container.line(centerx-10,centery-5,centerx-5,centery-5);
		         this.paneo.svgx.attr({fill: ssBase.color["SG"].htmlcolor,"stroke": "#000", "stroke-width": 1});
			  
			     this.paneo.svgx = this.paneo.container.line(centerx-5,centery-5,centerx,centery);
		         this.paneo.svgx.attr({fill: ssBase.color["SG"].htmlcolor,"stroke": "#000", "stroke-width": 1});
			  
			     this.paneo.svgx = this.paneo.container.line(centerx,centery,centerx+5,centery-5);
		         this.paneo.svgx.attr({fill: ssBase.color["SG"].htmlcolor,"stroke": "#000", "stroke-width": 1});

			     this.paneo.svgx = this.paneo.container.line(centerx+5,centery-5,centerx+10,centery-5);
		         this.paneo.svgx.attr({fill: ssBase.color["SG"].htmlcolor,"stroke": "#000", "stroke-width": 1});
			
			     this.paneo.svgx = this.paneo.container.line(centerx-10,centery,centerx-5,centery);
		         this.paneo.svgx.attr({fill: ssBase.color["SG"].htmlcolor,"stroke": "#000", "stroke-width": 1});
			  
			     this.paneo.svgx = this.paneo.container.line(centerx-5,centery,centerx,centery+5);
		         this.paneo.svgx.attr({fill: ssBase.color["SG"].htmlcolor,"stroke": "#000", "stroke-width": 1});

			     this.paneo.svgx = this.paneo.container.line(centerx,centery+5,centerx+5,centery);
		         this.paneo.svgx.attr({fill: ssBase.color["SG"].htmlcolor,"stroke": "#000", "stroke-width": 1});

			     this.paneo.svgx = this.paneo.container.line(centerx+5,centery,centerx+10,centery);
		         this.paneo.svgx.attr({fill: ssBase.color["SG"].htmlcolor,"stroke": "#000", "stroke-width": 1});

            }


			this.isReady = true;
		    this.screen = new ssPentoidScreen(this,this.paneo.x1,this.paneo.y1).render();	
		    
			// use to put a bounding box when its selected  --- for hliting
			this.x1 = this.paneo.x1;
			this.y1 = this.paneo.y1;
			this.x2 = this.paneo.x2; 
			this.y2 = this.paneo.y2;
			this.instanceId = data.model.InstanceId;
			this.client.hliteObject(this);
		    
			return this;
		};
	};

});