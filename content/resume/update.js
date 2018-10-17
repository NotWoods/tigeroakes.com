/**
 * Script to update the resume UI client side
 */
export function update(data) {
  // Header
  document.querySelector(".name").textContent = data.basics.name;
  document.querySelector(".summary").textContent = data.basics.summary;
  const email = document.querySelector(".resume-email");
  email.textContent = data.basics.email;
  email.href = `mailto:${data.basics.email}`;
  const website = document.querySelector(".resume-website");
  website.textContent = data.basics.website.replace(/https?:\/\//, "");
  website.href = data.basics.website;
  document.querySelector(".resume-city").textContent = `${
    data.basics.location.city
    }, ${data.basics.location.region}`;
  const github = document.querySelector(".resume-github");
  const githubData = data.basics.profiles.find(p => p.network === "GitHub");
  github.textContent = `github.com/${githubData.username}`;
  github.href = githubData.url;

  // Education
  document.querySelector(".education").innerHTML = data.education
    .map(
      e => `
    <h5>
      ${formatDate(e.startDate)} - ${formatDate(e.endDate)}
      <span class="right">(expected with co-op)</span>
    </h5>
    <h2>${e.institution}</h2>
    <h4>
      ${e.studyType} in ${e.area},
      3<sup>rd</sup> year
    </h4>
  `
    )
    .join("");

  // Work Experience
  document.querySelector(".work-experience").innerHTML = data.work
    .map(
      w => `
      <h5>
        ${formatDates(w.startDate, w.endDate)}
        <a class="right resume-link${w.website.length > 35 ? " tight" : ""}" href="${
          w.website
          }">
          ${w.website.replace(/https?:\/\//, "")}
        </a>
      </h5>
      ${title(w.company, w.website)}
      <h4>${w.position}</h4>
      ${w.summary ? `<em>${w.summary}</em>` : ""}
      ${highlights(w.highlights)}
    `)
    .join("");

  // Skills
  document.querySelector(".skills").textContent = data.skills
    .map(s => s.name)
    .join(" | ");

  // Awards
  document.querySelector(".awards").innerHTML = data.awards
    .map(a => `<li>${a.title}</li>`)
    .join("");

  // Selected Projects
  document.querySelector(".resume-projects").innerHTML = data.projects
    .map(
      p => `
      ${p.startDate ? `<h5>${formatDates(p.startDate, p.endDate)}</h5>` : ''}
      ${title(p.name, p.url)}
      ${p.description ? `<em>${p.description}</em>` : ""}
      ${highlights(p.highlights)}
    `)
    .join("");
}

function formatDate(date) {
  return date
    .split("-", 2)
    .reverse()
    .join("/");
}
function formatDates(start, end) {
  if (end === start) {
    return `${formatDate(start)}`;
  } else if (!end) {
    return `${formatDate(start)} - Present`;
  } else {
    return `${formatDate(start)} - ${formatDate(end)}`;
  }
}

function markdownify(md) {
  return md.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function highlights(data) {
  return `<ul>
    ${data.map(h => `<li>${markdownify(h)}</li>`).join("")}
  </ul>`;
}

function title(name, url) {
  return `<h2><a href="${url}">${name}</a></h2>`
}
