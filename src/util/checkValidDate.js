module.exports = (date) => !(date instanceof Date && !isNaN(date.getTime()));
