import {Application, Router} from '@oak/oak'
import app from "./inter/http/mod.ts"

await app.listen({port: 8000}, () => console.log('Server listening on port 8000'))
