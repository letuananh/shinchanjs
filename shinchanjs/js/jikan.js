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
 

function JiTimer(delay, timer_tick_callback, on_stop_callback, on_start_callback){
	this.timer_tick_callback = timer_tick_callback;
	this.on_stop_callback = on_stop_callback;
	this.on_start_callback = on_start_callback;
	this.state = false;
	this.delay = delay;
}

JiTimer.prototype = {
	start : function(){
		if(typeof this.on_start_callback === "function"){
			this.on_start_callback();
		}		
		this.state = true;
		this.register_timer(this);
	},
	
	on_timer_tick : function(timer) {
		if(typeof timer.timer_tick_callback === "function"){
			timer.timer_tick_callback();
		}
		if(this.state){
			timer.register_timer(timer);
		}
	},
	
	register_timer : function(timer){
		timer.timer1 = setTimeout(function() { timer.on_timer_tick(timer) }, timer.delay);
	},
	
	stop : function() {
		if(typeof this.on_stop_callback === "function"){
			this.on_stop_callback();
		}
		this.state = false;
		clearTimeout(this.timer1);
	},
	
	str : function(){
		return "Timer object";
	}
}