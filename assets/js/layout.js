'use strict';

const $ = require('jquery');
require('bootstrap-sass');
//require('bootstrap-sass/assets/stylesheets/_bootstrap.scss');
//require('font-awesome/css/font-awesome.css');
require('../css/main.scss');
// make sure the polyfill library is loaded in this main entry
require('babel-polyfill');

$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});
