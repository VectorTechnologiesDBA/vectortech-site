// Account page for VTCS, the Vector Tech Community Server (server.vectortech.dev). The page is static; everything it shows
// comes from the server's API, which allows this site's origin (CORS).
"use strict";
const API = "https://server.vectortech.dev:8443";
const $ = id => document.getElementById(id);
let token = "";
try { token = localStorage.getItem("vppToken") || ""; } catch (e) {}
let kgCurrent = {};

async function call(method, path, body) {
  const opt = { method, headers: {} };
  if (token) opt.headers.Authorization = "Bearer " + token;
  if (body !== undefined) { opt.headers["Content-Type"] = "application/json"; opt.body = JSON.stringify(body); }
  const r = await fetch(API + path, opt);
  let j = {};
  try { j = await r.json(); } catch (e) {}
  if (r.status === 401) { signedOut(); throw new Error("Please sign in again."); }
  if (!r.ok) throw new Error(j.message || ("Error " + r.status));
  return j;
}
function say(id, text, ok) { const m = $(id); m.textContent = text; m.className = "msg " + (ok ? "ok" : "err"); }
function setToken(t) { token = t; try { t ? localStorage.setItem("vppToken", t) : localStorage.removeItem("vppToken"); } catch (e) {} }
function signedOut() { setToken(""); $("account").classList.add("hidden"); $("signup").classList.add("hidden"); $("signin").classList.remove("hidden"); }
function unreachable(e) { return e instanceof TypeError ? new Error("Can't reach the server right now. Try again in a bit.") : e; }

$("signinForm").onsubmit = async ev => {
  ev.preventDefault();
  say("signinMsg", "Signing in…", true);
  try {
    const j = await call("POST", "/v1/sessions", { username: $("email").value, password: $("pw").value });
    setToken(j.session.session_token);
    $("pw").value = ""; say("signinMsg", "", true);
    load();
  } catch (e) { say("signinMsg", unreachable(e).message); }
};
$("toSignup").onclick = ev => { ev.preventDefault(); $("signin").classList.add("hidden"); $("signup").classList.remove("hidden"); };
$("toSignin").onclick = ev => { ev.preventDefault(); $("signup").classList.add("hidden"); $("signin").classList.remove("hidden"); };
$("signupForm").onsubmit = async ev => {
  ev.preventDefault();
  const email = $("suEmail").value.trim(), pw = $("suPw").value;
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,32}$/.test(pw)) return say("signupMsg", "Use 8-32 characters with upper and lower case letters and a number.");
  if (pw !== $("suPw2").value) return say("signupMsg", "The passwords don't match.");
  say("signupMsg", "Creating your account…", true);
  try {
    await call("POST", "/v1/create_user", { username: email, password: pw });
    const j = await call("POST", "/v1/sessions", { username: email, password: pw });
    setToken(j.session.session_token);
    $("suPw").value = $("suPw2").value = ""; say("signupMsg", "", true);
    $("signup").classList.add("hidden");
    load();
  } catch (e) { say("signupMsg", unreachable(e).message); }
};
$("logout").onclick = async () => { try { await call("POST", "/v1/logout"); } catch (e) {} signedOut(); };

async function load() {
  if (!token) return signedOut();
  try {
    const me = await call("GET", "/v1/me");
    $("who").textContent = me.email;
    $("signin").classList.add("hidden"); $("account").classList.remove("hidden");
    showBots(me.robots);
    const w = await call("GET", "/api/get_weather_api");
    $("wProvider").value = w.provider || ""; $("wKey").value = w.key || ""; $("wUnit").value = w.unit || "";
    const k = kgCurrent = await call("GET", "/api/get_kg_api");
    $("kProvider").value = k.provider || ""; $("kKey").value = k.key || ""; $("kId").value = k.id || "";
    $("kModel").value = k.model || ""; $("kEndpoint").value = k.endpoint || ""; $("kName").value = k.robotName || "";
    $("kPrompt").value = k.openai_prompt || ""; $("kIntent").checked = !!k.intentgraph;
    $("kCommands").checked = !!k.commands_enable; $("kSave").checked = !!k.save_chat;
    kgFields();
  } catch (e) { if (token) { $("signin").classList.remove("hidden"); say("signinMsg", unreachable(e).message); } }
}

function showBots(robots) {
  const box = $("bots"); box.textContent = "";
  if (!robots.length) { box.innerHTML = '<p class="meta">No Vectors yet. Set one up in the Vector app while signed in, and it joins your account.</p>'; return; }
  for (const b of robots) {
    const d = document.createElement("div"); d.className = "bot";
    d.innerHTML = '<div class="row"><div><div class="esn"></div><div class="meta"></div></div><button class="btn danger">Remove</button></div>' +
      '<label>Weather location</label><div class="row"><input placeholder="City, e.g. Dallas, Texas"><button class="btn">Save</button></div><div class="msg"></div>';
    d.querySelector(".esn").textContent = "Vector " + b.esn;
    d.querySelector(".meta").textContent = "Added " + new Date(b.claimed).toLocaleDateString() + (b.seen ? " · connected to the server" : " · not connected right now");
    const loc = d.querySelector("input"), msg = d.querySelector(".msg");
    const [rm, save] = d.querySelectorAll("button");
    const note = (t, ok) => { msg.textContent = t; msg.className = "msg " + (ok ? "ok" : "err"); };
    if (b.seen) call("GET", "/api-sdk/get_sdk_settings?serial=" + b.esn).then(s => { loc.value = s.default_location || ""; }).catch(() => {});
    else { loc.disabled = save.disabled = true; loc.placeholder = "Turn Vector on to change this"; }
    save.onclick = async () => {
      try { await call("GET", "/api-sdk/location?serial=" + b.esn + "&location=" + encodeURIComponent(loc.value.trim())); note("Saved.", true); }
      catch (e) { note(e.message); }
    };
    rm.onclick = async () => {
      if (!confirm("Remove Vector " + b.esn + " from your account? It can then be set up on any account.")) return;
      try { await call("POST", "/v1/robots/release", { esn: b.esn }); d.remove(); if (!box.children.length) showBots([]); }
      catch (e) { note(e.message); }
    };
    box.appendChild(d);
  }
}

$("weatherForm").onsubmit = async ev => {
  ev.preventDefault();
  const body = { provider: $("wProvider").value, key: $("wKey").value.trim() };
  if ($("wUnit").value) body.unit = $("wUnit").value;
  if (body.provider && !body.key) return say("weatherMsg", "Enter an API key.");
  try { await call("POST", "/api/set_weather_api", body); say("weatherMsg", "Saved.", true); } catch (e) { say("weatherMsg", e.message); }
};

function kgFields() {
  const p = $("kProvider").value;
  document.querySelectorAll("[data-for]").forEach(el => el.classList.toggle("hidden", !p || !el.dataset.for.split(" ").includes(p)));
  $("kKeyLabel").textContent = p === "houndify" ? "Client key" : "API key";
}
$("kProvider").onchange = kgFields;

$("kgForm").onsubmit = async ev => {
  ev.preventDefault();
  const p = $("kProvider").value;
  const body = Object.assign({}, kgCurrent, {
    enable: p !== "", provider: p, key: $("kKey").value.trim(), id: $("kId").value.trim(), model: $("kModel").value.trim(),
    endpoint: $("kEndpoint").value.trim(), robotName: $("kName").value.trim(), openai_prompt: $("kPrompt").value,
    intentgraph: $("kIntent").checked, commands_enable: $("kCommands").checked, save_chat: $("kSave").checked
  });
  if (p && !body.key) return say("kgMsg", "Enter the key.");
  if (p === "houndify" && !body.id) return say("kgMsg", "Enter the Houndify client ID.");
  if (p === "custom" && !body.endpoint) return say("kgMsg", "Enter the endpoint URL.");
  try { await call("POST", "/api/set_kg_api", body); kgCurrent = body; say("kgMsg", "Saved.", true); } catch (e) { say("kgMsg", e.message); }
};

load();
