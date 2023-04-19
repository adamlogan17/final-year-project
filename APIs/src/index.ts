import express, { Request, Response } from 'express';
import morgan from "morgan";
import bp from 'body-parser';
import { deleteData, getAll, insertData, updateData } from './crud';
import { authenticate, authorise, retrieveUserDetails } from './login';
import { allPicuCompliance, singlePicuCompliance } from './auditCharts';

// import cors from 'cors';

// Express Initialize
const app = express();
const port: number = 8000;

// logs when an API is called from the app
app.use(morgan("tiny"));
// allows messages to be read from the body of a request
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }));

app.use((req:Request, res:Response, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

/**
 * Simple API that returns a value
 * @author Adam Logan
 */
app.get("/test/:val", (req: Request,res: Response)=>{
    res.send({
        hello:"world",
        val: req.params.val
    });
});

/**
 * Gets all data from a database
 * @author Adam Logan
 */
app.get("/:database/getall/:table", getAll);

/**
 * Inserts data to a database
 * @author Adam Logan
 */
app.post("/:database/insertdata", insertData);

/**
 * Updates data in the database
 * @author Adam Logan
 */
app.put("/:database/updatedata", updateData);

/**
 * Deletes the data in the database
 * @author Adam Logan
 */
app.delete("/:database/deletedata/:table/:predicate", deleteData);

/**
 * Will log a user into the system
 * @author Adam Logan
 */
app.get("/login/:username/:password", authenticate);

/**
 * Tests the 'authorise' function
 * @author Adam Logan
 */
app.get("/test-auth", authorise, (request:any, response) => {
    response.json({ message: "You are authorized to access me" , user: request.params.user, role: request.params.role});
});

/**
 * Retrieves the user's userId and role from the token provided
 * @author Adam Logan
 */
app.get("/auth/:token", retrieveUserDetails);

app.get("/chartData/singleSite/:siteId", singlePicuCompliance);

app.get("/chartData/allSites", allPicuCompliance);

app.listen(port,()=> {
    console.log(`listen port ${port}`);
    console.log(`Go to http://localhost:${port}/`);
});
