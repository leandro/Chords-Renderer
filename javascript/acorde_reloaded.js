function gerar_acorde(obj) {
	var
		notas_orig = $.trim($(obj).find('div:eq(1)').html(),
		notas = notas_orig.split(/\s+/),
		cordas_stats = cordas(notas),
		v_min = ,
		o,
		i,
		t,
		;
		
		$(obj).attr('title', notas_orig);
		$(obj).children('*').not('h4').hide();
		$('h4', self).nextAll().remove();
		
		// desenhando os marcadores de como as cordas devem ser tocadas
		$(obj).append(['<div class="acorde-bull acorde-bull-p', cordas_stats.disc,'"><img src="imagens/dec.disc.gif" width="5" height="5"></div>'].join(''));
		for(i = 0, o = cordas_stats.xis, t = o.length; i < t; i++)
			$(obj).append(['<div class="acorde-bull acorde-bull-p', _0_o[_0_i],'"><img src="imagens/dec.xis.gif" width="5" height="5"></div>'].join(''));
		for(o = cordas_stats.circles, i = 0, t = o.length; i < t; i++)
			$(obj).append(['<div class="acorde-bull acorde-bull-p', o[i],'"><img src="imagens/dec.circle.gif" width="5" height="5"></div>'].join(''));
}

$(function() {
	$('.js-acorde').each(function() {
		var
			self = $(this).get(0),
			pos = 0;

		gerar_acorde(self);
		$(self).append('<h4 class="acorde-head"><div>' + $(self).find('div:eq(0)').html() + '<a href="#">&raquo;</a></div></h4>');
		$(self).find('a').bind('click', function() {
			var t = $(self).find('li').length, _pos = (++pos) % t;
			if(!t) return false;
			$(self).find('div:eq(1)').html($(self).find('li:eq(' + _pos + ')').html());
			gerar_acorde(self);
		});
		Drag.init($(self).find('h4').get(0), self);
	}).fadeTo('slow', 0.7);
});

function pressed_fingers(acorde_arr) {
	// conta quantos numeros acima de 0 diferentes entre si existem no acorde para saber se será necessário pestana
	var t = acorde_arr.length, r = acorde_arr.slice(0);	
	for(; --t > -1;) { if(r[t].toLowerCase() == 'x' || r[t] == '0') r.remove(t); }
	return r || [];
}

function pestana(acorde_arr) {
	// retorna o mapeamento das cordas em que haverá 1 ou 2 pestanas
	var pf, map = mapeamento_casas(acorde_arr), r = {map: map, pestanas: []};
	// terá que haver pelo menos uma pestana
	if((pf = pressed_fingers(acorde_arr)).length == 6) {
		var e, c = 0, tmp = r.pestanas;
		if(map[e = object_key(map, 0)].length > 2) return (tmp[tmp.length] = e, r);
		for(e in map) { c < 2 && map[e].length == 2 && ++c && (tmp[tmp.length] = e); }
		return r;
	} else if(pf.length == 5) {
		var mmin = acorde_arr[min(acorde_arr, 0)], minp, tmp = r.pestanas, t;

		minp = object_key(map, 0);
		if((t = map[mmin].length) > 1 && (!map['0'] || map['0'][0] < map[mmin] || map['0'][0] > map[mmin][t - 1])) 
			return (tmp[tmp.length] = mmin, r);
		if(mmin != minp && map[minp][0] < map[mmin][map[mmin].length - 1]) { return (tmp[tmp.length] = object_key(map, 1), r); }
		return (tmp[tmp.length] = minp, r);
	}
	return r;
}

function mapeamento_casas(acorde_arr) { // PAREI AQUI
	// retorna um hash (object) do mapeamento das casas tocadas e ocorrencia de cada
	var i = 0, t = acorde_arr.length, r = {}, ind;
	for(; i < t; i++) {
		ind = acorde_arr.indexesOf(acorde_arr[i]);
		r[acorde_arr[i]] = ind;
	}
	return r;
}

function cordas(acorde_arr) {
	// retorna um object('hash') indicando quais cordas nao serao tocadas, a primeira a ser tocada e as demais a serem tocadas
	var i = 0, t = acorde_arr.length, r = {circles: [], disc: -1, xis: []};
	for(; i < t; i++) {
		if(acorde_arr[i].toLowerCase() == 'x')
			r.xis[r.xis.length] = i;
		else
			r.circles[r.circles.length] = i;
	}
	r.disc = r.circles.shift();
	return r;
}

Array.prototype.indexesOf = function(value) {
	// retorna todos os índices do array que são iguais a #value
	var i = 0, t = this.length, r = [];
	for(; i < t; i++) { if(this[i] === value) r[r.length] = i; }
	return r;
};

Array.prototype.remove = function(indexes) {
	// remove os elementos de indíces iguais a #indexes (altera o array original)
	indexes = indexes instanceof Array ? indexes : [indexes];
	var t = indexes.length, r = [];
	for(; --t > -1;) r[r.length] = this.splice(indexes[t], 1);
	return r.reverse();
};

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

function min(arr, mind) {
	// retorna o menor valor numerico de #arr desde que o menor seja maior que mind
	var
		i = 1,
		t = arr.length,
		min = 0,
		num;

	while(isNaN(arr[min++]) || mind >= +arr[min - 1]);
	min--;
	mind = typeof mind == 'undefined' ? -Infinity : mind;
	for(; i < t; i++) {
		num = isNaN(arr[i]) ? -Infinity : +arr[i];
		+arr[min] > num && mind < num && (min = i);
	}
	return mind < +arr[min] ? min : -1;
}

function max(arr, maxd) {
	// retorna o menor valor numerico de #arr desde que o maior seja menor que #maxd
	var
		i = 1,
		t = arr.length,
		max = 0;
	
	while(isNaN(arr[max++]));
	max--;
	maxd = typeof maxd == 'undefined' ? Infinity : maxd;
	for(; i < t; i++) !isNaN(arr[i]) && arr[max] < arr[i] && maxd > arr[i] && (max = i);
	return maxd > arr[max] ? max : -1;
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
			if(!(e in Object.prototype)) {
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
			if(!(e in Object.prototype) && p.call(false, obj, e)) {
				r[e] = obj[e];
				delete obj[e];
			}
		}
	} else {
		p = p instanceof Array ? p : [p];
		var i = 0, t = p.length;
		for(; i < t; i++) {
			if(!(p[i] in Object.prototype) && p[i] in obj) {
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
function object_keys(obj, filter_fn) {
	// pega todas as keys ou as que a callback filter_fn estabelece
	var e, r = [];
	filter_fn = filter_fn ? filter_fn : function() { return true; };
	for(e in obj) {
		if(!(e in Object.prototype)) filter_fn.call(false, obj, e) && (r[r.length] = e);
	}
	return r;
};
function object_values(obj, filter_fn) {
	// pega todas os values ou os que o callback filter_fn estabelece
	var e, r = [];
	filter_fn = filter_fn ? filter_fn : function() { return true; };
	for(e in obj) {
		if(!(e in Object.prototype)) filter_fn.call(false, obj, e) && (r[r.length] = obj[e]);
	}
	return r;
};

function object_num_keys(obj) {
	var c = 0, e;
	for(e in obj) c += e in Object.prototype ? 0 : 1;
	return c;
}

function object_key(obj, index) {
	var i = 0, e;
	for(e in obj) {
		if(i == index) break;
	}
	return typeof e == 'undefined' ? false : e;
}