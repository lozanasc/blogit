import { Request, Response, NextFunction } from "express"

const skipVerifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const { cookies } = req;
  
  const hasCookies = Object.entries(cookies).length > 0;

  if (hasCookies) {
    return next();
  }


  req.skip = true;
  next();
}

export default skipVerifyJwt;
