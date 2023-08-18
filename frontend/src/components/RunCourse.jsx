import { Button, ButtonGroup, Heading, Text, VStack } from "@chakra-ui/react";
import React, { useState, useEffect, Fragment } from "react";
// import { Link } from "react-router-dom";
// import { useParams } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router";

const RunCourse = () => {
    // const [course, setCourse] = useState({});
    // const { course_id } = useParams();
    // const [c_id, setcid] = useState("");
    // const [c_title, settitle] = useState("");
    // const [c_credits, setcred] = useState("");
    const [depts, setDepts] = useState([]);
    const navigate = useNavigate();
    // const [prereqs, setPrereqs] = useState([]);
    // const [c_pre]
    // const getCourse = async () => {
    //     try {
        //  const response = await fetch('http://localhost:4000/auth/course/${course_id}');
    //     const jsonData = await response.json();
    
    //     setCourse(jsonData);
    //     } catch (err) {
    //     console.error(err.message);
    //     }
    // };

    const getCurCourse = async () => {
        try {
        //   var jsonData;
          // const res = await  axios.get("http://localhost:4000/auth/dashboard");
          axios.get(`http://localhost:4000/auth/courses/running`, {withCredentials:true}).then( (res) =>{
            // jsonData= (res.data);
            console.log(res.data[0]);
            setDepts(res.data);
        });
        //   console.log(parseData);
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

    // console.log(c_id);
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
        <h1 style={{textAlign: "center",fontSize: 40}}>Departments Offering Courses in current semester</h1>
        <div className='item-container'>
            {depts.map((dept)=>(
                <div key={dept.dept_name} style={{textAlign: "center",fontSize: 30}}> 
                {/* <h3>{dept.dept_name}</h3> */}
                <a href={`/course/running/${dept.dept_name}`}> {dept.dept_name}</a>
                {/* <Button colorScheme="teal" variant="outline" size="sm" onClick={() => navigate(`/course/running/${dept.dept_name}`)}> {dept.dept_name}</Button> */}
                </div>
            ))}
        </div>

            {/* <Button onClick={() => navigate("/home")}>Home</Button> */}

        </Fragment>
    );
    };

export default RunCourse;