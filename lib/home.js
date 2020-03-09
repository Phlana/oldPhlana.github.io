const t = 2;

const logo = document.querySelector('.animation-wrapper');
const seek = document.querySelector('.seek');

const top_line = document.querySelector('.top');
const bottom_line = document.querySelector('.bottom');
const top_fragment = document.createDocumentFragment();
const bottom_fragment = document.createDocumentFragment();
const line_segments = 20;

for (let i = 0; i < line_segments; i++) {
	top_fragment.appendChild(document.createElement('div'));
	bottom_fragment.appendChild(document.createElement('div'));
}

top_line.appendChild(top_fragment);
bottom_line.appendChild(bottom_fragment);

const logo_animation = anime.timeline({
	loop: false
})
	.add({
		targets: '.line',
		duration: 600*t,
		translateY: function(el, i, l) {
			return [80 - i * 160, 0];
		},
		easing: 'easeOutCirc',
		delay: 200*t,
	}, 0*t)
	.add({
		targets: '.line div',
		scaleY: [0, 1],
		duration: 100*t,
		delay: function(el, i, l) {
			if (i >= 20)
				i -= 20;
			stagger = Math.abs(i - 9.5) - .5;
			return 10 * stagger * t;
		}
	}, 0*t)
	.add({
		targets: '.name',
		duration: 500*t,
		opacity: [0, 1],
		easing: 'easeOutExpo'
	}, 400*t);

// right clicking will show controls for logo animation
function unhide_controls() {
	console.log('unhidden');
	document.querySelector('.hidden').style.visibility = 'visible';
}

// disable right click on logo
document.addEventListener( "contextmenu", function(e) {	e.preventDefault(); });

logo.onclick = logo_animation.restart;
logo.oncontextmenu = unhide_controls;

document.querySelector('.play').onclick = logo_animation.play;
document.querySelector('.pause').onclick = logo_animation.pause;

// seek controls
seek.oninput = function() {
	logo_animation.seek(logo_animation.duration * (this.value/100) );
}
