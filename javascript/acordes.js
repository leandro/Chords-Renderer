$(function() {
	A = new AcordeDOM('.js-acorde');
	A.render();
});

var AcordeDOM = function(acorde_seletor) {
	var root = this;
	
	// propriedades publicas
	this.pestana_left = 12;
	this.pestana_top = 21;
	this.dedo_left = 10;
	this.dedo_top = 18;
	this.draw = function(obj, _acorde) {
		var
			acorde = new Acorde(_acorde instanceof Array ? _acorde : _acorde.split(/\s+/)),
			cordas = acorde.cordas_status(),
			dedos_pos = acorde.dedos_pos(false),
			i, t, o, dyf, dxf, dw, tmp;
				
		$('h4', obj).nextAll().remove();
		
		// renderizando quais cordas serao pressionadas e etc.
		$(obj).append('<div class="acorde-bull acorde-bull-p' + cordas.disc + '"><img src="imagens/dec.disc.gif" width="5" height="5"></div>');
		for(i = 0, o = cordas.xis, t = o.length; i < t; i++)
			$(obj).append('<div class="acorde-bull acorde-bull-p' + o[i] + '"><img src="imagens/dec.xis.gif" width="5" height="5"></div>');
		for(i = 0, o = cordas.circles, t = o.length; i < t; i++)
			$(obj).append('<div class="acorde-bull acorde-bull-p' + o[i] + '"><img src="imagens/dec.circle.gif" width="5" height="5"></div>');
		
		// desenhando onde e como os dedos serao pressionados
		for(i = 0, o = dedos_pos, t = o.length; i < t; i++) {
			if(o[i][1] instanceof Array) { // pestana
				dyf = root.pestana_top + o[i][0] * 12;
				dxf = root.pestana_left + o[i][1][0] * 11;
				dw = (o[i][1][1] - 1) * 11 + 5;
				$(obj).append('<div class="acorde-pestana" style="left:' + dxf + 'px;top:' + dyf + 'px;width:' + dw + 'px;"></div>');
			} else { // dedos em uma unica nota
				dyf = root.dedo_top + o[i][0] * 12;
				dxf = root.dedo_left + o[i][1] * 11;
				$(obj).append('<div class="acorde-dedo" style="left:' + dxf + 'px;top:' + dyf +
					'px;"><img src="imagens/dec.dedo' + (i + 1) + '.gif" width+"9" height="9" /></div>');
			}
		}
		
		// indicando a casa raiz (piso) no desenho
		if(acorde.casa_piso > 1)
			$(obj).append(['<div class="acorde-pricasa">' + acorde.casa_piso + '</div>'].join(''));
	};
	this.render = function() {
		$(acorde_seletor).each(function() {
			var
				obj = $(this),
				acorde_str,
				acorde = (acorde_str = $.trim(obj.find('div:eq(1)').html())).split(/\s+/),
				variacao_handler = new AcordeVariacao(acorde);
			
			obj.attr('title', acorde_str);
			obj.children().not('h4').hide();
			obj.append('<h4 class="acorde-head"><div>' + obj.find('div:eq(0)').html() + '<a href="#">&raquo;</a></div></h4>');
			obj.find('li').each(function() { variacao_handler.insere_variacao($(this).html().split(/\s+/)); });
			obj.find('a').bind('click', function() {
				if(variacao_handler.variacoes_qtde() < 2) return false;
				root.draw(obj, variacao_handler.prox_variacao());
			});
			Drag.init(obj.find('h4').get(0), obj.get(0));
			root.draw(obj, acorde);
		}).fadeTo('slow', 0.7);
	}
}
var AcordeVariacao = function(acorde_arr) {
	// propriedades privadas (closures)
	var acorde = typeof acorde_arr == 'string' ? acorde_arr.split(' ') : acorde_arr, root = this, variacoes = [];
	
	// propriedades públicas
	this.variacao_pos = 0;
	
	// métodos públicos
	(this.insere_variacao = function(_acorde_arr) {
		var acorde_arr = typeof _acorde_arr == 'string' ? _acorde_arr.split(' ') : _acorde_arr;
		variacoes[variacoes.length] = acorde_arr;
		return root;
	})(acorde);
	this.prox_variacao = function() {
		return variacoes[++root.variacao_pos % variacoes.length];
	};
	this.variacao_atual = function() {
		return variacoes[root.variacao_pos];
	};
	this.variacoes_qtde = function() {
		return variacoes.length;
	};
}
var Acorde = function(acorde_arr) { // esperado um array com 6 elementos numéricos ou 'x'|'X'
	// dependencias: min(); max(); array_repeated(); object_num_keys();
	// propriedades privadas
	var
		acorde = typeof acorde_arr == 'string' ? acorde_arr.split(' ') : acorde_arr,
		root = this,
		casas_visuais = 5,
		nmin = min(acorde_arr, 0),
		nmax = max(acorde_arr),
		xx = 0;
	
	// métodos privados
	var
		num_press = function(acorde_arr) {
			// conta quantos numeros acima de 0 e diferentes de 'x' para saber se será necessário pestana
			var t = acorde_arr.length, c = 0, r = acorde_arr;
			for(; --t > -1; c += (r[t] + '').toLowerCase() != 'x' && (r[t] + '') !== '0' ? 1 : 0);
			return c;
		},
		casa_piso = function() {
			// retorna a menor casa visualmente falando
			return casas_visuais >= acorde[nmax] ? 1 : acorde[nmin];
		},
		pestana_fronteira = function(acorde, casa) {
			var sequencia = array_right_interval(acorde, casa); // [inicio, casas]
			return sequencia[0] + sequencia[1] - 1 == 5 ? sequencia : null;
		},
		pestanas = function() {
			// retorna as pestanas que houver no acorde no formato: [[v0, tam, casa]{1,3}]|null
			var
				hash = array_repeated(acorde, 2),
				casas = object_keys(hash).sort(function(a, b) { return +a < +b ? -1 : 1; }),
				t = casas.length,
				pressed = num_press(acorde),
				intervalalos,
				tmp,
				i = 0;

			if(pressed == 5) { // 2 2 3 0 3 3
				if(t == 2) {
					intervalos = [array_right_interval(acorde, casas[0]), array_right_interval(acorde, casas[1])]; // [[a,b], [c,d]]
					if(intervalos[0][0] + intervalos[0][1] >= intervalos[1][0] + intervalos[1][1]) {
						return [array_right_interval(acorde, casas[0]).concat(casas[0])];
					} else {
						return [array_right_interval(acorde, casas[1]).concat(casas[0])];
					}
				}
				return [array_right_interval(acorde, casas[0]).concat(casas[0])]; // t = 1 nesse caso (obrigatoriamente)
			} else if(pressed == 6) {
				if(hash[casas[0]].length > 2 && (tmp = pestana_fronteira(acorde, casas[0])))
					return [tmp.concat(casas[0])];

				if(t > 1) {
					// se chegou até aqui então haverá 2 pestanas (ou até 3, se é que existe acorde com 3 pestanas)
					var
						pnpc = [], // #pnpc(pestana na primeira corda): contem as casas cuja pestana vai até a primeira corda
						intervalos = [],
						soma_notas = 0;

					for(; i < t; i++) {
						intervalos[intervalos.length] = array_right_interval(acorde, casas[i]).concat(casas[i]);
					}
					intervalos.sort(function(a, b) {
						var x, y;
						return (x = a[0] + a[1]) > (y = b[0] + b[1]) ? -1 : ( x == y ? (+a[2] < +b[2] ? -1 : 1) : 1 );
					});
					return [intervalos[0], intervalos[1]];
				}
				return [];
			} else {
				return [];
			}
		},
		cordas_status = function() {
			// retorna um object('hash') indicando quais cordas nao serao tocadas, a primeira a ser tocada e as demais a serem tocadas
			var i = 0, t = acorde.length, r = {circles: [], disc: -1, xis: []};
			for(; i < t; i++) {
				if(acorde_arr[i].toLowerCase() == 'x')
					r.xis[r.xis.length] = i;
				else
					r.circles[r.circles.length] = i;
			}
			r.disc = r.circles.shift();
			return r;
		},
		dedos_pos = function(_absoluto) {
			// #absoluto: true|false -> indica se as linhas retornadas deveram ser absolutas ou relativas a imagem de trastes (fretboard)
			// retorna no formato(exemplo): 6 5 3 x 3 6 => [ [3, [2,4]], [5,1], [6, 0], [6, 5] ] => sempre retorna no máximo 4 elementos
			var i = 0, apestanas = pestanas(), dedos = acorde, t = apestanas.length, posmap = [], posi, posf, ok,
				fn = function(A, e, cmp) { return A[e][2] == cmp; }, tmp, fn_incluido = function(A, e, cmp) { return A[e][0] == cmp; }, pos,
				absoluto = typeof _absoluto == 'undefined' ? true : false, cs_piso = root.casa_piso;

			for(; i < t; i++) {
				dedos = array_replace(dedos, apestanas[i][2], '-' + apestanas[i][2], apestanas[i][0], apestanas[i][0] + apestanas[i][1] - 1);
			}
			for(i = 0, t = dedos.length; i < t; i++) {
				if(dedos[i] == '0' || dedos[i] == 'X') continue;
				if(dedos[i].charAt(0) != '-') {
					posmap[posmap.length] = [dedos[i], i];
				} else {
					tmp = array_filter(posmap, fn_incluido, null, -dedos[i] + '');
					pos = tmp.length - 1;
					if(tmp.length && tmp[pos][1] instanceof Array) {
						posi = tmp[pos][1][0];
						posf = tmp[pos][1][1] + tmp[pos][1][0] - 1;
					} else if(tmp.length) {
						posi = tmp[pos][1];
						posf = tmp[pos][1];
					}
					if(!tmp.length || i < posi || i > posf) {
						tmp = array_filter(apestanas, fn, null, -dedos[i] + '');
						posmap[posmap.length] = [tmp[0][2], [tmp[0][0], tmp[0][1]] ];
					}
				}
			}
			posmap.sort(function(a, b) {
				var x = +a[0], y = +b[0], posa = a[1] instanceof Array ? a[1][0] : a[1], posb = b[1] instanceof Array ? b[1][0] : b[1];
				return x < y ? -1 : (x == y ? ( posa < posb ? -1 : 1 ) : 1);
			});
			return absoluto ? posmap : array_map(posmap, function(v) { v[0] = v[0] - cs_piso; return v; });
		};

	// métodos publicos
	this.casas_visuais = function(v) {
		// define ou devolve a quantidade de casas que serão mostradas no gráfico. o padrão é 5, definido nas propriedades privadas #casas_visuais
		if(!arguments.length) return casas_visuais;
		casas_visuais = v;
		return root;
	}
	this.min = function() { return acorde[nmin]; }
	this.max = function() { return acorde[nmax]; }
	this.cordas_status = cordas_status;
	this.dedos_pos = dedos_pos;
	
	// propriedades publicas
	this.casa_piso = casa_piso();
}

function array_repeated(arr, _min) {
// retorna elementos repetidos que estejam repetidos #min ou mais vezes
	var
		min = (!_min || isNaN(_min) || _min < 1) && 1 || _min,
		t = arr.length,
		i = 0,
		r = {};

	for(; i < t; i++) {
		if(!r[arr[i]])
			r[arr[i]] = [];
		r[arr[i]][r[arr[i]].length] = i;
	}
	if(min > 1) {
		for(i in r) {
			if((!(i in Object.prototype) || r[i] != Object.prototype[i]) && min > r[i].length)
				delete r[i];
		}
	}
	return r;
}
function array_indexes_of(arr, value, _restrito) {
	// retorna todos os índices do array que são iguais a #value
	var i = 0, t = arr.length, r = [], restrito = typeof _restrito == 'undefined' ? false : true,
		fncmp = restrito ? function(a, b) { return a === b; } : function(a, b) { return a == b; };
	for(; i < t; i++) { if(fncmp(arr[i], value)) r[r.length] = i; }
	return r;
}
function array_right_interval(arr, value) {
// retorna o intervalo de indices iniciando do value encontrado mais a esquerda do array até o mais à direita.
// os elementos entre as ocrrencias dos #value do array é que irao dizer de qual #value até qual #value cujos indices serao pego baseado no #fn_filter
	var
		posi = -1,
		i = 0,
		t,
		ts,
		arr_t = array_map(arr, function(v) { return isNaN(v) ? 1 : (v - value < 0 ? 0 : 1); }),
		pos = array_indexes_of(arr, value);
	
	t = (arr_t = arr_t.join('').split('0')).length;
	for(; --t > -1 && !arr_t[t];);
	ts = arr_t[t] && arr_t[t].length || 0;
	posi = (arr_t.length > 1 ? 1 : 0) + arr_t.slice(0, t).join('0').length;
	return ts < 0 ? null : (posi < pos[0] ? [pos[0], ts + posi - pos[0]] : [posi, ts]);
}

function array_map(arr, fn_filter) {
	var i = 0, t = arr.length, r = [];
	for(; i < t; i++)
		r[r.length] = fn_filter(arr[i]);
	return r;
}
function array_remove(arr, indexes) {
	// remove os elementos de indíces iguais a #indexes (altera o array original)
	indexes = indexes instanceof Array ? indexes : [indexes];
	var t = indexes.length, r = [];
	for(; --t > -1;) r[r.length] = arr.splice(indexes[t], 1);
	return r.reverse();
}
function array_replace(arr, from, to, _posi, _posf) {
	// substitui elementos iguais a #from por #to para elementos que estiverem entre #_posi e #_posf
	var
		posi = typeof _posi != 'undefined' ? _posi : 0,
		posf = typeof _posf != 'undefined' ? _posf : arr.length - 1,
		cp = arr.slice(0);
	
	for(; posi <= posf; posi++) {
		if(cp[posi] == from) cp[posi] = to;
	}
	return cp;
}
function array_filter(arr, fn_filter, _max_el, _params) {
	// pega os #_max_el primeiros elementos de #arr que respeitem o critério contido na funcao #fn_filter
	var
		i = 0,
		t = arr.length,
		max_el = typeof _max_el != 'undefined' && _max_el !== null ? _max_el : t,
		r = [],
		c = 0,
		params = typeof _params != 'undefined' ? _params : [];

	for(; i < t && c < max_el; i++) {
		if(fn_filter.apply(false, [arr, i].concat(params))) {
			r[c++] = arr[i];
		}
	}
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
function object_keys(obj, filter_fn) {
	// pega todas as keys ou as que a callback filter_fn estabelece
	var e, r = [];
	filter_fn = filter_fn ? filter_fn : function() { return true; };
	for(e in obj) {
		if(!(e in Object.prototype) || obj[e] != Object.prototype[e]) filter_fn.call(false, obj, e) && (r[r.length] = e);
	}
	return r;
};