declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Custom command to log in.
     * @example cy.login()
     */
    login(): Chainable<any>;
    uploadFolder(): any;
  }
}