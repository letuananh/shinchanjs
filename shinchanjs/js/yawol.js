/**
 * Copyright 2017, Le Tuan Anh (tuananh.ke@gmail.com)
 * This file is part of VisualKopasu.
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

Yawol = function(container_id, root, synsetbox_template) {
    this._template = _.template(synsetbox_template);
    this._root = (root == undefined) ? 'http://127.0.0.1:5000/yawol/' : root;
    this._container = $("#" + container_id);
}

Yawol.prototype = {
    /* 
     * Display a synset to a synsetbox
     */
    build_synsetbox: function(synset) {
        var sbox = $(this._template({synset: synset}));
        sbox.find('.close').click(function(){ sbox.remove(); });
        sbox.appendTo(this._container);
    },
    
    clear: function() {
        this._container.empty();
    },
    
    /** Create a new synsetbox and display synset **/
    display_synset: function(synset, clear_prev) {
        var _yawol = this;
        // Clear previous box
        if (clear_prev) {
            this._container.empty();
        }
        // Add a synsetbox
        console.writeline(JSON.stringify(synset));
        this.build_synsetbox(synset);
    },
    
    /** Load a synset using AJAX/JSONP **/
    _search_synset_ajax: function(url) {
        var _yawol = this;
        console.header("Fetching from: " + url);
        $.ajax({url: url, dataType: 'jsonp'})
            .done(function(json){
                _yawol.clear();
                $.each(json, function(idx, synset){
                    _yawol.display_synset(synset);
                });
            })
            .fail(_yawol.fail);
    },
    
    /*
     * Load a synset (same server)
     */
    load_synset: function(synsetid) {
        // Load and display synset
        var _yawol = this;
        var ssurl = "ajax/" + synsetid + ".json";
        console.header("Fetching from: " + ssurl);
        $.getJSON(ssurl)
            .done(function(json){
                _yawol.display_synset(json, true);
            })
            .fail(_yawol.fail);
    },
    
    /** Search synset (remote or local) **/
    search_synset: function(query) {
        var url = this._root + 'search/' + query;
        this._search_synset_ajax(url);
    },
    
    /** Log error msg **/
    fail: function(jqxhr, textStatus, error) {
        if (console != undefined && console.writeline != undefined) {
            console.writeline( "Request Failed: " + textStatus + ", " + error);
        }
    }       
}
