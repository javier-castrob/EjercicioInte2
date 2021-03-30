sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "EjercicioInte2/EjercicioInte2/util/Services",
    "sap/ui/model/json/JSONModel",
    "EjercicioInte2/EjercicioInte2/util/Constants",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "EjercicioInte2/EjercicioInte2/util/Formatter",
    "sap/ui/Device",
    "sap/ui/model/Sorter",
    "sap/m/library",
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Services, JSONModel, Constants, Filter, FilterOperator, Formatter, Device, Sorter, mLibrary) {
        "use strict";

        return Controller.extend("EjercicioInte2.EjercicioInte2.controller.Main", {
            Formatter: Formatter,
            onInit: function () {
                this._ViewSettingsDialog = [];
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
            onSort: function () {
                this.createViewSettingsDialog(Constants.routes.FRAGMENTS.sort).open();
            },

            createViewSettingsDialog: function (sDialogFragmentName) {
                var oDialog;
                oDialog = this._ViewSettingsDialog[sDialogFragmentName];

                if (!oDialog) {
                    oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
                    this.getView().addDependent(oDialog);
                    this._ViewSettingsDialog[sDialogFragmentName] = oDialog;
                }

                oDialog.setFilterSearchOperator(mLibrary.StringFilterOperator.Contains);
                if (Device.system.desktop) {
                    oDialog.addStyleClass("sapUiSizeCompact");
                }
                if (sDialogFragmentName === Constants.routes.FRAGMENTS.filter) {
                    var oModelJSON = this.getOwnerComponent().getModel(Constants.model.Productos);
                    var modelOriginal = oModelJSON.getProperty(Constants.properties.productos.value);

                    var jsonProductName = JSON.parse(JSON.stringify(modelOriginal, [Constants.filter.productName]));
                    var jsonPrice = JSON.parse(JSON.stringify(modelOriginal, [Constants.filter.unitPrice]));
                    var jsonProductID = JSON.parse(JSON.stringify(modelOriginal, [Constants.filter.productID]));

                    oDialog.setModel(oModelJSON);

                    jsonProductName = jsonProductName.filter(function (currentObject) {

                        if (currentObject.ProductName in jsonProductName) {
                            return false;
                        } else {
                            jsonProductName[currentObject.ProductName] = true;
                            return true;
                        }
                    }),
                        jsonPrice = jsonPrice.filter(function (currentObject) {

                            if (currentObject.UnitPrice in jsonPrice) {
                                return false;
                            } else {
                                jsonPrice[currentObject.UnitPrice] = true;
                                return true;
                            }
                        }),
                        jsonProductID = jsonProductID.filter(function (currentObject) {

                            if (currentObject.ProductID?.jsonProductID) {
                                return false;
                            } else {

                                jsonProductID[currentObject.ProductID - 1] = true;
                                return true;
                            }
                        })
                    var ProductNameFilter = [];
                    for (var i = 0; i < jsonProductName.length; i++) {
                        ProductNameFilter.push(
                            new sap.m.ViewSettingsItem({
                                text: jsonProductName[i].ProductName,
                                key: Constants.filter.productName
                            })
                        )
                    }
                    var ProductPriceFilter = [];
                    for (var i = 0; i < jsonPrice.length; i++) {
                        ProductPriceFilter.push(
                            new sap.m.ViewSettingsItem({
                                text: jsonPrice[i].UnitPrice,
                                key: Constants.filter.unitPrice
                            })
                        )
                    }
                    var ProductIDFilter = [];
                    for (var i = 0; i < jsonProductID.length; i++) {
                        ProductIDFilter.push(
                            new sap.m.ViewSettingsItem({
                                text: jsonProductID[i].ProductID,
                                key: Constants.filter.productID
                            })
                        )
                    }
                }
                if (oDialog.getFilterItems().length == 1) {
                    oDialog.destroyFilterItems();
                    oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                        key: Constants.filter.productName,
                        text: Constants.filter.textNombre,
                        items: ProductNameFilter
                    }));
                    oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                        key: Constants.filter.unitPrice,
                        text: Constants.filter.textPrecio,
                        items: ProductPriceFilter
                    }));
                    oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                        key: Constants.filter.productID,
                        text: Constants.filter.textId,
                        items: ProductIDFilter
                    }));
                }

                return oDialog;
            },
            onSortDialogConfirm: function (oEvent) {
                var oTable = this.byId(Constants.ids.Main.lista),
                    mParams = oEvent.getParameters(),
                    oBinding = oTable.getBinding("items"),
                    sPath,
                    bDescending,
                    aSorters = [];
                sPath = mParams.sortItem.getKey();
                bDescending = mParams.sortDescending;
                aSorters.push(new Sorter(sPath, bDescending));
                oBinding.sort(aSorters);
            },
            // FUNCIÓN ON FILTER
            onFilter: function (oEvent) {
                this.createViewSettingsDialog(Constants.routes.FRAGMENTS.filter).open();
            },
            onFilterDialogConfirm: function (oEvent) {
                var oList = this.byId(Constants.ids.Main.lista),
                    mParams = oEvent.getParameters(),
                    oBinding = oList.getBinding("items"),
                    aFilters = [];
                mParams.filterItems.forEach(function (oItem) {
                    var sPath = oItem.getKey(),
                        sOperator = FilterOperator.EQ,
                        sValue1 = oItem.getText();
                    var oFilter = new Filter(sPath, sOperator, sValue1);
                    aFilters.push(oFilter);
                });
                oBinding.filter(aFilters);
            }
        });
    });