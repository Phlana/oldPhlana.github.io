const animation = document.querySelector('.flashy');

function getScroll() {
	const h = document.documentElement;
	const b = document.body;
	const st = 'scrollTop';
	const sh = 'scrollHeight';

	return (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight);
}

window.addEventListener('scroll', () => {
	const scrolled = getScroll();
	// shrink flashy slightly
	const scale = 1 - scrolled;
	animation.style.transform = "scale(" + scale.toString() + ", " + scale.toString() + ")";
})
