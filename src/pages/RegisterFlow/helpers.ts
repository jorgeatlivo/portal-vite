export function normalizeCIF(cif: string = '') {
  return `${cif[0]}-${cif.replace(/-/g, '').slice(1)}`;
}
