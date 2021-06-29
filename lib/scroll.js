const logoAnimationElement = document.querySelector('.logo-animation');
const svgns = 'http://www.w3.org/2000/svg';

// check if svg is supported
const canSvg = !!(document.createElementNS && document.createElementNS('http://www.w3.org/2000/svg','svg').createSVGRect);
// const canSvg = false;

if (canSvg) {
	// svg element
	console.log('using svg');
	var scrollElement = document.createElementNS(svgns, 'svg');
}
else {
	// canvas element
	console.log('using canvas');
	var scrollElement = document.createElement('canvas');
	var ctx = scrollElement.getContext('2d');
}

scrollElement.setAttribute('className', 'triangles');
scrollElement.setAttribute('width', 900);
scrollElement.setAttribute('height', window.innerHeight);

document.querySelector('.scroll-animation').appendChild(scrollElement);

class Triangle {
	constructor(p1, p2, p3) {
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;

		// options
		this.color = '#373a3e';
		this.colRange = 50;
		this.colVar = 0.3;
		this.opacity = 0;
		this.opaVar = 2;

		this.shiftColor();
		this.shiftOpacity();
	}

	// shifts triangles color slightly by a random amount and converts to hex
	shiftColor() {
		// parse color into numbers
		var colArr = [
            parseInt(this.color.substr(1,2),16),
            parseInt(this.color.substr(3,2),16),
            parseInt(this.color.substr(5,2),16)
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

	// shift triangles opacity slightly by a random amount
	shiftOpacity() {
		const shift = (Math.random() - 0.5) * this.opaVar;
		this.opacity = shift;
	}

	// constrain opacity within bounds
	boundedOpacity(opacity) {
		const o = opacity + this.opacity;
		if (o < 0) {
			return 0;
		}
		else if (o > 1) {
			return 1;
		}
		else {
			return o;
		}
	}

	// draws triangle to canvas
	draw(opacity) {
		if (canSvg) {
			this.tri.setAttribute('opacity', this.boundedOpacity(opacity).toString());
		}
		else {
			ctx.globalAlpha = this.boundedOpacity(opacity);
			ctx.fillStyle = this.color;
			ctx.strokeStyle = this.color;
			ctx.lineWidth = 1.01;
			ctx.beginPath();
			ctx.moveTo(this.p1.x, this.p1.y);
			ctx.lineTo(this.p2.x, this.p2.y);
			ctx.lineTo(this.p3.x, this.p3.y);
			ctx.closePath();
			ctx.stroke();
			ctx.fill();
		}
	}

	// creates an svg triangle
	createSvgTri() {
		this.tri = document.createElementNS(svgns, 'polygon');
		this.tri.setAttribute('points', `${this.p1.x} ${this.p1.y} ${this.p2.x} ${this.p2.y} ${this.p3.x} ${this.p3.y}`);
		this.tri.setAttribute('style', `fill:${this.color};stroke:${this.color};stroke-width:1.01;`);
		this.tri.setAttribute('opacity', '0');

        // inject triangle element into svg element
        scrollElement.appendChild(this.tri);
	}
}

class ScrollTriangles {
	constructor() {
		this.traingles = [];

		// options for mesh
		this.size = 150;
		this.variance = 0.3;
		// this.variance = 0;

		// getting the number of rows and columns
		const width = parseInt(scrollElement.getAttribute('width')) + (this.size * 2);
		const height = parseInt(scrollElement.getAttribute('height')) + (this.size * 2);

		this.columns = Math.ceil(width / this.size) + 2;
		this.rows = Math.ceil(height / (this.size * 0.8)) + 1;

		this.generate();

		if (canSvg) {
			this.makeSvg();
		}
	}

	// clears and generates a list of triangle classes
	generate() {
		// clear points and triangles
		var points = [];
		this.triangles = [];

		// generating points
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.columns; j++) {
				let point = {};
				// generate y coordinates of points
				point.y = (i * this.size * 0.801) - this.size;
				// shift y coordinate for each point
				point.y += (Math.random() - 0.5) * this.variance * this.size * 2;

				// even row
				if (i % 2 == 0) {
					// generate and shift x coordinates
					point.x = (j * this.size) - this.size;
					point.x += (Math.random() - 0.5) * this.variance * this.size * 2;
				}
				// odd row
				else {
					// generate and shift x coordinates
					point.x = (j * this.size) - this.size + (this.size / 2);
					point.x += (Math.random() - 0.5) * this.variance * this.size * 2;
				}
				points.push(point);
			}
		}

		// generating triangle classes with these points
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

	makeSvg() {
        for (let i = 0; i < this.triangles.length; i++) {
            this.triangles[i].createSvgTri();
        }
    }
}

var triangles = new ScrollTriangles();

var triCols = (triangles.columns - 1) * 2;
var triRows = (triangles.rows - 1);

function findOpacity(anim, row) {
	var rowDur = anim.duration / (triRows * 2);
	var rowProg = (anim.duration - anim.currentTime - (row + 1) * rowDur) / rowDur
	return 1 - rowProg;
}

// render the grid of triangles
function render(anim) {
	console.assert(anim.animatables.length == triCols * triRows, 'row and column error');

	if (!canSvg) {
		ctx.clearRect(0, 0, scrollElement.width, scrollElement.height);
	}
	
	for (var row = 0; row < triRows * 2; row++) {
		var opacity = findOpacity(anim, row);
		if (row >= triRows * 2) {
			continue;
		}
		const r = Math.floor(row / 2) * triCols;
		var start;
		if (row % 4 == 0 || row % 4 == 1) {
			start = row % 2;
		}
		else {
			start = 1 - row % 2;
		}
		for (var i = start; i < triCols; i += 2) {
			const tNum = r + i;
			// render a single triangle
			anim.animatables[tNum].target.draw(opacity);
		}
	}
}

// triangle scroll animation
var scrollAnimation = anime.timeline({
	autoplay: false
})
.add({
	targets: triangles.triangles,
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

function handleScroll() {
	const scrolled = getScroll();
	// shrink logo animation slightly
	const logoScale = 1 - scrolled * 0.7;
	logoAnimationElement.style.transform = `scale(${logoScale}, ${logoScale})`;
	// fade down triangle slightly
	const downArrow = document.querySelector('.triangle-down');
	const arrowScale = 1 - scrolled * 3;
	downArrow.style.opacity = arrowScale;
	// change transition animation progress
	scrollAnimation.seek(scrollAnimation.duration * scrolled);
}

// initial update
handleScroll();

// binds scroll to various animations
window.addEventListener('scroll', handleScroll);

function handleResize() {
	// update element height
	scrollElement.height = window.innerHeight;
	// regenerate triangles with new sizes
	scrollAnimation.seek(scrollAnimation.duration * getScroll());
}

// for window resize
window.addEventListener('resize', handleResize);
