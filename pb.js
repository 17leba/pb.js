(function(window,undefined){
	pb = function(selector){
		return new pb.fn.init(selector)
	}
	pb.fn = pb.prototype = {
		init:function(selector){
			if(!selector){
				return;
			}
			ele = document.getElementById(selector);
			return ele;
		},
		ready:function(fn){
			if(document.addEventListener){
				document.addEventListener("DOMContentLoaded",fn)
			}
		},
		trigger:function(type){
			var ele = ele || document,
				result;
			if(document.createEvent){
				event = document.createEvent("Events");
				event.initEvent(type,false,false);
				this.dispatchEvent(event);
			}else{
				this.fireEvent("on" + type);
			}
			return this;
		}
	}
	pb.fn.init.prototype = pb.fn

	window.y = pb;
})(window)