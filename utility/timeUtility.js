function convertToJST(utcDateStr) {
    const utcDate = new Date(utcDateStr);
    const jstOffset = 9 * 60; // JSTはUTC+9時間
    const jstDate = new Date(utcDate.getTime() + jstOffset * 60 * 1000);
    return jstDate.toISOString().replace('T', ' ').replace('Z', ' JST');
}

module.exports = { convertToJST };
