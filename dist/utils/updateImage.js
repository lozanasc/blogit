"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateImage = void 0;
const fs_1 = require("fs");
const updateImage = (filepath) => {
    try {
        (0, fs_1.unlinkSync)("./storage/" + filepath);
    }
    catch (error) {
        throw error;
    }
};
exports.updateImage = updateImage;
//# sourceMappingURL=updateImage.js.map