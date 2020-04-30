const logoAnimationEl = document.querySelector('.logo-animation');

class Triangle {
	constructor(p1, p2, p3) {
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;

		// options for color
		this.color = '#373a3e';
		// this.colRange = 100;
		this.colRange = 50;
		this.colVar = 0.3;
		// this.colVar = 0;

		this.shiftColor();
	}

	shiftColor() {
		// parse color into numbers
		var m = this.color.match(/^#([0-9a-f]{6})$/i)[1];
		if (m) {
			var colArr = [
	            parseInt(m.substr(0,2),16),
	            parseInt(m.substr(2,2),16),
	            parseInt(m.substr(4,2),16)
	        ];
	        var colStr = '#';
	        var val;
	        const shift = Math.floor((Math.random() - 0.5) * this.colVar * this.colRange);
			for (val of colArr) {
				val += shift;
				colStr += val.toString(16);
			}
			this.color = colStr;
		}
	}

	draw(ctx, opacity) {
		ctx.globalAlpha = opacity;
		ctx.fillStyle = this.color;
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(this.p1.x, this.p1.y);
		ctx.lineTo(this.p2.x, this.p2.y);
		ctx.lineTo(this.p3.x, this.p3.y);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	}
}


class TriCanvas {
	constructor() {
		const el = document.querySelector('.triangles');
		el.width = 900;
		el.height = window.innerHeight;

		this.traingles = [];

		// options for mesh
		this.size = 150;
		this.variance = 0.3;
		// this.variance = 0;

		// getting the number of rows and columns
		const width = el.width + this.size * 2;
		const height = el.height + this.size * 2;

		this.columns = Math.ceil(width / this.size) + 2;
		this.rows = Math.ceil(height / (this.size * 0.8)) + 1;

		this.generate();
	}

	generate() {
		// clear points and triangles
		var points = [];
		this.triangles = [];

		// generating points
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.columns; j++) {
				let point = {};
				point.y = (i * this.size * 0.801) - this.size;
				point.y += (Math.random() - 0.5) * this.variance * this.size * 2;

				// even row
				if (i % 2 == 0) {
					point.x = (j * this.size) - this.size;
					point.x += (Math.random() - 0.5) * this.variance * this.size * 2;
				}
				// odd row
				else {
					point.x = (j * this.size) - this.size + (this.size / 2);
					point.x += (Math.random() - 0.5) * this.variance * this.size * 2;
				}
				points.push(point);
			}
		}

		// generating triangles with these points
		for (let i = 0; i < points.length; i++) {
			const row = Math.floor(i / this.columns);

			if (i % this.columns !== this.columns - 1 && i < ((this.rows - 1) * this.columns)) {
				let t1;
				let t2;

				// even row
				if (row % 2 == 0) {
					t1 = new Triangle(points[i], points[i + 1], points[this.columns + i]);
					t2 = new Triangle(points[i + 1], points[this.columns + i + 1], points[this.columns + i]);
				}
				// odd row
				else {
					t1 = new Triangle(points[i], points[this.columns + i + 1], points[this.columns + i]);
					t2 = new Triangle(points[i], points[i + 1], points[this.columns + i + 1]);
				}
				this.triangles.push(t1, t2);
			}
		}
	}
}

var canvas = new TriCanvas();

// for window resize
function resize() {
	const el = document.querySelector('.triangles');
	el.height = window.innerHeight;
}

window.addEventListener('resize', resize);

var triCols = (canvas.columns - 1) * 2;
var triRows = (canvas.rows - 1);

// render a single triangle
function renderTri(anim, triNum, opacity) {
	const el = document.querySelector('.triangles');
	var ctx = el.getContext('2d');
	anim.animatables[triNum].target.draw(ctx, opacity);
}

// render a row of triangles
function renderRow(anim, rowNum, opacity) {
	if (rowNum >= triRows * 2) {
		return;
	}
	const r = Math.floor(rowNum / 2) * triCols;
	var start;
	if (rowNum % 4 == 0 || rowNum % 4 == 1) {
		start = rowNum % 2;
	}
	else {
		start = 1 - rowNum % 2;
	}
	for (var i = start; i < triCols; i += 2) {
		const Tnum = r + i;
		renderTri(anim, Tnum, opacity);
	}	
}

function getOpacity(anim, row) {
	var progress = anim.progress / 100;
}

// render the grid
function render(anim) {
	const el = document.querySelector('.triangles');
	var ctx = el.getContext('2d');
	ctx.clearRect(0, 0, el.width, el.height);

	console.assert(anim.animatables.length == triCols * triRows, 'row and column error');

	for (var r = 0; r < triRows * 2; r++) {
		// renderRow(anim, r, r / (triRows * 2));
		renderRow(anim, r, 1);
	}
}

animation = anime.timeline({
	loop: true,
	autoplay: false
})
.add({
	targets: canvas.triangles,
	update: render
});

// gets scroll percentage as a decimal
function getScroll() {
	const h = document.documentElement;
	const b = document.body;
	const st = 'scrollTop';
	const sh = 'scrollHeight';

	return (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight);
}

window.addEventListener('scroll', () => {
	const scrolled = getScroll();
	// shrink logo animation slightly
	const logoScale = 1 - scrolled;
	logoAnimationEl.style.transform = 'scale(' + logoScale.toString() + ', ' + logoScale.toString() + ')';
	// fade down triangle slightly
	const downArrow = document.querySelector('.triangle-down');
	const arrowScale = 1 - 3 * scrolled;
	downArrow.style.opacity = arrowScale;
	// change transition animation progress
	animation.seek(animation.duration * scrolled);
});
