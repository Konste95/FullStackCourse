import { useState } from 'react'
import { useEffect } from 'react'

import Notification from './components/Notification'
import personService from './services/persons'

import './index.css'

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

            personService
                ._delete(person.id)
                .then(deletedPerson => setLastDeleted(deletedPerson))
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
    const [notifMessage, setNotifMessage] = useState('')
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
                    (newPerson => {
                        setPersons(persons.map(person => person.id === newPerson.id ? { ...newPerson, id: existingPersonId } : person))
                        setNotifMessage(`success: Changed "${newPerson.name}"'s number.`)
                        setTimeout(() => {
                            setNotifMessage(null)
                        }, 2000)
                    })

                    .catch((error) => {
                        setNotifMessage(`error: Information of "${newPerson.name}" has already been removed from the server.`)
                        setTimeout(() => {
                            setNotifMessage(null)
                        }, 2000)

                    })



            }
            setNewName('')
            setNewPhoneNumber('')

        }
        else {


            personService.create(newPerson).then(person => {
                setNotifMessage(`success: Added "${newPerson.name}"'s number.`)

                setTimeout(() => {
                    setNotifMessage(null)
                }, 2000)

                setPersons(persons.concat(person))

            }

            )
            setNewName('')
            setNewPhoneNumber('')

        }
        setNotifMessage(null)

    }

    const filterPersons = persons.filter(person => person.name.toLowerCase().startsWith(filter.trim()))
    return (
        <div>
            <h2>Phonebook</h2>
            <Filter filter={filter} setNewFilter={setNewFilter} />
            <h3>add a new person</h3>
            <NewPersonForm addToPhoneBook={addToPhoneBook} newName={newName} newPhoneNumber={newPhoneNumber} setNewName={setNewName} setNewPhoneNumber={setNewPhoneNumber} />

            <Notification message={notifMessage} />
            <h2>Numbers</h2>
            <Persons persons={filterPersons} setLastDeleted={setLastDeleted} />
        </div>
    )
}

export default App
