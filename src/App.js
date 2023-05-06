import React, { useState } from "react";
import "./App.less";
import Layout from "./layouts";
import Login from "./pages/login";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import ManageRange from "./pages/manager/range";
import ManageMirror from "./pages/manager/mirror";
import ManageWeapon from "./pages/manager/weapon";
import ManageUser from "./pages/manager/user";
import ManageGame from "./pages/manager/game";
import ManageScene from "./pages/manager/scene";
import ParticipantWeapon from "./pages/participant/weapon";
import ParticipantPerson from "./pages/participant/person";
import ApplyGame from "./pages/participant/apply";
import JoinGame from "./pages/participant/join";
import Score from "./pages/judge/score";
import Judge from "./pages/judge/judge";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function App() {
  // const [type, setType] = useState(localStorage.getItem("type"));
  const { login, type } = useSelector((store) => store.global);
  console.log(login, type, "data~!~~");
  const navigate = useNavigate();
  console.log(login, type);
  useState(() => {
    if (!login) {
      console.log("~~~~~~~~~未登录");
      navigate("/login");
    }
  }, [login]);
  console.log(type, "type~~~~~~~当前的type");
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          {+type === 0 && (
            <>
              <Route path="/" element={<ManageMirror />}></Route>
              <Route path="/mirror" element={<ManageMirror />}></Route>
              <Route path="/range" element={<ManageRange />}></Route>
              <Route path="/scene" element={<ManageScene />}></Route>
              <Route path="/weapon" element={<ManageWeapon />}></Route>
              <Route path="/game" element={<ManageGame />}></Route>
              <Route path="/manage-user" element={<ManageUser />}></Route>
            </>
          )}
          {+type === 1 && (
            <>
              <Route path="/" element={<Score />}></Route>
              <Route path="/judge" element={<Judge />}></Route>
            </>
          )}
          {(+type === 2 || +type === 3) && (
            <>
              <Route path="/" element={<ParticipantWeapon />}></Route>
              <Route path="/person" element={<ParticipantPerson />}></Route>
              <Route path="/weapon" element={<ParticipantWeapon />}></Route>
              <Route path="/applygame" element={<ApplyGame />}></Route>
              <Route path="/join" element={<JoinGame />}></Route>
            </>
          )}
        </Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </>
  );
}

export default App;
