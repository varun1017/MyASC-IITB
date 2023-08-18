import React, { useState, useEffect, Fragment } from "react";
import { Button, ButtonGroup, Heading, Text, VStack } from "@chakra-ui/react";
// import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router";


const Course = () => {
    // const [course, setCourse] = useState({});
    const { course_id } = useParams();
    // const [c_id, setcid] = useState("");
    // const [c_title, settitle] = useState("");
    // const [c_credits, setcred] = useState("");
    const [course, setCourse] = useState("");
    const [prereqs, setPrereqs] = useState([]);
    const [instrs, setInstr] = useState([]);
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
          axios.get(`http://localhost:4000/auth/course/${course_id}`, {withCredentials:true}).then( (res) =>{
            // jsonData= (res.data);
            // console.log(res.data[1][0]);
        //   const parseData =  jsonData;
        //   console.log(parseData);
        //   setName(parseData[0].id);
        //   setcid(res.data[0][0].course_id);
        //   settitle(res.data[0][0].title);
        //   setcred(res.data[0][0].credits);
          setCourse(res.data[0][0]);
          setPrereqs(res.data[1]);
          setInstr(res.data[2]);
        //   console.log(res.data[1][0]);
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
        <h1 style={{textAlign: "center",fontSize: 50}}>Course Information</h1>
        <table className="table mt-5 text-center">
            <thead>
            <tr>
                <th>Course ID</th>
                <th>Course Name</th>
                <th>Credits</th>
                {/* <th>Prerequisites</th>
                <th>Instructors</th> */}
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>{course.course_id}</td>
                <td>{course.title}</td>
                <td>{course.credits}</td>
                {/* <td>
                {course.prerequisites && course.prerequisites.map(prerequisite => (
                    <Link to={`/course/${prerequisite.course_id}`}>{prerequisite.course_id}</Link>
                ))}
                </td>
                <td>
                {course.instructors && course.instructors.map(instructor => (
                    <Link to={`/instructor/${instructor.instructor_id}`}>{instructor.instructor_name}</Link>
                ))}
                </td> */}
            </tr>
            </tbody>
        </table>


        <h1 style={{textAlign: "center",fontSize: 30}}>Prerequisites</h1>
        {prereqs.length===0 ? (
            <h2 style={{textAlign: "center",fontSize: 20}}>No prereqs found</h2>
        ):(
        <div className='item-container'>
            {prereqs.map((prereq)=>(
                <div key={prereq.prereq_id} style={{textAlign: "center",fontSize: 20}}>
                                        <a href={`/course/${prereq.prereq_id}`}>  {prereq.prereq_id}:{prereq.title} </a>

                {/* <Button onClick={()=>navigate(`/course/${prereq.prereq_id}`)}> <h3>{prereq.prereq_id}:{prereq.title}</h3> </Button> */}
                </div>
            ))}
        </div>

        )}

        <h1 style={{textAlign: "center",fontSize: 30}}>Instructor</h1>
        {instrs.length===0 ?(
             <h2 style={{textAlign: "center",fontSize: 20}}>Not offered in current semester</h2>
        ):(
        <table className="table mt-5 text-center">
        <thead>
                <tr>
                    {/* <th>Instructor ID</th> */}
                    <th>Instructor Name</th>
                </tr>
        </thead>
        <tbody>
        
        
                {instrs.map((instr)=>(
                    <tr key={instr.id}>
                        {/* <td>{instr.id}</td> */}
                        {/* <td>{instr.name}</td> */}
                        <a href={`/instructor/${instr.id}`}>  {instr.name} </a>
                    </tr>
                ))}
        
        
        </tbody>
        </table>
        )}

        </Fragment>
    );
    };

export default Course;