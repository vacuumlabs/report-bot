import transenv from 'transenv'

export default transenv()(({str, bool, num}) => {

  return {
    slack: {
      team: 'T026LE24D',
    },
  }
})
