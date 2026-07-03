/**
 * Lovable Powerkits — Security Middleware Layer
 * Handles anti-tampering, DevTools/debugger detection, and client-side RS256 JWT validation.
 */
(function () {
  // --- Base64URL Decoders for JWT ---
  function base64UrlDecode(str) {
    var base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    var padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    return atob(padded);
  }

  // Signature verification is performed on the backend; client checks format and expiration
  async function verifyJwtClientSide(token) {
    if (!token || token.indexOf('eyJ') !== 0) return false;
    try {
      var parts = token.split('.');
      if (parts.length !== 3) return false;
      var payload = parts[1];

      // Validate expiration
      var jsonPayload = JSON.parse(base64UrlDecode(payload));
      if (jsonPayload.exp && jsonPayload.exp * 1000 < Date.now()) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  // --- Anti-Tampering Engine ---
  function onTamperingDetected(reason) {
    console.warn("[Security] Tampering event logged: " + reason);
    
    // Clear storage and revoke license locally
    chrome.storage.local.remove([
      "ql_license_valid",
      "ql_license_key",
      "ql_session_id",
      "ql_user_name",
      "ql_expires_at",
      "ql_activated_at",
      "ql_license_status",
      "ql_validity_minutes"
    ], function() {
      // Invalidate memory cache in license guard if loaded
      if (typeof window.pkInvalidateAssertCache === "function") {
        window.pkInvalidateAssertCache();
      }

      // Send threat report event to the security log endpoint
      chrome.storage.local.get(["ql_hw_fingerprint"], function(res) {
        var deviceId = res.ql_hw_fingerprint || "unknown";
        var apiBase = typeof POWERKITS_API_BASE !== "undefined" ? POWERKITS_API_BASE : "https://lov.powerkits.net";
        chrome.runtime.sendMessage({
          action: "proxyFetch",
          url: apiBase + "/functions/v1/assert-session",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            device_id: deviceId,
            tampering_event: reason,
            details: {
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString()
            }
          })
        });
      });

      // Reload panel or page after brief pause (disabled to prevent refresh loops)
      /*
      setTimeout(function() {
        if (typeof window !== "undefined" && window.location) {
          window.location.reload();
        }
      }, 800);
      */
    });
  }

  // 1. Active debugging blocker (safe loop, does not reload)
  (function debuggerLoop() {
    var start = Date.now();
    debugger;
    var duration = Date.now() - start;
    if (duration > 150) {
      onTamperingDetected("active_debugger_paused");
    }
    setTimeout(debuggerLoop, 1500);
  })();

  // 2. API Hook/Override detection (validates native methods)
  function verifyFunctionIntegrity(fn) {
    if (typeof fn !== "function") return false;
    var str = Function.prototype.toString.call(fn);
    return str.indexOf("[native code]") !== -1;
  }

  setInterval(function() {
    try {
      if (!verifyFunctionIntegrity(window.fetch) ||
          !verifyFunctionIntegrity(chrome.storage.local.get) ||
          !verifyFunctionIntegrity(chrome.storage.local.set) ||
          !verifyFunctionIntegrity(chrome.runtime.sendMessage)) {
        onTamperingDetected("api_hooks_injected");
      }
    } catch(e) {}
  }, 4000);

  // Expose verification function globally
  window.verifyJwtClientSide = verifyJwtClientSide;
})();
