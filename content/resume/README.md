# [Resume page & editor](https://tigeroakes.com/resume?edit)

This page of my website uses HTML and CSS to render a version of my resume in the site, rather than just linking to the PDF. \
I later migrated my workflow so that the PDF version is generated using Chrome's "Save as PDF" printer instead of being created in Microsoft Word.

Adding the `?edit` query parameter to the URL will import the [resume edit module](edit.js), which exposes some functions to the Inspector so that the resume can be edited live.

The resume content is defined in JSON, following the [JSON resume schema](https://jsonresume.org/) with a slight alteration to allow bold text in project highlights.

## See also

- [Layout file](../../layouts/_default/resume.html)
- [SCSS styles](../../assets/sass/resume)
