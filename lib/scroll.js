const animation = document.querySelector('.logo-animation');
const canvasEl = document.querySelector('.triangles');

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
	var scale = 1 - scrolled;
	animation.style.transform = 'scale(' + scale.toString() + ', ' + scale.toString() + ')';
	// fade down triangle slightly
	const downArrow = document.querySelector('.triangle-down');
	scale = 1 - 3 * scrolled;
	downArrow.style.opacity = scale;
})

class Triangle {
	constructor(p1, p2, p3) {
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.moveTo(this.p1.x, this.p1.y);
		ctx.lineTo(this.p2.x, this.p2.y);
		ctx.lineTo(this.p3.x, this.p3.y);
		ctx.closePath();
		ctx.fill();
	}
}

// dynamic resize of canvas to match window size
function resize() {
	canvasEl.width = 900;
	canvasEl.height = window.innerHeight;
}

function generate() {
	// options for mesh
	const size = 150;
	const variance = 0.35;
	// const variance = 0;

	// getting the number of rows and columns
	const width = canvasEl.width + size * 2;
	const height = canvasEl.height + size * 2;

	const columns = Math.ceil(width / size) + 2;
	const rows = Math.ceil(height / (size * 0.865)) + 1;

	// clear points and triangles
	var points = [];
	var triangles = [];

	// generating points
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			let point = {};
			point.y = (i * size * 0.866) - size;
			point.y += (Math.random() - 0.5) * variance * size * 2;

			// even row
			if (i % 2 == 0) {
				point.x = (j * size) - size;
				point.x += (Math.random() - 0.5) * variance * size * 2;
			}
			// odd row
			else {
				point.x = (j * size) - size + (size / 2);
				point.x += (Math.random() - 0.5) * variance * size * 2;
			}
			points.push(point);
		}
	}

	// generating triangles with these points
	for (let i = 0; i < points.length; i++) {
		const row = Math.floor(i / columns);

		if (i % columns !== columns - 1 && i < ((rows - 1) * columns)) {
			let t1;
			let t2;

			// even row
			if (row % 2 == 0) {
				t1 = new Triangle(points[i], points[i + 1], points[columns + i]);
				t2 = new Triangle(points[i + 1], points[columns + i + 1], points[columns + i]);
			}
			// odd row
			else {
				t1 = new Triangle(points[i], points[columns + i + 1], points[columns + i]);
				t2 = new Triangle(points[i], points[i + 1], points[columns + i + 1]);
			}
			triangles.push(t1, t2);
		}
	}

	return triangles
}

// drawing all triangles
function draw(triangles) {
	const ctx = canvasEl.getContext('2d');

	// // make a gradient for filling
	// var gradient = ctx.createLinearGradient(0, 300, 0, 0);
	// gradient.addColorStop(0, '#373a3e');
	// gradient.addColorStop(1, '#d0d6d7');
	// ctx.fillStyle = gradient;

	ctx.fillStyle = '#373a3e';

	for (let i = 0; i < triangles.length; i++) {
		triangles[i].draw(ctx);
	}
}

resize();
var tris = generate();
draw(tris);

// for window resize
function render() {
	resize();
	// generate();
	draw(tris);
}

window.addEventListener('resize', render);
