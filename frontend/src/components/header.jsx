import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSuccess("");
      setMessage("");
    }, 2000);
    return () => clearTimeout(timer);
  }, [message, isSuccess]);

  // Fetch user info
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/auth/me", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setUsername(data.username || "Guest");
        setIsLogin(data.isLoggedIn || false);
      } catch (err) {
        console.error(err);
        setIsLogin(false);
        setUsername("Guest");
      }
    };
    fetchUsername();
  }, [location]);

  // Logout function
  async function handleLogout() {
    try {
      const res = await fetch("http://localhost:8000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message)
        setIsSuccess(true);
        setIsLogin(false);
        setUsername("");
        setTimeout(() => {
          navigate("/login");
          window.location.reload();
        }, 1000)
      } else {
        setIsSuccess(false);
        setMessage("Logout failed");
      }
    } catch (err) {
      setIsSuccess(false);
      setMessage("Logout failed")
      console.error(err);
    }
  }

  // Define navbar items
  const navbar = isLogin
    ? [
      { label: "Read", to: "/" },
      { label: "Upload", to: "/upload" },
      { label: "Logout", action: handleLogout },
      { label: "Profile", to: "/profile" }
    ]
    : [
      { label: "Read", to: "/" },
      { label: "Upload", to: "/upload" },
      { label: "Sign In", to: "/sign-in" },
      { label: "Login", to: "/login" },
    ];

  return (
    <>
      {message && (
        <section
          className={`fixed top-20 right-4 z-50 px-3 py-2 rounded-md shadow-md border-2 transition-all duration-300
      ${isSuccess ? "bg-blue-100 border-blue-400 text-blue-800" : "bg-red-100 border-red-400 text-red-800"}`}>
          <h2 className="text-lg font-bold">
            {message}
          </h2>
        </section>
      )}
      <header>
        <nav className="w-full h-16 bg-white shadow-lg fixed flex items-center justify-between z-50">
          {/* Hamburger button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsVisible(!isVisible)}
            className="block md:hidden text-3xl font-bold ml-4 hover:text-blue-500 cursor-pointer transition-all duration-300"
          >
            &#9776;
          </motion.button>

          {/* Username greeting */}
          <p className="font-semibold ml-4 text-xl mr-4">Welcome, {username}</p>

          {/* Desktop navbar */}
          <div className="hidden md:flex py-6 px-4 gap-4">
            {navbar.map((item) =>
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  className="bg-blue-500 text-slate-200 px-4 py-2 text-lg font-bold rounded-lg shadow-md hover:shadow-lg hover:bg-blue-400 hover:text-black/80 hover:scale-105 transition-all duration-300"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="block bg-blue-500 text-slate-200 px-4 py-2 text-lg font-bold rounded-lg shadow-md hover:shadow-lg hover:bg-blue-400 hover:text-black/80 hover:scale-105 transition-all duration-300"
                >
                  {item.label}
                </button>
              )
            )}

          </div>
        </nav>
      </header>

      {/* Mobile navbar (animated) */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="mobile-nav"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="md:hidden fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gray-100 shadow-2xl flex flex-col py-6 px-4 gap-4 w-[60%] max-w-[200px] z-50"
          >
            {navbar.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.to ? (
                  <Link
                    to={item.to}
                    className="bg-blue-500 text-slate-200 block px-4 py-2 text-lg font-bold rounded-lg shadow-md hover:shadow-lg hover:bg-blue-400 hover:text-black/80 hover:translate-x-1.5 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                    onClick={() => setIsVisible(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    onClick={() => {
                      item.action();
                      setIsVisible(false);
                    }}
                    className="bg-blue-500 text-slate-200 block px-4 py-2 text-lg font-bold rounded-lg shadow-md hover:shadow-lg hover:bg-blue-400 hover:text-black/80 hover:translate-x-1.5 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                  >
                    {item.label}
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
