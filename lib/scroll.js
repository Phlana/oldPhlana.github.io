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
		this.el = document.querySelector('.triangles');
		this.el.width = 900;
		this.el.height = window.innerHeight;

		this.traingles = [];

		// options for mesh
		this.size = 150;
		this.variance = 0.3;
		// this.variance = 0;

		// getting the number of rows and columns
		const width = this.el.width + this.size * 2;
		const height = this.el.height + this.size * 2;

		this.columns = Math.ceil(width / this.size) + 2;
		this.rows = Math.ceil(height / (this.size * 0.8)) + 1;

		this.generate();

		this.animation = anime.timeline({
			autoplay: false
		})
		.add({
			targets: this.triangles,
			opacity: [0, 1],
			delay: anime.stagger(100),
			easing: 'linear',
			// update: function(anim) {
			// 	console.log(anim);
			// }
			update: this.renderTriangles
		});
	}

	generate() {
		// clear points and triangles
		var points = [];
		this.triangles = [];

		// generating points
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.columns; j++) {
				let point = {};
				point.y = (i * this.size * 0.8) - this.size;
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

	// for window resize
	resize() {
		this.el.height = window.innerHeight;
		// draw(tris);
	}

	renderTriangles(anim) {
		this.el = document.querySelector('.triangles');
		this.ctx = this.el.getContext('2d');
		this.ctx.clearRect(0, 0, this.el.width, this.el.height);
		this.ctx.fillStyle = '#373a3e';
		for (var i = 0; i < anim.animatables.length; i++) {
			var opacity = anim.currentTime / anim.duration;
			anim.animatables[i].target.draw(this.ctx, opacity);
		}
	}
}

var canvas = new TriCanvas();
// draw(tris);

window.addEventListener('resize', canvas.resize);

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
	canvas.animation.seek(canvas.animation.duration * scrolled);
});
