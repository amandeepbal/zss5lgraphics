sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase"
], function(ssMath,core,ssBase) {
	return function(client,data,myParent,x,y) {
		this.data = data;
		this.ssparent = myParent;
		this.client = client;
		this.x = x;
		this.y = y;
		this.w = 0;
		this.h = 0;
		this.hlite = this.client.dim;
		this.shadeo = undefined;
		this.valanceo = undefined;
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
			var fcolor = 'WH';
			var vcolor = 'WH';
			var w = 1;
			var h= 1;

			this.isReady = true;
 	        if(this.data.model["FABRIC.COLOR"] !=undefined){
               fcolor = this.data.model['FABRIC.COLOR'].value;
 	        }   
 	        if(this.data.model["VALANCE.COLOR"] !=undefined){
               vcolor = this.data.model['VALANCE.COLOR'].value;
 	        }   
 	        if(this.data.model["BLIND.WIDTH"] !=undefined){
               w = this.data.model['BLIND.WIDTH'].value;
 	        }   
 	        if(this.data.model["BLIND.LENGTH"] !=undefined){
               h = this.data.model['BLIND.LENGTH'].value;
 	        }   
            if(w <= 0){ return this;}
            if(h <= 0){ return this;}
	        w = this.client.convert(w);
	        h = this.client.convert(h);
			this.shadeo = {container:undefined, svg: undefined};
			this.shadeo.container  = this.getParent().nested();
            this.shadeo.w = w;
            this.shadeo.h = h;
            this.shadeo.x = this.x;
            this.shadeo.y = this.y;
			
			this.shadeo.svg  = this.shadeo.container.rect(this.shadeo.w, this.shadeo.h);
			this.shadeo.svg.attr({fill: ssBase.color[fcolor].htmlcolor,"stroke": "#000", "stroke-width": 1});
            this.shadeo.svg.move(this.shadeo.x,this.shadeo.y);
		
			this.valanceo = {container:undefined, svg: undefined};
			this.valanceo.container  = this.shadeo.container;
            this.valanceo.w = w;
            this.valanceo.h = this.client.convert(3);
            this.valanceo.x = this.x;
            this.valanceo.y = this.y;
			this.valanceo.svg  = this.valanceo.container.rect(this.valanceo.w, this.valanceo.h);
			this.valanceo.svg.attr({fill: ssBase.color[vcolor].htmlcolor,"stroke": "#000", "stroke-width": 1});
            this.valanceo.svg.move(this.valanceo.x,this.valanceo.y);

			this.x1 = this.shadeo.x;
			this.y1 = this.shadeo.y;
			this.x2 = this.shadeo.x + this.shadeo.w; 
			this.y2 = this.shadeo.y + this.shadeo.h;
			this.instanceId = data.model.InstanceId;
			this.client.hliteObject(this);
	
			return this;
		};
	};

});