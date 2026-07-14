function getPagination(query) {
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);  

    if((query.page && (isNaN(page) || page < 1 ) ) || (query.limit && ( isNaN(limit)  || limit < 1) ) ) {
        const error = new Error("Invalid page or limit");
        error.statusCode = 400;
        throw error;
    }
    return {
        page: page || 1,
        limit: limit || 10
    };
}

function getSort(query, allowedSortFields, defaultSortField, defaultOrderField) {
    const sortBy = query.sortBy;
    const order = query.order;
    const allowedOrderField = ["asc", "desc"];

    if((sortBy && !allowedSortFields.includes(sortBy)) || (order && !allowedOrderField.includes(order))) {
        const error = new Error("Invalid sortBy or order value");
        error.statusCode = 400;
        throw error;
    }

    const field = sortBy || defaultSortField
    let sortOptions = {
        [field] : order || defaultOrderField
    }
    return sortOptions;
}

function getPaginationMeta(total, pagination) {
    const totalPages = Math.ceil(total / pagination.limit);
    const response = {
        total: total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: totalPages
    }
    return response;
}

module.exports = {
    getPagination,
    getSort,
    getPaginationMeta
}