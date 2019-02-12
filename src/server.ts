import config from "./util/config";

import app from "./app";

const PORT = config.server.port;

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
