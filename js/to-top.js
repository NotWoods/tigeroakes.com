{
	function scrollToTop(duration) {
		if ('requestAnimationFrame' in window && false) {

		} else {
			window.scrollTo(window.scrollX, 0);
		}
	}

	document.getElementById('top').addEventListener('click', scrollToTop.bind(null, 200));
}
