import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import About from "./pages/About";
import Admin from "./pages/Admin";
import GreenMap from "./pages/GreenMap";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import Projects from "./pages/Projects";
import RestoreSubmit from "./pages/RestoreSubmit";
import SubmitProject from "./pages/SubmitProject";

function Layout() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F5EFE6" }}
    >
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

const rootRoute = createRootRoute({ component: Layout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects",
  component: Projects,
});
const projectDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects/$id",
  component: ProjectDetail,
});
const submitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/submit",
  component: SubmitProject,
});
const restoreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/restore",
  component: RestoreSubmit,
});
const greenMapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/green-map",
  component: GreenMap,
});
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: Admin,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  projectsRoute,
  projectDetailRoute,
  submitRoute,
  restoreRoute,
  greenMapRoute,
  aboutRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
