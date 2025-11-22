export const cn = (...inputs: (string | false | undefined | null)[]) => {
  return inputs.filter(Boolean).join(' ');
};
