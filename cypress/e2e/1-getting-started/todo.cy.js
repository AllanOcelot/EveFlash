/// <reference types="cypress" />

describe('example to-do app', () => {
  beforeEach(() => {
    // Visit our local copy of Eveflash.
    cy.visit('http://localhost:3000')
  })

  it('Checks to see if a FlashCard is displayed when visiting the site', () => {
    cy.get('.flashcard').should('have.length', 1)
  })
})
