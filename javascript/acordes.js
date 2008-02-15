$(function() {
	$('.js-acorde').each(function() {
		var _0_s,
			_0_i = 0,
			_0_t,
			_0_o,
			_0_diff,
			_0_dw,
			_0_tmp,
			_0_dedos = [],
			_0_dedo_atual = 1,
			_0_pos = 0,
			_0_htmlobj = $(this).get(0),
			_0_fn;
		
		(_0_fn = function(obj) {
			var _0_acordes = (_0_s = $.trim($(obj).find('div:eq(1)').html())).split(/\s+/),
			_0_min = _0_acordes[min(_0_acordes, 0)],
			_0_max = _0_acordes[max(_0_acordes)],
			_0_graphics = cordas(_0_acordes),
			_0_dx = 12,
			_0_dy = 21, 
			_0_map = pestana(_0_acordes),
			_0_pestanas = object_remove_keys(_0_map.map, _0_map.pestanas),
			_0_inc = _0_max > 5 ? 0 : _0_min - 1;
			
			$(obj).attr('title', _0_s);
			$(obj).children('*').not('h4').hide();
			!_0_pos && $(obj).append('<h4 class="acorde-head"><div>' + $(obj).find('div:eq(0)').html() + '<a href="#">&raquo;</a></div></h4>');
			!_0_pos && $(obj).find('a').bind('click', function() {
				var t = $(_0_htmlobj).find('li').length, pos = (++_0_pos) % t;
				if(!t) return false;
				$(_0_htmlobj).find('div:eq(1)').html($(_0_htmlobj).find('li:eq(' + pos + ')').html());
				_0_fn(_0_htmlobj);
			});
			!_0_pos && Drag.init($(obj).find('h4').get(0), $(obj).get(0));
			$('h4', obj).nextAll().remove();

			// desenhando os marcadores de como as cordas devem ser tocadas
			$(obj).append(['<div class="acorde-bull acorde-bull-p', _0_graphics.disc,'"><img src="imagens/dec.disc.gif" width="5" height="5"></div>'].join(''));
			for(_0_i = 0, _0_o = _0_graphics.xis, _0_t = _0_o.length; _0_i < _0_t; _0_i++)
				$(obj).append(['<div class="acorde-bull acorde-bull-p', _0_o[_0_i],'"><img src="imagens/dec.xis.gif" width="5" height="5"></div>'].join(''));
			for(_0_o = _0_graphics.circles, _0_i = 0, _0_t = _0_o.length; _0_i < _0_t; _0_i++)
				$(obj).append(['<div class="acorde-bull acorde-bull-p', _0_o[_0_i],'"><img src="imagens/dec.circle.gif" width="5" height="5"></div>'].join(''));
			// desenhando as pestanas
			for(_0_i = 0, _0_o = _0_map.pestanas, _0_t = _0_o.length; _0_i < _0_t; _0_i++) {
				var sub = merge_all(object_values(_0_map.map, function(o, e) { return +e < +_0_o[_0_i]; }), true),
					conflito = 6 - _0_pestanas[_0_o[_0_i]][0] - array_diff(_0_pestanas[_0_o[_0_i]], sub).length;
				_0_dyf = _0_dy + (_0_o[_0_i] - _0_min + _0_inc) * 12;
				_0_dxf = (_0_tmp = _0_pestanas[_0_o[_0_i]][0]) * 11 + _0_dx;
				_0_dw = 60 - _0_tmp * 11 - (sub.length && conflito * 11 || 0);
				$(obj).append(['<div class="acorde-pestana" style="left:', _0_dxf,'px;top:', _0_dyf,'px;width:', _0_dw,'px;"></div>'].join(''));
			}
			// indicando a casa inicial
			if(_0_max > 5)
				$(obj).append(['<div class="acorde-pricasa">', _0_min,'</div>'].join(''));
			// desenhando as posicoes dos dedos
			var cordas_arr = [];
			object_remove_keys(_0_map.map, ['0', 'X']);
			for(_0_i = 0, _0_tmp = [], _0_o = object_keys(_0_map.map).sort(function(a, b) { return a - b; }), _0_t = _0_o.length; _0_i < _0_t; _0_i++) {
				_0_tmp = _0_tmp.concat(repeat_to_array(_0_o[_0_i], _0_map.map[_0_o[_0_i]].length));
				cordas_arr = cordas_arr.concat(_0_map.map[_0_o[_0_i]]);
			}
			// _0_tmp armazena as casas que serão pressionadas na ordem corda 6 -> 1 sem levar em conta os 'X' e os '0' (X 0 1 1 2 X -> 1 1 2)
			_0_dy = 18;
			_0_dx = 10;
			for(_0_i = 0, _0_o = _0_tmp, _0_tmp = object_keys(_0_pestanas), _0_t = _0_o.length; _0_i < _0_t; _0_i++, _0_dedo_atual = 1) {
				_0_dedo_atual += lesser_than(_0_tmp, _0_o[_0_i]).length + _0_i;
				_0_dyf = _0_dy + (_0_o[_0_i] - _0_min + _0_inc) * 12;
				_0_dxf = cordas_arr[_0_i] * 11 + _0_dx;
				$(obj).append(['<div class="acorde-dedo" style="left:', _0_dxf,'px;top:', _0_dyf,
					'px;"><img src="imagens/dec.dedo', _0_dedo_atual,'.gif" width+"9" height="9" /></div>'].join(''));
			}
		})(this);
	}).fadeTo('slow', 0.7);
});

function variacoes(htmlobj) {
	var r = [], els = $(htmlobj).find('div:eq(1)').add($(htmlobj).find('li')).get(), t = els.length;
	if(t > 1) $(els).each(function() { r[r.length] = this.innerHTML; });
	return r;
}

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

		minp = object_key(map, 0); // PAREI AQUI
		if((t = map[mmin].length) > 1 && (!map['0'] || map['0'][0] < map[mmin] || map['0'][0] > map[mmin][t - 1])) 
			return (tmp[tmp.length] = mmin, r);
		if(mmin != minp && map[minp][0] < map[mmin][map[mmin].length - 1]) { return (tmp[tmp.length] = object_key(map, 1), r); }
		return (tmp[tmp.length] = minp, r);
	}
	return r;
}

function mapeamento_casas(acorde_arr) {
	// retorna um hash (object) do mapeamento das casas tocadas e ocorrencia de cada
	var i = 0, t = acorde_arr.length, r = {}, ind, rtmp = [];
	var fnord = function(a, b) {
		return a[1].length > b[1].length ? -1 :
			(a[1].length == b[1].length ? (a[0] > b[0] ? 1 : -1) : 1);
	};
	for(; i < t; i++) {
		ind = acorde_arr.indexesOf(acorde_arr[i]);
		rtmp[rtmp.length] = [acorde_arr[i], ind];
		//ind.length >= min && (rtmp[rtmp.length] = [acorde_arr[i], ind]);
	}
	for(i = 0, t = rtmp.length, rtmp.sort(fnord); i < t; i++) r[rtmp[i][0]] = rtmp[i][1];
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
	// retorna todos os índicesdo array que são iguais a #value
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