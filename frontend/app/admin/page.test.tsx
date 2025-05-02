// import React from "react";

// import { render, screen } from "@testing-library/react";
// import "@testing-library/jest-dom"; // Import jest-dom matchers
// import EcommerceDashboard from "./page"; // Adjust path as needed

// describe("EcommerceDashboard", () => {
//   it("renders Admin Dashboard title", () => {
//     render(<EcommerceDashboard />);
//     expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
//   });
// });

// import React from "react";
// import { render, screen } from "@testing-library/react";
// import "@testing-library/jest-dom"; // Import jest-dom matchers
// import EcommerceDashboard from "./page"; // adjust path if needed

// describe("EcommerceDashboard", () => {
//   it("renders Admin Dashboard title", async () => {
//     render(<EcommerceDashboard />);
//     const heading = await screen.findByText("Admin Dashboard");
//     expect(heading).toBeInTheDocument();
//   });
// });

// app/admin/page.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; 
import EcommerceDashboard from "./page";

// ✅ Mock chart.js components to prevent canvas errors
jest.mock("react-chartjs-2", () => ({
  Line: () => <div>Mocked Line Chart</div>,
  Bar: () => <div>Mocked Bar Chart</div>,
  Pie: () => <div>Mocked Pie Chart</div>,
}));

describe("EcommerceDashboard", () => {
  it("renders Admin Dashboard title", async () => {
    render(<EcommerceDashboard />);
    const heading = await screen.findByText("Admin Dashboard");
    expect(heading).toBeInTheDocument();
  });
});
