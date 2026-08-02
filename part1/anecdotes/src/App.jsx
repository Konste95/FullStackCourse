import { useState } from 'react'

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

function getMaxInd(arr) {
  const maxVal = Math.max(...arr)
  console.log(maxVal)
  for (const val in arr) {
    if (arr[val] == maxVal) {
      return val
    }
  }
}

const Button = ({ onClick, text }) => {


  return (
    <button onClick={onClick}>{text}</button>

  )
}

const Header = ({ text }) => {
  return (<h1>{text}</h1>)
}

const AnecdoteInfo = ({ anecdote, numOfVotes }) => {
  return (<>
    <p>{anecdote}</p>
    <p>This anecdote has {numOfVotes} votes</p>

  </>)
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVote] = useState(
    Array(anecdotes.length).fill(0)
  )

  const generateAnecdote = () => {
    setSelected(getRandomIntInclusive(0, anecdotes.length))
  }
  const copy = [...votes]

  const adjustVote = () => {
    copy[selected] += 1
    setVote(copy)
  }
  console.log(copy)

  console.log(selected)
  return (
    <div>
      <Header text='Anecdote of the day' />
      <Button onClick={generateAnecdote} text='Next Anecdote' />
      <Button onClick={adjustVote} text='Vote' />

      <AnecdoteInfo anecdote={anecdotes[selected]} numOfVotes={copy[selected]} />
      <Header text='Anecdote with most votes' />
      <AnecdoteInfo anecdote={anecdotes[getMaxInd(copy)]} numOfVotes={copy[getMaxInd(copy)]} />
      <p></p>

    </div>
  )
}

export default App
