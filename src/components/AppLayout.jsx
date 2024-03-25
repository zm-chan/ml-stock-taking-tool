import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <>
      <div>AppLayout component</div>
      <Outlet />
    </>
  );
}

export default AppLayout;
