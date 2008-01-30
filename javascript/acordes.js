$(function() {
	var teste = 0;
	$('.js-acorde').each(function() {
		var _0_s, _0_acordes = (_0_s = $.trim($(this).html())).split(/\s+/),
			_0_graphics = strings(_0_acordes),
			_0_i = 0,
			_0_t,
			_0_o;

		//alert(pestana(_0_acordes));
		$(this).attr('title', _0_s);
		$(this).html('');
		$(this).append(['<div class="acorde-bull acorde-bull-p', _0_graphics.disc,'"><img src="imagens/dec.disc.gif" width="5" height="5"></div>'].join(''));
		for(_0_o = _0_graphics.xis, _0_t = _0_o.length; _0_i < _0_t; _0_i++)
			$(this).append(['<div class="acorde-bull acorde-bull-p', _0_o[_0_i],'"><img src="imagens/dec.xis.gif" width="5" height="5"></div>'].join(''));
		for(_0_o = _0_graphics.circles, _0_i = 0, _0_t = _0_o.length; _0_i < _0_t; _0_i++)
			$(this).append(['<div class="acorde-bull acorde-bull-p', _0_o[_0_i],'"><img src="imagens/dec.circle.gif" width="5" height="5"></div>'].join(''));
	});
});

function pressed_fingers(acorde_arr) {
	// conta quantos numeros acima de 0 diferentes entre si existem no acorde para saber se será necessário pestana
	var t = acorde_arr.length, r = acorde_arr.slice(0);	
	for(; --t > -1;) { if(r[t].toLowerCase() == 'x' || r[t] == '0') r.remove(t); }
	return r || [];
}

function pestana(acorde_arr) {
	var pf;
	if((pf = pressed_fingers(acorde_arr)).length > 4) { // terá que haver pestana
		var mmin, zeros = acorde_arr.indexesOf('0'),
			minors = acorde_arr.indexesOf(acorde_arr[mmin = min(acorde_arr, 0)]);
		
		if(zeros[0] < minors[0] && zeros[zeros.length - 1] > minors[minors.length - 1]) {
			return minors;
		} else {
			minors[0] = zeros[0] > minors[0] ? zeros[0] + 1 : minors[0];
			minors[minors.length - 1] = zeros[zeros.length - 1] > minors[minors.length - 1] ? zeros[zeros.length - 1] - 1 : minors[minors.length - 1];
			return minors;
		}
	}
	return [];
}

function mapeamento_casas(acorde_arr) {
	var i = 0, t = acorde_arr.length, dup = acorde_arr.slice(0), r = {};
	for(; i < t; i++) { r[acorde_arr[i]] = acorde_arr.indexesOf(acorde_arr[i]); }
	return r;
}

function strings(acorde_arr) {
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
}

Array.prototype.remove = function(indexes) {
	indexes = indexes instanceof Array ? indexes : [indexes];
	var t = indexes.length, r = [];
	for(; --t > -1;) r[r.length] = this.splice(indexes[t], 1);
	return r.reverse();
}

function min(arr, mind) {
	// retorna o menor valor numerico de #arr desde que o menor satisfaca a callback
	var
		i = 1,
		t = arr.length,
		min = 0;
	
	for(; i < t; i++) arr[min] > arr[i] && mind < arr[i] && (min = i);
	return mind < arr[min] ? min : -1;
}

function max(arr, maxd) {
	var
		i = 1,
		t = arr.length,
		max = 0;
	
	for(; i < t; i++) arr[max] < arr[i] && maxd > arr[i] && (max = i);
	return maxd > arr[max] ? max : -1;
}