import { update } from "./update.js";

let jsonResume = null;
const proxyHandler = {
  /** Recursive proxy for nested objects. */
  get(target, key) {
    if (typeof target[key] === 'object' && target[key] !== null) {
      return new Proxy(target[key], proxyHandler);
    } else {
      return target[key];
    }
  },
  set(target, key, value) {
    target[key] = value;
    update(jsonResume);
    return true;
  },
}

window.options = Object.freeze({
  /**
   * Show or hide the orange links on the resume.
   * Headers are still clickable.
   */
  toggleVisibleLinks() {
    document.body.classList.toggle('hide-links');
  },
  /**
   * Import a new JSON Resume and display it.
   */
  async source(url) {
    const res = await fetch(url);
    jsonResume = await res.json();
    update(jsonResume);
    /**
     * Object that calls `update()` when any properties are changed.
     */
    window.resume = new Proxy(jsonResume, proxyHandler);
    console.log('Done!')
  },
});

(async function editMode() {
  document.onpaste = e =>
    update(JSON.parse(e.clipboardData.getData("text/plain")));

  console.log("Editor mode ready. Options:");
  console.log("- Paste in a JSON resume.");
  console.log("- Set display properties on `options` object.");
  await window.options.source('json-resume/default.json');
  console.log("- Edit the `resume` object properties.");
})();
