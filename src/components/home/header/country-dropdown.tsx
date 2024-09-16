import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const regions = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'PT', label: 'Portugal' },
  { value: 'IN', label: 'India' },
  { value: 'BR', label: 'Brazil' },
  { value: 'OTHERS', label: 'Everywhere else' },
];

interface Props {
  country: string;
  onCountryChange: (value: string) => void;
}

export function CountryDropdown({ country, onCountryChange }: Props) {
  const selected = regions.find((region) => region.value === country) || regions[0];
  return (
    <Select defaultValue={'US'} onValueChange={(value) => onCountryChange(value)} value={selected.value}>
      <SelectTrigger className="w-[220px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {regions.map((region) => (
          <SelectItem key={region.value} value={region.value}>
            {region.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
