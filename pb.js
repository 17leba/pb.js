(function(window,undefined){

	var toString = Object.prototype.toString,
		isReady = false;

	var pb = function(selector){
		return new pb.fn.init(selector);
	}
	pb.fn = pb.prototype = {
		constructor:pb,
		selector:"",
		length:0,
		init:function(selector){
			var ele;
			if(!selector){
				return this;
			}
			// getElementById getElementsByClassName querySelectorAll 
			// querySelectorAll(selector) IE6/7不支持 返回NodeList selector 为 string
			if(selector.nodeType === 9){
				// Document类型
				this.selector = selector.documentElement;
				this.pushSelector(this.selector);
				return this;
			}
			//selector 为函数则 返回 ready()
			if(isFunction(selector)){
				return pb(document).ready(selector);
			}
			if(typeof selector === "string" && document.querySelectorAll && !this.notId(selector)){
				if(document.getElementsByClassName){
					selector = selector.replace(".","");
					this.selector = document.getElementsByClassName(selector);
				}else{
					ele = document.querySelectorAll(selector);
					this.selector = ele;
				}
			}else if(this.notId(selector)){
				// id
				this.selector = this.notId(selector);
			}else{
				//IE6/7 getElementsByClassName()
				selector = selector.replace(".","");
				this.selector = getElementsByClassName(selector);
			}

			this.pushSelector(this.selector);
			return this;
		},
		notId:function(elem){
			var rgexp = /^#/;
			if(elem && typeof elem === "string" && rgexp.test(elem)){
				var elem = elem.replace("#","");
				return document.getElementById(elem);
			}
		},
		ready:function(fn){
			if(!isReady){
				isReady = true;
				if(document.addEventListener){
					document.addEventListener("DOMContentLoaded",readied,false);
				}else{
					document.attachEvent("onreadystatechange",readied);
				}
				fn.call(document,pb);
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

	function readied(){
		if(document.addEventListener){
			document.removeEventListener("DOMContentLoaded",readied,false);
		}else if(document.attachEvent){
			if(document.readyState === "complete"){
				document.detachEvent("onreadystatechange",readied);
			}
		}
	}
	function isArray(obj){
		return toString.call(obj) === "[object Array]";
	}
	function isFunction(obj){
		return toString.call(obj) === "[object Function]";
	}
	function getElementsByClassName(className,node,tag){
		var node = node || document,
			tag = tag || "*",
			childs = node.getElementsByTagName(tag),
			arr = [],
			lengths = childs.length;
		for(var i = 0;i < lengths;i++){
			var classNames = childs[i].className.split(" "),
				length = classNames.length,
				child = childs[i];
			for(var j = 0;j < length;j++){
				if(classNames[j] === className){
					arr.push(child);
					break;
				}
			}
		}
		return arr;
	}

	pb.fn.init.prototype = pb.fn;

	window.y = window.pb = pb;
})(window)