const Header = ({ course }) => {
  return (
    <h2 >{course.name} </h2>
  )
}

const Content = ({ course }) => {
  return (
    <span>

      {course.parts.map(part => <Part coursePart={part} key={part.id} />)}
    </span>
  )
}

const Part = ({ coursePart }) => {
  return (<p>{coursePart.name} {coursePart.exercises}</p>)
}

const Total = ({ total }) => {
  return (<p>total of {total} exercises</p>)
}

const Course = ({ course }) => {
  const total = course.parts.reduce((s, p) =>
    s + p.exercises
    , 0)
  return (
    < >
      <Header course={course} />
      <Content course={course} />
      <Total total={total} />
    </>
  )
}

export default Course 
