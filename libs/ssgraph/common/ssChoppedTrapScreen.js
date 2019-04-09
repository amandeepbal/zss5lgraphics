sap.ui.define([
	"zss5lcabase/common/ssMath",
	"zss5lcabase/common/coreFunctions",
	"zss5lgraphics/libs/ssgraph/common/ssBase"

], function (ssMath, core, ssBase) {
	return function (myParent, x, y) {
		this.data = myParent.getData();
		this.ssparent = myParent;
		this.client = myParent.client;
		this.x = x;
		this.y = y;
		this.screeno = undefined;
		this.isReady = false;

		if (this.x === undefined) {
			this.x = 0;
		}
		if (this.y === undefined) {
			this.y = 0;
		}

		this.setData = function (data) {
			this.data = data;
		};
		this.getData = function () {
			return this.data;
		};
		this.setParent = function (parent) {
			this.ssparent = parent;
		};
		this.getParent = function () {
			return this.ssparent;
		};
		this.getClient = function () {
			return this.client;
		};
		this.setX = function (x) {
			this.x = x;
		};
		this.getX = function () {
			return this.x;
		};
		this.setY = function (y) {
			this.y = y;
		};
		this.getY = function () {
			return this.y;
		};
		this.render = function () {
			var data = this.getData();
			var screentype = "NS";
			var m = 5;

			if (!this.getParent().isReady) return this;

			if (data.model["SCREEN.TYPE"] != undefined) {
				screentype = data.model['SCREEN.TYPE'].value;
			}
			if (screentype === 'NS') {
				return this;
			};

			this.screeno = {
				container: undefined,
				svg: undefined,
				mesh: []
			};
			this.screeno.container = this.getParent().paneo.container.nested();
			this.screeno.w = this.getParent().paneo.w;
			this.screeno.lh = this.getParent().paneo.lh;
			this.screeno.rh = this.getParent().paneo.rh;
			this.screeno.tl = this.getParent().paneo.tl;
			this.screeno.h = this.getParent().paneo.lh;
			this.screeno.x = this.x;
			this.screeno.y = this.y;
			this.screeno.x1 = this.x;
			this.screeno.y1 = this.y;
			this.screeno.x2 = this.x + this.screeno.w;
			this.screeno.y2 = this.y + this.screeno.lh;
			this.screeno.y3 = this.screeno.y2 - this.screeno.rh;
			var pattern = this.screeno.container.pattern(5, 5, function (add) {
				add.rect(500, 500).fill('none').stroke({
					width: 1,
					color: ssBase.color["SC"].htmlcolor
				});
			});

			if (this.screeno.lh > this.screeno.rh) {
				this.screeno.x3 = this.screeno.x1 + this.screeno.tl;
				this.screeno.svg = this.screeno.container.polygon([
					this.screeno.x3, this.screeno.y1,
					this.screeno.x1, this.screeno.y1,
					this.screeno.x1, this.screeno.y2,
					this.screeno.x2, this.screeno.y2,
					this.screeno.x2, this.screeno.y3
				]);
			} else {
				this.screeno.x3 = this.screeno.x2 - this.screeno.tl;
				this.screeno.svg = this.screeno.container.polygon([
					this.screeno.x1, this.screeno.y1,
					this.screeno.x1, this.screeno.y2,
					this.screeno.x2, this.screeno.y2,
					this.screeno.x2, this.screeno.y3,
					this.screeno.x3, this.screeno.y1,
				]);

			}

			this.screeno.svg.attr({
				fill: pattern
			});
			this.isReady = true;
			return this;
		};
	};

});