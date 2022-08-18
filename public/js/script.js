const form = document.getElementById("notionForm");
const onSuccess = document.getElementById("onSuccess");
const onError = document.getElementById("onError");
const successStatus = document.getElementById("successStatus");
const successMessage = document.getElementById("successMessage");
const successSpace = document.getElementById("successSpace");
const errorStatus = document.getElementById("errorStatus");
const errorMessage = document.getElementById("errorMessage");

onSuccess.style.display = "none"
onError.style.display = "none"


form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const confluenceWorkSpaceName = document.getElementById("confluenceWorkSpaceName").value;
    const notionPageId = document.getElementById("notionPageId").value;
    const body = {
        confluenceWorkSpaceName,
        notionPageId,
    };
    
    const config = {
        method:"POST",
        headers: {
            Accept: 'application.json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(body)
    }
        const response = await fetch("/startProcess",config);
        const data = await response.json();
        if(!response.ok)
        {
        onError.style.display = "block"
        errorMessage.textContent = data.message
        errorStatus.textContent = response.status
        } else {
            onError.style.display = "none"
            onSuccess.style.display = "block"
            successMessage.textContent = data.message
            successStatus.textContent = response.status
            successSpace.textContent = confluenceWorkSpaceName;
        }
        
       
    
})