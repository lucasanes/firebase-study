"use client";

import { CardBody } from "@nextui-org/react";
import { styled } from "../../../stitches.config";

export const Container = styled(CardBody, {
  background: "$content",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
});
