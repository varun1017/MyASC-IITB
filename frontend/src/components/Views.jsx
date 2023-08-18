import { Text } from "@chakra-ui/layout";
import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { AccountContext } from "./AccountContext";
import Login from "./Login/Login";
import SignUp from "./Login/SignUp";
import Home from "./Home";
import PrivateRoutes from "./PrivateRoutes";
import Course from "./Course";
import RunCourse from "./RunCourse";
import RunDeptCourse from "./RunDeptCourse";
import Instructor from "./Instructor";
import Registration from "./Registration";
// import Header from "./Header";

const Views = () => {
  const { user } = useContext(AccountContext);
  return user.loggedIn === null ? (
    <Text>Loading...</Text>
  ) : (
    // <Header>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
      
      <Route element={<PrivateRoutes />}>
        {/* <Header> */}
        <Route path="/home" element={<Home />} />
        <Route path="/home/registration" element={<Registration />} />
        <Route path="/course/running" element={<RunCourse />} />
        <Route path="/course/running/:dept_name" element={<RunDeptCourse />} />
        <Route path="/course/:course_id" element={<Course />}  />
        <Route path="/instructor/:instructor_id" element={<Instructor />} />
        {/* </Header> */}
      </Route>
      
      <Route path="*" element={<Login />} />
    </Routes>
    // </Header>
  );
};

export default Views;
