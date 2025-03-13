(async function () {
    if (!document.getElementById("dynamic-toast-style")) {
    const style = document.createElement("style");
            style.id = "dynamic-toast-style";
            style.innerHTML = `
                .toast-container {
                    position: fixed;
                    top: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }
    
                .toast {
                    background-color: #333;
                    background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 85%, rgba(0,212,255,1) 100%);
                    color: white;
                    padding: 12px 20px;
                    border-radius: 5px;
                    min-width: 200px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
                    opacity: 0;
                    transform: translateY(-20px);
                    transition: opacity 0.4s, transform 0.4s;
                }
    
                .toast .close-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    margin-left: 10px;
                }
    
                .textarea-wrapper {
                position: relative;
                display: flex;
                flex-direction: column;
                width: 100%;
                margin-bottom: 20px;
            }
    
            .textarea-wrapper textarea {
                padding: 12px;
                width: 100%;
                box-sizing: border-box;
                height: 100px !important;
                border: 1px solid #ccc;
                border-radius: 6px;
                font-size: 14px;
                transition: border-color 0.3s ease;
                resize: vertical;
            }
    
            .textarea-wrapper textarea:focus {
                border-color: #218838;
                outline: none;
            }
    
            .button-container {
                float: right !important;
                gap: 10px;
                margin-bottom: 5px;
            }
           
            .summarize-query-btn {
            margin-top: 20px !important;
            margin-right: 15px !important;
            }
    
            .enhance-text-btn, .use-text-btn, .generate-response-btn, .summarize-query-btn {
                float: right;
                margin-left: 10px;
                font-size: 14px;
                padding: 10px 15px;
                border: none;
                background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 64%, rgba(0,212,255,1) 100%);
                color: #fff;
                cursor: pointer;
                border-radius: 5px;
                box-shadow: 0 3px 8px rgba(0,0,0,0.2);
                transition: background 0.3s ease, transform 0.2s ease-in-out;
            }
    
            .enhance-text-btn:hover, .use-text-btn:hover, .generate-response-btn:hover, .summarize-query-btn:hover {
                transform: scale(1.05);
            }
    
            .enhance-text-btn:active, .use-text-btn:active, .generate-response-btn:active, .summarize-query-btn:active {
                background: rgb(2,0,36);
                transform: scale(0.95);
            }
    
                .output-box {
                    margin-top: 12px;
                    padding: 12px;
                    border: 1px solid #ddd;
                    background: #f9f9f9;
                    color: #333;
                    border-radius: 5px;
                    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
                    display: none;
                    animation: fadeIn 0.5s ease-in-out;
                }
    
            .text-output {
                margin: 0;
                padding: 6px 0;
                font-weight: bold;
                font-size: 14px;
            }
    
            .use-text-btn {
                display: none;
                margin-top: 8px;
            }
    
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
           
           
           
            `;
            document.head.appendChild(style);
    }
    
    function showToast(message, duration = 3000) {
    let toastContainer = document.getElementById("toast-container");
            if (!toastContainer) {
    toastContainer = document.createElement("div");
            toastContainer.id = "toast-container";
            toastContainer.className = "toast-container";
            document.body.appendChild(toastContainer);
    }
    
    let toast = document.createElement("div");
            toast.className = "toast";
            toast.innerHTML = `
                <span>${message}</span>
                <button class="close-btn">&times;</button>
            `;
            toastContainer.appendChild(toast);
            setTimeout(() => {
            toast.style.opacity = "1";
                    toast.style.transform = "translateY(0)";
            }, 100);
            toast.querySelector(".close-btn").addEventListener("click", () => {
    hideToast(toast);
    });
            let autoHide = setTimeout(() => {
            hideToast(toast);
            }, duration);
            toast.querySelector(".close-btn").addEventListener("click", () => {
    clearTimeout(autoHide);
    });
    }
    
    function hideToast(toast) {
    toast.style.opacity = "0";
            toast.style.transform = "translateY(-20px)";
            setTimeout(() => toast.remove(), 400);
    }
    
    async function sendPrompt(text, flag) {
    try {
    const response = await fetch(`aiUtility.do?flag=${flag}&text=${encodeURIComponent(text)}`, {
    method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: { text } })
    });
            const data = await response.json();
            return data.text || "Error: Unable to get suggestions.";
    } catch (error) {
    console.error("API Error:", error);
            return "Error: Unable to get suggestions.";
    }
    }
    
    function addGrammarCheckerToTextareas() {
    document.querySelectorAll("textarea.useAIEnhancer").forEach((textarea) => {
    if (textarea.dataset.grammarCheckerAttached) return;
            const wrapper = document.createElement("div");
            wrapper.className = "textarea-wrapper";
            textarea.parentNode.insertBefore(wrapper, textarea);
            wrapper.appendChild(textarea);
            const buttonContainer = document.createElement("div");
            buttonContainer.className = "button-container";
            const enhanceBtn = document.createElement("button");
            enhanceBtn.innerHTML = '<i class="fa fa-magic"></i> Enhance Text';
            enhanceBtn.className = "enhance-text-btn btn-sm";
            buttonContainer.appendChild(enhanceBtn);
            const summarizeBtn = document.createElement("button");
            summarizeBtn.innerHTML = '<i class="fa fa-magic"></i> Summarize Ticket';
            summarizeBtn.className = "summarize-query-btn btn-sm";
            const ticketHeader = document.querySelector(".ticket-details-header");
            if (ticketHeader) ticketHeader.prepend(summarizeBtn);
            let responseBtn;
            if (textarea.classList.contains("useAIAutoReply")) {
    responseBtn = document.createElement("button");
            responseBtn.innerHTML = '<i class="fa fa-magic"></i> Generate Reply';
            responseBtn.className = "generate-response-btn btn-sm";
            buttonContainer.appendChild(responseBtn);
    }
    
    wrapper.insertBefore(buttonContainer, textarea);
            const outputDiv = document.createElement("div");
            outputDiv.className = "output-box";
            const textOutput = document.createElement("p");
            textOutput.className = "text-output";
            const useTextBtn = document.createElement("button");
            useTextBtn.innerText = "Use This Text";
            useTextBtn.className = "use-text-btn btn-sm";
            outputDiv.appendChild(textOutput);
            outputDiv.appendChild(useTextBtn);
            wrapper.appendChild(outputDiv);
            textarea.dataset.grammarCheckerAttached = "true";
            enhanceBtn.addEventListener("click", async () => {
            const text = textarea.value.trim();
                    if (!text) {
            showToast("Please enter some text.", 1500);
                    return;
            }
            textOutput.innerHTML = "Processing your input...";
                    outputDiv.style.display = "block";
                    const correctedText = await sendPrompt(text, "correct");
                    textOutput.innerHTML = correctedText;
                    useTextBtn.style.display = "inline-block";
            });
            if (textarea.classList.contains("useAIAutoReply") && responseBtn) {
    responseBtn.addEventListener("click", async () => {
    if (typeof chatData === "undefined" || !chatData) {
    showToast("No input to generate a reply.", 1500);
            return;
    }
    textOutput.innerHTML = "Generating Reply...";
            outputDiv.style.display = "block";
            const responseText = await sendPrompt(chatData, "response");
            textOutput.innerHTML = responseText;
            useTextBtn.style.display = "inline-block";
    });
    }
    
    summarizeBtn.addEventListener("click", async () => {
    if (typeof chatData === "undefined" || !chatData) {
    showToast("There is no input to summarize.", 1500);
            return;
    }
    showToast("Summarizing Information...", 2000);
            const summary = await sendPrompt(chatData, "summary");
            showToast(summary, 15000);
    });
            useTextBtn.addEventListener("click", () => {
            textarea.value = textOutput.innerText;
                    outputDiv.style.display = "none";
            });
    });
    }
    
    async function generateResolveRemarks() {
    const textarea = document.querySelector("textarea.useAIEnhancer");
            if (!textarea) {
    showToast("No suitable text area found.", 2000);
            return;
            }
    
    
    let wrapper = textarea.closest(".textarea-wrapper");
            if (!wrapper) {
    wrapper = document.createElement("div");
            wrapper.className = "textarea-wrapper";
            textarea.parentNode.insertBefore(wrapper, textarea);
            wrapper.appendChild(textarea);
    }
    
    let outputDiv = wrapper.querySelector(".output-box");
            if (!outputDiv) {
    outputDiv = document.createElement("div");
            outputDiv.className = "output-box";
            outputDiv.style.display = "none";
            const textOutput = document.createElement("p");
            textOutput.className = "text-output";
            const useTextBtn = document.createElement("button");
            useTextBtn.innerText = "Use This Text";
            useTextBtn.className = "use-text-btn btn-sm";
            outputDiv.appendChild(textOutput);
            outputDiv.appendChild(useTextBtn);
            wrapper.appendChild(outputDiv);
            useTextBtn.addEventListener("click", () => {
            textarea.value = textOutput.innerText;
                    outputDiv.style.display = "none";
            });
    }
    
    const textOutput = outputDiv.querySelector(".text-output");
            const useTextBtn = outputDiv.querySelector(".use-text-btn");
            // Process and update the text output
            textOutput.innerHTML = "Generating resolve remarks...";
            outputDiv.style.display = "block";
            const remarks = await sendPrompt(chatData + ` ` + textarea.value, "summary");
            textOutput.innerHTML = remarks;
            useTextBtn.style.display = "inline-block";
    }
    
    
    async function hideResolveRemakrs() {
    
    const textarea = document.querySelector("textarea.useAIEnhancer");
            if (!textarea) {
    showToast("No suitable text area found.", 2000);
            return;
            }
    
    
    let wrapper = textarea.closest(".textarea-wrapper");
            if (!wrapper) {
    wrapper = document.createElement("div");
            wrapper.className = "textarea-wrapper";
            textarea.parentNode.insertBefore(wrapper, textarea);
            wrapper.appendChild(textarea);
    }
    
    let outputDiv = wrapper.querySelector(".output-box");
            if (!outputDiv) {
    outputDiv = document.createElement("div");
            outputDiv.className = "output-box";
            outputDiv.style.display = "none";
            const textOutput = document.createElement("p");
            textOutput.className = "text-output";
            const useTextBtn = document.createElement("button");
            useTextBtn.innerText = "Use This Text";
            useTextBtn.className = "use-text-btn btn-sm";
            outputDiv.appendChild(textOutput);
            outputDiv.appendChild(useTextBtn);
            wrapper.appendChild(outputDiv);
            useTextBtn.addEventListener("click", () => {
            textarea.value = textOutput.innerText;
                    outputDiv.style.display = "none";
            });
    }
    
    const textOutput = outputDiv.querySelector(".text-output");
            const useTextBtn = outputDiv.querySelector(".use-text-btn");
            // Process and update the text output
            //textOutput.innerHTML = "Generating resolve remarks...";
            outputDiv.style.display = "None";
            //const remarks = await sendPrompt(chatData + ` ` +textarea.value, "summary");
            // textOutput.innerHTML = remarks;
            useTextBtn.style.display = "none";
    }
    
    window.hideResolveRemakrs = hideResolveRemakrs;
    window.enableGrammarChecker = addGrammarCheckerToTextareas;
            window.generateResolveRemarks = generateResolveRemarks;
            document.addEventListener("DOMContentLoaded", addGrammarCheckerToTextareas);
            })();
