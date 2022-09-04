const http = require('./app');
require('./socket');

http.listen(8000, () => {
  console.log('서버가 요청을 받을 준비가 됐어요');
});
