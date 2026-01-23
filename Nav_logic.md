### **1\. The "Single Page App" (SPA) Feel**

The agent needs to know that clicking a Left Rail button **must not** trigger a browser refresh.

* **Instruction:** "Use a centralized state (e.g., `activeSection`) or Next.js Parallel Routes. The Left Rail is persistent; only the Right Stage transitions."

### **2\. The Navigation-to-Animation Link**

The agent needs to know that the Navigation is the "Remote Control" for the Giant.

* **Instruction:** "Each navigation item must be mapped to a specific scroll trigger ID on the Right Stage. Clicking a button should trigger `lenis.scrollTo('#section-id')` or a GSAP `scrollTo` tween."

### **3\. The Responsive "Accordion" Logic**

Your description of the mobile view (the right column opening *under* each nav item) is a very specific UI pattern.

* **Instruction:** "On viewports `< 768px`, the layout must transform from a 2-column grid to a single column. The `RightStageContent` components must be injected dynamically into an accordion-style dropdown beneath their respective `LeftRailButton` triggers."

