/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
import 'cypress-file-upload';


Cypress.Commands.add("login",()=>{
  cy.intercept({
    method: 'POST',
    url: '/api/user/login-traditional',
    hostname: Cypress.env("API_hostname"),
  }).as('loginTraditional')

  cy.contains('button',"Sign In").click({timeout:2000});

  cy.get("div[data-cy='authentication-modal']").should('be.visible')

  cy.get("#login-uName-or-email").type(Cypress.env('u_name'))
  
  cy.get("#login-pass").type(Cypress.env('password'))

  cy.contains('button[type="submit"]',"Sign In")
    .click()
  ;  

  cy.wait('@loginTraditional').then((xhr) => {
    expect(xhr.response?.statusCode).to.eq(200);
  });
})

Cypress.Commands.add('uploadFolder', (selector, folderName) => {
  cy.task<string[]>('readdirRecursive', `cypress/fixtures/${folderName}`).then((filePaths) => {
    console.log("filePaths=",filePaths)
    const fileList = filePaths.map((filePath: string) => ({
      // Remove `cypress/fixtures/` prefix
      filePath: filePath.replace('cypress/fixtures/', ''),
    }));
    console.log("fileList=",fileList)

    cy.get(selector).selectFile(filePaths);
    // cy.get(selector).attachFile(fileList);
  });
});