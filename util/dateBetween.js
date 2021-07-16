module.exports = (startDate,endDate) =>{ 
    const startTime = new Date(Date.parse(startDate.replace(/-/g, '/'))).getTime(); 
    const endTime = new Date(Date.parse(endDate.replace(/-/g, '/'))).getTime(); 
    const dates = Math.abs((startTime - endTime))/(1000*60*60*24); 
    return dates; 
}