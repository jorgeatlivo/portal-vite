import { useState } from 'react';

import { ClaimSummary } from '@/store/types';

import { SearchBar } from '@/components/facilityStaff/SearchBar';
import { FacilityProfessionalsDTO } from '@/components/widgets/professionals/types';

import { ProfessionalProfile } from '@/types/claims';

import ProfessionalProfileCard from './ProfessionalProfileCard';

interface FacilityProfessionalsProps extends FacilityProfessionalsDTO {
  origin?: ClaimSummary;
  className?: string;
}

const renderItem = (item: ProfessionalProfile, origin?: ClaimSummary) => (
  <ProfessionalProfileCard
    {...item}
    origin={origin}
    key={item.id}
    className="mt-small rounded-[8px] bg-white p-medium"
  />
);

export function FacilityProfessionals({
  professionals,
  placeholder,
  origin,
  className,
}: FacilityProfessionalsProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProfessionals = professionals.filter((professional) => {
    const fullName =
      `${professional.firstName} ${professional.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className={`flex flex-1 flex-col bg-gray-50 ${className}`}>
      <div className="px-large pt-large">
        <SearchBar
          searchText={searchQuery}
          setSearchText={setSearchQuery}
          searchPlaceHolder={placeholder.input}
        />
      </div>

      {filteredProfessionals.length === 0 ? (
        <div className="mt-4 flex-1 justify-start p-4">
          <p className="text-center text-base">
            {placeholder.professionalsList}
          </p>
        </div>
      ) : (
        <div className="scrollbar-hide modern-scrollbar my-4 overflow-y-auto px-large">
          {filteredProfessionals.map((professional) =>
            renderItem(professional, origin)
          )}
        </div>
      )}
    </div>
  );
}
