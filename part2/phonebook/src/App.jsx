import { useState } from 'react'

const Filter = ({ filter, setNewFilter }) => {
  return (
    <form>
      <div>
        filter shown with <input value={filter} onChange={(event) => { setNewFilter(event.target.value) }} />
      </div>
    </form>
  )

}

const NewPersonForm = ({ addToPhoneBook, newName, newPhoneNumber, setNewName, setNewPhoneNumber }) => {
  return (
    <form onSubmit={addToPhoneBook}>
      <div>
        name:
        <input value={newName} onChange={(event) => { setNewName(event.target.value) }} />
      </div>
      <div>
        number:
        <input value={newPhoneNumber} onChange={(event) => { setNewPhoneNumber(event.target.value) }} />
      </div>
      <div>
        <button type="submit" >add</button>
      </div>
    </form>
  )
}

const Persons = ({ filterPersons }) => {
  return (
    <ol>
      {filterPersons.map(person => <Person key={person.id} person={person} />)}
    </ol>
  )

}

const Person = ({ person }) => {
  return (<li>{person.name} {person.phoneNumber}</li>)
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', phoneNumber: '39-44-5556', id: 1 }
  ])
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [filter, setNewFilter] = useState('')

  const addToPhoneBook = (event) => {
    event.preventDefault()
    if (persons.map(person => person.name).includes(newName)) {
      window.alert(`This name (${newName}) has already been added to the Phone Book`)
    }
    const newPerson = {
      name: newName,
      phoneNumber: newPhoneNumber,
      id: persons.length + 1
    }
    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewPhoneNumber('')

  }

  const filterPersons = persons.filter(persons => persons.name.toLowerCase().startsWith(filter))



  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setNewFilter={setNewFilter} />
      <h3>add a new person</h3>
      <NewPersonForm addToPhoneBook={addToPhoneBook} newName={newName} newPhoneNumber={newPhoneNumber} setNewName={setNewName} setNewPhoneNumber={setNewPhoneNumber} />
      <h2>Numbers</h2>
      <Persons filterPersons={filterPersons} />
    </div>
  )
}

export default App
