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
    <>
      <h1>{title}</h1>
      <p>{message}</p>
      <Button asChild>
        <Link to={"/"}>Go Back Home</Link>
      </Button>
    </>
  );
}

export default ErrorElement;
