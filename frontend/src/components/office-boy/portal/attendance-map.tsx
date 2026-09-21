import { Locate, MapPin } from 'lucide-react';

export function AttendanceMap({
  className = '',
  locationName,
}: {
  className?: string;
  locationName?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl bg-[#eef1ec] ${className}`}
    >
      <svg viewBox="0 0 400 260" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="260" fill="#e9ede6" />
        <rect x="0" y="0" width="130" height="90" fill="#d7e6cf" />
        <rect x="250" y="150" width="150" height="110" fill="#d7e6cf" />
        <rect x="60" y="150" width="90" height="70" fill="#dbe3ea" />
        <g stroke="#ffffff" strokeWidth="10">
          <path d="M0 60 H400" />
          <path d="M0 140 H400" />
          <path d="M0 205 H400" />
          <path d="M90 0 V260" />
          <path d="M210 0 V260" />
          <path d="M310 0 V260" />
        </g>
        <g stroke="#f4c95d" strokeWidth="4">
          <path d="M0 105 H400" />
        </g>
        <text x="10" y="40" fontSize="10" fill="#6b7563" fontFamily="sans-serif">
          Public Library
        </text>
        <text x="10" y="80" fontSize="10" fill="#6b7563" fontFamily="sans-serif">
          Eagle Park
        </text>
        <text x="100" y="40" fontSize="10" fill="#6b7563" fontFamily="sans-serif">
          Park Place Apartments
        </text>
        <text x="15" y="175" fontSize="10" fill="#6b7563" fontFamily="sans-serif">
          McKelvey Ball Park
        </text>
        <text x="260" y="200" fontSize="10" fill="#6b7563" fontFamily="sans-serif">
          Graham Middle School
        </text>
        <text
          x="200"
          y="120"
          fontSize="15"
          fill="#8a8f86"
          fontFamily="sans-serif"
          textAnchor="middle"
        >
          {locationName || 'Office Location'}
        </text>
      </svg>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[85%]">
        <MapPin className="h-8 w-8 fill-brand-red-bright text-brand-red-bright drop-shadow" />
      </div>

      <span className="absolute bottom-2 left-2 rounded bg-white/80 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
        Google
      </span>

      <button
        type="button"
        aria-label="Recenter map"
        className="absolute bottom-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-white shadow"
      >
        <Locate className="h-4 w-4 text-gray-600" />
      </button>
    </div>
  );
}
