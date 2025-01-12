describe('Testare Formular de Login', () => {
  beforeEach(() => {
    cy.visit('/login'); 
  });

  it('Autentificare pentru Student - john.doe@student.usm.ro', () => {
    cy.get('input[name="email"]').type('john.doe@student.usm.ro');
    cy.get('input[name="password"]').type('hashedpassword3');
    cy.get('button').contains('Submit').click();
    
    cy.url().should('include', '/dashboard');
    cy.wait(1000);

    cy.document().then((doc) => {
      const element1 = doc.querySelector(':nth-child(6) > .rbc-row-content > :nth-child(2) > [style="flex-basis: 14.2857%; max-width: 14.2857%;"] > .rbc-event > .rbc-event-content');
      if (element1) {
        cy.wrap(element1).invoke('hide');
      } else {
        cy.log('Elementul 1 nu există. Continuăm testul.');
      }
    
      const element2 = doc.querySelector(':nth-child(3) > [style="flex-basis: 14.2857%; max-width: 14.2857%;"] > .rbc-event > .rbc-event-content');
      if (element2) {
        cy.wrap(element2).invoke('hide');
      } else {
        cy.log('Elementul 2 nu există. Continuăm testul.');
      }
    });
    cy.get(':nth-child(6) > .rbc-row-bg > :nth-child(4)').click({force: true})
    cy.wait(3000);
    cy.get('#details').type('Examenul dorim sa fie de dimineata');
    cy.get('#course').select(1);
    cy.get('.space-y-4 > .flex > .bg-blue-500').click();
    cy.wait(3000);
    cy.get(':nth-child(6) > .rbc-row-content > :nth-child(2) > [style="flex-basis: 14.2857%; max-width: 14.2857%;"] > .rbc-event > .rbc-event-content').click();
    cy.wait(3000);
    cy.get('.bg-gray-500').click();
    cy.wait(3000);
    cy.get('button').contains('Logout').click();
    cy.get('button').contains('Yes').click();
    cy.wait(1000);
    cy.get('input[name="email"]').type('alice.johnson@usm.ro');
    cy.get('input[name="password"]').type('hashedpassword1');
    cy.get('button').contains('Submit').click();

    // Verificare dashboard pentru Profesor
    cy.url().should('include', '/dashboard');
    cy.wait(1000);

    cy.get('.text-gray-500').click();
    cy.get(':nth-child(1) > .justify-end > .bg-green-500').click();
    cy.get('#timeStart').type('12:00');
    cy.get('#timeEnd').type('13:00');
    cy.wait(1000);
    cy.get('#rooms') // Deschide dropdown-ul
  .click()
  .type('C105'); // Introduce textul pentru a căuta o opțiune

cy.contains('C105 (C)') // Selectează opțiunea care apare
  .click(); // Selectează opțiunea dorită

  
    cy.get('#notes').type('Aprobat');
    cy.get('.fixed > .bg-white > .flex > .bg-green-500').click();

    cy.wait(3000);
    cy.get('button').contains('Logout').click();
    cy.get('button').contains('Yes').click();

    cy.get('input[name="email"]').type('john.doe@student.usm.ro');
    cy.get('input[name="password"]').type('hashedpassword3');
    cy.get('button').contains('Submit').click();
    
    cy.url().should('include', '/dashboard');
    cy.wait(1000);
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
