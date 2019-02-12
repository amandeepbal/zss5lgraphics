sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase",
		"zss5lgraphics/libs/ssgraph/common/ssScreen"
], function(ssMath,core,ssBase,ssScreen) {
	return function(myParent,x,y) {
		this.data = myParent.getData();
		this.ssparent = myParent;
		this.client = myParent.client;
		this.x = x;
		this.y = y;
		this.w = 0;
		this.h = 0;
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
			var color = 'WH';
			var ismosm = "O";
			var showGlassMarks = true;
			var showVinylMarks = false;

	        if(!this.getParent().isReady) return this;			

 	        var vtype = "";
 	        if(data.model["VENT.TYPE"] !=undefined){
 	        	vtype = data.model["VENT.TYPE"].value;
 	        }

			var ktype = "";
 	        if(data.model["KNEEWALL.TYPE"] !=undefined){
 	        	ktype = data.model["KNEEWALL.TYPE"].value;
 	        	if(ktype === 'SC'){
 	        		showGlassMarks = false;
 	        	}
 	        }
 	        if(data.model['ISM.OSM'] != undefined && data.model['ISM.OSM'].value != undefined){
              ismosm = data.model['ISM.OSM'].value;
 	        } 

 	        if((vtype === "" || vtype==="V") &&  ktype === "" && data.model["VINYL.COLOR"] !=undefined){
               color = data.model['VINYL.COLOR'].value;
               showVinylMarks = true;
               showGlassMarks = false;
               if(data.isMixedVents){
               	  switch(data.currentVent){
               	  	case 0:
                     color = data.model['VENT1.VINYL.COLOR'].value;
                     break;
               	  	case 1:
                     color = data.model['VENT2.VINYL.COLOR'].value;
                     break;
               	  	case 2:
                     color = data.model['VENT3.VINYL.COLOR'].value;
                     break;
               	  	case 3:
                     color = data.model['VENT4.VINYL.COLOR'].value;
               	  	 break;
               	  }
               }
 	        }   
 	        else{
               if(vtype === "" && data.model["GLASS.COLOR"] !=undefined){
                 color = data.model['GLASS.COLOR'].value; 	        	
                 this.isGlass = true;
                 if(data.model["TEMPERED.GLASS"] !=undefined){
                   this.isTemperedGlass = data.model['TEMPERED.GLASS'].value; 	        	
                 } 
               }  
 	        }

			var hasScreenOnly = false;
			if(data.model.hasScreenOnly != undefined){
				hasScreenOnly = data.model.hasScreenOnly;
			}
			if(hasScreenOnly){
				showGlassMarks = false;
				showVinylMarks = false;
            }
            
			this.paneo = {container:undefined, svg: undefined};
			this.paneo.container  = this.getParent().sashi.container.nested();
            this.paneo.w = this.getParent().sashi.w;
            this.paneo.h = this.getParent().sashi.h;
            this.paneo.x = this.x;
            this.paneo.y = this.y;
			
			this.paneo.svg  = this.paneo.container.rect(this.paneo.w, this.paneo.h);
			this.paneo.svg.attr({fill: ssBase.color[color].htmlcolor,"stroke": "#000", "stroke-width": 1});
            this.paneo.svg.move(this.paneo.x,this.paneo.y);
            if(showGlassMarks){
              var  centerx = this.x + (this.paneo.w/2);
              var  centery = this.y + (this.paneo.h/2);
			  this.paneo.svgx = this.paneo.container.line(centerx+5,centery-15,centerx-15,centery+5);
			  this.paneo.svgx.attr({fill: ssBase.color["DG"].htmlcolor,"stroke": "#000", "stroke-width": 1});
			
			  this.paneo.svgx = this.paneo.container.line(centerx+20,centery-20,centerx-20,centery+20);
			  this.paneo.svgx.attr({fill: ssBase.color["SG"].htmlcolor,"stroke": "#000", "stroke-width": 1});
			
			  this.paneo.svgx = this.paneo.container.line(centerx+15,centery-5,centerx-5,centery+15);
			  this.paneo.svgx.attr({fill: ssBase.color["SG"].htmlcolor,"stroke": "#000", "stroke-width": 1});
            } 
            if(showVinylMarks){
              var  centerx = this.x + (this.paneo.w/2);
              var  centery = this.y + (this.paneo.h/2);
              
			  this.paneo.svgx = this.paneo.container.line(centerx-10,centery-5,centerx-5,centery-5);
		      this.paneo.svgx.attr({fill: ssBase.color["SG"].htmlcolor,"stroke": "#000", "stroke-width": 1});
			  
			  this.paneo.svgx = this.paneo.container.line(centerx-5,centery-5,centerx,centery);
		      this.paneo.svgx.attr({fill: ssBase.color["SG"].htmlcolor,"stroke": "#000", "stroke-width": 1});
			  
			  this.paneo.svgx = this.paneo.container.line(centerx,centery,centerx+5,centery-5);
		      this.paneo.svgx.attr({fill: ssBase.color["SG"].htmlcolor,"stroke": "#000", "stroke-width": 1});

			  this.paneo.svgx = this.paneo.container.line(centerx+5,centery-5,centerx+10,centery-5);
		      this.paneo.svgx.attr({fill: ssBase.color["SG"].htmlcolor,"stroke": "#000", "stroke-width": 1});
			

//sec			  
			  this.paneo.svgx = this.paneo.container.line(centerx-10,centery,centerx-5,centery);
		      this.paneo.svgx.attr({fill: ssBase.color["SG"].htmlcolor,"stroke": "#000", "stroke-width": 1});
			  
			  this.paneo.svgx = this.paneo.container.line(centerx-5,centery,centerx,centery+5);
		      this.paneo.svgx.attr({fill: ssBase.color["SG"].htmlcolor,"stroke": "#000", "stroke-width": 1});

			  this.paneo.svgx = this.paneo.container.line(centerx,centery+5,centerx+5,centery);
		      this.paneo.svgx.attr({fill: ssBase.color["SG"].htmlcolor,"stroke": "#000", "stroke-width": 1});

			  this.paneo.svgx = this.paneo.container.line(centerx+5,centery,centerx+10,centery);
		      this.paneo.svgx.attr({fill: ssBase.color["SG"].htmlcolor,"stroke": "#000", "stroke-width": 1});



//			  this.paneo.svgx = this.paneo.container.line(centerx+20,centery-20,centerx-20,centery+20);
//			  this.paneo.svgx.attr({fill: ssBase.color["SG"].htmlcolor,"stroke": "#000", "stroke-width": 1});
			
//			  this.paneo.svgx = this.paneo.container.line(centerx+15,centery-5,centerx-5,centery+15);
//			  this.paneo.svgx.attr({fill: ssBase.color["SG"].htmlcolor,"stroke": "#000", "stroke-width": 1});
            } 

			this.isReady = true;
		    if(vtype === "" || vtype === "S" || hasScreenOnly){
		      if(ismosm != "I"){	
			    this.screen = new ssScreen(this,this.paneo.x,this.paneo.y).render();			
		      }  
		    }  
			// use to put a bounding box when its selected  --- for hliting
			this.x1 = this.paneo.x;
			this.y1 = this.paneo.y;
			this.x2 = this.paneo.x + this.paneo.w; 
			this.y2 = this.paneo.y + this.paneo.h;
			this.instanceId = data.model.InstanceId;
			this.client.hliteObject(this);
	
		
			return this;
		};
	};

});