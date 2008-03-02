var Acorde = function(acorde_arr) { // esperado um array com 6 elementos numéricos ou 'x'|'X'
	// dependencias: min(); max(); array_repeated(); object_num_keys();
	// propriedades privadas
	var
		acorde = acorde_arr,
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
			// retorna as pestanas que houver no acorde
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
						return [array_right_interval(acorde, casas[0])];
					} else {
						return [array_right_interval(acorde, casas[1])];
					}
				}
				return [array_right_interval(acorde, casas[0])]; // t = 1 nesse caso (obrigatoriamente)
			} else if(pressed == 6) {
				if(hash[casas[0]].length > 2 && (tmp = pestana_fronteira(acorde, casas[0])))
					return [tmp];

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
					intervalos = array_map(intervalos, function(e) { e.pop(); return e; });
					return [intervalos[0], intervalos[1]];
				}
				return null;
			} else {
				return null;
			}
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

	// #parse precisa ser chamado para se iniciar todo o processo (método init())
	this.parse = function() {
		return to_s(pestanas());
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
};
var b, a = ['11 10 8 8 11 11', '6 5 0 3 6 6', '6 5 3 3 6 6', '6 X X 7 6 10', 'X 11 X 13 13 11', 'X 8 10 10 10 8', 'X 0 11 X 10 0', 'X X 9 11 12 11',
	'X X 2 4 4 4', 'X 1 5 5 5 3', '6 7 5 5 8 8', 'X 0 2 2 2 0', '3 5 5 4 3 3', '6 5 3 X 3 6', 'X 3 2 0 1 X', 'X 3 2 0 X 0'];
$(function() {
	for(var A, i = 0, t = a.length; i < t; i++) {
		A = new Acorde(a[i].split(/\s+/));
		$(document.body).append('<pre>' + a[i] + "\n" + A.parse() + '</pre>');
	}
});
//alert(array_right_interval([0, 0, 8, 8, 11, 11], 8));
//alert(to_s(array_repeated([0, 0, 8, 8, 11, 11], 2)));
