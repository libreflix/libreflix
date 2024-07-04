function buildPermalink(filmName, filmYear) {
    // Convert to lowercase
    let lowerCaseName = filmName.toLowerCase();

    // Remove accents and special characters
    let normalizedName = lowerCaseName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Replace spaces with commas
    let nameWithCommas = normalizedName.replace(/\s+/g, '-');

    // Add the film year at the end
    return `${nameWithCommas}-${filmYear}`;
}

function buildUploadedFileName(fileName) {
    return buildPermalink(fileName, "libreflix");
}

module.exports = {
    buildPermalink, buildUploadedFileName
};