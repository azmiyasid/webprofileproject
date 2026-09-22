import { auth, db } from "./firebase-config.js";

import {
  signInAnonymously,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  increment,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

(function () {
let chatId = null;
let listening = false;

  let elements = {};
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
function buildWidget() {
    const bubbleIcon = el("span", { class: "cw-bubble__icon" });
    bubbleIcon.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>';

    const dot = el("span", { class: "cw-bubble__dot", hidden: true });

    const bubble = el(
      "button",
      { class: "cw-bubble", type: "button", "aria-label": "Chat with Creator" },
      bubbleIcon,
      dot
    );

    const closeBtn = el("button", { class: "cw-panel__close", type: "button", "aria-label": "Tutup chat" }, "\u00d7");

    const header = el(
      "div",
      { class: "cw-panel__header" },
      el("strong", { text: "Chat with Creator" }),
      closeBtn
    );

    const status = el("p", { class: "cw-status", text: "Menghubungkan..." });

    const messages = el("div", { class: "cw-messages", id: "cw-messages" });

    const input = el("input", {
      class: "cw-input",
      type: "text",
      placeholder: "Tulis pesan...",
      maxlength: "500",
      disabled: true,
      autocomplete: "off",
    });

    const sendBtn = el("button", { class: "cw-send", type: "submit", disabled: true, text: "Kirim" });

    const form = el("form", { class: "cw-form" }, input, sendBtn);

    const panel = el(
      "div",
      { class: "cw-panel", hidden: true },
      header,
      status,
      messages,
      form
    );

    document.body.append(bubble, panel);

    elements = { bubble, dot, panel, status, messages, input, sendBtn, form, closeBtn };

    bubble.addEventListener("click", togglePanel);
    closeBtn.addEventListener("click", togglePanel);
    form.addEventListener("submit", handleSubmit);
  }
function togglePanel() {
    const willOpen = elements.panel.hidden;
    elements.panel.hidden = !willOpen;
    elements.bubble.setAttribute("aria-expanded", String(willOpen));
    if (willOpen) {
      hideDot();
      localStorage.setItem("cw-last-opened", String(Date.now()));
      elements.messages.scrollTop = elements.messages.scrollHeight;
    }
  }

  function hideDot() {
    elements.dot.hidden = true;
  }

  function showDot() {
    elements.dot.hidden = false;
  }
onAuthStateChanged(auth, (user) => {
    if (user) {
      chatId = user.uid;
      elements.status.hidden = true;
      elements.input.disabled = false;
      elements.sendBtn.disabled = false;
      ensureChatDoc();
      listenMessages();
    } else {
      signInAnonymously(auth).catch((err) => {
        console.error("Gagal membuat sesi chat:", err);
        elements.status.textContent = "Chat sedang tidak bisa diakses. Coba muat ulang halaman.";
      });
    }
  });
async function ensureChatDoc() {
    const ref = doc(db, "chats", chatId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        createdAt: serverTimestamp(),
        lastMessageAt: serverTimestamp(),
        unreadByCreator: 0,
      });
    }
  }
function listenMessages() {
    if (listening) return;
    listening = true;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("time", "asc"));

    onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => d.data());
      renderMessages(list);
      checkForNewReply(list);
    });
  }
function renderMessages(list) {
    const bubbles = list.map((m) => bubbleFor(m));
    elements.messages.replaceChildren(
      bubbles.length ? bubbles : el("p", { class: "cw-empty", text: "Mulai chat dengan Creator di sini." })
    );
    elements.messages.scrollTop = elements.messages.scrollHeight;
  }

  function bubbleFor(m) {
    const mine = m.sender === "visitor";
    const time = m.time && m.time.toDate ? formatTime(m.time.toDate()) : "Mengirim...";
    return el(
      "div",
      { class: "cw-msg " + (mine ? "cw-msg--mine" : "cw-msg--creator") },
      el("p", { class: "cw-msg__text", text: m.text }),
      el("span", { class: "cw-msg__time", text: time })
    );
  }

  function formatTime(date) {
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  }
function checkForNewReply(list) {
    if (!elements.panel.hidden || list.length === 0) return;
    const last = list[list.length - 1];
    if (last.sender !== "creator" || !last.time || !last.time.toDate) return;

    const lastOpened = Number(localStorage.getItem("cw-last-opened") || 0);
    if (last.time.toDate().getTime() > lastOpened) showDot();
  }
async function handleSubmit(event) {
    event.preventDefault();
    const text = elements.input.value.trim();
    if (!text || !chatId) return;

    elements.input.value = "";
    elements.sendBtn.disabled = true;

    try {
      const chatRef = doc(db, "chats", chatId);
      await addDoc(collection(chatRef, "messages"), {
        sender: "visitor",
        text,
        time: serverTimestamp(),
      });
      await updateDoc(chatRef, {
        lastMessageAt: serverTimestamp(),
        unreadByCreator: increment(1),
      });
    } catch (err) {
      console.error("Gagal mengirim pesan:", err);
      elements.input.value = text;
    } finally {
      elements.sendBtn.disabled = false;
      elements.input.focus();
    }
  }

  buildWidget();
})();