"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const skipVerifyJwt = (req, res, next) => {
    const { cookies } = req;
    const hasCookies = Object.entries(cookies).length > 0;
    if (hasCookies) {
        return next();
    }
    req.skip = true;
    next();
};
exports.default = skipVerifyJwt;
//# sourceMappingURL=skipVerifyJwt.js.map