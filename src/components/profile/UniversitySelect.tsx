import { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { searchUniversities } from '@/app/services/universityService';

interface University {
  name: string;
  country: string;
  state?: string;
  city?: string;
  website?: string;
  logo?: string;
}

interface Option {
  label: string;
  value: string;
  logo?: string;
  country?: string;
  state?: string;
  city?: string;
  website?: string;
}

interface UniversitySelectProps {
  value: string;
  onChange: (value: string, universityData?: University) => void;
  error?: string;
}

const UniversitySelect = ({ value, onChange, error }: UniversitySelectProps) => {
  const loadOptions = async (inputValue: string) => {
    if (inputValue.length < 2) return [];
    
    const universities = await searchUniversities(inputValue);
    return universities.map(uni => ({
      label: uni.name,
      value: uni.name,
      logo: uni.logo,
      country: uni.country,
      state: uni.state,
      city: uni.city,
      website: uni.website
    }));
  };

  const formatOptionLabel = ({ label, logo }: Option) => (
    <div className="flex items-center gap-2">
      {logo && (
        <div className="w-5 h-5 flex-shrink-0">
          <img 
            src={logo} 
            alt={label}
            className="w-full h-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}
      <span>{label}</span>
    </div>
  );

  const handleChange = (selectedOption: Option | null) => {
    if (selectedOption) {
      onChange(selectedOption.value, {
        name: selectedOption.value,
        logo: selectedOption.logo || "",
        website: selectedOption.website || "",
        country: selectedOption.country || "",
        state: selectedOption.state || "",
        city: selectedOption.city || "",
      });
    } else {
      onChange("", {
        name: "",
        logo: "",
        website: "",
        country: "",
        state: "",
        city: "",
      });
    }
  };

  return (
    <div>
      <AsyncSelect
        cacheOptions
        defaultOptions
        value={value ? {
          label: value,
          value: value
        } : null}
        loadOptions={loadOptions}
        onChange={handleChange}
        className="university-select"
        classNamePrefix="select"
        isClearable
        placeholder="Search for a university..."
        noOptionsMessage={({ inputValue }) => 
          inputValue.length < 2 ? "Type at least 2 characters to search..." : "No universities found"
        }
        formatOptionLabel={formatOptionLabel}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default UniversitySelect;
