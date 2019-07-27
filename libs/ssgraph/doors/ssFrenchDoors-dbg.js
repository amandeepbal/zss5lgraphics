sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase",
	"zss5lgraphics/libs/ssgraph/common/ssDoorHardware",
	"zss5lgraphics/libs/ssgraph/doors/ssEntryDoor"
], function(ssMath, core, ssBase, ssDoorHardware, ssEntryDoor) {
	return function(client, data, myParent, x, y) {
		this.data = data;
		this.client = client;
		this.x = x;
		this.y = y;
		this.ssparent = myParent;
		this.container = undefined;
		this.slab = undefined;
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
			var k = 0;
			var f = 4.25;

			this.container = this.getParent().nested();
			this.isReady = true;
			var hingeswing = "LHHI";

			if (data.model["OPERATING.SWING"] != undefined) {
				hingeswing = data.model["OPERATING.SWING"].value;
			}

//            var data =  this.getData();
            data.isFrench = true;
            data.whichside = "L";
			data.isOffset= false;
		  	data.isOffsetSide = false;
			if(data.model["FRENCH.DOOR.ASTRAGAL"] != undefined && data.model["FRENCH.DOOR.ASTRAGAL"].value === "O") {
				data.isOffset = true;
				if(data.whichside === "L"){
				  if(data.model["FRENCH.DOOR.OFFSET"] != undefined && data.model["FRENCH.DOOR.OFFSET"].value === "L"){
				  	data.isOffsetSide = true;
				  }	
			    }
			}    


			this.door1 = new ssEntryDoor(this.getClient(), data, this.getParent(), this.x, this.y).render();

			if (!this.door1.isReady) return this;
			this.door1.hardware.x = this.door1.slab.x + this.door1.slab.w - this.door1.hardware.r - this.client.convert(1);
			this.door1.hardware.y = this.door1.slab.y + this.client.convert(40);
			this.door1.hardware.svg.move(this.door1.hardware.x, this.door1.hardware.y);

            data.whichside = "R";
		  	data.isOffset = false;
		  	data.isOffsetSide = false;
			if(data.model["FRENCH.DOOR.ASTRAGAL"] != undefined && data.model["FRENCH.DOOR.ASTRAGAL"].value === "O") {
				data.isOffset= true;
				if(data.whichside === "R"){
				  if(data.model["FRENCH.DOOR.OFFSET"] != undefined && data.model["FRENCH.DOOR.OFFSET"].value === "R"){
				  	data.isOffsetSide = true;
				  }	
			    }
			}    

			this.door2 = new ssEntryDoor(this.getClient(), data, this.getParent(), (this.x + this.door1.w) + 1, this.y).render();
			if (!this.door2.isReady) return this;
			this.door2.hardware.x = this.door2.slab.x + this.client.convert(1);
			this.door2.hardware.y = this.door2.slab.y + this.client.convert(40);
			this.door2.hardware.svg.move(this.door2.hardware.x, this.door2.hardware.y);
			//			this.door2.hardware.svg.front();          

			var op = 5;
			op = this.client.convert(op);

			switch (hingeswing) {
				case "LHHI":
					this.door1.hardware.text = this.door1.slab.container.text("P");
					this.door1.hardware.text.move(this.door1.hardware.x, this.door1.hardware.y - op);
					break;
				case "LHHO":
					this.door1.hardware.text = this.door1.slab.container.text("P");
					this.door1.hardware.text.move(this.door1.hardware.x, this.door1.hardware.y - op);
					break;
				case "RHHI":
					this.door2.hardware.text = this.door2.slab.container.text("P");
					this.door2.hardware.text.move(this.door2.hardware.x, this.door2.hardware.y - op);
					break;
				case "RHHO":
					this.door2.hardware.text = this.door2.slab.container.text("P");
					this.door2.hardware.text.move(this.door2.hardware.x, this.door2.hardware.y - op);
					break;
			}
			return this;

		};
	};

});