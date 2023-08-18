import React, { useState, useEffect, Fragment } from "react";
import { Button, ButtonGroup, Heading, Text, VStack } from "@chakra-ui/react";
// import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router";


const Instructor = () => {
    // const [course, setCourse] = useState({});
    const { instructor_id } = useParams();
    const [instr, setInstr] = useState("");
    const [curcours, setCurCour] = useState([]);
    const [prevcours, setPrevCour] = useState([]);
    const navigate = useNavigate();


    const getInstr = async () => {
        try {
        //   var jsonData;
          // const res = await  axios.get("http://localhost:4000/auth/dashboard");
          axios.get(`http://localhost:4000/auth/instructor/${instructor_id}`, {withCredentials:true}).then( (res) =>{
            // jsonData= (res.data);
            console.log(res.data);
            setInstr(res.data[0][0]);
            setCurCour(res.data[1]);
            setPrevCour(res.data[2]);

        });
        //   console.log(parseData);
        } catch (err) {
          console.error(err.message);
        }
      };


    
    useEffect(() => {
        getInstr();
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
        <h1 style={{textAlign: "center",fontSize: 50}}>Instructor Information</h1>
        <h2 style={{textAlign: "center",fontSize: 30}}><b>Name</b>:{instr.name}</h2>
        <h2 style={{textAlign: "center",fontSize: 30}}><b>Department</b>:{instr.dept_name}</h2>

        <h1 style={{textAlign: "center",fontSize: 40}}>Current Semester Offerings</h1>
        <div className='item-container' style={{textAlign: "center",fontSize: 25}}>
            {curcours.map((curcour)=>(
                <div key={curcour.course_id}>
                <h3>
                <a href={`/course/${curcour.course_id}`}>{curcour.course_id}:{curcour.title}</a> 
                    </h3>
                </div>
            ))}
        </div>
        <h1 style={{textAlign: "center",fontSize: 40}}>Previous Semester Offerings</h1>
        
        {prevcours.length===0 ? (<h2 style={{textAlign: "center",fontSize: 25}}>No previous semester courses taught</h2>)
        : (
        <table className="table mt-5 text-center">
        <thead>
                <tr>
                    {/* <th>Instructor ID</th> */}
                    <th>Course ID</th>
                    <th>Title</th>
                    <th>Semester</th>
                    <th>Year</th>
                </tr>
        </thead>
        <tbody>
            {prevcours.map((prevcour)=>(
                <tr key={prevcour.course_id+prevcour.sec_id+prevcour.semester+prevcour.year}>
                <td>
                <a href={`/course/${prevcour.course_id}`}>{prevcour.course_id}</a>
                    </td>
                <td>{prevcour.title}</td>
                <td>{prevcour.semester}</td>
                <td>{prevcour.year}</td>
                </tr>
            ))}
        </tbody>
        </table>
        )}
        
        </Fragment>

    );
    };

export default Instructor;