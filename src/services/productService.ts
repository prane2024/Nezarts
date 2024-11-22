import { createProduct as dbCreateProduct, getProductsByCategory as dbGetProductsByCategory, getAllProducts as dbGetAllProducts, updateProduct as dbUpdateProduct, deleteProduct as dbDeleteProduct } from '../lib/db';
import { log, LogLevel } from '../lib/logger';

export interface CreateProductData {
  productNumber: string;
  category: string;
  price: number;
  images: string[];
}

export interface UpdateProductData {
  category: string;
  price: number;
  images: string[];
}

export const createProduct = async (data: CreateProductData) => {
  try {
    const product = await dbCreateProduct(data);
    await log(LogLevel.INFO, 'Product', `Created new product #${data.productNumber}`, {
      category: data.category,
      price: data.price,
      imageCount: data.images.length
    });
    return product;
  } catch (error) {
    await log(LogLevel.ERROR, 'Product', `Failed to create product #${data.productNumber}`, error);
    throw error;
  }
};

export const getAllProducts = async () => {
  try {
    const products = await dbGetAllProducts();
    await log(LogLevel.INFO, 'Product', `Retrieved all products (${products.length} total)`);
    return products;
  } catch (error) {
    await log(LogLevel.ERROR, 'Product', 'Failed to fetch all products', error);
    throw error;
  }
};

export const getProductsByCategory = async (category: string) => {
  try {
    if (category === 'all') {
      return getAllProducts();
    }
    const products = await dbGetProductsByCategory(category);
    await log(LogLevel.INFO, 'Product', `Retrieved ${products.length} products from category: ${category}`);
    return products;
  } catch (error) {
    await log(LogLevel.ERROR, 'Product', `Failed to fetch products for category: ${category}`, error);
    throw error;
  }
};

export const updateProduct = async (id: number, data: UpdateProductData) => {
  try {
    const product = await dbUpdateProduct(id, data);
    await log(LogLevel.INFO, 'Product', `Updated product #${id}`, {
      category: data.category,
      price: data.price,
      imageCount: data.images.length
    });
    return product;
  } catch (error) {
    await log(LogLevel.ERROR, 'Product', `Failed to update product #${id}`, error);
    throw error;
  }
};

export const deleteProduct = async (id: number) => {
  try {
    await dbDeleteProduct(id);
    await log(LogLevel.INFO, 'Product', `Deleted product #${id}`);
  } catch (error) {
    await log(LogLevel.ERROR, 'Product', `Failed to delete product #${id}`, error);
    throw error;
  }
};