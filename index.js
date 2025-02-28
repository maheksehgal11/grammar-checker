document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const inputBox = document.querySelector("#text");
  const outputDiv = document.querySelector(".p-3.bg-dark.text-light.border.rounded");

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission

    const userText = inputBox.value.trim();
    if (!userText) {
      outputDiv.innerHTML = '<p class="text-muted">Please enter some text.</p>';
      return;
    }

    // Show loading state
    outputDiv.innerHTML = '<p class="text-muted">Processing...</p>';

    try {
      const response = await fetch("/correct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: userText }),
      });

      const data = await response.json();
      if (data.corrected) {
        outputDiv.innerHTML = `<p>${data.corrected.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`;
      } else {
        outputDiv.innerHTML = '<p class="text-muted">No correction found.</p>';
      }
    } catch (error) {
      console.error("Error:", error);
      outputDiv.innerHTML = '<p class="text-danger">Error: Unable to get correction.</p>';
    }
  });
});
