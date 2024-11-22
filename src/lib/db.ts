import { openDB } from 'idb';

const dbName = 'nezarts-jewelry-store';
const dbVersion = 2;

export const initDb = async () => {
  const db = await openDB(dbName, dbVersion, {
    upgrade(db, oldVersion, newVersion, transaction) {
      const productStore = db.createObjectStore('products', { 
        keyPath: 'id', 
        autoIncrement: true 
      });
      productStore.createIndex('productNumber', 'productNumber', { unique: true });
      productStore.createIndex('category', 'category');

      const imageStore = db.createObjectStore('images', { 
        keyPath: 'id', 
        autoIncrement: true 
      });
      imageStore.createIndex('productId', 'productId');
    },
  });
  return db;
};

export const createProduct = async (data: {
  productNumber: string;
  category: string;
  price: number;
  images: string[];
}) => {
  const db = await initDb();
  const tx = db.transaction(['products', 'images'], 'readwrite');

  try {
    // Create product
    const product = {
      productNumber: data.productNumber,
      category: data.category,
      price: data.price,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const productId = await tx.objectStore('products').add(product);

    // Store images
    const imageStore = tx.objectStore('images');
    await Promise.all(
      data.images.map(imageUrl =>
        imageStore.add({
          url: imageUrl,
          productId,
          createdAt: new Date(),
        })
      )
    );

    await tx.done;
    return { id: productId, ...data };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const getAllProducts = async () => {
  const db = await initDb();
  const tx = db.transaction(['products', 'images'], 'readonly');
  
  try {
    const productStore = tx.objectStore('products');
    const imageStore = tx.objectStore('images');
    
    const products = await productStore.getAll();
    
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const imageIndex = imageStore.index('productId');
        const images = await imageIndex.getAll(product.id);
        return {
          ...product,
          images: images.map(img => img.url),
        };
      })
    );
    
    return productsWithImages;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductsByCategory = async (category: string) => {
  const db = await initDb();
  const tx = db.transaction(['products', 'images'], 'readonly');
  
  try {
    const productStore = tx.objectStore('products');
    const imageStore = tx.objectStore('images');
    
    const categoryIndex = productStore.index('category');
    const products = await categoryIndex.getAll(category);
    
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        const imageIndex = imageStore.index('productId');
        const images = await imageIndex.getAll(product.id);
        return {
          ...product,
          images: images.map(img => img.url),
        };
      })
    );
    
    return productsWithImages;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const updateProduct = async (
  id: number,
  data: {
    category: string;
    price: number;
    images: string[];
  }
) => {
  const db = await initDb();
  const tx = db.transaction(['products', 'images'], 'readwrite');

  try {
    // Update product
    const productStore = tx.objectStore('products');
    const product = await productStore.get(id);
    if (!product) throw new Error('Product not found');

    await productStore.put({
      ...product,
      category: data.category,
      price: data.price,
      updatedAt: new Date(),
    });

    // Update images
    const imageStore = tx.objectStore('images');
    const imageIndex = imageStore.index('productId');
    const existingImages = await imageIndex.getAll(id);
    
    // Delete existing images
    await Promise.all(existingImages.map(img => imageStore.delete(img.id)));

    // Add new images
    await Promise.all(
      data.images.map(url =>
        imageStore.add({
          url,
          productId: id,
          createdAt: new Date(),
        })
      )
    );

    await tx.done;
    return { id, ...data };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: number) => {
  const db = await initDb();
  const tx = db.transaction(['products', 'images'], 'readwrite');

  try {
    // Delete product
    await tx.objectStore('products').delete(id);

    // Delete associated images
    const imageStore = tx.objectStore('images');
    const imageIndex = imageStore.index('productId');
    const images = await imageIndex.getAll(id);
    await Promise.all(images.map(img => imageStore.delete(img.id)));

    await tx.done;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};