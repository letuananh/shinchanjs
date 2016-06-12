/**
 * Copyright 2012, Le Tuan Anh (tuananh.ke@gmail.com)
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
 
/* Visualisation client code */

function DMRSCanvas(holder_name, param_nodes, param_links, param_sentence_text){
	var nodes = param_nodes;
	var links = param_links;
	var top_x;
	var sentence_text = param_sentence_text;
	
	var pp_w = 320; // Default canvas width
	var pp_h = 220; // Default canvas height
	var node_space = 20; // space between nodes
	var link_space = 20; // space between links
	var link_slot_space = 15; // space between links' head & tail
	
	// Arrow style config
	var link_head_tee_width = 12;
	var link_head_tee_height = 3;
	var link_head_box_width = 12;
	var link_head_box_height = 12;
	var link_head_dot_radius = 6;
	var arrow_delta_x = 3;
	var arrow_delta_y = 7;
	var dmrs_to_node_space = 30; // Space between DMRS node and sentence text
	var page_header = 30;
	var page_footer = 30; // Space between sentence text and canvas bottom

	// Calculate canvas position
	var top_x = node_space / 2;
	var top_y = page_header + (links.length + 1) * link_space;

	// Calculate sentence text position
	var sentence_x = 15;
	var sentence_y = top_y + dmrs_to_node_space;

	// Create canvas	
	var paper = Raphael(holder_name, 320, 200);
	// Draw canvas border
	var paper_border;
	paper_border = draw_border(paper);

	this.draw_nodes = func_draw_nodes;
	this.draw_links = func_draw_links;
	this.draw_sentence_text = func_draw_sentence_text;
	this.draw_DMRS = func_draw_DMRS;
	this.resize_canvas = func_resize_canvas;
	
	function func_draw_DMRS(){
		this.draw_nodes();
		this.draw_links();
		this.draw_sentence_text();
		this.resize_canvas();
	}
	
	function func_draw_nodes(){
		// Draw nodes
		var paper_width = 0;
		var max_y = 0;
		$.each(nodes, function() {
			min_width = (this.link_count + 1) * link_slot_space;
			a_node = draw_box(paper, top_x, top_y, this.text, 10, 10, min_width);
			top_x = a_node.x + a_node.width + (node_space / 2);
			//Fix box width
	
			a_node.box.node_info = this;
			this.x = a_node.x;
			this.y = a_node.y;
			a_node.box.click(node_click);
			a_node.box.hover(hover_in, hover_out);
			if (max_y < a_node.height) {
				max_y = a_node.height;
			}
		});
		sentence_y += max_y;				
	}

	// On node hover in
	function hover_in() {
		console.writeline("Hover in");
		$.each(text_pieces, function() {
			//try{ this.remove(); } catch(err){}
		});
		//text_pieces = draw_text(paper, sentence_text, sentence_x, sentence_y, this.node_info.from, this.node_info.to);
	}

	// On node hover out
	function hover_out() {
		console.writeline("Hover out");
		$.each(text_pieces, function() {
			//try{ this.remove(); } catch(err){}
		});
		//text_pieces = draw_text(paper, sentence_text, 15, 100, 0, sentence_text.length);
	}
	
	// On node click
	function node_click() {
		console.writeline("Node click");
	};	
	
	/**
	 * Draw all links
	 **/ 
	function func_draw_links(){
		var allocator = ChannelAllocator();
		
		node_slots = []
		for ( i = 0; i < nodes.length; i++) {
			nodes[i].slot = 1;
		}
		for ( i = 0; i < links.length; i++) {
			from_node = links[i].from;
			to_node = links[i].to;
			rargname = links[i].rargname;
			post = links[i].post;
	
			// Draw link (line)
			from_x = from_node.x + link_slot_space * from_node.slot;
			to_x = to_node.x + link_slot_space * to_node.slot;
			channel = allocator.allocate(from_x, to_x);
			from_y = top_y;
			to_y = top_y - link_space * (channel + 1);
			
			l = paper.path(
				  "M" + from_x + "," + from_y 
				+ "L" + from_x + "," + to_y 
				+ "L" + to_x + "," + to_y 
				+ "L" + to_x + "," + from_y
			);
			
			// Set link style based on rargname
			if (rargname == 'RSTR') {
				l.attr('stroke-dasharray', '- ');
			} else if (rargname == 'L-HNDL' || rargname == 'R-HNDL') {
				l.attr('stroke-dasharray', '.');
			} else if (rargname == '') {
				c = paper.circle(from_x, to_y, 3);
				c.attr('fill', 'black');
				c = paper.circle(to_x, to_y, 3);
				c.attr('fill', 'black');
			} else {
				//l.attr('stroke' : 'solid');
			}
			l.attr({
				'stroke' : 'black'
			});
			//l.attr({'stroke-width' : '1px'});
	
			/* Draw link head
			//- H: tee,
			//- EQ: none,
			//- NEQ: dot,
			//- HEQ: box. */
			if (post == "H") {
				draw_tee_tail(from_x, from_y);
			} else if (post == 'NEQ') {
				draw_circle_tail(from_x, from_y);
			} else if (post == 'HEQ') {
				draw_box_tail(from_x, from_y);
			} 
			if (['1', '2', '3', '4', 'A'].indexOf(rargname)){
				draw_arrow(to_x, from_y)	
			}
			
			// Draw label
			if(rargname.length > 0){
				if (to_x < from_x) {
					label_x = to_x + Math.abs(to_x - from_x) / 2;
				} else {
					label_x = from_x + Math.abs(to_x - from_x) / 2;
				}
				label_y = to_y;
				link_label = draw_label(paper, label_x, label_y, rargname);
				
				console.writeline('Label: ' + rargname + ' x=' + label_x + ' y=' + label_y)	
				console.writeline("draw link " + "from " + from_node.x + "," + from_node.y + " (Slot:" + from_node.slot + ")" + "-> " + to_node.x + "," + to_node.y + " (Slot:" + to_node.slot + ")" + " (RARGNAME=" + rargname + ")" + " (POST=" + post + ")");	
			}
			
			from_node.slot++;
			to_node.slot++;
		} // End for links
		
		top_y = page_header + (allocator.count() + 1) * link_space;
	}

	// Draw link tail: tee style (H)
	function draw_tee_tail(x, y){
		//- H: tee
		b_x = x - link_head_tee_width / 2;
		b_y = y - link_head_tee_height - 1;
		r = paper.rect(b_x, b_y, link_head_tee_width, link_head_tee_height);
		r.attr('fill', 'white');		
	}
	
	// Draw link tail: dot style (NEQ)
	function draw_circle_tail(x, y){
		c = paper.circle(x, y - link_head_dot_radius, link_head_dot_radius);
		c.attr('fill', 'red');
	}
	
	// Draw link tail: box style (HEQ)
	function draw_box_tail(x, y){
		b_x = x - link_head_box_width / 2;
		b_y = y - link_head_box_height;
		c = paper.rect(b_x, b_y, link_head_box_width, link_head_box_height);
		c.attr('fill', 'black');
	}
	
	// Draw link head: arrow
	function draw_arrow(x, y){
		// Draw arrow
		l = paper.path(
			'M' + (x - arrow_delta_x) + "," + (y - arrow_delta_y)
			+ 'L' + x + "," + y
			+ 'L' + (x + arrow_delta_x) + "," + (y - arrow_delta_y)
		);	
	}
	
	function func_draw_sentence_text(){
		// Draw sentence text
		var text_pieces = draw_text(paper, sentence_text, sentence_x, sentence_y);
	}
	
	function func_resize_canvas(){
		// Resize paper
		paper.setSize(top_x, sentence_y + page_footer);
		draw_border(paper, paper_border);	
	}

	return this;
}

// Channel allocator
function ChannelAllocator(){
	this.allocated_slots={}
	this.allocated_count = 0;

	this.count = function(){
		return this.allocated_count;
	}

	this.reserve = function(i, from, to){
		//console.writeline("reserving: " + i + " - " + from + " - " + to);
		if(this.allocated_slots[i] == undefined){
			this.allocated_count++;
			this.allocated_slots[i] = [];
		}
		this.allocated_slots[i][this.allocated_slots[i].length]=[from, to];
		//console.writeline(this.allocated_slots[i].length);
	}

	this.allocate = function(from,to){
		if(from > to){
			temp = from;
			from = to;
			to = temp;
		}
		var i = 1;
		do{
			if(i in this.allocated_slots){
				is_allocated=false;
				
				// Check all current slots
				for(si=0;si < this.allocated_slots[i].length;si++){
					var slot=this.allocated_slots[i][si];
					var slot_from=slot[0];
					var slot_to=slot[1];
					if(
					   (slot_from <= from && from <= slot_to)
					|| (slot_from <= to && to <= slot_to)
					|| (from <= slot_from && slot_from <= to)
					|| (from <= slot_to && slot_to <= to)
					) {
						// Allocated
						is_allocated=true;
						i++;
						break;
					} 
				}
				
				// If not allocated then use this
				if(is_allocated == false){
					this.reserve(i, from, to);
					return i;
				}
			}
			else{
				this.reserve(i, from, to);
				return i;  				
			}		
		}while(is_allocated);
	}
	
	return this;  	
}