import { Request, Response } from "express";
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import {createPool, createSelect} from './crud';

export function loginTest(request: Request, response: Response): void {
    const POOL = createPool("audit", "admin_role", "password");

    let condition:string = "picu_id=" + request.params.username + " AND password='" + request.params.password + "'";

    POOL.query(createSelect("picu", condition, ["picu_role"]), (error:any, results:any) => {
        if (error) {
          throw error;
        }

        try {
          const userToken = jwt.sign(
            {
              userId: request.params.username,
              role: results.rows[0].picu_role
            },
            "REPLACE-WITH-PRIVATE-KEY",
            {expiresIn: "1d"}
          );
          response.send({
            token: userToken,
            role: results.rows[0].picu_role
          });
        } catch (err) {
          response.send("Invalid User");
        }
        
    });
}

export function authorise(request: any, response: Response, next:any) {
  try {
    // get the token from the authorization header
    const token = request.headers.authorization.split(" ")[1];

    // check if the token matches the supposed origin
    const decodedToken = jwt.verify(token, "REPLACE-WITH-PRIVATE-KEY");

    // retrieve the user details of the logged in user
    const user:JwtPayload|string = decodedToken;

    // pass the user down to the endpoints here
    if(typeof user == 'string') {
      request.params.user = user;
    } else {
      request.params.username =  user.userId;
      request.params.role =  user.role;
    }

    // pass down functionality to the endpoint
    next();
  } catch (err) {
    response.json({
      error: new Error("Invalid request!"),
    });
  }
}

export function retrieveUserDetails(request: any, response: Response, next:any) {
  const token = request.params.token;

  const decodedToken = jwt.verify(token, "REPLACE-WITH-PRIVATE-KEY");

  const user:JwtPayload|string = decodedToken;

  if(typeof user == 'string') {
    response.send(user);
  } else {
    response.send({
      username: user.userId,
      role: user.role
    });
  }
}