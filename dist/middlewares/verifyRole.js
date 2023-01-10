"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRole = void 0;
const verifyRole = (...roles) => {
    return (req, res, next) => {
        if (req.skipVerifyJwt) {
            return next();
        }
        if (!req.role) {
            return res.status(401).send({ error: true, message: "Invalid token!" });
        }
        const verify = roles.includes(req.role);
        if (!verify) {
            return res.status(401).send({ error: true, message: "Sorry you're not permitted to do such action!" });
        }
        next();
    };
};
exports.verifyRole = verifyRole;
//# sourceMappingURL=verifyRole.js.map