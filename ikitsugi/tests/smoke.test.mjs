// Smoke test: ensure the content script can be evaluated against a minimal DOM stub
// without throwing. We can't run requestAnimationFrame loops here, but we verify
// the IIFE initializes, attaches a shadow root, and reacts to settings.

import { test } from "node:test";
import { strict as assert } from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentSrc = fs.readFileSync(
  path.resolve(__dirname, "..", "src", "content.js"),
  "utf8"
);

function makeStub() {
  const installedShadows = [];
  const elements = [];
  function makeEl(tag = "div") {
    const el = {
      tagName: tag.toUpperCase(),
      children: [],
      style: { cssText: "" },
      classList: {
        _set: new Set(),
        add(...c) { c.forEach((x) => this._set.add(x)); },
        remove(...c) { c.forEach((x) => this._set.delete(x)); },
        toggle(c, on) { if (on) this._set.add(c); else this._set.delete(c); },
        contains(c) { return this._set.has(c); },
      },
      dataset: {},
      innerHTML: "",
      textContent: "",
      attributes: {},
      setAttribute(k, v) { this.attributes[k] = v; },
      addEventListener() {},
      removeEventListener() {},
      appendChild(c) { this.children.push(c); return c; },
      replaceChild(n, o) {
        const i = this.children.indexOf(o);
        if (i >= 0) this.children[i] = n;
      },
      attachShadow(opts) {
        const shadow = makeEl("#shadow-root");
        shadow.host = el;
        installedShadows.push({ host: el, shadow, opts });
        el.shadowRoot = shadow;
        return shadow;
      },
      querySelector(_sel) {
        // Return a fresh stub element. The content script uses these to attach
        // event listeners and set style/textContent — we just need them to be
        // non-null so init doesn't crash.
        return makeEl("div");
      },
      querySelectorAll() { return []; },
      getBoundingClientRect() {
        return { width: 0, height: 0, top: 0, left: 0, bottom: 0, right: 0 };
      },
      focus() {},
    };
    elements.push(el);
    return el;
  }

  const doc = makeEl("document");
  doc.documentElement = makeEl("html");
  doc.body = makeEl("body");
  doc.hidden = false;
  doc.fullscreenElement = null;
  doc.createElement = (tag) => makeEl(tag);
  doc.addEventListener = () => {};
  doc.querySelectorAll = () => [];

  const win = {
    document: doc,
    innerWidth: 1024,
    innerHeight: 768,
    requestAnimationFrame: () => 0,
    performance: { now: () => 0 },
    setInterval: () => 0,
    addEventListener() {},
  };

  const storageListeners = [];
  const messageListeners = [];
  const chromeStub = {
    storage: {
      local: {
        _data: {},
        get(key, cb) {
          const k = typeof key === "string" ? key : Object.keys(key)[0];
          cb({ [k]: this._data[k] });
        },
        set(obj, cb) {
          Object.assign(this._data, obj);
          cb && cb();
        },
      },
      onChanged: {
        addListener(fn) { storageListeners.push(fn); },
      },
    },
    runtime: {
      onMessage: { addListener(fn) { messageListeners.push(fn); } },
      sendMessage() {},
    },
  };

  return { win, doc, chrome: chromeStub, installedShadows, storageListeners, messageListeners };
}

test("content.js initializes against a stubbed DOM without throwing", () => {
  const stub = makeStub();
  const fn = new Function(
    "window", "document", "chrome", "performance", "requestAnimationFrame", "setInterval",
    contentSrc
  );
  assert.doesNotThrow(() => {
    fn(stub.win, stub.doc, stub.chrome, stub.win.performance, stub.win.requestAnimationFrame, stub.win.setInterval);
  });
  assert.equal(stub.installedShadows.length, 1, "shadow root attached");
  assert.ok(stub.storageListeners.length >= 1, "storage listener registered");
  assert.ok(stub.messageListeners.length >= 1, "runtime message listener registered");
});

test("content.js is idempotent (second eval is a no-op)", () => {
  const stub = makeStub();
  const fn = new Function(
    "window", "document", "chrome", "performance", "requestAnimationFrame", "setInterval",
    contentSrc
  );
  fn(stub.win, stub.doc, stub.chrome, stub.win.performance, stub.win.requestAnimationFrame, stub.win.setInterval);
  fn(stub.win, stub.doc, stub.chrome, stub.win.performance, stub.win.requestAnimationFrame, stub.win.setInterval);
  // Second run should bail at the __ikitsugiInstalled flag without attaching a 2nd shadow
  assert.equal(stub.installedShadows.length, 1, "no double-injection");
});
