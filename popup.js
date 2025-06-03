document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const regexInput = document.getElementById('regexInput');
    const testInput = document.getElementById('testInput');
    const matchResults = document.getElementById('matchResults');
    const patternExplanation = document.getElementById('patternExplanation');
    const themeToggle = document.getElementById('themeToggle');
    const copyButtons = document.querySelectorAll('.copy-btn');
    const patternButtons = document.querySelectorAll('.pattern-btn');
    const historyBtn = document.getElementById('historyBtn');
    const historyPanel = document.getElementById('historyPanel');
    const closeHistory = document.getElementById('closeHistory');
    const historyList = document.getElementById('historyList');
    const generateBtn = document.getElementById('generateBtn');
    const exampleInput = document.getElementById('exampleInput');
    const globalFlag = document.getElementById('globalFlag');
    const caseInsensitiveFlag = document.getElementById('caseInsensitiveFlag');
    const multilineFlag = document.getElementById('multilineFlag');

    // Theme Management
    function setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
        chrome.storage.local.set({ theme });
    }

    // Initialize theme
    chrome.storage.local.get(['theme'], (result) => {
        const currentTheme = result.theme || 'light';
        setTheme(currentTheme);
    });

    // Listen for theme changes from background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === 'themeChanged') {
            setTheme(request.theme);
        }
    });

    themeToggle.addEventListener('click', () => {
        chrome.storage.local.get(['theme'], (result) => {
            const currentTheme = result.theme || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    });

    // Listen for theme changes in storage
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local' && changes.theme) {
            setTheme(changes.theme.newValue);
        }
    });

    // History Management
    let patternHistory = [];
    const MAX_HISTORY_ITEMS = 20;

    // Load history from storage
    chrome.storage.local.get(['patternHistory'], (result) => {
        patternHistory = result.patternHistory || [];
        renderHistory();
    });

    function updateHistory(pattern) {
        const timestamp = new Date().toISOString();
        patternHistory = [
            { pattern, timestamp },
            ...patternHistory.filter(item => item.pattern !== pattern)
        ].slice(0, MAX_HISTORY_ITEMS);
        chrome.storage.local.set({ patternHistory });
        renderHistory();
    }

    function renderHistory() {
        historyList.innerHTML = patternHistory.map(item => `
            <div class="history-item" data-pattern="${item.pattern}">
                <div class="pattern">${item.pattern}</div>
                <div class="timestamp">${new Date(item.timestamp).toLocaleString()}</div>
            </div>
        `).join('');

        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                regexInput.value = item.dataset.pattern;
                updateResults();
                historyPanel.classList.add('hidden');
            });
        });
    }

    historyBtn.addEventListener('click', () => {
        historyPanel.classList.toggle('hidden');
        renderHistory();
    });

    closeHistory.addEventListener('click', () => {
        historyPanel.classList.add('hidden');
    });

    // Copy to Clipboard Functionality
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            const textToCopy = targetElement.value || targetElement.textContent;

            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = button.textContent;
                button.textContent = '✓';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 1000);
            });
        });
    });

    // Pattern Library
    patternButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pattern = button.getAttribute('data-pattern');
            regexInput.value = pattern;
            updateResults();
        });
    });

    // Pattern Generator
    generateBtn.addEventListener('click', () => {
        const examples = exampleInput.value.split('\n').filter(line => line.trim());
        if (examples.length < 2) {
            alert('Please enter at least 2 examples to generate a pattern');
            return;
        }

        const pattern = generatePattern(examples);
        if (pattern) {
            regexInput.value = pattern;
            regexInput.focus();
            if (!testInput.value.trim()) {
                patternExplanation.textContent = `Pattern generated: ${pattern}\nEnter a test string to see results.`;
            } else {
                updateResults();
            }
        } else {
            alert('Could not generate a pattern from the given examples');
        }
    });

    function generatePattern(examples) {
        if (examples.every(ex => /^\d+$/.test(ex))) return '\\d+';
        if (examples.every(ex => /^[a-zA-Z]+$/.test(ex))) return '[a-zA-Z]+';
        if (examples.every(ex => /^[a-zA-Z0-9]+$/.test(ex))) return '[a-zA-Z0-9]+';
        if (examples.every(ex => /^\w+@\w+\.\w+$/.test(ex))) return '\\w+@\\w+\\.\\w+';
        if (examples.every(ex => /^https?:\/\/\S+$/.test(ex))) return 'https?:\\/\\/\\S+';
        if (examples.every(ex => /^\d{1,3}(\.\d{1,3}){3}$/.test(ex))) return '\\b\\d{1,3}(?:\\.\\d{1,3}){3}\\b';
        if (examples.every(ex => /^\d{3}[-.]?\d{3}[-.]?\d{4}$/.test(ex))) return '\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b';
        // Fallback: match any of the examples literally
        return examples.map(ex => ex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    }

    // Real-time Results Update
    let debounceTimer;
    const updateResults = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const pattern = regexInput.value;
            const testString = testInput.value;

            try {
                if (!pattern || !testString) {
                    matchResults.innerHTML = '<div class="no-matches">Enter both pattern and test string</div>';
                    patternExplanation.textContent = 'Enter a regex pattern to see its explanation';
                    return;
                }

                // Build flags string
                let flags = '';
                if (globalFlag.checked) flags += 'g';
                if (caseInsensitiveFlag.checked) flags += 'i';
                if (multilineFlag.checked) flags += 'm';

                const regex = new RegExp(pattern, flags);
                const matches = testString.match(regex);

                if (matches) {
                    let highlightedText = testString;
                    matches.forEach(match => {
                        highlightedText = highlightedText.replace(
                            match,
                            `<span class="match">${match}</span>`
                        );
                    });
                    matchResults.innerHTML = highlightedText;
                } else {
                    matchResults.innerHTML = '<div class="no-matches">No matches found</div>';
                }

                // Update pattern explanation
                patternExplanation.textContent = explainPattern(pattern);
                
                // Update history
                updateHistory(pattern);
            } catch (error) {
                matchResults.innerHTML = `<div class="no-matches">Invalid regex pattern: ${error.message}</div>`;
                patternExplanation.textContent = 'Invalid pattern';
            }
        }, 300);
    };

    // Pattern Explanation Function
    function explainPattern(pattern) {
        const explanations = {
            '\\d+': 'Matches one or more digits',
            '[a-zA-Z]+': 'Matches one or more letters (case insensitive)',
            '\\w+@\\w+\\.\\w+': 'Matches a basic email address',
            'https?:\\/\\/\\S+': 'Matches a URL starting with http:// or https://',
            '\\s+': 'Matches one or more whitespace characters',
            '^': 'Matches the start of a line',
            '$': 'Matches the end of a line',
            '\\b': 'Matches a word boundary',
            '\\w+': 'Matches one or more word characters (letters, numbers, underscore)',
            '\\s': 'Matches any whitespace character',
            '.': 'Matches any character except newline',
            '\\d': 'Matches any digit',
            '\\D': 'Matches any non-digit',
            '\\w': 'Matches any word character',
            '\\W': 'Matches any non-word character',
            '\\s': 'Matches any whitespace character',
            '\\S': 'Matches any non-whitespace character',
            '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b': 'Matches an IP address',
            '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b': 'Matches a strict email format',
            '\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b': 'Matches a phone number',
            '\\b\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}\\b': 'Matches a credit card number'
        };

        let explanation = 'Pattern explanation:\n';
        for (const [key, value] of Object.entries(explanations)) {
            if (pattern.includes(key)) {
                explanation += `\n${key}: ${value}`;
            }
        }

        return explanation || 'No specific pattern explanation available';
    }

    // Event Listeners for Real-time Updates
    regexInput.addEventListener('input', updateResults);
    testInput.addEventListener('input', updateResults);
    globalFlag.addEventListener('change', updateResults);
    caseInsensitiveFlag.addEventListener('change', updateResults);
    multilineFlag.addEventListener('change', updateResults);

    // Initialize
    updateResults();
}); 