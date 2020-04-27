const t = 2;

const logo = document.querySelector('.animation-wrapper');
const seek = document.querySelector('.seek');
const play = document.querySelector('.play');
const pause = document.querySelector('.pause');

const topLine = document.querySelector('.top');
const bottomLine = document.querySelector('.bottom');
const topFragment = document.createDocumentFragment();
const bottomFragment = document.createDocumentFragment();
const lineSegments = 20;

for (let i = 0; i < lineSegments; i++) {
	topFragment.appendChild(document.createElement('div'));
	bottomFragment.appendChild(document.createElement('div'));
}

topLine.appendChild(topFragment);
bottomLine.appendChild(bottomFragment);

// main animation
const logoAnimation = anime.timeline({
	loop: true,
	// direction: 'alternate',
	update: function(anim) {
		seek.value = anim.progress;
	}
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
}, 400*t)
.add({
	targets: '.animation-wrapper',
	duration: 300*t,
	endDelay: 200*t,
	opacity: [1, 0],
	easing: 'linear'
});

// right clicking will show controls for logo animation
function unhideControls() {
	document.querySelector('.hidden').style.visibility = 'visible';
}

// disable right click on logo
logo.addEventListener( 'contextmenu', function(e) {	e.preventDefault(); });

logo.oncontextmenu = unhideControls;
logo.onclick = logoAnimation.restart;
play.onclick = logoAnimation.play;
pause.onclick = logoAnimation.pause;

// seek controls
seek.oninput = function() {
	logoAnimation.seek(logoAnimation.duration * (this.value/100));
}

// // getting 100vh and positioning elements
// const content = document.querySelector('.content');
// function position() {
// 	const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
// 	content.style.top = (height - 128).toString() + 'px';
// 	console.log('repositioned')
// }

// window.addEventListener('resize', position);
// // initial position
// position();
