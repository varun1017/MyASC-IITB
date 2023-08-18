import React, { useState, useEffect, Fragment } from "react";
import { Button, ButtonGroup, Heading, Text, VStack } from "@chakra-ui/react";
// import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router";


const RunDeptCourse = () => {
    // const [course, setCourse] = useState({});
    const { dept_name } = useParams();
    // const [c_id, setcid] = useState("");
    // const [c_title, settitle] = useState("");
    // const [c_credits, setcred] = useState("");
    // const [course, setCourse] = useState("");
    const [deptruncou, setDeptRunCour] = useState([]);
    const navigate = useNavigate();
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

    const getCourse = async () => {
        try {
        //   var jsonData;
          // const res = await  axios.get("http://localhost:4000/auth/dashboard");
          axios.get(`http://localhost:4000/auth/courses/running/${dept_name}`, {withCredentials:true}).then( (res) =>{
            // jsonData= (res.data);
            console.log(res.data);
            setDeptRunCour(res.data);
        });
        //   console.log(parseData);
        } catch (err) {
          console.error(err.message);
        }
      };


    
    useEffect(() => {
        getCourse();
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
        <h1 style={{textAlign: "center",fontSize: 40}}>Running Courses in {dept_name} department</h1>
        <div className='item-container'>
            {deptruncou.map((dept)=>(
                <div key={dept.course_id} style={{textAlign: "center",fontSize: 30}}>
                <h3>
                <a href={`/course/${dept.course_id}`}>{dept.course_id}:{dept.title}</a> 
                    
                    </h3>
                </div>
            ))}
        </div>
        </Fragment>
    );
    };

export default RunDeptCourse;