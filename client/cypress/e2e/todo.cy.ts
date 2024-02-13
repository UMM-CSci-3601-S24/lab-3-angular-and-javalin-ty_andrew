import { TodoListPage } from "cypress/support/todo-list.po";

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

  it('should filter todos by owner', () => {
    const ownerFilter = 'Fry';
    page.getTodoTitle().should('be.visible');
    page.getTodoListItems().should('have.length.greaterThan', 0);
    cy.get('[data-test=todoOwnerInput]').type(ownerFilter);
    cy.get('.todo-list-item .todo-list-name').each(($name) => {
      cy.wrap($name).should('include.text', ownerFilter);
    });
  });

  it('should filter todos by category', () => {
    const categoryFilter = 'Video Games';
    page.getTodoTitle().should('be.visible');
    page.getTodoListItems().should('have.length.greaterThan', 0);
    cy.get('[data-test=todoCategorySelect]').click();
    cy.get('mat-option').contains(categoryFilter).click()
    cy.get('.todo-list-item .todo-list-category').each(($category) => {
      cy.wrap($category).should('include.text', 'video games');
    });
  });

  it('should filter todos by status', () => {
    const statusFilter = 'Complete';
    page.getTodoTitle().should('be.visible');
    page.getTodoListItems().should('have.length.greaterThan', 0);
    cy.get('[data-test=todoStatusSelect]').click();
    cy.get('mat-option').contains(statusFilter).click()
    cy.get('.todo-list-item .todo-list-status').each(($status) => {
      cy.wrap($status).should('include.text', 'Complete');
    });
  });

  it('should filter todos by status', () => {
    const statusFilter = 'Incomplete';
    page.getTodoTitle().should('be.visible');
    page.getTodoListItems().should('have.length.greaterThan', 0);
    cy.get('[data-test=todoStatusSelect]').click();
    cy.get('mat-option').contains(statusFilter).click()
    cy.get('.todo-list-item .todo-list-status').each(($status) => {
      cy.wrap($status).should('include.text', 'Incomplete');
    });
  });
})
