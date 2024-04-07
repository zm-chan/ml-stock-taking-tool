import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div className="container px-3">
      <h1 className="flex max-w-lg justify-between text-lg sm:text-2xl lg:max-w-2xl lg:text-3xl xl:max-w-3xl xl:text-4xl">
        <span className="font-semibold underline">NS RADIANCE SDN BHD</span>
        <span>{"[RAMPAI]"}</span>
      </h1>
      <Outlet />
    </div>
  );
}

export default AppLayout;
