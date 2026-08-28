/**
 * ChatMolded Embeddable Widget Runtime
 * Version: 1.0.0
 * Lightweight (~3KB), zero-dependency, zero CSS-bleed iframe launcher.
 */

(function () {
  if (window.__CHATMOLDED_INITIALIZED__) return;
  window.__CHATMOLDED_INITIALIZED__ = true;

  // 1. Locate the calling script tag and its configuration attributes
  const currentScript =
    document.currentScript ||
    document.querySelector('script[data-bot-id]') ||
    document.querySelector('script[src*="widget.js"]');

  if (!currentScript) {
    console.error("[ChatMolded] Script tag with data-bot-id attribute not found.");
    return;
  }

  const botId = currentScript.getAttribute("data-bot-id");
  if (!botId) {
    console.error("[ChatMolded] Missing required attribute 'data-bot-id' on script tag.");
    return;
  }

  const scriptSrc = currentScript.getAttribute("src") || "";
  let hostOrigin = "";
  try {
    const parsedUrl = new URL(scriptSrc, window.location.href);
    hostOrigin = parsedUrl.origin;
  } catch {
    hostOrigin = window.location.origin;
  }

  const theme = currentScript.getAttribute("data-theme") || "emerald";
  const position = currentScript.getAttribute("data-position") || "bottom-right";
  const avatarUrl = currentScript.getAttribute("data-avatar-url");

  // Theme color hex map
  const themeColors = {
    emerald: "#10b981",
    cyan: "#06b6d4",
    indigo: "#6366f1",
    purple: "#a855f7",
  };
  const accentColor = themeColors[theme] || themeColors.emerald;

  // 2. Inject Styles
  const styleEl = document.createElement("style");
  styleEl.textContent = `
    .chatmolded-launcher-btn {
      position: fixed;
      ${position === "bottom-left" ? "left: 24px;" : "right: 24px;"}
      bottom: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: ${accentColor};
      box-shadow: 0 10px 25px -5px ${accentColor}80, 0 8px 10px -6px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 2147483640;
      border: none;
      outline: none;
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
      -webkit-tap-highlight-color: transparent;
    }
    .chatmolded-launcher-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 15px 30px -5px ${accentColor}a0, 0 10px 12px -6px rgba(0, 0, 0, 0.4);
    }
    .chatmolded-launcher-btn:active {
      transform: scale(0.95);
    }
    .chatmolded-launcher-icon, .chatmolded-launcher-close {
      transition: transform 0.25s ease, opacity 0.25s ease;
      position: absolute;
    }
    .chatmolded-launcher-icon {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }
    .chatmolded-launcher-close {
      opacity: 0;
      transform: scale(0.6) rotate(-90deg);
    }
    .chatmolded-launcher-btn.is-open .chatmolded-launcher-icon {
      opacity: 0;
      transform: scale(0.6) rotate(90deg);
    }
    .chatmolded-launcher-btn.is-open .chatmolded-launcher-close {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }
    .chatmolded-iframe-container {
      position: fixed;
      ${position === "bottom-left" ? "left: 24px;" : "right: 24px;"}
      bottom: 92px;
      width: 400px;
      height: 600px;
      max-width: calc(100vw - 32px);
      max-height: calc(100vh - 116px);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.12);
      z-index: 2147483647;
      opacity: 0;
      transform: translateY(18px) scale(0.96);
      transform-origin: ${position === "bottom-left" ? "bottom left" : "bottom right"};
      pointer-events: none;
      transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .chatmolded-iframe-container.is-open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }
    .chatmolded-iframe {
      width: 100%;
      height: 100%;
      border: none;
      display: block;
      background: #070a12;
    }
    @media (max-width: 640px) {
      .chatmolded-iframe-container {
        left: 16px !important;
        right: 16px !important;
        bottom: 88px !important;
        width: auto !important;
        height: calc(100vh - 104px) !important;
      }
      .chatmolded-launcher-btn {
        ${position === "bottom-left" ? "left: 16px;" : "right: 16px;"}
        bottom: 16px;
      }
    }
  `;
  document.head.appendChild(styleEl);

  // 3. Create Launcher Button
  const launcherBtn = document.createElement("button");
  launcherBtn.className = "chatmolded-launcher-btn";
  launcherBtn.setAttribute("aria-label", "Toggle AI Chatbot");
  launcherBtn.setAttribute("type", "button");

  launcherBtn.innerHTML = `
    ${
      avatarUrl
        ? `<img src="${avatarUrl}" alt="" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" class="chatmolded-launcher-icon" />`
        : `<svg class="chatmolded-launcher-icon" width="26" height="26" viewBox="0 0 24 24" fill="#0f172a">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.1 21.9a1 1 0 0 0 1.25 1.25l4.9-1.238A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
          </svg>`
    }
    <svg class="chatmolded-launcher-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `;
  document.body.appendChild(launcherBtn);

  // 4. Create Iframe Container
  const iframeContainer = document.createElement("div");
  iframeContainer.className = "chatmolded-iframe-container";

  const iframe = document.createElement("iframe");
  iframe.className = "chatmolded-iframe";
  iframe.src = `${hostOrigin}/embed/${botId}`;
  iframe.title = "ChatMolded AI Assistant";
  iframe.setAttribute("allow", "clipboard-read; clipboard-write;");
  iframeContainer.appendChild(iframe);
  document.body.appendChild(iframeContainer);

  let isOpen = false;

  const toggleWidget = (forceState) => {
    isOpen = typeof forceState === "boolean" ? forceState : !isOpen;
    if (isOpen) {
      launcherBtn.classList.add("is-open");
      iframeContainer.classList.add("is-open");
    } else {
      launcherBtn.classList.remove("is-open");
      iframeContainer.classList.remove("is-open");
    }
  };

  launcherBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleWidget();
  });

  // 5. Listen for messages from inside the iframe (e.g. user clicked Close button)
  window.addEventListener("message", (event) => {
    if (event.data && event.data.type === "chatmolded:close") {
      toggleWidget(false);
    }
  });

  // 6. Close widget when clicking outside on desktop
  document.addEventListener("click", (e) => {
    if (
      isOpen &&
      !iframeContainer.contains(e.target) &&
      !launcherBtn.contains(e.target)
    ) {
      toggleWidget(false);
    }
  });
})();
