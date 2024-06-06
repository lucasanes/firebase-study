"use client";

import { styled } from "../../../../stitches.config";

export const Container = styled("div", {
  minHeight: "100vh",
  background: "$body",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "50px 0",
});

export const Content = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "50px",
  width: "100%",
  maxWidth: "400px",

  ".button": {
    width: 200,
  },
});
