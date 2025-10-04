import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { IconChevronDown } from '@tabler/icons-react';
import { debounce } from 'lodash-es';

import { Typography } from '@/components/atoms/Typography';

import { ShiftInvitationConfig } from '@/types/shift-invitation';

import colors from '@/config/color-palette';
import InfiniteScrollListbox from '@/pages/shared/ShiftForm/components/InfiniteScrollListbox';
import { useInfiniteScrollPosition } from '@/pages/shared/ShiftForm/hooks/useInfiniteScrollPosition';
import { useShiftInvitationAutocomplete } from '@/pages/shared/ShiftForm/hooks/useShiftInvitationAutocomplete';
import { ProfessionalOption } from '@/pages/shared/ShiftForm/types/form';

interface ProfessionalAutocompleteProps {
  value: ProfessionalOption | null;
  onChange: (option: ProfessionalOption | null) => void;
  shiftConfig?: ShiftInvitationConfig;
  selectedProfessionalIds: number[];
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  renderOption?: (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: ProfessionalOption,
    state: { selected: boolean }
  ) => React.ReactNode;
}

const ProfessionalAutocomplete = ({
  value,
  onChange,
  shiftConfig,
  selectedProfessionalIds,
  label = '',
  placeholder = '',
  required = false,
  disabled = false,
  renderOption,
}: ProfessionalAutocompleteProps) => {
  const { t } = useTranslation('form');
  const [inputValue, setInputValue] = useState('');
  const isOpenRef = useRef(false);
  const [enabled, setEnabled] = useState(false);

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    onSearch,
  } = useShiftInvitationAutocomplete(
    shiftConfig,
    { selectedProfessionalIds },
    20,
    enabled && !!shiftConfig
  );

  // Use custom hook for infinite scroll management
  const { listboxRef, handleListboxScroll, resetScrollPosition } =
    useInfiniteScrollPosition({
      isFetchingNextPage,
      hasNextPage,
      fetchNextPage,
      data,
    });

  // Memoized listbox component with infinite scroll
  const MemoizedListboxComponent = useMemo(() => {
    return forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
      (props, ref) => (
        <InfiniteScrollListbox
          {...props}
          ref={ref}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          onScroll={handleListboxScroll}
          listboxRef={listboxRef}
        />
      )
    );
  }, [isFetchingNextPage, hasNextPage, handleListboxScroll, listboxRef]);

  // Memoized default render option for performance
  const defaultRenderOption = useCallback(
    (
      props: React.HTMLAttributes<HTMLLIElement>,
      option: ProfessionalOption
    ) => {
      const { key, ...restProps } = props as any;
      const itemKey = key || `professional-opt-default-${option.value}`;
      return (
        <li key={itemKey} {...restProps}>
          <Typography variant="body/regular">{option.label}</Typography>
        </li>
      );
    },
    []
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((searchTerm: string) => {
        const selectedLabel = value?.label ?? '';
        if (
          searchTerm &&
          !(selectedLabel && searchTerm.startsWith(selectedLabel))
        ) {
          onSearch?.(searchTerm);
        }
      }, 300),
    [onSearch, value]
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleInputChange = useCallback(
    (
      event: React.SyntheticEvent,
      newInputValue: string,
      reason?: 'input' | 'reset' | 'clear'
    ) => {
      setInputValue(newInputValue);

      if (reason === 'clear') {
        onSearch?.(undefined);
        return;
      }

      // Handle case when user deletes all text (Cmd+A + Delete)
      if (reason === 'input' && newInputValue === '' && isOpenRef.current) {
        debouncedSearch.cancel(); // Cancel any pending debounced search
        onSearch?.(undefined); // Reset search to show all options
        return;
      }

      if (
        reason === 'input' &&
        newInputValue &&
        newInputValue.trim() !== '' &&
        isOpenRef.current
      ) {
        debouncedSearch(newInputValue);
      }
    },
    [debouncedSearch, onSearch]
  );

  const handleClearSearch = useCallback(() => {
    setInputValue('');
    onSearch?.(undefined);
  }, [onSearch]);

  useEffect(() => {
    if (value && value.label) {
      setInputValue('');
    }
  }, [value]);

  return (
    <Autocomplete<ProfessionalOption>
      value={isNaN(value?.value ?? NaN) ? undefined : value}
      inputValue={inputValue}
      disabled={disabled}
      loading={isLoading}
      loadingText={t('loading')}
      options={data}
      noOptionsText={
        <div>
          <Typography variant="body/regular" className="mb-2 text-Text-Subtle">
            {t('no_search_results')}
          </Typography>
          <Typography
            variant="link/regular"
            className="cursor-pointer !text-Action-Primary"
            onClick={handleClearSearch}
          >
            {t('clear_search')}
          </Typography>
          <div className="h-48" /> {/* to avoid layout jump on load */}
        </div>
      }
      onInputChange={handleInputChange}
      getOptionKey={(option) => `shift-pro-autocomplete-${option.value}`}
      onOpen={() => {
        isOpenRef.current = true;
        setEnabled(true);
        // If there is a non-empty inputValue and it's not the selected label, search it.
        if (
          inputValue &&
          inputValue.trim() !== '' &&
          !(value?.label && inputValue.startsWith(value.label))
        ) {
          onSearch?.(inputValue);
          return;
        }

        // If input is empty, explicitly request default options so the list
        // is populated when the user focuses the Autocomplete after a previous search
        // cleared the input.
        if (!inputValue || inputValue.trim() === '') {
          onSearch?.(undefined);
        }
      }}
      onClose={() => {
        isOpenRef.current = false;
        setEnabled(false);
        resetScrollPosition();
      }}
      getOptionLabel={(option) => option?.label ?? ''}
      isOptionEqualToValue={(option, val) => option.value === val?.value}
      onChange={(event, newValue) => {
        onChange(newValue || null);
      }}
      filterOptions={(x) => x}
      ListboxComponent={MemoizedListboxComponent}
      renderOption={renderOption || defaultRenderOption}
      popupIcon={<IconChevronDown size={24} color={colors['Text-Subtle']} />}
      renderInput={(params) => (
        <TextField
          {...params}
          required={required}
          disabled={disabled}
          label={label}
          placeholder={placeholder}
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isFetching && !isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default ProfessionalAutocomplete;
