describe('Verificare funcționalitate navigare lunară în calendar', () => {
    it('Ar trebui să navigheze corect prin lunile calendarului', () => {
        // Accesăm aplicația
        cy.visit('/login');

        // Introducem datele de logare
        cy.get('input[name="email"]').type('john.doe@student.usm.ro');
        cy.get('input[name="password"]').type('hashedpassword3');
        cy.get('button[type="submit"]').click();

        // Verificăm că suntem pe pagina calendarului
        cy.url().should('include', '/calendar');

        // Verificăm că luna curentă este afișată (ianuarie 2025)
        cy.contains('January 2025').should('be.visible');

        // Navigăm la luna următoare (februarie 2025)
        cy.get('button').contains('Next').click();
        cy.contains('February 2025').should('be.visible');

        // Navigăm la luna precedentă (ianuarie 2025)
        cy.get('button').contains('Previous').click();
        cy.contains('January 2025').should('be.visible');

        // Navigăm înapoi la decembrie 2024
        cy.get('button').contains('Previous').click();
        cy.contains('December 2024').should('be.visible');

        // Navigăm înainte până la martie 2025
        cy.get('button').contains('Next').click();
        cy.get('button').contains('Next').click();
        cy.contains('February 2025').should('be.visible');
    });
});
