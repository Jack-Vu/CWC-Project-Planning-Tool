import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  redirect,
  RouterProvider
} from "react-router-dom";
import App from "./App";
import { LogIn, Profile, Projects, ResetPassword, SignUp } from "./Pages";
import axios from "axios";
import { createStandaloneToast } from "@chakra-ui/react";

const { ToastContainer, toast } = createStandaloneToast();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:3025/auth/profile",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          return response.data;
        } catch (error) {
          return {};
        }
      } else {
        return {};
      }
    },
    children: [
      {
        path: "/sign-up",
        element: <SignUp />
      },
      {
        path: "/log-in",
        element: <LogIn />
      },
      {
        path: "/projects",
        element: <Projects />
      },
      {
        path: "/profile",
        element: <Profile />,
        loader: async () => {
          const token = localStorage.getItem("token");
          if (token) {
            try {
              const response = await axios.get(
                "http://localhost:3025/auth/profile",
                { headers: { Authorization: `Bearer ${token}` } }
              );
              return response.data;
            } catch (error) {
              toast({
                title: "An error occurred.",
                description: "You must be signed in to view this page",
                status: "error",
                duration: 3000,
                isClosable: true
              });
              return redirect("/log-in");
            }
          } else {
            toast({
              title: "An error occurred.",
              description: "You must have an account to view this page",
              status: "error",
              duration: 3000,
              isClosable: true
            });
            return redirect("/sign-up");
          }
        }
      },
      {
        path: "reset-password/:token/:id",
        element: <ResetPassword />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <RouterProvider router={router} />
    <ToastContainer />
  </>
);
