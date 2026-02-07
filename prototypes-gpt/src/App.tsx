import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { PrototypeOne } from "./prototypes/PrototypeOne";
import { PrototypeTwo } from "./prototypes/PrototypeTwo";
import { PrototypeThree } from "./prototypes/PrototypeThree";
import { PrototypeFour } from "./prototypes/PrototypeFour";
import { PrototypeFive } from "./prototypes/PrototypeFive";

const navLinks = [
  { to: "/prototype-1", label: "Prototype 1" },
  { to: "/prototype-2", label: "Prototype 2" },
  { to: "/prototype-3", label: "Prototype 3" },
  { to: "/prototype-4", label: "Prototype 4" },
  { to: "/prototype-5", label: "Prototype 5" }
];

function App() {
  return (
    <div className="app-root">
      <nav className="route-nav" aria-label="Prototype routes">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? "is-active" : undefined)}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/prototype-1" replace />} />
        <Route path="/prototype-1" element={<PrototypeOne />} />
        <Route path="/prototype-2" element={<PrototypeTwo />} />
        <Route path="/prototype-3" element={<PrototypeThree />} />
        <Route path="/prototype-4" element={<PrototypeFour />} />
        <Route path="/prototype-5" element={<PrototypeFive />} />
      </Routes>
    </div>
  );
}

export default App;
