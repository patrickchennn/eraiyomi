describe('eraiyomi', () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })
  
  beforeEach(() => {
    cy.visit(Cypress.env('url'))
  })
  
  context("Register user account", () => {
    it("Register: bad username" , () => {
      cy.intercept({
        method: 'POST',
        url: '/api/user*',
        hostname: Cypress.env('API_hostname'),
      }).as('register')

      // https://stackoverflow.com/questions/51254946/cypress-does-not-always-executes-click-on-element
      cy.get("button")
        .contains('button',"Sign In")
        .wait(2000)
        .click()
      ;

      cy.get("div[data-cy='authentication-modal']").should('be.visible')

      cy.contains('button',"Sign In")
        .wait(2000)
        .click()
        .next().should('be.visible')
      ;

      cy.contains('button',"Sign Up")
        .wait(2000)
        .click()
      ;

      cy.get("#register-uName").type('faker asdf zxcv')
      cy.get("#register-name").type('faker')
      cy.get("#register-email").type('faker@mail.com')
      cy.get("#register-pass").type('123')
      cy.get("#register-key").type(Cypress.env('API_key'))

      cy.contains('button[type="submit"]',"Sign Up")
        .click()
      ;  

      // // Wait for the intercepted login request to complete
      cy.wait('@register').then((xhr) => {
        console.log("xhr=",xhr)
        expect(xhr.response?.statusCode).to.eq(400);
      })
    });

    it("Register: existed user" , () => {
      cy.intercept({
        method: 'POST',
        url: '/api/user*',
        hostname: Cypress.env('API_hostname'),
      }).as('register')

      cy.get("button")
        .contains('button',"Sign In")
        .wait(2000)
        .click({force:true})
      ;

      cy.get("div[data-cy='authentication-modal']").should('be.visible')

      cy.contains('button',"Sign Up")
        .wait(2000)
        .click()
      ;

      cy.get("#register-uName").type(Cypress.env("u_name"))
      cy.get("#register-name").type('faker')
      cy.get("#register-email").type(Cypress.env("email"))
      cy.get("#register-pass").type('123')
      cy.get("#register-key").type(Cypress.env('API_key'))

      cy.contains('button[type="submit"]',"Sign Up")
        .click()
      ;  

      // Wait for the intercepted login request to complete
      cy.wait('@register').then((xhr) => {
        expect(xhr.response?.statusCode).to.eq(400);
      })
    });

    it("Register: successful" , () => {
      cy.intercept({
        method: 'POST',
        url: '/api/user*',
        hostname: Cypress.env('API_hostname'),
      }).as('register')


      cy.contains('button',"Sign In")
        .wait(2000)
        .click()
        .next().should('be.visible')
      ;

      cy.contains('button',"Sign Up")
        .wait(2000)
        .click()
      ;

      cy.get("#register-uName").type('Cypress')
      cy.get("#register-name").type('Register From Cypress')
      cy.get("#register-email").type('cypress@mail.com')
      cy.get("#register-pass").type('123')
      cy.get("#register-key").type(Cypress.env('API_key'))

      cy.contains('button[type="submit"]',"Sign Up")
        .click()
      ;  

      // Wait for the intercepted login request to complete
      cy.wait('@register').then((xhr) => {
        expect(xhr.response?.statusCode).to.eq(201);
      })
    });
  })

  context("Login user account", () => {
    it('With unexisting user', () => {
      cy.intercept({
        method: 'POST',
        url: '/api/user/login-traditional',
        hostname: Cypress.env('API_hostname'),
      }).as('loginTraditional')

      cy.contains('button',"Sign In",{timeout:2000}).click();

      cy.get("div[data-cy='authentication-modal']").should('be.visible')


      cy.get("#login-uName-or-email").type('fake@email.com')

      cy.get("#login-pass").type('123456')

      cy.contains('button[type="submit"]',"Sign In").click();  

      // Wait for the intercepted login request to complete
      cy.wait('@loginTraditional').then((xhr) => {
        expect(xhr.response?.statusCode).to.eq(401);
      });
    });


    it('With incorrect password', () => {
      cy.intercept({
        method: 'POST',
        url: '/api/user/login-traditional',
        hostname: Cypress.env('API_hostname'),
      }).as('loginTraditional')


      cy.contains('button',"Sign In",{timeout:2000}).click();

      cy.get("div[data-cy='authentication-modal']").should('be.visible')

      cy.get("#login-uName-or-email").type('patrick_chen')

      cy.get("#login-pass").type('123456')

      cy.contains('button[type="submit"]',"Sign In").click();  

      // Wait for the intercepted login request to complete
      cy.wait('@loginTraditional').then((xhr) => {
        expect(xhr.response?.statusCode).to.eq(401);
      });
    })

    it('With existing user', () => {
      cy.intercept({
        method: 'POST',
        url: '/api/user/login-traditional',
        hostname: Cypress.env('API_hostname'),
      }).as('loginTraditional')

      cy.contains('button',"Sign In",{timeout:2000}).click();

      cy.get("div[data-cy='authentication-modal']").should('be.visible')

      cy.get("#login-uName-or-email").type(Cypress.env('u_name'))

      cy.get("#login-pass").type(Cypress.env('password'))

      cy.contains('button[type="submit"]',"Sign In").click();  

      cy.wait('@loginTraditional').then((xhr) => {
        expect(xhr.response?.statusCode).to.eq(200);
      });
    });
  })
})