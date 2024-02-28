import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import morgan from "morgan";
import bodyParser from "body-parser";
import path from 'path';

//security pckg
import helmet from "helmet";
import dbConnection from "./dbConfig/index.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import router from "./routes/index.js";

dotenv.config();

const app=express();

const PORT=process.env.PORT || 8800;

const __dirname = path.resolve(path.dirname(""));
app.use(express.static(path.join(__dirname, "views/build")));


//db
dbConnection();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan());


//middleware for erroes
app.use(errorMiddleware);

//router
app.use(router);


app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });