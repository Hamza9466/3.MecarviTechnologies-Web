"use client";

import { useEffect } from "react";
import * as AOS from "aos";
import "aos/dist/aos.css";

const AOSProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    useEffect(() => {
      AOS.init({
  duration: 700,
  once: false,          // 🔥 animate every scroll
  offset: 180,
  easing: "ease-out-cubic",
});
    }, []);

    return <>{children}</>;
};

export default AOSProvider;
