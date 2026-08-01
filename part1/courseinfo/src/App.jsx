const Header = (course) => {
  return (
    <>
      <h1>{course.name}</h1>
    </>
  )
}

const Part = (exercise) => {
  return (
    <>
      <p>
        {exercise.name} {exercise.num_of_exercises}
      </p>
    </>
  )
}

const Content = ({ exercises }) => {
  return (
    <>

      <Part name={exercises[0].name} num_of_exercises={exercises[0].num_of_exercises} />
      <Part name={exercises[1].name} num_of_exercises={exercises[1].num_of_exercises} />
      <Part name={exercises[2].name} num_of_exercises={exercises[2].num_of_exercises} />

    </>
  )
}

const Total = (total) => {
  return (
    <>
      <p>Number of exercises {total.number}</p>
    </>
  )
}
const App = () => {
  const course = 'Half Stack application development'
  const exercises = [
    { name: 'Fundamentals of React', num_of_exercises: 10 },
    { name: 'Using props to pass data', num_of_exercises: 7 },
    { name: 'State of a component', num_of_exercises: 14 }
  ]
  return (
    <div>
      <Header name={course} />
      <Content exercises={exercises} />
      <Total number={exercises[0].num_of_exercises + exercises[1].num_of_exercises + exercises[2].num_of_exercises} />

    </div>
  )
}

export default App
