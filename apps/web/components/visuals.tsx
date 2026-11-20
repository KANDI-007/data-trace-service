import { QR } from "@/lib/qr-mark";

export function QrMark({ size = 120, label = "Code QR de démonstration" }: { size?: number; label?: string }) {
  const n = QR.n;
  return (
    <svg width={size} height={size} viewBox={`-2 -2 ${n + 4} ${n + 4}`} shapeRendering="crispEdges" role="img" aria-label={label}>
      <rect x="-2" y="-2" width={n + 4} height={n + 4} fill="#fff" />
      <path d={QR.d} fill="#0F2442" />
    </svg>
  );
}

export function ParcelMap() {
  return (
    <svg viewBox="0 0 300 160" style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label="Parcelles et point de chevauchement, exemple de démonstration">
      <rect width="300" height="160" rx="12" fill="#E8F1EE" />
      <path d="M20 120 60 40 130 58 120 130z" fill="#BFE5D6" stroke="#0A7C75" strokeWidth="2" />
      <path d="M118 56 200 36 230 96 150 120z" fill="#BFE5D6" stroke="#0A7C75" strokeWidth="2" />
      <path d="M180 70 250 60 275 120 210 138z" fill="#F6CFC9" stroke="#B42318" strokeWidth="2" strokeDasharray="5 4" />
      <g fill="#0F2442">
        <circle cx="60" cy="40" r="4" />
        <circle cx="130" cy="58" r="4" />
        <circle cx="200" cy="36" r="4" />
        <circle cx="230" cy="96" r="4" />
      </g>
      <circle cx="250" cy="60" r="6" fill="#B42318" />
      <text x="196" y="150" fontSize="11" fontFamily="Poppins" fill="#B42318" fontWeight="600">Chevauchement</text>
    </svg>
  );
}
