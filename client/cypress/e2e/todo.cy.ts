import { TodoListPage } from '../support/todo-list.po';

const page = new TodoListPage();

describe('Todo List', () => {

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct page title', () => {
    page.getPageTitle().should('eq', 'Todos');
  });

  it('Should have the correct title', () => {
    page.getTodoTitle().should('have.text', 'Todos');
  });

  it('Should have something in the owner filter and check that it return correct elements', () => {
    cy.get('[data-test=todoOwnerInput]').type('Fry');
    page.getTodoCards().each($card => {
      cy.wrap($card).find('.todo-card-name').should('have.text', 'Fry');
    });

    page.getTodoCards().find('todo-card-name').each($owner =>
      expect($owner.text()).to.equal('Fry')
    );
  });

  it('Should type something in the category filter and check that it return correct element', () => {
    cy.get('[data-test=todoCategoryInput]').type('video games');
    page.getTodoCards().should('have.lengthOf.above', 0); //what does this line do
    page.getTodoCards().find('.user-card-company').each($card => {
      cy.wrap($card).should('have.text', 'video games');
    });
  });



})
