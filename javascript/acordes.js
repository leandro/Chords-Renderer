$(function() {
	var teste = 0;
	$('.js-acorde').each(function() {
		var _0_s, _0_acordes = (_0_s = $.trim($(this).html())).split(/\s+/),
			_0_min = _0_acordes[min(_0_acordes)],
			_0_max = _0_acordes[max(_0_acordes)],
			_0_graphics = cordas(_0_acordes),
			_0_map = pestana(_0_acordes),
			_0_pestanas = object_remove_keys(_0_map.map, _0_map.pestanas),
			_0_i = 0,
			_0_t,
			_0_o,
			_0_dx = 12,
			_0_dy = 7,
			_0_diff,
			_0_dw,
			_0_tmp,
			_0_dedos = [],
			_0_dedo_atual = 1,
			_0_inc = _0_max > 5 ? 0 : _0_min - 1;

		$(this).attr('title', _0_s);
		$(this).html('');
		
		// desenhando os marcadores de como as cordas devem ser tocadas
		$(this).append(['<div class="acorde-bull acorde-bull-p', _0_graphics.disc,'"><img src="imagens/dec.disc.gif" width="5" height="5"></div>'].join(''));
		for(_0_o = _0_graphics.xis, _0_t = _0_o.length; _0_i < _0_t; _0_i++)
			$(this).append(['<div class="acorde-bull acorde-bull-p', _0_o[_0_i],'"><img src="imagens/dec.xis.gif" width="5" height="5"></div>'].join(''));
		for(_0_o = _0_graphics.circles, _0_i = 0, _0_t = _0_o.length; _0_i < _0_t; _0_i++)
			$(this).append(['<div class="acorde-bull acorde-bull-p', _0_o[_0_i],'"><img src="imagens/dec.circle.gif" width="5" height="5"></div>'].join(''));
		// desenhando as pestanas
		for(_0_i = 0, _0_o = _0_map.pestanas, _0_t = _0_o.length; _0_i < _0_t; _0_i++) {
			_0_dyf = _0_dy + (_0_o[_0_i] - _0_min + _0_inc) * 12;
			_0_dxf = (_0_tmp = _0_pestanas[_0_o[_0_i]][0]) * 11 + _0_dx;
			_0_dw = 60 - _0_tmp * 11;
			if(_0_max > 5)
				$(this).append(['<div class="acorde-pricasa">', _0_min,'</div>'].join(''));
			$(this).append(['<div class="acorde-pestana" style="left:', _0_dxf,'px;top:', _0_dyf,'px;width:', _0_dw,'px;"></div>'].join(''));
		}
		// desenhando as posicoes dos dedos
		var cordas_arr = [];
		object_remove_keys(_0_map.map, ['0', 'X']);
		for(_0_i = 0, _0_tmp = [], _0_o = object_keys(_0_map.map).sort(), _0_t = _0_o.length; _0_i < _0_t; _0_i++) {
			_0_tmp = _0_tmp.concat(repeat_to_array(_0_o[_0_i], _0_map.map[_0_o[_0_i]].length));
			cordas_arr = cordas_arr.concat(_0_map.map[_0_o[_0_i]]);
		}
		_0_dy = 4;
		_0_dx = 10;
		for(_0_i = 0, _0_o = _0_tmp, _0_tmp = object_keys(_0_pestanas), _0_t = _0_o.length; _0_i < _0_t; _0_i++, _0_dedo_atual = 1) {
			_0_dedo_atual += lesser_then(_0_tmp, _0_o[_0_i]).length + _0_i;
			_0_dyf = _0_dy + (_0_o[_0_i] - _0_min + _0_inc) * 12;
			_0_dxf = cordas_arr[_0_i] * 11 + _0_dx;
			$(this).append(['<div class="acorde-dedo" style="left:', _0_dxf,'px;top:', _0_dyf,
				'px;"><img src="imagens/dec.dedo', _0_dedo_atual,'.gif" width+"9" height="9" /></div>'].join(''));
			//_0_dedos[_0_dedo_atual] = [_0_o[_0_i] - _0_min + _0_inc, cordas_arr[_0_i]];
			//alert(to_s(_0_o) + "\n" + _0_o[_0_i] + "\n" + _0_dedo_atual);
		}
		teste = 1;
		//alert(to_s(_0_dedos));
		//alert(to_s(_0_o));
	});
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
		var mmin = acorde_arr[min(acorde_arr, 0)], minp, tmp = r.pestanas;

		minp = object_key(map, 0);
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
	var i = 0, t = this.length, r = [];
	for(; i < t; i++) { if(this[i] === value) r[r.length] = i; }
	return r;
};

Array.prototype.remove = function(indexes) {
	indexes = indexes instanceof Array ? indexes : [indexes];
	var t = indexes.length, r = [];
	for(; --t > -1;) r[r.length] = this.splice(indexes[t], 1);
	return r.reverse();
};

function repeat_to_array(value, times) {
	for(var r = []; times--; r[r.length] = value);
	return r;
}

function lesser_then(arr, num) {
	// retorna todos os numeros menores que num
	var i = 0, t = arr.length, r = [];
	for(; i < t; i++)
		arr[i] < num && (r[r.length] = arr[i]);
	return r;
}

function min(arr, mind) {
	// retorna o menor valor numerico de #arr desde que o menor seja maior que mind
	var
		i = 1,
		t = arr.length,
		min = 0;

	while(isNaN(arr[min++]));
	min--;
	mind = typeof mind == 'undefined' ? -Infinity : mind;
	for(; i < t; i++) !isNaN(arr[i]) && arr[min] > arr[i] && mind < arr[i] && (min = i);
	return mind < arr[min] ? min : -1;
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