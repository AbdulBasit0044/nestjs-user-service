// for exporting user.proto, so other libs can use it as a lib.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

const PROTO_PATH = path.join(__dirname, './user.proto')
module.exports = PROTO_PATH
