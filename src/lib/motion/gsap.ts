"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// GSAP with its plugins registered once, for every client island.
gsap.registerPlugin(useGSAP, ScrollTrigger);

export { gsap, ScrollTrigger, useGSAP };

/** House curve for reveals (DESIGN §9, --ease ≈ expo.out). */
export const EASE = "expo.out";

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** Already on screen at setup: left as is, so nothing visible blinks. */
export const inView = (el: Element) =>
  el.getBoundingClientRect().top < window.innerHeight;
