function isValidDate(value) {
    if (value === null || value === undefined) return true;
    return !isNaN(new Date(value).getTime());
};

function isFutureDate(date) {
    const today = new Date();
    return new Date(date) > today;
}

module.exports = {
    isValidDate,
    isFutureDate
}