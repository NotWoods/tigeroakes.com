import { update } from './update.js';
import { mergeAll } from './merge.js';

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
  /** Update HTML when any changes are made */
  set(target, key, value) {
    target[key] = value;
    update(jsonResume);
    return true;
  },
};

window.options = Object.freeze({
  /**
   * Import a new JSON Resume and display it.
   */
  async source(...urls) {
    if (urls.length === 0) throw new TypeError('Must provide at least one URL');
    const partials = await Promise.all(
      urls.map(url => fetch(url).then(res => res.json()))
    );
    jsonResume = mergeAll(...partials);
    update(jsonResume);
    /**
     * Object that calls `update()` when any properties are changed.
     */
    window.resume = new Proxy(jsonResume, proxyHandler);
    console.log(`Loaded ${urls.join()}`);
  },
});

window.Source = Object.freeze({
  ANDROID: 'json-resume/android.json',
  DEFAULT: 'json-resume/default.json',
  DESIGN: 'json-resume/design.json',
  JVM: 'json-resume/jvm.json',
  WEB: 'json-resume/web.json',
});

(async function editMode() {
  document.onpaste = e =>
    update(JSON.parse(e.clipboardData.getData('text/plain')));

  console.log('Editor mode ready. Options:');
  console.log('- Paste in a JSON resume.');
  console.log('- Set display properties on `options` object.');
  await window.options.source(window.Source.DEFAULT);
  console.log('- Edit the `resume` object properties.');
})();
