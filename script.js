document.getElementById("imageForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const prompt = document.getElementById("prompt").value;
    const loading = document.getElementById("loading");
    const result = document.getElementById("result");
    const errorDiv = document.getElementById("error");
    const generatedImage = document.getElementById("generatedImage");
  
    // Clear previous results and errors
    result.style.display = "none";
    errorDiv.classList.add("hidden");
    errorDiv.innerText = '';
    generatedImage.src = '';
    
    // Show loading message
    loading.classList.remove("hidden");
  
    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("output_format", "jpeg");
  
      const response = await fetch(`https://api.stability.ai/v2beta/stable-image/generate/sd3`, {
        method: "POST",
        headers: {
          Authorization: `Bearer sk-NDaWkdY99PmkXcFJhbunTT1RioKzXC31SWkmkqinaQ2ZiU6J`, 
          Accept: "image/*",
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
  
      // Hide loading, show image
      loading.classList.add("hidden");
      generatedImage.src = imageUrl;
      result.style.display = "block";
    } catch (error) {
      // Hide loading, show error message
      loading.classList.add("hidden");
      errorDiv.classList.remove("hidden");
      errorDiv.innerText = `Failed to generate image: ${error.message}`;
    }
  });
  