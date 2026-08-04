import { useState } from 'react'
import { useEffect } from 'react'

import axios from 'axios'
import personService from './services/persons'

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


const Persons = ({ persons, setLastDeleted }) => {
    return (
        <ol>
            {persons.map(person => <Person key={person.id} person={person} setLastDeleted={setLastDeleted} />)}
        </ol>
    )

}

const Person = ({ person, setLastDeleted }) => {
    const deletePerson = (setLastDeleted, person) => {
        if (window.confirm(`Are you sure you want to delete '${person.name}'`)) {

            personService._delete(person.id).then(deletedPerson => setLastDeleted(deletedPerson))
        }


    }


    return (
        <>
            <li>
                {person.name} {person.number}
            </li>
            <button onClick={() => deletePerson(setLastDeleted, person)}>
                delete
            </button>
        </>)
}


const App = () => {


    const [newName, setNewName] = useState('')
    const [persons, setPersons] = useState([])
    const [newPhoneNumber, setNewPhoneNumber] = useState('')
    const [filter, setNewFilter] = useState('')
    const [deletedPerson, setLastDeleted] = useState('')
    useEffect(() => {
        personService.getAll().then(allPersons => {
            setPersons(allPersons)
        })
    }, [deletedPerson])


    const addToPhoneBook = (event) => {
        event.preventDefault()
        const newPerson = {
            name: newName.trim(),
            number: newPhoneNumber.trim(),
            id: persons.length + 1
        }
        if (persons.map(person => person.name).includes(newPerson.name)) {

            if (window.confirm(`'${newPerson.name}' already exists in the phone book. Do you want to update the number?`)) {
                const existingPersonId = persons.find(person => person.name === newPerson.name).id
                personService.update(existingPersonId, newPerson).then
                    (newPerson => setPersons(persons.map(person => person.id === newPerson.id ? { ...newPerson, id: existingPersonId } : person)))
            }
            setNewName('')
            setNewPhoneNumber('')

        }
        else {
            personService.create(newPerson).then(person => {
                setPersons(persons.concat(person))
            }

            )
            setNewName('')
            setNewPhoneNumber('')

        }

    }

    const filterPersons = persons.filter(person => person.name.toLowerCase().startsWith(filter.trim()))
    return (
        <div>
            <h2>Phonebook</h2>
            <Filter filter={filter} setNewFilter={setNewFilter} />
            <h3>add a new person</h3>
            <NewPersonForm addToPhoneBook={addToPhoneBook} newName={newName} newPhoneNumber={newPhoneNumber} setNewName={setNewName} setNewPhoneNumber={setNewPhoneNumber} />
            <h2>Numbers</h2>
            <Persons persons={filterPersons} setLastDeleted={setLastDeleted} />
        </div>
    )
}

export default App
