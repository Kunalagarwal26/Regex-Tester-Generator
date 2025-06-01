// Initialize theme on installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('Regex Tester & Generator installed');
    // Set default theme
    chrome.storage.local.get(['theme'], (result) => {
        if (!result.theme) {
            chrome.storage.local.set({ theme: 'light' });
        }
    });
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getTheme') {
        chrome.storage.local.get(['theme'], (result) => {
            sendResponse({ theme: result.theme || 'light' });
        });
        return true;
    }
}); 