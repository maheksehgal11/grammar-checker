(async function () {
  async function correctGrammar(text) {
    try {
      const response = await fetch("/correct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text }),
      });

      const data = await response.json();
      return data.corrected || "Error: Unable to get correction.";
    } catch (error) {
      console.error("Grammar API Error:", error);
      return "Error: Failed to connect.";
    }
  }

  function addGrammarCheckerToTextareas() {
    document.querySelectorAll("textarea").forEach((textarea) => {
      const btn = document.createElement("button");
      btn.innerText = "Check Grammar";
      btn.style.display = "block";
      btn.style.marginTop = "10px";
      btn.classList.add("btn", "btn-primary");

      const outputDiv = document.createElement("div");
      outputDiv.style.marginTop = "10px";
      outputDiv.style.padding = "10px";
      outputDiv.style.border = "1px solid #ccc";
      outputDiv.style.background = "#222";
      outputDiv.style.color = "#fff";

      textarea.parentNode.appendChild(btn);
      textarea.parentNode.appendChild(outputDiv);

      btn.addEventListener("click", async () => {
        const text = textarea.value.trim();
        if (!text) {
          outputDiv.innerHTML = "Please enter some text.";
          return;
        }
        outputDiv.innerHTML = "Processing...";
        const correctedText = await correctGrammar(text);
        outputDiv.innerHTML = correctedText;
      });
    });
  }

  // Expose function globally
  window.enableGrammarChecker = addGrammarCheckerToTextareas;

  document.addEventListener("DOMContentLoaded", addGrammarCheckerToTextareas);
})();
