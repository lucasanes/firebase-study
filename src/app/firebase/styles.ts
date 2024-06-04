"use client";

import { Card, CardBody, CardFooter } from "@nextui-org/react";
import { styled } from "../../../stitches.config";

export const Container = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "$body",
});

export const Content = styled(Card, {
  width: "300px",
  background: "$content",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
});

export const Body = styled(CardBody, {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
});

export const Footer = styled(CardFooter, {
  display: "flex",
  alignItems: "flex-start",
  flexDirection: "column",

  ".buttons": {
    display: "flex",
    gap: "10px",
  },

  ".google": {
    marginTop: "30px",
    marginLeft: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },
});
