/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */
/*global require*/
/*global module*/
/*global YUI*/
/*global google*/
/*global __dirname*/
"use strict";



YUI().add('ashlesha-common', function(Y) {

}, '0.0.1', {
    requires: ['base', 'cache', 'model-list', function() {
        if (typeof document !== 'undefined') {
            return 'client-app';
        } else {
            return 'server-app';
        }}(), 'ashlesha-api', 'common-models-store']
});