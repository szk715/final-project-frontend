import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import ManageGame from "../pages/manager/game";
import ManageMirror from "../pages/manager/mirror";
const Container = () => {
  return (
    <div className="container">
      <Outlet />
    </div>
  );
};
export default Container;
