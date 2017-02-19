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

Yawol = function(container_id, root) {
    this._synsetbox_url = 'js/synsetbox.html';
    this._root = (root == undefined) ? 'http://127.0.0.1:5000/yawol/' : root;
    this._container = $("#" + container_id);
}

Yawol.prototype = {
    /* 
     * Display a synset to a synsetbox
     */
    render_synset: function(synset, synsetbox) {
        var txtSynsetID = synsetbox.find(".synsetid");
        var txtLemmas = synsetbox.find(".lemmas");
        var txtDefinition = synsetbox.find(".definition");
        var txtExamples = synsetbox.find(".examples");
        if (synset != undefined) {
            txtSynsetID.text(synset.synsetid);
            txtLemmas.text(synset.lemmas);
            txtDefinition.text(synset.definition);
            txtExamples.text(synset.examples);
        }
        // Debug
        synsetbox.show();
        console.writeline("SynsetID   : " + synsetbox.find(".synsetid").text());
        console.writeline("Lemmas     : " + synsetbox.find(".lemmas").text());
        console.writeline("Definitions: " + synsetbox.find(".definition").text());
        console.writeline("Examples   : " + synsetbox.find(".examples").text());
        console.writeline("Synset JSON: " + JSON.stringify(synset));
        console.writeline("--");
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
        this._container.append('<div class="newss"></div>');
        var newdiv = this._container.find('.newss:last-child');
        newdiv.load('js/synsetbox.html', {}, function(){
            var curbox = $(this).find('.synsetbox');
            curbox.find('.close').click(function(){ curbox.remove(); });
            _yawol.render_synset(synset, curbox);
        });                 
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
        console.writeline( "Request Failed: " + textStatus + ", " + error);
    }       
}
