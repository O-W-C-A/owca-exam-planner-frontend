const users = [
  // Profesori
  { email: 'alice.johnson@usm.ro', password: 'hashedpassword1', role: 'professor', firstName: 'Alice', lastName: 'Johnson' },
  { email: 'bob.williams@usm.ro', password: 'hashedpassword2', role: 'professor', firstName: 'Bob', lastName: 'Williams' },
  
  // Studenți din grupa 3141
  { email: 'john.doe@student.usm.ro', password: 'hashedpassword3', role: 'student', firstName: 'John', lastName: 'Doe', group: 3141 },
  { email: 'jane.smith@student.usm.ro', password: 'hashedpassword4', role: 'student', firstName: 'Jane', lastName: 'Smith', group: 3141 },
  { email: 'alex.popescu@student.usm.ro', password: 'hashedpassword5', role: 'student', firstName: 'Alex', lastName: 'Popescu', group: 3141 },
  { email: 'emily.white@student.usm.ro', password: 'hashedpassword6', role: 'student', firstName: 'Emily', lastName: 'White', group: 3141 },
  { email: 'rares.vasilescu@student.usm.ro', password: 'hashedpassword7', role: 'student', firstName: 'Rares', lastName: 'Vasilescu', group: 3141 },
  
  // Studenți din grupa 3142
  { email: 'andrei.ionescu@student.usm.ro', password: 'hashedpassword8', role: 'student', firstName: 'Andrei', lastName: 'Ionescu', group: 3142 },
  { email: 'maria.dumitrescu@student.usm.ro', password: 'hashedpassword9', role: 'student', firstName: 'Maria', lastName: 'Dumitrescu', group: 3142 },
  { email: 'mihai.stanescu@student.usm.ro', password: 'hashedpassword10', role: 'student', firstName: 'Mihai', lastName: 'Stanescu', group: 3142 },
  { email: 'elena.georgescu@student.usm.ro', password: 'hashedpassword11', role: 'student', firstName: 'Elena', lastName: 'Georgescu', group: 3142 },
  { email: 'ana.munteanu@student.usm.ro', password: 'hashedpassword12', role: 'student', firstName: 'Ana', lastName: 'Munteanu', group: 3142 },
  
];

describe('Login Page Tests', () => {
  beforeEach(() => {
      // Navigăm la pagina de login înainte de fiecare test
      cy.visit('/login');
  });

  it('should display the login form', () => {
      // Verificăm prezența elementelor din formularul de login
      cy.contains('Login to Your Account').should('be.visible');
      cy.get('input[type="email"]').should('exist');
      cy.get('input[type="password"]').should('exist');
      cy.get('button').contains('Submit').should('exist');
  });

  it('should show an error for incorrect credentials', () => {
      // Introducem email și parolă incorecte
      cy.get('input[type="email"]').type('wrong.email@usm.ro');
      cy.get('input[type="password"]').type('wrongpassword');
      cy.get('button').contains('Submit').click();

      // ar trebui sa stea pe ruta : /login
      cy.url().should('include', '/login');
     
  });


users.forEach(user => {
    it(`should allow ${user.role} (${user.email}) to log in successfully`, () => {
        // Navigăm la pagina de login
        cy.visit('/login'); 

        // Introducem credențialele utilizatorului
        cy.get('input[type="email"]').type(user.email);
        cy.get('input[type="password"]').type(user.password);
        cy.get('button').contains('Submit').click();

        // Verificăm dacă login-ul a reușit
        cy.url().should('not.include', '/login');

        cy.url().should('include', '/dashboard');

        cy.url().should('include', user.role);

        //should be visible the name
        cy.contains(user.firstName).should('be.visible');

        //should be visible the name
        cy.contains(user.lastName).should('be.visible');
    });

    it(`should show an error for ${user.role} (${user.email}) with incorrect password`, () => {
        // Navigăm la pagina de login
        cy.visit('/login');

        // Introducem email corect, dar parolă greșită
        cy.get('input[type="email"]').type(user.email);
        cy.get('input[type="password"]').type('wrongpassword');
        cy.get('button').contains('Submit').click();

        //wait for 1 second
        cy.wait(1000);

        

        // Verificăm mesajul de eroare
        cy.url().should('include', '/login');

    });
});
});
