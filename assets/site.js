// ---- EDIT ME: the one place that sets where all sign-up / inquiry emails go ----
const CONTACT_EMAIL = "hello@example.com";

const mail = (subject, body = "") =>
  "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) + (body ? "&body=" + encodeURIComponent(body) : "");

// Any element with data-mail="Subject" becomes a mailto link.
document.querySelectorAll("[data-mail]").forEach(el => {
  el.setAttribute("href", mail(el.dataset.mail, el.dataset.body || ""));
});

// Sponsor inquiry form -> opens the visitor's mail app with the fields filled in.
const f = document.getElementById("inquiry");
if (f) f.addEventListener("submit", e => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(f));
  const body = `Company: ${d.company}\nContact: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone || "-"}\nPackage: ${d.pkg}\n\n${d.message || ""}`;
  location.href = mail("Sponsorship inquiry: " + d.company, body);
});

// Workshops list from workshops.json
const list = document.getElementById("ws-list");
if (list) {
  const filters = document.getElementById("filters");
  let all = [], cur = "all";
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const render = () => {
    list.innerHTML = all.filter(w => cur === "all" || w.format === cur).map(w => `
      <article class="card ws">
        <div class="top"><h3>${esc(w.title)}</h3><span class="price">€${w.price}</span></div>
        <div class="tags">${w.tags.map(t => `<span class="tag-s">${esc(t)}</span>`).join("")}</div>
        <div class="meta"><span class="status">${esc(w.status)}</span><span>${esc(w.dates)}</span><span>${esc(w.city)}</span><span>${esc(w.group)}</span></div>
        <a class="btn btn-ghost" href="${mail("Waitlist: " + w.title, "Hi! Please add me to the waitlist for \"" + w.title + "\".")}">Join the waitlist</a>
      </article>`).join("");
  };
  filters.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    cur = b.dataset.f;
    filters.querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b));
    render();
  });
  fetch("workshops.json").then(r => r.json()).then(j => { all = j; render(); })
    .catch(() => list.innerHTML = "<p>Workshops are announced soon. Join the waitlist below.</p>");
}
