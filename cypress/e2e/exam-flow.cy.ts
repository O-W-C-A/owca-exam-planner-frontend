describe('Exam flow', () => {
   //login with john.doe@student.usm.ro hashedpassword3
   
    it('Failed suggest exam', () => {
        cy.visit('/login');
        cy.get('input[type="email"]').type('john.doe@student.usm.ro');
        cy.get('input[type="password"]').type('hashedpassword3');
        cy.get('button').contains('Submit').click();

        // Verificăm că suntem pe pagina calendarului
        cy.url().should('include', '/calendar');

        // Găsim ziua cu textul "23" și dăm click
        cy.get('.rbc-day-bg') // Selectăm toate elementele "rbc-day-bg"
              .eq(22)           // Întrucât calendarul începe de obicei de la 1, folosim indexul 22 (indexul e zero-based)
              .click();

        //cauda dupa id = "course"
        cy.get('select[id="course"]').should('exist');

        // Introducem o dată (dacă este nevoie)
        cy.get('input[type="date"]').clear().type('2025-01-21');

        // Adăugăm detalii suplimentare
        cy.get('textarea').type('Acesta este un test automat.');

        // Apăsăm butonul Submit
        cy.get('button').contains('Submit').click();

        //Please select a course
        cy.contains('Please select a course').should('be.visible');
    });
   
});



