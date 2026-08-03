import { useState } from 'react'
import { useEffect } from 'react'

import axios from 'axios'

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
    return (<li>{person.name} {person.number}</li>)
}

const App = () => {


    const [newName, setNewName] = useState('')
    const [persons, setPersons] = useState([])
    const [newPhoneNumber, setNewPhoneNumber] = useState('')
    const [filter, setNewFilter] = useState('')
    useEffect(() => {
        console.log('effect')
        axios
            .get('http://localhost:3001/persons')
            .then(response => {
                setPersons(response.data)
            })
    }, [])


    const addToPhoneBook = (event) => {
        event.preventDefault()
        if (persons.map(person => person.name).includes(newName)) {
            window.alert(`This name (${newName}) has already been added to the Phone Book`)
        }
        const newPerson = {
            name: newName,
            number: newPhoneNumber,
            id: persons.length + 1
        }
        setPersons(persons.concat(newPerson))
        setNewName('')
        setNewPhoneNumber('')

    }


    console.log(persons)
    const filterPersons = persons.filter(person => person.name.toLowerCase().startsWith(filter))

    console.log(filterPersons)
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
