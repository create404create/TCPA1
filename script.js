// APIs
const tcpaApi = "https://api.uspeoplesearch.net/tcpa/v1?x=";
const personApi = "https://api.uspeoplesearch.net/person/v3?x=";
const premiumLookupApi = "https://premium_lookup-1-h4761841.deta.app/person?x=";
const reportApi = "https://api.uspeoplesearch.net/tcpa/report?x=";

// Show loading spinner
function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

// Hide loading spinner
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// Display data in a user-friendly format
function displayData(data) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
        <p><strong>State:</strong> ${data.state || 'N/A'}</p>
        <p><strong>DNC National:</strong> ${data.dncNational || 'N/A'}</p>
        <p><strong>DNC State:</strong> ${data.dncState || 'N/A'}</p>
        <p><strong>Litigator:</strong> ${data.litigator || 'N/A'}</p>
        <p><strong>Blacklist:</strong> ${data.blacklist || 'N/A'}</p>
    `;
}

// Fetch data from multiple APIs
async function fetchData() {
    const query = document.getElementById('query').value;
    const resultDiv = document.getElementById('result');

    if (!query) {
        resultDiv.textContent = "Please enter a phone number.";
        return;
    }

    showLoading();
    resultDiv.textContent = "";

    try {
        // Fetch data from all APIs
        const [tcpaData, personData, premiumData, reportData] = await Promise.all([
            fetch(`${tcpaApi}${query}`).then(res => res.json()),
            fetch(`${personApi}${query}`).then(res => res.json()),
            fetch(`${premiumLookupApi}${query}`).then(res => res.json()),
            fetch(`${reportApi}${query}`).then(res => res.json())
        ]);

        // Combine data from all APIs
        const combinedData = {
            phone: query,
            state: tcpaData.state || personData.state || premiumData.state || reportData.state,
            dncNational: tcpaData.dncNational || personData.dncNational || premiumData.dncNational || reportData.dncNational,
            dncState: tcpaData.dncState || personData.dncState || premiumData.dncState || reportData.dncState,
            litigator: tcpaData.litigator || personData.litigator || premiumData.litigator || reportData.litigator,
            blacklist: tcpaData.blacklist || personData.blacklist || premiumData.blacklist || reportData.blacklist
        };

        displayData(combinedData);
    } catch (error) {
        resultDiv.textContent = "Error fetching data.";
        console.error(error);
    } finally {
        hideLoading();
    }
}
