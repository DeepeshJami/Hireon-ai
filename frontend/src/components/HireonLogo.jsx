import React from "react";

const style = `
:root {
  --font-brand: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'SF Pro', Inter, sans-serif;
  --hireon-light:  #0A0A0A;
  --hireon-dark:   #FFFFFF;
  --ai-light-start: #007AFF;
  --ai-light-end:   #4F9DFF;
  --ai-dark-start:  #4A9EFF;
  --ai-dark-end:    #80C0FF;
  --hireon-current: var(--hireon-light);
  --ai-gradient: linear-gradient(90deg, var(--ai-light-start), var(--ai-light-end));
}
.dark {
  --hireon-current: var(--hireon-dark);
  --ai-gradient: linear-gradient(90deg, var(--ai-dark-start), var(--ai-dark-end));
}
.hireon-logo {
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
.hireon-logo .hireon {
  font-family: var(--font-brand);
  font-weight: 700;
  font-size: clamp(1.25rem, 2.5vw + 0.5rem, 1.75rem);
  letter-spacing: -0.035em;
  color: var(--hireon-current);
  transition: color 0.2s;
  background: none !important;
  -webkit-background-clip: initial !important;
  -webkit-text-fill-color: initial !important;
}
.dark .hireon-logo .hireon {
  text-shadow: 0 2px 12px rgba(0,0,0,0.18);
}
.hireon-logo .ai {
  font-family: var(--font-brand);
  font-weight: 500;
  font-size: clamp(1.25rem, 2.5vw + 0.5rem, 1.75rem);
  letter-spacing: -0.035em;
  background: var(--ai-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: fade 0.8s cubic-bezier(.4,0,.2,1) 0.1s both;
}
@keyframes fade { from { opacity: 0 } to { opacity: 1 } }
`;

const fontLink = (
  <link
    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap"
    rel="stylesheet"
  />
);

const HireonLogo = ({ style: customStyle = {}, className = "" }) => (
  <>
    {fontLink}
    <style>{style}</style>
    <span
      className={`hireon-logo ${className}`}
      aria-label="Hireon AI logo"
      style={customStyle}
    >
      <span className="hireon">Hireon</span>
      <span className="ai">AI</span>
    </span>
  </>
);

export default HireonLogo; 