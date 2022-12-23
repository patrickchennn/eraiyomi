import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div id="error-page" className="">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>Error details:</p>
      <p>{error.data}</p>
      <p>{error.status}</p>
      <p>{error.statusText}</p>
    </div>
  );
}