const express = require("express");
const { Server } = require("socket.io");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const authRouter = require("./authRouter");
// const dashboard = require("./Dashboard");
const session = require("express-session");
const server = require("http").createServer(app);
require("dotenv").config();
const pool = require("./db");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: "true",
  },
});

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    credentials: true,
    name: "sid",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.ENVIRONMENT === "production" ? "true" : "auto",
      httpOnly: true,
      expires: 1000 * 60 * 60 * 24 * 7,
      sameSite: process.env.ENVIRONMENT === "production" ? "none" : "lax",
    },
  })
);


// app.post("/dashboard", async (req, res) => {
//   try {
//     const user_data = await pool.query("SELECT id FROM user_password WHERE id = $1",[req.session.user.username] ); 
//     res.json(user_data.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

app.use("/auth", authRouter);

io.on("connect", socket => {});

server.listen(4000, () => {
  console.log("Server listening on port 4000");
});