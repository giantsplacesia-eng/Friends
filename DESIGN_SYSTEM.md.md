# **🎨 Design System: Friends with Giants**

This document defines the visual and motion language for the "Friends with Giants" platform. All code generation must strictly adhere to these rules to maintain the "Industrial-Brutalist" aesthetic.

## **1\. Color Palette (Extracted from Brand SVG)**

| Element | Hex Code | Usage |
| :---- | :---- | :---- |
| **Giant Sage** | \#6A7C75 | Background of the Left Navigation Rail. |
| **Deep Charcoal** | \#2C302F | Main UI elements, inactive button backgrounds, and primary text. |
| **Alert Orange** | \#ED8F0D | Typography inside buttons and interactive labels. |
| **Industrial Red** | \#CF2402 | **Selected/Active state** background for buttons. |
| **Paper White** | \#F4F4F4 | Background of the Right Stage (Content Area). |

## **2\. Typography: "The Industrial Italic"**

* **Primary Font:** Use Inter or Space Grotesk (fallback to System Sans).  
* **Style:** Navigation and Headers **must** be italic and uppercase.  
* **Tracking:** Heavy letter-spacing is mandatory: tracking-\[0.08em\].  
* **Weights:** Medium (500) for navigation; Bold (700) for section headers.

## **3\. Layout Architecture (Porto Rocha Model)**

The site is a **Two-Column Split Layout** (grid-cols-\[281px\_1fr\]).

### **Left Rail (The Controller)**

* **Width:** Fixed 281px.  
* **Height:** 100vh, position: sticky, top: 0.  
* **Background:** \#6A7C75.  
* **Padding:** p-8 (Adjust to match SVG spacing).  
* **Mobile:** Becomes a sticky top-bar with an accordion-style dropdown for the Right Stage content.

### **Right Stage (The Canvas)**

* **Background:** \#F4F4F4.  
* **Scroll:** Independent from the Left Rail.  
* **Content:** This is where the **Giant Scrubber** and **Service Details** live.

## **4\. Interaction: The "Pill" Buttons**

Navigation items in the Left Rail are styled as "Pills."

* **Inactive State:** bg-\[\#2C302F\] text-\[\#ED8F0D\] rounded-md (subtle rounding).  
* **Active State:** bg-\[\#CF2402\] text-\[\#ED8F0D\] rounded-md.  
* **Physics:** Each pill must have a standalone GSAP floating animation.  
  * *Float Y:* \+/- 4px.  
  * *Duration:* random(3, 6s).  
  * *Ease:* sine.inOut.

## **5\. The Giant (Animation Specs)**

* **Source:** 87 frames of .webp files.  
* **Resolution:** 1364 x 768.  
* **Container:** position: absolute or fixed within the Right Stage.  
* **Z-Index:** Must sit **behind** the text content but **above** the background.  
* **Interaction:** \* Scroll position maps 0% \- 100% to frames 1 \- 87.  
  * **Smoothness:** Use scrub: 1.5 in GSAP ScrollTrigger to give the Giant a "weighted" feel.
  
  IMPORTANT: Anchor Behavior

The Giant is the Intro Anchor only.

Animation frames 1–87 play only within the first viewport (Hero Section).

Once frame 87 is reached, the "Scroll Lock" (pinning) must release, allowing the user to scroll down to the rest of the page.

The Giant should not appear on internal service pages or further down the homepage once the intro sequence is finished.

## **6\. Component Specifics (Tailwind Classes)**

* **Nav Button (Standard):** h-\[40px\] px-6 flex items-center justify-center italic tracking-\[0.08em\] uppercase text-\[14px\]  
* **Nav Button (Selected):** h-\[110px\] w-full bg-\[\#CF2402\] text-\[38px\] leading-tight (as seen in the "ABOUT" SVG state).  
* **Section Container:** max-w-4xl mx-auto py-32 px-12.

## **7\. Motion Guidelines**

* **Transitions:** When changing sections on the Right Stage, use a "Horizontal Slide \+ Fade."  
  * *Duration:* 0.8s.  
  * *Ease:* power4.out.  
* **Hover Physics:** Buttons should scale to 1.02 on hover with a spring(stiffness: 400, damping: 10\) effect.

