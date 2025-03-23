

export const analyzeEmail = async (emailContent: string) => {
    console.log("✅ Running Email Phishing Warning...", emailContent);
    try {
        const response = await fetch(`https://nilai-a779.nillion.network/v1/chat/completions`, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer Nillion2025`,
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                "model": "meta-llama/Llama-3.1-8B-Instruct",
                "messages": [
                    {
                        "role": "user",
                        "content": `Analyze the following email for phishing scams: "${emailContent}"`
                    }
                ],
                "temperature": 0.2,
                "top_p": 0.95,
                "max_tokens": 2048,
                "stream": false,
                "nilrag": {}
            }),
        });
        console.log(response, "  response");
        const data = await response.json();
        console.log(data, "  data");
        const analysis = data.choices[0].message.content;
        return analysis;
    } catch (error) {
        console.error('Error analyzing email:', error);
    }
};
 