function getTextColor(hexColor: string) {
  const normalized = hexColor.replace("#", "");
  const red = parseInt(normalized.slice(0, 2), 16);
  const green = parseInt(normalized.slice(2, 4), 16);
  const blue = parseInt(normalized.slice(4, 6), 16);
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000;
  return luminance > 160 ? "#0f172a" : "#f8fafc";
}

export function createTeamLogoDataUri(shortName: string, primaryColor: string) {
  const textColor = getTextColor(primaryColor);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="${shortName} team logo">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#020617" />
          <stop offset="100%" stop-color="${primaryColor}" />
        </linearGradient>
      </defs>
      <rect width="96" height="96" rx="24" fill="url(#bg)" />
      <rect x="6" y="6" width="84" height="84" rx="20" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2" />
      <circle cx="48" cy="48" r="24" fill="${primaryColor}" opacity="0.22" />
      <text x="48" y="56" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="${textColor}">
        ${shortName}
      </text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
