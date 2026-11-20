import type { ReactNode } from "react";

const paths = {
  arrow: "M5 12h14M13 6l6 6-6 6",
  check: "M5 12.5l4.5 4.5L19 7",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z",
  mail: "M3 8l9 6 9-6",
  pin: "M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z",
  x: "M6 6l12 12M18 6L6 18",
  menu: "M4 7h16M4 12h16M4 17h16",
  alert: "M12 4l9 16H3zM12 10v4",
  bell: "M6 8a6 6 0 0112 0c0 7 3 8 3 8H3s3-1 3-8M10 21h4",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  target: "M12 3a9 9 0 110 18 9 9 0 010-18z",
  layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5",
  trend: "M3 17l6-6 4 4 8-9",
  box: "M3 7l9-4 9 4v10l-9 4-9-4z",
  cart: "M3 4h2l2.4 11h10.2L20 8H6.2",
  search: "M21 21l-4.3-4.3",
  download: "M12 4v11M7 11l5 5 5-5M5 20h14",
  link: "M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === "mail" ? <rect x="3" y="5" width="18" height="14" rx="3" /> : null}
      {name === "pin" ? <circle cx="12" cy="10" r="2.5" /> : null}
      {name === "shield" ? <path d="M9 12l2 2 4-4" /> : null}
      {name === "target" ? <><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></> : null}
      {name === "search" ? <circle cx="11" cy="11" r="7" /> : null}
      {name === "cart" ? <><circle cx="9" cy="19.5" r="1.5" /><circle cx="17" cy="19.5" r="1.5" /></> : null}
      <path d={paths[name]} />
    </svg>
  );
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>
          <Icon name="check" size={16} />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Todo({ children }: { children: ReactNode }) {
  return <span className="todo">{children}</span>;
}
