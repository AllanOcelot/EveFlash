import InfoModal from './InfoModal.vue'

describe('<InfoModal />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(InfoModal)
  })
})