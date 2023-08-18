import { Button, ButtonGroup, Heading, Text, VStack } from "@chakra-ui/react";
import React, { Fragment, useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router";
// import { AccountContext } from "./AccountContext";

const Home = () => {
  const [usr, setUsr] = useState([]);
  const [curcours, setCurCour] = useState([]);
  const [prevcours, setPrevCour] = useState([]);
  // const [groups, setSemwise] = useState([]);
  const navigate = useNavigate();
  // const { setUser } = useContext(AccountContext);
  // const body = { setUser };
  const getProfile = async () => {
    try {
      // var jsonData;
      // const res = await  axios.get("http://localhost:4000/auth/dashboard");
      axios.get("http://localhost:4000/auth/dashboard", {withCredentials:true}).then( (res) =>{
        // jsonData= (res.data);
        // console.log(res.data);
      // const parseData =  jsonData;
      // console.log(parseData);
      // setName(parseData[0].id);
      // setusid(res.data[0].id);
      // setName(res.data[0].name);
      // setdept(res.data[0].dept_name);
      // setcred(res.data[0].tot_cred);
      setUsr(res.data[0][0]);
      setCurCour(res.data[1]);
      setPrevCour(res.data[2]);
      console.log(prevcours);
      // console.log(res.data[1]);
      console.log(res.data[2]);
      // console.log(prevcours);
    });
      // console.log(parseData);
    } catch (err) {
      console.error(err.message);
    }
  };

  // const getSemWise = async() => {
  //     prevcours.reduce((acc, curr) => {
  //       const key = `${curr.semester}-${curr.year}`;
  //       if (!acc[key]) {
  //         acc[key] = [];
  //       }
  //       acc[key].push(curr);
  //       setSemwise(acc);
  //     }, {})

  //     console.log(groups);
  //     console.log('holaaa');
    
  //   };




  // console.log(name);

  const handleDrop = async(c_id,cs_id) => {
    // e.preventDefault();
    try{

      const body = { c_id, cs_id };
      console.log(body);
      const response = await fetch("http://localhost:4000/auth/post/drop", {
        credentials: 'include',
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      if (response.ok) {
        window.location.reload();
        alert(`You have dropped ${c_id}`);
      } else {
        throw new Error("Failed to drop course");
      }
      
      // .then((res) =>  res.json())
      //   .then(data => {
      //     if (!data) return;
      //     // setUser({ ...data });
      //     alert(`You have dropped ${c_id}`);
      //     // navigate("/home");
      //     if (data.status) {
      //     //   setError(data.status);
      //     } else if (data.loggedIn) {
      //     //   navigate("/home");
      //     }
      //   });
    }
    catch(err){
      console.error(err.message);
    }

  

  };


  useEffect(() => {
    getProfile();
  }, []);

  // const groups = Object.values();
  const logout = (e) => {
    e.preventDefault();
    axios.get("http://localhost:4000/auth/logout", {withCredentials:true}).then( (res) =>{
    navigate("/");
  });
  };



  return (
    <Fragment>
    <div>
      <h1 className="mt-5" style={{fontSize: 40 }}><b>Dashboard</b></h1>
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
      {/* <h1 style={{textAlign: "center"}}>Welcome</h1> */}
      <h2 style={{textAlign: "center",fontSize: 30}}><b>User Information</b></h2>
      <h2 style={{textAlign: "center",fontSize: 30}}> <b>ID</b>:{usr.id}</h2>
      <h2 style={{textAlign: "center",fontSize: 30}}> <b>Name</b>:{usr.name}</h2>
      <h2 style={{textAlign: "center",fontSize: 30}}> <b>Department Name</b>:{usr.dept_name}</h2>
      <h2 style={{textAlign: "center",fontSize: 30}}> <b>Total Credits</b>:{usr.tot_cred}</h2>
    </div>


    <h1 style={{textAlign: "center",fontSize: 40}}>Current Semester Courses</h1>
    {curcours.length===0 ? (
      <h2>No courses registered in current semester</h2>
    ):(
    <table className="table mt-5 text-center">
    <thead>
            <tr>
                <th>Course ID</th>
                <th>Course Name</th>
                <th>Section</th>
                <th>Semester</th>
                <th>Year</th>
                <th>Drop</th>
            </tr>
    </thead>
    <tbody>
      
      
              {curcours.map((curcour)=>(
                  <tr key={curcour.course_id+curcour.sec_id+curcour.semester+curcour.year}>
                    <td>
                    <a href={`/course/${curcour.course_id}`}>{curcour.course_id}</a>
                      </td>
                    <td>{curcour.title}</td>
                    <td>{curcour.sec_id}</td>
                    <td>{curcour.semester}</td>
                    <td>{curcour.year}</td>
                    <td><button onClick={() => handleDrop(curcour['course_id'],curcour['sec_id'])}>Drop</button></td>
                  </tr>
              ))}
      
    
    </tbody>
    </table>
    )}


      <h1 style={{textAlign: "center",fontSize: 40}}>Previous Semester Courses</h1>

      {/* {curcours.length===0 ? (
      <h2>No courses registered in current semester</h2>
      ):      */}
      {prevcours.map((prevcour)=>(
        // <tr key={prevcour}>
      <table className="table mt-5 text-center">
      <thead>
              <tr>
                  <th>Course ID</th>
                  <th>Section</th>
                  <th>Course Name</th>
                  <th>Credits</th>
                  <th>Grade</th>
                  <th>Semester</th>
                  <th>Year</th>
              </tr>
      </thead>
      <tbody>
        
        
                {prevcour.map((prevcouri)=>(
                    <tr key={prevcouri.course_id+prevcouri.sec_id+prevcouri.semester+prevcouri.year}>
                      <td>
                      <a href={`/course/${prevcouri.course_id}`}>{prevcouri.course_id}</a>
                        </td>
                      <td>{prevcouri.sec_id}</td>
                      <td>{prevcouri.title}</td>
                      <td>{prevcouri.credits}</td>
                      <td>{prevcouri.grade}</td>
                      <td>{prevcouri.semester}</td>
                      <td>{prevcouri.year}</td>
                    </tr>
                ))}
        
      
      </tbody>
      </table>
      // </tr>
      ))}


  

  

    {/* {groups.map((group) => (
        <table className="table mt-5 text-center" key={group[0].semester + group[0].year}>
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Section</th>
              <th>Course Name</th>
              <th>Credits</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {group.map((prevcour) => (
              <tr key={prevcour.course_id + prevcour.sec_id + prevcour.semester + prevcour.year}>
                <td>{prevcour.course_id}</td>
                <td>{prevcour.sec_id}</td>
                <td>{prevcour.title}</td>
                <td>{prevcour.credits}</td>
                <td>{prevcour.grade}</td>
              </tr>
            
            ))}
          </tbody>
        </table>
    ))} */}

    {/* <h1>hi</h1> */}




    </Fragment>

    
  );
};

export default Home;