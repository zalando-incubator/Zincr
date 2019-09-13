import { Router, Request, Response } from "express";
export declare function oauth(router: Router): void;
export declare function authenticate(req: Request, res: Response, next: Function): Promise<void>;
