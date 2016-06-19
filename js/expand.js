(function(document) {
	var HIDDEN_ATTR = 'hidden';

	function toggleExpand(e) {
		var img = e.target.firstElementChild;
		var summary = e.target.parentElement.parentElement.lastElementChild;
		if (summary.tagName !== 'P') return;

		var hidden = summary.hasAttribute(HIDDEN_ATTR);
		if (hidden) {
			summary.removeAttribute(HIDDEN_ATTR);
			img.setAttribute('alt', 'Reduce summary');
			img.className = '';
		} else {
			summary.setAttribute(HIDDEN_ATTR, '');
			img.setAttribute('alt', 'Expand summary');
			img.className = 'rotate';
		}
	}

	var expands = document.getElementsByClassName('expand');
	for (var i = 0; i < expands.length; i++) {
		expands[i].addEventListener('click', toggleExpand);
	}
})(document);