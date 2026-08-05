const Notfication = ({ message }) => {
  if (message === null) {
    return null
  }
  const [type, returnMessage] = message.split(': ')

  return (
    <div className={type}>
      {returnMessage}
    </div>
  )
}

export default Notfication
