"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const verifyJwt = (req, res, next) => {
    if (req.skip) {
        return next();
    }
    const authorizationHeader = req.headers.authorization;
    if (!(authorizationHeader === null || authorizationHeader === void 0 ? void 0 : authorizationHeader.startsWith('Bearer '))) {
        return res.status(401).send({ error: true, message: "Invalid header!" });
    }
    const jwtToken = authorizationHeader.split(' ')[1];
    let decoded;
    try {
        const SECRET = process.env.SECRET_TOKEN;
        decoded = jsonwebtoken_1.default.verify(jwtToken, SECRET);
        req.currentUser = decoded.userId;
        req.role = decoded.role;
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
            return res.status(401).send({ error: true, message: err.message });
        }
    }
    next();
};
exports.verifyJwt = verifyJwt;
//# sourceMappingURL=verifyJwt.js.map