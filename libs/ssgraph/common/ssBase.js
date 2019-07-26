/* global SVG:true */
sap.ui.define([], function () {
	return {
		color: {
			"WH": {
				color: "fillColor=white",
				htmlcolor: "#FFFFFF"
			},
			"WHG": {
				color: "fillColor=white",
				htmlcolor: "#FEFEFA"
			},
			"DR": {
				color: "fillColor=yellow",
				htmlcolor: "#e8c264"
			},
			"BZ": {
				color: "fillColor=darkgoldenrod",
				htmlcolor: "#8B4513"
			},
			"BL": {
				color: "fillColor=black",
				htmlcolor: "#000000"
			},
			"GR": {
				color: "fillColor=green",
				htmlcolor: "#006400"
			},
			"IV": {
				color: "fillColor=ivory",
				htmlcolor: "#FFFFF0"
			},
			"GY": {
				color: "fillColor=darkgrey",
				htmlcolor: "#bfbfbf"
			},
			"SG": {
				color: "fillColor=darkgrey",
				htmlcolor: "#C0C0C0"
			},
			"DG": {
				color: "fillColor=darkgrey",
				htmlcolor: "#808080"
			},
			"SC": {
				color: "fillColor=lightgrey",
				htmlcolor: "#D3D3D3"
			},
			"CL": {
				text: "Clear",
				color: "fillColor=Azure",
				htmlcolor: "#FFFFFF"
			},
			"AB": {
				color: "fillColor=white",
				htmlcolor: "#FFA500"
			},
			"SS": {
				color: "fillColor=yellow",
				htmlcolor: "#C0C0C0"
			},
			"BB": {
				color: "fillColor=darkgoldenrod",
				htmlcolor: "#FFD700"
			},
			"OB": {
				color: "fillColor=black",
				htmlcolor: "#FF8C00"
			},
			"HCB": {
				htmlcolor: "#F0F8FF"
			},
			"SCW": {
				htmlcolor: "#ffffff"
			},

			"SWW": {
				htmlcolor: "#ffffff"
			},
			"SWL": {
				htmlcolor: "#ffffff"
			},
			"SCH": {
				htmlcolor: "#e7e4d9"
			},
			"SAL": {
				htmlcolor: "#d0ccc1"
			},
			"SPS": {
				htmlcolor: "#bdb7aa"
			},
			"STO": {
				htmlcolor: "#18150d"
			},
			"SEB": {
				htmlcolor: "#111c17"
			},
			"SGS": {
				htmlcolor: "#a6a49c"
			},
			"SWS": {
				htmlcolor: "#ede6dc"
			},
			"SWP": {
				htmlcolor: "#fff9f1"
			},
			"SAT": {
				htmlcolor: "#494647"
			},
			"SSA": {
				htmlcolor: "#97867f"
			},
			"SSS": {
				htmlcolor: "#6b5e52"
			},
			"SMT": {
				htmlcolor: "#4b3d3c"
			},
			"SBC": {
				htmlcolor: "#632718"
			},
			"SWG": {
				htmlcolor: "#e9ebe7"
			},
			"SMM": {
				htmlcolor: "#3b3b40"
			},
			"SBP": {
				htmlcolor: "#000000"
			},
			"SBB": {
				htmlcolor: "#271c1a"
			},
			"DSSA": {
				htmlcolor: "#FFA500"
			},
			"DSGR": {
				htmlcolor: "#C0C0C0"
			},
			"DSCE": {
				htmlcolor: "#4B322C"
			},
			"DSGC": {
				htmlcolor: "#B5ABA9"
			},
			"DSWH": {
				htmlcolor: "#FFFFFF"
			},
			"DSBL": {
				htmlcolor: "#000000"
			},
			"DSBZ": {
				htmlcolor: "#8B4513"
			}
		},

		convert: function (anum) {
			anum = anum * 8;
			return anum;
		},
		revert: function (anum) {
			if (anum <= 0) return 0;
			return anum / 8;
		},
		setScale: function (scale) {
			this.scale = scale;
			this.parent.transform("Scale").this.getScale();
		},
		getScale: function () {
			return this.scale;
		},
		showLabel: function (container, sText, svh, x1, y1, x2, y2) {
			var label = {};
			label.container = container;
			if (svh === 'V') {
				label.svg1 = label.container.line(0, y1, 20, y1);
				label.svg2 = label.container.line(10, y1, 10, y2);
				label.svg3 = label.container.line(0, y2, 20, y2);

				label.svg1.attr({
					fill: "#000",
					"stroke": "#0000FF",
					"stroke-width": 1
				});
				label.svg2.attr({
					fill: "#000",
					"stroke": "#0000FF",
					"stroke-width": 1
				});
				label.svg3.attr({
					fill: "#000",
					"stroke": "#0000FF",
					"stroke-width": 1
				});
				var tpos = (y2 / 2) - 15;
				label.svg4 = label.container.rect(40, 20);
				label.svg4.attr({
					fill: '#FFFFFF',
					"stroke": "#0000FF",
					"stroke-width": 1
				});
				label.svg4.x(0);
				label.svg4.y(tpos);

				label.svg5 = this.dimensionsprojection.container.plain(sText);
				label.svg5.font({
					family: 'Helvetica',
					size: 10,
					anchor: 'middle',
					leading: '1.5em'
				});
				tpos = (y2 / 2) - 10;
				label.svg5.x(20);
				label.svg5.y(tpos);
				return label;
			}
		}

	};

});