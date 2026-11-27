const list = document.querySelector("#tasks");
const health = document.querySelector("#health");
async function api(url, options={}) {
  const response = await fetch(url, { headers: {"Content-Type":"application/json"}, ...options });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${response.status})`);
  }
  return response.status === 204 ? null : response.json();
}
async function load() {
  try {
    const [tasks, status] = await Promise.all([api("/api/tasks"), api("/health")]);
    health.textContent = `Service healthy · ${status.version}`;
    list.innerHTML = "";
    if (!tasks.length) list.innerHTML = '<div class="empty">No tasks yet. Add your first task above.</div>';
    tasks.forEach(task => {
      const card = document.createElement("article"); card.className = "task";
      const info = document.createElement("div");
      const title = document.createElement("h3"); title.textContent = task.title;
      const desc = document.createElement("p"); desc.textContent = task.description || "No description";
      info.append(title, desc);
      const actions = document.createElement("div"); actions.className = "actions";
      const select = document.createElement("select");
      [["pending","Pending"],["in-progress","In progress"],["done","Done"]].forEach(([v,l]) => {
        const option = document.createElement("option"); option.value=v; option.textContent=l; select.append(option);
      });
      select.value = task.status;
      select.addEventListener("change", async () => { try { await api(`/api/tasks/${task.id}`, {method:"PATCH",body:JSON.stringify({status:select.value})}); load(); } catch(e){alert(e.message);} });
      const del = document.createElement("button"); del.className="delete"; del.textContent="Delete";
      del.addEventListener("click", async () => { try { await api(`/api/tasks/${task.id}`, {method:"DELETE"}); load(); } catch(e){alert(e.message);} });
      actions.append(select, del); card.append(info, actions); list.append(card);
    });
  } catch(e) { health.textContent = "Service unavailable"; list.textContent = e.message; }
}
document.querySelector("#task-form").addEventListener("submit", async e => {
  e.preventDefault();
  try {
    await api("/api/tasks", {method:"POST",body:JSON.stringify({title:document.querySelector("#title").value,description:document.querySelector("#description").value})});
    e.target.reset(); load();
  } catch(err) { alert(err.message); }
});
document.querySelector("#refresh").addEventListener("click", load);
load();