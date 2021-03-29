sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "EjercicioInte2/EjercicioInte2/util/Services",
        "sap/ui/model/json/JSONModel",
        "EjercicioInte2/EjercicioInte2/util/Constants",
        "EjercicioInte2/EjercicioInte2/util/Formatter",
        "sap/m/MessageBox",
        "sap/m/MessageToast"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, Services, JSONModel, Constants, Formatter, MessageBox, MessageToast) {
        "use strict";
		return Controller.extend("EjercicioInte2.EjercicioInte2.controller.Detail", {
            Formatter:Formatter,
			onInit: function () {
                
            },
            editar: function () {
                if (!this._oFragment) {
                    this._oFragment = sap.ui.xmlfragment(Constants.ids.dialogEditar.id, Constants.routes.FRAGMENTS.dialogEditar , this);
                    this.getView().addDependent(this._oFragment);
                }
                this._oFragment.open();
            },
            closeDialog: function () {
                let sPath = this.getOwnerComponent().getModel(Constants.model.toolsModel).getProperty(Constants.properties.TOOLS_MODEL.path);
                let oProductoEditado = this.getOwnerComponent().getModel(Constants.model.toolsModel).getProperty(Constants.properties.TOOLS_MODEL.producSelect);            
                this.getOwnerComponent().getModel(Constants.model.Productos).setProperty(sPath, oProductoEditado );
                this._oFragment.close();           
            },
            borrar: function(){
                let sText = this.getView().getModel(Constants.model.I18N).getResourceBundle().getText(Constants.properties.i18n.confirmBorrar);
                let sTextOK = this.getView().getModel(Constants.model.I18N).getResourceBundle().getText(Constants.properties.i18n.borrado);
                MessageBox.confirm(sText, {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {
                        if (sAction == MessageBox.Action.OK)
                            MessageToast.show(sTextOK);
                    }
                });
            },
            copiar: function () {
                let sText = this.getView().getModel(Constants.model.I18N).getResourceBundle().getText(Constants.properties.i18n.copiar);
                MessageToast.show(sText);
            }
		});
	});