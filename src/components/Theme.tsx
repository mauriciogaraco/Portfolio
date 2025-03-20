import React, { useEffect, useState } from "react";
import SunIcon from "./icons/SunIcon.astro";

export const Theme = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const handelChangeTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    if (theme === "dark") {
      document.querySelector("html")?.classList.add("dark");
    } else {
      document.querySelector("html")?.classList.remove("dark");
    }
  }, [theme]);

  return (
    <button onClick={handelChangeTheme}>
      <h1>Change {theme}</h1>
    </button>
  );
};
