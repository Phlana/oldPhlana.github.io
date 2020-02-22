var animation = anime({
    targets: '.arrows',
    translateX: 500,
    rotate: '1turn',
    backgroundColor: '#F0F',
    duration: 2000,
});

document.querySelector('.button').onclick = animation.restart;
