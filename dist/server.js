"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const chalk_1 = __importDefault(require("chalk"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
(0, dotenv_1.config)();
const routes_1 = require("./routes");
const config_1 = require("./config");
const utils_1 = require("./utils");
const PORT = Number(process.env.PORT) || 8000;
const api = (0, express_1.default)();
api.use((0, multer_1.default)({ storage: config_1.fileStorage, fileFilter: utils_1.fileFilter }).single("image"));
api.use((0, cors_1.default)());
api.use(express_1.default.json());
api.use(express_1.default.urlencoded({ extended: true }));
api.use((0, cookie_parser_1.default)());
api.use((0, morgan_1.default)(":method :url :status :res[content-length] - :response-time ms"));
api.use('/storage', express_1.default.static(path_1.default.join(__dirname, 'storage')));
api.use('/static', express_1.default.static(path_1.default.join(__dirname, 'public')));
api.use([
    routes_1.authRouter,
    routes_1.userRouter,
    routes_1.blogRouter,
    routes_1.errorRouter,
]);
config_1.sequelize.sync()
    .then(() => {
    api.listen(PORT, () => console.log(`API is listening at PORT=${PORT} \nLocal: ${chalk_1.default.cyan(`http://localhost:${PORT}`)}`));
})
    .catch((err) => {
    throw err;
});
//# sourceMappingURL=server.js.map