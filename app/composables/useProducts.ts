export const useProducts = () => {
  const getProducts = async () => {
    return await $fetch("/api/products");
  };

  const getProduct = async (slug: string) => {
    return await $fetch(`/api/products/${slug}`);
  };

  return {
    getProducts,
    getProduct,
  };
};