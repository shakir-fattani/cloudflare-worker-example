const wrapper = (handlerFunc) => {
  return async (requestObject) => {
    try {
      return await handlerFunc(requestObject)
    } catch (error) {
      console.error(error)
      return new Response({
        status: 'fail',
        message: `something went wrong. Error: ${JSON.stringify(error)}`
      }, { status: 404 })
    }
  }
}

export default wrapper;
