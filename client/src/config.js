import transenv from 'transenv'

export default transenv()(({str, bool, num}) => {

  return {
    slack: {
      workspaceName: 'vacuumlabs',
    },
    tagCountLimit: 20,
  }
})
