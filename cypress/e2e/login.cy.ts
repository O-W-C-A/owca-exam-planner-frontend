describe('Testare Formular de Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('Autentificare pentru Student', () => {
    cy.get('input[name="email"]').type('jane.smith@student.usm.ro');
    cy.get('input[name="password"]').type('hashedpassword4');
    cy.get('button').contains('Submit').click();

    cy.url().should('include', '/dashboard');
    cy.wait(1000)
    cy.get('button').contains('Logout').click();
    cy.get('button').contains('Yes').click();

    //   cy.contains('Welcome, John Doe').should('be.visible');
  });

  // it('Autentificare reușită pentru Profesor - Professors1@university.edu', () => {
  //   cy.get('input[name="email"]').type('Professors1@university.edu');
  //   cy.get('input[name="password"]').type('hashedpassword3');
  //   cy.get('button').contains('Submit').click();

  //   cy.url().should('include', '/dashboard');
  // //   cy.contains('Welcome, Alice Johnson').should('be.visible');
  // });

  // it('Autentificare reușită pentru Admin - admin@university.edu', () => {
  //   cy.get('input[name="email"]').type('admin@university.edu');
  //   cy.get('input[name="password"]').type('hashedpassword5');
  //   cy.get('button').contains('Submit').click();

  //   cy.url().should('include', '/admin-dashboard');
  // //   cy.contains('Welcome, Admin Adminson').should('be.visible');
  // });

  // // Test negativ - credențiale greșite
  // it('Autentificare eșuată cu credențiale greșite', () => {
  //   cy.get('input[name="email"]').type('Students1@university.edu');
  //   cy.get('input[name="password"]').type('wrongpassword');
  //   cy.get('button').contains('Submit').click();

  //   cy.contains('Invalid email or password').should('be.visible');
  // });
});
