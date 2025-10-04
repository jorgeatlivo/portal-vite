export function preventEnterKeySubmit(e: React.KeyboardEvent) {
  const target = e.target as HTMLElement;
  if (e.key === 'Enter' && target.tagName === 'INPUT') {
    e.preventDefault();
  }
}
