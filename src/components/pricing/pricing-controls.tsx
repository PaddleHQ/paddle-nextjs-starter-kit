"use client";

import { cn } from "cn";
import type { Interval } from "@/lib/catalog";

// A short list keeps the demo readable. Paddle sells in 200+ countries, so add any you need.
const COUNTRIES = [
  "US", "CA", "GB", "IE", "DE", "FR", "ES", "IT", "NL", "BE", "SE", "DK", "NO", "FI", "CH", "AT", "PL",
  "AU", "NZ", "JP", "KR", "SG", "IN", "BR", "MX", "ZA",
];

const countryNames = new Intl.DisplayNames(["en"], { type: "region" });
const countryName = (code: string) => countryNames.of(code) ?? code;
const sortedCountries = [...COUNTRIES].sort((a, b) => countryName(a).localeCompare(countryName(b)));

export function BillingToggle({
  value,
  onChange,
  maxSaving,
}: {
  value: Interval;
  onChange: (interval: Interval) => void;
  maxSaving: number;
}) {
  const options: { interval: Interval; label: string }[] = [
    { interval: "month", label: "Monthly" },
    { interval: "year", label: "Yearly" },
  ];

  return (
    <div role="radiogroup" aria-label="Billing period" className="inline-flex rounded-full border border-border p-1">
      {options.map(({ interval, label }) => (
        <button
          key={interval}
          type="button"
          role="radio"
          aria-checked={value === interval}
          onClick={() => onChange(interval)}
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden",
            value === interval ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {label}
          {interval === "year" && maxSaving > 0 && (
            <span className="rounded-full bg-[#fff480] px-2 py-0.5 text-xs text-black">Save up to {maxSaving}%</span>
          )}
        </button>
      ))}
    </div>
  );
}

export function CountrySelect({
  value,
  detected,
  onChange,
}: {
  value: string | null;
  detected: string | null;
  onChange: (countryCode: string | null) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      Prices for
      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || null)}
        className="rounded-md border border-border bg-background px-3 py-1.5 text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
      >
        <option value="">{detected ? `${countryName(detected)} (detected)` : "Your location"}</option>
        {sortedCountries.map((code) => (
          <option key={code} value={code}>
            {countryName(code)}
          </option>
        ))}
      </select>
    </label>
  );
}
