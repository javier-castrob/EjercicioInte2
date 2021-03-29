sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "EjercicioInte2/EjercicioInte2/util/Services",
    "sap/ui/model/json/JSONModel",
    "EjercicioInte2/EjercicioInte2/util/Constants",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "EjercicioInte2/EjercicioInte2/util/Formatter",
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Services, JSONModel, Constants, Filter, FilterOperator, Formatter) {
        "use strict";

        return Controller.extend("EjercicioInte2.EjercicioInte2.controller.Main", {
            Formatter: Formatter,
            onInit: function () {
                let oData = {
                    cantidad: 0,
                    producSelect: null,
                    path: null
                }
                let oModel = new JSONModel(oData);
                this.getOwnerComponent().setModel(oModel, Constants.model.toolsModel);
                this.getOwnerComponent().getRouter().getRoute(Constants.routes.main).attachPatternMatched(this._onRouteMatched, this);
                let that = this;
                this.getProductos().then(function () {
                    var oProductoSeleccionado = that.getView().getModel(Constants.model.Productos).getProperty(Constants.properties.productos.inicial);
                    that.getView().getModel(Constants.model.toolsModel).setProperty(Constants.properties.TOOLS_MODEL.producSelect, oProductoSeleccionado);
                    that.getView().getModel(Constants.model.toolsModel).setProperty(Constants.properties.TOOLS_MODEL.path, Constants.properties.productos.inicial);
                    that.getCategoria();
                    that.getProveedor();
                });
            },
            _onRouteMatched: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo(Constants.routes.detail);
            },
            getProductos: async function () {
                const oComponent = this.getOwnerComponent();
                try {
                    const oProductos = await Services.getProductos();
                    const oProductosModel = new JSONModel(oProductos[0]);
                    oComponent.setModel(oProductosModel, Constants.model.Productos);
                    let oLista = this.byId(Constants.ids.Main.lista);
                    oComponent.getModel(Constants.model.toolsModel).setProperty(Constants.properties.TOOLS_MODEL.cantidad, oLista.getItems().length);
                } catch (oError) {
                    console.log(oError);
                }
            },
            onSearch: function (oEvent) {
                let aFilters = [];
                let sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    let filter = new Filter(Constants.filter.productName, FilterOperator.Contains, sQuery);
                    aFilters.push(filter);
                    aFilters = new Filter(aFilters);
                }
                // update list binding
                let oLista = this.byId(Constants.ids.Main.lista);
                let oBinding = oLista.getBinding("items");
                oBinding.filter(aFilters, "Application");
                this.getView().getModel(Constants.model.toolsModel).setProperty(Constants.properties.TOOLS_MODEL.cantidad, oLista.getItems().length);
            },
            onSelectionChange: function (oEvent) {
                let oBindingContext = oEvent.getSource().getSelectedItem().getBindingContext(Constants.model.Productos);
                let productosModel = this.getView().getModel(Constants.model.Productos);
                let oProductoSeleccionado = productosModel.getProperty(oBindingContext.getPath());
                this.getView().getModel(Constants.model.toolsModel).setProperty(Constants.properties.TOOLS_MODEL.path, oBindingContext.getPath());
                this.getView().getModel(Constants.model.toolsModel).setProperty(Constants.properties.TOOLS_MODEL.producSelect, oProductoSeleccionado);
                this.getCategoria();
                this.getProveedor();
            },
            getCategoria: async function () {
                const oComponent = this.getOwnerComponent();
                try {                 
                    const oModel = oComponent.getModel(Constants.model.toolsModel);
                    let nId = oModel.getProperty(Constants.properties.TOOLS_MODEL.productId);
                    const oCategoria = await Services.getCategoria(nId);
                    const oCategoriaModel = new JSONModel(oCategoria[0]);
                    oComponent.setModel(oCategoriaModel, Constants.model.Categoria);
                } catch (oError) {
                    console.log(oError);
                }
            },
            getProveedor: async function () {
                const oComponent = this.getOwnerComponent();
                try {                 
                    const oModel = oComponent.getModel(Constants.model.toolsModel);
                    let nId = oModel.getProperty(Constants.properties.TOOLS_MODEL.productId);
                    const oProveedor = await Services.getProveedor(nId);
                    const oProveedorModel = new JSONModel(oProveedor[0]);
                    oComponent.setModel(oProveedorModel, Constants.model.Proveedor);
                } catch (oError) {
                    console.log(oError);
                }
            },
        });
    });