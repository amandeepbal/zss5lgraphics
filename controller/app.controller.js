/* global ssClient:true */
/* global SVG:true */
sap.ui.define([
		"zss5lcabase/controller/basecontroller",
		"sap/ui/model/json/JSONModel",
         "zss5lgraphics/libs/ssgraph/ssClient"
  
	], function (BaseController, JSONModel) {
	//	"use strict";

		return BaseController.extend("zss5lgraphics.controller.app", {

			onInit : function () {
				var oViewModel,
					fnSetAppNotBusy,
					iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
				oViewModel = new JSONModel({
					busy : true,
					delay : 0
				});
				this.setModel(oViewModel, "appView");
				fnSetAppNotBusy = function() {
					oViewModel.setProperty("/busy", false);
					oViewModel.setProperty("/delay", iOriginalBusyDelay);
				};
            fnSetAppNotBusy();
			},
	onAfterRendering : function () {
           var oHtml = this.getView().byId("htmlMain");
		   var container = oHtml;
		   container = document.getElementById('__xmlview0--htmlMain');
//			var graph = new mxGraph(container);
//			graph.setEnabled(false);
//			var parent = graph.getDefaultParent();		
//			this.drawMe(container,graph);
		},	
      drawMe : function(container,graph){
//       	      ssSashShape(container,graph,400,200,200,100);
              var oOptions = {}; 
              var oSashes = {
              	  "screenType": ssClient.screenType.ns,      
              	  "vinylTint":  ssClient.vinylTint.sg,
              	  "frameColor":  ssClient.frameColor.wh
              }; 
              var oFrame = {
              	  "frameColor": ssClient.frameColor.iv
              }; 
              oOptions.sashes = oSashes;
              oOptions.frame = oFrame;
  //     	      ssV4TVent3(container,graph,300,100,300,300,oOptions);
       }		
		});

	}
);