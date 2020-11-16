const createCode = (state) => {
  const { category, author, title } = state;

  if (String(category.name).length > 0 && String(author).length > 0 && String(title).length > 0) {
    const splitCategoryName = String(category.name).split(":");
    const categoryCode = splitCategoryName[0];
    let authorShort = String(author).substring(0, String(author).length);
    const titleInitial = String(title).substring(0, 1).toLowerCase();

    if (String(author).length > 3) {
      authorShort = String(author).substring(0, 3);
    }

    return `${categoryCode}-${authorShort}-${titleInitial}.1`;
  }

  return "";
};

export default createCode;
