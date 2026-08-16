
import { lazy } from "react";
import { NavbarProvider } from "./Context/NavbarContext";
const Layout = lazy(() => import("./Layout"));

function App() {
   return (
      <NavbarProvider>
         
         <Layout />
      </NavbarProvider>
   );
}

export default App;
