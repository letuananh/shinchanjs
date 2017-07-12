// delphin-viz visualisation
function render_delviz(parse, parseid, header_maker, container){
    if (parseid == undefined) { parseid = 1; }
    if (container == undefined) { container = 'dvizes'; }
    
    if (typeof header_maker != 'function') { header_maker = add_parse_header; }
    
    // Add parse header
    header_maker(parse, parseid, container, 'dviz_parse');
    
    // Visualize dmrs
    var dviz_dmrs = $('<div></div>');
    dviz_dmrs.attr('id', 'dviz_dmrs' + parseid);
    $('#' + container).append(dviz_dmrs);
    var $viz = $(Templates.viz({vizType:'dmrs'})).appendTo(dviz_dmrs);
    dmrs = DMRS(dviz_dmrs[0], JSON.parse(JSON.stringify(parse.dmrs)));
    
    // Visualize mrs
    var dviz_mrs = $('<div></div>');
    dviz_mrs.attr('id', 'dviz_mrs' + parseid);
    $('#' + container).append(dviz_mrs);
    var $viz = $(Templates.viz({vizType:'mrs'})).appendTo(dviz_mrs);
    mrs = MRS(dviz_mrs[0], JSON.parse(JSON.stringify(parse.mrs)), $('#input_sentence'), $('#sentence_text'));
}
