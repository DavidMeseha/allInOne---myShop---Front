describe("user register", () => {
  it("Navigates to register", () => {
    cy.visit("/");
    cy.contains("Log in").click();
    cy.url().should("include", "/login");
    cy.contains("Don’t have an account ?").click();
    cy.url().should("include", "/register");
  });

  it("failed due to wrong");
});
