export const createFilterState = (columns, query) => {
    const filters = columns.map((column) => ({
        [column]: { $regex: String(query), $options: "i" }
    }))

    return {
        $or: filters
    }
}