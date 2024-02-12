import { TodoListPage } from '../support/todo-list.po';

const page = new TodoListPage();

describe('User list', () => {

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct page title', () => {
    page.getPageTitle().should('eq', 'Todos');
  });

  it('Should have the correct title', () => {
    page.getTodoTitle().should('have.text', 'Todos');
  });

  it('Should type something in the name filter and check that it returned correct elements', () => {
    // Filter for user 'Lynn Ferguson'
    cy.get('[data-test=todoOwnerInput]').type('Blanche');

    // All of the user cards should have the name we are filtering by
    page.getTodoCards().each($card => {
      cy.wrap($card).find('.todo-card-owner').should('have.text', 'Blanche');
    });

    // (We check this two ways to show multiple ways to check this)
    page.getTodoCards().find('.todo-card-owner').each($owner =>
      expect($owner.text()).to.equal('Blanche')
    );
  });

  it('Should type something in the company filter and check that it returned correct elements', () => {
    // Filter for company 'OHMNET'
    cy.get('[data-test=todoBodyInput]').type('Ipsum esse est ullamco magna tempor anim laborum non officia deserunt veniam commodo. Aute minim incididunt ex commodo.');

    page.getTodoCards().should('have.lengthOf.above', 0);

    // All of the user cards should have the company we are filtering by
    page.getTodoCards().find('.todo-card-body').each($card => {
      cy.wrap($card).should('have.text', 'Ipsum esse est ullamco magna tempor anim laborum non officia deserunt veniam commodo. Aute minim incididunt ex commodo.');
    });
  });

  it('Should type something partial in the company filter and check that it returned correct elements', () => {
    // Filter for companies that contain 'ti'
    cy.get('[data-test=todoBodyInput]').type('sit');

    page.getTodoCards().should('have.lengthOf', 3);

    // Each user card's company name should include the text we are filtering by
    page.getTodoCards().each(e => {
      cy.wrap(e).find('.todo-card-body').should('include.text', 'sit');
    });
  });

  it('Should type something in the age filter and check that it returned correct elements', () => {
    // Filter for users of age '27'
    cy.get('[data-test=todoStatusInput]').type('true');

    page.getTodoCards().should('have.lengthOf', 4);
  });

  it('Should change the view', () => {
    // Choose the view type "List"
    page.changeView('list');

    // We should not see any cards
    // There should be list items
    page.getTodoCards().should('not.exist');
    page.getTodoListItems().should('exist');

    // Choose the view type "Card"
    page.changeView('card');

    // There should be cards
    // We should not see any list items
    page.getTodoCards().should('exist');
    page.getTodoListItems().should('not.exist');
  });

  it('Should click view profile on a user and go to the right URL', () => {
    page.getTodoCards().first().then((card) => {
      const firstTodoOwner = card.find('.todo-card-name').text();
      const firstTodoBody = card.find('.todo-card-company').text();

      // When the view profile button on the first user card is clicked, the URL should have a valid mongo ID
      page.clickViewProfile(page.getTodoCards().first());

      // The URL should contain '/users/' (note the ending slash) and '/users/' should be followed by a mongo ID
      cy.url()
        .should('contain', '/todos/')
        .should('match', /.*\/todos\/[0-9a-fA-F]{24}$/);

      // On this profile page we were sent to, the name and company should be correct
      cy.get('.todo-card-owner').first().should('have.text', firstTodoOwner);
      cy.get('.todo-card-body').first().should('have.text', firstTodoBody);
    });
   });

});
