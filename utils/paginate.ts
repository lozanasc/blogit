import { Model } from "sequelize-typescript";

type GetOffsetFunction = (page: number, limit: number) => number;

type PreviousPageFunction = (page: number) => number | null;

type NextPageFunction = (page: number, limit: number, total: number) => number | null;

type OptionsType = {
  offset: number;
  limit: number;
  order: string[];
}

const getOffset: GetOffsetFunction = (page, limit) => {
  return (page * limit) - limit;
}

const nextPage: NextPageFunction = (page, limit, total) => {
  if ((total / limit) > page) {
    return page + 1;
  }

  return null;
}

const previousPage: PreviousPageFunction = (page) => {
  if (page <= 1) {
    return null;
  }

  return page - 1;
}

export const paginate = async (
  model: Model | any,
  pageSize: number, 
  pageLimit: number,
  search: object,
  order: string[],
  transform: Function | null
  ) => 
{

  const page: number = pageSize || 1;

  const limit: number = pageLimit || 1;

  let options: OptionsType = {
    offset: getOffset(page, limit),
    limit: limit,
    order: [],
  };

  if (Object.keys(search).length) {
    options = { ...options, ...search }
  }

  if (order && order.length) {
    options.order = order;
  } 

  let { count, rows } = await model.findAndCountAll(options);

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
  }

}