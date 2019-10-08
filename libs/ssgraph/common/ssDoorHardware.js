sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase"
	
], function(ssMath,core, ssBase) {
	return function(myParent,x,y) {
		this.data = myParent.getData();
		this.ssparent = myParent;
		this.client = myParent.client;
		this.x = x;
		this.y = y;
		this.r = 0;
		this.svg = undefined;
		this.container = undefined;
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
			var color = "AB";
			var hingeswing = "LHHI";

	        if(!this.getParent().isReady) return this;

            if(data.model["HARDWARE.COLOR"] !=undefined){
            	color = data.model["HARDWARE.COLOR"].value;
            }	
            if(data.model["HINGE.SWING"] !=undefined){
            	hingeswing = data.model["HINGE.SWING"].value;
            }	
	        this.r = this.client.convert(2);
            this.x = this.x;
            this.y = this.y;
			this.container  = this.getParent().slab.container.nested();
			this.svg =  this.container.circle(this.r);
			this.svg.attr({fill:ssBase.color[color].htmlcolor,"stroke": "#000", "stroke-width": 1});
            this.isReady = true;

			// use to put a bounding box when its selected  --- for hliting
			this.x1 = this.x - this.r;
			this.y1 = this.y - this.r;
			this.x2 = this.x + this.r + this.r; 
			this.y2 = this.y + this.r + this.r;
			this.instanceId = data.model.InstanceId;
			this.client.hliteObject(this);
            
			return this;
		};
	};

});