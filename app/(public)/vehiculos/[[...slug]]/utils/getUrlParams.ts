

export const getUrlParams = (slug: string[]) => {

  const formattedSlug = slug.map(formatSlugItem);

  const [brandData, model, ...rest] = formattedSlug;

  const brands = splitCommaSlugs(brandData);
  console.log(brands);

}

const formatSlugItem = (item: string) => {
  return decodeURIComponent(item.trim());
}

const splitCommaSlugs = (slug: string) => {
  return slug.split(",");
}