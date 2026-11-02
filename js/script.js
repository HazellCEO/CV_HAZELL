(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Tahun otomatis
  $$("#tahun").forEach(e => e.textContent = new Date().getFullYear());

  // Tema terang/gelap (tersimpan, mengikuti sistem sebagai default)
  const ikon = () => $$(".theme-toggle i").forEach(i => i.className = "bi " + (root.dataset.theme === "dark" ? "bi-sun" : "bi-moon-stars"));
  $$(".theme-toggle").forEach(b => b.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("tema", root.dataset.theme); } catch (e) {}
    ikon();
  }));
  ikon();

  // Navbar: tutup menu setelah klik, solid saat di-scroll
  const menu = $("#navbarUtama");
  $$("#navbarUtama .nav-link").forEach(l => l.addEventListener("click", () => menu.classList.contains("show") && bootstrap.Collapse.getOrCreateInstance(menu).hide()));
  const nav = $(".navbar"), btt = $("#backToTop"), bar = $(".scroll-bar"), tl = $(".education-timeline");
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle("is-scrolled", y > 24);
    btt && btt.classList.toggle("is-visible", y > 400);
    bar && bar.style.setProperty("--progress", (h > 0 ? y / h * 100 : 0) + "%");
    if (tl) { const r = tl.getBoundingClientRect(); tl.style.setProperty("--progress", Math.min(100, Math.max(0, (innerHeight * .6 - r.top) / r.height * 100)) + "%"); }
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  btt && btt.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

  // Muncul halus saat terlihat
  const items = $$(".overview-card, .education-stat, .education-card, .education-focus-item, .hobby-photo-card, .contact-info, .contact-form, .hero-content, .hero-visual");
  items.forEach(e => e.classList.add("reveal-on-scroll"));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add("is-visible"), io.unobserve(e.target))), { threshold: .1 });
    items.forEach(e => io.observe(e));
  } else items.forEach(e => e.classList.add("is-visible"));

  // Hero: sorotan lembut mengikuti kursor + foto bergeser tipis
  const hero = $(".hero-home, .page-header"), foto = $(".hero-avatar-cutout");
  if (hero && !reduce && matchMedia("(pointer:fine)").matches) hero.addEventListener("pointermove", e => {
    const r = hero.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    hero.style.setProperty("--mx", x * 100 + "%"); hero.style.setProperty("--my", y * 100 + "%");
    foto && (foto.style.transform = `translate(${(x - .5) * -12}px,${(y - .5) * -8}px)`);
  });

  // Slider hobi: tombol, drag, dan keyboard
  const sl = $(".hobby-slider");
  if (sl) {
    const step = () => (sl.querySelector(".hobby-photo-card")?.offsetWidth || 300) + 20;
    const [prev, next] = $$(".slider-nav button");
    const cek = () => { if (prev) { prev.disabled = sl.scrollLeft < 8; next.disabled = sl.scrollLeft + sl.clientWidth >= sl.scrollWidth - 8; } };
    prev && prev.addEventListener("click", () => sl.scrollBy({ left: -step(), behavior: "smooth" }));
    next && next.addEventListener("click", () => sl.scrollBy({ left: step(), behavior: "smooth" }));
    sl.addEventListener("scroll", cek, { passive: true }); cek();
    let down = false, sx = 0, sc = 0;
    sl.addEventListener("pointerdown", e => { if (e.pointerType === "mouse") { down = true; sx = e.clientX; sc = sl.scrollLeft; } });
    addEventListener("pointermove", e => { if (down) { sl.classList.add("is-drag"); sl.scrollLeft = sc - (e.clientX - sx); } });
    addEventListener("pointerup", () => { down = false; sl.classList.remove("is-drag"); });
  }

  // Formulir kontak: validasi, lalu buka email
  const form = $("#formKontak");
  if (form) form.addEventListener("submit", e => {
    e.preventDefault();
    if (!form.checkValidity()) return form.classList.add("was-validated");
    const d = Object.fromEntries(new FormData(form));
    location.href = `mailto:nama@email.com?subject=${encodeURIComponent("Pesan dari " + d.nama)}&body=${encodeURIComponent(d.pesan + "\n\n" + d.nama + " (" + d.email + ")")}`;
    $(".form-ok").style.display = "block"; form.reset(); form.classList.remove("was-validated");
  });
})();
