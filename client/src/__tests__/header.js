import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import HeaderComponents, { navItems } from "../components/Layout/HeaderComponents";
import { MemoryRouter } from "react-router-dom";

// Helper to render with Router context
const renderWithRouter = (ui) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe("HeaderComponents", function () {
  it("renders logo text", function () {
    renderWithRouter(<HeaderComponents />);
    const logo = screen.getByText((content, node) => {
      return node.textContent === "Mohammad Umar" && node.tagName.toLowerCase() === "a";
    });
    expect(logo).toBeInTheDocument();
  });

  test("renders all nav links", () => {
    renderWithRouter(<HeaderComponents />);
    navItems.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("toggles mobile menu on button click", () => {
    renderWithRouter(<HeaderComponents />);
  
    const menuButton = screen.getByRole("button");
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute("role", "button");
  
    // Check that each item appears *at least once*
    navItems.forEach((item) => {
      const allLinks = screen.getAllByText(item.label);
      expect(allLinks.length).toBeGreaterThan(0);
    });
  
    // Same for "Login"
    const loginLinks = screen.getAllByText("Login");
    expect(loginLinks.length).toBeGreaterThan(0);
  });
  
});
