/* global SVG:true */
sap.ui.define([
], function() {
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
			"HCB":{htmlcolor: "#F0F8FF"},
			"SCW":{htmlcolor: "#ffffff"},

			"SWW":{htmlcolor: "#ffffff"},
			"SWL":{htmlcolor: "#ffffff"},
			"SCH":{htmlcolor: "#e7e4d9"},
			"SAL":{htmlcolor: "#d0ccc1"},
			"SPS":{htmlcolor: "#bdb7aa"},
			"STO":{htmlcolor: "#18150d"},
			"SEB":{htmlcolor: "#111c17"},
			"SGS":{htmlcolor: "#a6a49c"},
			"SWS":{htmlcolor: "#cc9999"},
			"SWP":{htmlcolor: "#FF8C00"},
			"SAT":{htmlcolor: "#D2B48C"},
			"SSA":{htmlcolor: "#394243"},
			"SSS":{htmlcolor: "#394243"},
			"SMT":{htmlcolor: "#DEB887"},
			"SBC":{htmlcolor: "#ffffff"},
			"SWG":{htmlcolor: "#ffffff"},
			"SMM":{htmlcolor: "#2e2e2f"},
			"SBP":{htmlcolor: "#000000"},
			"SBB":{htmlcolor: "#000000"},
			"DSSA": {htmlcolor: "#FFA500"},
			"DSGR": {htmlcolor: "#C0C0C0"},
			"DSCE": {htmlcolor: "#4B322C"},
			"DSGC": {htmlcolor: "#B5ABA9"},
			"DSWH": {htmlcolor: "#FFFFFF"},
			"DSBL": {htmlcolor: "#000000"},
			"DSBZ": {htmlcolor: "#8B4513"}
		},

		convert: function(anum) {
			anum = anum * 8;
			return anum;
		},
		revert: function(anum) {
			if(anum <= 0) return 0;
			return anum / 8;
		},
		setScale: function(scale) {
			this.scale = scale;
			this.parent.transform("Scale").this.getScale();
		},
		getScale: function() {
			return this.scale;
		}

	};

});