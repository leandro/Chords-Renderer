function repeat_to_array(value, times) {
	for(var r = []; times--; r[r.length] = value);
	return r;
}

function array_rot(arr, num) {
	// rotaciona um array para esquerda ou direita #num casas
	var t = arr.length, r;
	if(t == num) return arr;
	if(num < 0) r = [].concat(arr.slice((-num) % t), arr.slice(0, (-num) % t));
	else r = [].concat(arr.slice(t - (num % t)), arr.slice(0, t - (num % t)));
	return r;
}

function lesser_than(arr, num) {

	var i = 0, t = arr.length, r = [];
	for(; i < t; i++)
		+arr[i] < num && (r[r.length] = arr[i]);
	return r;
}
function array_diff(a, b) {
	// retorna o array #a menos o array #b
	var r = a.slice(0), i, t1 = a.length, t2 = b.length;
	for(; --t1 > -1;) {
		for(i = 0; i < t2 && b[i] != a[t1]; i++);
		if(b[i] == a[t1]) r.splice(t1, 1);
	}
	return r;
}
function is_enum(obj) {
	return obj instanceof Array ? true : (typeof obj == 'object' ? true : false);
}
function merge_all(obj, recursive) {
	var type = obj instanceof Array ? 'array' : (typeof obj == 'object' ? 'object' : false), r = [];
	if(!type) return r;
	
	if(type == 'array') {
		var i = 0, t = obj.length;
		for(; i < t; i++) {
			r = r.concat(is_enum(obj[i]) && recursive && merge_all(obj[i], true) || obj[i]);
		}
	} else {
		for(var e in obj) {
			if(!(e in Object.prototype) || obj[e] != Object.prototype[e]) {
				r = r.concat(is_enum(obj[e]) && recursive && merge_all(obj[e], true) || obj[e]);
			}
		}
	}
	return r;
}

function object_remove_keys(obj, p) {
	// p pode ser -function,-array,-!function
	var r = {}, e;
	if(typeof p == 'function') {
		for(e in obj) {
			if((!(e in Object.prototype) || obj[e] != Object.prototype[e]) && p.call(false, obj, e)) {
				r[e] = obj[e];
				delete obj[e];
			}
		}
	} else {
		p = p instanceof Array ? p : [p];
		var i = 0, t = p.length;
		for(; i < t; i++) {
			if(p[i] in obj && (!(p[i] in Object.prototype) || obj[p[i]] != Object.prototype[p[i]])) {
				r[p[i]] = obj[p[i]];
				delete obj[p[i]];
			}
		}
	}
	return r;
}

function to_s(obj) {
	var s = [], e, t = obj instanceof Array ? 'Array' : 'Object', cl;
	cl = t == 'Array' ? ['[', ']'] : ['{', '}'];
	for(e in obj) {
		if(!(e in window[t].prototype)) s[s.length] = "\t" + e + " => " + obj[e];
	}
	return cl[0] + "\n" + s.join(",\n") + "\n" + cl[1];
};
function array_unique(arr) {
	var t = arr.length, i = 0, cp = arr.slice(0), r = [], els;
	for(; i < t && cp.length; i++) {
		els = array_remove(cp, array_indexes_of(cp, arr[i], true));
		r[r.length] = els[0];
	}
	return r;
}
function object_keys(obj, filter_fn) {
	// pega todas as keys ou as que a callback filter_fn estabelece
	var e, r = [];
	filter_fn = filter_fn ? filter_fn : function() { return true; };
	for(e in obj) {
		if(!(e in Object.prototype) || obj[e] != Object.prototype[e]) filter_fn.call(false, obj, e) && (r[r.length] = e);
	}
	return r;
};
function object_values(obj, filter_fn) {
	// pega todas os values ou os que o callback filter_fn estabelece
	var e, r = [];
	filter_fn = filter_fn ? filter_fn : function() { return true; };
	for(e in obj) {
		if(!(e in Object.prototype) || obj[e] != Object.prototype[e]) filter_fn.call(false, obj, e) && (r[r.length] = obj[e]);
	}
	return r;
};

function object_num_keys(obj) {
	var c = 0, e;
	for(e in obj) c += !(e in Object.prototype) || obj[e] != Object.prototype[e] ? 1 : 0;
	return c;
}

function object_key(obj, index) {
	var i = 0, e;
	for(e in obj) {
		if(i == index) break;
	}
	return typeof e == 'undefined' ? false : e;
}