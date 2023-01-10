"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = void 0;
const getOffset = (page, limit) => {
    return (page * limit) - limit;
};
const nextPage = (page, limit, total) => {
    if ((total / limit) > page) {
        return page + 1;
    }
    return null;
};
const previousPage = (page) => {
    if (page <= 1) {
        return null;
    }
    return page - 1;
};
const paginate = (model, pageSize, pageLimit, search, order, transform) => __awaiter(void 0, void 0, void 0, function* () {
    const page = pageSize || 1;
    const limit = pageLimit || 1;
    let options = {
        offset: getOffset(page, limit),
        limit: limit,
        order: [],
    };
    if (Object.keys(search).length) {
        options = Object.assign(Object.assign({}, options), search);
    }
    if (order && order.length) {
        options.order = order;
    }
    let { count, rows } = yield model.findAndCountAll(options);
    if (transform) {
        rows = transform(rows);
    }
    return {
        previousPage: previousPage(page),
        currentPage: page,
        nextPage: nextPage(page, limit, count),
        total: count,
        limit,
        data: rows,
    };
});
exports.paginate = paginate;
//# sourceMappingURL=paginate.js.map