function setupMocks() {
  cy.server()
  cy.route('/api/kayttaja', 'fixture:kayttaja.json')
  cy.route('/api/erikoistuva-laakari', 'fixture:erikoistuva-laakari.json')
  cy.route(
    '/api/erikoistuva-laakari/oppimistavoitteet-taulukko',
    'fixture:erikoistuva-laakari/oppimistavoitteet-taulukko.json'
  )
  cy.route(
    '/api/erikoistuva-laakari/suoritemerkinta-lomake',
    'fixture:erikoistuva-laakari/suoritemerkinta-lomake.json'
  )
  cy.route(
    'POST',
    '/api/erikoistuva-laakari/suoritemerkinnat',
    'fixture:erikoistuva-laakari/suoritemerkinnat.json'
  )
  cy.route(
    '/api/erikoistuva-laakari/suoritemerkinnat/1451',
    'fixture:erikoistuva-laakari/suoritemerkinnat/1451.json'
  )
  cy.route(
    'PUT',
    '/api/erikoistuva-laakari/suoritemerkinnat',
    'fixture:erikoistuva-laakari/suoritemerkinnat/1451.json'
  )
  cy.route('DELETE', '/api/erikoistuva-laakari/suoritemerkinnat/1451', {})
}

describe('Suoritemerkinnät', () => {
  it('Navigoidaan suoritusmerkinnät näkymään', () => {
    setupMocks()
    cy.visit('/')
    cy.get('.nav > :nth-child(5) > .nav-link').click()
    cy.get('.nav > :nth-child(6) > :nth-child(3) > .nav-link').contains('Suoritemerkinnät').click()
  })

  it('Näkymästä löytyvät oleelliset elementit', () => {
    setupMocks()
    cy.visit('suoritemerkinnat')
    cy.contains('h1', 'Suoritemerkinnät')
    cy.contains('a', 'Lisää suoritemerkintä')
    cy.contains('Suorite: Oppimistavoitteen kategoria 1')
    cy.contains('Oppimistavoite 1')
    cy.contains('Oppimistavoite 2')
    cy.contains('4 Toiminta ilman ohjausta')
    cy.contains('.btn', '29.11.2020')
    cy.contains('Oppimistavoite 3')
    cy.contains('Suorite: Oppimistavoitteen kategoria 2')
    cy.contains('Oppimistavoite 4')
    cy.contains('.btn', '26.11.2020')
    cy.contains('5 Toiminta ohjaajana')
    cy.contains('Oppimistavoite 5')
  })

  it('Navigoidaan uuden suoritemerkinnän lisäämiseen', () => {
    setupMocks()
    cy.get('a').contains('Lisää suoritemerkintä')
  })
})

describe('Uuden suoritemerkinnän lisäys', () => {
  it('Navigoidaan uuden suoritemerkinnän näkymään', () => {
    setupMocks()
    cy.visit('suoritemerkinnat/uusi')
    cy.contains('h1', 'Lisää suoritemerkintä')
    cy.contains('Työskentelyjakso')
    cy.contains('Lisää työskentelyjakso')
    cy.contains('Oppimistavoite')
    cy.contains('Vaativuustaso')
    cy.contains('Suorituspäivä')
    cy.contains('Lisätiedot')
    cy.contains('a', 'Peruuta')
    cy.contains('button', 'Tallenna')
  })

  it('Tallennetaan tyhjä suoritemerkintä', () => {
    setupMocks()
    cy.get('button').contains('Tallenna').click()
    cy.get('.invalid-feedback').contains('Pakollinen tieto')
  })

  it('Uuden suoritemerkinnän lisääminen', () => {
    setupMocks()
    cy.get('label').contains('Työskentelyjakso').click().type('{enter}')
    cy.get('label').contains('Suorite').click().type('{downarrow}').type('{enter}')
    cy.get('label').contains('Vaativuustaso').click().type('{enter}')
    cy.get('span').contains('Valitse').click()
    cy.get('span').contains('5 Toiminta ohjaajana').click()
    cy.get('label').contains('Suorituspäivä').click().get('.btn').contains('16').click()
    cy.get('label').contains('Lisätiedot').click().type('Lorem ipsum...')
    cy.get('button').contains('Tallenna').click()
  })
})

describe('Suoritemerkinnän esittäminen', () => {
  it('Uuden tallennetun suoritemerkinnän tarkistelu', () => {
    setupMocks()
    cy.visit('suoritemerkinnat/1451')
    cy.contains('h1', 'Suoritemerkintä')
    cy.contains('b (23.11.2020-29.11.2020)')
    cy.contains('Oppimistavoite 2')
    cy.contains('.badge', '1')
    cy.contains('5 Toiminta ohjaajana')
    cy.contains('24.11.2020')
    cy.contains('Lorem ipsum...')
    cy.get('button').contains('Poista merkintä')
    cy.get('a').contains('Muokkaa merkintää')
  })
})

describe('Suoritemerkinnän muokkaaminen', () => {
  it('Navigoidaan muokkausnäkymään', () => {
    setupMocks()
    cy.visit('suoritemerkinnat/1451')
    cy.wait(1000)
    cy.get('a').contains('Muokkaa merkintää').click()
    cy.contains('h1', 'Muokkaa suoritemerkintää')
  })

  it('Muokkausnäkymä sisältää nykyiset tiedot', () => {
    setupMocks()
    cy.contains('b (23.11.2020-29.11.2020)')
    cy.contains('Oppimistavoite 2')
    cy.contains('1 Helppo')
    cy.contains('5 Toiminta ohjaajana')
    cy.contains('24.11.2020')
    cy.get('a').contains('Peruuta')
    cy.get('button').contains('Poista merkintä')
    cy.get('button').contains('Tallenna').click()
    cy.contains('h1', 'Suoritemerkintä')
  })

  it('Poistetaan suoritemerkintä muokkauksessa', () => {
    setupMocks()
    cy.get('button').contains('Poista merkintä').click()
    cy.get('.modal-footer').find('button').contains('Poista').click()
    cy.contains('h1', 'Suoritemerkinnät')
  })
})
