// Custom command to check if an element is visible and contains text
Cypress.Commands.add('shouldBeVisibleAndContain', (selector, text) => {
  cy.get(selector)
    .should('be.visible')
    .and('contain', text);
});

// Custom command to check if an element is not visible
Cypress.Commands.add('shouldNotBeVisible', (selector) => {
  cy.get(selector).should('not.exist');
});

// Custom command to check if an element is disabled
Cypress.Commands.add('shouldBeDisabled', (selector) => {
  cy.get(selector).should('be.disabled');
});

// Custom command to check if an element is enabled
Cypress.Commands.add('shouldBeEnabled', (selector) => {
  cy.get(selector).should('not.be.disabled');
}); 