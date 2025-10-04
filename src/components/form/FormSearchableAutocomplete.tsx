import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Autocomplete,
  AutocompleteProps,
  CircularProgress,
  InputAdornment,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import { IconChevronDown } from '@tabler/icons-react';

import colors from '@/config/color-palette';

export interface BaseOption {
  value: any;
  label: string;
}

export interface UseSearchableDataReturn<T extends BaseOption> {
  data: T[];
  isLoading: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  error: any;
  totalCount: number;
}

export type SearchCallback = (searchTerm: string) => void;

export type RenderOption<T extends BaseOption> = (
  props: React.HTMLAttributes<HTMLLIElement>,
  option: T,
  state: { selected: boolean }
) => React.ReactNode;

export type RenderSelected<T extends BaseOption> = (
  option: T,
  onClear?: () => void
) => React.ReactNode;
const InfiniteScrollListbox = forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement> & {
    isFetchingNextPage: boolean;
    hasNextPage: boolean;
  }
>(({ children, isFetchingNextPage, hasNextPage, ...props }, ref) => (
  <ul {...props} ref={ref}>
    {children}
    {isFetchingNextPage && hasNextPage && (
      <li style={{ padding: '8px 16px', textAlign: 'center' }}>
        <CircularProgress size={20} />
      </li>
    )}
  </ul>
));

InfiniteScrollListbox.displayName = 'InfiniteScrollListbox';

const defaultRenderOption: RenderOption<BaseOption> = (props, option) => (
  <li {...props}>
    <Typography variant="body2">{option.label}</Typography>
  </li>
);

type FormSearchableAutocompleteProps<
  T extends FieldValues,
  O extends BaseOption,
> = {
  control: Control<T>;
  name: Path<T>;
  icon?: ReactNode;

  useSearchableData: () => UseSearchableDataReturn<O>;
  onSearch?: SearchCallback;
  searchDebounceMs?: number;

  renderOption?: RenderOption<O>;
  renderSelected?: RenderSelected<O>;

  enableInfiniteScroll?: boolean;
} & Pick<
  TextFieldProps,
  'label' | 'variant' | 'fullWidth' | 'required' | 'disabled' | 'placeholder'
> &
  Pick<
    AutocompleteProps<O, false, false, false, 'div'>,
    'defaultValue' | 'className' | 'clearIcon' | 'autoFocus'
  >;

const FormSearchableAutocomplete = <
  T extends FieldValues,
  O extends BaseOption,
>({
  control,
  name,
  label,
  variant,
  fullWidth,
  className,
  clearIcon,
  required,
  autoFocus,
  disabled,
  icon,
  placeholder,
  defaultValue,

  useSearchableData,
  onSearch,
  searchDebounceMs = 300,

  renderOption,
  renderSelected,

  enableInfiniteScroll = true,
}: FormSearchableAutocompleteProps<T, O>) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const scrollThrottleRef = useRef<NodeJS.Timeout>();

  const {
    data: options,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useSearchableData();

  const defaultFormValue = useMemo(() => {
    const value = (control._defaultValues?.[name] || defaultValue) ?? null;
    return value as PathValue<T, Path<T>>;
  }, [control._defaultValues, name, defaultValue]);

  const debouncedSearch = useCallback(
    (searchTerm: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        onSearch?.(searchTerm);
      }, searchDebounceMs);
    },
    [onSearch, searchDebounceMs]
  );

  const handleInputChange = useCallback(
    (event: React.SyntheticEvent, newInputValue: string) => {
      setInputValue(newInputValue);
      debouncedSearch(newInputValue);
    },
    [debouncedSearch]
  );

  const handleListboxScroll = useCallback(
    (event: React.SyntheticEvent) => {
      if (!enableInfiniteScroll || !hasNextPage || isFetchingNextPage) return;

      // Throttle scroll events to prevent excessive API calls
      if (scrollThrottleRef.current) return;

      scrollThrottleRef.current = setTimeout(() => {
        scrollThrottleRef.current = undefined;
      }, 100);

      const listbox = event.currentTarget as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = listbox;
      const threshold = 50;

      if (scrollHeight - scrollTop - clientHeight < threshold) {
        fetchNextPage();
      }
    },
    [enableInfiniteScroll, hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (scrollThrottleRef.current) {
        clearTimeout(scrollThrottleRef.current);
      }
    };
  }, []);

  const MemoizedListboxComponent = useMemo(() => {
    if (!enableInfiniteScroll) return undefined;

    return forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
      (props, ref) => (
        <InfiniteScrollListbox
          {...props}
          ref={ref}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          onScroll={handleListboxScroll}
          style={{ maxHeight: 400 }}
        />
      )
    );
  }, [
    enableInfiniteScroll,
    isFetchingNextPage,
    hasNextPage,
    handleListboxScroll,
  ]);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultFormValue}
      render={({ field, fieldState }) => {
        // If there's a value and renderSelected is provided, render the selected state
        if (
          Array.isArray(field.value) &&
          field.value.length > 0 &&
          renderSelected
        ) {
          const clear = () => {
            if (Array.isArray(field.value)) {
              field.onChange([] as unknown as PathValue<T, Path<T>>);
            } else {
              field.onChange(null as unknown as PathValue<T, Path<T>>);
            }
          };

          const selectedElement = renderSelected(field.value, clear);
          if (selectedElement) {
            return selectedElement as React.ReactElement;
          }
        }

        // Otherwise render the normal Autocomplete
        return (
          <Autocomplete
            autoFocus={autoFocus}
            disabled={disabled}
            popupIcon={
              <IconChevronDown size={24} color={colors['Text-Subtle']} />
            }
            fullWidth={fullWidth}
            loading={isLoading}
            {...field}
            options={options}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            getOptionLabel={(option) => option?.label ?? ''}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            onChange={(event, newValue) => {
              field.onChange(newValue);
            }}
            clearIcon={clearIcon}
            filterOptions={(x) => x} // Disable default filtering since we use API search
            renderOption={renderOption || defaultRenderOption}
            ListboxComponent={MemoizedListboxComponent}
            ListboxProps={
              !enableInfiniteScroll
                ? {
                    style: { maxHeight: 400 },
                  }
                : undefined
            }
            renderTags={() => null} // Hide tags for single select
            renderInput={(params) => (
              <TextField
                {...params}
                required={required}
                disabled={disabled}
                className={className}
                label={label}
                variant={variant}
                fullWidth={fullWidth}
                placeholder={placeholder}
                error={!!fieldState.error}
                helperText={t(fieldState.error?.message as never)}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: icon ? (
                    <InputAdornment position="start">{icon}</InputAdornment>
                  ) : undefined,
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
      }}
    />
  );
};

export default FormSearchableAutocomplete;
