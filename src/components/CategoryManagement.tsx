import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Tag, Palette } from 'lucide-react';
import { Category, Exercise } from '../types';

interface CategoryManagementProps {
  categories: Category[];
  exercises: Exercise[];
  onAddCategory: (category: Omit<Category, 'id' | 'createdAt'>) => void;
  onEditCategory: (id: string, category: Omit<Category, 'id' | 'createdAt'>) => void;
  onDeleteCategory: (id: string) => void;
}

const predefinedColors = [
  '#F97316', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6', 
  '#F59E0B', '#EC4899', '#06B6D4', '#84CC16', '#6366F1'
];

export const CategoryManagement: React.FC<CategoryManagementProps> = ({ 
  categories, 
  exercises,
  onAddCategory, 
  onEditCategory,
  onDeleteCategory
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: predefinedColors[0],
    description: '',
  });

  const getCategoryExerciseCount = (categoryName: string) => 
    exercises.filter(ex => ex.category === categoryName).length;

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.name.trim()) {
      onAddCategory(newCategory);
      setNewCategory({ name: '', color: predefinedColors[0], description: '' });
      setShowAddForm(false);
    }
  };

  const handleEditCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory && newCategory.name.trim()) {
      onEditCategory(editingCategory.id, newCategory);
      setEditingCategory(null);
      setNewCategory({ name: '', color: predefinedColors[0], description: '' });
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      color: category.color,
      description: category.description || '',
    });
    setShowAddForm(true);
  };

  const handleDelete = (category: Category) => {
    const exerciseCount = getCategoryExerciseCount(category.name);
    if (exerciseCount > 0) {
      if (confirm(`This category has ${exerciseCount} exercises. Are you sure you want to delete it? The exercises will need to be recategorized.`)) {
        onDeleteCategory(category.id);
      }
    } else {
      if (confirm(`Are you sure you want to delete the "${category.name}" category?`)) {
        onDeleteCategory(category.id);
      }
    }
  };

  const cancelEdit = () => {
    setShowAddForm(false);
    setEditingCategory(null);
    setNewCategory({ name: '', color: predefinedColors[0], description: '' });
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Category Management</h1>
            <p className="text-gray-600">Create and manage exercise categories for better organization.</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus size={20} className="mr-2" />
            Add Category
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((category) => {
          const exerciseCount = getCategoryExerciseCount(category.name);
          return (
            <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <h3 className="font-semibold text-gray-900 capitalize">{category.name}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(category)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit category"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="mb-3">
                <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  {exerciseCount} exercise{exerciseCount !== 1 ? 's' : ''}
                </span>
              </div>
              
              {category.description && (
                <p className="text-gray-600 text-sm">{category.description}</p>
              )}
            </div>
          );
        })}

        {categories.length === 0 && (
          <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <Tag size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">No categories created yet.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Create your first category
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Category Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-md w-full p-4 sm:p-6 my-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={editingCategory ? handleEditCategory : handleAddCategory}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Chest, Legs, Cardio"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Palette size={16} className="inline mr-1" />
                  Color
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewCategory({ ...newCategory, color })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        newCategory.color === color 
                          ? 'border-gray-800 scale-110' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                  placeholder="Brief description of this category..."
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};