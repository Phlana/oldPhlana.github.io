const animation = document.querySelector('.logo-animation');

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
	const scale = 1 - scrolled;
	animation.style.transform = 'scale(' + scale.toString() + ', ' + scale.toString() + ')';
})

// grid for the scrolling animation
var points = [];
var triangles = [];
const size = 150;
const variance = 0.35;
// const variance = 0;

// getting the number of rows and columns
const canvas = document.querySelector('.triangles');
var columns;
var rows;

// dynamic resize of canvas to match window size
function resize() {
	canvas.width = 900;
	canvas.height = window.innerHeight;

	const width = canvas.width + size * 2;
	const height = canvas.height + size * 2;

	columns = Math.ceil(width / size) + 2;
	rows = Math.ceil(height / (size * 0.865)) + 1;
}

function generate() {
	// clear points and triangles
	points = [];
	triangles = [];

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
				t1 = [points[i], points[i + 1], points[columns + i]];
				t2 = [points[i + 1], points[columns + i + 1], points[columns + i]];
			}
			// odd row
			else {
				t1 = [points[i], points[columns + i + 1], points[columns + i]];
				t2 = [points[i], points[i + 1], points[columns + i + 1]];
			}
			triangles.push(t1, t2);
		}
	}
}

function drawTriangle(ctx, points) {
	ctx.beginPath();
	ctx.moveTo(points[0].x, points[0].y);
	ctx.lineTo(points[1].x, points[1].y);
	ctx.lineTo(points[2].x, points[2].y);
	ctx.closePath();
	ctx.fill();
}

// drawing all triangles
function draw() {
	const ctx = canvas.getContext('2d');

	// // make a gradient for filling
	// var gradient = ctx.createLinearGradient(0, 300, 0, 0);
	// gradient.addColorStop(0, '#373a3e');
	// gradient.addColorStop(1, '#d0d6d7');
	// ctx.fillStyle = gradient;

	ctx.fillStyle = '#373a3e';

	for (let i = 0; i < triangles.length; i++) {
		drawTriangle(ctx, triangles[i]);
	}
}

resize();
generate();
draw();

// for window resize
function render() {
	resize();
	// generate();
	draw();
}

window.addEventListener('resize', render);
