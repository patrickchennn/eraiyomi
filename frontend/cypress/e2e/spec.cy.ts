describe('eraiyomi', () => {
  beforeEach(() => {
    /*
      Cypress starts out with a blank slate for each test
      so we must tell it to visit our website with the `cy.visit()` command.
      Since we want to visit the same URL at the start of all our tests,
      we include it in our beforeEach function so that it runs before each test
    */
    // cy.visit('https://staging-client.eraiyomi.com')
    cy.visit('http://localhost:3000')
  })

  // context("Register user account", () => {
  //   it("Register: bad username" , () => {
  //     cy.intercept({
  //       method: 'POST',
  //       url: '/api/user*',
  //       hostname: Cypress.env('hostname'),
  //     }).as('register')

  //     // https://stackoverflow.com/questions/51254946/cypress-does-not-always-executes-click-on-element
  //     cy.contains('button',"Sign In")
  //       .wait(2000)
  //       .click()
  //       .next().should('be.visible')
  //     ;

  //     cy.contains('button',"Sign Up")
  //       .wait(2000)
  //       .click()
  //     ;

  //     cy.get("#register-uName").type('faker asdf zxcv')
  //     cy.get("#register-name").type('faker')
  //     cy.get("#register-email").type('faker@mail.com')
  //     cy.get("#register-pass").type('123')
  //     cy.get("#register-key").type(Cypress.env('API_key'))

  //     cy.contains('button[type="submit"]',"Sign Up")
  //       .click()
  //     ;  

  //     // Wait for the intercepted login request to complete
  //     cy.wait('@register').then((xhr) => {
  //       console.log("xhr=",xhr)
  //       expect(xhr.response?.statusCode).to.eq(400);
  //     })
  //   });

  //   it("Register: existed user" , () => {
  //     cy.intercept({
  //       method: 'POST',
  //       url: '/api/user*',
  //       hostname: Cypress.env('hostname'),
  //     }).as('register')

  //     cy.contains('button',"Sign In")
  //       .wait(2000)
  //       .click()
  //       .next().should('be.visible')
  //     ;

  //     cy.contains('button',"Sign Up")
  //       .wait(2000)
  //       .click()
  //     ;

  //     cy.get("#register-uName").type('patrickchen')
  //     cy.get("#register-name").type('faker')
  //     cy.get("#register-email").type('patrick.chen31@gmail.com')
  //     cy.get("#register-pass").type('123')
  //     cy.get("#register-key").type(Cypress.env('API_key'))

  //     cy.contains('button[type="submit"]',"Sign Up")
  //       .click()
  //     ;  

  //     // Wait for the intercepted login request to complete
  //     cy.wait('@register').then((xhr) => {
  //       expect(xhr.response?.statusCode).to.eq(400);
  //     })
  //   });

  //   it("Register: successful" , () => {
  //     cy.intercept({
  //       method: 'POST',
  //       url: '/api/user*',
  //       hostname: Cypress.env('hostname'),
  //     }).as('register')


  //     cy.contains('button',"Sign In")
  //       .wait(2000)
  //       .click()
  //       .next().should('be.visible')
  //     ;

  //     cy.contains('button',"Sign Up")
  //       .wait(2000)
  //       .click()
  //     ;

  //     cy.get("#register-uName").type('cypress')
  //     cy.get("#register-name").type('Register From Cypress')
  //     cy.get("#register-email").type('cypress@mail.com')
  //     cy.get("#register-pass").type('123')
  //     cy.get("#register-key").type(Cypress.env('API_key'))

  //     cy.contains('button[type="submit"]',"Sign Up")
  //       .click()
  //     ;  

  //     // Wait for the intercepted login request to complete
  //     cy.wait('@register').then((xhr) => {
  //       expect(xhr.response?.statusCode).to.eq(201);
  //     })
  //   });
  // })

  // context("Login user account", () => {
  //   it('With unexisting user', () => {
  //     cy.intercept({
  //       method: 'POST',
  //       url: '/api/user/login-traditional',
  //       hostname: Cypress.env('hostname'),
  //     }).as('loginTraditional')
  
  //     cy.contains('button',"Sign In")
  //       .wait(2000)
  //       .click()
  //       .next().should('be.visible')
  //     ;
  
  //     cy.get("#login-uName-or-email").type('fake@email.com')
  //     cy.get("#login-pass").type('123456')
  //     cy.contains('button[type="submit"]',"Sign In")
  //       .click()
  //     ;  
  
  //     // Wait for the intercepted login request to complete
  //     cy.wait('@loginTraditional').then((xhr) => {
  //       expect(xhr.response?.statusCode).to.eq(401);
  //     });
  //   });

  
  //   it('With incorrect password', () => {
  //     cy.intercept({
  //       method: 'POST',
  //       url: '/api/user/login-traditional',
  //       hostname: Cypress.env('hostname'),
  //     }).as('loginTraditional')
  
  
  //     // https://stackoverflow.com/questions/51254946/cypress-does-not-always-executes-click-on-element
  //     cy.contains('button',"Sign In")
  //       .wait(2000)
  //       .click()
  //       .next().should('be.visible')
  //     ;
  
  //     cy.get("#login-uName-or-email").type('patrick_chen')
  //     cy.get("#login-pass").type('123456')
  //     cy.contains('button[type="submit"]',"Sign In")
  //       .click()
  //     ;  
  
  //     // Wait for the intercepted login request to complete
  //     cy.wait('@loginTraditional').then((xhr) => {
  //       expect(xhr.response?.statusCode).to.eq(401);
  //     });
  //   })
  
  //   it('With existing user', () => {
  //     cy.intercept({
  //       method: 'POST',
  //       url: '/api/user/login-traditional',
  //       hostname: Cypress.env('hostname'),
  //     }).as('loginTraditional')
  
  //     cy.contains('button',"Sign In")
  //       .wait(2000)
  //       .click()
  //       .next().should('be.visible')
  //     ;
  
  //     cy.get("#login-uName-or-email").type(Cypress.env('u_name'))
  //     cy.get("#login-pass").type(Cypress.env('password'))
  //     cy.contains('button[type="submit"]',"Sign In")
  //       .click()
  //     ;  
  
  //     cy.wait('@loginTraditional').then((xhr) => {
  //       expect(xhr.response?.statusCode).to.eq(200);
  //     });
  //   });
  // })
  

  context("article", () => {
    const waitDOM = 2000;

    context("create an article",()=>{
      it("should create a new post",()=>{
        // cy.login()
        cy.contains('a',"New Post")
          .invoke('removeAttr', 'target') 
          .click()
        ;

        cy.url({timeout:10000}).should('include', '/compose/post')

        // cy.intercept({
        //   method: 'POST',
        //   url: '/api/article',
        //   hostname: Cypress.env('hostname'),
        // }).as('article')

        // cy.intercept({
        //   method: 'POST',
        //   url: '/api/article/*/thumbnail',
        //   hostname: Cypress.env('hostname'),
        // }).as('thumbnail')

        // cy.intercept({
        //   method: 'POST',
        //   url: '/api/article/*/content',
        //   hostname: Cypress.env('hostname'),
        // }).as('content')


        // cy.intercept({
        //   method: 'POST',
        //   url: '/api/article/*/image-content',
        //   hostname: Cypress.env('hostname'),
        // }).as('image-content')

        // API key
        cy.get("input[data-cy=api-key-input]").type(Cypress.env('API_key'))

        // title
        cy.get("input[data-cy=title-input]").type("Created With Cypress")

        // description
        cy.get("input[data-cy=desc-input]").type("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.")

        // category
        cy.get("input[data-cy=category-input]")
          .type("a").next().click().prev().clear()
          .type("b").next().click().prev().clear()
          .type("c").next().click()
        ;

        // thumbnail
        cy.get('#thumbnail').attachFile('thumbnail1-1920x1280.jpg');

        // main content
        cy.contains('button',"Markdown Editor").click();
        // cy.get('#markdown-input').attachFile('mock-article');
        cy.uploadFolder('#markdown-input', 'mock-article');

        // post it (submit)
        // cy.contains("button","Post").click()

        // cy.wait('@article').its('response.statusCode').should('eq', 201);
        // cy.wait('@thumbnail').its('response.statusCode').should('eq', 201);
        // cy.wait('@content').its('response.statusCode').should('eq', 201);
        // cy.wait('@image-content').its('response.statusCode').should('eq', 201);
      })

      // it("should retrieve and verify the created post",()=>{

      //   cy.get("input[id=search-bar]")
      //     .wait(2000)
      //     .click().type("Created With Cypress")
      //   ;

      //   cy.get('ul[data-cy=search-container]')
      //     .children().first()

      //     .should("not.have.attr","data-cy","unavailable-element")
      //     .find('h2').should('contain.text', 'Created With Cypress')
      //   ;
      // })
    });
    
    // context("edit an article", () => {
    //   it("edit a post",()=>{
    //     cy.login();

    //     cy.intercept({
    //       method: 'PUT',
    //       url: '/api/article/*',
    //       hostname: Cypress.env('hostname'),
    //     }).as('editArticle')

    //     cy.intercept({
    //       method: 'PUT',
    //       url: '/api/article-asset/*',
    //       hostname: Cypress.env('hostname'),
    //     }).as('editArticleAsset')

    //     cy.intercept({
    //       method: 'GET',
    //       url: '/api/articles*',
    //       hostname: Cypress.env('hostname'),
    //     }).as('getArticles')

    //     cy.contains("a","profile")
    //       .invoke('removeAttr', 'target').as("profileLink")
    //       .click()
    //     ;

    //     cy.contains("button","my post").click()

    //     // matching URL 1: /[userName]
    //     cy.url({timeout:10000}).should('include', '/patrick_chen')


    //     // searching post according title
    //     cy
    //       .get("input[data-cy=search-articles]")
    //       .click().type("With Cypress")
    //       .next().click()
    //       // wait for the searched article response from server
    //       .wait('@getArticles').its('response.statusCode').should('eq', 200)
    //     ;

    //     cy
    //       .get("div[data-cy=articles-container-profile]")
    //       .children().first()
    //       .find("a[data-cy=edit-article]")
    //       .invoke('removeAttr', 'target')
    //       .click()
    //     ;


    //     // matching URL 2: [userName]/edit/post/*
    //     cy.url({ timeout: 10000 }).should('match', /\/[^/]+\/edit\/post\/.+/)

    //     // API key
    //     cy.get("input[data-cy=api-key-input]").type(Cypress.env('API_key'))

    //     // title
    //     cy.get("input[data-cy=edit-title]")
    //       .clear()
    //       .type("Edited With Cypress")
    //     ;

    //     // description
    //     cy.get("input[data-cy=edit-desc]")
    //       .clear()
    //       .type("Edited with Cypress; Edited with Cypress; Edited with Cypress;")
    //     ;

    //     // test the remove category button. Below will removing all of the categories
    //     cy.get('div[data-cy=category-container]').then(($container) => {
    //       const buttonCount = $container.children().length;
    //       for (let i = 0; i < buttonCount; i++) {
    //         // Re-query for the first button each time since the DOM changes after each click
    //         cy.get('div[data-cy=category-container]')
    //           .children().first()
    //           .find('button')
    //           .click()
    //         ;
    //       }
    //     });

    //     // category input
    //     cy.get("input[data-cy=edit-category]")
    //       .type("x").next().click().prev().clear()
    //       .type("y").next().click().prev().clear()
    //       .type("z").next().click()
    //     ;

    //     // main content input
    //     cy.get("div.ql-editor")
    //       .clear()
    //       .invoke("html",`<h2><strong>Edited from cypress</strong></h2><p><strong>Edited from cypress</strong> <em>Edited from cypress</em> <u>Edited from cypress</u> <s>Edited from cypress</s> <span style="color: rgb(230, 0, 0);">Edited from cypress</span>, <span style="color: rgb(255, 153, 0);">Edited from cypress</span> <span style="background-color: rgb(255, 255, 0);">Edited from cypress</span> Edited from cypress<sub>2</sub><sup>2</sup> do<sup>x</sup> Edited from cypress</p><p><br></p><ul><li>a</li><li>b</li><li>c</li></ul><p><br></p><ol><li>e</li><li>f</li><li>g</li></ol><p><br></p><h3><strong>Edited from cypress</strong></h3><p>Edited from cypressEdited from cypressEdited from cypress.</p><p><br></p>`)
    //       .type(
    //         "Edited from cypressEdited from cypressEdited from cypressEdited from cypressEdited from cypressEdited from cypressEdited from cypressEdited from cypressEdited from cypressEdited from cypress{enter}{enter}Edited from cypressEdited from cypressEdited from cypressEdited from cypressEdited from cypressEdited from cypressEdited from cypressEdited from cypressEdited from cypress"
    //       )
    //     ;

    //     cy.contains("button","Save").click()

    //     cy.wait('@editArticle').its('response.statusCode').should('eq', 201);
    //     cy.wait('@editArticleAsset').its('response.statusCode').should('eq', 201);
    //   })

    //   it("edit a post to unpublished",()=>{
    //     cy.login()
    //     cy.intercept({
    //       method: 'PUT',
    //       url: '/api/article/*',
    //       hostname: Cypress.env('hostname'),
    //     }).as('editArticle')

    //     cy.intercept({
    //       method: 'GET',
    //       url: '/api/articles*',
    //       hostname: Cypress.env('hostname'),
    //     }).as('getArticles')

    //     cy.contains("a","profile")
    //       .invoke('removeAttr', 'target')
    //       .click()
    //     ;


    //     cy.url({ timeout: 10000 }).should('include', `/patrick_chen`);

    //     cy.contains("button","my post").click()
    //     // searching post according title
    //     cy
    //       .get("input[data-cy=search-articles]")
    //       .click().type("With Cypress")
    //       .next().click()
    //       .wait('@getArticles').its('response.statusCode').should('eq', 200)
    //     ;

    //     cy
    //       .get("div[data-cy=articles-container-profile]")
    //       .children().first()
    //       .find("a[data-cy=edit-article]")
    //       .invoke('removeAttr', 'target')
    //       .click()
    //     ;

    //     cy.url({ timeout: 10000 }).should('match', /\/[^/]+\/edit\/post\/.+/)

    //     // API key input
    //     cy.get("input[data-cy=api-key-input]").type(Cypress.env('API_key'))

    //     // status input
    //     cy.get('select[data-cy=edit-status]').select("unpublished")

    //     cy.contains("button","Save").click()

    //     cy.wait('@editArticle').its('response.statusCode').should('eq', 201);
    //   })

    //   it("verify the edited unpublished post",()=>{
    //     cy.login()

    //     cy.intercept({
    //       method: 'GET',
    //       url: '/api/articles*',
    //       hostname: Cypress.env('hostname'),
    //     }).as('getArticles')

    //     cy.contains("a","profile")
    //       .invoke('removeAttr', 'target') 
    //       .click()
    //     ;

    //     cy.url({ timeout: 10000 }).should('include', `/patrick_chen`);

    //     cy.contains("button","my post").click()

    //     cy
    //       .get("input[data-cy=search-articles]")
    //       .click().type("With Cypress")
    //       .next().click()
    //       .wait('@getArticles').its('response.statusCode').should('eq', 200)
    //     ;

    //     cy
    //       .get("div[data-cy=articles-container-profile]")
    //       .children().first()
    //       .contains('li',"Status: unpublished")
    //     ;
    //   })

    //   it("edit a post to published",()=>{
    //     cy.login()

    //     cy.intercept({
    //       method: 'GET',
    //       url: '/api/articles*',
    //       hostname: Cypress.env('hostname'),
    //     }).as('getArticles')

    //     cy.intercept({
    //       method: 'PUT',
    //       url: '/api/article/*',
    //       hostname: Cypress.env('hostname'),
    //     }).as('editArticle')



    //     cy.contains("a","profile")
    //       .invoke('removeAttr', 'target')
    //       .click()
    //     ;
    //     cy.url({ timeout: 10000 }).should('include', `/patrick_chen`);

    //     cy.contains("button","my post").click()

    //     // searching post according title
    //     cy
    //       .get("input[data-cy=search-articles]")
    //       .click().type("With Cypress")
    //       .next().click()
    //       .wait('@getArticles').its('response.statusCode').should('eq', 200)
    //     ;

    //     cy
    //       .get("div[data-cy=articles-container-profile]")
    //       .children().first()
    //       .find("a[data-cy=edit-article]")
    //       .invoke('removeAttr', 'target')
    //       .click()
    //     ;

    //     cy.url({ timeout: 10000 }).should('match', /\/[^/]+\/edit\/post\/.+/)

    //     // API key input
    //     cy.get("input[data-cy=api-key-input]").type(Cypress.env('API_key'))

    //     // status input
    //     cy.get('select[data-cy=edit-status]').select("published")

    //     cy.contains("button","Save").click()

    //     cy.wait('@editArticle').its('response.statusCode').should('eq', 201);
        
    //   })

    //   it("verify the edited published post",()=>{
    //     cy.get("input[id=search-bar]")
    //       .click().wait(waitDOM).type("With Cypress")
    //     ;
        
    //     cy.get('ul[data-cy=search-container]')
    //       .children().first()
    //       .should("not.have.attr","data-cy","unavailable-element")
    //       .find('h2').should('contain.text', 'With Cypress')
    //     ;
    //   })
    // });
    
    // context("delete an article", () => {
    //   it("should delete",()=>{
    //     cy.login()

    //     cy.intercept({
    //       method: 'DELETE',
    //       url: '/api/article/*',
    //       hostname: Cypress.env('hostname'),
    //     }).as('deleteArticle')

    //     cy.intercept({
    //       method: 'GET',
    //       url: '/api/articles*',
    //       hostname: Cypress.env('hostname'),
    //     }).as('getArticles')

    //     cy.intercept({
    //       method: 'PUT',
    //       url: '/api/article/*',
    //       hostname: Cypress.env('hostname'),
    //     }).as('editArticle')
        
    //     cy.contains("a","profile")
    //       .invoke('removeAttr', 'target') 
    //       .click()
    //     ;
    //     cy.url({ timeout: 10000 }).should('include', `/patrick_chen`);

    //     cy.contains("button","my post").click()

    //     cy
    //       .get("input[data-cy=search-articles]")
    //       .click().type("With Cypress")
    //       .next().click()
    //       .wait('@getArticles').its('response.statusCode').should('eq', 200)
    //     ;

    //     cy
    //       .get("div[data-cy=articles-container-profile]")
    //       .children().first()
    //       .find("button[data-cy=delete-article]").click()
    //     ;

    //     cy.wait('@deleteArticle').its('response.statusCode').should('eq', 204);
    //   })
      
    //   it("check deletion result", ()=>{

    //     cy.get("input[id=search-bar]")
    //       .click().wait(waitDOM).type("With Cypress")
    //     ;
        
    //     cy.get('ul[data-cy=search-container]')
    //       .children().first()
    //       .should("have.attr","data-cy","unavailable-element")
    //     ;
    //   })
    // });

    // context("like/dislike an article", () => {

    // })
  })

})