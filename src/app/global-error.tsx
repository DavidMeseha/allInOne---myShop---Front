"use client";

import Image from "next/image";
import "@/globals.css";
import { LocalLink } from "@/components/LocalizedNavigation";

export default function GlobalError() {
  return (
    <html>
      <body style={{ padding: 0, textAlign: "center", font: "20px Helvetica, sans-serif", color: "#333" }}>
        <div
          style={{
            height: "95dvh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Image
            alt="product not found"
            height={250}
            src="/images/web_application_crash_failure.webp"
            style={{ objectFit: "contain" }}
            width={250}
          />
          <h1 style={{ fontSize: "2.25rem", fontWeight: "700", color: "gray" }}>500 Server Error Try Again Later</h1>
          <LocalLink
            href="/"
            style={{
              color: "white",
              backgroundColor: "#FA2D6C",
              border: "none",
              fontSize: "1rem",
              padding: "9px 18px"
            }}
          >
            Try Again
          </LocalLink>
        </div>
      </body>
    </html>
  );
}
