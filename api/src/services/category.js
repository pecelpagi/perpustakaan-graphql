import { createFilterState } from './service.utils';

const Category = require('../models/categories');

export const getCategories = async (args) => {
    let filter = {};

    if (args.search) {
        filter = createFilterState(['code', 'name'], args.search);
    }

    let findData = Category.find(filter);
    
    if (args.skip) {
        findData = findData.skip(args.skip);
    }

    if (args.limit) {
        findData = findData.limit(args.limit);
    }

    return new Promise(function(resolve, reject) {
        findData.then((res) => {
            setTimeout(() => {
                resolve(res);
            }, 1);
        })
    });
}

export const getCategory = async (categoryId) => {
    const category = await Category.findById(categoryId);

    return category;
}

export const addCategory = async (args) => {
    const filter = {
        code: args.code,
    };
    const findData = await Category.findOne(filter);
    if (findData) {
        throw new Error("Kode Kategori sudah digunakan");
    }

    let category = new Category({
        code: args.code,
        name: args.name,
    });

    const result = await category.save();

    return result;
}

export const updateCategory = async (args) => {
    const filter = {
        code: args.code,
        _id: {
            $ne: args.id
        }
    };
    const findData = await Category.findOne(filter);
    if (findData) {
        throw new Error("Kode Kategori sudah digunakan");
    }

    let payload = {
        code: args.code,
        name: args.name,
    };
    const result = await Category.findByIdAndUpdate(args.id, payload);

    return result;
}

export const deleteCategory = async (args) => {
    const result = await Category.findByIdAndRemove(args.id);
    
    return result;
}