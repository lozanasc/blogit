"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileFilter = void 0;
const fileFilter = (request, file, callback) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        callback(null, true);
    }
    else {
        callback(null, false);
    }
};
exports.fileFilter = fileFilter;
//# sourceMappingURL=multer.js.map