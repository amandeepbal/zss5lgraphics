sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase"
	
], function(ssMath,core,ssBase) {
	return function(myParent,x,y) {
		this.data = myParent.getData();
		this.ssparent = myParent;
		this.client = myParent.client;
		this.x = x;
		this.y = y;
		this.screeno = undefined;
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
		this.render = function() {
			var data = this.getData();
			var screentype = "NS";
			var m= 5;

	        if(!this.getParent().isReady) return this;

            if(data.model["SCREEN.TYPE"] !=undefined){
            	screentype = data.model['SCREEN.TYPE'].value;
            }	
            if(screentype === 'NS' && !data.model.hasScreenOnly) { return this;};

			this.screeno = {container:undefined, svg: undefined, mesh:[]};

			if(this.getParent().paneo !=undefined){
			  this.screeno.container  = this.getParent().paneo.container.nested();
              this.screeno.w = this.getParent().paneo.w;
              this.screeno.h = this.getParent().paneo.h;
			}
			else{
			  this.screeno.container  = this.getParent().sashi.container.nested();
              this.screeno.w = this.getParent().sashi.w;
              this.screeno.h = this.getParent().sashi.h;
			}
			
            this.screeno.x = this.x;
            this.screeno.y = this.y;
			
			var x1 = this.screeno.x  ;
//			var x2 = (this.screeno.x + this.screeno.w) -m -m;
			var x2 = this.screeno.w ;
			var y1 = this.screeno.y + m;
			var maxy = parseInt(this.screeno.h / m); 
			for( var y=0; y< maxy; y++){
			  var aline = this.screeno.container.line(0,0,x2,0);
			  aline.attr({"stroke": ssBase.color["SC"].htmlcolor, "stroke-width": 1});
			  aline.move(x1,y1);
			  this.screeno.mesh.push(aline);
			  y1 += m;
			}
			
			var x1 = this.screeno.x + m ;
			var y1 = this.screeno.y;
//			var y2 = (this.screeno.y + this.screeno.h) -m -m;
			var y2 = this.screeno.h;
			var maxx = parseInt(this.screeno.w / m); 
			for( var x=0; x< maxx; x++){
			  var aline = this.screeno.container.line(0,0,0,y2);
			  aline.attr({"stroke": ssBase.color["SC"].htmlcolor, "stroke-width": 1});
			  aline.move(x1,y1);
			  this.screeno.mesh.push(aline);
			  x1 += m;
			}
            this.isReady = true;
			return this;
		};
	};

});