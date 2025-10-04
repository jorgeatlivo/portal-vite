import { useEffect, useRef } from 'react';
import { Control, FieldValues, Path, useWatch } from 'react-hook-form';

type OptionalFieldContainerProps<T extends FieldValues, K extends Path<T>> = {
  name: K; // The field name to watch
  control: Control<T>; // React Hook Form control
  condition: (value: T[K]) => boolean; // Condition function to determine visibility
  children: React.ReactNode;
  onHide?: () => void; // Optional callback when the field is hidden
};

const FormOptionalFieldContainer = <T extends FieldValues, K extends Path<T>>({
  control,
  name,
  condition,
  children,
  onHide,
}: OptionalFieldContainerProps<T, K>) => {
  // Use generic type inference to get the correct type of value
  const value = useWatch<T, K>({ control, name });
  const onHideRef = useRef(onHide);
  const conditionRef = useRef(condition);
  const mountRef = useRef(false);
  const previouslyVisibleRef = useRef<boolean | null>(null);

  useEffect(() => {
    onHideRef.current = onHide;
  }, [onHide]);

  useEffect(() => {
    conditionRef.current = condition;
  }, [condition]);

  useEffect(() => {
    const isCurrentlyVisible = conditionRef.current(value);

    // Skip the first render - just set the initial state
    if (!mountRef.current) {
      mountRef.current = true;
      previouslyVisibleRef.current = isCurrentlyVisible;
      return;
    }

    // Check if we're transitioning from visible to hidden
    if (previouslyVisibleRef.current === true && !isCurrentlyVisible) {
      onHideRef.current?.();
    }

    // Update the previous visibility state
    previouslyVisibleRef.current = isCurrentlyVisible;
  }, [value]);

  return condition(value) ? <>{children}</> : null;
};

export default FormOptionalFieldContainer;
