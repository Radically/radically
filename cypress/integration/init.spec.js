describe("Cypress", () => {
  it("is working", () => {
    expect(true).to.equal(true);
  });

  it("preferences persisted", () => {
    cy.viewport("iphone-5", "landscape");
    cy.visit("http://localhost:3000");
    cy.get("#radical-frequency-switch").click();

    cy.get("#radical-frequency-switch").should("be.checked");

    // reload the page

    cy.reload();

    cy.get("#radical-frequency-switch").should("be.checked");
  });

  it("dark mode working", () => {
    cy.viewport("iphone-5", "landscape");
    cy.visit("http://localhost:3000", {
      onBeforeLoad(win) {
        cy.stub(win, "matchMedia")
          .withArgs("(prefers-color-scheme: light)")
          .returns({
            matches: true,
            addListener: () => {},
          });
      },
    });

    cy.get("#darkmode-toggle").click();
    cy.get("#mobile-app-screen-container").should(
      "have.css",
      "background-color",
      "rgb(48, 48, 48)"
    );
  });

  it("dark mode respects prefers-color-scheme", () => {
    cy.viewport("iphone-5", "landscape");
    cy.visit("http://localhost:3000", {
      onBeforeLoad(win) {
        cy.stub(win, "matchMedia")
          .withArgs("(prefers-color-scheme: dark)")
          .returns({
            matches: true,
            addListener: () => {},
          });
      },
    });

    cy.get("#mobile-app-screen-container").should(
      "have.css",
      "background-color",
      "rgb(48, 48, 48)"
    );
  });
});
