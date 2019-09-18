sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase",
	"zss5lgraphics/libs/ssgraph/common/ssTrapFrame",
	"zss5lgraphics/libs/ssgraph/common/ssTrapSash",
	"zss5lgraphics/libs/ssgraph/common/ssPane"
], function(ssMath, core, ssBase, ssTrapFrame, ssTrapSash, ssPane) {
	//	return function(data,myParent,x,y) {
	return function(client, data, myParent, x, y) {
		this.data = data;
		this.client = client;
		this.x = x;
		this.y = y;
		this.w = 0;
		this.h = 0;
		this.ssparent = myParent;
		this.container = undefined;
		this.frame = undefined;
		this.isReady = false;

		if (this.x === undefined) {
			this.x = 0;
		}
		if (this.y === undefined) {
			this.y = 0;
		}

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
			this.container = this.getParent().nested();
			this.isReady = true;
			if (data.model === undefined) {
				return this;
			}
			ssMath.calcTrapezoid(data.model);
			if(Number(data.model['RIGHT.HEIGHT'].value) > Number(data.model['LEFT.HEIGHT'].value)){
				this.y = Number(data.model['RIGHT.HEIGHT'].value) - Number(data.model['LEFT.HEIGHT'].value);
				this.y = this.client.convert(this.y);
			}

			this.frame = new ssTrapFrame(this, this.x, this.y).render();
			//	        var sash = new ssTrapSash(this,x,y,this.ws,this.hs).render();
			if (this.frame.w <= 0) {
				return this;
			}
			if (this.frame.lh <= 0) {
				return this;
			}
			if (this.frame.rh <= 0) {
				return this;
			}
			var sash = new ssTrapSash(this, this.frame.framei.x1, this.frame.framei.y1, this.frame.framei.w, this.frame.framei.lh, this.frame.framei
				.rh).render();
			this.frame.sashes.push(sash);
			return this;
		};
	};

});