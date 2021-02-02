describe("Cypress", () => {
  it("is working", () => {
    expect(true).to.equal(true);
  });

  it("preferences persisted", () => {
    cy.viewport("iphone-5", "landscape");
    cy.visit("http://localhost:3000");
    cy.get(".radical-frequency-switch").click();

    cy.get("#radical-frequency-checkbox").should("be.checked");

    // reload the page

    cy.reload();

    cy.get("#radical-frequency-checkbox").should("be.checked");
  });
});
