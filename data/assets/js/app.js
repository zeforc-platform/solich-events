document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const previewCode = document.getElementById('json-preview');
    const currentEndpoint = document.getElementById('current-endpoint');

    // Syntax highlighting function for JSON
    function syntaxHighlight(json) {
        if (typeof json != 'string') {
             json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    async function fetchAndDisplayData(countryCode) {
        const endpoint = `/v1/${countryCode}/manifest.json`;
        currentEndpoint.textContent = endpoint;
        previewCode.innerHTML = 'Fetching data...';

        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            previewCode.innerHTML = syntaxHighlight(data);
        } catch (error) {
            previewCode.innerHTML = `<span style="color:#ff7b72">Error loading data: ${error.message}</span>`;
            
            // Fallback for local development if fetching fails (due to CORS or missing server)
            const fallbackData = {
                "schemaVersion": 1,
                "documentType": "jurisdiction_manifest",
                "jurisdiction": {
                    "country": countryCode,
                    "subdivision": null
                },
                "status": "Local fetch failed. This preview works best when served via HTTP."
            };
            previewCode.innerHTML += '\n\n' + syntaxHighlight(fallbackData);
        }
    }

    // Set up click listeners
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active class from all
            cards.forEach(c => c.classList.remove('active'));
            // Add active to clicked
            card.classList.add('active');
            
            const country = card.getAttribute('data-country');
            fetchAndDisplayData(country);
        });
    });

    // Initialize with VN
    const initCard = document.querySelector('.card[data-country="VN"]');
    if (initCard) {
        initCard.classList.add('active');
        fetchAndDisplayData('VN');
    }
});
