sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase",
	"zss5lgraphics/libs/ssgraph/common/ssFrame",
	"zss5lgraphics/libs/ssgraph/common/ssDoorSlab",
	"zss5lgraphics/libs/ssgraph/common/ssSash",
	"zss5lgraphics/libs/ssgraph/common/ssPane",
	"zss5lgraphics/libs/ssgraph/common/ssScreen",
	"zss5lgraphics/libs/ssgraph/common/ssDoorHardware"
], function(ssMath, core, ssBase, ssFrame, ssDoorSlab, ssSash, ssPane, ssScreen, ssDoorHardware) {
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
			var ih = 0;

			this.container = this.getParent().nested();
			this.isReady = true;
			var hingeswing = "LHHI";

			this.slab = new ssDoorSlab(this, this.x, this.y).render();
			if (!this.slab.isReady) return this;
			this.w = this.slab.w;
			this.h = this.slab.h;

			if (data.model["SLAB.PERIMETER"] != undefined) {
				f = Number(data.model["SLAB.PERIMETER"].value);
			}

			if (data.model["INSERT.HEIGHT"] != undefined) {
				ih = Number(data.model["INSERT.HEIGHT"].value);
			}

			if (data.model["KICK.PLATE"] != undefined) {
				k = Number(data.model["KICK.PLATE"].value);
				if (k == undefined) {
					k = 7;
				}
			}
			f = this.client.convert(f);
			k = this.client.convert(k);
			ih = this.client.convert(ih);

			var iw = this.slab.w - (2 * f);
//			var ih = (this.slab.h - k) - (2 * f);
			var ix = this.slab.x;
			var iy = this.slab.y;
			ix = ix + f;
			iy = iy + f;

			var color = "WH";
			if (data.model["DOOR.COLOR"] != undefined) {
				color = data.model['DOOR.COLOR'].value;
			}
			this.insertopening = {
				container: undefined,
				svg: undefined
			};
			this.insertopening.container = this.slab.container;
			this.insertopening.w = iw;
			this.insertopening.h = ih;
			this.insertopening.x = ix;
			this.insertopening.y = iy;
			this.insertopening.svg = this.insertopening.container.rect(this.insertopening.w, this.insertopening.h);
			this.insertopening.svg.attr({
				fill: ssBase.color[color].htmlcolor,
				"stroke": "#000",
				"stroke-width": 1
			});
			this.insertopening.svg.move(this.insertopening.x, this.insertopening.y);

			this.renderInserts();

			this.hardware = new ssDoorHardware(this, this.x, this.y).render();

			if (data.model["HINGE.SWING"] != undefined) {
				hingeswing = data.model["HINGE.SWING"].value;
			};

			switch (hingeswing) {
				case "LHHI":
					this.hardware.x = this.slab.x + this.slab.w - this.hardware.r - this.client.convert(1);
					break;
				case "LHHO":
					this.hardware.x = this.slab.x + this.slab.w - this.hardware.r - this.client.convert(1);
					break;
				case "RHHI":
					this.hardware.x = this.slab.x + this.client.convert(1);
					break;
				case "RHHO":
					this.hardware.x = this.slab.x + this.client.convert(1);
					break;
			}
			this.hardware.y = this.slab.y + this.client.convert(40);
			this.hardware.svg.move(this.hardware.x, this.hardware.y);
			this.hardware.svg.front();
			this.isReady = true;

			// use to put a bounding box when its selected  --- for hliting
			this.x1 = this.x;
			this.y1 = this.y;
			this.x2 = this.x + this.slab.w;
			this.y2 = this.y + this.slab.h;
			this.instanceId = data.model.InstanceId;
			this.client.hliteObject(this);

			return this;

		};
		this.renderInserts = function() {
			if (this.getData().inodes.length <= 0) {
				return;
			}

			for (var i = 0; i < this.getData().inodes.length; i++) {
				var anode = this.getData().inodes[i];
				if (anode.Code === 'SunShade') {
					continue;
				}
				
				this.getData().inodes[i].model.hasScreenOnly = data.model.hasScreenOnly;
				this.getData().inodes[i].isFrench = data.isFrench;
				this.getData().inodes[i].whichside = data.whichside;
				this.getData().inodes[i].isOffsetSide = data.isOffsetSide;
				this.doorinsert = this.getClient().draw(this.getData().inodes[i], this.insertopening.x, this.insertopening.y);
			}
		};
	};

});