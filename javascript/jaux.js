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
		cordas_status = function(acorde_arr) {
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
		},
		dedos_pos = function(absoluto) {
			// #absoluto: true|false -> indica se as linhas retornadas deveram ser absolutas ou relativas a imagem de trastes (fretboard)
			// retorna no formato(exemplo): 6 5 3 x 3 6 => [ [3, [2,4]], [5,1], [6, 0], [6, 5] ] => sempre retorna no máximo 4 elementos
			var i = 0, apestanas = pestanas(), dedos = acorde, t = apestanas.length, posmap = [], posi, posf, ok,
				fn = function(A, e, cmp) { return A[e][2] == cmp; }, tmp, fn_incluido = function(A, e, cmp) { return A[e][0] == cmp; }, pos;

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
			return posmap;
		};

	// métodos públicos
	this.casas_visuais = function(v) {
		// define ou devolve a quantidade de casas que serão mostradas no gráfico. o padrão é 5, definido nas propriedades privadas #casas_visuais
		if(!arguments.length) return casas_visuais;
		casas_visuais = v;
		return root;
	}
	this.min = function() { return acorde[nmin]; }
	this.max = function() { return acorde[nmax]; }

	// #render precisa ser chamado para se iniciar todo o processo (método init())
	this.render = function() {
		return to_s(dedos_pos());
		
	}
}
//alert(to_s(array_repeated([1,1,2,2,2,1], 2)));
//var teste = new Acorde([11,10,8,8,11,11]);
//teste.parse();


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
// 8 7 5 8 8 9
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
function array_unique(arr) {
	var t = arr.length, i = 0, cp = arr.slice(0), r = [], els;
	for(; i < t && cp.length; i++) {
		els = array_remove(cp, array_indexes_of(cp, arr[i], true));
		r[r.length] = els[0];
	}
	return r;
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

var b, a = ['11 10 8 8 11 11', '6 5 0 3 6 6', '6 5 3 3 6 6', '6 X X 7 6 10', 'X 11 X 13 13 11', 'X 8 10 10 10 8', 'X 0 11 X 10 0', 'X X 9 11 12 11',
	'X X 2 4 4 4', 'X 1 5 5 5 3', '6 7 5 5 8 8', 'X 0 2 2 2 0', '3 5 5 4 3 3', '6 5 3 X 3 6', 'X 3 2 0 1 X', 'X 3 2 0 X 0'];
$(function() {
	for(var A, i = 0, t = a.length; i < t; i++) {
		A = new Acorde(a[i].split(/\s+/));
		$(document.body).append('<pre>' + a[i] + "\n" + A.render() + '</pre>');
	}
});
//alert(to_s(new Acorde('6 5 3 X 3 6').d()));
//alert(array_right_interval([0, 0, 8, 8, 11, 11], 8));
//alert(to_s(array_repeated([0, 0, 8, 8, 11, 11], 2)));
