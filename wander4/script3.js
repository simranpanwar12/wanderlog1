const $ = id => document.getElementById(id);
const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } };
const esc = s => String(s).replace(/[&<>"']/g, c => "&#" + c.charCodeAt(0) + ";");
const day = d => (d ? new Date(d + "T00:00").toLocaleDateString(undefined, { dateStyle: "medium" }) : "");

const p = load("wanderlog_profile", {});
let trips = load("wanderlog_trips", []);
let photo = "", timer;                                       // photo = Base64 text
const user = new URLSearchParams(location.search).get("user");   // ?user=name
const viewing = user !== null;                               // true = public profile mode

// Small message at the bottom of the screen (saved / error)
function toast(msg, bad) {
  $("toast").textContent = msg;
  $("toast").className = bad ? "show bad" : "show";
  clearTimeout(timer);
  timer = setTimeout(() => ($("toast").className = ""), 2800);
}

// ----- Cards (i is given only on the list, so the title becomes a button) -----
function card(t, i) {
  const img = t.photo
    ? `<img src="${t.photo}" alt="Cover photo for ${esc(t.title)}" onerror="this.outerHTML='<div class=placeholder>Photo could not be loaded</div>'">`
    : '<div class="placeholder">No photo added</div>';
  const title = i === undefined ? esc(t.title) : `<button class="open" data-i="${i}">${esc(t.title)}</button>`;
  return `${img}<div class="card-body"><h3>${title}</h3><p class="hint">${esc(t.place)} · ${day(t.date)}</p></div>`;
}

function render() {
  $("tripGrid").innerHTML = trips.length
    ? trips.map((t, i) => `<article class="card">${card(t, i)}</article>`).join("")
    : `<p class="empty">${viewing ? "This traveler has not added any trips yet." : "No trips yet. Add your first trip above."}</p>`;
}

$("tripGrid").onclick = e => {
  const b = e.target.closest(".open");
  if (!b) return;
  const t = trips[b.dataset.i];
  $("detailBody").innerHTML = card(t) + `<p>${esc(t.notes) || "No notes for this trip."}</p>`;
  $("detail").showModal();
};
$("closeDetail").onclick = () => $("detail").close();
$("detail").onclick = e => e.target === $("detail") && $("detail").close();   // click outside to close

// ----- Public profile mode -----
if (viewing) {
  $("editor").hidden = true;
  if ((p.username || "").toLowerCase() === user.toLowerCase()) {
    $("headName").textContent = p.name;
    $("headBio").textContent = p.bio || "This traveler has not written a bio yet.";
    $("profileHead").hidden = false;
    document.title = p.name + " · Wanderlog";
  } else {
    trips = [];
    $("notFound").hidden = false;
    $("tripsSection").hidden = true;
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
    const name = $("pName").value.trim(), username = $("pUser").value.trim();
    if (!name || !username) return toast("Add your name and a username.", true);
    Object.assign(p, { name, username, bio: $("pBio").value.trim() });
    localStorage.setItem("wanderlog_profile", JSON.stringify(p));
    showLink();
    toast("Profile saved.");
  };

  // Photo preview + Base64
  $("photo").onchange = () => {
    const file = $("photo").files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { $("photo").value = ""; return toast("Please choose an image file.", true); }
    if (file.size > 2e6) { $("photo").value = ""; return toast("That photo is over 2 MB. Choose a smaller one.", true); }
    $("previewMsg").textContent = "Reading photo…";
    const reader = new FileReader();
    reader.onload = () => {
      photo = reader.result;
      $("preview").src = photo;
      $("preview").hidden = false;
      $("previewMsg").hidden = true;
    };
    reader.onerror = () => { $("previewMsg").textContent = "No photo chosen yet."; toast("Could not read that photo.", true); };
    reader.readAsDataURL(file);
  };

  // Save trip
  $("tripForm").onsubmit = e => {
    e.preventDefault();
    const title = $("title").value.trim(), place = $("place").value.trim();
    if (!title || !place) return toast("Add a title and a destination.", true);
    trips.push({ title, place, date: $("date").value, notes: $("notes").value.trim(), photo });
    try {
      localStorage.setItem("wanderlog_trips", JSON.stringify(trips));
    } catch {
      trips.pop();
      return toast("Not enough browser storage. Try a smaller photo.", true);
    }
    e.target.reset();
    photo = "";
    $("preview").hidden = true;
    $("previewMsg").hidden = false;
    $("previewMsg").textContent = "No photo chosen yet.";
    render();
    toast("Trip saved.");
  };
}

render();