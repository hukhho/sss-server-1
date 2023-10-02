export function customMiddleware(req, res, next) {
    console.log("test: ", req)
    res.json({
      message: "customMiddleware",
    })
    next()
}