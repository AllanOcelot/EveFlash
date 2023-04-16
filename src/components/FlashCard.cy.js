import FlashCard from './FlashCard.vue'

describe('<FlashCard />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(FlashCard)
  })
})