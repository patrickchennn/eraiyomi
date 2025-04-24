describe('eraiyomi', () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })
  
  beforeEach(() => {
    cy.visit(Cypress.env('url'))
  })

  context("create an article",()=>{
    
    const articleTitle = "Mock Article";
  
    it("Should create a new article",()=>{
      cy.contains('a',"New Post")
        .invoke('removeAttr', 'target') 
        .click()
      ;

      cy.url({timeout:10000}).should('include', '/compose/post')

      // Intercept API call
      cy.intercept({
        method: 'POST',
        url: '/api/article',
        hostname: Cypress.env('API_hostname'),
      }).as('article')

      cy.intercept({
        method: 'POST',
        url: '/api/article/*/thumbnail',
        hostname: Cypress.env('API_hostname'),
      }).as('thumbnail')

      cy.intercept({
        method: 'POST',
        url: '/api/article/*/content',
        hostname: Cypress.env('API_hostname'),
      }).as('content')


      // API key
      cy.get("input[data-cy=api-key-input]").type(Cypress.env('API_key'))

      // title
      cy.get("input[data-cy=title-input]").type(articleTitle)

      // description
      cy.get("input[data-cy=desc-input]").type("Created with Cypress; Created with Cypress; Created with Cypress;")

      // category
      cy.get("input[data-cy=category-input]")
        .type("a").next().click().prev().clear()
        .type("b").next().click().prev().clear()
        .type("c").next().click()
      ;

      // thumbnail
      cy.get('#thumbnail').attachFile('thumbnail1-1920x1280.jpg');

      // main content
      cy.contains('button',"Markdown Editor").click({timeout:2000});
      cy.uploadFolder('#markdown-input', articleTitle.split(" ").join("-").toLowerCase())

      cy.get('div.w-md-editor-input').type(" This sentence typed from cypress.");

      cy.login()


      // post it (submit)
      cy.contains("button","Post").click()

      cy.wait('@article').its('response.statusCode').should('eq', 201);
      cy.wait('@thumbnail').its('response.statusCode').should('eq', 201);
      cy.wait('@content').its('response.statusCode').should('eq', 201);
    })

    it("should retrieve and verify the created post",()=>{
      cy.get("input[id=search-bar]")
        .wait(2000)
        .type(articleTitle)
      ;

      cy.get('ul[data-cy=search-container]')
        .children().first()

        .should("not.have.attr","data-cy","unavailable-element")
        .find('h3').should('contain.text', articleTitle)
      ;
    })
  });
})