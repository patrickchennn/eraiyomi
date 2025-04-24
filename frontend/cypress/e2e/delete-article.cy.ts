describe('eraiyomi', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('url'))
  })
  
  const articleTitle = "Mock Article";

  context("delete an article", () => {
    it("Should delete an article",()=>{
      cy.login()

      cy.intercept({
        method: 'DELETE',
        url: '/api/article/*',
        hostname: Cypress.env('API_hostname'),
      }).as('deleteArticle')

      cy.intercept({
        method: 'GET',
        url: '/api/articles*',
        hostname: Cypress.env('API_hostname'),
      }).as('getArticles')
      
      cy.contains("a","Profile")
        .invoke('removeAttr', 'target') 
        .click()
      ;
      cy.url({ timeout: 10000 }).should('include', `/${Cypress.env("u_name")}`);

      cy.contains("button","my post").click()

      cy
        .get("input[data-cy=search-articles]")
        .click().type(articleTitle)
        .next()
        .click()
        .wait('@getArticles').its('response.statusCode').should('eq', 200)
      ;

      cy
        .get("div[data-cy=articles-container-profile]")
        .children()
        .first()
        .find("button[data-cy=delete-article]")
        .click()
      ;

      cy.wait('@deleteArticle').its('response.statusCode').should('eq', 204);
    })
    
    it("verify deletion result", ()=>{

      cy.get("input[id=search-bar]")
        .click().wait(2000).type(articleTitle)
      ;
      
      cy.get('ul[data-cy=search-container]')
        .children().first()
        .should("have.attr","data-cy","unavailable-element")
      ;
    })
  });
})
