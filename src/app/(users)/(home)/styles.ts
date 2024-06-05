"use client";

import { styled } from "../../../../stitches.config";

export const Container = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "$body",
});

export const Content = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "50px",
  width: "100%",
  maxWidth: "400px",

  ".signout": {
    width: 200,
  },
});
