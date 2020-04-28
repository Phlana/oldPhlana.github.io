const logoAnimationEl = document.querySelector('.logo-animation');
const transitionAnimation = document.querySelector('.scroll-animation');

class Triangle {
	constructor(p1, p2, p3) {
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;
	}

	draw(ctx, opacity) {
		ctx.globalAlpha = opacity;
		ctx.beginPath();
		ctx.moveTo(this.p1.x, this.p1.y);
		ctx.lineTo(this.p2.x, this.p2.y);
		ctx.lineTo(this.p3.x, this.p3.y);
		ctx.closePath();
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
		// this.variance = 0.3;
		this.variance = 0;

		// getting the number of rows and columns
		const width = el.width + this.size * 2;
		const height = el.height + this.size * 2;

		this.columns = Math.ceil(width / this.size) + 2;
		this.rows = Math.ceil(height / (this.size * 0.8)) + 1;
		// this.columns = Math.ceil(width / this.size) - 1;
		// this.rows = Math.ceil(height / (this.size * 0.8)) -1;

		console.log(this.columns);
		console.log(this.rows);

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
resize() {
	const el = document.querySelector('.triangles');
	el.height = window.innerHeight;
}
window.addEventListener('resize', resize);

function render(anim) {
	const el = document.querySelector('.triangles');
	var ctx = el.getContext('2d');
	ctx.clearRect(0, 0, el.width, el.height);
	// ctx.fillStyle = '#373a3e';

	const debugColors = ['#FFFFFF', '#EEEEEE', '#DDDDDD', '#CCCCCCC', '#BBBBBB', '#AAAAAA', '#999999', '#888888', '#777777', '#666666', '#555555', '#444444', '#333333', '#222222', '#111111', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000']

	var triCols = (canvas.columns - 1) * 2;
	var triRows = (canvas.rows - 1);

	console.assert(anim.animatables.length == triCols * triRows, 'row and column error');

	// for (var i = 0; i < anim.animatables.length; i++) {
	// 	var opacity = anim.currentTime / anim.duration;
	// 	anim.animatables[i].target.draw(ctx, 1);
	// }
	for (var i = 0; i < anim.animatables.length; i++) {
		var r = Math.floor(i / triCols) * 2;
		if (i % 2 == 0) {
			ctx.fillStyle = debugColors[r];
		}
		else {
			ctx.fillStyle = debugColors[r+1];
		}
		anim.animatables[i].target.draw(ctx, 1);
	}
}

function renderRow() {

}

animation = anime.timeline({
	autoplay: false
})
.add({
	targets: canvas.triangles,
	opacity: [0, 1],
	delay: anime.stagger(100),
	easing: 'linear',
	// update: function(anim) {
	// 	console.log(anim);
	// }
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
	var scale = 1 - scrolled;
	logoAnimationEl.style.transform = 'scale(' + scale.toString() + ', ' + scale.toString() + ')';
	// fade down triangle slightly
	const downArrow = document.querySelector('.triangle-down');
	scale = 1 - 3 * scrolled;
	downArrow.style.opacity = scale;
	// change transition animation progress
	animation.seek(animation.duration * scrolled);
});
