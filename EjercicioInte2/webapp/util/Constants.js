sap.ui.define([
], function () {
    "use strict";

    return {
        model: {
            I18N: "i18n",
            Productos: "Productos",
            toolsModel: "toolsModel",
            toolsModelDetail: "toolsModelDetail",
            Categoria: "Categoria",
            Proveedor: "Proveedor"
        },
        filter: {
                productName:"ProductName",
                unitPrice: "UnitPrice",
                productID: "ProductID",
                textNombre: "Nombre",
                textPrecio: "Precio",
                textId: "ID Producto"
            },
        properties: {
            TOOLS_MODEL: {
                path: "/path",
                producSelect: "/producSelect",
                cantidad: "/cantidad",
                productId: "/producSelect/ProductID"
            },
            i18n: {
                confirmBorrar: "confirmBorrar",
                borrado: "Borrado",
                copiar: "copiar"
            },
            productos: {
                inicial: "/value/0",
                value: "/value"
            }
        },
        ids: {
            Main: {
                lista: "idListaProductos"
            },
            dialogEditar: {
                id: "idDialogEditar"
            }
        },
        northwind: {
            productos: {
                endPoint: "Northwind",
                method: "GET",
                entity: "/V3/Northwind/Northwind.svc/Products"
            },
            categoria: {
                endPoint: "Northwind",
                method: "GET",
                entity: "/V3/Northwind/Northwind.svc/Products",
                entityEnd: "/Category"
            },
            proveedor: {
                endPoint: "Northwind",
                method: "GET",
                entity: "/V3/Northwind/Northwind.svc/Products",
                entityEnd: "/Supplier"
            }
        },
        routes: {
            main: "RouteMain",
            detail: "RouteDetail",
            FRAGMENTS: {
                dialogEditar: "EjercicioInte2.EjercicioInte2.fragments.dialogEditar",
                sort: "EjercicioInte2.EjercicioInte2.fragments.sort",
                filter: "EjercicioInte2.EjercicioInte2.fragments.filter"
            }
        }
    };
}, true);