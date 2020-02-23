var animation = anime({
    targets: '.arrows',
    translateX: 500,
    rotate: '1turn',
    backgroundColor: '#F0F',
    duration: 2000,
    autoplay: false
});

document.querySelector('.play').onclick = animation.play;
document.querySelector('.pause').onclick = animation.pause;
document.querySelector('.restart').onclick = animation.restart;
