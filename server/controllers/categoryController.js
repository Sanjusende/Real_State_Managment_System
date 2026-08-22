import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as categoryService from '../services/categoryService.js';

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllCategories(req.query);
  res.status(200).json(new ApiResponse(200, 'Categories retrieved successfully', categories));
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  res.status(200).json(new ApiResponse(200, 'Category details retrieved successfully', category));
});

export const getCategorySlug = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryBySlug(req.params.slug);
  res.status(200).json(new ApiResponse(200, 'Category details retrieved successfully', category));
});

export const addCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json(new ApiResponse(201, 'Category created successfully', category));
});

export const editCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, 'Category updated successfully', category));
});

export const removeCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  res.status(200).json(new ApiResponse(200, 'Category deleted successfully'));
});
