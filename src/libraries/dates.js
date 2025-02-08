const formatTimeMicroseconds = (time, format) => {
  const totalSeconds = Math.round(time / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor(totalSeconds / 60) % 60
  const seconds = totalSeconds % 60

  switch (format) {
    case 'elapsedTime':
      return `${hours > 0 ? hours+'h' : ''} ${minutes > 0 ? minutes+'m' : ''} ${seconds > 0 ? seconds + 's' : ''}`
      break
  }

}

export { formatTimeMicroseconds }
