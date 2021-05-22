const svgns = 'http://www.w3.org/2000/svg';
var element = document.createElementNS(svgns, 'svg');
element.setAttribute('className', 'triangles');
element.setAttribute('width', "900");
element.setAttribute('height', window.innerHeight);
document.querySelector('.scroll-animation').appendChild(element);


class Triangle {
	constructor(p1, p2, p3) {
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;

		// options for color
		// base color
		this.color = '#373a3e';
		// this.color = '#000000';
		// this.colRange = 100;
		this.colRange = 50;
		this.colVar = 0.3;
		// this.colVar = 0;

		this.shiftColor();

		this.opacity = 0;
		this.opacityVar = 2;
		// this.opacityVar = 0;

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
		const shift = (Math.random() - 0.5) * this.opacityVar;
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
	drawCanvas(ctx, opacity) {
		ctx.globalAlpha = this.boundedOpacity(opacity);
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

	// creates an svg triangle
	createSvgTri() {
		this.tri = document.createElementNS(svgns, 'polygon');
		this.tri.setAttribute('points', `${this.p1.x} ${this.p1.y} ${this.p2.x} ${this.p2.y} ${this.p3.x} ${this.p3.y}`);
		this.tri.setAttribute('fill', `${this.color}`);

        // inject triangle element into svg element
		console.log('injecting triangle');
        element.appendChild(this.tri);
	}

	drawSvg(opacity) {
		opacity = this.boundedOpacity(opacity);
		this.tri.setAttribute('opacity', opacity.toString());
	}
}

class ScrollTriangles {
	constructor() {
		this.triangles = [];

		// options for mesh
		this.size = 150;
		this.variance = 0.3;
		// this.variance = 0;

		// getting the number of rows and columns
		const width = parseInt(element.getAttribute('width')) + (this.size * 2);
		const height = parseInt(element.getAttribute('height')) + (this.size * 2);

		this.columns = Math.ceil(width / this.size) + 2;
		this.rows = Math.ceil(height / (this.size * 0.8)) + 1;

		this.generate();
        
		this.makeSvg();
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

	// draws each triangle to canvas
	drawCanvas() {

	}

    makeSvg() {
        for (let i = 0; i < this.triangles.length; i++) {
            this.triangles[i].createSvgTri();
        }
    }

	// draws each triangle to svg
	drawSvg() {
        
	}
}

function svgTest() {
	let rows = 12;
	let columns = 10;
	let size = 150;
	let variance = 0.3;

	let points = [];
	// generating points
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			let point = {};
			// generate y coordinates of points
			point.y = (i * size * 0.801) - size;
			// shift y coordinate for each point
			point.y += (Math.random() - 0.5) * variance * size * 2;

			// even row
			if (i % 2 == 0) {
				// generate and shift x coordinates
				point.x = (j * size) - size;
				point.x += (Math.random() - 0.5) * variance * size * 2;
			}
			// odd row
			else {
				// generate and shift x coordinates
				point.x = (j * size) - size + (size / 2);
				point.x += (Math.random() - 0.5) * variance * size * 2;
			}
			points.push(point);
		}
	}

	return points;
}

let points = svgTest();

let tri = new Triangle(points[64], points[64+1], points[10+64]);
tri.createSvgTri();

function changeOpacity() {
	console.log('opacity changed');
	tri.drawSvg(0.5);
}

let button = document.querySelector('.opacity-button');
button.addEventListener('click', changeOpacity);
