import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders airdrop title", () => {
    render(<App />);
    const title = screen.getByText(/Airdrop Manager/i);
    expect(title).toBeInTheDocument();
});
