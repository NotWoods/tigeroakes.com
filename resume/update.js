/**
 * Script to update the resume UI client side
 */
function update(data) {
  // Header
  document.querySelector('.name').textContent = data.basics.name;
  document.querySelector('.summary').textContent = data.basics.summary;
  const email = document.querySelector('.resume-email');
  email.textContent = data.basics.email;
  email.href = `mailto:${data.basics.email}`;
  const website = document.querySelector('.resume-website');
  website.textContent = data.basics.website.replace(/https?:\/\//, '');
  website.href = data.basics.website;
  document.querySelector('.resume-city').textContent = `${data.basics.location.city}, ${data.basics.location.region}`;
  const github = document.querySelector('.resume-github');
  const githubData = data.basics.profiles.find(p => p.network === 'GitHub');
  github.textContent = `github.com/${githubData.username}`;
  github.href = githubData.url;

  // Education
  document.querySelector('.education').innerHTML = data.education.map(e => `
    <h4 class="noblock">
      ${formatDate(e.startDate)} - ${formatDate(e.endDate)}
      <span class="right">(expected with co-op)</span>
    </h4>
    <h2>${e.institution}</h2>
    <h3>
      ${e.studyType} in ${e.area},
      3<sup>rd</sup> year
    </h3>
  `).join('');

  // Work Experience
  document.querySelector('.work-experience').innerHTML = data.work.map(w => `
    <h4>
      ${formatDate(w.startDate)} - ${formatDate(w.endDate)}
      <a class="right${w.website.length > 35 ? ' tight' : ''}" href="${w.website}">
        ${w.website.replace(/https?:\/\//, '')}
      </a>
    </h4>
    <h2>${w.company}</h2>
    <h3>${w.position}</h3>
    ${w.summary ? `<em>${w.summary}</em>` : ''}
    ${highlights(w.highlights)}
  `).join('');

  // Skills
  document.querySelector('.skills').textContent = data.skills
    .map(s => s.name)
    .join(' | ');

  // Awards
  document.querySelector('.awards').innerHTML = data.awards
    .map(a => `<li>${a.title}</li>`)
    .join('');

  // Selected Projects
  document.querySelector('.resume-projects').innerHTML = data.projects.map(p => `
    <h4>
      ${formatDate(p.startDate)}
      ${p.endDate == p.startDate ? '' : `- ${formatDate(p.endDate)}`}
    </h4>
    <h2>${p.name}</h2>
    ${p.description ? `<em>${p.description}</em>` : ''}
    ${highlights(p.highlights)}
  `).join('');
}

function formatDate(date) {
  return date.split('-').reverse().join('/');
}

function markdownify(md) {
  return md.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function highlights(data) {
  return `<ul>
    ${data.map(h => `<li>${markdownify(h)}</li>`).join('')}
  </ul>`;
}

Object.defineProperty(window, 'resume', { set: update });
function editMode() {
  document.onpaste = e => update(JSON.parse(e.clipboardData.getData('text/plain')));
}

// https://stackoverflow.com/questions/7798748/find-out-whether-chrome-console-is-open
const devtools = /./;
devtools.toString = editMode;
console.log('%c', devtools);
