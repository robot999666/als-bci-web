interface BrandMarkProps {
  className?: string;
}

export default function BrandMark({
  className = "h-9 w-9",
}: BrandMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="13" fill="#082F49" />
      <rect
        x="0.75"
        y="0.75"
        width="46.5"
        height="46.5"
        rx="12.25"
        stroke="#22D3EE"
        strokeOpacity="0.55"
        strokeWidth="1.5"
      />
      <path
        d="M9 25.5h6l2.4-7 4.2 14L25 22l3.2 7.5 2.6-4H39"
        stroke="#67E8F9"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="13" cy="14" r="2" fill="#38BDF8" />
      <circle cx="35" cy="13" r="2" fill="#818CF8" />
      <circle cx="37" cy="35" r="2" fill="#2DD4BF" />
      <path
        d="M14.7 15.1 19 18m14.2-3.7-5.1 5.1M35.2 34l-4.6-3.1"
        stroke="#94A3B8"
        strokeOpacity="0.75"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
