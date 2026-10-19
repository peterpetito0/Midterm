(function () {
  const STORE_KEY = "studyprep.v1";
  const STEP_NAMES = ["Course", "Exam & topics", "Materials", "Study"];
  const CONF_LABELS = { 1: "Not confident", 2: "Somewhat", 3: "Confident" };
  const SESSION_MINUTES = 40;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // ---------- State ----------
  function defaultState() {
    return {
      step: 0, course: null, examType: "midterm", examDate: "", hoursPerDay: 1.5, format: "",
      topics: [], files: [], notes: "", hints: "",
      progress: { quiz: {}, known: [], done: [] }
    };
  }
  let state;
  try { state = Object.assign(defaultState(), JSON.parse(localStorage.getItem(STORE_KEY)) || {}); }
  catch { state = defaultState(); }

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
    catch { alert("Your browser storage is full, so some uploaded slides may not be saved. Try removing a large file."); }
  }

  function course() { return window.COURSES[state.course]; }
  function selectedTopics() { return state.topics.filter((t) => t.selected); }

  function setCourse(id) {
    if (state.course === id) return;
    state.course = id;
    state.topics = window.COURSES[id].topics.map((name) => ({ name, selected: true, confidence: 2, custom: false }));
    state.progress = { quiz: {}, known: [], done: [] };
  }

  // Preselect a course from the landing page link.
  const urlCourse = new URLSearchParams(location.search).get("course");
  if (urlCourse && window.COURSES[urlCourse]) {
    setCourse(urlCourse);
    if (state.step === 0) state.step = 1;
    save();
    history.replaceState(null, "", "study.html");
  }

  // ---------- Step navigation ----------
  function goTo(step) {
    if (step > 0 && !state.course) { alert("Pick a course first."); step = 0; }
    if (step > 1 && !selectedTopics().length) { alert("Select at least one topic."); step = 1; }
    state.step = step;
    save();
    render();
    window.scrollTo(0, 0);
  }

  function renderProgress() {
    $("#progress").innerHTML = STEP_NAMES.map((n, i) =>
      `<span class="pill ${i === state.step ? "active" : i < state.step ? "done" : ""}">${i + 1}. ${n}</span>`
    ).join("");
  }

  function render() {
    renderProgress();
    $$(".step").forEach((el) => el.classList.toggle("hidden", Number(el.dataset.step) !== state.step));
    [renderCourseStep, renderExamStep, renderMaterialsStep, renderDashboard][state.step]();
  }

  $$("[data-next]").forEach((b) => b.addEventListener("click", () => { collectInputs(); goTo(state.step + 1); }));
  $$("[data-prev]").forEach((b) => b.addEventListener("click", () => { collectInputs(); goTo(state.step - 1); }));
  $$("[data-goto]").forEach((b) => b.addEventListener("click", () => goTo(Number(b.dataset.goto))));
  $("#reset-btn").addEventListener("click", () => {
    if (confirm("Clear your exam setup, uploaded slides and progress?")) {
      state = defaultState();
      save();
      render();
    }
  });

  function collectInputs() {
    if (state.step === 1) {
      state.examType = $("#exam-type").value;
      state.examDate = $("#exam-date").value;
      state.hoursPerDay = Math.max(0.5, parseFloat($("#exam-hours").value) || 1.5);
      state.format = $("#exam-format").value.trim();
    } else if (state.step === 2) {
      state.notes = $("#notes").value;
      state.hints = $("#professor-hints").value;
    }
  }

  // ---------- Step 1: course ----------
  function renderCourseStep() {
    const box = $("#course-choices");
    box.innerHTML = "";
    for (const [id, c] of Object.entries(window.COURSES)) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "choice" + (state.course === id ? " selected" : "");
      b.innerHTML = `<div class="icon">${c.icon}</div><strong>${esc(c.name)}</strong><span>${esc(c.blurb)}</span>`;
      b.addEventListener("click", () => { setCourse(id); save(); renderCourseStep(); });
      box.appendChild(b);
    }
  }

  // ---------- Step 2: exam & topics ----------
  function renderExamStep() {
    $("#exam-type").value = state.examType;
    $("#exam-date").value = state.examDate;
    $("#exam-hours").value = state.hoursPerDay;
    $("#exam-format").value = state.format;
    const list = $("#topic-list");
    list.innerHTML = "";
    state.topics.forEach((t, i) => {
      const row = document.createElement("div");
      row.className = "topic-item";
      row.innerHTML = `
        <input type="checkbox" id="t${i}" ${t.selected ? "checked" : ""}>
        <label for="t${i}">${esc(t.name)}</label>
        <select aria-label="Confidence in ${esc(t.name)}">
          ${[1, 2, 3].map((v) => `<option value="${v}" ${t.confidence === v ? "selected" : ""}>${CONF_LABELS[v]}</option>`).join("")}
        </select>
        ${t.custom ? `<button class="btn btn-sm" type="button" aria-label="Remove">✕</button>` : ""}`;
      $("input", row).addEventListener("change", (e) => { t.selected = e.target.checked; save(); });
      $("select", row).addEventListener("change", (e) => { t.confidence = Number(e.target.value); save(); });
      const rm = $("button", row);
      if (rm) rm.addEventListener("click", () => { state.topics.splice(i, 1); save(); renderExamStep(); });
      list.appendChild(row);
    });
  }

  function addCustomTopic() {
    const input = $("#custom-topic");
    const name = input.value.trim();
    if (!name) return;
    if (!state.topics.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      state.topics.push({ name, selected: true, confidence: 1, custom: true });
    }
    input.value = "";
    collectInputs();
    save();
    renderExamStep();
  }
  $("#add-topic").addEventListener("click", addCustomTopic);
  $("#custom-topic").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); addCustomTopic(); } });

  // ---------- Step 3: materials ----------
  function renderMaterialsStep() {
    $("#notes").value = state.notes;
    $("#professor-hints").value = state.hints;
    renderFileList();
  }

  function renderFileList(pending = []) {
    const ul = $("#file-list");
    ul.innerHTML = "";
    state.files.forEach((f, i) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${esc(f.name)}</span>
        <span style="display:flex;gap:8px;align-items:center">
          <span class="tag ok">${f.slides.length} slide${f.slides.length === 1 ? "" : "s"}</span>
          <button class="btn btn-sm" type="button" aria-label="Remove ${esc(f.name)}">✕</button>
        </span>`;
      $("button", li).addEventListener("click", () => { state.files.splice(i, 1); save(); renderFileList(); });
      ul.appendChild(li);
    });
    for (const p of pending) {
      const li = document.createElement("li");
      li.innerHTML = `<span>${esc(p.name)}</span><span class="tag ${p.error ? "err" : ""}">${esc(p.error || "Reading…")}</span>`;
      ul.appendChild(li);
    }
  }

  async function handleFiles(fileList) {
    const pending = [...fileList].map((f) => ({ name: f.name, file: f, error: null }));
    renderFileList(pending);
    for (const p of pending) {
      try {
        const slides = await window.parseStudyFile(p.file);
        if (!slides.length) throw new Error("No text found (scanned images can't be read)");
        state.files = state.files.filter((f) => f.name !== p.name);
        state.files.push({ name: p.name, slides });
        p.done = true;
      } catch (err) {
        p.error = err.message;
      }
      save();
      renderFileList(pending.filter((x) => !x.done));
    }
  }

  const dz = $("#dropzone");
  $("#file-input").addEventListener("change", (e) => { handleFiles(e.target.files); e.target.value = ""; });
  dz.addEventListener("dragover", (e) => { e.preventDefault(); dz.classList.add("drag"); });
  dz.addEventListener("dragleave", () => dz.classList.remove("drag"));
  dz.addEventListener("drop", (e) => { e.preventDefault(); dz.classList.remove("drag"); handleFiles(e.dataTransfer.files); });

  // ---------- Study content ----------
  function buildDeck() {
    const topics = new Set(selectedTopics().map((t) => t.name));
    const deck = course().flashcards
      .filter((c) => topics.has(c.topic))
      .map((c, i) => ({ id: "b" + i, source: "Course", topic: c.topic, front: c.front, back: c.back }));
    state.files.forEach((f, fi) => f.slides.forEach((s, si) => {
      if (s.title && s.bullets.length) {
        deck.push({ id: `s${fi}-${si}-${f.name}`, source: "Slides", topic: f.name, front: s.title, back: s.bullets.map((b) => "• " + b).join("\n") });
      }
    }));
    state.notes.split("\n").forEach((line, i) => {
      const m = line.match(/^\s*[-*•]?\s*(.{2,120}?)\s*(?::|\s[-–—]\s)\s*(.+)$/);
      if (m) deck.push({ id: "n" + i + m[1], source: "Notes", topic: "My notes", front: m[1], back: m[2] });
    });
    return deck;
  }

  function buildQuestionPool() {
    const topics = new Set(selectedTopics().map((t) => t.name));
    const pool = course().questions.filter((q) => topics.has(q.topic));
    // "Which slide covers…" questions from uploaded slides.
    const slides = state.files.flatMap((f) => f.slides.filter((s) => s.title && s.bullets.length).map((s) => ({ ...s, file: f.name })));
    const titles = [...new Set(slides.map((s) => s.title))];
    if (titles.length >= 4) {
      for (const s of shuffle(slides).slice(0, 15)) {
        const wrong = shuffle(titles.filter((t) => t !== s.title)).slice(0, 3);
        const choices = shuffle([s.title, ...wrong]);
        const bullet = s.bullets[Math.floor(Math.random() * s.bullets.length)];
        pool.push({
          topic: s.file, q: `Which slide topic does this point belong to?\n“${bullet}”`,
          choices, answer: choices.indexOf(s.title), why: `From the slide “${s.title}” in ${s.file}.`
        });
      }
    }
    return pool;
  }

  function daysUntil(dateStr) {
    if (!dateStr) return null;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const exam = new Date(dateStr + "T00:00:00");
    return Math.round((exam - today) / 86400000);
  }

  function buildPlan() {
    const left = daysUntil(state.examDate);
    if (left === null || left < 1) return { days: [], left };
    const topics = selectedTopics();
    // Lower confidence → more sessions.
    const seq = [];
    const maxW = 3;
    for (let round = 0; round < maxW; round++) {
      for (const t of [...topics].sort((a, b) => a.confidence - b.confidence)) {
        if (round < 4 - t.confidence) seq.push(t.name);
      }
    }
    const reviewDay = left >= 3;
    const studyDays = reviewDay ? left - 1 : left;
    const perDay = Math.max(1, Math.round((state.hoursPerDay * 60) / SESSION_MINUTES));
    const slides = state.files.flatMap((f) => f.slides.map((s, i) => ({ file: f.name, n: i + 1 })));
    const slidesPerDay = Math.ceil(slides.length / studyDays);

    const days = [];
    const start = new Date(); start.setHours(0, 0, 0, 0);
    let k = 0;
    for (let d = 0; d < left; d++) {
      const date = new Date(start); date.setDate(start.getDate() + d);
      const tasks = [];
      if (reviewDay && d === left - 1) {
        tasks.push("Full review: flip through all flashcards marked “still learning”");
        tasks.push("Take two practice quizzes and re-read explanations you missed");
        tasks.push("Light night — sleep well before the exam");
      } else {
        const today = new Set();
        for (let s = 0; s < perDay && seq.length; s++) today.add(seq[k++ % seq.length]);
        today.forEach((t) => tasks.push(`Study: ${t}`));
        const chunk = slides.slice(d * slidesPerDay, (d + 1) * slidesPerDay);
        if (chunk.length) {
          const byFile = {};
          chunk.forEach((c) => (byFile[c.file] = byFile[c.file] || []).push(c.n));
          for (const [f, ns] of Object.entries(byFile)) tasks.push(`Review ${ns.length > 1 ? `slides ${ns[0]}–${ns[ns.length - 1]}` : `slide ${ns[0]}`} of ${f}`);
        }
        tasks.push("Practice quiz (10 questions)");
      }
      days.push({ date, tasks, key: date.toISOString().slice(0, 10) });
    }
    return { days, left, covered: perDay * studyDays >= seq.length, totalSessions: seq.length };
  }

  // ---------- Step 4: dashboard ----------
  let activeTab = "plan";
  $$(".tab").forEach((t) => t.addEventListener("click", () => { activeTab = t.dataset.tab; renderDashboard(); }));

  function quizAccuracy() {
    const all = Object.values(state.progress.quiz);
    const right = all.reduce((s, r) => s + r.right, 0);
    const total = all.reduce((s, r) => s + r.total, 0);
    return total ? Math.round((right / total) * 100) : null;
  }

  function renderDashboard() {
    const c = course();
    const left = daysUntil(state.examDate);
    const typeName = { test: "Test", midterm: "Midterm", final: "Final exam" }[state.examType];
    $("#dash-title").textContent = `${c.icon} ${c.name} — ${typeName}`;
    $("#dash-sub").textContent = [
      state.examDate ? new Date(state.examDate + "T00:00:00").toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }) : "No exam date set",
      state.format
    ].filter(Boolean).join(" · ");

    const deck = buildDeck();
    const acc = quizAccuracy();
    $("#stats").innerHTML = [
      [left === null ? "—" : left < 0 ? "Past" : left, left === 0 ? "Exam is today!" : "Days until exam"],
      [selectedTopics().length, "Topics"],
      [deck.length, "Flashcards"],
      [`${deck.filter((d) => state.progress.known.includes(d.id)).length}`, "Cards mastered"],
      [acc === null ? "—" : acc + "%", "Quiz accuracy"]
    ].map(([n, l]) => `<div class="stat"><div class="num">${esc(n)}</div><div class="lbl">${esc(l)}</div></div>`).join("");

    $$(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === activeTab));
    ["plan", "cards", "quiz", "progress"].forEach((t) => $("#tab-" + t).classList.toggle("hidden", t !== activeTab));
    ({ plan: renderPlan, cards: renderCards, quiz: renderQuiz, progress: renderProgressTab })[activeTab]();
  }

  function renderPlan() {
    const box = $("#tab-plan");
    const plan = buildPlan();
    let html = "";
    if (state.hints.trim()) {
      html += `<div class="explain" style="margin-bottom:16px"><strong>Professor's hints — prioritize these:</strong><br>${esc(state.hints).replace(/\n/g, "<br>")}</div>`;
    }
    if (plan.left === null) {
      box.innerHTML = html + `<div class="empty">Add your exam date to get a day-by-day plan.<br><br><button class="btn" data-goto="1" type="button">Set exam date</button></div>`;
    } else if (plan.left < 1) {
      box.innerHTML = html + `<div class="empty">${plan.left === 0 ? "Your exam is today — do a quick flashcard pass and one practice quiz. Good luck!" : "This exam date has passed. Update it to plan for your next one."}<br><br><button class="btn" data-goto="1" type="button">Change date</button></div>`;
    } else {
      if (!plan.covered) {
        html += `<p class="hint">⚠️ At ${state.hoursPerDay}h/day there isn't time for every topic session. Consider more hours per day or prioritize low-confidence topics.</p>`;
      }
      html += plan.days.map((d, i) => `
        <div class="plan-day ${i === 0 ? "today" : ""}">
          <div class="date">${i === 0 ? "Today" : d.date.toLocaleDateString(undefined, { weekday: "short" })}
            <small>${d.date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</small></div>
          <div>${d.tasks.map((t, j) => {
            const id = `${d.key}:${j}`;
            return `<label style="display:flex;gap:8px;align-items:flex-start;margin-bottom:4px">
              <input type="checkbox" data-task="${esc(id)}" ${state.progress.done.includes(id) ? "checked" : ""}> <span>${esc(t)}</span></label>`;
          }).join("")}</div>
        </div>`).join("");
      box.innerHTML = html;
    }
    $$("[data-task]", box).forEach((cb) => cb.addEventListener("change", () => {
      const id = cb.dataset.task;
      state.progress.done = state.progress.done.filter((x) => x !== id);
      if (cb.checked) state.progress.done.push(id);
      save();
    }));
    $$("[data-goto]", box).forEach((b) => b.addEventListener("click", () => goTo(Number(b.dataset.goto))));
  }

  // Flashcards
  const cardView = { filter: "all", order: null, i: 0, flipped: false };
  function renderCards() {
    const box = $("#tab-cards");
    const deck = buildDeck();
    const known = new Set(state.progress.known);
    const filtered = deck.filter((c) =>
      cardView.filter === "all" ? true :
      cardView.filter === "learning" ? !known.has(c.id) : c.source === cardView.filter);
    if (!cardView.order || cardView.order.length !== filtered.length) cardView.order = filtered.map((_, i) => i);
    if (cardView.i >= filtered.length) cardView.i = 0;

    const counts = (src) => deck.filter((c) => c.source === src).length;
    let html = `<div class="card-controls" style="margin:0 0 14px">
      <select id="card-filter" style="width:auto">
        <option value="all">All cards (${deck.length})</option>
        <option value="learning">Still learning (${deck.filter((c) => !known.has(c.id)).length})</option>
        <option value="Course">Course cards (${counts("Course")})</option>
        <option value="Slides">From my slides (${counts("Slides")})</option>
        <option value="Notes">From my notes (${counts("Notes")})</option>
      </select>
      <button class="btn btn-sm" id="card-shuffle" type="button">Shuffle</button>
    </div>`;

    if (!filtered.length) {
      box.innerHTML = html + `<div class="empty">No cards here yet. Upload slides or add "Term: definition" notes in the Materials step.</div>`;
    } else {
      const card = filtered[cardView.order[cardView.i]];
      html += `
        <div class="flashcard ${cardView.flipped ? "back" : ""}" id="flashcard" tabindex="0" role="button" aria-label="Flip card">
          <div><span class="side">${cardView.flipped ? "Answer" : "Question"} · ${esc(card.topic)}</span>${esc(cardView.flipped ? card.back : card.front)}</div>
        </div>
        <div class="card-controls">
          <button class="btn" id="card-prev" type="button">←</button>
          <span class="hint">${cardView.i + 1} / ${filtered.length} · click card or press space to flip</span>
          <button class="btn" id="card-next" type="button">→</button>
        </div>
        <div class="card-controls" style="justify-content:center">
          <button class="btn" id="card-learning" type="button">Still learning</button>
          <button class="btn btn-primary" id="card-known" type="button">Got it ✓</button>
        </div>`;
      box.innerHTML = html;
      const move = (n) => { cardView.i = (cardView.i + n + filtered.length) % filtered.length; cardView.flipped = false; renderCards(); };
      const flip = () => { cardView.flipped = !cardView.flipped; renderCards(); $("#flashcard").focus(); };
      $("#flashcard").addEventListener("click", flip);
      $("#flashcard").addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
        if (e.key === "ArrowRight") move(1);
        if (e.key === "ArrowLeft") move(-1);
      });
      $("#card-prev").addEventListener("click", () => move(-1));
      $("#card-next").addEventListener("click", () => move(1));
      $("#card-known").addEventListener("click", () => {
        if (!state.progress.known.includes(card.id)) state.progress.known.push(card.id);
        save(); renderDashboard(); if (cardView.filter !== "learning") move(1);
      });
      $("#card-learning").addEventListener("click", () => {
        state.progress.known = state.progress.known.filter((x) => x !== card.id);
        save(); move(1);
      });
    }
    $("#card-filter").value = cardView.filter;
    $("#card-filter").addEventListener("change", (e) => { cardView.filter = e.target.value; cardView.order = null; cardView.i = 0; cardView.flipped = false; renderCards(); });
    $("#card-shuffle").addEventListener("click", () => { cardView.order = shuffle(cardView.order); cardView.i = 0; cardView.flipped = false; renderCards(); });
  }

  // Quiz
  let quiz = null;
  function startQuiz() {
    const pool = shuffle(buildQuestionPool()).slice(0, 10);
    quiz = {
      questions: pool.map((q) => {
        const order = shuffle(q.choices.map((_, i) => i));
        return { ...q, choices: order.map((i) => q.choices[i]), answer: order.indexOf(q.answer) };
      }),
      i: 0, score: 0, picked: null
    };
  }

  function renderQuiz() {
    const box = $("#tab-quiz");
    if (!quiz) {
      const n = buildQuestionPool().length;
      box.innerHTML = n
        ? `<div class="empty"><h3>Practice quiz</h3><p>${Math.min(10, n)} questions from your selected topics${state.files.length ? " and uploaded slides" : ""}.</p>
           <button class="btn btn-primary" id="quiz-start" type="button">Start quiz</button></div>`
        : `<div class="empty">No questions for the selected topics yet. Select some built-in topics or upload at least 4 slides with bullet points.</div>`;
      const s = $("#quiz-start", box);
      if (s) s.addEventListener("click", () => { startQuiz(); renderQuiz(); });
      return;
    }
    if (quiz.i >= quiz.questions.length) {
      const pct = Math.round((quiz.score / quiz.questions.length) * 100);
      box.innerHTML = `<div class="empty"><h3>${quiz.score} / ${quiz.questions.length} (${pct}%)</h3>
        <p>${pct >= 80 ? "Great work — you're in good shape." : pct >= 60 ? "Solid. Review the topics you missed in the Progress tab." : "Keep going — focus your next session on your weakest topics."}</p>
        <button class="btn btn-primary" id="quiz-again" type="button">New quiz</button></div>`;
      $("#quiz-again").addEventListener("click", () => { startQuiz(); renderQuiz(); });
      return;
    }
    const q = quiz.questions[quiz.i];
    box.innerHTML = `
      <p class="hint">Question ${quiz.i + 1} of ${quiz.questions.length} · ${esc(q.topic)}</p>
      <h3 style="white-space:pre-wrap">${esc(q.q)}</h3>
      <div id="quiz-choices">${q.choices.map((c, i) => {
        let cls = "";
        if (quiz.picked !== null) cls = i === q.answer ? "correct" : i === quiz.picked ? "wrong" : "";
        return `<button class="quiz-choice ${cls}" data-i="${i}" type="button" ${quiz.picked !== null ? "disabled" : ""}>${esc(c)}</button>`;
      }).join("")}</div>
      ${quiz.picked !== null ? `<div class="explain">${quiz.picked === q.answer ? "✅ Correct. " : "❌ Not quite. "}${esc(q.why)}</div>
        <div class="nav-buttons"><span></span><button class="btn btn-primary" id="quiz-next" type="button">${quiz.i + 1 < quiz.questions.length ? "Next →" : "See results"}</button></div>` : ""}`;
    $$(".quiz-choice", box).forEach((b) => b.addEventListener("click", () => {
      quiz.picked = Number(b.dataset.i);
      const ok = quiz.picked === q.answer;
      if (ok) quiz.score++;
      const rec = state.progress.quiz[q.topic] || (state.progress.quiz[q.topic] = { right: 0, total: 0 });
      rec.total++; if (ok) rec.right++;
      save();
      renderQuiz();
    }));
    const next = $("#quiz-next", box);
    if (next) next.addEventListener("click", () => {
      quiz.i++; quiz.picked = null;
      if (quiz.i >= quiz.questions.length) renderDashboard(); else renderQuiz();
    });
  }

  function renderProgressTab() {
    const box = $("#tab-progress");
    const rows = Object.entries(state.progress.quiz)
      .map(([topic, r]) => ({ topic, pct: Math.round((r.right / r.total) * 100), ...r }))
      .sort((a, b) => a.pct - b.pct);
    const conf = selectedTopics().filter((t) => t.confidence === 1).map((t) => t.name);
    box.innerHTML = `
      <h3>Quiz results by topic</h3>
      ${rows.length ? rows.map((r) => `
        <div class="topic-row"><span>${esc(r.topic)}</span><div class="bar"><i style="width:${r.pct}%"></i></div><span class="pct">${r.right}/${r.total}</span></div>`).join("")
        : `<p class="hint">Take a practice quiz to see which topics need work.</p>`}
      ${rows.length && rows[0].pct < 70 ? `<p style="margin-top:14px"><strong>Focus next on:</strong> ${esc(rows.filter((r) => r.pct < 70).slice(0, 3).map((r) => r.topic).join(", "))}</p>` : ""}
      ${conf.length ? `<p class="hint" style="margin-top:14px">You marked these as low confidence: ${esc(conf.join(", "))}</p>` : ""}
      <div class="nav-buttons"><span></span><button class="btn btn-sm" id="reset-progress" type="button">Reset progress</button></div>`;
    $("#reset-progress").addEventListener("click", () => {
      if (confirm("Reset quiz results, mastered cards and checked-off tasks?")) {
        state.progress = { quiz: {}, known: [], done: [] };
        save(); renderDashboard();
      }
    });
  }

  render();
})();
