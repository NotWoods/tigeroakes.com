function scrollToTop(duration, event) {
	event.preventDefault();
	if ('requestAnimationFrame' in window && false) {
		// TODO
	} else {
		window.scrollTo(window.scrollX, 0);
	}
}

document.getElementById('to-top')
	.addEventListener('click', scrollToTop.bind(null, 200));
