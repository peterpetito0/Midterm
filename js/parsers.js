// Extracts slides ({ title, bullets: [] }) from uploaded files, entirely in the browser.
// PPTX and PDF libraries are loaded on demand the first time they're needed.
(function () {
  const LIBS = {
    jszip: "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
    pdfjs: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
    pdfWorker: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
  };
  const loaded = {};

  function loadScript(src) {
    if (!loaded[src]) {
      loaded[src] = new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.onload = resolve;
        s.onerror = () => reject(new Error("Couldn't load " + src + " (are you offline?)"));
        document.head.appendChild(s);
      });
    }
    return loaded[src];
  }

  const clean = (s) => s.replace(/\s+/g, " ").trim();

  async function parsePptx(file) {
    await loadScript(LIBS.jszip);
    const zip = await window.JSZip.loadAsync(file);
    const slidePaths = Object.keys(zip.files)
      .filter((p) => /^ppt\/slides\/slide\d+\.xml$/.test(p))
      .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

    const slides = [];
    for (const path of slidePaths) {
      const xml = new DOMParser().parseFromString(await zip.file(path).async("string"), "application/xml");
      let title = "";
      const bullets = [];
      for (const shape of xml.getElementsByTagNameNS("*", "sp")) {
        const ph = shape.getElementsByTagNameNS("*", "ph")[0];
        const isTitle = ph && /title|ctrTitle/i.test(ph.getAttribute("type") || "");
        const paras = [...shape.getElementsByTagNameNS("*", "p")]
          .map((p) => clean([...p.getElementsByTagNameNS("*", "t")].map((t) => t.textContent).join("")))
          .filter(Boolean);
        if (isTitle && !title) title = paras.join(" ");
        else bullets.push(...paras);
      }
      if (!title && bullets.length) title = bullets.shift();
      if (title || bullets.length) slides.push({ title, bullets });
    }
    return slides;
  }

  async function parsePdf(file) {
    await loadScript(LIBS.pdfjs);
    const pdfjs = window.pdfjsLib;
    pdfjs.GlobalWorkerOptions.workerSrc = LIBS.pdfWorker;
    const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    const slides = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const content = await (await doc.getPage(i)).getTextContent();
      const lines = [];
      let cur = "";
      for (const item of content.items) {
        cur += item.str;
        if (item.hasEOL) { lines.push(clean(cur)); cur = ""; }
      }
      lines.push(clean(cur));
      const nonEmpty = lines.filter(Boolean);
      if (nonEmpty.length) slides.push({ title: nonEmpty[0], bullets: nonEmpty.slice(1) });
    }
    return slides;
  }

  // Plain text: a blank line separates "slides"; the first line of each block is its title.
  async function parseText(file) {
    const text = await file.text();
    return text.split(/\n\s*\n/).map((block) => {
      const lines = block.split("\n").map((l) => clean(l.replace(/^[#*\-•\d.)\s]+/, ""))).filter(Boolean);
      return { title: lines[0] || "", bullets: lines.slice(1) };
    }).filter((s) => s.title);
  }

  window.parseStudyFile = async function (file) {
    const ext = file.name.split(".").pop().toLowerCase();
    let slides;
    if (ext === "pptx") slides = await parsePptx(file);
    else if (ext === "pdf") slides = await parsePdf(file);
    else if (ext === "txt" || ext === "md") slides = await parseText(file);
    else throw new Error("Unsupported file type ." + ext + " (use .pptx, .pdf, .txt or .md)");
    // Keep stored size reasonable.
    return slides.slice(0, 300).map((s) => ({
      title: s.title.slice(0, 200),
      bullets: s.bullets.slice(0, 12).map((b) => b.slice(0, 300))
    }));
  };
})();
