import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  redirect,
  RouterProvider
} from "react-router-dom";
import App from "./App";
import {
  Home,
  LogIn,
  Profile,
  Project,
  Projects,
  ResetPassword,
  SignUp
} from "./Pages";
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
        path: "/",
        index: true,
        element: <Home />,
        loader: async () => {
          const token = localStorage.getItem("token");
          if (token) {
            try {
              const response = await axios.get(
                "http://localhost:3025/auth/profile",
                { headers: { Authorization: `Bearer ${token}` } }
              );
              return redirect("/projects");
            } catch (error) {
              return {};
            }
          } else {
            return {};
          }
        }
      },
      {
        path: "/sign-up",
        element: <SignUp />,
        loader: async () => {
          const token = localStorage.getItem("token");
          if (token) {
            try {
              const response = await axios.get(
                "http://localhost:3025/auth/profile",
                { headers: { Authorization: `Bearer ${token}` } }
              );
              return redirect("/projects");
            } catch (error) {
              return {};
            }
          } else {
            return {};
          }
        }
      },
      {
        path: "/log-in",
        element: <LogIn />,
        loader: async () => {
          const token = localStorage.getItem("token");
          if (token) {
            try {
              const response = await axios.get(
                "http://localhost:3025/auth/profile",
                { headers: { Authorization: `Bearer ${token}` } }
              );
              return redirect("/projects");
            } catch (error) {
              return {};
            }
          } else {
            return {};
          }
        }
      },
      {
        path: "/projects",
        element: <Projects />,
        loader: async () => {
          const token = localStorage.getItem("token");
          if (token && token !== "") {
            try {
              const response = await axios.get(
                "http://localhost:3025/auth/user-projects",
                { headers: { Authorization: `Bearer ${token}` } }
              );
              return response.data;
            } catch (error) {
              localStorage.removeItem("token");
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
        path: "/profile",
        element: <Profile />,
        loader: async () => {
          const token = localStorage.getItem("token");
          if (token && token !== "") {
            try {
              const response = await axios.get(
                "http://localhost:3025/auth/profile",
                { headers: { Authorization: `Bearer ${token}` } }
              );
              return response.data;
            } catch (error) {
              localStorage.removeItem("token");
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
      },
      {
        path: "/project/:id",
        element: <Project />,
        loader: async ({ params }) => {
          const token = localStorage.getItem("token");
          if (token && token !== "") {
            try {
              const response = await axios.get(
                `http://localhost:3025/auth/project/${params.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (response.data === "") {
                toast({
                  title: "An error occurred.",
                  description: "You do not have access to that project!",
                  status: "error",
                  duration: 3000,
                  isClosable: true
                });
                return redirect("/projects");
              }
              return response.data;
            } catch (error) {
              localStorage.removeItem("token");
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
