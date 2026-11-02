// Sign in with Google via Supabase Auth.
// The publishable key is safe to ship in browser code; access is controlled by Supabase.
(function () {
  const SUPABASE_URL = "https://srbyuirrcouyrxkynqhd.supabase.co";
  const SUPABASE_KEY = "sb_publishable_DtUXm7nBRlxDlkUt8gGyxw_3VSdMHxz";

  const slot = document.getElementById("auth-slot");
  if (!slot || !window.supabase) return;

  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  window.studyprepAuth = client;

  function render(user) {
    slot.innerHTML = "";
    if (user) {
      const meta = user.user_metadata || {};
      const name = meta.full_name || meta.name || user.email;

      const who = document.createElement("span");
      who.className = "auth-user";
      if (meta.avatar_url) {
        const img = document.createElement("img");
        img.src = meta.avatar_url;
        img.alt = "";
        img.referrerPolicy = "no-referrer";
        who.appendChild(img);
      }
      const label = document.createElement("span");
      label.className = "auth-name";
      label.textContent = name;
      who.appendChild(label);

      const out = document.createElement("button");
      out.type = "button";
      out.className = "btn btn-sm";
      out.textContent = "Sign out";
      out.addEventListener("click", () => client.auth.signOut());

      slot.append(who, out);
    } else {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-sm btn-google";
      btn.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">' +
        '<path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.6 13.2l7.8 6.1C12.3 13.6 17.7 9.5 24 9.5z"/>' +
        '<path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z"/>' +
        '<path fill="#FBBC05" d="M10.4 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.3.8-4.7l-7.8-6.1C1 16.5 0 20.1 0 24s1 7.5 2.6 10.8l7.8-6.1z"/>' +
        '<path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.7-4.1-13.6-9.8l-7.8 6.1C6.6 42.6 14.6 48 24 48z"/>' +
        "</svg><span>Sign in with Google</span>";
      btn.addEventListener("click", async () => {
        btn.disabled = true;
        const { error } = await client.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: window.location.origin + window.location.pathname },
        });
        if (error) {
          btn.disabled = false;
          alert("Couldn't start Google sign-in: " + error.message);
        }
      });
      slot.appendChild(btn);
    }
  }

  client.auth.getSession().then(({ data }) => render(data.session && data.session.user));
  client.auth.onAuthStateChange((_event, session) => render(session && session.user));
})();
