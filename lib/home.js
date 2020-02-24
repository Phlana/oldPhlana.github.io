let t1 = anime.timeline({
	loop: false
})
	.add({
		targets: '.top',
		scaleY: [0,1],
		easing: 'linear',
		duration: 100,
		delay: anime.stagger(100)
	}, 0)
	.add({
		targets: '.bottom',
		scaleY: [0,1],
		easing: 'linear',
		duration: 100,
		delay: anime.stagger(100)
	}, 0)
	.add({
		targets: '.top',
		duration: 600,
		translateY: -60,
		easing: 'easeOutCirc'
	}, 200)
	.add({
		targets: '.bottom',
		duration: 600,
		translateY: 60,
		easing: 'easeOutCirc'
	}, 200)
	.add({
		targets: '.name',
		duration: 2000,
		opacity: [0, 1]
	}, 600);

document.querySelector('.animation-wrapper').onclick = t1.restart;
