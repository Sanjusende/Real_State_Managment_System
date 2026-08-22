import Category from '../models/Category.js';
import ApiError from '../utils/ApiError.js';

export const getAllCategories = async (query = {}) => {
  const filter = { isActive: true, ...query };
  const categories = await Category.find(filter).sort({ name: 1 });
  return categories;
};

export const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }
  return category;
};

export const getCategoryBySlug = async (slug) => {
  const category = await Category.findOne({ slug, isActive: true });
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }
  return category;
};

export const createCategory = async (categoryData) => {
  const existing = await Category.findOne({ name: categoryData.name.trim() });
  if (existing) {
    throw new ApiError(409, `Category '${categoryData.name}' already exists`);
  }
  const category = await Category.create(categoryData);
  return category;
};

export const updateCategory = async (id, updateData) => {
  const category = await Category.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }
  return category;
};

export const deleteCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }
  return category;
};
