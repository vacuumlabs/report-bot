import transenv from 'transenv'

export default transenv()(({str, bool, num}) => {

  return {
    slack: {
      workspaceName: 'vacuumlabs',
      team: 'T026LE24D',
    },
    tagCountLimit: 20,
  }
})
