const shuffleArray = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
};
const getParameterByName = (name, url = window.location.href) => {
	name = name.replace(/[\[\]]/g, "\\$&");
	let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return "";
	return decodeURIComponent(results[2].replace(/\+/g, " "));
};
const _min = (d0, d1, d2, bx, ay) => {
	return d0 < d1 || d2 < d1
		? d0 > d2
			? d2 + 1
			: d0 + 1
		: bx === ay
		? d1
		: d1 + 1;
};
//edit distance
const distance = (a, b) => {
	if (a === b) {
		return 0;
	}

	if (a.length > b.length) {
		var tmp = a;
		a = b;
		b = tmp;
	}

	var la = a.length;
	var lb = b.length;

	while (la > 0 && a.charCodeAt(la - 1) === b.charCodeAt(lb - 1)) {
		la--;
		lb--;
	}

	var offset = 0;

	while (offset < la && a.charCodeAt(offset) === b.charCodeAt(offset)) {
		offset++;
	}

	la -= offset;
	lb -= offset;

	if (la === 0 || lb < 3) {
		return lb;
	}

	var x = 0;
	var y;
	var d0;
	var d1;
	var d2;
	var d3;
	var dd;
	var dy;
	var ay;
	var bx0;
	var bx1;
	var bx2;
	var bx3;

	var vector = [];

	for (y = 0; y < la; y++) {
		vector.push(y + 1);
		vector.push(a.charCodeAt(offset + y));
	}

	var len = vector.length - 1;

	for (; x < lb - 3; ) {
		bx0 = b.charCodeAt(offset + (d0 = x));
		bx1 = b.charCodeAt(offset + (d1 = x + 1));
		bx2 = b.charCodeAt(offset + (d2 = x + 2));
		bx3 = b.charCodeAt(offset + (d3 = x + 3));
		dd = x += 4;
		for (y = 0; y < len; y += 2) {
			dy = vector[y];
			ay = vector[y + 1];
			d0 = _min(dy, d0, d1, bx0, ay);
			d1 = _min(d0, d1, d2, bx1, ay);
			d2 = _min(d1, d2, d3, bx2, ay);
			dd = _min(d2, d3, dd, bx3, ay);
			vector[y] = dd;
			d3 = d2;
			d2 = d1;
			d1 = d0;
			d0 = dy;
		}
	}

	for (; x < lb; ) {
		bx0 = b.charCodeAt(offset + (d0 = x));
		dd = ++x;
		for (y = 0; y < len; y += 2) {
			dy = vector[y];
			vector[y] = dd = _min(dy, d0, dd, bx0, vector[y + 1]);
			d0 = dy;
		}
	}

	return dd;
};
const createLeaderboard = (lb, header = true) => {
	let res = `<div class="eight wide column">
                ${header ? `<h1 class="ui header">Leaderboard</h1>` : ``}
                <div class="ui middle aligned center aligned grid">
                    <div class="four column row">
                        <div class="ui header column">Place</div>
                        <div class="ui header column">Name</div>
                        <div class="ui header column">Score</div>
                        <div class="ui header column">Time (seconds)</div>
                    </div>`;
	for (let i = 0; i < Math.min(10, lb.length); i++) {
		res += `<div class="four column row">
                    <div class="ui column">${i + 1}</div>
                    <div class="ui column">${lb[i].name}</div>
                    <div class="ui column">${lb[i].score}</div>
                    <div class="ui column">${lb[i].time}</div>
                </div>`;
	}

	header
		? (res += `</div></div><div class="ui vertical divider">and</div>`)
		: (res += "");
	return res;
};
