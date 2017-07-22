/**
 * Copyright 2017, Le Tuan Anh (tuananh.ke@gmail.com)
 * This file is part of VisualKopasu
 * VisualKopasu is free software: you can redistribute it and/or modify 
 * it under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 * VisualKopasu is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License 
 * along with VisualKopasu. If not, see http://www.gnu.org/licenses/.
 **/

Jamdol = function(jamdol_root) {
    this._root = (jamdol_root == undefined) ? "http://127.0.0.1:5002/yamdol/" : jamdol_root;
}

Jamdol.prototype = {       
    /** Check server version **/
    version: function(callback) {
        var url = this._root + 'version';
        $.ajax({url: url, dataType: 'jsonp'})
            .done(callback)
            .fail(log_error);
    },  
    
    /** Search **/
    search: function(query, success) {
        var url = this._root + 'search/' + query;
	var self = this;
        $.ajax({
	    url: url,
	    dataType: 'jsonp',
	    success: function(json){
		success.call(self, json);
	    },
	    fail: log_error,
	    error: log_error
	});
    }    
}

/**
 * Log error msg 
 **/
function log_error(jqxhr) {
    if (console != undefined && console.writeline != undefined) {
        console.writeline( "Request Failed: " + jqxhr.statusText + " | code = " + jqxhr.status);
    }
}   
