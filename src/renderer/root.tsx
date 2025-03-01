import { Links, Meta, Outlet, Scripts, useNavigate } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import stylesheet from './global.css?url';
import { useEffect } from 'react';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
];

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    window.electron.onRoute((event, path) => {
      navigate(path);
    });
  }, [navigate]);

  return (
    <html>
      <head>
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <Meta />
        <Links />
      </head>
      <body>
        <h1>Hello world!</h1>
        <Outlet />

        <Scripts />
      </body>
    </html>
  );
}
