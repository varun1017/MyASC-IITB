import React, { useState, useEffect, Fragment } from "react";
import { Button, ButtonGroup, Heading, Text, VStack } from "@chakra-ui/react";
// import { Link } from "react-router-dom";
// import { useParams } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

const Registration = () => {
    const [courses, setCourses] = useState([]);
    // const [c_id, setCid] = useState("");
    // const [cs_id, setCsid] = useState("");
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    var allCoursesItems = [];

    const getCurCourse = async () => {
        try {
          axios.get(`http://localhost:4000/auth/home/registration`, {withCredentials:true}).then( (res) =>{
            console.log("data",res.data);
            setData(res.data);
        });
        } catch (err) {
          console.error(err.message);
        }
      };

    useEffect(() => {
        getCurCourse();
    }, []);

    const logout = (e) => {
        e.preventDefault();
        axios.get("http://localhost:4000/auth/logout", {withCredentials:true}).then( (res) =>{
        navigate("/");
      });
      };

    const handleRegister = async(c_id,cs_id) => {
        // e.preventDefault();
        try{
    
            const body = { c_id, cs_id };
            console.log(body);
            const response = await fetch("http://localhost:4000/auth/post/registration", {
            credentials: 'include',
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            });
            const data = await response.json();
            // console.log(data);
            if (response.ok) {
                // window.location.reload();
                // alert(`You have Successfully Registered Course:${c_id}, Section:${cs_id} `);
                console.log(data[1]);
                if(data[1]==='var0'){
                    alert(`You have already registered for this course`);
                }
                if(data[1]==='var1'){
                    alert(`You have not met Prerequisites for this course,Registration Unsuccessful!`);
                }
                if(data[1]==='var2'){
                    alert(`Slot Clash with already registered courses,Registration Unsuccessful!`);
                }
                if(data[1]==='var3'){
                    alert(`Registration Successful!`);
                }
              } else {
                throw new Error("Failed to drop course");
              }
        }
        catch(err){
            console.error(err.message);
        }
      

    };

    

  const getItems = (Courses) => {
    var items = [];
    var mymap = {};
    for (var i = 0; i < Courses.length; i++) {
      if (Courses[i].course_id in mymap) {
        continue;
      }
      mymap[Courses[i].course_id] = 1;
      items.push({ id: i, name: Courses[i].course_id, title: Courses[i].title, section: Courses[i].sec_id });
    }
    return items;
  };


  allCoursesItems = getItems(data);


  const searchFunction = (string) => {
    if (string === "") {
      setCourses([]);
      return;
    }
    var newCourses = [];
    for (var i = 0; i < allCoursesItems.length; i++) {
      if (allCoursesItems[i].name.includes(string) || allCoursesItems[i].title.includes(string)) {
        newCourses.push({
            course_id: allCoursesItems[i].name,
            title: allCoursesItems[i].title,
            sec_id: allCoursesItems[i].section,
        });
      }
    }
    setCourses(newCourses);
    // console.log("newcourses",newCourses);
  };


//   setCourses([]);


  const handleOnSearch = (string, results) => {
    searchFunction(string);


    console.log("string", string);
    console.log("results", results);
  };


  const handleOnHover = (result) => {
    // the item hovered
    console.log(result);
  };


  const handleOnSelect = (item) => {
    searchFunction(item.name);
    console.log(item);
  };


  const handleOnFocus = () => {
    console.log("Focused");
  };


  const handleOnClear = () => {
    setCourses([]);
    console.log("Cleared");
};




  const formatResult = (item) => {
    return (
      <>
        {/* <span style={{ display: "block", textAlign: "left" }}>
          id: {item.id}
        </span> */}
        <span style={{ display: "block", textAlign: "left" }}>
          {item.name} : {item.title}
        </span>
      </>
    );
  };





    return (
        <Fragment>
      <ButtonGroup pt="1rem">
      <Button style={{fontSize: 20}} onClick={() => navigate("/home")}>Home</Button>
      <Button style={{fontSize: 20}} onClick={() => navigate("/course/running")}>Courses Running</Button>
      {/* </ButtonGroup> */}

      {/* <ButtonGroup pt="1rem"> */}
      <Button style={{fontSize: 20}} onClick={() => navigate("/home/registration")}>Course Registration</Button>
      {/* </ButtonGroup> */}

      {/* <ButtonGroup pt="1rem"> */}
      <Button style={{fontSize: 20}} onClick={logout}>logout</Button>
      </ButtonGroup>
            <h1 style={{textAlign: "center",fontSize: 50, padding:15}}>Registartion</h1>
        <Fragment>
        <ReactSearchAutocomplete
          items={allCoursesItems}
          onSearch={handleOnSearch}
          onHover={handleOnHover}
          onSelect={handleOnSelect}
          onFocus={handleOnFocus}
          onClear={handleOnClear}
          autoFocus
          formatResult={formatResult}
        />
      </Fragment>
        <h1 style={{textAlign: "center",fontSize: 35, padding:15}}>Courses Found</h1>
        <table className="table mt-5 text-center">
         <thead>
         <tr>
             <th>Course ID</th>
             <th>Title</th>
             <th>Section</th>
             {/* <th>Time Slot</th> */}
             <th>Register</th>
         </tr>
         </thead>
         <tbody>
         {courses.map( course => (
                <tr key={course.course_id+course.sec_id}>
                    <td>{course.course_id}</td>
                    <td>{course.title}</td>
                    <td>
                        {/* <select defaultValue={course.sec_id[0]}>{
                            course.sec_id.map((sec) => (
                                <option>{sec}</option>
                                
                            ))
                        }</select> */}
                        {course.sec_id}
                        </td>
                    {/* <td>{course.time_slot_id}</td> */}
                    <td><button onClick={() => handleRegister(course['course_id'],course['sec_id'])}>Register</button></td>
                </tr>
            ))}
            </tbody>
        </table>



        </Fragment>

    );
    };

export default Registration;