export const getRandomProducts = (products, excludeIds = []) => {
    (isValidArray())
    const filteredProducts = products.filter(product => !excludeIds.includes(product._id));
  
    for (let i = filteredProducts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filteredProducts[i], filteredProducts[j]] = [filteredProducts[j], filteredProducts[i]];
    }
  
    return filteredProducts.slice(0, 3);
  };