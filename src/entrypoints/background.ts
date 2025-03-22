export default defineBackground({
  main() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "toggleFeature") {
        chrome.storage.local.set({ [request.feature]: request.enabled }, () => {
          sendResponse({ status: "Feature toggled successfully" });
        });
      }
      if (request.type === "analyzeEmail") {
        console.log("📩 Received Email Content for Analysis:", request?.emailContent);
    
        fetch("https://nilai-a779.nillion.network/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer Nillion2025",
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            model: "meta-llama/Llama-3.1-8B-Instruct",
            messages: [
              {
                role: "user",
                content: `Analyze the following email for phishing scams: "${request.emailContent}"`,
              },
            ],
            temperature: 0.2,
            top_p: 0.95,
            max_tokens: 2048,
            stream: false,
            nilrag: {},
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("✅ API Response from Nillion:", data);
            sendResponse({ analysis: data.choices[0].message.content });
          })
          .catch((error) => {
            console.error("❌ Error analyzing email:", error);
            sendResponse({ error: "Failed to analyze email" });
          });
    
        return true; 
      }
      if (request.type === "analyzeTweeter") {
        console.log("📩 Received Tweeter Content for Analysis:", request?.tweeterContent);
    
        fetch("https://nilai-a779.nillion.network/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer Nillion2025",
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            model: "meta-llama/Llama-3.1-8B-Instruct",
            messages: [
              {
                role: "user",
                content: `Analyze the following tweeter dm for phishing scams: "${request.tweeterContent}"`,
              },
            ],
            temperature: 0.2,
            top_p: 0.95,
            max_tokens: 2048,
            stream: false,
            nilrag: {},
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("✅ API Response from Nillion:", data);
            sendResponse({ analysis: data.choices[0].message.content });
          })
          .catch((error) => {
            console.error("❌ Error analyzing email:", error);
            sendResponse({ error: "Failed to analyze email" });
          });
    
        return true; 
      } 

      
    }); 

    chrome.contextMenus.create({
      id: "check-contract-address",
      title: "Check Contract Address",
      contexts: ["all"],
    });

    chrome.contextMenus.onClicked.addListener((info, tab) => {
      if (info.menuItemId === "check-contract-address") {
        chrome.runtime.openOptionsPage();
        chrome.windows.create({
          url: "contract/index.html",
          type: "popup",
          width: 400,
          height: 600,
        });
      }
    }); 
  },

});
