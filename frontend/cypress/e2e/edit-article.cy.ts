describe('eraiyomi', () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })
  
  beforeEach(() => {
    cy.visit(Cypress.env('url'))
  })

  // "The Power Of Markdown" | "Mock Article"
  // const prevArticleTitle = "Mock Article";
  const prevArticleTitle = "The Power Of Markdown";

  // const newArticleTitle = "The Power Of Markdown";
  const newArticleTitle = "Mock Article";
  context("edit an article", () => {

    it("Should edit an entire article data",()=>{
      cy.login();

      cy.intercept({
        method: 'PUT',
        url: '/api/article/*',
        hostname: Cypress.env('API_hostname'),
      }).as('article-metadata')

      cy.intercept({
        method: 'PUT',
        url: '/api/article/*/content',
        hostname: Cypress.env('API_hostname'),
      }).as('content')

      cy.intercept({
        method: 'GET',
        url: '/api/articles*',
        hostname: Cypress.env('API_hostname'),
      }).as('getArticles')

      cy.contains("a","Profile")
        .invoke('removeAttr', 'target').as("profileLink")
        .click({timeout:2000})
      ;

      cy.contains("button","my post").click()

      // matching URL 1: /[userName]
      cy.url({timeout:10000}).should('include', `/${Cypress.env("u_name")}`)


      // searching post according title
      cy.get("input[data-cy=search-articles]")
        .type(prevArticleTitle)
      ;
        
      cy.get("input[data-cy=search-articles]")
        .next()
        .click()
      ;

      cy.wait('@getArticles').its('response.statusCode').should('eq', 200)

      cy
        .get("div[data-cy=articles-container-profile]")
        .children()
        .first()
        .find("a[data-cy=edit-article]")
        .invoke('removeAttr', 'target')
        .click()
      ;


      // matching URL 2: [userName]/edit/post/*
      cy.url({ timeout: 10000 }).should('match', /\/[^/]+\/edit\/post\/.+/)

      // API key
      cy.get("input[data-cy=api-key-input]").type(Cypress.env('API_key'))

      cy.get("input[data-cy=edit-title]")
        .clear()
        .should("have.value", "")
        .type(newArticleTitle)
      ;
    
      cy.get("input[data-cy=edit-desc]")
        .clear()
        .should("have.value", "")
        .type("Edited with Cypress; Edited with Cypress;")
      ;
    
      // test the remove category button. Below will removing all of the categories
      cy.get('div[data-cy=category-container]').then(($container) => {
        const buttonCount = $container.children().length;
        for (let i = 0; i < buttonCount; i++) {
          // Re-query for the first button each time since the DOM changes after each click
          cy.get('div[data-cy=category-container]')
            .children()
            .first()
            .find('button')
            .click()
          ;
        }
      });

      // category input
      const selectCategory = (value: string) => {
        cy.get("input[data-cy=edit-category]")
          .clear()
          .should("have.value", "") // Ensure input is cleared before typing
          .type(value, { delay: 0 }) // Reduce flakiness
          .next()
          .click()
        ;
      };
      
      // Use the function for different values
      ["x", "y", "z"].forEach(selectCategory);
      

      // main content input
      cy.contains('button',"Markdown Editor").click();
      cy.uploadFolder('#markdown-input', newArticleTitle.split(" ").join("-").toLowerCase());

      cy.contains("button","Save").click()

      cy.wait('@article-metadata').its('response.statusCode').should('eq', 201);
      cy.wait('@content').its('response.statusCode').should('eq', 201);
    })

    it("should retrieve and verify the edited post",() => {
      cy.get("input[id=search-bar]").type(newArticleTitle, {timeout:2000});

      cy.get('ul[data-cy=search-container]')
        .children()
        .first()
        .should("not.have.attr","data-cy","unavailable-element")
        .find('h3')
        .should('contain.text', newArticleTitle)
      ;
    })

    it("Edit a thumbnail",()=>{
      cy.login();

      cy.intercept({
        method: 'PUT',
        url: '/api/article/*/thumbnail',
        hostname: Cypress.env('API_hostname'),
      }).as('thumbnail')

      cy.intercept({
        method: 'GET',
        url: '/api/articles*',
        hostname: Cypress.env('API_hostname'),
      }).as('getArticles')

      cy.contains("a","Profile")
        .invoke('removeAttr', 'target').as("profileLink")
        .click()
      ;

      cy.contains("button","my post").click()

      // matching URL 1: /[userName]
      cy.url({timeout:10000}).should('include', `/${Cypress.env("u_name")}`)


      // searching post according title
      cy.get("input[data-cy=search-articles]")  
        .type(newArticleTitle)
      ;
        
      cy.get("input[data-cy=search-articles]")
        .next()
        .click()
      ;
        
      cy.wait('@getArticles').its('response.statusCode').should('eq', 200)

      cy
        .get("div[data-cy=articles-container-profile]")
        .children()
        .first()
        .find("a[data-cy=edit-article]")
        .invoke('removeAttr', 'target')
        .click()
      ;


      // // matching URL 2: [userName]/edit/post/*
      cy.url({ timeout: 10000 }).should('match', /\/[^/]+\/edit\/post\/.+/)

      // API key
      cy.get("input[data-cy=api-key-input]").type(Cypress.env('API_key'))

      // thumbnail
      cy.get('#thumbnail').attachFile('thumbnail1-1920x1280.jpg');

      cy.contains("button","Save").click()

      cy.wait('@thumbnail').its('response.statusCode').should('eq', 201);
    })
  });

})
