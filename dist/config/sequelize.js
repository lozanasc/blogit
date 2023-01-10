"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const models_1 = require("../models");
const ENV = process.env.APP_ENV;
let POSTGRES_URI = (ENV === "dev" ? process.env.DATABASE_URI : process.env.PROD_DATABASE_URI);
exports.sequelize = new sequelize_typescript_1.Sequelize(POSTGRES_URI, {
    dialect: "postgres",
    host: "localhost",
    models: [models_1.User, models_1.Blog, models_1.Token],
});
//# sourceMappingURL=sequelize.js.map