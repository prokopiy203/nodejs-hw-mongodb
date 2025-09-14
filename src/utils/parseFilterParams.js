const parseContactType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;

  const lowerType = type.toLowerCase();
  const validTypes = ['personal', 'home'];
  if (validTypes.includes(lowerType)) return lowerType;

  return;
};

const parseBoolean = (value) => {
  const isString = typeof value === 'string';
  if (!isString) return;

  const lower = value.toLowerCase();

  if (lower === 'true' || lower === '1') return true;
  if (lower === 'false' || lower === '0') return false;

  return;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;

  const parsedContactType = parseContactType(contactType);
  const parsedIsFavourite = parseBoolean(isFavourite);

  return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};
