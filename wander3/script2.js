const $ = id => document.getElementById(id);
const load = (key, fallback) => JSON.parse(localStorage.getItem(key)) || fallback;
const esc = s => s.replace(/[&<>"]/g, c => "&#" + c.charCodeAt(0) + ";");

const p = load("wanderlog_profile", {});
let trips = load("wanderlog_trips", []);
let photo = "";                                              // Base64 text of the photo
const user = new URLSearchParams(location.search).get("user");   // ?user=name
const viewing = user !== null;                               // true = public profile mode

// ----- Cards -----
const card = t => {
  const img = t.photo
    ? `<img src="${t.photo}" alt="" onerror="this.outerHTML='<div class=placeholder>Photo could not be loaded</div>'">`
    : '<div class="placeholder">No photo</div>';
  return `${img}<div class="card-body"><h3>${esc(t.title)}</h3><p class="hint">${esc(t.place)} · ${t.date}</p></div>`;
};

function render() {
  $("tripGrid").innerHTML = trips.length
    ? trips.map((t, i) => `<article class="card" data-i="${i}">${card(t)}</article>`).join("")
    : `<p class="empty">${viewing ? "This traveler has not added any trips yet." : "No trips yet. Add your first trip above."}</p>`;
}

$("tripGrid").onclick = e => {
  const c = e.target.closest(".card");
  if (!c) return;
  const t = trips[c.dataset.i];
  $("detailBody").innerHTML = card(t) + `<p>${esc(t.notes) || "No notes for this trip."}</p>`;
  $("detail").showModal();
};
$("closeDetail").onclick = () => $("detail").close();

// ----- Public profile mode -----
if (viewing) {
  $("editor").hidden = true;
  if ((p.username || "").toLowerCase() === user.toLowerCase()) {
    $("headName").textContent = p.name;
    $("headBio").textContent = p.bio || "This traveler has not written a bio yet.";
    $("profileHead").hidden = false;
  } else {
    trips = [];
    $("notFound").hidden = false;
    $("tripGrid").parentElement.hidden = true;
  }
}

// ----- Journal mode -----
else {
  $("pName").value = p.name || "";
  $("pUser").value = p.username || "";
  $("pBio").value = p.bio || "";

  const showLink = () => {
    if (!p.username) return;
    $("profileLink").href = "?user=" + encodeURIComponent(p.username);
    $("profileLink").hidden = false;
  };
  showLink();

  $("profileForm").onsubmit = e => {
    e.preventDefault();
    Object.assign(p, { name: $("pName").value, username: $("pUser").value, bio: $("pBio").value });
    localStorage.setItem("wanderlog_profile", JSON.stringify(p));
    showLink();
  };

  // Photo preview + Base64
  $("photo").onchange = () => {
    const file = $("photo").files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      photo = reader.result;
      $("preview").src = photo;
      $("preview").hidden = false;
      $("previewMsg").hidden = true;
    };
    reader.readAsDataURL(file);
  };

  // Save trip
  $("tripForm").onsubmit = e => {
    e.preventDefault();
    trips.push({ title: $("title").value, place: $("place").value, date: $("date").value, notes: $("notes").value, photo });
    try {
      localStorage.setItem("wanderlog_trips", JSON.stringify(trips));
    } catch {
      trips.pop();
      return alert("Photo is too large to save. Choose a smaller image.");
    }
    e.target.reset();
    photo = "";
    $("preview").hidden = true;
    $("previewMsg").hidden = false;
    render();
  };
}

render();