// @ts-check

/**
 * Make an element stick to the top when scrolling.
 * @param {HTMLElement} element
 */
function sticky(element) {
  const stickyThreshold = element.offsetTop;
  function onScroll() {
    if (window.pageYOffset >= stickyThreshold) {
      element.classList.add('article__toc--sticky');
    } else {
      element.classList.remove('article__toc--sticky');
    }
  }

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}

/**
 * Call the listener whenever query changes.
 * @template T
 * @param {MediaQueryList} query Media query to watch.
 * @param {T} defaultResult Initial result to pass in.
 * @param {(matches: boolean, prevResult: T) => T} callback
 */
function watchMedia(query, defaultResult, callback) {
  let result = callback(query.matches, defaultResult);
  query.addEventListener('change', (evt) => {
    result = callback(evt.matches, result);
  });
}

/** @type {HTMLElement} */
const toc = document.querySelector('.article__toc-inner');
const sidebarHide = matchMedia('(max-width: 60rem)');
const noop = () => {};

watchMedia(sidebarHide, noop, (matches, unsubscribe) => {
  unsubscribe();
  if (!matches) {
    return sticky(toc);
  } else {
    return noop;
  }
});
