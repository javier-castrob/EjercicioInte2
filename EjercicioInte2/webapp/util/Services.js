sap.ui.define([
    "EjercicioInte2/EjercicioInte2/util/Constants"
], function (Constants) {
    "use strict";

    return {
        /**
        * Converts a jQuery AJAX promise into a mainline promise
        * @param {object} oPromise jQuery Deferred object
        */  
        toPromise: function (oPromise) {
            return new Promise(function (resolve, reject) {
                oPromise.then(() => {
                    const sHeaders = oPromise.done().getAllResponseHeaders();
                    const aHeaders = sHeaders.trim().split(/[\r\n]+/);
                    const oHeaderMap = {};
                    aHeaders.forEach(function (sLine) {
                        const aParts = sLine.split(': ');
                        const sHeader = aParts.shift();
                        const sValue = aParts.join(': ');
                        oHeaderMap[sHeader] = sValue;
                    });
                    resolve([oPromise.done().responseJSON, oHeaderMap]);
                }, reject);
            });
        },

        /**
        * Wrapper function, creates an jQuery deferred object for AJAX
        * @param {object} oOptions Request options
        */
        promisizer: function (oOptions) {
            return this.toPromise(jQuery.ajax(oOptions));
        },
        /**
        * Requests a JSON file in localService folder
        * @param {string} sJsonName JSON filename
        */
        getLocalJSON: function (sJsonName) {
            return this.promisizer(jQuery.sap.getModulePath("EjercicioInte2.EjercicioInte2") + "/localService/" + sJsonName);
        },

        /**
        * Gets an object with jQuery.ajax compatible properties
        * @param {Object} oOptions Mapped hash of URL info properties
        * @param {string} oOptions.endPoint Connection endpoint (SCP)
        * @param {string} oOptions.method Request method, e.g GET
        * @param {Boolean} oOptions.fetch Request flag for fetching a CSRF token
        * @param {string} oOptions.params URL Like string parameters
        * @param {string} oOptions.data Request data
        */
        getRequest: function (oOptions = {}) {
            const oHeaders = {
                'Content-Type': "application/json;charset=UTF-8;IEEE754Compatible=true",
                'accept': "application/json",
                'Access-Control-Allow-Origin': "*"
            };
            if (oOptions.username && oOptions.password) {
                oHeaders.Authorization = "Basic " + btoa(oOptions.username + ":" + oOptions.password);
            }
            if (oOptions.fetch) {
                oHeaders['X-CSRF-TOKEN'] = 'Fetch';
            }
            if (oOptions.method === 'POST') {
                oHeaders['X-CSRF-TOKEN'] = localStorage.getItem('csrf');
            }
            const sParams = oOptions.params ? "?" + oOptions.params : "";
            return {
                headers: oHeaders,
                url: this.getBaseURL(oOptions.endPoint) + this.getEndpoint(oOptions) + "/" + (oOptions.entity || '') + sParams,
                method: oOptions.method,
                data: oOptions.data || ''
            };
        },
        getEndpoint: function (oOptions) {
            return oOptions.endPoint;
        },
        getBaseURL: function (sEndPoint) {
            return jQuery.sap.getModulePath("EjercicioInte2.EjercicioInte2") + "/";
        },
        getProductos: async function () {
            const oRequest = this.getRequest({
                endPoint: Constants.northwind.productos.endPoint,
                method: Constants.northwind.productos.method,
                entity: Constants.northwind.productos.entity
            });
            return this.promisizer(oRequest);
        },
        getProducto: async function () {
            const oRequest = this.getRequest({
                endPoint: Constants.northwind.productos.endPoint,
                method: Constants.northwind.productos.method,
                entity: Constants.northwind.productos.entity
            });
            return this.promisizer(oRequest);
        },
        getCategoria: async function (id) {
            const oRequest = this.getRequest({
                endPoint: Constants.northwind.categoria.endPoint,
                method: Constants.northwind.categoria.method,
                entity: Constants.northwind.categoria.entity + `(${id})` +  Constants.northwind.categoria.entityEnd
            });
            return this.promisizer(oRequest);
        },
        getProveedor: async function (id) {
            const oRequest = this.getRequest({
                endPoint: Constants.northwind.proveedor.endPoint,
                method: Constants.northwind.proveedor.method,
                entity: Constants.northwind.proveedor.entity + `(${id})` +  Constants.northwind.proveedor.entityEnd
            });
            return this.promisizer(oRequest);
        },
    }
});