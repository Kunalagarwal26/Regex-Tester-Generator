# Regex Tester & Generator Chrome Extension

A powerful Chrome extension for testing, generating, and learning regular expressions.

## Features

- Real-time regex pattern testing
- Pattern explanation and visualization
- Common regex patterns library (numbers, letters, email, URL, IP, phone, credit card, etc.)
- Regex flags support (g, i, m)
- Pattern generator from examples
- Pattern history with timestamps
- Dark/Light theme support
- Copy to clipboard functionality
- Pattern matching highlighting

## Installation

### Development Mode

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

### From Chrome Web Store

1. Visit the Chrome Web Store (link to be added)
2. Click "Add to Chrome"

## Usage

1. Click the extension icon in your Chrome toolbar
2. Enter a regex pattern in the "Regular Expression" field
3. Enter text to test in the "Test String" field
4. Use the regex flags (g, i, m) as needed
5. View matches and pattern explanation in real-time
6. Use the pattern library for common regex patterns
7. Use the pattern generator to create regex from examples
8. Access your recent patterns via the history panel (📜)
9. Toggle between light and dark themes using the theme button
10. Use the 📋 button to copy regex or test strings

## Testing Examples

### Digits
- Pattern: `\d+`
- Test String: `My phone number is 1234567890 and my pin is 4321.`

### Letters
- Pattern: `[a-zA-Z]+`
- Test String: `Hello123 World456!`

### Email
- Pattern: `\w+@\w+\.\w+`
- Test String: `Contact me at test@example.com or admin@domain.org.`

### Strict Email
- Pattern: `\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b`
- Test String: `Valid: user.name+tag@sub.domain.com\nInvalid: user@domain,com`

### URL
- Pattern: `https?:\/\/\S+`
- Test String: `Visit https://www.example.com or http://test.org for more info.`

### IP Address
- Pattern: `\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b`
- Test String: `My server is at 192.168.1.1 and backup at 10.0.0.254.`

### Phone Number
- Pattern: `\b\d{3}[-.]?\d{3}[-.]?\d{4}\b`
- Test String: `Call me at 123-456-7890 or 987.654.3210.`

### Credit Card
- Pattern: `\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b`
- Test String: `My card: 1234-5678-9012-3456 or 1234567890123456`

### Pattern Generator
- Examples:
  - `12345\n67890\n54321` (should generate a digit pattern)
  - `hello\nworld\ntest` (should generate a letter pattern)

### Flags Testing
- Pattern: `hello`
- Test String: `Hello hello HELLO`
- Flags: Try with and without `i` and `g`

### History Feature
- Enter and test several patterns, then open the history panel (📜) to reuse them.

### Copy/Export Feature
- Use the 📋 button to copy regex patterns and test strings.

### Theme Switching
- Switch between dark and light mode and ensure all UI elements update correctly.

## Development

### Project Structure

```
├── manifest.json      # Extension configuration
├── popup.html        # Main interface
├── popup.css         # Styles
├── popup.js          # Main functionality
├── background.js     # Background scripts
└── icons/           # Extension icons
```

### Building

1. Make your changes to the source files
2. Test the extension in development mode
3. Package the extension for distribution:
   - Zip the contents of the extension directory
   - Submit to the Chrome Web Store

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details 