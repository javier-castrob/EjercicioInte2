jQuery.sap.require("sap.ui.core.format.DateFormat");
sap.ui.define([
], function () {
    "use strict";

    return {
        formatStateText: function (nStock) {
            if (nStock >= 20) {
                return "En Stock";
            } else if (nStock < 20 && nStock > 0) {
                return "Poco Stock";
            } else if (nStock == 0) {
                return "Fuera de Stock"
            } else {
                return "Error de formato"
            }
        },
        formatState: function (nStock) {
            if (nStock >= 20) {
                return "Success";
            } else if (nStock < 20 && nStock > 0) {
                return "Warning";
            } else if (nStock == 0) {
                return "Error"
            } else {
                return "Error"
            }
        },
        formatEstado: function(bEstado) {
            if (!bEstado) {
                return "Habilitado";
            } else {
                return "Deshabilitado"
            }
        },
        formatRegion: function(sRegion) {
            if (sRegion == null) {
                return "-"
            } else {
                return sRegion;
            }
        },
        formatFax: function(sFax) {
            if (sFax == null) {
                return "-"
            } else {
                return sFax;
            }
        },
        formatWeb: function(sWeb) {
            if (sWeb == null) {
                return "-"
            } else {
                return sWeb;
            }
        }
    };
}, true);