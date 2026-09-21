/** NeoSOFT logo — Figma login screen (white on red gradient) */
export function NeosoftPortalLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className ?? 'h-[52px] w-auto'}
      aria-label="NeoSOFT Technologies"
    >
      <rect x="0" y="4" width="40" height="40" rx="3" fill="#ED1819" />
      <path d="M9 38V14h6l9.5 15.5V14h5.5v24h-5.5l-9.5-15.2V38H9z" fill="white" />
      <path
        d="M50 24.5c0-4.8 3.8-7.5 10-7.5 5.7 0 9.2 2.3 9.2 6.5 0 3.6-2.6 5.9-7.4 6.9l-4 1c-4 1-6.2 2.8-6.2 6.5s2.7 6.8 9 6.8c6.2 0 9.8-1.9 9.8-5.8h-6.5c0 1.9-1.4 3-3.6 3-2.1 0-3.3-1.1-3.3-2.7 0-1.7 1.4-2.7 5.2-3.3l4-1c4.2-1.1 6.5-3 6.5-7 0-5.1-4.2-8.2-10.5-8.2-6.8 0-11.2 3.3-11.2 8.5H50z"
        fill="white"
      />
      <text
        x="0"
        y="60"
        fill="white"
        fillOpacity="0.92"
        fontSize="10"
        fontFamily="var(--font-portal), Poppins, sans-serif"
        fontWeight="300"
        letterSpacing="0.42em"
      >
        TECHNOLOGIES
      </text>
    </svg>
  );
}
