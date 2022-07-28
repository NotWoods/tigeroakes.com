function setupToc() {
  const tableOfContents = document.getElementById('table-of-contents');
  if (!tableOfContents) {
    return;
  }

  let lastHighlightedHeaderLink: HTMLAnchorElement | undefined;

  /**
   * Update the highlighted link in the table of contents.
   */
  function setHighlightedHeaderId(id: string) {
    if (lastHighlightedHeaderLink) {
      lastHighlightedHeaderLink.removeAttribute('aria-current');
    }

    const link = tableOfContents.querySelector<HTMLAnchorElement>(
      `a[href="#${id}"]`
    );
    if (link) {
      link.setAttribute('aria-current', 'location');

      lastHighlightedHeaderLink = link;
    } else {
      lastHighlightedHeaderLink = undefined;
    }
  }

  const headingsObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setHighlightedHeaderId(entry.target.id);
          break;
        }
      }
    },
    {
      // Negative bottom margin means heading needs to be towards top of viewport to trigger intersection.
      rootMargin: '0% 0% -66%',
      threshold: 1,
    }
  );

  // Observe all the headings in the main page content.
  document
    .querySelectorAll('.prose :is(h1,h2,h3,h4,h5,h6)')
    .forEach((h) => headingsObserver.observe(h));
}

setupToc();

export {};
