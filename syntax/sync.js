var fs = require('fs');

/*
//readfilesync

console.log('A');
var result = fs.readFileSync('syntax/sample.txt', 'utf8');
console.log(result);
console.log('C');

*/

//readfile
console.log('A');
fs.readFile('syntax/sample.txt', 'utf8', function(err, result){//function의 첫번째 인자 err는
                                                              //에러라면 err가 나오고 잘 실행된다면 result로 값을 받아오겠다는 뜻
  console.log(result);
});
console.log('C');
