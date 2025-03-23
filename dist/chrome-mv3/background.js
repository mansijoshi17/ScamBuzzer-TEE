var background = function() {
  "use strict";
  var _a, _b;
  function defineBackground(arg) {
    if (arg == null || typeof arg === "function") return { main: arg };
    return arg;
  }
  var _MatchPattern = class {
    constructor(matchPattern) {
      if (matchPattern === "<all_urls>") {
        this.isAllUrls = true;
        this.protocolMatches = [..._MatchPattern.PROTOCOLS];
        this.hostnameMatch = "*";
        this.pathnameMatch = "*";
      } else {
        const groups = /(.*):\/\/(.*?)(\/.*)/.exec(matchPattern);
        if (groups == null)
          throw new InvalidMatchPattern(matchPattern, "Incorrect format");
        const [_, protocol, hostname, pathname] = groups;
        validateProtocol(matchPattern, protocol);
        validateHostname(matchPattern, hostname);
        this.protocolMatches = protocol === "*" ? ["http", "https"] : [protocol];
        this.hostnameMatch = hostname;
        this.pathnameMatch = pathname;
      }
    }
    includes(url) {
      if (this.isAllUrls)
        return true;
      const u = typeof url === "string" ? new URL(url) : url instanceof Location ? new URL(url.href) : url;
      return !!this.protocolMatches.find((protocol) => {
        if (protocol === "http")
          return this.isHttpMatch(u);
        if (protocol === "https")
          return this.isHttpsMatch(u);
        if (protocol === "file")
          return this.isFileMatch(u);
        if (protocol === "ftp")
          return this.isFtpMatch(u);
        if (protocol === "urn")
          return this.isUrnMatch(u);
      });
    }
    isHttpMatch(url) {
      return url.protocol === "http:" && this.isHostPathMatch(url);
    }
    isHttpsMatch(url) {
      return url.protocol === "https:" && this.isHostPathMatch(url);
    }
    isHostPathMatch(url) {
      if (!this.hostnameMatch || !this.pathnameMatch)
        return false;
      const hostnameMatchRegexs = [
        this.convertPatternToRegex(this.hostnameMatch),
        this.convertPatternToRegex(this.hostnameMatch.replace(/^\*\./, ""))
      ];
      const pathnameMatchRegex = this.convertPatternToRegex(this.pathnameMatch);
      return !!hostnameMatchRegexs.find((regex) => regex.test(url.hostname)) && pathnameMatchRegex.test(url.pathname);
    }
    isFileMatch(url) {
      throw Error("Not implemented: file:// pattern matching. Open a PR to add support");
    }
    isFtpMatch(url) {
      throw Error("Not implemented: ftp:// pattern matching. Open a PR to add support");
    }
    isUrnMatch(url) {
      throw Error("Not implemented: urn:// pattern matching. Open a PR to add support");
    }
    convertPatternToRegex(pattern) {
      const escaped = this.escapeForRegex(pattern);
      const starsReplaced = escaped.replace(/\\\*/g, ".*");
      return RegExp(`^${starsReplaced}$`);
    }
    escapeForRegex(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
  };
  var MatchPattern = _MatchPattern;
  MatchPattern.PROTOCOLS = ["http", "https", "file", "ftp", "urn"];
  var InvalidMatchPattern = class extends Error {
    constructor(matchPattern, reason) {
      super(`Invalid match pattern "${matchPattern}": ${reason}`);
    }
  };
  function validateProtocol(matchPattern, protocol) {
    if (!MatchPattern.PROTOCOLS.includes(protocol) && protocol !== "*")
      throw new InvalidMatchPattern(
        matchPattern,
        `${protocol} not a valid protocol (${MatchPattern.PROTOCOLS.join(", ")})`
      );
  }
  function validateHostname(matchPattern, hostname) {
    if (hostname.includes(":"))
      throw new InvalidMatchPattern(matchPattern, `Hostname cannot include a port`);
    if (hostname.includes("*") && hostname.length > 1 && !hostname.startsWith("*."))
      throw new InvalidMatchPattern(
        matchPattern,
        `If using a wildcard (*), it must go at the start of the hostname`
      );
  }
  const definition = defineBackground({
    main() {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "toggleFeature") {
          chrome.storage.local.set({ [request.feature]: request.enabled }, () => {
            sendResponse({ status: "Feature toggled successfully" });
          });
        }
        if (request.type === "analyzeEmail") {
          console.log("📩 Received Email Content for Analysis:", request == null ? void 0 : request.emailContent);
          fetch("https://nilai-a779.nillion.network/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer Nillion2025",
              "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
              model: "meta-llama/Llama-3.1-8B-Instruct",
              messages: [
                {
                  role: "user",
                  content: `Analyze the following email content for phishing scams, suspicious links, and spoofed emails. Identify any malicious elements and provide a phishing score (0-100) based on risk level. Return a one-line summary indicating the threat level and key findings. Email content: "${request.emailContent}"`
                }
              ],
              temperature: 0.2,
              top_p: 0.95,
              max_tokens: 2048,
              stream: false,
              nilrag: {}
            })
          }).then((response) => response.json()).then((data) => {
            console.log("✅ API Response from Nillion:", data);
            sendResponse({ analysis: data.choices[0].message.content });
          }).catch((error) => {
            console.error("❌ Error analyzing email:", error);
            sendResponse({ error: "Failed to analyze email" });
          });
          return true;
        }
        if (request.type === "analyzeTweeter") {
          console.log("📩 Received Tweeter Content for Analysis:", request == null ? void 0 : request.tweeterContent);
          fetch("https://nilai-a779.nillion.network/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer Nillion2025",
              "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
              model: "meta-llama/Llama-3.1-8B-Instruct",
              messages: [
                {
                  role: "user",
                  content: `Analyze the following tweeter dm for phishing scams: "${request.tweeterContent}"`
                }
              ],
              temperature: 0.2,
              top_p: 0.95,
              max_tokens: 2048,
              stream: false,
              nilrag: {}
            })
          }).then((response) => response.json()).then((data) => {
            console.log("✅ API Response from Nillion:", data);
            sendResponse({ analysis: data.choices[0].message.content });
          }).catch((error) => {
            console.error("❌ Error analyzing email:", error);
            sendResponse({ error: "Failed to analyze email" });
          });
          return true;
        }
      });
      chrome.contextMenus.create({
        id: "check-contract-address",
        title: "Check Contract Address",
        contexts: ["all"]
      });
      chrome.contextMenus.onClicked.addListener((info, tab) => {
        if (info.menuItemId === "check-contract-address") {
          chrome.runtime.openOptionsPage();
          chrome.windows.create({
            url: "contract/index.html",
            type: "popup",
            width: 400,
            height: 600
          });
        }
      });
    }
  });
  background;
  function initPlugins() {
  }
  const browser = (
    // @ts-expect-error
    ((_b = (_a = globalThis.browser) == null ? void 0 : _a.runtime) == null ? void 0 : _b.id) == null ? globalThis.chrome : (
      // @ts-expect-error
      globalThis.browser
    )
  );
  function print(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  const logger = {
    debug: (...args) => print(console.debug, ...args),
    log: (...args) => print(console.log, ...args),
    warn: (...args) => print(console.warn, ...args),
    error: (...args) => print(console.error, ...args)
  };
  let ws;
  function getDevServerWebSocket() {
    if (ws == null) {
      const serverUrl = `${"ws:"}//${"localhost"}:${3001}`;
      logger.debug("Connecting to dev server @", serverUrl);
      ws = new WebSocket(serverUrl, "vite-hmr");
      ws.addWxtEventListener = ws.addEventListener.bind(ws);
      ws.sendCustom = (event, payload) => ws == null ? void 0 : ws.send(JSON.stringify({ type: "custom", event, payload }));
      ws.addEventListener("open", () => {
        logger.debug("Connected to dev server");
      });
      ws.addEventListener("close", () => {
        logger.debug("Disconnected from dev server");
      });
      ws.addEventListener("error", (event) => {
        logger.error("Failed to connect to dev server", event);
      });
      ws.addEventListener("message", (e) => {
        try {
          const message = JSON.parse(e.data);
          if (message.type === "custom") {
            ws == null ? void 0 : ws.dispatchEvent(
              new CustomEvent(message.event, { detail: message.data })
            );
          }
        } catch (err) {
          logger.error("Failed to handle message", err);
        }
      });
    }
    return ws;
  }
  function keepServiceWorkerAlive() {
    setInterval(async () => {
      await browser.runtime.getPlatformInfo();
    }, 5e3);
  }
  function reloadContentScript(payload) {
    const manifest = browser.runtime.getManifest();
    if (manifest.manifest_version == 2) {
      void reloadContentScriptMv2();
    } else {
      void reloadContentScriptMv3(payload);
    }
  }
  async function reloadContentScriptMv3({
    registration,
    contentScript
  }) {
    if (registration === "runtime") {
      await reloadRuntimeContentScriptMv3(contentScript);
    } else {
      await reloadManifestContentScriptMv3(contentScript);
    }
  }
  async function reloadManifestContentScriptMv3(contentScript) {
    const id = `wxt:${contentScript.js[0]}`;
    logger.log("Reloading content script:", contentScript);
    const registered = await browser.scripting.getRegisteredContentScripts();
    logger.debug("Existing scripts:", registered);
    const existing = registered.find((cs) => cs.id === id);
    if (existing) {
      logger.debug("Updating content script", existing);
      await browser.scripting.updateContentScripts([{ ...contentScript, id }]);
    } else {
      logger.debug("Registering new content script...");
      await browser.scripting.registerContentScripts([{ ...contentScript, id }]);
    }
    await reloadTabsForContentScript(contentScript);
  }
  async function reloadRuntimeContentScriptMv3(contentScript) {
    logger.log("Reloading content script:", contentScript);
    const registered = await browser.scripting.getRegisteredContentScripts();
    logger.debug("Existing scripts:", registered);
    const matches = registered.filter((cs) => {
      var _a2, _b2;
      const hasJs = (_a2 = contentScript.js) == null ? void 0 : _a2.find((js) => {
        var _a3;
        return (_a3 = cs.js) == null ? void 0 : _a3.includes(js);
      });
      const hasCss = (_b2 = contentScript.css) == null ? void 0 : _b2.find((css) => {
        var _a3;
        return (_a3 = cs.css) == null ? void 0 : _a3.includes(css);
      });
      return hasJs || hasCss;
    });
    if (matches.length === 0) {
      logger.log(
        "Content script is not registered yet, nothing to reload",
        contentScript
      );
      return;
    }
    await browser.scripting.updateContentScripts(matches);
    await reloadTabsForContentScript(contentScript);
  }
  async function reloadTabsForContentScript(contentScript) {
    const allTabs = await browser.tabs.query({});
    const matchPatterns = contentScript.matches.map(
      (match) => new MatchPattern(match)
    );
    const matchingTabs = allTabs.filter((tab) => {
      const url = tab.url;
      if (!url) return false;
      return !!matchPatterns.find((pattern) => pattern.includes(url));
    });
    await Promise.all(
      matchingTabs.map(async (tab) => {
        try {
          await browser.tabs.reload(tab.id);
        } catch (err) {
          logger.warn("Failed to reload tab:", err);
        }
      })
    );
  }
  async function reloadContentScriptMv2(_payload) {
    throw Error("TODO: reloadContentScriptMv2");
  }
  {
    try {
      const ws2 = getDevServerWebSocket();
      ws2.addWxtEventListener("wxt:reload-extension", () => {
        browser.runtime.reload();
      });
      ws2.addWxtEventListener("wxt:reload-content-script", (event) => {
        reloadContentScript(event.detail);
      });
      if (true) {
        ws2.addEventListener(
          "open",
          () => ws2.sendCustom("wxt:background-initialized")
        );
        keepServiceWorkerAlive();
      }
    } catch (err) {
      logger.error("Failed to setup web socket connection with dev server", err);
    }
    browser.commands.onCommand.addListener((command) => {
      if (command === "wxt:reload-extension") {
        browser.runtime.reload();
      }
    });
  }
  let result;
  try {
    initPlugins();
    result = definition.main();
    if (result instanceof Promise) {
      console.warn(
        "The background's main() function return a promise, but it must be synchronous"
      );
    }
  } catch (err) {
    logger.error("The background crashed on startup!");
    throw err;
  }
  const result$1 = result;
  return result$1;
}();
background;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3NhbmRib3gvZGVmaW5lLWJhY2tncm91bmQubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0B3ZWJleHQtY29yZS9tYXRjaC1wYXR0ZXJucy9saWIvaW5kZXguanMiLCIuLi8uLi9zcmMvZW50cnlwb2ludHMvYmFja2dyb3VuZC50cyIsIi4uLy4uL25vZGVfbW9kdWxlcy93eHQvZGlzdC9icm93c2VyL2Nocm9tZS5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGRlZmluZUJhY2tncm91bmQoYXJnKSB7XG4gIGlmIChhcmcgPT0gbnVsbCB8fCB0eXBlb2YgYXJnID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB7IG1haW46IGFyZyB9O1xuICByZXR1cm4gYXJnO1xufVxuIiwiLy8gc3JjL2luZGV4LnRzXG52YXIgX01hdGNoUGF0dGVybiA9IGNsYXNzIHtcbiAgY29uc3RydWN0b3IobWF0Y2hQYXR0ZXJuKSB7XG4gICAgaWYgKG1hdGNoUGF0dGVybiA9PT0gXCI8YWxsX3VybHM+XCIpIHtcbiAgICAgIHRoaXMuaXNBbGxVcmxzID0gdHJ1ZTtcbiAgICAgIHRoaXMucHJvdG9jb2xNYXRjaGVzID0gWy4uLl9NYXRjaFBhdHRlcm4uUFJPVE9DT0xTXTtcbiAgICAgIHRoaXMuaG9zdG5hbWVNYXRjaCA9IFwiKlwiO1xuICAgICAgdGhpcy5wYXRobmFtZU1hdGNoID0gXCIqXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGdyb3VwcyA9IC8oLiopOlxcL1xcLyguKj8pKFxcLy4qKS8uZXhlYyhtYXRjaFBhdHRlcm4pO1xuICAgICAgaWYgKGdyb3VwcyA9PSBudWxsKVxuICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihtYXRjaFBhdHRlcm4sIFwiSW5jb3JyZWN0IGZvcm1hdFwiKTtcbiAgICAgIGNvbnN0IFtfLCBwcm90b2NvbCwgaG9zdG5hbWUsIHBhdGhuYW1lXSA9IGdyb3VwcztcbiAgICAgIHZhbGlkYXRlUHJvdG9jb2wobWF0Y2hQYXR0ZXJuLCBwcm90b2NvbCk7XG4gICAgICB2YWxpZGF0ZUhvc3RuYW1lKG1hdGNoUGF0dGVybiwgaG9zdG5hbWUpO1xuICAgICAgdmFsaWRhdGVQYXRobmFtZShtYXRjaFBhdHRlcm4sIHBhdGhuYW1lKTtcbiAgICAgIHRoaXMucHJvdG9jb2xNYXRjaGVzID0gcHJvdG9jb2wgPT09IFwiKlwiID8gW1wiaHR0cFwiLCBcImh0dHBzXCJdIDogW3Byb3RvY29sXTtcbiAgICAgIHRoaXMuaG9zdG5hbWVNYXRjaCA9IGhvc3RuYW1lO1xuICAgICAgdGhpcy5wYXRobmFtZU1hdGNoID0gcGF0aG5hbWU7XG4gICAgfVxuICB9XG4gIGluY2x1ZGVzKHVybCkge1xuICAgIGlmICh0aGlzLmlzQWxsVXJscylcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IHUgPSB0eXBlb2YgdXJsID09PSBcInN0cmluZ1wiID8gbmV3IFVSTCh1cmwpIDogdXJsIGluc3RhbmNlb2YgTG9jYXRpb24gPyBuZXcgVVJMKHVybC5ocmVmKSA6IHVybDtcbiAgICByZXR1cm4gISF0aGlzLnByb3RvY29sTWF0Y2hlcy5maW5kKChwcm90b2NvbCkgPT4ge1xuICAgICAgaWYgKHByb3RvY29sID09PSBcImh0dHBcIilcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNIdHRwTWF0Y2godSk7XG4gICAgICBpZiAocHJvdG9jb2wgPT09IFwiaHR0cHNcIilcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNIdHRwc01hdGNoKHUpO1xuICAgICAgaWYgKHByb3RvY29sID09PSBcImZpbGVcIilcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNGaWxlTWF0Y2godSk7XG4gICAgICBpZiAocHJvdG9jb2wgPT09IFwiZnRwXCIpXG4gICAgICAgIHJldHVybiB0aGlzLmlzRnRwTWF0Y2godSk7XG4gICAgICBpZiAocHJvdG9jb2wgPT09IFwidXJuXCIpXG4gICAgICAgIHJldHVybiB0aGlzLmlzVXJuTWF0Y2godSk7XG4gICAgfSk7XG4gIH1cbiAgaXNIdHRwTWF0Y2godXJsKSB7XG4gICAgcmV0dXJuIHVybC5wcm90b2NvbCA9PT0gXCJodHRwOlwiICYmIHRoaXMuaXNIb3N0UGF0aE1hdGNoKHVybCk7XG4gIH1cbiAgaXNIdHRwc01hdGNoKHVybCkge1xuICAgIHJldHVybiB1cmwucHJvdG9jb2wgPT09IFwiaHR0cHM6XCIgJiYgdGhpcy5pc0hvc3RQYXRoTWF0Y2godXJsKTtcbiAgfVxuICBpc0hvc3RQYXRoTWF0Y2godXJsKSB7XG4gICAgaWYgKCF0aGlzLmhvc3RuYW1lTWF0Y2ggfHwgIXRoaXMucGF0aG5hbWVNYXRjaClcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBob3N0bmFtZU1hdGNoUmVnZXhzID0gW1xuICAgICAgdGhpcy5jb252ZXJ0UGF0dGVyblRvUmVnZXgodGhpcy5ob3N0bmFtZU1hdGNoKSxcbiAgICAgIHRoaXMuY29udmVydFBhdHRlcm5Ub1JlZ2V4KHRoaXMuaG9zdG5hbWVNYXRjaC5yZXBsYWNlKC9eXFwqXFwuLywgXCJcIikpXG4gICAgXTtcbiAgICBjb25zdCBwYXRobmFtZU1hdGNoUmVnZXggPSB0aGlzLmNvbnZlcnRQYXR0ZXJuVG9SZWdleCh0aGlzLnBhdGhuYW1lTWF0Y2gpO1xuICAgIHJldHVybiAhIWhvc3RuYW1lTWF0Y2hSZWdleHMuZmluZCgocmVnZXgpID0+IHJlZ2V4LnRlc3QodXJsLmhvc3RuYW1lKSkgJiYgcGF0aG5hbWVNYXRjaFJlZ2V4LnRlc3QodXJsLnBhdGhuYW1lKTtcbiAgfVxuICBpc0ZpbGVNYXRjaCh1cmwpIHtcbiAgICB0aHJvdyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZDogZmlsZTovLyBwYXR0ZXJuIG1hdGNoaW5nLiBPcGVuIGEgUFIgdG8gYWRkIHN1cHBvcnRcIik7XG4gIH1cbiAgaXNGdHBNYXRjaCh1cmwpIHtcbiAgICB0aHJvdyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZDogZnRwOi8vIHBhdHRlcm4gbWF0Y2hpbmcuIE9wZW4gYSBQUiB0byBhZGQgc3VwcG9ydFwiKTtcbiAgfVxuICBpc1Vybk1hdGNoKHVybCkge1xuICAgIHRocm93IEVycm9yKFwiTm90IGltcGxlbWVudGVkOiB1cm46Ly8gcGF0dGVybiBtYXRjaGluZy4gT3BlbiBhIFBSIHRvIGFkZCBzdXBwb3J0XCIpO1xuICB9XG4gIGNvbnZlcnRQYXR0ZXJuVG9SZWdleChwYXR0ZXJuKSB7XG4gICAgY29uc3QgZXNjYXBlZCA9IHRoaXMuZXNjYXBlRm9yUmVnZXgocGF0dGVybik7XG4gICAgY29uc3Qgc3RhcnNSZXBsYWNlZCA9IGVzY2FwZWQucmVwbGFjZSgvXFxcXFxcKi9nLCBcIi4qXCIpO1xuICAgIHJldHVybiBSZWdFeHAoYF4ke3N0YXJzUmVwbGFjZWR9JGApO1xuICB9XG4gIGVzY2FwZUZvclJlZ2V4KHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xuICB9XG59O1xudmFyIE1hdGNoUGF0dGVybiA9IF9NYXRjaFBhdHRlcm47XG5NYXRjaFBhdHRlcm4uUFJPVE9DT0xTID0gW1wiaHR0cFwiLCBcImh0dHBzXCIsIFwiZmlsZVwiLCBcImZ0cFwiLCBcInVyblwiXTtcbnZhciBJbnZhbGlkTWF0Y2hQYXR0ZXJuID0gY2xhc3MgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1hdGNoUGF0dGVybiwgcmVhc29uKSB7XG4gICAgc3VwZXIoYEludmFsaWQgbWF0Y2ggcGF0dGVybiBcIiR7bWF0Y2hQYXR0ZXJufVwiOiAke3JlYXNvbn1gKTtcbiAgfVxufTtcbmZ1bmN0aW9uIHZhbGlkYXRlUHJvdG9jb2wobWF0Y2hQYXR0ZXJuLCBwcm90b2NvbCkge1xuICBpZiAoIU1hdGNoUGF0dGVybi5QUk9UT0NPTFMuaW5jbHVkZXMocHJvdG9jb2wpICYmIHByb3RvY29sICE9PSBcIipcIilcbiAgICB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihcbiAgICAgIG1hdGNoUGF0dGVybixcbiAgICAgIGAke3Byb3RvY29sfSBub3QgYSB2YWxpZCBwcm90b2NvbCAoJHtNYXRjaFBhdHRlcm4uUFJPVE9DT0xTLmpvaW4oXCIsIFwiKX0pYFxuICAgICk7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZUhvc3RuYW1lKG1hdGNoUGF0dGVybiwgaG9zdG5hbWUpIHtcbiAgaWYgKGhvc3RuYW1lLmluY2x1ZGVzKFwiOlwiKSlcbiAgICB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihtYXRjaFBhdHRlcm4sIGBIb3N0bmFtZSBjYW5ub3QgaW5jbHVkZSBhIHBvcnRgKTtcbiAgaWYgKGhvc3RuYW1lLmluY2x1ZGVzKFwiKlwiKSAmJiBob3N0bmFtZS5sZW5ndGggPiAxICYmICFob3N0bmFtZS5zdGFydHNXaXRoKFwiKi5cIikpXG4gICAgdGhyb3cgbmV3IEludmFsaWRNYXRjaFBhdHRlcm4oXG4gICAgICBtYXRjaFBhdHRlcm4sXG4gICAgICBgSWYgdXNpbmcgYSB3aWxkY2FyZCAoKiksIGl0IG11c3QgZ28gYXQgdGhlIHN0YXJ0IG9mIHRoZSBob3N0bmFtZWBcbiAgICApO1xufVxuZnVuY3Rpb24gdmFsaWRhdGVQYXRobmFtZShtYXRjaFBhdHRlcm4sIHBhdGhuYW1lKSB7XG4gIHJldHVybjtcbn1cbmV4cG9ydCB7XG4gIEludmFsaWRNYXRjaFBhdHRlcm4sXG4gIE1hdGNoUGF0dGVyblxufTtcbiIsImV4cG9ydCBkZWZhdWx0IGRlZmluZUJhY2tncm91bmQoe1xuICBtYWluKCkge1xuICAgIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgICAgIGlmIChyZXF1ZXN0LmFjdGlvbiA9PT0gXCJ0b2dnbGVGZWF0dXJlXCIpIHtcbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgW3JlcXVlc3QuZmVhdHVyZV06IHJlcXVlc3QuZW5hYmxlZCB9LCAoKSA9PiB7XG4gICAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3RhdHVzOiBcIkZlYXR1cmUgdG9nZ2xlZCBzdWNjZXNzZnVsbHlcIiB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAocmVxdWVzdC50eXBlID09PSBcImFuYWx5emVFbWFpbFwiKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwi8J+TqSBSZWNlaXZlZCBFbWFpbCBDb250ZW50IGZvciBBbmFseXNpczpcIiwgcmVxdWVzdD8uZW1haWxDb250ZW50KTtcbiAgICBcbiAgICAgICAgZmV0Y2goXCJodHRwczovL25pbGFpLWE3NzkubmlsbGlvbi5uZXR3b3JrL3YxL2NoYXQvY29tcGxldGlvbnNcIiwge1xuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICBcIkF1dGhvcml6YXRpb25cIjogXCJCZWFyZXIgTmlsbGlvbjIwMjVcIixcbiAgICAgICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKidcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIG1vZGVsOiBcIm1ldGEtbGxhbWEvTGxhbWEtMy4xLThCLUluc3RydWN0XCIsXG4gICAgICAgICAgICBtZXNzYWdlczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcm9sZTogXCJ1c2VyXCIsXG4gICAgICAgICAgICAgICAgY29udGVudDogYEFuYWx5emUgdGhlIGZvbGxvd2luZyBlbWFpbCBjb250ZW50IGZvciBwaGlzaGluZyBzY2Ftcywgc3VzcGljaW91cyBsaW5rcywgYW5kIHNwb29mZWQgZW1haWxzLiBJZGVudGlmeSBhbnkgbWFsaWNpb3VzIGVsZW1lbnRzIGFuZCBwcm92aWRlIGEgcGhpc2hpbmcgc2NvcmUgKDAtMTAwKSBiYXNlZCBvbiByaXNrIGxldmVsLiBSZXR1cm4gYSBvbmUtbGluZSBzdW1tYXJ5IGluZGljYXRpbmcgdGhlIHRocmVhdCBsZXZlbCBhbmQga2V5IGZpbmRpbmdzLiBFbWFpbCBjb250ZW50OiBcIiR7cmVxdWVzdC5lbWFpbENvbnRlbnR9XCJgLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlOiAwLjIsXG4gICAgICAgICAgICB0b3BfcDogMC45NSxcbiAgICAgICAgICAgIG1heF90b2tlbnM6IDIwNDgsXG4gICAgICAgICAgICBzdHJlYW06IGZhbHNlLFxuICAgICAgICAgICAgbmlscmFnOiB7fSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSlcbiAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCLinIUgQVBJIFJlc3BvbnNlIGZyb20gTmlsbGlvbjpcIiwgZGF0YSk7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBhbmFseXNpczogZGF0YS5jaG9pY2VzWzBdLm1lc3NhZ2UuY29udGVudCB9KTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCLinYwgRXJyb3IgYW5hbHl6aW5nIGVtYWlsOlwiLCBlcnJvcik7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBlcnJvcjogXCJGYWlsZWQgdG8gYW5hbHl6ZSBlbWFpbFwiIH0pO1xuICAgICAgICAgIH0pO1xuICAgIFxuICAgICAgICByZXR1cm4gdHJ1ZTsgXG4gICAgICB9XG4gICAgICBpZiAocmVxdWVzdC50eXBlID09PSBcImFuYWx5emVUd2VldGVyXCIpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCLwn5OpIFJlY2VpdmVkIFR3ZWV0ZXIgQ29udGVudCBmb3IgQW5hbHlzaXM6XCIsIHJlcXVlc3Q/LnR3ZWV0ZXJDb250ZW50KTtcbiAgICBcbiAgICAgICAgZmV0Y2goXCJodHRwczovL25pbGFpLWE3NzkubmlsbGlvbi5uZXR3b3JrL3YxL2NoYXQvY29tcGxldGlvbnNcIiwge1xuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICBcIkF1dGhvcml6YXRpb25cIjogXCJCZWFyZXIgTmlsbGlvbjIwMjVcIixcbiAgICAgICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKidcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIG1vZGVsOiBcIm1ldGEtbGxhbWEvTGxhbWEtMy4xLThCLUluc3RydWN0XCIsXG4gICAgICAgICAgICBtZXNzYWdlczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcm9sZTogXCJ1c2VyXCIsXG4gICAgICAgICAgICAgICAgY29udGVudDogYEFuYWx5emUgdGhlIGZvbGxvd2luZyB0d2VldGVyIGRtIGZvciBwaGlzaGluZyBzY2FtczogXCIke3JlcXVlc3QudHdlZXRlckNvbnRlbnR9XCJgLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlOiAwLjIsXG4gICAgICAgICAgICB0b3BfcDogMC45NSxcbiAgICAgICAgICAgIG1heF90b2tlbnM6IDIwNDgsXG4gICAgICAgICAgICBzdHJlYW06IGZhbHNlLFxuICAgICAgICAgICAgbmlscmFnOiB7fSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSlcbiAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCLinIUgQVBJIFJlc3BvbnNlIGZyb20gTmlsbGlvbjpcIiwgZGF0YSk7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBhbmFseXNpczogZGF0YS5jaG9pY2VzWzBdLm1lc3NhZ2UuY29udGVudCB9KTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCLinYwgRXJyb3IgYW5hbHl6aW5nIGVtYWlsOlwiLCBlcnJvcik7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBlcnJvcjogXCJGYWlsZWQgdG8gYW5hbHl6ZSBlbWFpbFwiIH0pO1xuICAgICAgICAgIH0pO1xuICAgIFxuICAgICAgICByZXR1cm4gdHJ1ZTsgXG4gICAgICB9IFxuICAgIH0pOyBcblxuICAgIGNocm9tZS5jb250ZXh0TWVudXMuY3JlYXRlKHtcbiAgICAgIGlkOiBcImNoZWNrLWNvbnRyYWN0LWFkZHJlc3NcIixcbiAgICAgIHRpdGxlOiBcIkNoZWNrIENvbnRyYWN0IEFkZHJlc3NcIixcbiAgICAgIGNvbnRleHRzOiBbXCJhbGxcIl0sXG4gICAgfSk7XG5cbiAgICBjaHJvbWUuY29udGV4dE1lbnVzLm9uQ2xpY2tlZC5hZGRMaXN0ZW5lcigoaW5mbywgdGFiKSA9PiB7XG4gICAgICBpZiAoaW5mby5tZW51SXRlbUlkID09PSBcImNoZWNrLWNvbnRyYWN0LWFkZHJlc3NcIikge1xuICAgICAgICBjaHJvbWUucnVudGltZS5vcGVuT3B0aW9uc1BhZ2UoKTtcbiAgICAgICAgY2hyb21lLndpbmRvd3MuY3JlYXRlKHtcbiAgICAgICAgICB1cmw6IFwiY29udHJhY3QvaW5kZXguaHRtbFwiLFxuICAgICAgICAgIHR5cGU6IFwicG9wdXBcIixcbiAgICAgICAgICB3aWR0aDogNDAwLFxuICAgICAgICAgIGhlaWdodDogNjAwLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTsgXG4gIH0sXG5cbn0pO1xuIiwiZXhwb3J0IGNvbnN0IGJyb3dzZXIgPSAoXG4gIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgZ2xvYmFsVGhpcy5icm93c2VyPy5ydW50aW1lPy5pZCA9PSBudWxsID8gZ2xvYmFsVGhpcy5jaHJvbWUgOiAoXG4gICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgIGdsb2JhbFRoaXMuYnJvd3NlclxuICApXG4pO1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFPLFdBQVMsaUJBQWlCLEtBQUs7QUFDcEMsUUFBSSxPQUFPLFFBQVEsT0FBTyxRQUFRLFdBQVksUUFBTyxFQUFFLE1BQU0sSUFBSztBQUNsRSxXQUFPO0FBQUEsRUFDVDtBQ0ZBLE1BQUksZ0JBQWdCLE1BQU07QUFBQSxJQUN4QixZQUFZLGNBQWM7QUFDeEIsVUFBSSxpQkFBaUIsY0FBYztBQUNqQyxhQUFLLFlBQVk7QUFDakIsYUFBSyxrQkFBa0IsQ0FBQyxHQUFHLGNBQWMsU0FBUztBQUNsRCxhQUFLLGdCQUFnQjtBQUNyQixhQUFLLGdCQUFnQjtBQUFBLE1BQzNCLE9BQVc7QUFDTCxjQUFNLFNBQVMsdUJBQXVCLEtBQUssWUFBWTtBQUN2RCxZQUFJLFVBQVU7QUFDWixnQkFBTSxJQUFJLG9CQUFvQixjQUFjLGtCQUFrQjtBQUNoRSxjQUFNLENBQUMsR0FBRyxVQUFVLFVBQVUsUUFBUSxJQUFJO0FBQzFDLHlCQUFpQixjQUFjLFFBQVE7QUFDdkMseUJBQWlCLGNBQWMsUUFBUTtBQUV2QyxhQUFLLGtCQUFrQixhQUFhLE1BQU0sQ0FBQyxRQUFRLE9BQU8sSUFBSSxDQUFDLFFBQVE7QUFDdkUsYUFBSyxnQkFBZ0I7QUFDckIsYUFBSyxnQkFBZ0I7QUFBQSxNQUMzQjtBQUFBLElBQ0E7QUFBQSxJQUNFLFNBQVMsS0FBSztBQUNaLFVBQUksS0FBSztBQUNQLGVBQU87QUFDVCxZQUFNLElBQUksT0FBTyxRQUFRLFdBQVcsSUFBSSxJQUFJLEdBQUcsSUFBSSxlQUFlLFdBQVcsSUFBSSxJQUFJLElBQUksSUFBSSxJ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QUE7QUFBQSxjQUNDLGdCQUFBO0FBQUEsY0FDUyxpQkFBQTtBQUFBLGNBQ0MsK0JBQUE7QUFBQSxZQUNjO0FBQUEsWUFDakMsTUFBQSxLQUFBLFVBQUE7QUFBQSxjQUNxQixPQUFBO0FBQUEsY0FDWixVQUFBO0FBQUEsZ0JBQ0c7QUFBQSxrQkFDUixNQUFBO0FBQUEsa0JBQ1EsU0FBQSx5REFBQSxRQUFBLGNBQUE7QUFBQSxnQkFDa0Y7QUFBQSxjQUMxRjtBQUFBLGNBQ0YsYUFBQTtBQUFBLGNBQ2EsT0FBQTtBQUFBLGNBQ04sWUFBQTtBQUFBLGNBQ0ssUUFBQTtBQUFBLGNBQ0osUUFBQSxDQUFBO0FBQUEsWUFDQyxDQUFBO0FBQUEsVUFDVixDQUFBLEVBQUEsS0FBQSxDQUFBLGFBQUEsU0FBQSxNQUFBLEVBQUEsS0FBQSxDQUFBLFNBQUE7QUFJQyxvQkFBQSxJQUFBLGdDQUFBLElBQUE7QUFDQSx5QkFBQSxFQUFBLFVBQUEsS0FBQSxRQUFBLENBQUEsRUFBQSxRQUFBLFNBQUE7QUFBQSxVQUEwRCxDQUFBLEVBQUEsTUFBQSxDQUFBLFVBQUE7QUFHMUQsb0JBQUEsTUFBQSw0QkFBQSxLQUFBO0FBQ0EseUJBQUEsRUFBQSxPQUFBLDJCQUFBO0FBQUEsVUFBaUQsQ0FBQTtBQUdyRCxpQkFBQTtBQUFBLFFBQU87QUFBQSxNQUNULENBQUE7QUFHRixhQUFBLGFBQUEsT0FBQTtBQUFBLFFBQTJCLElBQUE7QUFBQSxRQUNyQixPQUFBO0FBQUEsUUFDRyxVQUFBLENBQUEsS0FBQTtBQUFBLE1BQ1MsQ0FBQTtBQUdsQixhQUFBLGFBQUEsVUFBQSxZQUFBLENBQUEsTUFBQSxRQUFBO0FBQ0UsWUFBQSxLQUFBLGVBQUEsMEJBQUE7QUFDRSxpQkFBQSxRQUFBLGdCQUFBO0FBQ0EsaUJBQUEsUUFBQSxPQUFBO0FBQUEsWUFBc0IsS0FBQTtBQUFBLFlBQ2YsTUFBQTtBQUFBLFlBQ0MsT0FBQTtBQUFBLFlBQ0MsUUFBQTtBQUFBLFVBQ0MsQ0FBQTtBQUFBLFFBQ1Q7QUFBQSxNQUNILENBQUE7QUFBQSxJQUNEO0FBQUEsRUFHTCxDQUFBOzs7O0FDdkdPLFFBQU07QUFBQTtBQUFBLE1BRVgsc0JBQVcsWUFBWCxtQkFBb0IsWUFBcEIsbUJBQTZCLE9BQU0sT0FBTyxXQUFXO0FBQUE7QUFBQSxNQUVuRCxXQUFXO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbMCwxLDNdfQ==
