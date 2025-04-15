// tests/server.js
import {setupServer} from 'msw/node'
import {rest} from 'msw'

// /greeting et /post/:id
export const handlers = [
  rest.post('/greeting', (req, res, ctx) =>
    res(ctx.json({data: {greeting: `Hello ${req.body.subject}`}})),
  ),
  rest.post('/post/:id', (req, res, ctx) => {
    if (!req.body.title) {
      return res(
        ctx.status(400),
        ctx.json({
          errorMessage: 'Format invalide, veuillez renseigner le titre',
        }),
      )
    }
    return res(ctx.json({data: req.body}))
  }),
  // API submitForm
  rest.post('/form', (req, res, ctx) => {
    const {food, drink} = req.body
    // food et drink
    if (!food || !drink) {
      return res(
        ctx.status(400),
        ctx.json({message: 'les champs food et drink sont obligatoires'}),
      )
    }
    return res(ctx.json({success: true}))
  }),
]

export const server = setupServer(...handlers)
