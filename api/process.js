module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-License-Key');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action, text } = req.body || {};

  if (!action || !text) {
    return res.status(400).json({ error: 'Missing required fields: action and text' });
  }

  if (!['encode', 'decode'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action. Use "encode" or "decode"' });
  }

  try {
    let result;

    if (action === 'encode') {
      result = encodeHTMLEntities(text);
    } else {
      result = decodeHTMLEntities(text);
    }

    return res.status(200).json({
      success: true,
      action,
      result,
      originalLength: text.length,
      resultLength: result.length
    });
  } catch (error) {
    return res.status(500).json({ error: 'Processing failed', message: error.message });
  }
};

// Encode special characters to HTML entities
function encodeHTMLEntities(text) {
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
    ' ': '&nbsp;',  // Only encode spaces if requested
    '©': '&copy;',
    '®': '&reg;',
    '™': '&trade;',
    '€': '&euro;',
    '£': '&pound;',
    '¥': '&yen;',
    '•': '&bull;',
    '…': '&hellip;',
    '—': '&mdash;',
    '–': '&ndash;',
    '←': '&larr;',
    '→': '&rarr;',
    '↑': '&uarr;',
    '↓': '&darr;',
    '↔': '&harr;',
    '⇐': '&lArr;',
    '⇒': '&rArr;',
    '⇑': '&uArr;',
    '⇓': '&dArr;',
    '⇔': '&hArr;',
    '♠': '&spades;',
    '♣': '&clubs;',
    '♥': '&hearts;',
    '♦': '&diams;',
    'α': '&alpha;',
    'β': '&beta;',
    'γ': '&gamma;',
    'δ': '&delta;',
    'ε': '&epsilon;',
    'ζ': '&zeta;',
    'η': '&eta;',
    'θ': '&theta;',
    'λ': '&lambda;',
    'μ': '&mu;',
    'π': '&pi;',
    'ρ': '&rho;',
    'σ': '&sigma;',
    'τ': '&tau;',
    'φ': '&phi;',
    'χ': '&chi;',
    'ψ': '&psi;',
    'ω': '&omega;',
    '∞': '&infin;',
    '∑': '&sum;',
    '∏': '&prod;',
    '∫': '&int;',
    '√': '&radic;',
    '∂': '&part;',
    '±': '&plusmn;',
    '≠': '&ne;',
    '≈': '&asymp;',
    '≡': '&equiv;',
    '≤': '&le;',
    '≥': '&ge;',
    '×': '&times;',
    '÷': '&divide;',
    '½': '&frac12;',
    '¼': '&frac14;',
    '¾': '&frac34;',
    '¹': '&sup1;',
    '²': '&sup2;',
    '³': '&sup3;'
  };

  // Replace & first to avoid double-encoding
  return text
    .replace(/&/g, '&amp;')
    .replace(/[<>'"]/g, char => entityMap[char] || char)
    .replace(/[©®™€£¥•…—–←→↑↓↔⇐⇒⇑⇓⇔♠♣♥♦αβγδεζηθλμπρστφχψω∞∑∏∫√∂±≠≈≡≤≥×÷½¼¾¹²³]/g, char => entityMap[char] || char);
}

// Decode HTML entities back to characters
function decodeHTMLEntities(text) {
  const entityMap = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&nbsp;': ' ',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&euro;': '€',
    '&pound;': '£',
    '&yen;': '¥',
    '&bull;': '•',
    '&hellip;': '…',
    '&mdash;': '—',
    '&ndash;': '–',
    '&larr;': '←',
    '&rarr;': '→',
    '&uarr;': '↑',
    '&darr;': '↓',
    '&harr;': '↔',
    '&lArr;': '⇐',
    '&rArr;': '⇒',
    '&uArr;': '⇑',
    '&dArr;': '⇓',
    '&hArr;': '⇔',
    '&spades;': '♠',
    '&clubs;': '♣',
    '&hearts;': '♥',
    '&diams;': '♦',
    '&alpha;': 'α',
    '&beta;': 'β',
    '&gamma;': 'γ',
    '&delta;': 'δ',
    '&epsilon;': 'ε',
    '&zeta;': 'ζ',
    '&eta;': 'η',
    '&theta;': 'θ',
    '&lambda;': 'λ',
    '&mu;': 'μ',
    '&pi;': 'π',
    '&rho;': 'ρ',
    '&sigma;': 'σ',
    '&tau;': 'τ',
    '&phi;': 'φ',
    '&chi;': 'χ',
    '&psi;': 'ψ',
    '&omega;': 'ω',
    '&infin;': '∞',
    '&sum;': '∑',
    '&prod;': '∏',
    '&int;': '∫',
    '&radic;': '√',
    '&part;': '∂',
    '&plusmn;': '±',
    '&ne;': '≠',
    '&asymp;': '≈',
    '&equiv;': '≡',
    '&le;': '≤',
    '&ge;': '≥',
    '&times;': '×',
    '&divide;': '÷',
    '&frac12;': '½',
    '&frac14;': '¼',
    '&frac34;': '¾',
    '&sup1;': '¹',
    '&sup2;': '²',
    '&sup3;': '³'
  };

  // Handle numeric entities
  let result = text
    // Hexadecimal entities
    .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    })
    // Decimal entities
    .replace(/&#(\d+);/g, (match, dec) => {
      return String.fromCharCode(parseInt(dec, 10));
    });

  // Replace named entities (longest first to avoid partial matches)
  const sortedEntities = Object.keys(entityMap).sort((a, b) => b.length - a.length);
  for (const entity of sortedEntities) {
    result = result.replace(new RegExp(entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), entityMap[entity]);
  }

  return result;
}
