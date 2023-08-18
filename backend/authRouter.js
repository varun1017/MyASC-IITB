const express = require("express");
const validateForm = require("./controllers/validateForm");
const router = express.Router();
const pool = require("./db");
const bcrypt = require("bcrypt");

router
  .route("/login")
  .get(async (req, res) => {
    if (req.session.user && req.session.user.username) {
      res.json({ loggedIn: true, username: req.session.user.username });
    } else {
      res.json({ loggedIn: false });
    }
  })
  .post(async (req, res) => {
    validateForm(req, res);

    const potentialLogin = await pool.query(
      "SELECT id, hashed_password FROM user_password u WHERE u.id=$1",
      [req.body.username]
    );

    if (potentialLogin.rowCount > 0) {
      const isSamePass = await bcrypt.compare(
        req.body.password,
        potentialLogin.rows[0].hashed_password
      );
      if (isSamePass) {
        req.session.user = {
          username: req.body.username,
          // id: potentialLogin.rows[0].id,
        };
        res.json({ loggedIn: true, username: req.body.username });
      } else {
        res.json({ loggedIn: false, status: "Wrong username or password!" });
        console.log("not good");
      }
    } else {
      console.log("not good");
      res.json({ loggedIn: false, status: "Wrong username or password!" });
    }
  });


router.post("/signup", async (req, res) => {
  validateForm(req, res);

  const validUser = await pool.query(
    "SELECT * from student, instructor WHERE student.id=$1 or instructor.id=$1",
    [req.body.username]
  );

  if (validUser.rowCount === 0) {
    res.json({ loggedIn: false, status: "Invalid username" });
    return;
  }

  const existingUser = await pool.query(
    "SELECT id from user_password WHERE id=$1",
    [req.body.username]
  );

  if (existingUser.rowCount === 0) {
    // register
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const newUserQuery = await pool.query(
      "INSERT INTO user_password(id, hashed_password) values($1,$2) RETURNING id",
      [req.body.username, hashedPass]
    );
    req.session.user = {
      username: req.body.username,
      // id: newUserQuery.rows[0].id,
    };

    res.json({ loggedIn: true, username: req.body.username });
  } else {
    res.json({ loggedIn: false, status: "Username taken" });
  }
});

router.route("/dashboard").get(async (req, res) => {
  validateForm(req, {});
  // console.log(req);
  const query1 = await pool.query(
    "SELECT id,name,dept_name,tot_cred from student WHERE id=$1",
    [req.session.user.username]
  );
  // console.log(query1.rows);
  // console.log(existingUser.rows[0]);

  const query2 = await pool.query(
    "select course_id,title,sec_id,semester,year from takes natural join course where id = $1 and semester = 'Fall' and year = 2010;",
    [req.session.user.username]
  );
  // console.log(query2.rows);

  const query3 = await pool.query(
    "select distinct year,semester from takes where id = $1 and (semester!='Fall' or year!=2010) order by year desc,semester;",
    [req.session.user.username]
  );
  console.log(query3.rows);
  console.log(query3.rows.length);

  var somevar3 = []

  for (let i=0;i<query3.rows.length;i++){
    const query4 = await pool.query(
      "select course_id,title,sec_id,semester,year,grade,credits from takes natural join course where id = $1 and semester = $2 and year = $3  order by year desc,semester;",
      [req.session.user.username,query3.rows[i].semester,query3.rows[i].year]
    );
    somevar3.push(query4.rows);
  }
  console.log(somevar3);

  // const query4 = await pool.query(
  //   "select course_id,title,sec_id,semester,year,grade,credits from takes natural join course where id = $1 and (semester != 'Fall' or year != 2010) order by year desc,semester;",
  //   [req.session.user.username]
  // );
  // console.log(query4.rows);


  
  // console.log([query1.rows,query2.rows,somevar3]);
  res.json([query1.rows,query2.rows,somevar3]);
  res.end();
  // console.log(res.header());
  // res.json(req.session)
});

router.route("/course/:course_id").get(async (req, res) => {
  validateForm(req, {});
  // console.log(req);
  const { course_id } = req.params;
  const query1 = await pool.query(
    "SELECT course_id,title,credits from course WHERE course_id=$1",
    [course_id]
  );
  console.log(query1.rows);

  const query2 = await pool.query(
    "select prereq.course_id,prereq_id,title from prereq,course where prereq.course_id = $1 and prereq.prereq_id = course.course_id;",
    [course_id]
  );
  console.log(query2.rows);

  const query3 = await pool.query(
    "select id,name from teaches natural join instructor where semester = 'Fall' and year = 2010 and course_id = $1;",
    [course_id]
  );
  
  res.json([query1.rows,query2.rows,query3.rows]);
  res.end();
  // console.log(res.header());
  // res.json(req.session)
});

router.route("/courses/running").get(async (req,res) => {
  validateForm(req,{});

  const query = await pool.query(
    "select distinct dept_name from teaches natural join course where semester = 'Fall' and year = '2010';"
  );

  console.log(query.rows);

  res.json(query.rows);
  res.end();

});

router.route("/courses/running/:dept_name").get(async (req,res) => {
  validateForm(req,{});
  const { dept_name } = req.params;
  const query = await pool.query(
    "select distinct course_id,title from teaches natural join course where dept_name = $1 and semester = 'Fall' and year = '2010';",
    [dept_name]
  );

  console.log(query.rows);

  res.json(query.rows);
  res.end();

});


router.route("/instructor/:instructor_id").get(async (req, res) => {
  validateForm(req, {});
  // console.log(req);
  const { instructor_id } = req.params;

  const query1 = await pool.query(
    "select name,dept_name from instructor where id = $1;",
    [instructor_id]
  );
  console.log(query1.rows);
  
  const query2 = await pool.query(
    "select course_id,title from course natural join teaches where id=$1 and semester = 'Fall' and year = 2010;",
    [instructor_id]
  );
  console.log(query2.rows);

  const query3 = await pool.query(
    "select course_id,title,sec_id,semester,year from course natural join teaches where id=$1 and (semester != 'Fall' or year != 2010) order by year desc,semester;",
    [instructor_id]
  );
  console.log(query3.rows);
  
  res.json([query1.rows,query2.rows,query3.rows]);
  res.end();
  // console.log(res.header());
  // res.json(req.session)
});

router.route("/home/registration").get(async (req, res) => {
  validateForm(req, {});

  const query1 = await pool.query(
    "select distinct course_id,title,sec_id from teaches natural join course where semester = 'Fall' and year = '2010';"
    // "select distinct course_id,title,array_agg(sec_id) as sec_id from teaches natural join course where semester = 'Fall' and year = '2010' group by course_id, title;",
  );
  // console.log(query1.rows);
  res.json(query1.rows);
  res.end();
});

router.route("/post/registration").post(async (req, res) => {
  validateForm(req, {});
  console.log(res.req.body.c_id);
  console.log(res.req.body.cs_id);
  // var quer1 = res.json();
  // console.log(quer1.rows); 
  var fb = {};

  fb = {1:'var0'}
  const query0 = await pool.query(
    "SELECT CASE WHEN EXISTS (SELECT 1 FROM (select course_id,sec_id from takes WHERE id = $1 and semester = 'Fall' and year = 2010) AS A WHERE course_id = $2 AND sec_id = $3) THEN 'TRUE' ELSE 'FALSE' END as result;",
    [req.session.user.username,res.req.body.c_id,res.req.body.cs_id]
  );
  console.log(query0.rows[0]);
  if(query0.rows[0].result =='FALSE'){
    const query1 = await pool.query(
      "SELECT CASE WHEN NOT EXISTS ( SELECT 1 FROM (select prereq_id from prereq where course_id = $1) AS table_1 WHERE NOT EXISTS ( SELECT 1 FROM (select distinct course_id from takes where id = $2) AS table_2 WHERE table_2.course_id = table_1.prereq_id)) THEN 'TRUE' ELSE 'FALSE' END AS result;",
      [res.req.body.c_id,req.session.user.username]
      );
      fb = {1:'var1'}

    if(query1.rows[0].result == 'TRUE'){

      const query2 = await pool.query(
        "SELECT CASE WHEN NOT EXISTS ( SELECT 1 FROM (select time_slot_id from section where course_id = $1 and sec_id = $2 and semester = 'Fall' and year = 2010) AS table_1 WHERE NOT EXISTS ( SELECT 1 FROM (select time_slot_id from takes natural join section where id = $3 and semester = 'Fall' and year = 2010) AS table_2 WHERE table_2.time_slot_id = table_1.time_slot_id ) ) THEN 'FALSE' ELSE 'TRUE' END AS result;",
        [res.req.body.c_id,res.req.body.cs_id,req.session.user.username]
        );
        fb = {1:'var2'}

      if(query2.rows[0].result == 'TRUE'){

        const query3 = await pool.query(
          "INSERT INTO takes(id,course_id,sec_id,semester,year) VALUES ($1,$2,$3,'Fall',2010) ON CONFLICT (id,course_id,sec_id,semester,year) DO NOTHING;",
          [req.session.user.username,res.req.body.c_id,res.req.body.cs_id]
        );
        fb = {1:'var3'}
        // console.log(query1.rows);
        console.log(query3.rows);
        // res.json(query3.rows);
      }
      
    }
  }
  res.json(fb);
  res.end();
});

router.route("/post/drop").post(async (req, res) => {
  validateForm(req, {});
  console.log(res.req.body.c_id);
  console.log(res.req.body.cs_id);
  // var quer1 = res.json();
  // console.log(quer1.rows);
  const query1 = await pool.query(
    "DELETE FROM takes WHERE id = $1 and course_id = $2 and sec_id = $3 and semester = 'Fall' and year = 2010;",
    [req.session.user.username,res.req.body.c_id,res.req.body.cs_id]
  );
  // console.log(query1.rows);
  // console.log(query1.rows);
  res.json(query1.rows);
  res.end();
});

router.route("/logout").get(async (req, res) => {
  validateForm(req, {});
  // console.log(req);
  // console.log(req.body);
  // req.cookies = null;
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
      }
      });
      // console.log(req.body.str);));
  res.json({ loggedIn: false });
  res.end();
  // console.log(res.header());
  // res.json(req.session)
});





module.exports = router;