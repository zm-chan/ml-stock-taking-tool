import { Button } from "@/components/ui/button";
import { Link, useRouteError } from "react-router-dom";

function ErrorElement() {
  const error = useRouteError();

  console.log(error);

  let title = "An error occurred!";
  let message = "Something went wrong!";

  if (error.status === 500) {
    message = JSON.parse(error.data).message;
  }

  if (error.status === 404) {
    title = "Not found";
    message = "Could not find resource or page";
  }

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold lg:text-4xl">{title}</h1>
        <p className="lg:text-2xl lg:text-slate-400">{message}</p>
        <Button asChild className="lg:px-4 lg:py-6 lg:text-lg">
          <Link to={"/"}>Go Back Home</Link>
        </Button>
      </div>
    </div>
  );
}

export default ErrorElement;
