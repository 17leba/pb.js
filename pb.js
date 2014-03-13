(function(window,undefined){

	var toString = Object.prototype.toString;

	pb = function(selector){
		return new pb.fn.init(selector);
	}
	pb.fn = pb.prototype = {
		constructor:pb,
		selector:"",
		length:0,
		init:function(selector){
			if(!selector){
				return this;
			}
			// querySelector querySelectorAll
			if(typeof selector === "string" && document.querySelector){
				if(!this.hasId(selector)){
					ele = document.querySelectorAll(selector);
					this.selector = ele;
				} else {
					this.selector = this.hasId(selector);
				}
			}
			this.pushSelector(this.selector)
			return this;
		},
		hasId:function(elem){
			var elem = elem.replace("#","");
			return document.getElementById(elem);
		},
		ready:function(fn){
			if(document.addEventListener){
				document.addEventListener("DOMContentLoaded",fn);
			}else{
				document.attachEvent("onreadystatechange",fn);
			}
		},
		on:function(type,selector,fn){
			if(fn == null ){
				// (type,fn)
				fn = selector;
				selector = undefined;
			}else{
				// (type,selector,fn)
				this.selector = y(selector).parent();
			}
			return this.each(function(){
				pb.event.addHandler(this,type,fn);
			},this.length)
		},
		off:function(type,fn){
			return this.each(function(){
				pb.event.removeHandler(this,type,fn);
			},this.length)
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
		},
		parent:function(){
			return this.selector.parentNode;
		},
		html:function(html){
			if(html === undefined){
				// html()
				return this.selector.innerHTML;
			}
			if(html){
				// html("value")
				this.selector.innerHTML = html;
			}else{
				// html("")
				this.selector.innerHTML = "";
			}
		},
		pushSelector:function(elems){
			var arr = [],
				i = this.length;
			if(!elems){
				return;
			}
			for(var k = 0;k < elems.length;k++){
				arr.push(elems[k]);
			}
			for(var j = 0;j < arr.length;j++){
				this[i++] = arr[j];
			}
			this.length = i;
			return this;
		},
		size:function(){
			return this.length;
		},
		each:function(fn,num){
			return this.eachInter(this,fn,num);
		},
		// type:function(obj){
		// 	return toString.call(obj) === "[object Object]" ? true : toString.call(obj) === "[object Array]" ? true :toString.call(obj) === "[object Function]" ? true : false;
		// },
		eachInter:function(obj,fn,num){
			// 遍历对象和数组
			// num 循环个数
			var length = obj.length,
				num = num || length,
				v;

			if(isArray(obj)){
				for(var i = 0;i < index;i++){
					v = fn.call(obj[i],i,obj[i]);
					if(v === false){
						break;
					}
				}
			}else{
				for(var i in obj){
					v = fn.call(obj[i],i,obj[i]);
					if(v === false || this.index(obj[i])+1 === num){
						break;
					}
				}
			}
			return obj;
		},
		index:function(obj){
			var length = this.length;
			for(var i = 0;i < length;i++){
				if(this[i] === obj){
					return i;
				}
			}
		}
	}
	pb.event = {
		addHandler:function(elem,type,fn){
			if(elem.addEventListener){
				elem.addEventListener(type,fn,false);
			}else if(elem.attachEvent){
				elem.attachEvent("on" + type,fn);
			}
		},
		removeHandler:function(elem,type,fn){
			if(elem.removeHandler){
				elem.removeHandler(type,fn,false);
			}else if(elem.detachEvent){
				elem.detachEvent("on" + type,fn);
			}
		}
	}

	function isArray(obj){
		return toString.call(obj) === "[object Array]";
	}
	function isFunction(obj){
		return toString.call(obj) === "[object Function]";
	}

	pb.fn.init.prototype = pb.fn;

	window.y = pb;
})(window)