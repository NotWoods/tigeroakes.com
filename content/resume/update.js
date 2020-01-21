/**
 * Script to update the resume UI client side
 */
export function update(data) {
    // Header
    document.querySelector('.name').textContent = data.basics.name;
    document.querySelector('.summary').textContent = data.basics.summary;
    const email = document.querySelector('.resume-email');
    email.textContent = data.basics.email;
    email.href = `mailto:${data.basics.email}`;
    document.querySelector(
        '.resume-city'
    ).textContent = `${data.basics.location.city}, ${data.basics.location.region} (US Citizen)`;
    const github = document.querySelector('.resume-github');
    const githubData = data.basics.profiles.find(p => p.network === 'GitHub');
    github.textContent = `github.com/${githubData.username}`;
    github.href = githubData.url;

    // Education
    document.querySelector('.education').innerHTML = data.education
        .map(
            e => `
              <h5>${formatDates(e.startDate, e.endDate)}</h5>
              <h2>
                <span class="institution">${e.institution}</span>
                <span class="position">${e.studyType} in ${
                        e.area
                    }, 4<sup>th</sup> year</span>
              </h2>
            `
        )
        .join('');

    // Work Experience
    document.querySelector('.work-experience').innerHTML = data.work
        .map(
            w => `
              <h5>${formatDates(w.startDate, w.endDate)}</h5>
              <h2>
                <a href="${w.website}" class="company">${w.company}</a>,
                <span class="position">${w.position}</span>
              </h2>
              ${w.summary ? `<em>${w.summary}</em>` : ''}
              ${highlights(w.highlights)}
            `
        )
        .join('');

    // Skills
    document.querySelector('.skills').textContent = data.skills
        .map(s => s.name)
        .join(' | ');

    // Awards
    document.querySelector('.awards').innerHTML = data.awards
        .map(a => `<li>${a.title}</li>`)
        .join('');

    // Selected Projects
    document.querySelector('.resume-projects').innerHTML = data.projects
        .map(
            p => `
              <h5>${formatDates(p.startDate, p.endDate)}</h5>
              <h2><a href="${p.url}" class="company">${p.name}</a></h2>
              ${p.description ? `<em>${p.description}</em>` : ''}
              ${highlights(p.highlights)}
            `
        )
        .join('');
}

function formatDate(date) {
    return date
        .split('-', 2)
        .reverse()
        .join('/');
}
function formatDates(start, end) {
    if (!start) {
        return '';
    } else if (end === start) {
        return `${formatDate(start)}`;
    } else if (!end) {
        return `${formatDate(start)} - Present`;
    } else {
        return `${formatDate(start)} - ${formatDate(end)}`;
    }
}

function markdownify(md) {
    return md.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function highlights(data) {
    return `<ul>
    ${data.map(h => `<li>${markdownify(h)}</li>`).join('')}
  </ul>`;
}

function title(name, url) {
    return `<h2><a href="${url}">${name}</a></h2>`;
}
