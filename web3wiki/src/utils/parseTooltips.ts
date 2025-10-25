/**
 * Parse tooltip syntax in text: [?-display text-]{tooltip content}
 * Example: [?-私钥-]{Private Key explanation}
 */
export function parseTooltips(text: string): string {
  // Match pattern: [?-xxx-]{aaa}
  const tooltipRegex = /\[\?-(.*?)-\]\{(.*?)\}/g;

  return text.replace(tooltipRegex, (match, displayText, tooltipText) => {
    // Escape HTML to prevent XSS
    const escapedTooltip = tooltipText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    const escapedDisplay = displayText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    return `<span class="term-tooltip" data-tooltip="${escapedTooltip}">${escapedDisplay}</span>`;
  });
}

/**
 * Strip tooltip syntax from text, keeping only the display text
 * Converts [?-display text-]{tooltip content} to just "display text"
 * Used for preview text where we want clean text without markup
 */
export function stripTooltipSyntax(text: string): string {
  // Match pattern: [?-xxx-]{aaa} and replace with just xxx
  const tooltipRegex = /\[\?-(.*?)-\]\{.*?\}/g;
  return text.replace(tooltipRegex, '$1');
}
