const http = require('./app');
const socketIo = require('socket.io');
const io = socketIo(http);


const socketIdMap = {};

function emitSamePageViewerCount() {
  const countByUrl = Object.values(socketIdMap).reduce((value, url) => {
    return {
      ...value,
      [url]: value[url] ? value[url] + 1 : 1,
    };
  }, {});

  for (const [socketId, url] of Object.entries(socketIdMap)) {
    const count = countByUrl[url];
    io.to(socketId).emit('SAME_PAGE_VIEWER_COUNT', count); // 특정 소켓 아이디 하나로 emit을 보낼때 쓰는 메소드
  }
}

io.on('connection', (socket) => {
  socketIdMap[socket.id] = null;
  console.log('누군가 연결했어요!');

  socket.on('CHANGED_PAGE', (data) => {
    console.log('페이지가 바뀌었대요', data, socket.id);
    socketIdMap[socket.id] = data;

    emitSamePageViewerCount();
  });

  socket.on('BUY', (data) => {
    const payload = {
      nickname: data.nickname,
      goodsId: data.goodsId,
      goodsName: data.goodsName,
      date: new Date().toISOString(),
    };
    console.log('클라이언트가 구매한 데이터', data, new Date());
    socket.broadcast.emit('BUY_GOODS', payload); // 내 소켓 빼고 모든 사람한테 보냄 // io는 모든 소켓을 관리해주는 관리자 io.emit("BUY_GOODS", payload) // 모든 애들한테 보냄 // 소켓은 연결구이다. 한브라우저에서도 여러개 생길 수 있다. 만들기 나름이다. 연결구에 불과 하므로 같은 로그인 계정이도 소켓이 다ㅡㄹ ㄹ수 ㅣㅇㅆ음.
  });

  socket.on('disconnect', () => {
    delete socketIdMap[socket.id];
    console.log('누군가 연결을 끊었어요!');
    emitSamePageViewerCount();
  });
});