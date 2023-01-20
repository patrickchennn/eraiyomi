import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div className="h-screen">
      <div>
        <h1 className="font-black">{error.status}: {error.statusText}</h1>
        <details>
          <summary className="cursor-pointer">
            {error.data}
          </summary>
          <pre>
            {error.error.stack}
          </pre>
        </details>

      </div>
    </div>
  );
}