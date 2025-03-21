import { GoPlus, ErrorCode } from "@goplus/sdk-node";
import { analyzeEmail } from "@/utils/utils";
import axios from "axios";

const freeHostingProviders = [
  "github.io",
  "netlify.app",
  "vercel.app",
  "herokuapp.com",
  "pages.cloudflare.com",
  "firebaseapp.com",
  "surge.sh",
  "glitch.com",
  "replit.com",
  "render.com",
  "railway.com",
  "neocities.org",
  "awardspace.com",
  "byet.host",
  "infinityfree.com",
  "koyeb.com",
  "wix.com",
];

// Utility functions
const checkDomainAge = (
  creationDate: string
): { age: string; color: string } => {
  const creationDateObj = parseDate(creationDate);
  if (!creationDateObj) {
    return { age: "Invalid date", color: "#FF4444" };
  }

  const now = new Date();
  const ageInMonths =
    (now.getFullYear() - creationDateObj.getFullYear()) * 12 +
    (now.getMonth() - creationDateObj.getMonth());

  let ageString =
    ageInMonths < 1
      ? "Less than 1 month"
      : ageInMonths === 1
      ? "1 month"
      : ageInMonths < 12
      ? `${ageInMonths} months`
      : `${Math.floor(ageInMonths / 12)} year${
          Math.floor(ageInMonths / 12) > 1 ? "s" : ""
        }${
          ageInMonths % 12 > 0
            ? ` and ${ageInMonths % 12} month${ageInMonths % 12 > 1 ? "s" : ""}`
            : ""
        }`;

  const color =
    ageInMonths < 1 ? "#FF4444" : ageInMonths < 3 ? "#FFCC00" : "#00FF00";
  return { age: ageString, color };
};

const checkIsFreeHosting = (url: string): boolean => {
  return freeHostingProviders.some((provider) => url.includes(provider));
};

const checkIsIpAddress = (hostname: string): boolean => {
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Pattern.test(hostname) || ipv6Pattern.test(hostname);
};

const createAlertBox = (url: string, messages: string[], color = "#ffcc00") => {
  const alertBox = document.createElement("div");
  alertBox.style.backgroundColor = color;
  alertBox.style.color = "black";
  alertBox.style.fontSize = "14px";
  alertBox.style.width = "fit-content";
  alertBox.style.maxWidth = "500px";
  alertBox.style.padding = "4px";
  alertBox.style.margin = "4px 0";
  alertBox.style.border = "1px solid orange";
  alertBox.style.zIndex = "1000";

  const messageHTML = messages
    .filter((msg) => msg)
    .map((msg) => `<p style="margin: 4px 0;">${msg}</p>`)
    .join("");

  alertBox.innerHTML = `
    ⚠️ 🚨 ScamBuzzer Alert 
    <br>URL: ${url}<br>
    ${messageHTML}
    <button class="closeWarning">OK</button>
  `;

  alertBox
    .querySelector(".closeWarning")
    ?.addEventListener("click", function () {
      alertBox.remove();
    });

  return alertBox;
};

const performSecurityChecks = (
  url: string,
  domainAge?: { age: string; color: string }
) => {
  const warnings = [];

  if (domainAge) {
    warnings.push(`Domain Age: ${domainAge.age}`);
    if (domainAge.color !== "#00FF00") {
      warnings.push(
        "⚠️ This domain is relatively new. Please proceed with caution."
      );
    }
  }

  if (checkIsFreeHosting(url)) {
    warnings.push(
      "⚠️ This site is hosted on a free hosting platform. Do not transact any transactions with crypto wallets or any transactions."
    );
  }

  if (checkIsIpAddress(url)) {
    warnings.push("⚠️ This site is hosted on an IP address.");
  }

  return warnings;
};

function extractRedirectUrl(htmlContent: string) {
  const metaRefreshRegex =
    /<meta[^>]+http-equiv=["']refresh["'][^>]+content=["']\d+;URL=([^"']+)["']/i;
  const metaRefreshMatch = htmlContent.match(metaRefreshRegex);
  if (metaRefreshMatch && metaRefreshMatch[1]) {
    return metaRefreshMatch[1];
  }

  const jsRedirectRegex = /location\.replace\(["']([^"']+)["']\)/i;
  const jsRedirectMatch = htmlContent.match(jsRedirectRegex);
  if (jsRedirectMatch && jsRedirectMatch[1]) {
    return jsRedirectMatch[1];
  }

  return null;
}

const parseDate = (dateString: string | undefined): Date | null => {
  if (!dateString) return null;
  let cleanDate = dateString.trim().replace(/\s+/, "T");

  const match = cleanDate.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})/);
  if (match) {
    const day = match[1].padStart(2, "0");
    const month = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    }[match[2]];
    return new Date(`${match[3]}-${month}-${day}T00:00:00Z`);
  }

  if (cleanDate.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
    cleanDate = cleanDate.replace(" ", "T") + "Z";
  }

  const date = new Date(cleanDate);
  return isNaN(date.getTime()) ? null : date;
};

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    console.log("✅ Phishing Detector Content Script Loaded");

    const GOOGLE_SAFE_BROWSING_API_KEY =
      "AIzaSyAtv07ftLQ0irh31f6jw9xYJ2D9R58iw5E";
    const SAFE_BROWSING_API_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GOOGLE_SAFE_BROWSING_API_KEY}`;

    const checkLinkWithGoogle = async (link: string): Promise<boolean> => {
      const requestBody = {
        client: { clientId: "phishing-detector", clientVersion: "1.0" },
        threatInfo: {
          threatTypes: [
            "MALWARE",
            "SOCIAL_ENGINEERING",
            "UNWANTED_SOFTWARE",
            "POTENTIALLY_HARMFUL_APPLICATION",
          ],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url: link }],
        },
      };

      try {
        const response = await fetch(SAFE_BROWSING_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        return data.matches && data.matches.length > 0;
      } catch (error) {
        console.error("❌ Google Safe Browsing Error:", error);
        return false;
      }
    };

    const observer = new MutationObserver((mutations) => {
      observer.disconnect();

      const cellInnerDivs = document.querySelectorAll(
        "div[data-testid='cellInnerDiv']"
      );

      if (cellInnerDivs.length > 0) {
        const allLinks = Array.from(cellInnerDivs)
          .flatMap((div) => Array.from(div.querySelectorAll("a")))
          .filter((link) => !link.dataset.processed);

        Promise.all(
          allLinks.map(async (link) => {
            link.dataset.processed = "true";

            if (link.href.includes("https://t.co/")) {
              try {
                const res = await axios.get(link.href, { maxRedirects: 1 });
                const redirectUrl = extractRedirectUrl(res.data);
                if (!redirectUrl) return;

                const warnings = performSecurityChecks(redirectUrl);

                if (warnings.length > 0 && !link.dataset.alertDisplayed) {
                  const alertBox = createAlertBox(redirectUrl, warnings);
                  link.parentNode?.insertBefore(alertBox, link.nextSibling);
                  link.dataset.alertDisplayed = "true";
                }
              } catch (error) {
                console.error("Error checking link:", error);
              }
            }
          })
        ).finally(() => {
          observer.observe(document.body, {
            childList: true,
            subtree: true,
          });
        });
      } else {
        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
      }
    });

    const scanWeb3Safe = async (url: string) => {
      const domain = url
        .replace(/^https?:\/\//, "")
        .replace(
          /^(?:www\.|api\.|docs\.|app\.|admin\.|test\.|staging\.|dev\.|manage\.|blog\.|support\.|mail\.|shop\.|static\.|cdn\.|analytics\.|search\.|demo\.|mvp\.)/,
          ""
        );

      try {
        const response = await fetch(
          `https://api2.cointopper.com/categories/whois?domain=${domain}`
        );
        const data = await response.json();

        const domainAge = checkDomainAge(data.whoisData.creationDate);
        const warnings = performSecurityChecks(url, domainAge);

        console.log(warnings, "warnings");

        if(!url.includes("messages")){
          if (warnings.length > 0) {
            const alertBox = createAlertBox(url, warnings, domainAge.color);
  
            alertBox.style.position = "fixed";
            alertBox.style.top = "20px";
            alertBox.style.right = "20px";
            alertBox.style.zIndex = "999999";
            alertBox.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
            alertBox.style.borderRadius = "4px";
  
            if (document.body) {
              document.body.insertBefore(alertBox, document.body.firstChild);
  
              // Remove the alert box after 30 seconds instead of 10
              setTimeout(() => {
                if (alertBox && alertBox.parentNode) {
                  alertBox.remove();
                }
              }, 30000);
            }
          }
        }
      } catch (error) {
        console.error("Error checking domain:", error);
      }
    };

    // Load user settings and execute detection accordingly
    chrome.storage.local.get(["web3Safe", "twitterPhishing", "emailPhishing"], async (settings) => {
      console.log("🔍 Loaded Settings:", settings);

      if (settings.web3Safe) {
        console.log("✅ Running Web3 Safe Browsing...");
        const url = window.location.href;
        scanWeb3Safe(url);
      }

      if (settings.twitterPhishing) {
        console.log("✅ Running Twitter Phishing Warning...");
        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
      }

      if (settings.emailPhishing && window.location.href.includes("mail.google.com")) {
        console.log("✅ Running Email Phishing Warning...");   
          const emailContent = "Dear user, your account has been compromised. Please click the link to verify your identity: http://fake-link.com";
         
         chrome.runtime.sendMessage(
          {
            type: "analyzeEmail",
            emailContent: emailContent,
          },
          (response) => {
            console.log(response,"  response");
            if (response && response.analysis) {
              handlePhishingAlert(response.analysis);
              console.log("Phishing Analysis Result:", response.analysis);
            } else {
              console.error("Failed to analyze email content.");
            }
          }
        );
      }
    });
  },
});

function handlePhishingAlert(analysis: string) {
  const redFlags = [
    "Urgency", "Suspicious Link", "Lack of Personalization",
    "Grammar and Spelling", "Spoofed Email", "Malicious Link",
    "Social Engineering"
  ];

  // Check if any red flags are present in the analysis
  const detectedFlags = redFlags.filter(flag => analysis.includes(flag));

  if (detectedFlags.length > 0) {
    console.warn("🚨 Phishing Detected! Red Flags:", detectedFlags);

    const alertDiv = document.createElement("div");
    alertDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: red;
        color: white;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 400px;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div style="display: flex; align-items: start; gap: 12px;">
          <div>
            <strong>🚨 WARNING: Phishing Detected!</strong>
            <p style="margin: 4px 0; font-size: 14px;">The email contains signs of a phishing attempt.</p>
            <p style="margin: 4px 0; font-size: 14px;">Detected Issues: ${detectedFlags.join(", ")}</p>
            <p style="margin: 4px 0; font-size: 14px; color: yellow;">
              ⚠️ Do NOT click on any links or provide personal information!
            </p>
          </div>
          <button onclick="this.parentElement.parentElement.remove()" style="
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 18px;
          ">×</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(alertDiv);

    // Remove alert after 10 seconds
    setTimeout(() => alertDiv.remove(), 10000);
  } else {
    console.log("✅ No phishing detected. No alert needed.");
  }
}

