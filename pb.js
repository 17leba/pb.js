(function(window,undefined){
	pb = function(selector){
		return new pb.fn.init(selector)
	}
	pb.fn = pb.prototype = {
		constructor:pb,
		selector:"",
		init:function(selector){
			if(!selector){
				return this;
			}
			ele = document.getElementById(selector);
			this.selector = ele;
			return this;
		},
		ready:function(fn){
			if(document.addEventListener){
				document.addEventListener("DOMContentLoaded",fn)
			}else{
				document.attachEvent("onreadystatechange",fn)
			}
		},
		on:function(type,fn){
			return pb.event.addHandler(this.selector,type,fn)
		},
		off:function(type,fn){
			return pb.event.removeHandler(this.selector,type,fn)
		},
		trigger:function(type){
			var ele = ele || document,
				result;
			if(document.createEvent){
				event = document.createEvent("Events");
				event.initEvent(type,false,false);
				this.selector.dispatchEvent(event);
			}else{
				this.selector.fireEvent("on" + type);
			}
		}
	}
	pb.event = {
		addHandler:function(elem,type,fn){
			if(elem.addEventListener){
				elem.addEventListener(type,fn,false)
			}else if(elem.attachEvent){
				elem.attachEvent("on" + type,fn)
			}
		},
		removeHandler:function(elem,type,fn){
			if(elem.removeHandler){
				elem.removeHandler(type,fn,false)
			}else if(elem.detachEvent){
				elem.detachEvent("on" + type,fn)
			}
		}
	}

	pb.fn.init.prototype = pb.fn

	window.y = pb;
})(window)