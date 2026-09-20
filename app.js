(function () {
  "use strict";

  const app = document.getElementById("app");

  const TABS = [
    { key: "portofolio", label: "PORTOFOLIO" },
    { key: "opinion", label: "OPINION" },
    { key: "skills", label: "SKILLS" },
  ];

  /* ------------------------------------------------------------------
     Gambar pengganti (dipakai kalau file gambar kosong atau tidak ketemu)
     ------------------------------------------------------------------ */
  const PLACEHOLDER =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">' +
        '<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#c4e9ff"/><stop offset="1" stop-color="#f4fcff"/></linearGradient></defs>' +
        '<rect width="400" height="400" fill="url(#g)"/>' +
        '<g fill="#fff"><rect x="128" y="122" width="132" height="34" rx="17"/>' +
        '<circle cx="190" cy="112" r="36"/><circle cx="232" cy="134" r="20"/></g>' +
        '<path d="M0 300 C80 282 140 298 210 314 S340 336 400 328 V400 H0Z" fill="#c8e184"/>' +
        '<path d="M0 345 C90 300 210 296 400 332 V400 H0Z" fill="#8ba300"/>' +
        "</svg>"
    );

  const ICONS = {
    verified:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5l2.4 1.7 2.9-.2 1.2 2.7 2.6 1.3-.3 2.9L22.5 12l-1.7 2.4.2 2.9-2.7 1.2-1.3 2.6-2.9-.3L12 22.5l-2.4-1.7-2.9.2-1.2-2.7-2.6-1.3.3-2.9L1.5 12l1.7-2.4-.2-2.9 2.7-1.2 1.3-2.6 2.9.3z" fill="#1d9bf0" stroke="#1d9bf0" stroke-width="1" stroke-linejoin="round"/><path d="M7.8 12.3l2.9 2.9 5.6-5.9" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    dots:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="2.2"/><circle cx="12" cy="12" r="2.2"/><circle cx="19" cy="12" r="2.2"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    comment:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 3H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3v3.5L11.5 19H20a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/></svg>',
    back:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  /* ------------------------------------------------------------------
     Helper pembuat elemen. Teks selalu dimasukkan sebagai teks biasa,
     jadi karakter seperti < dan > di caption atau komentar aman.
     ------------------------------------------------------------------ */
  function el(tag, props, ...children) {
    const node = document.createElement(tag);
    if (props) {
      for (const [key, value] of Object.entries(props)) {
        if (value == null || value === false) continue;
        if (key === "class") node.className = value;
        else if (key === "text") node.textContent = value;
        else node.setAttribute(key, value === true ? "" : value);
      }
    }
    for (const child of children.flat()) {
      if (child == null || child === false) continue;
      node.append(child);
    }
    return node;
  }

  function icon(name) {
    const span = el("span", { class: "icon" });
    span.innerHTML = ICONS[name];
    return span;
  }

  function badge() {
    const span = el("span", { class: "verified", role: "img", "aria-label": "Akun terverifikasi" });
    span.innerHTML = ICONS.verified;
    return span;
  }

  function formatCount(n) {
  if (typeof n === "string") return n;
  return new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

function totalPosts() {
  return TABS.reduce(
    (sum, t) => sum + ((SITE.posts && SITE.posts[t.key]) || []).length,
    0
  );
}

function statsEl() {
  const s = SITE.profile.stats || {};
  const items = [
    { value: totalPosts(), label: "Post" },
    { value: s.followers ?? 0, label: "Followers" },
    { value: s.following ?? 0, label: "Following" },
  ];
  return el(
    "ul",
    { class: "profile__stats" },
    items.map((i) =>
      el("li", null, el("strong", { text: formatCount(i.value) }), el("span", { text: i.label }))
    )
  );
}
  
  const SPLIT = /(\*\*[^*\s][^*]*\*\*|__[^_\s][^_]*__|~~[^~\s][^~]*~~|\*[^*\s][^*]*\*)/g;
const RULES = [
  { re: /^\*\*([^*\s][^*]*)\*\*$/, tag: "strong" },
  { re: /^__([^_\s][^_]*)__$/, tag: "u" },
  { re: /^~~([^~\s][^~]*)~~$/, tag: "s" },
  { re: /^\*([^*\s][^*]*)\*$/, tag: "em" },
];

function richText(text) {
  const frag = document.createDocumentFragment();
  String(text).split(SPLIT).forEach((part) => {
    if (!part) return;
    for (const rule of RULES) {
      const m = part.match(rule.re);
      if (m) {
        frag.append(el(rule.tag, { text: m[1] }));
        return;
      }
    }
    frag.append(part);
  });
  return frag;
}

  function image(src, alt, cls, eager) {
    const img = el("img", {
      class: cls,
      alt: alt || "",
      decoding: "async",
      loading: eager ? "eager" : "lazy",
    });
    img.addEventListener("error", () => { img.src = PLACEHOLDER; }, { once: true });
    img.src = src || PLACEHOLDER;
    return img;
  }

  function avatar(name, src, size, forceImage) {
    if (src || forceImage) {
      const img = image(src, name, "avatar");
      img.style.setProperty("--size", size + "px");
      return img;
    }
    const words = String(name).trim().split(/\s+/).filter(Boolean);
    const initials = ((words[0] || "?")[0] + (words[1] ? words[1][0] : "")).toUpperCase();
    let hue = 0;
    for (const ch of String(name)) hue = (hue * 31 + ch.codePointAt(0)) % 360;
    return el("span", {
      class: "avatar",
      style: "--size:" + size + "px;background:hsl(" + hue + " 45% 40%)",
      "aria-hidden": "true",
      text: initials,
    });
  }

  function waLink(message) {
    const number = String((SITE.whatsapp && SITE.whatsapp.number) || "").replace(/\D/g, "");
    return "https://wa.me/" + number + "?text=" + encodeURIComponent(message || "");
  }

  /* ------------------------------------------------------------------
     Data postingan
     ------------------------------------------------------------------ */
  const ALL_POSTS = {};
  TABS.forEach((tab) => {
    ((SITE.posts && SITE.posts[tab.key]) || []).forEach((post) => {
      ALL_POSTS[post.id] = Object.assign({}, post, { category: tab.key });
    });
  });

  function countComments(post) {
    return (post.comments || []).reduce((n, c) => n + 1 + (c.replies ? c.replies.length : 0), 0);
  }

  function thumbOf(post) {
    const m = post.media || {};
    if (post.thumb) return post.thumb;
    if (m.type === "image") return m.src;
    if (m.type === "youtube") return "https://img.youtube.com/vi/" + encodeURIComponent(m.id) + "/hqdefault.jpg";
    return m.poster || "";
  }

  function shortAlt(post) {
    return String(post.caption || "Postingan").replace(/\s+/g, " ").slice(0, 100);
  }

  /* ------------------------------------------------------------------
     Tampilan HOME
     ------------------------------------------------------------------ */
  function buildMenu() {
    const links = SITE.links || {};
    const items = [
      { label: "About", href: "#/about", external: false },
      { label: "YouTube", href: links.youtube, external: true },
      { label: "TikTok", href: links.tiktok, external: true },
      { label: "LinkedIn", href: links.linkedin, external: true },
    ].filter((item) => item.href);

    const button = el(
      "button",
      { class: "menu-btn", type: "button", "aria-label": "Menu lainnya", "aria-haspopup": "true", "aria-expanded": "false" },
      icon("dots")
    );

    const list = el(
      "ul",
      { class: "menu", role: "menu", hidden: true },
      items.map((item) =>
        el(
          "li",
          { role: "none" },
          el("a", {
            role: "menuitem",
            href: item.href,
            target: item.external ? "_blank" : null,
            rel: item.external ? "noopener noreferrer" : null,
            text: item.label,
          })
        )
      )
    );

    button.addEventListener("click", () => {
      const willOpen = list.hidden;
      closeMenus();
      list.hidden = !willOpen;
      button.setAttribute("aria-expanded", String(willOpen));
    });
    list.addEventListener("click", (e) => { if (e.target.closest("a")) closeMenus(); });

    return el("div", { class: "menu-wrap" }, button, list);
  }

  function closeMenus() {
    document.querySelectorAll(".menu").forEach((menu) => { menu.hidden = true; });
    document.querySelectorAll(".menu-btn").forEach((btn) => btn.setAttribute("aria-expanded", "false"));
  }

  document.addEventListener("click", (e) => { if (!e.target.closest(".menu-wrap")) closeMenus(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenus(); });

  function tile(post) {
    const type = (post.media || {}).type;
    return el(
      "a",
      { class: "tile", href: "#/post/" + encodeURIComponent(post.id) },
      image(thumbOf(post), shortAlt(post), "tile__img"),
      type && type !== "image" ? el("span", { class: "tile__badge" }, icon("play")) : null,
      el("span", { class: "tile__hover" }, icon("comment"), el("span", { text: String(countComments(post)) }))
    );
  }

  function viewHome(tabKey) {
    const p = SITE.profile;
    const posts = (SITE.posts && SITE.posts[tabKey]) || [];

    const header = el(
      "header",
      { class: "profile" },
      el("div", { class: "profile__photo" }, image(p.photo, p.name, "avatar-img", true)),
      el(
        "div",
        { class: "profile__info" },
        el("h1", { class: "profile__name" }, p.name, p.verified ? badge() : null),
        el("p", { class: "profile__title", text: p.title })
      ),
      statsEl(),
      el("p", { class: "profile__bio", text: p.bio }),
      el(
        "div",
        { class: "profile__actions" },
        el("a", { class: "btn", href: waLink(SITE.whatsapp.hireMessage), target: "_blank", rel: "noopener noreferrer", text: "HIRE" }),
        el("a", { class: "btn", href: waLink(SITE.whatsapp.partnershipMessage), target: "_blank", rel: "noopener noreferrer", text: "PARTNERSHIP" }),
        buildMenu()
      )
    );

    const tabs = el(
      "nav",
      { class: "tabs", "aria-label": "Jenis konten" },
      TABS.map((tab) =>
        el("a", {
          class: "tabs__item",
          href: "#/" + tab.key,
          "aria-current": tab.key === tabKey ? "page" : null,
          text: tab.label,
        })
      )
    );

    const content = posts.length
      ? el("div", { class: "grid" }, posts.map(tile))
      : el("p", { class: "empty", text: "Belum ada postingan di bagian ini." });

    return el("div", { class: "home" }, header, tabs, content);
  }

  /* ------------------------------------------------------------------
     Tampilan ABOUT
     ------------------------------------------------------------------ */
  function viewAbout() {
    const p = SITE.profile;
    const a = SITE.about || {};
    return el(
      "div",
      { class: "about" },
      el(
        "section",
        { class: "about__box" },
        el(
          "div",
          { class: "about__head" },
          el("div", { class: "about__avatar" }, image(p.photo, p.name, "avatar-img", true)),
          el("h1", { text: "ABOUT" })
        ),
        el("div", { class: "about__text" }, (a.paragraphs || []).map((t) => el("p", { text: t })))
      ),
      el("a", { class: "btn about__home", href: "#/", text: "HOME" }),
      el("div", { class: "about__photo" }, image(a.photo, p.name, "about__img", true))
    );
  }

  /* ------------------------------------------------------------------
     Tampilan detail postingan
     ------------------------------------------------------------------ */
  function mediaEl(m, post) {
    m = m || {};
    if (m.type === "video") {
      return el("video", { class: "media", src: m.src, poster: m.poster, controls: true, playsinline: true, preload: "metadata" });
    }
    if (m.type === "youtube") {
      return el("iframe", {
        class: "media media--yt",
        src: "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(m.id),
        title: shortAlt(post),
        allow: "accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen",
        allowfullscreen: true,
        loading: "lazy",
      });
    }
    return image(m.src, shortAlt(post), "media", true);
  }

  function commentEl(c, isReply) {
    const me = SITE.profile;
    const size = isReply ? 32 : 44;
    const name = c.name || (c.creator ? me.name : "Pengunjung");
    const title = c.title || (c.creator ? me.postTitle : "");
    const pic = c.creator ? avatar(name, me.photo, size, true) : avatar(name, c.avatar, size);

    return el(
      "div",
      { class: "comment" + (isReply ? " comment--reply" : "") },
      pic,
      el(
        "div",
        { class: "comment__body" },
        el(
          "div",
          { class: "comment__meta" },
          el("strong", { class: "comment__name", text: name }),
          c.creator && me.verified ? badge() : null,
          title ? el("span", { class: "comment__title", text: title }) : null
        ),
        el(
          "div",
          { class: "comment__row" },
          el("p", { class: "comment__bubble" }, richText(c.text)),
          c.time ? el("span", { class: "comment__time", text: c.time }) : null
        ),
        (c.replies || []).map((r) => commentEl(r, true))
      )
    );
  }

  function viewPost(id) {
    const post = ALL_POSTS[id];
    if (!post) return viewNotFound();
    const me = SITE.profile;
    const comments = post.comments || [];

    return el(
      "article",
      { class: "post" },
      el("a", { class: "post__back", href: "#/" + post.category }, icon("back"), el("span", { text: "Kembali" })),
      el(
        "div",
        { class: "post__layout" },
        el("div", { class: "post__media" }, mediaEl(post.media, post)),
        el(
          "div",
          { class: "post__panel" },
          el(
            "div",
            { class: "post__panel-inner" },
            el(
              "header",
              { class: "post__head" },
              el("div", { class: "post__avatar" }, image(me.photo, me.name, "avatar-img", true)),
              el(
                "div",
                { class: "post__who" },
                el(
                  "div",
                  { class: "post__line" },
                  el("strong", { class: "post__name", text: me.name }),
                  me.verified ? badge() : null,
                  post.time ? el("span", { class: "post__sep", "aria-hidden": "true" }) : null,
                  post.time ? el("span", { class: "post__time", text: post.time }) : null
                ),
                el("div", { class: "post__role", text: me.postTitle })
              ),
              post.caption ? el("p", { class: "post__caption", text: post.caption }) : null
            ),
            el(
              "section",
              { class: "comments", "aria-label": "Komentar" },
              comments.length
                ? comments.map((c) => commentEl(c, false))
                : el("p", { class: "empty", text: "Belum ada komentar." })
            )
          )
        )
      )
    );
  }

  function viewNotFound() {
    return el(
      "div",
      { class: "notfound" },
      el("h1", { text: "Halaman tidak ditemukan" }),
      el("p", { text: "Link yang kamu buka tidak ada, atau postingannya sudah dihapus." }),
      el("a", { class: "btn", href: "#/", text: "HOME" })
    );
  }

  /* ------------------------------------------------------------------
     Router sederhana berbasis hash: #/  #/opinion  #/about  #/post/id
     ------------------------------------------------------------------ */
  let currentKey = null;
  const scrollMemory = {};

  function resolve() {
    const raw = location.hash.replace(/^#\/?/, "");
    const parts = raw.split("/");
    const first = parts[0];
    const name = SITE.profile.name;

    if (first === "") return { key: "tab:portofolio", view: viewHome("portofolio"), title: name + " | " + SITE.profile.title, restore: true };
    if (TABS.some((t) => t.key === first)) return { key: "tab:" + first, view: viewHome(first), title: name + " | " + SITE.profile.title, restore: true };
    if (first === "about") return { key: "about", view: viewAbout(), title: "About | " + name, restore: false };
    if (first === "post") {
      let id = parts[1] || "";
      try { id = decodeURIComponent(id); } catch (e) { /* biarkan apa adanya */ }
      return { key: "post:" + id, view: viewPost(id), title: name, restore: false };
    }
    return { key: "404", view: viewNotFound(), title: "Tidak ditemukan | " + name, restore: false };
  }

  function render() {
    if (currentKey !== null) scrollMemory[currentKey] = window.scrollY;
    const route = resolve();
    app.replaceChildren(route.view);
    document.title = route.title;
    window.scrollTo(0, route.restore ? scrollMemory[route.key] || 0 : 0);
    currentKey = route.key;
  }

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.addEventListener("hashchange", render);
  render();
})();
