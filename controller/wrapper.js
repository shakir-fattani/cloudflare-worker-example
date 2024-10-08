const wrapper = (handlerFunc) => {
  return async (requestObject) => {
    try {
      const response = await handlerFunc(requestObject)
      if (response instanceof Response) {
        return response;
      }
      return new Response(JSON.stringify(response), {
        status: 200, 
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      console.error(error)
      return new Response(JSON.stringify({
        status: 'fail',
        message: `something went wrong.`,
        url: requestObject.request.url,
        error,
      }), { status: 500, headers: { 'Content-Type': 'application/json' } })
    }
  }
}

export default wrapper;
